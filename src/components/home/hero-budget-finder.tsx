"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { calculateBudgetLimits, formatKoreanMoney } from "@/lib/finance";
import { Calculator, ArrowRight, Sparkles, TrendingUp, ShieldCheck } from "lucide-react";

export function HeroBudgetFinder() {
  const router = useRouter();

  // State in Manwon (만원) for intuitive Korean input
  const [cashManwon, setCashManwon] = useState<number>(1500); // 1,500만원
  const [monthlyManwon, setMonthlyManwon] = useState<number>(60); // 월 60만원
  const [termMonths, setTermMonths] = useState<number>(48); // 48개월
  const [carType, setCarType] = useState<"ALL" | "NEW" | "USED">("ALL");

  const limits = useMemo(() => {
    return calculateBudgetLimits({
      cashAvailable: cashManwon * 10000,
      monthlyBudget: monthlyManwon * 10000,
      termMonths,
      annualRatePct: 5.5,
    });
  }, [cashManwon, monthlyManwon, termMonths]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const query = new URLSearchParams({
      cash: (cashManwon * 10000).toString(),
      monthly: (monthlyManwon * 10000).toString(),
      term: termMonths.toString(),
      carType,
    });
    router.push(`/calculator/budget?${query.toString()}`);
  };

  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-blue-900 via-slate-900 to-slate-900 text-white py-16 sm:py-24 px-4 sm:px-6 lg:px-8">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-blue-500/20 via-transparent to-transparent pointer-events-none" />
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-5xl mx-auto relative z-10">
        {/* Title & Badge */}
        <div className="text-center space-y-4 max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-400/20 text-blue-300 text-xs font-semibold backdrop-blur-sm">
            <Sparkles className="w-3.5 h-3.5 text-blue-400" />
            <span>국내 최초 자금 역산 기반 자동차 자동 매칭</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight sm:leading-tight">
            내 예산으로 <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-sky-300 to-indigo-300">어떤 차를</span> 살 수 있을까?
          </h1>

          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            지금 보유한 자금과 매월 지출 가능한 금액을 입력하세요.
            취득세와 이자까지 고려해 1원도 초과하지 않는 최적의 차량을 찾아드립니다.
          </p>
        </div>

        {/* Interactive Calculator Card */}
        <div className="bg-white text-slate-900 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-blue-950/50 border border-slate-100 max-w-4xl mx-auto">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* 1. Cash Available */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">
                    현재 보유 자금 (선납금)
                  </label>
                  <span className="text-sm font-extrabold text-blue-600">
                    {formatKoreanMoney(cashManwon * 10000)}
                  </span>
                </div>
                <div className="relative">
                  <input
                    type="range"
                    min={0}
                    max={5000}
                    step={100}
                    value={cashManwon}
                    onChange={(e) => setCashManwon(Number(e.target.value))}
                    className="w-full accent-blue-600 cursor-pointer"
                  />
                  <div className="flex justify-between text-[11px] text-slate-400 font-medium mt-1">
                    <span>0원</span>
                    <span>2,500만원</span>
                    <span>5,000만원+</span>
                  </div>
                </div>
              </div>

              {/* 2. Monthly Budget */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">
                    월 최대 납입 가능액
                  </label>
                  <span className="text-sm font-extrabold text-blue-600">
                    월 {formatKoreanMoney(monthlyManwon * 10000)}
                  </span>
                </div>
                <div className="relative">
                  <input
                    type="range"
                    min={10}
                    max={200}
                    step={5}
                    value={monthlyManwon}
                    onChange={(e) => setMonthlyManwon(Number(e.target.value))}
                    className="w-full accent-blue-600 cursor-pointer"
                  />
                  <div className="flex justify-between text-[11px] text-slate-400 font-medium mt-1">
                    <span>월 10만</span>
                    <span>월 100만</span>
                    <span>월 200만원</span>
                  </div>
                </div>
              </div>

              {/* 3. Installment Term & Car Type */}
              <div className="space-y-2 sm:col-span-2 lg:col-span-1">
                <label className="text-xs font-bold text-slate-600 uppercase tracking-wider block">
                  할부 기간 & 조건
                </label>
                <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-100 rounded-xl">
                  {[36, 48, 60].map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setTermMonths(t)}
                      className={`py-1.5 text-xs font-bold rounded-lg transition-all ${
                        termMonths === t
                          ? "bg-white text-blue-700 shadow-sm"
                          : "text-slate-600 hover:text-slate-900"
                      }`}
                    >
                      {t}개월
                    </button>
                  ))}
                </div>
                <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-100 rounded-xl mt-1">
                  {[
                    { key: "ALL", label: "신차+중고차" },
                    { key: "NEW", label: "신차만" },
                    { key: "USED", label: "중고차만" },
                  ].map((c) => (
                    <button
                      key={c.key}
                      type="button"
                      onClick={() => setCarType(c.key as any)}
                      className={`py-1.5 text-xs font-bold rounded-lg transition-all ${
                        carType === c.key
                          ? "bg-blue-600 text-white shadow-sm"
                          : "text-slate-600 hover:text-slate-900"
                      }`}
                    >
                      {c.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Estimated Purchasing Power Summary Bar */}
            <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-50 p-4 rounded-2xl">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
                  <TrendingUp className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs text-slate-500 font-medium">취등록세·부대비용을 제외한</div>
                  <div className="text-base sm:text-lg font-black text-slate-900">
                    구매 가능 차량가 상한:{" "}
                    <span className="text-blue-600">
                      약 {formatKoreanMoney(limits.maxVehiclePrice)}
                    </span>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="w-full sm:w-auto px-6 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-600/30 hover:shadow-xl transition-all flex items-center justify-center gap-2 group shrink-0"
              >
                <span>내 예산 추천 차량 찾기</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </form>

          {/* Value Badges */}
          <div className="mt-6 pt-4 border-t border-slate-100 grid grid-cols-3 gap-2 text-center text-xs text-slate-500 font-medium">
            <div className="flex items-center justify-center gap-1">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>취등록세 7% 자동 차감</span>
            </div>
            <div className="flex items-center justify-center gap-1">
              <Calculator className="w-4 h-4 text-blue-600" />
              <span>원리금균등 역산 알고리즘</span>
            </div>
            <div className="flex items-center justify-center gap-1">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>맞춤형 가성비 랭킹</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
