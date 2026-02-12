
// ═══ NORMALIZE DATA ═══
const GROUPS={mag8:{l:"Magnificent 8",e:"🇺🇸",c:"#00d4aa"},granola:{l:"GRANOLA 11",e:"🇪🇺",c:"#ff6b35"},terrific10:{l:"Terrific 10",e:"🇨🇳",c:"#ff3366"}};
const STOCKS={};
Object.entries(_D).forEach(([k,v])=>{STOCKS[k]={...v,name:v.n,group:v.g,accent:v.a,currency:v.cur,currencySymbol:v.cs,segments:v.seg,segmentColors:v.sc,quarterly:v.q.map(r=>({q:r[0],segments:r[1],total:r[2],oi:r[3]})),sankeyData:v.sk?{year:v.sk.y,totalRevenue:v.sk.r,segments:v.sk.s.map(([n,val])=>({name:n,value:val})),costs:v.sk.c.map(([n,val])=>({name:n,value:val})),operatingIncome:v.sk.oi}:null}});
const GT={};Object.keys(GROUPS).forEach(g=>{GT[g]=Object.keys(STOCKS).filter(t=>STOCKS[t].group===g)});

// ═══ THEMES ═══
const TH={
dark:{bg:"#08081a",cb:"#0d0d22",hb:"#12122a",br:"#1a1a3a",tx:"#e0e0e0",tm:"#7a7aaa",tf:"#5a5a8a",tv:"#3a3a6a",gs:"#1a1a3a",w:"#fff",gn:"#22c55e",rd:"#ef4444",tb:"#0d0d1a",tbr:"#2a2a4a",fi:"https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@300;400;500;600;700&display=swap",tib:"#12122a",tibr:"#1e1e3e"},
ft:{bg:"#FFF1E5",cb:"#FFFFFF",hb:"#F2DFCE",br:"#E0CEBC",tx:"#33302E",tm:"#66605C",tf:"#99918B",tv:"#B3ACA7",gs:"#E0CEBC",w:"#1A1817",gn:"#09804C",rd:"#CC0000",tb:"#FFFFFF",tbr:"#E0CEBC",fi:"https://fonts.googleapis.com/css2?family=Source+Serif+4:wght@300;400;500;600;700&display=swap",tib:"#F2DFCE",tibr:"#D4C4B3"},
};

