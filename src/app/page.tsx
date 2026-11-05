import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/db";
import { HeroBudgetFinder } from "@/components/home/hero-budget-finder";
import { formatKoreanMoney } from "@/lib/finance";
import {
  Car,
  ChevronRight,
  TrendingDown,
  Sparkles,
  Zap,
  Leaf,
  Users,
  Compass,
  FileText,
  CheckCircle2,
} from "lucide-react";

export const revalidate = 60; // ISR cache 60s for high performance & fresh data

export default async function HomePage() {
  // Fetch popular new car models
  const popularModels = await prisma.carModel.findMany({
    take: 6,
    orderBy: { viewCount: "desc" },
    include: {
      brand: true,
      generations: {
        where: { isCurrent: true },
        take: 1,
        include: {
          modelYears: {
            take: 1,
            include: {
              trims: {
                take: 1,
                orderBy: { price: "asc" },
              },
            },
          },
        },
      },
    },
  });

  // Fetch verified used car listings
  const usedListings = await prisma.usedCarListing.findMany({
    where: { listingStatus: "ACTIVE" },
    take: 4,
    orderBy: { listedAt: "desc" },
    include: {
      brand: true,
      model: true,
    },
  });

  // Fetch recent community posts
  const recentPosts = await prisma.post.findMany({
    take: 4,
    orderBy: { createdAt: "desc" },
    include: {
      board: true,
      author: { select: { nickname: true } },
    },
  });

  // Vehicle categories
  const categories = [
    { type: "SEDAN", name: "세단", desc: "안락한 승차감과 고연비", icon: Car },
    { type: "SUV", name: "SUV", desc: "넓은 시야와 패밀리 공간", icon: Compass },
    { type: "RV", name: "RV / 미니밴", desc: "다인승 패밀리 여행 최적화", icon: Users },
    { type: "COMPACT", name: "경차", desc: "취등록세 감면 및 도심 주차", icon: Sparkles },
  ];

  const fuelBadges = [
    { key: "HYBRID", label: "하이브리드", icon: Leaf, color: "text-emerald-700 bg-emerald-50 border-emerald-200" },
    { key: "ELECTRIC", label: "전기차 (EV)", icon: Zap, color: "text-blue-700 bg-blue-50 border-blue-200" },
  ];

  return (
    <div className="space-y-16 pb-16">
      {/* 1. Hero: 내 예산으로 어떤 차를 살 수 있을까? */}
      <HeroBudgetFinder />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20">
        {/* 2. Popular New Cars (인기 신차) */}
        <section className="space-y-6">
          <div className="flex items-end justify-between">
            <div>
              <div className="text-xs font-bold text-blue-600 uppercase tracking-wider">
                NEW CAR RANKING
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                지금 가장 주목받는 인기 신차
              </h2>
            </div>
            <Link
              href="/new-cars"
              className="text-sm font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1 group"
            >
              <span>전체 신차 보기</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {popularModels.map((m) => {
              const baseTrim = m.generations[0]?.modelYears[0]?.trims[0];
              const estMonthly = baseTrim
                ? Math.round(((baseTrim.price * 0.8) / 48) * 1.055)
                : 0;

              return (
                <Link
                  key={m.id}
                  href={`/new-cars/${m.brand.slug}/${m.slug}`}
                  className="group bg-white rounded-2xl overflow-hidden border border-slate-200/80 hover:border-blue-400 hover:shadow-xl transition-all duration-200 flex flex-col"
                >
                  <div className="relative h-48 bg-slate-100 overflow-hidden">
                    {m.imageUrl ? (
                      <img
                        src={m.imageUrl}
                        alt={m.nameKo}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-300">
                        <Car className="w-16 h-16" />
                      </div>
                    )}
                    <span className="absolute top-3 left-3 px-2.5 py-1 text-xs font-bold rounded-lg bg-blue-600 text-white shadow-sm">
                      신차
                    </span>
                    <span className="absolute top-3 right-3 px-2.5 py-1 text-xs font-semibold rounded-lg bg-slate-900/80 text-white backdrop-blur-sm">
                      {m.brand.nameKo}
                    </span>
                  </div>

                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="font-bold text-lg text-slate-900 group-hover:text-blue-600 transition-colors">
                        {m.nameKo}
                      </h3>
                      <p className="text-xs text-slate-400 mt-0.5">{m.nameEn}</p>
                    </div>

                    <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between">
                      <div>
                        <div className="text-[11px] text-slate-400 font-medium">판매 가격</div>
                        <div className="text-base font-extrabold text-slate-900">
                          {formatKoreanMoney(m.minPrice)} ~
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-[11px] text-blue-600 font-medium">예상 월 납입금</div>
                        <div className="text-sm font-black text-blue-700">
                          월 {formatKoreanMoney(estMonthly)}~
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        {/* 3. Popular Used Cars (인기 중고차) */}
        <section className="space-y-6">
          <div className="flex items-end justify-between">
            <div>
              <div className="text-xs font-bold text-amber-600 uppercase tracking-wider">
                CERTIFIED MARKET
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                실매물 검증 완료 추천 중고차
              </h2>
            </div>
            <Link
              href="/used-cars"
              className="text-sm font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1 group"
            >
              <span>전체 중고차 시세</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {usedListings.map((u) => (
              <Link
                key={u.id}
                href={`/used-cars/${u.brand.slug}/${u.model.slug}`}
                className="group bg-white rounded-2xl overflow-hidden border border-slate-200/80 hover:border-amber-400 hover:shadow-xl transition-all duration-200 flex flex-col"
              >
                <div className="relative h-40 bg-slate-100 overflow-hidden">
                  {u.imageUrl ? (
                    <img
                      src={u.imageUrl}
                      alt={u.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-300">
                      <Car className="w-12 h-12" />
                    </div>
                  )}
                  <span className="absolute top-2.5 left-2.5 px-2 py-0.5 text-xs font-bold rounded-md bg-amber-500 text-white shadow-sm">
                    인증중고
                  </span>
                  <span className="absolute bottom-2.5 right-2.5 px-2 py-0.5 text-[11px] font-medium rounded bg-black/60 text-white">
                    {u.region}
                  </span>
                </div>

                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-bold text-sm text-slate-900 group-hover:text-amber-600 transition-colors line-clamp-2">
                      {u.title}
                    </h3>
                    <div className="flex items-center gap-2 text-xs text-slate-500 mt-2">
                      <span>{u.year}년식</span>
                      <span>•</span>
                      <span>{u.mileageKm.toLocaleString()}km</span>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-xs text-slate-400">판매가</span>
                    <span className="text-base font-extrabold text-slate-900">
                      {formatKoreanMoney(u.price)}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* 4. Vehicle Type Explorer */}
        <section className="space-y-6">
          <div className="text-center max-w-xl mx-auto space-y-2">
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              원하는 차종별로 한눈에 둘러보기
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              라이프스타일에 맞춘 다양한 세그먼트별 인기 모델 가격표
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {categories.map((cat) => (
              <Link
                key={cat.type}
                href={`/new-cars?type=${cat.type}`}
                className="bg-white p-6 rounded-2xl border border-slate-200 hover:border-blue-500 hover:shadow-lg transition-all text-center group flex flex-col items-center gap-3"
              >
                <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors">
                  <cat.icon className="w-7 h-7" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base text-slate-900 group-hover:text-blue-600">
                    {cat.name}
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">{cat.desc}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* 5. New vs Used Comparative Buying Guide */}
        <section className="bg-gradient-to-r from-slate-900 to-blue-950 text-white rounded-3xl p-8 sm:p-12 relative overflow-hidden">
          <div className="max-w-2xl space-y-4 relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-semibold">
              <CheckCircle2 className="w-3.5 h-3.5 text-blue-400" />
              <span>스마트한 자동차 구매 의사결정 가이드</span>
            </div>

            <h2 className="text-2xl sm:text-4xl font-black tracking-tight leading-snug">
              신차를 살까, 2~3년 된 중고차를 살까?
            </h2>

            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              신차의 무상 보증 및 잔가 가치와 중고차의 감가상각 혜택을 과학적으로 비교해보세요.
              카휴지는 실제 감가율 데이터와 월별 유지비를 종합해 총소유비용(TCO)을 분석해 드립니다.
            </p>

            <div className="pt-4 flex flex-wrap gap-3">
              <Link
                href="/compare"
                className="px-6 py-3 bg-blue-600 hover:bg-blue-500 font-bold rounded-xl text-sm transition-colors shadow-lg shadow-blue-600/30"
              >
                차량 1:1 비교하러 가기
              </Link>
              <Link
                href="/calculator/installment"
                className="px-6 py-3 bg-white/10 hover:bg-white/20 font-bold rounded-xl text-sm transition-colors border border-white/20"
              >
                할부 견적 시뮬레이터
              </Link>
            </div>
          </div>
        </section>

        {/* 6. Recent Community Posts */}
        <section className="space-y-6">
          <div className="flex items-end justify-between">
            <div>
              <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                COMMUNITY
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                차주 및 예비 구매자 커뮤니티
              </h2>
            </div>
            <Link
              href="/community"
              className="text-sm font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1 group"
            >
              <span>전체 게시판</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {recentPosts.map((p) => (
              <Link
                key={p.id}
                href={`/community/${p.id}`}
                className="bg-white p-5 rounded-2xl border border-slate-200 hover:border-blue-400 hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 text-[11px] font-bold rounded bg-slate-100 text-slate-600">
                      {p.board.name}
                    </span>
                    <span className="text-xs text-slate-400">
                      {p.author.nickname}
                    </span>
                  </div>
                  <h3 className="font-bold text-slate-900 hover:text-blue-600 line-clamp-1">
                    {p.title}
                  </h3>
                  <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                    {p.content}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
                  <span>조회 {p.viewCount} • 좋아요 {p.likeCount}</span>
                  <span>댓글 {p.commentCount}</span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
