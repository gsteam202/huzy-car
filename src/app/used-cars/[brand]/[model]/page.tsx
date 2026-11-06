import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { prisma } from "@/lib/db";
import { formatKoreanMoney } from "@/lib/finance";
import { PriceTrendChart } from "@/components/used-cars/price-trend-chart";
import AdBanner from "@/components/ads/ad-banner";
import { CarImage } from "@/components/cars/car-image";
import {
  Car,
  ChevronRight,
  TrendingDown,
  Info,
  ShieldCheck,
  ArrowRight,
  Layers,
} from "lucide-react";

export const revalidate = 60;

interface Props {
  params: Promise<{
    brand: string;
    model: string;
  }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { brand: brandSlug, model: modelSlug } = await params;
  const model = await prisma.carModel.findFirst({
    where: { slug: modelSlug, brand: { slug: brandSlug } },
    include: { brand: true },
  });

  if (!model) {
    return { title: "중고차 시세 정보를 찾을 수 없습니다 | CAR HUZY" };
  }

  const title = `${model.brand.nameKo} ${model.nameKo} 중고차 실거래 시세·감가율 분석 | CAR HUZY`;
  const description = `${model.brand.nameKo} ${model.nameKo} 연식별 중고차 실거래 시세 및 감가율 통계. 신차 대비 잔가율, 사고 유무별 시세표, 무사고 인증 매물 가격 비교.`;
  const url = `https://car.huzy.net/used-cars/${brandSlug}/${modelSlug}`;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      images: model.imageUrl ? [{ url: model.imageUrl, alt: `${model.brand.nameKo} ${model.nameKo}` }] : [],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: model.imageUrl ? [model.imageUrl] : [],
    },
  };
}

