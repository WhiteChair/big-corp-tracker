import { useState, useMemo } from "react";

const FX = {
  USD:{USD:1,EUR:0.92,CNY:7.25},EUR:{USD:1.087,EUR:1,CNY:7.88},
  GBP:{USD:1.26,EUR:1.155,CNY:9.14},CHF:{USD:1.13,EUR:1.04,CNY:8.20},
  DKK:{USD:0.146,EUR:0.134,CNY:1.059},HKD:{USD:0.128,EUR:0.118,CNY:0.932},
  CNY:{USD:0.138,EUR:0.127,CNY:1},
};
const cvt=(v,from,to)=>(!v||!FX[from])?v:v*(FX[from][to]||1);

// ─── THEMES ───
const THEMES = {
  light: {
    bg:"#f8f9fb", cardBg:"#fff", headerBg:"linear-gradient(135deg,#f0f2f8 0%,#e8e4f0 60%,#f0f2f8 100%)",
    headerBorder:"#e2e5eb", text:"#1a1d23", textMid:"#4b5563", textDim:"#9ca3af", textFaint:"#d1d5db",
    tableBg:"#fff", tableHeaderBg:"#fafbfc", tableHover:"rgba(0,0,0,0.02)", tableBorder:"#edf0f4",
    cardBorder:"#e5e7eb", subtleBg:"rgba(0,0,0,0.02)", activeBtn:"#4f46e5", activeBtnBg:"rgba(79,70,229,0.08)",
    activeBtnText:"#4f46e5", inactiveBtn:"#9ca3af", gridLine:"rgba(0,0,0,0.05)", chartLabel:"#6b7280",
    chartHoverText:"#1a1d23", tooltipBg:"rgba(255,255,255,0.97)", tooltipBorder:"#e5e7eb",
    insightBg:"linear-gradient(135deg,rgba(79,70,229,0.04),rgba(59,130,246,0.04))", insightBorder:"rgba(79,70,229,0.12)",
    insightTitle:"#6366f1", barTrack:"rgba(0,0,0,0.05)", barLabel:"#374151",
    sortHover:"#4f46e5", sortActive:"#4f46e5", sortBorder:"#4f46e5",
    badgeBgAlpha:"18", miniBarTrack:"rgba(0,0,0,0.06)",
    logoStroke:"#e0e0e0",
  },
  dark: {
    bg:"#0b0f19", cardBg:"rgba(255,255,255,0.025)", headerBg:"linear-gradient(135deg,#0f172a 0%,#1a1145 60%,#0f172a 100%)",
    headerBorder:"rgba(255,255,255,0.05)", text:"#e2e8f0", textMid:"#94a3b8", textDim:"#64748b", textFaint:"#475569",
    tableBg:"rgba(255,255,255,0.012)", tableHeaderBg:"#0d1117", tableHover:"rgba(255,255,255,0.03)", tableBorder:"rgba(255,255,255,0.05)",
    cardBorder:"rgba(255,255,255,0.05)", subtleBg:"rgba(255,255,255,0.02)", activeBtn:"#6366f1", activeBtnBg:"rgba(99,102,241,0.14)",
    activeBtnText:"#a5b4fc", inactiveBtn:"#64748b", gridLine:"rgba(255,255,255,0.04)", chartLabel:"#475569",
    chartHoverText:"#e2e8f0", tooltipBg:"rgba(15,23,42,0.95)", tooltipBorder:"rgba(255,255,255,0.1)",
    insightBg:"linear-gradient(135deg,rgba(99,102,241,0.04),rgba(59,130,246,0.04))", insightBorder:"rgba(99,102,241,0.1)",
    insightTitle:"#818cf8", barTrack:"rgba(255,255,255,0.04)", barLabel:"#c8d6e5",
    sortHover:"#93c5fd", sortActive:"#93c5fd", sortBorder:"#3b82f6",
    badgeBgAlpha:"20", miniBarTrack:"rgba(255,255,255,0.06)",
    logoStroke:"#333",
  },
};

