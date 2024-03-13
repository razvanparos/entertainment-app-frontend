import { useState } from 'react'
import './RegisterPage.css'
import axios from 'axios';

function RegisterPage(){
    const [inputUsername, setInputUsername] = useState('')
    const [inputEmail, setInputEmail] = useState('')
    const [inputPassword, setInputPassword] = useState('')
    
    const handleRegister=(e)=>{
        e.preventDefault();
        if(inputUsername && inputEmail && inputPassword){
            axios
            .post('http://localhost:1337/api/auth/local/register', {
                username: inputUsername,
                email: inputEmail,
                password: inputPassword,
            })
            .then(response => {
              console.log('User profile', response.data.user);
              console.log('User token', response.data.jwt);
            })
            .catch(error => {
              console.log('An error occurred:', error.response);
            });
      
    }
        
    }
    return(
        <div className="register-page-div">
            <form action="" className='login-form'>
                <h2>REGISTER</h2>
                <input className='input' type="text" placeholder='Username' value={inputUsername} onChange={(e)=>{setInputUsername(e.target.value)}}/>
                <input className='input' type="email" placeholder='Email' value={inputEmail} onChange={(e)=>{setInputEmail(e.target.value)}}/>
                <input className='input' type="password" placeholder='Password' value={inputPassword} onChange={(e)=>{setInputPassword(e.target.value)}}/>
                <button className="login-button" onClick={handleRegister}>Register</button>
            </form>
        </div>
    );
}

export default RegisterPage;