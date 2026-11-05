import { CATALOG_BRANDS, CATALOG_MODELS } from "./car-catalog-data";

export interface OfficialCarAsset {
  brandSlug: string;
  brandNameKo: string;
  modelSlug: string;
  modelNameKo: string;
  officialSiteUrl: string;
  officialImageUrl: string;
  localMirrorUrl: string;
  sourceAttribution: string;
}

export const OFFICIAL_BRAND_LOGOS: Record<string, string> = Object.fromEntries(
  CATALOG_BRANDS.map((b) => [b.slug, b.logoUrl])
);

export const OFFICIAL_CAR_ASSETS: Record<string, OfficialCarAsset> = Object.fromEntries(
  CATALOG_MODELS.map((m) => {
    const brand = CATALOG_BRANDS.find((b) => b.slug === m.brandSlug);
    return [
      m.slug,
      {
        brandSlug: m.brandSlug,
        brandNameKo: brand ? brand.nameKo : m.brandSlug,
        modelSlug: m.slug,
        modelNameKo: m.nameKo,
        officialSiteUrl: m.officialSiteUrl,
        officialImageUrl: m.officialImageUrl,
        localMirrorUrl: m.localMirrorUrl,
        sourceAttribution: m.sourceAttribution,
      },
    ];
  })
);

/**
 * 모델 슬러그 또는 식별자로 제조사 공식 홈페이지 이미지 URL을 조회합니다.
 */
export function getOfficialCarImage(modelSlug: string, fallback?: string): string {
  const asset = OFFICIAL_CAR_ASSETS[modelSlug.toLowerCase()];
  if (asset && asset.officialImageUrl) {
    return asset.officialImageUrl;
  }
  return fallback || "/images/cars/avante.png";
}

/**
 * 브랜드 슬러그로 제조사 공식 로고 URL을 조회합니다.
 */
export function getOfficialBrandLogo(brandSlug: string): string | undefined {
  return OFFICIAL_BRAND_LOGOS[brandSlug.toLowerCase()];
}

/**
 * 특정 모델의 공식 출처 표기 정보를 조회합니다.
 */
export function getOfficialAttribution(modelSlug: string): string {
  const asset = OFFICIAL_CAR_ASSETS[modelSlug.toLowerCase()];
  return asset ? asset.sourceAttribution : "제조사 공식 홈페이지";
}
