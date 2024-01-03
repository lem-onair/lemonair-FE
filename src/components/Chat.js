import React, { useEffect, useState, useRef, useCallback } from 'react';
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
  height: 72vh;
  overflow-y: scroll;
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

const ChatComponent = ({ chattingRoomId }) => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [socket, setSocket] = useState(null);
  const messagesEndRef = useRef(null);

  const chattingRoomIdString = chattingRoomId;
  const accessToken = localStorage.getItem('accessToken');
  const fetchToken = useCallback(async () => {
    try {
      console.log(accessToken);
      const response = await fetch('http://localhost:8081/api/auth/chat', {
        method: 'POST',
        headers: {
          Authorization: accessToken,
        },
      });
      if (!response.ok) {
        throw new Error('Network response was not ok.');
      }
      const data = await response.json();
      console.log('서버에서 받은 chatTokenResponseDto : ', data);
      return data.chatToken;
    } catch (error) {
      console.error('데이터를 불러오는 중 오류가 발생했습니다:', error);
    }
  }, [accessToken]);

  useEffect(() => {
    const connectWebSocketAsync = async () => {
      let chatToken = '';
      console.log('accessToken is null ? :', accessToken === null);
      if (accessToken) {
        chatToken = await fetchToken();
      } else {
        chatToken = 'notlogin'; // 로그인하지 않은 사용자의 경우 토큰 정보를 notlogin으로 요청한다.
      }
      const newSocket = new WebSocket(
        `ws://localhost:8082/chat/${chattingRoomIdString}/${chatToken}`
      );
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
        setTimeout(async () => {
          console.log('accessToken', accessToken);
          const response = await fetch('http://localhost:8081/api/auth/chat', {
            method: 'POST',
            headers: {
              Authorization: accessToken,
            },
          });

          // 응답에서 토큰 추출
          const tokenString = response.data.chatToken;
          const reconnectSocket = new WebSocket(
            `ws://localhost:8082/chat/${chattingRoomIdString}/${tokenString}`
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
        }, 3000); // 3초 후 재연결 시도
      };
      return () => {
        newSocket.close();
      };
    };

    connectWebSocketAsync();
  }, [accessToken, chattingRoomIdString, fetchToken]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages]);

  const sendMessage = () => {
    if (inputMessage.trim() === '') return;

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
