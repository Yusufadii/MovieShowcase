import Image from "next/image";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";

export const revalidate = 1800;

const TMDB_BASE = "https://api.themoviedb.org/3";
const imgUrl = (path, size = "w500") => path ? `https://image.tmdb.org/t/p/${size}${path}` : "/placeholder.png";

async function tmdbFetch(path) {
    const res = await fetch(`${TMDB_BASE}${path}`, {
        headers: {
        Authorization: `Bearer ${process.env.TMDB_TOKEN}`,
        accept: "application/json",
        },
        next: { revalidate },
    });
    if (!res.ok) throw new Error(`TMDB ${res.status} ${path}`);
    return res.json();
}

async function getTopRatedMany(pages = 5) {
  const reqs = Array.from({ length: pages }, (_, i) => tmdbFetch(`/movie/top_rated?language=en-US&page=${i + 1}`) );
  const results = await Promise.all(reqs);
  const merged = results.flatMap((r) => r.results || []);
  const unique = Array.from(new Map(merged.map((m) => [m.id, m])).values());
  return unique.filter((m) => m.poster_path);
}

export const metadata = {
  title: "Top Rated • Movies",
  description: "Top rated movies from TMDB",
};

export default async function TopRatedPage() {
    const movies = await getTopRatedMany(5);

    return (
        <div className="w-full max-w-[1200px] mx-auto px-4 py-8">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 xl:grid-cols-6 gap-4">
                {movies.map((m) => (
                    <Link key={m.id} href={`/movie/${m.id}`} className="group block" prefetch>
                        <Card className="overflow-hidden p-0 rounded-2xl border-none bg-transparent">
                            <CardContent className="p-0">
                                <div className="relative">
                                    <Image src={imgUrl(m.poster_path)} alt={m.title || m.original_title || "Poster"} width={500} height={750} className="w-full h-auto transition-transform duration-300 group-hover:scale-[1.02]" sizes="(max-width:768px) 50vw, (max-width:1200px) 20vw, 200px"/>
                                    <div className="absolute inset-x-0 bottom-0">
                                        <div className="bg-gradient-to-t from-black/100 via-black/70 to-transparent p-5">
                                            <div className="text-white text-[30px] md:text-[17px] font-semibold leading-snug line-clamp-2 drop-shadow">
                                                {m.title || m.original_title}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </Link>
                ))}
            </div>
        </div>
    );
}