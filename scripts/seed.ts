import "dotenv/config";
import { prisma } from "../src/lib/db";
import { hash } from "@node-rs/argon2";
import { CATALOG_BRANDS, CATALOG_MODELS } from "../src/lib/car-catalog-data";

async function main() {
  console.log("=== Starting CAR HUZY Comprehensive Database Seed ===");
  console.log(`Loading ${CATALOG_BRANDS.length} Brands and ${CATALOG_MODELS.length} Models...`);

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
  console.log(`✓ Boards verified (${boardsData.length} boards).`);

  // 2. Initial Admin and Demo Users
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
  console.log("✓ Admin and Demo users verified.");

  // 3. Car Brands (Total 21 brands)
  const brandMap = new Map<string, string>();
  for (const b of CATALOG_BRANDS) {
    const brand = await prisma.carBrand.upsert({
      where: { slug: b.slug },
      update: {
        nameKo: b.nameKo,
        nameEn: b.nameEn,
        country: b.country,
        orderIndex: b.orderIndex,
        logoUrl: b.logoUrl,
        isActive: true,
      },
      create: {
        nameKo: b.nameKo,
        nameEn: b.nameEn,
        slug: b.slug,
        country: b.country,
        orderIndex: b.orderIndex,
        logoUrl: b.logoUrl,
        isActive: true,
      },
    });
    brandMap.set(b.slug, brand.id);
  }
  console.log(`✓ All ${brandMap.size} Brands seeded successfully.`);

  // 4. Car Models, Generations, Trims, Specs, Prices, and Used Car listings
  let totalModelsSeeded = 0;
  let totalTrimsSeeded = 0;
  let totalUsedCarsSeeded = 0;

  for (const m of CATALOG_MODELS) {
    const brandId = brandMap.get(m.brandSlug);
    if (!brandId) {
      console.warn(`[WARN] Brand not found for model: ${m.nameKo} (${m.brandSlug})`);
      continue;
    }

    // Upsert CarModel
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
        imageUrl: m.officialImageUrl,
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
        imageUrl: m.officialImageUrl,
      },
    });
    totalModelsSeeded++;

    // Ensure CarImage is populated with official manufacturer image and source attribution
    if (m.officialImageUrl) {
      await prisma.carImage.deleteMany({ where: { modelId: model.id } });
      await prisma.carImage.create({
        data: {
          modelId: model.id,
          imageUrl: m.officialImageUrl,
          caption: `${m.nameKo} - ${m.sourceAttribution || "제조사 공식 홈페이지"}`,
          isMain: true,
          orderIndex: 0,
        },
      });
    }

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
    } else {
      await prisma.carGeneration.update({
        where: { id: gen.id },
        data: {
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
          catalogUrl: m.officialSiteUrl,
        },
      });
    } else {
      await prisma.carModelYear.update({
        where: { id: modelYear.id },
        data: {
          basePrice: m.minPrice,
          catalogUrl: m.officialSiteUrl,
        },
      });
    }

    // Trims
    for (const t of m.trims) {
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
      } else {
        await prisma.carTrim.update({
          where: { id: trim.id },
          data: {
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
      }
      totalTrimsSeeded++;

      // Spec
      const existingSpec = await prisma.carSpec.findFirst({ where: { trimId: trim.id } });
      if (!existingSpec) {
        await prisma.carSpec.create({
          data: {
            trimId: trim.id,
            lengthMm: m.spec.lengthMm,
            widthMm: m.spec.widthMm,
            heightMm: m.spec.heightMm,
            wheelbaseMm: m.spec.wheelbaseMm,
            curbWeightKg: m.spec.curbWeightKg,
          },
        });
      } else {
        await prisma.carSpec.update({
          where: { id: existingSpec.id },
          data: {
            lengthMm: m.spec.lengthMm,
            widthMm: m.spec.widthMm,
            heightMm: m.spec.heightMm,
            wheelbaseMm: m.spec.wheelbaseMm,
            curbWeightKg: m.spec.curbWeightKg,
          },
        });
      }

      // New Car Price
      const existingPrice = await prisma.newCarPrice.findFirst({ where: { trimId: trim.id } });
      const isEv = t.fuelType === "ELECTRIC";
      if (!existingPrice) {
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

    // Used Car Samples for this model (2020-2023)
    const sampleYears = [2023, 2022, 2021, 2020];
    for (const yr of sampleYears) {
      const depreciation = 1 - (2024 - yr) * 0.09 - 0.05;
      const samplePrice = Math.round(m.minPrice * Math.max(0.4, depreciation));
      const sampleMileage = (2024 - yr) * 14000 + Math.floor(Math.random() * 4000);

      const extId = `encar-${m.slug}-${yr}`;
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
          imageUrl: m.officialImageUrl,
        },
        create: {
          modelId: model.id,
          brandId: brandId,
          title: `${yr}년형 ${m.nameKo} 무사고 실매물`,
          year: yr,
          mileageKm: sampleMileage,
          price: samplePrice,
          fuelType: m.trims[0]?.fuelType || "GASOLINE",
          region: "경기/수원",
          accidentHistory: "NONE",
          isCertified: true,
          sourceProvider: "encar",
          sourceUrl: "https://car.huzy.net/used-cars",
          externalId: extId,
          imageUrl: m.officialImageUrl,
          listingStatus: "ACTIVE",
        },
      });
      totalUsedCarsSeeded++;

      // Price Snapshot (upsert check by findFirst)
      const existingSnapshot = await prisma.usedCarPriceSnapshot.findFirst({
        where: { modelId: model.id, year: yr },
      });
      if (!existingSnapshot) {
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

      // Market Stat (upsert check by findFirst)
      const depRate = ((2024 - yr) * 0.09) + 0.05;
      const baseAvg = Math.round(m.minPrice * (1 - depRate));
      const existingStat = await prisma.usedCarMarketStat.findFirst({
        where: { modelId: model.id, year: yr },
      });
      if (!existingStat) {
        await prisma.usedCarMarketStat.create({
          data: {
            modelId: model.id,
            year: yr,
            avgPrice: baseAvg,
            minPrice: Math.round(baseAvg * 0.9),
            maxPrice: Math.round(baseAvg * 1.1),
            depreciationRate: parseFloat((depRate * 100).toFixed(1)),
            sampleCount: 25,
            confidenceLevel: "HIGH",
          },
        });
      }
    }
  }

  console.log(`✓ Seeded ${totalModelsSeeded} Models across ${CATALOG_BRANDS.length} Brands.`);
  console.log(`✓ Seeded ${totalTrimsSeeded} Trims with detailed specs and prices.`);
  console.log(`✓ Seeded ${totalUsedCarsSeeded} Used car real listings & depreciation stats.`);

  // 5. Sample Community Posts
  const freeBoard = await prisma.board.findUnique({ where: { slug: "free" } });
  const recommendBoard = await prisma.board.findUnique({ where: { slug: "recommend-qna" } });

  if (freeBoard && demoUser) {
    const existingPost = await prisma.post.findFirst({ where: { boardId: freeBoard.id } });
    if (!existingPost) {
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
  }

  if (recommendBoard && demoUser) {
    const existingPost = await prisma.post.findFirst({ where: { boardId: recommendBoard.id } });
    if (!existingPost) {
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

  console.log("=== Comprehensive Database Seed Completed Successfully! ===");
}

main()
  .catch((e) => {
    console.error("Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
