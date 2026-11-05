/**
 * CAR HUZY Finance & Budget Calculation Engine
 * Core logic for automobile financing, installment amortization, and budget-based recommendations.
 */

export interface InstallmentInput {
  vehiclePrice: number; // 원 단위
  downPayment: number; // 원 단위 (선납금)
  termMonths: number; // 12, 24, 36, 48, 60, 72
  annualRatePct: number; // 연이율 (예: 5.5 -> 5.5%)
  productType?: "STANDARD" | "ZERO_INTEREST" | "BALLOON";
  balloonAmount?: number; // 만기 유예금(원)
  acquisitionTaxRate?: number; // 취득세율 (기본 0.07 = 7%, 경차 0.04 등)
  taxReliefAmount?: number; // 감면액 (예: 전기차 140만원 등)
  otherFees?: number; // 부대비용 및 등록비 (기본 약 350,000원)
  includeTaxInLoan?: boolean; // 취등록세를 할부원금에 포함할지 여부
  skipComparisons?: boolean; // 재귀 비교 방지 플래그
}

export interface AmortizationScheduleItem {
  month: number;
  payment: number;
  principal: number;
  interest: number;
  remainingPrincipal: number;
}

export interface InstallmentResult {
  vehiclePrice: number;
  downPayment: number;
  loanPrincipal: number;
  termMonths: number;
  annualRatePct: number;
  productType: "STANDARD" | "ZERO_INTEREST" | "BALLOON";
  balloonAmount: number;
  acquisitionTax: number;
  otherFees: number;
  totalInitialCashRequired: number; // 초기 필요 현금 (선납금 + 현금납부 취등록세/부대비용)
  monthlyPayment: number; // 월 납입금
  totalInterest: number; // 총 이자
  totalLoanPayment: number; // 총 할부 납입금 (원금 + 이자 + 유예금)
  totalAcquisitionCost: number; // 차량 구입 총비용 (차량가 + 세금 + 부대비용 + 총이자)
  schedule: AmortizationScheduleItem[];
  termComparison: { termMonths: number; monthlyPayment: number; totalInterest: number; totalCost: number }[];
  rateComparison: { ratePct: number; monthlyPayment: number; totalInterest: number }[];
}

/**
 * 취득세 계산 (경차 감면, 친환경차 감면 반영)
 */
export function calculateAcquisitionTax(
  price: number,
  taxRate: number = 0.07,
  taxRelief: number = 0,
  isCompact: boolean = false
): number {
  if (isCompact) {
    // 경차: 4%, 최대 75만원 감면
    const rawTax = Math.floor(price * 0.04);
    return Math.max(0, rawTax - 750000);
  }
  const rawTax = Math.floor(price * taxRate);
  return Math.max(0, rawTax - taxRelief);
}

/**
 * 자동차 할부 견적 계산 (원리금균등, 무이자, 잔가유예형)
 */
