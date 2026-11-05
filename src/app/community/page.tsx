import Link from "next/link";
import { prisma } from "@/lib/db";
import { MessageSquare, Eye, ThumbsUp, MessageCircle, PenSquare } from "lucide-react";
import AdBanner from "@/components/ads/ad-banner";

export const revalidate = 30;

interface Props {
  searchParams: Promise<{
    board?: string;
    q?: string;
  }>;
}

export default async function CommunityPage({ searchParams }: Props) {
  const { board: boardSlug, q } = await searchParams;

  const boards = await prisma.board.findMany({
    where: { isActive: true },
    orderBy: { orderIndex: "asc" },
  });

  const where: any = {};
  if (boardSlug) {
    where.board = { slug: boardSlug };
  }
  if (q) {
    where.OR = [
      { title: { contains: q } },
      { content: { contains: q } },
    ];
  }

  const posts = await prisma.post.findMany({
    where,
    include: {
      board: true,
      author: {
        select: { nickname: true, role: true },
      },
    },
    orderBy: [{ isPinned: "desc" }, { createdAt: "desc" }],
    take: 30,
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Banner */}
      <AdBanner slot="page-top-slot" compact />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-blue-600 uppercase tracking-wider">
            <MessageSquare className="w-4 h-4" />
            <span>CAR HUZY COMMUNITY</span>
          </div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight mt-1">
            자동차 구매 & 유지 상담 커뮤니티
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            신차·중고차 견적 상담, 내 예산 질문, 차종별 오너들의 생생한 주행 후기를 나누는 공간입니다.
          </p>
        </div>

        <Link
          href="/community/write"
          className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs flex items-center gap-2 shadow-sm shadow-blue-500/20 transition-all self-start sm:self-auto"
        >
          <PenSquare className="w-4 h-4" />
          <span>글쓰기</span>
        </Link>
      </div>

      {/* Board Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        <Link
          href="/community"
          className={`px-4 py-2 rounded-xl text-xs font-bold shrink-0 transition-all ${
            !boardSlug
              ? "bg-slate-900 text-white shadow-sm"
              : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
          }`}
        >
          전체글
        </Link>
        {boards.map((b) => (
          <Link
            key={b.slug}
            href={`/community?board=${b.slug}`}
            className={`px-4 py-2 rounded-xl text-xs font-bold shrink-0 transition-all ${
              boardSlug === b.slug
                ? "bg-blue-600 text-white shadow-sm shadow-blue-500/20"
                : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
            }`}
          >
            {b.name}
          </Link>
        ))}
      </div>

      {/* Posts List */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm divide-y divide-slate-100 overflow-hidden">
        {posts.length === 0 ? (
          <div className="p-12 text-center text-sm text-slate-400">
            아직 등록된 게시글이 없습니다. 첫 번째 글을 작성해보세요!
          </div>
        ) : (
          posts.map((p) => (
            <Link
              key={p.id}
              href={`/community/${p.id}`}
              className="p-5 sm:p-6 block hover:bg-slate-50/80 transition-colors group"
            >
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-slate-100 text-slate-700">
                    {p.board.name}
                  </span>
                  <span className="text-xs text-slate-400">
                    {p.author.nickname}
                  </span>
                  <span className="text-xs text-slate-300">•</span>
                  <span className="text-xs text-slate-400">
                    {new Date(p.createdAt).toLocaleDateString("ko-KR")}
                  </span>
                </div>

                <h2 className="font-extrabold text-base sm:text-lg text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-1">
                  {p.title}
                </h2>

                <p className="text-xs sm:text-sm text-slate-500 line-clamp-2 leading-relaxed">
                  {p.content}
                </p>

                <div className="flex items-center gap-4 text-xs text-slate-400 pt-2">
                  <span className="flex items-center gap-1">
                    <Eye className="w-3.5 h-3.5" />
                    {p.viewCount}
                  </span>
                  <span className="flex items-center gap-1">
                    <ThumbsUp className="w-3.5 h-3.5" />
                    {p.likeCount}
                  </span>
                  <span className="flex items-center gap-1 text-blue-600 font-bold">
                    <MessageCircle className="w-3.5 h-3.5" />
                    댓글 {p.commentCount}
                  </span>
                </div>
              </div>
            </Link>
          ))
        )}
      </div>

      {/* Bottom Ad Banner */}
      <AdBanner slot="content-bottom-slot" />
    </div>
  );
}
