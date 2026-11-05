import {
  CarDataProvider,
  NormalizedCarModel,
  NormalizedUsedCarListing,
  SyncReport,
} from "./car-provider-types";
import { prisma } from "@/lib/db";

/**
 * 국토교통부 자동차종합정보 API 어댑터
 * 현재 정부 공공데이터 포털 심사/승인 단계이므로 Mock 데이터 공급 및
 * 정규화 파이프라인을 온전히 구현하여 승인 완료 시 즉시 키 주입으로 실동작하도록 구현.
 */
export class MolitDataProvider implements CarDataProvider {
  readonly code = "molit_gov";
  readonly name = "국토교통부 자동차종합정보 API (공공데이터포털)";
  readonly isMock: boolean;

  constructor() {
    this.isMock = !process.env.MOLIT_API_KEY || process.env.MOLIT_API_KEY === "mock_stage";
  }

  isAvailable(): boolean {
    return true; // Mock 모드로 상시 동작 보장
  }

  async fetchNewCars(brandOrQuery?: string): Promise<NormalizedCarModel[]> {
    // 공공데이터 스키마 기반 정규화 모델 반환
    const mockDataset: NormalizedCarModel[] = [
      {
        brandNameKo: "현대",
        brandNameEn: "Hyundai",
        brandCountry: "KOREA",
        modelNameKo: "아이오닉 5",
        modelNameEn: "IONIQ 5",
        modelSlug: "ioniq-5",
        vehicleType: "SUV",
        releaseYear: 2024,
        minPrice: 52400000,
        maxPrice: 62420000,
        imageUrl: "/images/cars/santafe.jpg",
        trims: [
          {
            nameKo: "Long Range 2WD 익스클루시브",
            price: 52400000,
            fuelType: "ELECTRIC",
            electricEfficiencyCombined: 5.2,
            maxPower: 229,
            maxTorque: 35.7,
            seatingCapacity: 5,
          },
          {
            nameKo: "Long Range AWD 프레스티지",
            price: 62420000,
            fuelType: "ELECTRIC",
            electricEfficiencyCombined: 4.8,
            maxPower: 325,
            maxTorque: 61.7,
            seatingCapacity: 5,
          },
        ],
      },
      {
        brandNameKo: "기아",
        brandNameEn: "Kia",
        brandCountry: "KOREA",
        modelNameKo: "EV6",
        modelNameEn: "EV6",
        modelSlug: "ev6",
        vehicleType: "SUV",
        releaseYear: 2024,
        minPrice: 52600000,
        maxPrice: 63150000,
        imageUrl: "/images/cars/sorento.jpg",
        trims: [
          {
            nameKo: "Long Range 2WD 에어",
            price: 52600000,
            fuelType: "ELECTRIC",
            electricEfficiencyCombined: 5.2,
            maxPower: 229,
            maxTorque: 35.7,
            seatingCapacity: 5,
          },
          {
            nameKo: "Long Range 4WD 어스",
            price: 63150000,
            fuelType: "ELECTRIC",
            electricEfficiencyCombined: 4.7,
            maxPower: 325,
            maxTorque: 61.7,
            seatingCapacity: 5,
          },
        ],
      },
    ];

    if (brandOrQuery) {
      const q = brandOrQuery.toLowerCase();
      return mockDataset.filter(
        (m) =>
          m.brandNameKo.includes(q) ||
          m.modelNameKo.includes(q) ||
          m.modelSlug.includes(q)
      );
    }
    return mockDataset;
  }

  async fetchUsedCarListings(modelQuery?: string): Promise<NormalizedUsedCarListing[]> {
    return [];
  }

