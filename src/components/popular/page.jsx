import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious, } from "@/components/ui/carousel";

const TMDB_BASE_URL = "https://api.themoviedb.org/3";
const imgUrl = (path, size = "w500") => path ? `https://image.tmdb.org/t/p/${size}${path}` : "/placeholder.png";

async function getStreaming(page = 1) {
    const url = `${TMDB_BASE_URL}/discover/movie` + `?language=en-US&region=ID` + `&watch_region=ID` + `&with_watch_monetization_types=flatrate,free,ads` + `&sort_by=popularity.desc` + `&include_adult=false&page=${page}`;
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

async function getInTheaters(page = 1) {
    const url = `${TMDB_BASE_URL}/movie/now_playing?language=en-US&region=ID&page=${page}`;
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

export default async function TrendingAvailability() {
    const [streaming, inTheaters] = await Promise.all([
        getStreaming(1),
        getInTheaters(1),
    ]);

    return (
        <div>
            <Tabs defaultValue="streaming" className="w-full">
                <div className="flex flex-col justify-center md:flex-row md:justify-between items-center">
                    <div>
                        <h1 className="text-[40px] font-extrabold text-white">Popular ⭐</h1>
                    </div>
                    <div>
                        <TabsList className="bg-[#023C26] rounded-full p-0 shadow-[0_4px_10px_rgba(203,242,115,0.1)]">
                            <TabsTrigger value="streaming" className="text-[16px] font-semibold text-[#CBF273] data-[state=active]:bg-[#CBF273] data-[state=active]:text-[#131313] transition-colors duration-500 rounded-full px-[33px] py-[10px] cursor-pointer">
                                Streaming
                            </TabsTrigger>
                            <TabsTrigger value="intheaters" className="text-[16px] font-semibold text-[#CBF273] data-[state=active]:bg-[#CBF273] data-[state=active]:text-[#131313] transition-colors duration-500 rounded-full px-[33px] py-[10px] cursor-pointer">
                                In Theaters
                            </TabsTrigger>
                        </TabsList>
                    </div>
                </div>
                <TabsContent value="streaming" className="mt-3 mx-4 md:mx-0">
                    <Carousel opts={{ align: "start", dragFree: true, loop: true }} className="w-full relative">
                        <CarouselContent>
                            {(streaming?.results ?? []).map((m) => (
                                <CarouselItem key={m.id} className="md:basis-1/2 lg:basis-1/5">
                                    <div className="p-1">
                                        <Link href={`/movie/${m.id}`} className="block group">
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
                                    </div>
                                </CarouselItem>
                            ))}
                        </CarouselContent>
                        <CarouselPrevious className="left-2 top-1/2 -translate-y-1/2 bg-white/90 border shadow-md" />
                        <CarouselNext className="right-2 top-1/2 -translate-y-1/2 bg-white/90 border shadow-md" />
                    </Carousel>
                </TabsContent>
                <TabsContent value="intheaters" className="mt-4 mx-2">
                    <Carousel opts={{ align: "start", dragFree: true, loop: true }} className="w-full relative">
                        <CarouselContent>
                            {(inTheaters?.results ?? []).map((m) => (
                                <CarouselItem key={m.id} className="md:basis-1/2 lg:basis-1/5">
                                    <div className="p-1">
                                        <Link href={`/movie/${m.id}`} className="block group">
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