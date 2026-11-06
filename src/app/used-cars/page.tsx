import { Fragment } from "react";
import Link from "next/link";
import { prisma } from "@/lib/db";
import { formatKoreanMoney } from "@/lib/finance";
import { Compass, Car, ShieldCheck, ChevronRight, Filter } from "lucide-react";
import AdBanner from "@/components/ads/ad-banner";
import { CarImage } from "@/components/cars/car-image";

export const revalidate = 60;

interface Props {
  searchParams: Promise<{
    brand?: string;
    model?: string;
    q?: string;
    fuel?: string;
    maxPrice?: string;
  }>;
}

export default async function UsedCarsPage({ searchParams }: Props) {
  const { brand, model, q, fuel, maxPrice } = await searchParams;

  const brands = await prisma.carBrand.findMany({
    where: { isActive: true },
    orderBy: { orderIndex: "asc" },
  });

  const where: any = { listingStatus: "ACTIVE" };
  if (brand) where.brand = { slug: brand };
  if (model) where.model = { slug: model };
  if (fuel) where.fuelType = fuel as any;
  if (maxPrice) where.price = { lte: Number(maxPrice) };
  if (q) {
    where.OR = [
      { title: { contains: q } },
      { model: { nameKo: { contains: q } } },
      { brand: { nameKo: { contains: q } } },
    ];
  }

  const listings = await prisma.usedCarListing.findMany({
    where,
    include: {
      brand: true,
      model: true,
    },
    orderBy: { listedAt: "desc" },
    take: 30,
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Banner */}
      <AdBanner slot="page-top-slot" compact />

      {/* Header */}
      <div className="border-b border-slate-200 pb-6 space-y-2">
        <div className="flex items-center gap-2 text-xs font-bold text-amber-600 uppercase tracking-wider">
          <Compass className="w-4 h-4" />
          <span>USED CAR MARKET INTELLIGENCE</span>
        </div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">
          대한민국 중고차 시세 & 실매물 검증
        </h1>
        <p className="text-sm text-slate-500">
          허위 매물 필터링 및 사고 유무, 주행거리, 연식별 감가율을 분석한 매물 호가 및 추정 시세입니다.
        </p>
      </div>

      {/* Brand Filters */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        <Link
          href="/used-cars"
          className={`px-4 py-2 rounded-xl text-xs font-bold shrink-0 transition-all ${
            !brand
              ? "bg-slate-900 text-white shadow-sm"
              : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
          }`}
        >
          전체
        </Link>
        {brands.map((b) => (
          <Link
            key={b.slug}
            href={`/used-cars?brand=${b.slug}`}
            className={`px-4 py-2 rounded-xl text-xs font-bold shrink-0 transition-all ${
              brand === b.slug
                ? "bg-amber-500 text-white shadow-sm shadow-amber-500/20"
                : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
            }`}
          >
            {b.nameKo}
          </Link>
        ))}
      </div>

      {/* Listings Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {listings.map((u, idx) => (
          <Fragment key={u.id}>
            {idx === 5 && listings.length >= 8 && (
              <div className="col-span-1 sm:col-span-2 lg:col-span-3 xl:col-span-4 py-2">
                <AdBanner slot="content-mid-slot" />
              </div>
            )}
            <Link
              href={`/used-cars/${u.brand.slug}/${u.model.slug}`}
              className="bg-white rounded-2xl border border-slate-200 overflow-hidden hover:border-amber-400 hover:shadow-xl transition-all duration-200 flex flex-col justify-between group"
            >
            <div>
              <div className="relative h-44 bg-slate-100 overflow-hidden">
                <CarImage
                  src={u.imageUrl}
                  alt={u.title}
                  modelSlug={u.model.slug}
                />
                <span className="absolute top-2.5 left-2.5 px-2 py-0.5 text-xs font-bold rounded-md bg-amber-500 text-white shadow-sm z-10">
                  {u.accidentHistory === "NONE" ? "무사고" : "단순수리"}
                </span>
                <span className="absolute bottom-2.5 right-2.5 px-2 py-0.5 text-[11px] font-medium rounded bg-black/60 text-white z-10">
                  {u.region}
                </span>
              </div>

              <div className="p-4 space-y-2">
                <div className="text-[11px] text-slate-400 font-semibold">
                  {u.brand.nameKo} • {u.fuelType}
                </div>
                <h3 className="font-extrabold text-sm text-slate-900 group-hover:text-amber-600 transition-colors line-clamp-2">
                  {u.title}
                </h3>
                <div className="flex items-center gap-2 text-xs text-slate-500 pt-1">
                  <span>{u.year}년식</span>
                  <span>•</span>
                  <span>{u.mileageKm.toLocaleString()}km</span>
                </div>
              </div>
            </div>

            <div className="p-4 pt-0 border-t border-slate-100 mt-3 flex items-center justify-between">
              <div>
                <span className="text-[11px] text-slate-400">판매 가격</span>
                <div className="text-base font-black text-slate-900">
                  {formatKoreanMoney(u.price)}
                </div>
              </div>
              <span className="text-xs font-bold text-blue-600 group-hover:translate-x-0.5 transition-transform">
                시세분석 →
              </span>
            </div>
          </Link>
        </Fragment>
      ))}
      </div>

      {/* Bottom Ad Banner */}
      <AdBanner slot="content-bottom-slot" />
    </div>
  );
}
