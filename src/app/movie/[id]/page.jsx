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

async function getMovie(id) { return tmdbFetch(`/movie/${id}?language=en-US`); }
async function getCredits(id) { return tmdbFetch(`/movie/${id}/credits?language=en-US`); }
async function getRecommendations(id) { return tmdbFetch(`/movie/${id}/recommendations?language=en-US`); }
async function getVideos(id) { return tmdbFetch(`/movie/${id}/videos?language=en-US`); }

function minutesToHM(min) {
    if (!min && min !== 0) return "-";
    const h = Math.floor(min / 60);
    const m = Math.round(min % 60);
    return `${h > 0 ? `${h}h ` : ""}${m}m`;
}

function pickTrailer(videos) {
    if (!videos?.results?.length) return null;
    const byPriority = videos.results.find((v) =>
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
        const movie = await getMovie(id);
        return {
        title: `${movie.title} (${movie.release_date?.slice(0, 4) || ""})`,
        description: movie.overview,
        openGraph: { images: [imgUrl(movie.backdrop_path || movie.poster_path, "w780")] },
        };
    } catch {
        return { title: "Movie" };
    }
}

export default async function MovieDetails({ params }) {
    const { id } = await params;

    const [movie, credits, recs, videos] = await Promise.all([
        getMovie(id),
        getCredits(id),
        getRecommendations(id),
        getVideos(id),
    ]).catch(() => [null, null, null, null]);

    if (!movie?.id) return notFound();

    const year = movie.release_date ? movie.release_date.slice(0, 4) : "-";
    const genres = movie.genres?.map((g) => g.name).join(", ") || "-";
    const runtime = minutesToHM(movie.runtime);
    const trailerKey = pickTrailer(videos);

    const director = credits?.crew?.find((c) => c.job === "Director") || credits?.crew?.find((c) => c.department === "Directing");
    const writers = (credits?.crew || []) .filter((c) => ["Writer", "Screenplay", "Story"].includes(c.job)) .slice(0, 3);
    const topCast = (credits?.cast || []).slice(0, 10);
    const recommendations = (recs?.results || []).slice(0, 10);

    const watchItem = {
        id: movie.id,
        media_type: "movie",
        title: movie.title,
        poster_path: movie.poster_path || null,
        backdrop_path: movie.backdrop_path || null,
        release_date: movie.release_date || null,
    };

    return (
        <div className="w-full max-w-[1200px] mx-auto mt-10 px-4">
            <Card className="overflow-hidden">
                <div className="flex flex-col md:flex-row gap-8 md:gap-10 p-[10px] md:p-[30px]">
                    <div className="shrink-0">
                        <div className="relative w-full h-[500px] md:w-[280px] md:h-[500px] overflow-hidden rounded-2xl bg-neutral-200">
                            <Image src={imgUrl(movie.poster_path, "w500")} alt={movie.title} fill className="object-cover" priority/>
                        </div>
                    </div>
                    <div className="flex-1 flex flex-col gap-4">
                        <h1 className="text-[34px] md:text-[40px] font-extrabold text-[#131313] leading-tight">
                            {movie.title} <span className="font-medium">({year})</span>
                        </h1>
                        <div className="flex flex-wrap items-center gap-x-5 gap-y-1 text-[15px] text-neutral-700">
                        <span>{movie.release_date || "-"}</span>
                        <span className="opacity-40">•</span>
                        <span>{genres}</span>
                        <span className="opacity-40">•</span>
                        <span>{runtime}</span>
                        {movie.vote_average ? (
                            <>
                            <span className="opacity-40">•</span>
                            <span>⭐ {movie.vote_average.toFixed(1)}</span>
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
                                {movie.overview || "No overview available."}
                            </p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="rounded-xl border p-4">
                                    <div className="text-sm text-neutral-500">Status</div>
                                    <div className="font-semibold">{movie.status || "-"}</div>
                                </div>
                                <div className="rounded-xl border p-4">
                                    <div className="text-sm text-neutral-500">Budget</div>
                                    <div className="font-semibold">
                                        {movie.budget ? `$${movie.budget.toLocaleString()}` : "-"}
                                    </div>
                                </div>
                                <div className="rounded-xl border p-4">
                                    <div className="text-sm text-neutral-500">Revenue</div>
                                    <div className="font-semibold">
                                        {movie.revenue ? `$${movie.revenue.toLocaleString()}` : "-"}
                                    </div>
                                </div>
                                <div className="rounded-xl border p-4">
                                    <div className="text-sm text-neutral-500">Production Companies</div>
                                    <div className="font-semibold">
                                        {movie.production_companies?.length ? movie.production_companies.map((c) => c.name).join(", ") : "-"}
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col md:flex-row gap-3 pt-2">
                                <a href={trailerKey ? `https://www.youtube.com/watch?v=${trailerKey}` : undefined} target="_blank" rel="noopener noreferrer" className={`${trailerKey ? "bg-[#023C26] text-[#CBF273] hover:bg-[#CBF273] hover:text-[#023C26]" : "bg-neutral-300 text-neutral-500 pointer-events-none"} text-[18px] font-semibold py-[5px] px-[20px] rounded-full transition duration-500 ease-in-out inline-flex items-center gap-2`}>
                                    ▶ Watch Trailer
                                </a>
                                <AddWatch item={watchItem} className="bg-[#000000] text-[#ffffff] border hover:bg-[#fff] hover:text-[#000] hover:border hover:border-[#000] text-[18px] font-semibold py-[5px] px-[20px] rounded-full transition duration-500 ease-in-out flex gap-3 items-center" >
                                    <Plus /> Add To Watch List
                                </AddWatch>
                            </div>
                        </TabsContent>
                        <TabsContent value="castcrew" className="mt-4 space-y-6">
                            <div>
                                <div className="text-sm text-neutral-500 mb-1">Director</div>
                                    <div className="font-semibold">{director ? director.name : "-"}</div>
                                </div>
                                {writers?.length ? (
                                <div>
                                    <div className="text-sm text-neutral-500 mb-1">Writers</div>
                                    <div className="font-semibold">{writers.map((w) => w.name).join(", ")}</div>
                            </div>
                            ) : null}
                            <div>
                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                                    {topCast.map((p) => (
                                        <div key={p.cast_id || p.credit_id} className="rounded-xl border overflow-hidden">
                                            <div className="relative w-full h-[200px] bg-neutral-200">
                                                <Image src={imgUrl(p.profile_path, "w300")} alt={p.name} fill className="object-cover" />
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
                                    <Link key={r.id} href={`/movie/${r.id}`} className="group rounded-xl border overflow-hidden hover:shadow-lg transition">
                                        <div className="relative w-full h-[240px] bg-neutral-200">
                                            <Image src={imgUrl(r.poster_path, "w500")} alt={r.title || r.name} fill className="object-cover group-hover:scale-[1.03] transition" />
                                        </div>
                                        <div className="p-3">
                                            <div className="font-semibold line-clamp-2">{r.title || r.name}</div>
                                            <div className="text-sm text-neutral-600">{r.release_date?.slice(0, 4) || "-"}</div>
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