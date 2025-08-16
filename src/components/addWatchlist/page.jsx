'use client';
import { useRouter } from 'next/navigation';

const KEY = 'dm_watchlist_v1';

export default function AddWatch({ item, className = '', children }) {
  const router = useRouter();

    const onClick = () => {
        try {
            const arr = JSON.parse(localStorage.getItem(KEY) || '[]');
            const exists = arr.some(x => x.media_type === item.media_type && x.id === item.id);
            if (!exists) {
                arr.unshift({
                id: item.id,
                media_type: item.media_type || 'movie',
                title: item.title,
                poster_path: item.poster_path || null,
                backdrop_path: item.backdrop_path || null,
                release_date: item.release_date || null,
                });
                localStorage.setItem(KEY, JSON.stringify(arr.slice(0, 500)));
            }
        } catch (e) {
        console.error(e);
        }
        router.push('/watch-list');
    };
    return (
        <button onClick={onClick} className={className} aria-label="Add to Watch List">
            {children ?? '+'}
        </button>
    );
}