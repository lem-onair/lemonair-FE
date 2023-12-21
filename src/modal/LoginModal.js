import React, { useState } from 'react';
import styled from 'styled-components';
import useInput from '../hooks/useInput';

const ModalBackground = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.3);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 99;
`;

const Modal = styled.div`
  position: fixed;
  width: 30%;
  height: 30%;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
  z-index: 100;
  text-align: center;
`;

const Title = styled.h2`
  font-size: 2rem;
  color: #555;
  margin-bottom: 15px;
  font-family: 'Reenie Beanie', cursive;
`;

const InputField = styled.input`
  width: 70%;
  height: 3vh;
  margin-bottom: 2.5%;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 13px;
  padding-left: 1.2%;
  line-height: 16px;
  font-family: 'Roboto', sans-serif;
  margin-bottom: 1vh;
`;

const SubmitButton = styled.button`
  display: block;
  width: 30%;
  padding: 10px;
  border: none;
  border-radius: 4px;
  font-size: 1.2rem;
  cursor: pointer;
  background-color: #f8de7e;
  color: #4c3c00;
  margin: 0 auto;
  margin-top: 6%;
  font-family: 'Gamja Flower', sans-serif;

  &:hover {
    background-color: #ffea00;
  }
`;

const Label = styled.label`
  display: block;
  font-size: 1rem;
  margin-bottom: 5px;
  opacity: 0.3;
  color: #333;
  text-align: left;
  padding-left: 15%;
  font-family: 'Gamja Flower', sans-serif;
`;

const LoginModal = ({ closeModal }) => {
  const [loginId, onChangeLoginId] = useInput('');
  const [password, onChangePassword] = useInput('');
  const [error, setError] = useState('');

  const handleOutsideClick = (e) => {
    if (e.target === e.currentTarget) {
      closeModal();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const loginData = {
      loginId,
      password,
    };

    try {
      const response = await fetch('https://api.lemonair.me:8081/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(loginData),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('accessToken', data.accessToken);
        localStorage.setItem('refreshToken', data.refreshToken);
        closeModal();
      } else {
        setError('아이디 또는 비밀번호가 올바르지 않습니다.');
      }
    } catch (error) {
      setError('오류가 발생했습니다.');
    }
  };
  return (
    <ModalBackground onClick={handleOutsideClick}>
      <Modal>
        <Title>Login</Title>
        <form onSubmit={handleSubmit}>
          <Label htmlFor='loginId'>아이디</Label>
          <InputField
            type='loginId'
            id='text'
            placeholder='아이디'
            value={loginId}
            onChange={onChangeLoginId}
          />
          <Label htmlFor='password'>비밀번호</Label>
          <InputField
            type='password'
            id='password'
            placeholder='비밀번호'
            value={password}
            onChange={onChangePassword}
          />
          {error && <p style={{ color: 'red' }}>{error}</p>}
          <SubmitButton type='submit'>로그인</SubmitButton>
        </form>
      </Modal>
    </ModalBackground>
  );
};

export default LoginModal;
