function SkeletonGrid({count=12}){
    return(
        <div className="movies-grid" aria-busy="true" aria-label="Loading movies">
            {Array.from({length:count}, (_, i)=>(
                <div className="skeleton-card" key={i}>
                    <div className="skeleton-poster"/>
                    <div className="skeleton-line"/>
                    <div className="skeleton-line short"/>
                </div>
            ))}
        </div>
    )
}

export default SkeletonGrid
