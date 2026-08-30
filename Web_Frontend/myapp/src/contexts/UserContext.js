import React, {
  createContext,
  useEffect,
  useState,
} from "react";

import api, {
  authApi,
  endpoints,
} from "../utils/api";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);

  const loadUser = async () => {
    try {
      const token = localStorage.getItem("access-token");

      if (!token) {
        setCurrentUser(null);
        return;
      }
      const response = await authApi(token).get(
        endpoints.currentUser
      );

      setCurrentUser(response.data.result);
    } catch (error) {
      console.error("Load user error:", error);

      // Token không hợp lệ
      localStorage.removeItem("access-token");

      setCurrentUser(null);
    }
  };

  useEffect(() => {
    loadUser();
  }, []);

  return (
    <UserContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        loadUser,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};