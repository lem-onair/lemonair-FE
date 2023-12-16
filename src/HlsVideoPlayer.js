import ReactHlsPlayer from "react-hls-player";

const VideoPlayer = () => {
  // 클라우드 프론트의 배포 url
  const url =
    "https://d1ayat0ueaonc6.cloudfront.net/lyulbyung/videos/lyulbyung.m3u8";
  return (
    <div>
      <ReactHlsPlayer
        url={url}
        autoplay={true}
        controls={true}
        width="100%"
        height="auto"
      />
    </div>
  );
};

export default VideoPlayer;
