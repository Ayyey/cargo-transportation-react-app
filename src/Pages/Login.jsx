import React, { useState } from 'react'
import AuthService from '../API/AuthService';
export default function Login({ setToken, setRole, navigate }) {
    const [login, setLogin] = useState(null);
    const [password, setPassword] = useState(null);
    const [isError, setIsError] = useState(false);
    const handleLogin = async () => {
        try {
            const AuthData = await AuthService.login(login,password);
            localStorage.setItem('token',AuthData.token);
            localStorage.setItem('role',AuthData.role)
            setToken(AuthData.token);
            setRole(AuthData.role);
            navigate('home')
        } catch (error) {
            console.log('bruh');
        }
    }
    return (
        <div className="form-signin mx-auto mt-5" style={{ maxWidth: '400px' }}>
            <h1 className="h3 mb-3 font-weight-normal">Вход</h1>
            <label htmlFor="inputEmail" className="sr-only">Логин</label>
            <input type="text" id="inputEmail" className="form-control" placeholder="Логин" required autoFocus v-model="username" onChange={(e)=>{setLogin(e.target.value)}}/>
            <label htmlFor="inputPassword" className="sr-only">Пароль</label>
            <input type="password" id="inputPassword" className="form-control" placeholder="Пароль" required="" v-model="password" onKeyUp={(e)=>{if(e.key ==="Enter") handleLogin()}} onChange={(e)=>{setPassword(e.target.value)}}/>
            <div className="text-danger"></div>
            <button className="mt-3 btn btn-lg btn-primary btn-block" onClick={handleLogin}>Войти</button>
        </div>
    )
}
