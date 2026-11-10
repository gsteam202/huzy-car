"use client";

import { useState, useEffect } from "react";
import {
  Users,
  Search,
  Shield,
  ShieldAlert,
  ShieldCheck,
  UserCheck,
  UserX,
  Trash2,
  RefreshCw,
  Mail,
  Calendar,
  Heart,
  FileText,
  Bookmark,
} from "lucide-react";

interface AdminUserItem {
  id: string;
  email: string;
  nickname: string;
  role: "USER" | "MODERATOR" | "ADMIN";
  avatarUrl: string | null;
  marketingConsent: boolean;
  createdAt: string;
  updatedAt: string;
  providers: string[];
  isProtectedAdmin: boolean;
  _count: {
    favorites: number;
    savedRecommendations: number;
    posts: number;
    comments: number;
  };
}

export function UserManager() {
  const [users, setUsers] = useState<AdminUserItem[]>([]);
  const [stats, setStats] = useState({ total: 0, user: 0, moderator: 0, admin: 0 });
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRole, setSelectedRole] = useState("ALL");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: String(page),
        limit: "15",
        role: selectedRole,
        q: searchQuery,
      });
      const res = await fetch(`/api/admin/users?${params.toString()}`);
      const json = await res.json();
      if (json.success) {
        setUsers(json.data.users);
        setTotalPages(json.data.pagination.totalPages || 1);
        if (json.data.stats) {
          setStats(json.data.stats);
        }
      }
    } catch (e: any) {
      setMessage({ text: "회원 목록 조회 실패: " + e.message, type: "error" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [page, selectedRole]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchUsers();
  };

  const handleRoleChange = async (userId: string, newRole: string) => {
    setUpdatingId(userId);
    setMessage(null);
    try {
      const res = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, role: newRole }),
      });
      const json = await res.json();
      if (json.success) {
        setMessage({ text: json.message, type: "success" });
        fetchUsers();
      } else {
        setMessage({ text: json.error || "권한 변경 실패", type: "error" });
      }
    } catch (e: any) {
      setMessage({ text: "오류: " + e.message, type: "error" });
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDeleteUser = async (user: AdminUserItem) => {
    if (!confirm(`정말로 ${user.nickname}(${user.email}) 회원을 강제 탈퇴/삭제하시겠습니까?`)) {
      return;
    }
    setUpdatingId(user.id);
    setMessage(null);
    try {
      const res = await fetch(`/api/admin/users?userId=${user.id}`, {
        method: "DELETE",
      });
      const json = await res.json();
      if (json.success) {
        setMessage({ text: json.message, type: "success" });
        fetchUsers();
      } else {
        setMessage({ text: json.error || "회원 삭제 실패", type: "error" });
      }
    } catch (e: any) {
      setMessage({ text: "오류: " + e.message, type: "error" });
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. Header & Quick Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold text-slate-400">전체 회원</span>
            <div className="text-xl font-black text-slate-900 mt-0.5">{stats.total}명</div>
          </div>
          <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600">
            <Users className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold text-slate-400">일반 회원</span>
            <div className="text-xl font-black text-blue-600 mt-0.5">{stats.user}명</div>
          </div>
          <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
            <UserCheck className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold text-slate-400">운영진 (MODERATOR)</span>
            <div className="text-xl font-black text-emerald-600 mt-0.5">{stats.moderator}명</div>
          </div>
          <div className="w-9 h-9 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
            <Shield className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold text-slate-400">최고 관리자 (ADMIN)</span>
            <div className="text-xl font-black text-amber-600 mt-0.5">{stats.admin}명</div>
          </div>
          <div className="w-9 h-9 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600">
            <ShieldAlert className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* 2. Search & Role Filter Bar */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        {/* Role Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {[
            { key: "ALL", label: "전체" },
            { key: "USER", label: "일반회원" },
            { key: "MODERATOR", label: "운영자" },
            { key: "ADMIN", label: "관리자" },
          ].map((r) => (
            <button
              key={r.key}
              onClick={() => {
                setSelectedRole(r.key);
                setPage(1);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors whitespace-nowrap ${
                selectedRole === r.key
                  ? "bg-slate-900 text-white shadow-xs"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <form onSubmit={handleSearchSubmit} className="relative flex items-center">
          <input
            type="text"
            placeholder="이메일 또는 닉네임 검색"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full sm:w-64 pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white focus:outline-none focus:border-blue-500 transition-all placeholder:text-slate-400"
          />
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 pointer-events-none" />
        </form>
      </div>

      {/* Notification Toast */}
      {message && (
        <div
          className={`p-3.5 rounded-xl text-xs font-bold ${
            message.type === "success"
              ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
              : "bg-red-50 text-red-800 border border-red-200"
          }`}
        >
          {message.text}
        </div>
      )}

      {/* 3. User Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold">
              <tr>
                <th className="py-3 px-4">회원 정보</th>
                <th className="py-3 px-4">가입 방식</th>
                <th className="py-3 px-4">활동 현황</th>
                <th className="py-3 px-4">가입일</th>
                <th className="py-3 px-4">권한 변경</th>
                <th className="py-3 px-4 text-right">관리</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    <RefreshCw className="w-5 h-5 animate-spin mx-auto mb-2 text-slate-300" />
                    회원 목록을 불러오는 중입니다...
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400 font-medium">
                    조회된 회원이 없습니다.
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr key={user.id} className="hover:bg-slate-50/70 transition-colors">
                    {/* User Profile */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        {user.avatarUrl ? (
                          <img
                            src={user.avatarUrl}
                            alt={user.nickname}
                            className="w-9 h-9 rounded-full object-cover ring-1 ring-slate-200 shrink-0"
                          />
                        ) : (
                          <div className="w-9 h-9 rounded-full bg-blue-50 text-blue-600 font-bold flex items-center justify-center shrink-0">
                            {user.nickname.slice(0, 1).toUpperCase()}
                          </div>
                        )}
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold text-slate-900">{user.nickname}</span>
                            {user.isProtectedAdmin && (
                              <span className="px-1.5 py-0.2 text-[9px] font-black rounded bg-amber-100 text-amber-800">
                                최고관리자
                              </span>
                            )}
                          </div>
                          <span className="text-[11px] text-slate-400 font-mono block mt-0.5">
                            {user.email}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Auth Providers */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1">
                        {user.providers.includes("google") && (
                          <span className="px-2 py-0.5 text-[10px] font-bold rounded-md bg-blue-50 text-blue-700 border border-blue-200">
                            Google
                          </span>
                        )}
                        {user.providers.length === 0 && (
                          <span className="px-2 py-0.5 text-[10px] font-bold rounded-md bg-slate-100 text-slate-700">
                            이메일
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Activity Counts */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2.5 text-[11px] text-slate-600">
                        <span className="flex items-center gap-1" title="찜한 차량">
                          <Heart className="w-3 h-3 text-red-500" />
                          <span>{user._count.favorites}</span>
                        </span>
                        <span className="flex items-center gap-1" title="저장한 견적">
                          <Bookmark className="w-3 h-3 text-blue-500" />
                          <span>{user._count.savedRecommendations}</span>
                        </span>
                        <span className="flex items-center gap-1" title="작성 게시글">
                          <FileText className="w-3 h-3 text-purple-500" />
                          <span>{user._count.posts}</span>
                        </span>
                      </div>
                    </td>

                    {/* Created Date */}
                    <td className="py-3.5 px-4 text-slate-400 text-[11px]">
                      {new Date(user.createdAt).toLocaleDateString("ko-KR", {
                        year: "numeric",
                        month: "2-digit",
                        day: "2-digit",
                      })}
                    </td>

                    {/* Role Selector */}
                    <td className="py-3.5 px-4">
                      {user.isProtectedAdmin ? (
                        <span className="px-2.5 py-1 text-xs font-bold rounded-lg bg-amber-50 text-amber-900 border border-amber-200 inline-block">
                          ADMIN (고정)
                        </span>
                      ) : (
                        <select
                          value={user.role}
                          disabled={updatingId === user.id}
                          onChange={(e) => handleRoleChange(user.id, e.target.value)}
                          className={`px-2.5 py-1 text-xs font-bold rounded-lg border focus:outline-none transition-colors cursor-pointer ${
                            user.role === "ADMIN"
                              ? "bg-amber-50 text-amber-900 border-amber-300"
                              : user.role === "MODERATOR"
                              ? "bg-emerald-50 text-emerald-900 border-emerald-300"
                              : "bg-slate-50 text-slate-700 border-slate-200 hover:border-slate-300"
                          }`}
                        >
                          <option value="USER">USER (일반)</option>
                          <option value="MODERATOR">MODERATOR (운영자)</option>
                          <option value="ADMIN">ADMIN (관리자)</option>
                        </select>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right">
                      {!user.isProtectedAdmin && (
                        <button
                          onClick={() => handleDeleteUser(user)}
                          disabled={updatingId === user.id}
                          className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="회원 강제 탈퇴"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="py-3 px-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs">
            <span className="text-slate-500 font-medium">
              페이지 {page} / {totalPages}
            </span>
            <div className="flex items-center gap-1.5">
              <button
                disabled={page <= 1}
                onClick={() => setPage(page - 1)}
                className="px-3 py-1 bg-white border border-slate-200 rounded-lg text-slate-700 disabled:opacity-40 hover:bg-slate-100 transition-colors font-bold"
              >
                이전
              </button>
              <button
                disabled={page >= totalPages}
                onClick={() => setPage(page + 1)}
                className="px-3 py-1 bg-white border border-slate-200 rounded-lg text-slate-700 disabled:opacity-40 hover:bg-slate-100 transition-colors font-bold"
              >
                다음
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
