import React from "react";
import ReactPlayer from "react-player";

const VideoPlayer = () => {
  const videoUrl =
    "https://d1ayat0ueaonc6.cloudfront.net/lyulbyung/videos/lyulbyung.m3u8";

  return (
    <div>
      <ReactPlayer
        url={videoUrl}
        controls={true}
        width="100%"
        height="auto"
        playing={true}
        config={{
          hls: {
            withCredentials: false,
          },
        }}
      />
    </div>
  );
};

export default VideoPlayer;
