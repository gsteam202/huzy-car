import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/admin/", "/mypage/"],
      },
      {
        userAgent: ["Googlebot", "Yeti", "Mediapartners-Google", "AdsBot-Google"],
        allow: "/",
        disallow: ["/api/", "/admin/", "/mypage/"],
      },
    ],
    sitemap: "https://car.huzy.net/sitemap.xml",
  };
}
