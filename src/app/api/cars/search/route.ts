import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("q")?.trim() || "";
    const brand = searchParams.get("brand");
    const vehicleType = searchParams.get("type");
    const fuelType = searchParams.get("fuel");
    const carType = searchParams.get("carType") || "ALL"; // ALL, NEW, USED
    const minPrice = searchParams.get("minPrice") ? Number(searchParams.get("minPrice")) : undefined;
    const maxPrice = searchParams.get("maxPrice") ? Number(searchParams.get("maxPrice")) : undefined;
    const page = Math.max(1, Number(searchParams.get("page") || 1));
    const limit = Math.min(50, Math.max(1, Number(searchParams.get("limit") || 20)));
    const skip = (page - 1) * limit;

    let newCars: any[] = [];
    let usedCars: any[] = [];

    // Search New Cars
    if (carType === "ALL" || carType === "NEW") {
      const whereTrim: any = {};
      if (query) {
        whereTrim.OR = [
          { nameKo: { contains: query } },
          { modelYear: { generation: { model: { nameKo: { contains: query } } } } },
          { modelYear: { generation: { model: { brand: { nameKo: { contains: query } } } } } },
        ];
      }
      if (brand) {
        whereTrim.modelYear = {
          generation: { model: { brand: { slug: brand } } },
        };
      }
      if (vehicleType) {
        whereTrim.modelYear = {
          ...whereTrim.modelYear,
          generation: {
            ...whereTrim.modelYear?.generation,
            model: {
              ...whereTrim.modelYear?.generation?.model,
              vehicleType: vehicleType as any,
            },
          },
        };
      }
      if (fuelType) {
        whereTrim.fuelType = fuelType;
      }
      if (minPrice !== undefined || maxPrice !== undefined) {
        whereTrim.price = {};
        if (minPrice !== undefined) whereTrim.price.gte = minPrice;
        if (maxPrice !== undefined) whereTrim.price.lte = maxPrice;
      }

      newCars = await prisma.carTrim.findMany({
        where: whereTrim,
        include: {
          modelYear: {
            include: {
              generation: {
                include: {
                  model: {
                    include: { brand: true },
                  },
                },
              },
            },
          },
          specs: true,
        },
        orderBy: { price: "asc" },
        take: limit,
        skip,
      });
    }

    // Search Used Cars
    if (carType === "ALL" || carType === "USED") {
      const whereUsed: any = { listingStatus: "ACTIVE" };
      if (query) {
        whereUsed.OR = [
          { title: { contains: query } },
          { model: { nameKo: { contains: query } } },
          { brand: { nameKo: { contains: query } } },
        ];
      }
      if (brand) whereUsed.brand = { slug: brand };
      if (vehicleType) whereUsed.model = { vehicleType: vehicleType as any };
      if (fuelType) whereUsed.fuelType = fuelType as any;
      if (minPrice !== undefined || maxPrice !== undefined) {
        whereUsed.price = {};
        if (minPrice !== undefined) whereUsed.price.gte = minPrice;
        if (maxPrice !== undefined) whereUsed.price.lte = maxPrice;
      }

      usedCars = await prisma.usedCarListing.findMany({
        where: whereUsed,
        include: {
          brand: true,
          model: true,
        },
        orderBy: { listedAt: "desc" },
        take: limit,
        skip,
      });
    }

    return NextResponse.json({
      success: true,
      data: {
        newCars,
        usedCars,
        page,
        limit,
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: "차량 검색 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
