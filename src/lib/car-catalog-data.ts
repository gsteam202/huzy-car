import { Country, VehicleType, FuelType } from "@prisma/client";

export interface CatalogTrim {
  nameKo: string;
  price: number;
  fuelType: FuelType;
  engineDisplacement?: number;
  transmission: string;
  fuelEfficiencyCombined?: number;
  electricEfficiencyCombined?: number;
  maxPower: number;
  maxTorque: number;
  seatingCapacity: number;
}

export interface CatalogModelSpec {
  lengthMm: number;
  widthMm: number;
  heightMm: number;
  wheelbaseMm: number;
  curbWeightKg: number;
}

export interface CatalogModel {
  brandSlug: string;
  nameKo: string;
  nameEn: string;
  slug: string;
  vehicleType: VehicleType;
  releaseYear: number;
  minPrice: number;
  maxPrice: number;
  officialSiteUrl: string;
  officialImageUrl: string;
  localMirrorUrl: string;
  sourceAttribution: string;
  generation: {
    nameKo: string;
    codeName: string;
    startYear: number;
  };
  spec: CatalogModelSpec;
  trims: CatalogTrim[];
}

export interface CatalogBrand {
  nameKo: string;
  nameEn: string;
  slug: string;
  country: Country;
  orderIndex: number;
  logoUrl: string;
  officialSiteUrl: string;
}

export const CATALOG_BRANDS: CatalogBrand[] = [
  {
    "nameKo": "현대",
    "nameEn": "Hyundai",
    "slug": "hyundai",
    "country": "KOREA",
    "orderIndex": 1,
    "logoUrl": "https://www.hyundai.com/static/images/common/logo/logo_hyundai_header.png",
    "officialSiteUrl": "https://www.hyundai.com"
  },
  {
    "nameKo": "기아",
    "nameEn": "Kia",
    "slug": "kia",
    "country": "KOREA",
    "orderIndex": 2,
    "logoUrl": "https://www.kia.com/content/dam/kwp/kr/ko/common/img/header_logo.svg",
    "officialSiteUrl": "https://www.kia.com"
  },
  {
    "nameKo": "제네시스",
    "nameEn": "Genesis",
    "slug": "genesis",
    "country": "KOREA",
    "orderIndex": 3,
    "logoUrl": "https://www.genesis.com/etc.clientlibs/genesis-p2/kr/clientlibs/clientlib-space/resources/images/logo.png",
    "officialSiteUrl": "https://www.genesis.com"
  },
  {
    "nameKo": "KG모빌리티",
    "nameEn": "KGM",
    "slug": "kgm",
    "country": "KOREA",
    "orderIndex": 4,
    "logoUrl": "https://www.kg-mobility.com/images/common/logo.png",
    "officialSiteUrl": "https://www.kg-mobility.com"
  },
  {
    "nameKo": "르노코리아",
    "nameEn": "Renault Korea",
    "slug": "renault-korea",
    "country": "KOREA",
    "orderIndex": 5,
    "logoUrl": "https://www.renault.co.kr/ko/main/rkm_share.jpg",
    "officialSiteUrl": "https://www.renault.co.kr"
  },
  {
    "nameKo": "쉐보레",
    "nameEn": "Chevrolet",
    "slug": "chevrolet",
    "country": "KOREA",
    "orderIndex": 6,
    "logoUrl": "https://www.chevrolet.co.kr/content/dam/chevrolet/as/kr/ko/index/header/chevrolet-logo.png",
    "officialSiteUrl": "https://www.chevrolet.co.kr"
  },
  {
    "nameKo": "메르세데스-벤츠",
    "nameEn": "Mercedes-Benz",
    "slug": "mercedes-benz",
    "country": "IMPORTED",
    "orderIndex": 7,
    "logoUrl": "https://assets.oneweb.mercedes-benz.com/global/brand/logo/mb-star.svg",
    "officialSiteUrl": "https://www.mercedes-benz.co.kr"
  },
  {
    "nameKo": "BMW",
    "nameEn": "BMW",
    "slug": "bmw",
    "country": "IMPORTED",
    "orderIndex": 8,
    "logoUrl": "https://www.bmw.co.kr/content/dam/bmw/common/common-navigation/bmw-logo-transparent.png",
    "officialSiteUrl": "https://www.bmw.co.kr"
  },
  {
    "nameKo": "테슬라",
    "nameEn": "Tesla",
    "slug": "tesla",
    "country": "IMPORTED",
    "orderIndex": 9,
    "logoUrl": "https://digitalassets.tesla.com/tesla-contents/image/upload/f_auto,q_auto/Tesla_Wordmark_White.svg",
    "officialSiteUrl": "https://www.tesla.com"
  },
  {
    "nameKo": "아우디",
    "nameEn": "Audi",
    "slug": "audi",
    "country": "IMPORTED",
    "orderIndex": 10,
    "logoUrl": "https://www.audi.co.kr/dam/nemo/models/misc/audi-logo.png",
    "officialSiteUrl": "https://www.audi.co.kr"
  },
  {
    "nameKo": "볼보",
    "nameEn": "Volvo",
    "slug": "volvo",
    "country": "IMPORTED",
    "orderIndex": 11,
    "logoUrl": "https://www.volvocars.com/static/shared/images/volvo-spread-wordmark.svg",
    "officialSiteUrl": "https://www.volvocars.com/kr"
  },
  {
    "nameKo": "포르쉐",
    "nameEn": "Porsche",
    "slug": "porsche",
    "country": "IMPORTED",
    "orderIndex": 12,
    "logoUrl": "https://cdn.ui.porsche.com/porsche-design-system/crest/porsche-crest.svg",
    "officialSiteUrl": "https://www.porsche.com/korea/ko/"
  },
  {
    "nameKo": "폭스바겐",
    "nameEn": "Volkswagen",
    "slug": "volkswagen",
    "country": "IMPORTED",
    "orderIndex": 13,
    "logoUrl": "https://www.volkswagen.co.kr/content/dam/vw-ngw/vw_pkw/importers/kr/logo/vw_logo.svg",
    "officialSiteUrl": "https://www.volkswagen.co.kr"
  },
  {
    "nameKo": "렉서스",
    "nameEn": "Lexus",
    "slug": "lexus",
    "country": "IMPORTED",
    "orderIndex": 14,
    "logoUrl": "https://www.lexus.co.kr/assets/images/common/logo.png",
    "officialSiteUrl": "https://www.lexus.co.kr"
  },
  {
    "nameKo": "토요타",
    "nameEn": "Toyota",
    "slug": "toyota",
    "country": "IMPORTED",
    "orderIndex": 15,
    "logoUrl": "https://www.toyota.co.kr/assets/images/common/logo.png",
    "officialSiteUrl": "https://www.toyota.co.kr"
  },
  {
    "nameKo": "랜드로버",
    "nameEn": "Land Rover",
    "slug": "land-rover",
    "country": "IMPORTED",
    "orderIndex": 16,
    "logoUrl": "https://www.landrover.co.kr/static/shared/images/land-rover-logo.svg",
    "officialSiteUrl": "https://www.landrover.co.kr"
  },
  {
    "nameKo": "미니",
    "nameEn": "MINI",
    "slug": "mini",
    "country": "IMPORTED",
    "orderIndex": 17,
    "logoUrl": "https://www.mini.co.kr/content/dam/mini/common/mini-logo.png",
    "officialSiteUrl": "https://www.mini.co.kr"
  },
  {
    "nameKo": "폴스타",
    "nameEn": "Polestar",
    "slug": "polestar",
    "country": "IMPORTED",
    "orderIndex": 18,
    "logoUrl": "https://www.polestar.com/static/shared/polestar-symbol.svg",
    "officialSiteUrl": "https://www.polestar.com/kr"
  },
  {
    "nameKo": "포드",
    "nameEn": "Ford",
    "slug": "ford",
    "country": "IMPORTED",
    "orderIndex": 19,
    "logoUrl": "https://www.ford-korea.com/content/dam/ford-korea/logo/ford_logo.png",
    "officialSiteUrl": "https://www.ford-korea.com"
  },
  {
    "nameKo": "혼다",
    "nameEn": "Honda",
    "slug": "honda",
    "country": "IMPORTED",
    "orderIndex": 20,
    "logoUrl": "https://www.honda.co.kr/assets/images/common/logo.png",
    "officialSiteUrl": "https://www.honda.co.kr"
  },
  {
    "nameKo": "지프",
    "nameEn": "Jeep",
    "slug": "jeep",
    "country": "IMPORTED",
    "orderIndex": 21,
    "logoUrl": "https://www.jeep.co.kr/content/dam/jeep/logo.png",
    "officialSiteUrl": "https://www.jeep.co.kr"
  }
];

