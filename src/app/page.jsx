import Image from "next/image";
import { tmdb } from "@/lib/tmdb";
import { imgUrl } from "@/lib/tmdbImages";
import Trending from "@/components/trending/page";
import Popular from "@/components/popular/page";
import BigCard from "@/components/bigCard/page";
import NewRelease from "@/components/newRelease/page";
import Trailers from "@/components/Trailers/page";

export default async function Home() {
  const [trending, popular, topRated] = await Promise.all([
    tmdb("/trending/movie/day", { language: "id-ID", region: "ID" }),
    tmdb("/movie/popular", { language: "id-ID", region: "ID", page: 1 }),
    tmdb("/movie/top_rated", { language: "id-ID", region: "ID", page: 1 }),
  ]);

  return (
    <main className="w-full max-w-[1200px] mx-auto mt-10 mb-10">
      <div className="mb-10">
        <NewRelease />
      </div>
      <div>
        <Trending />
      </div>
      <div className="my-10 md:my-15">
        <Trailers />
      </div>
      <div>
        <Popular />
      </div>
    </main>
  );
}