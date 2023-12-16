import styled from "styled-components";

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100vw;
  height: 100vh;
`;

const Emoji = styled.span``;

const EmojiTwo = styled.span``;

const Box = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
  width: 200px;
  background-color: tomato;

  ${Emoji} {
    font-size: 36px;

    &:hover {
      font-size: 90px;
    }
    &:active {
      opacity: 0;
    }
  }

  ${EmojiTwo}:hover {
    font-size: 90px;
  }
`;

function BlinkEventButton2() {
  return (
    <Wrapper>
      <Box>
        <Emoji>🙂</Emoji>
        <EmojiTwo>🙁</EmojiTwo>
      </Box>
    </Wrapper>
  );
}

export default BlinkEventButton2;
