import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    const brands = await prisma.carBrand.findMany({
      where: { isActive: true },
      include: {
        _count: {
          select: { models: true, usedCars: true },
        },
      },
      orderBy: { orderIndex: "asc" },
    });

    return NextResponse.json({
      success: true,
      data: brands,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: "브랜드 목록을 불러오는 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
