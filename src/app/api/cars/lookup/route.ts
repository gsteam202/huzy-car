import { NextRequest, NextResponse } from "next/server";
import { tsCarApiClient, normalizeCarPlate } from "@/lib/providers/ts-car-api-client";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const rawPlate = searchParams.get("vhrNo") || searchParams.get("plate");
    const isDealerStock = searchParams.get("dealer") === "true" || searchParams.get("isDealerStock") === "true";
    const thirdPartyConsent = searchParams.get("consent") === "true";

    if (!rawPlate || !rawPlate.trim()) {
      return NextResponse.json(
        {
          success: false,
          error: "차량등록번호(예: 12가 3456)를 입력해주세요.",
        },
        { status: 400 }
      );
    }

    const normalized = normalizeCarPlate(rawPlate);

    if (!tsCarApiClient.isValidPlate(normalized)) {
      return NextResponse.json(
        {
          success: false,
          error: "유효한 대한민국 차량번호 형식이 아닙니다. (예: 12가 3456, 123허 5678, 서울12가 3456)",
        },
        { status: 400 }
      );
    }

    const result = await tsCarApiClient.getCarComprehensiveInfo(normalized, {
      isDealerStock,
      thirdPartyConsent,
    });

    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (err: any) {
    console.error("TS Car Lookup API Error:", err);
    return NextResponse.json(
      {
        success: false,
        error: err.message || "차량종합정보 조회 중 오류가 발생했습니다.",
      },
      { status: 500 }
    );
  }
}
