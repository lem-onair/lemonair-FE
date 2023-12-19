import React from 'react';
import ReactPlayer from 'react-player';

const VideoPlayer = ({ videoUrl }) => {
  return (
    <ReactPlayer
      url={videoUrl}
      controls={true}
      width='68%'
      height='68%'
      playing={true}
      config={{
        hls: {
          withCredentials: false,
        },
      }}
    />
  );
};

export default VideoPlayer;
