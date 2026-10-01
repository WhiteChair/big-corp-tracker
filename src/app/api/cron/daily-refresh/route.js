import { NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { getSnapshot } from "@/lib/prices";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

const MIN_AGE_MS = 6 * 3600 * 1000; // never refresh more than every 6h, whoever calls this

// Called once a day by the Vercel cron in vercel.json (22:30 UTC, after the US close).
export async function GET(request) {
  const secret = process.env.CRON_SECRET;
  const auth = request.headers.get("authorization");
  const ua = request.headers.get("user-agent") || "";
  const allowed = secret ? auth === `Bearer ${secret}` : ua.startsWith("vercel-cron/");
  if (!allowed) return NextResponse.json({ error: "forbidden" }, { status: 403 });

  let current = null;
  try { current = await getSnapshot(); } catch {}
  if (current && Date.now() - Date.parse(current.updatedAt) < MIN_AGE_MS) {
    return NextResponse.json({ refreshed: false, reason: "snapshot younger than 6h", updatedAt: current.updatedAt });
  }
  revalidateTag("prices");
  const snap = await getSnapshot();
  return NextResponse.json({ refreshed: true, updatedAt: snap.updatedAt, tickers: Object.keys(snap.tickers).length });
}
