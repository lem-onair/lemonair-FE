import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Payment = () => {
  const [point, setPoint] = useState(1004);

  useEffect(() => {
    const loadIamportScript = () => {
      const jquery = document.createElement("script");
      jquery.src = "http://code.jquery.com/jquery-1.12.4.min.js";
      const iamport = document.createElement("script");
      iamport.src = "http://cdn.iamport.kr/js/iamport.payment-1.1.7.js";

      iamport.onload = () => {
        initializeIamport();
      };

      document.head.appendChild(jquery);
      document.head.appendChild(iamport);
    };

    const initializeIamport = () => {
      const { IMP } = window;
      if (IMP) {
        IMP.init('imp82385247');
      } else {
        console.error('IMP 객체를 찾을 수 없습니다.');
      }
    };

    loadIamportScript();
  }, []);
  
  const sendPointToServer = async (paidPoint) => {
    try {
      const addPointRequestDto = {
        point:paidPoint,
        // 필요한 다른 데이터도 추가 가능
      };

      const response = await axios.post('http://localhost:8081/api/point', addPointRequestDto, {
        headers: {
          'Content-Type': 'application/json',
        }
      });
      console.log('서버 응답:', response.data);
      return response.data;
    } catch (error) {
      if (error.response) {
        console.error('서버 응답 에러:', error.response.data);
        console.error('상태코드:', error.response.status);
        console.error('응답 헤더:', error.response.headers);
      } else if (error.request) {
        console.error('요청 에러:', error.request);
      } else {
        console.error('오류:', error.message);
      }
      console.error('에러 구성:', error.config);
      throw error;
    }
  };

  const requestPay = () => {
    const { IMP } = window;
    if (IMP) {
      IMP.request_pay({
        pg: 'kakaopay.TC0ONETIME',
        pay_method: 'card',
        merchant_uid: new Date().getTime(),
        name: 'lemon',
        amount: point,
      }, async (rsp) => {
        try {
          if (rsp.success) {
            alert('결제 성공');
            await sendPointToServer(rsp.paid_amount);
          } else {
            alert('결제 실패');
          }
        } catch (error) {
          console.error('결제 검증 중 오류 발생:', error);
          alert('결제 실패');
        }
      });
    } else {
      console.error('IMP 객체를 찾을 수 없습니다.');
    }
  };

  const handleChangePoint = (e) => {
    const inputPoint = parseInt(e.target.value);
    if (!isNaN(inputPoint)) {
      setPoint(inputPoint);
    }
  };

  return (
    <div>
      <input
        type="text"
        value={point}
        onChange={handleChangePoint}
        placeholder="결제할 포인트 입력"
      />
      <button onClick={requestPay}>결제하기</button>
    </div>
  );
};


export default Payment;