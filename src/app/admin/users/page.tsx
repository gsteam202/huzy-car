import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { AdminTabs } from "@/components/admin/admin-tabs";
import { UserManager } from "@/components/admin/user-manager";
import { ShieldCheck, Users } from "lucide-react";

export const revalidate = 0;

export default async function AdminUsersPage() {
  const user = await getCurrentUser();
  if (!user || user.role !== "ADMIN") {
    redirect("/auth/login?callbackUrl=/admin/users");
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
            <Users className="w-8 h-8 text-blue-600" />
            <span>회원 관리</span>
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            등록된 회원의 권한(일반회원, 운영자, 관리자) 변경, 활동 현황 조회 및 계정을 관리합니다.
          </p>
        </div>
      </div>

      {/* Admin Navigation Tabs */}
      <AdminTabs userCount={userCount} carCount={carCount} />

      {/* User Manager Component */}
      <UserManager />
    </div>
  );
}
