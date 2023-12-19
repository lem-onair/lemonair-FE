import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { ReactComponent as LemonSVG } from '../images/lemon.svg';

const HeaderContainer = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 5px;
  height: 60px;
`;

const LogoLink = styled(Link)`
  text-decoration: none;
  color: inherit;
`;

const Logo = styled.div`
  padding: 10px;
  padding-left: 15px;

  img {
    background-size: 100%;
    max-width: 200px;
    display: block;
  }
`;

const SvgDiv = styled.div`
  width: 400px;
`;
const RollingSVG = styled(LemonSVG)`
  width: 300px;
  height: 30px;
  animation: roll 15s ease-in-out infinite;
  transition: transform 0.2s;

  &:hover {
    animation-play-state: paused;
  }
`;

const UserOptions = styled.div`
  a {
    margin-left: 15px;
    font-size: 2rem;
    text-decoration: none;
    color: #555;
    padding-right: 25px;
    font-family: 'Reenie Beanie', cursive;
  }

  a:hover {
    color: #555;
  }
`;

const Header = () => {
  return (
    <HeaderContainer>
      <Logo>
        <LogoLink to='/'>
          <img src='/logo2.jpg' alt='로고' />
        </LogoLink>
      </Logo>
      <SvgDiv>
        <RollingSVG />
      </SvgDiv>
      <UserOptions>
        <Link to='/signup'>Sign up</Link>
        <Link to='/login'>Login</Link>
      </UserOptions>
    </HeaderContainer>
  );
};

export default Header;
