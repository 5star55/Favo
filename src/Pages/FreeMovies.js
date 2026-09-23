import { useEffect, useState } from "react"
import FreeMovieCard from "../Components/FreeMovieCard"
import SkeletonGrid from "../Components/SkeletonGrid"
import { getFreeMovies } from "../services/archive"
import '../css/Home.css'
import '../css/FreeMovies.css'

function FreeMovies(){
    const [searchQuery, setSearchQuery]=useState("")
    const [activeSearch, setActiveSearch]=useState("")
    const [movies, setMovies]=useState([])
    const [total, setTotal]=useState(0)
    const [page, setPage]=useState(1)
    const [loading, setLoading]=useState(true)
    const [loadingMore, setLoadingMore]=useState(false)
    const [err, setErr]=useState(null)

    useEffect(()=>{
        let cancelled=false
        const firstPage=page===1
        firstPage ? setLoading(true) : setLoadingMore(true)

        getFreeMovies({query: activeSearch, page})
            .then(({movies: results, total})=>{
                if(cancelled) return
                setMovies(prev=>firstPage ? results : [...prev, ...results])
                setTotal(total)
                setErr(null)
            })
            .catch(()=>{ if(!cancelled) setErr("Couldn't reach the Internet Archive. Try again in a moment.") })
            .finally(()=>{
                if(cancelled) return
                setLoading(false)
                setLoadingMore(false)
            })

        return ()=>{ cancelled=true }
    },[activeSearch, page])

    const handleSearch=(e)=>{
        e.preventDefault()
        setPage(1)
        setActiveSearch(searchQuery.trim())
    }

    const clearSearch=()=>{
        setSearchQuery("")
        setPage(1)
        setActiveSearch("")
    }

    return(
        <div className="home">
            <section className="home-hero">
                <h1><span className="gradient-text free">Free</span> Classics</h1>
                <p>Public-domain films from the Internet Archive. Stream them here or download them, free and legal.</p>

                <form onSubmit={handleSearch} className="search-form" role="search">
                    <svg className="search-icon" viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
                        <circle cx="11" cy="11" r="7" fill="none" stroke="currentColor" strokeWidth="2"/>
                        <line x1="16.5" y1="16.5" x2="21" y2="21" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                    <input
                        className="search-input"
                        placeholder="Search classic films, e.g. Nosferatu..."
                        type="text"
                        aria-label="Search free classic films"
                        value={searchQuery}
                        onChange={(e)=>setSearchQuery(e.target.value)}
                    />
                    {searchQuery && (
                        <button type="button" className="search-clear" onClick={clearSearch} aria-label="Clear search">✕</button>
                    )}
                    <button type="submit" className="search-button">Search</button>
                </form>
            </section>

            <div className="section-header">
                {activeSearch
                    ? <h2>Results for <span className="gradient-text">"{activeSearch}"</span></h2>
                    : <h2>Most Downloaded</h2>}
                {!loading && !err && <span className="result-count">{total.toLocaleString()} films</span>}
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
                    <div className="state-icon">🎞️</div>
                    <h2>No free films found</h2>
                    <p>Only films in the public domain are listed here, so most recent movies won't appear.</p>
                    <button className="primary-btn" onClick={clearSearch}>Show all classics</button>
                </div>
            ) : (
                <>
                    <div className="movies-grid">
                        {movies.map(movie=><FreeMovieCard movie={movie} key={movie.identifier}/>)}
                    </div>
                    {movies.length<total && (
                        <div className="load-more">
                            <button className="primary-btn" onClick={()=>setPage(p=>p+1)} disabled={loadingMore}>
                                {loadingMore ? 'Loading...' : 'Load more'}
                            </button>
                        </div>
                    )}
                </>
            )}

            <p className="archive-credit">
                Films provided by the <a href="https://archive.org/details/feature_films" target="_blank" rel="noreferrer">Internet Archive</a>.
                Only items marked public domain are shown.
            </p>
        </div>
    )
}

export default FreeMovies
