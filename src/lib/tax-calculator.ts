/**
 * CAR HUZY Automobile Tax & Acquisition Tax Calculation Engine
 * 2026 대한민국 자동차 취등록세, 공채할인, 연간 자동차세 및 연납할인 계산 공식
 */

export type VehicleFuelType = "GASOLINE" | "DIESEL" | "HYBRID" | "EV" | "HYDROGEN" | "LPG";

export type VehicleClassification =
  | "PASSENGER_NORMAL" // 일반 승용차 (7%)
  | "PASSENGER_COMPACT" // 경차 (4%, 75만원 감면)
  | "PASSENGER_7_TO_10" // 7~10인승 승용 (7%)
  | "VAN_11_PLUS" // 11인승 이상 승합차 (5%)
  | "TRUCK"; // 화물차 (5%)

export type RegionType = "SEOUL" | "GYEONGGI" | "OTHER";

export interface TaxCalculationInput {
  vehiclePrice: number; // 공급가액 or 실구입가 (원 단위)
  vehicleType: VehicleClassification;
  fuelType: VehicleFuelType;
  displacementCc: number; // 배기량 (cc, EV는 0)
  registrationYear: number; // 등록 연도 (예: 2026, 2024 등)
  isMultiChild: boolean; // 다자녀 감면 (18세 미만 자녀 2~3인 이상)
  region?: RegionType; // 등록 지역
}

export interface AcquisitionTaxDetail {
  baseTaxRatePct: number; // 기본 세율 (%)
  rawTaxAmount: number; // 감면 전 취득세
  compactRelief: number; // 경차 감면 (최대 75만원)
  ecoRelief: number; // 친환경차 감면 (하이브리드 40만, 전기/수소 140만)
  multiChildRelief: number; // 다자녀 감면 (최대 140만)
  finalAcquisitionTax: number; // 최종 납부 취득세
  bondEstimate: number; // 공채 매입/할인 예상 비용 (지자체별 채권할인 실부담금)
  incidentalFees: number; // 증지/인지대/번호판 등록비용 (약 70,000원)
  totalRegistrationCost: number; // 취등록 총 부대비용
}

export interface AnnualCarTaxDetail {
  baseCcRate: number; // cc당 단가 (80원, 140원, 200원, EV 100,000원)
  rawAnnualTax: number; // 본세 (감면 전)
  ageReductionRatePct: number; // 차령 경감율 (0% ~ 50%)
  discountedAnnualTax: number; // 경감 후 본세
  localEducationTax: number; // 지방교육세 (본세의 30%)
  totalAnnualTax: number; // 최종 연간 자동차세 (본세 + 교육세)
  halfYearInstallment1: number; // 1기분 (6월 납부액)
  halfYearInstallment2: number; // 2기분 (12월 납부액)
  prepaymentAnnualTax: number; // 1월 연납 시 할인 적용 금액
  prepaymentSavings: number; // 연납 시 절약 금액
}

export interface ComprehensiveTaxResult {
  input: TaxCalculationInput;
  acquisition: AcquisitionTaxDetail;
  annualTax: AnnualCarTaxDetail;
  threeYearTotalCost: number; // 취등록세 + 3년간 자동차세 총합
  fiveYearTotalCost: number; // 취등록세 + 5년간 자동차세 총합
}

/**
 * 취등록세 계산
 */
export function calculateAcquisitionTaxDetails(input: TaxCalculationInput): AcquisitionTaxDetail {
  const { vehiclePrice, vehicleType, fuelType, isMultiChild, region = "SEOUL" } = input;

  let baseTaxRatePct = 7;
  if (vehicleType === "PASSENGER_COMPACT") {
    baseTaxRatePct = 4;
  } else if (vehicleType === "VAN_11_PLUS" || vehicleType === "TRUCK") {
    baseTaxRatePct = 5;
  }

  const rawTaxAmount = Math.floor(vehiclePrice * (baseTaxRatePct / 100));

  // 1. 경차 감면 (최대 75만원)
  let compactRelief = 0;
  if (vehicleType === "PASSENGER_COMPACT") {
    compactRelief = Math.min(rawTaxAmount, 750000);
  }

  // 2. 친환경차 감면 (하이브리드 40만원, 전기/수소차 140만원)
  let ecoRelief = 0;
  if (fuelType === "HYBRID") {
    ecoRelief = Math.min(Math.max(0, rawTaxAmount - compactRelief), 400000);
  } else if (fuelType === "EV" || fuelType === "HYDROGEN") {
    ecoRelief = Math.min(Math.max(0, rawTaxAmount - compactRelief), 1400000);
  }

  // 3. 다자녀 감면 (일반 승용 최대 140만원, 7~10인승/승합 최대 200만원 또는 전액)
  let multiChildRelief = 0;
  if (isMultiChild) {
    const remainingTax = Math.max(0, rawTaxAmount - compactRelief - ecoRelief);
    if (vehicleType === "PASSENGER_7_TO_10" || vehicleType === "VAN_11_PLUS") {
      multiChildRelief = Math.min(remainingTax, 2000000);
    } else {
      multiChildRelief = Math.min(remainingTax, 1400000);
    }
  }

  const finalAcquisitionTax = Math.max(
    0,
    rawTaxAmount - compactRelief - ecoRelief - multiChildRelief
  );

  // 공채 할인 실부담금 추정 (배기량 및 지역에 따라 차등, 대략 차량가의 0.5% ~ 1.5% 수준 실부담)
  let bondRate = 0.008; // 약 0.8% 할인부담
  if (vehicleType === "PASSENGER_COMPACT" || fuelType === "EV" || fuelType === "HYDROGEN") {
    bondRate = 0; // 경차 및 친환경차 공채 면제
  } else if (region === "SEOUL") {
    bondRate = 0.01;
  }
  const bondEstimate = Math.floor(vehiclePrice * bondRate);

  // 인지/증지대/등록대행/번호판 부대비용
  const incidentalFees = 70000;

  return {
    baseTaxRatePct,
    rawTaxAmount,
    compactRelief,
    ecoRelief,
    multiChildRelief,
    finalAcquisitionTax,
    bondEstimate,
    incidentalFees,
    totalRegistrationCost: finalAcquisitionTax + bondEstimate + incidentalFees,
  };
}

