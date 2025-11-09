import '../css/Navbar.css'
import {Link}from 'react-router-dom' 
function NavBar(){
    return <nav className='navbar'>
        <div classname="navbar-brand">
            <Link to="/">FAVO</Link>
        </div>
        <div className="navbar-Links">
            <Link to="/" className="nav-link">Home</Link>
            <Link to="/Favorites" className="nav-link">Favorites</Link>
        </div>
    </nav>
}
export default NavBar;