import { NextRequest, NextResponse } from "next/server";
import { calculateInstallment, InstallmentInput } from "@/lib/finance";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { z } from "zod";

const calculateSchema = z.object({
  vehiclePrice: z.number().positive(),
  downPayment: z.number().min(0),
  termMonths: z.number().int().min(6).max(120),
  annualRatePct: z.number().min(0).max(30),
  productType: z.enum(["STANDARD", "ZERO_INTEREST", "BALLOON"]).optional(),
  balloonAmount: z.number().min(0).optional(),
  acquisitionTaxRate: z.number().min(0).max(0.2).optional(),
  taxReliefAmount: z.number().min(0).optional(),
  otherFees: z.number().min(0).optional(),
  includeTaxInLoan: z.boolean().optional(),
  saveResult: z.boolean().optional(),
  scenarioTitle: z.string().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = calculateSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: "입력값 검증 실패", details: parsed.error.format() },
        { status: 400 }
      );
    }

    const input: InstallmentInput = parsed.data;
    const result = calculateInstallment(input);

    // Save if requested and user is authenticated
    if (parsed.data.saveResult) {
      const user = await getCurrentUser();
      if (user) {
        const scenario = await prisma.financingScenario.create({
          data: {
            userId: user.id,
            title: parsed.data.scenarioTitle || `${Math.round(input.vehiclePrice / 10000)}만원 견적`,
            vehiclePrice: input.vehiclePrice,
            downPayment: input.downPayment,
            termMonths: input.termMonths,
            annualRatePct: input.annualRatePct,
            productType: input.productType || "STANDARD",
            balloonAmount: input.balloonAmount || 0,
            includeTaxInLoan: Boolean(input.includeTaxInLoan),
            results: {
              create: {
                monthlyPayment: result.monthlyPayment,
                totalPrincipal: result.loanPrincipal,
                totalInterest: result.totalInterest,
                totalPayment: result.totalLoanPayment,
                totalAcquisitionCost: result.totalAcquisitionCost,
              },
            },
          },
        });
        return NextResponse.json({
          success: true,
          data: { ...result, savedScenarioId: scenario.id },
        });
      }
    }

    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: "할부 계산 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
