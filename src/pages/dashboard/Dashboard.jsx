import { useEffect, useState } from 'react';
import './Dashboard.css'
import { useNavigate } from 'react-router-dom';
import axios, { all } from 'axios';
import ContentCard from '../../components/ContentCard/ContentCard';
import Navbar from '../../components/Navbar/Navbar';
import Loader from '../../components/Loader/Loader';
import {auth} from '../../config/firebase';
import {signOut} from 'firebase/auth';
import {db} from '../../config/firebase';
import {getDocs, collection, query, where} from 'firebase/firestore';

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
    const [loadingContentData, setLoadingContentData] = useState(false);

    const contentsCollectionRef = collection(db,'contents')
    
    
    useEffect(() => {
        if (isLoggedIn === "false" || !isLoggedIn) {
            navigate('/login');
        }
    }, [isLoggedIn]);
    
    useEffect(() => {
        // axios.get(`http://localhost:1337/api/users/${currentUserId}`)
        //     .then(response=>{
        //         setUserData(response.data)
        //         setBookmarked(response.data.bookmarkedContent)
        //     })
        //     .catch(error => {
        //         console.error('Error fetching user data:', error);
        //     });
    }, []);
    useEffect(() => {
        const getContentData = async () =>{
            setLoadingContentData(true);
            try{
             const data = await getDocs(contentsCollectionRef)   
             setLoadingContentData(false);
             const filteredData = data.docs.map((doc)=>({
                ...doc.data(),
                id: doc.id,
            }))
             console.log(filteredData);
             setContentData(filteredData)
            } catch(err){
                console.log(err)
            }
            
        }
        getContentData();
        // setLoadingContentData(true);
        // setTimeout(() => {
        //      axios.get(`http://localhost:1337/api/contents?populate=*&pagination[pageSize]=30`)
        //     .then(response=>{
        //         setContentData(response.data.data)
        //         setLoadingContentData(false);      
        //     })
        //     .catch(error => {
        //         console.error('Error fetching user data:', error);
        //     });
        //   }, "500");
       
    }, []);
    useEffect(() => {
    }, [contentData]);
    useEffect(() => {
    //     if(!bookmarked){
    //         setBookmarked([]);
    //     }
    //    axios.put(`http://localhost:1337/api/users/${currentUserId}`, {
    //     bookmarkedContent: bookmarked
    // })
    }, [bookmarked]);
  
    
    useEffect(() => {
        let originalData=originalContentData;
        const filteredData = originalData.filter(item => item.title.toLowerCase().includes(searchInput.toLowerCase()));
        setContentData(filteredData);       
    }, [searchInput]);

    const handleChangeFilter=(filter)=>{
        const getFilteredContentData = async (filterQuery)=>{
            const q = query(contentsCollectionRef, where("type", "in", filterQuery));
            const querySnapshot = await getDocs(q);
            const filteredData = querySnapshot.docs.map((doc)=>({
                ...doc.data(),
                id: doc.id,
            }))
            console.log(filteredData)
            setContentData(filteredData)
            setOriginalContentData(filteredData)
        }
        setSearchInput('')
        let filterQuery=['movie','series'];
        switch(filter){
            case 'movie':
                setSearchFor('movies')
                filterQuery=['movie']
                break;

            case 'series':
                setSearchFor('TV series')
                filterQuery=['series']
                break;
            
            case 'all':
                setSearchFor('movies or TV series')
                filterQuery=['movie','series']
                break;
        }
        getFilteredContentData(filterQuery);
        // setLoadingContentData(true);
        // setTimeout(() => {
        //     axios.get(`http://localhost:1337/api/contents?${filterQuery}populate=*&pagination[pageSize]=30`)
        //     .then(response=>{
        //         setContentData(response.data.data)  
        //         setOriginalContentData(response.data.data)
        //         setLoadingContentData(false);    
        //     })
        //     .catch(error => {
        //         console.error('Error fetching user data:', error);
        //     });
        //   }, "50");
        
    }

    const signOut = async () =>{
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
        // setLoadingContentData(true);
        // setTimeout(() => {
        //     axios.get(`http://localhost:1337/api/contents?populate=*&pagination[pageSize]=30`)
        //     .then(response=>{
        //         let filterBookmarked = response.data.data.filter(f=>bookmarked.includes(f.id));
        //         setOriginalContentData(filterBookmarked)
        //         setContentData(filterBookmarked)  
        //         setLoadingContentData(false);    
        //     })
        //     .catch(error => {
        //         console.error('Error fetching user data:', error);
        //     });
        //   }, "50");
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
            <p className={`content-div-top ${loadingContentData?'hidden':''}`}>Trending</p>
            <div className='trending-div'>
                {loadingContentData ? '' : contentData.map((c) => (
                    c.trending ? (
                        <ContentCard
                            key={c.id}
                            id={c.id}
                            title={c.title}
                            image={c.image}
                            year={c.year}
                            type={c.type}
                            trending={c.trending}
                            restriction={c.restriction}
                            addToBookmarked={addToBookmarked}
                            bookmarked={bookmarked}
                        /> ) : null
                ))}
            </div>
           <p className={`content-div-top ${loadingContentData?'hidden':''}`}>Recommended for you</p>
           <div className='contents-div'>
                {loadingContentData ? <Loader/> : contentData.map((c) => (
                 !c.trending ? (
                 <ContentCard
                    key={c.id}
                    id={c.id}
                    title={c.title}
                    image={c.image}
                    year={c.year}
                    type={c.type}
                    trending={c.trending}
                    restriction={c.restriction}
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