export function calculateInstallment(input: InstallmentInput): InstallmentResult {
  const {
    vehiclePrice,
    downPayment,
    termMonths,
    annualRatePct,
    productType = "STANDARD",
    balloonAmount = 0,
    acquisitionTaxRate = 0.07,
    taxReliefAmount = 0,
    otherFees = 350000,
    includeTaxInLoan = false,
  } = input;

  const validTerm = Math.max(1, termMonths);
  const acquisitionTax = calculateAcquisitionTax(vehiclePrice, acquisitionTaxRate, taxReliefAmount);
  const totalTaxesAndFees = acquisitionTax + otherFees;

  // 순수 차량 할부 원금
  const netVehicleLoan = Math.max(0, vehiclePrice - downPayment - balloonAmount);
  const loanPrincipal = includeTaxInLoan ? netVehicleLoan + totalTaxesAndFees : netVehicleLoan;

  const totalInitialCashRequired = includeTaxInLoan
    ? downPayment
    : downPayment + totalTaxesAndFees;

  let monthlyPayment = 0;
  let totalInterest = 0;
  const schedule: AmortizationScheduleItem[] = [];

  const monthlyRate = (annualRatePct / 100) / 12;

  if (productType === "ZERO_INTEREST" || annualRatePct === 0) {
    // 무이자 할부
    monthlyPayment = Math.round(loanPrincipal / validTerm);
    let remaining = loanPrincipal;
    for (let m = 1; m <= validTerm; m++) {
      const isLast = m === validTerm;
      const principalPart = isLast ? remaining : monthlyPayment;
      remaining -= principalPart;
      schedule.push({
        month: m,
        payment: principalPart,
        principal: principalPart,
        interest: 0,
        remainingPrincipal: Math.max(0, remaining),
      });
    }
    totalInterest = 0;
  } else if (productType === "BALLOON" && balloonAmount > 0) {
    // 잔가보장/유예형 할부: 유예금은 만기에 일시상환, 매월 유예금에 대한 이자 + 분할상환원금에 대한 원리금 납부
    const amortizedLoan = loanPrincipal;
    const amortizedMonthly =
      monthlyRate > 0
        ? Math.round(
            (amortizedLoan * (monthlyRate * Math.pow(1 + monthlyRate, validTerm))) /
              (Math.pow(1 + monthlyRate, validTerm) - 1)
          )
        : Math.round(amortizedLoan / validTerm);

    const monthlyBalloonInterest = Math.round(balloonAmount * monthlyRate);
    monthlyPayment = amortizedMonthly + monthlyBalloonInterest;

    let remainingAmortized = amortizedLoan;
    for (let m = 1; m <= validTerm; m++) {
      const isLast = m === validTerm;
      const interestPart = Math.round(remainingAmortized * monthlyRate) + monthlyBalloonInterest;
      totalInterest += interestPart;
      const principalPart = isLast ? remainingAmortized : amortizedMonthly - Math.round(remainingAmortized * monthlyRate);
      remainingAmortized -= principalPart;
      schedule.push({
        month: m,
        payment: principalPart + interestPart + (isLast ? balloonAmount : 0),
        principal: principalPart,
        interest: interestPart,
        remainingPrincipal: Math.max(0, remainingAmortized + (isLast ? 0 : balloonAmount)),
      });
    }
  } else {
    // 표준 원리금균등분할상환
    if (monthlyRate > 0) {
      const factor = Math.pow(1 + monthlyRate, validTerm);
      monthlyPayment = Math.round((loanPrincipal * (monthlyRate * factor)) / (factor - 1));
    } else {
      monthlyPayment = Math.round(loanPrincipal / validTerm);
    }

    let remaining = loanPrincipal;
    for (let m = 1; m <= validTerm; m++) {
      const isLast = m === validTerm;
      const interestPart = Math.round(remaining * monthlyRate);
      totalInterest += interestPart;
      const principalPart = isLast ? remaining : monthlyPayment - interestPart;
      remaining -= principalPart;
      schedule.push({
        month: m,
        payment: principalPart + interestPart,
        principal: principalPart,
        interest: interestPart,
        remainingPrincipal: Math.max(0, remaining),
      });
    }
  }

  const totalLoanPayment = loanPrincipal + totalInterest + (productType === "BALLOON" ? balloonAmount : 0);
  const totalAcquisitionCost =
    vehiclePrice + totalTaxesAndFees + totalInterest;

  // 기간별 비교 (12, 24, 36, 48, 60, 72)
  const candidateTerms = [12, 24, 36, 48, 60, 72];
  const termComparison = input.skipComparisons
    ? []
    : candidateTerms.map((t) => {
        if (t === validTerm) {
          return {
            termMonths: t,
            monthlyPayment,
            totalInterest,
            totalCost: totalAcquisitionCost,
          };
        }
        const subResult = calculateInstallment({
          ...input,
          termMonths: t,
          skipComparisons: true,
        });
        return {
          termMonths: t,
          monthlyPayment: subResult.monthlyPayment,
          totalInterest: subResult.totalInterest,
          totalCost: subResult.totalAcquisitionCost,
        };
      });

  // 금리별 비교 (3.5%, 4.5%, 5.5%, 6.5%, 7.5%, 8.5%)
  const candidateRates = [3.5, 4.5, 5.5, 6.5, 7.5, 8.5];
  const rateComparison = input.skipComparisons
    ? []
    : candidateRates.map((r) => {
        if (r === annualRatePct) {
          return { ratePct: r, monthlyPayment, totalInterest };
        }
        const subResult = calculateInstallment({
          ...input,
          annualRatePct: r,
          skipComparisons: true,
        });
        return {
          ratePct: r,
          monthlyPayment: subResult.monthlyPayment,
          totalInterest: subResult.totalInterest,
        };
      });

  return {
    vehiclePrice,
    downPayment,
    loanPrincipal,
    termMonths: validTerm,
    annualRatePct,
    productType,
    balloonAmount,
    acquisitionTax,
    otherFees,
    totalInitialCashRequired,
    monthlyPayment,
    totalInterest,
    totalLoanPayment,
    totalAcquisitionCost,
    schedule,
    termComparison,
    rateComparison,
  };
}

