import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { z } from "zod";

const batchRowSchema = z.object({
  brandNameKo: z.string(),
  brandSlug: z.string(),
  modelNameKo: z.string(),
  modelSlug: z.string(),
  trimNameKo: z.string(),
  vehicleType: z.enum([
    "SEDAN",
    "SUV",
    "RV",
    "COMPACT",
    "HATCHBACK",
    "WAGON",
    "COUPE",
    "CONVERTIBLE",
    "TRUCK",
    "VAN",
  ]),
  fuelType: z.enum([
    "GASOLINE",
    "DIESEL",
    "HYBRID",
    "ELECTRIC",
    "LPG",
    "HYDROGEN",
  ]),
  price: z.number().positive(),
  year: z.number().int().min(2000).max(2030),
  fuelEfficiency: z.number().optional(),
  seatingCapacity: z.number().int().default(5),
});

const batchUploadSchema = z.object({
  rows: z.array(batchRowSchema),
});

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "ADMIN") {
      return NextResponse.json(
        { success: false, error: "관리자 권한이 필요합니다." },
        { status: 403 }
      );
    }

    const body = await req.json();
    const parsed = batchUploadSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: "데이터 검증 실패", details: parsed.error.format() },
        { status: 400 }
      );
    }

    let insertedCount = 0;
    for (const r of parsed.data.rows) {
      const brand = await prisma.carBrand.upsert({
        where: { slug: r.brandSlug.toLowerCase() },
        update: { nameKo: r.brandNameKo },
        create: {
          nameKo: r.brandNameKo,
          nameEn: r.brandSlug,
          slug: r.brandSlug.toLowerCase(),
        },
      });

      const model = await prisma.carModel.upsert({
        where: { slug: r.modelSlug.toLowerCase() },
        update: {
          nameKo: r.modelNameKo,
          vehicleType: r.vehicleType,
          minPrice: { set: r.price },
        },
        create: {
          brandId: brand.id,
          nameKo: r.modelNameKo,
          nameEn: r.modelSlug,
          slug: r.modelSlug.toLowerCase(),
          vehicleType: r.vehicleType,
          releaseYear: r.year,
          minPrice: r.price,
          maxPrice: r.price,
        },
      });

      let gen = await prisma.carGeneration.findFirst({ where: { modelId: model.id } });
      if (!gen) {
        gen = await prisma.carGeneration.create({
          data: {
            modelId: model.id,
            nameKo: "1세대",
            startYear: r.year,
            isCurrent: true,
          },
        });
      }

      let modelYear = await prisma.carModelYear.findFirst({
        where: { generationId: gen.id, year: r.year },
      });
      if (!modelYear) {
        modelYear = await prisma.carModelYear.create({
          data: {
            generationId: gen.id,
            year: r.year,
            basePrice: r.price,
          },
        });
      }

      await prisma.carTrim.create({
        data: {
          modelYearId: modelYear.id,
          nameKo: r.trimNameKo,
          price: r.price,
          fuelType: r.fuelType,
          fuelEfficiencyCombined: r.fuelEfficiency,
          seatingCapacity: r.seatingCapacity,
        },
      });

      insertedCount++;
    }

    await prisma.adminAuditLog.create({
      data: {
        adminId: user.id,
        action: "BATCH_UPLOAD_CARS",
        targetType: "CAR_TRIM",
        detailsJson: { count: insertedCount },
      },
    });

    return NextResponse.json({
      success: true,
      message: `성공적으로 ${insertedCount}건의 차량 정보가 일괄 등록되었습니다.`,
      insertedCount,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: "일괄 업로드 처리 중 오류: " + error.message },
      { status: 500 }
    );
  }
}
