import '../css/MovieCard.css'
import {Link} from 'react-router-dom'
import {archiveThumbnail} from '../services/archive'

function FreeMovieCard({movie}){
    return(
        <Link to={`/free/${encodeURIComponent(movie.identifier)}`} className="movie-card">
            <div className="movie-poster">
                <img src={archiveThumbnail(movie.identifier)} alt={movie.title} loading="lazy"/>
                <div className="movie-overlay">
                    <span className="view-details">▶ Watch &amp; download</span>
                </div>
                <span className="free-badge">FREE</span>
            </div>
            <div className="movie-info free">
                <h3>{movie.title}</h3>
                <p>{movie.year || 'Year unknown'}</p>
            </div>
        </Link>
    )
}

export default FreeMovieCard
