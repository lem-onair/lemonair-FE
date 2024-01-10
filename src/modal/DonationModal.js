import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
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
  height: 40%;
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

  -webkit-appearance: none;
  -moz-appearance: textfield;
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

const CurrentPoints = styled.p`
  display: block;
  font-size: 0.8rem;
  margin: 25px 0;

  color: #333;
  text-align: left;
  padding-left: 15%;
  font-family: 'Gamja Flower', sans-serif;
`;

const Donation = ({ closeModal, streamerId }) => {
  const [amount, setAmount] = useInput('');
  const [message, onChangeMessage] = useInput('');
  const [pointData, setPointData] = useState(null);
  const accessToken = localStorage.getItem('accessToken');

  const handleOutsideClick = (e) => {
    if (e.target === e.currentTarget) {
      closeModal();
    }
  };

  const fetchData = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/point`, {
        headers: {
          Authorization: accessToken,
        },
      });
      setPointData(response.data);
      console.log('GET 요청 성공:', response.data);
    } catch (error) {
      console.error('GET 요청 중 오류:', error);
    }
  };

  const handleDonation = async (e) => {
    e.preventDefault();

    if (amount < 0) {
      alert('음수로는 후원할 수 없어요');
      return;
    }

    const donationData = {
      donatePoint: amount,
      contents: message,
    };

    console.log(streamerId);

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/${streamerId}/donations`,
        donationData,
        {
          headers: {
            Authorization: accessToken,
          },
        }
      );

      console.log('Donation successful:', response.data);
      // Handle success - maybe show a message or update UI
      closeModal();
    } catch (error) {
      console.error('Error making donation:', error);
      // Handle error - show error message or handle accordingly
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <ModalBackground onClick={handleOutsideClick}>
      <Modal>
        <Title>Lemon</Title>
        {pointData ? (
          <CurrentPoints>
            {pointData.nickname}님의 현재 레몬 : {pointData.point}
          </CurrentPoints>
        ) : null}
        <form onSubmit={handleDonation}>
          <Label htmlFor='amount'>후원할 레몬</Label>
          <InputField
            type='number'
            id='amount'
            placeholder='0'
            value={amount}
            onChange={setAmount}
          />
          <Label htmlFor='message'>후원 메세지</Label>
          <InputField
            type='text'
            id='message'
            placeholder='메세지를 입력하세요.'
            value={message}
            onChange={onChangeMessage}
          />
          <SubmitButton type='submit'>후원하기</SubmitButton>
        </form>
      </Modal>
    </ModalBackground>
  );
};

export default Donation;
