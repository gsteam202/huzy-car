import { describe, it } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import {
  OFFICIAL_CAR_ASSETS,
  OFFICIAL_BRAND_LOGOS,
  getOfficialCarImage,
  getOfficialBrandLogo,
  getOfficialAttribution,
} from "../src/lib/official-car-images";

describe("Official Car Images & Brand Logos Tests", () => {
  it("has valid official manufacturer image URLs for major models", () => {
    const requiredModels = [
      "avante",
      "sonata-the-edge",
      "santafe",
      "casper",
      "sorento",
      "carnival",
      "ray",
      "genesis-g80",
      "model-y",
      "bmw-5-series",
    ];

    for (const slug of requiredModels) {
      const asset = OFFICIAL_CAR_ASSETS[slug];
      assert.ok(asset, `Asset configuration for ${slug} must exist`);
      assert.ok(
        asset.officialImageUrl.startsWith("https://"),
        `Image URL for ${slug} must be https: ${asset.officialImageUrl}`
      );
      assert.ok(
        asset.sourceAttribution.length > 0,
        `Attribution for ${slug} must exist`
      );

      // Verify domain belongs to official manufacturer
      const url = new URL(asset.officialImageUrl);
      assert.ok(
        url.hostname.includes("hyundai.com") ||
          url.hostname.includes("kia.com") ||
          url.hostname.includes("genesis.com") ||
          url.hostname.includes("hyundai-autoever.com") ||
          url.hostname.includes("tesla.com") ||
          url.hostname.includes("bmw.scene7.com") ||
          url.hostname.includes("bmw.co.kr"),
        `Hostname ${url.hostname} must be an official manufacturer domain`
      );
    }
  });

  it("resolves official image with getOfficialCarImage", () => {
    const avanteImg = getOfficialCarImage("avante");
    assert.ok(avanteImg.includes("hyundai.com"));

    const sorentoImg = getOfficialCarImage("sorento");
    assert.ok(sorentoImg.includes("kia.com"));

    const fallback = getOfficialCarImage("non-existent-car", "/custom-fallback.png");
    assert.equal(fallback, "/custom-fallback.png");
  });

  it("provides valid official brand logos", () => {
    const brands = ["hyundai", "kia", "genesis", "tesla", "bmw"];
    for (const b of brands) {
      const logo = getOfficialBrandLogo(b);
      assert.ok(logo, `Logo for ${b} must exist`);
      assert.ok(logo.startsWith("https://"));
    }
  });

  it("provides official attribution strings", () => {
    assert.ok(getOfficialAttribution("avante").includes("현대자동차"));
    assert.ok(getOfficialAttribution("sorento").includes("기아"));
    assert.ok(getOfficialAttribution("model-y").includes("테슬라"));
  });

  it("verifies local mirrored copies exist in public/images/cars", () => {
    const publicCarsDir = path.resolve(process.cwd(), "public/images/cars");
    assert.ok(fs.existsSync(publicCarsDir), "public/images/cars directory must exist");

    const models = ["avante", "sorento", "casper", "santafe", "carnival", "ray"];
    for (const m of models) {
      const pngPath = path.join(publicCarsDir, `${m}.png`);
      assert.ok(fs.existsSync(pngPath), `Mirrored file ${pngPath} must exist`);
      const stat = fs.statSync(pngPath);
      assert.ok(stat.size > 1000, `File ${pngPath} must have non-trivial size`);
    }
  });
});
