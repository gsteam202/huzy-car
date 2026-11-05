import { NextRequest, NextResponse } from "next/server";
import {
  OFFICIAL_CAR_ASSETS,
  OFFICIAL_BRAND_LOGOS,
  getOfficialCarImage,
  getOfficialBrandLogo,
} from "@/lib/official-car-images";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const model = searchParams.get("model");
  const brand = searchParams.get("brand");
  const redirect = searchParams.get("redirect") === "true";

  if (model) {
    const slug = model.toLowerCase();
    const asset = OFFICIAL_CAR_ASSETS[slug];
    const imageUrl = asset ? asset.officialImageUrl : getOfficialCarImage(slug);

    if (redirect) {
      return NextResponse.redirect(imageUrl, { status: 302 });
    }

    return NextResponse.json({
      model: slug,
      officialImageUrl: imageUrl,
      asset: asset || null,
      source: asset ? asset.sourceAttribution : "제조사 공식 홈페이지",
    });
  }

  if (brand) {
    const brandSlug = brand.toLowerCase();
    const logoUrl = getOfficialBrandLogo(brandSlug);

    if (redirect && logoUrl) {
      return NextResponse.redirect(logoUrl, { status: 302 });
    }

    return NextResponse.json({
      brand: brandSlug,
      officialLogoUrl: logoUrl || null,
      source: "제조사 공식 브랜드 미디어",
    });
  }

  return NextResponse.json({
    models: OFFICIAL_CAR_ASSETS,
    brands: OFFICIAL_BRAND_LOGOS,
  });
}
