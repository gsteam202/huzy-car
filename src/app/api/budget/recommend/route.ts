import { NextRequest, NextResponse } from "next/server";
import { getBudgetRecommendations } from "@/lib/recommendation";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { z } from "zod";

const budgetSchema = z.object({
  cashAvailable: z.number().min(0),
  reserveCash: z.number().min(0).optional(),
  cashForCar: z.number().min(0).optional(),
  tradeInValue: z.number().min(0).optional(),
  monthlyBudget: z.number().positive(),
  annualRatePct: z.number().min(0).max(30).optional(),
  termMonths: z.number().int().min(12).max(120).optional(),
  monthlyRunningBudget: z.number().min(0).optional(),
  carType: z.enum(["ALL", "NEW", "USED"]).optional(),
  preferredBrands: z.array(z.string()).optional(),
  vehicleTypes: z.array(z.string()).optional(),
  fuelTypes: z.array(z.string()).optional(),
  minSeatingCapacity: z.number().int().min(1).max(12).optional(),
  maxMileageKm: z.number().min(0).optional(),
  minYear: z.number().int().min(2010).max(2027).optional(),
  saveSearch: z.boolean().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = budgetSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: "입력값 검증 실패", details: parsed.error.format() },
        { status: 400 }
      );
    }

    const recommendations = await getBudgetRecommendations(parsed.data);

    // Save search if user is logged in
    const user = await getCurrentUser();
    if (user && parsed.data.saveSearch) {
      const searchRecord = await prisma.budgetSearch.create({
        data: {
          userId: user.id,
          cashAvailable: parsed.data.cashAvailable,
          reserveCash: parsed.data.reserveCash || 0,
          usableCash: recommendations.limits.usableCash,
          monthlyBudget: parsed.data.monthlyBudget,
          maxInterestRate: parsed.data.annualRatePct || 5.5,
          maxTermMonths: parsed.data.termMonths || 48,
          includeNew: parsed.data.carType !== "USED",
          includeUsed: parsed.data.carType !== "NEW",
          preferredBrandsJson: parsed.data.preferredBrands || [],
          preferredTypesJson: parsed.data.vehicleTypes || [],
          preferredFuelsJson: parsed.data.fuelTypes || [],
        },
      });

      await prisma.savedRecommendation.create({
        data: {
          userId: user.id,
          searchId: searchRecord.id,
          title: `월 ${Math.round(parsed.data.monthlyBudget / 10000)}만원 추천 (${recommendations.items.length}대)`,
          snapshotJson: recommendations.items.slice(0, 10) as any,
        },
      });
    }

    return NextResponse.json({
      success: true,
      data: recommendations,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: "예산 맞춤 추천 계산 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
