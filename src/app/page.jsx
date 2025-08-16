import Trending from "@/components/trending/page";
import Popular from "@/components/popular/page";
import NewRelease from "@/components/newRelease/page";
import Trailers from "@/components/Trailers/page";

export default async function Home() {
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