// Retire the cache used by older releases for public chat image URLs.
// Private media is fetched with authorization and never persisted by the SW.
self.addEventListener('activate', (event) => {
  event.waitUntil(caches.delete('cats-chat-images'));
});
