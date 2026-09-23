import '../css/Navbar.css'
import { useEffect, useState } from 'react'
import {Link, NavLink}from 'react-router-dom'
import {useMovieContext} from '../Contexts/MovieContext'
import HeartIcon from './HeartIcon'

function NavBar(){
    const {favorites}=useMovieContext()
    const [scrolled, setScrolled]=useState(false)

    useEffect(()=>{
        const onScroll=()=>setScrolled(window.scrollY>10)
        onScroll()
        window.addEventListener('scroll', onScroll, {passive:true})
        return ()=>window.removeEventListener('scroll', onScroll)
    },[])

    return <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
        <Link to="/" className="navbar-brand">
            <span className="brand-icon">▶</span>
            <span className="brand-text">FAVO</span>
        </Link>
        <div className="navbar-links">
            <NavLink to="/" end className="nav-link">
                <span className="nav-icon">⌂</span>Home
            </NavLink>
            <NavLink to="/free" className="nav-link">
                <span className="nav-icon">⤓</span>Free Classics
            </NavLink>
            <NavLink to="/Favorites" className="nav-link">
                <HeartIcon className="nav-icon" filled={favorites.length>0} size={16}/>Favorites
                {favorites.length>0 && <span className="fav-count">{favorites.length}</span>}
            </NavLink>
        </div>
    </nav>
}
export default NavBar;
