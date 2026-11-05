import { describe, it, after } from "node:test";
import assert from "node:assert/strict";
import "dotenv/config";
import fs from "node:fs";
import path from "node:path";
import robots from "../src/app/robots";
import sitemap from "../src/app/sitemap";
import { siteMetadata } from "../src/lib/metadata";
import { prisma } from "../src/lib/db";

describe("SEO & Sitemap & Favicon Verification", () => {
  after(async () => {
    await prisma.$disconnect();
  });
  it("verifies favicon and icon assets exist in public and app directories", () => {
    const publicDir = path.resolve(process.cwd(), "public");
    const appDir = path.resolve(process.cwd(), "src/app");

    const requiredPublicFiles = [
      "icon.svg",
      "favicon.ico",
      "apple-touch-icon.png",
      "icon-192.png",
      "icon-512.png",
    ];

    for (const file of requiredPublicFiles) {
      const fullPath = path.join(publicDir, file);
      assert.ok(fs.existsSync(fullPath), `Public asset ${file} must exist`);
      const stat = fs.statSync(fullPath);
      assert.ok(stat.size > 0, `Public asset ${file} must not be empty`);
    }

    assert.ok(fs.existsSync(path.join(appDir, "icon.svg")), "src/app/icon.svg must exist");
    assert.ok(fs.existsSync(path.join(appDir, "favicon.ico")), "src/app/favicon.ico must exist");
  });

  it("verifies robots.txt policy adheres to search acquisition rules", () => {
    const res = robots();
    assert.ok(res.sitemap, "Sitemap URL must be defined in robots.txt");
    assert.equal(res.sitemap, "https://car.huzy.net/sitemap.xml");

    const rules = Array.isArray(res.rules) ? res.rules : [res.rules];
    const crawlerRule = rules.find((r) =>
      Array.isArray(r.userAgent) &&
      r.userAgent.includes("Googlebot") &&
      r.userAgent.includes("Yeti") &&
      r.userAgent.includes("Google-InspectionTool") &&
      r.userAgent.includes("Mediapartners-Google") &&
      r.userAgent.includes("AdsBot-Google")
    );

    assert.ok(crawlerRule, "Must have an explicit allow rule for search and ad crawlers");
    assert.equal(crawlerRule?.allow, "/");
  });

  it("verifies sitemap generates comprehensive static & dynamic routes", async () => {
    const sitemapEntries = await sitemap();
    assert.ok(Array.isArray(sitemapEntries), "Sitemap must return an array");
    assert.ok(sitemapEntries.length >= 10, "Sitemap must have at least 10 entries");

    const urls = sitemapEntries.map((e) => e.url);

    // Verify key static routes
    assert.ok(urls.includes("https://car.huzy.net"), "Must include home");
    assert.ok(urls.includes("https://car.huzy.net/new-cars"), "Must include new-cars");
    assert.ok(urls.includes("https://car.huzy.net/used-cars"), "Must include used-cars");
    assert.ok(urls.includes("https://car.huzy.net/calculator/budget"), "Must include budget calculator");
    assert.ok(urls.includes("https://car.huzy.net/compare"), "Must include compare");
    assert.ok(urls.includes("https://car.huzy.net/community"), "Must include community");

    // Verify category routes
    assert.ok(urls.includes("https://car.huzy.net/new-cars?type=SEDAN"), "Must include Sedan category");
    assert.ok(urls.includes("https://car.huzy.net/new-cars?type=SUV"), "Must include SUV category");
    assert.ok(urls.includes("https://car.huzy.net/new-cars?fuel=HYBRID"), "Must include Hybrid category");

    // Verify each entry has valid properties
    for (const entry of sitemapEntries) {
      assert.ok(entry.url.startsWith("https://car.huzy.net"), `URL must start with https://car.huzy.net: ${entry.url}`);
      assert.ok(entry.priority !== undefined && entry.priority >= 0.5 && entry.priority <= 1.0);
      assert.ok(entry.changeFrequency !== undefined);
      assert.ok(entry.lastModified instanceof Date);
    }
  });

  it("verifies root layout metadata has canonical, openGraph, twitter, and icons", () => {
    assert.ok(siteMetadata.title, "Metadata title must be present");
    assert.ok(siteMetadata.description, "Metadata description must be present");
    assert.ok(siteMetadata.alternates?.canonical, "Canonical URL must be present");
    assert.ok(siteMetadata.icons, "Icons must be present");
    assert.ok(siteMetadata.openGraph, "OpenGraph must be present");
    assert.ok(siteMetadata.twitter, "Twitter card metadata must be present");
  });
});
