import './LoginPage.css';
import React, { useState } from 'react';
import { FaCheck } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';
import {auth} from '../../config/firebase';
import {signInWithEmailAndPassword} from 'firebase/auth';

function LoginPage() {
  const [inputEmail, setInputEmail] = useState('')
  const [inputPassword, setInputPassword] = useState('')
  const [rememberMe, setRememberMe] = useState(false)
  const [result, setResult] = useState()
  const navigate = useNavigate();



  const handleSubmit = async (e)=>{
    e.preventDefault();
    if(inputEmail && inputPassword){
      try{
        await signInWithEmailAndPassword(auth, inputEmail, inputPassword);
        setResult()
        navigate('/dashboard')
        localStorage.setItem('LoggedIn',true)
        localStorage.setItem('currentUserId',auth.currentUser.uid)
        if(rememberMe===true){
          localStorage.setItem('RememberMe',true)
        }
      } catch(err){
        setResult('Invalid Credentials')
        console.error(err)
      }
    }
  }


  return (
    <div className="login-page-div">
        <form className='login-form'>
            <h2>LOGIN</h2>
            <input className='input' type="email" placeholder='Email' value={inputEmail} onChange={(e)=>{setInputEmail(e.target.value)}}/>
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