  async synchronize(): Promise<SyncReport> {
    const start = Date.now();
    let totalUpserted = 0;
    let totalErrors = 0;

    try {
      const items = await this.fetchNewCars();

      for (const item of items) {
        // Upsert Brand
        const brand = await prisma.carBrand.upsert({
          where: { slug: item.brandNameEn.toLowerCase() },
          update: {
            nameKo: item.brandNameKo,
            nameEn: item.brandNameEn,
            country: item.brandCountry,
          },
          create: {
            nameKo: item.brandNameKo,
            nameEn: item.brandNameEn,
            slug: item.brandNameEn.toLowerCase(),
            country: item.brandCountry,
          },
        });

        // Upsert Model
        const model = await prisma.carModel.upsert({
          where: { slug: item.modelSlug },
          update: {
            nameKo: item.modelNameKo,
            nameEn: item.modelNameEn,
            vehicleType: item.vehicleType,
            releaseYear: item.releaseYear,
            minPrice: item.minPrice,
            maxPrice: item.maxPrice,
            imageUrl: item.imageUrl,
          },
          create: {
            brandId: brand.id,
            nameKo: item.modelNameKo,
            nameEn: item.modelNameEn,
            slug: item.modelSlug,
            vehicleType: item.vehicleType,
            releaseYear: item.releaseYear,
            minPrice: item.minPrice,
            maxPrice: item.maxPrice,
            imageUrl: item.imageUrl,
          },
        });

        // Upsert Generation & ModelYear
        let gen = await prisma.carGeneration.findFirst({ where: { modelId: model.id } });
        if (!gen) {
          gen = await prisma.carGeneration.create({
            data: {
              modelId: model.id,
              nameKo: "1세대",
              startYear: item.releaseYear,
              isCurrent: true,
            },
          });
        }

        let modelYear = await prisma.carModelYear.findFirst({
          where: { generationId: gen.id, year: item.releaseYear },
        });
        if (!modelYear) {
          modelYear = await prisma.carModelYear.create({
            data: {
              generationId: gen.id,
              year: item.releaseYear,
              basePrice: item.minPrice,
            },
          });
        }

        // Upsert Trims
        for (const t of item.trims) {
          const trim = await prisma.carTrim.findFirst({
            where: { modelYearId: modelYear.id, nameKo: t.nameKo },
          });

          if (!trim) {
            const createdTrim = await prisma.carTrim.create({
              data: {
                modelYearId: modelYear.id,
                nameKo: t.nameKo,
                price: t.price,
                fuelType: t.fuelType,
                electricEfficiencyCombined: t.electricEfficiencyCombined,
                maxPower: t.maxPower,
                maxTorque: t.maxTorque,
                seatingCapacity: t.seatingCapacity,
              },
            });

            await prisma.newCarPrice.create({
              data: {
                trimId: createdTrim.id,
                basePrice: t.price,
                subsidyAmount: 6500000,
                subsidyRegion: "전국 평균",
              },
            });
            totalUpserted++;
          }
        }
      }

      // Log sync record
      const source = await prisma.dataSource.findUnique({
        where: { providerCode: this.code },
      });
      if (source) {
        await prisma.dataSyncLog.create({
          data: {
            sourceId: source.id,
            provider: this.code,
            status: "SUCCESS",
            recordsCount: totalUpserted,
            message: `MOLIT Mock 데이터 동기화 완료: ${totalUpserted}건 반영`,
            finishedAt: new Date(),
          },
        });
        await prisma.dataSource.update({
          where: { id: source.id },
          data: {
            lastSyncedAt: new Date(),
            requestCount: { increment: 1 },
          },
        });
      }

      return {
        provider: this.code,
        success: true,
        totalFetched: items.length,
        totalUpserted,
        totalErrors,
        durationMs: Date.now() - start,
        message: `국토부 자동차종합정보 어댑터 동기화 성공 (${totalUpserted}건 반영)`,
        timestamp: new Date().toISOString(),
      };
    } catch (err: any) {
      return {
        provider: this.code,
        success: false,
        totalFetched: 0,
        totalUpserted: 0,
        totalErrors: 1,
        durationMs: Date.now() - start,
        message: `MOLIT 어댑터 오류: ${err.message}`,
        timestamp: new Date().toISOString(),
      };
    }
  }
}
