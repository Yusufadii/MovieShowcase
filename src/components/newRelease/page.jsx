import React from "react";
import BigCard from "../bigCard/page";
import Image from "next/image";
import Link from "next/link";

const TMDB_BASE = "https://api.themoviedb.org/3";
const imgUrl = (path, size = "w1280") =>
  path ? `https://image.tmdb.org/t/p/${size}${path}` : "/placeholder.png";

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

async function getTrendingAll() {
  return fetchJson(`${TMDB_BASE}/trending/all/day?language=en-US&region=ID`);
}

async function getTvDetail(id) {
  return fetchJson(`${TMDB_BASE}/tv/${id}?language=en-US`);
}

const fmtDate = (s) => {
  if (!s) return "";
  try {
    const d = new Date(s);
    return d.toLocaleString("en-US", { month: "short", day: "numeric" });
  } catch {
    return "";
  }
};

export default async function NewRelease() {
  const data = await getTrendingAll();
  const items = (data?.results || []).filter(
    (x) => x?.backdrop_path || x?.poster_path
  );
  if (!items.length) {
    return (
      <BigCard>
        <div className="p-6 text-sm text-muted-foreground">No data.</div>
      </BigCard>
    );
  }

  const hero = items[0];
  const thumbs = items.slice(1, 4); // 3 kartu kecil kanan-bawah

  const isTV = hero.media_type === "tv";
  let seasonsText = "";
  if (isTV) {
    const detail = await getTvDetail(hero.id);
    const n = detail?.number_of_seasons;
    seasonsText = n ? `${n} season${n > 1 ? "s" : ""}` : "TV Series";
  }

  const title =
    hero.title ||
    hero.name ||
    hero.original_title ||
    hero.original_name ||
    "Untitled";
  const dateText = isTV ? fmtDate(hero.first_air_date) : fmtDate(hero.release_date);
  const subline = [dateText, isTV ? seasonsText : "Movie"].filter(Boolean).join("  ·  ");
  const bg = hero.backdrop_path || hero.poster_path;
  const href = isTV ? `/tv/${hero.id}` : `/movie/${hero.id}`;

  return (
      <div className="relative h-[260px] md:h-[360px] lg:h-[420px] rounded-3xl overflow-hidden">
        {/* Backdrop */}
        <Image
          src={imgUrl(bg, "w1280")}
          alt={title}
          fill
          className="object-cover"
          priority
        />

        {/* Vignette kanan biar teks kebaca */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/30 to-black/0" />

        {/* Konten kiri */}
        <div className="absolute inset-0 p-6 md:p-8 flex items-center">
          <div className="max-w-xl">
            {/* badges kecil */}
            <div className="flex items-center gap-2 mb-3">
              <span className="text-[11px] font-semibold px-2 py-1 rounded-full bg-white/20 backdrop-blur text-white">
                10XP / episode
              </span>
              <div className="flex -space-x-2">
                <div className="h-5 w-5 rounded-full bg-white/80 border border-white/50" />
                <div className="h-5 w-5 rounded-full bg-white/60 border border-white/50" />
                <div className="h-5 w-5 rounded-full bg-white/40 border border-white/50" />
              </div>
              <span className="text-xs text-white/80">+5 friends are watching</span>
            </div>

            <h1 className="text-3xl md:text-5xl font-extrabold text-white leading-tight">
              {title}
            </h1>
            {subline && (
              <div className="mt-2 text-sm md:text-base text-white/80">{subline}</div>
            )}

            <div className="mt-5 flex items-center gap-3">
              <Link
                href={href}
                className="px-5 py-2.5 rounded-full bg-red-600 text-white font-semibold shadow-[0_10px_30px_rgba(0,0,0,0.25)] hover:bg-red-500 transition"
              >
                Watch
              </Link>
              <button
                aria-label="Add"
                className="h-10 w-10 rounded-full bg-white/20 hover:bg-white/30 transition backdrop-blur text-white text-xl flex items-center justify-center"
              >
                +
              </button>
            </div>
          </div>
        </div>

        {/* Thumbnails stack kanan-bawah */}
        <div className="hidden md:flex absolute right-4 bottom-4 gap-3">
          {thumbs.map((t, i) => {
            const tTitle =
              t.title || t.name || t.original_title || t.original_name || "Untitled";
            const tBg = t.backdrop_path || t.poster_path;
            const tHref = t.media_type === "tv" ? `/tv/${t.id}` : `/movie/${t.id}`;
            return (
              <Link
                key={t.id}
                href={tHref}
                className="relative w-28 h-16 rounded-xl overflow-hidden border border-white/20 shadow-md hover:scale-[1.03] transition"
                style={{ transform: `translateY(${i === 1 ? "4px" : i === 2 ? "8px" : "0"})` }}
              >
                <Image src={imgUrl(tBg, "w780")} alt={tTitle} fill className="object-cover" />
                <div className="absolute inset-0 bg-black/0 hover:bg-black/10 transition" />
              </Link>
            );
          })}
        </div>
      </div>
  );
}