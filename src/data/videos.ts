export type Video = { title: string; embedUrl: string };
export type GalleryImage = { src: string; alt: string };

// Eric supplies 2–3 embed URLs (YouTube/Vimeo privacy-nocookie embed form) and
// gallery images. While both arrays are empty, the Watch section renders a
// "coming soon" state (see Watch.astro).
export const videos: Video[] = [];
export const gallery: GalleryImage[] = [];
