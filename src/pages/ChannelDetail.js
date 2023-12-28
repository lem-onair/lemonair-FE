import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Header from '../components/header';
import VideoPlayer from '../components/ReactPlayer';
import styled from 'styled-components';
import Chat from '../components/Chat';

const StreamingContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
`;

const StreamingChatContainer = styled.div`
  width: 100%;
  display: flex;
`;

const StreamingTitle = styled.p`
  margin-top: 15px;
  margin-left: 15px;
  font-size: 1.5rem;
  font-family: 'Gamja Flower', sans-serif;
`;

const ChatWrapper = styled.div`
  width: 32%;
  background-color: #fff;
`;

const ChannelDetail = () => {
  const { id } = useParams();
  const [channelData, setChannelData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `http://localhost:8081/api/channels/${id}`
        );
        if (!response.ok) {
          throw new Error('Network response was not ok.');
        }
        const data = await response.json();
        setChannelData(data);
        console.log('title:', data.title);
        console.log('url:', data.hlsUrl);
        console.log('roomid:', data.chattingRoomId);
      } catch (error) {
        console.error('데이터를 불러오는 중 오류가 발생했습니다:', error);
      }
    };

    fetchData();
  }, [id]);
  return (
    <>
      <Header />
      <StreamingChatContainer>
        <StreamingContainer>
          {channelData ? <VideoPlayer videoUrl={channelData.hlsUrl} /> : null}
          {channelData ? (
            <ChatWrapper>
              <Chat
                chatToken={channelData.chatToken}
                chattingRoomId={channelData.chattingRoomId}
              ></Chat>
            </ChatWrapper>
          ) : null}
        </StreamingContainer>
      </StreamingChatContainer>
      {channelData ? (
        <StreamingTitle>{channelData.title}</StreamingTitle>
      ) : null}
    </>
  );
};

export default ChannelDetail;
