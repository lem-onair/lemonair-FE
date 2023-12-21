import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ChannelInfo = () => {
  const [channelData, setChannelData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          'https://api.lemonair.me:8081/api/channels'
        );
        setChannelData(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <ul>
        {channelData.map((channel) => (
          <li key={channel.id}>
            {/* 여기에 채널 데이터를 표시하는 UI 코드 추가 */}
            {channel.channelName}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ChannelInfo;
