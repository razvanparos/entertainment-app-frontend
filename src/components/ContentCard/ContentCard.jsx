import './ContentCard.css'

function ContentCard(props){
    return(
        <div className='content-card-div'>
            <img className='card-img' src={`http://localhost:1337${props.image}`} alt="" />
            <p className='card-title'>{props.title}</p>
        </div>
    );
}

export default ContentCard;