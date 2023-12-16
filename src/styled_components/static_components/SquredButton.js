import styled, { css } from "styled-components";

const MySquareButton = styled.button`
  padding: 6px 10px;
  border-radius: 5px;

  ${(p) =>
    p.primary &&
    css`
      color: white;
      background-color: navy;
      border-color: black;
    `}
`;

function SquareButton({ text, ...props }) {
  return <MySquareButton {...props}>{text}</MySquareButton>;
}

export default SquareButton;
