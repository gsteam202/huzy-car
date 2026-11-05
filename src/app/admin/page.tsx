import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { AdminManager } from "@/components/admin/admin-manager";
import { ShieldCheck, Database, FileSpreadsheet, RefreshCw, Users, Car } from "lucide-react";

export const revalidate = 0;

export default async function AdminPage() {
  const user = await getCurrentUser();
  if (!user || user.role !== "ADMIN") {
    redirect("/auth/login?callbackUrl=/admin");
  }

  // Fetch metrics
  const [modelCount, trimCount, usedCount, userCount, postCount, dataSources, auditLogs] =
    await Promise.all([
      prisma.carModel.count(),
      prisma.carTrim.count(),
      prisma.usedCarListing.count(),
      prisma.user.count(),
      prisma.post.count(),
      prisma.dataSource.findMany({ include: { syncLogs: { take: 1, orderBy: { startedAt: "desc" } } } }),
      prisma.adminAuditLog.findMany({
        take: 10,
        orderBy: { createdAt: "desc" },
        include: { admin: { select: { nickname: true, email: true } } },
      }),
    ]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-amber-600 uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4" />
            <span>CAR HUZY ADMIN CONTROL PLANE</span>
          </div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight mt-1">
            서비스 운영 및 데이터 관리자
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            차량 데이터 동기화, CSV 일괄 업로드 및 감사 로그를 관리합니다.
          </p>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <span className="text-xs text-slate-400 font-semibold">등록 모델</span>
          <div className="text-2xl font-black text-slate-900">{modelCount}개</div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <span className="text-xs text-slate-400 font-semibold">신차 트림</span>
          <div className="text-2xl font-black text-blue-600">{trimCount}개</div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <span className="text-xs text-slate-400 font-semibold">중고차 매물</span>
          <div className="text-2xl font-black text-amber-600">{usedCount}건</div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <span className="text-xs text-slate-400 font-semibold">가입 회원</span>
          <div className="text-2xl font-black text-emerald-600">{userCount}명</div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <span className="text-xs text-slate-400 font-semibold">커뮤니티 글</span>
          <div className="text-2xl font-black text-purple-600">{postCount}건</div>
        </div>
      </div>

      {/* Interactive Admin Manager (Sync & Batch Upload) */}
      <AdminManager dataSources={dataSources} auditLogs={auditLogs} />
    </div>
  );
}
