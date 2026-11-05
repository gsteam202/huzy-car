/**
 * 각 차량 제조사 공식 홈페이지 및 공식 미디어 CDN 차량 이미지 매핑 및 헬퍼
 * Hyundai: hyundai.com
 * Kia: kia.com
 * Genesis: genesis.com / dams.hyundai-autoever.com
 * Tesla: tesla.com / digitalassets.tesla.com
 * BMW: bmw.co.kr / bmw.scene7.com
 * Mercedes-Benz: mercedes-benz.co.kr
 * KG Mobility: kg-mobility.com
 */

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

export const OFFICIAL_BRAND_LOGOS: Record<string, string> = {
  hyundai: "https://www.hyundai.com/static/images/common/logo/logo_hyundai_header.png",
  kia: "https://www.kia.com/content/dam/kwp/kr/ko/common/img/header_logo.svg",
  genesis: "https://www.genesis.com/etc.clientlibs/genesis-p2/kr/clientlibs/clientlib-space/resources/images/logo.png",
  tesla: "https://digitalassets.tesla.com/tesla-contents/image/upload/f_auto,q_auto/Tesla_Wordmark_White.svg",
  bmw: "https://www.bmw.co.kr/content/dam/bmw/common/common-navigation/bmw-logo-transparent.png",
  "mercedes-benz": "https://assets.oneweb.mercedes-benz.com/global/brand/logo/mb-star.svg",
  kgm: "https://www.kg-mobility.com/images/common/logo.png",
};

