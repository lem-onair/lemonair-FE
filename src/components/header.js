import React, { useState } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { ReactComponent as LemonSVG } from '../images/lemon.svg';
import SignupModal from '../modal/SignupModal';

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

const HeaderText = styled.span`
  cursor: pointer;
  margin-left: 15px;
  font-size: 2rem;
  text-decoration: none;
  color: #555;
  padding-right: 25px;
  font-family: 'Reenie Beanie', cursive;
`;

const Header = () => {
  const [isSignupModalOpen, setIsSignupModalOpen] = useState(false);

  const openSignupModal = () => {
    setIsSignupModalOpen(true);
  };

  const closeSignupModal = () => {
    setIsSignupModalOpen(false);
  };
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
        <HeaderText onClick={openSignupModal}>Sign up</HeaderText>
        <Link to='/login'>Login</Link>
      </UserOptions>
      {isSignupModalOpen && <SignupModal closeModal={closeSignupModal} />}
    </HeaderContainer>
  );
};

export default Header;
