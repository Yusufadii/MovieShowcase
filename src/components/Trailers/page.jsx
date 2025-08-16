import React from "react";
import BigCard from "../bigCard/page";
import Image from "next/image";
import Link from "next/link";

const TMDB_BASE = "https://api.themoviedb.org/3";
const imgUrl = (path, size = "w780") => path ? `https://image.tmdb.org/t/p/${size}${path}` : "/placeholder.png";

function pickBestYoutubeVideo(videos = []) {
  const yt = videos.filter((v) => v.site === "YouTube");
  return (
    yt.find((v) => v.type === "Trailer" && v.official) ||
    yt.find((v) => v.type === "Trailer") ||
    yt[0] ||
    null
  );
}

async function fetchJson(url) {
  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${process.env.TMDB_TOKEN}`,
      accept: "application/json",
    },
    next: { revalidate: 1800 },
  });
  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    throw new Error(`TMDB ${res.status}${detail ? ` - ${detail}` : ""}`);
  }
  return res.json();
}

async function getTrendingMovies() {
  return fetchJson(`${TMDB_BASE}/trending/movie/day?language=en-US&region=ID`);
}

async function getMovieVideos(id) {
  let data = await fetchJson(`${TMDB_BASE}/movie/${id}/videos?language=en-US`);
  if (!data?.results?.length) {
    data = await fetchJson(`${TMDB_BASE}/movie/${id}/videos`);
  }
  return data.results || [];
}

export default async function TrailersBento() {
    const trending = await getTrendingMovies();
    const top = (trending?.results || []).slice(0, 6);
    const videosPerMovie = await Promise.all(top.map((m) => getMovieVideos(m.id)));
    const tiles = top .map((m, i) => {
        const best = pickBestYoutubeVideo(videosPerMovie[i]);
        if (!best) return null;
        return {
            id: m.id,
            title: m.title || m.original_title || "Untitled",
            key: best.key,
            imagePath: m.backdrop_path || m.poster_path,
        };
    })
    .filter(Boolean);

    if (!tiles.length) {
        return (
            <BigCard>
                <div className="p-6 text-sm text-white/70">No trailers available.</div>
            </BigCard>
        );
    }
    const spanClass = (idx) => {
        if (idx === 0) return "sm:col-span-6 lg:col-span-8 lg:row-span-2";
        if (idx === 1) return "sm:col-span-6 lg:col-span-4";
        return "sm:col-span-3 lg:col-span-4";
    };

    return (
        <BigCard>
            <div className="p-6">
                <h2 className="text-[30px] font-bold text-[#ffffff] mb-4">Latest Trailers</h2>
                <div className="grid gap-4 md:gap-5 grid-cols-1 sm:grid-cols-6 lg:grid-cols-12 auto-rows-[140px] md:auto-rows-[160px] lg:auto-rows-[180px]">
                    {tiles.map((t, idx) => (
                        <div key={t.id} className={spanClass(idx)}>
                            <Link href={`https://www.youtube.com/watch?v=${t.key}`} target="_blank" rel="noopener noreferrer" className="group block h-full">
                                <div className="relative h-full rounded-2xl overflow-hidden">
                                    <Image src={imgUrl(t.imagePath, idx === 0 ? "w1280" : "w780")} alt={t.title} fill className="object-cover" sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" priority={idx === 0}/>
                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/15 transition-colors"></div>
                                        <div className="absolute left-3 top-3 rounded-full bg-white/90 px-2 py-1 text-xs font-semibold text-black shadow">
                                            ▶ Trailer
                                        </div>
                                        <div className="absolute inset-x-0 bottom-0">
                                            <div className="bg-gradient-to-t from-black/90 via-black/40 to-transparent p-4">
                                            <h3 className="text-white font-semibold leading-tight line-clamp-2">
                                                {t.title}
                                            </h3>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        </div>
                    ))}
                </div>
            </div>
        </BigCard>
    );
}