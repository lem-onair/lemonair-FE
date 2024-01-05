import React, { useEffect, useRef } from "react";
import Hls from "hls.js";
const config = {
  autoStartLoad: true,
  startPosition: -1,
  debug: true,
  capLevelOnFPSDrop: false,
  capLevelToPlayerSize: false,
  defaultAudioCodec: undefined,
  initialLiveManifestSize: 1,
  maxBufferLength: 3000,
  maxMaxBufferLength: 6000,
  backBufferLength: Infinity,
  frontBufferFlushThreshold: Infinity,
  maxBufferSize: 60 * 1000 * 1000,
  maxBufferHole: 0.5,
  highBufferWatchdogPeriod: 2,
  nudgeOffset: 0.1,
  nudgeMaxRetry: 3,
  maxFragLookUpTolerance: 0.25,
  liveSyncDurationCount: 3,
  liveMaxLatencyDurationCount: Infinity,
  liveDurationInfinity: false,
  preferManagedMediaSource: false,
  enableWorker: true,
  enableSoftwareAES: true,
  fragLoadPolicy: {
    default: {
      maxTimeToFirstByteMs: 9000,
      maxLoadTimeMs: 100000,
      timeoutRetry: {
        maxNumRetry: 100,
        retryDelayMs: 10,
        maxRetryDelayMs: 10,
      },
      errorRetry: {
        maxNumRetry: 10,
        retryDelayMs: 1000,
        maxRetryDelayMs: 15000,
        backoff: "linear",
      },
    },
  },
  startLevel: undefined,
  audioPreference: {
    characteristics: "public.accessibility.describes-video",
  },
  subtitlePreference: {
    lang: "en-US",
  },
  startFragPrefetch: false,
  testBandwidth: true,
  progressive: false,
  lowLatencyMode: true,
  fpsDroppedMonitoringPeriod: 5000,
  fpsDroppedMonitoringThreshold: 0.2,
  appendErrorMaxRetry: 100,
  // loader: customLoader,
  // fLoader: customFragmentLoader,
  // pLoader: customPlaylistLoader,
  // xhrSetup: XMLHttpRequestSetupCallback,
  // fetchSetup: FetchSetupCallback,
  // abrController: AbrController,
  // bufferController: BufferController,
  // capLevelController: CapLevelController,
  // fpsController: FPSController,
  // timelineController: TimelineController,
  enableDateRangeMetadataCues: true,
  enableEmsgMetadataCues: true,
  enableID3MetadataCues: true,
  enableWebVTT: true,
  enableIMSC1: true,
  enableCEA708Captions: true,
  stretchShortVideoTrack: false,
  maxAudioFramesDrift: 1,
  forceKeyFrameOnDiscontinuity: true,
  abrEwmaFastLive: 3.0,
  abrEwmaSlowLive: 9.0,
  abrEwmaFastVoD: 3.0,
  abrEwmaSlowVoD: 9.0,
  abrEwmaDefaultEstimate: 500000,
  abrEwmaDefaultEstimateMax: 5000000,
  abrBandWidthFactor: 0.95,
  abrBandWidthUpFactor: 0.7,
  abrMaxWithRealBitrate: false,
  maxStarvationDelay: 4,
  maxLoadingDelay: 4,
  minAutoBitrate: 0,
  emeEnabled: false,
  licenseXhrSetup: undefined,
  drmSystems: {},
  drmSystemOptions: {},
  // requestMediaKeySystemAccessFunc: requestMediaKeySystemAccess,
  cmcd: {
    // sessionId: uuid(),
    // contentId: hash(contentURL),
    useHeaders: false,
  },
};

