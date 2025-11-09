const API_KEY='7be23a67849bc7702a4c2aea6d556da6';
const BASE_URL='https://api.themoviedb.org/3'

export const getRequest= async()=>{
    const response= await fetch(`${BASE_URL}/movie/popular?api_key=${API_KEY}`);
    const data =await response.json()
    return data.results
}

export const searchMovies= async(query)=>{
    const response= await fetch(`${BASE_URL}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(query)}`);
    const data=await response.json()
    return data.results
}