import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus } from "lucide-react";
import AddWatch from "@/components/addWatchlist/page";

export const revalidate = 1800;

const TMDB_BASE = "https://api.themoviedb.org/3";
const imgUrl = (path, size = "w500") => path ? `https://image.tmdb.org/t/p/${size}${path}` : "/placeholder.png";

async function tmdbFetch(path, { nextRevalidate = 1800 } = {}) {
  const res = await fetch(`${TMDB_BASE}${path}`, {
    headers: {
      Authorization: `Bearer ${process.env.TMDB_TOKEN}`,
      accept: "application/json",
    },
    next: { revalidate: nextRevalidate },
  });
  if (!res.ok) throw new Error(`TMDB ${res.status} ${path}`);
  return res.json();
}

async function getShow(id) { return tmdbFetch(`/tv/${id}?language=en-US`); }
async function getCredits(id) { return tmdbFetch(`/tv/${id}/credits?language=en-US`); }
async function getRecommendations(id) { return tmdbFetch(`/tv/${id}/recommendations?language=en-US`); }
async function getVideos(id) { return tmdbFetch(`/tv/${id}/videos?language=en-US`); }

function minutesToHM(min) {
  if (!min && min !== 0) return "-";
  const h = Math.floor(min / 60);
  const m = Math.round(min % 60);
  return `${h > 0 ? `${h}h ` : ""}${m}m`;
}

function pickTrailer(videos) {
    if (!videos?.results?.length) return null;
    const byPriority = videos.results.find( (v) =>
        v.site === "YouTube" &&
        v.type === "Trailer" &&
        (v.official || /official/i.test(v.name))
    ) ||
    videos.results.find((v) => v.site === "YouTube" && v.type === "Trailer") ||
    videos.results.find((v) => v.site === "YouTube");
    return byPriority?.key || null;
}

export async function generateMetadata({ params }) {
  try {
    const { id } = await params;
    const show = await getShow(id);
    return {
      title: `${show.name} (${show.first_air_date?.slice(0, 4) || ""})`,
      description: show.overview,
      openGraph: {
        images: [imgUrl(show.backdrop_path || show.poster_path, "w780")],
      },
    };
  } catch {
    return { title: "TV Series" };
  }
}

