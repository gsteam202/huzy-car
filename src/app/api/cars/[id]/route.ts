import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Check by id or slug
    const model = await prisma.carModel.findFirst({
      where: {
        OR: [{ id }, { slug: id }],
      },
      include: {
        brand: true,
        generations: {
          include: {
            modelYears: {
              orderBy: { year: "desc" },
              include: {
                trims: {
                  include: {
                    specs: true,
                    newCarPrices: true,
                    trimOptions: {
                      include: { option: true },
                    },
                  },
                },
                options: true,
              },
            },
          },
        },
        images: {
          orderBy: { orderIndex: "asc" },
        },
        usedCars: {
          where: { listingStatus: "ACTIVE" },
          take: 6,
          orderBy: { listedAt: "desc" },
        },
        marketStats: {
          orderBy: { year: "desc" },
          take: 5,
        },
      },
    });

    if (!model) {
      return NextResponse.json(
        { success: false, error: "해당 차량 정보를 찾을 수 없습니다." },
        { status: 404 }
      );
    }

    // Increment view count asynchronously
    prisma.carModel
      .update({
        where: { id: model.id },
        data: { viewCount: { increment: 1 } },
      })
      .catch(() => {});

    return NextResponse.json({
      success: true,
      data: model,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: "차량 상세 조회 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
