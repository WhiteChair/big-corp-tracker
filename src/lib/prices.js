import { unstable_cache } from "next/cache";

// ticker (as used in the UI) -> Yahoo Finance symbol (price metrics are in that listing's currency)
export const YAHOO = {
  AMZN: "AMZN", AAPL: "AAPL", GOOG: "GOOG", MSFT: "MSFT", NVDA: "NVDA", META: "META", TSLA: "TSLA", AVGO: "AVGO",
  SPCX: "SPCX",
  NVO: "NOVO-B.CO", ASML: "ASML.AS", "MC.PA": "MC.PA", SAP: "SAP.DE", "ROG.SW": "RO.SW", "NOVN.SW": "NOVN.SW",
  GSK: "GSK.L", AZN: "AZN.L", "SAN.PA": "SAN.PA", "NESN.SW": "NESN.SW", "OR.PA": "OR.PA",
  BABA: "9988.HK", "0700.HK": "0700.HK", "3690.HK": "3690.HK", "1810.HK": "1810.HK", "1211.HK": "1211.HK",
  JD: "9618.HK", NTES: "9999.HK", BIDU: "9888.HK", "0175.HK": "0175.HK", "0981.HK": "0981.HK",
};
// ticker -> symbol used by companiesmarketcap.com (market cap in USD)
export const CMC = {
  AMZN: "AMZN", AAPL: "AAPL", GOOG: "GOOG", MSFT: "MSFT", NVDA: "NVDA", META: "META", TSLA: "TSLA", AVGO: "AVGO",
  SPCX: "SPCX",
  NVO: "NVO", ASML: "ASML", "MC.PA": "MC.PA", SAP: "SAP", "ROG.SW": "RO.SW", "NOVN.SW": "NVS",
  GSK: "GSK", AZN: "AZN", "SAN.PA": "SNY", "NESN.SW": "NESN.SW", "OR.PA": "OR.PA",
  BABA: "BABA", "0700.HK": "TCEHY", "3690.HK": "3690.HK", "1810.HK": "XIACF", "1211.HK": "002594.SZ",
  JD: "JD", NTES: "NTES", BIDU: "BIDU", "0175.HK": "0175.HK", "0981.HK": "0981.HK",
};

const UA = { "User-Agent": "Mozilla/5.0 (compatible; big-corp-tracker/1.0)" };
const r2 = (v) => Math.round(v * 100) / 100;

async function marketCaps() {
  const res = await fetch("https://companiesmarketcap.com/?download=csv", { headers: UA, cache: "no-store" });
  if (!res.ok) throw new Error("companiesmarketcap " + res.status);
  const rows = (await res.text()).split("\n");
  const bySym = {};
  for (const line of rows.slice(1)) {
    const m = line.match(/^"[^"]*","(?:[^"]|"")*","([^"]*)","([^"]*)"/);
    if (m) bySym[m[1]] = parseFloat(m[2]);
  }
  const out = {};
  for (const [t, s] of Object.entries(CMC)) {
    const v = bySym[s];
    if (v > 0) { const b = v / 1e9; out[t] = b >= 1000 ? Math.round(b) : Math.round(b * 10) / 10; }
  }
  return out;
}

async function yahooMetrics(sym) {
  try {
    const res = await fetch(
      "https://query1.finance.yahoo.com/v8/finance/chart/" + encodeURIComponent(sym) + "?range=1y&interval=1d",
      { headers: UA, cache: "no-store" });
    if (!res.ok) return null;
    const r = (await res.json())?.chart?.result?.[0];
    if (!r) return null;
    const q = r.indicators.quote[0];
    const closes = q.close.filter((v) => v != null);
    const highs = q.high.filter((v) => v != null);
    let price = r.meta.regularMarketPrice;
    let currency = r.meta.currency;
    let scale = 1;
    if (currency === "GBp") { scale = 0.01; currency = "GBP"; } // pence -> pounds
    const last200 = closes.slice(-200);
    return {
      price: r2(price * scale),
      high52w: highs.length ? r2(Math.max(...highs) * scale) : null,
      // only publish a 200-day average when 200 sessions of history exist (not the case for a recent IPO)
      dma200: last200.length >= 200 ? r2((last200.reduce((a, b) => a + b, 0) / 200) * scale) : null,
      currency,
    };
  } catch { return null; }
}

async function buildSnapshot() {
  const [caps, ...ys] = await Promise.all([marketCaps(), ...Object.values(YAHOO).map(yahooMetrics)]);
  const tickers = {};
  const keys = Object.keys(YAHOO);
  let ok = 0;
  keys.forEach((t, i) => {
    const y = ys[i];
    const e = {};
    if (y) { ok++; Object.assign(e, y); }
    if (caps[t] != null) e.mcapUSD = caps[t];
    if (Object.keys(e).length) tickers[t] = e;
  });
  // Don't cache a broken snapshot for a whole day: fail instead so the previous one / client fallback is used.
  if (ok < keys.length * 0.6 || Object.keys(caps).length < keys.length * 0.6) throw new Error("upstream data incomplete");
  return {
    updatedAt: new Date().toISOString(),
    refreshPolicy: "Snapshot refreshed once per day after the US close by a Vercel cron (/api/cron/daily-refresh); page views read the stored snapshot and never hit the data providers.",
    sources: { marketCap: "companiesmarketcap.com (USD)", priceMetrics: "Yahoo Finance (native currency)" },
    tickers,
  };
}

// Stored in Next's persistent Data Cache (shared by all serverless instances), tag "prices".
// TTL is only a safety net (36h): the daily cron invalidates the tag every day.
export const getSnapshot = unstable_cache(buildSnapshot, ["price-snapshot-v1"], {
  revalidate: 129600,
  tags: ["prices"],
});
