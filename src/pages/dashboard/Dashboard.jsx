import { useEffect, useState } from 'react';
import './Dashboard.css'
import { useNavigate } from 'react-router-dom';
import axios, { all } from 'axios';
import ContentCard from '../../components/ContentCard/ContentCard';
import Navbar from '../../components/Navbar/Navbar';
import Loader from '../../components/Loader/Loader';

function Dashboard(){
    const navigate = useNavigate();
    const [isLoggedIn, setIsLoggedIn]=useState(localStorage.getItem('LoggedIn'));
    const [currentUserId, setCurrentUserId]=useState(localStorage.getItem('currentUserId'));
    const [userData, setUserData]=useState('');
    const [searchInput, setSearchInput]=useState('');
    const [searchFor, setSearchFor]=useState('movies or TV series');
    const [contentData, setContentData]=useState([]);
    const [bookmarked, setBookmarked]=useState([]);
    const [originalContentData, setOriginalContentData]=useState([]);
    const [loadingUserData, setLoadingUserData] = useState(false);
    const [loadingContentData, setLoadingContentData] = useState(false);
    
    useEffect(() => {
        if (isLoggedIn === "false" || !isLoggedIn) {
            navigate('/login');
        }
    }, [isLoggedIn]);
    
    useEffect(() => {
        setLoadingUserData(true);
        axios.get(`http://localhost:1337/api/users/${currentUserId}`)
            .then(response=>{
                setUserData(response.data)
                setBookmarked(response.data.bookmarkedContent)
                setLoadingUserData(false);
            })
            .catch(error => {
                console.error('Error fetching user data:', error);
            });
    }, []);
    useEffect(() => {
        setLoadingContentData(true);
        setTimeout(() => {
             axios.get(`http://localhost:1337/api/contents?populate=*&pagination[pageSize]=30`)
            .then(response=>{
                setContentData(response.data.data)
                setLoadingContentData(false);      
            })
            .catch(error => {
                console.error('Error fetching user data:', error);
            });
          }, "50");
       
    }, []);
    useEffect(() => {
       console.log(contentData)
    }, [contentData]);
    useEffect(() => {
       axios.put(`http://localhost:1337/api/users/${currentUserId}`, {
        bookmarkedContent: bookmarked
    })
    }, [bookmarked]);
  
    
    useEffect(() => {
        let originalData=originalContentData;
        const filteredData = originalData.filter(item => item.attributes.title.toLowerCase().includes(searchInput.toLowerCase()));
        setContentData(filteredData);       
    }, [searchInput]);

    const handleChangeFilter=(filter)=>{
        setSearchInput('')
        let filterQuery='';
        switch(filter){
            case 'movie':
                setSearchFor('movies')
                filterQuery=`filters[type][$eq]=${filter}&`;
                break;
            case 'series':
                setSearchFor('TV series')
                filterQuery=`filters[type][$eq]=${filter}&`;
                break;
            case 'all':
                setSearchFor('movies or TV series')
                filterQuery=``;
                break;
        }
        setLoadingContentData(true);
        setTimeout(() => {
            axios.get(`http://localhost:1337/api/contents?${filterQuery}populate=*&pagination[pageSize]=30`)
            .then(response=>{
                setContentData(response.data.data)  
                setOriginalContentData(response.data.data)
                setLoadingContentData(false);    
            })
            .catch(error => {
                console.error('Error fetching user data:', error);
            });
          }, "50");
    }

    const signOut = () =>{
        localStorage.setItem('LoggedIn',false)
        localStorage.setItem('RememberMe',false)
        localStorage.setItem('currentUserId',0)
        navigate('/');
    }
    const addToBookmarked  = (id) => {
        if (bookmarked.includes(id)) {
            setBookmarked(prevBookmarked => prevBookmarked.filter(itemId => itemId !== id));
        } else {
            setBookmarked(prevBookmarked => [...prevBookmarked, id]);
        }
    }
    const showBookmarked = () => {
        setSearchFor('bookmarked shows')
        setLoadingContentData(true);
        setTimeout(() => {
            axios.get(`http://localhost:1337/api/contents?populate=*&pagination[pageSize]=30`)
            .then(response=>{
                let filterBookmarked = response.data.data.filter(f=>bookmarked.includes(f.id));
                console.log(filterBookmarked)
                setOriginalContentData(filterBookmarked)
                setContentData(filterBookmarked)  
                setLoadingContentData(false);    
            })
            .catch(error => {
                console.error('Error fetching user data:', error);
            });
          }, "50");
    }

    return(
        <div className="dashboard-div">
            <Navbar
                handleChangeFilter={handleChangeFilter}
                signOut={signOut}
                showBookmarked={showBookmarked}
            />
            <div className='desktop-container'> 
            <div className='search-div'>
                <img className='search-icon' src={`https://lm-entertainment-app.netlify.app/static/media/icon-search.b3ef91bd.svg`} alt="" />
                <input value={searchInput} onChange={(e)=>{setSearchInput(e.target.value)}} className='search-bar' type="text" placeholder={`Search for ${searchFor}`}/>
            </div>
            <p className='content-div-top'>Trending</p>
            <div className='trending-div'>
                {loadingContentData ? <Loader/> : contentData.map((c) => (
                    c.attributes.trending ? (
                        <ContentCard
                            key={c.id}
                            id={c.id}
                            title={c.attributes.title}
                            image={c.attributes.image.data.attributes.url}
                            year={c.attributes.year}
                            type={c.attributes.type}
                            trending={c.attributes.trending}
                            restriction={c.attributes.restriction}
                            addToBookmarked={addToBookmarked}
                            bookmarked={bookmarked}
                        /> ) : null
                ))}
            </div>
            <p className='content-div-top'>Recommended for you</p>
           <div className='contents-div'>
                {loadingContentData ? <Loader/> : contentData.map((c) => (
                 !c.attributes.trending ? (
                 <ContentCard
                    key={c.id}
                    id={c.id}
                    title={c.attributes.title}
                    image={c.attributes.image.data.attributes.url}
                    year={c.attributes.year}
                    type={c.attributes.type}
                    trending={c.attributes.trending}
                    restriction={c.attributes.restriction}
                    addToBookmarked={addToBookmarked}
                    bookmarked={bookmarked}
                 /> ) : null
                ))}
            </div>
            </div>
        </div>
    );
}

export default Dashboard;  
