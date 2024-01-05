let AudioContext;
let audioContext;

const initializeAudioContext = () => {
  AudioContext = window.AudioContext || window.webkitAudioContext;
  audioContext = new AudioContext();
};

// 사용자에게 오디오 자동 재생 권한을 요청하는 함수
const requestAutoPlayPermission = async () => {
  try {
    await audioContext.resume(); // 오디오 컨텍스트를 재개하려고 시도
    console.log('사용자가 오디오 자동 재생 권한을 허용했습니다.');
    // 오디오 자동 재생을 사용할 수 있는 상태
  } catch (e) {
    console.error('사용자가 오디오 자동 재생을 허용하지 않았습니다.');
    // 오디오 자동 재생을 사용할 수 없는 상태
  }
};

export { audioContext, initializeAudioContext, requestAutoPlayPermission };