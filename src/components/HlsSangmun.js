import React, { useEffect, useRef } from 'react';
import Hls from 'hls.js';

const VideoPlayer = ({ videoUrl }) => {
  const videoRef = useRef();

  useEffect(() => {
    if (Hls.isSupported()) {
      const hls = new Hls();
      hls.loadSource(videoUrl);
      hls.attachMedia(videoRef.current);
    }
  }, [videoUrl]);

  return (
    <div>
      <video ref={videoRef} width='100%' height='100%' controls />
    </div>
  );
};

export default VideoPlayer;
