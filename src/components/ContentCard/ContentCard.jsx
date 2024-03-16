
import './ContentCard.css'

function ContentCard(props){
    return(
        <div className='content-card-div'>
            <img className='card-img' src={`http://localhost:1337${props.image}`} alt="" />
            <div className='card-bottom'>
                <p>{`${props.year} - ${props.type==='movie'?'Movie':'TV Series'}`}</p>
                <p className='card-title'>{props.title}</p>
            </div>
           
        </div>
    );
}

export default ContentCard;