export const OFFICIAL_CAR_ASSETS: Record<string, OfficialCarAsset> = {
  avante: {
    brandSlug: "hyundai",
    brandNameKo: "현대",
    modelSlug: "avante",
    modelNameKo: "아반떼",
    officialSiteUrl: "https://www.hyundai.com/kr/ko/e/vehicles/avante/intro",
    officialImageUrl: "https://www.hyundai.com/contents/repn-car/side-45/avante-45side.png",
    localMirrorUrl: "/images/cars/avante.png",
    sourceAttribution: "현대자동차 공식 홈페이지",
  },
  "sonata-the-edge": {
    brandSlug: "hyundai",
    brandNameKo: "현대",
    modelSlug: "sonata-the-edge",
    modelNameKo: "쏘나타 디 엣지",
    officialSiteUrl: "https://www.hyundai.com/kr/ko/e/vehicles/sonata-the-edge/intro",
    officialImageUrl: "https://www.hyundai.com/contents/repn-car/side-45/sonata-the-edge-45side.png",
    localMirrorUrl: "/images/cars/sonata-the-edge.png",
    sourceAttribution: "현대자동차 공식 홈페이지",
  },
  santafe: {
    brandSlug: "hyundai",
    brandNameKo: "현대",
    modelSlug: "santafe",
    modelNameKo: "싼타페",
    officialSiteUrl: "https://www.hyundai.com/kr/ko/e/vehicles/santafe/intro",
    officialImageUrl: "https://www.hyundai.com/contents/repn-car/side-45/santafe-45side.png",
    localMirrorUrl: "/images/cars/santafe.png",
    sourceAttribution: "현대자동차 공식 홈페이지",
  },
  casper: {
    brandSlug: "hyundai",
    brandNameKo: "현대",
    modelSlug: "casper",
    modelNameKo: "캐스퍼",
    officialSiteUrl: "https://casper.hyundai.com",
    officialImageUrl: "https://www.hyundai.com/contents/repn-car/side-45/casper-45side.png",
    localMirrorUrl: "/images/cars/casper.png",
    sourceAttribution: "현대자동차 캐스퍼 공식 홈페이지",
  },
  sorento: {
    brandSlug: "kia",
    brandNameKo: "기아",
    modelSlug: "sorento",
    modelNameKo: "쏘렌토",
    officialSiteUrl: "https://www.kia.com/kr/vehicles/sorento/features",
    officialImageUrl: "https://www.kia.com/content/dam/kwp/kr/ko/vehicles/represent/krmq326/sorento_s_bn4.png",
    localMirrorUrl: "/images/cars/sorento.png",
    sourceAttribution: "기아 공식 홈페이지",
  },
  carnival: {
    brandSlug: "kia",
    brandNameKo: "기아",
    modelSlug: "carnival",
    modelNameKo: "카니발",
    officialSiteUrl: "https://www.kia.com/kr/vehicles/carnival/features",
    officialImageUrl: "https://www.kia.com/content/dam/kwp/kr/ko/vehicles/represent/krkp328/carnival_s_isg.png",
    localMirrorUrl: "/images/cars/carnival.png",
    sourceAttribution: "기아 공식 홈페이지",
  },
  ray: {
    brandSlug: "kia",
    brandNameKo: "기아",
    modelSlug: "ray",
    modelNameKo: "레이",
    officialSiteUrl: "https://www.kia.com/kr/vehicles/ray/features",
    officialImageUrl: "https://www.kia.com/content/dam/kwp/kr/ko/vehicles/represent/krtm311/ray_s_ud.png",
    localMirrorUrl: "/images/cars/ray.png",
    sourceAttribution: "기아 공식 홈페이지",
  },
  "genesis-g80": {
    brandSlug: "genesis",
    brandNameKo: "제네시스",
    modelSlug: "genesis-g80",
    modelNameKo: "G80",
    officialSiteUrl: "https://www.genesis.com/kr/ko/models/luxury-sedan-genesis/g80/highlights.html",
    officialImageUrl: "https://dams.hyundai-autoever.com/cdn-cgi/image/width=693,height=423/v1/openapi/hmg-presigned-url/50534b313031303030303030303030303130363133/genesis-g80-standard-side-view-model-thumbnail.png",
    localMirrorUrl: "/images/cars/genesis-g80.png",
    sourceAttribution: "제네시스 공식 홈페이지",
  },
  "model-y": {
    brandSlug: "tesla",
    brandNameKo: "테슬라",
    modelSlug: "model-y",
    modelNameKo: "모델 Y",
    officialSiteUrl: "https://www.tesla.com/modely",
    officialImageUrl: "https://digitalassets.tesla.com/tesla-contents/image/upload/f_auto,q_auto/learn_new_model_y_hero.jpg",
    localMirrorUrl: "/images/cars/model-y.jpg",
    sourceAttribution: "테슬라 공식 홈페이지",
  },
  "bmw-5-series": {
    brandSlug: "bmw",
    brandNameKo: "BMW",
    modelSlug: "bmw-5-series",
    modelNameKo: "뉴 5시리즈",
    officialSiteUrl: "https://www.bmw.co.kr/ko/all-models/5-series/sedan/2023/bmw-5-series-sedan-overview.html",
    officialImageUrl: "https://bmw.scene7.com/is/image/BMW/BMW-MY27-5Series-DI23_000129383-retouched?wid=1280",
    localMirrorUrl: "/images/cars/bmw-5-series.jpg",
    sourceAttribution: "BMW 코리아 공식 홈페이지",
  },
  grandeur: {
    brandSlug: "hyundai",
    brandNameKo: "현대",
    modelSlug: "grandeur",
    modelNameKo: "그랜저",
    officialSiteUrl: "https://www.hyundai.com/kr/ko/e/vehicles/grandeur/intro",
    officialImageUrl: "https://www.hyundai.com/contents/repn-car/side-45/grandeur-45side.png",
    localMirrorUrl: "/images/cars/grandeur.png",
    sourceAttribution: "현대자동차 공식 홈페이지",
  },
  sportage: {
    brandSlug: "kia",
    brandNameKo: "기아",
    modelSlug: "sportage",
    modelNameKo: "스포티지",
    officialSiteUrl: "https://www.kia.com/kr/vehicles/sportage/features",
    officialImageUrl: "https://www.kia.com/content/dam/kwp/kr/ko/vehicles/represent/krnq327/sportage_s_swp.png",
    localMirrorUrl: "/images/cars/sportage.png",
    sourceAttribution: "기아 공식 홈페이지",
  },
  "e-class": {
    brandSlug: "mercedes-benz",
    brandNameKo: "메르세데스-벤츠",
    modelSlug: "e-class",
    modelNameKo: "E-클래스",
    officialSiteUrl: "https://www.mercedes-benz.co.kr/passengercars/models/saloon/e-class/overview.html",
    officialImageUrl: "https://www.mercedes-benz.co.kr/content/dam/south-korea/passenger-cars/model/E-Class_FB_1.jpeg?im=Resize,width=1184",
    localMirrorUrl: "/images/cars/e-class.jpg",
    sourceAttribution: "메르세데스-벤츠 코리아 공식 홈페이지",
  },
  torres: {
    brandSlug: "kgm",
    brandNameKo: "KG모빌리티",
    modelSlug: "torres",
    modelNameKo: "토레스",
    officialSiteUrl: "https://www.kg-mobility.com",
    officialImageUrl: "https://m.kg-mobility.com/global/showroom/torres/images/safety_program_img02.jpg",
    localMirrorUrl: "/images/cars/torres.jpg",
    sourceAttribution: "KG모빌리티 공식 홈페이지",
  },
};

/**
 * 모델 슬러그 또는 식별자로 제조사 공식 홈페이지 이미지 URL을 조회합니다.
 */
export function getOfficialCarImage(modelSlug: string, fallback?: string): string {
  const asset = OFFICIAL_CAR_ASSETS[modelSlug.toLowerCase()];
  if (asset) {
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
