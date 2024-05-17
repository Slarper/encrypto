import { useNavigate } from "react-router-dom";

function Home() {
    const navigate = useNavigate();

    const goToAnotherPage = () => {
      // This will navigate to the desired path
      navigate('/providerOrUser');
    };
  return (
    <div className="App">
      <h1>欢迎使用电力数据加密原型系统</h1>
      {/* <button onClick={goToAnotherPage}>Welcome!</button> */}
      <button onClick={()=>navigate('/all')}>点此进入</button>
    </div>
  );
}

export default Home;