"use client";

import { useState, useMemo } from "react";
import {
  calculateComprehensiveCarTax,
  VehicleClassification,
  VehicleFuelType,
  RegionType,
} from "@/lib/tax-calculator";
import { formatKoreanMoney } from "@/lib/finance";
import AdBanner from "@/components/ads/ad-banner";
import {
  Calculator,
  Coins,
  ShieldCheck,
  Zap,
  Info,
  Calendar,
  Layers,
  Share2,
  CheckCircle2,
  Sparkles,
  TrendingDown,
  ChevronRight,
  Car,
} from "lucide-react";
import Link from "next/link";

export default function CarTaxCalculatorPage() {
  const [vehiclePrice, setVehiclePrice] = useState<number>(38000000); // 3,800만원 (예: 쏘렌토/그랜저 기본형)
  const [vehicleType, setVehicleType] = useState<VehicleClassification>("PASSENGER_NORMAL");
  const [fuelType, setFuelType] = useState<VehicleFuelType>("GASOLINE");
  const [displacementCc, setDisplacementCc] = useState<number>(2497); // 2,500cc
  const [registrationYear, setRegistrationYear] = useState<number>(2026);
  const [isMultiChild, setIsMultiChild] = useState<boolean>(false);
  const [region, setRegion] = useState<RegionType>("SEOUL");
  const [copied, setCopied] = useState<boolean>(false);

  // Quick Presets
  const applyPreset = (preset: {
    name: string;
    price: number;
    vType: VehicleClassification;
    fType: VehicleFuelType;
    cc: number;
  }) => {
    setVehiclePrice(preset.price);
    setVehicleType(preset.vType);
    setFuelType(preset.fType);
    setDisplacementCc(preset.cc);
  };

  const presets = [
    { name: "현대 아반떼 1.6 가솔린", price: 21000000, vType: "PASSENGER_NORMAL" as const, fType: "GASOLINE" as const, cc: 1598 },
    { name: "기아 쏘렌토 1.6 하이브리드", price: 42000000, vType: "PASSENGER_NORMAL" as const, fType: "HYBRID" as const, cc: 1598 },
    { name: "현대 그랜저 2.5 가솔린", price: 39500000, vType: "PASSENGER_NORMAL" as const, fType: "GASOLINE" as const, cc: 2497 },
    { name: "기아 카니발 9인승 디젤", price: 43000000, vType: "PASSENGER_7_TO_10" as const, fType: "DIESEL" as const, cc: 2151 },
    { name: "기아 레이 1.0 (경차)", price: 15000000, vType: "PASSENGER_COMPACT" as const, fType: "GASOLINE" as const, cc: 998 },
    { name: "테슬라 모델Y (전기차)", price: 54000000, vType: "PASSENGER_NORMAL" as const, fType: "EV" as const, cc: 0 },
  ];

  const result = useMemo(() => {
    return calculateComprehensiveCarTax({
      vehiclePrice,
      vehicleType,
      fuelType,
      displacementCc: fuelType === "EV" || fuelType === "HYDROGEN" ? 0 : displacementCc,
      registrationYear,
      isMultiChild,
      region,
    });
  }, [vehiclePrice, vehicleType, fuelType, displacementCc, registrationYear, isMultiChild, region]);

  const handleShare = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Banner */}
      <AdBanner slot="page-top-slot" compact />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-bold mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            2026 대한민국 최신 세법 개정안 반영
          </div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">
            자동차 취등록세 & 연간 자동차세 계산기
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            차량 가격, 배기량, 친환경차(하이브리드·전기차), 다자녀 감면 혜택 및 연납 할인까지 실시간으로 계산합니다.
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

      {/* Quick Model Presets */}
      <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4">
        <div className="text-xs font-bold text-slate-600 mb-2.5 flex items-center gap-1.5">
          <Car className="w-3.5 h-3.5 text-indigo-600" />
          인기 대표 차종 원클릭 자동 입력:
        </div>
        <div className="flex flex-wrap gap-2">
          {presets.map((preset) => (
            <button
              key={preset.name}
              onClick={() => applyPreset(preset)}
              className="px-3 py-1.5 bg-white border border-slate-200 hover:border-indigo-400 hover:text-indigo-600 text-xs font-semibold text-slate-700 rounded-lg shadow-2xs transition-colors"
            >
              {preset.name}
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid: Inputs vs Results */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Inputs (5 cols) */}
        <div className="lg:col-span-5 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-6">
          <h2 className="text-lg font-black text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
            <Calculator className="w-5 h-5 text-indigo-600" />
            차량 정보 입력
          </h2>

          {/* 1. Vehicle Price */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-sm font-bold text-slate-700">
              <label htmlFor="vehiclePrice">차량 구입 가격</label>
              <span className="text-indigo-600 font-black">{formatKoreanMoney(vehiclePrice)}</span>
            </div>
            <input
              id="vehiclePrice"
              type="range"
              min={5000000}
              max={200000000}
              step={1000000}
              value={vehiclePrice}
              onChange={(e) => setVehiclePrice(Number(e.target.value))}
              className="w-full accent-indigo-600 cursor-pointer"
            />
            <div className="flex gap-1.5 pt-1">
              {[20000000, 35000000, 50000000, 70000000, 100000000].map((amt) => (
                <button
                  key={amt}
                  type="button"
                  onClick={() => setVehiclePrice(amt)}
                  className={`flex-1 py-1 text-[11px] font-semibold rounded border transition-colors ${
                    vehiclePrice === amt
                      ? "bg-indigo-50 border-indigo-400 text-indigo-700 font-bold"
                      : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  {amt / 10000000 >= 1 ? `${amt / 10000000}억` : `${amt / 10000}만`}
                </button>
              ))}
            </div>
          </div>

          {/* 2. Vehicle Classification */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700">차종 구분 (취득세율)</label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: "PASSENGER_NORMAL", label: "일반 승용 (7%)" },
                { id: "PASSENGER_COMPACT", label: "경차 (4% 감면)" },
                { id: "PASSENGER_7_TO_10", label: "7~10인승 승용 (7%)" },
                { id: "VAN_11_PLUS", label: "11인승 이상 승합 (5%)" },
              ].map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    setVehicleType(item.id as VehicleClassification);
                    if (item.id === "PASSENGER_COMPACT") setDisplacementCc(998);
                  }}
                  className={`py-2 px-3 text-xs font-bold rounded-xl border transition-all text-left ${
                    vehicleType === item.id
                      ? "bg-indigo-600 text-white border-indigo-600 shadow-sm"
                      : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* 3. Fuel Type (Eco Relief) */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700">연료 종류 (친환경차 감면)</label>
            <div className="grid grid-cols-3 gap-1.5">
              {[
                { id: "GASOLINE", label: "가솔린" },
                { id: "DIESEL", label: "디젤" },
                { id: "HYBRID", label: "하이브리드 (40만 감면)" },
                { id: "EV", label: "전기차 (140만 감면)" },
                { id: "HYDROGEN", label: "수소차 (140만 감면)" },
                { id: "LPG", label: "LPG" },
              ].map((fuel) => (
                <button
                  key={fuel.id}
                  type="button"
                  onClick={() => setFuelType(fuel.id as VehicleFuelType)}
                  className={`py-2 px-2 text-[11px] font-bold rounded-xl border text-center transition-all ${
                    fuelType === fuel.id
                      ? "bg-indigo-600 text-white border-indigo-600 shadow-sm"
                      : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
                  }`}
                >
                  {fuel.label}
                </button>
              ))}
            </div>
          </div>

          {/* 4. Engine Displacement (cc) */}
          {fuelType !== "EV" && fuelType !== "HYDROGEN" && (
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs font-bold text-slate-700">
                <label htmlFor="displacement">엔진 배기량 (cc)</label>
                <span className="text-indigo-600 font-bold">{displacementCc.toLocaleString()} cc</span>
              </div>
              <input
                id="displacement"
                type="number"
                min={500}
                max={6000}
                step={50}
                value={displacementCc}
                onChange={(e) => setDisplacementCc(Number(e.target.value))}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <div className="flex gap-1.5">
                {[998, 1598, 1998, 2497, 3470].map((cc) => (
                  <button
                    key={cc}
                    type="button"
                    onClick={() => setDisplacementCc(cc)}
                    className="flex-1 py-1 text-[11px] font-medium bg-slate-50 border border-slate-200 hover:bg-slate-100 rounded text-slate-600"
                  >
                    {cc}cc
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* 5. Additional Reductions */}
          <div className="space-y-3 pt-2 border-t border-slate-100">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <div className="text-xs font-bold text-slate-800">다자녀 가구 감면</div>
                <div className="text-[11px] text-slate-500">18세 미만 자녀 2~3인 이상 (최대 140만원)</div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={isMultiChild}
                  onChange={(e) => setIsMultiChild(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <div className="text-xs font-bold text-slate-800">등록 지역 (공채 매입 기준)</div>
                <div className="text-[11px] text-slate-500">지역별 채권할인 실부담액 차등</div>
              </div>
              <select
                value={region}
                onChange={(e) => setRegion(e.target.value as RegionType)}
                className="px-2.5 py-1.5 border border-slate-200 rounded-lg text-xs font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="SEOUL">서울특별시</option>
                <option value="GYEONGGI">경기도</option>
                <option value="OTHER">기타 광역시·도</option>
              </select>
            </div>
          </div>
        </div>

        {/* Right Output Results (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Card 1: Initial Acquisition Cost Summary */}
          <div className="bg-gradient-to-br from-indigo-900 to-slate-900 rounded-3xl p-6 md:p-8 text-white shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <div className="text-indigo-200 text-xs font-bold tracking-wider uppercase">
                차량 등록 시 일시 납부 총비용
              </div>
              <span className="px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-200 text-xs font-bold">
                취등록세 + 공채 + 부대비용
              </span>
            </div>

            <div className="text-4xl md:text-5xl font-black text-white tracking-tight mb-2">
              {formatKoreanMoney(result.acquisition.totalRegistrationCost)}
            </div>
            <p className="text-xs text-indigo-200/80">
              차량 가격 {formatKoreanMoney(vehiclePrice)} 기준 (차량가 대비 약{" "}
              {((result.acquisition.totalRegistrationCost / vehiclePrice) * 100).toFixed(1)}%)
            </p>

            {/* Breakdown Pills */}
            <div className="grid grid-cols-3 gap-3 mt-6 pt-6 border-t border-white/10 text-center">
              <div className="bg-white/5 rounded-2xl p-3">
                <div className="text-[11px] text-indigo-200">순수 취등록세</div>
                <div className="text-base font-bold text-white mt-0.5">
                  {formatKoreanMoney(result.acquisition.finalAcquisitionTax)}
                </div>
              </div>
              <div className="bg-white/5 rounded-2xl p-3">
                <div className="text-[11px] text-indigo-200">공채할인 실부담</div>
                <div className="text-base font-bold text-white mt-0.5">
                  {formatKoreanMoney(result.acquisition.bondEstimate)}
                </div>
              </div>
              <div className="bg-white/5 rounded-2xl p-3">
                <div className="text-[11px] text-indigo-200">증지·번호판 등</div>
                <div className="text-base font-bold text-white mt-0.5">
                  {formatKoreanMoney(result.acquisition.incidentalFees)}
                </div>
              </div>
            </div>

            {/* Relief Highlights */}
            {(result.acquisition.compactRelief > 0 ||
              result.acquisition.ecoRelief > 0 ||
              result.acquisition.multiChildRelief > 0) && (
              <div className="mt-4 p-3 bg-emerald-500/10 border border-emerald-400/20 rounded-xl flex items-center gap-2 text-emerald-300 text-xs">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>
                  감면 혜택 적용됨:{" "}
                  {[
                    result.acquisition.compactRelief > 0 && `경차 감면 (${formatKoreanMoney(result.acquisition.compactRelief)})`,
                    result.acquisition.ecoRelief > 0 && `친환경차 감면 (${formatKoreanMoney(result.acquisition.ecoRelief)})`,
                    result.acquisition.multiChildRelief > 0 && `다자녀 감면 (${formatKoreanMoney(result.acquisition.multiChildRelief)})`,
                  ]
                    .filter(Boolean)
                    .join(", ")}
                </span>
              </div>
            )}
          </div>

          {/* Card 2: Annual Car Tax (자동차세 & 연납할인) */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-600">
                  <Coins className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">연간 자동차세 (보유세)</h3>
                  <p className="text-xs text-slate-500">배기량 기준 자동차세 본세 + 지방교육세 30% 합산</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-black text-slate-900">
                  {formatKoreanMoney(result.annualTax.totalAnnualTax)}
                </div>
                <div className="text-[11px] text-slate-500">연간 총 납부액</div>
              </div>
            </div>

            {/* Prepayment Discount Box */}
            <div className="bg-amber-50/70 border border-amber-200 rounded-2xl p-4 flex items-center justify-between">
              <div className="space-y-0.5">
                <div className="text-xs font-bold text-amber-900 flex items-center gap-1.5">
                  <TrendingDown className="w-4 h-4 text-amber-600" />
                  1월 연세액 일시납부 (연납 할인) 시
                </div>
                <div className="text-[11px] text-amber-700">
                  연납 시 약 {formatKoreanMoney(result.annualTax.prepaymentSavings)}원 절약
                </div>
              </div>
              <div className="text-right">
                <span className="text-lg font-black text-amber-900">
                  {formatKoreanMoney(result.annualTax.prepaymentAnnualTax)}
                </span>
              </div>
            </div>

            {/* Installments Table */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/60">
                <div className="flex items-center justify-between text-xs font-bold text-slate-700 mb-1">
                  <span>1기분 (6월 납부)</span>
                  <span className="text-slate-900">{formatKoreanMoney(result.annualTax.halfYearInstallment1)}</span>
                </div>
                <div className="text-[11px] text-slate-500">상반기 (1월~6월분)</div>
              </div>
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/60">
                <div className="flex items-center justify-between text-xs font-bold text-slate-700 mb-1">
                  <span>2기분 (12월 납부)</span>
                  <span className="text-slate-900">{formatKoreanMoney(result.annualTax.halfYearInstallment2)}</span>
                </div>
                <div className="text-[11px] text-slate-500">하반기 (7월~12월분)</div>
              </div>
            </div>
          </div>

          {/* Card 3: 3-Year & 5-Year Cumulative Cost Projection */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
            <h3 className="text-sm font-bold text-slate-800 mb-3 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-indigo-600" />
              보유 기간별 누적 세금 총액 (취등록세 + 연간 자동차세)
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-indigo-50/50 border border-indigo-100">
                <div className="text-xs font-bold text-slate-600">3년 보유 시 세금 총합</div>
                <div className="text-xl font-black text-indigo-700 mt-1">
                  {formatKoreanMoney(result.threeYearTotalCost)}
                </div>
                <div className="text-[10px] text-slate-500 mt-0.5">취등록비용 + 3개년 자동차세</div>
              </div>
              <div className="p-4 rounded-2xl bg-indigo-50/50 border border-indigo-100">
                <div className="text-xs font-bold text-slate-600">5년 보유 시 세금 총합</div>
                <div className="text-xl font-black text-indigo-700 mt-1">
                  {formatKoreanMoney(result.fiveYearTotalCost)}
                </div>
                <div className="text-[10px] text-slate-500 mt-0.5">취등록비용 + 5개년 자동차세 (연식할인 반영)</div>
              </div>
            </div>
          </div>

          {/* In-feed Ad Banner */}
          <AdBanner slot="middle-infeed-slot" />

          {/* Quick Links to other calculators */}
          <div className="flex gap-4">
            <Link
              href="/calculator/installment"
              className="flex-1 p-4 bg-white border border-slate-200 hover:border-indigo-400 rounded-2xl text-left shadow-2xs group transition-all"
            >
              <div className="text-xs font-bold text-slate-800 group-hover:text-indigo-600 flex items-center justify-between">
                <span>자동차 할부 계산기</span>
                <ChevronRight className="w-4 h-4" />
              </div>
              <div className="text-[11px] text-slate-500 mt-0.5">선납금 및 금리별 월 납입금 견적 시뮬레이션</div>
            </Link>
            <Link
              href="/calculator/budget"
              className="flex-1 p-4 bg-white border border-slate-200 hover:border-indigo-400 rounded-2xl text-left shadow-2xs group transition-all"
            >
              <div className="text-xs font-bold text-slate-800 group-hover:text-indigo-600 flex items-center justify-between">
                <span>예산 맞춤 차량 추천</span>
                <ChevronRight className="w-4 h-4" />
              </div>
              <div className="text-[11px] text-slate-500 mt-0.5">내 월 소득과 예산으로 구매 가능한 최적 차종</div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
