/**
 * Last year's NEXUS photos for the launch film (from the CAADS 25-26 Drive).
 *
 * Files live in `public/launch/photos/`. The order matters: the first 14 drift past
 * slowly in the memory chapter, the rest are cut on the beat in the montage.
 * Group and action shots only, each checked for sharpness.
 * To swap a photo, replace the file (landscape, about 1600px wide, WebP or JPG).
 */
export const PHOTOS: string[] = Array.from({ length: 25 }, (_, i) => `/launch/photos/${String(i + 1).padStart(2, '0')}.webp`);

/** How many frames the film cycles through when there are no photos. */
export const PLACEHOLDER_COUNT = 12;
