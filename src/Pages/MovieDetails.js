import { useEffect, useState } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import MovieCard from "../Components/MovieCard"
import RatingBadge from "../Components/RatingBadge"
import HeartIcon from "../Components/HeartIcon"
import { useMovieContext } from "../Contexts/MovieContext"
import { getMovieDetails, imageUrl } from "../services/api"
import { findFreeCopy } from "../services/archive"
import '../css/MovieDetails.css'

const REGION='US'

const PROVIDER_GROUPS=[
    {key:'flatrate', label:'Stream'},
    {key:'rent', label:'Rent'},
    {key:'buy', label:'Buy'},
]

const formatRuntime=(minutes)=>{
    if(!minutes) return null
    const h=Math.floor(minutes/60)
    const m=minutes%60
    return h ? `${h}h ${m}m` : `${m}m`
}

const formatMoney=(amount)=>
    amount ? amount.toLocaleString('en-US', {style:'currency', currency:'USD', maximumFractionDigits:0}) : '—'

const formatDate=(date)=>
    date ? new Date(date).toLocaleDateString('en-US', {year:'numeric', month:'long', day:'numeric'}) : 'TBA'

const languageName=(code)=>{
    try{
        return new Intl.DisplayNames(['en'], {type:'language'}).of(code)
    }catch{
        return code
    }
}

const getCertification=(releaseDates)=>{
    const region=releaseDates?.results?.find(r=>r.iso_3166_1===REGION)
    return region?.release_dates?.find(d=>d.certification)?.certification || null
}

const getTrailer=(videos)=>{
    const youtube=(videos?.results || []).filter(v=>v.site==='YouTube')
    return youtube.find(v=>v.type==='Trailer' && v.official)
        || youtube.find(v=>v.type==='Trailer')
        || youtube.find(v=>v.type==='Teaser')
        || null
}

