"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { PenSquare, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function WritePostPage() {
  const router = useRouter();
  const { data: session, status } = useSession();

  const [boards, setBoards] = useState<any[]>([]);
  const [boardSlug, setBoardSlug] = useState("free");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    // Hardcoded board options or fetch
    setBoards([
      { slug: "free", name: "자유게시판" },
      { slug: "new-car-consult", name: "신차 구매 상담" },
      { slug: "used-car-consult", name: "중고차 구매 상담" },
      { slug: "recommend-qna", name: "예산별 차량 추천" },
      { slug: "maintenance", name: "유지비 & 정비" },
      { slug: "review", name: "출고 후기 & 오너 리뷰" },
    ]);
  }, []);

  if (status === "unauthenticated") {
    return (
      <div className="max-w-md mx-auto my-20 p-8 bg-white rounded-3xl border border-slate-200 text-center space-y-4">
        <h2 className="text-xl font-bold text-slate-900">로그인이 필요합니다</h2>
        <p className="text-xs text-slate-500">커뮤니티 글 작성은 회원 로그인 후 이용 가능합니다.</p>
        <Link
          href="/auth/login"
          className="inline-block px-6 py-2.5 bg-blue-600 text-white rounded-xl text-xs font-bold"
        >
          로그인하러 가기
        </Link>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!title.trim() || !content.trim()) {
      setError("제목과 내용을 모두 입력해주세요.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/community/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ boardSlug, title, content }),
      });
      const data = await res.json();
      if (data.success) {
        router.push(`/community/${data.data.id}`);
      } else {
        setError(data.error || "게시글 작성에 실패했습니다.");
      }
    } catch (err: any) {
      setError(err.message || "오류가 발생했습니다.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-10 space-y-6">
      <Link
        href="/community"
        className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-900"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>커뮤니티로 돌아가기</span>
      </Link>

      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
        <div className="flex items-center gap-2 pb-4 border-b border-slate-100">
          <PenSquare className="w-5 h-5 text-blue-600" />
          <h1 className="text-xl font-black text-slate-900">게시글 작성</h1>
        </div>

        {error && (
          <div className="p-3 bg-red-50 text-red-700 text-xs rounded-xl font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-600 mb-1">게시판 선택</label>
            <select
              value={boardSlug}
              onChange={(e) => setBoardSlug(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm font-semibold focus:outline-none focus:border-blue-500"
            >
              {boards.map((b) => (
                <option key={b.slug} value={b.slug}>
                  {b.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-600 mb-1">제목</label>
            <input
              type="text"
              placeholder="제목을 입력하세요 (2~200자)"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500"
              maxLength={200}
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-600 mb-1">내용</label>
            <textarea
              rows={12}
              placeholder="자동차 질문, 시승기, 구매 상담 등 자유롭게 작성해주세요."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-sm focus:outline-none focus:border-blue-500 leading-relaxed"
            />
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold rounded-xl text-sm shadow-sm transition-all"
            >
              {submitting ? "등록 중..." : "게시글 등록"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
