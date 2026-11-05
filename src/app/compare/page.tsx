import { prisma } from "@/lib/db";
import { formatKoreanMoney, calculateInstallment, estimateMonthlyMaintenance } from "@/lib/finance";
import Link from "next/link";
import { Layers, Plus, Check, Car, X, ArrowRight } from "lucide-react";

export const revalidate = 60;

interface Props {
  searchParams: Promise<{
    car1?: string;
    car2?: string;
    car3?: string;
  }>;
}

export default async function CarComparePage({ searchParams }: Props) {
  const { car1, car2, car3 } = await searchParams;

  const allModels = await prisma.carModel.findMany({
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
                include: { specs: true },
              },
            },
          },
        },
      },
      marketStats: {
        orderBy: { year: "desc" },
        take: 1,
      },
    },
    orderBy: { viewCount: "desc" },
  });

  // Default comparison if none selected
  const defaultSelection = [
    car1 || allModels[0]?.id,
    car2 || allModels[1]?.id,
    car3 || allModels[2]?.id,
  ].filter(Boolean);

  const selectedCars = defaultSelection.map((id) => {
    return allModels.find((m) => m.id === id || m.slug === id);
  }).filter(Boolean) as (typeof allModels[0])[];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="border-b border-slate-200 pb-6 space-y-2">
        <div className="flex items-center gap-2 text-xs font-bold text-blue-600 uppercase tracking-wider">
          <Layers className="w-4 h-4" />
          <span>VEHICLE COMPARISON MATRIX</span>
        </div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">
          자동차 1:1 제원 & 총비용 정밀 비교
        </h1>
        <p className="text-sm text-slate-500">
          최대 3대의 차량을 선택하여 신차 가격, 감가율, 연비, 차체 크기 및 예상 월 납입금을 한눈에 비교하세요.
        </p>
      </div>

      {/* Model Selection Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-wrap items-center gap-4">
        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
          비교 대상 차량:
        </span>
        <div className="flex flex-wrap gap-2">
          {selectedCars.map((car, idx) => (
            <div
              key={car.id}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-blue-50 text-blue-800 text-xs font-extrabold border border-blue-200"
            >
              <span>{car.nameKo}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Comparison Table with Mobile Horizontal Scroll */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left min-w-[640px]">
            {/* Table Header: Car Names & Images */}
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                <th className="py-6 px-6 w-1/4 font-extrabold text-slate-600 uppercase tracking-wider">
                  비교 항목
                </th>
                {selectedCars.map((car) => {
                  const baseTrim = car.generations[0]?.modelYears[0]?.trims[0];
                  return (
                    <th key={car.id} className="py-6 px-6 w-1/4 align-top">
                      <div className="space-y-3">
                        <div className="h-32 bg-slate-200 rounded-xl overflow-hidden relative">
                          {car.imageUrl ? (
                            <img
                              src={car.imageUrl}
                              alt={car.nameKo}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <Car className="w-12 h-12 text-slate-400 m-auto mt-10" />
                          )}
                          <span className="absolute top-2 left-2 px-2 py-0.5 text-[10px] font-bold bg-blue-600 text-white rounded">
                            {car.brand.nameKo}
                          </span>
                        </div>
                        <div>
                          <h3 className="font-black text-base text-slate-900">{car.nameKo}</h3>
                          <p className="text-[11px] text-slate-400">{car.vehicleType}</p>
                        </div>
                      </div>
                    </th>
                  );
                })}
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100 text-slate-700">
              {/* 1. Price */}
              <tr className="bg-blue-50/30">
                <td className="py-4 px-6 font-bold text-slate-900">신차 판매 가격</td>
                {selectedCars.map((car) => (
                  <td key={car.id} className="py-4 px-6 font-black text-base text-slate-900">
                    {formatKoreanMoney(car.minPrice)} ~
                  </td>
                ))}
              </tr>

              {/* 2. Monthly Installment (48m, 20% down) */}
              <tr>
                <td className="py-4 px-6 font-bold text-slate-900">
                  예상 월 납입금 (48개월)
                  <span className="block text-[10px] font-normal text-slate-400">
                    선납금 20%, 연 5.5% 기준
                  </span>
                </td>
                {selectedCars.map((car) => {
                  const finance = calculateInstallment({
                    vehiclePrice: car.minPrice,
                    downPayment: Math.round(car.minPrice * 0.2),
                    termMonths: 48,
                    annualRatePct: 5.5,
                    skipComparisons: true,
                  });
                  return (
                    <td key={car.id} className="py-4 px-6 font-black text-blue-600 text-sm">
                      월 {formatKoreanMoney(finance.monthlyPayment)}
                    </td>
                  );
                })}
              </tr>

              {/* 3. Fuel & Displacement */}
              <tr>
                <td className="py-4 px-6 font-bold text-slate-900">연료 / 배기량</td>
                {selectedCars.map((car) => {
                  const trim = car.generations[0]?.modelYears[0]?.trims[0];
                  return (
                    <td key={car.id} className="py-4 px-6 font-semibold">
                      {trim?.fuelType || "가솔린"} (
                      {trim?.engineDisplacement ? `${trim.engineDisplacement}cc` : "전기모터"})
                    </td>
                  );
                })}
              </tr>

              {/* 4. Combined Fuel Efficiency */}
              <tr>
                <td className="py-4 px-6 font-bold text-slate-900">복합 연비</td>
                {selectedCars.map((car) => {
                  const trim = car.generations[0]?.modelYears[0]?.trims[0];
                  return (
                    <td key={car.id} className="py-4 px-6 font-bold text-slate-800">
                      {trim?.fuelEfficiencyCombined
                        ? `${trim.fuelEfficiencyCombined} km/L`
                        : trim?.electricEfficiencyCombined
                        ? `${trim.electricEfficiencyCombined} km/kWh`
                        : "-"}
                    </td>
                  );
                })}
              </tr>

              {/* 5. Dimensions */}
              <tr>
                <td className="py-4 px-6 font-bold text-slate-900">
                  전장 × 전폭 × 전고
                  <span className="block text-[10px] font-normal text-slate-400">mm 단위</span>
                </td>
                {selectedCars.map((car) => {
                  const spec = car.generations[0]?.modelYears[0]?.trims[0]?.specs;
                  return (
                    <td key={car.id} className="py-4 px-6">
                      {spec?.lengthMm && spec?.widthMm && spec?.heightMm
                        ? `${spec.lengthMm} × ${spec.widthMm} × ${spec.heightMm}`
                        : "제원 정보 준비중"}
                    </td>
                  );
                })}
              </tr>

              {/* 6. Seating Capacity */}
              <tr>
                <td className="py-4 px-6 font-bold text-slate-900">승차 정원</td>
                {selectedCars.map((car) => {
                  const trim = car.generations[0]?.modelYears[0]?.trims[0];
                  return (
                    <td key={car.id} className="py-4 px-6 font-bold">
                      {trim?.seatingCapacity || 5}인승
                    </td>
                  );
                })}
              </tr>

              {/* 7. Estimated Monthly Maintenance */}
              <tr>
                <td className="py-4 px-6 font-bold text-slate-900">
                  월 예상 유지비
                  <span className="block text-[10px] font-normal text-slate-400">
                    유류비 + 자동차세 + 보험료
                  </span>
                </td>
                {selectedCars.map((car) => {
                  const trim = car.generations[0]?.modelYears[0]?.trims[0];
                  const maint = estimateMonthlyMaintenance(
                    trim?.fuelType || "GASOLINE",
                    trim?.engineDisplacement || 1999,
                    trim?.fuelEfficiencyCombined || 12.0
                  );
                  return (
                    <td key={car.id} className="py-4 px-6 font-bold text-emerald-700">
                      월 {formatKoreanMoney(maint)}
                    </td>
                  );
                })}
              </tr>

              {/* 8. 3-Year Depreciation Rate */}
              <tr>
                <td className="py-4 px-6 font-bold text-slate-900">
                  중고차 평균 감가율
                  <span className="block text-[10px] font-normal text-slate-400">
                    출고 2~3년차 평균
                  </span>
                </td>
                {selectedCars.map((car) => {
                  const stat = car.marketStats[0];
                  return (
                    <td key={car.id} className="py-4 px-6 font-extrabold text-amber-600">
                      {stat ? `-${stat.depreciationRate}% 감가` : "표본 수집중"}
                    </td>
                  );
                })}
              </tr>

              {/* Actions Row */}
              <tr className="bg-slate-50/50">
                <td className="py-6 px-6 font-bold text-slate-900">상세 확인</td>
                {selectedCars.map((car) => (
                  <td key={car.id} className="py-6 px-6">
                    <Link
                      href={`/new-cars/${car.brand.slug}/${car.slug}`}
                      className="px-4 py-2.5 bg-slate-900 hover:bg-blue-600 text-white font-bold rounded-xl text-xs transition-colors inline-flex items-center gap-1.5"
                    >
                      <span>가격표 & 트림</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
