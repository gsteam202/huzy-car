"use client";

import { useEffect, useState } from "react";

const labels = {
  en: ["Delete account", "Your account, linked sign-ins and private data will be deleted permanently. Public contributions may remain under a deleted member name. This cannot be undone.", "Type DELETE to confirm", "Permanently delete account", "Deleting…", "Deletion failed. Please try again.", "Transfer or remove resources you own before deleting your account.", "Another administrator must remain before you can leave."],
  ko: ["회원 탈퇴", "계정, 연결된 로그인 정보와 개인 데이터가 영구 삭제됩니다. 공개 게시물은 탈퇴한 회원 이름으로 남을 수 있습니다. 탈퇴 후 복구할 수 없습니다.", "확인을 위해 DELETE를 입력하세요", "영구 탈퇴", "처리 중…", "탈퇴하지 못했습니다. 다시 시도해 주세요.", "소유한 프로젝트·공유 가계부를 정리하거나 소유권을 이전한 뒤 탈퇴해 주세요.", "다른 관리자를 지정한 뒤 탈퇴해 주세요."],
  ja: ["アカウント削除", "アカウント、連携ログイン、個人データは完全に削除されます。公開投稿は退会済みの名前で残る場合があります。元に戻せません。", "確認のため DELETE と入力", "完全に削除", "削除中…", "削除できませんでした。もう一度お試しください。", "所有する共有リソースを削除または譲渡してください。", "別の管理者を指定してください。"],
  zh: ["删除账户", "账户、关联登录和私人数据将永久删除。公开内容可能以已注销用户的名义保留。此操作无法撤销。", "输入 DELETE 确认", "永久删除账户", "正在删除…", "删除失败，请重试。", "请先删除或转让您拥有的共享资源。", "请先指定其他管理员。"],
  tw: ["刪除帳戶", "帳戶、連結登入及私人資料將永久刪除。公開內容可能以已註銷會員的名稱保留。此操作無法復原。", "輸入 DELETE 確認", "永久刪除帳戶", "刪除中…", "刪除失敗，請重試。", "請先刪除或轉讓您擁有的共用資源。", "請先指定其他管理員。"],
  es: ["Eliminar cuenta", "Tu cuenta, accesos vinculados y datos privados se eliminarán permanentemente. Las publicaciones públicas pueden conservarse como miembro eliminado. Esta acción es irreversible.", "Escribe DELETE para confirmar", "Eliminar permanentemente", "Eliminando…", "No se pudo eliminar. Inténtalo de nuevo.", "Transfiere o elimina los recursos compartidos que posees primero.", "Debe quedar otro administrador."],
};

export default function AccountWithdrawal({ storageKeys = [] }: { storageKeys?: string[] }) {
  const [language, setLanguage] = useState("en");
  const [confirmation, setConfirmation] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  useEffect(() => { setLanguage(document.documentElement.lang.toLowerCase()); }, []);
  const key = language.startsWith("ko") ? "ko" : language.startsWith("ja") ? "ja" : /^(zh-tw|zh-hant)/.test(language) ? "tw" : language.startsWith("zh") ? "zh" : language.startsWith("es") ? "es" : "en";
  const t = labels[key];
  return <details id="account-withdrawal" style={{ marginTop: 24, padding: 16, border: "1px solid #b45353", borderRadius: 8 }}>
    <summary style={{ cursor: "pointer", color: "#b42318", fontWeight: 600 }}>{t[0]}</summary>
    <p style={{ margin: "12px 0", lineHeight: 1.6 }}>{t[1]}</p>
    <form onSubmit={async (event) => {
      event.preventDefault();
      if (pending || confirmation !== "DELETE") return;
      setPending(true); setError("");
      try {
        const response = await fetch("/api/account/withdraw", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ confirmation }) });
        const data = await response.json();
        if (!response.ok) { setError(data.code === "OWNED_RESOURCES" ? t[6] : data.code === "LAST_ADMIN" ? t[7] : t[5]); setPending(false); return; }
        for (const key of storageKeys) { try { localStorage.removeItem(key); } catch {} }
        window.location.replace("/");
      } catch { setError(t[5]); setPending(false); }
    }}>
      <label style={{ display: "block", marginBottom: 8 }}>{t[2]}<input value={confirmation} onChange={(event) => setConfirmation(event.target.value)} disabled={pending} autoComplete="off" spellCheck={false} maxLength={6} style={{ display: "block", width: "100%", maxWidth: 320, padding: 10, marginTop: 6, border: "1px solid #888", borderRadius: 6, color: "#172033", background: "#fff" }} /></label>
      <button type="submit" disabled={pending || confirmation !== "DELETE"} style={{ padding: "10px 16px", borderRadius: 6, border: 0, color: "#fff", background: "#a92323", opacity: pending || confirmation !== "DELETE" ? 0.5 : 1, cursor: pending ? "wait" : "pointer" }}>{pending ? t[4] : t[3]}</button>
      {error && <p role="alert" style={{ color: "#b42318", marginTop: 8 }}>{error}</p>}
    </form>
  </details>;
}
