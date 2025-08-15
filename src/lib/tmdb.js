const TMDB_BASE = 'https://api.themoviedb.org/3';

export async function tmdb(path, params = {}){
    const url = new URL(TMDB_BASE + path);
    Object.entries(params).forEach(([k, v]) =>{
        if (v !== undefined && v !== null) url.searchParams.set(k, v);
    });

    const res = await fetch(url, {
        headers: {
            Authorization: `Bearer ${process.env.TMDB_TOKEN}`,
            Accept: 'application/json',
        },
    });
    if (!res.ok) throw new Error(`TMDB ${res.status}`);
    return res.json();
}