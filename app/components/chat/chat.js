import { useEffect, useState, useContext } from "react";
import { AuthContext } from "@/app/context/Auth";
import "./chat.css";

export default function Chat({ sender, receiver }) {
  const [socket, setSocket] = useState(null);
  const [message, setMessage] = useState("");
  const [chatMessages, setChatMessages] = useState([]);

  const { tokens } = useContext(AuthContext);

  useEffect(() => {
    console.log(tokens);
    console.log("user id", tokens.user.id);

    const ws = new WebSocket("ws://localhost:8000/ws/chat/default/");

    ws.onopen = () => {
      console.log("WebSocket connected");
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        console.log("Received message:", data);
        setChatMessages((prevMessages) => [...prevMessages, data]);
      } catch (e) {
        console.error("Error parsing WebSocket message:", e);
      }
    };

    ws.onclose = () => {
      console.log("WebSocket disconnected");
    };

    setSocket(ws);

    return () => {
      ws.close();
    };
  }, []);

  const sendMessage = () => {
    if (socket && message) {
      const sender_id = tokens.user.id;
      const msg = { sender_id: sender_id, message };

      console.log("Sending message:", msg);
      socket.send(JSON.stringify(msg));
      setMessage(""); // clear input after sending
    }
  };

  // Start Handling Chat Box Appearance
  const [isChatBoxActive, setIsChatBoxActive] = useState(false);

  const handleChatIconClick = () => {
    setIsChatBoxActive(true);
  };

  const handleCloseIconClick = () => {
    setIsChatBoxActive(false);
  };

  return (
    <>
      <i
        className={`ri-chat-smile-3-fill chat-icon ${
          isChatBoxActive ? "" : "active"
        }`}
        onClick={handleChatIconClick}
      ></i>
      <div className={`chat-box ${isChatBoxActive ? "active" : ""}`}>
        <div className="chat-header">
          <span>
            <i className="ri-message-3-line"></i>
          </span>
          <i
            className={`ri-close-line close-icon`}
            onClick={handleCloseIconClick}
          ></i>
        </div>
        <div className="message-box">
          {chatMessages.map((msg, index) => (
            <div
              key={index}
              className={`message ${
                msg.sender_id === tokens.user.id ? "bg-blue-500" : ""
              }`}
            >
              <div className="message-sender">
                {/* {tokens.user.username} */}
              </div>
              <div className="message-content">{msg.message}</div>
            </div>
          ))}
        </div>
        <div className="entry-field-parent">
          <div className="entry-field">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type a message..."
              className=""
            />
            <button onClick={sendMessage}>
              <i className="ri-send-plane-2-fill"></i>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
