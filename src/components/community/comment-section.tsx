"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { MessageCircle, ThumbsUp, Send } from "lucide-react";

interface CommentItem {
  id: string;
  content: string;
  createdAt: string | Date;
  author: {
    nickname: string;
    avatarUrl?: string | null;
  };
}

export function CommentSection({
  postId,
  initialComments,
}: {
  postId: string;
  initialComments: CommentItem[];
}) {
  const { data: session } = useSession();
  const [comments, setComments] = useState<CommentItem[]>(initialComments);
  const [content, setContent] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() || submitting) return;

    setSubmitting(true);
    try {
      const res = await fetch("/api/community/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ postId, content }),
      });
      const data = await res.json();
      if (data.success) {
        setComments((prev) => [...prev, data.data]);
        setContent("");
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 pt-6 border-t border-slate-100">
      <div className="flex items-center gap-2 font-bold text-slate-900 text-base">
        <MessageCircle className="w-5 h-5 text-blue-600" />
        <span>댓글 {comments.length}개</span>
      </div>

      {/* Write comment */}
      {session?.user ? (
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            type="text"
            placeholder="댓글을 남겨보세요..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500"
          />
          <button
            type="submit"
            disabled={submitting || !content.trim()}
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 transition-all shrink-0"
          >
            <Send className="w-3.5 h-3.5" />
            <span>등록</span>
          </button>
        </form>
      ) : (
        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 text-center text-xs text-slate-500">
          댓글을 작성하려면{" "}
          <Link href="/auth/login" className="text-blue-600 font-bold hover:underline">
            로그인
          </Link>
          이 필요합니다.
        </div>
      )}

      {/* Comments List */}
      <div className="space-y-3">
        {comments.map((c) => (
          <div key={c.id} className="p-4 bg-slate-50 rounded-2xl space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="font-bold text-xs text-slate-800">
                {c.author.nickname}
              </span>
              <span className="text-[11px] text-slate-400">
                {new Date(c.createdAt).toLocaleDateString("ko-KR")}
              </span>
            </div>
            <p className="text-xs text-slate-700 leading-relaxed">{c.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
