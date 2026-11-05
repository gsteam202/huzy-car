import { prisma } from "@/lib/db";
import {
  BudgetSearchCriteria,
  BudgetRecommendationItem,
  calculateBudgetLimits,
  calculateInstallment,
  estimateMonthlyMaintenance,
  formatKoreanMoney,
} from "./finance";

export async function getBudgetRecommendations(
  criteria: BudgetSearchCriteria
): Promise<{
  limits: ReturnType<typeof calculateBudgetLimits>;
  items: BudgetRecommendationItem[];
  totalMatches: number;
}> {
  const limits = calculateBudgetLimits(criteria);
  const {
    usableCash,
    maxVehiclePrice,
    termMonths,
    annualRatePct,
  } = limits;

  const carType = criteria.carType || "ALL";
  const results: BudgetRecommendationItem[] = [];

  // 1. New Cars Search (if NEW or ALL)
  if (carType === "ALL" || carType === "NEW") {
    const whereClause: any = {
      price: { lte: maxVehiclePrice },
    };

    if (criteria.preferredBrands && criteria.preferredBrands.length > 0) {
      whereClause.modelYear = {
        generation: {
          model: {
            brand: {
              slug: { in: criteria.preferredBrands },
            },
          },
        },
      };
    }

    if (criteria.vehicleTypes && criteria.vehicleTypes.length > 0) {
      whereClause.modelYear = {
        ...whereClause.modelYear,
        generation: {
          ...whereClause.modelYear?.generation,
          model: {
            ...whereClause.modelYear?.generation?.model,
            vehicleType: { in: criteria.vehicleTypes as any },
          },
        },
      };
    }

    if (criteria.fuelTypes && criteria.fuelTypes.length > 0) {
      whereClause.fuelType = { in: criteria.fuelTypes as any };
    }

    if (criteria.minSeatingCapacity) {
      whereClause.seatingCapacity = { gte: criteria.minSeatingCapacity };
    }

    const trims = await prisma.carTrim.findMany({
      where: whereClause,
      include: {
        modelYear: {
          include: {
            generation: {
              include: {
                model: {
                  include: {
                    brand: true,
                  },
                },
              },
            },
          },
        },
        specs: true,
        newCarPrices: true,
      },
      orderBy: { price: "asc" },
      take: 40,
    });

    for (const t of trims) {
      const model = t.modelYear.generation.model;
      const brand = model.brand;

      // 선납금: 보유 가용현금 중 취등록세를 뺀 나머지로 충당 (최대 차량가격)
      const taxRate = model.vehicleType === "COMPACT" ? 0.04 : 0.07;
      const relief = t.fuelType === "ELECTRIC" ? 1400000 : 0;
      const rawTax = Math.floor(t.price * taxRate);
      const estTax = Math.max(0, rawTax - relief) + 350000;

      const downPayment = Math.min(Math.max(0, usableCash - estTax), t.price);

      const finance = calculateInstallment({
        vehiclePrice: t.price,
        downPayment,
        termMonths,
        annualRatePct,
        acquisitionTaxRate: taxRate,
        taxReliefAmount: relief,
        skipComparisons: true,
      });

      // 예산 초과 방지: 월 납입금이 사용자 예산 이하인지 재확인
      if (finance.monthlyPayment > criteria.monthlyBudget) {
        continue;
      }

      const maint = estimateMonthlyMaintenance(
        t.fuelType,
        t.engineDisplacement || 1999,
        t.fuelEfficiencyCombined || t.electricEfficiencyCombined || 12.0
      );

      if (
        criteria.monthlyRunningBudget &&
        finance.monthlyPayment + maint > criteria.monthlyRunningBudget
      ) {
        continue;
      }

      // 추천 사유 및 태그 결정
      let tag: BudgetRecommendationItem["recommendationTag"] = "VALUE_FOR_MONEY";
      let reason = `월 납입금 ${formatKoreanMoney(finance.monthlyPayment)}으로 부담 없이 즐기는 ${t.nameKo}`;

      if (t.fuelType === "HYBRID" || t.fuelType === "ELECTRIC") {
        tag = "ECO_SAVER";
        reason = `복합연비 ${t.fuelEfficiencyCombined || t.electricEfficiencyCombined}km로 월 유류비를 크게 절약하는 친환경 신차`;
      } else if (t.seatingCapacity >= 6 || model.vehicleType === "SUV" || model.vehicleType === "RV") {
        tag = "FAMILY_CHOICE";
        reason = `넓은 실내와 패밀리 안전 사양을 갖춘 ${t.seatingCapacity}인승 패밀리 신차`;
      } else if (t.price < maxVehiclePrice * 0.6) {
        tag = "LOWEST_PRICE";
        reason = `예산 대비 매우 여유로운 ${formatKoreanMoney(t.price)} 실속형 신차`;
      } else if (t.price >= maxVehiclePrice * 0.85) {
        tag = "BUDGET_MAXIMIZER";
        reason = `주어진 예산 범위 내에서 최고의 트림과 편의사양을 누릴 수 있는 추천 신차`;
      } else {
        tag = "BEST_NEW";
        reason = `대한민국 대표 인기 신차 모델로 감가 방어율과 만족도가 높음`;
      }

      results.push({
        id: `new-${t.id}`,
        type: "NEW",
        brandNameKo: brand.nameKo,
        brandSlug: brand.slug,
        modelNameKo: model.nameKo,
        modelSlug: model.slug,
        trimNameKo: t.nameKo,
        year: t.modelYear.year,
        price: t.price,
        imageUrl: model.imageUrl || undefined,
        fuelType: t.fuelType,
        vehicleType: model.vehicleType,
        fuelEfficiency: t.fuelEfficiencyCombined || t.electricEfficiencyCombined || undefined,
        initialCashRequired: finance.totalInitialCashRequired,
        monthlyPayment: finance.monthlyPayment,
        totalInterest: finance.totalInterest,
        totalAcquisitionCost: finance.totalAcquisitionCost,
        estimatedMonthlyMaintenance: maint,
        budgetSurplusMonthly: criteria.monthlyBudget - finance.monthlyPayment,
        recommendationTag: tag,
        recommendationReason: reason,
        detailUrl: `/new-cars/${brand.slug}/${model.slug}`,
      });
    }
  }

  // 2. Used Cars Search (if USED or ALL)
  if (carType === "ALL" || carType === "USED") {
    const whereUsed: any = {
      price: { lte: maxVehiclePrice },
      listingStatus: "ACTIVE",
    };

    if (criteria.preferredBrands && criteria.preferredBrands.length > 0) {
      whereUsed.brand = { slug: { in: criteria.preferredBrands } };
    }

    if (criteria.fuelTypes && criteria.fuelTypes.length > 0) {
      whereUsed.fuelType = { in: criteria.fuelTypes as any };
    }

    if (criteria.maxMileageKm) {
      whereUsed.mileageKm = { lte: criteria.maxMileageKm };
    }

    if (criteria.minYear) {
      whereUsed.year = { gte: criteria.minYear };
    }

    const usedListings = await prisma.usedCarListing.findMany({
      where: whereUsed,
      include: {
        brand: true,
        model: true,
      },
      orderBy: { price: "asc" },
      take: 40,
    });

    for (const u of usedListings) {
      // 중고차 취득세율 7% + 이전등록비 약 25만원
      const estTax = Math.floor(u.price * 0.07) + 250000;
      const downPayment = Math.min(Math.max(0, usableCash - estTax), u.price);

      const finance = calculateInstallment({
        vehiclePrice: u.price,
        downPayment,
        termMonths,
        annualRatePct,
        acquisitionTaxRate: 0.07,
        otherFees: 250000,
        skipComparisons: true,
      });

      if (finance.monthlyPayment > criteria.monthlyBudget) {
        continue;
      }

      const maint = estimateMonthlyMaintenance(u.fuelType, 1999, 12.0);

      let tag: BudgetRecommendationItem["recommendationTag"] = "BEST_USED";
      let reason = `신차 출고가 대비 감가 혜택을 톡톡히 누릴 수 있는 ${u.year}년식 무사고 인증 매물`;

      if (u.price < maxVehiclePrice * 0.5) {
        tag = "LOWEST_PRICE";
        reason = `월 ${formatKoreanMoney(finance.monthlyPayment)}으로 경제성이 뛰어난 알짜 중고차`;
      } else if (u.mileageKm < 30000) {
        tag = "VALUE_FOR_MONEY";
        reason = `주행거리 ${u.mileageKm.toLocaleString()}km로 신차급 컨디션을 유지한 가성비 매물`;
      }

      results.push({
        id: `used-${u.id}`,
        type: "USED",
        brandNameKo: u.brand.nameKo,
        brandSlug: u.brand.slug,
        modelNameKo: u.model.nameKo,
        modelSlug: u.model.slug,
        trimNameKo: `${u.year}년식 ${u.mileageKm.toLocaleString()}km`,
        year: u.year,
        mileageKm: u.mileageKm,
        price: u.price,
        imageUrl: u.imageUrl || u.model.imageUrl || undefined,
        fuelType: u.fuelType,
        vehicleType: u.model.vehicleType,
        initialCashRequired: finance.totalInitialCashRequired,
        monthlyPayment: finance.monthlyPayment,
        totalInterest: finance.totalInterest,
        totalAcquisitionCost: finance.totalAcquisitionCost,
        estimatedMonthlyMaintenance: maint,
        budgetSurplusMonthly: criteria.monthlyBudget - finance.monthlyPayment,
        recommendationTag: tag,
        recommendationReason: reason,
        detailUrl: `/used-cars/${u.brand.slug}/${u.model.slug}`,
      });
    }
  }

  // Sort by monthly budget surplus / best fit
  results.sort((a, b) => b.budgetSurplusMonthly - a.budgetSurplusMonthly);

  return {
    limits,
    items: results,
    totalMatches: results.length,
  };
}
