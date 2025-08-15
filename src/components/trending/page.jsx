import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious, } from "@/components/ui/carousel";

const TMDB_BASE_URL = "https://api.themoviedb.org/3";
const imgUrl = (path, size = "w500") =>
  path ? `https://image.tmdb.org/t/p/${size}${path}` : "/placeholder.png";

async function getTrending(range = "day") {
  const url = `${TMDB_BASE_URL}/trending/movie/${range}?language=en-US&region=ID`;
  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${process.env.TMDB_TOKEN}`,
      accept: "application/json",
    },
    next: { revalidate: 3600 },
  });
  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    throw new Error(`TMDB ${res.status}${detail ? ` - ${detail}` : ""}`);
  }
  return res.json();
}

export default async function Trending() {
  const [trendingDay, trendingWeek] = await Promise.all([
    getTrending("day"),
    getTrending("week"),
  ]);

  return (
    <div>
      <h1 className="text-[40px] font-extrabold mb-5">Trending 🔥</h1>
      <Tabs defaultValue="today" className="w-full">
        <div className="flex justify-between">
          <div>
            <TabsList className="bg-[#FFFFFF] rounded-full">
              <TabsTrigger
                value="today"
                className="text-[16px] font-semibold text-[#B6B6B6] data-[state=active]:bg-[#141D2E] data-[state=active]:text-white transition-colors duration-500 rounded-full px-[33px] py-[10px] my-0"
              >
                Today
              </TabsTrigger>
              <TabsTrigger
                value="thisweek"
                className="text-[16px] font-semibold text-[#B6B6B6] data-[state=active]:bg-[#141D2E] data-[state=active]:text-white transition-colors duration-500 rounded-full px-[33px] py-[10px] my-0"
              >
                This Week
              </TabsTrigger>
            </TabsList>
          </div>
          <div>
            <button>View All</button>
          </div>
        </div>
        <TabsContent value="today" className="mt-4 mx-2">
          <Carousel
            opts={{ align: "start", dragFree: true, loop: true }}
            className="w-full relative"
          >
            <CarouselContent>
              {(trendingDay?.results ?? []).map((m) => (
                <CarouselItem key={m.id} className="md:basis-1/2 lg:basis-1/5">
                    <div className="p-1">
                        <Link href={`/movie/${m.id}`} className="block group">
                            <Card className="overflow-hidden p-0 rounded-2xl">
                                <CardContent className="p-0">
                                <div className="relative">
                                    <Image
                                    src={imgUrl(m.poster_path)}
                                    alt={m.title || m.original_title || "Poster"}
                                    width={500}
                                    height={750}
                                    className="w-full h-auto transition-transform duration-300 group-hover:scale-[1.02]"
                                    sizes="(max-width:768px) 50vw, (max-width:1200px) 20vw, 200px"
                                    />
                                    <div className="absolute inset-x-0 bottom-0">
                                    <div className="bg-gradient-to-t from-black/100 via-black/70 to-transparent p-5">
                                        <div className="text-white text-[20px] md:text-[16px] font-semibold leading-snug line-clamp-2 drop-shadow">
                                            {m.title || m.original_title}
                                        </div>
                                    </div>
                                    </div>
                                </div>
                                </CardContent>
                            </Card>
                        </Link>
                    </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="left-2 top-1/2 -translate-y-1/2 bg-white/90 border shadow-md" />
            <CarouselNext className="right-2 top-1/2 -translate-y-1/2 bg-white/90 border shadow-md" />
          </Carousel>
        </TabsContent>
        <TabsContent value="thisweek" className="mt-4 mx-2">
          <Carousel
            opts={{ align: "start", dragFree: true, loop: true }}
            className="w-full relative"
          >
            <CarouselContent>
              {(trendingWeek?.results ?? []).map((m) => (
                <CarouselItem key={m.id} className="md:basis-1/2 lg:basis-1/5">
                    <div className="p-1">
                        <Link href={`/movie/${m.id}`} className="block group">
                            <Card className="overflow-hidden p-0 rounded-2xl">
                                <CardContent className="p-0">
                                <div className="relative">
                                    <Image
                                    src={imgUrl(m.poster_path)}
                                    alt={m.title || m.original_title || "Poster"}
                                    width={500}
                                    height={750}
                                    className="w-full h-auto transition-transform duration-300 group-hover:scale-[1.02]"
                                    sizes="(max-width:768px) 50vw, (max-width:1200px) 20vw, 200px"
                                    />
                                    <div className="absolute inset-x-0 bottom-0">
                                        <div className="bg-gradient-to-t from-black/100 via-black/70 to-transparent p-5">
                                            <div className="text-white text-[20px] md:text-[16px] font-semibold leading-snug line-clamp-2 drop-shadow">
                                            {m.title || m.original_title}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                </CardContent>
                            </Card>
                        </Link>
                    </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="left-2 top-1/2 -translate-y-1/2 bg-white/90 border shadow-md" />
            <CarouselNext className="right-2 top-1/2 -translate-y-1/2 bg-white/90 border shadow-md" />
          </Carousel>
        </TabsContent>
      </Tabs>
    </div>
  );
}