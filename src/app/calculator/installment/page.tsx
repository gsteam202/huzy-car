"use client";

import { useState, useMemo } from "react";
import { calculateInstallment, formatKoreanMoney } from "@/lib/finance";
import {
  Calculator,
  Calendar,
  Percent,
  CheckCircle2,
  Table,
  Share2,
  Bookmark,
  TrendingUp,
  FileSpreadsheet,
} from "lucide-react";

export default function InstallmentCalculatorPage() {
  const [vehiclePrice, setVehiclePrice] = useState<number>(35000000); // 3,500만원
  const [downPayment, setDownPayment] = useState<number>(7000000); // 700만원 (20%)
  const [termMonths, setTermMonths] = useState<number>(48);
  const [annualRatePct, setAnnualRatePct] = useState<number>(5.5);
  const [productType, setProductType] = useState<"STANDARD" | "ZERO_INTEREST" | "BALLOON">("STANDARD");
  const [balloonAmount, setBalloonAmount] = useState<number>(0);
  const [includeTaxInLoan, setIncludeTaxInLoan] = useState<boolean>(false);
  const [showSchedule, setShowSchedule] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const [earlyRepayMonth, setEarlyRepayMonth] = useState<number>(24);

  const result = useMemo(() => {
    return calculateInstallment({
      vehiclePrice,
      downPayment,
      termMonths,
      annualRatePct,
      productType,
      balloonAmount,
      includeTaxInLoan,
    });
  }, [vehiclePrice, downPayment, termMonths, annualRatePct, productType, balloonAmount, includeTaxInLoan]);

  // Early repayment simulation: if repaid at earlyRepayMonth
  const earlySavings = useMemo(() => {
    if (earlyRepayMonth >= termMonths || !result.schedule.length) return 0;
    const remainingInterest = result.schedule
      .slice(earlyRepayMonth)
      .reduce((acc, cur) => acc + cur.interest, 0);
    return remainingInterest;
  }, [earlyRepayMonth, termMonths, result]);

  const handleShare = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">
            자동차 할부 계산기
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            원리금균등, 무이자, 잔가보장형 상품별 월 납입금 및 회차별 원금·이자 상환표를 시뮬레이션합니다.
          </p>
        </div>

        <button
          onClick={handleShare}
          className="self-start md:self-auto px-4 py-2 bg-white border border-slate-200 hover:bg-slate-50 rounded-xl text-xs font-bold text-slate-700 flex items-center gap-1.5 shadow-sm transition-all"
        >
          <Share2 className="w-3.5 h-3.5" />
          <span>{copied ? "URL 복사완료!" : "계산 결과 공유"}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Inputs (5 cols) */}
        <div className="lg:col-span-5 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-6">
          <div className="flex items-center gap-2 font-bold text-slate-900 pb-3 border-b border-slate-100">
            <Calculator className="w-5 h-5 text-blue-600" />
            <span>할부 조건 입력</span>
          </div>

          {/* Product Type Tabs */}
          <div className="grid grid-cols-3 gap-1 bg-slate-100 p-1.5 rounded-xl text-xs font-bold">
            {[
              { key: "STANDARD", label: "원리금균등" },
              { key: "ZERO_INTEREST", label: "무이자할부" },
              { key: "BALLOON", label: "잔가유예형" },
            ].map((p) => (
              <button
                key={p.key}
                type="button"
                onClick={() => setProductType(p.key as any)}
                className={`py-2 rounded-lg transition-all ${
                  productType === p.key
                    ? "bg-white text-blue-700 shadow-sm"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>

          {/* Vehicle Price */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center text-xs font-bold text-slate-600">
              <label>차량 가격</label>
              <span className="text-blue-600 text-sm font-extrabold">
                {formatKoreanMoney(vehiclePrice)}
              </span>
            </div>
            <input
              type="range"
              min={10000000}
              max={150000000}
              step={1000000}
              value={vehiclePrice}
              onChange={(e) => setVehiclePrice(Number(e.target.value))}
              className="w-full accent-blue-600"
            />
            <div className="flex justify-between text-[11px] text-slate-400">
              <span>1,000만원</span>
              <span>8,000만원</span>
              <span>1억 5,000만원</span>
            </div>
          </div>

          {/* Down Payment */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center text-xs font-bold text-slate-600">
              <label>선납금 (현금 납입)</label>
              <span className="text-blue-600 text-sm font-extrabold">
                {formatKoreanMoney(downPayment)} (
                {Math.round((downPayment / vehiclePrice) * 100)}%)
              </span>
            </div>
            <input
              type="range"
              min={0}
              max={vehiclePrice}
              step={1000000}
              value={downPayment}
              onChange={(e) => setDownPayment(Number(e.target.value))}
              className="w-full accent-blue-600"
            />
            {/* Quick Percent Buttons */}
            <div className="flex gap-1.5 pt-1">
              {[0, 0.1, 0.2, 0.3, 0.5].map((pct) => (
                <button
                  key={pct}
                  type="button"
                  onClick={() => setDownPayment(Math.round(vehiclePrice * pct))}
                  className="flex-1 py-1 text-[11px] font-bold rounded bg-slate-100 text-slate-600 hover:bg-slate-200"
                >
                  {pct * 100}%
                </button>
              ))}
            </div>
          </div>

          {/* Balloon Amount (if BALLOON) */}
          {productType === "BALLOON" && (
            <div className="space-y-1.5 bg-amber-50 p-4 rounded-2xl border border-amber-200">
              <div className="flex justify-between items-center text-xs font-bold text-amber-900">
                <label>만기 유예금 (잔존가치)</label>
                <span className="text-amber-700 font-extrabold">
                  {formatKoreanMoney(balloonAmount)}
                </span>
              </div>
              <input
                type="range"
                min={0}
                max={Math.round(vehiclePrice * 0.5)}
                step={1000000}
                value={balloonAmount}
                onChange={(e) => setBalloonAmount(Number(e.target.value))}
                className="w-full accent-amber-600"
              />
              <p className="text-[11px] text-amber-700 mt-1">
                만기에 일시 상환하거나 차량 매각으로 정산하는 원금입니다.
              </p>
            </div>
          )}

          {/* Term Months */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-600">할부 기간</label>
            <div className="grid grid-cols-6 gap-1">
              {[12, 24, 36, 48, 60, 72].map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setTermMonths(t)}
                  className={`py-2 text-xs font-bold rounded-lg border ${
                    termMonths === t
                      ? "bg-blue-600 text-white border-blue-600"
                      : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                  }`}
                >
                  {t}m
                </button>
              ))}
            </div>
          </div>

          {/* Interest Rate */}
          {productType !== "ZERO_INTEREST" && (
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-xs font-bold text-slate-600">
                <label>연 할부 금리</label>
                <span className="text-blue-600 font-extrabold">{annualRatePct}%</span>
              </div>
              <input
                type="range"
                min={2.0}
                max={12.0}
                step={0.1}
                value={annualRatePct}
                onChange={(e) => setAnnualRatePct(Number(e.target.value))}
                className="w-full accent-blue-600"
              />
              <div className="flex justify-between text-[11px] text-slate-400">
                <span>2.0%</span>
                <span>7.0%</span>
                <span>12.0%</span>
              </div>
            </div>
          )}

          {/* Include Tax Option */}
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-slate-600 font-medium">취등록세 할부원금에 포함</span>
            <input
              type="checkbox"
              checked={includeTaxInLoan}
              onChange={(e) => setIncludeTaxInLoan(e.target.checked)}
              className="w-4 h-4 accent-blue-600 rounded"
            />
          </div>
        </div>

        {/* Right Output & Tables (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Main Result Card */}
          <div className="bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 text-white p-8 rounded-3xl shadow-xl space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
              <div>
                <span className="text-xs text-blue-400 font-bold tracking-wider uppercase">
                  ESTIMATED MONTHLY PAYMENT
                </span>
                <div className="text-3xl sm:text-4xl font-black text-white mt-1">
                  월 {formatKoreanMoney(result.monthlyPayment)}
                </div>
              </div>
              <div className="text-right">
                <span className="text-xs text-slate-400">총 구매 소요 비용</span>
                <div className="text-xl font-bold text-slate-200">
                  {formatKoreanMoney(result.totalAcquisitionCost)}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
              <div className="bg-white/5 p-3 rounded-xl border border-white/10">
                <span className="text-slate-400">총 할부 원금</span>
                <div className="text-sm font-bold text-white mt-1">
                  {formatKoreanMoney(result.loanPrincipal)}
                </div>
              </div>
              <div className="bg-white/5 p-3 rounded-xl border border-white/10">
                <span className="text-slate-400">총 이자 납부액</span>
                <div className="text-sm font-bold text-amber-400 mt-1">
                  {formatKoreanMoney(result.totalInterest)}
                </div>
              </div>
              <div className="bg-white/5 p-3 rounded-xl border border-white/10">
                <span className="text-slate-400">취득세 (7%)</span>
                <div className="text-sm font-bold text-white mt-1">
                  {formatKoreanMoney(result.acquisitionTax)}
                </div>
              </div>
              <div className="bg-white/5 p-3 rounded-xl border border-white/10">
                <span className="text-slate-400">초기 필요 현금</span>
                <div className="text-sm font-bold text-emerald-400 mt-1">
                  {formatKoreanMoney(result.totalInitialCashRequired)}
                </div>
              </div>
            </div>
          </div>

          {/* Term Comparison Table */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-blue-600" />
              <span>할부 기간별 월 납입금 & 총이자 비교</span>
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                  <tr>
                    <th className="py-2.5 px-3">기간</th>
                    <th className="py-2.5 px-3">월 납입금</th>
                    <th className="py-2.5 px-3">총 이자</th>
                    <th className="py-2.5 px-3">총 구매비용</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {result.termComparison.map((t) => (
                    <tr
                      key={t.termMonths}
                      className={t.termMonths === termMonths ? "bg-blue-50/70 font-bold" : "hover:bg-slate-50"}
                    >
                      <td className="py-2.5 px-3">
                        {t.termMonths}개월
                        {t.termMonths === termMonths && " (선택)"}
                      </td>
                      <td className="py-2.5 px-3 text-blue-600 font-bold">
                        월 {formatKoreanMoney(t.monthlyPayment)}
                      </td>
                      <td className="py-2.5 px-3 text-slate-700">
                        {formatKoreanMoney(t.totalInterest)}
                      </td>
                      <td className="py-2.5 px-3 text-slate-900">
                        {formatKoreanMoney(t.totalCost)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Early Repayment Simulator */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-600" />
              <span>중도 조기 상환 이자 절감 시뮬레이션</span>
            </h3>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-emerald-50/60 p-4 rounded-2xl border border-emerald-100">
              <div className="space-y-1">
                <div className="text-xs text-slate-600">
                  <span className="font-bold text-emerald-800">{earlyRepayMonth}개월 차</span>에 전액 중도상환 시
                </div>
                <div className="text-lg font-black text-emerald-700">
                  예상 이자 절감액: {formatKoreanMoney(earlySavings)}
                </div>
              </div>

              <div className="flex items-center gap-2 text-xs">
                <span className="text-slate-500 font-medium">상환 시점:</span>
                <select
                  value={earlyRepayMonth}
                  onChange={(e) => setEarlyRepayMonth(Number(e.target.value))}
                  className="bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 font-bold"
                >
                  {[12, 24, 36, 48].filter((m) => m < termMonths).map((m) => (
                    <option key={m} value={m}>
                      {m}개월 차
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Toggle Schedule Table */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
                <FileSpreadsheet className="w-4 h-4 text-blue-600" />
                <span>회차별 원금·이자 분할 상환표 ({result.schedule.length}회차)</span>
              </h3>
              <button
                onClick={() => setShowSchedule(!showSchedule)}
                className="text-xs font-bold text-blue-600 hover:text-blue-800"
              >
                {showSchedule ? "상환표 닫기" : "전체 상환표 보기"}
              </button>
            </div>

            {showSchedule && (
              <div className="max-h-80 overflow-y-auto border border-slate-100 rounded-2xl">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-50 text-slate-600 font-bold sticky top-0 border-b border-slate-200">
                    <tr>
                      <th className="py-2 px-3">회차</th>
                      <th className="py-2 px-3">납입금</th>
                      <th className="py-2 px-3">원금</th>
                      <th className="py-2 px-3">이자</th>
                      <th className="py-2 px-3">잔여 원금</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {result.schedule.map((s) => (
                      <tr key={s.month} className="hover:bg-slate-50">
                        <td className="py-2 px-3 font-semibold">{s.month}회차</td>
                        <td className="py-2 px-3 font-bold text-slate-900">
                          {s.payment.toLocaleString()}원
                        </td>
                        <td className="py-2 px-3 text-slate-700">
                          {s.principal.toLocaleString()}원
                        </td>
                        <td className="py-2 px-3 text-amber-700">
                          {s.interest.toLocaleString()}원
                        </td>
                        <td className="py-2 px-3 text-slate-400">
                          {s.remainingPrincipal.toLocaleString()}원
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
