import {
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  FiArrowLeft,
  FiMessageCircle,
  FiSend,
  FiX,
} from "react-icons/fi";
import { UserContext } from "../../contexts/UserContext";
import { authApi } from "../../utils/api";
import "./ChatWindow.css";

const CHAT_API = "http://localhost:8080/chat";

const getSenderId = (message) => {
  if (!message) {
    return null;
  }

  if (typeof message.senderId === "object") {
    return message.senderId?.id;
  }

  return message.senderId;
};

function ChatWindow({
  room,
  stompClient,
  connected,
  onBack,
  onClose,
  onRoomRead,
}) {
  const { currentUser } = useContext(UserContext);

  const [messages, setMessages] = useState([]);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const messagesEndRef = useRef(null);
  const onRoomReadRef = useRef(onRoomRead);

  useEffect(() => {
    onRoomReadRef.current = onRoomRead;
  }, [onRoomRead]);

  const scrollToBottom = () => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({
        behavior: "smooth",
      });
    }, 50);
  };

  useEffect(() => {
    if (!room?.roomId || !currentUser?.id) {
      return;
    }

    let cancelled = false;

    const loadMessages = async () => {
      const token = localStorage.getItem("access-token");

      if (!token) {
        setError("Không tìm thấy token đăng nhập.");
        return;
      }

      try {
        setLoading(true);
        setError("");

        const response = await authApi(token).get(
          `${CHAT_API}/rooms/${room.roomId}/messages`
        );

        if (cancelled) {
          return;
        }

        console.log("CHAT MESSAGES:", response.data);

        const data = Array.isArray(response.data)
          ? response.data
          : [];

        setMessages(data);

        try {
          await authApi(token).put(
            `${CHAT_API}/rooms/${room.roomId}/read/${currentUser.id}`
          );

          if (cancelled) {
            return;
          }

          setMessages((previousMessages) =>
            previousMessages.map((message) => {
              const senderId = getSenderId(message);

              if (senderId !== currentUser.id) {
                return {
                  ...message,
                  isRead: true,
                };
              }

              return message;
            })
          );

          onRoomReadRef.current?.(room.roomId);
        } catch (readError) {
          console.error(
            "MARK READ ERROR:",
            readError.response?.data || readError
          );
        }
      } catch (loadError) {
        if (cancelled) {
          return;
        }

        console.error(
          "LOAD MESSAGES ERROR:",
          loadError.response?.data || loadError
        );

        setMessages([]);

        setError(
          loadError.response?.data?.message ||
            "Không thể tải tin nhắn."
        );
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadMessages();

    return () => {
      cancelled = true;
    };
  }, [room?.roomId, currentUser?.id]);

  useEffect(() => {
    if (!room?.roomId) {
      return;
    }

    if (!currentUser?.id) {
      return;
    }

    if (!connected) {
      return;
    }

    if (!stompClient) {
      return;
    }

    if (!stompClient.connected) {
      return;
    }

    console.log(
      "SUBSCRIBE:",
      `/topic/room/${room.roomId}`
    );

    const subscription = stompClient.subscribe(
      `/topic/room/${room.roomId}`,
      (frame) => {
        try {
          const newMessage = JSON.parse(frame.body);

          console.log(
            "RECEIVE MESSAGE:",
            newMessage
          );

          setMessages((previousMessages) => {
            if (
              newMessage.id !== undefined &&
              newMessage.id !== null
            ) {
              const exists = previousMessages.some(
                (message) =>
                  message.id === newMessage.id
              );

              if (exists) {
                return previousMessages;
              }
            }

            return [
              ...previousMessages,
              newMessage,
            ];
          });

          const senderId =
            getSenderId(newMessage);

          if (senderId !== currentUser.id) {
            const token =
              localStorage.getItem(
                "access-token"
              );

            if (token) {
              authApi(token)
                .put(
                  `${CHAT_API}/rooms/${room.roomId}/read/${currentUser.id}`
                )
                .then(() => {
                  setMessages(
                    (previousMessages) =>
                      previousMessages.map(
                        (message) => {
                          const id =
                            getSenderId(
                              message
                            );

                          if (
                            id !==
                            currentUser.id
                          ) {
                            return {
                              ...message,
                              isRead: true,
                            };
                          }

                          return message;
                        }
                      )
                  );

                  onRoomReadRef.current?.(
                    room.roomId
                  );
                })
                .catch(
                  (readError) => {
                    console.error(
                      "REALTIME READ ERROR:",
                      readError
                        .response?.data ||
                        readError
                    );
                  }
                );
            }
          }
        } catch (socketError) {
          console.error(
            "WEBSOCKET MESSAGE ERROR:",
            socketError
          );
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [
    connected,
    stompClient,
    room?.roomId,
    currentUser?.id,
  ]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = () => {
    const value = content.trim();

    if (!value) {
      return;
    }

    if (!currentUser?.id) {
      setError(
        "Không tìm thấy người dùng."
      );
      return;
    }

    if (!room?.roomId) {
      setError(
        "Không tìm thấy phòng chat."
      );
      return;
    }

    if (!room?.userId) {
      console.error(
        "ROOM KHÔNG CÓ userId:",
        room
      );

      setError(
        "Không tìm thấy người nhận."
      );
      return;
    }

    if (
      !stompClient ||
      !connected ||
      !stompClient.connected
    ) {
      setError(
        "WebSocket chưa kết nối."
      );
      return;
    }

    const request = {
      chatRoomId: room.roomId,
      senderId: currentUser.id,
      receiverId: room.userId,
      content: value,
    };

    console.log(
      "SEND MESSAGE:",
      request
    );

    try {
      stompClient.publish({
        destination: "/app/chat/send",
        body: JSON.stringify(request),
      });

      setContent("");
      setError("");
    } catch (sendError) {
      console.error(
        "SEND MESSAGE ERROR:",
        sendError
      );

      setError(
        "Không thể gửi tin nhắn."
      );
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    handleSendMessage();
  };

  const handleKeyDown = (event) => {
    if (
      event.key === "Enter" &&
      !event.shiftKey
    ) {
      event.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (value) => {
    if (!value) {
      return "";
    }

    const date = new Date(value);

    if (
      Number.isNaN(
        date.getTime()
      )
    ) {
      return "";
    }

    return date.toLocaleTimeString(
      "vi-VN",
      {
        hour: "2-digit",
        minute: "2-digit",
      }
    );
  };

  const avatarLetter =
    room?.name
      ?.charAt(0)
      ?.toUpperCase() ||
    "U";

  const getRoleName = () => {
    switch (room?.role) {
      case "STUDENT":
        return "Sinh viên";

      case "EMPLOYER":
        return "Nhà tuyển dụng";

      case "LECTURER":
        return "Giảng viên";

      default:
        return "Người dùng";
    }
  };

  return (
    <div className="chat-window">
      <div className="chat-window-header">
        <button
          type="button"
          className="chat-window-back"
          onClick={onBack}
        >
          <FiArrowLeft />
        </button>

        <div className="chat-window-user">
          <div className="chat-window-user-avatar">
            {room?.avatarUrl ? (
              <img
                src={room.avatarUrl}
                alt={
                  room.name ||
                  "Avatar"
                }
              />
            ) : (
              <span>
                {avatarLetter}
              </span>
            )}
          </div>

          <div className="chat-window-user-info">
            <strong>
              {room?.name ||
                "Người dùng"}
            </strong>

            <div className="chat-window-status">
              <span
                className={
                  connected
                    ? "chat-status-dot online"
                    : "chat-status-dot"
                }
              />

              <span>
                {connected
                  ? getRoleName()
                  : "Đang kết nối..."}
              </span>
            </div>
          </div>
        </div>

        <button
          type="button"
          className="chat-window-close"
          onClick={onClose}
        >
          <FiX />
        </button>
      </div>

      <div className="chat-window-body">
        {loading ? (
          <div className="chat-window-state">
            <div className="chat-window-spinner" />
            <span>
              Đang tải tin nhắn...
            </span>
          </div>
        ) : error &&
          messages.length === 0 ? (
          <div className="chat-window-state chat-window-error">
            <span>
              {error}
            </span>
          </div>
        ) : messages.length === 0 ? (
          <div className="chat-window-empty">
            <div className="chat-window-empty-icon">
              <FiMessageCircle />
            </div>

            <strong>
              Chưa có tin nhắn
            </strong>

            <span>
              Bắt đầu trò chuyện với{" "}
              {room?.name ||
                "người dùng này"}
            </span>
          </div>
        ) : (
          messages.map(
            (message, index) => {
              const senderId =
                getSenderId(
                  message
                );

              const isMine =
                senderId ===
                currentUser?.id;

              return (
                <div
                  key={
                    message.id ??
                    `${senderId}-${index}`
                  }
                  className={
                    isMine
                      ? "chat-message-row mine"
                      : "chat-message-row other"
                  }
                >
                  {!isMine && (
                    <div className="chat-message-avatar">
                      {room?.avatarUrl ? (
                        <img
                          src={
                            room.avatarUrl
                          }
                          alt={
                            room.name ||
                            ""
                          }
                        />
                      ) : (
                        <span>
                          {
                            avatarLetter
                          }
                        </span>
                      )}
                    </div>
                  )}

                  <div className="chat-message-content">
                    <div className="chat-message-bubble">
                      {
                        message.content
                      }
                    </div>

                    <div className="chat-message-meta">
                      <span>
                        {formatTime(
                          message.createdDate
                        )}
                      </span>

                      {isMine && (
                        <span>
                          {message.isRead
                            ? "Đã xem"
                            : "Đã gửi"}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            }
          )
        )}

        <div ref={messagesEndRef} />
      </div>

      {error &&
        messages.length > 0 && (
          <div className="chat-window-small-error">
            {error}
          </div>
        )}

      <form
        className="chat-window-footer"
        onSubmit={handleSubmit}
      >
        <div className="chat-window-input-wrapper">
          <textarea
            rows={1}
            value={content}
            placeholder={
              connected
                ? "Nhập tin nhắn..."
                : "Đang kết nối..."
            }
            onChange={(event) => {
              setContent(
                event.target.value
              );
            }}
            onKeyDown={
              handleKeyDown
            }
          />

          <button
            type="submit"
            className="chat-send-button"
            disabled={
              !content.trim() ||
              !connected
            }
          >
            <FiSend />
          </button>
        </div>
      </form>
    </div>
  );
}

export default ChatWindow;