const HlsVideoPlayer = ({ videoUrl }) => {
  const videoRef = useRef(null);
  // console.log("videoRef", videoRef);
  useEffect(() => {
    const videoElement = videoRef.current;
    let hls;
    // console.log("useEffect실행");
    const initializeHls = (data) => {
      videoElement.addEventListener("loadedmetadata", function () {
        console.log("metadata loaded ");
        let myFragments = data.levels[0].details.fragments;
        console.log("myFragments", myFragments);
        const lastSegment = myFragments[myFragments.length - 1];
        if (lastSegment) {
          videoElement.currentTime = lastSegment.start - 10;
        }
        var playPromise = videoElement.play();
        console.log("playPromise", playPromise);
        if (playPromise !== undefined) {
          playPromise
            .then(function () {
              // Automatic playback started!
              console.log("playPromise returns success");
            })
            .catch(function (error) {
              console.log("playPromise error : ", error);
            });
        }
      });
    };

    // Hls 지원 여부 확인
    const loadVideo = async () => {
      if (Hls.isSupported()) {
        // console.log("hls를 지원한다.");

        hls = new Hls(config);
        hls.on(Hls.Events.MEDIA_ATTACHED, function () {
          console.log("hls.on(Hls.Events.MEDIA_ATTACHED 실행");
        });
        hls.on(Hls.Events.MANIFEST_PARSED, function (event, data) {
          console.log("hls.on(Hls.Events.MANIFEST_PARSED 실행");
          setTimeout(initializeHls(data), 100);
          console.log("로드한 데이터", data);
          // initializeHls(data);
        });

        // hls.on(Hls.Events.AUDIO_TRACKS_UPDATED, () =>
        //   console.log("Hls.Events.AUDIO_TRACKS_UPDATED")
        // );

        // hls.on(Hls.Events.AUDIO_TRACK_LOADED, () =>
        //   console.log("Hls.Events.AUDIO_TRACK_LOADED")
        // );

        // hls.on(Hls.Events.AUDIO_TRACK_LOADING, () =>
        //   console.log("Hls.Events.AUDIO_TRACK_LOADING")
        // );

        // hls.on(Hls.Events.AUDIO_TRACK_SWITCHED, () =>
        //   console.log("Hls.Events.AUDIO_TRACK_SWITCHED")
        // );

        // hls.on(Hls.Events.AUDIO_TRACK_SWITCHING, () =>
        //   console.log("Hls.Events.AUDIO_TRACK_SWITCHING")
        // );

        // hls.on(Hls.Events.BACK_BUFFER_REACHED, () =>
        //   console.log("Hls.Events.BACK_BUFFER_REACHED")
        // );

        // hls.on(Hls.Events.BUFFER_APPENDED, () =>
        //   console.log("Hls.Events.BUFFER_APPENDED")
        // );

        // hls.on(Hls.Events.BUFFER_APPENDING, () =>
        //   console.log("Hls.Events.BUFFER_APPENDING")
        // );

        // hls.on(Hls.Events.BUFFER_CODECS, () =>
        //   console.log("Hls.Events.BUFFER_CODECS")
        // );

        // hls.on(Hls.Events.BUFFER_CREATED, () =>
        //   console.log("Hls.Events.BUFFER_CREATED")
        // );

        // hls.on(Hls.Events.BUFFER_EOS, () =>
        //   console.log("Hls.Events.BUFFER_EOS")
        // );

        // hls.on(Hls.Events.BUFFER_FLUSHED, () =>
        //   console.log("Hls.Events.BUFFER_FLUSHED")
        // );

        // hls.on(Hls.Events.BUFFER_FLUSHING, () =>
        //   console.log("Hls.Events.BUFFER_FLUSHING")
        // );

        // hls.on(Hls.Events.BUFFER_RESET, () =>
        //   console.log("Hls.Events.BUFFER_RESET")
        // );

        // hls.on(Hls.Events.CUES_PARSED, () =>
        //   console.log("Hls.Events.CUES_PARSED")
        // );

        // hls.on(Hls.Events.DESTROYING, () =>
        //   console.log("Hls.Events.DESTROYING")
        // );

        // hls.on(Hls.Events.ERROR, () => console.log("Hls.Events.ERROR"));

        // hls.on(Hls.Events.FPS_DROP, () => console.log("Hls.Events.FPS_DROP"));

        // hls.on(Hls.Events.FPS_DROP_LEVEL_CAPPING, () =>
        //   console.log("Hls.Events.FPS_DROP_LEVEL_CAPPING")
        // );

        // hls.on(Hls.Events.FRAG_BUFFERED, () =>
        //   console.log("Hls.Events.FRAG_BUFFERED")
        // );

        // hls.on(Hls.Events.FRAG_CHANGED, () =>
        //   console.log("Hls.Events.FRAG_CHANGED")
        // );

        // hls.on(Hls.Events.FRAG_DECRYPTED, () =>
        //   console.log("Hls.Events.FRAG_DECRYPTED")
        // );

        // hls.on(Hls.Events.FRAG_LOADED, () =>
        //   console.log("Hls.Events.FRAG_LOADED")
        // );

        // hls.on(Hls.Events.FRAG_LOADING, () =>
        //   console.log("Hls.Events.FRAG_LOADING")
        // );

        // hls.on(Hls.Events.FRAG_LOAD_EMERGENCY_ABORTED, () =>
        //   console.log("Hls.Events.FRAG_LOAD_EMERGENCY_ABORTED")
        // );

        // hls.on(Hls.Events.FRAG_PARSED, () =>
        //   console.log("Hls.Events.FRAG_PARSED")
        // );

        // hls.on(Hls.Events.FRAG_PARSING_INIT_SEGMENT, () =>
        //   console.log("Hls.Events.FRAG_PARSING_INIT_SEGMENT")
        // );

        // hls.on(Hls.Events.FRAG_PARSING_METADATA, () =>
        //   console.log("Hls.Events.FRAG_PARSING_METADATA")
        // );

        // hls.on(Hls.Events.FRAG_PARSING_USERDATA, () =>
        //   console.log("Hls.Events.FRAG_PARSING_USERDATA")
        // );

        // hls.on(Hls.Events.ERROR, (e) => console.log(e));
        hls.attachMedia(videoElement);
        hls.loadSource(videoUrl);
      } else if (videoElement.canPlayType("application/vnd.apple.mpegurl")) {
        console.log("hls 타입 아님");
      }
    };

    loadVideo();
    // 컴포넌트가 언마운트될 때 해제
    return () => {
      console.log("컴포넌트 unmount시에 destroy");
      hls.destroy();
    };
  }, []);

  return (
    <div>
      <video ref={videoRef} controls width="100%" height="100%" />
    </div>
  );
};

export default HlsVideoPlayer;
