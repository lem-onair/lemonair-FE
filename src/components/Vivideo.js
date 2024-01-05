import ReactPlayer from 'react-player';
import Hls from 'hls.js';

const BroadDetailVideo = ({ videoUrl }) => {

  const hlsUrl = videoUrl;

  const handlePlayerReady = (player) => {
    if (player?.getInternalPlayer) {
      const hls = player.getInternalPlayer()?.hls;

      if (hls) {
        hls.config = {
          ...hls.config,
          hlsOptions: {
            hlsTime: 1,
          },
        };
      }
    }
  };

  return (
    <div>
      <ReactPlayer
        url={hlsUrl}
        controls
        muted
        playing
        width="100%"
        height="100%"
        onReady={handlePlayerReady}
        config={{
          file: {
            hlsOptions: {
              liveSyncDurationCount: 1,
              liveMaxLatencyDurationCount: 3,
              liveDurationInfinity: true,
            },
          },
        }}
        hls={Hls}
      />
    </div>
  );
};

export default BroadDetailVideo;