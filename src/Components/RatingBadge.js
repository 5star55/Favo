import '../css/RatingBadge.css'

// Circular score ring for a TMDB rating (0-10), shown as a percentage
function RatingBadge({rating=0, size=56}){
    const percent=Math.round(rating*10)
    const color= percent>=70 ? '#21d07a' : percent>=50 ? '#d2d531' : '#db2360'
    const stroke=size/12
    const radius=(size-stroke)/2
    const circumference=2*Math.PI*radius

    return(
        <div className="rating-badge" style={{width:size, height:size}} title={`${rating.toFixed(1)} / 10`}>
            <svg width={size} height={size}>
                <circle cx={size/2} cy={size/2} r={radius} className="rating-track" strokeWidth={stroke}/>
                <circle
                    cx={size/2} cy={size/2} r={radius}
                    fill="none" stroke={color} strokeWidth={stroke} strokeLinecap="round"
                    strokeDasharray={circumference}
                    strokeDashoffset={circumference*(1-percent/100)}
                    transform={`rotate(-90 ${size/2} ${size/2})`}
                />
            </svg>
            <span className="rating-value" style={{fontSize:size*0.3}}>
                {percent}<sup>%</sup>
            </span>
        </div>
    )
}

export default RatingBadge
