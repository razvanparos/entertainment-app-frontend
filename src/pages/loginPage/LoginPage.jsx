import './LoginPage.css';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaCheck } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';

function LoginPage() {
  const [inputUsername, setInputUsername] = useState('')
  const [inputPassword, setInputPassword] = useState('')
  const [rememberMe, setRememberMe] = useState(false)
  const [showError, setShowError] = useState(false)
  const [result, setResult] = useState()
  const navigate = useNavigate();

  useEffect(()=>{
    axios.get(`http://localhost:1337/api/users`)
      .then(response=>{
        console.log(response.data)
        setShowError(false)
    })
    .catch(error => {
        console.error('Error fetching user data:', error);
        setShowError(true)
    });
  },[])

  const handleSubmit=(e)=>{
    e.preventDefault();
    if(inputUsername && inputPassword){
      axios.post('http://localhost:1337/api/auth/local', {
        identifier: `${inputUsername}`,
        password: `${inputPassword}`,
      })
    .then(response=>{
      if(response.status===200){
        navigate('/dashboard')
        localStorage.setItem('LoggedIn',true)
        localStorage.setItem('currentUserId',response.data.user.id)
        if(rememberMe===true){
          localStorage.setItem('RememberMe',true)
        }
      }
    })
    .catch(error => {
      setResult('Invalid username or password!')
      console.error('Error fetching user data:', error);
      });
    }
  }

  return (
    <div className="login-page-div">
    <div className={`not-connected ${showError?'':'hideError'}`}>
        Network error: Backend not connected
    </div>
        <form className='login-form'>
            <h2>LOGIN</h2>
            <input className='input' type="text" placeholder='Username' value={inputUsername} onChange={(e)=>{setInputUsername(e.target.value)}}/>
            <input className='input' type="password" placeholder='Password' value={inputPassword} onChange={(e)=>{setInputPassword(e.target.value)}}/>
            <div className='remember-me'>
              <div className={`${rememberMe?'hidden':'remember-me-checkbox-false'}`} onClick={()=>{setRememberMe(!rememberMe)}}></div>
              <div className={`${rememberMe?'remember-me-checkbox-true':'hidden'}`}  onClick={()=>{setRememberMe(!rememberMe)}}><FaCheck /></div>
              <p>Remember me</p>
            </div>
            <button className="login-button" onClick={handleSubmit}>Login</button>
            <p className='error-msg'>{result}</p>
            <p>Not a member? <a href='/register' className='register-button'>Register now!</a></p>
        </form>
    </div>
  );
}

export default LoginPage;
