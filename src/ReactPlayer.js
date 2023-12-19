import React from "react";
import ReactPlayer from "react-player";

const VideoPlayer = () => {
  const videoUrl =
    "https://d1ayat0ueaonc6.cloudfront.net/lyulbyung/videos/m3u8-lyulbyung.m3u8";

  return (
    <div>
      <ReactPlayer
        url={videoUrl}
        controls={true}
        width="50%"
        height="50%"
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
