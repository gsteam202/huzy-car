"use client";

import { useState, useEffect, useTransition, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { formatKoreanMoney } from "@/lib/finance";
import { BudgetRecommendationItem } from "@/lib/finance";
import AdBanner from "@/components/ads/ad-banner";
import { CarImage } from "@/components/cars/car-image";
import {
  Calculator,
  Filter,
  CheckCircle,
  Share2,
  Bookmark,
  Car,
  Fuel,
  Users,
  Sparkles,
  ArrowRight,
  TrendingDown,
  Info,
  Layers,
} from "lucide-react";

function BudgetCalculatorContent() {
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  // Inputs
  const [cash, setCash] = useState<number>(
    searchParams.get("cash") ? Number(searchParams.get("cash")) : 15000000
  );
  const [reserveCash, setReserveCash] = useState<number>(
    searchParams.get("reserve") ? Number(searchParams.get("reserve")) : 2000000
  );
  const [tradeInValue, setTradeInValue] = useState<number>(
    searchParams.get("tradeIn") ? Number(searchParams.get("tradeIn")) : 0
  );
  const [monthlyBudget, setMonthlyBudget] = useState<number>(
    searchParams.get("monthly") ? Number(searchParams.get("monthly")) : 600000
  );
  const [termMonths, setTermMonths] = useState<number>(
    searchParams.get("term") ? Number(searchParams.get("term")) : 48
  );
  const [annualRatePct, setAnnualRatePct] = useState<number>(5.5);
  const [carType, setCarType] = useState<"ALL" | "NEW" | "USED">(
    (searchParams.get("carType") as any) || "ALL"
  );
  const [fuelTypes, setFuelTypes] = useState<string[]>([]);
  const [vehicleTypes, setVehicleTypes] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<"surplus" | "monthly" | "totalCost">("surplus");

  // Output
  const [recommendations, setRecommendations] = useState<BudgetRecommendationItem[]>([]);
  const [limits, setLimits] = useState<any>(null);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [copied, setCopied] = useState(false);

  // Fetch recommendations
  const fetchRecommendations = () => {
    startTransition(async () => {
      try {
        const res = await fetch("/api/budget/recommend", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            cashAvailable: cash,
            reserveCash,
            tradeInValue,
            monthlyBudget,
            annualRatePct,
            termMonths,
            carType,
            fuelTypes: fuelTypes.length > 0 ? fuelTypes : undefined,
            vehicleTypes: vehicleTypes.length > 0 ? vehicleTypes : undefined,
          }),
        });
        const data = await res.json();
        if (data.success) {
          setRecommendations(data.data.items);
          setLimits(data.data.limits);
        }
      } catch (e) {
        console.error("Failed to fetch recommendations:", e);
      }
    });
  };

  useEffect(() => {
    fetchRecommendations();
  }, [cash, reserveCash, tradeInValue, monthlyBudget, termMonths, annualRatePct, carType, fuelTypes, vehicleTypes]);

  // Sort recommendations
  const sortedItems = [...recommendations].sort((a, b) => {
    if (sortBy === "monthly") return a.monthlyPayment - b.monthlyPayment;
    if (sortBy === "totalCost") return a.totalAcquisitionCost - b.totalAcquisitionCost;
    return b.budgetSurplusMonthly - a.budgetSurplusMonthly;
  });

  const handleShare = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleSaveResult = async () => {
    try {
      const res = await fetch("/api/budget/recommend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cashAvailable: cash,
          reserveCash,
          tradeInValue,
          monthlyBudget,
          annualRatePct,
          termMonths,
          carType,
          saveSearch: true,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setSavedSuccess(true);
        setTimeout(() => setSavedSuccess(false), 3000);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const tagLabelMap: Record<string, { label: string; color: string }> = {
    LOWEST_PRICE: { label: "가장 저렴한 차량", color: "bg-emerald-100 text-emerald-800" },
    VALUE_FOR_MONEY: { label: "가성비 추천", color: "bg-blue-100 text-blue-800" },
    FAMILY_CHOICE: { label: "가족용 추천", color: "bg-purple-100 text-purple-800" },
    ECO_SAVER: { label: "유지비 절약형", color: "bg-teal-100 text-teal-800" },
    BEST_NEW: { label: "신차 추천", color: "bg-sky-100 text-sky-800" },
    BEST_USED: { label: "중고차 추천", color: "bg-amber-100 text-amber-800" },
    BUDGET_MAXIMIZER: { label: "예산 최대 활용", color: "bg-indigo-100 text-indigo-800" },
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Banner */}
      <AdBanner slot="page-top-slot" compact />

      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>CAR HUZY 시그니처 엔진</span>
          </div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">
            내 예산으로 구매 가능한 자동차 찾기
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            보유 현금과 월 납입금 한도를 입력하면, 취득세와 할부 이자까지 계산하여 구매 가능한 차량을 추천합니다.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleShare}
            className="px-4 py-2 bg-white border border-slate-200 hover:bg-slate-50 rounded-xl text-xs font-bold text-slate-700 flex items-center gap-1.5 shadow-sm transition-all"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>{copied ? "URL 복사완료!" : "조건 공유"}</span>
          </button>
          <button
            onClick={handleSaveResult}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm shadow-blue-500/20 transition-all"
          >
            <Bookmark className="w-3.5 h-3.5" />
            <span>{savedSuccess ? "저장 완료!" : "결과 저장"}</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Left Filter & Input Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-5">
            <div className="flex items-center gap-2 font-bold text-slate-900 pb-3 border-b border-slate-100">
              <Filter className="w-4 h-4 text-blue-600" />
              <span>예산 및 조건 설정</span>
            </div>

            {/* 1. Cash Available */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-600">
                현재 보유 현금:{" "}
                <span className="text-blue-600">{formatKoreanMoney(cash)}</span>
              </label>
              <input
                type="range"
                min={0}
                max={50000000}
                step={1000000}
                value={cash}
                onChange={(e) => setCash(Number(e.target.value))}
                className="w-full accent-blue-600"
              />
            </div>

            {/* 2. Emergency Reserve */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-600">
                유지할 비상자금:{" "}
                <span className="text-slate-700">{formatKoreanMoney(reserveCash)}</span>
              </label>
              <input
                type="range"
                min={0}
                max={20000000}
                step={500000}
                value={reserveCash}
                onChange={(e) => setReserveCash(Number(e.target.value))}
                className="w-full accent-slate-500"
              />
            </div>

            {/* 3. Monthly Budget */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-600">
                월 최대 납입금:{" "}
                <span className="text-blue-600">{formatKoreanMoney(monthlyBudget)}</span>
              </label>
              <input
                type="range"
                min={100000}
                max={2000000}
                step={50000}
                value={monthlyBudget}
                onChange={(e) => setMonthlyBudget(Number(e.target.value))}
                className="w-full accent-blue-600"
              />
            </div>

            {/* 4. Term Months */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-600">할부 기간</label>
              <div className="grid grid-cols-3 gap-1">
                {[24, 36, 48, 60, 72].map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setTermMonths(t)}
                    className={`py-1.5 text-xs font-bold rounded-lg border ${
                      termMonths === t
                        ? "bg-blue-600 text-white border-blue-600"
                        : "bg-white text-slate-600 border-slate-200"
                    }`}
                  >
                    {t}개월
                  </button>
                ))}
              </div>
            </div>

            {/* 5. Car Type */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-600">구분</label>
              <div className="grid grid-cols-3 gap-1">
                {[
                  { key: "ALL", label: "전체" },
                  { key: "NEW", label: "신차만" },
                  { key: "USED", label: "중고차만" },
                ].map((c) => (
                  <button
                    key={c.key}
                    type="button"
                    onClick={() => setCarType(c.key as any)}
                    className={`py-1.5 text-xs font-bold rounded-lg border ${
                      carType === c.key
                        ? "bg-blue-600 text-white border-blue-600"
                        : "bg-white text-slate-600 border-slate-200"
                    }`}
                  >
                    {c.label}
                  </button>
                ))}
              </div>
            </div>

            {/* 6. Fuel Type */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-600">선호 연료</label>
              <div className="grid grid-cols-2 gap-1.5">
                {[
                  { key: "GASOLINE", label: "가솔린" },
                  { key: "HYBRID", label: "하이브리드" },
                  { key: "ELECTRIC", label: "전기차" },
                  { key: "DIESEL", label: "디젤" },
                ].map((f) => {
                  const selected = fuelTypes.includes(f.key);
                  return (
                    <button
                      key={f.key}
                      type="button"
                      onClick={() => {
                        if (selected) {
                          setFuelTypes(fuelTypes.filter((x) => x !== f.key));
                        } else {
                          setFuelTypes([...fuelTypes, f.key]);
                        }
                      }}
                      className={`py-1.5 px-2 text-xs font-bold rounded-lg border text-left ${
                        selected
                          ? "bg-blue-50 text-blue-700 border-blue-400"
                          : "bg-white text-slate-600 border-slate-200"
                      }`}
                    >
                      {f.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Budget Limits Calculation Card */}
          {limits && (
            <div className="bg-gradient-to-br from-slate-900 to-blue-950 text-white p-5 rounded-2xl space-y-3">
              <div className="text-xs text-blue-300 font-bold uppercase tracking-wider">
                예산 계산 분석표
              </div>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between py-1 border-b border-white/10">
                  <span className="text-slate-400">차량 가용 현금</span>
                  <span className="font-bold">{formatKoreanMoney(limits.usableCash)}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-white/10">
                  <span className="text-slate-400">최대 대출 원금</span>
                  <span className="font-bold">{formatKoreanMoney(limits.maxLoanPrincipal)}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-white/10">
                  <span className="text-slate-400">취등록세/부대비용 고려</span>
                  <span className="font-bold text-emerald-400">약 7% 자동 차감</span>
                </div>
                <div className="pt-2">
                  <div className="text-[11px] text-slate-400">구매 가능 차량 가격 상한</div>
                  <div className="text-xl font-black text-blue-400">
                    약 {formatKoreanMoney(limits.maxVehiclePrice)}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Recommended Car Results */}
        <div className="lg:col-span-3 space-y-6">
          {/* Header Controls */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-900 text-sm">추천 차량</span>
              <span className="px-2 py-0.5 text-xs font-extrabold bg-blue-100 text-blue-700 rounded-full">
                {recommendations.length}대
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400 font-medium">정렬:</span>
              <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
                {[
                  { key: "surplus", label: "예산 여유순" },
                  { key: "monthly", label: "월 납입금 낮은순" },
                  { key: "totalCost", label: "총비용 낮은순" },
                ].map((s) => (
                  <button
                    key={s.key}
                    type="button"
                    onClick={() => setSortBy(s.key as any)}
                    className={`px-3 py-1 text-xs font-bold rounded-lg transition-colors ${
                      sortBy === s.key
                        ? "bg-white text-slate-900 shadow-sm"
                        : "text-slate-500 hover:text-slate-900"
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Mid Content Ad Banner */}
          <AdBanner slot="content-mid-slot" />

          {/* Results List */}
          {sortedItems.length === 0 ? (
            <div className="bg-white p-12 rounded-2xl border border-slate-200 text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                <Car className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-slate-800 text-lg">
                조건에 맞는 추천 차량이 없습니다.
              </h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                보유 자금이나 월 납입 한도를 상향하거나, 연료 또는 차종 필터를 해제해보세요.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {sortedItems.map((car) => {
                const tagInfo = tagLabelMap[car.recommendationTag] || {
                  label: "추천",
                  color: "bg-blue-100 text-blue-800",
                };

                return (
                  <div
                    key={car.id}
                    className="bg-white rounded-2xl border border-slate-200 overflow-hidden hover:border-blue-400 hover:shadow-xl transition-all duration-200 flex flex-col justify-between"
                  >
                    <div>
                      {/* Top Image & Badges */}
                      <div className="relative h-44 bg-slate-100 overflow-hidden">
                        <CarImage
                          src={car.imageUrl}
                          alt={car.modelNameKo}
                          modelSlug={car.modelSlug}
                          showOfficialBadge={car.type === "NEW"}
                        />
                        <span
                          className={`absolute top-3 left-3 px-2.5 py-1 text-xs font-extrabold rounded-lg shadow-sm z-10 ${
                            car.type === "NEW" ? "bg-blue-600 text-white" : "bg-amber-500 text-white"
                          }`}
                        >
                          {car.type === "NEW" ? "신차" : "중고차"}
                        </span>
                        <span className="absolute top-3 right-3 px-2.5 py-1 text-xs font-bold rounded-lg bg-slate-900/80 text-white backdrop-blur-sm">
                          {car.brandNameKo}
                        </span>
                        <div className="absolute bottom-3 left-3">
                          <span className={`px-2.5 py-1 text-[11px] font-extrabold rounded-md shadow-sm ${tagInfo.color}`}>
                            {tagInfo.label}
                          </span>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-5 space-y-4">
                        <div>
                          <div className="flex items-center justify-between">
                            <h3 className="font-extrabold text-lg text-slate-900">
                              {car.modelNameKo}
                            </h3>
                            <span className="text-base font-black text-slate-900">
                              {formatKoreanMoney(car.price)}
                            </span>
                          </div>
                          <p className="text-xs text-slate-500 mt-0.5">
                            {car.trimNameKo || `${car.year}년형`} • {car.fuelType}
                          </p>
                        </div>

                        {/* Recommendation Reason Callout */}
                        <div className="p-3 bg-blue-50/60 rounded-xl text-xs text-blue-900 font-medium leading-relaxed flex items-start gap-2">
                          <Sparkles className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                          <span>{car.recommendationReason}</span>
                        </div>

                        {/* Cost Grid */}
                        <div className="grid grid-cols-2 gap-2 text-xs bg-slate-50 p-3 rounded-xl border border-slate-100">
                          <div>
                            <span className="text-slate-400">초기 필요 현금</span>
                            <div className="font-bold text-slate-800">
                              {formatKoreanMoney(car.initialCashRequired)}
                            </div>
                          </div>
                          <div>
                            <span className="text-slate-400">예상 월 할부금</span>
                            <div className="font-extrabold text-blue-600 text-sm">
                              월 {formatKoreanMoney(car.monthlyPayment)}
                            </div>
                          </div>
                          <div className="pt-1 border-t border-slate-200/60">
                            <span className="text-slate-400">총 구매비용</span>
                            <div className="font-medium text-slate-700">
                              {formatKoreanMoney(car.totalAcquisitionCost)}
                            </div>
                          </div>
                          <div className="pt-1 border-t border-slate-200/60">
                            <span className="text-slate-400">월 예산 대비 여유</span>
                            <div className="font-bold text-emerald-600">
                              +월 {formatKoreanMoney(car.budgetSurplusMonthly)}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Bottom Actions */}
                    <div className="p-5 pt-0 flex items-center gap-2">
                      <Link
                        href={car.detailUrl}
                        className="flex-1 py-2.5 bg-slate-900 hover:bg-blue-600 text-white rounded-xl text-center text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
                      >
                        <span>차량 상세 & 견적 보기</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                      <Link
                        href={`/compare?car1=${encodeURIComponent(car.id)}`}
                        className="p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-colors"
                        title="비교함에 추가"
                      >
                        <Layers className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Bottom Ad Banner */}
      <AdBanner slot="content-bottom-slot" />
    </div>
  );
}

export default function BudgetCalculatorPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-7xl mx-auto px-4 py-16 flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <BudgetCalculatorContent />
    </Suspense>
  );
}
