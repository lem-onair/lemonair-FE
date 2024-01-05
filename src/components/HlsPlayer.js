import React, { useEffect, useRef } from "react";
import Hls from "hls.js";

const HlsVideoPlayer = ({ videoUrl }) => {
  const videoRef = useRef(null);

  useEffect(() => {
    const videoElement = videoRef.current;
    let hls;

    console.log("useEffect실행");
    const initializeHls = (data) => {
      console.log(data);
      console.log("initialize 실행");
      // 자동재생
      console.log("play 실행 전");
      videoElement.play();
      console.log("play 실행 후ㅡ");
      // 마지막 청크의 재생시간으로 이동
      console.log("hls", hls);
      // console.log("hls.media.current.segments", hls.media.current.segments);
      console.log(data.lastSegment);
      console.log(hls.media.segments);
      const lastSegment = hls.media.segments[hls.media.segments.length - 1];
      console.log("lastSegment", lastSegment);
      if (lastSegment) {
        videoElement.currentTime = lastSegment.end;
      }
    };

    // Hls 지원 여부 확인
    if (Hls.isSupported()) {
      console.log("hls를 지원한다.");
      var config = {
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

      hls = new Hls(config);
      // 이벤트 리스너 등록
      // hls.on(Hls.Events.MEDIA_ATTACHED, (event, data) => {
      //   console.log("event listener 등록");
      //   initializeHls(data);
      // });

      hls.on(Hls.Events.MEDIA_ATTACHED, function () {
        console.log("video and hls.js are now bound together !");
      });
      hls.on(Hls.Events.MANIFEST_PARSED, function (event, data) {
        initializeHls(data);
      });

      hls.loadSource(videoUrl);
      hls.attachMedia(videoElement);
    } else if (videoElement.canPlayType("application/vnd.apple.mpegurl")) {
      // Hls 지원하지 않을 경우
      videoElement.src = videoUrl;
      console.log("hls 지원하지 않는 경우");
      // 자동재생
      videoElement.play();
    }

    // 컴포넌트가 언마운트될 때 해제
    return () => {
      if (Hls.isSupported()) {
        console.log("컴포넌트 unmount시에 destroy");
        hls.destroy();
      }
    };
  }, [videoUrl]);

  return (
    <div>
      <video ref={videoRef} controls width="100%" height="100%" />
    </div>
  );
};

export default HlsVideoPlayer;
