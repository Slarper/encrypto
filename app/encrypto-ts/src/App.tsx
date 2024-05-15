import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import ProviderOrUser from './pages/ProviderOrUser';
import Provider from './pages/Provider';
import User from './pages/User';
import All from './pages/All';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="providerOrUser" element={<ProviderOrUser />} />
        <Route path='/provider' element={<Provider/>} />
        <Route path='/user' element={<User/>} />
        <Route path='/all' element={<All/>} />
      </Routes>
    </Router>
  );
}

export default App;
