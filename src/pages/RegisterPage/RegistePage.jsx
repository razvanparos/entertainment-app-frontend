import { useState } from 'react'
import './RegisterPage.css'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {auth} from '../../config/firebase';
import {createUserWithEmailAndPassword} from 'firebase/auth';

function RegisterPage(){
    const [inputUsername, setInputUsername] = useState('')
    const [inputEmail, setInputEmail] = useState('')
    const [inputPassword, setInputPassword] = useState('')
    const [errorMsg, setErrorMsg] = useState('')
    const navigate = useNavigate();

    
    const handleRegister=async(e)=>{
        e.preventDefault();
        if(inputUsername && inputEmail && inputPassword){
          try{
            await createUserWithEmailAndPassword(auth, inputEmail, inputPassword);
            navigate('/')
          } catch(err){
            console.log(err)
            setErrorMsg(err.message)
          }
            // axios.post('http://localhost:1337/api/auth/local/register', {
            //     username: inputUsername,
            //     email: inputEmail,
            //     password: inputPassword,
            // })
            // .then(response => {
            //   if(response.status===200){
            //     navigate('/')
            //   } 
            // })
            // .catch(error => {
            //   setErrorMsg(error.response.data.error.message)
            // }); 
    }
        
    }
    return(
        <div className="register-page-div">
            <form action="" className='login-form'>
                <h2>REGISTER</h2>
                <input className='input' type="text" placeholder='Username' value={inputUsername} onChange={(e)=>{setInputUsername(e.target.value)}}/>
                <input className='input' type="email" placeholder='Email' value={inputEmail} onChange={(e)=>{setInputEmail(e.target.value)}}/>
                <input className='input' type="password" placeholder='Password' value={inputPassword} onChange={(e)=>{setInputPassword(e.target.value)}}/>
                <p className={`error ${errorMsg===''?'off':'on'}`}>{errorMsg}</p>
                <button className="login-button" onClick={handleRegister}>Register</button>
            </form>
        </div>
    );
}

export default RegisterPage;