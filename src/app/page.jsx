import Image from "next/image";
import { tmdb } from "@/lib/tmdb";
import { imgUrl } from "@/lib/tmdbImages";
import Trending from "@/components/trending/page";
import Popular from "@/components/popular/page";

export default async function Home() {
  const [trending, popular, topRated] = await Promise.all([
    tmdb("/trending/movie/day", { language: "id-ID", region: "ID" }),
    tmdb("/movie/popular", { language: "id-ID", region: "ID", page: 1 }),
    tmdb("/movie/top_rated", { language: "id-ID", region: "ID", page: 1 }),
  ]);

  return (
    <main className="w-full max-w-[1200px] bg-[#EEEFF3] rounded-[30px] md:rounded-[50px] p-10 md:p-[30px] mx-auto mt-10 mb-10">
      <Trending />
      <Popular />
    </main>
  );
}