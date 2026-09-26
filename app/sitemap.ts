import type { MetadataRoute } from "next";
import { site } from "@/content/site";
import { projects } from "@/content/work";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const paths = [
    ["", 1],
    ["/work", 0.9],
    ["/services", 0.8],
    ["/pricing", 0.9],
    ["/pricing/monthly", 0.8],
    ["/pricing/restaurants", 0.8],
    ["/pricing/products", 0.8],
    ["/pricing/services", 0.6],
    ["/booking", 0.9],
    ["/about", 0.6],
    ["/contact", 0.7],
    ["/terms", 0.3],
  ] as const;
  return [
    ...paths.map(([p, priority]) => ({ url: `${site.url}${p}`, lastModified: now, priority })),
    ...projects.map((p) => ({ url: `${site.url}/work/${p.slug}`, lastModified: now, priority: 0.6 })),
  ];
}