// ═══ SANKEY ═══
function Sankey({data,theme,accent,segmentColors,cs}){
  const t=TH[theme];if(!data)return<div style={{color:t.tm,fontSize:12}}>No Sankey data</div>;
  const W=800,H=500,nW=18,c0=40,c1=300,c2=580,uH=H-60,sY=30;
  const{totalRevenue:tR,segments:segs,costs,operatingIncome:oi}=data;
  const sT=segs.reduce((a,b)=>a+b.value,0);
  const sG=Math.min(8,(uH-segs.length*20)/(segs.length+1));
  const sAH=uH-sG*(segs.length-1);
  let sy=sY;const mN=segs.map((sg,i)=>{const h=Math.max(14,(sg.value/sT)*sAH);const n={x:c1,y:sy,h,v:sg.value,l:sg.name,c:segmentColors[i%segmentColors.length]};sy+=h+sG;return n});
  const rI=[...costs.map(c=>({...c,tp:"cost"})),{name:"Operating Income",value:oi,tp:"profit"}];
  const rT=rI.reduce((a,b)=>a+b.value,0);const rG=Math.min(8,(uH-rI.length*14)/(rI.length+1));const rAH=uH-rG*(rI.length-1);
  let ry=sY;const rN=rI.map(it=>{const h=Math.max(14,(it.value/rT)*rAH);const n={x:c2,y:ry,h,v:it.value,l:it.name,tp:it.tp};ry+=h+rG;return n});
  const mp=(x0,y0,h0,x1,y1,h1)=>{const mx=(x0+x1)/2;return`M${x0},${y0} C${mx},${y0} ${mx},${y1} ${x1},${y1} L${x1},${y1+h1} C${mx},${y1+h1} ${mx},${y0+h0} ${x0},${y0+h0} Z`};
  let lo=0;const fLM=mN.map(mn=>{const sh=mn.v/tR;const h0=sh*uH;const y0=sY+lo;lo+=h0;return{p:mp(c0+nW,y0,h0,mn.x,mn.y,mn.h),c:mn.c,o:0.35}});
  let rO=rN.map(()=>0),mO=mN.map(()=>0);const fMR=[];
  rN.forEach((rn,ri)=>{mN.forEach((mn,mi)=>{const fl=(mn.v/sT)*rn.v;const fhM=(fl/mn.v)*mn.h;const fhR=(fl/rn.v)*rn.h;fMR.push({p:mp(mn.x+nW,mn.y+mO[mi],fhM,rn.x,rn.y+rO[ri],fhR),c:rn.tp==="profit"?(theme==="ft"?"#09804C":"#22c55e"):mn.c,o:rn.tp==="profit"?0.4:0.15});mO[mi]+=fhM;rO[ri]+=fhR})});
  const ff=theme==="ft"?"'Source Serif 4',Georgia,serif":"'JetBrains Mono',monospace";
  return<div style={{overflowX:"auto"}}><svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{maxHeight:520}}>
    {fLM.map((f,i)=><path key={`l${i}`} d={f.p} fill={f.c} opacity={f.o}/>)}
    {fMR.map((f,i)=><path key={`r${i}`} d={f.p} fill={f.c} opacity={f.o}/>)}
    <rect x={c0} y={sY} width={nW} height={uH} fill={accent} rx={3}/>
    <text x={c0-4} y={sY+uH/2-8} textAnchor="end" fill={t.w} fontSize={11} fontWeight={600} fontFamily={ff}>Total Revenue</text>
    <text x={c0-4} y={sY+uH/2+8} textAnchor="end" fill={accent} fontSize={13} fontWeight={700} fontFamily={ff}>{cs}{tR>=100?tR.toFixed(0):tR.toFixed(1)}B</text>
    {mN.map((mn,i)=><g key={`m${i}`}><rect x={mn.x} y={mn.y} width={nW} height={mn.h} fill={mn.c} rx={2}/>
      <text x={mn.x+nW+6} y={mn.y+mn.h/2+1} dominantBaseline="middle" fill={t.tx} fontSize={10} fontFamily={ff}>{mn.l}</text>
      <text x={mn.x+nW+6} y={mn.y+mn.h/2+13} dominantBaseline="middle" fill={t.tm} fontSize={9} fontFamily={ff}>{cs}{mn.v.toFixed(1)}B ({((mn.v/tR)*100).toFixed(0)}%)</text></g>)}
    {rN.map((rn,i)=><g key={`r${i}`}><rect x={rn.x} y={rn.y} width={nW} height={rn.h} fill={rn.tp==="profit"?(theme==="ft"?"#09804C":"#22c55e"):(theme==="ft"?"#CC0000":"#ef4444")} rx={2} opacity={rn.tp==="profit"?1:0.7}/>
      <text x={rn.x+nW+6} y={rn.y+rn.h/2-1} dominantBaseline="middle" fill={rn.tp==="profit"?(theme==="ft"?"#09804C":"#22c55e"):t.tx} fontSize={rn.tp==="profit"?11:10} fontWeight={rn.tp==="profit"?700:400} fontFamily={ff}>{rn.l}</text>
      <text x={rn.x+nW+6} y={rn.y+rn.h/2+12} dominantBaseline="middle" fill={t.tm} fontSize={9} fontFamily={ff}>{cs}{rn.v.toFixed(1)}B</text></g>)}
  </svg></div>;
}

// ═══ MAIN DASHBOARD ═══
const TABS=["Y/Y Growth","Revenue Mix","Sankey","Geographic","Summary"];