const LOGOS = {
  NVDA:{icon:s=><svg viewBox="0 0 32 32" width={s} height={s}><rect width="32" height="32" rx="7" fill="#76b900"/><path d="M9 24V8h3l8 11V8h3v16h-3L12 13v11z" fill="#fff"/></svg>},
  AAPL:{icon:s=><svg viewBox="0 0 32 32" width={s} height={s}><rect width="32" height="32" rx="7" fill="#1d1d1f"/><path d="M20.5 8.3c-.7-1-1.8-1.5-2.8-1.5-.3 0-.7.1-1 .2-.5.2-.8.2-1.2.2s-.6 0-1.1-.2c-.3-.1-.7-.2-1.1-.2-1.2 0-2.5.7-3.3 2-1.1 1.8-.9 5 .8 7.8.6 1 1.4 2.1 2.5 2.1h.1c.4 0 .7-.2 1.2-.3.4-.1.8-.2 1.3-.2s.9.1 1.3.2c.5.2.8.3 1.1.3h.1c1.1 0 2-1.2 2.6-2.2.4-.6.5-1 .7-1.5-1.3-.5-2.2-1.8-2.2-3.3 0-1.3.7-2.5 1.7-3.1-.7-.9-1.6-1.3-2.4-1.3l.7.9zM18.7 6c.1-.1.1-.3.1-.4 0-1-.7-2.1-1.8-2.8.1.1 0 .3 0 .5 0 .9.8 2 1.7 2.7z" fill="#fff"/></svg>},
  GOOG:{icon:s=><svg viewBox="0 0 32 32" width={s} height={s}><rect width="32" height="32" rx="7" fill="#fff" stroke="#e0e0e0" strokeWidth="0.5"/><text x="16" y="22" textAnchor="middle" fill="#fbbc04" fontSize="18" fontWeight="700" fontFamily="Arial">G</text></svg>},
  MSFT:{icon:s=><svg viewBox="0 0 32 32" width={s} height={s}><rect width="32" height="32" rx="7" fill="#f3f3f3"/><rect x="7" y="7" width="8" height="8" fill="#f25022"/><rect x="17" y="7" width="8" height="8" fill="#7fba00"/><rect x="7" y="17" width="8" height="8" fill="#00a4ef"/><rect x="17" y="17" width="8" height="8" fill="#ffb900"/></svg>},
  AMZN:{icon:s=><svg viewBox="0 0 32 32" width={s} height={s}><rect width="32" height="32" rx="7" fill="#232f3e"/><path d="M8 18c0 0 4 3 8 3s8-3 8-3" fill="none" stroke="#ff9900" strokeWidth="2.5" strokeLinecap="round"/><path d="M22 18l2 3" stroke="#ff9900" strokeWidth="2.5" strokeLinecap="round"/><text x="16" y="15" textAnchor="middle" fill="#fff" fontSize="9" fontWeight="700" fontFamily="Arial">a</text></svg>},
  META:{icon:s=><svg viewBox="0 0 32 32" width={s} height={s}><rect width="32" height="32" rx="7" fill="#1877f2"/><path d="M21 6h-3c-2.8 0-5 2.2-5 5v3h-3v4h3v8h4v-8h3l1-4h-4v-2.5c0-.8.7-1.5 1.5-1.5H22V6z" fill="#fff"/></svg>},
  TSLA:{icon:s=><svg viewBox="0 0 32 32" width={s} height={s}><rect width="32" height="32" rx="7" fill="#cc0000"/><rect x="7" y="7" width="18" height="3" rx="1.5" fill="#fff"/><rect x="14" y="7" width="4" height="18" rx="1.5" fill="#fff"/></svg>},
  AVGO:{icon:s=><svg viewBox="0 0 32 32" width={s} height={s}><rect width="32" height="32" rx="7" fill="#cc092f"/><text x="16" y="21" textAnchor="middle" fill="#fff" fontSize="14" fontWeight="700" fontFamily="Arial">B</text></svg>},
  ASML:{icon:s=><svg viewBox="0 0 32 32" width={s} height={s}><rect width="32" height="32" rx="7" fill="#0f238c"/><text x="16" y="20" textAnchor="middle" fill="#fff" fontSize="9" fontWeight="700" fontFamily="Arial">ASML</text></svg>},
  "ROG.SW":{icon:s=><svg viewBox="0 0 32 32" width={s} height={s}><rect width="32" height="32" rx="7" fill="#0066cc"/><text x="16" y="21" textAnchor="middle" fill="#fff" fontSize="12" fontWeight="700" fontFamily="Arial">R</text></svg>},
  "MC.PA":{icon:s=><svg viewBox="0 0 32 32" width={s} height={s}><rect width="32" height="32" rx="7" fill="#1a1a1a"/><text x="16" y="20" textAnchor="middle" fill="#d4a853" fontSize="8" fontWeight="700" fontFamily="Georgia">LV</text></svg>},
  AZN:{icon:s=><svg viewBox="0 0 32 32" width={s} height={s}><rect width="32" height="32" rx="7" fill="#830051"/><text x="16" y="20" textAnchor="middle" fill="#ffd100" fontSize="9" fontWeight="700" fontFamily="Arial">AZ</text></svg>},
  "NOVN.SW":{icon:s=><svg viewBox="0 0 32 32" width={s} height={s}><rect width="32" height="32" rx="7" fill="#0460a9"/><text x="16" y="20" textAnchor="middle" fill="#fff" fontSize="8" fontWeight="700" fontFamily="Arial">NVS</text></svg>},
  NVO:{icon:s=><svg viewBox="0 0 32 32" width={s} height={s}><rect width="32" height="32" rx="7" fill="#002f6c"/><circle cx="16" cy="15" r="5" fill="none" stroke="#fff" strokeWidth="2"/><path d="M11 22h10" stroke="#c8102e" strokeWidth="2"/></svg>},
  SAP:{icon:s=><svg viewBox="0 0 32 32" width={s} height={s}><rect width="32" height="32" rx="7" fill="#0070f2"/><text x="16" y="20" textAnchor="middle" fill="#fff" fontSize="10" fontWeight="700" fontFamily="Arial">SAP</text></svg>},
  "OR.PA":{icon:s=><svg viewBox="0 0 32 32" width={s} height={s}><rect width="32" height="32" rx="7" fill="#1a1a1a"/><text x="16" y="20" textAnchor="middle" fill="#fff" fontSize="7" fontWeight="700" fontFamily="Georgia">L'OR</text></svg>},
  "NESN.SW":{icon:s=><svg viewBox="0 0 32 32" width={s} height={s}><rect width="32" height="32" rx="7" fill="#fff" stroke="#ddd"/><text x="16" y="20" textAnchor="middle" fill="#333" fontSize="7" fontWeight="700" fontFamily="Arial">Nestlé</text></svg>},
  GSK:{icon:s=><svg viewBox="0 0 32 32" width={s} height={s}><rect width="32" height="32" rx="7" fill="#f36633"/><text x="16" y="20" textAnchor="middle" fill="#fff" fontSize="10" fontWeight="700" fontFamily="Arial">gsk</text></svg>},
  "SAN.PA":{icon:s=><svg viewBox="0 0 32 32" width={s} height={s}><rect width="32" height="32" rx="7" fill="#7b2d8e"/><text x="16" y="20" textAnchor="middle" fill="#fff" fontSize="8" fontWeight="700" fontFamily="Arial">SNF</text></svg>},
  BABA:{icon:s=><svg viewBox="0 0 32 32" width={s} height={s}><rect width="32" height="32" rx="7" fill="#ff6a00"/><text x="16" y="21" textAnchor="middle" fill="#fff" fontSize="13" fontWeight="700" fontFamily="Arial">A</text></svg>},
  "0700.HK":{icon:s=><svg viewBox="0 0 32 32" width={s} height={s}><rect width="32" height="32" rx="7" fill="#25c05b"/><text x="16" y="20" textAnchor="middle" fill="#fff" fontSize="7" fontWeight="700" fontFamily="Arial">WeChat</text></svg>},
  "3690.HK":{icon:s=><svg viewBox="0 0 32 32" width={s} height={s}><rect width="32" height="32" rx="7" fill="#ffc107"/><text x="16" y="21" textAnchor="middle" fill="#000" fontSize="12" fontWeight="700" fontFamily="Arial">M</text></svg>},
  "1810.HK":{icon:s=><svg viewBox="0 0 32 32" width={s} height={s}><rect width="32" height="32" rx="7" fill="#ff6700"/><text x="16" y="20" textAnchor="middle" fill="#fff" fontSize="8" fontWeight="700" fontFamily="Arial">Mi</text></svg>},
  "1211.HK":{icon:s=><svg viewBox="0 0 32 32" width={s} height={s}><rect width="32" height="32" rx="7" fill="#ac1a2f"/><text x="16" y="20" textAnchor="middle" fill="#fff" fontSize="8" fontWeight="700" fontFamily="Arial">BYD</text></svg>},
  JD:{icon:s=><svg viewBox="0 0 32 32" width={s} height={s}><rect width="32" height="32" rx="7" fill="#c91623"/><text x="16" y="20" textAnchor="middle" fill="#fff" fontSize="9" fontWeight="700" fontFamily="Arial">JD</text></svg>},
  NTES:{icon:s=><svg viewBox="0 0 32 32" width={s} height={s}><rect width="32" height="32" rx="7" fill="#c4302b"/><text x="16" y="20" textAnchor="middle" fill="#fff" fontSize="8" fontWeight="700" fontFamily="Arial">NE</text></svg>},
  BIDU:{icon:s=><svg viewBox="0 0 32 32" width={s} height={s}><rect width="32" height="32" rx="7" fill="#2529d8"/><text x="16" y="20" textAnchor="middle" fill="#fff" fontSize="8" fontWeight="700" fontFamily="Arial">Bd</text></svg>},
  "0175.HK":{icon:s=><svg viewBox="0 0 32 32" width={s} height={s}><rect width="32" height="32" rx="7" fill="#003d79"/><text x="16" y="20" textAnchor="middle" fill="#fff" fontSize="7" fontWeight="700" fontFamily="Arial">Geely</text></svg>},
  "0981.HK":{icon:s=><svg viewBox="0 0 32 32" width={s} height={s}><rect width="32" height="32" rx="7" fill="#1a3c6e"/><text x="16" y="20" textAnchor="middle" fill="#fff" fontSize="7" fontWeight="700" fontFamily="Arial">SMIC</text></svg>},
};

const STOCKS = [
  {ticker:"NVDA",name:"NVIDIA",group:"mag8",country:"🇺🇸",sector:"Semiconductors",currency:"USD",mcap:4510,revenue:130.5,employees:36,price:138.5,high52w:153.13,dma200:131.2,rev3yAgo:26.97},
  {ticker:"AAPL",name:"Apple",group:"mag8",country:"🇺🇸",sector:"Consumer Electronics",currency:"USD",mcap:3870,revenue:391,employees:164,price:232.8,high52w:260.10,dma200:230.5,rev3yAgo:383.29},
  {ticker:"GOOG",name:"Alphabet",group:"mag8",country:"🇺🇸",sector:"Internet / AI",currency:"USD",mcap:2620,revenue:350,employees:183,price:205.5,high52w:218.83,dma200:181.4,rev3yAgo:282.84},
  {ticker:"MSFT",name:"Microsoft",group:"mag8",country:"🇺🇸",sector:"Software / Cloud",currency:"USD",mcap:3070,revenue:262,employees:228,price:410.2,high52w:468.35,dma200:428.1,rev3yAgo:211.92},
  {ticker:"AMZN",name:"Amazon",group:"mag8",country:"🇺🇸",sector:"E-Commerce / Cloud",currency:"USD",mcap:2490,revenue:638,employees:1541,price:232.1,high52w:242.52,dma200:205.8,rev3yAgo:513.98},
  {ticker:"META",name:"Meta Platforms",group:"mag8",country:"🇺🇸",sector:"Social Media / AI",currency:"USD",mcap:1790,revenue:164,employees:74,price:706.2,high52w:736.67,dma200:600.5,rev3yAgo:116.61},
  {ticker:"TSLA",name:"Tesla",group:"mag8",country:"🇺🇸",sector:"EVs / Energy / Robotics",currency:"USD",mcap:1310,revenue:97.7,employees:121,price:350.7,high52w:488.54,dma200:295.3,rev3yAgo:81.46},
  {ticker:"AVGO",name:"Broadcom",group:"mag8",country:"🇺🇸",sector:"Semiconductors",currency:"USD",mcap:1570,revenue:51.6,employees:20,price:239.6,high52w:251.88,dma200:206.7,rev3yAgo:33.20},
  {ticker:"ASML",name:"ASML",group:"granola",country:"🇳🇱",sector:"Semiconductor Equip.",currency:"EUR",mcap:520,revenue:28.3,employees:44,price:732.4,high52w:1021.80,dma200:710.2,rev3yAgo:21.17},
  {ticker:"ROG.SW",name:"Roche",group:"granola",country:"🇨🇭",sector:"Pharma / Diagnostics",currency:"CHF",mcap:293,revenue:58.5,employees:103,price:303.1,high52w:312.00,dma200:272.5,rev3yAgo:58.72},
  {ticker:"MC.PA",name:"LVMH",group:"granola",country:"🇫🇷",sector:"Luxury Goods",currency:"EUR",mcap:320,revenue:84.7,employees:213,price:670.1,high52w:897.80,dma200:650.3,rev3yAgo:79.18},
  {ticker:"AZN",name:"AstraZeneca",group:"granola",country:"🇬🇧",sector:"Pharma",currency:"GBP",mcap:190,revenue:54.1,employees:90,price:122.4,high52w:133.84,dma200:118.6,rev3yAgo:45.81},
  {ticker:"NOVN.SW",name:"Novartis",group:"granola",country:"🇨🇭",sector:"Pharma",currency:"CHF",mcap:263,revenue:50.3,employees:78,price:98.7,high52w:104.28,dma200:96.1,rev3yAgo:41.54},
  {ticker:"NVO",name:"Novo Nordisk",group:"granola",country:"🇩🇰",sector:"Pharma / GLP-1",currency:"DKK",mcap:2570,revenue:290.4,employees:72,price:569.2,high52w:1010.00,dma200:668.1,rev3yAgo:176.95},
  {ticker:"SAP",name:"SAP",group:"granola",country:"🇩🇪",sector:"Enterprise Software",currency:"EUR",mcap:252,revenue:34.2,employees:107,price:268.3,high52w:277.22,dma200:233.4,rev3yAgo:30.87},
  {ticker:"OR.PA",name:"L'Oréal",group:"granola",country:"🇫🇷",sector:"Consumer / Beauty",currency:"EUR",mcap:223,revenue:43.5,employees:90,price:345.8,high52w:449.50,dma200:355.2,rev3yAgo:38.26},
  {ticker:"NESN.SW",name:"Nestlé",group:"granola",country:"🇨🇭",sector:"Consumer / Food",currency:"CHF",mcap:224,revenue:91.4,employees:270,price:85.2,high52w:101.22,dma200:86.7,rev3yAgo:94.42},
  {ticker:"GSK",name:"GSK",group:"granola",country:"🇬🇧",sector:"Pharma",currency:"GBP",mcap:70,revenue:31.4,employees:72,price:14.9,high52w:18.16,dma200:15.1,rev3yAgo:29.32},
  {ticker:"SAN.PA",name:"Sanofi",group:"granola",country:"🇫🇷",sector:"Pharma",currency:"EUR",mcap:138,revenue:42.1,employees:91,price:106.5,high52w:113.24,dma200:100.8,rev3yAgo:43.07},
  {ticker:"BABA",name:"Alibaba",group:"terrific10",country:"🇨🇳",sector:"E-Commerce / Cloud",currency:"HKD",mcap:3700,revenue:941,employees:198,price:153.4,high52w:157.00,dma200:105.3,rev3yAgo:868.69},
  {ticker:"0700.HK",name:"Tencent",group:"terrific10",country:"🇨🇳",sector:"Gaming / Social / Fintech",currency:"HKD",mcap:4950,revenue:616,employees:105,price:541.0,high52w:558.50,dma200:435.2,rev3yAgo:554.55},
  {ticker:"3690.HK",name:"Meituan",group:"terrific10",country:"🇨🇳",sector:"Local Services / Delivery",currency:"HKD",mcap:1200,revenue:280,employees:100,price:185.6,high52w:213.80,dma200:165.4,rev3yAgo:219.96},
  {ticker:"1810.HK",name:"Xiaomi",group:"terrific10",country:"🇨🇳",sector:"Consumer Elec. / EVs",currency:"HKD",mcap:1650,revenue:345,employees:37,price:62.3,high52w:67.30,dma200:39.8,rev3yAgo:280.04},
  {ticker:"1211.HK",name:"BYD",group:"terrific10",country:"🇨🇳",sector:"EVs / Batteries",currency:"HKD",mcap:1250,revenue:600,employees:703,price:437.4,high52w:461.80,dma200:315.6,rev3yAgo:424.06},
  {ticker:"JD",name:"JD.com",group:"terrific10",country:"🇨🇳",sector:"E-Commerce / Logistics",currency:"HKD",mcap:550,revenue:1100,employees:460,price:186.5,high52w:203.20,dma200:152.8,rev3yAgo:1084.67},
  {ticker:"NTES",name:"NetEase",group:"terrific10",country:"🇨🇳",sector:"Gaming / Music",currency:"HKD",mcap:560,revenue:105,employees:33,price:172.6,high52w:218.60,dma200:171.8,rev3yAgo:96.5},
  {ticker:"BIDU",name:"Baidu",group:"terrific10",country:"🇨🇳",sector:"Search / AI",currency:"HKD",mcap:380,revenue:133,employees:41,price:113.3,high52w:119.30,dma200:90.4,rev3yAgo:123.67},
  {ticker:"0175.HK",name:"Geely",group:"terrific10",country:"🇨🇳",sector:"Automotive",currency:"HKD",mcap:240,revenue:202,employees:55,price:19.8,high52w:20.80,dma200:14.6,rev3yAgo:147.97},
  {ticker:"0981.HK",name:"SMIC",group:"terrific10",country:"🇨🇳",sector:"Semiconductor Foundry",currency:"HKD",mcap:450,revenue:60.8,employees:19,price:48.9,high52w:55.85,dma200:36.7,rev3yAgo:45.18},
];

STOCKS.forEach(s=>{
  s.revPerEmp=s.revenue/s.employees;
  s.dist52wHigh=((s.price-s.high52w)/s.high52w)*100;
  s.dist200dma=((s.price-s.dma200)/s.dma200)*100;
  s.revGrowth3yr=((s.revenue/s.rev3yAgo)**(1/3)-1)*100;
});

const GRP={
  mag8:{label:"Magnificent 8",short:"Mag 8",color:"#3b82f6"},
  granola:{label:"GRANOLA 11",short:"GRANOLA",color:"#f59e0b"},
  terrific10:{label:"Terrific 10",short:"Terrific 10",color:"#ef4444"},
};
const CUR=[{code:"USD",sym:"$",label:"$ USD"},{code:"EUR",sym:"€",label:"€ EUR"},{code:"CNY",sym:"¥",label:"¥ CNY"}];
const SORTS=[
  {key:"mcap",label:"Market Cap",desc:true,conv:true},{key:"revenue",label:"Revenue",desc:true,conv:true},
  {key:"employees",label:"Employees",desc:true},{key:"revPerEmp",label:"Rev/Emp",desc:true,conv:true},
  {key:"revGrowth3yr",label:"3Y CAGR",desc:true},{key:"dist52wHigh",label:"vs 52W High",desc:false},
  {key:"dist200dma",label:"vs 200 DMA",desc:true},
];

const fm={
  b:(v,s="")=>v==null?"—":v>=1000?`${s}${(v/1000).toFixed(2)}T`:v>=1?`${s}${v.toFixed(1)}B`:`${s}${(v*1000).toFixed(0)}M`,
  m:(v,s="")=>v==null?"—":`${s}${v.toFixed(2)}M`,
  p:v=>v==null?"—":`${v>=0?"+":""}${v.toFixed(1)}%`,
  k:v=>v==null?"—":v>=1000?`${(v/1000).toFixed(1)}M`:`${v.toFixed(0)}K`,
};
const pc=(v,g,w)=>v==null?"#6b7280":v>=g?"#34d399":v>=w?"#fbbf24":"#f87171";

function ScatterChart({data,sym,t}) {
  const [hov,setHov]=useState(null);
  const W=700,H=320,P={t:25,r:25,b:45,l:60};
  const cw=W-P.l-P.r,ch=H-P.t-P.b;
  const xMin=Math.min(...data.map(d=>d.revGrowth3yr))-3,xMax=Math.max(...data.map(d=>d.revGrowth3yr))+3;
  const yMax=Math.max(...data.map(d=>d.mcapC))*1.1,rMax=Math.max(...data.map(d=>d.revenueC));
  const sx=v=>P.l+((v-xMin)/(xMax-xMin))*cw,sy=v=>P.t+ch-(v/yMax)*ch,sr=v=>5+(v/rMax)*20;
  const xTicks=[],yTicks=[];
  for(let x=Math.ceil(xMin/10)*10;x<=xMax;x+=10) xTicks.push(x);
  for(let y=0;y<=yMax;y+=1000) yTicks.push(y);
  return(
    <svg viewBox={`0 0 ${W} ${H}`} style={{width:"100%",maxWidth:W,display:"block"}}>
      {yTicks.map(y=><g key={y}><line x1={P.l} x2={W-P.r} y1={sy(y)} y2={sy(y)} stroke={t.gridLine}/><text x={P.l-6} y={sy(y)+3} fill={t.chartLabel} fontSize="8" textAnchor="end" fontFamily="monospace">{fm.b(y)}</text></g>)}
      {xTicks.map(x=><g key={x}><line x1={sx(x)} x2={sx(x)} y1={P.t} y2={H-P.b} stroke={t.gridLine}/><text x={sx(x)} y={H-P.b+14} fill={t.chartLabel} fontSize="8" textAnchor="middle" fontFamily="monospace">{x}%</text></g>)}
      <line x1={sx(0)} x2={sx(0)} y1={P.t} y2={H-P.b} stroke={t.textFaint} strokeDasharray="4,3"/>
      <text x={W/2} y={H-4} fill={t.textDim} fontSize="9" textAnchor="middle">3-Year Revenue CAGR →</text>
      <text x={12} y={H/2} fill={t.textDim} fontSize="9" textAnchor="middle" transform={`rotate(-90,12,${H/2})`}>Market Cap →</text>
      {data.map(d=>{const g=GRP[d.group];const isH=hov===d.ticker;
        return(<g key={d.ticker} onMouseEnter={()=>setHov(d.ticker)} onMouseLeave={()=>setHov(null)} style={{cursor:"pointer"}}>
          <circle cx={sx(d.revGrowth3yr)} cy={sy(d.mcapC)} r={sr(d.revenueC)} fill={g.color} fillOpacity={isH?0.5:0.18} stroke={g.color} strokeWidth={isH?2:1} strokeOpacity={isH?1:0.4}/>
          {(d.mcapC>1200||isH)&&<text x={sx(d.revGrowth3yr)} y={sy(d.mcapC)-sr(d.revenueC)-3} fill={isH?t.chartHoverText:t.textDim} fontSize="8" textAnchor="middle" fontWeight={isH?700:400}>{d.name}</text>}
        </g>)})}
      {hov&&(()=>{const d=data.find(x=>x.ticker===hov);if(!d)return null;const g=GRP[d.group];return(
        <g><rect x={W-195} y={8} width={185} height={80} rx={6} fill={t.tooltipBg} stroke={t.tooltipBorder}/>
        <text x={W-185} y={24} fill={g.color} fontSize="10" fontWeight="700">{d.name} <tspan fill={t.textDim} fontWeight="400">{d.ticker}</tspan></text>
        <text x={W-185} y={38} fill={t.textMid} fontSize="8" fontFamily="monospace">Mkt Cap  {fm.b(d.mcapC,sym)}</text>
        <text x={W-185} y={50} fill={t.textMid} fontSize="8" fontFamily="monospace">Revenue  {fm.b(d.revenueC,sym)}</text>
        <text x={W-185} y={62} fill={pc(d.revGrowth3yr,20,5)} fontSize="8" fontFamily="monospace">3Y CAGR  {fm.p(d.revGrowth3yr)}</text>
        <text x={W-185} y={74} fill={pc(d.dist52wHigh,-5,-15)} fontSize="8" fontFamily="monospace">vs 52W   {fm.p(d.dist52wHigh)}</text>
        </g>)})()}
    </svg>);
}

function GroupBars({metrics,t}){
  return(
    <div style={{display:"grid",gridTemplateColumns:`repeat(${Math.min(metrics.length,3)},1fr)`,gap:10}}>
      {metrics.map((m,i)=>{const vals=["mag8","granola","terrific10"].map(g=>m[g]);const mx=Math.max(...vals.map(Math.abs));
        return(<div key={i} style={{background:t.subtleBg,borderRadius:8,padding:"10px 12px",border:`1px solid ${t.cardBorder}`}}>
            <div style={{fontSize:10,color:t.textDim,fontWeight:600,textTransform:"uppercase",letterSpacing:.5,marginBottom:8}}>{m.label}</div>
            {["mag8","granola","terrific10"].map(g=>(
              <div key={g} style={{display:"flex",alignItems:"center",gap:8,marginBottom:5}}>
                <div style={{width:58,fontSize:9,color:GRP[g].color,fontWeight:600}}>{GRP[g].short}</div>
                <div style={{flex:1,height:16,background:t.barTrack,borderRadius:4,overflow:"hidden",position:"relative"}}>
                  <div style={{height:"100%",width:`${(Math.abs(m[g])/mx)*100}%`,background:GRP[g].color,opacity:0.3,borderRadius:4}}/>
                  <span style={{position:"absolute",right:5,top:0,lineHeight:"16px",fontSize:9,fontFamily:"'Space Mono',monospace",color:t.barLabel}}>{m.fmt(m[g])}</span>
                </div></div>))}
          </div>)})}
    </div>);
}

export default function BigCorpRank(){
  const [cur,setCur]=useState("USD");
  const [sort,setSort]=useState("mcap");
  const [grp,setGrp]=useState("all");
  const [showChart,setShowChart]=useState(true);
  const [theme,setTheme]=useState("light");
  const t=THEMES[theme];
  const isDark=theme==="dark";
  const sym=CUR.find(c=>c.code===cur).sym;

  const data=useMemo(()=>STOCKS.map(s=>({...s,mcapC:cvt(s.mcap,s.currency,cur),revenueC:cvt(s.revenue,s.currency,cur),revPerEmpC:cvt(s.revPerEmp,s.currency,cur)})),[cur]);
  const rows=useMemo(()=>{let list=grp==="all"?data:data.filter(s=>s.group===grp);const sk=SORTS.find(k=>k.key===sort);const v=s=>sk.conv?s[sort+"C"]:s[sort];return[...list].sort((a,b)=>sk.desc?(v(b)??-1e9)-(v(a)??-1e9):(v(a)??1e9)-(v(b)??1e9));},[data,sort,grp]);
  const gm=useMemo(()=>{const o={};Object.keys(GRP).forEach(g=>{o[g]=data.filter(s=>s.group===g).reduce((a,s)=>a+(s.mcapC||0),0)});o.all=Object.values(o).reduce((a,b)=>a+b,0);return o;},[data]);
  const mx=Math.max(...rows.map(s=>s.mcapC||0));

  const ins=useMemo(()=>{
    const byG=g=>data.filter(s=>s.group===g);const avg=(a,k)=>a.reduce((s,x)=>s+(x[k]||0),0)/a.length;const sum=(a,k)=>a.reduce((s,x)=>s+(x[k]||0),0);const top=(k,d=true)=>[...data].sort((a,b)=>d?b[k]-a[k]:a[k]-b[k])[0];
    return{grpCAGR:Object.keys(GRP).map(g=>({g,v:avg(byG(g),"revGrowth3yr")})).sort((a,b)=>b.v-a.v),grpEmp:Object.keys(GRP).map(g=>({g,v:sum(byG(g),"employees")})).sort((a,b)=>b.v-a.v),grp52:Object.keys(GRP).map(g=>({g,v:avg(byG(g),"dist52wHigh")})).sort((a,b)=>b.v-a.v),grpDMA:Object.keys(GRP).map(g=>({g,v:avg(byG(g),"dist200dma")})).sort((a,b)=>b.v-a.v),topCAGR:top("revGrowth3yr"),topMcap:top("mcapC"),topRevEmp:top("revPerEmpC"),topDMA:top("dist200dma"),farthest52:top("dist52wHigh",false),bigEmp:top("employees")};
  },[data]);

  const badges=useMemo(()=>{const b={};b[ins.topCAGR.ticker]={label:"Fastest Grower",color:"#34d399"};b[ins.topMcap.ticker]={label:"Largest",color:"#a78bfa"};b[ins.topRevEmp.ticker]={label:"Most Efficient",color:"#38bdf8"};b[ins.bigEmp.ticker]={label:"Biggest Employer",color:"#fb923c"};b[ins.farthest52.ticker]={label:"Most Beaten Down",color:"#f87171"};return b;},[ins]);

  const grpMetrics=useMemo(()=>{
    const byG=g=>data.filter(s=>s.group===g);const avg=(a,k)=>a.reduce((s,x)=>s+(x[k]||0),0)/a.length;const sum=(a,k)=>a.reduce((s,x)=>s+(x[k]||0),0);const gs=["mag8","granola","terrific10"];
    return[{label:"Avg 3Y CAGR",...Object.fromEntries(gs.map(g=>[g,avg(byG(g),"revGrowth3yr")])),fmt:v=>`${v.toFixed(1)}%`},{label:"Total Employees",...Object.fromEntries(gs.map(g=>[g,sum(byG(g),"employees")])),fmt:v=>fm.k(v)},{label:"Avg Rev/Employee",...Object.fromEntries(gs.map(g=>[g,avg(byG(g),"revPerEmpC")])),fmt:v=>`${sym}${v.toFixed(1)}M`},{label:"Avg vs 52W High",...Object.fromEntries(gs.map(g=>[g,avg(byG(g),"dist52wHigh")])),fmt:v=>`${v.toFixed(1)}%`},{label:"Avg vs 200 DMA",...Object.fromEntries(gs.map(g=>[g,avg(byG(g),"dist200dma")])),fmt:v=>`${v>=0?"+":""}${v.toFixed(1)}%`},{label:"Combined Mkt Cap",...Object.fromEntries(gs.map(g=>[g,sum(byG(g),"mcapC")])),fmt:v=>fm.b(v,sym)}];
  },[data,sym,cur]);

  const Btn=({on,click,ch})=>(<button onClick={click} style={{padding:"5px 13px",borderRadius:6,fontSize:11,fontWeight:600,border:`1px solid ${on?t.activeBtn:t.cardBorder}`,background:on?t.activeBtnBg:"transparent",color:on?t.activeBtnText:t.inactiveBtn,cursor:"pointer",whiteSpace:"nowrap"}}>{ch}</button>);

  return(
    <div style={{minHeight:"100vh",background:t.bg,color:t.text,fontFamily:"'DM Sans',system-ui,sans-serif",transition:"background 0.2s, color 0.2s"}}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Space+Mono:wght@400;700&display=swap" rel="stylesheet"/>
      <style>{`.t td,.t th{padding:8px 10px;white-space:nowrap}.t th{position:sticky;top:0;z-index:2;background:${t.tableHeaderBg}}.t tr:hover td{background:${t.tableHover}}.st{cursor:pointer;user-select:none}.st:hover{color:${t.sortHover}!important}.badge{display:inline-block;font-size:8px;padding:1px 6px;border-radius:10px;font-weight:700;letter-spacing:.3px;margin-left:5px}`}</style>

      <header style={{background:t.headerBg,borderBottom:`1px solid ${t.headerBorder}`,padding:"18px 0 14px"}}>
        <div style={{maxWidth:1440,margin:"0 auto",padding:"0 20px"}}>
          <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:12}}>
            <div style={{width:34,height:34,borderRadius:8,background:"linear-gradient(135deg,#6366f1,#3b82f6)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:17,fontWeight:700,color:"#fff"}}>◈</div>
            <div style={{flex:1}}>
              <h1 style={{fontSize:20,fontWeight:700,margin:0,color:t.text}}>Big Corp Rank</h1>
              <p style={{fontSize:11,color:t.textDim,margin:0}}>Magnificent 8 · GRANOLA 11 · Terrific 10 — 29 stocks ranked & compared</p>
            </div>
            <button onClick={()=>setTheme(isDark?"light":"dark")} style={{padding:"5px 12px",borderRadius:6,fontSize:11,fontWeight:600,border:`1px solid ${t.cardBorder}`,background:t.subtleBg,color:t.textMid,cursor:"pointer"}}>{isDark?"☀️ Light":"🌙 Dark"}</button>
          </div>

          <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:8,marginBottom:12}}>
            {[{l:"Combined",v:gm.all,c:"#a78bfa",s:"29 companies"},{l:"🇺🇸 Mag 8",v:gm.mag8,c:"#3b82f6",s:"8 companies"},{l:"🇪🇺 GRANOLA",v:gm.granola,c:"#f59e0b",s:"11 companies"},{l:"🇨🇳 Terrific 10",v:gm.terrific10,c:"#ef4444",s:"10 companies"}].map((c,i)=>(
              <div key={i} style={{background:t.cardBg,border:`1px solid ${t.cardBorder}`,borderLeft:`3px solid ${c.c}`,borderRadius:8,padding:"9px 11px"}}>
                <div style={{fontSize:10,color:t.textDim,fontWeight:600,textTransform:"uppercase",letterSpacing:.5}}>{c.l}</div>
                <div style={{fontSize:17,fontWeight:700,color:c.c,fontFamily:"'Space Mono',monospace",margin:"1px 0"}}>{fm.b(c.v,sym)}</div>
                <div style={{fontSize:10,color:t.textFaint}}>{c.s}</div>
              </div>))}
          </div>

          <div style={{display:"flex",gap:5,flexWrap:"wrap",alignItems:"center"}}>
            {CUR.map(c=><Btn key={c.code} on={cur===c.code} click={()=>setCur(c.code)} ch={c.label}/>)}
            <div style={{width:1,height:18,background:t.cardBorder,margin:"0 3px"}}/>
            <Btn on={grp==="all"} click={()=>setGrp("all")} ch="All 29"/>
            <Btn on={grp==="mag8"} click={()=>setGrp("mag8")} ch="🇺🇸 Mag 8"/>
            <Btn on={grp==="granola"} click={()=>setGrp("granola")} ch="🇪🇺 GRANOLA"/>
            <Btn on={grp==="terrific10"} click={()=>setGrp("terrific10")} ch="🇨🇳 Terrific 10"/>
            <div style={{flex:1}}/>
            <Btn on={showChart} click={()=>setShowChart(!showChart)} ch={showChart?"Hide Charts ▲":"Show Charts ▼"}/>
          </div>
        </div>
      </header>

      <div style={{maxWidth:1440,margin:"0 auto",padding:"10px 20px 36px"}}>
        {/* INSIGHTS */}
        <div style={{margin:"12px 0",padding:"14px 16px",background:t.insightBg,borderRadius:10,border:`1px solid ${t.insightBorder}`}}>
          <div style={{fontSize:11,fontWeight:700,color:t.insightTitle,textTransform:"uppercase",letterSpacing:.8,marginBottom:10}}>📊 Market Commentary</div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"6px 24px",fontSize:12,lineHeight:1.65,color:t.textMid}}>
            <div><span style={{color:t.text,fontWeight:600}}>{ins.topCAGR.name}</span> leads all 29 with a <span style={{color:"#34d399",fontWeight:600}}>{fm.p(ins.topCAGR.revGrowth3yr)}</span> 3-year CAGR — the standout compounder.</div>
            <div><span style={{color:GRP[ins.grpCAGR[0].g].color,fontWeight:600}}>{GRP[ins.grpCAGR[0].g].label}</span> has the highest avg group CAGR at <span style={{fontWeight:600}}>{ins.grpCAGR[0].v.toFixed(1)}%</span>, vs {ins.grpCAGR[1].v.toFixed(1)}% for {GRP[ins.grpCAGR[1].g].short}.</div>
            <div><span style={{color:t.text,fontWeight:600}}>{ins.bigEmp.name}</span> is the largest employer with <span style={{fontWeight:600,color:"#fb923c"}}>{fm.k(ins.bigEmp.employees)}</span> — <span style={{color:GRP[ins.grpEmp[0].g].color}}>{GRP[ins.grpEmp[0].g].short}</span> leads with {fm.k(ins.grpEmp[0].v)} total headcount.</div>
            <div><span style={{color:t.text,fontWeight:600}}>{ins.topRevEmp.name}</span> generates the most per employee at <span style={{color:"#38bdf8",fontWeight:600}}>{fm.m(ins.topRevEmp.revPerEmpC,sym)}</span> — a capital-light machine.</div>
            <div><span style={{color:t.text,fontWeight:600}}>{ins.farthest52.name}</span> is furthest from its 52-week high at <span style={{color:"#f87171",fontWeight:600}}>{fm.p(ins.farthest52.dist52wHigh)}</span> — most beaten down of the 29.</div>
            <div><span style={{color:GRP[ins.grp52[0].g].color,fontWeight:600}}>{GRP[ins.grp52[0].g].short}</span> sits closest to 52W highs on avg ({ins.grp52[0].v.toFixed(1)}%), signaling relative momentum vs <span style={{color:GRP[ins.grp52[2].g].color}}>{GRP[ins.grp52[2].g].short}</span> ({ins.grp52[2].v.toFixed(1)}%).</div>
            <div><span style={{color:GRP[ins.grpDMA[0].g].color,fontWeight:600}}>{GRP[ins.grpDMA[0].g].short}</span> trades highest above its 200 DMA on avg (<span style={{color:"#34d399"}}>{ins.grpDMA[0].v.toFixed(1)}%</span>), indicating the strongest trend.</div>
            <div><span style={{color:t.text,fontWeight:600}}>{ins.topMcap.name}</span> holds the #1 market cap at <span style={{color:"#a78bfa",fontWeight:600}}>{fm.b(ins.topMcap.mcapC,sym)}</span>{ins.topMcap.revGrowth3yr>15?` while still growing at ${fm.p(ins.topMcap.revGrowth3yr)}.`:`.`}</div>
          </div>
        </div>

        {/* CHARTS */}
        {showChart&&(<div style={{margin:"14px 0"}}>
          <div style={{background:t.tableBg,borderRadius:10,border:`1px solid ${t.cardBorder}`,padding:14,marginBottom:14}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6}}>
              <div><span style={{fontSize:13,fontWeight:700,color:t.text}}>Size vs Growth</span><span style={{fontSize:10,color:t.textDim,marginLeft:8}}>Bubble size = Revenue</span></div>
              <div style={{display:"flex",gap:12}}>{Object.entries(GRP).map(([k,g])=>(<div key={k} style={{display:"flex",alignItems:"center",gap:4,fontSize:10,color:t.textDim}}><div style={{width:8,height:8,borderRadius:"50%",background:g.color,opacity:.5}}/>{g.short}</div>))}</div>
            </div>
            <ScatterChart data={data} sym={sym} t={t}/>
          </div>
          <div style={{background:t.tableBg,borderRadius:10,border:`1px solid ${t.cardBorder}`,padding:14}}>
            <div style={{fontSize:13,fontWeight:700,color:t.text,marginBottom:10}}>Group Head-to-Head</div>
            <GroupBars metrics={grpMetrics} t={t}/>
          </div>
        </div>)}

        {/* TABLE */}
        <div style={{overflowX:"auto",borderRadius:10,border:`1px solid ${t.cardBorder}`,background:t.tableBg,marginTop:showChart?0:12}}>
          <table className="t" style={{width:"100%",borderCollapse:"collapse",fontSize:13,minWidth:1050}}>
            <thead><tr>
              <th style={{...TH(t),width:36,textAlign:"center"}}>#</th>
              <th style={{...TH(t),textAlign:"left",minWidth:230}}>Company</th>
              {SORTS.map(sk=>(<th key={sk.key} className="st" onClick={()=>setSort(sk.key)} style={{...TH(t),textAlign:"right",color:sort===sk.key?t.sortActive:t.textFaint,borderBottom:sort===sk.key?`2px solid ${t.sortBorder}`:`1px solid ${t.tableBorder}`}}>{sk.label} {sort===sk.key?(sk.desc?"▼":"▲"):""}</th>))}
            </tr></thead>
            <tbody>
              {rows.map((s,i)=>{const g=GRP[s.group];const logo=LOGOS[s.ticker];const badge=badges[s.ticker];
                return(<tr key={s.ticker} style={{borderBottom:`1px solid ${t.tableBorder}`}}>
                    <td style={{...TD(t),textAlign:"center",fontFamily:"'Space Mono',monospace",fontSize:11,color:t.textFaint}}>{i+1}</td>
                    <td style={{...TD(t),textAlign:"left"}}>
                      <div style={{display:"flex",alignItems:"center",gap:9}}>
                        {logo?logo.icon(28):<div style={{width:28,height:28,borderRadius:7,background:`${g.color}22`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:700,color:g.color}}>{s.name.slice(0,2)}</div>}
                        <div>
                          <div style={{display:"flex",alignItems:"center",gap:5,flexWrap:"wrap"}}>
                            <span style={{fontWeight:600,fontSize:13,color:t.text}}>{s.name}</span>
                            <span style={{fontSize:9,padding:"1px 6px",borderRadius:4,background:`${g.color}14`,color:g.color,fontWeight:700}}>{s.country}</span>
                            {badge&&<span className="badge" style={{background:`${badge.color}${t.badgeBgAlpha}`,color:badge.color,border:`1px solid ${badge.color}33`}}>{badge.label}</span>}
                          </div>
                          <div style={{fontSize:10,color:t.textDim,marginTop:1}}>{s.ticker} · {s.sector}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{...TD(t),textAlign:"right"}}>
                      <div style={{fontFamily:"'Space Mono',monospace",fontSize:12,fontWeight:600,color:t.text}}>{fm.b(s.mcapC,sym)}</div>
                      <div style={{height:3,width:55,background:t.miniBarTrack,borderRadius:2,marginTop:2}}><div style={{height:3,borderRadius:2,width:`${(s.mcapC/mx)*100}%`,background:g.color}}/></div>
                    </td>
                    <td style={{...TD(t),...MO}}>{fm.b(s.revenueC,sym)}</td>
                    <td style={{...TD(t),...MO}}>{fm.k(s.employees)}</td>
                    <td style={{...TD(t),...MO}}>{fm.m(s.revPerEmpC,sym)}</td>
                    <td style={{...TD(t),...MO,color:pc(s.revGrowth3yr,20,5)}}>{fm.p(s.revGrowth3yr)}</td>
                    <td style={{...TD(t),...MO,color:pc(s.dist52wHigh,-5,-15)}}>{fm.p(s.dist52wHigh)}</td>
                    <td style={{...TD(t),...MO,color:pc(s.dist200dma,10,0)}}>{fm.p(s.dist200dma)}</td>
                  </tr>)})}
            </tbody>
          </table>
        </div>

        {/* FOOTER — GROUP EXPLAINERS */}
        <div style={{marginTop:18,display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:12}}>
          <div style={{padding:"14px 16px",background:t.cardBg,borderRadius:8,border:`1px solid ${t.cardBorder}`,borderTop:`3px solid #3b82f6`}}>
            <div style={{fontSize:12,fontWeight:700,color:"#3b82f6",marginBottom:6}}>🇺🇸 The Magnificent 8</div>
            <p style={{fontSize:11,color:t.textMid,lineHeight:1.6,margin:0}}>The eight largest US technology companies by market capitalisation. Originally the "Magnificent 7" (Apple, Microsoft, Alphabet, Amazon, NVIDIA, Meta, Tesla), the group expanded to include Broadcom as its AI-driven growth pushed it past $1T. Together they dominate global indices and account for roughly a third of the S&P 500's total value.</p>
          </div>
          <div style={{padding:"14px 16px",background:t.cardBg,borderRadius:8,border:`1px solid ${t.cardBorder}`,borderTop:`3px solid #f59e0b`}}>
            <div style={{fontSize:12,fontWeight:700,color:"#f59e0b",marginBottom:6}}>🇪🇺 The GRANOLA 11</div>
            <p style={{fontSize:11,color:t.textMid,lineHeight:1.6,margin:0}}>Europe's answer to Big Tech — an acronym coined by Goldman Sachs standing for GSK, Roche, ASML, Nestlé, Novartis, Novo Nordisk, L'Oréal, LVMH, AstraZeneca, SAP, and Sanofi. Unlike the US group which is pure tech, GRANOLA spans pharma, luxury, semiconductors, enterprise software, and consumer goods — reflecting Europe's economic diversity. Novo Nordisk's GLP-1 revolution and ASML's lithography monopoly have been the standout growth stories.</p>
          </div>
          <div style={{padding:"14px 16px",background:t.cardBg,borderRadius:8,border:`1px solid ${t.cardBorder}`,borderTop:`3px solid #ef4444`}}>
            <div style={{fontSize:12,fontWeight:700,color:"#ef4444",marginBottom:6}}>🇨🇳 The Terrific 10</div>
            <p style={{fontSize:11,color:t.textMid,lineHeight:1.6,margin:0}}>China's ten most significant listed technology and industrial champions. Led by Tencent (gaming, social, fintech) and Alibaba (e-commerce, cloud), the group includes BYD (the world's largest EV maker), Xiaomi (smartphones and now EVs), Meituan (super-app for local services), JD.com (logistics powerhouse), plus NetEase, Baidu, Geely, and SMIC. These companies represent China's push for technological self-sufficiency and its dominance in EVs, manufacturing, and digital platforms.</p>
          </div>
        </div>

        <div style={{marginTop:12,padding:"10px 14px",background:t.subtleBg,borderRadius:8,border:`1px solid ${t.cardBorder}`,fontSize:10,color:t.textDim,lineHeight:1.7}}>
          <p style={{margin:0}}>Data approximate, sourced from public filings. Market cap & prices ~early Feb 2026. Revenue = most recent TTM/FY. Exchange rates approximate. 3Y CAGR = latest FY vs 3 years prior. Not financial advice.</p>
        </div>
      </div>
    </div>);
}

const TH=(t)=>({fontSize:10,fontWeight:600,color:t.textFaint,textTransform:"uppercase",letterSpacing:.6,padding:"8px 10px",whiteSpace:"nowrap",borderBottom:`1px solid ${t.tableBorder}`});
const TD=(t)=>({padding:"8px 10px",color:t.textMid,whiteSpace:"nowrap"});
const MO={fontFamily:"'Space Mono',monospace",fontSize:12,textAlign:"right"};
