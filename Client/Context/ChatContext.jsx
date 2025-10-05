import { createContext, useContext, useEffect, useState } from "react";
import { AuthContext } from "./AuthContext";
import toast from "react-hot-toast";

export const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const [messages, setMessages] = useState([]); // messages of current conversation
  const [users, setUsers] = useState([]); // sidebar users
  const [selectedUser, setSelectedUser] = useState(null);
  const [unseenMessages, setUnseenMessages] = useState({});

  const { socket, axios, authUser } = useContext(AuthContext);

  const getUsers = async () => {
    try {
      const { data } = await axios.get("/api/messages/users");
      if (data.success) {
        setUsers(data.users || []);
        setUnseenMessages(data.unseenMessages || {});
      }
    } catch (err) {
      toast.error(err.message || "Failed to load users");
    }
  };

  const getMessages = async (userId) => {
    try {
      if (!userId) return;
      const { data } = await axios.get(`/api/messages/${userId}`);
      if (data.success) {
        setMessages(data.messages || []);
        // mark messages as seen on server
        await axios.post(`/api/messages/mark-seen/${userId}`);
        setUnseenMessages((prev) => ({ ...prev, [userId]: 0 }));
      }
    } catch (err) {
      toast.error(err.message || "Failed to load messages");
    }
  };

  const sendMessage = async ({ to, text }) => {
    try {
      const { data } = await axios.post("/api/messages/send", { to, text });
      if (data.success) {
        // push to messages and emit via socket
        setMessages((prev) => [...prev, data.message]);
        if (socket) socket.emit("send-message", data.message);
      }
    } catch (err) {
      toast.error(err.message || "Send failed");
    }
  };

  useEffect(() => {
    getUsers();
    // listen for incoming messages on socket
    if (!socket) return;
    const handler = (message) => {
      // if message belongs to current selected user, append; else update unseen
      if (selectedUser && message.from === selectedUser._id) {
        setMessages((prev) => [...prev, message]);
      } else {
        setUnseenMessages((prev) => ({
          ...prev,
          [message.from]: (prev[message.from] || 0) + 1,
        }));
      }
    };
    socket.on("receive-message", handler);
    return () => {
      socket.off("receive-message", handler);
    };
  }, [socket, selectedUser]);

  const value = {
    messages,
    users,
    selectedUser,
    unseenMessages,
    setUnseenMessages,
    setSelectedUser,
    getUsers,
    getMessages,
    sendMessage,
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};
