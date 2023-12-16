import styled, { css } from "styled-components";

const MyRoundButton = styled.button`
  padding: 10px 20px;
  border-radius: 20px;
  background-color: #3498db;
  font-size: 16px;
  ${(p) =>
    p.primary &&
    css`
      color: greenyellow;
      background-color: yellow;
      border-color: black;
    `}
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #2980b9;
  }
`;

function RoundButton({ text, ...props }) {
  return <MyRoundButton {...props}>{text}</MyRoundButton>;
}

export default RoundButton;
