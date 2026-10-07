/** Demo photos shipped in public/media. Staff uploads (data URLs and other https) stay as stored. */
const DEMO_MEDIA: Record<string, string> = {
  "photo-1580582932707-520aed937b7b": "/media/classroom.jpg",
  "photo-1521587760476-6c12a4b040da": "/media/library.jpg",
  "photo-1562774053-701939374585": "/media/campus.jpg",
  "photo-1427504494785-3a9ca7044f45": "/media/walk.jpg",
  "photo-1461896836934-ffe607ba6851": "/media/sports.jpg",
  "photo-1574629810360-7efbbe195018": "/media/sports.jpg",
  "photo-1514525253161-7a46d19cd819": "/media/culture.jpg",
  "photo-1532094349884-543bc11b234d": "/media/science.jpg",
  "photo-1507003211169-0a1dd7228f2d": "/media/portrait-0.jpg",
  "photo-1494790108377-be9c29b29330": "/media/portrait-1.jpg",
  "photo-1472099645785-5658abf4ff4e": "/media/portrait-2.jpg",
  "photo-1438761681033-6461ffad8d80": "/media/portrait-3.jpg",
  "photo-1500648767791-00dcc994a43e": "/media/portrait-4.jpg",
  "photo-1544005313-94ddf0286df2": "/media/portrait-5.jpg",
  "photo-1506794778202-cad84cf45f1d": "/media/portrait-6.jpg",
  "photo-1573496359142-b8d87734a5a2": "/media/portrait-7.jpg",
  "photo-1560250097-0b93528c311a": "/media/portrait-8.jpg",
  "photo-1580489944761-15a19d654956": "/media/portrait-9.jpg",
};

export function resolvePhoto(url?: string): string {
  const raw = (url ?? "").trim();
  if (!raw || raw.startsWith("data:") || raw.startsWith("/")) return raw;
  if (!raw.includes("images.unsplash.com")) return raw;
  const id = raw.match(/photo-[0-9]+-[a-z0-9]+/i)?.[0];
  if (id && DEMO_MEDIA[id]) return DEMO_MEDIA[id];
  return raw;
}
