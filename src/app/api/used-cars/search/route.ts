import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const brand = searchParams.get("brand");
    const model = searchParams.get("model");
    const minYear = searchParams.get("minYear") ? Number(searchParams.get("minYear")) : undefined;
    const maxYear = searchParams.get("maxYear") ? Number(searchParams.get("maxYear")) : undefined;
    const minPrice = searchParams.get("minPrice") ? Number(searchParams.get("minPrice")) : undefined;
    const maxPrice = searchParams.get("maxPrice") ? Number(searchParams.get("maxPrice")) : undefined;
    const maxMileage = searchParams.get("maxMileage") ? Number(searchParams.get("maxMileage")) : undefined;
    const fuel = searchParams.get("fuel");
    const certifiedOnly = searchParams.get("certified") === "true";
    const page = Math.max(1, Number(searchParams.get("page") || 1));
    const limit = Math.min(50, Math.max(1, Number(searchParams.get("limit") || 20)));

    const where: any = { listingStatus: "ACTIVE" };
    if (brand) where.brand = { slug: brand };
    if (model) where.model = { slug: model };
    if (minYear || maxYear) {
      where.year = {};
      if (minYear) where.year.gte = minYear;
      if (maxYear) where.year.lte = maxYear;
    }
    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price.gte = minPrice;
      if (maxPrice) where.price.lte = maxPrice;
    }
    if (maxMileage) where.mileageKm = { lte: maxMileage };
    if (fuel) where.fuelType = fuel as any;
    if (certifiedOnly) where.isCertified = true;

    const [items, total] = await Promise.all([
      prisma.usedCarListing.findMany({
        where,
        include: {
          brand: true,
          model: true,
        },
        orderBy: { listedAt: "desc" },
        take: limit,
        skip: (page - 1) * limit,
      }),
      prisma.usedCarListing.count({ where }),
    ]);

    return NextResponse.json({
      success: true,
      data: items,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: "중고차 매물 검색 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
