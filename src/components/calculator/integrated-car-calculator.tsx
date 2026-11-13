"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  calculateComprehensiveCarTax,
  VehicleClassification,
  VehicleFuelType,
  RegionType,
} from "@/lib/tax-calculator";
import { calculateInstallment, formatKoreanMoney } from "@/lib/finance";
import AdBanner from "@/components/ads/ad-banner";
import {
  Calculator,
  Coins,
  ShieldCheck,
  Zap,
  Calendar,
  Layers,
  Share2,
  CheckCircle2,
  Sparkles,
  TrendingDown,
  ArrowRight,
  Car,
  CreditCard,
  Percent,
} from "lucide-react";

export function IntegratedCarCalculator() {
  const [vehiclePrice, setVehiclePrice] = useState<number>(38000000); // 3,800만원
  const [vehicleType, setVehicleType] = useState<VehicleClassification>("PASSENGER_NORMAL");
  const [fuelType, setFuelType] = useState<VehicleFuelType>("GASOLINE");
  const [displacementCc, setDisplacementCc] = useState<number>(2497);
  const [downPaymentRatio, setDownPaymentRatio] = useState<number>(20); // 20% 선수금
  const [termMonths, setTermMonths] = useState<number>(48); // 48개월
  const [annualRatePct, setAnnualRatePct] = useState<number>(5.5); // 연 5.5%
  const [copied, setCopied] = useState<boolean>(false);

  // Quick Presets
  const presets = [
    { name: "아반떼 1.6 가솔린", price: 21500000, vType: "PASSENGER_NORMAL" as const, fType: "GASOLINE" as const, cc: 1598 },
    { name: "쏘렌토 1.6 하이브리드", price: 42000000, vType: "PASSENGER_NORMAL" as const, fType: "HYBRID" as const, cc: 1598 },
    { name: "그랜저 2.5 가솔린", price: 39500000, vType: "PASSENGER_NORMAL" as const, fType: "GASOLINE" as const, cc: 2497 },
    { name: "레이 1.0 (경차)", price: 15500000, vType: "PASSENGER_COMPACT" as const, fType: "GASOLINE" as const, cc: 998 },
    { name: "테슬라 모델Y (전기차)", price: 54000000, vType: "PASSENGER_NORMAL" as const, fType: "EV" as const, cc: 0 },
    { name: "카니발 9인승 디젤", price: 43500000, vType: "PASSENGER_7_TO_10" as const, fType: "DIESEL" as const, cc: 2151 },
  ];

  const applyPreset = (p: (typeof presets)[0]) => {
    setVehiclePrice(p.price);
    setVehicleType(p.vType);
    setFuelType(p.fType);
    setDisplacementCc(p.cc);
  };

  const downPayment = useMemo(() => {
    return Math.round((vehiclePrice * downPaymentRatio) / 100);
  }, [vehiclePrice, downPaymentRatio]);

  // Tax Calculation Result
  const taxResult = useMemo(() => {
    return calculateComprehensiveCarTax({
      vehiclePrice,
      vehicleType,
      fuelType,
      displacementCc: fuelType === "EV" || fuelType === "HYDROGEN" ? 0 : displacementCc,
      registrationYear: 2026,
      isMultiChild: false,
      region: "SEOUL",
    });
  }, [vehiclePrice, vehicleType, fuelType, displacementCc]);

  // Installment Calculation Result
  const loanResult = useMemo(() => {
    return calculateInstallment({
      vehiclePrice,
      downPayment,
      termMonths,
      annualRatePct,
      productType: "STANDARD",
      balloonAmount: 0,
      includeTaxInLoan: false,
    });
  }, [vehiclePrice, downPayment, termMonths, annualRatePct]);

  // Monthly car tax amortized
  const monthlyCarTax = Math.round(taxResult.annualTax.totalAnnualTax / 12);
  const totalMonthlyCost = loanResult.monthlyPayment + monthlyCarTax;

  // Initial out-of-pocket cash needed
  const initialCashNeeded = downPayment + taxResult.acquisition.totalRegistrationCost;

  const handleShare = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header & Sub-navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold mb-2">
            <Sparkles className="w-3.5 h-3.5" /> 2026 최신 세법 및 금융 금리 반영
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            신차·중고차 통합 자동차 계산기
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            취등록세, 공채할인, 연간 자동차세, 월 할부금 및 초기 현금 부담을 한 번에 계산합니다.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleShare}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors shadow-xs"
          >
            <Share2 className="w-3.5 h-3.5 text-slate-500" />
            {copied ? "링크 복사됨!" : "계산 결과 공유"}
          </button>
        </div>
      </div>

      {/* Calculator Mode Switcher Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        <span className="text-xs font-bold text-slate-400 shrink-0">전문 계산기:</span>
        <Link
          href="/calculator"
          className="px-3.5 py-1.5 rounded-xl bg-blue-600 text-white text-xs font-bold shadow-xs whitespace-nowrap"
        >
          통합 올인원 계산기
        </Link>
        <Link
          href="/calculator/tax"
          className="px-3.5 py-1.5 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-semibold whitespace-nowrap"
        >
          취등록세·자동차세 전문
        </Link>
        <Link
          href="/calculator/installment"
          className="px-3.5 py-1.5 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-semibold whitespace-nowrap"
        >
          할부·상환 스케줄러
        </Link>
        <Link
          href="/calculator/budget"
          className="px-3.5 py-1.5 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-semibold whitespace-nowrap"
        >
          예산 기반 추천
        </Link>
      </div>

      {/* Main Grid: Inputs vs Realtime Results */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Input Controller */}
        <div className="lg:col-span-7 space-y-6">
          {/* Quick Presets */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
            <div className="text-xs font-bold text-slate-500 mb-2.5 flex items-center gap-1.5">
              <Car className="w-3.5 h-3.5 text-blue-600" /> 인기 대표 차종 원클릭 입력
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {presets.map((p) => (
                <button
                  key={p.name}
                  type="button"
                  onClick={() => applyPreset(p)}
                  className="p-2.5 rounded-xl border border-slate-100 bg-slate-50/70 hover:bg-blue-50 hover:border-blue-200 transition-colors text-left"
                >
                  <div className="text-xs font-bold text-slate-800 truncate">{p.name}</div>
                  <div className="text-[11px] text-blue-600 font-semibold mt-0.5">
                    {formatKoreanMoney(p.price)}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Vehicle Price & Specs Form */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-5">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Coins className="w-4 h-4 text-blue-600" /> 1. 차량 가격 및 기본 정보
            </h2>

            {/* Vehicle Price Slider */}
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-xs font-semibold text-slate-600">차량 구입가 (출고가)</label>
                <span className="text-base font-black text-blue-600">
                  {formatKoreanMoney(vehiclePrice)}
                </span>
              </div>
              <input
                type="range"
                min={5000000}
                max={150000000}
                step={500000}
                value={vehiclePrice}
                onChange={(e) => setVehiclePrice(Number(e.target.value))}
                className="w-full accent-blue-600 h-2 bg-slate-100 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[11px] text-slate-400 mt-1">
                <span>500만원</span>
                <span>5,000만원</span>
                <span>1억원</span>
                <span>1억 5,000만원</span>
              </div>
            </div>

            {/* Classification & Fuel Type */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">차량 구분</label>
                <select
                  value={vehicleType}
                  onChange={(e) => setVehicleType(e.target.value as VehicleClassification)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="PASSENGER_NORMAL">일반 승용차 (7%)</option>
                  <option value="PASSENGER_COMPACT">경형 자동차 (4%, 75만 감면)</option>
                  <option value="PASSENGER_7_TO_10">7~10인승 승용 (7%)</option>
                  <option value="VAN_11_PLUS">11인승 이상 승합차 (5%)</option>
                  <option value="TRUCK">화물차 (5%)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">연료 및 엔진</label>
                <select
                  value={fuelType}
                  onChange={(e) => setFuelType(e.target.value as VehicleFuelType)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="GASOLINE">가솔린 (휘발유)</option>
                  <option value="HYBRID">하이브리드 (HEV/PHEV)</option>
                  <option value="EV">순수 전기차 (EV)</option>
                  <option value="DIESEL">디젤 (경유)</option>
                  <option value="LPG">LPG</option>
                  <option value="HYDROGEN">수소전기차</option>
                </select>
              </div>
            </div>

            {/* Displacement CC */}
            {fuelType !== "EV" && fuelType !== "HYDROGEN" && (
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="text-xs font-semibold text-slate-600">엔진 배기량</label>
                  <span className="text-xs font-bold text-slate-800">{displacementCc.toLocaleString()} cc</span>
                </div>
                <input
                  type="number"
                  min={800}
                  max={6000}
                  step={50}
                  value={displacementCc}
                  onChange={(e) => setDisplacementCc(Number(e.target.value))}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs font-bold text-slate-800"
                />
              </div>
            )}
          </div>

          {/* Financing / Installment Settings */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-5">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-emerald-600" /> 2. 할부 및 금융 조건
            </h2>

            {/* Down Payment Ratio */}
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-xs font-semibold text-slate-600">선수금 비율</label>
                <span className="text-xs font-bold text-emerald-600">
                  {downPaymentRatio}% ({formatKoreanMoney(downPayment)})
                </span>
              </div>
              <div className="grid grid-cols-4 gap-2 mb-2">
                {[0, 10, 20, 30].map((pct) => (
                  <button
                    key={pct}
                    type="button"
                    onClick={() => setDownPaymentRatio(pct)}
                    className={`py-1.5 rounded-lg text-xs font-bold border transition-colors ${
                      downPaymentRatio === pct
                        ? "bg-emerald-600 text-white border-emerald-600"
                        : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                    }`}
                  >
                    {pct}%
                  </button>
                ))}
              </div>
            </div>

            {/* Term Months */}
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">할부 기간</label>
              <div className="grid grid-cols-4 gap-2">
                {[24, 36, 48, 60].map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setTermMonths(m)}
                    className={`py-1.5 rounded-lg text-xs font-bold border transition-colors ${
                      termMonths === m
                        ? "bg-blue-600 text-white border-blue-600"
                        : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                    }`}
                  >
                    {m}개월
                  </button>
                ))}
              </div>
            </div>

            {/* Interest Rate */}
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-xs font-semibold text-slate-600">할부 금리 (연이율)</label>
                <span className="text-xs font-bold text-slate-800">{annualRatePct}%</span>
              </div>
              <input
                type="range"
                min={2.0}
                max={12.0}
                step={0.1}
                value={annualRatePct}
                onChange={(e) => setAnnualRatePct(Number(e.target.value))}
                className="w-full accent-blue-600 h-2 bg-slate-100 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[11px] text-slate-400 mt-1">
                <span>2.0% (무이자/특판)</span>
                <span>5.5% (신차 평균)</span>
                <span>12.0% (중고차/캐피탈)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Integrated Summary Dashboard */}
        <div className="lg:col-span-5 space-y-6">
          {/* Main Total Highlight Card */}
          <div className="rounded-3xl border border-blue-200/80 bg-gradient-to-br from-blue-600 to-indigo-700 p-6 text-white shadow-lg space-y-6">
            <div className="flex items-center justify-between border-b border-white/15 pb-4">
              <div>
                <span className="text-xs font-semibold text-blue-200">매월 예상 총 지출액</span>
                <div className="text-3xl font-black tracking-tight mt-0.5">
                  {formatKoreanMoney(totalMonthlyCost)}
                  <span className="text-sm font-semibold text-blue-200"> /월</span>
                </div>
              </div>
              <div className="text-right">
                <span className="text-xs font-semibold text-blue-200">할부 {termMonths}개월 기준</span>
                <div className="text-xs text-blue-100 mt-1">
                  (할부 {formatKoreanMoney(loanResult.monthlyPayment)} + 세금 {formatKoreanMoney(monthlyCarTax)})
                </div>
              </div>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-2 gap-3 text-slate-900">
              <div className="bg-white/95 rounded-2xl p-4 shadow-xs">
                <span className="text-[11px] font-bold text-slate-500 block mb-0.5">
                  출고 시 초기 소요 자금
                </span>
                <span className="text-lg font-black text-slate-900">
                  {formatKoreanMoney(initialCashNeeded)}
                </span>
                <span className="text-[10px] text-slate-500 block mt-1">
                  선수금 + 취등록세 일체
                </span>
              </div>

              <div className="bg-white/95 rounded-2xl p-4 shadow-xs">
                <span className="text-[11px] font-bold text-slate-500 block mb-0.5">
                  연간 총 자동차세
                </span>
                <span className="text-lg font-black text-slate-900">
                  {formatKoreanMoney(taxResult.annualTax.totalAnnualTax)}
                </span>
                <span className="text-[10px] text-emerald-600 font-bold block mt-1">
                  1월 연납 시 {formatKoreanMoney(taxResult.annualTax.prepaymentSavings)} 절약
                </span>
              </div>
            </div>

            {/* Total Loan Interest */}
            <div className="text-xs text-blue-100 flex justify-between items-center bg-black/15 px-4 py-2.5 rounded-xl">
              <span>총 대출 이자 합계 ({termMonths}개월)</span>
              <strong className="text-white font-bold">
                {formatKoreanMoney(loanResult.totalInterest)}
              </strong>
            </div>
          </div>

          {/* Breakdown 1: Acquisition Tax Detail */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3">
            <h3 className="text-sm font-bold text-slate-900 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-blue-600" /> 취등록세 및 부대비용 상세
              </span>
              <span className="text-blue-600 font-black">
                {formatKoreanMoney(taxResult.acquisition.totalRegistrationCost)}
              </span>
            </h3>

            <div className="space-y-1.5 text-xs text-slate-600 pt-1 border-t border-slate-100">
              <div className="flex justify-between">
                <span>기본 취득세 ({taxResult.acquisition.baseTaxRatePct}%)</span>
                <span>{formatKoreanMoney(taxResult.acquisition.rawTaxAmount)}</span>
              </div>
              {taxResult.acquisition.compactRelief > 0 && (
                <div className="flex justify-between text-emerald-600 font-semibold">
                  <span>경차 취득세 감면</span>
                  <span>-{formatKoreanMoney(taxResult.acquisition.compactRelief)}</span>
                </div>
              )}
              {taxResult.acquisition.ecoRelief > 0 && (
                <div className="flex justify-between text-emerald-600 font-semibold">
                  <span>친환경차(HEV/EV) 감면</span>
                  <span>-{formatKoreanMoney(taxResult.acquisition.ecoRelief)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>지자체 공채 할인 실부담금</span>
                <span>{formatKoreanMoney(taxResult.acquisition.bondEstimate)}</span>
              </div>
              <div className="flex justify-between">
                <span>번호판대 / 인지 / 증지대</span>
                <span>{formatKoreanMoney(taxResult.acquisition.incidentalFees)}</span>
              </div>
            </div>
          </div>

          {/* Breakdown 2: Annual Car Tax & Prepayment */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3">
            <h3 className="text-sm font-bold text-slate-900 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-emerald-600" /> 자동차세 납부 일정 & 연납 혜택
              </span>
              <span className="text-emerald-700 font-black">
                연 {formatKoreanMoney(taxResult.annualTax.totalAnnualTax)}
              </span>
            </h3>

            <div className="space-y-1.5 text-xs text-slate-600 pt-1 border-t border-slate-100">
              <div className="flex justify-between">
                <span>1기분 (6월 정기 납부)</span>
                <span>{formatKoreanMoney(taxResult.annualTax.halfYearInstallment1)}</span>
              </div>
              <div className="flex justify-between">
                <span>2기분 (12월 정기 납부)</span>
                <span>{formatKoreanMoney(taxResult.annualTax.halfYearInstallment2)}</span>
              </div>
              <div className="flex justify-between text-emerald-700 font-bold bg-emerald-50/70 p-2 rounded-lg mt-2">
                <span>1월 연납 신청 시 납부액</span>
                <span>{formatKoreanMoney(taxResult.annualTax.prepaymentAnnualTax)}</span>
              </div>
            </div>
          </div>

          {/* Ad Slot */}
          <div>
            <AdBanner slot="car-calc-sidebar" format="horizontal" />
          </div>
        </div>
      </div>
    </div>
  );
}
