export default function Loading() {
    return (
        <div className="w-full max-w-[1200px] mx-auto px-4 py-6 animate-pulse" aria-busy="true">
            <div className="h-[220px] sm:h-[280px] md:h-[360px] rounded-3xl bg-neutral-800/50 mb-6" />
            <div className="h-5 w-40 bg-neutral-800/50 rounded mb-4" />
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4">
                {Array.from({ length: 12 }).map((_, i) => (
                    <div key={i} className="relative w-full aspect-[2/3]">
                        <div className="absolute inset-0 bg-neutral-800/50 rounded-2xl" />
                            <div className="absolute inset-x-0 bottom-0 p-3 sm:p-4">
                            <div className="h-4 w-3/4 bg-neutral-800/70 rounded" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}