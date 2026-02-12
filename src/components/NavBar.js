"use client";
import { usePathname } from "next/navigation";
import Link from "next/link";

export default function NavBar() {
  const path = usePathname();
  const isRank = path === "/";
  const isSeg = path === "/segments";

  return (
    <nav style={{
      display: "flex", alignItems: "center", gap: 8,
      padding: "8px 20px",
      background: "#080812",
      borderBottom: "1px solid rgba(255,255,255,0.06)",
      fontFamily: "'DM Sans', system-ui, sans-serif",
    }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap" rel="stylesheet"/>
      <div style={{
        width: 26, height: 26, borderRadius: 6,
        background: "linear-gradient(135deg,#6366f1,#3b82f6)",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 13, fontWeight: 700, color: "#fff", marginRight: 6,
      }}>◈</div>
      <Link href="/" style={{
        padding: "5px 14px", borderRadius: 6, fontSize: 12, fontWeight: 600,
        textDecoration: "none", transition: "all 0.15s",
        background: isRank ? "rgba(99,102,241,0.14)" : "transparent",
        color: isRank ? "#a5b4fc" : "#64748b",
        border: `1px solid ${isRank ? "#6366f1" : "transparent"}`,
      }}>Rankings</Link>
      <Link href="/segments" style={{
        padding: "5px 14px", borderRadius: 6, fontSize: 12, fontWeight: 600,
        textDecoration: "none", transition: "all 0.15s",
        background: isSeg ? "rgba(99,102,241,0.14)" : "transparent",
        color: isSeg ? "#a5b4fc" : "#64748b",
        border: `1px solid ${isSeg ? "#6366f1" : "transparent"}`,
      }}>Segment Analysis</Link>
      <div style={{ flex: 1 }} />
      <span style={{ fontSize: 10, color: "#3f4d63" }}>segment-tracker.vercel.app</span>
    </nav>
  );
}
