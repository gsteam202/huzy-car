import "dotenv/config";
import { prisma } from "../src/lib/db";
import { hash } from "@node-rs/argon2";

async function main() {
  console.log("Starting CAR HUZY database seed...");

  // 1. Boards
  const boardsData = [
    { slug: "free", name: "자유게시판", description: "자동차와 일상 이야기를 나누는 공간", orderIndex: 1 },
    { slug: "new-car-consult", name: "신차 구매 상담", description: "신차 견적 및 할인 조건 문의", orderIndex: 2 },
    { slug: "used-car-consult", name: "중고차 구매 상담", description: "중고차 시세 및 매물 검증 상담", orderIndex: 3 },
    { slug: "recommend-qna", name: "예산별 차량 추천", description: "내 자금과 월 납입금에 맞는 차량 질문", orderIndex: 4 },
    { slug: "maintenance", name: "유지비 & 정비", description: "유류비, 자동차세, 소모품 및 수리 팁", orderIndex: 5 },
    { slug: "review", name: "출고 후기 & 오너 리뷰", description: "실제 차주들의 생생한 주행 후기", orderIndex: 6 },
  ];

  for (const b of boardsData) {
    await prisma.board.upsert({
      where: { slug: b.slug },
      update: b,
      create: b,
    });
  }
  console.log("Boards seeded.");

  // 2. Initial Admin User
  const adminPasswordHash = await hash("admin1234!@#$");
  const adminUser = await prisma.user.upsert({
    where: { email: "admin@huzy.net" },
    update: {
      role: "ADMIN",
    },
    create: {
      email: "admin@huzy.net",
      nickname: "카휴지관리자",
      passwordHash: adminPasswordHash,
      role: "ADMIN",
      marketingConsent: true,
    },
  });
  console.log("Admin user seeded (admin@huzy.net).");

  // Sample Normal User
  const demoPasswordHash = await hash("caruser1234!");
  const demoUser = await prisma.user.upsert({
    where: { email: "user@huzy.net" },
    update: {},
    create: {
      email: "user@huzy.net",
      nickname: "달려라붕붕이",
      passwordHash: demoPasswordHash,
      role: "USER",
      marketingConsent: true,
    },
  });

  // 3. Brands
  const brandsData = [
    {
      nameKo: "현대",
      nameEn: "Hyundai",
      slug: "hyundai",
      country: "KOREA" as const,
      orderIndex: 1,
      logoUrl: "https://images.unsplash.com/photo-1617814076367-b759c7d7e738?w=128&q=80",
    },
    {
      nameKo: "기아",
      nameEn: "Kia",
      slug: "kia",
      country: "KOREA" as const,
      orderIndex: 2,
      logoUrl: "https://images.unsplash.com/photo-1617469767053-d3b523a0b982?w=128&q=80",
    },
    {
      nameKo: "제네시스",
      nameEn: "Genesis",
      slug: "genesis",
      country: "KOREA" as const,
      orderIndex: 3,
      logoUrl: "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=128&q=80",
    },
    {
      nameKo: "KG모빌리티",
      nameEn: "KGM",
      slug: "kgm",
      country: "KOREA" as const,
      orderIndex: 4,
      logoUrl: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=128&q=80",
    },
    {
      nameKo: "BMW",
      nameEn: "BMW",
      slug: "bmw",
      country: "IMPORTED" as const,
      orderIndex: 5,
      logoUrl: "https://images.unsplash.com/photo-1555353540-64580b51c258?w=128&q=80",
    },
    {
      nameKo: "메르세데스-벤츠",
      nameEn: "Mercedes-Benz",
      slug: "mercedes-benz",
      country: "IMPORTED" as const,
      orderIndex: 6,
      logoUrl: "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=128&q=80",
    },
    {
      nameKo: "테슬라",
      nameEn: "Tesla",
      slug: "tesla",
      country: "IMPORTED" as const,
      orderIndex: 7,
      logoUrl: "https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=128&q=80",
    },
  ];

  const brandMap = new Map<string, string>();
  for (const b of brandsData) {
    const brand = await prisma.carBrand.upsert({
      where: { slug: b.slug },
      update: b,
      create: b,
    });
    brandMap.set(b.slug, brand.id);
  }
  console.log("Brands seeded.");

  // 4. Models, Generations, Trims, Specs
  const modelsData = [
    // 현대 아반떼
    {
      brandSlug: "hyundai",
      nameKo: "아반떼",
      nameEn: "Avante",
      slug: "avante",
      vehicleType: "SEDAN" as const,
      releaseYear: 2024,
      minPrice: 19940000,
      maxPrice: 32140000,
      imageUrl: "https://images.unsplash.com/photo-1590362891991-f776e747a588?w=800&q=80",
      generation: {
        nameKo: "7세대 페이스리프트 (CN7)",
        codeName: "CN7 PE",
        startYear: 2023,
      },
      trims: [
        {
          nameKo: "1.6 가솔린 스마트",
          price: 19940000,
          fuelType: "GASOLINE" as const,
          engineDisplacement: 1598,
          transmission: "IVT 무단변속기",
          fuelEfficiencyCombined: 15.3,
          maxPower: 123,
          maxTorque: 15.7,
          seatingCapacity: 5,
        },
        {
          nameKo: "1.6 가솔린 모던",
          price: 23140000,
          fuelType: "GASOLINE" as const,
          engineDisplacement: 1598,
          transmission: "IVT 무단변속기",
          fuelEfficiencyCombined: 15.0,
          maxPower: 123,
          maxTorque: 15.7,
          seatingCapacity: 5,
        },
        {
          nameKo: "1.6 가솔린 인스퍼레이션",
          price: 27150000,
          fuelType: "GASOLINE" as const,
          engineDisplacement: 1598,
          transmission: "IVT 무단변속기",
          fuelEfficiencyCombined: 14.8,
          maxPower: 123,
          maxTorque: 15.7,
          seatingCapacity: 5,
        },
        {
          nameKo: "1.6 하이브리드 인스퍼레이션",
          price: 32140000,
          fuelType: "HYBRID" as const,
          engineDisplacement: 1580,
          transmission: "6단 DCT",
          fuelEfficiencyCombined: 21.1,
          maxPower: 141,
          maxTorque: 27.0,
          seatingCapacity: 5,
        },
      ],
    },
    // 현대 쏘나타
    {
      brandSlug: "hyundai",
      nameKo: "쏘나타 디 엣지",
      nameEn: "Sonata The Edge",
      slug: "sonata-the-edge",
      vehicleType: "SEDAN" as const,
      releaseYear: 2024,
      minPrice: 28080000,
      maxPrice: 39500000,
      imageUrl: "https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?w=800&q=80",
      generation: {
        nameKo: "8세대 페이스리프트 (DN8)",
        codeName: "DN8 PE",
        startYear: 2023,
      },
      trims: [
        {
          nameKo: "2.0 가솔린 프리미엄",
          price: 28080000,
          fuelType: "GASOLINE" as const,
          engineDisplacement: 1999,
          transmission: "6단 자동",
          fuelEfficiencyCombined: 12.6,
          maxPower: 160,
          maxTorque: 20.0,
          seatingCapacity: 5,
        },
        {
          nameKo: "1.6 터보 익스클루시브",
          price: 32300000,
          fuelType: "GASOLINE" as const,
          engineDisplacement: 1598,
          transmission: "8단 자동",
          fuelEfficiencyCombined: 13.5,
          maxPower: 180,
          maxTorque: 27.0,
          seatingCapacity: 5,
        },
        {
          nameKo: "2.0 하이브리드 인스퍼레이션",
          price: 39500000,
          fuelType: "HYBRID" as const,
          engineDisplacement: 1999,
          transmission: "6단 자동",
          fuelEfficiencyCombined: 19.4,
          maxPower: 195,
          maxTorque: 28.5,
          seatingCapacity: 5,
        },
      ],
    },
    // 현대 싼타페
    {
      brandSlug: "hyundai",
      nameKo: "디 올 뉴 싼타페",
      nameEn: "The All New Santa Fe",
      slug: "santafe",
      vehicleType: "SUV" as const,
      releaseYear: 2024,
      minPrice: 35460000,
      maxPrice: 50800000,
      imageUrl: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=800&q=80",
      generation: {
        nameKo: "5세대 (MX5)",
        codeName: "MX5",
        startYear: 2023,
      },
      trims: [
        {
          nameKo: "2.5 터보 익스클루시브 2WD",
          price: 35460000,
          fuelType: "GASOLINE" as const,
          engineDisplacement: 2497,
          transmission: "8단 습식 DCT",
          fuelEfficiencyCombined: 11.0,
          maxPower: 281,
          maxTorque: 43.0,
          seatingCapacity: 5,
        },
        {
          nameKo: "1.6 터보 하이브리드 프레스티지 2WD",
          price: 43250000,
          fuelType: "HYBRID" as const,
          engineDisplacement: 1598,
          transmission: "6단 자동",
          fuelEfficiencyCombined: 15.5,
          maxPower: 235,
          maxTorque: 37.4,
          seatingCapacity: 5,
        },
        {
          nameKo: "1.6 터보 하이브리드 캘리그래피 4WD (6인승)",
          price: 50800000,
          fuelType: "HYBRID" as const,
          engineDisplacement: 1598,
          transmission: "6단 자동",
          fuelEfficiencyCombined: 14.0,
          maxPower: 235,
          maxTorque: 37.4,
          seatingCapacity: 6,
        },
      ],
    },
    // 현대 캐스퍼
    {
      brandSlug: "hyundai",
      nameKo: "캐스퍼",
      nameEn: "Casper",
      slug: "casper",
      vehicleType: "COMPACT" as const,
      releaseYear: 2024,
      minPrice: 13850000,
      maxPrice: 19600000,
      imageUrl: "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=800&q=80",
      generation: {
        nameKo: "1세대 (AX1)",
        codeName: "AX1",
        startYear: 2021,
      },
      trims: [
        {
          nameKo: "스마트",
          price: 13850000,
          fuelType: "GASOLINE" as const,
          engineDisplacement: 998,
          transmission: "4단 자동",
          fuelEfficiencyCombined: 14.3,
          maxPower: 76,
          maxTorque: 9.7,
          seatingCapacity: 4,
        },
        {
          nameKo: "디 에센셜",
          price: 16900000,
          fuelType: "GASOLINE" as const,
          engineDisplacement: 998,
          transmission: "4단 자동",
          fuelEfficiencyCombined: 14.3,
          maxPower: 76,
          maxTorque: 9.7,
          seatingCapacity: 4,
        },
        {
          nameKo: "인스퍼레이션 터보",
          price: 19600000,
          fuelType: "GASOLINE" as const,
          engineDisplacement: 998,
          transmission: "4단 자동",
          fuelEfficiencyCombined: 12.8,
          maxPower: 100,
          maxTorque: 17.5,
          seatingCapacity: 4,
        },
      ],
    },
    // 기아 쏘렌토
    {
      brandSlug: "kia",
      nameKo: "더 뉴 쏘렌토",
      nameEn: "The New Sorento",
      slug: "sorento",
      vehicleType: "SUV" as const,
      releaseYear: 2024,
      minPrice: 35060000,
      maxPrice: 48320000,
      imageUrl: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&q=80",
      generation: {
        nameKo: "4세대 페이스리프트 (MQ4)",
        codeName: "MQ4 PE",
        startYear: 2023,
      },
      trims: [
        {
          nameKo: "2.5 가솔린 터보 프레스티지 2WD",
          price: 35060000,
          fuelType: "GASOLINE" as const,
          engineDisplacement: 2497,
          transmission: "8단 습식 DCT",
          fuelEfficiencyCombined: 10.8,
          maxPower: 281,
          maxTorque: 43.0,
          seatingCapacity: 5,
        },
        {
          nameKo: "1.6 하이브리드 노블레스 2WD",
          price: 41120000,
          fuelType: "HYBRID" as const,
          engineDisplacement: 1598,
          transmission: "6단 자동",
          fuelEfficiencyCombined: 15.7,
          maxPower: 235,
          maxTorque: 37.4,
          seatingCapacity: 5,
        },
        {
          nameKo: "1.6 하이브리드 시그니처 2WD",
          price: 48320000,
          fuelType: "HYBRID" as const,
          engineDisplacement: 1598,
          transmission: "6단 자동",
          fuelEfficiencyCombined: 15.3,
          maxPower: 235,
          maxTorque: 37.4,
          seatingCapacity: 5,
        },
      ],
    },
    // 기아 카니발
    {
      brandSlug: "kia",
      nameKo: "더 뉴 카니발",
      nameEn: "The New Carnival",
      slug: "carnival",
      vehicleType: "RV" as const,
      releaseYear: 2024,
      minPrice: 34700000,
      maxPrice: 52000000,
      imageUrl: "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=800&q=80",
      generation: {
        nameKo: "4세대 페이스리프트 (KA4)",
        codeName: "KA4 PE",
        startYear: 2023,
      },
      trims: [
        {
          nameKo: "3.5 가솔린 프레스티지 9인승",
          price: 34700000,
          fuelType: "GASOLINE" as const,
          engineDisplacement: 3470,
          transmission: "8단 자동",
          fuelEfficiencyCombined: 9.0,
          maxPower: 290,
          maxTorque: 36.2,
          seatingCapacity: 9,
        },
        {
          nameKo: "1.6 하이브리드 노블레스 9인승",
          price: 43650000,
          fuelType: "HYBRID" as const,
          engineDisplacement: 1598,
          transmission: "6단 자동",
          fuelEfficiencyCombined: 14.0,
          maxPower: 245,
          maxTorque: 37.4,
          seatingCapacity: 9,
        },
        {
          nameKo: "1.6 하이브리드 시그니처 7인승",
          price: 52000000,
          fuelType: "HYBRID" as const,
          engineDisplacement: 1598,
          transmission: "6단 자동",
          fuelEfficiencyCombined: 13.5,
          maxPower: 245,
          maxTorque: 37.4,
          seatingCapacity: 7,
        },
      ],
    },
    // 기아 레이
    {
      brandSlug: "kia",
      nameKo: "더 뉴 기아 레이",
      nameEn: "The New Kia Ray",
      slug: "ray",
      vehicleType: "COMPACT" as const,
      releaseYear: 2024,
      minPrice: 13900000,
      maxPrice: 29550000,
      imageUrl: "https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?w=800&q=80",
      generation: {
        nameKo: "1세대 2차 페이스리프트",
        codeName: "TAM PE2",
        startYear: 2022,
      },
      trims: [
        {
          nameKo: "1.0 가솔린 스탠다드",
          price: 13900000,
          fuelType: "GASOLINE" as const,
          engineDisplacement: 998,
          transmission: "4단 자동",
          fuelEfficiencyCombined: 13.0,
          maxPower: 76,
          maxTorque: 9.7,
          seatingCapacity: 5,
        },
        {
          nameKo: "1.0 가솔린 시그니처",
          price: 18150000,
          fuelType: "GASOLINE" as const,
          engineDisplacement: 998,
          transmission: "4단 자동",
          fuelEfficiencyCombined: 13.0,
          maxPower: 76,
          maxTorque: 9.7,
          seatingCapacity: 5,
        },
        {
          nameKo: "레이 EV 에어",
          price: 29550000,
          fuelType: "ELECTRIC" as const,
          transmission: "감속기",
          electricEfficiencyCombined: 5.1,
          motorPower: 87,
          maxPower: 87,
          maxTorque: 15.0,
          seatingCapacity: 4,
        },
      ],
    },
    // 제네시스 G80
    {
      brandSlug: "genesis",
      nameKo: "제네시스 G80",
      nameEn: "Genesis G80",
      slug: "genesis-g80",
      vehicleType: "SEDAN" as const,
      releaseYear: 2024,
      minPrice: 58900000,
      maxPrice: 88500000,
      imageUrl: "https://images.unsplash.com/photo-1617814076367-b759c7d7e738?w=800&q=80",
      generation: {
        nameKo: "3세대 페이스리프트 (RG3)",
        codeName: "RG3 PE",
        startYear: 2023,
      },
      trims: [
        {
          nameKo: "2.5 터보 2WD",
          price: 58900000,
          fuelType: "GASOLINE" as const,
          engineDisplacement: 2497,
          transmission: "8단 자동",
          fuelEfficiencyCombined: 10.6,
          maxPower: 304,
          maxTorque: 43.0,
          seatingCapacity: 5,
        },
        {
          nameKo: "3.5 터보 AWD",
          price: 71900000,
          fuelType: "GASOLINE" as const,
          engineDisplacement: 3470,
          transmission: "8단 자동",
          fuelEfficiencyCombined: 8.8,
          maxPower: 380,
          maxTorque: 54.0,
          seatingCapacity: 5,
        },
      ],
    },
    // 테슬라 모델 Y
    {
      brandSlug: "tesla",
      nameKo: "모델 Y",
      nameEn: "Model Y",
      slug: "model-y",
      vehicleType: "SUV" as const,
      releaseYear: 2024,
      minPrice: 52990000,
      maxPrice: 72990000,
      imageUrl: "https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=800&q=80",
      generation: {
        nameKo: "1세대",
        codeName: "Model Y",
        startYear: 2020,
      },
      trims: [
        {
          nameKo: "RWD (LFP)",
          price: 52990000,
          fuelType: "ELECTRIC" as const,
          electricEfficiencyCombined: 5.1,
          motorPower: 299,
          maxPower: 299,
          maxTorque: 42.0,
          seatingCapacity: 5,
        },
        {
          nameKo: "Long Range AWD",
          price: 63990000,
          fuelType: "ELECTRIC" as const,
          electricEfficiencyCombined: 4.8,
          motorPower: 450,
          maxPower: 450,
          maxTorque: 55.0,
          seatingCapacity: 5,
        },
      ],
    },
    // BMW 5시리즈
    {
      brandSlug: "bmw",
      nameKo: "뉴 5시리즈",
      nameEn: "New 5 Series",
      slug: "bmw-5-series",
      vehicleType: "SEDAN" as const,
      releaseYear: 2024,
      minPrice: 68800000,
      maxPrice: 88700000,
      imageUrl: "https://images.unsplash.com/photo-1555353540-64580b51c258?w=800&q=80",
      generation: {
        nameKo: "8세대 (G60)",
        codeName: "G60",
        startYear: 2023,
      },
      trims: [
        {
          nameKo: "520i Base",
          price: 68800000,
          fuelType: "GASOLINE" as const,
          engineDisplacement: 1998,
          transmission: "8단 스텝트로닉",
          fuelEfficiencyCombined: 12.1,
          maxPower: 190,
          maxTorque: 31.6,
          seatingCapacity: 5,
        },
        {
          nameKo: "530i xDrive M Sport",
          price: 88700000,
          fuelType: "GASOLINE" as const,
          engineDisplacement: 1998,
          transmission: "8단 스텝트로닉",
          fuelEfficiencyCombined: 11.1,
          maxPower: 258,
          maxTorque: 40.8,
          seatingCapacity: 5,
        },
      ],
    },
  ];

  for (const m of modelsData) {
    const brandId = brandMap.get(m.brandSlug);
    if (!brandId) continue;

    const model = await prisma.carModel.upsert({
      where: { slug: m.slug },
      update: {
        brandId,
        nameKo: m.nameKo,
        nameEn: m.nameEn,
        vehicleType: m.vehicleType,
        releaseYear: m.releaseYear,
        minPrice: m.minPrice,
        maxPrice: m.maxPrice,
        imageUrl: m.imageUrl,
      },
      create: {
        brandId,
        nameKo: m.nameKo,
        nameEn: m.nameEn,
        slug: m.slug,
        vehicleType: m.vehicleType,
        releaseYear: m.releaseYear,
        minPrice: m.minPrice,
        maxPrice: m.maxPrice,
        imageUrl: m.imageUrl,
      },
    });

    // Generation
    let gen = await prisma.carGeneration.findFirst({
      where: { modelId: model.id },
    });
    if (!gen) {
      gen = await prisma.carGeneration.create({
        data: {
          modelId: model.id,
          nameKo: m.generation.nameKo,
          codeName: m.generation.codeName,
          startYear: m.generation.startYear,
          isCurrent: true,
        },
      });
    }

    // Model Year
    let modelYear = await prisma.carModelYear.findFirst({
      where: { generationId: gen.id, year: m.releaseYear },
    });
    if (!modelYear) {
      modelYear = await prisma.carModelYear.create({
        data: {
          generationId: gen.id,
          year: m.releaseYear,
          basePrice: m.minPrice,
        },
      });
    }

    // Trims
    for (const t of m.trims as any[]) {
      let trim = await prisma.carTrim.findFirst({
        where: { modelYearId: modelYear.id, nameKo: t.nameKo },
      });
      if (!trim) {
        trim = await prisma.carTrim.create({
          data: {
            modelYearId: modelYear.id,
            nameKo: t.nameKo,
            price: t.price,
            fuelType: t.fuelType,
            engineDisplacement: t.engineDisplacement,
            transmission: t.transmission,
            fuelEfficiencyCombined: t.fuelEfficiencyCombined,
            electricEfficiencyCombined: t.electricEfficiencyCombined,
            maxPower: t.maxPower,
            maxTorque: t.maxTorque,
            seatingCapacity: t.seatingCapacity,
          },
        });

        // Spec
        await prisma.carSpec.create({
          data: {
            trimId: trim.id,
            lengthMm: m.vehicleType === "COMPACT" ? 3595 : m.vehicleType === "SUV" ? 4830 : 4710,
            widthMm: m.vehicleType === "COMPACT" ? 1595 : 1900,
            heightMm: m.vehicleType === "SUV" ? 1720 : 1440,
            wheelbaseMm: m.vehicleType === "COMPACT" ? 2400 : 2815,
            curbWeightKg: 1350,
          },
        });

        // New car price with subsidy for EV
        const isEv = t.fuelType === "ELECTRIC";
        await prisma.newCarPrice.create({
          data: {
            trimId: trim.id,
            basePrice: t.price,
            acquisitionTaxRate: m.vehicleType === "COMPACT" ? 0.04 : 0.07,
            subsidyAmount: isEv ? 6500000 : 0,
            subsidyRegion: isEv ? "서울시" : null,
          },
        });
      }
    }

    // Used Car Samples for this model
    const sampleYears = [2023, 2022, 2021, 2020, 2019];
    for (const yr of sampleYears) {
      const depreciation = 1 - (2024 - yr) * 0.09 - 0.05;
      const samplePrice = Math.round(m.minPrice * Math.max(0.4, depreciation));
      const sampleMileage = (2024 - yr) * 15000 + Math.floor(Math.random() * 5000);

      const extId = `mock-${m.slug}-${yr}`;
      await prisma.usedCarListing.upsert({
        where: {
          sourceProvider_externalId: {
            sourceProvider: "encar",
            externalId: extId,
          },
        },
        update: {
          price: samplePrice,
          mileageKm: sampleMileage,
        },
        create: {
          modelId: model.id,
          brandId: brandId,
          title: `${yr}년형 ${m.nameKo} 무사고 실매물`,
          year: yr,
          mileageKm: sampleMileage,
          price: samplePrice,
          fuelType: m.trims[0].fuelType,
          region: "경기/수원",
          accidentHistory: "NONE",
          isCertified: true,
          sourceProvider: "encar",
          sourceUrl: "https://car.huzy.net/used-cars",
          externalId: extId,
          imageUrl: m.imageUrl,
          listingStatus: "ACTIVE",
        },
      });

      // Price Snapshot
      await prisma.usedCarPriceSnapshot.create({
        data: {
          modelId: model.id,
          year: yr,
          mileageBucket: `${Math.floor(sampleMileage / 20000) * 20000}~${(Math.floor(sampleMileage / 20000) + 1) * 20000}km`,
          medianPrice: samplePrice,
          avgPrice: Math.round(samplePrice * 1.02),
          sampleCount: 15,
        },
      });
    }

    // Market Stats for 1~5 years
    for (const yr of [2023, 2022, 2021, 2020]) {
      const depRate = ((2024 - yr) * 0.09) + 0.05;
      const baseAvg = Math.round(m.minPrice * (1 - depRate));
      await prisma.usedCarMarketStat.create({
        data: {
          modelId: model.id,
          year: yr,
          avgPrice: baseAvg,
          minPrice: Math.round(baseAvg * 0.9),
          maxPrice: Math.round(baseAvg * 1.1),
          depreciationRate: parseFloat((depRate * 100).toFixed(1)),
          sampleCount: 28,
          confidenceLevel: "HIGH",
        },
      });
    }
  }

  // 5. Sample Community Posts
  const freeBoard = await prisma.board.findUnique({ where: { slug: "free" } });
  const recommendBoard = await prisma.board.findUnique({ where: { slug: "recommend-qna" } });

  if (freeBoard && demoUser) {
    const post1 = await prisma.post.create({
      data: {
        boardId: freeBoard.id,
        authorId: demoUser.id,
        title: "신차 하이브리드 vs 가솔린 5년 유지비 계산해보니 놀랍네요",
        content: `출퇴근 왕복 40km 주행 기준으로 카휴지 할부 계산기와 유지비 엔진으로 비교해봤습니다.
초기 차량가는 하이브리드가 300~400만원 더 비싸지만, 연 15,000km 이상 주행 시 3년 차부터 유류비 절감액이 차량가 차이를 역전하네요!
특히 도심 주행이 많으신 분들은 무조건 하이브리드가 가성비가 좋은 것 같습니다.`,
        viewCount: 142,
        likeCount: 12,
        commentCount: 2,
      },
    });

    await prisma.comment.create({
      data: {
        postId: post1.id,
        authorId: adminUser.id,
        content: "정확한 분석입니다! 특히 하이브리드는 중고차 방어율(감가율)도 낮아서 총소유비용(TCO) 측면에서 매우 유리합니다.",
        likeCount: 4,
      },
    });
  }

  if (recommendBoard && demoUser) {
    await prisma.post.create({
      data: {
        boardId: recommendBoard.id,
        authorId: demoUser.id,
        title: "보유현금 1,500만원, 월 60만원으로 패밀리 SUV 추천 부탁드립니다!",
        content: `현재 4인 가족(아이 둘)이고, 현금 1,500만원 선납에 월 납입금 60만원 한도로 보고 있습니다.
카휴지 '내 예산으로 차 찾기' 돌려보니 싼타페 하이브리드와 쏘렌토 중고 2~3년식이 최적 가성비로 뜨네요.
신차 vs 2년 된 쏘렌토 중고 중 어떤 선택이 더 만족도가 높을까요?`,
        viewCount: 98,
        likeCount: 7,
      },
    });
  }

  // 6. Data Source Metadata
  await prisma.dataSource.upsert({
    where: { providerCode: "molit_gov" },
    update: {
      name: "국토교통부 자동차종합정보 API (승인대기 / Mock 모드)",
      status: "MOCK_ACTIVE",
      licenseInfo: "공공데이터포털 공공누리 제1유형",
    },
    create: {
      providerCode: "molit_gov",
      name: "국토교통부 자동차종합정보 API (승인대기 / Mock 모드)",
      status: "MOCK_ACTIVE",
      licenseInfo: "공공데이터포털 공공누리 제1유형",
    },
  });

  await prisma.dataSource.upsert({
    where: { providerCode: "encar_market" },
    update: {
      name: "엔카 중고차 시세 어댑터",
      status: "ACTIVE",
      licenseInfo: "공식 파트너십 및 등록 매물 호가 기반",
    },
    create: {
      providerCode: "encar_market",
      name: "엔카 중고차 시세 어댑터",
      status: "ACTIVE",
      licenseInfo: "공식 파트너십 및 등록 매물 호가 기반",
    },
  });

  console.log("Database seeded successfully!");
}

main()
  .catch((e) => {
    console.error("Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
