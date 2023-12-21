import React, { useState } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { ReactComponent as LemonSVG } from '../images/lemon.svg';
import SignupModal from '../modal/SignupModal';
import LoginModal from '../modal/LoginModal';

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
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const accessToken = localStorage.getItem('accessToken');

  const openSignupModal = () => {
    setIsSignupModalOpen(true);
  };

  const closeSignupModal = () => {
    setIsSignupModalOpen(false);
  };

  const openLoginModal = () => {
    setIsLoginModalOpen(true);
  };

  const closeLoginModal = () => {
    setIsLoginModalOpen(false);
  };

  const handleLogout = async () => {
    try {
      const response = await fetch('https://api.lemonair.me:8081/api/logout', {
        method: 'POST',
        headers: {
          Authorization: accessToken,
        },
      });

      if (response.ok) {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        alert('로그아웃 되었습니다.');
        window.location.reload();
      } else {
        console.log('로그아웃에 실패하였습니다.');
      }
    } catch (error) {
      console.error('로그아웃 중 오류 발생:', error);
    }
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
      {accessToken ? (
        <UserOptions>
          <HeaderText onClick={handleLogout}>Log out</HeaderText>
        </UserOptions>
      ) : (
        <UserOptions>
          <HeaderText onClick={openSignupModal}>Sign up</HeaderText>
          <HeaderText onClick={openLoginModal}>Log in</HeaderText>
        </UserOptions>
      )}
      {isSignupModalOpen && <SignupModal closeModal={closeSignupModal} />}
      {isLoginModalOpen && <LoginModal closeModal={closeLoginModal} />}
    </HeaderContainer>
  );
};

export default Header;
