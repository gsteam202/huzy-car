import { describe, it } from "node:test";
import assert from "node:assert/strict";
import "dotenv/config";
import {
  tsCarApiClient,
  normalizeCarPlate,
} from "../src/lib/providers/ts-car-api-client";

describe("TS Attached Car Info API (한국교통안전공단 자동차종합정보 첨부형 3종)", () => {
  it("validates and normalizes Korean license plates correctly", () => {
    // 2자리 구형 및 3자리 신형 번호판
    assert.equal(tsCarApiClient.isValidPlate("12가3456"), true);
    assert.equal(tsCarApiClient.isValidPlate("123가4567"), true);
    assert.equal(tsCarApiClient.isValidPlate(" 52하 9988 "), true);
    assert.equal(tsCarApiClient.isValidPlate("01가 1234"), true);

    // 잘못된 번호판
    assert.equal(tsCarApiClient.isValidPlate("ABC-1234"), false);
    assert.equal(tsCarApiClient.isValidPlate("1234"), false);
    assert.equal(tsCarApiClient.isValidPlate("가123456"), false);

    // 정규화 (공백 일관성)
    assert.equal(normalizeCarPlate("12가3456"), "12가 3456");
    assert.equal(normalizeCarPlate(" 123가4567 "), "123가 4567");
    assert.equal(normalizeCarPlate("52 하 9988"), "52하 9988");
  });

  it("fetches comprehensive attached 3-in-1 info for a dealer car", async () => {
    const plate = "12가 3456"; // predefined mock: Grandeur
    const info = await tsCarApiClient.getCarComprehensiveInfo(plate, {
      isDealerStock: true,
    });

    assert.equal(info.vhrNo, "12가 3456");
    assert.equal(info.source, "TS_KOTSA_ATTACHED_API");
    assert.equal(info.isDealerStock, true);
    assert.equal(info.thirdPartyConsentRequired, false);
    assert.equal(info.thirdPartyConsentGranted, true);

    // 1. 기본정보 검증
    assert.ok(info.basicInfo);
    assert.equal(info.basicInfo.vhrNo, "12가 3456");
    assert.ok(info.basicInfo.modelName.length > 0);
    assert.ok(info.basicInfo.modelYear >= 2020);
    assert.ok(info.basicInfo.vinMasked.length > 5);

    // 2. 제원정보1 검증 (엔진, 배기량, 연료, 정원)
    assert.ok(info.spec1);
    assert.ok(info.spec1.displacementCc >= 0);
    assert.ok(info.spec1.seatingCapacity > 0);
    assert.ok(info.spec1.fuelTypeKo.length > 0);

    // 3. 제원정보2 검증 (치수, 중량, 연비)
    assert.ok(info.spec2);
    assert.ok(info.spec2.lengthMm > 3000);
    assert.ok(info.spec2.widthMm > 1500);
    assert.ok(info.spec2.heightMm > 1200);
    assert.ok(info.spec2.wheelbaseMm > 2000);
    assert.ok(info.spec2.grossWeightKg > 1000);

    // 카탈로그 매핑
    assert.ok(info.matchingCatalogModel);
    assert.ok(info.matchingCatalogModel.brandNameKo.length > 0);
  });

  it("handles private car consent properly", async () => {
    const plate = "123가 4567";
    // Case A: Without consent
    const infoWithoutConsent = await tsCarApiClient.getCarComprehensiveInfo(plate, {
      isDealerStock: false,
      thirdPartyConsent: false,
    });
    assert.equal(infoWithoutConsent.thirdPartyConsentRequired, true);
    assert.equal(infoWithoutConsent.thirdPartyConsentGranted, false);

    // Case B: With consent
    const infoWithConsent = await tsCarApiClient.getCarComprehensiveInfo(plate, {
      isDealerStock: false,
      thirdPartyConsent: true,
    });
    assert.equal(infoWithConsent.thirdPartyConsentRequired, true);
    assert.equal(infoWithConsent.thirdPartyConsentGranted, true);
    assert.ok(infoWithConsent.basicInfo.modelName.length > 0);
  });

  it("dynamically generates consistent fallback for arbitrary valid Korean plates", async () => {
    const arbitraryPlate = "88다 7721";
    const res = await tsCarApiClient.getCarComprehensiveInfo(arbitraryPlate, {
      thirdPartyConsent: true,
    });

    assert.equal(res.vhrNo, "88다 7721");
    assert.ok(res.basicInfo.modelName.length > 0);
    assert.ok(res.spec1.displacementCc > 0);
    assert.ok(res.spec2.lengthMm > 0);
  });

  it("rejects invalid plate format with clear error message", async () => {
    await assert.rejects(
      async () => {
        await tsCarApiClient.getCarComprehensiveInfo("INVALID-PLATE");
      },
      /올바른 대한민국 차량번호/
    );
  });
});
