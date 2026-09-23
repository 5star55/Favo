import './css/App.css';
import { useEffect } from 'react';
import Home from './Pages/Home'
import{Routes, Route, Link, useLocation} from "react-router-dom"
import Favorites from './Pages/Favorites';
import MovieDetails from './Pages/MovieDetails';
import FreeMovies from './Pages/FreeMovies';
import FreeMovieDetails from './Pages/FreeMovieDetails';
import NavBar from './Components/NavBar';
import Footer from './Components/Footer'

function ScrollToTop(){
  const {pathname}=useLocation()
  useEffect(()=>{ window.scrollTo(0, 0) },[pathname])
  return null
}

function NotFound(){
  return (
    <div className='state-box' style={{marginTop:'3rem'}}>
      <div className='state-icon'>🎞️</div>
      <h2>Page not found</h2>
      <p>This reel seems to be missing.</p>
      <Link to="/" className='primary-btn'>Go back home</Link>
    </div>
  )
}

function App() {
  return (
    <>
      <ScrollToTop/>
      <NavBar/>
      <main className='main-content'>
        <Routes>
          <Route path="/" element={<Home/>}/>
          <Route path="/Favorites" element={<Favorites/>}/>
          <Route path="/movie/:id" element={<MovieDetails/>}/>
          <Route path="/free" element={<FreeMovies/>}/>
          <Route path="/free/:identifier" element={<FreeMovieDetails/>}/>
          <Route path="*" element={<NotFound/>}/>
        </Routes>
      </main>
      <Footer/>
    </>
  );
}

export default App;
