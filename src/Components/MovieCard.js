import '../css/MovieCard.css'
import {useMovieContext} from'../Contexts/MovieContext'

function MovieCard({movie}) {
    const{isFavorite, addToFavorites, removeFromFavorites}= useMovieContext();
    const favorite=isFavorite(movie.id)

    const onFavoriteClick=(e)=>{
        e.preventDefault()
        if(favorite){
            removeFromFavorites(movie.id)
        }else{
            addToFavorites(movie)
        }
    }

    return(
        <div className="movie-card">
            <div className="movie-poster">
                <img src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} alt={movie.title} height="300"/>
                <div className="movie-overlay">
                    <button onClick={onFavoriteClick} className={`favorite-btn ${favorite? "active": ""}`}>{favorite ? "❤️" : "🤍"}</button>
                </div>
                <div className="movie-info">
                    <h1>{movie.title}</h1>
                    <p>{movie.release_date.split("-")[0]}</p>
                </div>
            </div>
        </div>
    )
}

export default MovieCard