/**
 * 월 납입금 한도로부터 최대 할부 원금 역산
 */
export function calculateMaxLoanPrincipal(
  monthlyBudget: number,
  annualRatePct: number,
  termMonths: number
): number {
  if (monthlyBudget <= 0 || termMonths <= 0) return 0;
  if (annualRatePct <= 0) {
    return monthlyBudget * termMonths;
  }
  const monthlyRate = (annualRatePct / 100) / 12;
  const factor = Math.pow(1 + monthlyRate, termMonths);
  // P = M * (factor - 1) / (monthlyRate * factor)
  return Math.floor((monthlyBudget * (factor - 1)) / (monthlyRate * factor));
}

/**
 * 예산 입력 파라미터
 */
export interface BudgetSearchCriteria {
  cashAvailable: number; // 현재 보유 현금 (원)
  reserveCash?: number; // 비상예비자금 (원)
  cashForCar?: number; // 차량 구매에 직접 사용할 현금 (지정 시 우선)
  tradeInValue?: number; // 기존 차량 매각 예상금액 (원)
  monthlyBudget: number; // 월 최대 할부 납입금 (원)
  annualRatePct?: number; // 연 할부금리 (% 기본 5.5%)
  termMonths?: number; // 할부기간 (기본 48개월)
  monthlyRunningBudget?: number; // 월 자동차 유지비 상한 (선택)
  carType?: "ALL" | "NEW" | "USED"; // 신차/중고차 구분
  preferredBrands?: string[];
  vehicleTypes?: string[];
  fuelTypes?: string[];
  minSeatingCapacity?: number;
  maxMileageKm?: number;
  minYear?: number;
}

export interface BudgetRecommendationItem {
  id: string;
  type: "NEW" | "USED";
  brandNameKo: string;
  brandSlug: string;
  modelNameKo: string;
  modelSlug: string;
  trimNameKo?: string;
  year: number;
  mileageKm?: number;
  price: number;
  imageUrl?: string;
  fuelType: string;
  vehicleType: string;
  fuelEfficiency?: number;
  initialCashRequired: number;
  monthlyPayment: number;
  totalInterest: number;
  totalAcquisitionCost: number;
  estimatedMonthlyMaintenance: number;
  budgetSurplusMonthly: number; // 월 납입 한도 대비 여유 금액
  recommendationTag:
    | "LOWEST_PRICE" // 가장 저렴한 차량
    | "VALUE_FOR_MONEY" // 가성비 추천
    | "FAMILY_CHOICE" // 가족용 추천
    | "ECO_SAVER" // 유지비 절약형
    | "BEST_NEW" // 신차 추천
    | "BEST_USED" // 중고차 추천
    | "BUDGET_MAXIMIZER"; // 예산 최적 활용형
  recommendationReason: string;
  detailUrl: string;
}

