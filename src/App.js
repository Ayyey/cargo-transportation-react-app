import './App.css';
import React, { useState, useEffect } from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';
import Service from './API/Service';
import Login from './Pages/Login';
import Home from './Pages/Home';
import Modal from 'react-modal/lib/components/Modal';
import logo from './public/logo.png'
Modal.setAppElement('#root');
function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [role, setRole] = useState(localStorage.getItem('role'));
  const [userId, setUserId] = useState(localStorage.getItem('userId'))
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
      <header className="bg-dark text-white p-2">
        <div className="container d-flex">
          <img src={logo} alt="logo" data-v-95162518="" style={{ width: "40px", height: "40px" }} />
          <h3 className="mx-3">Оптимизация грузоперевозок</h3>
          <h3 style={{ marginLeft: "auto" }}>{role == 'ADMIN' ? "Администратор" : "Водитель "}</h3>
          <button className="btn btn-danger" style={{ marginLeft: "auto" }} onClick={() => { localStorage.clear(); navigate('login') }}>
            Выход
          </button>
        </div>
      </header >
      <Routes>
        <Route path='/login' element={<Login setToken={setToken} setRole={setRole} navigate={navigate}></Login>}></Route>
        <Route path='/home/*' element={<Home role={role} token={token} navigate={navigate} userId={userId}></Home>}></Route>
      </Routes>
    </div>
  );
}

export default App;
