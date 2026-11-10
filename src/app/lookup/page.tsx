"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Search,
  Car,
  ShieldCheck,
  Fuel,
  Ruler,
  Calendar,
  AlertCircle,
  FileText,
  Calculator,
  ArrowRight,
  TrendingDown,
  Info,
  CheckCircle2,
} from "lucide-react";
import type { TsCarComprehensiveInfo } from "@/lib/providers/ts-car-api-client";
import AdBanner from "@/components/ads/ad-banner";

export default function CarLookupPage() {
  const [plateInput, setPlateInput] = useState("");
  const [isDealerStock, setIsDealerStock] = useState(false);
  const [consentAgreed, setConsentAgreed] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<TsCarComprehensiveInfo | null>(null);

  const handleLookup = async (plateToQuery?: string) => {
    const target = (plateToQuery || plateInput).trim();
    if (!target) {
      setError("차량등록번호(예: 12가 3456)를 입력해주세요.");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const params = new URLSearchParams({
        vhrNo: target,
        isDealerStock: String(isDealerStock),
        consent: String(consentAgreed),
      });

      const res = await fetch(`/api/cars/lookup?${params.toString()}`);
      const json = await res.json();

      if (!res.ok || !json.success) {
        throw new Error(json.error || "차량정보를 불러올 수 없습니다.");
      }

      setResult(json.data);
      setPlateInput(json.data.vhrNo);
    } catch (err: any) {
      setError(err.message || "차량정보 조회 중 오류가 발생했습니다.");
      setResult(null);
    } finally {
      setLoading(false);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleLookup();
  };

  const handleSampleClick = (samplePlate: string, dealer: boolean) => {
    setPlateInput(samplePlate);
    setIsDealerStock(dealer);
    handleLookup(samplePlate);
  };

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Top Breadcrumb & Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100/80 text-blue-700 text-xs font-bold border border-blue-200">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>국토교통부 · 한국교통안전공단 자동차종합정보 공식 연계</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            차량번호 실시간 종합정보 조회
          </h1>
          <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto">
            차량번호 입력 한 번으로 <strong>자동차기본정보, 제원정보1(엔진/성능), 제원정보2(차체/연비)</strong> 3종 첨부형 공공데이터를 실시간 확인하세요.
          </p>
        </div>

        {/* Top AdSense Banner */}
        <div className="flex justify-center">
          <AdBanner slot="car_lookup_top_banner" format="horizontal" />
        </div>

        {/* Search License Plate Card */}
        <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/60 border border-slate-200/80 p-6 sm:p-8">
          <form onSubmit={handleFormSubmit} className="space-y-6">
            <div className="max-w-xl mx-auto space-y-4">
              <label htmlFor="plate-input" className="block text-center font-bold text-slate-800 text-sm">
                조회할 차량번호를 입력해주세요
              </label>

              {/* Realistic Korean Car Plate Input Styling */}
              <div className="relative flex items-center justify-center p-3 bg-gradient-to-b from-slate-100 to-slate-200 rounded-2xl border-2 border-slate-300 shadow-inner">
                <div className="w-full flex items-center bg-white border-2 border-slate-800 rounded-xl px-4 py-3 shadow-md focus-within:ring-4 focus-within:ring-blue-500/20 focus-within:border-blue-600 transition-all">
                  <div className="flex items-center gap-1.5 pr-3 border-r border-slate-200 text-slate-400">
                    <Car className="w-5 h-5 text-blue-600" />
                    <span className="text-[10px] font-extrabold tracking-widest text-slate-600">KOR</span>
                  </div>
                  <input
                    id="plate-input"
                    type="text"
                    value={plateInput}
                    onChange={(e) => setPlateInput(e.target.value)}
                    placeholder="예: 12가 3456 또는 123허 5678"
                    className="w-full text-center text-xl sm:text-2xl font-black tracking-widest text-slate-900 placeholder:text-slate-300 placeholder:font-normal focus:outline-none"
                    maxLength={14}
                  />
                  <button
                    type="submit"
                    disabled={loading}
                    className="ml-3 px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-bold text-sm shadow-md shadow-blue-500/30 flex items-center gap-2 transition-all disabled:opacity-50"
                  >
                    <Search className="w-4 h-4" />
                    <span>{loading ? "조회 중..." : "조회"}</span>
                  </button>
                </div>
              </div>

              {/* Options & Consent */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-600 pt-2 px-1">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={isDealerStock}
                    onChange={(e) => setIsDealerStock(e.target.checked)}
                    className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-slate-300"
                  />
                  <span className="font-semibold text-slate-700">매매상품용 차량 (중고차 단지 등록 차량)</span>
                </label>

                {!isDealerStock && (
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={consentAgreed}
                      onChange={(e) => setConsentAgreed(e.target.checked)}
                      className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-slate-300"
                    />
                    <span>개인소유차량 제3자 정보제공 동의 완료</span>
                  </label>
                )}
              </div>

              {/* Sample Plates for Instant Test */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-center gap-2 flex-wrap text-xs">
                <span className="text-slate-400 font-medium">테스트 예시:</span>
                <button
                  type="button"
                  onClick={() => handleSampleClick("12가 3456", false)}
                  className="px-2.5 py-1 rounded-md bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-700 border border-slate-200 transition-colors"
                >
                  12가 3456 (쏘렌토 하이브리드)
                </button>
                <button
                  type="button"
                  onClick={() => handleSampleClick("123허 5678", true)}
                  className="px-2.5 py-1 rounded-md bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-700 border border-slate-200 transition-colors"
                >
                  123허 5678 (그랜저 가솔린)
                </button>
                <button
                  type="button"
                  onClick={() => handleSampleClick("55오 1234", false)}
                  className="px-2.5 py-1 rounded-md bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-700 border border-slate-200 transition-colors"
                >
                  55오 1234 (아이오닉 5)
                </button>
              </div>

              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}
            </div>
          </form>
        </div>

        {/* Results View */}
        {result && (
          <div className="space-y-6 animate-in fade-in duration-300">
            {/* Header Result Banner */}
            <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-indigo-900 text-white rounded-2xl p-6 sm:p-8 shadow-xl flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs font-semibold text-blue-300">
                  <span className="px-2 py-0.5 rounded bg-blue-500/20 border border-blue-400/30">
                    {result.basicInfo.useType}
                  </span>
                  <span>최초등록일: {result.basicInfo.firstRegDate}</span>
                  <span>·</span>
                  <span>연식: {result.basicInfo.modelYear}년형</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                  {result.basicInfo.modelName}
                </h2>
                <p className="text-xs text-slate-300">
                  차량번호 <strong className="text-yellow-400 font-mono text-sm">{result.vhrNo}</strong> (차대번호: {result.basicInfo.vinMasked})
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                {result.matchingCatalogModel && (
                  <Link
                    href={`/new-cars`}
                    className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <span>신차 카탈로그 비교</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                )}
                <Link
                  href={`/calculator/installment`}
                  className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs border border-white/20 flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Calculator className="w-3.5 h-3.5" />
                  <span>할부 계산기 연계</span>
                </Link>
              </div>
            </div>

            {/* Middle In-Feed Ad Banner */}
            <div className="flex justify-center">
              <AdBanner slot="car_lookup_middle_banner" format="horizontal" />
            </div>

            {/* 3 Categories: 1. 기본정보, 2. 제원정보1, 3. 제원정보2 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Card 1: 자동차 기본정보 */}
              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
                <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
                  <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm">1. 자동차 기본정보</h3>
                    <p className="text-[11px] text-slate-400">등록 및 차량 분류</p>
                  </div>
                </div>

                <dl className="space-y-2.5 text-xs">
                  <div className="flex justify-between py-1 border-b border-slate-50">
                    <dt className="text-slate-500">차량등록번호</dt>
                    <dd className="font-bold text-slate-900 font-mono">{result.basicInfo.vhrNo}</dd>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-50">
                    <dt className="text-slate-500">차종 구분</dt>
                    <dd className="font-semibold text-slate-800">{result.basicInfo.vehicleType}</dd>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-50">
                    <dt className="text-slate-500">용도</dt>
                    <dd className="font-semibold text-slate-800">{result.basicInfo.useType}</dd>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-50">
                    <dt className="text-slate-500">연식 (Model Year)</dt>
                    <dd className="font-semibold text-slate-800">{result.basicInfo.modelYear}년</dd>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-50">
                    <dt className="text-slate-500">최초등록일자</dt>
                    <dd className="font-semibold text-slate-800">{result.basicInfo.firstRegDate}</dd>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-50">
                    <dt className="text-slate-500">검사유효기간</dt>
                    <dd className="font-semibold text-blue-700">{result.basicInfo.inspectionValidPeriod}</dd>
                  </div>
                  <div className="flex justify-between py-1">
                    <dt className="text-slate-500">등록 상태</dt>
                    <dd className="font-bold text-emerald-600 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>{result.basicInfo.registrationStatus}</span>
                    </dd>
                  </div>
                </dl>
              </div>

              {/* Card 2: 제원정보1 (엔진, 동력, 연료) */}
              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
                <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
                  <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                    <Fuel className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm">2. 제원정보 1 (동력·성능)</h3>
                    <p className="text-[11px] text-slate-400">엔진, 배기량, 연료, 정원</p>
                  </div>
                </div>

                <dl className="space-y-2.5 text-xs">
                  <div className="flex justify-between py-1 border-b border-slate-50">
                    <dt className="text-slate-500">엔진 형식</dt>
                    <dd className="font-semibold text-slate-800 text-right">{result.spec1.engineType}</dd>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-50">
                    <dt className="text-slate-500">총배기량</dt>
                    <dd className="font-bold text-slate-900">
                      {result.spec1.displacementCc > 0 ? `${result.spec1.displacementCc.toLocaleString()} cc` : "순수 전기(모터)"}
                    </dd>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-50">
                    <dt className="text-slate-500">연료의 종류</dt>
                    <dd className="font-bold text-blue-600">{result.spec1.fuelTypeKo}</dd>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-50">
                    <dt className="text-slate-500">기통수</dt>
                    <dd className="font-semibold text-slate-800">{result.spec1.cylinders > 0 ? `${result.spec1.cylinders}기통` : "-"}</dd>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-50">
                    <dt className="text-slate-500">승차정원</dt>
                    <dd className="font-semibold text-slate-800">{result.spec1.seatingCapacity} 인승</dd>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-50">
                    <dt className="text-slate-500">최고출력</dt>
                    <dd className="font-semibold text-slate-800">{result.spec1.maxPowerHp ? `${result.spec1.maxPowerHp} ps` : "-"}</dd>
                  </div>
                  <div className="flex justify-between py-1">
                    <dt className="text-slate-500">최대적재량</dt>
                    <dd className="font-semibold text-slate-800">{result.spec1.maxLoadingWeightKg > 0 ? `${result.spec1.maxLoadingWeightKg} kg` : "해당없음"}</dd>
                  </div>
                </dl>
              </div>

              {/* Card 3: 제원정보2 (차체 규격 & 연비) */}
              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
                <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
                  <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                    <Ruler className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm">3. 제원정보 2 (규격·연비)</h3>
                    <p className="text-[11px] text-slate-400">전장, 전폭, 축거, 중량, 연비</p>
                  </div>
                </div>

                <dl className="space-y-2.5 text-xs">
                  <div className="flex justify-between py-1 border-b border-slate-50">
                    <dt className="text-slate-500">전장 (길이)</dt>
                    <dd className="font-semibold text-slate-800">{result.spec2.lengthMm.toLocaleString()} mm</dd>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-50">
                    <dt className="text-slate-500">전폭 (너비)</dt>
                    <dd className="font-semibold text-slate-800">{result.spec2.widthMm.toLocaleString()} mm</dd>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-50">
                    <dt className="text-slate-500">전고 (높이)</dt>
                    <dd className="font-semibold text-slate-800">{result.spec2.heightMm.toLocaleString()} mm</dd>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-50">
                    <dt className="text-slate-500">축간거리 (휠베이스)</dt>
                    <dd className="font-semibold text-slate-800">{result.spec2.wheelbaseMm.toLocaleString()} mm</dd>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-50">
                    <dt className="text-slate-500">차량총중량</dt>
                    <dd className="font-semibold text-slate-800">{result.spec2.grossWeightKg.toLocaleString()} kg</dd>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-50">
                    <dt className="text-slate-500">공차중량</dt>
                    <dd className="font-semibold text-slate-800">{result.spec2.curbWeightKg.toLocaleString()} kg</dd>
                  </div>
                  <div className="flex justify-between py-1">
                    <dt className="text-slate-500">공식 복합연비</dt>
                    <dd className="font-bold text-emerald-600">
                      {result.spec2.fuelEfficiencyKmPerL
                        ? `${result.spec2.fuelEfficiencyKmPerL} ${result.spec1.fuelTypeKo === "전기" ? "km/kWh" : "km/L"}`
                        : "-"}
                    </dd>
                  </div>
                </dl>
              </div>
            </div>

            {/* Smart Cross-Selling Actions (Budget & Installment Integration) */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm">
              <h3 className="font-extrabold text-slate-900 text-base mb-4 flex items-center gap-2">
                <span>⚡</span>
                <span>조회된 차량 데이터 스마트 연계 시뮬레이션</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Link
                  href={`/calculator/installment`}
                  className="p-4 rounded-xl border border-slate-200 hover:border-blue-400 hover:shadow-md transition-all group bg-slate-50/50"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-slate-800 text-sm group-hover:text-blue-600 transition-colors">
                      할부금 및 월 납입금 계산
                    </span>
                    <Calculator className="w-4 h-4 text-slate-400 group-hover:text-blue-600 transition-colors" />
                  </div>
                  <p className="text-xs text-slate-500">
                    금리 3.5%~8.5%, 12~72개월별 원리금균등상환 스케줄표 시뮬레이션
                  </p>
                </Link>

                <Link
                  href={`/calculator/budget`}
                  className="p-4 rounded-xl border border-slate-200 hover:border-blue-400 hover:shadow-md transition-all group bg-slate-50/50"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-slate-800 text-sm group-hover:text-blue-600 transition-colors">
                      내 예산 맞춤 차량 비교
                    </span>
                    <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 transition-colors" />
                  </div>
                  <p className="text-xs text-slate-500">
                    현재 보유 자금과 월 납입 여력으로 살 수 있는 동급 최고의 대안 차량 찾기
                  </p>
                </Link>

                <Link
                  href={`/used-cars`}
                  className="p-4 rounded-xl border border-slate-200 hover:border-blue-400 hover:shadow-md transition-all group bg-slate-50/50"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-slate-800 text-sm group-hover:text-blue-600 transition-colors">
                      연식별 중고차 시세 & 감가율
                    </span>
                    <TrendingDown className="w-4 h-4 text-slate-400 group-hover:text-blue-600 transition-colors" />
                  </div>
                  <p className="text-xs text-slate-500">
                    출고 후 1~10년차 감가 추이 및 실매물 적정 시세 그래프 확인
                  </p>
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Legal & Compliance Notice */}
        <div className="p-4 rounded-xl bg-slate-100 border border-slate-200 text-[11px] text-slate-500 space-y-1.5">
          <div className="flex items-center gap-1.5 font-bold text-slate-700">
            <Info className="w-3.5 h-3.5 text-blue-600 shrink-0" />
            <span>한국교통안전공단(TS) 자동차종합정보개방 서비스 운영 정책 안내</span>
          </div>
          <p>
            1. 본 서비스는 공공데이터포털(data.go.kr) 및 한국교통안전공단(054-459-7512) 자동차종합정보 첨부형 API(자동차기본정보, 제원정보1, 제원정보2) 규격에 따라 제공됩니다.
          </p>
          <p>
            2. 자동차종합정보 첨부형 API는 매매상품용차량과 개인소유차량(소유자 제3자 정보제공동의 차량에 한함)의 정보를 제공하며, 신청 목적 외 사용을 엄격히 금지합니다.
          </p>
        </div>

        {/* Bottom AdSense Banner */}
        <div className="flex justify-center">
          <AdBanner slot="car_lookup_bottom_banner" format="horizontal" />
        </div>
      </div>
    </div>
  );
}