/**
 * 월간 예상 유지비 추산 (유류비 + 자동차세 1/12 + 보험료 1/12)
 */
export function estimateMonthlyMaintenance(
  fuelType: string,
  displacementCc: number = 1999,
  fuelEfficiencyKmPerL: number = 12.0,
  monthlyDrivingKm: number = 1000
): number {
  // 1. 유류비 / 전비 계산
  let fuelCostPerUnit = 1680; // 휘발유 평균 (원/L)
  if (fuelType === "DIESEL") fuelCostPerUnit = 1530;
  if (fuelType === "LPG") fuelCostPerUnit = 980;
  if (fuelType === "ELECTRIC") {
    // 전기차 전비 (km/kWh), 단가 약 340원/kWh
    const electricEfficiency = fuelEfficiencyKmPerL > 0 ? fuelEfficiencyKmPerL : 5.0;
    const monthlyFuel = Math.round((monthlyDrivingKm / electricEfficiency) * 340);
    // 전기차 자동차세 130,000원/년 + 기본 보험료 900,000원/년
    const monthlyTax = Math.round(130000 / 12);
    const monthlyInsurance = Math.round(900000 / 12);
    return monthlyFuel + monthlyTax + monthlyInsurance;
  }

  const validEfficiency = fuelEfficiencyKmPerL > 0 ? fuelEfficiencyKmPerL : 11.5;
  const monthlyFuel = Math.round((monthlyDrivingKm / validEfficiency) * fuelCostPerUnit);

  // 2. 연간 자동차세 (배기량 기준)
  let annualTax = 0;
  if (displacementCc <= 1000) {
    annualTax = displacementCc * 104; // 경차
  } else if (displacementCc <= 1600) {
    annualTax = displacementCc * 182; // 소형
  } else {
    annualTax = displacementCc * 260; // 중대형
  }
  const monthlyTax = Math.round(annualTax / 12);

  // 3. 월 예상 보험료 (평균 950,000원/년 가정)
  const monthlyInsurance = Math.round(950000 / 12);

  return monthlyFuel + monthlyTax + monthlyInsurance;
}

/**
 * 예산 역산 및 최대 구매 가능 차량 가격 계산
 */
export function calculateBudgetLimits(criteria: BudgetSearchCriteria) {
  const {
    cashAvailable,
    reserveCash = 0,
    cashForCar,
    tradeInValue = 0,
    monthlyBudget,
    annualRatePct = 5.5,
    termMonths = 48,
  } = criteria;

  const usableCash =
    cashForCar !== undefined
      ? cashForCar + tradeInValue
      : Math.max(0, cashAvailable - reserveCash) + tradeInValue;

  const maxLoanPrincipal = calculateMaxLoanPrincipal(monthlyBudget, annualRatePct, termMonths);
  const totalFinancialPower = usableCash + maxLoanPrincipal;

  // 취득세 7% 및 부대비용 35만원을 고려한 차량가격 상한 X
  // X * 1.07 + 350,000 <= totalFinancialPower
  const maxVehiclePrice = Math.max(0, Math.floor((totalFinancialPower - 350000) / 1.07));

  return {
    usableCash,
    maxLoanPrincipal,
    totalFinancialPower,
    maxVehiclePrice,
    termMonths,
    annualRatePct,
  };
}

/**
 * 원 단위 금액을 한국어 친화적인 표기(만원 / 억원)로 변환
 */
export function formatKoreanMoney(amountInWon: number): string {
  if (amountInWon <= 0) return "0원";
  const manwon = Math.floor(amountInWon / 10000);
  if (manwon >= 10000) {
    const eok = Math.floor(manwon / 10000);
    const remManwon = manwon % 10000;
    return remManwon > 0 ? `${eok}억 ${remManwon.toLocaleString()}만원` : `${eok}억원`;
  }
  return `${manwon.toLocaleString()}만원`;
}
