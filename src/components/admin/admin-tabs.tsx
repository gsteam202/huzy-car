"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Database, Users, Car, ShieldCheck } from "lucide-react";

export function AdminTabs({
  userCount,
  carCount,
}: {
  userCount?: number;
  carCount?: number;
}) {
  const pathname = usePathname();

  const tabs = [
    {
      href: "/admin",
      label: "시스템 및 데이터 동기화",
      icon: Database,
      exact: true,
    },
    {
      href: "/admin/users",
      label: "회원 관리",
      icon: Users,
      badge: userCount !== undefined ? `${userCount}명` : undefined,
    },
    {
      href: "/admin/cars",
      label: "자동차 정보 관리",
      icon: Car,
      badge: carCount !== undefined ? `${carCount}대` : undefined,
    },
  ];

  return (
    <div className="flex items-center gap-2 border-b border-slate-200 overflow-x-auto pb-px">
      {tabs.map((tab) => {
        const isActive = tab.exact
          ? pathname === tab.href
          : pathname === tab.href || pathname.startsWith(`${tab.href}/`);

        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={`flex items-center gap-2 px-4 py-3 border-b-2 text-sm font-bold transition-all whitespace-nowrap shrink-0 ${
              isActive
                ? "border-blue-600 text-blue-700 bg-blue-50/50 rounded-t-xl"
                : "border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300"
            }`}
          >
            <tab.icon className={`w-4 h-4 ${isActive ? "text-blue-600" : "text-slate-400"}`} />
            <span>{tab.label}</span>
            {tab.badge && (
              <span
                className={`px-1.5 py-0.2 text-[11px] font-bold rounded-full ${
                  isActive
                    ? "bg-blue-600 text-white"
                    : "bg-slate-100 text-slate-600 group-hover:bg-slate-200"
                }`}
              >
                {tab.badge}
              </span>
            )}
          </Link>
        );
      })}
    </div>
  );
}
