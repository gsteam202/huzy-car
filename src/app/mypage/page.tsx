import AccountWithdrawal from '@/components/account-withdrawal';
import { redirect } from "next/navigation";
import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { formatKoreanMoney } from "@/lib/finance";
import {
  User,
  Bookmark,
  Calculator,
  Car,
  MessageSquare,
  Shield,
  ArrowRight,
  Clock,
} from "lucide-react";

export const revalidate = 0; // Dynamic personal page

export default async function MyPage() {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/auth/login?callbackUrl=/mypage");
  }

  // Fetch user's saved data
  const [savedRecommendations, financingScenarios, favorites, posts] =
    await Promise.all([
      prisma.savedRecommendation.findMany({
        where: { userId: user.id },
        orderBy: { createdAt: "desc" },
        take: 5,
      }),
      prisma.financingScenario.findMany({
        where: { userId: user.id },
        include: { results: true },
        orderBy: { createdAt: "desc" },
        take: 5,
      }),
      prisma.favoriteCar.findMany({
        where: { userId: user.id },
        include: {
          newTrim: {
            include: {
              modelYear: {
                include: {
                  generation: {
                    include: {
                      model: { include: { brand: true } },
                    },
                  },
                },
              },
            },
          },
          usedListing: {
            include: { brand: true, model: true },
          },
        },
        orderBy: { createdAt: "desc" },
        take: 5,
      }),
      prisma.post.findMany({
        where: { authorId: user.id },
        include: { board: true },
        orderBy: { createdAt: "desc" },
        take: 5,
      }),
    ]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Profile Header Card */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center font-black text-2xl shadow-md shadow-blue-500/20">
            {user.name?.[0] || "U"}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">
                {user.name} 님
              </h1>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-blue-100 text-blue-700">
                {user.role}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">{user.email}</p>
          </div>
        </div>

        {user.role === "ADMIN" && (
          <Link
            href="/admin"
            className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold rounded-xl shadow-sm transition-colors flex items-center gap-1.5"
          >
            <Shield className="w-4 h-4" />
            <span>관리자 대시보드</span>
          </Link>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Saved Budget Recommendations */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h2 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
              <Bookmark className="w-4 h-4 text-blue-600" />
              <span>저장된 예산별 차량 추천</span>
            </h2>
            <Link
              href="/calculator/budget"
              className="text-xs font-bold text-blue-600 hover:text-blue-800"
            >
              새 추천 찾기 →
            </Link>
          </div>

          {savedRecommendations.length === 0 ? (
            <p className="text-xs text-slate-400 py-6 text-center">
              아직 저장된 예산 추천 결과가 없습니다.
            </p>
          ) : (
            <div className="space-y-3">
              {savedRecommendations.map((r) => (
                <div
                  key={r.id}
                  className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between"
                >
                  <div>
                    <h3 className="font-bold text-sm text-slate-900">{r.title}</h3>
                    <div className="flex items-center gap-1 text-[11px] text-slate-400 mt-1">
                      <Clock className="w-3 h-3" />
                      <span>{new Date(r.createdAt).toLocaleDateString("ko-KR")}</span>
                    </div>
                  </div>
                  <Link
                    href="/calculator/budget"
                    className="p-2 bg-white rounded-lg border border-slate-200 text-slate-600 hover:text-blue-600"
                  >
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Saved Financing Estimates */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h2 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
              <Calculator className="w-4 h-4 text-emerald-600" />
              <span>저장한 할부 견적서</span>
            </h2>
            <Link
              href="/calculator/installment"
              className="text-xs font-bold text-blue-600 hover:text-blue-800"
            >
              견적 계산기 →
            </Link>
          </div>

          {financingScenarios.length === 0 ? (
            <p className="text-xs text-slate-400 py-6 text-center">
              저장된 할부 견적이 없습니다.
            </p>
          ) : (
            <div className="space-y-3">
              {financingScenarios.map((s) => (
                <div
                  key={s.id}
                  className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between"
                >
                  <div>
                    <h3 className="font-bold text-sm text-slate-900">{s.title}</h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      차량가 {formatKoreanMoney(s.vehiclePrice)} • {s.termMonths}개월 (연 {s.annualRatePct}%)
                    </p>
                    {s.results && (
                      <div className="text-xs font-extrabold text-blue-600 mt-1">
                        예상 월 {formatKoreanMoney(s.results.monthlyPayment)}
                      </div>
                    )}
                  </div>
                  <Link
                    href={`/calculator/installment?price=${s.vehiclePrice}`}
                    className="p-2 bg-white rounded-lg border border-slate-200 text-slate-600 hover:text-blue-600"
                  >
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Favorite Cars */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h2 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
              <Car className="w-4 h-4 text-blue-600" />
              <span>관심 차량 목록</span>
            </h2>
            <Link href="/new-cars" className="text-xs font-bold text-blue-600 hover:text-blue-800">
              차량 둘러보기 →
            </Link>
          </div>

          {favorites.length === 0 ? (
            <p className="text-xs text-slate-400 py-6 text-center">
              관심 차량으로 등록된 자동차가 없습니다.
            </p>
          ) : (
            <div className="space-y-3">
              {favorites.map((fav) => {
                const carName =
                  fav.newTrim?.modelYear.generation.model.nameKo ||
                  fav.usedListing?.title ||
                  "차량";
                return (
                  <div
                    key={fav.id}
                    className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between"
                  >
                    <div>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-700">
                        {fav.carType === "NEW" ? "신차" : "중고차"}
                      </span>
                      <h3 className="font-bold text-sm text-slate-900 mt-1">{carName}</h3>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* My Posts */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h2 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-purple-600" />
              <span>내가 작성한 게시글</span>
            </h2>
            <Link
              href="/community"
              className="text-xs font-bold text-blue-600 hover:text-blue-800"
            >
              커뮤니티 가기 →
            </Link>
          </div>

          {posts.length === 0 ? (
            <p className="text-xs text-slate-400 py-6 text-center">
              아직 작성한 게시글이 없습니다.
            </p>
          ) : (
            <div className="space-y-3">
              {posts.map((p) => (
                <Link
                  key={p.id}
                  href={`/community/${p.id}`}
                  className="p-4 bg-slate-50 rounded-2xl border border-slate-100 block hover:bg-slate-100 transition-colors"
                >
                  <span className="text-[10px] font-bold text-slate-500">{p.board.name}</span>
                  <h3 className="font-bold text-sm text-slate-900 line-clamp-1 mt-0.5">
                    {p.title}
                  </h3>
                  <div className="flex items-center gap-3 text-xs text-slate-400 mt-2">
                    <span>조회 {p.viewCount}</span>
                    <span>댓글 {p.commentCount}</span>
                    <span>{new Date(p.createdAt).toLocaleDateString("ko-KR")}</span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
      <AccountWithdrawal />
    </div>
  );
}
