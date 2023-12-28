const ChatTokenApiTest = () => {
  const accessToken = localStorage.getItem("accessToken");

  const fetchData = async () => {
    try {
      const response = await fetch("http://localhost:8081/api/auth/chat", {
        method: "POST",
        headers: {
          Authorization: accessToken,
        },
      });
      if (!response.ok) {
        throw new Error("Network response was not ok.");
      }
      const data = await response.json();
      console.log("chatToken:", data.chatToken);
    } catch (error) {
      console.error("데이터를 불러오는 중 오류가 발생했습니다:", error);
    }
  };
  fetchData();
  return (
    <>
      <div>chatToken.chatToken</div>
    </>
  );
};

export default ChatTokenApiTest;
