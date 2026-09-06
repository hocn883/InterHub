import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { FiMessageCircle, FiX } from "react-icons/fi";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { authApi } from "../../utils/api";
import ChatWindow from "./ChatWindow";
import "./ChatBubble.css";
const CHAT_API = "https://interhub1611.onrender.com/chat";
const WS_URL = "https://interhub1611.onrender.com/ws";
const CHAT_BUBBLE_OWNER_KEY = "__INTERHUB_CHAT_BUBBLE_OWNER__";
function ChatBubble({ currentUser }) {
  const [opened, setOpened] = useState(false);
  const [rooms, setRooms] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [connected, setConnected] = useState(false);
  const [loading, setLoading] = useState(false);
  const instanceIdRef = useRef(`chat-${Date.now()}-${Math.random()}`);
  const [isPrimary, setIsPrimary] = useState(false);
  const clientRef = useRef(null);
  const selectedRoomRef = useRef(null);
  useEffect(() => {
    const instanceId = instanceIdRef.current;
    const claimOwnership = () => {
      if (!window[CHAT_BUBBLE_OWNER_KEY]) {
        window[CHAT_BUBBLE_OWNER_KEY] = instanceId;
        setIsPrimary(true);
        return;
      }
      if (window[CHAT_BUBBLE_OWNER_KEY] === instanceId) {
        setIsPrimary(true);
        return;
      }
      setIsPrimary(false);
      console.warn("ChatBubble đang bị render nhiều hơn 1 lần.");
    };
    const handleOwnerReleased = () => {
      claimOwnership();
    };
    claimOwnership();
    window.addEventListener("interhub-chat-owner-released", handleOwnerReleased);
    return () => {
      window.removeEventListener("interhub-chat-owner-released", handleOwnerReleased);
      if (window[CHAT_BUBBLE_OWNER_KEY] === instanceId) {
        delete window[CHAT_BUBBLE_OWNER_KEY];
        window.dispatchEvent(new Event("interhub-chat-owner-released"));
      }
    };
  }, []);
  useEffect(() => {
    selectedRoomRef.current = selectedRoom;
  }, [selectedRoom]);
  const loadRooms = useCallback(async () => {
    if (!currentUser?.id) {
      return [];
    }
    const token = localStorage.getItem("access-token");
    if (!token) {
      console.error("Không tìm thấy access-token");
      return [];
    }
    try {
      setLoading(true);
      const response = await authApi(token).get(`${CHAT_API}/rooms/user/${currentUser.id}`);
      const data = Array.isArray(response.data) ? response.data : [];
      setRooms(data);
      return data;
    } catch (error) {
      console.error("LOAD CHAT ROOMS ERROR:", error.response?.data || error);
      return [];
    } finally {
      setLoading(false);
    }
  }, [currentUser?.id]);
  useEffect(() => {
    if (!isPrimary || !currentUser?.id) {
      return;
    }
    loadRooms();
  }, [isPrimary, currentUser?.id, loadRooms]);
  useEffect(() => {
    if (!isPrimary || !currentUser?.id) {
      return;
    }
    const client = new Client({
      webSocketFactory: () => new SockJS(WS_URL),
      reconnectDelay: 5000,
      debug: () => {},
    });
    client.onConnect = () => {
      setConnected(true);
      console.log("CHAT WEBSOCKET CONNECTED");
      client.subscribe(`/topic/user/${currentUser.id}`, (frame) => {
        try {
          const message = JSON.parse(frame.body);
          console.log("USER MESSAGE:", message);
          const roomId = Number(message.chatRoomId);
          if (Number.isNaN(roomId)) {
            return;
          }
          const currentRoom = selectedRoomRef.current;
          setRooms((previousRooms) => {
            const exists = previousRooms.some((room) => Number(room.roomId) === roomId);
            if (!exists) {
              setTimeout(() => {
                loadRooms();
              }, 0);
              return previousRooms;
            }
            return previousRooms.map((room) => {
              if (Number(room.roomId) !== roomId) {
                return room;
              }
              const isCurrentRoom = Number(currentRoom?.roomId) === roomId;
              return {
                ...room,
                lastMessage: message.content,
                lastMessageTime: message.createdDate,
                unreadCount: isCurrentRoom ? 0 : Number(room.unreadCount || 0) + 1,
              };
            }).sort((first, second) => {
              const firstTime = first.lastMessageTime ? new Date(first.lastMessageTime).getTime() : 0;
              const secondTime = second.lastMessageTime ? new Date(second.lastMessageTime).getTime() : 0;
              return secondTime - firstTime;
            });
          });
        } catch (error) {
          console.error("USER SOCKET ERROR:", error);
        }
      });
    };
    client.onDisconnect = () => {
      setConnected(false);
    };
    client.onWebSocketClose = () => {
      setConnected(false);
    };
    client.onStompError = (frame) => {
      console.error("STOMP ERROR:", frame.headers["message"], frame.body);
    };
    client.activate();
    clientRef.current = client;
    return () => {
      setConnected(false);
      client.deactivate();
      clientRef.current = null;
    };
  }, [isPrimary, currentUser?.id, loadRooms]);
  useEffect(() => {
    if (!isPrimary) {
      return;
    }
    const handleExternalOpenRoom = async (event) => {
      const roomId = Number(event.detail?.roomId);
      if (!roomId || Number.isNaN(roomId)) {
        console.error("Không có roomId để mở");
        return;
      }
      console.log("OPEN ROOM FROM PAGE:", roomId);
      const latestRooms = await loadRooms();
      const targetRoom = latestRooms.find((room) => Number(room.roomId) === roomId);
      if (!targetRoom) {
        console.error("Không tìm thấy room:", roomId);
        return;
      }
      selectedRoomRef.current = targetRoom;
      setSelectedRoom(targetRoom);
      setOpened(true);
      setRooms(latestRooms.map((room) => Number(room.roomId) === roomId ? {
        ...room,
        unreadCount: 0,
      } : room));
    };
    window.addEventListener("open-chat-room", handleExternalOpenRoom);
    return () => {
      window.removeEventListener("open-chat-room", handleExternalOpenRoom);
    };
  }, [isPrimary, loadRooms]);
  const totalUnread = useMemo(() => {
    return rooms.reduce((total, room) => total + Number(room.unreadCount || 0), 0);
  }, [rooms]);
  const handleOpenBubble = () => {
    setOpened((previousOpened) => {
      const nextOpened = !previousOpened;
      if (!nextOpened) {
        selectedRoomRef.current = null;
        setSelectedRoom(null);
      }
      return nextOpened;
    });
  };
  const handleOpenRoom = (room) => {
    selectedRoomRef.current = room;
    setSelectedRoom(room);
    setRooms((previousRooms) => previousRooms.map((item) => Number(item.roomId) === Number(room.roomId) ? {
      ...item,
      unreadCount: 0,
    } : item));
  };
  const handleBack = () => {
    selectedRoomRef.current = null;
    setSelectedRoom(null);
    loadRooms();
  };
  const handleClose = () => {
    selectedRoomRef.current = null;
    setSelectedRoom(null);
    setOpened(false);
  };
  const handleRoomRead = (roomId) => {
    setRooms((previousRooms) => previousRooms.map((room) => Number(room.roomId) === Number(roomId) ? {
      ...room,
      unreadCount: 0,
    } : room));
  };
  const formatTime = (date) => {
    if (!date) {
      return "";
    }
    const value = new Date(date);
    if (Number.isNaN(value.getTime())) {
      return "";
    }
    return value.toLocaleTimeString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };
  if (!currentUser || !isPrimary) {
    return null;
  }
  return (
    <div className="chat-bubble-wrapper">
      {opened && (
        <div className="chat-popup" style={{ position: "absolute" }}>
          {selectedRoom ? (
            <ChatWindow
              room={selectedRoom}
              currentUser={currentUser}
              stompClient={clientRef.current}
              connected={connected}
              onBack={handleBack}
              onClose={handleClose}
              onRoomRead={handleRoomRead}
            />
          ) : (
            <>
              <div className="chat-popup-header">
                <h2>Tin nhắn</h2>
                <button type="button" onClick={handleClose}>
                  <FiX />
                </button>
              </div>
              <div className="chat-room-list">
                {loading ? (
                  <div className="chat-room-state">Đang tải...</div>
                ) : rooms.length === 0 ? (
                  <div className="chat-room-state">Chưa có cuộc trò chuyện</div>
                ) : (
                  rooms.map((room) => (
                    <button key={room.roomId} type="button" className="chat-room-item" onClick={() => handleOpenRoom(room)}>
                      <div className="chat-room-avatar">
                        {room.avatarUrl ? (
                          <img src={room.avatarUrl} alt={room.name || ""} />
                        ) : (
                          <span>{room.name?.charAt(0)?.toUpperCase() || "U"}</span>
                        )}
                      </div>
                      <div className="chat-room-content">
                        <div className="chat-room-top">
                          <strong>{room.name || "Người dùng"}</strong>
                          <span>{formatTime(room.lastMessageTime)}</span>
                        </div>
                        <div className="chat-room-bottom">
                          <span>{room.lastMessage || "Bắt đầu trò chuyện"}</span>
                          {Number(room.unreadCount) > 0 && <b>{room.unreadCount}</b>}
                        </div>
                      </div>
                    </button>
                  ))
                )}
              </div>
            </>
          )}
        </div>
      )}
      <button type="button" className="chat-main-bubble" onClick={handleOpenBubble}>
        {opened ? <FiX /> : <FiMessageCircle />}
        {!opened && totalUnread > 0 && (
          <span className="chat-main-badge">{totalUnread > 99 ? "99+" : totalUnread}</span>
        )}
      </button>
    </div>
  );
}
export default ChatBubble;