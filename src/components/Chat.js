import React, { useEffect, useState } from "react";
import { useRef } from "react";

const ChatComponent = ({ chatToken, chattingRoomId }) => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [socket, setSocket] = useState(null);
  const tokenString = chatToken;

  useEffect(() => {
    console.log("chatToken", chatToken);
    console.log("chattingRommId", chattingRoomId);
    const chattingRoomIdString = chattingRoomId;
    const accessToken = localStorage.getItem("accessToken");
    const newSocket = new WebSocket(
      `ws://localhost:8082/chat/${chattingRoomIdString}/${tokenString}`
    );
    setSocket(newSocket);
    newSocket.onopen = () => {
      console.log("웹소켓 연결됨");
    };

    newSocket.onmessage = (event) => {
      console.log(event.data);
      const receiveData = event.data.split(":");
      const from = receiveData[0];
      const message = receiveData.slice(1).join(":").trim();
      setMessages((prevMessages) => [...prevMessages, { from, message }]);
    };

    // newSocket.onclose = () => {
    //   console.log("웹소켓 연결 종료");
    //   // 연결 종료 시 재연결 시도
    //   setTimeout(async () => {
    //     console.log("accessToken", accessToken);
    //     const response = await fetch("http://localhost:8081/api/auth/chat", {
    //       method: "POST",
    //       headers: {
    //         Authorization: accessToken,
    //       },
    //     });

    //     // 응답에서 토큰 추출
    //     const tokenString = response.data.chatToken;
    //     const reconnectSocket = new WebSocket(
    //       `ws://localhost:8082/chat/${chattingRoomIdString}/${tokenString}`
    //     );
    //     reconnectSocket.onopen = () => {
    //       console.log("웹소켓 재연결됨");
    //       setSocket(reconnectSocket);
    //     };

    //     reconnectSocket.onmessage = (event) => {
    //       console.log(event.data);
    //       const receiveData = event.data.split(":");
    //       const from = receiveData[0];
    //       const message = receiveData.slice(1).join(":").trim();
    //       setMessages((prevMessages) => [...prevMessages, { from, message }]);
    //     };
    //   }, 6000); // 6초 후 재연결 시도
    // };

    // return () => {
    //   newSocket.close();
    // };
  }, []);

  const sendMessage = () => {
    if (inputMessage.trim() === "") return;

    socket.send(inputMessage);
    setInputMessage("");
  };

  return (
    <div>
      <div>
        {messages.map((message, index) => (
          <div key={index}>
            <strong>{message.from}: </strong>
            <span>{message.message}</span>
          </div>
        ))}
      </div>
      <div>
        <input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
        />
        <button onClick={sendMessage}>전송</button>
      </div>
    </div>
  );
};

export default ChatComponent;
