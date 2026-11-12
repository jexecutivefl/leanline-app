/* LEANLINE service worker — build db7d937de95e
   Assets are cache-first. The page itself (a navigation) is network-first with a
   short timeout and the cache as fallback (LL-651): an online open shows the
   newest build at once, an offline open still works from cache. No third party
   is ever contacted — every request here is same-origin. */
const CACHE = "leanline-db7d937de95e";
const NAV_TIMEOUT_MS = 4000;
const ASSETS = ["./", "./index.html", "./manifest.webmanifest",
                "./icon-192.png", "./icon-512.png", "./icon-maskable-512.png", "./apple-touch-icon.png"];

self.addEventListener("install", e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

/* Every navigation inside the scope is answered with the app shell itself —
   this is a single-page app, so that is the only page there is. The shell is
   fetched by its own name, same-origin only, redirects refused, and cached only
   when the response is a plain same-origin 200: nothing else can ever be
   written into the shell's cache slot. */
function pageFromNetwork() {
  const ctl = ("AbortController" in self) ? new AbortController() : null;
  const t = ctl ? setTimeout(() => ctl.abort(), NAV_TIMEOUT_MS) : null;
  const init = { cache: "no-store", credentials: "same-origin", mode: "same-origin", redirect: "error" };
  if (ctl) init.signal = ctl.signal;
  return fetch("./index.html", init)
    .then(res => {
      if (t) clearTimeout(t);
      if (!res || res.status !== 200 || res.type !== "basic" || res.redirected) throw new Error("not the shell");
      const copy = res.clone();
      caches.open(CACHE).then(c => { c.put("./index.html", copy.clone()); c.put("./", copy); });
      return res;
    })
    .catch(() => caches.match("./index.html").then(hit => hit || caches.match("./")));
}

self.addEventListener("fetch", e => {
  const req = e.request;
  if (req.method !== "GET") return;
  if (req.mode === "navigate") { e.respondWith(pageFromNetwork()); return; }
  e.respondWith(
    caches.match(req).then(hit => {
      if (hit) return hit;
      return fetch(req)
        .then(res => {
          if (res && res.status === 200 && res.type === "basic") {
            const copy = res.clone();
            caches.open(CACHE).then(c => c.put(req, copy));
          }
          return res;
        })
        .catch(() => {
          /* offline and not cached: a navigation still gets the app shell */
          if (req.mode === "navigate") return caches.match("./index.html");
          return new Response("", { status: 504, statusText: "offline" });
        });
    })
  );
});
