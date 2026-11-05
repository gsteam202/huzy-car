import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const brandSlug = searchParams.get("brand");
    const vehicleType = searchParams.get("type");
    const minPrice = searchParams.get("minPrice") ? Number(searchParams.get("minPrice")) : undefined;
    const maxPrice = searchParams.get("maxPrice") ? Number(searchParams.get("maxPrice")) : undefined;

    const where: any = {};
    if (brandSlug) {
      where.brand = { slug: brandSlug };
    }
    if (vehicleType) {
      where.vehicleType = vehicleType;
    }
    if (minPrice !== undefined || maxPrice !== undefined) {
      where.minPrice = {};
      if (minPrice !== undefined) where.minPrice.gte = minPrice;
      if (maxPrice !== undefined) where.minPrice.lte = maxPrice;
    }

    const models = await prisma.carModel.findMany({
      where,
      include: {
        brand: true,
        generations: {
          where: { isCurrent: true },
          include: {
            modelYears: {
              orderBy: { year: "desc" },
              take: 1,
              include: {
                trims: {
                  orderBy: { price: "asc" },
                },
              },
            },
          },
        },
      },
      orderBy: { viewCount: "desc" },
    });

    return NextResponse.json({
      success: true,
      data: models,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: "차량 모델 목록 조회 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
