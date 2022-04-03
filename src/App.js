import './App.css';
import React, { useState, useEffect } from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';
import Service from './API/Service';
import Login from './Pages/Login';
import Home from './Pages/Home';
import Modal from 'react-modal/lib/components/Modal';
Modal.setAppElement('#root');
function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [role, setRole] = useState(localStorage.getItem('role'));
  const navigate = useNavigate();
  useEffect(() => {
    if (!token) {
      navigate('/login');
    }
    else {
      navigate('/home')
    }
  }, [])
  return (
    <div className="App" id="App">
      <header className="App-header">
        <Routes>
          <Route path='/login' element={<Login setToken={setToken} setRole={setRole} navigate={navigate}></Login>}></Route>
          <Route path='/home/*' element={<Home role={role} token={token} navigate={navigate}></Home>}></Route>
        </Routes>
      </header>
    </div>
  );
}

export default App;
