/**
 * Portfolio. All media here is real AX.Visuals work.
 * [EDIT] Add business projects (restaurants, hotels, products) as you shoot them —
 * add a matching category to `workCategories` and the filters update automatically.
 */

export type WorkCategory = "graduation" | "ceremonies" | "celebrations" | "cinematic";

export const workCategories: { id: WorkCategory; label: string }[] = [
  { id: "graduation", label: "Portraits & Graduation" },
  { id: "ceremonies", label: "Ceremonies & Weddings" },
  { id: "celebrations", label: "Celebrations" },
  { id: "cinematic", label: "Culture & Cinematic" },
];

export interface Photo {
  src: string;
  alt: string;
  w: number;
  h: number;
}

export interface Reel {
  youtubeId: string;
  title: string;
  /** aspect of the uploaded video (w / h) */
  aspect: number;
}

export interface Project {
  slug: string;
  title: string;
  client: string;
  category: WorkCategory;
  location: string;
  year: string;
  package: string;
  deliverables: string;
  format: "reels" | "photos" | "mixed";
  camera: string;
  cover: Photo;
  reels: Reel[];
  photos: Photo[];
  brief: string;
  approach: string;
  result: string;
  credits: { role: string; name: string }[];
}

const p = (file: string, alt: string, w: number, h: number): Photo => ({ src: `/media/${file}`, alt, w, h });

export const photos = {
  redWall: p("grad-red-wall.jpg", "Graduate in black gown and purple hood looking down at his scroll case against a terracotta wall", 1333, 2000),
  tubeLandscape: p("grad-tube-landscape.jpg", "Close-up of hands holding a purple velvet London Metropolitan University × ESOFT scroll case", 2000, 1333),
  tubeHands: p("grad-tube-hands.jpg", "Graduate holding a purple scroll case in both hands, gold foil lettering catching the light", 1333, 2000),
  tubeForward: p("grad-tube-forward.jpg", "Graduate holding the scroll case towards the lens, face softly out of focus behind", 1333, 2000),
  lowAngle: p("grad-low-angle.jpg", "Low-angle shot of a graduate in cap and gown extending the scroll case down towards the camera", 1333, 2000),
  profile: p("grad-profile.jpg", "Profile portrait of a graduate in mortarboard with purple tassel, scroll case on his shoulder", 1333, 2000),
  postGraduated: p("post-officially-graduated.jpg", "Designed carousel post titled 'Officially graduated' with a mortarboard held to camera", 1080, 1350),
  postHardWork: p("post-hard-work.jpg", "Designed carousel post titled 'Hard work paid off' with a profile portrait", 1080, 1350),
  postNextChapter: p("post-next-chapter.jpg", "Designed carousel post titled 'Next chapter begins' with a full-length portrait", 1080, 1350),
  postTubeDark: p("post-tube-dark.jpg", "Moody close-up of the purple scroll case held across a black gown", 1080, 1350),
  postMadeIt: p("post-made-it.jpg", "Designed carousel post titled 'Made it' with the scroll case held in both hands", 1080, 1350),
  postChapter: p("post-chapter-completed.jpg", "Designed collage post titled 'A chapter completed' — graduate kissing the scroll case", 1080, 1350),
  postDreams: p("post-dreams-reality.jpg", "Designed triptych post titled 'From dreams to reality'", 1080, 1350),
  cerDeiva: p("ceremony-deiva-satchiyaga.jpg", "Temple ceremony: family members blessing the couple, colour frame above a black-and-white frame", 1080, 1350),
  cerMangalyam: p("ceremony-mangalyam.jpg", "Priest preparing the thali ceremony offerings of bananas and coconut", 1080, 1350),
  cerAnbin: p("ceremony-anbin-adaiyalam.jpg", "Groom applying kungumam to the bride's parting, split black-and-white and colour", 1080, 1350),
  cerSirakattum: p("ceremony-sirakattum.jpg", "Couple smiling at a mirror during the ceremony, bride bowing in prayer below", 1080, 1350),
};

export const reels: Reel[] = [
  { youtubeId: "qznZf6IQ1pM", title: "Showreel", aspect: 16 / 9 },
  { youtubeId: "O1MLFrXW_3Y", title: "Nallur Cinematic Reel", aspect: 4 / 3 },
  { youtubeId: "mU3a-WvqPUw", title: "Nallur Cinematic Reel II", aspect: 16 / 9 },
  { youtubeId: "oLNeoaWaiGk", title: "Cinematic Reel", aspect: 16 / 9 },
  { youtubeId: "_zKvcEZlW2I", title: "Love Reel", aspect: 16 / 9 },
  { youtubeId: "VnaE8Qpd1GI", title: "Birthday Reel", aspect: 16 / 9 },
  { youtubeId: "-jZy4vw_PzM", title: "Birthday Reel II", aspect: 16 / 9 },
  { youtubeId: "QYIsp8kohJc", title: "Birthday Reel III", aspect: 16 / 9 },
];

const reel = (id: string) => reels.find((r) => r.youtubeId === id)!;