/**
 * 연간 자동차세 계산 (배기량, 차령, 지방교육세 30%, 연납할인 포함)
 */
export function calculateAnnualCarTaxDetails(input: TaxCalculationInput): AnnualCarTaxDetail {
  const { vehicleType, fuelType, displacementCc, registrationYear } = input;
  const currentYear = 2026;

  // 1. cc당 기본 세율 산출
  let baseCcRate = 0;
  let rawAnnualTax = 0;

  if (fuelType === "EV" || fuelType === "HYDROGEN") {
    // 전기차/수소차는 정액 100,000원
    baseCcRate = 0;
    rawAnnualTax = 100000;
  } else if (vehicleType === "PASSENGER_COMPACT" || displacementCc <= 1000) {
    baseCcRate = 80;
    rawAnnualTax = displacementCc * baseCcRate;
  } else if (displacementCc <= 1600) {
    baseCcRate = 140;
    rawAnnualTax = displacementCc * baseCcRate;
  } else {
    baseCcRate = 200;
    rawAnnualTax = displacementCc * baseCcRate;
  }

  // 2. 차령 경감율 계산 (3년차부터 매년 5%씩 최대 50%)
  const vehicleAge = Math.max(1, currentYear - registrationYear + 1);
  let ageReductionRatePct = 0;
  if (vehicleAge >= 3) {
    ageReductionRatePct = Math.min(50, (vehicleAge - 2) * 5);
  }

  // 전기차는 차령 경감 미적용 (정액 세액)
  if (fuelType === "EV" || fuelType === "HYDROGEN") {
    ageReductionRatePct = 0;
  }

  const discountedAnnualTax = Math.floor(rawAnnualTax * (1 - ageReductionRatePct / 100));

  // 3. 지방교육세 (본세의 30%)
  const localEducationTax = Math.floor(discountedAnnualTax * 0.3);
  const totalAnnualTax = discountedAnnualTax + localEducationTax;

  // 1기분(6월), 2기분(12월)
  const halfYearInstallment1 = Math.floor(totalAnnualTax / 2);
  const halfYearInstallment2 = totalAnnualTax - halfYearInstallment1;

  // 1월 연납 할인 (약 3.0% 절감)
  const prepaymentSavings = Math.floor(totalAnnualTax * 0.03);
  const prepaymentAnnualTax = totalAnnualTax - prepaymentSavings;

  return {
    baseCcRate,
    rawAnnualTax,
    ageReductionRatePct,
    discountedAnnualTax,
    localEducationTax,
    totalAnnualTax,
    halfYearInstallment1,
    halfYearInstallment2,
    prepaymentAnnualTax,
    prepaymentSavings,
  };
}

/**
 * 종합 자동차 세금 계산 (취등록세 + 연간 자동차세 + 3/5년 누적 보유비용)
 */
export function calculateComprehensiveCarTax(input: TaxCalculationInput): ComprehensiveTaxResult {
  const acquisition = calculateAcquisitionTaxDetails(input);
  const annualTax = calculateAnnualCarTaxDetails(input);

  // 3년 보유비용: 취등록 부대비용 + 3개년 자동차세 (연식 경감 반영)
  let cumulativeTax3Years = 0;
  for (let yearOffset = 0; yearOffset < 3; yearOffset++) {
    const yrTax = calculateAnnualCarTaxDetails({
      ...input,
      registrationYear: input.registrationYear - yearOffset,
    });
    cumulativeTax3Years += yrTax.totalAnnualTax;
  }

  // 5년 보유비용
  let cumulativeTax5Years = 0;
  for (let yearOffset = 0; yearOffset < 5; yearOffset++) {
    const yrTax = calculateAnnualCarTaxDetails({
      ...input,
      registrationYear: input.registrationYear - yearOffset,
    });
    cumulativeTax5Years += yrTax.totalAnnualTax;
  }

  return {
    input,
    acquisition,
    annualTax,
    threeYearTotalCost: acquisition.totalRegistrationCost + cumulativeTax3Years,
    fiveYearTotalCost: acquisition.totalRegistrationCost + cumulativeTax5Years,
  };
}
