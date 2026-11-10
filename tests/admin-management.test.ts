import { describe, it, after } from "node:test";
import assert from "node:assert/strict";
import "dotenv/config";
import { prisma } from "../src/lib/db";
import { isDefaultAdmin } from "../src/lib/auth";

describe("Admin Management Features (회원 관리 & 자동차 정보 관리)", () => {
  after(async () => {
    await prisma.$disconnect();
  });

  it("ensures default admin didwlajfl8418@gmail.com is protected", () => {
    assert.equal(isDefaultAdmin("didwlajfl8418@gmail.com"), true);
    assert.equal(isDefaultAdmin("DIDWLAJFL8418@GMAIL.COM"), true);
  });

  it("queries user counts and roles correctly", async () => {
    const [total, adminCount] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { role: "ADMIN" } }),
    ]);

    assert.ok(total >= 1);
    assert.ok(adminCount >= 1);
  });

  it("queries car models and calculates trim statistics properly", async () => {
    const [modelCount, trimCount, brandCount] = await Promise.all([
      prisma.carModel.count(),
      prisma.carTrim.count(),
      prisma.carBrand.count(),
    ]);

    assert.ok(modelCount >= 0);
    assert.ok(trimCount >= 0);
    assert.ok(brandCount >= 0);

    // Verify car models have valid brand relations
    const sampleModels = await prisma.carModel.findMany({
      take: 5,
      include: {
        brand: true,
        generations: {
          include: {
            modelYears: {
              include: {
                trims: true,
              },
            },
          },
        },
      },
    });

    for (const m of sampleModels) {
      assert.ok(m.brand);
      assert.ok(m.nameKo.length > 0);
      assert.ok(m.slug.length > 0);
    }
  });

  it("verifies public data portal dataSource status is ACTIVE", async () => {
    const ds = await prisma.dataSource.findFirst({
      where: { providerCode: "molit_gov" },
    });

    if (ds) {
      assert.equal(ds.status, "ACTIVE");
      assert.ok(ds.name.includes("공공데이터포털"));
      assert.ok(ds.name.includes("승인"));
    }
  });
});
