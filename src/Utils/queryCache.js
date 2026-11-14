export const hasLikeKey = (userId, photoId) => ['hasLike', Number(userId), Number(photoId)];

export const isPrivateQuery = (query) => query.queryKey[0] === 'hasLike';

export function removePhotoFromFeed(feed, photoId) {
  if (!feed) return feed;
  const keep = (photo) => Number(photo.id) !== Number(photoId);
  if (Array.isArray(feed)) return feed.filter(keep);
  if (!Array.isArray(feed.pages)) return feed;
  return { ...feed, pages: feed.pages.map((page) => page.filter(keep)) };
}
