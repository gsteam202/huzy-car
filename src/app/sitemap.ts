import { MetadataRoute } from "next";
import { prisma } from "@/lib/db";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://car.huzy.net";
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${baseUrl}`, lastModified: now, changeFrequency: "daily", priority: 1.0 },
    { url: `${baseUrl}/new-cars`, lastModified: now, changeFrequency: "daily", priority: 0.95 },
    { url: `${baseUrl}/used-cars`, lastModified: now, changeFrequency: "daily", priority: 0.95 },
    { url: `${baseUrl}/calculator/budget`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${baseUrl}/calculator/tax`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${baseUrl}/calculator/installment`, lastModified: now, changeFrequency: "weekly", priority: 0.85 },
    { url: `${baseUrl}/compare`, lastModified: now, changeFrequency: "weekly", priority: 0.85 },
    { url: `${baseUrl}/community`, lastModified: now, changeFrequency: "hourly", priority: 0.8 },
  ];

  // Common vehicle segment & fuel categories for organic landing indexing
  const categoryRoutes: MetadataRoute.Sitemap = [
    { url: `${baseUrl}/new-cars?type=SEDAN`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${baseUrl}/new-cars?type=SUV`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${baseUrl}/new-cars?type=COMPACT`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${baseUrl}/new-cars?type=RV`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${baseUrl}/new-cars?fuel=HYBRID`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${baseUrl}/new-cars?fuel=ELECTRIC`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${baseUrl}/new-cars?fuel=GASOLINE`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${baseUrl}/used-cars?fuel=HYBRID`, lastModified: now, changeFrequency: "daily", priority: 0.8 },
  ];

  try {
    const [brands, models, boards, recentPosts] = await Promise.all([
      prisma.carBrand.findMany({
        where: { isActive: true },
        select: { slug: true, updatedAt: true },
      }),
      prisma.carModel.findMany({
        select: {
          slug: true,
          updatedAt: true,
          brand: { select: { slug: true } },
        },
      }),
      prisma.board.findMany({
        where: { isActive: true },
        select: { slug: true },
      }),
      prisma.post.findMany({
        take: 50,
        orderBy: { createdAt: "desc" },
        select: { id: true, updatedAt: true },
      }),
    ]);

    const brandNewRoutes: MetadataRoute.Sitemap = brands.map((b) => ({
      url: `${baseUrl}/new-cars?brand=${b.slug}`,
      lastModified: b.updatedAt || now,
      changeFrequency: "weekly",
      priority: 0.85,
    }));

    const brandUsedRoutes: MetadataRoute.Sitemap = brands.map((b) => ({
      url: `${baseUrl}/used-cars?brand=${b.slug}`,
      lastModified: b.updatedAt || now,
      changeFrequency: "daily",
      priority: 0.85,
    }));

    const modelNewRoutes: MetadataRoute.Sitemap = models.map((m) => ({
      url: `${baseUrl}/new-cars/${m.brand.slug}/${m.slug}`,
      lastModified: m.updatedAt || now,
      changeFrequency: "weekly",
      priority: 0.9,
    }));

    const modelUsedRoutes: MetadataRoute.Sitemap = models.map((m) => ({
      url: `${baseUrl}/used-cars/${m.brand.slug}/${m.slug}`,
      lastModified: m.updatedAt || now,
      changeFrequency: "daily",
      priority: 0.9,
    }));

    const boardRoutes: MetadataRoute.Sitemap = boards.map((bd) => ({
      url: `${baseUrl}/community?board=${bd.slug}`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.75,
    }));

    const postRoutes: MetadataRoute.Sitemap = recentPosts.map((p) => ({
      url: `${baseUrl}/community/${p.id}`,
      lastModified: p.updatedAt || now,
      changeFrequency: "weekly",
      priority: 0.7,
    }));

    return [
      ...staticRoutes,
      ...categoryRoutes,
      ...brandNewRoutes,
      ...brandUsedRoutes,
      ...modelNewRoutes,
      ...modelUsedRoutes,
      ...boardRoutes,
      ...postRoutes,
    ];
  } catch (e) {
    console.error("Failed to generate dynamic sitemap routes:", e);
    return [...staticRoutes, ...categoryRoutes];
  }
}
