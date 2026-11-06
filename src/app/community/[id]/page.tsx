import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/db";
import { CommentSection } from "@/components/community/comment-section";
import AdBanner from "@/components/ads/ad-banner";
import { ArrowLeft, Eye, ThumbsUp, Calendar, User, Share2 } from "lucide-react";

export const revalidate = 10;

interface Props {
  params: Promise<{ id: string }>;
}

export default async function PostDetailPage({ params }: Props) {
  const { id } = await params;

  const post = await prisma.post.findUnique({
    where: { id },
    include: {
      board: true,
      author: {
        select: { nickname: true, role: true },
      },
      comments: {
        include: {
          author: { select: { nickname: true, avatarUrl: true } },
        },
        orderBy: { createdAt: "asc" },
      },
    },
  });

  if (!post) {
    notFound();
  }

  // Increment view count asynchronously
  prisma.post
    .update({
      where: { id: post.id },
      data: { viewCount: { increment: 1 } },
    })
    .catch(() => {});

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
      {/* Top Banner */}
      <AdBanner slot="page-top-slot" compact />

      {/* Back button */}
      <Link
        href={`/community?board=${post.board.slug}`}
        className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-900"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>{post.board.name} 목록으로</span>
      </Link>

      <article className="bg-white p-6 sm:p-10 rounded-3xl border border-slate-200 shadow-sm space-y-6">
        {/* Post Header */}
        <div className="space-y-3 pb-6 border-b border-slate-100">
          <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-blue-50 text-blue-700">
            {post.board.name}
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight leading-snug">
            {post.title}
          </h1>

          <div className="flex flex-wrap items-center justify-between text-xs text-slate-400 gap-2 pt-2">
            <div className="flex items-center gap-3">
              <span className="font-bold text-slate-700">{post.author.nickname}</span>
              <span>•</span>
              <span>{new Date(post.createdAt).toLocaleString("ko-KR")}</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1">
                <Eye className="w-3.5 h-3.5" />
                {post.viewCount}
              </span>
              <span className="flex items-center gap-1">
                <ThumbsUp className="w-3.5 h-3.5" />
                {post.likeCount}
              </span>
            </div>
          </div>
        </div>

        {/* Post Body */}
        <div className="text-sm text-slate-800 leading-loose whitespace-pre-wrap py-4 font-normal">
          {post.content}
        </div>

        {/* Mid Ad Banner between Post Content and Comments */}
        <AdBanner slot="content-mid-slot" />

        {/* Comments Section */}
        <CommentSection postId={post.id} initialComments={post.comments} />
      </article>

      {/* Bottom Ad Banner */}
      <AdBanner slot="content-bottom-slot" />
    </div>
  );
}
