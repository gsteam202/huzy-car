import { describe, it, after } from "node:test";
import assert from "node:assert/strict";
import "dotenv/config";
import { getBudgetRecommendations } from "../src/lib/recommendation";
import { prisma } from "../src/lib/db";

describe("Recommendation Engine Integration Tests", () => {
  after(async () => {
    await prisma.$disconnect();
  });
  it("recommends cars strictly within budget bounds", async () => {
    // 1500만원 가용현금, 월 60만원 한도, 48개월, 연 5.5%
    const res = await getBudgetRecommendations({
      cashAvailable: 15000000,
      reserveCash: 0,
      monthlyBudget: 600000,
      annualRatePct: 5.5,
      termMonths: 48,
      carType: "ALL",
    });

    assert.ok(res.limits.maxVehiclePrice > 0);
    assert.ok(res.items.length > 0);

    // Verify every single recommendation item obeys budget!
    for (const item of res.items) {
      assert.ok(
        item.monthlyPayment <= 600000,
        `Item ${item.modelNameKo} monthly payment ${item.monthlyPayment} exceeds budget 600,000`
      );
      assert.ok(item.price <= res.limits.maxVehiclePrice);
      assert.ok(item.recommendationTag);
      assert.ok(item.recommendationReason);
    }
  });

  it("filters correctly by fuel type and car type", async () => {
    const res = await getBudgetRecommendations({
      cashAvailable: 20000000,
      monthlyBudget: 800000,
      fuelTypes: ["HYBRID"],
      carType: "NEW",
    });

    for (const item of res.items) {
      assert.equal(item.type, "NEW");
      assert.equal(item.fuelType, "HYBRID");
    }
  });
});
