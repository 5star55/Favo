import { useEffect, useState } from "react"
import MovieCard from "../Components/MovieCard"
import '../css/Home.css'
import { searchMovies, getRequest} from "../services/api"


function Home(){
const[searchQuery, setsearchQuery]= useState("")
const[movies, setMovies]= useState([])
const[err, setErr]=useState(null)
const[loading, setloading]=useState(true)

useEffect(()=>{
    const loadPopularMovies= async()=>{
        try{
            const popularMovies=await getRequest()
            setMovies(popularMovies)
        } catch(err){
            setErr("Failed to load movies..no vex")
        } 
        finally{
            setloading(false)
        }
    }
    loadPopularMovies()
},[])

    const handleSearch= async(e)=>{
        e.preventDefault()
        if(!searchQuery.trim()) return;
        if(loading) return
         setloading(true)
        try{
            const searchResult= await searchMovies(searchQuery)
            setMovies(searchResult)
            setErr(null)
        }catch(err){
            console.log(err)
            setErr("FAILED TO SEARCH MOVIES...")
        }
        finally{
            setloading(false)
        }


    }
    return(
        <div className="home">

            <form onSubmit={handleSearch} className="search-form">
                <input placeholder="search for trending movies today... " type="text"  value={searchQuery} onChange={(e)=> setsearchQuery(e.target.value)}/>
                <button type="submit" className="search-button">Search</button>
            </form>

            {err && <div className="error-message">{err}</div>}
            {loading ? (<div className="loading">loading...</div>) 
            :
                (<div className="movies-grid">
               {movies.map(movie=>(

               <MovieCard movie={movie} key={movie.id}/>
    
            ))}
            </div>)}
        
        </div>
    )
}
export default Home;