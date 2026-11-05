import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { calculateInstallment, calculateAcquisitionTax } from "@/lib/finance";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const model = await prisma.carModel.findFirst({
      where: {
        OR: [{ id }, { slug: id }],
      },
      include: {
        generations: {
          where: { isCurrent: true },
          include: {
            modelYears: {
              orderBy: { year: "desc" },
              take: 1,
              include: {
                trims: {
                  include: {
                    newCarPrices: true,
                    trimOptions: {
                      include: { option: true },
                    },
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!model) {
      return NextResponse.json(
        { success: false, error: "차량 모델을 찾을 수 없습니다." },
        { status: 404 }
      );
    }

    const currentYear = model.generations[0]?.modelYears[0];
    const trims = currentYear?.trims || [];

    const priceBreakdown = trims.map((t) => {
      const isEv = t.fuelType === "ELECTRIC";
      const isCompact = model.vehicleType === "COMPACT";
      const taxRate = isCompact ? 0.04 : 0.07;
      const subsidy = t.newCarPrices[0]?.subsidyAmount || (isEv ? 6500000 : 0);
      const tax = calculateAcquisitionTax(t.price, taxRate, isEv ? 1400000 : 0, isCompact);
      const deliveryFee = t.newCarPrices[0]?.deliveryFeeDefault || 300000;
      const otherFees = 350000;

      // Sample 48 months 5.5% financing estimate
      const sampleFinance = calculateInstallment({
        vehiclePrice: t.price - subsidy,
        downPayment: Math.round((t.price - subsidy) * 0.2), // 20% down
        termMonths: 48,
        annualRatePct: 5.5,
        skipComparisons: true,
      });

      return {
        trimId: t.id,
        nameKo: t.nameKo,
        basePrice: t.price,
        subsidyAmount: subsidy,
        effectivePrice: t.price - subsidy,
        acquisitionTax: tax,
        deliveryFee,
        otherFees,
        totalAcquisitionCost: t.price - subsidy + tax + deliveryFee + otherFees,
        sampleInstallment48m: sampleFinance.monthlyPayment,
      };
    });

    return NextResponse.json({
      success: true,
      data: {
        modelId: model.id,
        modelName: model.nameKo,
        trims: priceBreakdown,
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: "가격 정보 산출 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
