import "./App.css";
import styled from "styled-components";
// import RoundButton from "./styled_components/RoundButton";
// import SquareButton from "./styled_components/SquredButton";
// import RotateBox from "./animated_components/RotateButton";
// import BlinkEventButton from "./event_components/BlinkEventButton";
import VideoPlayer from "./HlsVideoPlayer";

const StBox = styled.div`
  width: 100px;
  height: 100px;
  border: 1px solid ${(props) => props.borderColor};
  margin: 20px;
`;

const App = () => {
  return (
    <div>
      <VideoPlayer></VideoPlayer>
    </div>
  );
};
export default App;
