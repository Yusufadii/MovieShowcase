'use client';

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";

const KEY = "dm_watchlist_v1";
const imgUrl = (path, size = "w500") => path ? `https://image.tmdb.org/t/p/${size}${path}` : "/placeholder.png";

export default function WatchListClient() {
    const [items, setItems] = useState(null);
    useEffect(() => {
        try {
            const arr = JSON.parse(localStorage.getItem(KEY) || "[]");
            setItems(arr);
        } catch {
            setItems([]);
        }
    }, []);

    const remove = (media_type, id) => {
        try {
            const next = (JSON.parse(localStorage.getItem(KEY) || "[]") || []).filter( (x) => !(x.media_type === media_type && x.id === id) );
            localStorage.setItem(KEY, JSON.stringify(next));
            setItems(next);
        } catch {}
    };

    const clearAll = () => {
        localStorage.setItem(KEY, "[]");
        setItems([]);
    };

    if (items === null) {
        return <div className="w-full max-w-[1200px] mx-auto px-4 py-8">Loading…</div>;
    }

    if (items.length === 0) {
        return (
            <div className="w-full max-w-[1200px] mx-auto px-4 py-10 text-center">
                <p className="text-white">
                    Belum ada item. Tambahkan dari tombol <b>Add To Watch List</b> di halaman detail.
                </p>
            </div>
        );
    }

    return (
        <div className="w-full max-w-[1200px] mx-auto px-4">
            <div className="mb-4 flex items-center justify-between">
                <span className="text-sm text-white/70">
                    {items.length} item{items.length > 1 ? "s" : ""}
                </span>
                <button onClick={clearAll} className="text-sm px-3 py-1 rounded bg-[#023C26] text-[#CBF273] hover:bg-[#CBF273] hover:text-[#131313] transition duration-500 ease-in-out" title="Clear all" >
                    Clear all
                </button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4">
                {items.map((m) => {
                    const href = `/${m.media_type}/${m.id}`;
                    const title = m.title;
                    const poster = m.poster_path || m.backdrop_path;
                    const year = m.release_date ? m.release_date.slice(0, 4) : "";
                    
                    return (
                        <div key={`${m.media_type}-${m.id}`} className="group relative">
                            <Link href={href} className="block">
                                <Card className="overflow-hidden p-0 rounded-2xl border-none bg-transparent">
                                    <CardContent className="p-0">
                                        <div className="relative w-full aspect-[2/3]">
                                            <Image src={imgUrl(poster)} alt={title || "Poster"} fill className="object-cover transition-transform duration-300 group-hover:scale-[1.02] rounded-2xl" sizes="(max-width:480px) 45vw, (max-width:768px) 30vw, (max-width:1200px) 20vw, 200px" priority={false}/>
                                            <div className="absolute inset-x-0 bottom-0">
                                                <div className="bg-gradient-to-t from-black/100 via-black/70 to-transparent p-3 sm:p-4 md:p-5 rounded-b-2xl">
                                                    <div className="text-white text-[14px] sm:text-[15px] md:text-[17px] font-semibold leading-snug line-clamp-2 drop-shadow">
                                                        {title}{year ? ` (${year})` : ""}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </Link>
                            <button onClick={(e) => { e.preventDefault(); remove(m.media_type, m.id); }} className="bg-[#023C26] text-[#CBF273] hover:bg-[#CBF273] hover:text-[#131313] transition duration-500 ease-in-out absolute top-2 right-2 text-xs sm:text-[13px] px-2 py-1 rounded" title="Remove">
                                Remove
                            </button>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}