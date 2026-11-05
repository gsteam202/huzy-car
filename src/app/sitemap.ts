import { MetadataRoute } from "next";
import { prisma } from "@/lib/db";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://car.huzy.net";

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${baseUrl}`, lastModified: new Date(), changeFrequency: "daily", priority: 1.0 },
    { url: `${baseUrl}/new-cars`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
    { url: `${baseUrl}/used-cars`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
    { url: `${baseUrl}/calculator/budget`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.95 },
    { url: `${baseUrl}/calculator/installment`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.85 },
    { url: `${baseUrl}/compare`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: `${baseUrl}/community`, lastModified: new Date(), changeFrequency: "hourly", priority: 0.75 },
  ];

  try {
    const [brands, models] = await Promise.all([
      prisma.carBrand.findMany({ select: { slug: true } }),
      prisma.carModel.findMany({ select: { slug: true, brand: { select: { slug: true } } } }),
    ]);

    const brandRoutes: MetadataRoute.Sitemap = brands.map((b) => ({
      url: `${baseUrl}/new-cars?brand=${b.slug}`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    }));

    const modelRoutes: MetadataRoute.Sitemap = models.map((m) => ({
      url: `${baseUrl}/new-cars/${m.brand.slug}/${m.slug}`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.85,
    }));

    const usedModelRoutes: MetadataRoute.Sitemap = models.map((m) => ({
      url: `${baseUrl}/used-cars/${m.brand.slug}/${m.slug}`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.85,
    }));

    return [...staticRoutes, ...brandRoutes, ...modelRoutes, ...usedModelRoutes];
  } catch (e) {
    return staticRoutes;
  }
}
