import '../css/MovieCard.css'
import {Link} from 'react-router-dom'
import {useMovieContext} from'../Contexts/MovieContext'
import {imageUrl} from '../services/api'
import RatingBadge from './RatingBadge'
import HeartIcon from './HeartIcon'

function MovieCard({movie}) {
    const{isFavorite, addToFavorites, removeFromFavorites}= useMovieContext();
    const favorite=isFavorite(movie.id)
    const poster=imageUrl(movie.poster_path)
    const year=movie.release_date ? movie.release_date.split("-")[0] : "TBA"

    const onFavoriteClick=(e)=>{
        // The whole card is a link, so stop the click from navigating
        e.preventDefault()
        e.stopPropagation()
        if(favorite){
            removeFromFavorites(movie.id)
        }else{
            addToFavorites(movie)
        }
    }

    return(
        <Link to={`/movie/${movie.id}`} className="movie-card">
            <div className="movie-poster">
                {poster
                    ? <img src={poster} alt={movie.title} loading="lazy"/>
                    : <div className="poster-fallback">{movie.title}</div>}
                <div className="movie-overlay">
                    <span className="view-details">View details →</span>
                </div>
                <button onClick={onFavoriteClick} className={`favorite-btn ${favorite? "active": ""}`} aria-label={favorite ? "Remove from favorites" : "Add to favorites"}><HeartIcon filled={favorite} size={20}/></button>
                {movie.vote_count > 0 && (
                    <div className="card-rating"><RatingBadge rating={movie.vote_average} size={44}/></div>
                )}
            </div>
            <div className="movie-info">
                <h3>{movie.title}</h3>
                <p>{year}</p>
            </div>
        </Link>
    )
}

export default MovieCard
