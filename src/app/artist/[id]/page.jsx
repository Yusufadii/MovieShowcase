import { notFound } from "next/navigation";
import { Card } from "@/components/ui/card";
import Image from "next/image";

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

async function getPerson(id) {
  return tmdbFetch(`/person/${id}?language=en-US`);
}

function calcAge(birthday, deathday) {
    if (!birthday) return null;
    const b = new Date(birthday);
    const end = deathday ? new Date(deathday) : new Date();
    let age = end.getFullYear() - b.getFullYear();
    const m = end.getMonth() - b.getMonth();
    if (m < 0 || (m === 0 && end.getDate() < b.getDate())) age--;
    return age;
}

export async function generateMetadata({ params }) {
    try {
        const { id } = await params;
        const person = await getPerson(id);
        return {
        title: `${person.name} • Artist`,
        description: person.biography || `Profile of ${person.name}`,
        openGraph: {
            images: [imgUrl(person.profile_path, "w780")],
        },
        };
    } catch {
        return { title: "Artist" };
    }
}

export default async function ArtistOverviewPage({ params }) {
    const { id } = await params;
    const person = await getPerson(id).catch(() => null);
    if (!person?.id) return notFound();
    const age = calcAge(person.birthday, person.deathday);
    
    return (
        <div className="w-full max-w-[1200px] mx-auto mt-10 px-4">
            <Card className="overflow-hidden">
                <div className="flex flex-col md:flex-row gap-8 md:gap-10 p-[10px] md:p-[30px]">
                <div className="shrink-0">
                    <div className="relative w-full h-[420px] md:w-[280px] md:h-[500px] overflow-hidden rounded-2xl bg-neutral-200">
                    <Image src={imgUrl(person.profile_path, "w500")} alt={person.name} fill className="object-cover" priority/>
                    </div>
                </div>
                <div className="flex-1 flex flex-col gap-4">
                    <h1 className="text-[34px] md:text-[40px] font-extrabold text-[#131313] leading-tight">
                    {person.name}
                    </h1>
                    <div className="flex flex-wrap items-center gap-x-5 gap-y-1 text-[15px] text-neutral-700">
                        <span>{person.known_for_department || "-"}</span>
                        {person.birthday && (
                            <>
                            <span className="opacity-40">•</span>
                            <span>
                                {person.birthday}
                                {person.deathday ? ` – ${person.deathday}` : ""}
                                {age !== null && !person.deathday ? ` (${age}y)` : ""}
                            </span>
                            </>
                        )}
                        {person.place_of_birth && ( <> <span className="opacity-40">•</span> <span>{person.place_of_birth}</span> </>)}
                        {typeof person.popularity === "number" && ( <> <span className="opacity-40">•</span> <span>Popularity {person.popularity.toFixed(1)}</span> </>)}
                    </div>
                    <div className="mt-2">
                        <div className="text-sm text-neutral-500 mb-1">Biography</div>
                            <p className="text-[16px] leading-7 text-neutral-800 whitespace-pre-line">
                                {person.biography || "No biography available."}
                            </p>
                        </div>
                    </div>
                </div>
            </Card>
        </div>
    );
}