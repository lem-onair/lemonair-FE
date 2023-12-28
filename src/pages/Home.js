import React, { useEffect, useState } from "react";
import Header from "../components/header";
import styled from "styled-components";
import CardExample from "../components/Card";
import ChatTokenApiTest from "../sbltest/ChatTokenApiTest";

const ArticleContainer = styled.div`
  height: 20vh;
  background-color: #f8de7e;
  margin-bottom: 30px;
`;

const Home = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch("http://localhost:8081/api/channels")
      .then((response) => response.json())
      .then((data) => {
        setData(data);
        console.log(data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  return (
    <>
      <Header />
      <ArticleContainer></ArticleContainer>

      {data.length > 2 && <CardExample data={data} />}
      <ChatTokenApiTest></ChatTokenApiTest>
    </>
  );
};

export default Home;