export default async function UsedCarModelTrendsPage({ params }: Props) {
  const { brand: brandSlug, model: modelSlug } = await params;

  const model = await prisma.carModel.findFirst({
    where: {
      slug: modelSlug,
      brand: { slug: brandSlug },
    },
    include: {
      brand: true,
      marketStats: {
        orderBy: { year: "desc" },
      },
      usedCars: {
        where: { listingStatus: "ACTIVE" },
        orderBy: { listedAt: "desc" },
        take: 12,
      },
    },
  });

  if (!model) {
    notFound();
  }

  const chartData = model.marketStats.map((s) => ({
    year: `${s.year}년`,
    avgPrice: Math.round(s.avgPrice / 10000),
    minPrice: Math.round(s.minPrice / 10000),
    maxPrice: Math.round(s.maxPrice / 10000),
    depreciationRate: s.depreciationRate,
  }));

  const latestStat = model.marketStats[0];

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "홈", item: "https://car.huzy.net" },
          { "@type": "ListItem", position: 2, name: "중고차", item: "https://car.huzy.net/used-cars" },
          {
            "@type": "ListItem",
            position: 3,
            name: model.brand.nameKo,
            item: `https://car.huzy.net/used-cars?brand=${model.brand.slug}`,
          },
          {
            "@type": "ListItem",
            position: 4,
            name: `${model.nameKo} 시세`,
            item: `https://car.huzy.net/used-cars/${model.brand.slug}/${model.slug}`,
          },
        ],
      },
      {
        "@type": "Product",
        name: `${model.brand.nameKo} ${model.nameKo} 중고차`,
        image: model.imageUrl || undefined,
        brand: { "@type": "Brand", name: model.brand.nameKo },
        model: model.nameKo,
        description: `${model.nameKo} 연식별 중고차 실거래 시세 및 감가율 통계`,
      },
    ],
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {/* Top Banner */}
      <AdBanner slot="page-top-slot" compact />

      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-slate-500">
        <Link href="/" className="hover:text-blue-600">
          홈
        </Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link href="/used-cars" className="hover:text-blue-600">
          중고차
        </Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link href={`/used-cars?brand=${model.brand.slug}`} className="hover:text-blue-600">
          {model.brand.nameKo}
        </Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="font-bold text-slate-800">{model.nameKo} 시세 분석</span>
      </nav>

      {/* Header Info */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <div className="w-20 h-20 bg-slate-100 rounded-2xl overflow-hidden shrink-0">
            <CarImage src={model.imageUrl} alt={model.nameKo} modelSlug={model.slug} />
          </div>
          <div>
            <div className="text-xs font-bold text-amber-600">{model.brand.nameKo}</div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              {model.nameKo} 중고차 시세 & 감가율 분석
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              신차 기본 출고가 {formatKoreanMoney(model.minPrice)} 기준 연식별 시세
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href={`/new-cars/${model.brand.slug}/${model.slug}`}
            className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition-colors"
          >
            신차 가격표 보기
          </Link>
          <Link
            href={`/calculator/budget?brand=${model.brand.slug}&carType=USED`}
            className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs shadow-sm transition-colors"
          >
            내 예산으로 조회
          </Link>
        </div>
      </div>

      {/* Price Trend Chart & Stats Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Chart (8 cols) */}
        <div className="lg:col-span-8 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-black text-slate-900 tracking-tight flex items-center gap-2">
                <TrendingDown className="w-5 h-5 text-blue-600" />
                <span>연식별 중고차 시세 변동 추이</span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                등록 매물 호가 및 실거래 데이터를 종합한 연식별 시세 곡선입니다.
              </p>
            </div>
            <span className="text-[11px] font-semibold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full">
              신뢰도: 높음
            </span>
          </div>

          <PriceTrendChart data={chartData} />

          <div className="p-3 bg-slate-50 rounded-xl text-[11px] text-slate-500 flex items-center gap-1.5 border border-slate-100">
            <Info className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span>매물 기반 추정 시세로서 실제 차량 사고 유무 및 옵션 상태에 따라 가격 차이가 발생할 수 있습니다.</span>
          </div>
        </div>

        {/* Right Depreciation Breakdown (4 cols) */}
        <div className="lg:col-span-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <h3 className="text-base font-extrabold text-slate-900">연식별 감가율 요약</h3>

          <div className="space-y-3">
            {model.marketStats.map((s) => (
              <div
                key={s.id}
                className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between"
              >
                <div>
                  <div className="font-bold text-xs text-slate-800">{s.year}년식</div>
                  <div className="text-xs text-slate-400">표본 {s.sampleCount}대 분석</div>
                </div>
                <div className="text-right">
                  <div className="font-black text-slate-900 text-sm">
                    {formatKoreanMoney(s.avgPrice)}
                  </div>
                  <div className="text-[11px] font-bold text-amber-600">
                    출고가 대비 -{s.depreciationRate}%
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Mid Content Ad Banner */}
      <AdBanner slot="content-mid-slot" />

      {/* Active Listings for this model */}
      <div className="space-y-4">
        <h2 className="text-xl font-black text-slate-900 tracking-tight">
          {model.nameKo} 현재 판매 중인 추천 실매물
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {model.usedCars.map((u) => (
            <div
              key={u.id}
              className="bg-white rounded-2xl border border-slate-200 overflow-hidden hover:border-amber-400 hover:shadow-lg transition-all p-4 space-y-3 flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-amber-100 text-amber-800">
                    {u.accidentHistory === "NONE" ? "무사고" : "단순수리"}
                  </span>
                  <span className="text-[11px] text-slate-400">{u.region}</span>
                </div>
                <h3 className="font-extrabold text-sm text-slate-900 line-clamp-2">
                  {u.title}
                </h3>
                <div className="text-xs text-slate-500">
                  {u.year}년식 • {u.mileageKm.toLocaleString()}km
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400">판매가격</span>
                  <div className="font-black text-slate-900 text-base">
                    {formatKoreanMoney(u.price)}
                  </div>
                </div>
                <Link
                  href={`/calculator/installment?price=${u.price}`}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-blue-50 hover:text-blue-600 text-slate-700 text-xs font-bold rounded-lg transition-colors"
                >
                  견적계산
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Ad Banner */}
      <AdBanner slot="content-bottom-slot" />
    </div>
  );
}
