import { NextResponse } from "next/server";
import { getSnapshot } from "@/lib/prices";

export const dynamic = "force-dynamic";
export const maxDuration = 30;

// Public, read-only: returns the stored daily snapshot. It does NOT recompute on every request.
export async function GET() {
  try {
    const snap = await getSnapshot();
    return NextResponse.json(snap, {
      headers: { "Cache-Control": "public, max-age=0, s-maxage=600, stale-while-revalidate=3600" },
    });
  } catch (e) {
    return NextResponse.json({ error: "snapshot unavailable" }, { status: 502, headers: { "Cache-Control": "no-store" } });
  }
}
