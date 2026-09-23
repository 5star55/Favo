// Internet Archive: public-domain feature films that can be streamed and downloaded legally.
const SEARCH_URL='https://archive.org/advancedsearch.php'
const METADATA_URL='https://archive.org/metadata'

// Only items the Archive marks as public domain, minus adult/exploitation titles
const BASE_QUERY=[
    'collection:(feature_films)',
    'mediatype:(movies)',
    'licenseurl:(*publicdomain*)',
    'NOT title:(nudist OR nude OR naked OR sex OR erotic OR xxx)',
    'NOT subject:(nudity OR nudist OR sexploitation OR erotic OR adult)',
].join(' AND ')

const VIDEO_FORMATS={
    'h.264': 'MP4 · Standard quality',
    'h.264 IA': 'MP4 · Standard quality',
    'MPEG4': 'MP4 · Original',
    '512Kb MPEG4': 'MP4 · Small (low quality)',
    'Ogg Video': 'OGV · Open format',
    'Matroska': 'MKV · Original',
    'MPEG2': 'MPEG-2 · Original (very large)',
}

export const archiveThumbnail=(identifier)=>`https://archive.org/services/img/${identifier}`
export const archivePage=(identifier)=>`https://archive.org/details/${identifier}`
const encodePath=(name)=>name.split('/').map(encodeURIComponent).join('/')
const downloadUrl=(identifier, name)=>`https://archive.org/download/${identifier}/${encodePath(name)}`

// archive.org sends no Content-Disposition header, so its links play in the browser
// instead of saving. A same-origin proxy (src/setupProxy.js in dev) adds that header.
// For production builds, set REACT_APP_DOWNLOAD_PROXY to an equivalent endpoint.
const DOWNLOAD_PROXY=process.env.REACT_APP_DOWNLOAD_PROXY
    ?? (process.env.NODE_ENV==='development' ? '/archive-download' : '')

export const canSaveDirectly=Boolean(DOWNLOAD_PROXY)

const saveUrl=(identifier, name)=>
    DOWNLOAD_PROXY ? `${DOWNLOAD_PROXY}/${identifier}/${encodePath(name)}` : downloadUrl(identifier, name)

const isPublicDomain=(licenseurl)=>typeof licenseurl==='string' && licenseurl.includes('publicdomain')

// Some fields come back as an array when an item has several values
const first=(value)=>Array.isArray(value) ? value[0] : value

const escapeQuery=(text)=>text.replace(/[\\"]/g, ' ')

// Descriptions are HTML; parse to plain text so nothing is injected into the page
export const stripHtml=(html='')=>{
    const text=new DOMParser().parseFromString(first(html) || '', 'text/html').body.textContent || ''
    return text.replace(/\s+\n/g, '\n').trim()
}

const search= async(query, {rows=24, page=1, sort='downloads desc'}={})=>{
    const params=new URLSearchParams({q: query, rows, page, output: 'json'})
    ;['identifier','title','year','description','downloads'].forEach(f=>params.append('fl[]', f))
    params.append('sort[]', sort)
    const response=await fetch(`${SEARCH_URL}?${params}`)
    if(!response.ok) throw new Error(`Internet Archive search failed (${response.status})`)
    const data=await response.json()
    return {
        total: data.response.numFound,
        movies: data.response.docs.map(d=>({
            identifier: d.identifier,
            title: first(d.title),
            year: first(d.year) || null,
            description: first(d.description) || '',
        })),
    }
}

export const getFreeMovies=({query='', page=1}={})=>{
    const text=escapeQuery(query.trim())
    return search(text ? `${BASE_QUERY} AND title:(${text})` : BASE_QUERY, {page})
}

const normalizeTitle=(title='')=>
    title.toLowerCase().replace(/^the\s+/, '').replace(/[^a-z0-9]/g, '')

// Look for a public-domain copy of a TMDB movie. Title and year must both match
// so we don't point people at a different film with a similar name.
export const findFreeCopy= async(title, year)=>{
    if(!title || !year) return null
    const {movies}=await search(`${BASE_QUERY} AND title:("${escapeQuery(title)}") AND year:${year}`, {rows: 10})
    return movies.find(m=>normalizeTitle(m.title)===normalizeTitle(title)) || null
}

const formatSize=(bytes)=>{
    const n=Number(bytes)
    if(!n) return null
    return n>=1e9 ? `${(n/1e9).toFixed(1)} GB` : `${Math.round(n/1e6)} MB`
}

export const getFreeMovie= async(identifier)=>{
    const response=await fetch(`${METADATA_URL}/${encodeURIComponent(identifier)}`)
    if(!response.ok) throw new Error(`Internet Archive lookup failed (${response.status})`)
    const data=await response.json()
    const meta=data.metadata
    if(!meta) throw new Error('Film not found')

    const collections=[].concat(meta.collection || [])
    const publicDomain=isPublicDomain(meta.licenseurl) && collections.includes('feature_films')

    const files=(data.files || [])
        .filter(f=>VIDEO_FORMATS[f.format])
        .map(f=>({
            name: f.name,
            format: f.format,
            label: VIDEO_FORMATS[f.format],
            size: formatSize(f.size),
            bytes: Number(f.size) || 0,
            height: f.height ? Number(f.height) : null,
            url: downloadUrl(identifier, f.name),
            saveUrl: saveUrl(identifier, f.name),
        }))
        // Smallest first: easier to download, and the default for streaming
        .sort((a, b)=>a.bytes-b.bytes)

    // Browsers can play MP4 (H.264) everywhere; prefer the standard-quality file
    const playable=files.find(f=>f.format.startsWith('h.264'))
        || files.find(f=>f.format==='512Kb MPEG4')
        || files.find(f=>f.format==='MPEG4')
        || null

    return {
        identifier,
        title: first(meta.title),
        year: first(meta.year) || first(meta.date)?.slice(0, 4) || null,
        runtime: first(meta.runtime) || null,
        description: stripHtml(meta.description),
        creator: first(meta.creator) || null,
        licenseurl: first(meta.licenseurl),
        publicDomain,
        // Only offer files when the item is confirmed public domain
        files: publicDomain ? files : [],
        playable: publicDomain ? playable : null,
    }
}
