import React, { useState, useEffect } from 'react';
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

const InputField = styled.input.attrs({ type: 'number' })`
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

const PaymentsModal = ({ closeModal }) => {
  const [amount, setAmount] = useInput('');
  const [pointData, setPointData] = useState(null);
  const accessToken = localStorage.getItem('accessToken');

  const handleOutsideClick = (e) => {
    if (e.target === e.currentTarget) {
      closeModal();
    }
  };

  const fetchData = async () => {
    try {
      const response = await axios.get('http://localhost:8081/api/point', {
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

  const sendAmountToServer = async (amount) => {
    try {
      const response = await axios.post(
        'http://localhost:8081/api/point',
        {
          point: amount,
        },
        {
          headers: {
            Authorization: accessToken,
          },
        }
      );
      if (response.status === 200) {
        closeModal();
        // alert('서버로 amount 전송 완료');
      } else {
        alert('서버로 amount 전송 실패');
      }
    } catch (error) {
      console.error('서버로 amount 전송 중 오류:', error);
      alert('서버로 amount 전송 중 오류 발생');
    }
  };
  const requestPay = (e) => {
    e.preventDefault();

    const { IMP } = window;
    IMP.init('imp82385247');
    IMP.request_pay(
      {
        pg: 'kakaopay.TC0ONETIME',
        pay_method: 'card',
        merchant_uid: new Date().getTime(),
        name: '후원용',
        amount: amount,
      },
      async (rsp) => {
        try {
          const { data } = await axios.post(
            'http://localhost:8081/verifyIamport/' + rsp.imp_uid
          );
          if (rsp.paid_amount === data.response.amount) {
            alert('결제 성공');
            sendAmountToServer(rsp.paid_amount);
          } else {
            alert('결제 실패');
          }
        } catch (error) {
          console.error('결제 검증 중 오류:', error);
          alert('결제 실패');
        }
      }
    );
  };
  useEffect(() => {
    fetchData();
    const jquery = document.createElement('script');
    jquery.src = 'http://code.jquery.com/jquery-1.12.4.min.js';
    const iamport = document.createElement('script');
    iamport.src = 'http://cdn.iamport.kr/js/iamport.payment-1.1.7.js';
    document.head.appendChild(jquery);
    document.head.appendChild(iamport);
    return () => {
      document.head.removeChild(jquery);
      document.head.removeChild(iamport);
    };
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
        <form onSubmit={requestPay}>
          <Label htmlFor='loginId'>충전할 금액</Label>
          <InputField
            type='number'
            id='number'
            placeholder='0'
            value={amount}
            onChange={setAmount}
          />
          <SubmitButton type='submit'>결제하기</SubmitButton>
        </form>
      </Modal>
    </ModalBackground>
  );
};

export default PaymentsModal;
