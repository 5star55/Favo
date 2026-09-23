import { useEffect, useState } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import { archivePage, archiveThumbnail, canSaveDirectly, getFreeMovie } from "../services/archive"
import '../css/MovieDetails.css'
import '../css/FreeMovies.css'

function FreeMovieDetails(){
    const {identifier}=useParams()
    const navigate=useNavigate()
    const [movie, setMovie]=useState(null)
    const [loading, setLoading]=useState(true)
    const [err, setErr]=useState(null)
    const [expanded, setExpanded]=useState(false)

    useEffect(()=>{
        let cancelled=false
        setLoading(true)
        setErr(null)
        setExpanded(false)

        getFreeMovie(identifier)
            .then(data=>{ if(!cancelled) setMovie(data) })
            .catch(()=>{ if(!cancelled) setErr("Couldn't load this film from the Internet Archive.") })
            .finally(()=>{ if(!cancelled) setLoading(false) })

        return ()=>{ cancelled=true }
    },[identifier])

    useEffect(()=>{
        if(movie) document.title=`${movie.title} (Free) | FAVO`
        return ()=>{ document.title='FAVO' }
    },[movie])

    if(loading) return <div className="details-status"><div className="spinner"/>Loading film...</div>
    if(err || !movie) return (
        <div className="state-box error" style={{marginTop:'3rem'}}>
            <div className="state-icon">⚠️</div>
            <h2>Film unavailable</h2>
            <p>{err}</p>
            <Link to="/free" className="primary-btn">Back to Free Classics</Link>
        </div>
    )

    const longDescription=movie.description.length>600

    return(
        <div className="free-details">
            <button className="back-btn" onClick={()=>navigate(-1)}>← Back</button>

            <div className="player-wrap">
                {movie.playable ? (
                    <video
                        key={movie.playable.url}
                        controls
                        preload="metadata"
                        poster={archiveThumbnail(movie.identifier)}
                        src={movie.playable.url}
                    >
                        Your browser can't play this video. Use a download link below instead.
                    </video>
                ) : (
                    <div className="player-unavailable">
                        {movie.publicDomain
                            ? 'No browser-playable version of this film is available.'
                            : "This item isn't marked public domain, so FAVO doesn't offer it for streaming or download."}
                    </div>
                )}
            </div>

            <div className="free-details-body">
                <div className="free-main">
                    <h1>{movie.title} {movie.year && <span className="details-year">({movie.year})</span>}</h1>
                    <div className="details-facts">
                        {movie.publicDomain && <span className="pd-badge">Public Domain</span>}
                        {movie.runtime && <span>{movie.runtime}</span>}
                        {movie.creator && <span>{movie.creator}</span>}
                    </div>

                    {movie.description && (
                        <>
                            <p className={`free-description ${longDescription && !expanded ? 'clamped' : ''}`}>{movie.description}</p>
                            {longDescription && (
                                <button className="link-btn" onClick={()=>setExpanded(e=>!e)}>{expanded ? 'Show less' : 'Read more'}</button>
                            )}
                        </>
                    )}
                </div>

                <aside className="download-panel">
                    <h2>Download</h2>
                    {movie.files.length>0 ? (
                        <>
                            <ul className="download-list">
                                {movie.files.map(file=>(
                                    <li key={file.name}>
                                        <a
                                            href={file.saveUrl}
                                            download={file.name.split('/').pop()}
                                            {...(canSaveDirectly ? {} : {target: '_blank', rel: 'noreferrer'})}
                                        >
                                            <span className="download-icon" aria-hidden="true">⤓</span>
                                            <span className="download-text">
                                                <strong>{file.label}</strong>
                                                <span>{[file.height && `${file.height}p`, file.size].filter(Boolean).join(' · ')}</span>
                                            </span>
                                        </a>
                                    </li>
                                ))}
                            </ul>
                            <p className="download-hint">
                                {canSaveDirectly ? (
                                    <>Downloads go to your browser's Downloads folder. Large files can take a while, so check your browser's download bar for progress.</>
                                ) : (
                                    <>Files open in a new tab. If the video starts playing instead of downloading,
                                    press <kbd>Ctrl</kbd>/<kbd>⌘</kbd> + <kbd>S</kbd> or use the player's ⋮ menu → Download.</>
                                )}
                            </p>
                        </>
                    ) : (
                        <p className="download-hint">No downloadable files for this item.</p>
                    )}
                    <a className="archive-link" href={archivePage(movie.identifier)} target="_blank" rel="noreferrer">View on Internet Archive ↗</a>
                </aside>
            </div>
        </div>
    )
}

export default FreeMovieDetails
