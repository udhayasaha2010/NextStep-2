// Simple Service Worker for basic caching of the shell and offline page
const CACHE_NAME = 'nextstep-v1'
const OFFLINE_URL = '/offline'
const ASSETS_TO_CACHE = [
  '/',
  '/offline',
  '/manifest.json',
  '/globals.css'
]

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS_TO_CACHE))
  )
})

self.addEventListener('fetch', (event) => {
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request).catch(() => caches.match(OFFLINE_URL))
    )
  } else {
    event.respondWith(
      caches.match(event.request).then((response) => response || fetch(event.request))
    )
  }
})
