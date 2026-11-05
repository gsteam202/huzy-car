import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const modelSlug = searchParams.get("model");

    if (!modelSlug) {
      return NextResponse.json(
        { success: false, error: "조회할 모델 식별자가 필요합니다." },
        { status: 400 }
      );
    }

    const model = await prisma.carModel.findFirst({
      where: {
        OR: [{ id: modelSlug }, { slug: modelSlug }],
      },
      include: {
        brand: true,
        marketStats: {
          orderBy: { year: "desc" },
        },
        priceSnapshots: {
          orderBy: { year: "desc" },
          take: 10,
        },
      },
    });

    if (!model) {
      return NextResponse.json(
        { success: false, error: "해당 모델을 찾을 수 없습니다." },
        { status: 404 }
      );
    }

    // Format stats for Recharts graph display
    const trendData = model.marketStats.map((s) => ({
      year: `${s.year}년식`,
      avgPrice: Math.round(s.avgPrice / 10000), // 만원 단위
      minPrice: Math.round(s.minPrice / 10000),
      maxPrice: Math.round(s.maxPrice / 10000),
      depreciationRate: s.depreciationRate,
      sampleCount: s.sampleCount,
    }));

    return NextResponse.json({
      success: true,
      data: {
        modelId: model.id,
        modelName: model.nameKo,
        brandName: model.brand.nameKo,
        newCarBasePrice: model.minPrice,
        trend: trendData,
        asOfDate: new Date().toISOString().split("T")[0],
        confidenceLevel: model.marketStats[0]?.confidenceLevel || "HIGH",
        disclaimer: "본 시세는 공식 등록 매물 호가 및 실거래 데이터를 종합 분석한 추정 시세입니다.",
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: "시세 통계 조회 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
