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

const NotLoginInputContainer = styled.div`
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
//   const [socketIntervalId, setSocketIntervalId] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const messagesEndRef = useRef(null);

  const chattingRoomIdString = chattingRoomId;
  const accessToken = localStorage.getItem('accessToken');
  useEffect(() => {
    if (accessToken) {
      setIsLoggedIn(true);
    }
  }, [accessToken]);
  const fetchToken = useCallback(async () => {
    try {
      console.log(accessToken);
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/api/auth/chat`,
        {
          method: 'POST',
          headers: {
            Authorization: accessToken,
          },
        }
      );
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
    const connectWebSocket = async () => {
      let chatToken = accessToken ? await fetchToken() : 'notlogin';
      const newSocket = new WebSocket(
        `${process.env.REACT_APP_CHAT_URL}/${chattingRoomIdString}/${chatToken}`
      );

      newSocket.onopen = () => {
        console.log('웹소켓 연결됨');
        // const heartbeatInterval = setInterval(() => {
        //   newSocket.send('heartbeat');
        // }, 30000);
        // setSocketIntervalId(heartbeatInterval);
      };

      newSocket.onmessage = (event) => {
        const receiveData = event.data.split(':');
        const from = receiveData[0];
        const message = receiveData.slice(1).join(':').trim();
        setMessages((prevMessages) => [...prevMessages, { from, message }]);
      };

      newSocket.onclose = () => {
        console.log('웹소켓 연결 종료');
        // clearInterval(socketIntervalId);
        // 재연결 로직 추가
        setTimeout(() => {
          connectWebSocket();
        }, 1000); // 1초 후 재연결 시도
      };

      setSocket(newSocket);
    };

    connectWebSocket();
    return () => {
      if (socket) {
        socket.close();
      }
      // clearInterval(socketIntervalId);
    };
  }, [accessToken, chattingRoomIdString]);

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
    if (!isLoggedIn && event.key === 'Enter') {
      setInputMessage('');
      return;
    }

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
      {isLoggedIn ? (
        <InputContainer>
          <TextInput
            type='text'
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <SendButton
            onClick={sendMessage}
            disabled={isLoggedIn ? false : true}
          >
            전송
          </SendButton>
        </InputContainer>
      ) : (
        <NotLoginInputContainer>
          로그인한 사용자만 채팅을 입력할 수 있습니다.
        </NotLoginInputContainer>
      )}
    </ChatContainer>
  );
};

export default ChatComponent;
