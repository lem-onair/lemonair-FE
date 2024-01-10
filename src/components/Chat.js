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
  width: 100%;
  height: 72vh;
  overflow-y: scroll;
`;

const Sender = styled.span`
  color: #c0c0c0;
  font-size: 1rem;
  padding-left: 5px;
  font-family: 'Gamja Flower', sans-serif;
`;

const DonationSender = styled.div`
  width: 100%;
  color: #228b22;
  font-size: 1.5rem;
  text-align: center;
  font-family: 'Gamja Flower', sans-serif;
`;

const DonationText = styled.div`
  margin: 0 auto;
  font-size: 1.5rem;
  text-align: center;
  color: #8b4513;
  font-family: 'Gamja Flower', sans-serif;
`;

const SpanText = styled.span`
  font-size: 1.1rem;
  color: #666;
  font-family: 'Gamja Flower', sans-serif;
`;

const DonationCard = styled.div`
  display: flex;
  flex-direction: column;
  margin: 0 auto;
  /* min-width: 25%;
  max-width: 50%; */
  width: 50%;
  height: 20%;
  text-align: center;
  border: 1px solid #ccc;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

const DonationImg = styled.img`
  align-self: center;
  width: 50%;
  border-radius: 8px 8px 0 0;
`;

const DonationMessage = styled.span`
  font-size: 1.8rem;
  color: #ffd700;
  font-family: 'Gamja Flower', sans-serif;
  padding-left: 15px;
  flex-direction: row;
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
  const [socketIntervalId, setSocketIntervalId] = useState(null);
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
        const heartbeatInterval = setInterval(() => {
          newSocket.send('heartbeat');
        }, 30000);
        setSocketIntervalId(heartbeatInterval);
      };

      newSocket.onmessage = (event) => {
        console.log(event);
        const receiveData = event.data.split(':');
        const messageType = receiveData[0];
        const from = receiveData[1];
        const donationMessage = receiveData[2];
        const message = receiveData.slice(3).join(':').trim();

        console.log(messageType);
        console.log(donationMessage);
        // const message = receiveData[2];
        setMessages((prevMessages) => [
          ...prevMessages,
          { messageType, from, donationMessage, message },
        ]);
      };

      newSocket.onclose = () => {
        console.log('웹소켓 연결 종료');
        // clearInterval(socketIntervalId);

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
      clearInterval(socketIntervalId);
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
            {message.messageType === 'CHAT' ? (
              <>
                <Sender>{message.from}: </Sender>
                <SpanText>{message.message}</SpanText>
              </>
            ) : (
              <>
                <DonationCard>
                  <DonationImg src='/lemon.jpg' />
                  <DonationMessage>{message.message}</DonationMessage>
                </DonationCard>
                <DonationSender>Lemonair</DonationSender>
                <DonationText>{message.donationMessage}</DonationText>
              </>
            )}
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
