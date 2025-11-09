import './css/App.css';
import Home from './Pages/Home'
import{Routes, Route} from "react-router-dom"
import Favorites from './Pages/Favorites';
import NavBar from './Components/NavBar';
import {MovieProvider} from './Contexts/MovieContext'
import Footer from './Components/Footer'

function App() {
  return (
    <div>
      <MovieProvider>
      <NavBar/>
    <main className='main-content'>

    <Routes>
      <Route path="/" element={<Home/>}/>
      <Route path="/Favorites" element={<Favorites/>}/>
      
    </Routes>
    </main>
   </MovieProvider>
   <Footer/>
    </div>
  );
}

export default App;
