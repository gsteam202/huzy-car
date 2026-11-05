import Link from "next/link";
import { ShieldCheck, Info, Car } from "lucide-react";

export function Footer() {
  const currentYear = 2026;

  return (
    <footer className="bg-slate-900 text-slate-400 text-sm mt-20 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand Col */}
          <div className="md:col-span-1 space-y-3">
            <div className="flex items-center gap-2 text-white font-extrabold text-lg">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white">
                <Car className="w-5 h-5" />
              </div>
              <span>CAR HUZY</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              대한민국 소비자를 위한 신차·중고차 가격 비교 및 내 예산 맞춤형 차량 추천 웹 플랫폼입니다.
            </p>
            <div className="flex items-center gap-2 text-xs text-emerald-400">
              <ShieldCheck className="w-4 h-4" />
              <span>실시간 공식 데이터 & 매물 시세 검증</span>
            </div>
          </div>

          {/* Quick Links 1 */}
          <div>
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-3">
              차량 탐색 & 비교
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/new-cars" className="hover:text-white transition-colors">
                  제조사별 신차 가격표
                </Link>
              </li>
              <li>
                <Link href="/used-cars" className="hover:text-white transition-colors">
                  중고차 시세 & 감가율 분석
                </Link>
              </li>
              <li>
                <Link href="/compare" className="hover:text-white transition-colors">
                  신차 vs 중고차 1:1 비교
                </Link>
              </li>
              <li>
                <Link href="/new-cars?fuel=HYBRID" className="hover:text-white transition-colors">
                  하이브리드 인기 차량
                </Link>
              </li>
              <li>
                <Link href="/new-cars?fuel=ELECTRIC" className="hover:text-white transition-colors">
                  전기차 보조금 적용 차량
                </Link>
              </li>
            </ul>
          </div>

          {/* Quick Links 2 */}
          <div>
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-3">
              금융 & 계산기
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/calculator/budget" className="hover:text-white transition-colors font-medium text-blue-400">
                  내 예산으로 살 수 있는 차 찾기
                </Link>
              </li>
              <li>
                <Link href="/calculator/installment" className="hover:text-white transition-colors">
                  원리금균등 할부 계산기
                </Link>
              </li>
              <li>
                <Link href="/community" className="hover:text-white transition-colors">
                  차량 구매 상담 커뮤니티
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal / Disclaimer */}
          <div>
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-3">
              안내 및 법적 고지
            </h4>
            <div className="space-y-2 text-xs leading-relaxed">
              <p>
                본 사이트에서 제공하는 신차 가격, 옵션 가격 및 중고차 시세는 제조사 공식 자료 및 등록 매물 호가를 기반으로 산출된 추정치입니다.
              </p>
              <p className="text-[11px] text-slate-500">
                실제 차량 구입 시점의 제조사 프로모션, 딜러 할인, 지자체 보조금 잔여 현황 및 금융사 승인 금리에 따라 최종 결제 금액은 상이할 수 있습니다.
              </p>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {currentYear} CAR HUZY (car.huzy.net). All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5" />
              데이터 기준일: 2026. 11. 05. (Asia/Seoul)
            </span>
            <span>호스팅: danggn Ubuntu Edge</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
