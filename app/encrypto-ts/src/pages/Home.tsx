import { useNavigate } from "react-router-dom";

function Home() {
    const navigate = useNavigate();

    const goToAnotherPage = () => {
      // This will navigate to the desired path
      navigate('/providerOrUser');
    };
  return (
    <div className="App">
      <h1>Home</h1>
      <button onClick={goToAnotherPage}>Welcome!</button>
      <button onClick={()=>navigate('/all')}>All!</button>
    </div>
  );
}

export default Home;