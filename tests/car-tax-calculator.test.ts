import { test } from "node:test";
import assert from "node:assert/strict";
import {
  calculateAcquisitionTaxDetails,
  calculateAnnualCarTaxDetails,
  calculateComprehensiveCarTax,
} from "../src/lib/tax-calculator";

test("Car Tax Engine: calculates passenger normal acquisition tax (7%)", () => {
  const result = calculateAcquisitionTaxDetails({
    vehiclePrice: 40000000,
    vehicleType: "PASSENGER_NORMAL",
    fuelType: "GASOLINE",
    displacementCc: 2497,
    registrationYear: 2026,
    isMultiChild: false,
  });

  assert.equal(result.baseTaxRatePct, 7);
  assert.equal(result.rawTaxAmount, 2800000);
  assert.equal(result.finalAcquisitionTax, 2800000);
});

test("Car Tax Engine: calculates compact car (경차) relief correctly", () => {
  const result = calculateAcquisitionTaxDetails({
    vehiclePrice: 15000000,
    vehicleType: "PASSENGER_COMPACT",
    fuelType: "GASOLINE",
    displacementCc: 998,
    registrationYear: 2026,
    isMultiChild: false,
  });

  // 15,000,000 * 4% = 600,000원. 75만원 이하이므로 전액 감면되어 0원
  assert.equal(result.baseTaxRatePct, 4);
  assert.equal(result.rawTaxAmount, 600000);
  assert.equal(result.compactRelief, 600000);
  assert.equal(result.finalAcquisitionTax, 0);
});

test("Car Tax Engine: calculates eco-friendly vehicle relief (Hybrid 40만, EV 140만)", () => {
  const hybrid = calculateAcquisitionTaxDetails({
    vehiclePrice: 40000000,
    vehicleType: "PASSENGER_NORMAL",
    fuelType: "HYBRID",
    displacementCc: 1598,
    registrationYear: 2026,
    isMultiChild: false,
  });
  // 4,000만 * 7% = 280만. 40만 감면 -> 240만
  assert.equal(hybrid.rawTaxAmount, 2800000);
  assert.equal(hybrid.ecoRelief, 400000);
  assert.equal(hybrid.finalAcquisitionTax, 2400000);

  const ev = calculateAcquisitionTaxDetails({
    vehiclePrice: 50000000,
    vehicleType: "PASSENGER_NORMAL",
    fuelType: "EV",
    displacementCc: 0,
    registrationYear: 2026,
    isMultiChild: false,
  });
  // 5,000만 * 7% = 350만. 140만 감면 -> 210만
  assert.equal(ev.rawTaxAmount, 3500000);
  assert.equal(ev.ecoRelief, 1400000);
  assert.equal(ev.finalAcquisitionTax, 2100000);
});

test("Car Tax Engine: calculates annual car tax and prepayment discount accurately", () => {
  // 1,598cc 승용 신차 (cc당 140원)
  const result = calculateAnnualCarTaxDetails({
    vehiclePrice: 25000000,
    vehicleType: "PASSENGER_NORMAL",
    fuelType: "GASOLINE",
    displacementCc: 1598,
    registrationYear: 2026,
    isMultiChild: false,
  });

  // 본세 = 1,598 * 140 = 223,720원
  assert.equal(result.rawAnnualTax, 223720);
  // 교육세 = 223,720 * 30% = 67,116원
  assert.equal(result.localEducationTax, 67116);
  // 총액 = 290,836원
  assert.equal(result.totalAnnualTax, 290836);
  // 1기분 + 2기분 = 총액
  assert.equal(result.halfYearInstallment1 + result.halfYearInstallment2, result.totalAnnualTax);
  // 연납 할인
  assert.ok(result.prepaymentSavings > 0);
  assert.equal(result.prepaymentAnnualTax, result.totalAnnualTax - result.prepaymentSavings);
});

test("Car Tax Engine: EV annual tax is fixed at 130,000 KRW", () => {
  const ev = calculateAnnualCarTaxDetails({
    vehiclePrice: 50000000,
    vehicleType: "PASSENGER_NORMAL",
    fuelType: "EV",
    displacementCc: 0,
    registrationYear: 2026,
    isMultiChild: false,
  });

  assert.equal(ev.rawAnnualTax, 100000);
  assert.equal(ev.localEducationTax, 30000);
  assert.equal(ev.totalAnnualTax, 130000);
});
