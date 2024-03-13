import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
function CheckLoggedIn() {
    const navigate = useNavigate();

    useEffect(() => {
        let rememberMe = localStorage.getItem('RememberMe') === 'true'; 
        console.log(rememberMe)
        if(rememberMe===false){
            localStorage.setItem('LoggedIn',false)
        }
        let loggedIn = localStorage.getItem('LoggedIn') === 'true'; 
        if (loggedIn) {
            console.log('logged in');
            navigate('/dashboard');
        } else {
            console.log('not logged in');
            navigate('/login');
        }
    }, []); 

    return null;
}

export default CheckLoggedIn;