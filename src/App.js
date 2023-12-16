import "./App.css";
import styled from "styled-components";
import RoundButton from "./styled_components/RoundButton";
import SquareButton from "./styled_components/SquredButton";
import RotateBox from "./animated_components/RotateButton";
import BlinkEventButton from "./event_components/BlinkEventButton";

const StBox = styled.div`
  width: 100px;
  height: 100px;
  border: 1px solid ${(props) => props.borderColor};
  margin: 20px;
`;

const App = () => {
  return (
    <div>
      <StBox borderColor="red">박스</StBox>
      <StBox borderColor="green">박스</StBox>
      <StBox borderColor="blue">박스</StBox>
      <SquareButton text={"안녕"} />
      <SquareButton text={"primary 버튼"} primary />
      <RoundButton text={"round 버튼"} primary />
      <RotateBox primary></RotateBox>
      <BlinkEventButton text={"저를 누르면 깜빡거려요"}></BlinkEventButton>
    </div>
  );
};
export default App;
