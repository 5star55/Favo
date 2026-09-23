import '../css/Footer.css'
import {Link} from 'react-router-dom'

function Footer(){
    return(
        <footer className="footer">
            <div className="footer-inner">
                <div className="footer-brand">
                    <Link to="/" className="navbar-brand">
                        <span className="brand-icon">▶</span>
                        <span className="brand-text">FAVO</span>
                    </Link>
                    <p>Discover what's popular, dig into the details, and keep track of the movies you love.</p>
                </div>

                <div className="footer-col">
                    <h4>Explore</h4>
                    <Link to="/">Home</Link>
                    <Link to="/free">Free Classics</Link>
                    <Link to="/Favorites">My Favorites</Link>
                </div>

                <div className="footer-col">
                    <h4>Resources</h4>
                    <a href="https://www.themoviedb.org" target="_blank" rel="noreferrer">TMDB</a>
                    <a href="https://www.justwatch.com" target="_blank" rel="noreferrer">JustWatch</a>
                    <a href="https://archive.org/details/feature_films" target="_blank" rel="noreferrer">Internet Archive</a>
                    <a href="https://www.imdb.com" target="_blank" rel="noreferrer">IMDb</a>
                </div>
            </div>

            <div className="footer-bottom">
                <p>© {new Date().getFullYear()} FAVO, Inc. All rights reserved.</p>
                <p className="footer-credit">This product uses the TMDB API but is not endorsed or certified by TMDB.</p>
            </div>
        </footer>)
}
export default Footer;
