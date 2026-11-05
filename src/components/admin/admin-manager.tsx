"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { RefreshCw, Upload, CheckCircle2, AlertCircle, Database, FileText } from "lucide-react";

export function AdminManager({
  dataSources,
  auditLogs,
}: {
  dataSources: any[];
  auditLogs: any[];
}) {
  const router = useRouter();
  const [syncing, setSyncing] = useState<string | null>(null);
  const [syncMessage, setSyncMessage] = useState<string>("");

  // CSV Batch Upload State
  const [csvText, setCsvText] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadMessage, setUploadMessage] = useState("");
  const [uploadError, setUploadError] = useState("");

  const handleSync = async (providerCode?: string) => {
    setSyncing(providerCode || "all");
    setSyncMessage("");
    try {
      const url = providerCode
        ? `/api/admin/sync?provider=${providerCode}`
        : "/api/admin/sync";
      const res = await fetch(url, { method: "POST" });
      const data = await res.json();
      if (data.success) {
        setSyncMessage("동기화가 성공적으로 완료되었습니다.");
        router.refresh();
      } else {
        setSyncMessage("동기화 실패: " + data.error);
      }
    } catch (e: any) {
      setSyncMessage("오류: " + e.message);
    } finally {
      setSyncing(null);
    }
  };

  const handleBatchUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploadError("");
    setUploadMessage("");

    if (!csvText.trim()) {
      setUploadError("CSV 데이터를 입력해주세요.");
      return;
    }

    setUploading(true);
    try {
      // Parse CSV rows: brandNameKo,brandSlug,modelNameKo,modelSlug,trimNameKo,vehicleType,fuelType,price,year
      const lines = csvText.trim().split("\n");
      const rows = [];

      for (const line of lines) {
        if (!line.trim() || line.startsWith("#") || line.startsWith("brandNameKo")) continue;
        const parts = line.split(",").map((p) => p.trim());
        if (parts.length >= 8) {
          rows.push({
            brandNameKo: parts[0],
            brandSlug: parts[1],
            modelNameKo: parts[2],
            modelSlug: parts[3],
            trimNameKo: parts[4],
            vehicleType: parts[5] as any,
            fuelType: parts[6] as any,
            price: Number(parts[7]),
            year: Number(parts[8] || 2024),
          });
        }
      }

      if (rows.length === 0) {
        setUploadError("유효한 CSV 행을 파싱하지 못했습니다. 형식을 확인해주세요.");
        setUploading(false);
        return;
      }

      const res = await fetch("/api/admin/cars/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rows }),
      });
      const data = await res.json();
      if (data.success) {
        setUploadMessage(data.message);
        setCsvText("");
        router.refresh();
      } else {
        setUploadError(data.error || "일괄 등록 실패");
      }
    } catch (e: any) {
      setUploadError(e.message || "오류가 발생했습니다.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* 1. External Data Sources & Sync */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div>
            <h2 className="font-extrabold text-lg text-slate-900 flex items-center gap-2">
              <Database className="w-5 h-5 text-blue-600" />
              <span>외부 차량 데이터 공급원 동기화</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              공식 신차 가격 및 엔카 중고차 실거래 시세 어댑터
            </p>
          </div>

          <button
            onClick={() => handleSync()}
            disabled={Boolean(syncing)}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${syncing ? "animate-spin" : ""}`} />
            <span>전체 즉시 동기화</span>
          </button>
        </div>

        {syncMessage && (
          <div className="p-3 bg-blue-50 text-blue-800 text-xs rounded-xl font-medium">
            {syncMessage}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {dataSources.map((ds) => (
            <div
              key={ds.id}
              className="p-5 bg-slate-50 rounded-2xl border border-slate-100 flex flex-col justify-between space-y-3"
            >
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-sm text-slate-900">{ds.name}</span>
                  <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-emerald-100 text-emerald-800">
                    {ds.status}
                  </span>
                </div>
                <p className="text-xs text-slate-400">{ds.licenseInfo}</p>
                <div className="text-[11px] text-slate-500 pt-1">
                  마지막 동기화:{" "}
                  {ds.lastSyncedAt
                    ? new Date(ds.lastSyncedAt).toLocaleString("ko-KR")
                    : "이력 없음"}
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  onClick={() => handleSync(ds.providerCode)}
                  disabled={syncing === ds.providerCode}
                  className="px-3 py-1.5 bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-bold rounded-lg transition-colors flex items-center gap-1"
                >
                  <RefreshCw className={`w-3 h-3 ${syncing === ds.providerCode ? "animate-spin" : ""}`} />
                  <span>수동 실행</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 2. CSV Batch Upload */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4">
        <div>
          <h2 className="font-extrabold text-lg text-slate-900 flex items-center gap-2">
            <Upload className="w-5 h-5 text-emerald-600" />
            <span>차량 트림 및 가격 CSV 일괄 업로드</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            제조사 공식 가격표를 CSV 형태로 붙여넣어 일괄 등록합니다.
          </p>
        </div>

        {uploadError && (
          <div className="p-3 bg-red-50 text-red-700 text-xs rounded-xl font-medium">
            {uploadError}
          </div>
        )}
        {uploadMessage && (
          <div className="p-3 bg-emerald-50 text-emerald-700 text-xs rounded-xl font-medium">
            {uploadMessage}
          </div>
        )}

        <form onSubmit={handleBatchUpload} className="space-y-4">
          <div className="text-[11px] text-slate-400 font-mono bg-slate-50 p-2.5 rounded-lg border border-slate-200">
            형식: 브랜드명,브랜드slug,모델명,모델slug,트림명,차종(SEDAN/SUV),연료(GASOLINE/HYBRID),가격(원),연식
            <br />
            예시: 현대,hyundai,디 올 뉴 그랜저,grandeur,2.5 가솔린 프리미엄,SEDAN,GASOLINE,37430000,2024
          </div>

          <textarea
            rows={5}
            placeholder="현대,hyundai,디 올 뉴 그랜저,grandeur,2.5 가솔린 프리미엄,SEDAN,GASOLINE,37430000,2024"
            value={csvText}
            onChange={(e) => setCsvText(e.target.value)}
            className="w-full font-mono text-xs p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500"
          />

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={uploading}
              className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 transition-all shadow-sm"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>{uploading ? "업로드 중..." : "CSV 일괄 등록 실행"}</span>
            </button>
          </div>
        </form>
      </div>

      {/* 3. Admin Audit Log */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4">
        <h2 className="font-extrabold text-lg text-slate-900 flex items-center gap-2">
          <FileText className="w-5 h-5 text-slate-600" />
          <span>최근 관리자 작업 감사 로그</span>
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
              <tr>
                <th className="py-2.5 px-3">일시</th>
                <th className="py-2.5 px-3">관리자</th>
                <th className="py-2.5 px-3">작업</th>
                <th className="py-2.5 px-3">대상</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {auditLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50">
                  <td className="py-2.5 px-3 text-slate-400">
                    {new Date(log.createdAt).toLocaleString("ko-KR")}
                  </td>
                  <td className="py-2.5 px-3 font-semibold">{log.admin.nickname}</td>
                  <td className="py-2.5 px-3 font-bold text-blue-700">{log.action}</td>
                  <td className="py-2.5 px-3 text-slate-600">{log.targetType}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