export default function SegmentDashboard(){
  const[stock,setStock]=useState("AMZN");
  const[theme,setTheme]=useState("dark");
  const[tab,setTab]=useState(0);
  const[group,setGroup]=useState("mag8");
  const s=STOCKS[stock];const t=TH[theme];const cs=s.currencySymbol;
  const isFT=theme==="ft";
  const ff=isFT?"'Source Serif 4',Georgia,serif":"'JetBrains Mono','SF Mono',monospace";
  const periodLen=s.quarterly[0]?.q.startsWith("H")?2:4;
  const fmtVal=(v)=>v>=100?v.toFixed(0):v.toFixed(1);

  // Y/Y growth
  const yoyData=s.quarterly.map((d,i)=>{if(i<periodLen)return null;const prev=s.quarterly[i-periodLen];const g={};s.segments.forEach((seg,si)=>{g[seg]=prev.segments[si]>0?parseFloat(((d.segments[si]/prev.segments[si]-1)*100).toFixed(1)):null});return{q:d.q,...g}}).filter(Boolean);
  // Revenue mix
  const mixData=s.quarterly.map(d=>{const o={q:d.q};s.segments.forEach((seg,si)=>{o[seg]=parseFloat(((d.segments[si]/d.total)*100).toFixed(1))});return o});
  // Annual
  const years=[];for(let i=0;i<s.quarterly.length;i+=periodLen){const ch=s.quarterly.slice(i,i+periodLen);if(ch.length<periodLen)break;const yr="FY20"+ch[0].q.split("'")[1];years.push({year:yr,segments:s.segments.map((_,si)=>ch.reduce((sum,q)=>sum+q.segments[si],0)),total:ch.reduce((sum,q)=>sum+q.total,0),oi:ch.reduce((sum,q)=>sum+q.oi,0)})}

  const latest=s.quarterly[s.quarterly.length-1];
  const prevY=s.quarterly.length>periodLen?s.quarterly[s.quarterly.length-1-periodLen]:null;
  const latestYoY=prevY?((latest.total/prevY.total-1)*100).toFixed(1):"—";
  const oiM=((latest.oi/latest.total)*100).toFixed(1);
  const groupTickers=GT[group]||[];
  const geoEntries=s.geo?Object.entries(s.geo):[];
  const geoColors=["#6366f1","#3b82f6","#22c55e","#f59e0b","#e94560","#06b6d4","#8b5cf6","#ff6b35"];

  const CTooltip=({active,payload,label})=>{if(!active||!payload)return null;return<div style={{background:t.tb,border:`1px solid ${t.tbr}`,borderRadius:6,padding:"10px 14px",fontSize:11,color:t.tx,fontFamily:ff}}>
    <div style={{fontWeight:700,marginBottom:6,color:t.w,fontSize:12}}>{label}</div>
    {payload.map((p,i)=><div key={i} style={{display:"flex",justifyContent:"space-between",gap:20,marginBottom:2}}><span style={{color:p.color}}>{p.name}</span><span style={{fontWeight:600}}>{typeof p.value==="number"?p.value.toFixed(1)+"%":p.value}</span></div>)}
  </div>};

  const shortTicker=(tk)=>tk.replace(".HK","").replace(".SW","").replace(".PA","");

  return<div style={{fontFamily:ff,background:t.bg,color:t.tx,minHeight:"100vh",padding:"24px 20px"}}>
    <style>{`@import url('${t.fi}');@import url('https://fonts.googleapis.com/css2?family=Source+Serif+4:wght@300;400;500;600;700&display=swap');*{box-sizing:border-box}.recharts-cartesian-grid-horizontal line,.recharts-cartesian-grid-vertical line{stroke:${t.gs}!important}::selection{background:${s.accent}44}`}</style>

    {/* GROUP TABS */}
    <div style={{display:"flex",gap:8,marginBottom:16,flexWrap:"wrap",alignItems:"center"}}>
      {Object.entries(GROUPS).map(([gk,gv])=><button key={gk} onClick={()=>{setGroup(gk);setStock(GT[gk][0]);setTab(0)}}
        style={{padding:"8px 16px",fontSize:12,fontWeight:group===gk?700:400,fontFamily:"inherit",background:group===gk?gv.c+"22":t.tib,color:group===gk?gv.c:t.tm,border:group===gk?`2px solid ${gv.c}`:`1px solid ${t.tibr}`,borderRadius:8,cursor:"pointer",transition:"all 0.2s"}}>
        {gv.e} {gv.l} <span style={{opacity:0.6,fontSize:10,marginLeft:4}}>({GT[gk].length})</span>
      </button>)}
      <button onClick={()=>setTheme(isFT?"dark":"ft")} style={{marginLeft:"auto",padding:"6px 16px",fontSize:10,fontFamily:"inherit",background:isFT?"#1A1817":"#FFF1E5",color:isFT?"#FFF1E5":"#1A1817",border:`1px solid ${t.br}`,borderRadius:4,cursor:"pointer",fontWeight:600}}>
        {theme==="dark"?"☀ FT MODE":"● DARK MODE"}
      </button>
    </div>

    {/* STOCK PILLS */}
    <div style={{display:"flex",gap:4,flexWrap:"wrap",marginBottom:20}}>
      {groupTickers.map(tk=><button key={tk} onClick={()=>{setStock(tk);setTab(0)}}
        style={{padding:"5px 10px",fontSize:10,fontWeight:stock===tk?700:400,fontFamily:"inherit",background:stock===tk?STOCKS[tk].accent:t.tib,color:stock===tk?"#fff":t.tm,border:stock===tk?"none":`1px solid ${t.tibr}`,borderRadius:4,cursor:"pointer",transition:"all 0.2s"}}>
        {shortTicker(tk)} {STOCKS[tk].currency!=="USD"?<span style={{opacity:0.5,fontSize:8}}>{STOCKS[tk].currency}</span>:null}
      </button>)}
    </div>

    {/* HEADER */}
    <div style={{marginBottom:24}}>
      <div style={{display:"flex",alignItems:"baseline",gap:12,marginBottom:4,flexWrap:"wrap"}}>
        <span style={{fontSize:28,fontWeight:700,color:t.w}}>{shortTicker(stock)}</span>
        <span style={{fontSize:14,color:s.accent,fontWeight:500}}>{s.name}</span>
        <span style={{fontSize:10,color:t.tm,background:GROUPS[s.group].c+"22",padding:"2px 8px",borderRadius:4,border:`1px solid ${GROUPS[s.group].c}44`}}>{GROUPS[s.group].l}</span>
        {s.note&&<span style={{fontSize:9,color:t.tf,background:t.tib,padding:"2px 6px",borderRadius:3}}>📋 {s.note}</span>}
      </div>
      <div style={{fontSize:11,color:t.tf,letterSpacing:isFT?0.3:1}}>
        {s.quarterly[0].q} → {latest.q} · {s.quarterly.length} {s.quarterly[0]?.q.startsWith("H")?"HALVES":"QUARTERS"} · LATEST: {cs}{fmtVal(latest.total)}B · Y/Y: {latestYoY}% · OI: {oiM}% · {s.currency}
      </div>
    </div>

    {/* TAB BAR */}
    <div style={{display:"flex",gap:4,marginBottom:24,flexWrap:"wrap"}}>
      {TABS.map((tb,i)=><button key={i} onClick={()=>setTab(i)} style={{padding:"8px 16px",fontSize:11,fontWeight:tab===i?700:400,fontFamily:"inherit",background:tab===i?s.accent:t.tib,color:tab===i?"#fff":t.tm,border:tab===i?"none":`1px solid ${t.tibr}`,borderRadius:6,cursor:"pointer",transition:"all 0.2s"}}>{tb}</button>)}
    </div>

    {/* TAB 0: Y/Y Growth */}
    {tab===0&&<div>
      <div style={{marginBottom:12,fontSize:11,color:t.tm}}>{s.quarterly[0]?.q.startsWith("H")?"SEMI-ANNUAL":"QUARTERLY"} Y/Y REVENUE GROWTH BY SEGMENT (%) · {s.currency}</div>
      <div style={{background:t.cb,borderRadius:12,padding:"20px 10px 10px 0",border:`1px solid ${t.br}`}}>
        <ResponsiveContainer width="100%" height={380}>
          <LineChart data={yoyData} margin={{top:5,right:20,left:10,bottom:5}}>
            <CartesianGrid strokeDasharray="3 3" stroke={t.gs}/><XAxis dataKey="q" tick={{fontSize:10,fill:t.tf}} tickLine={false}/><YAxis tick={{fontSize:10,fill:t.tf}} tickLine={false} tickFormatter={v=>v+"%"}/>
            <Tooltip content={<CTooltip/>}/><Legend wrapperStyle={{fontSize:10,paddingTop:8}}/>
            {s.segments.map((seg,i)=><Line key={seg} type="monotone" dataKey={seg} stroke={s.segmentColors[i]} strokeWidth={i===0?3:i<3?2:1.5} dot={{r:i===0?4:3,fill:s.segmentColors[i]}}/>)}
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(140px,1fr))",gap:10,marginTop:16}}>
        {s.segments.map((seg,i)=>{const lv=latest.segments[i];const pv=prevY?prevY.segments[i]:null;const yoy=pv&&pv>0?((lv/pv-1)*100).toFixed(0):"—";
          return<div key={seg} style={{background:t.cb,borderRadius:10,padding:"12px 14px",border:`1px solid ${t.br}`,borderLeft:`3px solid ${s.segmentColors[i]}`}}>
            <div style={{fontSize:9,color:t.tm,marginBottom:4,letterSpacing:1,textTransform:"uppercase"}}>{seg}</div>
            <div style={{fontSize:20,fontWeight:700,color:s.segmentColors[i]}}>{yoy}%</div>
            <div style={{fontSize:9,color:t.tf,marginTop:2}}>{cs}{fmtVal(lv)}B in {latest.q}</div>
          </div>})}
      </div>
    </div>}

    {/* TAB 1: Revenue Mix */}
    {tab===1&&<div>
      <div style={{marginBottom:12,fontSize:11,color:t.tm}}>REVENUE MIX (% OF TOTAL) · {s.currency}</div>
      <div style={{background:t.cb,borderRadius:12,padding:"20px 10px 10px 0",border:`1px solid ${t.br}`}}>
        <ResponsiveContainer width="100%" height={400}>
          <AreaChart data={mixData} margin={{top:5,right:20,left:10,bottom:5}}>
            <CartesianGrid strokeDasharray="3 3" stroke={t.gs}/><XAxis dataKey="q" tick={{fontSize:10,fill:t.tf}} tickLine={false}/><YAxis tick={{fontSize:10,fill:t.tf}} tickLine={false} tickFormatter={v=>v+"%"} domain={[0,100]}/>
            <Tooltip content={<CTooltip/>}/><Legend wrapperStyle={{fontSize:10,paddingTop:8}}/>
            {s.segments.map((seg,i)=><Area key={seg} type="monotone" dataKey={seg} stackId="1" stroke={s.segmentColors[i]} fill={s.segmentColors[i]}/>)}
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>}

    {/* TAB 2: Sankey */}
    {tab===2&&<div>
      <div style={{marginBottom:12,fontSize:11,color:t.tm}}>HOW {shortTicker(stock)} MAKES MONEY · {s.sankeyData?.year} · REVENUE → SEGMENTS → COSTS & PROFIT ({cs}B)</div>
      <div style={{background:t.cb,borderRadius:12,padding:"20px 16px",border:`1px solid ${t.br}`}}>
        <Sankey data={s.sankeyData} theme={theme} accent={s.accent} segmentColors={s.segmentColors} cs={cs}/>
      </div>
      <div style={{fontSize:10,color:t.tf,marginTop:12}}>OI margin: {s.sankeyData?((s.sankeyData.operatingIncome/s.sankeyData.totalRevenue)*100).toFixed(1):"—"}% · Reported in {s.currency}</div>
    </div>}

    {/* TAB 3: Geographic */}
    {tab===3&&<div>
      <div style={{marginBottom:12,fontSize:11,color:t.tm}}>GEOGRAPHIC REVENUE SPLIT · ANNUAL (% OF TOTAL)</div>
      {geoEntries.length>0?<div>
        {/* Horizontal stacked bar */}
        <div style={{background:t.cb,borderRadius:12,padding:"24px 20px",border:`1px solid ${t.br}`,marginBottom:16}}>
          <div style={{display:"flex",height:48,borderRadius:8,overflow:"hidden",marginBottom:16}}>
            {geoEntries.map(([region,pct],i)=><div key={region} style={{width:`${pct}%`,background:geoColors[i%geoColors.length],display:"flex",alignItems:"center",justifyContent:"center",fontSize:pct>8?11:9,fontWeight:600,color:"#fff",minWidth:pct>3?0:"auto",transition:"all 0.3s"}} title={`${region}: ${pct}%`}>
              {pct>=8?`${region} ${pct}%`:pct>=4?`${pct}%`:""}
            </div>)}
          </div>
          <div style={{display:"flex",gap:16,flexWrap:"wrap"}}>
            {geoEntries.map(([region,pct],i)=><div key={region} style={{display:"flex",alignItems:"center",gap:6}}>
              <div style={{width:12,height:12,borderRadius:2,background:geoColors[i%geoColors.length]}}/>
              <span style={{fontSize:11,color:t.tx}}>{region}</span>
              <span style={{fontSize:11,color:t.tm,fontWeight:600}}>{pct}%</span>
            </div>)}
          </div>
        </div>
        {/* Group comparison */}
        <div style={{fontSize:11,color:t.tf,marginTop:8}}>Geographic splits are annual estimates based on latest filings. Updated annually.</div>
      </div>:<div style={{color:t.tm,fontSize:12}}>No geographic data available.</div>}
    </div>}

    {/* TAB 4: Summary */}
    {tab===4&&<div>
      <div style={{marginBottom:12,fontSize:11,color:t.tm}}>ANNUAL REVENUE BY SEGMENT ({cs}B) & Y/Y GROWTH · {s.currency}</div>
      <div style={{overflowX:"auto"}}>
        <table style={{width:"100%",borderCollapse:"collapse",fontSize:11,background:t.cb,borderRadius:12,overflow:"hidden"}}>
          <thead><tr style={{background:t.hb,borderBottom:`1px solid ${t.br}`}}>
            <th style={{padding:"10px 12px",textAlign:"left",color:t.tm,fontWeight:600}}>Segment</th>
            {years.map((yr,yi)=><th key={yi} style={{padding:"10px 12px",textAlign:"right",color:t.tm,fontWeight:600}}>{yr.year}</th>)}
            {years.length>1&&<th style={{padding:"10px 12px",textAlign:"right",color:t.tm,fontWeight:600}}>Δ Y/Y</th>}
          </tr></thead>
          <tbody>
            {s.segments.map((seg,si)=><tr key={si} style={{borderBottom:`1px solid ${t.br}`}}>
              <td style={{padding:"10px 12px",color:s.segmentColors[si],fontWeight:600}}>{seg}</td>
              {years.map((yr,yi)=><td key={yi} style={{padding:"10px 12px",textAlign:"right"}}>{cs}{fmtVal(yr.segments[si])}B</td>)}
              {years.length>1&&(()=>{const l=years[years.length-1].segments[si];const p=years[years.length-2].segments[si];const g=p>0?((l/p-1)*100).toFixed(1):"—";return<td style={{padding:"10px 12px",textAlign:"right",color:parseFloat(g)>=0?t.gn:t.rd,fontWeight:600}}>{g}%</td>})()}
            </tr>)}
            <tr style={{borderTop:`2px solid ${s.accent}`,background:t.hb}}>
              <td style={{padding:"10px 12px",fontWeight:700,color:t.w}}>Total</td>
              {years.map((yr,yi)=><td key={yi} style={{padding:"10px 12px",textAlign:"right",fontWeight:700,color:t.w}}>{cs}{fmtVal(yr.total)}B</td>)}
              {years.length>1&&(()=>{const g=((years[years.length-1].total/years[years.length-2].total-1)*100).toFixed(1);return<td style={{padding:"10px 12px",textAlign:"right",color:t.gn,fontWeight:700}}>{g}%</td>})()}
            </tr>
            <tr style={{borderTop:`1px solid ${t.br}`}}>
              <td style={{padding:"10px 12px",fontWeight:600,color:t.tm}}>Op. Income</td>
              {years.map((yr,yi)=><td key={yi} style={{padding:"10px 12px",textAlign:"right",color:s.accent,fontWeight:600}}>{cs}{fmtVal(yr.oi)}B</td>)}
              {years.length>1&&(()=>{const prev=years[years.length-2].oi;const g=prev>0?((years[years.length-1].oi/prev-1)*100).toFixed(1):"—";return<td style={{padding:"10px 12px",textAlign:"right",color:t.gn,fontWeight:600}}>{g}%</td>})()}
            </tr>
            <tr><td style={{padding:"10px 12px",fontWeight:600,color:t.tf}}>OI Margin</td>
              {years.map((yr,yi)=><td key={yi} style={{padding:"10px 12px",textAlign:"right",color:t.tf}}>{((yr.oi/yr.total)*100).toFixed(1)}%</td>)}
              {years.length>1&&<td/>}
            </tr>
          </tbody>
        </table>
      </div>
    </div>}

    {/* FOOTER */}
    <div style={{marginTop:32,paddingTop:16,borderTop:`1px solid ${t.br}`,fontSize:10,color:t.tv,lineHeight:1.5}}>
      29 stocks · 8 currencies · Mag 8 🇺🇸 · GRANOLA 11 🇪🇺 · Terrific 10 🇨🇳 · Data: SEC/HKEx/Euronext/SIX filings. All figures in native currency ({s.currency}).
      {isFT?" · FT Mode.":" · Terminal theme."}
    </div>
  </div>;
}