function MovieDetails(){
    const {id}=useParams()
    const navigate=useNavigate()
    const {isFavorite, addToFavorites, removeFromFavorites}=useMovieContext()
    const [movie, setMovie]=useState(null)
    const [err, setErr]=useState(null)
    const [loading, setLoading]=useState(true)
    const [showTrailer, setShowTrailer]=useState(false)
    const [expandedReview, setExpandedReview]=useState(null)
    const [freeCopy, setFreeCopy]=useState(null)

    useEffect(()=>{
        let cancelled=false
        setLoading(true)
        setErr(null)
        setShowTrailer(false)
        setExpandedReview(null)
        setFreeCopy(null)

        getMovieDetails(id)
            .then(data=>{ if(!cancelled) setMovie(data) })
            .catch(()=>{ if(!cancelled) setErr("Couldn't load this movie. It may not exist, or the connection failed.") })
            .finally(()=>{ if(!cancelled) setLoading(false) })

        return ()=>{ cancelled=true }
    },[id])

    // Check whether the Internet Archive has a public-domain copy of this film
    useEffect(()=>{
        if(!movie) return
        let cancelled=false
        findFreeCopy(movie.title, movie.release_date?.split('-')[0])
            .then(copy=>{ if(!cancelled) setFreeCopy(copy) })
            .catch(()=>{})
        return ()=>{ cancelled=true }
    },[movie])

    useEffect(()=>{
        if(movie) document.title=`${movie.title} | FAVO`
        return ()=>{ document.title='FAVO' }
    },[movie])

    useEffect(()=>{
        if(!showTrailer) return
        const onKey=(e)=>{ if(e.key==='Escape') setShowTrailer(false) }
        window.addEventListener('keydown', onKey)
        return ()=>window.removeEventListener('keydown', onKey)
    },[showTrailer])

    if(loading) return <div className="details-status"><div className="spinner"/>Loading movie...</div>
    if(err || !movie) return (
        <div className="details-status">
            <p>{err}</p>
            <Link to="/" className="details-btn">Back to home</Link>
        </div>
    )

    const favorite=isFavorite(movie.id)
    const year=movie.release_date?.split('-')[0]
    const certification=getCertification(movie.release_dates)
    const trailer=getTrailer(movie.videos)
    const crew=movie.credits?.crew || []
    const directors=crew.filter(c=>c.job==='Director')
    const writers=[...new Map(
        crew.filter(c=>['Screenplay','Writer','Story','Novel'].includes(c.job)).map(c=>[c.id, c])
    ).values()].slice(0,3)
    const cast=(movie.credits?.cast || []).slice(0,15)
    const providers=movie['watch/providers']?.results?.[REGION]
    const providerGroups=PROVIDER_GROUPS
        .map(g=>({...g, items: providers?.[g.key] || []}))
        .filter(g=>g.items.length>0)
    const canBuyOrRent=Boolean(providers?.link && (providers.rent?.length || providers.buy?.length))
    const reviews=(movie.reviews?.results || []).slice(0,3)
    const related=(movie.recommendations?.results?.length ? movie.recommendations.results : movie.similar?.results || []).slice(0,12)
    const backdrop=imageUrl(movie.backdrop_path, 'original')
    const poster=imageUrl(movie.poster_path)

    const toggleFavorite=()=>{
        if(favorite){
            removeFromFavorites(movie.id)
        }else{
            // Only store what the cards need, not the whole details payload
            const {id, title, poster_path, release_date, vote_average, vote_count}=movie
            addToFavorites({id, title, poster_path, release_date, vote_average, vote_count})
        }
    }

    return(
        <div className="details">
            <section className="details-hero" style={backdrop ? {backgroundImage:`url(${backdrop})`} : undefined}>
                <div className="details-hero-overlay">
                    <button className="back-btn" onClick={()=>navigate(-1)}>← Back</button>
                    <div className="details-hero-content">
                        {poster
                            ? <img className="details-poster" src={poster} alt={movie.title}/>
                            : <div className="details-poster poster-fallback">{movie.title}</div>}

                        <div className="details-main">
                            <h1>{movie.title} {year && <span className="details-year">({year})</span>}</h1>

                            <div className="details-facts">
                                {certification && <span className="certification">{certification}</span>}
                                <span>{formatDate(movie.release_date)}</span>
                                {movie.genres?.length>0 && <span>{movie.genres.map(g=>g.name).join(', ')}</span>}
                                {formatRuntime(movie.runtime) && <span>{formatRuntime(movie.runtime)}</span>}
                            </div>

                            <div className="details-actions">
                                <div className="details-score">
                                    <RatingBadge rating={movie.vote_average} size={68}/>
                                    <div>
                                        <strong>User Score</strong>
                                        <span>{movie.vote_average?.toFixed(1)} / 10 · {movie.vote_count?.toLocaleString()} votes</span>
                                    </div>
                                </div>
                                <button className={`details-btn fav ${favorite ? 'active' : ''}`} onClick={toggleFavorite}>
                                    <HeartIcon filled={favorite} size={18}/>
                                    {favorite ? 'In Favorites' : 'Add to Favorites'}
                                </button>
                                {trailer && (
                                    <button className="details-btn" onClick={()=>setShowTrailer(true)}>▶ Play Trailer</button>
                                )}
                                {freeCopy && (
                                    <Link to={`/free/${encodeURIComponent(freeCopy.identifier)}`} className="details-btn free">⤓ Watch free / Download</Link>
                                )}
                                {canBuyOrRent && (
                                    <a href={providers.link} target="_blank" rel="noreferrer" className="details-btn outline">Buy or Rent ↗</a>
                                )}
                            </div>

                            {movie.tagline && <p className="details-tagline">"{movie.tagline}"</p>}

                            <h3>Overview</h3>
                            <p className="details-overview">{movie.overview || 'No overview available.'}</p>

                            {(directors.length>0 || writers.length>0) && (
                                <div className="details-crew">
                                    {directors.map(d=>(
                                        <div key={`d-${d.id}`}><strong>{d.name}</strong><span>Director</span></div>
                                    ))}
                                    {writers.map(w=>(
                                        <div key={`w-${w.id}`}><strong>{w.name}</strong><span>{w.job}</span></div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            <div className="details-body">
                <div className="details-primary">
                    {cast.length>0 && (
                        <section>
                            <h2>Top Cast</h2>
                            <div className="cast-scroller">
                                {cast.map(person=>(
                                    <div className="cast-card" key={person.credit_id}>
                                        {person.profile_path
                                            ? <img src={imageUrl(person.profile_path, 'w185')} alt={person.name} loading="lazy"/>
                                            : <div className="cast-placeholder">{person.name.charAt(0)}</div>}
                                        <div className="cast-info">
                                            <strong>{person.name}</strong>
                                            <span>{person.character}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {reviews.length>0 && (
                        <section>
                            <h2>Reviews <span className="muted">({movie.reviews.total_results})</span></h2>
                            <div className="reviews">
                                {reviews.map(review=>{
                                    const expanded=expandedReview===review.id
                                    const rating=review.author_details?.rating
                                    return(
                                        <article className="review" key={review.id}>
                                            <header>
                                                <strong>{review.author}</strong>
                                                {rating!=null && <span className="review-rating">★ {rating}/10</span>}
                                                <span className="muted">{formatDate(review.created_at)}</span>
                                            </header>
                                            <p className={expanded ? '' : 'clamped'}>{review.content}</p>
                                            {review.content.length>400 && (
                                                <button className="link-btn" onClick={()=>setExpandedReview(expanded ? null : review.id)}>
                                                    {expanded ? 'Show less' : 'Read more'}
                                                </button>
                                            )}
                                        </article>
                                    )
                                })}
                            </div>
                        </section>
                    )}
                </div>

                <aside className="details-sidebar">
                    {providerGroups.length>0 && (
                        <div className="side-block">
                            <h4>Where to Watch</h4>
                            {providerGroups.map(group=>(
                                <div className="provider-group" key={group.key}>
                                    <span className="provider-label">{group.label}</span>
                                    <div className="providers">
                                        {group.items.slice(0,6).map(p=>(
                                            <a key={p.provider_id} href={providers.link} target="_blank" rel="noreferrer" title={`${group.label} on ${p.provider_name}`}>
                                                <img src={imageUrl(p.logo_path, 'w92')} alt={p.provider_name}/>
                                            </a>
                                        ))}
                                    </div>
                                </div>
                            ))}
                            <span className="muted small">Data by JustWatch</span>
                        </div>
                    )}
                    <div className="side-block">
                        <h4>Status</h4><p>{movie.status}</p>
                    </div>
                    {movie.original_title!==movie.title && (
                        <div className="side-block"><h4>Original Title</h4><p>{movie.original_title}</p></div>
                    )}
                    <div className="side-block">
                        <h4>Original Language</h4><p>{languageName(movie.original_language)}</p>
                    </div>
                    <div className="side-block">
                        <h4>Budget</h4><p>{formatMoney(movie.budget)}</p>
                    </div>
                    <div className="side-block">
                        <h4>Revenue</h4><p>{formatMoney(movie.revenue)}</p>
                    </div>
                    {movie.production_companies?.length>0 && (
                        <div className="side-block">
                            <h4>Production</h4>
                            <p>{movie.production_companies.map(c=>c.name).join(', ')}</p>
                        </div>
                    )}
                    <div className="side-links">
                        {movie.homepage && <a href={movie.homepage} target="_blank" rel="noreferrer">Official site ↗</a>}
                        {movie.imdb_id && <a href={`https://www.imdb.com/title/${movie.imdb_id}`} target="_blank" rel="noreferrer">IMDb ↗</a>}
                    </div>
                </aside>
            </div>

            {related.length>0 && (
                <section className="details-related">
                    <h2>You Might Also Like</h2>
                    <div className="movies-grid">
                        {related.map(m=><MovieCard movie={m} key={m.id}/>)}
                    </div>
                </section>
            )}

            {showTrailer && trailer && (
                <div className="trailer-modal" onClick={()=>setShowTrailer(false)}>
                    <div className="trailer-frame" onClick={e=>e.stopPropagation()}>
                        <button className="trailer-close" onClick={()=>setShowTrailer(false)} aria-label="Close trailer">✕</button>
                        <iframe
                            src={`https://www.youtube.com/embed/${trailer.key}?autoplay=1`}
                            title={trailer.name}
                            allow="autoplay; encrypted-media; picture-in-picture"
                            allowFullScreen
                        />
                    </div>
                </div>
            )}
        </div>
    )
}

export default MovieDetails
