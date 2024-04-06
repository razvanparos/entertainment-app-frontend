import { useEffect, useState } from 'react';
import './Dashboard.css'
import { useNavigate } from 'react-router-dom';
import ContentCard from '../../components/ContentCard/ContentCard';
import Navbar from '../../components/Navbar/Navbar';
import Loader from '../../components/Loader/Loader';
import {db} from '../../config/firebase';
import {getDocs, collection, query, where, doc, setDoc} from 'firebase/firestore';

function Dashboard(){
    const navigate = useNavigate();
    const [isLoggedIn, setIsLoggedIn]=useState(localStorage.getItem('LoggedIn'));
    const [searchInput, setSearchInput]=useState('');
    const [searchFor, setSearchFor]=useState('movies or TV series');
    const [contentData, setContentData]=useState([]);
    const [originalContentData, setOriginalContentData]=useState([]);
    const [loadingContentData, setLoadingContentData] = useState(false);
    const [bookmarked, setBookmarked]=useState();

    const contentsCollectionRef = collection(db,'contents')
    const bookmarkedList = collection(db,'UsersBookmarkedList')

    useEffect(() => {
      if (isLoggedIn === "false" || !isLoggedIn) {
            navigate('/login');
        }  
    }, [isLoggedIn]);
    
    useEffect(() => {
        let currentUID = localStorage.getItem('currentUserId')
        const getUserData = async () =>{
            try{
                const q = query(bookmarkedList, where("id", "==", currentUID));
                const querySnapshot = await getDocs(q);
                const filteredData = querySnapshot.docs.map((doc)=>({
                   ...doc.data(),
                   id: doc.id,
               }))
                console.log(filteredData[0].bookmarked);
                setBookmarked(filteredData[0].bookmarked)
               } catch(err){
                   console.log(err)
               }
            
        }
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
        getUserData();
        getContentData();
    }, []);
    
    useEffect(() => {
    }, [contentData]);

    useEffect(() => {
        if(bookmarked){
            let currentUID = localStorage.getItem('currentUserId')
        const updateBookmarked = async () =>{
            try{
                console.log(bookmarked)
                await setDoc(doc(db, "UsersBookmarkedList", currentUID ), {
                    bookmarked: bookmarked,
                    id: currentUID
                });
            }catch(err){
                console.log(err)
            }
        }
        updateBookmarked();
        }
        
        
    }, [bookmarked]);
  
    
    useEffect(() => {
        let originalData=originalContentData;
        const filteredData = originalData.filter(item => item.title.toLowerCase().includes(searchInput.toLowerCase()));
        setContentData(filteredData);       
    }, [searchInput]);

    const handleChangeFilter=(filter)=>{
        setSearchInput('')
        let filterQuery=['movie','series'];
        let showBookmarked=false;
        const getFilteredContentData = async (filterQuery,showBookmarked)=>{
            const q = query(contentsCollectionRef, where("type", "in", filterQuery));
            const querySnapshot = await getDocs(q);
            const filteredData = querySnapshot.docs.map((doc)=>({
                ...doc.data(),
                id: doc.id,
            }))
            if(showBookmarked===true){
                let filteredBookmarked = filteredData.filter(f=>bookmarked.includes(f.id))
                setOriginalContentData(filteredBookmarked)
                setContentData(filteredBookmarked)  
            }else{
                setContentData(filteredData)
                setOriginalContentData(filteredData)
            }
            
        }
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
            case 'saved':
                setSearchFor('bookmarked shows')
                filterQuery=['movie','series']
                showBookmarked=true
                break;
        }
        getFilteredContentData(filterQuery,showBookmarked);
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
 
    return(
        <div className="dashboard-div">
            <Navbar
                handleChangeFilter={handleChangeFilter}
                signOut={signOut}
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
