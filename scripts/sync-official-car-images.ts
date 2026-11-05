import "dotenv/config";
import fs from "fs/promises";
import path from "path";
import { prisma } from "../src/lib/db";
import { OFFICIAL_CAR_ASSETS, OFFICIAL_BRAND_LOGOS } from "../src/lib/official-car-images";

const PUBLIC_CAR_DIR = path.resolve(process.cwd(), "public/images/cars");

async function downloadFile(url: string, destPath: string) {
  try {
    const res = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
        Accept: "image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8",
      },
    });
    if (!res.ok) {
      console.warn(`Failed to fetch ${url} - status ${res.status}`);
      return false;
    }
    const buffer = Buffer.from(await res.arrayBuffer());
    await fs.writeFile(destPath, buffer);
    console.log(`✓ Downloaded ${path.basename(destPath)} (${buffer.length} bytes)`);
    return true;
  } catch (err) {
    console.error(`Error downloading ${url}:`, err);
    return false;
  }
}

async function main() {
  console.log("=== Syncing official vehicle images from manufacturer official sites ===");
  await fs.mkdir(PUBLIC_CAR_DIR, { recursive: true });

  // 1. Download official images for local cache mirror
  for (const [slug, asset] of Object.entries(OFFICIAL_CAR_ASSETS)) {
    const ext = path.extname(new URL(asset.officialImageUrl).pathname) || ".png";
    const localFile = path.join(PUBLIC_CAR_DIR, `${slug}${ext}`);
    console.log(`[${asset.brandNameKo} ${asset.modelNameKo}] Fetching from ${asset.officialImageUrl}`);
    await downloadFile(asset.officialImageUrl, localFile);

    // Also write a standard .jpg alias if needed for backward compatibility
    if (ext === ".png") {
      const jpgAlias = path.join(PUBLIC_CAR_DIR, `${slug}.jpg`);
      try {
        await fs.copyFile(localFile, jpgAlias);
      } catch {}
    }
  }

  // 2. Update CarBrand logo URLs in database with official logos
  for (const [brandSlug, logoUrl] of Object.entries(OFFICIAL_BRAND_LOGOS)) {
    try {
      await prisma.carBrand.updateMany({
        where: { slug: brandSlug },
        data: { logoUrl },
      });
      console.log(`✓ Updated brand logo for ${brandSlug}`);
    } catch (e) {
      console.warn(`Failed to update logo for ${brandSlug}:`, e);
    }
  }

  // 3. Update CarModel imageUrl in database with official manufacturer images
  for (const [slug, asset] of Object.entries(OFFICIAL_CAR_ASSETS)) {
    try {
      // Find model by slug
      const updated = await prisma.carModel.updateMany({
        where: { slug },
        data: {
          imageUrl: asset.officialImageUrl,
        },
      });

      if (updated.count > 0) {
        console.log(`✓ Updated car model ${slug} -> official URL (${asset.sourceAttribution})`);

        // Also update any matching used car listings
        await prisma.usedCarListing.updateMany({
          where: { model: { slug } },
          data: {
            imageUrl: asset.officialImageUrl,
          },
        });

        // Upsert into CarImage table
        const modelRecord = await prisma.carModel.findFirst({ where: { slug } });
        if (modelRecord) {
          await prisma.carImage.deleteMany({
            where: { modelId: modelRecord.id },
          });
          await prisma.carImage.create({
            data: {
              modelId: modelRecord.id,
              imageUrl: asset.officialImageUrl,
              caption: `${asset.brandNameKo} ${asset.modelNameKo} - ${asset.sourceAttribution}`,
              isMain: true,
              orderIndex: 0,
            },
          });
        }
      }
    } catch (e) {
      console.warn(`Failed to update model ${slug}:`, e);
    }
  }

  console.log("=== Official vehicle images synchronization complete ===");
  process.exit(0);
}

main().catch((err) => {
  console.error("Migration failed:", err);
  process.exit(1);
});
