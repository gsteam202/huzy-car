import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { prisma } from "@/lib/db";
import { formatKoreanMoney, calculateAcquisitionTax, calculateInstallment } from "@/lib/finance";
import AdBanner from "@/components/ads/ad-banner";
import { CarImage } from "@/components/cars/car-image";
import { getOfficialAttribution } from "@/lib/official-car-images";
import {
  Car,
  Fuel,
  Zap,
  Gauge,
  ShieldCheck,
  Calendar,
  Layers,
  ArrowRight,
  Bookmark,
  ChevronRight,
  TrendingDown,
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
    return {
      title: "차량을 찾을 수 없습니다 | CAR HUZY",
    };
  }

  const title = `${model.brand.nameKo} ${model.nameKo} 신차 가격표·제원·할부 견적 | CAR HUZY`;
  const description = `${model.brand.nameKo} ${model.nameKo} 신차 출고가 ${formatKoreanMoney(model.minPrice)} ~ ${formatKoreanMoney(model.maxPrice)}. 연비, 트림별 가격표, 세금 및 월 납입금 실시간 시뮬레이션.`;
  const url = `https://car.huzy.net/new-cars/${brandSlug}/${modelSlug}`;

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

export default async function CarDetailPage({ params }: Props) {
  const { brand: brandSlug, model: modelSlug } = await params;

  const model = await prisma.carModel.findFirst({
    where: {
      slug: modelSlug,
      brand: { slug: brandSlug },
    },
    include: {
      brand: true,
      generations: {
        where: { isCurrent: true },
        include: {
          modelYears: {
            orderBy: { year: "desc" },
            take: 1,
            include: {
              trims: {
                include: {
                  specs: true,
                  newCarPrices: true,
                  trimOptions: { include: { option: true } },
                },
              },
            },
          },
        },
      },
      usedCars: {
        where: { listingStatus: "ACTIVE" },
        take: 4,
        orderBy: { year: "desc" },
      },
      marketStats: {
        orderBy: { year: "desc" },
        take: 4,
      },
    },
  });

  if (!model) {
    notFound();
  }

  const currentYear = model.generations[0]?.modelYears[0];
  const trims = currentYear?.trims || [];
  const baseTrim = trims[0];

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "홈", item: "https://car.huzy.net" },
          { "@type": "ListItem", position: 2, name: "신차", item: "https://car.huzy.net/new-cars" },
          {
            "@type": "ListItem",
            position: 3,
            name: model.brand.nameKo,
            item: `https://car.huzy.net/new-cars?brand=${model.brand.slug}`,
          },
          {
            "@type": "ListItem",
            position: 4,
            name: model.nameKo,
            item: `https://car.huzy.net/new-cars/${model.brand.slug}/${model.slug}`,
          },
        ],
      },
      {
        "@type": "Car",
        name: `${model.brand.nameKo} ${model.nameKo}`,
        image: model.imageUrl || undefined,
        brand: { "@type": "Brand", name: model.brand.nameKo },
        model: model.nameKo,
        offers: {
          "@type": "AggregateOffer",
          priceCurrency: "KRW",
          lowPrice: model.minPrice,
          highPrice: model.maxPrice,
          offerCount: trims.length,
          availability: "https://schema.org/InStock",
        },
      },
    ],
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
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
        <Link href="/new-cars" className="hover:text-blue-600">
          신차
        </Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link href={`/new-cars?brand=${model.brand.slug}`} className="hover:text-blue-600">
          {model.brand.nameKo}
        </Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="font-bold text-slate-800">{model.nameKo}</span>
      </nav>

      {/* Main Showcase Header */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-white p-6 sm:p-10 rounded-3xl border border-slate-200 shadow-sm">
        {/* Left Image (7 cols) */}
        <div className="lg:col-span-7 relative h-72 sm:h-96 bg-slate-100 rounded-2xl overflow-hidden">
          <CarImage
            src={model.imageUrl}
            alt={model.nameKo}
            modelSlug={model.slug}
            showOfficialBadge
            priority
          />
          <span className="absolute top-4 left-4 px-3 py-1 bg-blue-600 text-white text-xs font-bold rounded-lg shadow-sm z-10">
            {model.brand.nameKo}
          </span>
          <span className="absolute top-4 right-4 px-3 py-1 bg-slate-900/80 text-white text-xs font-semibold rounded-lg backdrop-blur-sm z-10">
            {currentYear?.year}년형
          </span>
          <span className="absolute bottom-3 right-3 text-[11px] text-slate-500 bg-white/80 px-2 py-0.5 rounded backdrop-blur-xs z-10">
            출처: {getOfficialAttribution(model.slug)}
          </span>
        </div>

        {/* Right Info (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div>
            <div className="text-xs font-bold text-blue-600 uppercase tracking-wider">
              {model.vehicleType}
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight mt-1">
              {model.nameKo}
            </h1>
            <p className="text-sm text-slate-400 mt-1">{model.nameEn}</p>
          </div>

          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
            <span className="text-xs text-slate-500 font-medium">신차 기본 출고 가격</span>
            <div className="text-2xl sm:text-3xl font-black text-slate-900">
              {formatKoreanMoney(model.minPrice)} ~ {formatKoreanMoney(model.maxPrice)}
            </div>
          </div>

          {baseTrim && (
            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              <div className="p-3 bg-slate-50 rounded-xl">
                <span className="text-slate-400 block">복합연비</span>
                <span className="font-extrabold text-slate-800 text-sm mt-0.5 block">
                  {baseTrim.fuelEfficiencyCombined
                    ? `${baseTrim.fuelEfficiencyCombined}km/L`
                    : baseTrim.electricEfficiencyCombined
                    ? `${baseTrim.electricEfficiencyCombined}km/kWh`
                    : "정보없음"}
                </span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl">
                <span className="text-slate-400 block">배기량/출력</span>
                <span className="font-extrabold text-slate-800 text-sm mt-0.5 block">
                  {baseTrim.engineDisplacement
                    ? `${baseTrim.engineDisplacement}cc`
                    : `${baseTrim.maxPower || 0}ps`}
                </span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl">
                <span className="text-slate-400 block">승차인원</span>
                <span className="font-extrabold text-slate-800 text-sm mt-0.5 block">
                  {baseTrim.seatingCapacity}인승
                </span>
              </div>
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <Link
              href={`/calculator/installment?price=${model.minPrice}`}
              className="flex-1 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-center text-sm shadow-lg shadow-blue-500/20 transition-all flex items-center justify-center gap-2"
            >
              <span>할부 견적 계산</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href={`/compare?car1=${encodeURIComponent(model.id)}`}
              className="px-4 py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-sm transition-colors flex items-center justify-center gap-1.5"
            >
              <Layers className="w-4 h-4" />
              <span>비교하기</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Trims & Prices Table */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
        <div>
          <h2 className="text-xl font-black text-slate-900 tracking-tight">
            트림별 판매 가격표 및 사양
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            취득세(7%)와 등록비용이 포함된 실구매 총비용을 확인할 수 있습니다.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">트림명</th>
                <th className="py-3 px-4">연료</th>
                <th className="py-3 px-4">변속기 / 구동</th>
                <th className="py-3 px-4">복합 연비</th>
                <th className="py-3 px-4">차량 가격</th>
                <th className="py-3 px-4">예상 취득비용</th>
                <th className="py-3 px-4">월 납입금 (48m)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {trims.map((t) => {
                const tax = calculateAcquisitionTax(
                  t.price,
                  model.vehicleType === "COMPACT" ? 0.04 : 0.07,
                  t.fuelType === "ELECTRIC" ? 1400000 : 0
                );
                const finance = calculateInstallment({
                  vehiclePrice: t.price,
                  downPayment: Math.round(t.price * 0.2),
                  termMonths: 48,
                  annualRatePct: 5.5,
                  skipComparisons: true,
                });

                return (
                  <tr key={t.id} className="hover:bg-slate-50">
                    <td className="py-3 px-4 font-bold text-slate-900">{t.nameKo}</td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded bg-slate-100 font-semibold text-slate-700">
                        {t.fuelType}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-600">
                      {t.transmission || "자동"} / {t.drivetrain || "2WD"}
                    </td>
                    <td className="py-3 px-4 font-semibold text-slate-700">
                      {t.fuelEfficiencyCombined
                        ? `${t.fuelEfficiencyCombined}km/L`
                        : t.electricEfficiencyCombined
                        ? `${t.electricEfficiencyCombined}km/kWh`
                        : "-"}
                    </td>
                    <td className="py-3 px-4 font-extrabold text-slate-900 text-sm">
                      {formatKoreanMoney(t.price)}
                    </td>
                    <td className="py-3 px-4 text-slate-600">
                      약 {formatKoreanMoney(tax + 350000)}
                    </td>
                    <td className="py-3 px-4 font-black text-blue-600 text-sm">
                      월 {formatKoreanMoney(finance.monthlyPayment)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mid Content Ad Banner */}
      <AdBanner slot="content-mid-slot" />

      {/* Used Car Market Comparison for this Model */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
              <TrendingDown className="w-5 h-5 text-amber-500" />
              <span>동일 차종 연식별 중고차 시세 & 감가율</span>
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              신차 출고가 대비 연식별 중고차 실거래 평균 시세입니다.
            </p>
          </div>
          <Link
            href={`/used-cars/${model.brand.slug}/${model.slug}`}
            className="text-xs font-bold text-blue-600 hover:text-blue-800"
          >
            중고차 시세 상세 차트 보기 →
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {model.marketStats.map((stat) => (
            <div
              key={stat.id}
              className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-2 text-center"
            >
              <div className="text-xs font-bold text-slate-500">{stat.year}년식</div>
              <div className="text-lg font-black text-slate-900">
                {formatKoreanMoney(stat.avgPrice)}
              </div>
              <div className="text-xs text-amber-600 font-bold">
                출고가 대비 -{stat.depreciationRate}% 감가
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
