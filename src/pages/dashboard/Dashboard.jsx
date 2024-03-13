import { useEffect, useState } from 'react';
import './Dashboard.css'
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import ContentCard from '../../components/ContentCard/ContentCard';

function Dashboard(){
    const navigate = useNavigate();
    const [isLoggedIn, setIsLoggedIn]=useState(localStorage.getItem('LoggedIn'));
    const [currentUserId, setCurrentUserId]=useState(localStorage.getItem('currentUserId'));
    const [userData, setUserData]=useState('');
    const [contentData, setContentData]=useState([]);
    const [loading, setLoading]=useState(false);
    
    useEffect(() => {
        if (isLoggedIn === "false" || !isLoggedIn) {
            navigate('/login');
        }
    }, [isLoggedIn]);
    useEffect(() => {
        setLoading(true);
        axios.get(`http://localhost:1337/api/users/${currentUserId}`)
            .then(response=>{
                setUserData(response.data)
                setLoading(false);
            })
            .catch(error => {
                console.error('Error fetching user data:', error);
            });
    }, []);
    useEffect(() => {
        axios.get(`http://localhost:1337/api/contents?populate=*&pagination[pageSize]=30`)
            .then(response=>{
                setContentData(response.data.data) 
                
            })
            .catch(error => {
                console.error('Error fetching user data:', error);
            });
    }, []);
    useEffect(() => {
       console.log(contentData)
    }, [contentData]);
    
    
    return(
        <div className="dashboard-div">
            {/* <p className={`welcome`}>{`${loading?'loading...':`Welcome, ${userData.username}`}`}</p>
            <button onClick={()=>{
                localStorage.setItem('LoggedIn',false)
                localStorage.setItem('RememberMe',false)
                localStorage.setItem('currentUserId',0)
                navigate('/login')
            }}>Sign Out</button> */}
           <div className='contents-div'>
                {contentData && contentData.map((c) => (
                 <ContentCard
                    key={c.id}
                    title={c.attributes.title}
                    image={c.attributes.image.data.attributes.url}
                 /> 
                ))}
            </div>
        </div>
    );
}

export default Dashboard;