export const projects: Project[] = [
  {
    slug: "graduation-portrait-session",
    title: "The Graduate",
    client: "Private client", // [EDIT]
    category: "graduation",
    location: "Sri Lanka", // [EDIT]
    year: "2026", // [EDIT]
    package: "Photography only",
    deliverables: "Edited portrait series",
    format: "photos",
    camera: "ISO 400 · 1/250 · f/1.8 · 85mm", // [EDIT] real camera/lens
    cover: photos.redWall,
    reels: [],
    photos: [photos.redWall, photos.tubeLandscape, photos.profile, photos.tubeForward, photos.lowAngle, photos.tubeHands],
    brief: "A graduation day portrait series for a London Metropolitan University × ESOFT graduate — something more considered than the usual line-up photo.",
    approach:
      "We treated the scroll case as the hero prop: shallow depth of field, low angles and a terracotta wall that makes the purple hood sing. A deliberate, filmic grade holds skin tones warm and blacks deep.",
    result: "A cohesive set of editorial portraits ready for print, LinkedIn and Instagram.",
    credits: [
      { role: "Photography", name: "AX.Visuals" },
      { role: "Colour grade", name: "AX.Visuals" },
    ],
  },
  {
    slug: "graduation-carousel",
    title: "Officially Graduated",
    client: "Private client", // [EDIT]
    category: "graduation",
    location: "Sri Lanka", // [EDIT]
    year: "2026", // [EDIT]
    package: "Photography + design",
    deliverables: "7 designed carousel posts",
    format: "photos",
    camera: "4:5 · 1080 × 1350 · Instagram carousel",
    cover: photos.postNextChapter,
    reels: [],
    photos: [
      photos.postGraduated,
      photos.postHardWork,
      photos.postNextChapter,
      photos.postTubeDark,
      photos.postMadeIt,
      photos.postChapter,
      photos.postDreams,
    ],
    brief: "Turn one shoot into a scroll-stopping Instagram carousel that tells the story of the day.",
    approach:
      "Each slide pairs one frame with a short editorial line in a fine display serif. Ghosted, enlarged crops sit behind each photo so the carousel reads as one continuous piece.",
    result: "A 7-slide, ready-to-post carousel — the same thinking we bring to a business's content library.",
    credits: [
      { role: "Photography", name: "AX.Visuals" },
      { role: "Layout & design", name: "AX.Visuals" },
    ],
  },
  {
    slug: "deiva-satchiyaga",
    title: "தெய்வ சாட்சியாக",
    client: "Private client", // [EDIT]
    category: "ceremonies",
    location: "Sri Lanka", // [EDIT]
    year: "2026", // [EDIT]
    package: "Ceremony coverage",
    deliverables: "Designed ceremony posts + edited photos",
    format: "mixed",
    camera: "ISO 1600 · 1/200 · f/2.0 · 35mm", // [EDIT]
    cover: photos.cerSirakattum,
    reels: [reel("_zKvcEZlW2I")],
    photos: [photos.cerDeiva, photos.cerMangalyam, photos.cerAnbin, photos.cerSirakattum],
    brief: "Document a temple ceremony with the warmth of the moment and the weight of the ritual.",
    approach:
      "Unobtrusive coverage in low temple light, then a colour-meets-monochrome design language with Tamil title typography that honours the occasion.",
    result: "A set of shareable, story-led posts the family could publish the same week.",
    credits: [
      { role: "Photography", name: "AX.Visuals" },
      { role: "Design", name: "AX.Visuals" },
    ],
  },
  {
    slug: "nallur-cinematic",
    title: "Nallur",
    client: "AX.Visuals original",
    category: "cinematic",
    location: "Nallur, Jaffna",
    year: "2026", // [EDIT]
    package: "Cinematic Reel",
    deliverables: "2 cinematic Reels",
    format: "reels",
    camera: "4K · 24FPS · f/1.8",
    cover: photos.lowAngle,
    reels: [reel("O1MLFrXW_3Y"), reel("mU3a-WvqPUw")],
    photos: [],
    brief: "A cinematic portrait of Nallur — colour, crowd and devotion, cut for social.",
    approach: "Handheld, rhythm-first shooting with an edit built around the music and a rich, warm grade.",
    result: "Two short cinematic Reels made for Instagram and YouTube.",
    credits: [
      { role: "Camera & edit", name: "AX.Visuals" },
      { role: "Colour grade", name: "AX.Visuals" },
    ],
  },
  {
    slug: "cinematic-reel",
    title: "Cinematic Reel",
    client: "AX.Visuals original",
    category: "cinematic",
    location: "Sri Lanka",
    year: "2026", // [EDIT]
    package: "Cinematic Reel",
    deliverables: "1 cinematic Reel",
    format: "reels",
    camera: "4K · 24FPS",
    cover: photos.tubeForward,
    reels: [reel("oLNeoaWaiGk")],
    photos: [],
    brief: "A short-form piece showing off motion, pacing and grade.",
    approach: "Cinematic B-roll, sound design and a punchy cut designed to hold attention past the first second.",
    result: "A social-first Reel built to stop the scroll.",
    credits: [{ role: "Camera, edit & grade", name: "AX.Visuals" }],
  },
  {
    slug: "birthday-reels",
    title: "Birthday Reels",
    client: "Private clients", // [EDIT]
    category: "celebrations",
    location: "Sri Lanka",
    year: "2026", // [EDIT]
    package: "Video shoot + Reel edit",
    deliverables: "3 celebration Reels",
    format: "reels",
    camera: "4K · 24/60FPS",
    cover: photos.postTubeDark,
    reels: [reel("VnaE8Qpd1GI"), reel("-jZy4vw_PzM"), reel("QYIsp8kohJc")],
    photos: [],
    brief: "Celebration films that feel like a movie trailer rather than a phone video.",
    approach: "Fast turnaround edits with trending-style pacing, colour grading and music sync.",
    result: "Three ready-to-post Reels delivered for sharing with family and friends.",
    credits: [{ role: "Camera, edit & grade", name: "AX.Visuals" }],
  },
];

export const featuredSlugs = ["graduation-portrait-session", "nallur-cinematic", "deiva-satchiyaga", "graduation-carousel", "birthday-reels", "cinematic-reel"];

export const ytThumb = (id: string, q: "maxresdefault" | "hqdefault" | "sddefault" = "maxresdefault") =>
  `https://i.ytimg.com/vi/${id}/${q}.jpg`;
