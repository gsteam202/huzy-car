import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  calculateInstallment,
  calculateAcquisitionTax,
  calculateMaxLoanPrincipal,
  calculateBudgetLimits,
  formatKoreanMoney,
  estimateMonthlyMaintenance,
} from "../src/lib/finance";

describe("Financial Engine Tests", () => {
  it("calculates standard installment accurately", () => {
    // 차량가격 30,000,000원, 선납금 10,000,000원 -> 할부원금 20,000,000원, 36개월, 연 5.0%
    const res = calculateInstallment({
      vehiclePrice: 30000000,
      downPayment: 10000000,
      termMonths: 36,
      annualRatePct: 5.0,
      acquisitionTaxRate: 0.07,
      otherFees: 350000,
      includeTaxInLoan: false,
    });

    assert.equal(res.vehiclePrice, 30000000);
    assert.equal(res.downPayment, 10000000);
    assert.equal(res.loanPrincipal, 20000000);
    assert.equal(res.termMonths, 36);

    // 2000만원, 36개월, 5% 공식: 약 599,418원
    assert.ok(res.monthlyPayment >= 598000 && res.monthlyPayment <= 601000);
    assert.equal(res.schedule.length, 36);

    // 총 상환 원금 합계가 loanPrincipal과 일치해야 함
    const sumPrincipal = res.schedule.reduce((acc, s) => acc + s.principal, 0);
    assert.equal(sumPrincipal, 20000000);

    // 초기 필요 현금 = 선납금 1000만 + 취득세(210만) + 부대비용(35만) = 1245만원
    assert.equal(res.totalInitialCashRequired, 10000000 + 2100000 + 350000);
  });

  it("handles zero-interest installment correctly", () => {
    const res = calculateInstallment({
      vehiclePrice: 24000000,
      downPayment: 0,
      termMonths: 24,
      annualRatePct: 0,
      productType: "ZERO_INTEREST",
    });

    assert.equal(res.monthlyPayment, 1000000);
    assert.equal(res.totalInterest, 0);
    assert.equal(res.totalLoanPayment, 24000000);
  });

  it("reverses max loan principal from monthly budget", () => {
    // 월 50만원, 연 6.0%, 48개월
    const maxLoan = calculateMaxLoanPrincipal(500000, 6.0, 48);
    assert.ok(maxLoan > 21000000 && maxLoan < 21500000);

    // 다시 그 금액으로 월 납입금을 계산하면 50만원 안팎이어야 함
    const check = calculateInstallment({
      vehiclePrice: maxLoan,
      downPayment: 0,
      termMonths: 48,
      annualRatePct: 6.0,
      includeTaxInLoan: false,
    });
    assert.ok(Math.abs(check.monthlyPayment - 500000) < 1000);
  });

  it("calculates budget limits properly", () => {
    const limits = calculateBudgetLimits({
      cashAvailable: 20000000,
      reserveCash: 5000000, // 비상금 500만
      monthlyBudget: 600000, // 월 60만
      annualRatePct: 5.5,
      termMonths: 48,
    });

    assert.equal(limits.usableCash, 15000000); // 2000만 - 500만 = 1500만
    assert.ok(limits.maxLoanPrincipal > 25000000);
    assert.ok(limits.maxVehiclePrice > 35000000);
  });

  it("formats Korean money appropriately", () => {
    assert.equal(formatKoreanMoney(0), "0원");
    assert.equal(formatKoreanMoney(35000000), "3,500만원");
    assert.equal(formatKoreanMoney(120000000), "1억 2,000만원");
    assert.equal(formatKoreanMoney(100000000), "1억원");
  });

  it("calculates acquisition taxes with relief", () => {
    // 승용차 7%
    assert.equal(calculateAcquisitionTax(40000000, 0.07, 0, false), 2800000);
    // 전기차 140만원 감면
    assert.equal(calculateAcquisitionTax(50000000, 0.07, 1400000, false), 3500000 - 1400000);
    // 경차 4% - 최대 75만원 감면
    // 1500만원 * 0.04 = 60만원 - 75만원 = 0원
    assert.equal(calculateAcquisitionTax(15000000, 0.04, 0, true), 0);
  });
});
