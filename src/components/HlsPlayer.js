import React, { useEffect, useRef } from "react";
import Hls from "hls.js";
import SelectInput from "@material-ui/core/Select/SelectInput";
const config = {
  autoStartLoad: true,
  startPosition: -1,
  debug: false,
  capLevelOnFPSDrop: false,
  capLevelToPlayerSize: false,
  defaultAudioCodec: undefined,
  initialLiveManifestSize: 1,
  maxBufferLength: 30,
  maxMaxBufferLength: 600,
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
        maxNumRetry: 2,
        retryDelayMs: 0,
        maxRetryDelayMs: 0,
      },
      errorRetry: {
        maxNumRetry: 5,
        retryDelayMs: 3000,
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
  appendErrorMaxRetry: 3,
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
  console.log("videoRef", videoRef);
  useEffect(() => {
    const videoElement = videoRef.current;
    let hls;

    console.log("useEffect실행");
    const initializeHls = (data) => {
      console.log(data);
      // videoElement.play();
      console.log("hls", hls);
      // console.log("hls.media.current.segments", hls.media.current.segments);
      // console.log("data : ", data);

      // videoElement.oncanplaythrough = function () {
      //   console.log("oncanplaythrough 실행");
      //   videoElement.play();
      // };

      videoElement.addEventListener("loadedmetadata", function () {
        console.log("metadata loaded ");
        let myFragments = data.levels[0].details.fragments;
        console.log("myFragments", myFragments);
        const lastSegment = myFragments[myFragments.length - 1];
        // console.log("lastSegment", lastSegment);
        if (lastSegment) {
          videoElement.currentTime = lastSegment.start - 0.5;
        }
        var playPromise = videoElement.play();
        // In browsers that don’t yet support this functionality,
        // playPromise won’t be defined.
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
      // videoElement.muted = false;
      // 마지막 청크의 재생시간으로 이동

      // var autoplayVideoInterval = setInterval(autoplayVideo, 1000);
      // function autoplayVideo() {
      //   var promise = videoElement.play();
      //   console.log("promise", promise);
      //   if (promise !== undefined) {
      //     promise
      //       .then(function (_) {
      //         console.log("promise then");
      //         // Autoplay started!
      //         videoElement.muted = false;
      //         clearInterval(autoplayVideoInterval);
      //       })
      //       .catch(function (error) {
      //         console.log("error", error);
      //         // Autoplay was prevented.
      //         // Show a "Play" button so that user can start playback.
      //       });
      //   }
    };

    // Hls 지원 여부 확인
    const loadVideo = async () => {
      if (Hls.isSupported()) {
        console.log("hls를 지원한다.");

        hls = new Hls(config);
        // 이벤트 리스너 등록
        // hls.on(Hls.Events.MEDIA_ATTACHED, (event, data) => {
        //   console.log("event listener 등록");
        //   initializeHls(data);
        // });

        hls.on(Hls.Events.MEDIA_ATTACHED, function () {
          console.log("hls.on(Hls.Events.MEDIA_ATTACHED 실행");
        });
        hls.on(Hls.Events.MANIFEST_PARSED, function (event, data) {
          console.log("hls.on(Hls.Events.MANIFEST_PARSED 실행");
          console.log("로드한 데이터", data);
          setTimeout()
          initializeHls(data);
        });

        hls.loadSource(videoUrl);
        hls.attachMedia(videoElement);
      } else if (videoElement.canPlayType("application/vnd.apple.mpegurl")) {
        // Hls 지원하지 않을 경우
        videoElement.src = videoUrl;
        console.log("hls 지원하지 않는 경우");
        // 자동재생
        // videoElement.play();
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
