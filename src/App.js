import "./App.css";
import styled from "styled-components";
// import RoundButton from "./styled_components/RoundButton";
// import SquareButton from "./styled_components/SquredButton";
// import RotateBox from "./animated_components/RotateButton";
// import BlinkEventButton from "./event_components/BlinkEventButton";
import Channels from "./sbltest/ChannelList";
import Channel from "./sbltest/Channel";
import VideoPlayer from "./ReactPlayer";

import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

const StBox = styled.div`
  width: 100px;
  height: 100px;
  border: 1px solid ${(props) => props.borderColor};
  margin: 20px;
`;

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/api/streams" exact>
          {/* 게시물 리스트를 보여주는 뷰 */}
          <Channels />
        </Route>
        <Route path="/api/streams/:streamId">
          {/* 특정 게시물의 상세 내용을 보여주는 뷰 */}
          <Channel />
        </Route>
        {/* 다른 라우트 설정 */}
      </Routes>
    </Router>
  );
};
export default App;