export default async function TvDetails({ params }) {
  const { id } = await params;

  const [show, credits, recs, videos] = await Promise.all([
    getShow(id),
    getCredits(id),
    getRecommendations(id),
    getVideos(id),
  ]).catch(() => [null, null, null, null]);

  if (!show?.id) return notFound();

  const year = show.first_air_date ? show.first_air_date.slice(0, 4) : "-";
  const genres = show.genres?.map((g) => g.name).join(", ") || "-";
  const avgRuntimeMin = Array.isArray(show.episode_run_time) && show.episode_run_time.length ? show.episode_run_time[0] : null;
  const runtime = avgRuntimeMin ? `${minutesToHM(avgRuntimeMin)} / ep` : "-";
  const trailerKey = pickTrailer(videos);
  const creators = (show.created_by || []).slice(0, 3);
  const writers = (credits?.crew || []) .filter((c) => c.department === "Writing") .slice(0, 3);
  const topCast = (credits?.cast || []).slice(0, 10);
  const recommendations = (recs?.results || []).slice(0, 10);

  const watchItem = {
    id: show.id,
    media_type: "tv",
    title: show.name,
    poster_path: show.poster_path || null,
    backdrop_path: show.backdrop_path || null,
    release_date: show.first_air_date || null,
  };

  return (
    <div className="w-full max-w-[1200px] mx-auto mt-10 px-4">
      <Card className="overflow-hidden">
        <div className="flex flex-col md:flex-row gap-8 md:gap-10 p-[10px] md:p-[30px]">
          <div className="shrink-0">
            <div className="relative w-full h-[420px] md:w-[280px] md:h-[500px] overflow-hidden rounded-2xl bg-neutral-200">
              <Image src={imgUrl(show.poster_path, "w500")} alt={show.name} fill className="object-cover" priority/>
            </div>
          </div>
          <div className="flex-1 flex flex-col gap-4">
            <h1 className="text-[34px] md:text-[40px] font-extrabold text-[#131313] leading-tight">
              {show.name} <span className="font-medium">({year})</span>
            </h1>
            <div className="flex flex-wrap items-center gap-x-5 gap-y-1 text-[15px] text-neutral-700">
              <span>{show.first_air_date || "-"}</span>
              <span className="opacity-40">•</span>
              <span>{genres}</span>
              <span className="opacity-40">•</span>
              <span>{runtime}</span>
              {show.vote_average ? (
                <>
                  <span className="opacity-40">•</span>
                  <span>⭐ {show.vote_average.toFixed(1)}</span>
                </>
              ) : null}
            </div>
            <Tabs defaultValue="overview" className="mt-2">
              <div className="relative md:static">
                <div className="overflow-x-auto md:overflow-visible -mx-4 px-4 md:mx-0 md:px-0 scroll-smooth">
                  <TabsList className="bg-[#023C26] rounded-full p-1 shadow-[0_4px_10px_rgba(203,242,115,0.1)] inline-flex gap-1 min-w-max">
                    <TabsTrigger value="overview" className="shrink-0 text-[16px] font-semibold text-[#CBF273] data-[state=active]:bg-[#CBF273] data-[state=active]:text-[#131313] transition-colors duration-500 rounded-full px-[24px] py-[10px] cursor-pointer">Overview</TabsTrigger>
                    <TabsTrigger value="castcrew" className="shrink-0 text-[16px] font-semibold text-[#CBF273] data-[state=active]:bg-[#CBF273] data-[state=active]:text-[#131313] transition-colors duration-500 rounded-full px-[24px] py-[10px] cursor-pointer">Cast & Crew</TabsTrigger>
                    <TabsTrigger value="recommend" className="shrink-0 text-[16px] font-semibold text-[#CBF273] data-[state=active]:bg-[#CBF273] data-[state=active]:text-[#131313] transition-colors duration-500 rounded-full px-[24px] py-[10px] cursor-pointer">Recommendations</TabsTrigger>
                  </TabsList>
                </div>
              </div>
              <TabsContent value="overview" className="mt-4 space-y-4">
                <p className="text-[16px] leading-7 text-neutral-800">
                  {show.overview || "No overview available."}
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="rounded-xl border p-4">
                    <div className="text-sm text-neutral-500">Status</div>
                    <div className="font-semibold">{show.status || "-"}</div>
                  </div>
                  <div className="rounded-xl border p-4">
                    <div className="text-sm text-neutral-500">Seasons</div>
                    <div className="font-semibold">
                      {show.number_of_seasons ?? "-"}
                      {typeof show.number_of_seasons === "number" && show.number_of_seasons > 0 ? " seasons" : ""}
                    </div>
                  </div>
                  <div className="rounded-xl border p-4">
                    <div className="text-sm text-neutral-500">Episodes</div>
                    <div className="font-semibold">
                      {show.number_of_episodes ?? "-"}
                      {typeof show.number_of_episodes === "number" && show.number_of_episodes > 0 ? " episodes" : ""}
                    </div>
                  </div>
                  <div className="rounded-xl border p-4">
                    <div className="text-sm text-neutral-500">Networks</div>
                    <div className="font-semibold">
                      {show.networks?.length ? show.networks.map((n) => n.name).join(", ") : "-"}
                    </div>
                  </div>
                </div>
                {creators?.length ? (
                  <div className="rounded-xl border p-4">
                    <div className="text-sm text-neutral-500 mb-1">Created by</div>
                    <div className="font-semibold">{creators.map((c) => c.name).join(", ")}</div>
                  </div>
                ) : null}
                <div className="flex flex-col md:flex-row gap-3 pt-2">
                  <a href={trailerKey ? `https://www.youtube.com/watch?v=${trailerKey}` : undefined} target="_blank" rel="noopener noreferrer" className={`${trailerKey ? "bg-[#023C26] text-[#CBF273] hover:bg-[#CBF273] hover:text-[#023C26]" : "bg-neutral-300 text-neutral-500 pointer-events-none"} text-[18px] font-semibold py-[5px] px-[20px] rounded-full transition duration-500 ease-in-out inline-flex items-center gap-2`}>
                    ▶ Watch Trailer
                  </a>
                  <AddWatch item={watchItem} className="bg-[#000000] text-[#ffffff] border hover:bg-[#fff] hover:text-[#000] hover:border hover:border-[#000] text-[18px] font-semibold py-[5px] px-[20px] rounded-full transition duration-500 ease-in-out flex gap-3 items-center">
                    <Plus /> Add To Watch List
                  </AddWatch>
                </div>
              </TabsContent>
              <TabsContent value="castcrew" className="mt-4 space-y-6">
                {writers?.length ? (
                  <div>
                    <div className="text-sm text-neutral-500 mb-1">Writers</div>
                    <div className="font-semibold">{writers.map((w) => w.name).join(", ")}</div>
                  </div>
                ) : null}
                <div>
                  <div className="text-sm text-neutral-500 mb-2">Top Cast</div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                    {topCast.map((p) => (
                      <div key={p.credit_id || `${p.id}-${p.cast_id}`} className="rounded-xl border overflow-hidden">
                        <div className="relative w-full h-[200px] bg-neutral-200">
                          <Image src={imgUrl(p.profile_path, "w300")} alt={p.name} fill className="object-cover"/>
                        </div>
                        <div className="p-3">
                          <div className="font-semibold leading-tight">{p.name}</div>
                          <div className="text-sm text-neutral-600">as {p.character}</div>
                        </div>
                      </div>
                    ))}
                    {!topCast.length && <div>-</div>}
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="recommend" className="mt-4">
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                  {recommendations.map((r) => (
                    <Link key={r.id} href={`/tv/${r.id}`} className="group rounded-xl border overflow-hidden hover:shadow-lg transition">
                      <div className="relative w-full h-[240px] bg-neutral-200">
                        <Image src={imgUrl(r.poster_path, "w500")} alt={r.name || r.original_name} fill className="object-cover group-hover:scale-[1.03] transition"/>
                      </div>
                      <div className="p-3">
                        <div className="font-semibold line-clamp-2">
                          {r.name || r.original_name}
                        </div>
                        <div className="text-sm text-neutral-600">
                          {r.first_air_date?.slice(0, 4) || "-"}
                        </div>
                      </div>
                    </Link>
                  ))}
                  {!recommendations.length && <div>-</div>}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </Card>
    </div>
  );
}