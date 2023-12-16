import styled from "styled-components";

const Wrapper = styled.div`
  display: flex;
`;

const Box = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
  width: 200px;
  background-color: tomato;

  span {
    font-size: 20px;

    &:hover {
      font-size: 25px;
    }
    &:active {
      opacity: 0;
    }
  }
`;

function BlinkEventButton({ text }) {
  return (
    <Wrapper>
      <Box>
        <span>{text}</span>
      </Box>
    </Wrapper>
  );
}

export default BlinkEventButton;
