import styled from "styled-components";

const MyStyledTag = styled.a`
  padding: 0.5rem 0;
  background: black;
  color: white;
  ${(props) =>
    props.primary &&
    `
  background: white;
  color: black;
`}
`;

export default MyStyledTag;
