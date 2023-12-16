import styled, { keyframes, css } from "styled-components";

const Wrapper = styled.div`
  display: flex;
`;

const rotateAnimation = keyframes`
  0% {
    transform: rotate(0deg);
    border-radius: 30px;
  }
  50% {
    transform: rotate(180deg);
    border-radius: 40px;
  }
  100% {
    transform: rotate(360deg);
    border-radius: 30px;
  }
`;

const MyRotateBox = styled.div`
  height: 100px;
  width: 100px;
  background-color: black;
  ${(p) =>
    p.primary &&
    css`
      background-color: yellowgreen;
    `}
  animation: ${rotateAnimation} 1s linear infinite;
`;

function RotateBox({ ...props }) {
  return (
    <Wrapper>
      <MyRotateBox {...props}></MyRotateBox>
    </Wrapper>
  );
}

export default RotateBox;
