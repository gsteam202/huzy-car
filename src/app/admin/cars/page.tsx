import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { AdminTabs } from "@/components/admin/admin-tabs";
import { CarManager } from "@/components/admin/car-manager";
import { ShieldCheck, Car } from "lucide-react";

export const revalidate = 0;

export default async function AdminCarsPage() {
  const user = await getCurrentUser();
  if (!user || user.role !== "ADMIN") {
    redirect("/auth/login?callbackUrl=/admin/cars");
  }

  const [userCount, carCount] = await Promise.all([
    prisma.user.count(),
    prisma.carModel.count(),
  ]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-200 pb-6 gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-amber-600 uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4" />
            <span>CAR HUZY ADMIN CONTROL PLANE</span>
          </div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight mt-1 flex items-center gap-2.5">
            <Car className="w-8 h-8 text-blue-600" />
            <span>자동차 정보 관리</span>
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            제조사 브랜드별 차량 모델 등록, 트림 및 신차 가격 수정, 제원 데이터베이스를 관리합니다.
          </p>
        </div>
      </div>

      {/* Admin Navigation Tabs */}
      <AdminTabs userCount={userCount} carCount={carCount} />

      {/* Car Manager Component */}
      <CarManager />
    </div>
  );
}
