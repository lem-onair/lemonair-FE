import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Header from '../components/header';
import styled from 'styled-components';
import Chat from '../components/Chat';
import HlsVideoPlayer from '../components/HlsPlayer';
import DonationModal from '../modal/DonationModal';

const StreamingContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
`;

const VideoWrapper = styled.div`
  width: 68%;
  height: 68%;
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

const DonationButton = styled.button`
  cursor: pointer;
  margin-left: 15px;
  font-size: 1.5rem;
  text-decoration: none;
  color: #555;
  padding-right: 25px;
  font-family: 'Gamja Flower', sans-serif;
`;

const ChannelDetail = () => {
  const { id } = useParams();
  const [channelData, setChannelData] = useState(null);
  const [isDonationModalOpen, setIsDonationModalOpen] = useState(false);

  const openDonationModal = () => {
    setIsDonationModalOpen(true);
  };

  const closeDonationModal = () => {
    setIsDonationModalOpen(false);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_API_URL}/api/channels/${id}`
        );
        if (!response.ok) {
          throw new Error('Network response was not ok.');
        }
        const data = await response.json();
        setChannelData(data);
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
          {channelData ? (
            <VideoWrapper>
              <HlsVideoPlayer videoUrl={channelData.hlsUrl} />
            </VideoWrapper>
          ) : null}
          {channelData ? (
            <ChatWrapper>
              <Chat chattingRoomId={channelData.chattingRoomId}></Chat>
            </ChatWrapper>
          ) : null}
        </StreamingContainer>
      </StreamingChatContainer>
      {channelData ? (
        <StreamingTitle>{channelData.title}</StreamingTitle>
      ) : null}
      <DonationButton onClick={openDonationModal}>후원하기</DonationButton>
      {isDonationModalOpen && (
        <DonationModal closeModal={closeDonationModal} streamerId={id} />
      )}
    </>
  );
};

export default ChannelDetail;
