import React, { useContext, useState, useEffect } from "react";
import assets from "../assets/assets.js";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext.jsx";
import { ChatContext } from "../../context/ChatContext.jsx";

const Sidebar = () => {
  const { getUsers, users, selectedUser, setSelectedUser, unseenMessages, setUnseenMessages } = useContext(ChatContext);
  const { logout, onlineUsers, authUser } = useContext(AuthContext);
  const [input, setInput] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    getUsers();
    // eslint-disable-next-line
  }, []);

  const handleSelect = (user) => {
    setSelectedUser(user);
    setUnseenMessages((prev) => ({ ...prev, [user._id]: 0 }));
    navigate(`/chat/${user._id}`);
  };

  return (
    <div className="w-full max-w-[320px] p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <img src={authUser?.profilePic || assets.avatar_icon} alt="me" className="w-10 h-10 rounded-full" />
          <div>
            <p className="font-semibold">{authUser?.fullName || "You"}</p>
            <p className="text-xs text-neutral-400">Chats</p>
          </div>
        </div>
        <button onClick={logout} className="text-sm">Logout</button>
      </div>

      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Search users..."
        className="w-full p-2 rounded mb-3 border"
      />

      <div className="flex flex-col gap-2">
        {users.map((user) => (
          <div
            key={user._id}
            onClick={() => handleSelect(user)}
            className={`relative p-2 rounded cursor-pointer ${selectedUser?._id === user._id ? "bg-[#f0f0f0]" : ""}`}
          >
            <div className="flex items-center gap-3">
              <img src={user?.profilePic || assets.avatar_icon} alt="avatar" className="w-9 h-9 rounded-full" />
              <div className="flex-1">
                <p className="font-medium">{user.fullName}</p>
                <p className="text-xs text-neutral-500">{onlineUsers.includes(user._id) ? "Online" : "Offline"}</p>
              </div>
              {unseenMessages[user._id] > 0 && (
                <div className="min-w-[24px] h-6 flex items-center justify-center rounded-full bg-violet-500 text-white text-xs px-2">
                  {unseenMessages[user._id]}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
