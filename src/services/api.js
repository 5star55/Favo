const API_KEY='7be23a67849bc7702a4c2aea6d556da6';
const BASE_URL='https://api.themoviedb.org/3'
const IMAGE_URL='https://image.tmdb.org/t/p'

export const imageUrl=(path, size='w500')=> path ? `${IMAGE_URL}/${size}${path}` : null

const request= async(path, params={})=>{
    const query=new URLSearchParams({api_key: API_KEY, ...params})
    const response= await fetch(`${BASE_URL}${path}?${query}`)
    if(!response.ok){
        throw new Error(`TMDB request failed (${response.status})`)
    }
    return response.json()
}

// category is one of: popular, top_rated, now_playing, upcoming
export const getMovies= async(category='popular')=>{
    const data=await request(`/movie/${category}`)
    return data.results
}

export const getRequest= ()=> getMovies('popular')

export const searchMovies= async(query)=>{
    const data=await request('/search/movie', {query})
    return data.results
}

export const getMovieDetails= (id)=>
    request(`/movie/${id}`, {
        append_to_response: 'credits,videos,similar,recommendations,release_dates,reviews,watch/providers',
    })
