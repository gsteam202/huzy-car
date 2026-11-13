"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { useState, useRef, useEffect } from "react";
import {
  Car,
  Search,
  Calculator,
  Compass,
  Layers,
  MessageSquare,
  User as UserIcon,
  Menu,
  X,
  ShieldCheck,
  LogOut,
  ChevronDown,
  ChevronRight,
  Sparkles,
} from "lucide-react";

export function Navbar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [toolsDropdownOpen, setToolsDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setToolsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close dropdown on route change
  useEffect(() => {
    setToolsDropdownOpen(false);
    setMobileMenuOpen(false);
  }, [pathname]);

  const mainNavLinks = [
    { href: "/new-cars", label: "신차 검색", shortLabel: "신차", icon: Car },
    { href: "/used-cars", label: "중고차 시세", shortLabel: "중고차", icon: Compass },
    { href: "/lookup", label: "차량번호 조회", shortLabel: "차량번호 조회", icon: Search, badge: "공단인증" },
    { href: "/calculator/budget", label: "예산 맞춤추천", shortLabel: "예산추천", icon: Calculator, highlight: true },
  ];

  const secondaryNavLinks = [
    { href: "/calculator", label: "통합 금융 계산기", shortLabel: "통합계산기", icon: Calculator, desc: "취등록세·자동차세·할부 원스톱 계산" },
    { href: "/calculator/tax", label: "취등록세·자동차세", shortLabel: "세금계산기", icon: Calculator, desc: "취등록세 감면 및 연간 자동차세 계산" },
    { href: "/calculator/installment", label: "할부 계산기", shortLabel: "할부계산기", icon: Calculator, desc: "금리·선납금별 월 납입금 계산" },
    { href: "/compare", label: "차량 비교", shortLabel: "차량비교", icon: Layers, desc: "최대 3대 제원 및 가격 동시 비교" },
  ];

  const communityLink = { href: "/community", label: "커뮤니티", shortLabel: "커뮤니티", icon: MessageSquare };

  const allNavLinks = [...mainNavLinks, ...secondaryNavLinks, communityLink];

  const isSecondaryActive = secondaryNavLinks.some(
    (l) => pathname === l.href || pathname.startsWith(`${l.href}/`)
  );

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/new-cars?q=${encodeURIComponent(searchQuery.trim())}`;
    }
  };

  const isAdmin = (session?.user as any)?.role === "ADMIN";

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 flex-nowrap gap-2 sm:gap-4">
          {/* Logo & Desktop Nav */}
          <div className="flex items-center gap-3 lg:gap-4 xl:gap-6 shrink-0 min-w-0">
            <Link href="/" className="flex items-center gap-2.5 group shrink-0">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-700 via-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-500/25 group-hover:scale-105 group-active:scale-95 transition-all duration-200 shrink-0">
                <Car className="w-5 h-5" />
              </div>
              <div className="flex flex-col shrink-0">
                <div className="flex items-center gap-1.5">
                  <span className="font-black text-lg tracking-tight text-slate-900 group-hover:text-blue-600 transition-colors whitespace-nowrap">
                    CAR HUZY
                  </span>
                  <span className="hidden sm:inline-block px-1.5 py-0.2 text-[9px] font-black rounded-md bg-blue-100 text-blue-800 tracking-wider whitespace-nowrap">
                    PRO
                  </span>
                </div>
                <span className="text-[10px] font-medium text-slate-400 -mt-1 tracking-tight whitespace-nowrap">
                  자동차 종합 플랫폼
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links (Strictly non-wrapping) */}
            <nav className="hidden lg:flex items-center gap-0.5 xl:gap-1 flex-nowrap shrink-0">
              {/* Primary 4 Links */}
              {mainNavLinks.map((link) => {
                const isActive = pathname === link.href || pathname.startsWith(`${link.href}/`);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`px-2 xl:px-2.5 2xl:px-3 py-1.5 rounded-lg text-xs xl:text-[13px] font-semibold transition-all duration-150 flex items-center gap-1.5 shrink-0 whitespace-nowrap ${
                      isActive
                        ? "bg-blue-50 text-blue-700 font-bold shadow-xs"
                        : link.highlight
                        ? "text-blue-600 hover:bg-blue-50/70 font-bold"
                        : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/70"
                    }`}
                  >
                    <span className="whitespace-nowrap hidden 2xl:inline">{link.label}</span>
                    <span className="whitespace-nowrap 2xl:hidden">{link.shortLabel}</span>
                    {link.badge && (
                      <span className="px-1.5 py-0.5 text-[9px] bg-emerald-50 text-emerald-700 border border-emerald-200/80 rounded-full font-bold tracking-tight shrink-0 whitespace-nowrap">
                        {link.badge}
                      </span>
                    )}
                    {link.highlight && (
                      <span className="px-1.5 py-0.5 text-[9px] bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-full font-bold shadow-xs flex items-center gap-0.5 shrink-0 whitespace-nowrap">
                        <Sparkles className="w-2.5 h-2.5 shrink-0" />
                        <span>추천</span>
                      </span>
                    )}
                  </Link>
                );
              })}

              {/* Secondary links on Wide Screens (>= 1280px xl:) */}
              {secondaryNavLinks.map((link) => {
                const isActive = pathname === link.href || pathname.startsWith(`${link.href}/`);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`hidden xl:flex px-2 xl:px-2.5 2xl:px-3 py-1.5 rounded-lg text-xs xl:text-[13px] font-semibold transition-all duration-150 items-center gap-1.5 shrink-0 whitespace-nowrap ${
                      isActive
                        ? "bg-blue-50 text-blue-700 font-bold shadow-xs"
                        : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/70"
                    }`}
                  >
                    <span className="whitespace-nowrap">{link.label}</span>
                  </Link>
                );
              })}

              {/* Dropdown on Medium-Desktop (1024px ~ 1279px lg: to prevent any header wrapping) */}
              <div className="relative xl:hidden shrink-0" ref={dropdownRef}>
                <button
                  type="button"
                  onClick={() => setToolsDropdownOpen(!toolsDropdownOpen)}
                  className={`px-2 py-1.5 rounded-lg text-xs font-semibold transition-all duration-150 flex items-center gap-1 shrink-0 whitespace-nowrap ${
                    isSecondaryActive
                      ? "bg-blue-50 text-blue-700 font-bold shadow-xs"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/70"
                  }`}
                >
                  <span className="whitespace-nowrap">금융·비교</span>
                  <ChevronDown
                    className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 shrink-0 ${
                      toolsDropdownOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {toolsDropdownOpen && (
                  <div className="absolute left-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-200/90 p-1.5 z-50 animate-in fade-in zoom-in-95 duration-150">
                    {secondaryNavLinks.map((item) => {
                      const active = pathname === item.href;
                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={() => setToolsDropdownOpen(false)}
                          className={`flex items-center gap-2.5 p-2 rounded-xl transition-colors ${
                            active ? "bg-blue-50 text-blue-700 font-bold" : "hover:bg-slate-50 text-slate-700"
                          }`}
                        >
                          <div className="w-7 h-7 rounded-lg bg-blue-100/70 text-blue-600 flex items-center justify-center shrink-0">
                            <item.icon className="w-3.5 h-3.5" />
                          </div>
                          <div className="flex flex-col">
                            <span className="text-xs font-bold whitespace-nowrap">{item.label}</span>
                            <span className="text-[10px] text-slate-400 whitespace-nowrap">{item.desc}</span>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Community Link */}
              <Link
                href={communityLink.href}
                className={`px-2 xl:px-2.5 2xl:px-3 py-1.5 rounded-lg text-xs xl:text-[13px] font-semibold transition-all duration-150 flex items-center gap-1.5 shrink-0 whitespace-nowrap ${
                  pathname === communityLink.href
                    ? "bg-blue-50 text-blue-700 font-bold shadow-xs"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/70"
                }`}
              >
                <span className="whitespace-nowrap">{communityLink.label}</span>
              </Link>
            </nav>
          </div>

          {/* Quick Search & User Actions (Right side, non-wrapping) */}
          <div className="hidden md:flex items-center gap-2 xl:gap-3 shrink-0 flex-nowrap">
            <form onSubmit={handleSearchSubmit} className="relative shrink-0">
              <input
                type="text"
                placeholder="차량명, 브랜드 검색"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-32 lg:w-40 xl:w-48 2xl:w-56 focus:w-52 xl:focus:w-60 pl-8 pr-3 py-1.5 bg-slate-100/80 hover:bg-slate-100 focus:bg-white text-xs font-medium rounded-full border border-slate-200/80 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/15 focus:outline-none transition-all duration-200 placeholder:text-slate-400 placeholder:text-xs"
              />
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5 pointer-events-none shrink-0" />
            </form>

            {session?.user ? (
              <div className="flex items-center gap-1.5 xl:gap-2 shrink-0 flex-nowrap">
                {isAdmin && (
                  <Link
                    href="/admin"
                    className="px-2 xl:px-2.5 py-1.5 rounded-lg text-xs font-bold text-amber-900 bg-amber-50 hover:bg-amber-100 border border-amber-200/80 flex items-center gap-1 shrink-0 whitespace-nowrap transition-colors shadow-xs"
                    title="관리자 대시보드"
                  >
                    <ShieldCheck className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                    <span className="whitespace-nowrap">관리자</span>
                  </Link>
                )}
                <Link
                  href="/mypage"
                  className="flex items-center gap-1.5 px-2.5 xl:px-3 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200/70 border border-slate-200/60 text-xs font-semibold text-slate-800 shrink-0 whitespace-nowrap transition-colors"
                >
                  {session.user.image ? (
                    <img
                      src={session.user.image}
                      alt={session.user.name || "프로필"}
                      className="w-5 h-5 rounded-full object-cover ring-1 ring-slate-300 shrink-0"
                    />
                  ) : (
                    <UserIcon className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                  )}
                  <span className="max-w-[70px] xl:max-w-[100px] truncate whitespace-nowrap">
                    {session.user.name || "마이페이지"}
                  </span>
                </Link>
                <button
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg shrink-0 transition-colors"
                  title="로그아웃"
                  aria-label="로그아웃"
                >
                  <LogOut className="w-4 h-4 shrink-0" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-1.5 shrink-0 flex-nowrap">
                <Link
                  href="/auth/login"
                  className="px-2.5 xl:px-3 py-1.5 text-xs font-bold text-slate-700 hover:text-blue-600 hover:bg-slate-50 rounded-lg shrink-0 whitespace-nowrap transition-colors"
                >
                  로그인
                </Link>
                <Link
                  href="/auth/register"
                  className="px-3 xl:px-3.5 py-1.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm shadow-blue-500/20 active:scale-[0.98] shrink-0 whitespace-nowrap transition-all"
                >
                  회원가입
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2 shrink-0">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-slate-600 hover:bg-slate-100 active:scale-95 transition-all focus:outline-none"
              aria-label="메뉴 열기"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white/98 backdrop-blur-lg px-4 pt-3 pb-6 space-y-4 shadow-lg animate-in fade-in slide-in-from-top-2 duration-200">
          <form onSubmit={handleSearchSubmit} className="relative">
            <input
              type="text"
              placeholder="차량명, 브랜드 검색 (예: 쏘렌토)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 bg-slate-100 text-sm rounded-xl border border-slate-200 focus:outline-none focus:border-blue-500 focus:bg-white transition-all placeholder:text-slate-400"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
          </form>

          {/* User Status Header for Mobile */}
          {session?.user ? (
            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                {session.user.image ? (
                  <img
                    src={session.user.image}
                    alt={session.user.name || "프로필"}
                    className="w-9 h-9 rounded-full object-cover ring-2 ring-blue-500/20"
                  />
                ) : (
                  <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center text-blue-700">
                    <UserIcon className="w-4 h-4" />
                  </div>
                )}
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-xs text-slate-900">{session.user.name}</span>
                    {isAdmin && (
                      <span className="px-1.5 py-0.2 text-[9px] font-black rounded bg-amber-100 text-amber-800">
                        관리자
                      </span>
                    )}
                  </div>
                  <span className="text-[11px] text-slate-400 block truncate max-w-[180px]">
                    {session.user.email}
                  </span>
                </div>
              </div>
              <Link
                href="/mypage"
                onClick={() => setMobileMenuOpen(false)}
                className="text-xs font-bold text-blue-600 hover:text-blue-700 px-2.5 py-1 bg-white rounded-lg border border-slate-200"
              >
                마이페이지
              </Link>
            </div>
          ) : null}

          {/* Navigation Items */}
          <nav className="flex flex-col gap-1">
            {allNavLinks.map((link) => {
              const isActive = pathname === link.href || pathname.startsWith(`${link.href}/`);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`px-3 py-2.5 rounded-xl text-sm font-semibold flex items-center justify-between transition-colors ${
                    isActive
                      ? "bg-blue-50 text-blue-700 font-bold"
                      : (link as any).highlight
                      ? "text-blue-600 font-bold bg-blue-50/40"
                      : "text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  <span className="flex items-center gap-2.5">
                    <link.icon className={`w-4 h-4 ${isActive ? "text-blue-600" : "text-slate-400"}`} />
                    <span>{link.label}</span>
                  </span>
                  <div className="flex items-center gap-1.5">
                    {(link as any).badge && (
                      <span className="px-2 py-0.5 text-[10px] bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full font-bold">
                        {(link as any).badge}
                      </span>
                    )}
                    {(link as any).highlight && (
                      <span className="px-2 py-0.5 text-[10px] bg-blue-600 text-white rounded-full font-bold shadow-xs">
                        추천
                      </span>
                    )}
                    <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
                  </div>
                </Link>
              );
            })}
          </nav>

          {/* Mobile Footer Actions */}
          <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
            {session?.user ? (
              <>
                {isAdmin && (
                  <Link
                    href="/admin"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full py-2.5 px-4 bg-amber-50 text-amber-900 border border-amber-200 rounded-xl text-center font-bold text-xs flex items-center justify-center gap-1.5"
                  >
                    <ShieldCheck className="w-4 h-4 text-amber-600" />
                    <span>관리자 대시보드 바로가기</span>
                  </Link>
                )}
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    signOut({ callbackUrl: "/" });
                  }}
                  className="w-full py-2 text-center text-xs text-red-600 font-medium hover:bg-red-50 rounded-xl transition-colors"
                >
                  로그아웃
                </button>
              </>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <Link
                  href="/auth/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="py-2.5 px-4 text-center font-bold text-xs border border-slate-300 rounded-xl text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  로그인
                </Link>
                <Link
                  href="/auth/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="py-2.5 px-4 text-center font-bold text-xs bg-blue-600 text-white rounded-xl shadow-sm hover:bg-blue-700 transition-colors"
                >
                  회원가입
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
