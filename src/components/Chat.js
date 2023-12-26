import React, { useEffect, useState, useRef } from 'react';
import styled from 'styled-components';

const ChatContainer = styled.div`
  border: 1px solid #ccc;
  width: 99.7%;
  height: 100%;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
`;

const MessageContainer = styled.div`
  margin-bottom: 10px;
`;

const MessageBox = styled.div`
  overflow-y: auto;
`;

const Sender = styled.span`
  color: #c0c0c0;
  font-size: 1rem;
  padding-left: 5px;
  font-family: 'Gamja Flower', sans-serif;
`;

const SpanText = styled.span`
  font-size: 1.1rem;
  color: #666;
  font-family: 'Gamja Flower', sans-serif;
`;

const InputContainer = styled.div`
  margin-top: auto;
  border-top: 1px solid #333333;
  height: 8vh;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const TextInput = styled.input`
  border-radius: 10px;
  width: 70%;
  height: 10%;
  padding: 10px;
  margin-right: 5px;
`;

const SendButton = styled.button`
  font-family: 'Gamja Flower', sans-serif;
  border-radius: 10px;
  width: 20%;
  height: 50%;
  padding: 5px 10px;
  background-color: #f8de7e;
  color: #666;
  border: none;
  cursor: pointer;
`;

const ChatComponent = ({ channelId }) => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [socket, setSocket] = useState(null);
  const [roomId, setRoomId] = useState(channelId);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const roomId = 'abcde';
    const newSocket = new WebSocket(`ws://localhost:8082/chat/${roomId}`);
    setSocket(newSocket);

    newSocket.onopen = () => {
      console.log('웹소켓 연결됨');
    };

    newSocket.onmessage = (event) => {
      console.log(event.data);
      const receiveData = event.data.split(':');
      const from = receiveData[0];
      const message = receiveData.slice(1).join(':').trim();
      setMessages((prevMessages) => [...prevMessages, { from, message }]);
    };

    newSocket.onclose = () => {
      console.log('웹소켓 연결 종료');
      // 연결 종료 시 재연결 시도
      setTimeout(() => {
        const reconnectSocket = new WebSocket(
          `ws://localhost:8082/chat/${roomId}`
        );
        reconnectSocket.onopen = () => {
          console.log('웹소켓 재연결됨');
          setSocket(reconnectSocket);
        };

        reconnectSocket.onmessage = (event) => {
          console.log(event.data);
          const receiveData = event.data.split(':');
          const from = receiveData[0];
          const message = receiveData.slice(1).join(':').trim();
          setMessages((prevMessages) => [...prevMessages, { from, message }]);
        };
      }, 6000); // 6초 후 재연결 시도
    };

    return () => {
      newSocket.close();
    };
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages]);

  const sendMessage = () => {
    if (inputMessage.trim() === '' || !socket) return; // socket이 null일 때 함수 종료

    socket.send(inputMessage);
    setInputMessage('');
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      sendMessage();
    }
  };

  return (
    <ChatContainer>
      <MessageBox>
        {messages.map((message, index) => (
          <MessageContainer key={index}>
            <Sender>{message.from}: </Sender>
            <SpanText>{message.message}</SpanText>
          </MessageContainer>
        ))}
        <div ref={messagesEndRef} />
      </MessageBox>
      <InputContainer>
        <TextInput
          type='text'
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <SendButton onClick={sendMessage}>전송</SendButton>
      </InputContainer>
    </ChatContainer>
  );
};

export default ChatComponent;
