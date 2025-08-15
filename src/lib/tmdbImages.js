const IMAGE_BASE = 'https://image.tmdb.org/t/p/';

export const imgUrl = (path, size = 'w500') => path? `${IMAGE_BASE}${size}${path}` : '/placeholder.png';