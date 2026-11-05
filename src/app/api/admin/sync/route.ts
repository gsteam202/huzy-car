import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { getDataProvider, getDataProviders } from "@/lib/providers";
import { prisma } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "ADMIN") {
      return NextResponse.json(
        { success: false, error: "관리자 권한이 필요합니다." },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(req.url);
    const providerCode = searchParams.get("provider");

    if (providerCode) {
      const provider = getDataProvider(providerCode);
      if (!provider) {
        return NextResponse.json(
          { success: false, error: "존재하지 않는 프로바이더입니다." },
          { status: 404 }
        );
      }

      const report = await provider.synchronize();

      // Log admin audit
      await prisma.adminAuditLog.create({
        data: {
          adminId: user.id,
          action: "SYNC_PROVIDER",
          targetType: "DATA_SOURCE",
          targetId: providerCode,
          detailsJson: report as any,
        },
      });

      return NextResponse.json({ success: true, data: report });
    }

    // Sync all providers
    const providers = getDataProviders();
    const reports = await Promise.all(providers.map((p) => p.synchronize()));

    await prisma.adminAuditLog.create({
      data: {
        adminId: user.id,
        action: "SYNC_ALL_PROVIDERS",
        targetType: "DATA_SOURCES",
        detailsJson: reports as any,
      },
    });

    return NextResponse.json({ success: true, data: reports });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: "데이터 동기화 실패: " + error.message },
      { status: 500 }
    );
  }
}