export const CATALOG_MODELS: CatalogModel[] = [
  {
    "brandSlug": "hyundai",
    "nameKo": "아반떼",
    "nameEn": "Avante",
    "slug": "avante",
    "vehicleType": "SEDAN",
    "releaseYear": 2024,
    "minPrice": 19940000,
    "maxPrice": 32140000,
    "officialSiteUrl": "https://www.hyundai.com/kr/ko/e/vehicles/avante/intro",
    "officialImageUrl": "https://www.hyundai.com/contents/repn-car/side-45/avante-45side.png",
    "localMirrorUrl": "/images/cars/avante.png",
    "sourceAttribution": "현대자동차 공식 홈페이지",
    "generation": {
      "nameKo": "7세대 페이스리프트 (CN7)",
      "codeName": "CN7 PE",
      "startYear": 2023
    },
    "spec": {
      "lengthMm": 4710,
      "widthMm": 1825,
      "heightMm": 1420,
      "wheelbaseMm": 2720,
      "curbWeightKg": 1235
    },
    "trims": [
      {
        "nameKo": "1.6 가솔린 스마트",
        "price": 19940000,
        "fuelType": "GASOLINE",
        "engineDisplacement": 1598,
        "transmission": "IVT 무단변속기",
        "fuelEfficiencyCombined": 15.3,
        "maxPower": 123,
        "maxTorque": 15.7,
        "seatingCapacity": 5
      },
      {
        "nameKo": "1.6 가솔린 모던",
        "price": 23140000,
        "fuelType": "GASOLINE",
        "engineDisplacement": 1598,
        "transmission": "IVT 무단변속기",
        "fuelEfficiencyCombined": 15.0,
        "maxPower": 123,
        "maxTorque": 15.7,
        "seatingCapacity": 5
      },
      {
        "nameKo": "1.6 가솔린 인스퍼레이션",
        "price": 27150000,
        "fuelType": "GASOLINE",
        "engineDisplacement": 1598,
        "transmission": "IVT 무단변속기",
        "fuelEfficiencyCombined": 14.8,
        "maxPower": 123,
        "maxTorque": 15.7,
        "seatingCapacity": 5
      },
      {
        "nameKo": "1.6 하이브리드 인스퍼레이션",
        "price": 32140000,
        "fuelType": "HYBRID",
        "engineDisplacement": 1580,
        "transmission": "6단 DCT",
        "fuelEfficiencyCombined": 21.1,
        "maxPower": 141,
        "maxTorque": 27.0,
        "seatingCapacity": 5
      }
    ]
  },
  {
    "brandSlug": "hyundai",
    "nameKo": "쏘나타 디 엣지",
    "nameEn": "Sonata The Edge",
    "slug": "sonata-the-edge",
    "vehicleType": "SEDAN",
    "releaseYear": 2024,
    "minPrice": 28080000,
    "maxPrice": 39500000,
    "officialSiteUrl": "https://www.hyundai.com/kr/ko/e/vehicles/sonata-the-edge/intro",
    "officialImageUrl": "https://www.hyundai.com/contents/repn-car/side-45/sonata-the-edge-45side.png",
    "localMirrorUrl": "/images/cars/sonata-the-edge.png",
    "sourceAttribution": "현대자동차 공식 홈페이지",
    "generation": {
      "nameKo": "8세대 페이스리프트 (DN8)",
      "codeName": "DN8 PE",
      "startYear": 2023
    },
    "spec": {
      "lengthMm": 4910,
      "widthMm": 1860,
      "heightMm": 1445,
      "wheelbaseMm": 2840,
      "curbWeightKg": 1450
    },
    "trims": [
      {
        "nameKo": "2.0 가솔린 프리미엄",
        "price": 28080000,
        "fuelType": "GASOLINE",
        "engineDisplacement": 1999,
        "transmission": "6단 자동",
        "fuelEfficiencyCombined": 12.6,
        "maxPower": 160,
        "maxTorque": 20.0,
        "seatingCapacity": 5
      },
      {
        "nameKo": "1.6 터보 익스클루시브",
        "price": 32300000,
        "fuelType": "GASOLINE",
        "engineDisplacement": 1598,
        "transmission": "8단 자동",
        "fuelEfficiencyCombined": 13.5,
        "maxPower": 180,
        "maxTorque": 27.0,
        "seatingCapacity": 5
      },
      {
        "nameKo": "2.0 하이브리드 인스퍼레이션",
        "price": 39500000,
        "fuelType": "HYBRID",
        "engineDisplacement": 1999,
        "transmission": "6단 자동",
        "fuelEfficiencyCombined": 19.4,
        "maxPower": 195,
        "maxTorque": 28.5,
        "seatingCapacity": 5
      }
    ]
  },
  {
    "brandSlug": "hyundai",
    "nameKo": "디 올 뉴 그랜저",
    "nameEn": "The All New Grandeur",
    "slug": "grandeur",
    "vehicleType": "SEDAN",
    "releaseYear": 2024,
    "minPrice": 37980000,
    "maxPrice": 53730000,
    "officialSiteUrl": "https://www.hyundai.com/kr/ko/e/vehicles/grandeur/intro",
    "officialImageUrl": "https://www.hyundai.com/contents/repn-car/side-45/grandeur-45side.png",
    "localMirrorUrl": "/images/cars/grandeur.png",
    "sourceAttribution": "현대자동차 공식 홈페이지",
    "generation": {
      "nameKo": "7세대 (GN7)",
      "codeName": "GN7",
      "startYear": 2022
    },
    "spec": {
      "lengthMm": 5035,
      "widthMm": 1880,
      "heightMm": 1460,
      "wheelbaseMm": 2895,
      "curbWeightKg": 1620
    },
    "trims": [
      {
        "nameKo": "2.5 가솔린 프리미엄",
        "price": 37980000,
        "fuelType": "GASOLINE",
        "engineDisplacement": 2497,
        "transmission": "8단 자동",
        "fuelEfficiencyCombined": 11.7,
        "maxPower": 198,
        "maxTorque": 25.3,
        "seatingCapacity": 5
      },
      {
        "nameKo": "3.5 가솔린 익스클루시브",
        "price": 44370000,
        "fuelType": "GASOLINE",
        "engineDisplacement": 3470,
        "transmission": "8단 자동",
        "fuelEfficiencyCombined": 10.4,
        "maxPower": 300,
        "maxTorque": 36.6,
        "seatingCapacity": 5
      },
      {
        "nameKo": "1.6 하이브리드 캘리그래피",
        "price": 53730000,
        "fuelType": "HYBRID",
        "engineDisplacement": 1598,
        "transmission": "6단 자동",
        "fuelEfficiencyCombined": 18.0,
        "maxPower": 230,
        "maxTorque": 35.7,
        "seatingCapacity": 5
      }
    ]
  },
  {
    "brandSlug": "hyundai",
    "nameKo": "캐스퍼",
    "nameEn": "Casper",
    "slug": "casper",
    "vehicleType": "COMPACT",
    "releaseYear": 2024,
    "minPrice": 13800000,
    "maxPrice": 19800000,
    "officialSiteUrl": "https://casper.hyundai.com",
    "officialImageUrl": "https://www.hyundai.com/contents/repn-car/side-45/casper-45side.png",
    "localMirrorUrl": "/images/cars/casper.png",
    "sourceAttribution": "현대자동차 공식 홈페이지",
    "generation": {
      "nameKo": "1세대 (AX1)",
      "codeName": "AX1",
      "startYear": 2021
    },
    "spec": {
      "lengthMm": 3595,
      "widthMm": 1595,
      "heightMm": 1575,
      "wheelbaseMm": 2400,
      "curbWeightKg": 985
    },
    "trims": [
      {
        "nameKo": "1.0 가솔린 스마트",
        "price": 13800000,
        "fuelType": "GASOLINE",
        "engineDisplacement": 998,
        "transmission": "4단 자동",
        "fuelEfficiencyCombined": 14.3,
        "maxPower": 76,
        "maxTorque": 9.7,
        "seatingCapacity": 4
      },
      {
        "nameKo": "1.0 가솔린 디 에센셜",
        "price": 16900000,
        "fuelType": "GASOLINE",
        "engineDisplacement": 998,
        "transmission": "4단 자동",
        "fuelEfficiencyCombined": 14.3,
        "maxPower": 76,
        "maxTorque": 9.7,
        "seatingCapacity": 4
      },
      {
        "nameKo": "1.0 터보 인스퍼레이션",
        "price": 19800000,
        "fuelType": "GASOLINE",
        "engineDisplacement": 998,
        "transmission": "4단 자동",
        "fuelEfficiencyCombined": 12.8,
        "maxPower": 100,
        "maxTorque": 17.5,
        "seatingCapacity": 4
      }
    ]
  },
  {
    "brandSlug": "hyundai",
    "nameKo": "캐스퍼 일렉트릭",
    "nameEn": "Casper Electric",
    "slug": "casper-electric",
    "vehicleType": "COMPACT",
    "releaseYear": 2024,
    "minPrice": 29900000,
    "maxPrice": 31500000,
    "officialSiteUrl": "https://casper.hyundai.com",
    "officialImageUrl": "https://www.hyundai.com/contents/repn-car/side-45/casper-45side.png",
    "localMirrorUrl": "/images/cars/casper-electric.png",
    "sourceAttribution": "현대자동차 공식 홈페이지",
    "generation": {
      "nameKo": "1세대 일렉트릭 (AX1 EV)",
      "codeName": "AX1 EV",
      "startYear": 2024
    },
    "spec": {
      "lengthMm": 3825,
      "widthMm": 1610,
      "heightMm": 1575,
      "wheelbaseMm": 2580,
      "curbWeightKg": 1335
    },
    "trims": [
      {
        "nameKo": "일렉트릭 프리미엄",
        "price": 29900000,
        "fuelType": "ELECTRIC",
        "transmission": "감속기",
        "electricEfficiencyCombined": 5.6,
        "maxPower": 115,
        "maxTorque": 15.0,
        "seatingCapacity": 4
      },
      {
        "nameKo": "일렉트릭 인스퍼레이션",
        "price": 31500000,
        "fuelType": "ELECTRIC",
        "transmission": "감속기",
        "electricEfficiencyCombined": 5.6,
        "maxPower": 115,
        "maxTorque": 15.0,
        "seatingCapacity": 4
      }
    ]
  },
  {
    "brandSlug": "hyundai",
    "nameKo": "베뉴",
    "nameEn": "Venue",
    "slug": "venue",
    "vehicleType": "SUV",
    "releaseYear": 2024,
    "minPrice": 21460000,
    "maxPrice": 24130000,
    "officialSiteUrl": "https://www.hyundai.com/kr/ko/e/vehicles/venue/intro",
    "officialImageUrl": "https://www.hyundai.com/contents/repn-car/side-45/venue-45side.png",
    "localMirrorUrl": "/images/cars/venue.png",
    "sourceAttribution": "현대자동차 공식 홈페이지",
    "generation": {
      "nameKo": "1세대 (QX)",
      "codeName": "QX",
      "startYear": 2019
    },
    "spec": {
      "lengthMm": 4040,
      "widthMm": 1770,
      "heightMm": 1585,
      "wheelbaseMm": 2520,
      "curbWeightKg": 1180
    },
    "trims": [
      {
        "nameKo": "1.6 가솔린 프리미엄",
        "price": 21460000,
        "fuelType": "GASOLINE",
        "engineDisplacement": 1598,
        "transmission": "IVT 무단변속기",
        "fuelEfficiencyCombined": 13.7,
        "maxPower": 123,
        "maxTorque": 15.7,
        "seatingCapacity": 5
      },
      {
        "nameKo": "1.6 가솔린 플럭스",
        "price": 24130000,
        "fuelType": "GASOLINE",
        "engineDisplacement": 1598,
        "transmission": "IVT 무단변속기",
        "fuelEfficiencyCombined": 13.3,
        "maxPower": 123,
        "maxTorque": 15.7,
        "seatingCapacity": 5
      }
    ]
  },
  {
    "brandSlug": "hyundai",
    "nameKo": "디 올 뉴 코나",
    "nameEn": "The All New Kona",
    "slug": "kona",
    "vehicleType": "SUV",
    "releaseYear": 2024,
    "minPrice": 24990000,
    "maxPrice": 37200000,
    "officialSiteUrl": "https://www.hyundai.com/kr/ko/e/vehicles/kona/intro",
    "officialImageUrl": "https://www.hyundai.com/contents/repn-car/side-45/kona-45side.png",
    "localMirrorUrl": "/images/cars/kona.png",
    "sourceAttribution": "현대자동차 공식 홈페이지",
    "generation": {
      "nameKo": "2세대 (SX2)",
      "codeName": "SX2",
      "startYear": 2023
    },
    "spec": {
      "lengthMm": 4350,
      "widthMm": 1825,
      "heightMm": 1580,
      "wheelbaseMm": 2660,
      "curbWeightKg": 1360
    },
    "trims": [
      {
        "nameKo": "2.0 가솔린 모던",
        "price": 24990000,
        "fuelType": "GASOLINE",
        "engineDisplacement": 1999,
        "transmission": "IVT 무단변속기",
        "fuelEfficiencyCombined": 13.6,
        "maxPower": 149,
        "maxTorque": 18.3,
        "seatingCapacity": 5
      },
      {
        "nameKo": "1.6 터보 프리미엄",
        "price": 27790000,
        "fuelType": "GASOLINE",
        "engineDisplacement": 1598,
        "transmission": "8단 자동",
        "fuelEfficiencyCombined": 13.0,
        "maxPower": 198,
        "maxTorque": 27.0,
        "seatingCapacity": 5
      },
      {
        "nameKo": "1.6 하이브리드 인스퍼레이션",
        "price": 37200000,
        "fuelType": "HYBRID",
        "engineDisplacement": 1580,
        "transmission": "6단 DCT",
        "fuelEfficiencyCombined": 19.8,
        "maxPower": 141,
        "maxTorque": 27.0,
        "seatingCapacity": 5
      }
    ]
  },
  {
    "brandSlug": "hyundai",
    "nameKo": "더 뉴 투싼",
    "nameEn": "The New Tucson",
    "slug": "tucson",
    "vehicleType": "SUV",
    "releaseYear": 2024,
    "minPrice": 27710000,
    "maxPrice": 42000000,
    "officialSiteUrl": "https://www.hyundai.com/kr/ko/e/vehicles/tucson/intro",
    "officialImageUrl": "https://www.hyundai.com/contents/repn-car/side-45/tucson-45side.png",
    "localMirrorUrl": "/images/cars/tucson.png",
    "sourceAttribution": "현대자동차 공식 홈페이지",
    "generation": {
      "nameKo": "4세대 페이스리프트 (NX4)",
      "codeName": "NX4 PE",
      "startYear": 2023
    },
    "spec": {
      "lengthMm": 4640,
      "widthMm": 1865,
      "heightMm": 1665,
      "wheelbaseMm": 2755,
      "curbWeightKg": 1565
    },
    "trims": [
      {
        "nameKo": "1.6 터보 모던",
        "price": 27710000,
        "fuelType": "GASOLINE",
        "engineDisplacement": 1598,
        "transmission": "8단 자동",
        "fuelEfficiencyCombined": 12.5,
        "maxPower": 180,
        "maxTorque": 27.0,
        "seatingCapacity": 5
      },
      {
        "nameKo": "1.6 터보 인스퍼레이션",
        "price": 34390000,
        "fuelType": "GASOLINE",
        "engineDisplacement": 1598,
        "transmission": "8단 자동",
        "fuelEfficiencyCombined": 12.0,
        "maxPower": 180,
        "maxTorque": 27.0,
        "seatingCapacity": 5
      },
      {
        "nameKo": "1.6 하이브리드 인스퍼레이션",
        "price": 42000000,
        "fuelType": "HYBRID",
        "engineDisplacement": 1598,
        "transmission": "6단 자동",
        "fuelEfficiencyCombined": 16.2,
        "maxPower": 235,
        "maxTorque": 37.4,
        "seatingCapacity": 5
      }
    ]
  },
  {
    "brandSlug": "hyundai",
    "nameKo": "디 올 뉴 싼타페",
    "nameEn": "The All New Santa Fe",
    "slug": "santafe",
    "vehicleType": "SUV",
    "releaseYear": 2024,
    "minPrice": 35460000,
    "maxPrice": 50660000,
    "officialSiteUrl": "https://www.hyundai.com/kr/ko/e/vehicles/santafe/intro",
    "officialImageUrl": "https://www.hyundai.com/contents/repn-car/side-45/santafe-45side.png",
    "localMirrorUrl": "/images/cars/santafe.png",
    "sourceAttribution": "현대자동차 공식 홈페이지",
    "generation": {
      "nameKo": "5세대 (MX5)",
      "codeName": "MX5",
      "startYear": 2023
    },
    "spec": {
      "lengthMm": 4830,
      "widthMm": 1900,
      "heightMm": 1720,
      "wheelbaseMm": 2815,
      "curbWeightKg": 1795
    },
    "trims": [
      {
        "nameKo": "2.5 터보 익스클루시브 2WD",
        "price": 35460000,
        "fuelType": "GASOLINE",
        "engineDisplacement": 2497,
        "transmission": "8단 습식 DCT",
        "fuelEfficiencyCombined": 11.0,
        "maxPower": 281,
        "maxTorque": 43.0,
        "seatingCapacity": 5
      },
      {
        "nameKo": "2.5 터보 캘리그래피 2WD",
        "price": 43730000,
        "fuelType": "GASOLINE",
        "engineDisplacement": 2497,
        "transmission": "8단 습식 DCT",
        "fuelEfficiencyCombined": 10.6,
        "maxPower": 281,
        "maxTorque": 43.0,
        "seatingCapacity": 5
      },
      {
        "nameKo": "1.6 하이브리드 캘리그래피 2WD",
        "price": 50660000,
        "fuelType": "HYBRID",
        "engineDisplacement": 1598,
        "transmission": "6단 자동",
        "fuelEfficiencyCombined": 15.5,
        "maxPower": 235,
        "maxTorque": 37.4,
        "seatingCapacity": 5
      }
    ]
  },
  {
    "brandSlug": "hyundai",
    "nameKo": "팰리세이드",
    "nameEn": "Palisade",
    "slug": "palisade",
    "vehicleType": "SUV",
    "releaseYear": 2024,
    "minPrice": 38960000,
    "maxPrice": 55480000,
    "officialSiteUrl": "https://www.hyundai.com/kr/ko/e/vehicles/palisade/intro",
    "officialImageUrl": "https://www.hyundai.com/contents/repn-car/side-45/palisade-45side.png",
    "localMirrorUrl": "/images/cars/palisade.png",
    "sourceAttribution": "현대자동차 공식 홈페이지",
    "generation": {
      "nameKo": "1세대 페이스리프트 (LX2)",
      "codeName": "LX2 PE",
      "startYear": 2022
    },
    "spec": {
      "lengthMm": 4995,
      "widthMm": 1975,
      "heightMm": 1750,
      "wheelbaseMm": 2900,
      "curbWeightKg": 1880
    },
    "trims": [
      {
        "nameKo": "3.8 가솔린 익스클루시브",
        "price": 38960000,
        "fuelType": "GASOLINE",
        "engineDisplacement": 3778,
        "transmission": "8단 자동",
        "fuelEfficiencyCombined": 9.3,
        "maxPower": 295,
        "maxTorque": 36.2,
        "seatingCapacity": 7
      },
      {
        "nameKo": "3.8 가솔린 캘리그래피",
        "price": 50690000,
        "fuelType": "GASOLINE",
        "engineDisplacement": 3778,
        "transmission": "8단 자동",
        "fuelEfficiencyCombined": 9.0,
        "maxPower": 295,
        "maxTorque": 36.2,
        "seatingCapacity": 7
      },
      {
        "nameKo": "2.2 디젤 캘리그래피 VIP",
        "price": 55480000,
        "fuelType": "DIESEL",
        "engineDisplacement": 2199,
        "transmission": "8단 자동",
        "fuelEfficiencyCombined": 12.0,
        "maxPower": 202,
        "maxTorque": 45.0,
        "seatingCapacity": 7
      }
    ]
  },
  {
    "brandSlug": "hyundai",
    "nameKo": "아이오닉 5",
    "nameEn": "Ioniq 5",
    "slug": "ioniq5",
    "vehicleType": "SUV",
    "releaseYear": 2024,
    "minPrice": 52400000,
    "maxPrice": 63150000,
    "officialSiteUrl": "https://www.hyundai.com/kr/ko/e/vehicles/ioniq5/intro",
    "officialImageUrl": "https://www.hyundai.com/contents/repn-car/side-45/ioniq5-45side.png",
    "localMirrorUrl": "/images/cars/ioniq5.png",
    "sourceAttribution": "현대자동차 공식 홈페이지",
    "generation": {
      "nameKo": "1세대 페이스리프트 (NE)",
      "codeName": "NE PE",
      "startYear": 2024
    },
    "spec": {
      "lengthMm": 4655,
      "widthMm": 1890,
      "heightMm": 1605,
      "wheelbaseMm": 3000,
      "curbWeightKg": 2010
    },
    "trims": [
      {
        "nameKo": "롱레인지 익스클루시브 2WD",
        "price": 54100000,
        "fuelType": "ELECTRIC",
        "transmission": "감속기",
        "electricEfficiencyCombined": 5.2,
        "maxPower": 229,
        "maxTorque": 35.7,
        "seatingCapacity": 5
      },
      {
        "nameKo": "롱레인지 프레스티지 AWD",
        "price": 63150000,
        "fuelType": "ELECTRIC",
        "transmission": "감속기",
        "electricEfficiencyCombined": 4.8,
        "maxPower": 325,
        "maxTorque": 61.7,
        "seatingCapacity": 5
      }
    ]
  },
  {
    "brandSlug": "hyundai",
    "nameKo": "아이오닉 6",
    "nameEn": "Ioniq 6",
    "slug": "ioniq6",
    "vehicleType": "SEDAN",
    "releaseYear": 2024,
    "minPrice": 52000000,
    "maxPrice": 63800000,
    "officialSiteUrl": "https://www.hyundai.com/kr/ko/e/vehicles/ioniq6/intro",
    "officialImageUrl": "https://www.hyundai.com/contents/repn-car/side-45/ioniq5-45side.png",
    "localMirrorUrl": "/images/cars/ioniq6.png",
    "sourceAttribution": "현대자동차 공식 홈페이지",
    "generation": {
      "nameKo": "1세대 (CE)",
      "codeName": "CE",
      "startYear": 2022
    },
    "spec": {
      "lengthMm": 4855,
      "widthMm": 1880,
      "heightMm": 1495,
      "wheelbaseMm": 2950,
      "curbWeightKg": 1915
    },
    "trims": [
      {
        "nameKo": "롱레인지 익스클루시브 2WD",
        "price": 56050000,
        "fuelType": "ELECTRIC",
        "transmission": "감속기",
        "electricEfficiencyCombined": 6.0,
        "maxPower": 229,
        "maxTorque": 35.7,
        "seatingCapacity": 5
      },
      {
        "nameKo": "롱레인지 프레스티지 AWD",
        "price": 63800000,
        "fuelType": "ELECTRIC",
        "transmission": "감속기",
        "electricEfficiencyCombined": 5.5,
        "maxPower": 325,
        "maxTorque": 61.7,
        "seatingCapacity": 5
      }
    ]
  },
  {
    "brandSlug": "hyundai",
    "nameKo": "넥쏘",
    "nameEn": "Nexo",
    "slug": "nexo",
    "vehicleType": "SUV",
    "releaseYear": 2024,
    "minPrice": 69500000,
    "maxPrice": 73200000,
    "officialSiteUrl": "https://www.hyundai.com/kr/ko/e/vehicles/nexo/intro",
    "officialImageUrl": "https://www.hyundai.com/contents/repn-car/side-45/nexo-45side.png",
    "localMirrorUrl": "/images/cars/nexo.png",
    "sourceAttribution": "현대자동차 공식 홈페이지",
    "generation": {
      "nameKo": "1세대 (FE)",
      "codeName": "FE",
      "startYear": 2018
    },
    "spec": {
      "lengthMm": 4670,
      "widthMm": 1860,
      "heightMm": 1640,
      "wheelbaseMm": 2790,
      "curbWeightKg": 1885
    },
    "trims": [
      {
        "nameKo": "모던",
        "price": 69500000,
        "fuelType": "HYDROGEN",
        "transmission": "감속기",
        "fuelEfficiencyCombined": 96.2,
        "maxPower": 163,
        "maxTorque": 40.3,
        "seatingCapacity": 5
      },
      {
        "nameKo": "프리미엄",
        "price": 73200000,
        "fuelType": "HYDROGEN",
        "transmission": "감속기",
        "fuelEfficiencyCombined": 93.7,
        "maxPower": 163,
        "maxTorque": 40.3,
        "seatingCapacity": 5
      }
    ]
  },
  {
    "brandSlug": "hyundai",
    "nameKo": "스타리아",
    "nameEn": "Staria",
    "slug": "staria",
    "vehicleType": "VAN",
    "releaseYear": 2024,
    "minPrice": 28470000,
    "maxPrice": 46140000,
    "officialSiteUrl": "https://www.hyundai.com/kr/ko/e/vehicles/staria/intro",
    "officialImageUrl": "https://www.hyundai.com/contents/repn-car/side-45/palisade-45side.png",
    "localMirrorUrl": "/images/cars/staria.png",
    "sourceAttribution": "현대자동차 공식 홈페이지",
    "generation": {
      "nameKo": "1세대 (US4)",
      "codeName": "US4",
      "startYear": 2021
    },
    "spec": {
      "lengthMm": 5255,
      "widthMm": 1995,
      "heightMm": 1990,
      "wheelbaseMm": 3275,
      "curbWeightKg": 2185
    },
    "trims": [
      {
        "nameKo": "투어러 11인승 2.2 디젤",
        "price": 31520000,
        "fuelType": "DIESEL",
        "engineDisplacement": 2199,
        "transmission": "8단 자동",
        "fuelEfficiencyCombined": 11.3,
        "maxPower": 177,
        "maxTorque": 44.0,
        "seatingCapacity": 11
      },
      {
        "nameKo": "라운지 7인승 1.6 하이브리드",
        "price": 46140000,
        "fuelType": "HYBRID",
        "engineDisplacement": 1598,
        "transmission": "6단 자동",
        "fuelEfficiencyCombined": 13.0,
        "maxPower": 245,
        "maxTorque": 37.4,
        "seatingCapacity": 7
      }
    ]
  },
  {
    "brandSlug": "hyundai",
    "nameKo": "포터 2",
    "nameEn": "Porter 2",
    "slug": "porter2",
    "vehicleType": "TRUCK",
    "releaseYear": 2024,
    "minPrice": 20400000,
    "maxPrice": 43750000,
    "officialSiteUrl": "https://www.hyundai.com/kr/ko/e/vehicles/porter2/intro",
    "officialImageUrl": "https://www.hyundai.com/contents/repn-car/side-45/avante-45side.png",
    "localMirrorUrl": "/images/cars/porter2.png",
    "sourceAttribution": "현대자동차 공식 홈페이지",
    "generation": {
      "nameKo": "4세대 페이스리프트 (HR)",
      "codeName": "HR PE",
      "startYear": 2023
    },
    "spec": {
      "lengthMm": 5105,
      "widthMm": 1740,
      "heightMm": 1970,
      "wheelbaseMm": 2640,
      "curbWeightKg": 1820
    },
    "trims": [
      {
        "nameKo": "LPG 슈퍼캡 초장축 스마트",
        "price": 20400000,
        "fuelType": "LPG",
        "engineDisplacement": 2469,
        "transmission": "5단 자동",
        "fuelEfficiencyCombined": 7.0,
        "maxPower": 159,
        "maxTorque": 30.0,
        "seatingCapacity": 3
      },
      {
        "nameKo": "일렉트릭 슈퍼캡 초장축 프리미엄",
        "price": 43750000,
        "fuelType": "ELECTRIC",
        "transmission": "감속기",
        "electricEfficiencyCombined": 3.1,
        "maxPower": 184,
        "maxTorque": 40.3,
        "seatingCapacity": 3
      }
    ]
  },
  {
    "brandSlug": "kia",
    "nameKo": "더 뉴 모닝",
    "nameEn": "The New Morning",
    "slug": "morning",
    "vehicleType": "COMPACT",
    "releaseYear": 2024,
    "minPrice": 13150000,
    "maxPrice": 18200000,
    "officialSiteUrl": "https://www.kia.com/kr/vehicles/morning/features",
    "officialImageUrl": "https://www.kia.com/content/dam/kwp/kr/ko/vehicles/represent/krja305/morning_s_a2g.png",
    "localMirrorUrl": "/images/cars/morning.png",
    "sourceAttribution": "기아 공식 홈페이지",
    "generation": {
      "nameKo": "3세대 2차 페이스리프트 (JA)",
      "codeName": "JA PE2",
      "startYear": 2023
    },
    "spec": {
      "lengthMm": 3595,
      "widthMm": 1595,
      "heightMm": 1485,
      "wheelbaseMm": 2400,
      "curbWeightKg": 955
    },
    "trims": [
      {
        "nameKo": "1.0 가솔린 트렌디",
        "price": 13150000,
        "fuelType": "GASOLINE",
        "engineDisplacement": 998,
        "transmission": "4단 자동",
        "fuelEfficiencyCombined": 15.1,
        "maxPower": 76,
        "maxTorque": 9.7,
        "seatingCapacity": 5
      },
      {
        "nameKo": "1.0 가솔린 시그니처",
        "price": 17250000,
        "fuelType": "GASOLINE",
        "engineDisplacement": 998,
        "transmission": "4단 자동",
        "fuelEfficiencyCombined": 15.1,
        "maxPower": 76,
        "maxTorque": 9.7,
        "seatingCapacity": 5
      }
    ]
  },
  {
    "brandSlug": "kia",
    "nameKo": "더 뉴 기아 레이",
    "nameEn": "The New Kia Ray",
    "slug": "ray",
    "vehicleType": "COMPACT",
    "releaseYear": 2024,
    "minPrice": 13900000,
    "maxPrice": 20150000,
    "officialSiteUrl": "https://www.kia.com/kr/vehicles/ray/features",
    "officialImageUrl": "https://www.kia.com/content/dam/kwp/kr/ko/vehicles/represent/krtm311/ray_s_ud.png",
    "localMirrorUrl": "/images/cars/ray.png",
    "sourceAttribution": "기아 공식 홈페이지",
    "generation": {
      "nameKo": "1세대 2차 페이스리프트 (TAM)",
      "codeName": "TAM PE2",
      "startYear": 2022
    },
    "spec": {
      "lengthMm": 3595,
      "widthMm": 1595,
      "heightMm": 1700,
      "wheelbaseMm": 2520,
      "curbWeightKg": 1040
    },
    "trims": [
      {
        "nameKo": "1.0 가솔린 스탠다드",
        "price": 13900000,
        "fuelType": "GASOLINE",
        "engineDisplacement": 998,
        "transmission": "4단 자동",
        "fuelEfficiencyCombined": 13.0,
        "maxPower": 76,
        "maxTorque": 9.7,
        "seatingCapacity": 5
      },
      {
        "nameKo": "1.0 가솔린 시그니처",
        "price": 18150000,
        "fuelType": "GASOLINE",
        "engineDisplacement": 998,
        "transmission": "4단 자동",
        "fuelEfficiencyCombined": 13.0,
        "maxPower": 76,
        "maxTorque": 9.7,
        "seatingCapacity": 5
      },
      {
        "nameKo": "1.0 가솔린 그래비티",
        "price": 19200000,
        "fuelType": "GASOLINE",
        "engineDisplacement": 998,
        "transmission": "4단 자동",
        "fuelEfficiencyCombined": 13.0,
        "maxPower": 76,
        "maxTorque": 9.7,
        "seatingCapacity": 5
      }
    ]
  },
  {
    "brandSlug": "kia",
    "nameKo": "레이 EV",
    "nameEn": "Ray EV",
    "slug": "ray-ev",
    "vehicleType": "COMPACT",
    "releaseYear": 2024,
    "minPrice": 27350000,
    "maxPrice": 29550000,
    "officialSiteUrl": "https://www.kia.com/kr/vehicles/ray-ev/features",
    "officialImageUrl": "https://www.kia.com/content/dam/kwp/kr/ko/vehicles/represent/krtm312/ray-ev_s_ud.png",
    "localMirrorUrl": "/images/cars/ray-ev.png",
    "sourceAttribution": "기아 공식 홈페이지",
    "generation": {
      "nameKo": "1세대 2차 페이스리프트 EV",
      "codeName": "TAM EV",
      "startYear": 2023
    },
    "spec": {
      "lengthMm": 3595,
      "widthMm": 1595,
      "heightMm": 1710,
      "wheelbaseMm": 2520,
      "curbWeightKg": 1290
    },
    "trims": [
      {
        "nameKo": "EV 라이트 4인승",
        "price": 27350000,
        "fuelType": "ELECTRIC",
        "transmission": "감속기",
        "electricEfficiencyCombined": 5.1,
        "maxPower": 87,
        "maxTorque": 15.0,
        "seatingCapacity": 4
      },
      {
        "nameKo": "EV 에어 4인승",
        "price": 29550000,
        "fuelType": "ELECTRIC",
        "transmission": "감속기",
        "electricEfficiencyCombined": 5.1,
        "maxPower": 87,
        "maxTorque": 15.0,
        "seatingCapacity": 4
      }
    ]
  },
  {
    "brandSlug": "kia",
    "nameKo": "더 뉴 K5",
    "nameEn": "The New K5",
    "slug": "k5",
    "vehicleType": "SEDAN",
    "releaseYear": 2024,
    "minPrice": 27840000,
    "maxPrice": 39540000,
    "officialSiteUrl": "https://www.kia.com/kr/vehicles/k5/features",
    "officialImageUrl": "https://www.kia.com/content/dam/kwp/kr/ko/vehicles/represent/krdl308/k5_s_c7s.png",
    "localMirrorUrl": "/images/cars/k5.png",
    "sourceAttribution": "기아 공식 홈페이지",
    "generation": {
      "nameKo": "3세대 페이스리프트 (DL3)",
      "codeName": "DL3 PE",
      "startYear": 2023
    },
    "spec": {
      "lengthMm": 4905,
      "widthMm": 1860,
      "heightMm": 1445,
      "wheelbaseMm": 2850,
      "curbWeightKg": 1445
    },
    "trims": [
      {
        "nameKo": "2.0 가솔린 프레스티지",
        "price": 27840000,
        "fuelType": "GASOLINE",
        "engineDisplacement": 1999,
        "transmission": "6단 자동",
        "fuelEfficiencyCombined": 12.6,
        "maxPower": 160,
        "maxTorque": 20.0,
        "seatingCapacity": 5
      },
      {
        "nameKo": "1.6 터보 시그니처",
        "price": 35260000,
        "fuelType": "GASOLINE",
        "engineDisplacement": 1598,
        "transmission": "8단 자동",
        "fuelEfficiencyCombined": 13.5,
        "maxPower": 180,
        "maxTorque": 27.0,
        "seatingCapacity": 5
      },
      {
        "nameKo": "2.0 하이브리드 시그니처",
        "price": 39540000,
        "fuelType": "HYBRID",
        "engineDisplacement": 1999,
        "transmission": "6단 자동",
        "fuelEfficiencyCombined": 19.8,
        "maxPower": 195,
        "maxTorque": 28.5,
        "seatingCapacity": 5
      }
    ]
  },
  {
    "brandSlug": "kia",
    "nameKo": "더 뉴 K8",
    "nameEn": "The New K8",
    "slug": "k8",
    "vehicleType": "SEDAN",
    "releaseYear": 2024,
    "minPrice": 37360000,
    "maxPrice": 51370000,
    "officialSiteUrl": "https://www.kia.com/kr/vehicles/k8/features",
    "officialImageUrl": "https://www.kia.com/content/dam/kwp/kr/ko/vehicles/represent/krgl301/k8_s_byg.png",
    "localMirrorUrl": "/images/cars/k8.png",
    "sourceAttribution": "기아 공식 홈페이지",
    "generation": {
      "nameKo": "1세대 페이스리프트 (GL3)",
      "codeName": "GL3 PE",
      "startYear": 2024
    },
    "spec": {
      "lengthMm": 5050,
      "widthMm": 1880,
      "heightMm": 1455,
      "wheelbaseMm": 2895,
      "curbWeightKg": 1610
    },
    "trims": [
      {
        "nameKo": "2.5 가솔린 노블레스 라이트",
        "price": 37360000,
        "fuelType": "GASOLINE",
        "engineDisplacement": 2497,
        "transmission": "8단 자동",
        "fuelEfficiencyCombined": 11.6,
        "maxPower": 198,
        "maxTorque": 25.3,
        "seatingCapacity": 5
      },
      {
        "nameKo": "3.5 가솔린 시그니처",
        "price": 45500000,
        "fuelType": "GASOLINE",
        "engineDisplacement": 3470,
        "transmission": "8단 자동",
        "fuelEfficiencyCombined": 10.3,
        "maxPower": 300,
        "maxTorque": 36.6,
        "seatingCapacity": 5
      },
      {
        "nameKo": "1.6 하이브리드 시그니처",
        "price": 51370000,
        "fuelType": "HYBRID",
        "engineDisplacement": 1598,
        "transmission": "6단 자동",
        "fuelEfficiencyCombined": 18.1,
        "maxPower": 230,
        "maxTorque": 35.7,
        "seatingCapacity": 5
      }
    ]
  },
  {
    "brandSlug": "kia",
    "nameKo": "더 뉴 K9",
    "nameEn": "The New K9",
    "slug": "k9",
    "vehicleType": "SEDAN",
    "releaseYear": 2024,
    "minPrice": 59330000,
    "maxPrice": 86850000,
    "officialSiteUrl": "https://www.kia.com/kr/vehicles/k9/features",
    "officialImageUrl": "https://www.kia.com/content/dam/kwp/kr/ko/vehicles/represent/krjr296/k9_s_d9b.png",
    "localMirrorUrl": "/images/cars/k9.png",
    "sourceAttribution": "기아 공식 홈페이지",
    "generation": {
      "nameKo": "2세대 페이스리프트 (RJ)",
      "codeName": "RJ PE",
      "startYear": 2021
    },
    "spec": {
      "lengthMm": 5140,
      "widthMm": 1915,
      "heightMm": 1490,
      "wheelbaseMm": 3105,
      "curbWeightKg": 2015
    },
    "trims": [
      {
        "nameKo": "3.8 가솔린 플래티넘",
        "price": 59330000,
        "fuelType": "GASOLINE",
        "engineDisplacement": 3778,
        "transmission": "8단 자동",
        "fuelEfficiencyCombined": 9.0,
        "maxPower": 315,
        "maxTorque": 40.5,
        "seatingCapacity": 5
      },
      {
        "nameKo": "3.3 터보 마스터즈 AWD",
        "price": 86850000,
        "fuelType": "GASOLINE",
        "engineDisplacement": 3342,
        "transmission": "8단 자동",
        "fuelEfficiencyCombined": 8.1,
        "maxPower": 370,
        "maxTorque": 52.0,
        "seatingCapacity": 5
      }
    ]
  },
  {
    "brandSlug": "kia",
    "nameKo": "더 뉴 셀토스",
    "nameEn": "The New Seltos",
    "slug": "seltos",
    "vehicleType": "SUV",
    "releaseYear": 2024,
    "minPrice": 20870000,
    "maxPrice": 29030000,
    "officialSiteUrl": "https://www.kia.com/kr/vehicles/seltos/features",
    "officialImageUrl": "https://www.kia.com/content/dam/kwp/kr/ko/vehicles/represent/krst329/seltos_s_swp.png",
    "localMirrorUrl": "/images/cars/seltos.png",
    "sourceAttribution": "기아 공식 홈페이지",
    "generation": {
      "nameKo": "1세대 페이스리프트 (SP2)",
      "codeName": "SP2 PE",
      "startYear": 2022
    },
    "spec": {
      "lengthMm": 4390,
      "widthMm": 1800,
      "heightMm": 1600,
      "wheelbaseMm": 2630,
      "curbWeightKg": 1375
    },
    "trims": [
      {
        "nameKo": "2.0 가솔린 트렌디",
        "price": 20870000,
        "fuelType": "GASOLINE",
        "engineDisplacement": 1999,
        "transmission": "IVT 무단변속기",
        "fuelEfficiencyCombined": 12.9,
        "maxPower": 149,
        "maxTorque": 18.3,
        "seatingCapacity": 5
      },
      {
        "nameKo": "1.6 터보 시그니처",
        "price": 27500000,
        "fuelType": "GASOLINE",
        "engineDisplacement": 1598,
        "transmission": "8단 자동",
        "fuelEfficiencyCombined": 12.8,
        "maxPower": 198,
        "maxTorque": 27.0,
        "seatingCapacity": 5
      }
    ]
  },
  {
    "brandSlug": "kia",
    "nameKo": "디 올 뉴 니로",
    "nameEn": "The All New Niro",
    "slug": "niro",
    "vehicleType": "SUV",
    "releaseYear": 2024,
    "minPrice": 27130000,
    "maxPrice": 51200000,
    "officialSiteUrl": "https://www.kia.com/kr/vehicles/niro/features",
    "officialImageUrl": "https://www.kia.com/content/dam/kwp/kr/ko/vehicles/represent/krsg300/niro_s_isg.png",
    "localMirrorUrl": "/images/cars/niro.png",
    "sourceAttribution": "기아 공식 홈페이지",
    "generation": {
      "nameKo": "2세대 (SG2)",
      "codeName": "SG2",
      "startYear": 2022
    },
    "spec": {
      "lengthMm": 4420,
      "widthMm": 1825,
      "heightMm": 1545,
      "wheelbaseMm": 2720,
      "curbWeightKg": 1405
    },
    "trims": [
      {
        "nameKo": "1.6 하이브리드 트렌디",
        "price": 27130000,
        "fuelType": "HYBRID",
        "engineDisplacement": 1580,
        "transmission": "6단 DCT",
        "fuelEfficiencyCombined": 20.8,
        "maxPower": 141,
        "maxTorque": 27.0,
        "seatingCapacity": 5
      },
      {
        "nameKo": "1.6 하이브리드 시그니처",
        "price": 33760000,
        "fuelType": "HYBRID",
        "engineDisplacement": 1580,
        "transmission": "6단 DCT",
        "fuelEfficiencyCombined": 20.8,
        "maxPower": 141,
        "maxTorque": 27.0,
        "seatingCapacity": 5
      },
      {
        "nameKo": "EV 어스",
        "price": 51200000,
        "fuelType": "ELECTRIC",
        "transmission": "감속기",
        "electricEfficiencyCombined": 5.3,
        "maxPower": 204,
        "maxTorque": 26.0,
        "seatingCapacity": 5
      }
    ]
  },
  {
    "brandSlug": "kia",
    "nameKo": "더 뉴 스포티지",
    "nameEn": "The New Sportage",
    "slug": "sportage",
    "vehicleType": "SUV",
    "releaseYear": 2024,
    "minPrice": 28360000,
    "maxPrice": 41500000,
    "officialSiteUrl": "https://www.kia.com/kr/vehicles/sportage/features",
    "officialImageUrl": "https://www.kia.com/content/dam/kwp/kr/ko/vehicles/represent/krnq327/sportage_s_c7a.png",
    "localMirrorUrl": "/images/cars/sportage.png",
    "sourceAttribution": "기아 공식 홈페이지",
    "generation": {
      "nameKo": "5세대 페이스리프트 (NQ5)",
      "codeName": "NQ5 PE",
      "startYear": 2024
    },
    "spec": {
      "lengthMm": 4685,
      "widthMm": 1865,
      "heightMm": 1660,
      "wheelbaseMm": 2755,
      "curbWeightKg": 1570
    },
    "trims": [
      {
        "nameKo": "1.6 가솔린 터보 프레스티지",
        "price": 28360000,
        "fuelType": "GASOLINE",
        "engineDisplacement": 1598,
        "transmission": "8단 자동",
        "fuelEfficiencyCombined": 12.3,
        "maxPower": 180,
        "maxTorque": 27.0,
        "seatingCapacity": 5
      },
      {
        "nameKo": "1.6 터보 시그니처 X-Line",
        "price": 35250000,
        "fuelType": "GASOLINE",
        "engineDisplacement": 1598,
        "transmission": "8단 자동",
        "fuelEfficiencyCombined": 12.0,
        "maxPower": 180,
        "maxTorque": 27.0,
        "seatingCapacity": 5
      },
      {
        "nameKo": "1.6 하이브리드 시그니처 2WD",
        "price": 41500000,
        "fuelType": "HYBRID",
        "engineDisplacement": 1598,
        "transmission": "6단 자동",
        "fuelEfficiencyCombined": 16.3,
        "maxPower": 235,
        "maxTorque": 37.4,
        "seatingCapacity": 5
      }
    ]
  },
  {
    "brandSlug": "kia",
    "nameKo": "더 뉴 쏘렌토",
    "nameEn": "The New Sorento",
    "slug": "sorento",
    "vehicleType": "SUV",
    "releaseYear": 2024,
    "minPrice": 35060000,
    "maxPrice": 48320000,
    "officialSiteUrl": "https://www.kia.com/kr/vehicles/sorento/features",
    "officialImageUrl": "https://www.kia.com/content/dam/kwp/kr/ko/vehicles/represent/krmq326/sorento_s_bn4.png",
    "localMirrorUrl": "/images/cars/sorento.png",
    "sourceAttribution": "기아 공식 홈페이지",
    "generation": {
      "nameKo": "4세대 페이스리프트 (MQ4)",
      "codeName": "MQ4 PE",
      "startYear": 2023
    },
    "spec": {
      "lengthMm": 4815,
      "widthMm": 1900,
      "heightMm": 1695,
      "wheelbaseMm": 2815,
      "curbWeightKg": 1780
    },
    "trims": [
      {
        "nameKo": "2.5 가솔린 터보 프레스티지 2WD",
        "price": 35060000,
        "fuelType": "GASOLINE",
        "engineDisplacement": 2497,
        "transmission": "8단 습식 DCT",
        "fuelEfficiencyCombined": 10.8,
        "maxPower": 281,
        "maxTorque": 43.0,
        "seatingCapacity": 5
      },
      {
        "nameKo": "1.6 하이브리드 노블레스 2WD",
        "price": 41120000,
        "fuelType": "HYBRID",
        "engineDisplacement": 1598,
        "transmission": "6단 자동",
        "fuelEfficiencyCombined": 15.7,
        "maxPower": 235,
        "maxTorque": 37.4,
        "seatingCapacity": 5
      },
      {
        "nameKo": "1.6 하이브리드 시그니처 2WD",
        "price": 48320000,
        "fuelType": "HYBRID",
        "engineDisplacement": 1598,
        "transmission": "6단 자동",
        "fuelEfficiencyCombined": 15.3,
        "maxPower": 235,
        "maxTorque": 37.4,
        "seatingCapacity": 5
      }
    ]
  },
  {
    "brandSlug": "kia",
    "nameKo": "모하비",
    "nameEn": "Mohave",
    "slug": "mohave",
    "vehicleType": "SUV",
    "releaseYear": 2024,
    "minPrice": 50540000,
    "maxPrice": 59930000,
    "officialSiteUrl": "https://www.kia.com/kr/vehicles/mohave/features",
    "officialImageUrl": "https://www.kia.com/content/dam/kwp/kr/ko/vehicles/represent/krmq326/sorento_s_bn4.png",
    "localMirrorUrl": "/images/cars/mohave.png",
    "sourceAttribution": "기아 공식 홈페이지",
    "generation": {
      "nameKo": "더 마스터 (HM)",
      "codeName": "HM",
      "startYear": 2019
    },
    "spec": {
      "lengthMm": 4930,
      "widthMm": 1920,
      "heightMm": 1790,
      "wheelbaseMm": 2895,
      "curbWeightKg": 2250
    },
    "trims": [
      {
        "nameKo": "3.0 디젤 플래티넘 5인승",
        "price": 50540000,
        "fuelType": "DIESEL",
        "engineDisplacement": 2959,
        "transmission": "8단 자동",
        "fuelEfficiencyCombined": 9.3,
        "maxPower": 257,
        "maxTorque": 57.1,
        "seatingCapacity": 5
      },
      {
        "nameKo": "3.0 디젤 마스터즈 그래비티 6인승",
        "price": 59930000,
        "fuelType": "DIESEL",
        "engineDisplacement": 2959,
        "transmission": "8단 자동",
        "fuelEfficiencyCombined": 9.3,
        "maxPower": 257,
        "maxTorque": 57.1,
        "seatingCapacity": 6
      }
    ]
  },
  {
    "brandSlug": "kia",
    "nameKo": "더 뉴 카니발",
    "nameEn": "The New Carnival",
    "slug": "carnival",
    "vehicleType": "RV",
    "releaseYear": 2024,
    "minPrice": 34700000,
    "maxPrice": 52000000,
    "officialSiteUrl": "https://www.kia.com/kr/vehicles/carnival/features",
    "officialImageUrl": "https://www.kia.com/content/dam/kwp/kr/ko/vehicles/represent/krkp328/carnival_s_isg.png",
    "localMirrorUrl": "/images/cars/carnival.png",
    "sourceAttribution": "기아 공식 홈페이지",
    "generation": {
      "nameKo": "4세대 페이스리프트 (KA4)",
      "codeName": "KA4 PE",
      "startYear": 2023
    },
    "spec": {
      "lengthMm": 5155,
      "widthMm": 1995,
      "heightMm": 1775,
      "wheelbaseMm": 3090,
      "curbWeightKg": 2095
    },
    "trims": [
      {
        "nameKo": "3.5 가솔린 프레스티지 9인승",
        "price": 34700000,
        "fuelType": "GASOLINE",
        "engineDisplacement": 3470,
        "transmission": "8단 자동",
        "fuelEfficiencyCombined": 9.0,
        "maxPower": 290,
        "maxTorque": 36.2,
        "seatingCapacity": 9
      },
      {
        "nameKo": "1.6 하이브리드 노블레스 9인승",
        "price": 43650000,
        "fuelType": "HYBRID",
        "engineDisplacement": 1598,
        "transmission": "6단 자동",
        "fuelEfficiencyCombined": 14.0,
        "maxPower": 245,
        "maxTorque": 37.4,
        "seatingCapacity": 9
      },
      {
        "nameKo": "1.6 하이브리드 시그니처 7인승",
        "price": 52000000,
        "fuelType": "HYBRID",
        "engineDisplacement": 1598,
        "transmission": "6단 자동",
        "fuelEfficiencyCombined": 13.5,
        "maxPower": 245,
        "maxTorque": 37.4,
        "seatingCapacity": 7
      }
    ]
  },
  {
    "brandSlug": "kia",
    "nameKo": "카니발 하이리무진",
    "nameEn": "Carnival Hi-Limousine",
    "slug": "carnival-hi-limousine",
    "vehicleType": "RV",
    "releaseYear": 2024,
    "minPrice": 62500000,
    "maxPrice": 92000000,
    "officialSiteUrl": "https://www.kia.com/kr/vehicles/carnival-hi-limousine/features",
    "officialImageUrl": "https://www.kia.com/content/dam/kwp/kr/ko/vehicles/represent/krkp330/carnival-hi-limousine_s_abp.png",
    "localMirrorUrl": "/images/cars/carnival-hi-limousine.png",
    "sourceAttribution": "기아 공식 홈페이지",
    "generation": {
      "nameKo": "4세대 하이리무진 (KA4)",
      "codeName": "KA4 HiLimousine",
      "startYear": 2023
    },
    "spec": {
      "lengthMm": 5155,
      "widthMm": 1995,
      "heightMm": 2045,
      "wheelbaseMm": 3090,
      "curbWeightKg": 2240
    },
    "trims": [
      {
        "nameKo": "3.5 가솔린 9인승 노블레스",
        "price": 62500000,
        "fuelType": "GASOLINE",
        "engineDisplacement": 3470,
        "transmission": "8단 자동",
        "fuelEfficiencyCombined": 8.7,
        "maxPower": 290,
        "maxTorque": 36.2,
        "seatingCapacity": 9
      },
      {
        "nameKo": "1.6 하이브리드 4인승 시그니처",
        "price": 92000000,
        "fuelType": "HYBRID",
        "engineDisplacement": 1598,
        "transmission": "6단 자동",
        "fuelEfficiencyCombined": 13.0,
        "maxPower": 245,
        "maxTorque": 37.4,
        "seatingCapacity": 4
      }
    ]
  },
  {
    "brandSlug": "kia",
    "nameKo": "타스만",
    "nameEn": "Tasman",
    "slug": "tasman",
    "vehicleType": "TRUCK",
    "releaseYear": 2025,
    "minPrice": 37000000,
    "maxPrice": 51000000,
    "officialSiteUrl": "https://www.kia.com/kr/vehicles/tasman/features",
    "officialImageUrl": "https://www.kia.com/content/dam/kwp/kr/ko/vehicles/represent/krpk306/tasman_s_tam.png",
    "localMirrorUrl": "/images/cars/tasman.png",
    "sourceAttribution": "기아 공식 홈페이지",
    "generation": {
      "nameKo": "1세대 (TK1)",
      "codeName": "TK1",
      "startYear": 2025
    },
    "spec": {
      "lengthMm": 5410,
      "widthMm": 1930,
      "heightMm": 1870,
      "wheelbaseMm": 3270,
      "curbWeightKg": 2150
    },
    "trims": [
      {
        "nameKo": "2.5 가솔린 터보 다이내믹 2WD",
        "price": 37000000,
        "fuelType": "GASOLINE",
        "engineDisplacement": 2497,
        "transmission": "8단 자동",
        "fuelEfficiencyCombined": 9.5,
        "maxPower": 281,
        "maxTorque": 43.0,
        "seatingCapacity": 5
      },
      {
        "nameKo": "2.5 가솔린 터보 X-Pro 4WD",
        "price": 51000000,
        "fuelType": "GASOLINE",
        "engineDisplacement": 2497,
        "transmission": "8단 자동",
        "fuelEfficiencyCombined": 8.8,
        "maxPower": 281,
        "maxTorque": 43.0,
        "seatingCapacity": 5
      }
    ]
  },
  {
    "brandSlug": "kia",
    "nameKo": "기아 EV3",
    "nameEn": "Kia EV3",
    "slug": "ev3",
    "vehicleType": "SUV",
    "releaseYear": 2024,
    "minPrice": 42080000,
    "maxPrice": 51080000,
    "officialSiteUrl": "https://www.kia.com/kr/vehicles/ev3/features",
    "officialImageUrl": "https://www.kia.com/content/dam/kwp/kr/ko/vehicles/represent/krsv292/ev3_s_ag3.png",
    "localMirrorUrl": "/images/cars/ev3.png",
    "sourceAttribution": "기아 공식 홈페이지",
    "generation": {
      "nameKo": "1세대 (SV)",
      "codeName": "SV",
      "startYear": 2024
    },
    "spec": {
      "lengthMm": 4300,
      "widthMm": 1850,
      "heightMm": 1560,
      "wheelbaseMm": 2680,
      "curbWeightKg": 1750
    },
    "trims": [
      {
        "nameKo": "스탠다드 에어 2WD",
        "price": 42080000,
        "fuelType": "ELECTRIC",
        "transmission": "감속기",
        "electricEfficiencyCombined": 5.4,
        "maxPower": 204,
        "maxTorque": 28.9,
        "seatingCapacity": 5
      },
      {
        "nameKo": "롱레인지 GT-Line 2WD",
        "price": 51080000,
        "fuelType": "ELECTRIC",
        "transmission": "감속기",
        "electricEfficiencyCombined": 5.2,
        "maxPower": 204,
        "maxTorque": 28.9,
        "seatingCapacity": 5
      }
    ]
  },
  {
    "brandSlug": "kia",
    "nameKo": "더 뉴 EV6",
    "nameEn": "The New EV6",
    "slug": "ev6",
    "vehicleType": "SUV",
    "releaseYear": 2024,
    "minPrice": 52600000,
    "maxPrice": 63150000,
    "officialSiteUrl": "https://www.kia.com/kr/vehicles/ev6/features",
    "officialImageUrl": "https://www.kia.com/content/dam/kwp/kr/ko/vehicles/represent/krcv324/ev6_s_ism.png",
    "localMirrorUrl": "/images/cars/ev6.png",
    "sourceAttribution": "기아 공식 홈페이지",
    "generation": {
      "nameKo": "1세대 페이스리프트 (CV)",
      "codeName": "CV PE",
      "startYear": 2024
    },
    "spec": {
      "lengthMm": 4695,
      "widthMm": 1880,
      "heightMm": 1545,
      "wheelbaseMm": 2900,
      "curbWeightKg": 1970
    },
    "trims": [
      {
        "nameKo": "롱레인지 라이트 2WD",
        "price": 52600000,
        "fuelType": "ELECTRIC",
        "transmission": "감속기",
        "electricEfficiencyCombined": 5.2,
        "maxPower": 229,
        "maxTorque": 35.7,
        "seatingCapacity": 5
      },
      {
        "nameKo": "롱레인지 GT-Line 4WD",
        "price": 63150000,
        "fuelType": "ELECTRIC",
        "transmission": "감속기",
        "electricEfficiencyCombined": 4.9,
        "maxPower": 325,
        "maxTorque": 61.7,
        "seatingCapacity": 5
      }
    ]
  },
  {
    "brandSlug": "kia",
    "nameKo": "기아 EV9",
    "nameEn": "Kia EV9",
    "slug": "ev9",
    "vehicleType": "SUV",
    "releaseYear": 2024,
    "minPrice": 73370000,
    "maxPrice": 87810000,
    "officialSiteUrl": "https://www.kia.com/kr/vehicles/ev9/features",
    "officialImageUrl": "https://www.kia.com/content/dam/kwp/kr/ko/vehicles/represent/krmv297/ev9_s_ism.png",
    "localMirrorUrl": "/images/cars/ev9.png",
    "sourceAttribution": "기아 공식 홈페이지",
    "generation": {
      "nameKo": "1세대 (MV)",
      "codeName": "MV",
      "startYear": 2023
    },
    "spec": {
      "lengthMm": 5010,
      "widthMm": 1980,
      "heightMm": 1755,
      "wheelbaseMm": 3100,
      "curbWeightKg": 2420
    },
    "trims": [
      {
        "nameKo": "2WD 에어",
        "price": 73370000,
        "fuelType": "ELECTRIC",
        "transmission": "감속기",
        "electricEfficiencyCombined": 4.2,
        "maxPower": 204,
        "maxTorque": 35.7,
        "seatingCapacity": 7
      },
      {
        "nameKo": "4WD GT-Line",
        "price": 87810000,
        "fuelType": "ELECTRIC",
        "transmission": "감속기",
        "electricEfficiencyCombined": 3.9,
        "maxPower": 384,
        "maxTorque": 71.4,
        "seatingCapacity": 6
      }
    ]
  },
  {
    "brandSlug": "kia",
    "nameKo": "봉고 3",
    "nameEn": "Bongo 3",
    "slug": "bongo3",
    "vehicleType": "TRUCK",
    "releaseYear": 2024,
    "minPrice": 20350000,
    "maxPrice": 44540000,
    "officialSiteUrl": "https://www.kia.com/kr/vehicles/bongo3/features",
    "officialImageUrl": "https://www.kia.com/content/dam/kwp/kr/ko/vehicles/represent/krb1279/bongo3-ev_s_ud.png",
    "localMirrorUrl": "/images/cars/bongo3.png",
    "sourceAttribution": "기아 공식 홈페이지",
    "generation": {
      "nameKo": "4세대 (PU)",
      "codeName": "PU",
      "startYear": 2023
    },
    "spec": {
      "lengthMm": 5125,
      "widthMm": 1740,
      "heightMm": 1970,
      "wheelbaseMm": 2615,
      "curbWeightKg": 1810
    },
    "trims": [
      {
        "nameKo": "1톤 LPG 킹캡 GL",
        "price": 20350000,
        "fuelType": "LPG",
        "engineDisplacement": 2469,
        "transmission": "5단 자동",
        "fuelEfficiencyCombined": 7.0,
        "maxPower": 159,
        "maxTorque": 30.0,
        "seatingCapacity": 3
      },
      {
        "nameKo": "1톤 EV 킹캡 GL",
        "price": 44540000,
        "fuelType": "ELECTRIC",
        "transmission": "감속기",
        "electricEfficiencyCombined": 3.1,
        "maxPower": 184,
        "maxTorque": 40.3,
        "seatingCapacity": 3
      }
    ]
  },
  {
    "brandSlug": "genesis",
    "nameKo": "제네시스 G70",
    "nameEn": "Genesis G70",
    "slug": "genesis-g70",
    "vehicleType": "SEDAN",
    "releaseYear": 2024,
    "minPrice": 43470000,
    "maxPrice": 58050000,
    "officialSiteUrl": "https://www.genesis.com/kr/ko/models/luxury-sedan-genesis/g70/highlights.html",
    "officialImageUrl": "https://dams.hyundai-autoever.com/cdn-cgi/image/width=1120,height=630,fit=cover,quality=85,format=auto/v1/openapi/hmg-presigned-url/50534b313031303030303030303030303133373937/thumbnail/genesis-g70-side-view-model-thumbnail.png",
    "localMirrorUrl": "/images/cars/genesis-g70.png",
    "sourceAttribution": "제네시스 공식 홈페이지",
    "generation": {
      "nameKo": "1세대 페이스리프트 (IK)",
      "codeName": "IK PE",
      "startYear": 2023
    },
    "spec": {
      "lengthMm": 4685,
      "widthMm": 1850,
      "heightMm": 1400,
      "wheelbaseMm": 2835,
      "curbWeightKg": 1675
    },
    "trims": [
      {
        "nameKo": "2.5 가솔린 터보 2WD",
        "price": 43470000,
        "fuelType": "GASOLINE",
        "engineDisplacement": 2497,
        "transmission": "8단 자동",
        "fuelEfficiencyCombined": 11.2,
        "maxPower": 304,
        "maxTorque": 43.0,
        "seatingCapacity": 5
      },
      {
        "nameKo": "3.3 가솔린 터보 스포츠 AWD",
        "price": 58050000,
        "fuelType": "GASOLINE",
        "engineDisplacement": 3342,
        "transmission": "8단 자동",
        "fuelEfficiencyCombined": 9.4,
        "maxPower": 370,
        "maxTorque": 52.0,
        "seatingCapacity": 5
      }
    ]
  },
  {
    "brandSlug": "genesis",
    "nameKo": "제네시스 G70 슈팅브레이크",
    "nameEn": "Genesis G70 Shooting Brake",
    "slug": "genesis-g70-shooting-brake",
    "vehicleType": "WAGON",
    "releaseYear": 2024,
    "minPrice": 45440000,
    "maxPrice": 60000000,
    "officialSiteUrl": "https://www.genesis.com/kr/ko/models/luxury-sedan-genesis/g70-shooting-brake/highlights.html",
    "officialImageUrl": "https://dams.hyundai-autoever.com/cdn-cgi/image/width=1120,height=630,fit=cover,quality=85,format=auto/v1/openapi/hmg-presigned-url/50534b313031303030303030303030303139353937/thumbnail/genesis-g70-shooting-brake-side-view-model-thumbnail.png",
    "localMirrorUrl": "/images/cars/genesis-g70-shooting-brake.png",
    "sourceAttribution": "제네시스 공식 홈페이지",
    "generation": {
      "nameKo": "1세대 슈팅브레이크",
      "codeName": "IK SB",
      "startYear": 2022
    },
    "spec": {
      "lengthMm": 4685,
      "widthMm": 1850,
      "heightMm": 1400,
      "wheelbaseMm": 2835,
      "curbWeightKg": 1695
    },
    "trims": [
      {
        "nameKo": "2.5 가솔린 터보 2WD",
        "price": 45440000,
        "fuelType": "GASOLINE",
        "engineDisplacement": 2497,
        "transmission": "8단 자동",
        "fuelEfficiencyCombined": 11.0,
        "maxPower": 304,
        "maxTorque": 43.0,
        "seatingCapacity": 5
      }
    ]
  },
  {
    "brandSlug": "genesis",
    "nameKo": "제네시스 G80",
    "nameEn": "Genesis G80",
    "slug": "genesis-g80",
    "vehicleType": "SEDAN",
    "releaseYear": 2024,
    "minPrice": 58900000,
    "maxPrice": 88600000,
    "officialSiteUrl": "https://www.genesis.com/kr/ko/models/luxury-sedan-genesis/g80/highlights.html",
    "officialImageUrl": "https://dams.hyundai-autoever.com/cdn-cgi/image/width=1120,height=630,fit=cover,quality=85,format=auto/v1/openapi/hmg-presigned-url/50534b313031303030303030303030303130363133/genesis-g80-standard-side-view-model-thumbnail.png",
    "localMirrorUrl": "/images/cars/genesis-g80.png",
    "sourceAttribution": "제네시스 공식 홈페이지",
    "generation": {
      "nameKo": "3세대 페이스리프트 (RG3)",
      "codeName": "RG3 PE",
      "startYear": 2023
    },
    "spec": {
      "lengthMm": 5005,
      "widthMm": 1925,
      "heightMm": 1465,
      "wheelbaseMm": 3010,
      "curbWeightKg": 1895
    },
    "trims": [
      {
        "nameKo": "2.5 가솔린 터보 2WD",
        "price": 58900000,
        "fuelType": "GASOLINE",
        "engineDisplacement": 2497,
        "transmission": "8단 자동",
        "fuelEfficiencyCombined": 10.6,
        "maxPower": 304,
        "maxTorque": 43.0,
        "seatingCapacity": 5
      },
      {
        "nameKo": "3.5 가솔린 터보 AWD 스포츠",
        "price": 88600000,
        "fuelType": "GASOLINE",
        "engineDisplacement": 3470,
        "transmission": "8단 자동",
        "fuelEfficiencyCombined": 8.4,
        "maxPower": 380,
        "maxTorque": 54.0,
        "seatingCapacity": 5
      }
    ]
  },
  {
    "brandSlug": "genesis",
    "nameKo": "G80 전동화 모델",
    "nameEn": "Electrified G80",
    "slug": "genesis-electrified-g80",
    "vehicleType": "SEDAN",
    "releaseYear": 2024,
    "minPrice": 88900000,
    "maxPrice": 95000000,
    "officialSiteUrl": "https://www.genesis.com/kr/ko/models/luxury-sedan-genesis/electrified-g80/highlights.html",
    "officialImageUrl": "https://dams.hyundai-autoever.com/cdn-cgi/image/width=1120,height=630,fit=cover,quality=85,format=auto/v1/openapi/hmg-presigned-url/50534b313031303030303030303030303130363130/genesis-electrified-g80-side-view-model-thumbnail.png",
    "localMirrorUrl": "/images/cars/genesis-electrified-g80.png",
    "sourceAttribution": "제네시스 공식 홈페이지",
    "generation": {
      "nameKo": "3세대 전동화 페이스리프트 (RG3 EV)",
      "codeName": "RG3 EV PE",
      "startYear": 2024
    },
    "spec": {
      "lengthMm": 5135,
      "widthMm": 1925,
      "heightMm": 1475,
      "wheelbaseMm": 3140,
      "curbWeightKg": 2325
    },
    "trims": [
      {
        "nameKo": "Electrified G80 AWD",
        "price": 88900000,
        "fuelType": "ELECTRIC",
        "transmission": "감속기",
        "electricEfficiencyCombined": 4.4,
        "maxPower": 370,
        "maxTorque": 71.4,
        "seatingCapacity": 5
      }
    ]
  },
  {
    "brandSlug": "genesis",
    "nameKo": "제네시스 G90",
    "nameEn": "Genesis G90",
    "slug": "genesis-g90",
    "vehicleType": "SEDAN",
    "releaseYear": 2024,
    "minPrice": 95400000,
    "maxPrice": 177000000,
    "officialSiteUrl": "https://www.genesis.com/kr/ko/models/luxury-sedan-genesis/g90/highlights.html",
    "officialImageUrl": "https://dams.hyundai-autoever.com/cdn-cgi/image/width=1120,height=630,fit=cover,quality=85,format=auto/v1/openapi/hmg-presigned-url/50534b313031303030303030303030303130363031/genesis-g90-side-view-model-thumbnail.png",
    "localMirrorUrl": "/images/cars/genesis-g90.png",
    "sourceAttribution": "제네시스 공식 홈페이지",
    "generation": {
      "nameKo": "4세대 (RS4)",
      "codeName": "RS4",
      "startYear": 2022
    },
    "spec": {
      "lengthMm": 5275,
      "widthMm": 1930,
      "heightMm": 1490,
      "wheelbaseMm": 3180,
      "curbWeightKg": 2110
    },
    "trims": [
      {
        "nameKo": "3.5 가솔린 터보 2WD",
        "price": 95400000,
        "fuelType": "GASOLINE",
        "engineDisplacement": 3470,
        "transmission": "8단 자동",
        "fuelEfficiencyCombined": 9.3,
        "maxPower": 380,
        "maxTorque": 54.0,
        "seatingCapacity": 5
      },
      {
        "nameKo": "3.5 터보 48V 일렉트릭 슈퍼차저 LWB AWD",
        "price": 177000000,
        "fuelType": "GASOLINE",
        "engineDisplacement": 3470,
        "transmission": "8단 자동",
        "fuelEfficiencyCombined": 8.2,
        "maxPower": 415,
        "maxTorque": 56.0,
        "seatingCapacity": 4
      }
    ]
  },
  {
    "brandSlug": "genesis",
    "nameKo": "제네시스 GV60",
    "nameEn": "Genesis GV60",
    "slug": "genesis-gv60",
    "vehicleType": "SUV",
    "releaseYear": 2024,
    "minPrice": 64930000,
    "maxPrice": 73930000,
    "officialSiteUrl": "https://www.genesis.com/kr/ko/models/luxury-suv-genesis/gv60/highlights.html",
    "officialImageUrl": "https://dams.hyundai-autoever.com/cdn-cgi/image/width=1120,height=630,fit=cover,quality=85,format=auto/v1/openapi/hmg-presigned-url/50534b313031303030303030303030303130363236/genesis-gv60-side-view-model-thumbnail.png",
    "localMirrorUrl": "/images/cars/genesis-gv60.png",
    "sourceAttribution": "제네시스 공식 홈페이지",
    "generation": {
      "nameKo": "1세대 (JW)",
      "codeName": "JW",
      "startYear": 2021
    },
    "spec": {
      "lengthMm": 4515,
      "widthMm": 1890,
      "heightMm": 1580,
      "wheelbaseMm": 2900,
      "curbWeightKg": 2010
    },
    "trims": [
      {
        "nameKo": "스탠다드 2WD",
        "price": 64930000,
        "fuelType": "ELECTRIC",
        "transmission": "감속기",
        "electricEfficiencyCombined": 5.1,
        "maxPower": 228,
        "maxTorque": 35.7,
        "seatingCapacity": 5
      },
      {
        "nameKo": "퍼포먼스 AWD",
        "price": 73930000,
        "fuelType": "ELECTRIC",
        "transmission": "감속기",
        "electricEfficiencyCombined": 4.1,
        "maxPower": 489,
        "maxTorque": 71.4,
        "seatingCapacity": 5
      }
    ]
  },
  {
    "brandSlug": "genesis",
    "nameKo": "제네시스 GV70",
    "nameEn": "Genesis GV70",
    "slug": "genesis-gv70",
    "vehicleType": "SUV",
    "releaseYear": 2024,
    "minPrice": 53800000,
    "maxPrice": 72500000,
    "officialSiteUrl": "https://www.genesis.com/kr/ko/models/luxury-suv-genesis/gv70/highlights.html",
    "officialImageUrl": "https://dams.hyundai-autoever.com/cdn-cgi/image/width=1120,height=630,fit=cover,quality=85,format=auto/v1/openapi/hmg-presigned-url/50534b313031303030303030303030303130363139/genesis-gv70-sport-side-view-model-thumbnail.png",
    "localMirrorUrl": "/images/cars/genesis-gv70.png",
    "sourceAttribution": "제네시스 공식 홈페이지",
    "generation": {
      "nameKo": "1세대 페이스리프트 (JK1)",
      "codeName": "JK1 PE",
      "startYear": 2024
    },
    "spec": {
      "lengthMm": 4715,
      "widthMm": 1910,
      "heightMm": 1630,
      "wheelbaseMm": 2875,
      "curbWeightKg": 1850
    },
    "trims": [
      {
        "nameKo": "2.5 가솔린 터보 2WD",
        "price": 53800000,
        "fuelType": "GASOLINE",
        "engineDisplacement": 2497,
        "transmission": "8단 자동",
        "fuelEfficiencyCombined": 10.2,
        "maxPower": 304,
        "maxTorque": 43.0,
        "seatingCapacity": 5
      },
      {
        "nameKo": "3.5 가솔린 터보 스포츠 AWD",
        "price": 72500000,
        "fuelType": "GASOLINE",
        "engineDisplacement": 3470,
        "transmission": "8단 자동",
        "fuelEfficiencyCombined": 8.5,
        "maxPower": 380,
        "maxTorque": 54.0,
        "seatingCapacity": 5
      }
    ]
  },
  {
    "brandSlug": "genesis",
    "nameKo": "GV70 전동화 모델",
    "nameEn": "Electrified GV70",
    "slug": "genesis-electrified-gv70",
    "vehicleType": "SUV",
    "releaseYear": 2024,
    "minPrice": 77320000,
    "maxPrice": 84000000,
    "officialSiteUrl": "https://www.genesis.com/kr/ko/models/luxury-suv-genesis/electrified-gv70/highlights.html",
    "officialImageUrl": "https://dams.hyundai-autoever.com/cdn-cgi/image/width=1120,height=630,fit=cover,quality=85,format=auto/v1/openapi/hmg-presigned-url/50534b313031303030303030303030303130363136/genesis-electrified-gv70-side-view-model-thumbnail.png",
    "localMirrorUrl": "/images/cars/genesis-electrified-gv70.png",
    "sourceAttribution": "제네시스 공식 홈페이지",
    "generation": {
      "nameKo": "1세대 전동화 (JK1 EV)",
      "codeName": "JK1 EV",
      "startYear": 2022
    },
    "spec": {
      "lengthMm": 4715,
      "widthMm": 1910,
      "heightMm": 1630,
      "wheelbaseMm": 2875,
      "curbWeightKg": 2245
    },
    "trims": [
      {
        "nameKo": "Electrified GV70 AWD",
        "price": 77320000,
        "fuelType": "ELECTRIC",
        "transmission": "감속기",
        "electricEfficiencyCombined": 4.6,
        "maxPower": 435,
        "maxTorque": 71.4,
        "seatingCapacity": 5
      }
    ]
  },
  {
    "brandSlug": "genesis",
    "nameKo": "제네시스 GV80",
    "nameEn": "Genesis GV80",
    "slug": "genesis-gv80",
    "vehicleType": "SUV",
    "releaseYear": 2024,
    "minPrice": 69300000,
    "maxPrice": 95000000,
    "officialSiteUrl": "https://www.genesis.com/kr/ko/models/luxury-suv-genesis/gv80/highlights.html",
    "officialImageUrl": "https://dams.hyundai-autoever.com/cdn-cgi/image/width=1120,height=630,fit=cover,quality=85,format=auto/v1/openapi/hmg-presigned-url/50534b313031303030303030303030303138393434/thumbnail/genesis-gv80-27my-side-view-model-thumbnail.png",
    "localMirrorUrl": "/images/cars/genesis-gv80.png",
    "sourceAttribution": "제네시스 공식 홈페이지",
    "generation": {
      "nameKo": "1세대 페이스리프트 (JX1)",
      "codeName": "JX1 PE",
      "startYear": 2023
    },
    "spec": {
      "lengthMm": 4940,
      "widthMm": 1975,
      "heightMm": 1715,
      "wheelbaseMm": 2955,
      "curbWeightKg": 2135
    },
    "trims": [
      {
        "nameKo": "2.5 가솔린 터보 2WD 5인승",
        "price": 69300000,
        "fuelType": "GASOLINE",
        "engineDisplacement": 2497,
        "transmission": "8단 자동",
        "fuelEfficiencyCombined": 9.3,
        "maxPower": 304,
        "maxTorque": 43.0,
        "seatingCapacity": 5
      },
      {
        "nameKo": "3.5 가솔린 터보 AWD 6인승",
        "price": 95000000,
        "fuelType": "GASOLINE",
        "engineDisplacement": 3470,
        "transmission": "8단 자동",
        "fuelEfficiencyCombined": 7.7,
        "maxPower": 380,
        "maxTorque": 54.0,
        "seatingCapacity": 6
      }
    ]
  },
  {
    "brandSlug": "genesis",
    "nameKo": "제네시스 GV80 쿠페",
    "nameEn": "Genesis GV80 Coupe",
    "slug": "genesis-gv80-coupe",
    "vehicleType": "SUV",
    "releaseYear": 2024,
    "minPrice": 82550000,
    "maxPrice": 107000000,
    "officialSiteUrl": "https://www.genesis.com/kr/ko/models/luxury-suv-genesis/gv80-coupe/highlights.html",
    "officialImageUrl": "https://dams.hyundai-autoever.com/cdn-cgi/image/width=1120,height=630,fit=cover,quality=85,format=auto/v1/openapi/hmg-presigned-url/50534b313031303030303030303030303139353935/thumbnail/genesis-gv80-coupe-27my-side-view-model-thumbnail.png",
    "localMirrorUrl": "/images/cars/genesis-gv80-coupe.png",
    "sourceAttribution": "제네시스 공식 홈페이지",
    "generation": {
      "nameKo": "1세대 쿠페 (JX1 Coupe)",
      "codeName": "JX1 Coupe",
      "startYear": 2023
    },
    "spec": {
      "lengthMm": 4965,
      "widthMm": 1975,
      "heightMm": 1710,
      "wheelbaseMm": 2955,
      "curbWeightKg": 2185
    },
    "trims": [
      {
        "nameKo": "2.5 가솔린 터보 AWD",
        "price": 82550000,
        "fuelType": "GASOLINE",
        "engineDisplacement": 2497,
        "transmission": "8단 자동",
        "fuelEfficiencyCombined": 8.2,
        "maxPower": 304,
        "maxTorque": 43.0,
        "seatingCapacity": 5
      },
      {
        "nameKo": "3.5 터보 48V 일렉트릭 슈퍼차저 AWD",
        "price": 107000000,
        "fuelType": "GASOLINE",
        "engineDisplacement": 3470,
        "transmission": "8단 자동",
        "fuelEfficiencyCombined": 7.8,
        "maxPower": 415,
        "maxTorque": 56.0,
        "seatingCapacity": 5
      }
    ]
  },
  {
    "brandSlug": "kgm",
    "nameKo": "액티언",
    "nameEn": "Actyon",
    "slug": "kgm-actyon",
    "vehicleType": "SUV",
    "releaseYear": 2024,
    "minPrice": 33950000,
    "maxPrice": 36490000,
    "officialSiteUrl": "https://www.kg-mobility.com",
    "officialImageUrl": "https://www.kg-mobility.com/attached/contents/display/mycar/UH5/20260123011428259_VIqFJA_MODEL_MAIN_UH5.png",
    "localMirrorUrl": "/images/cars/actyon.png",
    "sourceAttribution": "KG모빌리티 공식 홈페이지",
    "generation": {
      "nameKo": "2세대 (J120)",
      "codeName": "J120",
      "startYear": 2024
    },
    "spec": {
      "lengthMm": 4740,
      "widthMm": 1910,
      "heightMm": 1680,
      "wheelbaseMm": 2680,
      "curbWeightKg": 1610
    },
    "trims": [
      {
        "nameKo": "1.5 가솔린 터보 S7",
        "price": 33950000,
        "fuelType": "GASOLINE",
        "engineDisplacement": 1497,
        "transmission": "6단 자동",
        "fuelEfficiencyCombined": 11.0,
        "maxPower": 170,
        "maxTorque": 28.6,
        "seatingCapacity": 5
      },
      {
        "nameKo": "1.5 가솔린 터보 S9",
        "price": 36490000,
        "fuelType": "GASOLINE",
        "engineDisplacement": 1497,
        "transmission": "6단 자동",
        "fuelEfficiencyCombined": 11.0,
        "maxPower": 170,
        "maxTorque": 28.6,
        "seatingCapacity": 5
      }
    ]
  },
  {
    "brandSlug": "kgm",
    "nameKo": "토레스",
    "nameEn": "Torres",
    "slug": "kgm-torres",
    "vehicleType": "SUV",
    "releaseYear": 2024,
    "minPrice": 28300000,
    "maxPrice": 37600000,
    "officialSiteUrl": "https://www.kg-mobility.com",
    "officialImageUrl": "https://www.kg-mobility.com/attached/contents/display/mycar/UP5/20260123011349013_8cFfHT_MODEL_MAIN_UP5.png",
    "localMirrorUrl": "/images/cars/torres.png",
    "sourceAttribution": "KG모빌리티 공식 홈페이지",
    "generation": {
      "nameKo": "1세대 (J100)",
      "codeName": "J100",
      "startYear": 2022
    },
    "spec": {
      "lengthMm": 4705,
      "widthMm": 1890,
      "heightMm": 1720,
      "wheelbaseMm": 2680,
      "curbWeightKg": 1520
    },
    "trims": [
      {
        "nameKo": "1.5 가솔린 터보 T5",
        "price": 28300000,
        "fuelType": "GASOLINE",
        "engineDisplacement": 1497,
        "transmission": "6단 자동",
        "fuelEfficiencyCombined": 11.2,
        "maxPower": 170,
        "maxTorque": 28.6,
        "seatingCapacity": 5
      },
      {
        "nameKo": "1.5 가솔린 터보 T7 AWD",
        "price": 37600000,
        "fuelType": "GASOLINE",
        "engineDisplacement": 1497,
        "transmission": "6단 자동",
        "fuelEfficiencyCombined": 10.2,
        "maxPower": 170,
        "maxTorque": 28.6,
        "seatingCapacity": 5
      }
    ]
  },
  {
    "brandSlug": "kgm",
    "nameKo": "토레스 EVX",
    "nameEn": "Torres EVX",
    "slug": "kgm-torres-evx",
    "vehicleType": "SUV",
    "releaseYear": 2024,
    "minPrice": 45500000,
    "maxPrice": 47600000,
    "officialSiteUrl": "https://www.kg-mobility.com",
    "officialImageUrl": "https://www.kg-mobility.com/attached/contents/display/mycar/UP5/20260123011349013_8cFfHT_MODEL_MAIN_UP5.png",
    "localMirrorUrl": "/images/cars/torres-evx.png",
    "sourceAttribution": "KG모빌리티 공식 홈페이지",
    "generation": {
      "nameKo": "1세대 EV (U100)",
      "codeName": "U100",
      "startYear": 2023
    },
    "spec": {
      "lengthMm": 4715,
      "widthMm": 1890,
      "heightMm": 1735,
      "wheelbaseMm": 2680,
      "curbWeightKg": 1940
    },
    "trims": [
      {
        "nameKo": "E5",
        "price": 45500000,
        "fuelType": "ELECTRIC",
        "transmission": "감속기",
        "electricEfficiencyCombined": 5.0,
        "maxPower": 207,
        "maxTorque": 34.6,
        "seatingCapacity": 5
      },
      {
        "nameKo": "E7",
        "price": 47600000,
        "fuelType": "ELECTRIC",
        "transmission": "감속기",
        "electricEfficiencyCombined": 5.0,
        "maxPower": 207,
        "maxTorque": 34.6,
        "seatingCapacity": 5
      }
    ]
  },
  {
    "brandSlug": "kgm",
    "nameKo": "더 뉴 티볼리",
    "nameEn": "The New Tivoli",
    "slug": "kgm-tivoli",
    "vehicleType": "SUV",
    "releaseYear": 2024,
    "minPrice": 18980000,
    "maxPrice": 26060000,
    "officialSiteUrl": "https://www.kg-mobility.com",
    "officialImageUrl": "https://www.kg-mobility.com/images/od/musso_2026.png",
    "localMirrorUrl": "/images/cars/tivoli.png",
    "sourceAttribution": "KG모빌리티 공식 홈페이지",
    "generation": {
      "nameKo": "1세대 2차 페이스리프트 (X150)",
      "codeName": "X150",
      "startYear": 2023
    },
    "spec": {
      "lengthMm": 4225,
      "widthMm": 1810,
      "heightMm": 1615,
      "wheelbaseMm": 2600,
      "curbWeightKg": 1310
    },
    "trims": [
      {
        "nameKo": "1.6 가솔린 V1",
        "price": 18980000,
        "fuelType": "GASOLINE",
        "engineDisplacement": 1597,
        "transmission": "6단 자동",
        "fuelEfficiencyCombined": 11.6,
        "maxPower": 126,
        "maxTorque": 16.0,
        "seatingCapacity": 5
      },
      {
        "nameKo": "1.5 터보 V7",
        "price": 26060000,
        "fuelType": "GASOLINE",
        "engineDisplacement": 1497,
        "transmission": "6단 자동",
        "fuelEfficiencyCombined": 11.8,
        "maxPower": 163,
        "maxTorque": 26.5,
        "seatingCapacity": 5
      }
    ]
  },
  {
    "brandSlug": "kgm",
    "nameKo": "코란도",
    "nameEn": "Korando",
    "slug": "kgm-korando",
    "vehicleType": "SUV",
    "releaseYear": 2024,
    "minPrice": 24190000,
    "maxPrice": 30500000,
    "officialSiteUrl": "https://www.kg-mobility.com",
    "officialImageUrl": "https://www.kg-mobility.com/attached/contents/display/mycar/UP5/20260123011349013_8cFfHT_MODEL_MAIN_UP5.png",
    "localMirrorUrl": "/images/cars/korando.png",
    "sourceAttribution": "KG모빌리티 공식 홈페이지",
    "generation": {
      "nameKo": "4세대 (C300)",
      "codeName": "C300",
      "startYear": 2019
    },
    "spec": {
      "lengthMm": 4450,
      "widthMm": 1870,
      "heightMm": 1630,
      "wheelbaseMm": 2675,
      "curbWeightKg": 1525
    },
    "trims": [
      {
        "nameKo": "1.5 가솔린 터보 C5",
        "price": 24190000,
        "fuelType": "GASOLINE",
        "engineDisplacement": 1497,
        "transmission": "6단 자동",
        "fuelEfficiencyCombined": 11.5,
        "maxPower": 170,
        "maxTorque": 28.6,
        "seatingCapacity": 5
      }
    ]
  },
  {
    "brandSlug": "kgm",
    "nameKo": "렉스턴 뉴 아레나",
    "nameEn": "Rexton New Arena",
    "slug": "kgm-rexton",
    "vehicleType": "SUV",
    "releaseYear": 2024,
    "minPrice": 40100000,
    "maxPrice": 52130000,
    "officialSiteUrl": "https://www.kg-mobility.com",
    "officialImageUrl": "https://www.kg-mobility.com/attached/contents/display/mycar/UH5/20260123011428259_VIqFJA_MODEL_MAIN_UH5.png",
    "localMirrorUrl": "/images/cars/rexton.png",
    "sourceAttribution": "KG모빌리티 공식 홈페이지",
    "generation": {
      "nameKo": "2세대 2차 페이스리프트 (Y450)",
      "codeName": "Y450",
      "startYear": 2023
    },
    "spec": {
      "lengthMm": 4850,
      "widthMm": 1960,
      "heightMm": 1825,
      "wheelbaseMm": 2865,
      "curbWeightKg": 2170
    },
    "trims": [
      {
        "nameKo": "2.2 디젤 프리미엄",
        "price": 40100000,
        "fuelType": "DIESEL",
        "engineDisplacement": 2157,
        "transmission": "8단 자동",
        "fuelEfficiencyCombined": 11.6,
        "maxPower": 202,
        "maxTorque": 45.0,
        "seatingCapacity": 5
      },
      {
        "nameKo": "2.2 디젤 더 블랙 4WD",
        "price": 52130000,
        "fuelType": "DIESEL",
        "engineDisplacement": 2157,
        "transmission": "8단 자동",
        "fuelEfficiencyCombined": 11.1,
        "maxPower": 202,
        "maxTorque": 45.0,
        "seatingCapacity": 5
      }
    ]
  },
  {
    "brandSlug": "kgm",
    "nameKo": "렉스턴 스포츠 & 칸",
    "nameEn": "Rexton Sports & Khan",
    "slug": "kgm-rexton-sports",
    "vehicleType": "TRUCK",
    "releaseYear": 2024,
    "minPrice": 29110000,
    "maxPrice": 44090000,
    "officialSiteUrl": "https://www.kg-mobility.com",
    "officialImageUrl": "https://www.kg-mobility.com/attached/contents/display/mycar/UH5/20260123011428259_VIqFJA_MODEL_MAIN_UH5.png",
    "localMirrorUrl": "/images/cars/rexton-sports.png",
    "sourceAttribution": "KG모빌리티 공식 홈페이지",
    "generation": {
      "nameKo": "쿨맨 (Q250)",
      "codeName": "Q250",
      "startYear": 2023
    },
    "spec": {
      "lengthMm": 5405,
      "widthMm": 1950,
      "heightMm": 1855,
      "wheelbaseMm": 3210,
      "curbWeightKg": 2180
    },
    "trims": [
      {
        "nameKo": "2.2 디젤 스포츠 와일드",
        "price": 29110000,
        "fuelType": "DIESEL",
        "engineDisplacement": 2157,
        "transmission": "6단 자동",
        "fuelEfficiencyCombined": 10.4,
        "maxPower": 202,
        "maxTorque": 45.0,
        "seatingCapacity": 5
      },
      {
        "nameKo": "2.2 디젤 칸 익스페디션 4WD",
        "price": 44090000,
        "fuelType": "DIESEL",
        "engineDisplacement": 2157,
        "transmission": "6단 자동",
        "fuelEfficiencyCombined": 10.2,
        "maxPower": 202,
        "maxTorque": 45.0,
        "seatingCapacity": 5
      }
    ]
  },
  {
    "brandSlug": "renault-korea",
    "nameKo": "그랑 콜레오스",
    "nameEn": "Grand Koleos",
    "slug": "renault-grand-koleos",
    "vehicleType": "SUV",
    "releaseYear": 2024,
    "minPrice": 34950000,
    "maxPrice": 43450000,
    "officialSiteUrl": "https://www.renault.co.kr",
    "officialImageUrl": "https://cdn.renault.co.kr/upload/asset/koleos/main_off.webp",
    "localMirrorUrl": "/images/cars/grand-koleos.webp",
    "sourceAttribution": "르노코리아 공식 홈페이지",
    "generation": {
      "nameKo": "1세대 (오로라1)",
      "codeName": "Aurora 1",
      "startYear": 2024
    },
    "spec": {
      "lengthMm": 4780,
      "widthMm": 1880,
      "heightMm": 1680,
      "wheelbaseMm": 2820,
      "curbWeightKg": 1650
    },
    "trims": [
      {
        "nameKo": "2.0 가솔린 터보 테크노",
        "price": 34950000,
        "fuelType": "GASOLINE",
        "engineDisplacement": 1998,
        "transmission": "7단 습식 DCT",
        "fuelEfficiencyCombined": 11.1,
        "maxPower": 211,
        "maxTorque": 33.1,
        "seatingCapacity": 5
      },
      {
        "nameKo": "E-Tech 하이브리드 아이코닉",
        "price": 41500000,
        "fuelType": "HYBRID",
        "engineDisplacement": 1499,
        "transmission": "멀티모드 변속기",
        "fuelEfficiencyCombined": 15.7,
        "maxPower": 245,
        "maxTorque": 32.6,
        "seatingCapacity": 5
      },
      {
        "nameKo": "E-Tech 하이브리드 에스프리 알핀",
        "price": 43450000,
        "fuelType": "HYBRID",
        "engineDisplacement": 1499,
        "transmission": "멀티모드 변속기",
        "fuelEfficiencyCombined": 15.7,
        "maxPower": 245,
        "maxTorque": 32.6,
        "seatingCapacity": 5
      }
    ]
  },
  {
    "brandSlug": "renault-korea",
    "nameKo": "아르카나",
    "nameEn": "Arkana",
    "slug": "renault-arkana",
    "vehicleType": "SUV",
    "releaseYear": 2024,
    "minPrice": 22850000,
    "maxPrice": 31990000,
    "officialSiteUrl": "https://www.renault.co.kr",
    "officialImageUrl": "https://cdn.renault.co.kr/ko/resource/img/main/img_arkana_pc_v2.webp",
    "localMirrorUrl": "/images/cars/arkana.webp",
    "sourceAttribution": "르노코리아 공식 홈페이지",
    "generation": {
      "nameKo": "1세대 페이스리프트",
      "codeName": "LJL PE",
      "startYear": 2024
    },
    "spec": {
      "lengthMm": 4570,
      "widthMm": 1820,
      "heightMm": 1570,
      "wheelbaseMm": 2720,
      "curbWeightKg": 1345
    },
    "trims": [
      {
        "nameKo": "1.6 GTe 에볼루션",
        "price": 22850000,
        "fuelType": "GASOLINE",
        "engineDisplacement": 1598,
        "transmission": "엑스트로닉 무단변속기",
        "fuelEfficiencyCombined": 13.6,
        "maxPower": 123,
        "maxTorque": 15.8,
        "seatingCapacity": 5
      },
      {
        "nameKo": "E-Tech 하이브리드 아이코닉",
        "price": 31990000,
        "fuelType": "HYBRID",
        "engineDisplacement": 1598,
        "transmission": "멀티모드 변속기",
        "fuelEfficiencyCombined": 17.4,
        "maxPower": 144,
        "maxTorque": 21.0,
        "seatingCapacity": 5
      }
    ]
  },
  {
    "brandSlug": "renault-korea",
    "nameKo": "QM6",
    "nameEn": "QM6",
    "slug": "renault-qm6",
    "vehicleType": "SUV",
    "releaseYear": 2024,
    "minPrice": 25650000,
    "maxPrice": 34800000,
    "officialSiteUrl": "https://www.renault.co.kr",
    "officialImageUrl": "https://cdn.renault.co.kr/upload/asset/xm3/main_off.webp",
    "localMirrorUrl": "/images/cars/qm6.webp",
    "sourceAttribution": "르노코리아 공식 홈페이지",
    "generation": {
      "nameKo": "1세대 3차 페이스리프트",
      "codeName": "HZG PE3",
      "startYear": 2023
    },
    "spec": {
      "lengthMm": 4675,
      "widthMm": 1845,
      "heightMm": 1670,
      "wheelbaseMm": 2705,
      "curbWeightKg": 1575
    },
    "trims": [
      {
        "nameKo": "2.0 LPe LE",
        "price": 25650000,
        "fuelType": "LPG",
        "engineDisplacement": 1998,
        "transmission": "엑스트로닉 무단변속기",
        "fuelEfficiencyCombined": 8.9,
        "maxPower": 140,
        "maxTorque": 19.7,
        "seatingCapacity": 5
      },
      {
        "nameKo": "2.0 GDe 프리미에르",
        "price": 34800000,
        "fuelType": "GASOLINE",
        "engineDisplacement": 1998,
        "transmission": "엑스트로닉 무단변속기",
        "fuelEfficiencyCombined": 12.0,
        "maxPower": 144,
        "maxTorque": 20.4,
        "seatingCapacity": 5
      }
    ]
  },
  {
    "brandSlug": "renault-korea",
    "nameKo": "SM6",
    "nameEn": "SM6",
    "slug": "renault-sm6",
    "vehicleType": "SEDAN",
    "releaseYear": 2024,
    "minPrice": 29250000,
    "maxPrice": 37200000,
    "officialSiteUrl": "https://www.renault.co.kr",
    "officialImageUrl": "https://cdn.renault.co.kr/upload/asset/filante/main_off.webp",
    "localMirrorUrl": "/images/cars/sm6.webp",
    "sourceAttribution": "르노코리아 공식 홈페이지",
    "generation": {
      "nameKo": "1세대 페이스리프트",
      "codeName": "LFD PE",
      "startYear": 2020
    },
    "spec": {
      "lengthMm": 4855,
      "widthMm": 1870,
      "heightMm": 1460,
      "wheelbaseMm": 2810,
      "curbWeightKg": 1475
    },
    "trims": [
      {
        "nameKo": "TCe 260 필",
        "price": 29250000,
        "fuelType": "GASOLINE",
        "engineDisplacement": 1332,
        "transmission": "7단 습식 DCT",
        "fuelEfficiencyCombined": 13.6,
        "maxPower": 156,
        "maxTorque": 26.5,
        "seatingCapacity": 5
      },
      {
        "nameKo": "TCe 300 프리미에르",
        "price": 37200000,
        "fuelType": "GASOLINE",
        "engineDisplacement": 1798,
        "transmission": "7단 습식 DCT",
        "fuelEfficiencyCombined": 11.8,
        "maxPower": 225,
        "maxTorque": 30.6,
        "seatingCapacity": 5
      }
    ]
  },
  {
    "brandSlug": "chevrolet",
    "nameKo": "트랙스 크로스오버",
    "nameEn": "Trax Crossover",
    "slug": "chevrolet-trax",
    "vehicleType": "SUV",
    "releaseYear": 2024,
    "minPrice": 21880000,
    "maxPrice": 28800000,
    "officialSiteUrl": "https://www.chevrolet.co.kr",
    "officialImageUrl": "https://www.chevrolet.co.kr/content/dam/chevrolet/as/kr/ko/primary-nav-icons/2025/01-image/trax-crossover-profile-bottom-left.jpg",
    "localMirrorUrl": "/images/cars/trax.jpg",
    "sourceAttribution": "쉐보레 공식 홈페이지",
    "generation": {
      "nameKo": "2세대 (9B)",
      "codeName": "9B",
      "startYear": 2023
    },
    "spec": {
      "lengthMm": 4540,
      "widthMm": 1825,
      "heightMm": 1560,
      "wheelbaseMm": 2700,
      "curbWeightKg": 1300
    },
    "trims": [
      {
        "nameKo": "1.2 가솔린 터보 LS",
        "price": 21880000,
        "fuelType": "GASOLINE",
        "engineDisplacement": 1199,
        "transmission": "6단 자동",
        "fuelEfficiencyCombined": 12.7,
        "maxPower": 139,
        "maxTorque": 22.4,
        "seatingCapacity": 5
      },
      {
        "nameKo": "1.2 가솔린 터보 RS",
        "price": 28800000,
        "fuelType": "GASOLINE",
        "engineDisplacement": 1199,
        "transmission": "6단 자동",
        "fuelEfficiencyCombined": 12.7,
        "maxPower": 139,
        "maxTorque": 22.4,
        "seatingCapacity": 5
      }
    ]
  },
  {
    "brandSlug": "chevrolet",
    "nameKo": "더 뉴 트레일블레이저",
    "nameEn": "The New Trailblazer",
    "slug": "chevrolet-trailblazer",
    "vehicleType": "SUV",
    "releaseYear": 2024,
    "minPrice": 27990000,
    "maxPrice": 33390000,
    "officialSiteUrl": "https://www.chevrolet.co.kr",
    "officialImageUrl": "https://www.chevrolet.co.kr/content/dam/chevrolet/as/kr/ko/index/primary-nav/01-images/trailblazer-profile-bottom-left.png",
    "localMirrorUrl": "/images/cars/trailblazer.png",
    "sourceAttribution": "쉐보레 공식 홈페이지",
    "generation": {
      "nameKo": "1세대 페이스리프트 (9B)",
      "codeName": "9B PE",
      "startYear": 2023
    },
    "spec": {
      "lengthMm": 4425,
      "widthMm": 1810,
      "heightMm": 1660,
      "wheelbaseMm": 2640,
      "curbWeightKg": 1370
    },
    "trims": [
      {
        "nameKo": "1.35 E-Turbo LT",
        "price": 27990000,
        "fuelType": "GASOLINE",
        "engineDisplacement": 1341,
        "transmission": "VT40 무단변속기",
        "fuelEfficiencyCombined": 12.9,
        "maxPower": 156,
        "maxTorque": 24.1,
        "seatingCapacity": 5
      },
      {
        "nameKo": "1.35 E-Turbo RS AWD",
        "price": 33390000,
        "fuelType": "GASOLINE",
        "engineDisplacement": 1341,
        "transmission": "9단 자동",
        "fuelEfficiencyCombined": 11.6,
        "maxPower": 156,
        "maxTorque": 24.1,
        "seatingCapacity": 5
      }
    ]
  },
  {
    "brandSlug": "chevrolet",
    "nameKo": "올 뉴 콜로라도",
    "nameEn": "All New Colorado",
    "slug": "chevrolet-colorado",
    "vehicleType": "TRUCK",
    "releaseYear": 2024,
    "minPrice": 72790000,
    "maxPrice": 72790000,
    "officialSiteUrl": "https://www.chevrolet.co.kr",
    "officialImageUrl": "https://www.chevrolet.co.kr/content/dam/chevrolet/as/kr/ko/primary-nav-icons/2025/01-image/trax-crossover-profile-bottom-left.jpg",
    "localMirrorUrl": "/images/cars/colorado.jpg",
    "sourceAttribution": "쉐보레 공식 홈페이지",
    "generation": {
      "nameKo": "3세대 (31XX-2)",
      "codeName": "31XX-2",
      "startYear": 2024
    },
    "spec": {
      "lengthMm": 5410,
      "widthMm": 1905,
      "heightMm": 1810,
      "wheelbaseMm": 3337,
      "curbWeightKg": 2150
    },
    "trims": [
      {
        "nameKo": "2.7 가솔린 터보 Z71 4WD",
        "price": 72790000,
        "fuelType": "GASOLINE",
        "engineDisplacement": 2726,
        "transmission": "8단 자동",
        "fuelEfficiencyCombined": 8.9,
        "maxPower": 314,
        "maxTorque": 54.0,
        "seatingCapacity": 5
      }
    ]
  },
  {
    "brandSlug": "chevrolet",
    "nameKo": "타호",
    "nameEn": "Tahoe",
    "slug": "chevrolet-tahoe",
    "vehicleType": "SUV",
    "releaseYear": 2024,
    "minPrice": 93900000,
    "maxPrice": 95000000,
    "officialSiteUrl": "https://www.chevrolet.co.kr",
    "officialImageUrl": "https://www.chevrolet.co.kr/content/dam/chevrolet/as/kr/ko/primary-nav-icons/2025/01-image/trax-crossover-profile-bottom-left.jpg",
    "localMirrorUrl": "/images/cars/tahoe.jpg",
    "sourceAttribution": "쉐보레 공식 홈페이지",
    "generation": {
      "nameKo": "5세대 (GMT T1XX)",
      "codeName": "T1XX",
      "startYear": 2022
    },
    "spec": {
      "lengthMm": 5350,
      "widthMm": 2060,
      "heightMm": 1925,
      "wheelbaseMm": 3071,
      "curbWeightKg": 2615
    },
    "trims": [
      {
        "nameKo": "6.2 가솔린 하이컨트리",
        "price": 93900000,
        "fuelType": "GASOLINE",
        "engineDisplacement": 6162,
        "transmission": "10단 자동",
        "fuelEfficiencyCombined": 6.4,
        "maxPower": 426,
        "maxTorque": 63.6,
        "seatingCapacity": 7
      },
      {
        "nameKo": "6.2 다크나이트 스페셜 에디션",
        "price": 95000000,
        "fuelType": "GASOLINE",
        "engineDisplacement": 6162,
        "transmission": "10단 자동",
        "fuelEfficiencyCombined": 6.4,
        "maxPower": 426,
        "maxTorque": 63.6,
        "seatingCapacity": 7
      }
    ]
  },
  {
    "brandSlug": "chevrolet",
    "nameKo": "트래버스",
    "nameEn": "Traverse",
    "slug": "chevrolet-traverse",
    "vehicleType": "SUV",
    "releaseYear": 2024,
    "minPrice": 56400000,
    "maxPrice": 66150000,
    "officialSiteUrl": "https://www.chevrolet.co.kr",
    "officialImageUrl": "https://www.chevrolet.co.kr/content/dam/chevrolet/as/kr/ko/primary-nav-icons/2025/01-image/trax-crossover-profile-bottom-left.jpg",
    "localMirrorUrl": "/images/cars/traverse.jpg",
    "sourceAttribution": "쉐보레 공식 홈페이지",
    "generation": {
      "nameKo": "2세대 페이스리프트 (C1XX)",
      "codeName": "C1XX PE",
      "startYear": 2022
    },
    "spec": {
      "lengthMm": 5230,
      "widthMm": 2000,
      "heightMm": 1780,
      "wheelbaseMm": 3073,
      "curbWeightKg": 2090
    },
    "trims": [
      {
        "nameKo": "3.6 가솔린 LT 레더 프리미엄",
        "price": 56400000,
        "fuelType": "GASOLINE",
        "engineDisplacement": 3564,
        "transmission": "9단 자동",
        "fuelEfficiencyCombined": 8.3,
        "maxPower": 314,
        "maxTorque": 36.8,
        "seatingCapacity": 7
      },
      {
        "nameKo": "3.6 가솔린 하이컨트리 AWD",
        "price": 66150000,
        "fuelType": "GASOLINE",
        "engineDisplacement": 3564,
        "transmission": "9단 자동",
        "fuelEfficiencyCombined": 8.3,
        "maxPower": 314,
        "maxTorque": 36.8,
        "seatingCapacity": 7
      }
    ]
  },
  {
    "brandSlug": "mercedes-benz",
    "nameKo": "C-클래스",
    "nameEn": "C-Class",
    "slug": "benz-c-class",
    "vehicleType": "SEDAN",
    "releaseYear": 2024,
    "minPrice": 68800000,
    "maxPrice": 76000000,
    "officialSiteUrl": "https://www.mercedes-benz.co.kr/passengercars/models/saloon/c-class/overview.html",
    "officialImageUrl": "https://media.oneweb.mercedes-benz.com/images/dynamic/asia/KR/206050/806/iris.png",
    "localMirrorUrl": "/images/cars/c-class.png",
    "sourceAttribution": "메르세데스-벤츠 코리아 공식 홈페이지",
    "generation": {
      "nameKo": "6세대 (W206)",
      "codeName": "W206",
      "startYear": 2022
    },
    "spec": {
      "lengthMm": 4755,
      "widthMm": 1820,
      "heightMm": 1440,
      "wheelbaseMm": 2865,
      "curbWeightKg": 1690
    },
    "trims": [
      {
        "nameKo": "C 200 아방가르드",
        "price": 68800000,
        "fuelType": "GASOLINE",
        "engineDisplacement": 1999,
        "transmission": "9단 자동",
        "fuelEfficiencyCombined": 11.8,
        "maxPower": 204,
        "maxTorque": 32.6,
        "seatingCapacity": 5
      },
      {
        "nameKo": "C 300 4MATIC AMG Line",
        "price": 76000000,
        "fuelType": "GASOLINE",
        "engineDisplacement": 1999,
        "transmission": "9단 자동",
        "fuelEfficiencyCombined": 11.2,
        "maxPower": 258,
        "maxTorque": 40.8,
        "seatingCapacity": 5
      }
    ]
  },
  {
    "brandSlug": "mercedes-benz",
    "nameKo": "E-클래스",
    "nameEn": "E-Class",
    "slug": "benz-e-class",
    "vehicleType": "SEDAN",
    "releaseYear": 2024,
    "minPrice": 73900000,
    "maxPrice": 123000000,
    "officialSiteUrl": "https://www.mercedes-benz.co.kr/passengercars/models/saloon/e-class/overview.html",
    "officialImageUrl": "https://media.oneweb.mercedes-benz.com/images/dynamic/asia/KR/214061/806_056/iris.png",
    "localMirrorUrl": "/images/cars/e-class.png",
    "sourceAttribution": "메르세데스-벤츠 코리아 공식 홈페이지",
    "generation": {
      "nameKo": "11세대 (W214)",
      "codeName": "W214",
      "startYear": 2024
    },
    "spec": {
      "lengthMm": 4955,
      "widthMm": 1880,
      "heightMm": 1475,
      "wheelbaseMm": 2960,
      "curbWeightKg": 1825
    },
    "trims": [
      {
        "nameKo": "E 200 아방가르드",
        "price": 73900000,
        "fuelType": "GASOLINE",
        "engineDisplacement": 1999,
        "transmission": "9단 자동",
        "fuelEfficiencyCombined": 12.4,
        "maxPower": 204,
        "maxTorque": 32.6,
        "seatingCapacity": 5
      },
      {
        "nameKo": "E 220 d 4MATIC 익스클루시브",
        "price": 82900000,
        "fuelType": "DIESEL",
        "engineDisplacement": 1993,
        "transmission": "9단 자동",
        "fuelEfficiencyCombined": 15.4,
        "maxPower": 197,
        "maxTorque": 44.9,
        "seatingCapacity": 5
      },
      {
        "nameKo": "E 300 4MATIC AMG Line",
        "price": 93900000,
        "fuelType": "GASOLINE",
        "engineDisplacement": 1999,
        "transmission": "9단 자동",
        "fuelEfficiencyCombined": 11.6,
        "maxPower": 258,
        "maxTorque": 40.8,
        "seatingCapacity": 5
      },
      {
        "nameKo": "E 450 4MATIC 익스클루시브",
        "price": 123000000,
        "fuelType": "GASOLINE",
        "engineDisplacement": 2999,
        "transmission": "9단 자동",
        "fuelEfficiencyCombined": 10.5,
        "maxPower": 381,
        "maxTorque": 51.0,
        "seatingCapacity": 5
      }
    ]
  },
  {
    "brandSlug": "mercedes-benz",
    "nameKo": "S-클래스",
    "nameEn": "S-Class",
    "slug": "benz-s-class",
    "vehicleType": "SEDAN",
    "releaseYear": 2024,
    "minPrice": 159500000,
    "maxPrice": 243500000,
    "officialSiteUrl": "https://www.mercedes-benz.co.kr/passengercars/models/saloon/s-class/overview.html",
    "officialImageUrl": "https://media.oneweb.mercedes-benz.com/images/dynamic/asia/KR/223065/807/iris.png",
    "localMirrorUrl": "/images/cars/s-class.png",
    "sourceAttribution": "메르세데스-벤츠 코리아 공식 홈페이지",
    "generation": {
      "nameKo": "7세대 (W223)",
      "codeName": "W223",
      "startYear": 2021
    },
    "spec": {
      "lengthMm": 5290,
      "widthMm": 1920,
      "heightMm": 1505,
      "wheelbaseMm": 3216,
      "curbWeightKg": 2180
    },
    "trims": [
      {
        "nameKo": "S 450 d 4MATIC",
        "price": 159500000,
        "fuelType": "DIESEL",
        "engineDisplacement": 2989,
        "transmission": "9단 자동",
        "fuelEfficiencyCombined": 12.0,
        "maxPower": 367,
        "maxTorque": 76.5,
        "seatingCapacity": 5
      },
      {
        "nameKo": "S 500 4MATIC",
        "price": 203700000,
        "fuelType": "GASOLINE",
        "engineDisplacement": 2999,
        "transmission": "9단 자동",
        "fuelEfficiencyCombined": 9.5,
        "maxPower": 435,
        "maxTorque": 53.0,
        "seatingCapacity": 5
      },
      {
        "nameKo": "S 580 4MATIC",
        "price": 243500000,
        "fuelType": "GASOLINE",
        "engineDisplacement": 3982,
        "transmission": "9단 자동",
        "fuelEfficiencyCombined": 7.9,
        "maxPower": 503,
        "maxTorque": 71.4,
        "seatingCapacity": 5
      }
    ]
  },
  {
    "brandSlug": "mercedes-benz",
    "nameKo": "CLE 쿠페",
    "nameEn": "CLE Coupe",
    "slug": "benz-cle-coupe",
    "vehicleType": "COUPE",
    "releaseYear": 2024,
    "minPrice": 72700000,
    "maxPrice": 99400000,
    "officialSiteUrl": "https://www.mercedes-benz.co.kr/passengercars/models/coupe/cle/overview.html",
    "officialImageUrl": "https://media.oneweb.mercedes-benz.com/images/dynamic/asia/KR/295121/806/iris.png",
    "localMirrorUrl": "/images/cars/cle-coupe.png",
    "sourceAttribution": "메르세데스-벤츠 코리아 공식 홈페이지",
    "generation": {
      "nameKo": "1세대 (C236)",
      "codeName": "C236",
      "startYear": 2024
    },
    "spec": {
      "lengthMm": 4850,
      "widthMm": 1860,
      "heightMm": 1420,
      "wheelbaseMm": 2865,
      "curbWeightKg": 1800
    },
    "trims": [
      {
        "nameKo": "CLE 200 쿠페",
        "price": 72700000,
        "fuelType": "GASOLINE",
        "engineDisplacement": 1999,
        "transmission": "9단 자동",
        "fuelEfficiencyCombined": 12.1,
        "maxPower": 204,
        "maxTorque": 32.6,
        "seatingCapacity": 4
      },
      {
        "nameKo": "CLE 450 4MATIC 쿠페",
        "price": 99400000,
        "fuelType": "GASOLINE",
        "engineDisplacement": 2999,
        "transmission": "9단 자동",
        "fuelEfficiencyCombined": 10.9,
        "maxPower": 381,
        "maxTorque": 51.0,
        "seatingCapacity": 4
      }
    ]
  },
  {
    "brandSlug": "mercedes-benz",
    "nameKo": "GLA",
    "nameEn": "GLA",
    "slug": "benz-gla",
    "vehicleType": "SUV",
    "releaseYear": 2024,
    "minPrice": 67900000,
    "maxPrice": 76100000,
    "officialSiteUrl": "https://www.mercedes-benz.co.kr/passengercars/models/suv/gla/overview.html",
    "officialImageUrl": "https://media.oneweb.mercedes-benz.com/images/dynamic/asia/KR/247747/806_056/iris.png",
    "localMirrorUrl": "/images/cars/gla.png",
    "sourceAttribution": "메르세데스-벤츠 코리아 공식 홈페이지",
    "generation": {
      "nameKo": "2세대 페이스리프트 (H247)",
      "codeName": "H247 PE",
      "startYear": 2023
    },
    "spec": {
      "lengthMm": 4445,
      "widthMm": 1850,
      "heightMm": 1615,
      "wheelbaseMm": 2730,
      "curbWeightKg": 1630
    },
    "trims": [
      {
        "nameKo": "GLA 250 4MATIC",
        "price": 67900000,
        "fuelType": "GASOLINE",
        "engineDisplacement": 1991,
        "transmission": "8단 습식 DCT",
        "fuelEfficiencyCombined": 10.6,
        "maxPower": 224,
        "maxTorque": 35.7,
        "seatingCapacity": 5
      }
    ]
  },
  {
    "brandSlug": "mercedes-benz",
    "nameKo": "GLB",
    "nameEn": "GLB",
    "slug": "benz-glb",
    "vehicleType": "SUV",
    "releaseYear": 2024,
    "minPrice": 62100000,
    "maxPrice": 69800000,
    "officialSiteUrl": "https://www.mercedes-benz.co.kr/passengercars/models/suv/glb/overview.html",
    "officialImageUrl": "https://media.oneweb.mercedes-benz.com/images/dynamic/asia/KR/247647/806/iris.png",
    "localMirrorUrl": "/images/cars/glb.png",
    "sourceAttribution": "메르세데스-벤츠 코리아 공식 홈페이지",
    "generation": {
      "nameKo": "1세대 페이스리프트 (X247)",
      "codeName": "X247 PE",
      "startYear": 2023
    },
    "spec": {
      "lengthMm": 4640,
      "widthMm": 1835,
      "heightMm": 1690,
      "wheelbaseMm": 2830,
      "curbWeightKg": 1720
    },
    "trims": [
      {
        "nameKo": "GLB 200 d",
        "price": 62100000,
        "fuelType": "DIESEL",
        "engineDisplacement": 1950,
        "transmission": "8단 DCT",
        "fuelEfficiencyCombined": 14.2,
        "maxPower": 150,
        "maxTorque": 32.6,
        "seatingCapacity": 7
      },
      {
        "nameKo": "GLB 250 4MATIC",
        "price": 69800000,
        "fuelType": "GASOLINE",
        "engineDisplacement": 1991,
        "transmission": "8단 DCT",
        "fuelEfficiencyCombined": 10.5,
        "maxPower": 224,
        "maxTorque": 35.7,
        "seatingCapacity": 7
      }
    ]
  },
  {
    "brandSlug": "mercedes-benz",
    "nameKo": "GLC",
    "nameEn": "GLC",
    "slug": "benz-glc",
    "vehicleType": "SUV",
    "releaseYear": 2024,
    "minPrice": 77900000,
    "maxPrice": 92100000,
    "officialSiteUrl": "https://www.mercedes-benz.co.kr/passengercars/models/suv/glc/overview.html",
    "officialImageUrl": "https://media.oneweb.mercedes-benz.com/images/dynamic/asia/KR/294622/806/iris.png",
    "localMirrorUrl": "/images/cars/glc.png",
    "sourceAttribution": "메르세데스-벤츠 코리아 공식 홈페이지",
    "generation": {
      "nameKo": "2세대 (X254)",
      "codeName": "X254",
      "startYear": 2023
    },
    "spec": {
      "lengthMm": 4720,
      "widthMm": 1890,
      "heightMm": 1645,
      "wheelbaseMm": 2890,
      "curbWeightKg": 1950
    },
    "trims": [
      {
        "nameKo": "GLC 220 d 4MATIC",
        "price": 77900000,
        "fuelType": "DIESEL",
        "engineDisplacement": 1993,
        "transmission": "9단 자동",
        "fuelEfficiencyCombined": 14.1,
        "maxPower": 197,
        "maxTorque": 44.9,
        "seatingCapacity": 5
      },
      {
        "nameKo": "GLC 300 4MATIC",
        "price": 92100000,
        "fuelType": "GASOLINE",
        "engineDisplacement": 1999,
        "transmission": "9단 자동",
        "fuelEfficiencyCombined": 10.8,
        "maxPower": 258,
        "maxTorque": 40.8,
        "seatingCapacity": 5
      }
    ]
  },
  {
    "brandSlug": "mercedes-benz",
    "nameKo": "GLE",
    "nameEn": "GLE",
    "slug": "benz-gle",
    "vehicleType": "SUV",
    "releaseYear": 2024,
    "minPrice": 114000000,
    "maxPrice": 160600000,
    "officialSiteUrl": "https://www.mercedes-benz.co.kr/passengercars/models/suv/gle/overview.html",
    "officialImageUrl": "https://media.oneweb.mercedes-benz.com/images/dynamic/asia/KR/296644/806_056/iris.png",
    "localMirrorUrl": "/images/cars/gle.png",
    "sourceAttribution": "메르세데스-벤츠 코리아 공식 홈페이지",
    "generation": {
      "nameKo": "4세대 페이스리프트 (V167)",
      "codeName": "V167 PE",
      "startYear": 2023
    },
    "spec": {
      "lengthMm": 4925,
      "widthMm": 2015,
      "heightMm": 1795,
      "wheelbaseMm": 2995,
      "curbWeightKg": 2360
    },
    "trims": [
      {
        "nameKo": "GLE 300 d 4MATIC",
        "price": 114000000,
        "fuelType": "DIESEL",
        "engineDisplacement": 1993,
        "transmission": "9단 자동",
        "fuelEfficiencyCombined": 11.9,
        "maxPower": 269,
        "maxTorque": 56.1,
        "seatingCapacity": 5
      },
      {
        "nameKo": "GLE 450 4MATIC",
        "price": 134300000,
        "fuelType": "GASOLINE",
        "engineDisplacement": 2999,
        "transmission": "9단 자동",
        "fuelEfficiencyCombined": 8.5,
        "maxPower": 381,
        "maxTorque": 51.0,
        "seatingCapacity": 7
      }
    ]
  },
  {
    "brandSlug": "mercedes-benz",
    "nameKo": "GLS",
    "nameEn": "GLS",
    "slug": "benz-gls",
    "vehicleType": "SUV",
    "releaseYear": 2024,
    "minPrice": 161600000,
    "maxPrice": 181500000,
    "officialSiteUrl": "https://www.mercedes-benz.co.kr/passengercars/models/suv/gls/overview.html",
    "officialImageUrl": "https://media.oneweb.mercedes-benz.com/images/dynamic/asia/KR/296955/806_056/iris.png",
    "localMirrorUrl": "/images/cars/gls.png",
    "sourceAttribution": "메르세데스-벤츠 코리아 공식 홈페이지",
    "generation": {
      "nameKo": "3세대 페이스리프트 (X167)",
      "codeName": "X167 PE",
      "startYear": 2023
    },
    "spec": {
      "lengthMm": 5210,
      "widthMm": 2030,
      "heightMm": 1825,
      "wheelbaseMm": 3135,
      "curbWeightKg": 2640
    },
    "trims": [
      {
        "nameKo": "GLS 450 d 4MATIC",
        "price": 161600000,
        "fuelType": "DIESEL",
        "engineDisplacement": 2989,
        "transmission": "9단 자동",
        "fuelEfficiencyCombined": 10.4,
        "maxPower": 367,
        "maxTorque": 76.5,
        "seatingCapacity": 7
      },
      {
        "nameKo": "GLS 580 4MATIC",
        "price": 181500000,
        "fuelType": "GASOLINE",
        "engineDisplacement": 3982,
        "transmission": "9단 자동",
        "fuelEfficiencyCombined": 7.3,
        "maxPower": 517,
        "maxTorque": 74.4,
        "seatingCapacity": 7
      }
    ]
  },
  {
    "brandSlug": "mercedes-benz",
    "nameKo": "G-클래스",
    "nameEn": "G-Class",
    "slug": "benz-g-class",
    "vehicleType": "SUV",
    "releaseYear": 2024,
    "minPrice": 181000000,
    "maxPrice": 268200000,
    "officialSiteUrl": "https://www.mercedes-benz.co.kr/passengercars/models/suv/g-class/overview.html",
    "officialImageUrl": "https://media.oneweb.mercedes-benz.com/images/dynamic/asia/KR/178346/807/iris.png",
    "localMirrorUrl": "/images/cars/g-class.png",
    "sourceAttribution": "메르세데스-벤츠 코리아 공식 홈페이지",
    "generation": {
      "nameKo": "3세대 페이스리프트 (W465)",
      "codeName": "W465",
      "startYear": 2024
    },
    "spec": {
      "lengthMm": 4875,
      "widthMm": 1985,
      "heightMm": 1975,
      "wheelbaseMm": 2890,
      "curbWeightKg": 2570
    },
    "trims": [
      {
        "nameKo": "G 450 d",
        "price": 181000000,
        "fuelType": "DIESEL",
        "engineDisplacement": 2989,
        "transmission": "9단 자동",
        "fuelEfficiencyCombined": 10.0,
        "maxPower": 367,
        "maxTorque": 76.5,
        "seatingCapacity": 5
      },
      {
        "nameKo": "Mercedes-AMG G 63",
        "price": 268200000,
        "fuelType": "GASOLINE",
        "engineDisplacement": 3982,
        "transmission": "9단 자동",
        "fuelEfficiencyCombined": 5.9,
        "maxPower": 585,
        "maxTorque": 86.7,
        "seatingCapacity": 5
      }
    ]
  },
  {
    "brandSlug": "mercedes-benz",
    "nameKo": "EQE",
    "nameEn": "EQE",
    "slug": "benz-eqe",
    "vehicleType": "SEDAN",
    "releaseYear": 2024,
    "minPrice": 103500000,
    "maxPrice": 130500000,
    "officialSiteUrl": "https://www.mercedes-benz.co.kr/passengercars/models/saloon/eqe/overview.html",
    "officialImageUrl": "https://media.oneweb.mercedes-benz.com/images/dynamic/asia/KR/295121/806/iris.png",
    "localMirrorUrl": "/images/cars/eqe.png",
    "sourceAttribution": "메르세데스-벤츠 코리아 공식 홈페이지",
    "generation": {
      "nameKo": "1세대 (V295)",
      "codeName": "V295",
      "startYear": 2022
    },
    "spec": {
      "lengthMm": 4965,
      "widthMm": 1905,
      "heightMm": 1510,
      "wheelbaseMm": 3120,
      "curbWeightKg": 2355
    },
    "trims": [
      {
        "nameKo": "EQE 350+",
        "price": 103500000,
        "fuelType": "ELECTRIC",
        "transmission": "감속기",
        "electricEfficiencyCombined": 4.3,
        "maxPower": 292,
        "maxTorque": 57.6,
        "seatingCapacity": 5
      },
      {
        "nameKo": "EQE 350 4MATIC",
        "price": 109900000,
        "fuelType": "ELECTRIC",
        "transmission": "감속기",
        "electricEfficiencyCombined": 4.1,
        "maxPower": 292,
        "maxTorque": 78.0,
        "seatingCapacity": 5
      }
    ]
  },
  {
    "brandSlug": "mercedes-benz",
    "nameKo": "EQS",
    "nameEn": "EQS",
    "slug": "benz-eqs",
    "vehicleType": "SEDAN",
    "releaseYear": 2024,
    "minPrice": 163900000,
    "maxPrice": 190000000,
    "officialSiteUrl": "https://www.mercedes-benz.co.kr/passengercars/models/saloon/eqs/overview.html",
    "officialImageUrl": "https://media.oneweb.mercedes-benz.com/images/dynamic/asia/KR/295121/806/iris.png",
    "localMirrorUrl": "/images/cars/eqs.png",
    "sourceAttribution": "메르세데스-벤츠 코리아 공식 홈페이지",
    "generation": {
      "nameKo": "1세대 (V297)",
      "codeName": "V297",
      "startYear": 2021
    },
    "spec": {
      "lengthMm": 5225,
      "widthMm": 1925,
      "heightMm": 1520,
      "wheelbaseMm": 3210,
      "curbWeightKg": 2590
    },
    "trims": [
      {
        "nameKo": "EQS 450+ AMG Line",
        "price": 163900000,
        "fuelType": "ELECTRIC",
        "transmission": "감속기",
        "electricEfficiencyCombined": 3.8,
        "maxPower": 333,
        "maxTorque": 57.9,
        "seatingCapacity": 5
      },
      {
        "nameKo": "EQS 450 4MATIC",
        "price": 190000000,
        "fuelType": "ELECTRIC",
        "transmission": "감속기",
        "electricEfficiencyCombined": 3.6,
        "maxPower": 360,
        "maxTorque": 81.6,
        "seatingCapacity": 5
      }
    ]
  },
  {
    "brandSlug": "bmw",
    "nameKo": "뉴 3시리즈",
    "nameEn": "New 3 Series",
    "slug": "bmw-3-series",
    "vehicleType": "SEDAN",
    "releaseYear": 2024,
    "minPrice": 57600000,
    "maxPrice": 84900000,
    "officialSiteUrl": "https://www.bmw.co.kr/ko/all-models/3-series/sedan/2022/bmw-3-series-sedan-overview.html",
    "officialImageUrl": "https://bmw.scene7.com/is/image/BMW/BMW-MY27-5Series-DI23_000129383-retouched?wid=1280",
    "localMirrorUrl": "/images/cars/3-series.jpg",
    "sourceAttribution": "BMW 코리아 공식 홈페이지",
    "generation": {
      "nameKo": "7세대 2차 페이스리프트 (G20)",
      "codeName": "G20 LCI 2",
      "startYear": 2024
    },
    "spec": {
      "lengthMm": 4715,
      "widthMm": 1825,
      "heightMm": 1440,
      "wheelbaseMm": 2850,
      "curbWeightKg": 1625
    },
    "trims": [
      {
        "nameKo": "320i",
        "price": 57600000,
        "fuelType": "GASOLINE",
        "engineDisplacement": 1998,
        "transmission": "8단 스텝트로닉",
        "fuelEfficiencyCombined": 11.2,
        "maxPower": 184,
        "maxTorque": 30.6,
        "seatingCapacity": 5
      },
      {
        "nameKo": "M340i xDrive",
        "price": 84900000,
        "fuelType": "GASOLINE",
        "engineDisplacement": 2998,
        "transmission": "8단 스텝트로닉",
        "fuelEfficiencyCombined": 10.4,
        "maxPower": 392,
        "maxTorque": 55.1,
        "seatingCapacity": 5
      }
    ]
  },
  {
    "brandSlug": "bmw",
    "nameKo": "뉴 5시리즈",
    "nameEn": "New 5 Series",
    "slug": "bmw-5-series",
    "vehicleType": "SEDAN",
    "releaseYear": 2024,
    "minPrice": 68800000,
    "maxPrice": 103800000,
    "officialSiteUrl": "https://www.bmw.co.kr/ko/all-models/5-series/sedan/2023/bmw-5-series-sedan-overview.html",
    "officialImageUrl": "https://bmw.scene7.com/is/image/BMW/BMW-MY27-5Series-DI23_000129383-retouched?wid=1280",
    "localMirrorUrl": "/images/cars/bmw-5-series.jpg",
    "sourceAttribution": "BMW 코리아 공식 홈페이지",
    "generation": {
      "nameKo": "8세대 (G60)",
      "codeName": "G60",
      "startYear": 2023
    },
    "spec": {
      "lengthMm": 5060,
      "widthMm": 1900,
      "heightMm": 1515,
      "wheelbaseMm": 2995,
      "curbWeightKg": 1830
    },
    "trims": [
      {
        "nameKo": "520i",
        "price": 68800000,
        "fuelType": "GASOLINE",
        "engineDisplacement": 1998,
        "transmission": "8단 스텝트로닉",
        "fuelEfficiencyCombined": 12.1,
        "maxPower": 190,
        "maxTorque": 31.6,
        "seatingCapacity": 5
      },
      {
        "nameKo": "523d xDrive",
        "price": 79800000,
        "fuelType": "DIESEL",
        "engineDisplacement": 1995,
        "transmission": "8단 스텝트로닉",
        "fuelEfficiencyCombined": 14.7,
        "maxPower": 197,
        "maxTorque": 40.8,
        "seatingCapacity": 5
      },
      {
        "nameKo": "530i xDrive M Sport",
        "price": 88700000,
        "fuelType": "GASOLINE",
        "engineDisplacement": 1998,
        "transmission": "8단 스텝트로닉",
        "fuelEfficiencyCombined": 11.1,
        "maxPower": 258,
        "maxTorque": 40.8,
        "seatingCapacity": 5
      }
    ]
  },
  {
    "brandSlug": "bmw",
    "nameKo": "뉴 7시리즈",
    "nameEn": "New 7 Series",
    "slug": "bmw-7-series",
    "vehicleType": "SEDAN",
    "releaseYear": 2024,
    "minPrice": 159500000,
    "maxPrice": 243000000,
    "officialSiteUrl": "https://www.bmw.co.kr/ko/all-models/7-series/sedan/2022/bmw-7-series-sedan-overview.html",
    "officialImageUrl": "https://bmw.scene7.com/is/image/BMW/BMW-MY27-5Series-DI23_000129383-retouched?wid=1280",
    "localMirrorUrl": "/images/cars/7-series.jpg",
    "sourceAttribution": "BMW 코리아 공식 홈페이지",
    "generation": {
      "nameKo": "7세대 (G70)",
      "codeName": "G70",
      "startYear": 2022
    },
    "spec": {
      "lengthMm": 5390,
      "widthMm": 1950,
      "heightMm": 1545,
      "wheelbaseMm": 3215,
      "curbWeightKg": 2205
    },
    "trims": [
      {
        "nameKo": "740i sDrive M Sport",
        "price": 174900000,
        "fuelType": "GASOLINE",
        "engineDisplacement": 2998,
        "transmission": "8단 스텝트로닉",
        "fuelEfficiencyCombined": 10.7,
        "maxPower": 381,
        "maxTorque": 55.1,
        "seatingCapacity": 5
      },
      {
        "nameKo": "750e xDrive M Sport",
        "price": 202800000,
        "fuelType": "HYBRID",
        "engineDisplacement": 2998,
        "transmission": "8단 스텝트로닉",
        "fuelEfficiencyCombined": 15.0,
        "maxPower": 489,
        "maxTorque": 71.4,
        "seatingCapacity": 5
      }
    ]
  },
  {
    "brandSlug": "bmw",
    "nameKo": "뉴 X1",
    "nameEn": "New X1",
    "slug": "bmw-x1",
    "vehicleType": "SUV",
    "releaseYear": 2024,
    "minPrice": 58700000,
    "maxPrice": 67800000,
    "officialSiteUrl": "https://www.bmw.co.kr/ko/all-models/x-series/x1/2022/bmw-x1-overview.html",
    "officialImageUrl": "https://bmw.scene7.com/is/image/BMW/BMW-MY27-5Series-DI23_000129383-retouched?wid=1280",
    "localMirrorUrl": "/images/cars/x1.jpg",
    "sourceAttribution": "BMW 코리아 공식 홈페이지",
    "generation": {
      "nameKo": "3세대 (U11)",
      "codeName": "U11",
      "startYear": 2023
    },
    "spec": {
      "lengthMm": 4500,
      "widthMm": 1835,
      "heightMm": 1640,
      "wheelbaseMm": 2690,
      "curbWeightKg": 1625
    },
    "trims": [
      {
        "nameKo": "sDrive20i xLine",
        "price": 58700000,
        "fuelType": "GASOLINE",
        "engineDisplacement": 1998,
        "transmission": "7단 듀얼클러치",
        "fuelEfficiencyCombined": 11.7,
        "maxPower": 204,
        "maxTorque": 30.6,
        "seatingCapacity": 5
      },
      {
        "nameKo": "sDrive20i M Sport",
        "price": 63400000,
        "fuelType": "GASOLINE",
        "engineDisplacement": 1998,
        "transmission": "7단 듀얼클러치",
        "fuelEfficiencyCombined": 11.7,
        "maxPower": 204,
        "maxTorque": 30.6,
        "seatingCapacity": 5
      }
    ]
  },
  {
    "brandSlug": "bmw",
    "nameKo": "올 뉴 X3",
    "nameEn": "All New X3",
    "slug": "bmw-x3",
    "vehicleType": "SUV",
    "releaseYear": 2024,
    "minPrice": 68200000,
    "maxPrice": 98500000,
    "officialSiteUrl": "https://www.bmw.co.kr/ko/all-models/x-series/x3/2024/bmw-x3-overview.html",
    "officialImageUrl": "https://bmw.scene7.com/is/image/BMW/BMW-MY27-5Series-DI23_000129383-retouched?wid=1280",
    "localMirrorUrl": "/images/cars/x3.jpg",
    "sourceAttribution": "BMW 코리아 공식 홈페이지",
    "generation": {
      "nameKo": "4세대 (G45)",
      "codeName": "G45",
      "startYear": 2024
    },
    "spec": {
      "lengthMm": 4755,
      "widthMm": 1920,
      "heightMm": 1660,
      "wheelbaseMm": 2865,
      "curbWeightKg": 1930
    },
    "trims": [
      {
        "nameKo": "20 xDrive M Sport",
        "price": 68200000,
        "fuelType": "GASOLINE",
        "engineDisplacement": 1998,
        "transmission": "8단 스텝트로닉",
        "fuelEfficiencyCombined": 11.1,
        "maxPower": 190,
        "maxTorque": 31.6,
        "seatingCapacity": 5
      },
      {
        "nameKo": "M50 xDrive",
        "price": 98500000,
        "fuelType": "GASOLINE",
        "engineDisplacement": 2998,
        "transmission": "8단 스텝트로닉",
        "fuelEfficiencyCombined": 9.8,
        "maxPower": 398,
        "maxTorque": 59.1,
        "seatingCapacity": 5
      }
    ]
  },
  {
    "brandSlug": "bmw",
    "nameKo": "뉴 X4",
    "nameEn": "New X4",
    "slug": "bmw-x4",
    "vehicleType": "SUV",
    "releaseYear": 2024,
    "minPrice": 72100000,
    "maxPrice": 98200000,
    "officialSiteUrl": "https://www.bmw.co.kr/ko/all-models/x-series/x4/2021/bmw-x4-overview.html",
    "officialImageUrl": "https://bmw.scene7.com/is/image/BMW/BMW-MY27-5Series-DI23_000129383-retouched?wid=1280",
    "localMirrorUrl": "/images/cars/x4.jpg",
    "sourceAttribution": "BMW 코리아 공식 홈페이지",
    "generation": {
      "nameKo": "2세대 페이스리프트 (G02)",
      "codeName": "G02 LCI",
      "startYear": 2021
    },
    "spec": {
      "lengthMm": 4750,
      "widthMm": 1920,
      "heightMm": 1620,
      "wheelbaseMm": 2865,
      "curbWeightKg": 1895
    },
    "trims": [
      {
        "nameKo": "xDrive20i xLine",
        "price": 72100000,
        "fuelType": "GASOLINE",
        "engineDisplacement": 1998,
        "transmission": "8단 스텝트로닉",
        "fuelEfficiencyCombined": 9.9,
        "maxPower": 184,
        "maxTorque": 29.6,
        "seatingCapacity": 5
      }
    ]
  },
  {
    "brandSlug": "bmw",
    "nameKo": "뉴 X5",
    "nameEn": "New X5",
    "slug": "bmw-x5",
    "vehicleType": "SUV",
    "releaseYear": 2024,
    "minPrice": 117000000,
    "maxPrice": 161200000,
    "officialSiteUrl": "https://www.bmw.co.kr/ko/all-models/x-series/x5/2023/bmw-x5-overview.html",
    "officialImageUrl": "https://bmw.scene7.com/is/image/BMW/BMW-MY27-5Series-DI23_000129383-retouched?wid=1280",
    "localMirrorUrl": "/images/cars/x5.jpg",
    "sourceAttribution": "BMW 코리아 공식 홈페이지",
    "generation": {
      "nameKo": "4세대 페이스리프트 (G05)",
      "codeName": "G05 LCI",
      "startYear": 2023
    },
    "spec": {
      "lengthMm": 4935,
      "widthMm": 2005,
      "heightMm": 1765,
      "wheelbaseMm": 2975,
      "curbWeightKg": 2390
    },
    "trims": [
      {
        "nameKo": "xDrive30d xLine",
        "price": 117000000,
        "fuelType": "DIESEL",
        "engineDisplacement": 2993,
        "transmission": "8단 스텝트로닉",
        "fuelEfficiencyCombined": 11.6,
        "maxPower": 298,
        "maxTorque": 68.3,
        "seatingCapacity": 5
      },
      {
        "nameKo": "xDrive40i M Sport",
        "price": 127700000,
        "fuelType": "GASOLINE",
        "engineDisplacement": 2998,
        "transmission": "8단 스텝트로닉",
        "fuelEfficiencyCombined": 9.2,
        "maxPower": 381,
        "maxTorque": 53.0,
        "seatingCapacity": 5
      }
    ]
  },
  {
    "brandSlug": "bmw",
    "nameKo": "뉴 X6",
    "nameEn": "New X6",
    "slug": "bmw-x6",
    "vehicleType": "SUV",
    "releaseYear": 2024,
    "minPrice": 125800000,
    "maxPrice": 165500000,
    "officialSiteUrl": "https://www.bmw.co.kr/ko/all-models/x-series/x6/2023/bmw-x6-overview.html",
    "officialImageUrl": "https://bmw.scene7.com/is/image/BMW/BMW-MY27-5Series-DI23_000129383-retouched?wid=1280",
    "localMirrorUrl": "/images/cars/x6.jpg",
    "sourceAttribution": "BMW 코리아 공식 홈페이지",
    "generation": {
      "nameKo": "3세대 페이스리프트 (G06)",
      "codeName": "G06 LCI",
      "startYear": 2023
    },
    "spec": {
      "lengthMm": 4960,
      "widthMm": 2005,
      "heightMm": 1700,
      "wheelbaseMm": 2975,
      "curbWeightKg": 2380
    },
    "trims": [
      {
        "nameKo": "xDrive40i M Sport",
        "price": 131400000,
        "fuelType": "GASOLINE",
        "engineDisplacement": 2998,
        "transmission": "8단 스텝트로닉",
        "fuelEfficiencyCombined": 9.0,
        "maxPower": 381,
        "maxTorque": 53.0,
        "seatingCapacity": 5
      }
    ]
  },
  {
    "brandSlug": "bmw",
    "nameKo": "뉴 X7",
    "nameEn": "New X7",
    "slug": "bmw-x7",
    "vehicleType": "SUV",
    "releaseYear": 2024,
    "minPrice": 147200000,
    "maxPrice": 182400000,
    "officialSiteUrl": "https://www.bmw.co.kr/ko/all-models/x-series/x7/2022/bmw-x7-overview.html",
    "officialImageUrl": "https://bmw.scene7.com/is/image/BMW/BMW-MY27-5Series-DI23_000129383-retouched?wid=1280",
    "localMirrorUrl": "/images/cars/x7.jpg",
    "sourceAttribution": "BMW 코리아 공식 홈페이지",
    "generation": {
      "nameKo": "1세대 페이스리프트 (G07)",
      "codeName": "G07 LCI",
      "startYear": 2022
    },
    "spec": {
      "lengthMm": 5180,
      "widthMm": 2000,
      "heightMm": 1835,
      "wheelbaseMm": 3105,
      "curbWeightKg": 2575
    },
    "trims": [
      {
        "nameKo": "xDrive40i DPE 7인승",
        "price": 147200000,
        "fuelType": "GASOLINE",
        "engineDisplacement": 2998,
        "transmission": "8단 스텝트로닉",
        "fuelEfficiencyCombined": 7.8,
        "maxPower": 381,
        "maxTorque": 55.1,
        "seatingCapacity": 7
      },
      {
        "nameKo": "M60i xDrive 6인승",
        "price": 182400000,
        "fuelType": "GASOLINE",
        "engineDisplacement": 4395,
        "transmission": "8단 스텝트로닉",
        "fuelEfficiencyCombined": 6.9,
        "maxPower": 530,
        "maxTorque": 76.5,
        "seatingCapacity": 6
      }
    ]
  },
  {
    "brandSlug": "bmw",
    "nameKo": "BMW i4",
    "nameEn": "BMW i4",
    "slug": "bmw-i4",
    "vehicleType": "SEDAN",
    "releaseYear": 2024,
    "minPrice": 68300000,
    "maxPrice": 88400000,
    "officialSiteUrl": "https://www.bmw.co.kr/ko/all-models/bmw-i/i4/2021/bmw-i4-overview.html",
    "officialImageUrl": "https://bmw.scene7.com/is/image/BMW/BMW-MY27-5Series-DI23_000129383-retouched?wid=1280",
    "localMirrorUrl": "/images/cars/i4.jpg",
    "sourceAttribution": "BMW 코리아 공식 홈페이지",
    "generation": {
      "nameKo": "1세대 (G26 EV)",
      "codeName": "G26 EV",
      "startYear": 2022
    },
    "spec": {
      "lengthMm": 4785,
      "widthMm": 1850,
      "heightMm": 1450,
      "wheelbaseMm": 2855,
      "curbWeightKg": 2110
    },
    "trims": [
      {
        "nameKo": "eDrive40 M Sport",
        "price": 77200000,
        "fuelType": "ELECTRIC",
        "transmission": "감속기",
        "electricEfficiencyCombined": 4.6,
        "maxPower": 340,
        "maxTorque": 43.8,
        "seatingCapacity": 5
      },
      {
        "nameKo": "M50 xDrive",
        "price": 88400000,
        "fuelType": "ELECTRIC",
        "transmission": "감속기",
        "electricEfficiencyCombined": 4.1,
        "maxPower": 544,
        "maxTorque": 81.1,
        "seatingCapacity": 5
      }
    ]
  },
  {
    "brandSlug": "bmw",
    "nameKo": "BMW i5",
    "nameEn": "BMW i5",
    "slug": "bmw-i5",
    "vehicleType": "SEDAN",
    "releaseYear": 2024,
    "minPrice": 93900000,
    "maxPrice": 138900000,
    "officialSiteUrl": "https://www.bmw.co.kr/ko/all-models/bmw-i/i5/2023/bmw-i5-sedan-overview.html",
    "officialImageUrl": "https://bmw.scene7.com/is/image/BMW/BMW-MY27-5Series-DI23_000129383-retouched?wid=1280",
    "localMirrorUrl": "/images/cars/i5.jpg",
    "sourceAttribution": "BMW 코리아 공식 홈페이지",
    "generation": {
      "nameKo": "1세대 (G60 EV)",
      "codeName": "G60 EV",
      "startYear": 2023
    },
    "spec": {
      "lengthMm": 5060,
      "widthMm": 1900,
      "heightMm": 1515,
      "wheelbaseMm": 2995,
      "curbWeightKg": 2205
    },
    "trims": [
      {
        "nameKo": "eDrive40 M Sport",
        "price": 96900000,
        "fuelType": "ELECTRIC",
        "transmission": "감속기",
        "electricEfficiencyCombined": 4.1,
        "maxPower": 340,
        "maxTorque": 43.8,
        "seatingCapacity": 5
      },
      {
        "nameKo": "M60 xDrive",
        "price": 138900000,
        "fuelType": "ELECTRIC",
        "transmission": "감속기",
        "electricEfficiencyCombined": 3.8,
        "maxPower": 601,
        "maxTorque": 83.6,
        "seatingCapacity": 5
      }
    ]
  },
  {
    "brandSlug": "bmw",
    "nameKo": "BMW iX",
    "nameEn": "BMW iX",
    "slug": "bmw-ix",
    "vehicleType": "SUV",
    "releaseYear": 2024,
    "minPrice": 149900000,
    "maxPrice": 163900000,
    "officialSiteUrl": "https://www.bmw.co.kr/ko/all-models/bmw-i/bmw-ix/2021/bmw-ix.html",
    "officialImageUrl": "https://bmw.scene7.com/is/image/BMW/BMW-MY27-5Series-DI23_000129383-retouched?wid=1280",
    "localMirrorUrl": "/images/cars/ix.jpg",
    "sourceAttribution": "BMW 코리아 공식 홈페이지",
    "generation": {
      "nameKo": "1세대 (I20)",
      "codeName": "I20",
      "startYear": 2021
    },
    "spec": {
      "lengthMm": 4955,
      "widthMm": 1965,
      "heightMm": 1695,
      "wheelbaseMm": 3000,
      "curbWeightKg": 2575
    },
    "trims": [
      {
        "nameKo": "xDrive50",
        "price": 149900000,
        "fuelType": "ELECTRIC",
        "transmission": "감속기",
        "electricEfficiencyCombined": 3.6,
        "maxPower": 523,
        "maxTorque": 78.0,
        "seatingCapacity": 5
      }
    ]
  },
  {
    "brandSlug": "tesla",
    "nameKo": "모델 3",
    "nameEn": "Model 3",
    "slug": "model-3",
    "vehicleType": "SEDAN",
    "releaseYear": 2024,
    "minPrice": 51990000,
    "maxPrice": 67990000,
    "officialSiteUrl": "https://www.tesla.com/ko_kr/model3",
    "officialImageUrl": "https://digitalassets.tesla.com/tesla-contents/image/upload/f_auto,q_auto/Model-3-Main-Hero-Desktop-LHD.jpg",
    "localMirrorUrl": "/images/cars/model-3.jpg",
    "sourceAttribution": "테슬라 공식 홈페이지",
    "generation": {
      "nameKo": "1세대 페이스리프트 (하이랜드)",
      "codeName": "Highland",
      "startYear": 2024
    },
    "spec": {
      "lengthMm": 4720,
      "widthMm": 1850,
      "heightMm": 1440,
      "wheelbaseMm": 2875,
      "curbWeightKg": 1825
    },
    "trims": [
      {
        "nameKo": "RWD",
        "price": 51990000,
        "fuelType": "ELECTRIC",
        "transmission": "감속기",
        "electricEfficiencyCombined": 5.7,
        "maxPower": 283,
        "maxTorque": 42.0,
        "seatingCapacity": 5
      },
      {
        "nameKo": "롱레인지 AWD",
        "price": 59990000,
        "fuelType": "ELECTRIC",
        "transmission": "감속기",
        "electricEfficiencyCombined": 5.4,
        "maxPower": 498,
        "maxTorque": 50.0,
        "seatingCapacity": 5
      },
      {
        "nameKo": "퍼포먼스 AWD",
        "price": 67990000,
        "fuelType": "ELECTRIC",
        "transmission": "감속기",
        "electricEfficiencyCombined": 5.0,
        "maxPower": 460,
        "maxTorque": 75.5,
        "seatingCapacity": 5
      }
    ]
  },
  {
    "brandSlug": "tesla",
    "nameKo": "모델 Y",
    "nameEn": "Model Y",
    "slug": "model-y",
    "vehicleType": "SUV",
    "releaseYear": 2024,
    "minPrice": 52990000,
    "maxPrice": 72990000,
    "officialSiteUrl": "https://www.tesla.com/ko_kr/modely",
    "officialImageUrl": "https://digitalassets.tesla.com/tesla-contents/image/upload/f_auto,q_auto/learn_new_model_y_hero.jpg",
    "localMirrorUrl": "/images/cars/model-y.jpg",
    "sourceAttribution": "테슬라 공식 홈페이지",
    "generation": {
      "nameKo": "1세대",
      "codeName": "Model Y",
      "startYear": 2021
    },
    "spec": {
      "lengthMm": 4750,
      "widthMm": 1920,
      "heightMm": 1625,
      "wheelbaseMm": 2890,
      "curbWeightKg": 1910
    },
    "trims": [
      {
        "nameKo": "RWD",
        "price": 52990000,
        "fuelType": "ELECTRIC",
        "transmission": "감속기",
        "electricEfficiencyCombined": 5.1,
        "maxPower": 299,
        "maxTorque": 42.8,
        "seatingCapacity": 5
      },
      {
        "nameKo": "롱레인지 AWD",
        "price": 60990000,
        "fuelType": "ELECTRIC",
        "transmission": "감속기",
        "electricEfficiencyCombined": 4.8,
        "maxPower": 514,
        "maxTorque": 50.0,
        "seatingCapacity": 5
      },
      {
        "nameKo": "퍼포먼스 AWD",
        "price": 72990000,
        "fuelType": "ELECTRIC",
        "transmission": "감속기",
        "electricEfficiencyCombined": 4.8,
        "maxPower": 456,
        "maxTorque": 67.3,
        "seatingCapacity": 5
      }
    ]
  },
  {
    "brandSlug": "tesla",
    "nameKo": "모델 S",
    "nameEn": "Model S",
    "slug": "model-s",
    "vehicleType": "SEDAN",
    "releaseYear": 2024,
    "minPrice": 115250000,
    "maxPrice": 128250000,
    "officialSiteUrl": "https://www.tesla.com/ko_kr/models",
    "officialImageUrl": "https://digitalassets.tesla.com/tesla-contents/image/upload/f_auto,q_auto/Model-S-Main-Hero-Desktop-LHD.jpg",
    "localMirrorUrl": "/images/cars/model-s.jpg",
    "sourceAttribution": "테슬라 공식 홈페이지",
    "generation": {
      "nameKo": "1세대 리프레시",
      "codeName": "Palladium",
      "startYear": 2021
    },
    "spec": {
      "lengthMm": 5021,
      "widthMm": 1987,
      "heightMm": 1431,
      "wheelbaseMm": 2960,
      "curbWeightKg": 2160
    },
    "trims": [
      {
        "nameKo": "듀얼모터 AWD",
        "price": 115250000,
        "fuelType": "ELECTRIC",
        "transmission": "감속기",
        "electricEfficiencyCombined": 4.5,
        "maxPower": 670,
        "maxTorque": 76.0,
        "seatingCapacity": 5
      },
      {
        "nameKo": "Plaid 트라이모터",
        "price": 128250000,
        "fuelType": "ELECTRIC",
        "transmission": "감속기",
        "electricEfficiencyCombined": 4.1,
        "maxPower": 1020,
        "maxTorque": 145.0,
        "seatingCapacity": 5
      }
    ]
  },
  {
    "brandSlug": "tesla",
    "nameKo": "모델 X",
    "nameEn": "Model X",
    "slug": "model-x",
    "vehicleType": "SUV",
    "releaseYear": 2024,
    "minPrice": 128750000,
    "maxPrice": 141750000,
    "officialSiteUrl": "https://www.tesla.com/ko_kr/modelx",
    "officialImageUrl": "https://digitalassets.tesla.com/tesla-contents/image/upload/f_auto,q_auto/Model-X-Main-Hero-Desktop-LHD.jpg",
    "localMirrorUrl": "/images/cars/model-x.jpg",
    "sourceAttribution": "테슬라 공식 홈페이지",
    "generation": {
      "nameKo": "1세대 리프레시",
      "codeName": "Palladium X",
      "startYear": 2021
    },
    "spec": {
      "lengthMm": 5057,
      "widthMm": 1999,
      "heightMm": 1680,
      "wheelbaseMm": 2965,
      "curbWeightKg": 2450
    },
    "trims": [
      {
        "nameKo": "듀얼모터 AWD",
        "price": 128750000,
        "fuelType": "ELECTRIC",
        "transmission": "감속기",
        "electricEfficiencyCombined": 3.9,
        "maxPower": 670,
        "maxTorque": 76.0,
        "seatingCapacity": 6
      },
      {
        "nameKo": "Plaid 트라이모터",
        "price": 141750000,
        "fuelType": "ELECTRIC",
        "transmission": "감속기",
        "electricEfficiencyCombined": 3.6,
        "maxPower": 1020,
        "maxTorque": 145.0,
        "seatingCapacity": 6
      }
    ]
  },
  {
    "brandSlug": "tesla",
    "nameKo": "사이버트럭",
    "nameEn": "Cybertruck",
    "slug": "cybertruck",
    "vehicleType": "TRUCK",
    "releaseYear": 2024,
    "minPrice": 105000000,
    "maxPrice": 142000000,
    "officialSiteUrl": "https://www.tesla.com/ko_kr/cybertruck",
    "officialImageUrl": "https://digitalassets.tesla.com/tesla-contents/image/upload/f_auto,q_auto/Cybertruck-Main-Hero-Desktop.jpg",
    "localMirrorUrl": "/images/cars/cybertruck.jpg",
    "sourceAttribution": "테슬라 공식 홈페이지",
    "generation": {
      "nameKo": "1세대",
      "codeName": "Cybertruck",
      "startYear": 2024
    },
    "spec": {
      "lengthMm": 5682,
      "widthMm": 2200,
      "heightMm": 1791,
      "wheelbaseMm": 3810,
      "curbWeightKg": 3104
    },
    "trims": [
      {
        "nameKo": "듀얼모터 AWD",
        "price": 105000000,
        "fuelType": "ELECTRIC",
        "transmission": "감속기",
        "electricEfficiencyCombined": 2.8,
        "maxPower": 600,
        "maxTorque": 102.8,
        "seatingCapacity": 5
      },
      {
        "nameKo": "Cyberbeast 트라이모터",
        "price": 142000000,
        "fuelType": "ELECTRIC",
        "transmission": "감속기",
        "electricEfficiencyCombined": 2.5,
        "maxPower": 845,
        "maxTorque": 142.4,
        "seatingCapacity": 5
      }
    ]
  },
  {
    "brandSlug": "audi",
    "nameKo": "아우디 A4",
    "nameEn": "Audi A4",
    "slug": "audi-a4",
    "vehicleType": "SEDAN",
    "releaseYear": 2024,
    "minPrice": 54540000,
    "maxPrice": 62390000,
    "officialSiteUrl": "https://www.audi.co.kr/kr/web/ko/models/a4/a4-sedan.html",
    "officialImageUrl": "https://www.audi.co.kr/dam/nemo/models/misc/audi-logo.png",
    "localMirrorUrl": "/images/cars/a4.png",
    "sourceAttribution": "아우디 코리아 공식 홈페이지",
    "generation": {
      "nameKo": "5세대 페이스리프트 (B9)",
      "codeName": "B9 PE",
      "startYear": 2020
    },
    "spec": {
      "lengthMm": 4770,
      "widthMm": 1845,
      "heightMm": 1430,
      "wheelbaseMm": 2822,
      "curbWeightKg": 1615
    },
    "trims": [
      {
        "nameKo": "40 TFSI",
        "price": 54540000,
        "fuelType": "GASOLINE",
        "engineDisplacement": 1984,
        "transmission": "7단 S트로닉",
        "fuelEfficiencyCombined": 12.2,
        "maxPower": 204,
        "maxTorque": 32.6,
        "seatingCapacity": 5
      },
      {
        "nameKo": "45 TFSI 콰트로 프리미엄",
        "price": 62390000,
        "fuelType": "GASOLINE",
        "engineDisplacement": 1984,
        "transmission": "7단 S트로닉",
        "fuelEfficiencyCombined": 10.5,
        "maxPower": 265,
        "maxTorque": 37.7,
        "seatingCapacity": 5
      }
    ]
  },
  {
    "brandSlug": "audi",
    "nameKo": "아우디 A6",
    "nameEn": "Audi A6",
    "slug": "audi-a6",
    "vehicleType": "SEDAN",
    "releaseYear": 2024,
    "minPrice": 72160000,
    "maxPrice": 89840000,
    "officialSiteUrl": "https://www.audi.co.kr/kr/web/ko/models/a6/a6-sedan.html",
    "officialImageUrl": "https://www.audi.co.kr/dam/nemo/models/misc/audi-logo.png",
    "localMirrorUrl": "/images/cars/a6.png",
    "sourceAttribution": "아우디 코리아 공식 홈페이지",
    "generation": {
      "nameKo": "8세대 (C8)",
      "codeName": "C8",
      "startYear": 2019
    },
    "spec": {
      "lengthMm": 4950,
      "widthMm": 1885,
      "heightMm": 1460,
      "wheelbaseMm": 2924,
      "curbWeightKg": 1785
    },
    "trims": [
      {
        "nameKo": "45 TFSI",
        "price": 72160000,
        "fuelType": "GASOLINE",
        "engineDisplacement": 1984,
        "transmission": "7단 S트로닉",
        "fuelEfficiencyCombined": 11.4,
        "maxPower": 265,
        "maxTorque": 37.7,
        "seatingCapacity": 5
      },
      {
        "nameKo": "45 TFSI 콰트로 프리미엄",
        "price": 81160000,
        "fuelType": "GASOLINE",
        "engineDisplacement": 1984,
        "transmission": "7단 S트로닉",
        "fuelEfficiencyCombined": 10.7,
        "maxPower": 265,
        "maxTorque": 37.7,
        "seatingCapacity": 5
      },
      {
        "nameKo": "50 TDI 콰트로 프리미엄",
        "price": 89840000,
        "fuelType": "DIESEL",
        "engineDisplacement": 2967,
        "transmission": "8단 팁트로닉",
        "fuelEfficiencyCombined": 12.8,
        "maxPower": 286,
        "maxTorque": 63.2,
        "seatingCapacity": 5
      }
    ]
  },
  {
    "brandSlug": "audi",
    "nameKo": "아우디 A7",
    "nameEn": "Audi A7",
    "slug": "audi-a7",
    "vehicleType": "COUPE",
    "releaseYear": 2024,
    "minPrice": 102600000,
    "maxPrice": 118500000,
    "officialSiteUrl": "https://www.audi.co.kr/kr/web/ko/models/a7/a7-sportback.html",
    "officialImageUrl": "https://www.audi.co.kr/dam/nemo/models/misc/audi-logo.png",
    "localMirrorUrl": "/images/cars/a7.png",
    "sourceAttribution": "아우디 코리아 공식 홈페이지",
    "generation": {
      "nameKo": "2세대 (4K)",
      "codeName": "4K",
      "startYear": 2020
    },
    "spec": {
      "lengthMm": 4975,
      "widthMm": 1910,
      "heightMm": 1425,
      "wheelbaseMm": 2930,
      "curbWeightKg": 1945
    },
    "trims": [
      {
        "nameKo": "55 TFSI 콰트로 프리미엄",
        "price": 102600000,
        "fuelType": "GASOLINE",
        "engineDisplacement": 2995,
        "transmission": "7단 S트로닉",
        "fuelEfficiencyCombined": 9.5,
        "maxPower": 340,
        "maxTorque": 51.0,
        "seatingCapacity": 5
      }
    ]
  },
  {
    "brandSlug": "audi",
    "nameKo": "아우디 A8",
    "nameEn": "Audi A8",
    "slug": "audi-a8",
    "vehicleType": "SEDAN",
    "releaseYear": 2024,
    "minPrice": 163000000,
    "maxPrice": 205000000,
    "officialSiteUrl": "https://www.audi.co.kr/kr/web/ko/models/a8/a8.html",
    "officialImageUrl": "https://www.audi.co.kr/dam/nemo/models/misc/audi-logo.png",
    "localMirrorUrl": "/images/cars/a8.png",
    "sourceAttribution": "아우디 코리아 공식 홈페이지",
    "generation": {
      "nameKo": "4세대 페이스리프트 (D5)",
      "codeName": "D5 PE",
      "startYear": 2022
    },
    "spec": {
      "lengthMm": 5320,
      "widthMm": 1945,
      "heightMm": 1500,
      "wheelbaseMm": 3130,
      "curbWeightKg": 2185
    },
    "trims": [
      {
        "nameKo": "55 TFSI L 콰트로",
        "price": 163000000,
        "fuelType": "GASOLINE",
        "engineDisplacement": 2995,
        "transmission": "8단 팁트로닉",
        "fuelEfficiencyCombined": 8.8,
        "maxPower": 340,
        "maxTorque": 51.0,
        "seatingCapacity": 5
      }
    ]
  },
  {
    "brandSlug": "audi",
    "nameKo": "아우디 Q3",
    "nameEn": "Audi Q3",
    "slug": "audi-q3",
    "vehicleType": "SUV",
    "releaseYear": 2024,
    "minPrice": 48340000,
    "maxPrice": 55890000,
    "officialSiteUrl": "https://www.audi.co.kr/kr/web/ko/models/q3/q3.html",
    "officialImageUrl": "https://www.audi.co.kr/dam/nemo/models/misc/audi-logo.png",
    "localMirrorUrl": "/images/cars/q3.png",
    "sourceAttribution": "아우디 코리아 공식 홈페이지",
    "generation": {
      "nameKo": "2세대 (F3)",
      "codeName": "F3",
      "startYear": 2020
    },
    "spec": {
      "lengthMm": 4485,
      "widthMm": 1850,
      "heightMm": 1615,
      "wheelbaseMm": 2680,
      "curbWeightKg": 1635
    },
    "trims": [
      {
        "nameKo": "35 TDI",
        "price": 48340000,
        "fuelType": "DIESEL",
        "engineDisplacement": 1968,
        "transmission": "7단 S트로닉",
        "fuelEfficiencyCombined": 14.7,
        "maxPower": 150,
        "maxTorque": 36.7,
        "seatingCapacity": 5
      },
      {
        "nameKo": "40 TFSI 콰트로 프리미엄",
        "price": 55890000,
        "fuelType": "GASOLINE",
        "engineDisplacement": 1984,
        "transmission": "7단 S트로닉",
        "fuelEfficiencyCombined": 11.2,
        "maxPower": 190,
        "maxTorque": 32.6,
        "seatingCapacity": 5
      }
    ]
  },
  {
    "brandSlug": "audi",
    "nameKo": "아우디 Q5",
    "nameEn": "Audi Q5",
    "slug": "audi-q5",
    "vehicleType": "SUV",
    "releaseYear": 2024,
    "minPrice": 69570000,
    "maxPrice": 81170000,
    "officialSiteUrl": "https://www.audi.co.kr/kr/web/ko/models/q5/q5.html",
    "officialImageUrl": "https://www.audi.co.kr/dam/nemo/models/misc/audi-logo.png",
    "localMirrorUrl": "/images/cars/q5.png",
    "sourceAttribution": "아우디 코리아 공식 홈페이지",
    "generation": {
      "nameKo": "2세대 페이스리프트 (FY)",
      "codeName": "FY PE",
      "startYear": 2021
    },
    "spec": {
      "lengthMm": 4680,
      "widthMm": 1895,
      "heightMm": 1665,
      "wheelbaseMm": 2820,
      "curbWeightKg": 1895
    },
    "trims": [
      {
        "nameKo": "40 TDI 콰트로",
        "price": 69570000,
        "fuelType": "DIESEL",
        "engineDisplacement": 1968,
        "transmission": "7단 S트로닉",
        "fuelEfficiencyCombined": 12.8,
        "maxPower": 204,
        "maxTorque": 40.8,
        "seatingCapacity": 5
      },
      {
        "nameKo": "45 TFSI 콰트로 프리미엄",
        "price": 81170000,
        "fuelType": "GASOLINE",
        "engineDisplacement": 1984,
        "transmission": "7단 S트로닉",
        "fuelEfficiencyCombined": 10.2,
        "maxPower": 265,
        "maxTorque": 37.7,
        "seatingCapacity": 5
      }
    ]
  },
  {
    "brandSlug": "audi",
    "nameKo": "아우디 Q7",
    "nameEn": "Audi Q7",
    "slug": "audi-q7",
    "vehicleType": "SUV",
    "releaseYear": 2024,
    "minPrice": 103400000,
    "maxPrice": 122800000,
    "officialSiteUrl": "https://www.audi.co.kr/kr/web/ko/models/q7/q7.html",
    "officialImageUrl": "https://www.audi.co.kr/dam/nemo/models/misc/audi-logo.png",
    "localMirrorUrl": "/images/cars/q7.png",
    "sourceAttribution": "아우디 코리아 공식 홈페이지",
    "generation": {
      "nameKo": "2세대 페이스리프트 (4M)",
      "codeName": "4M PE",
      "startYear": 2020
    },
    "spec": {
      "lengthMm": 5065,
      "widthMm": 1970,
      "heightMm": 1740,
      "wheelbaseMm": 2996,
      "curbWeightKg": 2245
    },
    "trims": [
      {
        "nameKo": "45 TDI 콰트로",
        "price": 103400000,
        "fuelType": "DIESEL",
        "engineDisplacement": 2967,
        "transmission": "8단 팁트로닉",
        "fuelEfficiencyCombined": 11.0,
        "maxPower": 231,
        "maxTorque": 51.0,
        "seatingCapacity": 7
      },
      {
        "nameKo": "55 TFSI 콰트로 프리미엄",
        "price": 122800000,
        "fuelType": "GASOLINE",
        "engineDisplacement": 2995,
        "transmission": "8단 팁트로닉",
        "fuelEfficiencyCombined": 8.6,
        "maxPower": 340,
        "maxTorque": 51.0,
        "seatingCapacity": 7
      }
    ]
  },
  {
    "brandSlug": "audi",
    "nameKo": "아우디 Q8",
    "nameEn": "Audi Q8",
    "slug": "audi-q8",
    "vehicleType": "SUV",
    "releaseYear": 2024,
    "minPrice": 125500000,
    "maxPrice": 148000000,
    "officialSiteUrl": "https://www.audi.co.kr/kr/web/ko/models/q8/q8.html",
    "officialImageUrl": "https://www.audi.co.kr/dam/nemo/models/misc/audi-logo.png",
    "localMirrorUrl": "/images/cars/q8.png",
    "sourceAttribution": "아우디 코리아 공식 홈페이지",
    "generation": {
      "nameKo": "1세대 페이스리프트 (4M8)",
      "codeName": "4M8 PE",
      "startYear": 2024
    },
    "spec": {
      "lengthMm": 5005,
      "widthMm": 1995,
      "heightMm": 1695,
      "wheelbaseMm": 2995,
      "curbWeightKg": 2320
    },
    "trims": [
      {
        "nameKo": "45 TDI 콰트로",
        "price": 125500000,
        "fuelType": "DIESEL",
        "engineDisplacement": 2967,
        "transmission": "8단 팁트로닉",
        "fuelEfficiencyCombined": 10.7,
        "maxPower": 231,
        "maxTorque": 51.0,
        "seatingCapacity": 5
      },
      {
        "nameKo": "55 TFSI 콰트로 프리미엄",
        "price": 148000000,
        "fuelType": "GASOLINE",
        "engineDisplacement": 2995,
        "transmission": "8단 팁트로닉",
        "fuelEfficiencyCombined": 8.2,
        "maxPower": 340,
        "maxTorque": 51.0,
        "seatingCapacity": 5
      }
    ]
  },
  {
    "brandSlug": "audi",
    "nameKo": "e-tron GT",
    "nameEn": "e-tron GT",
    "slug": "audi-e-tron-gt",
    "vehicleType": "SEDAN",
    "releaseYear": 2024,
    "minPrice": 146200000,
    "maxPrice": 169300000,
    "officialSiteUrl": "https://www.audi.co.kr/kr/web/ko/models/e-tron-gt/audi-e-tron-gt.html",
    "officialImageUrl": "https://www.audi.co.kr/dam/nemo/models/misc/audi-logo.png",
    "localMirrorUrl": "/images/cars/e-tron-gt.png",
    "sourceAttribution": "아우디 코리아 공식 홈페이지",
    "generation": {
      "nameKo": "1세대 (FW)",
      "codeName": "FW",
      "startYear": 2021
    },
    "spec": {
      "lengthMm": 4990,
      "widthMm": 1965,
      "heightMm": 1415,
      "wheelbaseMm": 2900,
      "curbWeightKg": 2355
    },
    "trims": [
      {
        "nameKo": "콰트로",
        "price": 146200000,
        "fuelType": "ELECTRIC",
        "transmission": "2단 자동",
        "electricEfficiencyCombined": 3.7,
        "maxPower": 530,
        "maxTorque": 64.3,
        "seatingCapacity": 5
      },
      {
        "nameKo": "RS e-tron GT",
        "price": 169300000,
        "fuelType": "ELECTRIC",
        "transmission": "2단 자동",
        "electricEfficiencyCombined": 3.4,
        "maxPower": 646,
        "maxTorque": 84.7,
        "seatingCapacity": 5
      }
    ]
  },
  {
    "brandSlug": "volvo",
    "nameKo": "볼보 EX30",
    "nameEn": "Volvo EX30",
    "slug": "volvo-ex30",
    "vehicleType": "SUV",
    "releaseYear": 2024,
    "minPrice": 49450000,
    "maxPrice": 55160000,
    "officialSiteUrl": "https://www.volvocars.com/kr/cars/ex30-electric/",
    "officialImageUrl": "https://www.volvocars.com/static/shared/images/volvo-spread-wordmark.svg",
    "localMirrorUrl": "/images/cars/ex30.svg",
    "sourceAttribution": "볼보자동차 코리아 공식 홈페이지",
    "generation": {
      "nameKo": "1세대",
      "codeName": "EX30",
      "startYear": 2024
    },
    "spec": {
      "lengthMm": 4233,
      "widthMm": 1836,
      "heightMm": 1550,
      "wheelbaseMm": 2650,
      "curbWeightKg": 1775
    },
    "trims": [
      {
        "nameKo": "코어 싱글모터 롱레인지",
        "price": 49450000,
        "fuelType": "ELECTRIC",
        "transmission": "감속기",
        "electricEfficiencyCombined": 4.8,
        "maxPower": 272,
        "maxTorque": 35.0,
        "seatingCapacity": 5
      },
      {
        "nameKo": "울트라 싱글모터 롱레인지",
        "price": 55160000,
        "fuelType": "ELECTRIC",
        "transmission": "감속기",
        "electricEfficiencyCombined": 4.8,
        "maxPower": 272,
        "maxTorque": 35.0,
        "seatingCapacity": 5
      }
    ]
  },
  {
    "brandSlug": "volvo",
    "nameKo": "볼보 XC40",
    "nameEn": "Volvo XC40",
    "slug": "volvo-xc40",
    "vehicleType": "SUV",
    "releaseYear": 2024,
    "minPrice": 49200000,
    "maxPrice": 54300000,
    "officialSiteUrl": "https://www.volvocars.com/kr/cars/xc40/",
    "officialImageUrl": "https://www.volvocars.com/static/shared/images/volvo-spread-wordmark.svg",
    "localMirrorUrl": "/images/cars/xc40.svg",
    "sourceAttribution": "볼보자동차 코리아 공식 홈페이지",
    "generation": {
      "nameKo": "1세대 페이스리프트",
      "codeName": "XC40 PE",
      "startYear": 2022
    },
    "spec": {
      "lengthMm": 4440,
      "widthMm": 1875,
      "heightMm": 1640,
      "wheelbaseMm": 2702,
      "curbWeightKg": 1795
    },
    "trims": [
      {
        "nameKo": "B4 AWD 플러스 다크",
        "price": 49200000,
        "fuelType": "GASOLINE",
        "engineDisplacement": 1969,
        "transmission": "8단 자동",
        "fuelEfficiencyCombined": 10.6,
        "maxPower": 197,
        "maxTorque": 30.6,
        "seatingCapacity": 5
      },
      {
        "nameKo": "B4 AWD 얼티메이트",
        "price": 54300000,
        "fuelType": "GASOLINE",
        "engineDisplacement": 1969,
        "transmission": "8단 자동",
        "fuelEfficiencyCombined": 10.6,
        "maxPower": 197,
        "maxTorque": 30.6,
        "seatingCapacity": 5
      }
    ]
  },
  {
    "brandSlug": "volvo",
    "nameKo": "볼보 XC60",
    "nameEn": "Volvo XC60",
    "slug": "volvo-xc60",
    "vehicleType": "SUV",
    "releaseYear": 2024,
    "minPrice": 64400000,
    "maxPrice": 86400000,
    "officialSiteUrl": "https://www.volvocars.com/kr/cars/xc60/",
    "officialImageUrl": "https://www.volvocars.com/static/shared/images/volvo-spread-wordmark.svg",
    "localMirrorUrl": "/images/cars/xc60.svg",
    "sourceAttribution": "볼보자동차 코리아 공식 홈페이지",
    "generation": {
      "nameKo": "2세대 페이스리프트",
      "codeName": "XC60 PE",
      "startYear": 2021
    },
    "spec": {
      "lengthMm": 4710,
      "widthMm": 1900,
      "heightMm": 1645,
      "wheelbaseMm": 2865,
      "curbWeightKg": 1950
    },
    "trims": [
      {
        "nameKo": "B5 AWD 플러스",
        "price": 64400000,
        "fuelType": "GASOLINE",
        "engineDisplacement": 1969,
        "transmission": "8단 자동",
        "fuelEfficiencyCombined": 10.1,
        "maxPower": 250,
        "maxTorque": 35.7,
        "seatingCapacity": 5
      },
      {
        "nameKo": "T8 AWD 얼티메이트 리차지",
        "price": 86400000,
        "fuelType": "HYBRID",
        "engineDisplacement": 1969,
        "transmission": "8단 자동",
        "fuelEfficiencyCombined": 11.4,
        "maxPower": 462,
        "maxTorque": 72.3,
        "seatingCapacity": 5
      }
    ]
  },
  {
    "brandSlug": "volvo",
    "nameKo": "볼보 XC90",
    "nameEn": "Volvo XC90",
    "slug": "volvo-xc90",
    "vehicleType": "SUV",
    "releaseYear": 2024,
    "minPrice": 87200000,
    "maxPrice": 115200000,
    "officialSiteUrl": "https://www.volvocars.com/kr/cars/xc90/",
    "officialImageUrl": "https://www.volvocars.com/static/shared/images/volvo-spread-wordmark.svg",
    "localMirrorUrl": "/images/cars/xc90.svg",
    "sourceAttribution": "볼보자동차 코리아 공식 홈페이지",
    "generation": {
      "nameKo": "2세대 페이스리프트",
      "codeName": "XC90 PE",
      "startYear": 2019
    },
    "spec": {
      "lengthMm": 4950,
      "widthMm": 1960,
      "heightMm": 1770,
      "wheelbaseMm": 2984,
      "curbWeightKg": 2160
    },
    "trims": [
      {
        "nameKo": "B6 AWD 플러스 7인승",
        "price": 87200000,
        "fuelType": "GASOLINE",
        "engineDisplacement": 1969,
        "transmission": "8단 자동",
        "fuelEfficiencyCombined": 9.5,
        "maxPower": 300,
        "maxTorque": 42.8,
        "seatingCapacity": 7
      },
      {
        "nameKo": "T8 AWD 얼티메이트 리차지",
        "price": 115200000,
        "fuelType": "HYBRID",
        "engineDisplacement": 1969,
        "transmission": "8단 자동",
        "fuelEfficiencyCombined": 11.0,
        "maxPower": 462,
        "maxTorque": 72.3,
        "seatingCapacity": 7
      }
    ]
  },
  {
    "brandSlug": "volvo",
    "nameKo": "볼보 S60",
    "nameEn": "Volvo S60",
    "slug": "volvo-s60",
    "vehicleType": "SEDAN",
    "releaseYear": 2024,
    "minPrice": 56400000,
    "maxPrice": 56400000,
    "officialSiteUrl": "https://www.volvocars.com/kr/cars/s60/",
    "officialImageUrl": "https://www.volvocars.com/static/shared/images/volvo-spread-wordmark.svg",
    "localMirrorUrl": "/images/cars/s60.svg",
    "sourceAttribution": "볼보자동차 코리아 공식 홈페이지",
    "generation": {
      "nameKo": "3세대 페이스리프트",
      "codeName": "S60 PE",
      "startYear": 2022
    },
    "spec": {
      "lengthMm": 4780,
      "widthMm": 1850,
      "heightMm": 1430,
      "wheelbaseMm": 2872,
      "curbWeightKg": 1735
    },
    "trims": [
      {
        "nameKo": "B5 얼티메이트",
        "price": 56400000,
        "fuelType": "GASOLINE",
        "engineDisplacement": 1969,
        "transmission": "8단 자동",
        "fuelEfficiencyCombined": 11.3,
        "maxPower": 250,
        "maxTorque": 35.7,
        "seatingCapacity": 5
      }
    ]
  },
  {
    "brandSlug": "volvo",
    "nameKo": "볼보 S90",
    "nameEn": "Volvo S90",
    "slug": "volvo-s90",
    "vehicleType": "SEDAN",
    "releaseYear": 2024,
    "minPrice": 70500000,
    "maxPrice": 87900000,
    "officialSiteUrl": "https://www.volvocars.com/kr/cars/s90/",
    "officialImageUrl": "https://www.volvocars.com/static/shared/images/volvo-spread-wordmark.svg",
    "localMirrorUrl": "/images/cars/s90.svg",
    "sourceAttribution": "볼보자동차 코리아 공식 홈페이지",
    "generation": {
      "nameKo": "2세대 페이스리프트",
      "codeName": "S90 PE",
      "startYear": 2020
    },
    "spec": {
      "lengthMm": 5090,
      "widthMm": 1880,
      "heightMm": 1455,
      "wheelbaseMm": 3060,
      "curbWeightKg": 1875
    },
    "trims": [
      {
        "nameKo": "B5 플러스",
        "price": 70500000,
        "fuelType": "GASOLINE",
        "engineDisplacement": 1969,
        "transmission": "8단 자동",
        "fuelEfficiencyCombined": 11.1,
        "maxPower": 250,
        "maxTorque": 35.7,
        "seatingCapacity": 5
      },
      {
        "nameKo": "B6 AWD 얼티메이트",
        "price": 77400000,
        "fuelType": "GASOLINE",
        "engineDisplacement": 1969,
        "transmission": "8단 자동",
        "fuelEfficiencyCombined": 10.3,
        "maxPower": 300,
        "maxTorque": 42.8,
        "seatingCapacity": 5
      },
      {
        "nameKo": "T8 AWD 얼티메이트 리차지",
        "price": 87900000,
        "fuelType": "HYBRID",
        "engineDisplacement": 1969,
        "transmission": "8단 자동",
        "fuelEfficiencyCombined": 11.9,
        "maxPower": 462,
        "maxTorque": 72.3,
        "seatingCapacity": 5
      }
    ]
  },
  {
    "brandSlug": "volvo",
    "nameKo": "V60 크로스컨트리",
    "nameEn": "V60 Cross Country",
    "slug": "volvo-v60-cc",
    "vehicleType": "WAGON",
    "releaseYear": 2024,
    "minPrice": 56300000,
    "maxPrice": 62600000,
    "officialSiteUrl": "https://www.volvocars.com/kr/cars/v60-cross-country/",
    "officialImageUrl": "https://www.volvocars.com/static/shared/images/volvo-spread-wordmark.svg",
    "localMirrorUrl": "/images/cars/v60-cc.svg",
    "sourceAttribution": "볼보자동차 코리아 공식 홈페이지",
    "generation": {
      "nameKo": "2세대 페이스리프트",
      "codeName": "V60 CC PE",
      "startYear": 2022
    },
    "spec": {
      "lengthMm": 4785,
      "widthMm": 1850,
      "heightMm": 1490,
      "wheelbaseMm": 2875,
      "curbWeightKg": 1845
    },
    "trims": [
      {
        "nameKo": "B5 AWD 플러스",
        "price": 56300000,
        "fuelType": "GASOLINE",
        "engineDisplacement": 1969,
        "transmission": "8단 자동",
        "fuelEfficiencyCombined": 9.9,
        "maxPower": 250,
        "maxTorque": 35.7,
        "seatingCapacity": 5
      },
      {
        "nameKo": "B5 AWD 얼티메이트",
        "price": 62600000,
        "fuelType": "GASOLINE",
        "engineDisplacement": 1969,
        "transmission": "8단 자동",
        "fuelEfficiencyCombined": 9.9,
        "maxPower": 250,
        "maxTorque": 35.7,
        "seatingCapacity": 5
      }
    ]
  },
  {
    "brandSlug": "porsche",
    "nameKo": "911 카레라",
    "nameEn": "911 Carrera",
    "slug": "porsche-911",
    "vehicleType": "COUPE",
    "releaseYear": 2024,
    "minPrice": 171100000,
    "maxPrice": 275500000,
    "officialSiteUrl": "https://www.porsche.com/korea/ko/models/911/",
    "officialImageUrl": "https://cdn.ui.porsche.com/porsche-design-system/crest/porsche-crest.svg",
    "localMirrorUrl": "/images/cars/911.svg",
    "sourceAttribution": "포르쉐 코리아 공식 홈페이지",
    "generation": {
      "nameKo": "8세대 페이스리프트 (992.2)",
      "codeName": "992.2",
      "startYear": 2024
    },
    "spec": {
      "lengthMm": 4542,
      "widthMm": 1852,
      "heightMm": 1298,
      "wheelbaseMm": 2450,
      "curbWeightKg": 1520
    },
    "trims": [
      {
        "nameKo": "카레라 쿠페",
        "price": 171100000,
        "fuelType": "GASOLINE",
        "engineDisplacement": 2981,
        "transmission": "8단 PDK",
        "fuelEfficiencyCombined": 8.6,
        "maxPower": 394,
        "maxTorque": 45.9,
        "seatingCapacity": 4
      },
      {
        "nameKo": "카레라 GTS T-하이브리드",
        "price": 229800000,
        "fuelType": "HYBRID",
        "engineDisplacement": 3591,
        "transmission": "8단 PDK",
        "fuelEfficiencyCombined": 9.5,
        "maxPower": 541,
        "maxTorque": 62.2,
        "seatingCapacity": 4
      }
    ]
  },
  {
    "brandSlug": "porsche",
    "nameKo": "파나메라",
    "nameEn": "Panamera",
    "slug": "porsche-panamera",
    "vehicleType": "SEDAN",
    "releaseYear": 2024,
    "minPrice": 176700000,
    "maxPrice": 309500000,
    "officialSiteUrl": "https://www.porsche.com/korea/ko/models/panamera/",
    "officialImageUrl": "https://cdn.ui.porsche.com/porsche-design-system/crest/porsche-crest.svg",
    "localMirrorUrl": "/images/cars/panamera.svg",
    "sourceAttribution": "포르쉐 코리아 공식 홈페이지",
    "generation": {
      "nameKo": "3세대 (972)",
      "codeName": "972",
      "startYear": 2024
    },
    "spec": {
      "lengthMm": 5052,
      "widthMm": 1937,
      "heightMm": 1423,
      "wheelbaseMm": 2950,
      "curbWeightKg": 1990
    },
    "trims": [
      {
        "nameKo": "파나메라 4",
        "price": 176700000,
        "fuelType": "GASOLINE",
        "engineDisplacement": 2894,
        "transmission": "8단 PDK",
        "fuelEfficiencyCombined": 8.1,
        "maxPower": 353,
        "maxTorque": 51.0,
        "seatingCapacity": 4
      },
      {
        "nameKo": "터보 E-하이브리드",
        "price": 309500000,
        "fuelType": "HYBRID",
        "engineDisplacement": 3996,
        "transmission": "8단 PDK",
        "fuelEfficiencyCombined": 9.8,
        "maxPower": 680,
        "maxTorque": 94.9,
        "seatingCapacity": 4
      }
    ]
  },
  {
    "brandSlug": "porsche",
    "nameKo": "타이칸",
    "nameEn": "Taycan",
    "slug": "porsche-taycan",
    "vehicleType": "SEDAN",
    "releaseYear": 2024,
    "minPrice": 129900000,
    "maxPrice": 247400000,
    "officialSiteUrl": "https://www.porsche.com/korea/ko/models/taycan/",
    "officialImageUrl": "https://cdn.ui.porsche.com/porsche-design-system/crest/porsche-crest.svg",
    "localMirrorUrl": "/images/cars/taycan.svg",
    "sourceAttribution": "포르쉐 코리아 공식 홈페이지",
    "generation": {
      "nameKo": "1세대 페이스리프트 (J1 II)",
      "codeName": "J1 II",
      "startYear": 2024
    },
    "spec": {
      "lengthMm": 4963,
      "widthMm": 1966,
      "heightMm": 1379,
      "wheelbaseMm": 2900,
      "curbWeightKg": 2170
    },
    "trims": [
      {
        "nameKo": "타이칸 후륜구동",
        "price": 129900000,
        "fuelType": "ELECTRIC",
        "transmission": "2단 자동",
        "electricEfficiencyCombined": 4.1,
        "maxPower": 408,
        "maxTorque": 41.8,
        "seatingCapacity": 4
      },
      {
        "nameKo": "타이칸 4S",
        "price": 155700000,
        "fuelType": "ELECTRIC",
        "transmission": "2단 자동",
        "electricEfficiencyCombined": 3.9,
        "maxPower": 544,
        "maxTorque": 72.4,
        "seatingCapacity": 4
      },
      {
        "nameKo": "타이칸 터보 S",
        "price": 247400000,
        "fuelType": "ELECTRIC",
        "transmission": "2단 자동",
        "electricEfficiencyCombined": 3.6,
        "maxPower": 952,
        "maxTorque": 113.2,
        "seatingCapacity": 4
      }
    ]
  },
  {
    "brandSlug": "porsche",
    "nameKo": "카이엔",
    "nameEn": "Cayenne",
    "slug": "porsche-cayenne",
    "vehicleType": "SUV",
    "releaseYear": 2024,
    "minPrice": 133100000,
    "maxPrice": 211200000,
    "officialSiteUrl": "https://www.porsche.com/korea/ko/models/cayenne/",
    "officialImageUrl": "https://cdn.ui.porsche.com/porsche-design-system/crest/porsche-crest.svg",
    "localMirrorUrl": "/images/cars/cayenne.svg",
    "sourceAttribution": "포르쉐 코리아 공식 홈페이지",
    "generation": {
      "nameKo": "3세대 페이스리프트 (PO536)",
      "codeName": "PO536 PE",
      "startYear": 2023
    },
    "spec": {
      "lengthMm": 4930,
      "widthMm": 1983,
      "heightMm": 1698,
      "wheelbaseMm": 2895,
      "curbWeightKg": 2165
    },
    "trims": [
      {
        "nameKo": "카이엔 3.0 가솔린",
        "price": 133100000,
        "fuelType": "GASOLINE",
        "engineDisplacement": 2995,
        "transmission": "8단 팁트로닉",
        "fuelEfficiencyCombined": 7.5,
        "maxPower": 353,
        "maxTorque": 51.0,
        "seatingCapacity": 5
      },
      {
        "nameKo": "카이엔 E-하이브리드",
        "price": 145400000,
        "fuelType": "HYBRID",
        "engineDisplacement": 2995,
        "transmission": "8단 팁트로닉",
        "fuelEfficiencyCombined": 9.0,
        "maxPower": 470,
        "maxTorque": 66.3,
        "seatingCapacity": 5
      },
      {
        "nameKo": "카이엔 쿠페 터보 GT",
        "price": 211200000,
        "fuelType": "GASOLINE",
        "engineDisplacement": 3996,
        "transmission": "8단 팁트로닉",
        "fuelEfficiencyCombined": 6.5,
        "maxPower": 659,
        "maxTorque": 86.7,
        "seatingCapacity": 4
      }
    ]
  },
  {
    "brandSlug": "porsche",
    "nameKo": "마칸",
    "nameEn": "Macan",
    "slug": "porsche-macan",
    "vehicleType": "SUV",
    "releaseYear": 2024,
    "minPrice": 105900000,
    "maxPrice": 138500000,
    "officialSiteUrl": "https://www.porsche.com/korea/ko/models/macan/",
    "officialImageUrl": "https://cdn.ui.porsche.com/porsche-design-system/crest/porsche-crest.svg",
    "localMirrorUrl": "/images/cars/macan.svg",
    "sourceAttribution": "포르쉐 코리아 공식 홈페이지",
    "generation": {
      "nameKo": "2세대 일렉트릭",
      "codeName": "Macan EV",
      "startYear": 2024
    },
    "spec": {
      "lengthMm": 4784,
      "widthMm": 1938,
      "heightMm": 1622,
      "wheelbaseMm": 2893,
      "curbWeightKg": 2330
    },
    "trims": [
      {
        "nameKo": "마칸 4 일렉트릭",
        "price": 105900000,
        "fuelType": "ELECTRIC",
        "transmission": "감속기",
        "electricEfficiencyCombined": 4.0,
        "maxPower": 408,
        "maxTorque": 66.3,
        "seatingCapacity": 5
      },
      {
        "nameKo": "마칸 터보 일렉트릭",
        "price": 138500000,
        "fuelType": "ELECTRIC",
        "transmission": "감속기",
        "electricEfficiencyCombined": 3.7,
        "maxPower": 639,
        "maxTorque": 115.2,
        "seatingCapacity": 5
      }
    ]
  },
  {
    "brandSlug": "porsche",
    "nameKo": "718 박스터",
    "nameEn": "718 Boxster",
    "slug": "porsche-718",
    "vehicleType": "CONVERTIBLE",
    "releaseYear": 2024,
    "minPrice": 98800000,
    "maxPrice": 152000000,
    "officialSiteUrl": "https://www.porsche.com/korea/ko/models/718/",
    "officialImageUrl": "https://cdn.ui.porsche.com/porsche-design-system/crest/porsche-crest.svg",
    "localMirrorUrl": "/images/cars/718.svg",
    "sourceAttribution": "포르쉐 코리아 공식 홈페이지",
    "generation": {
      "nameKo": "4세대 (982)",
      "codeName": "982",
      "startYear": 2016
    },
    "spec": {
      "lengthMm": 4379,
      "widthMm": 1801,
      "heightMm": 1281,
      "wheelbaseMm": 2475,
      "curbWeightKg": 1365
    },
    "trims": [
      {
        "nameKo": "718 박스터 2.0",
        "price": 98800000,
        "fuelType": "GASOLINE",
        "engineDisplacement": 1988,
        "transmission": "7단 PDK",
        "fuelEfficiencyCombined": 9.4,
        "maxPower": 300,
        "maxTorque": 38.8,
        "seatingCapacity": 2
      },
      {
        "nameKo": "718 박스터 GTS 4.0",
        "price": 132400000,
        "fuelType": "GASOLINE",
        "engineDisplacement": 3995,
        "transmission": "7단 PDK",
        "fuelEfficiencyCombined": 8.4,
        "maxPower": 407,
        "maxTorque": 43.9,
        "seatingCapacity": 2
      }
    ]
  },
  {
    "brandSlug": "volkswagen",
    "nameKo": "골프",
    "nameEn": "Golf",
    "slug": "vw-golf",
    "vehicleType": "HATCHBACK",
    "releaseYear": 2024,
    "minPrice": 39850000,
    "maxPrice": 49700000,
    "officialSiteUrl": "https://www.volkswagen.co.kr",
    "officialImageUrl": "https://www.volkswagen.co.kr/content/dam/vw-ngw/vw_pkw/importers/kr/logo/vw_logo.svg",
    "localMirrorUrl": "/images/cars/golf.svg",
    "sourceAttribution": "폭스바겐 코리아 공식 홈페이지",
    "generation": {
      "nameKo": "8세대 (Mk8)",
      "codeName": "Mk8",
      "startYear": 2022
    },
    "spec": {
      "lengthMm": 4284,
      "widthMm": 1789,
      "heightMm": 1456,
      "wheelbaseMm": 2636,
      "curbWeightKg": 1489
    },
    "trims": [
      {
        "nameKo": "2.0 TDI 프리미엄",
        "price": 39850000,
        "fuelType": "DIESEL",
        "engineDisplacement": 1968,
        "transmission": "7단 DSG",
        "fuelEfficiencyCombined": 17.8,
        "maxPower": 150,
        "maxTorque": 36.7,
        "seatingCapacity": 5
      },
      {
        "nameKo": "2.0 TSI GTI",
        "price": 49700000,
        "fuelType": "GASOLINE",
        "engineDisplacement": 1984,
        "transmission": "7단 DSG",
        "fuelEfficiencyCombined": 11.5,
        "maxPower": 245,
        "maxTorque": 37.7,
        "seatingCapacity": 5
      }
    ]
  },
  {
    "brandSlug": "volkswagen",
    "nameKo": "제타",
    "nameEn": "Jetta",
    "slug": "vw-jetta",
    "vehicleType": "SEDAN",
    "releaseYear": 2024,
    "minPrice": 34260000,
    "maxPrice": 38100000,
    "officialSiteUrl": "https://www.volkswagen.co.kr",
    "officialImageUrl": "https://www.volkswagen.co.kr/content/dam/vw-ngw/vw_pkw/importers/kr/logo/vw_logo.svg",
    "localMirrorUrl": "/images/cars/jetta.svg",
    "sourceAttribution": "폭스바겐 코리아 공식 홈페이지",
    "generation": {
      "nameKo": "7세대 페이스리프트 (A7)",
      "codeName": "A7 PE",
      "startYear": 2022
    },
    "spec": {
      "lengthMm": 4740,
      "widthMm": 1800,
      "heightMm": 1465,
      "wheelbaseMm": 2686,
      "curbWeightKg": 1416
    },
    "trims": [
      {
        "nameKo": "1.5 TSI 프리미엄",
        "price": 34260000,
        "fuelType": "GASOLINE",
        "engineDisplacement": 1498,
        "transmission": "8단 자동",
        "fuelEfficiencyCombined": 14.1,
        "maxPower": 160,
        "maxTorque": 25.5,
        "seatingCapacity": 5
      },
      {
        "nameKo": "1.5 TSI 프레스티지",
        "price": 38100000,
        "fuelType": "GASOLINE",
        "engineDisplacement": 1498,
        "transmission": "8단 자동",
        "fuelEfficiencyCombined": 14.1,
        "maxPower": 160,
        "maxTorque": 25.5,
        "seatingCapacity": 5
      }
    ]
  },
  {
    "brandSlug": "volkswagen",
    "nameKo": "티구안",
    "nameEn": "Tiguan",
    "slug": "vw-tiguan",
    "vehicleType": "SUV",
    "releaseYear": 2024,
    "minPrice": 46400000,
    "maxPrice": 53800000,
    "officialSiteUrl": "https://www.volkswagen.co.kr",
    "officialImageUrl": "https://www.volkswagen.co.kr/content/dam/vw-ngw/vw_pkw/importers/kr/logo/vw_logo.svg",
    "localMirrorUrl": "/images/cars/tiguan.svg",
    "sourceAttribution": "폭스바겐 코리아 공식 홈페이지",
    "generation": {
      "nameKo": "2세대 올스페이스 페이스리프트",
      "codeName": "Tiguan PE",
      "startYear": 2022
    },
    "spec": {
      "lengthMm": 4730,
      "widthMm": 1840,
      "heightMm": 1670,
      "wheelbaseMm": 2790,
      "curbWeightKg": 1785
    },
    "trims": [
      {
        "nameKo": "올스페이스 2.0 TSI 프레스티지",
        "price": 53800000,
        "fuelType": "GASOLINE",
        "engineDisplacement": 1984,
        "transmission": "8단 자동",
        "fuelEfficiencyCombined": 10.1,
        "maxPower": 186,
        "maxTorque": 30.6,
        "seatingCapacity": 7
      }
    ]
  },
  {
    "brandSlug": "volkswagen",
    "nameKo": "투아렉",
    "nameEn": "Touareg",
    "slug": "vw-touareg",
    "vehicleType": "SUV",
    "releaseYear": 2024,
    "minPrice": 100900000,
    "maxPrice": 130400000,
    "officialSiteUrl": "https://www.volkswagen.co.kr",
    "officialImageUrl": "https://www.volkswagen.co.kr/content/dam/vw-ngw/vw_pkw/importers/kr/logo/vw_logo.svg",
    "localMirrorUrl": "/images/cars/touareg.svg",
    "sourceAttribution": "폭스바겐 코리아 공식 홈페이지",
    "generation": {
      "nameKo": "3세대 페이스리프트 (CR)",
      "codeName": "CR PE",
      "startYear": 2024
    },
    "spec": {
      "lengthMm": 4880,
      "widthMm": 1985,
      "heightMm": 1685,
      "wheelbaseMm": 2899,
      "curbWeightKg": 2271
    },
    "trims": [
      {
        "nameKo": "3.0 TDI 프레스티지",
        "price": 100900000,
        "fuelType": "DIESEL",
        "engineDisplacement": 2967,
        "transmission": "8단 자동",
        "fuelEfficiencyCombined": 10.8,
        "maxPower": 286,
        "maxTorque": 61.2,
        "seatingCapacity": 5
      },
      {
        "nameKo": "3.0 TDI R-Line",
        "price": 130400000,
        "fuelType": "DIESEL",
        "engineDisplacement": 2967,
        "transmission": "8단 자동",
        "fuelEfficiencyCombined": 10.8,
        "maxPower": 286,
        "maxTorque": 61.2,
        "seatingCapacity": 5
      }
    ]
  },
  {
    "brandSlug": "volkswagen",
    "nameKo": "ID.4",
    "nameEn": "ID.4",
    "slug": "vw-id4",
    "vehicleType": "SUV",
    "releaseYear": 2024,
    "minPrice": 56900000,
    "maxPrice": 59900000,
    "officialSiteUrl": "https://www.volkswagen.co.kr",
    "officialImageUrl": "https://www.volkswagen.co.kr/content/dam/vw-ngw/vw_pkw/importers/kr/logo/vw_logo.svg",
    "localMirrorUrl": "/images/cars/id4.svg",
    "sourceAttribution": "폭스바겐 코리아 공식 홈페이지",
    "generation": {
      "nameKo": "1세대 연식변경",
      "codeName": "ID.4",
      "startYear": 2023
    },
    "spec": {
      "lengthMm": 4585,
      "widthMm": 1850,
      "heightMm": 1615,
      "wheelbaseMm": 2765,
      "curbWeightKg": 2144
    },
    "trims": [
      {
        "nameKo": "Pro",
        "price": 59900000,
        "fuelType": "ELECTRIC",
        "transmission": "감속기",
        "electricEfficiencyCombined": 4.9,
        "maxPower": 204,
        "maxTorque": 31.6,
        "seatingCapacity": 5
      }
    ]
  },
  {
    "brandSlug": "lexus",
    "nameKo": "ES300h",
    "nameEn": "ES300h",
    "slug": "lexus-es",
    "vehicleType": "SEDAN",
    "releaseYear": 2024,
    "minPrice": 64800000,
    "maxPrice": 71600000,
    "officialSiteUrl": "https://www.lexus.co.kr",
    "officialImageUrl": "https://www.lexus.co.kr/assets/images/common/logo.png",
    "localMirrorUrl": "/images/cars/es.png",
    "sourceAttribution": "렉서스 코리아 공식 홈페이지",
    "generation": {
      "nameKo": "7세대 페이스리프트 (XZ10)",
      "codeName": "XZ10 PE",
      "startYear": 2021
    },
    "spec": {
      "lengthMm": 4975,
      "widthMm": 1865,
      "heightMm": 1445,
      "wheelbaseMm": 2870,
      "curbWeightKg": 1680
    },
    "trims": [
      {
        "nameKo": "럭셔리 플러스",
        "price": 66900000,
        "fuelType": "HYBRID",
        "engineDisplacement": 2487,
        "transmission": "e-CVT 무단변속기",
        "fuelEfficiencyCombined": 17.2,
        "maxPower": 218,
        "maxTorque": 22.5,
        "seatingCapacity": 5
      },
      {
        "nameKo": "이그제큐티브",
        "price": 71600000,
        "fuelType": "HYBRID",
        "engineDisplacement": 2487,
        "transmission": "e-CVT 무단변속기",
        "fuelEfficiencyCombined": 17.2,
        "maxPower": 218,
        "maxTorque": 22.5,
        "seatingCapacity": 5
      }
    ]
  },
  {
    "brandSlug": "lexus",
    "nameKo": "NX350h",
    "nameEn": "NX350h",
    "slug": "lexus-nx",
    "vehicleType": "SUV",
    "releaseYear": 2024,
    "minPrice": 65600000,
    "maxPrice": 75300000,
    "officialSiteUrl": "https://www.lexus.co.kr",
    "officialImageUrl": "https://www.lexus.co.kr/assets/images/common/logo.png",
    "localMirrorUrl": "/images/cars/nx.png",
    "sourceAttribution": "렉서스 코리아 공식 홈페이지",
    "generation": {
      "nameKo": "2세대 (AZ20)",
      "codeName": "AZ20",
      "startYear": 2022
    },
    "spec": {
      "lengthMm": 4660,
      "widthMm": 1865,
      "heightMm": 1670,
      "wheelbaseMm": 2690,
      "curbWeightKg": 1850
    },
    "trims": [
      {
        "nameKo": "프리미엄 AWD",
        "price": 65600000,
        "fuelType": "HYBRID",
        "engineDisplacement": 2487,
        "transmission": "e-CVT",
        "fuelEfficiencyCombined": 14.0,
        "maxPower": 242,
        "maxTorque": 24.7,
        "seatingCapacity": 5
      },
      {
        "nameKo": "NX450h+ F SPORT PHEV",
        "price": 75300000,
        "fuelType": "HYBRID",
        "engineDisplacement": 2487,
        "transmission": "e-CVT",
        "fuelEfficiencyCombined": 14.4,
        "maxPower": 309,
        "maxTorque": 27.5,
        "seatingCapacity": 5
      }
    ]
  },
  {
    "brandSlug": "lexus",
    "nameKo": "RX350h",
    "nameEn": "RX350h",
    "slug": "lexus-rx",
    "vehicleType": "SUV",
    "releaseYear": 2024,
    "minPrice": 98700000,
    "maxPrice": 117000000,
    "officialSiteUrl": "https://www.lexus.co.kr",
    "officialImageUrl": "https://www.lexus.co.kr/assets/images/common/logo.png",
    "localMirrorUrl": "/images/cars/rx.png",
    "sourceAttribution": "렉서스 코리아 공식 홈페이지",
    "generation": {
      "nameKo": "5세대 (ALA10)",
      "codeName": "ALA10",
      "startYear": 2023
    },
    "spec": {
      "lengthMm": 4890,
      "widthMm": 1920,
      "heightMm": 1695,
      "wheelbaseMm": 2850,
      "curbWeightKg": 2055
    },
    "trims": [
      {
        "nameKo": "럭셔리 AWD",
        "price": 98700000,
        "fuelType": "HYBRID",
        "engineDisplacement": 2487,
        "transmission": "e-CVT",
        "fuelEfficiencyCombined": 13.6,
        "maxPower": 249,
        "maxTorque": 24.6,
        "seatingCapacity": 5
      },
      {
        "nameKo": "RX500h F SPORT Performance",
        "price": 117000000,
        "fuelType": "HYBRID",
        "engineDisplacement": 2393,
        "transmission": "6단 자동",
        "fuelEfficiencyCombined": 10.0,
        "maxPower": 371,
        "maxTorque": 46.9,
        "seatingCapacity": 5
      }
    ]
  },
  {
    "brandSlug": "lexus",
    "nameKo": "UX300h",
    "nameEn": "UX300h",
    "slug": "lexus-ux",
    "vehicleType": "SUV",
    "releaseYear": 2024,
    "minPrice": 52400000,
    "maxPrice": 58700000,
    "officialSiteUrl": "https://www.lexus.co.kr",
    "officialImageUrl": "https://www.lexus.co.kr/assets/images/common/logo.png",
    "localMirrorUrl": "/images/cars/ux.png",
    "sourceAttribution": "렉서스 코리아 공식 홈페이지",
    "generation": {
      "nameKo": "1세대 2차 페이스리프트 (ZA10)",
      "codeName": "ZA10 PE2",
      "startYear": 2024
    },
    "spec": {
      "lengthMm": 4495,
      "widthMm": 1840,
      "heightMm": 1520,
      "wheelbaseMm": 2640,
      "curbWeightKg": 1590
    },
    "trims": [
      {
        "nameKo": "2WD",
        "price": 52400000,
        "fuelType": "HYBRID",
        "engineDisplacement": 1987,
        "transmission": "e-CVT",
        "fuelEfficiencyCombined": 18.0,
        "maxPower": 199,
        "maxTorque": 19.2,
        "seatingCapacity": 5
      }
    ]
  },
  {
    "brandSlug": "lexus",
    "nameKo": "LM500h",
    "nameEn": "LM500h",
    "slug": "lexus-lm",
    "vehicleType": "RV",
    "releaseYear": 2024,
    "minPrice": 148000000,
    "maxPrice": 196000000,
    "officialSiteUrl": "https://www.lexus.co.kr",
    "officialImageUrl": "https://www.lexus.co.kr/assets/images/common/logo.png",
    "localMirrorUrl": "/images/cars/lm.png",
    "sourceAttribution": "렉서스 코리아 공식 홈페이지",
    "generation": {
      "nameKo": "2세대 (AW30)",
      "codeName": "AW30",
      "startYear": 2024
    },
    "spec": {
      "lengthMm": 5125,
      "widthMm": 1890,
      "heightMm": 1955,
      "wheelbaseMm": 3000,
      "curbWeightKg": 2510
    },
    "trims": [
      {
        "nameKo": "6인승 이그제큐티브",
        "price": 148000000,
        "fuelType": "HYBRID",
        "engineDisplacement": 2393,
        "transmission": "6단 자동",
        "fuelEfficiencyCombined": 10.1,
        "maxPower": 371,
        "maxTorque": 46.9,
        "seatingCapacity": 6
      },
      {
        "nameKo": "4인승 로열",
        "price": 196000000,
        "fuelType": "HYBRID",
        "engineDisplacement": 2393,
        "transmission": "6단 자동",
        "fuelEfficiencyCombined": 10.1,
        "maxPower": 371,
        "maxTorque": 46.9,
        "seatingCapacity": 4
      }
    ]
  },
  {
    "brandSlug": "toyota",
    "nameKo": "프리우스",
    "nameEn": "Prius",
    "slug": "toyota-prius",
    "vehicleType": "HATCHBACK",
    "releaseYear": 2024,
    "minPrice": 39900000,
    "maxPrice": 49900000,
    "officialSiteUrl": "https://www.toyota.co.kr",
    "officialImageUrl": "https://www.toyota.co.kr/assets/images/common/logo.png",
    "localMirrorUrl": "/images/cars/prius.png",
    "sourceAttribution": "토요타 코리아 공식 홈페이지",
    "generation": {
      "nameKo": "5세대 (XW60)",
      "codeName": "XW60",
      "startYear": 2023
    },
    "spec": {
      "lengthMm": 4600,
      "widthMm": 1780,
      "heightMm": 1420,
      "wheelbaseMm": 2750,
      "curbWeightKg": 1445
    },
    "trims": [
      {
        "nameKo": "HEV XLE",
        "price": 43700000,
        "fuelType": "HYBRID",
        "engineDisplacement": 1987,
        "transmission": "e-CVT",
        "fuelEfficiencyCombined": 20.9,
        "maxPower": 196,
        "maxTorque": 19.2,
        "seatingCapacity": 5
      },
      {
        "nameKo": "PHEV XSE",
        "price": 49900000,
        "fuelType": "HYBRID",
        "engineDisplacement": 1987,
        "transmission": "e-CVT",
        "fuelEfficiencyCombined": 19.4,
        "maxPower": 223,
        "maxTorque": 19.2,
        "seatingCapacity": 5
      }
    ]
  },
  {
    "brandSlug": "toyota",
    "nameKo": "캠리",
    "nameEn": "Camry",
    "slug": "toyota-camry",
    "vehicleType": "SEDAN",
    "releaseYear": 2024,
    "minPrice": 48000000,
    "maxPrice": 53600000,
    "officialSiteUrl": "https://www.toyota.co.kr",
    "officialImageUrl": "https://www.toyota.co.kr/assets/images/common/logo.png",
    "localMirrorUrl": "/images/cars/camry.png",
    "sourceAttribution": "토요타 코리아 공식 홈페이지",
    "generation": {
      "nameKo": "9세대 (XV80)",
      "codeName": "XV80",
      "startYear": 2024
    },
    "spec": {
      "lengthMm": 4920,
      "widthMm": 1840,
      "heightMm": 1445,
      "wheelbaseMm": 2825,
      "curbWeightKg": 1600
    },
    "trims": [
      {
        "nameKo": "HEV XLE",
        "price": 48000000,
        "fuelType": "HYBRID",
        "engineDisplacement": 2487,
        "transmission": "e-CVT",
        "fuelEfficiencyCombined": 17.1,
        "maxPower": 228,
        "maxTorque": 22.5,
        "seatingCapacity": 5
      },
      {
        "nameKo": "HEV XSE",
        "price": 53600000,
        "fuelType": "HYBRID",
        "engineDisplacement": 2487,
        "transmission": "e-CVT",
        "fuelEfficiencyCombined": 17.1,
        "maxPower": 228,
        "maxTorque": 22.5,
        "seatingCapacity": 5
      }
    ]
  },
  {
    "brandSlug": "toyota",
    "nameKo": "RAV4",
    "nameEn": "RAV4",
    "slug": "toyota-rav4",
    "vehicleType": "SUV",
    "releaseYear": 2024,
    "minPrice": 44300000,
    "maxPrice": 55700000,
    "officialSiteUrl": "https://www.toyota.co.kr",
    "officialImageUrl": "https://www.toyota.co.kr/assets/images/common/logo.png",
    "localMirrorUrl": "/images/cars/rav4.png",
    "sourceAttribution": "토요타 코리아 공식 홈페이지",
    "generation": {
      "nameKo": "5세대 페이스리프트 (XA50)",
      "codeName": "XA50 PE",
      "startYear": 2022
    },
    "spec": {
      "lengthMm": 4600,
      "widthMm": 1855,
      "heightMm": 1685,
      "wheelbaseMm": 2690,
      "curbWeightKg": 1715
    },
    "trims": [
      {
        "nameKo": "HEV 2WD",
        "price": 44300000,
        "fuelType": "HYBRID",
        "engineDisplacement": 2487,
        "transmission": "e-CVT",
        "fuelEfficiencyCombined": 15.5,
        "maxPower": 218,
        "maxTorque": 22.5,
        "seatingCapacity": 5
      },
      {
        "nameKo": "PHEV 4WD",
        "price": 55700000,
        "fuelType": "HYBRID",
        "engineDisplacement": 2487,
        "transmission": "e-CVT",
        "fuelEfficiencyCombined": 15.6,
        "maxPower": 306,
        "maxTorque": 23.2,
        "seatingCapacity": 5
      }
    ]
  },
  {
    "brandSlug": "toyota",
    "nameKo": "크라운",
    "nameEn": "Crown",
    "slug": "toyota-crown",
    "vehicleType": "SEDAN",
    "releaseYear": 2024,
    "minPrice": 57500000,
    "maxPrice": 65700000,
    "officialSiteUrl": "https://www.toyota.co.kr",
    "officialImageUrl": "https://www.toyota.co.kr/assets/images/common/logo.png",
    "localMirrorUrl": "/images/cars/crown.png",
    "sourceAttribution": "토요타 코리아 공식 홈페이지",
    "generation": {
      "nameKo": "16세대 크로스오버 (SH35)",
      "codeName": "SH35",
      "startYear": 2023
    },
    "spec": {
      "lengthMm": 4980,
      "widthMm": 1840,
      "heightMm": 1540,
      "wheelbaseMm": 2850,
      "curbWeightKg": 1810
    },
    "trims": [
      {
        "nameKo": "크로스오버 2.5 HEV",
        "price": 57500000,
        "fuelType": "HYBRID",
        "engineDisplacement": 2487,
        "transmission": "e-CVT",
        "fuelEfficiencyCombined": 17.2,
        "maxPower": 239,
        "maxTorque": 22.5,
        "seatingCapacity": 5
      },
      {
        "nameKo": "크로스오버 2.4 터보 듀얼부스트 HEV",
        "price": 65700000,
        "fuelType": "HYBRID",
        "engineDisplacement": 2393,
        "transmission": "6단 자동",
        "fuelEfficiencyCombined": 11.0,
        "maxPower": 348,
        "maxTorque": 46.9,
        "seatingCapacity": 5
      }
    ]
  },
  {
    "brandSlug": "toyota",
    "nameKo": "알파드",
    "nameEn": "Alphard",
    "slug": "toyota-alphard",
    "vehicleType": "RV",
    "releaseYear": 2024,
    "minPrice": 99200000,
    "maxPrice": 99200000,
    "officialSiteUrl": "https://www.toyota.co.kr",
    "officialImageUrl": "https://www.toyota.co.kr/assets/images/common/logo.png",
    "localMirrorUrl": "/images/cars/alphard.png",
    "sourceAttribution": "토요타 코리아 공식 홈페이지",
    "generation": {
      "nameKo": "4세대 (AH40)",
      "codeName": "AH40",
      "startYear": 2023
    },
    "spec": {
      "lengthMm": 5005,
      "widthMm": 1850,
      "heightMm": 1955,
      "wheelbaseMm": 3000,
      "curbWeightKg": 2330
    },
    "trims": [
      {
        "nameKo": "2.5 HEV E-Four 이그제큐티브 라운지",
        "price": 99200000,
        "fuelType": "HYBRID",
        "engineDisplacement": 2487,
        "transmission": "e-CVT",
        "fuelEfficiencyCombined": 13.5,
        "maxPower": 250,
        "maxTorque": 24.4,
        "seatingCapacity": 7
      }
    ]
  },
  {
    "brandSlug": "toyota",
    "nameKo": "하이랜더",
    "nameEn": "Highlander",
    "slug": "toyota-highlander",
    "vehicleType": "SUV",
    "releaseYear": 2024,
    "minPrice": 66600000,
    "maxPrice": 74700000,
    "officialSiteUrl": "https://www.toyota.co.kr",
    "officialImageUrl": "https://www.toyota.co.kr/assets/images/common/logo.png",
    "localMirrorUrl": "/images/cars/highlander.png",
    "sourceAttribution": "토요타 코리아 공식 홈페이지",
    "generation": {
      "nameKo": "4세대 (XU70)",
      "codeName": "XU70",
      "startYear": 2023
    },
    "spec": {
      "lengthMm": 4965,
      "widthMm": 1930,
      "heightMm": 1755,
      "wheelbaseMm": 2850,
      "curbWeightKg": 2085
    },
    "trims": [
      {
        "nameKo": "2.5 HEV 리미티드 7인승",
        "price": 66600000,
        "fuelType": "HYBRID",
        "engineDisplacement": 2487,
        "transmission": "e-CVT",
        "fuelEfficiencyCombined": 13.8,
        "maxPower": 246,
        "maxTorque": 23.9,
        "seatingCapacity": 7
      },
      {
        "nameKo": "2.5 HEV 플래티넘 7인승",
        "price": 74700000,
        "fuelType": "HYBRID",
        "engineDisplacement": 2487,
        "transmission": "e-CVT",
        "fuelEfficiencyCombined": 13.8,
        "maxPower": 246,
        "maxTorque": 23.9,
        "seatingCapacity": 7
      }
    ]
  },
  {
    "brandSlug": "land-rover",
    "nameKo": "디펜더",
    "nameEn": "Defender",
    "slug": "landrover-defender",
    "vehicleType": "SUV",
    "releaseYear": 2024,
    "minPrice": 109900000,
    "maxPrice": 186300000,
    "officialSiteUrl": "https://www.landrover.co.kr",
    "officialImageUrl": "https://www.landrover.co.kr/static/shared/images/land-rover-logo.svg",
    "localMirrorUrl": "/images/cars/defender.svg",
    "sourceAttribution": "랜드로버 코리아 공식 홈페이지",
    "generation": {
      "nameKo": "2세대 (L663)",
      "codeName": "L663",
      "startYear": 2020
    },
    "spec": {
      "lengthMm": 5018,
      "widthMm": 1996,
      "heightMm": 1967,
      "wheelbaseMm": 3022,
      "curbWeightKg": 2505
    },
    "trims": [
      {
        "nameKo": "110 D250 SE",
        "price": 109900000,
        "fuelType": "DIESEL",
        "engineDisplacement": 2996,
        "transmission": "8단 자동",
        "fuelEfficiencyCombined": 9.8,
        "maxPower": 249,
        "maxTorque": 58.1,
        "seatingCapacity": 5
      },
      {
        "nameKo": "110 P400 X",
        "price": 147700000,
        "fuelType": "GASOLINE",
        "engineDisplacement": 2996,
        "transmission": "8단 자동",
        "fuelEfficiencyCombined": 7.4,
        "maxPower": 400,
        "maxTorque": 56.1,
        "seatingCapacity": 5
      }
    ]
  },
  {
    "brandSlug": "land-rover",
    "nameKo": "디스커버리",
    "nameEn": "Discovery",
    "slug": "landrover-discovery",
    "vehicleType": "SUV",
    "releaseYear": 2024,
    "minPrice": 95600000,
    "maxPrice": 140200000,
    "officialSiteUrl": "https://www.landrover.co.kr",
    "officialImageUrl": "https://www.landrover.co.kr/static/shared/images/land-rover-logo.svg",
    "localMirrorUrl": "/images/cars/discovery.svg",
    "sourceAttribution": "랜드로버 코리아 공식 홈페이지",
    "generation": {
      "nameKo": "5세대 페이스리프트 (L462)",
      "codeName": "L462 PE",
      "startYear": 2021
    },
    "spec": {
      "lengthMm": 4956,
      "widthMm": 2000,
      "heightMm": 1888,
      "wheelbaseMm": 2923,
      "curbWeightKg": 2435
    },
    "trims": [
      {
        "nameKo": "D250 S",
        "price": 95600000,
        "fuelType": "DIESEL",
        "engineDisplacement": 2996,
        "transmission": "8단 자동",
        "fuelEfficiencyCombined": 10.3,
        "maxPower": 249,
        "maxTorque": 58.1,
        "seatingCapacity": 7
      },
      {
        "nameKo": "D300 다이내믹 HSE",
        "price": 119900000,
        "fuelType": "DIESEL",
        "engineDisplacement": 2996,
        "transmission": "8단 자동",
        "fuelEfficiencyCombined": 9.9,
        "maxPower": 300,
        "maxTorque": 66.3,
        "seatingCapacity": 7
      }
    ]
  },
  {
    "brandSlug": "land-rover",
    "nameKo": "레인지로버",
    "nameEn": "Range Rover",
    "slug": "landrover-range-rover",
    "vehicleType": "SUV",
    "releaseYear": 2024,
    "minPrice": 222400000,
    "maxPrice": 362400000,
    "officialSiteUrl": "https://www.landrover.co.kr",
    "officialImageUrl": "https://www.landrover.co.kr/static/shared/images/land-rover-logo.svg",
    "localMirrorUrl": "/images/cars/range-rover.svg",
    "sourceAttribution": "랜드로버 코리아 공식 홈페이지",
    "generation": {
      "nameKo": "5세대 (L460)",
      "codeName": "L460",
      "startYear": 2022
    },
    "spec": {
      "lengthMm": 5052,
      "widthMm": 2047,
      "heightMm": 1870,
      "wheelbaseMm": 2997,
      "curbWeightKg": 2630
    },
    "trims": [
      {
        "nameKo": "SWB D350 오토바이오그래피",
        "price": 222400000,
        "fuelType": "DIESEL",
        "engineDisplacement": 2996,
        "transmission": "8단 자동",
        "fuelEfficiencyCombined": 10.1,
        "maxPower": 350,
        "maxTorque": 71.4,
        "seatingCapacity": 5
      },
      {
        "nameKo": "LWB P530 오토바이오그래피 7인승",
        "price": 312000000,
        "fuelType": "GASOLINE",
        "engineDisplacement": 4395,
        "transmission": "8단 자동",
        "fuelEfficiencyCombined": 6.8,
        "maxPower": 530,
        "maxTorque": 76.5,
        "seatingCapacity": 7
      }
    ]
  },
  {
    "brandSlug": "land-rover",
    "nameKo": "레인지로버 스포츠",
    "nameEn": "Range Rover Sport",
    "slug": "landrover-range-rover-sport",
    "vehicleType": "SUV",
    "releaseYear": 2024,
    "minPrice": 150300000,
    "maxPrice": 182900000,
    "officialSiteUrl": "https://www.landrover.co.kr",
    "officialImageUrl": "https://www.landrover.co.kr/static/shared/images/land-rover-logo.svg",
    "localMirrorUrl": "/images/cars/range-rover-sport.svg",
    "sourceAttribution": "랜드로버 코리아 공식 홈페이지",
    "generation": {
      "nameKo": "3세대 (L461)",
      "codeName": "L461",
      "startYear": 2022
    },
    "spec": {
      "lengthMm": 4946,
      "widthMm": 2047,
      "heightMm": 1820,
      "wheelbaseMm": 2997,
      "curbWeightKg": 2490
    },
    "trims": [
      {
        "nameKo": "D300 다이내믹 HSE",
        "price": 150300000,
        "fuelType": "DIESEL",
        "engineDisplacement": 2996,
        "transmission": "8단 자동",
        "fuelEfficiencyCombined": 10.4,
        "maxPower": 300,
        "maxTorque": 66.3,
        "seatingCapacity": 5
      },
      {
        "nameKo": "P360 다이내믹 HSE",
        "price": 158000000,
        "fuelType": "GASOLINE",
        "engineDisplacement": 2996,
        "transmission": "8단 자동",
        "fuelEfficiencyCombined": 8.0,
        "maxPower": 360,
        "maxTorque": 51.0,
        "seatingCapacity": 5
      }
    ]
  },
  {
    "brandSlug": "mini",
    "nameKo": "뉴 MINI 쿠퍼",
    "nameEn": "New MINI Cooper",
    "slug": "mini-cooper",
    "vehicleType": "HATCHBACK",
    "releaseYear": 2024,
    "minPrice": 37400000,
    "maxPrice": 52100000,
    "officialSiteUrl": "https://www.mini.co.kr",
    "officialImageUrl": "https://www.mini.co.kr/content/dam/mini/common/mini-logo.png",
    "localMirrorUrl": "/images/cars/mini-cooper.png",
    "sourceAttribution": "MINI 코리아 공식 홈페이지",
    "generation": {
      "nameKo": "4세대 (F66)",
      "codeName": "F66",
      "startYear": 2024
    },
    "spec": {
      "lengthMm": 3875,
      "widthMm": 1745,
      "heightMm": 1430,
      "wheelbaseMm": 2495,
      "curbWeightKg": 1335
    },
    "trims": [
      {
        "nameKo": "쿠퍼 C 에센셜",
        "price": 37400000,
        "fuelType": "GASOLINE",
        "engineDisplacement": 1499,
        "transmission": "7단 스텝트로닉",
        "fuelEfficiencyCombined": 12.7,
        "maxPower": 163,
        "maxTorque": 25.5,
        "seatingCapacity": 4
      },
      {
        "nameKo": "쿠퍼 S 클래식",
        "price": 48100000,
        "fuelType": "GASOLINE",
        "engineDisplacement": 1998,
        "transmission": "7단 스텝트로닉",
        "fuelEfficiencyCombined": 11.6,
        "maxPower": 204,
        "maxTorque": 30.6,
        "seatingCapacity": 4
      }
    ]
  },
  {
    "brandSlug": "mini",
    "nameKo": "뉴 MINI 컨트리맨",
    "nameEn": "New MINI Countryman",
    "slug": "mini-countryman",
    "vehicleType": "SUV",
    "releaseYear": 2024,
    "minPrice": 49900000,
    "maxPrice": 67000000,
    "officialSiteUrl": "https://www.mini.co.kr",
    "officialImageUrl": "https://www.mini.co.kr/content/dam/mini/common/mini-logo.png",
    "localMirrorUrl": "/images/cars/mini-countryman.png",
    "sourceAttribution": "MINI 코리아 공식 홈페이지",
    "generation": {
      "nameKo": "3세대 (U25)",
      "codeName": "U25",
      "startYear": 2024
    },
    "spec": {
      "lengthMm": 4445,
      "widthMm": 1845,
      "heightMm": 1660,
      "wheelbaseMm": 2690,
      "curbWeightKg": 1640
    },
    "trims": [
      {
        "nameKo": "컨트리맨 C 클래식",
        "price": 49900000,
        "fuelType": "GASOLINE",
        "engineDisplacement": 1499,
        "transmission": "7단 스텝트로닉",
        "fuelEfficiencyCombined": 12.0,
        "maxPower": 170,
        "maxTorque": 28.6,
        "seatingCapacity": 5
      },
      {
        "nameKo": "컨트리맨 S ALL4 페이버드",
        "price": 57000000,
        "fuelType": "GASOLINE",
        "engineDisplacement": 1998,
        "transmission": "7단 스텝트로닉",
        "fuelEfficiencyCombined": 10.8,
        "maxPower": 218,
        "maxTorque": 35.7,
        "seatingCapacity": 5
      }
    ]
  },
  {
    "brandSlug": "mini",
    "nameKo": "MINI 에이스맨",
    "nameEn": "MINI Aceman",
    "slug": "mini-aceman",
    "vehicleType": "SUV",
    "releaseYear": 2024,
    "minPrice": 49500000,
    "maxPrice": 57500000,
    "officialSiteUrl": "https://www.mini.co.kr",
    "officialImageUrl": "https://www.mini.co.kr/content/dam/mini/common/mini-logo.png",
    "localMirrorUrl": "/images/cars/mini-aceman.png",
    "sourceAttribution": "MINI 코리아 공식 홈페이지",
    "generation": {
      "nameKo": "1세대 (J05)",
      "codeName": "J05",
      "startYear": 2024
    },
    "spec": {
      "lengthMm": 4075,
      "widthMm": 1755,
      "heightMm": 1495,
      "wheelbaseMm": 2605,
      "curbWeightKg": 1710
    },
    "trims": [
      {
        "nameKo": "에이스맨 E",
        "price": 49500000,
        "fuelType": "ELECTRIC",
        "transmission": "감속기",
        "electricEfficiencyCombined": 5.1,
        "maxPower": 184,
        "maxTorque": 29.6,
        "seatingCapacity": 5
      },
      {
        "nameKo": "에이스맨 SE",
        "price": 57500000,
        "fuelType": "ELECTRIC",
        "transmission": "감속기",
        "electricEfficiencyCombined": 4.8,
        "maxPower": 218,
        "maxTorque": 33.7,
        "seatingCapacity": 5
      }
    ]
  },
  {
    "brandSlug": "polestar",
    "nameKo": "폴스타 2",
    "nameEn": "Polestar 2",
    "slug": "polestar-2",
    "vehicleType": "SEDAN",
    "releaseYear": 2024,
    "minPrice": 55900000,
    "maxPrice": 60900000,
    "officialSiteUrl": "https://www.polestar.com/kr/polestar-2/",
    "officialImageUrl": "https://www.polestar.com/static/shared/polestar-symbol.svg",
    "localMirrorUrl": "/images/cars/polestar-2.svg",
    "sourceAttribution": "폴스타 코리아 공식 홈페이지",
    "generation": {
      "nameKo": "1세대 페이스리프트",
      "codeName": "Polestar 2 PE",
      "startYear": 2023
    },
    "spec": {
      "lengthMm": 4605,
      "widthMm": 1860,
      "heightMm": 1480,
      "wheelbaseMm": 2735,
      "curbWeightKg": 2010
    },
    "trims": [
      {
        "nameKo": "롱레인지 싱글모터",
        "price": 55900000,
        "fuelType": "ELECTRIC",
        "transmission": "감속기",
        "electricEfficiencyCombined": 4.8,
        "maxPower": 299,
        "maxTorque": 49.9,
        "seatingCapacity": 5
      },
      {
        "nameKo": "롱레인지 듀얼모터",
        "price": 60900000,
        "fuelType": "ELECTRIC",
        "transmission": "감속기",
        "electricEfficiencyCombined": 4.4,
        "maxPower": 421,
        "maxTorque": 75.5,
        "seatingCapacity": 5
      }
    ]
  },
  {
    "brandSlug": "polestar",
    "nameKo": "폴스타 4",
    "nameEn": "Polestar 4",
    "slug": "polestar-4",
    "vehicleType": "SUV",
    "releaseYear": 2024,
    "minPrice": 66900000,
    "maxPrice": 71900000,
    "officialSiteUrl": "https://www.polestar.com/kr/polestar-4/",
    "officialImageUrl": "https://www.polestar.com/static/shared/polestar-symbol.svg",
    "localMirrorUrl": "/images/cars/polestar-4.svg",
    "sourceAttribution": "폴스타 코리아 공식 홈페이지",
    "generation": {
      "nameKo": "1세대",
      "codeName": "Polestar 4",
      "startYear": 2024
    },
    "spec": {
      "lengthMm": 4840,
      "widthMm": 2008,
      "heightMm": 1534,
      "wheelbaseMm": 2999,
      "curbWeightKg": 2230
    },
    "trims": [
      {
        "nameKo": "롱레인지 싱글모터",
        "price": 66900000,
        "fuelType": "ELECTRIC",
        "transmission": "감속기",
        "electricEfficiencyCombined": 4.7,
        "maxPower": 272,
        "maxTorque": 35.0,
        "seatingCapacity": 5
      },
      {
        "nameKo": "롱레인지 듀얼모터",
        "price": 71900000,
        "fuelType": "ELECTRIC",
        "transmission": "감속기",
        "electricEfficiencyCombined": 4.3,
        "maxPower": 544,
        "maxTorque": 70.0,
        "seatingCapacity": 5
      }
    ]
  },
  {
    "brandSlug": "ford",
    "nameKo": "익스플로러",
    "nameEn": "Explorer",
    "slug": "ford-explorer",
    "vehicleType": "SUV",
    "releaseYear": 2024,
    "minPrice": 68650000,
    "maxPrice": 78950000,
    "officialSiteUrl": "https://www.ford-korea.com",
    "officialImageUrl": "https://www.ford-korea.com/content/dam/ford-korea/logo/ford_logo.png",
    "localMirrorUrl": "/images/cars/explorer.png",
    "sourceAttribution": "포드 코리아 공식 홈페이지",
    "generation": {
      "nameKo": "6세대 페이스리프트 (U625)",
      "codeName": "U625 PE",
      "startYear": 2024
    },
    "spec": {
      "lengthMm": 5050,
      "widthMm": 2005,
      "heightMm": 1775,
      "wheelbaseMm": 3025,
      "curbWeightKg": 2150
    },
    "trims": [
      {
        "nameKo": "2.3 EcoBoost 리미티드 4WD",
        "price": 68650000,
        "fuelType": "GASOLINE",
        "engineDisplacement": 2261,
        "transmission": "10단 자동",
        "fuelEfficiencyCombined": 8.9,
        "maxPower": 304,
        "maxTorque": 42.9,
        "seatingCapacity": 7
      },
      {
        "nameKo": "3.0 EcoBoost 플래티넘 4WD",
        "price": 78950000,
        "fuelType": "GASOLINE",
        "engineDisplacement": 2956,
        "transmission": "10단 자동",
        "fuelEfficiencyCombined": 8.3,
        "maxPower": 370,
        "maxTorque": 54.0,
        "seatingCapacity": 6
      }
    ]
  },
  {
    "brandSlug": "ford",
    "nameKo": "올 뉴 머스탱",
    "nameEn": "All New Mustang",
    "slug": "ford-mustang",
    "vehicleType": "COUPE",
    "releaseYear": 2024,
    "minPrice": 59900000,
    "maxPrice": 79900000,
    "officialSiteUrl": "https://www.ford-korea.com",
    "officialImageUrl": "https://www.ford-korea.com/content/dam/ford-korea/logo/ford_logo.png",
    "localMirrorUrl": "/images/cars/mustang.png",
    "sourceAttribution": "포드 코리아 공식 홈페이지",
    "generation": {
      "nameKo": "7세대 (S650)",
      "codeName": "S650",
      "startYear": 2024
    },
    "spec": {
      "lengthMm": 4810,
      "widthMm": 1915,
      "heightMm": 1395,
      "wheelbaseMm": 2720,
      "curbWeightKg": 1690
    },
    "trims": [
      {
        "nameKo": "2.3 EcoBoost 쿠페",
        "price": 59900000,
        "fuelType": "GASOLINE",
        "engineDisplacement": 2261,
        "transmission": "10단 자동",
        "fuelEfficiencyCombined": 9.6,
        "maxPower": 319,
        "maxTorque": 48.4,
        "seatingCapacity": 4
      },
      {
        "nameKo": "5.0 GT 쿠페",
        "price": 79900000,
        "fuelType": "GASOLINE",
        "engineDisplacement": 5038,
        "transmission": "10단 자동",
        "fuelEfficiencyCombined": 7.2,
        "maxPower": 493,
        "maxTorque": 57.8,
        "seatingCapacity": 4
      }
    ]
  },
  {
    "brandSlug": "ford",
    "nameKo": "브롱코",
    "nameEn": "Bronco",
    "slug": "ford-bronco",
    "vehicleType": "SUV",
    "releaseYear": 2024,
    "minPrice": 81600000,
    "maxPrice": 81600000,
    "officialSiteUrl": "https://www.ford-korea.com",
    "officialImageUrl": "https://www.ford-korea.com/content/dam/ford-korea/logo/ford_logo.png",
    "localMirrorUrl": "/images/cars/bronco.png",
    "sourceAttribution": "포드 코리아 공식 홈페이지",
    "generation": {
      "nameKo": "6세대 (U725)",
      "codeName": "U725",
      "startYear": 2022
    },
    "spec": {
      "lengthMm": 4810,
      "widthMm": 1930,
      "heightMm": 1845,
      "wheelbaseMm": 2950,
      "curbWeightKg": 2295
    },
    "trims": [
      {
        "nameKo": "2.7 EcoBoost 아우터뱅크스 4도어",
        "price": 81600000,
        "fuelType": "GASOLINE",
        "engineDisplacement": 2694,
        "transmission": "10단 자동",
        "fuelEfficiencyCombined": 8.2,
        "maxPower": 314,
        "maxTorque": 55.3,
        "seatingCapacity": 5
      }
    ]
  },
  {
    "brandSlug": "honda",
    "nameKo": "올 뉴 어코드",
    "nameEn": "All New Accord",
    "slug": "honda-accord",
    "vehicleType": "SEDAN",
    "releaseYear": 2024,
    "minPrice": 43900000,
    "maxPrice": 53400000,
    "officialSiteUrl": "https://www.honda.co.kr",
    "officialImageUrl": "https://www.honda.co.kr/assets/images/common/logo.png",
    "localMirrorUrl": "/images/cars/accord.png",
    "sourceAttribution": "혼다 코리아 공식 홈페이지",
    "generation": {
      "nameKo": "11세대 (CY)",
      "codeName": "CY",
      "startYear": 2023
    },
    "spec": {
      "lengthMm": 4970,
      "widthMm": 1860,
      "heightMm": 1450,
      "wheelbaseMm": 2830,
      "curbWeightKg": 1585
    },
    "trims": [
      {
        "nameKo": "1.5 가솔린 터보",
        "price": 43900000,
        "fuelType": "GASOLINE",
        "engineDisplacement": 1498,
        "transmission": "CVT 무단변속기",
        "fuelEfficiencyCombined": 12.9,
        "maxPower": 190,
        "maxTorque": 26.5,
        "seatingCapacity": 5
      },
      {
        "nameKo": "2.0 하이브리드 투어링",
        "price": 53400000,
        "fuelType": "HYBRID",
        "engineDisplacement": 1993,
        "transmission": "e-CVT",
        "fuelEfficiencyCombined": 16.7,
        "maxPower": 207,
        "maxTorque": 34.0,
        "seatingCapacity": 5
      }
    ]
  },
  {
    "brandSlug": "honda",
    "nameKo": "올 뉴 CR-V",
    "nameEn": "All New CR-V",
    "slug": "honda-cr-v",
    "vehicleType": "SUV",
    "releaseYear": 2024,
    "minPrice": 42600000,
    "maxPrice": 55900000,
    "officialSiteUrl": "https://www.honda.co.kr",
    "officialImageUrl": "https://www.honda.co.kr/assets/images/common/logo.png",
    "localMirrorUrl": "/images/cars/cr-v.png",
    "sourceAttribution": "혼다 코리아 공식 홈페이지",
    "generation": {
      "nameKo": "6세대 (RS)",
      "codeName": "RS",
      "startYear": 2023
    },
    "spec": {
      "lengthMm": 4705,
      "widthMm": 1865,
      "heightMm": 1690,
      "wheelbaseMm": 2700,
      "curbWeightKg": 1720
    },
    "trims": [
      {
        "nameKo": "1.5 터보 EX-L",
        "price": 42600000,
        "fuelType": "GASOLINE",
        "engineDisplacement": 1498,
        "transmission": "CVT",
        "fuelEfficiencyCombined": 12.1,
        "maxPower": 190,
        "maxTorque": 24.5,
        "seatingCapacity": 5
      },
      {
        "nameKo": "2.0 하이브리드 투어링 4WD",
        "price": 55900000,
        "fuelType": "HYBRID",
        "engineDisplacement": 1993,
        "transmission": "e-CVT",
        "fuelEfficiencyCombined": 14.0,
        "maxPower": 207,
        "maxTorque": 34.0,
        "seatingCapacity": 5
      }
    ]
  },
  {
    "brandSlug": "honda",
    "nameKo": "올 뉴 파일럿",
    "nameEn": "All New Pilot",
    "slug": "honda-pilot",
    "vehicleType": "SUV",
    "releaseYear": 2024,
    "minPrice": 69400000,
    "maxPrice": 69400000,
    "officialSiteUrl": "https://www.honda.co.kr",
    "officialImageUrl": "https://www.honda.co.kr/assets/images/common/logo.png",
    "localMirrorUrl": "/images/cars/pilot.png",
    "sourceAttribution": "혼다 코리아 공식 홈페이지",
    "generation": {
      "nameKo": "4세대 (YG)",
      "codeName": "YG",
      "startYear": 2023
    },
    "spec": {
      "lengthMm": 5075,
      "widthMm": 1995,
      "heightMm": 1800,
      "wheelbaseMm": 2890,
      "curbWeightKg": 2130
    },
    "trims": [
      {
        "nameKo": "3.5 가솔린 엘리트 8인승",
        "price": 69400000,
        "fuelType": "GASOLINE",
        "engineDisplacement": 3471,
        "transmission": "10단 자동",
        "fuelEfficiencyCombined": 8.4,
        "maxPower": 289,
        "maxTorque": 36.2,
        "seatingCapacity": 8
      }
    ]
  },
  {
    "brandSlug": "jeep",
    "nameKo": "더 뉴 랭글러",
    "nameEn": "The New Wrangler",
    "slug": "jeep-wrangler",
    "vehicleType": "SUV",
    "releaseYear": 2024,
    "minPrice": 69700000,
    "maxPrice": 83900000,
    "officialSiteUrl": "https://www.jeep.co.kr",
    "officialImageUrl": "https://www.jeep.co.kr/content/dam/jeep/logo.png",
    "localMirrorUrl": "/images/cars/wrangler.png",
    "sourceAttribution": "지프 코리아 공식 홈페이지",
    "generation": {
      "nameKo": "4세대 페이스리프트 (JL)",
      "codeName": "JL PE",
      "startYear": 2024
    },
    "spec": {
      "lengthMm": 4810,
      "widthMm": 1895,
      "heightMm": 1840,
      "wheelbaseMm": 3010,
      "curbWeightKg": 2010
    },
    "trims": [
      {
        "nameKo": "사하라 4도어 하드탑",
        "price": 78900000,
        "fuelType": "GASOLINE",
        "engineDisplacement": 1995,
        "transmission": "8단 자동",
        "fuelEfficiencyCombined": 8.0,
        "maxPower": 272,
        "maxTorque": 40.8,
        "seatingCapacity": 5
      },
      {
        "nameKo": "루비콘 4도어 파워탑",
        "price": 83900000,
        "fuelType": "GASOLINE",
        "engineDisplacement": 1995,
        "transmission": "8단 자동",
        "fuelEfficiencyCombined": 7.5,
        "maxPower": 272,
        "maxTorque": 40.8,
        "seatingCapacity": 5
      }
    ]
  },
  {
    "brandSlug": "jeep",
    "nameKo": "그랜드 체로키",
    "nameEn": "Grand Cherokee",
    "slug": "jeep-grand-cherokee",
    "vehicleType": "SUV",
    "releaseYear": 2024,
    "minPrice": 76900000,
    "maxPrice": 111900000,
    "officialSiteUrl": "https://www.jeep.co.kr",
    "officialImageUrl": "https://www.jeep.co.kr/content/dam/jeep/logo.png",
    "localMirrorUrl": "/images/cars/grand-cherokee.png",
    "sourceAttribution": "지프 코리아 공식 홈페이지",
    "generation": {
      "nameKo": "5세대 (WL)",
      "codeName": "WL",
      "startYear": 2022
    },
    "spec": {
      "lengthMm": 4900,
      "widthMm": 1980,
      "heightMm": 1790,
      "wheelbaseMm": 2965,
      "curbWeightKg": 2190
    },
    "trims": [
      {
        "nameKo": "3.6 가솔린 리미티드 4WD",
        "price": 76900000,
        "fuelType": "GASOLINE",
        "engineDisplacement": 3604,
        "transmission": "8단 자동",
        "fuelEfficiencyCombined": 7.4,
        "maxPower": 286,
        "maxTorque": 35.1,
        "seatingCapacity": 5
      },
      {
        "nameKo": "3.6 가솔린 오버랜드 4WD",
        "price": 84700000,
        "fuelType": "GASOLINE",
        "engineDisplacement": 3604,
        "transmission": "8단 자동",
        "fuelEfficiencyCombined": 7.4,
        "maxPower": 286,
        "maxTorque": 35.1,
        "seatingCapacity": 5
      },
      {
        "nameKo": "4xe PHEV 서밋 리저브",
        "price": 111900000,
        "fuelType": "HYBRID",
        "engineDisplacement": 1995,
        "transmission": "8단 자동",
        "fuelEfficiencyCombined": 8.8,
        "maxPower": 375,
        "maxTorque": 65.0,
        "seatingCapacity": 5
      }
    ]
  },
  {
    "brandSlug": "jeep",
    "nameKo": "어벤저",
    "nameEn": "Avenger",
    "slug": "jeep-avenger",
    "vehicleType": "SUV",
    "releaseYear": 2024,
    "minPrice": 52900000,
    "maxPrice": 56400000,
    "officialSiteUrl": "https://www.jeep.co.kr",
    "officialImageUrl": "https://www.jeep.co.kr/content/dam/jeep/logo.png",
    "localMirrorUrl": "/images/cars/avenger.png",
    "sourceAttribution": "지프 코리아 공식 홈페이지",
    "generation": {
      "nameKo": "1세대 EV (JJ)",
      "codeName": "JJ",
      "startYear": 2024
    },
    "spec": {
      "lengthMm": 4084,
      "widthMm": 1776,
      "heightMm": 1528,
      "wheelbaseMm": 2562,
      "curbWeightKg": 1520
    },
    "trims": [
      {
        "nameKo": "론지튜드",
        "price": 52900000,
        "fuelType": "ELECTRIC",
        "transmission": "감속기",
        "electricEfficiencyCombined": 5.0,
        "maxPower": 156,
        "maxTorque": 26.5,
        "seatingCapacity": 5
      },
      {
        "nameKo": "알티튜드",
        "price": 56400000,
        "fuelType": "ELECTRIC",
        "transmission": "감속기",
        "electricEfficiencyCombined": 5.0,
        "maxPower": 156,
        "maxTorque": 26.5,
        "seatingCapacity": 5
      }
    ]
  }
];
