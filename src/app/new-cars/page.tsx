import Link from "next/link";
import { prisma } from "@/lib/db";
import { formatKoreanMoney } from "@/lib/finance";
import { Car, Fuel, Zap, Leaf, Filter, ChevronRight } from "lucide-react";

export const revalidate = 60;

interface Props {
  searchParams: Promise<{
    brand?: string;
    type?: string;
    fuel?: string;
    q?: string;
  }>;
}

export default async function NewCarsPage({ searchParams }: Props) {
  const { brand, type, fuel, q } = await searchParams;

  const brands = await prisma.carBrand.findMany({
    where: { isActive: true },
    orderBy: { orderIndex: "asc" },
  });

  const where: any = {};
  if (brand) where.brand = { slug: brand };
  if (type) where.vehicleType = type;
  if (q) {
    where.OR = [
      { nameKo: { contains: q } },
      { nameEn: { contains: q } },
      { brand: { nameKo: { contains: q } } },
    ];
  }

  const models = await prisma.carModel.findMany({
    where,
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
                orderBy: { price: "asc" },
              },
            },
          },
        },
      },
    },
    orderBy: { viewCount: "desc" },
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="border-b border-slate-200 pb-6 space-y-2">
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">
          대한민국 신차 가격표 및 트림 비교
        </h1>
        <p className="text-sm text-slate-500">
          국내 및 수입 주요 완성차 브랜드의 공식 출고 가격, 트림별 옵션 사양 및 예상 취득비용을 비교하세요.
        </p>
      </div>

      {/* Brand Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        <Link
          href="/new-cars"
          className={`px-4 py-2 rounded-xl text-xs font-bold shrink-0 transition-all ${
            !brand
              ? "bg-slate-900 text-white shadow-sm"
              : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
          }`}
        >
          전체 브랜드
        </Link>
        {brands.map((b) => (
          <Link
            key={b.slug}
            href={`/new-cars?brand=${b.slug}`}
            className={`px-4 py-2 rounded-xl text-xs font-bold shrink-0 transition-all ${
              brand === b.slug
                ? "bg-blue-600 text-white shadow-sm shadow-blue-500/20"
                : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
            }`}
          >
            {b.nameKo}
          </Link>
        ))}
      </div>

      {/* Vehicle Type Filters */}
      <div className="flex flex-wrap items-center gap-2">
        {[
          { key: "", label: "전체 차종" },
          { key: "SEDAN", label: "세단" },
          { key: "SUV", label: "SUV" },
          { key: "RV", label: "RV / 미니밴" },
          { key: "COMPACT", label: "경차" },
        ].map((t) => (
          <Link
            key={t.key}
            href={`/new-cars?${brand ? `brand=${brand}&` : ""}${t.key ? `type=${t.key}` : ""}`}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors ${
              (type || "") === t.key
                ? "bg-blue-50 text-blue-700 border border-blue-200"
                : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
            }`}
          >
            {t.label}
          </Link>
        ))}
      </div>

      {/* Models Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {models.map((m) => {
          const trims = m.generations[0]?.modelYears[0]?.trims || [];
          const minTrim = trims[0];
          const maxTrim = trims[trims.length - 1];

          return (
            <Link
              key={m.id}
              href={`/new-cars/${m.brand.slug}/${m.slug}`}
              className="bg-white rounded-2xl border border-slate-200 overflow-hidden hover:border-blue-400 hover:shadow-xl transition-all flex flex-col justify-between group"
            >
              <div>
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
                  <span className="absolute top-3 left-3 px-2 py-0.5 text-xs font-bold rounded-md bg-blue-600 text-white">
                    {m.brand.nameKo}
                  </span>
                  <span className="absolute top-3 right-3 px-2 py-0.5 text-xs font-semibold rounded-md bg-slate-900/80 text-white">
                    {m.vehicleType}
                  </span>
                </div>

                <div className="p-5 space-y-3">
                  <div>
                    <h3 className="font-extrabold text-lg text-slate-900 group-hover:text-blue-600 transition-colors">
                      {m.nameKo}
                    </h3>
                    <p className="text-xs text-slate-400">{m.nameEn}</p>
                  </div>

                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {trims.map((t) => (
                      <span
                        key={t.id}
                        className="px-2 py-0.5 text-[11px] rounded bg-slate-100 text-slate-600 font-medium"
                      >
                        {t.fuelType}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="p-5 pt-0 border-t border-slate-100 mt-4 flex items-center justify-between">
                <div>
                  <span className="text-[11px] text-slate-400">판매 가격</span>
                  <div className="text-base font-extrabold text-slate-900">
                    {formatKoreanMoney(m.minPrice)} ~ {formatKoreanMoney(m.maxPrice)}
                  </div>
                </div>
                <div className="w-8 h-8 rounded-full bg-slate-100 group-hover:bg-blue-600 group-hover:text-white flex items-center justify-center transition-colors">
                  <ChevronRight className="w-4 h-4" />
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
