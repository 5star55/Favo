import { useEffect, useState } from "react"
import MovieCard from "../Components/MovieCard"
import SkeletonGrid from "../Components/SkeletonGrid"
import '../css/Home.css'
import { searchMovies, getMovies} from "../services/api"

const CATEGORIES=[
    {key:'popular', label:'Popular', icon:'🔥'},
    {key:'top_rated', label:'Top Rated', icon:'⭐'},
    {key:'now_playing', label:'Now Playing', icon:'🎬'},
    {key:'upcoming', label:'Upcoming', icon:'📅'},
]

function Home(){
const[searchQuery, setsearchQuery]= useState("")
const[activeSearch, setActiveSearch]=useState(null)
const[category, setCategory]=useState('popular')
const[movies, setMovies]= useState([])
const[err, setErr]=useState(null)
const[loading, setloading]=useState(true)

useEffect(()=>{
    if(activeSearch) return
    let cancelled=false
    const loadMovies= async()=>{
        setloading(true)
        try{
            const results=await getMovies(category)
            if(!cancelled){
                setMovies(results)
                setErr(null)
            }
        } catch(err){
            if(!cancelled) setErr("Failed to load movies..no vex")
        }
        finally{
            if(!cancelled) setloading(false)
        }
    }
    loadMovies()
    return ()=>{ cancelled=true }
},[category, activeSearch])

    const handleSearch= async(e)=>{
        e.preventDefault()
        const query=searchQuery.trim()
        if(!query) return;
        setloading(true)
        try{
            const searchResult= await searchMovies(query)
            setMovies(searchResult)
            setActiveSearch(query)
            setErr(null)
        }catch(err){
            console.log(err)
            setErr("FAILED TO SEARCH MOVIES...")
        }
        finally{
            setloading(false)
        }
    }

    const clearSearch=()=>{
        setsearchQuery("")
        setActiveSearch(null)
    }

    const pickCategory=(key)=>{
        setActiveSearch(null)
        setCategory(key)
    }

    const currentCategory=CATEGORIES.find(c=>c.key===category)

    return(
        <div className="home">
            <section className="home-hero">
                <h1>Find your next <span className="gradient-text">favorite</span> movie</h1>

                <form onSubmit={handleSearch} className="search-form" role="search">
                    <svg className="search-icon" viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
                        <circle cx="11" cy="11" r="7" fill="none" stroke="currentColor" strokeWidth="2"/>
                        <line x1="16.5" y1="16.5" x2="21" y2="21" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                    <input
                        className="search-input"
                        placeholder="Search for a movie..."
                        type="text"
                        aria-label="Search movies"
                        value={searchQuery}
                        onChange={(e)=> setsearchQuery(e.target.value)}
                    />
                    {searchQuery && (
                        <button type="button" className="search-clear" onClick={clearSearch} aria-label="Clear search">✕</button>
                    )}
                    <button type="submit" className="search-button" disabled={!searchQuery.trim()}>Search</button>
                </form>
            </section>

            <div className="category-tabs" role="tablist">
                {CATEGORIES.map(c=>(
                    <button
                        key={c.key}
                        role="tab"
                        aria-selected={!activeSearch && category===c.key}
                        className={`category-tab ${!activeSearch && category===c.key ? 'active' : ''}`}
                        onClick={()=>pickCategory(c.key)}
                    ><span aria-hidden="true">{c.icon}</span>{c.label}</button>
                ))}
            </div>

            <div className="section-header">
                {activeSearch ? (
                    <h2>Results for <span className="gradient-text">"{activeSearch}"</span></h2>
                ) : (
                    <h2>{currentCategory.label} Movies</h2>
                )}
                {!loading && !err && <span className="result-count">{movies.length} {movies.length===1 ? 'title' : 'titles'}</span>}
            </div>

            {err ? (
                <div className="state-box error">
                    <div className="state-icon">⚠️</div>
                    <h2>Something went wrong</h2>
                    <p>{err}</p>
                </div>
            ) : loading ? (
                <SkeletonGrid/>
            ) : movies.length===0 ? (
                <div className="state-box">
                    <div className="state-icon">🔍</div>
                    <h2>No movies found</h2>
                    <p>We couldn't find anything matching "{activeSearch}". Try a different title.</p>
                    <button className="primary-btn" onClick={clearSearch}>Back to browsing</button>
                </div>
            ) : (
                <div className="movies-grid">
                    {movies.map(movie=>(
                        <MovieCard movie={movie} key={movie.id}/>
                    ))}
                </div>
            )}
        </div>
    )
}
export default Home;
