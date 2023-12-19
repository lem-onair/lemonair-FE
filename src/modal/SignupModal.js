import React from 'react';
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

const SignupModal = ({ closeModal }) => {
  const [loginId, onChangeLoginId] = useInput('');
  const [email, onChangeEmail] = useInput('');
  const [password, onChangePassword] = useInput('');
  const [password2, onChangePassword2] = useInput('');
  const [nickname, onChangeNickname] = useInput('');

  const handleOutsideClick = (e) => {
    if (e.target === e.currentTarget) {
      closeModal();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Signup 데이터
    const signupData = {
      loginId,
      email,
      password,
      password2,
      nickname,
    };

    try {
      const response = await fetch('http://localhost:8081/api/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(signupData),
      });

      if (response.ok) {
        const data = await response.json();
        alert(
          `회원가입에 성공했습니다!
방송을 시작하시려면 다음 stream key를 OBS Studio에 등록해주세요
stream key : ${data.streamKey}`
        );
        closeModal();
      } else {
        // 실패 시 로직 (예: 에러 처리, 사용자에게 실패 메시지 표시 등)
        console.error('Signup failed!');
      }
    } catch (error) {
      console.error('Error occurred while signing up:', error);
    }
  };

  return (
    <ModalBackground onClick={handleOutsideClick}>
      <Modal>
        <Title>Signup</Title>
        <form onSubmit={handleSubmit}>
          <Label htmlFor='loginId'>아이디</Label>
          <InputField
            type='text'
            id='loginId'
            placeholder='아이디'
            value={loginId}
            onChange={onChangeLoginId}
          />
          <Label htmlFor='email'>이메일</Label>
          <InputField
            type='email'
            id='email'
            placeholder='이메일'
            value={email}
            onChange={onChangeEmail}
          />
          <Label htmlFor='password'>비밀번호</Label>
          <InputField
            type='password'
            id='password'
            placeholder='비밀번호'
            value={password}
            onChange={onChangePassword}
          />
          <Label htmlFor='password2'>비밀번호 확인</Label>
          <InputField
            type='password'
            id='password2'
            placeholder='비밀번호 확인'
            value={password2}
            onChange={onChangePassword2}
          />
          <Label htmlFor='nickname'>닉네임</Label>
          <InputField
            type='text'
            id='nickname'
            placeholder='닉네임'
            value={nickname}
            onChange={onChangeNickname}
          />
          <SubmitButton type='submit'>가입하기</SubmitButton>
        </form>
      </Modal>
    </ModalBackground>
  );
};

export default SignupModal;
