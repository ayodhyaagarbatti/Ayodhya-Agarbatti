/* ================================================================
   JĀTHAKA ENGINE - extended sections (panchanga, jaimini, shadbala,
   doshas, gochara, bhava chalit). Extends window.JATHAKA.
   ================================================================ */
(function(){
const J=window.JATHAKA, X=J._, A=X.A;
const D2R=Math.PI/180,R2D=180/Math.PI, norm=J.norm360, signOf=J.signOf, nakOf=J.nakOf;
const SIGN_LORD=J.SIGN_LORD, PLANETS=J.PLANETS, EXALT=X.EXALT;
const arcdist=(a,b)=>{let d=Math.abs(norm(a)-norm(b));return d>180?360-d:d;};
const J2000=2451545.0, YEAR=365.2425, EPOCH=Date.UTC(2000,0,1,12);
const jd2date=jd=>new Date(EPOCH+(jd-J2000)*86400000);
const date2jd=dt=>J2000+(dt.getTime()-EPOCH)/86400000;

/* ---------------- Panchanga ---------------- */
const TITHI=["Pratipada","Dwitiya","Tritiya","Chaturthi","Panchami","Shashthi","Saptami","Ashtami","Navami","Dashami","Ekadashi","Dwadashi","Trayodashi","Chaturdashi","Purnima"];
const KARANA_MOV=["Bava","Balava","Kaulava","Taitila","Gara","Vanija","Vishti"];
const YOGA27=["Vishkambha","Priti","Ayushman","Saubhagya","Shobhana","Atiganda","Sukarma","Dhriti","Shula","Ganda","Vriddhi","Dhruva","Vyaghata","Harshana","Vajra","Siddhi","Vyatipata","Variyana","Parigha","Shiva","Siddha","Sadhya","Shubha","Shukla","Brahma","Indra","Vaidhriti"];
const WEEKDAY=["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
const WEEKLORD=[0,1,2,3,4,5,6]; // Sun Moon Mars Merc Jup Ven Sat
function panchanga(chart){
  const sun=chart.planets[0].lon, moon=chart.planets[1].lon;
  const diff=norm(moon-sun);
  const ti=Math.floor(diff/12); // 0..29
  const paksha=ti<15?"Shukla":"Krishna";
  const tithiName=TITHI[ti%15];
  // karana
  const k=Math.floor(diff/6); let karana;
  if(k===0)karana="Kimstughna"; else if(k>=1&&k<=56)karana=KARANA_MOV[(k-1)%7];
  else karana=["Shakuni","Chatushpada","Naga"][k-57];
  // yoga
  const yg=YOGA27[Math.floor(norm(sun+moon)/(360/27))%27];
  // vaara from local civil date
  const dt=chart.input; const wd=new Date(Date.UTC(dt.y,dt.mo-1,dt.d)).getUTCDay();
  return {tithi:`${paksha} ${tithiName}`,tithiIdx:ti,paksha,karana,yoga:yg,vaara:WEEKDAY[wd],vaaraIdx:wd,
    sunSignWestern:signOf(sun+J.ayanamsa(chart.jd))};
}

/* ---------------- Avakhada Chakra ---------------- */
const NAK_YONI=["Horse","Elephant","Sheep","Serpent","Serpent","Dog","Cat","Sheep","Cat","Rat","Rat","Cow","Buffalo","Tiger","Buffalo","Tiger","Deer","Deer","Dog","Monkey","Mongoose","Monkey","Lion","Horse","Lion","Cow","Elephant"];
const NAK_GANA=["Deva","Manushya","Rakshasa","Manushya","Deva","Manushya","Deva","Deva","Rakshasa","Rakshasa","Manushya","Manushya","Deva","Rakshasa","Deva","Rakshasa","Deva","Rakshasa","Rakshasa","Manushya","Manushya","Deva","Rakshasa","Rakshasa","Manushya","Manushya","Deva"];
const NAK_NADI=["Aadi","Madhya","Antya","Antya","Madhya","Aadi","Aadi","Madhya","Antya","Antya","Madhya","Aadi","Aadi","Madhya","Antya","Antya","Madhya","Aadi","Aadi","Madhya","Antya","Antya","Madhya","Aadi","Aadi","Madhya","Antya"];
const NAK_DEITY=["Ashwini Kumaras","Yama","Agni","Brahma","Soma (Chandra)","Rudra","Aditi","Brihaspati","Sarpas (Nagas)","Pitris","Bhaga","Aryaman","Savitar (Surya)","Vishwakarma","Vayu","Indra-Agni","Mitra","Indra","Nirriti","Apas (Waters)","Vishwadevas","Vishnu","Vasus","Varuna","Aja Ekapada","Ahir Budhnya","Pushan"];
const VARNA=["Kshatriya","Vaishya","Shudra","Brahmin","Kshatriya","Vaishya","Shudra","Brahmin","Kshatriya","Vaishya","Shudra","Brahmin"]; // by rashi
const VASHYA=["Chatushpada","Chatushpada","Manav (Nara)","Jalachara","Vanachara","Manav (Nara)","Manav (Nara)","Keeta (Jalachara)","Manav/Chatushpada","Jalachara/Chatushpada","Manav (Nara)","Jalachara"];
const TATVA=["Agni (Fire)","Prithvi (Earth)","Vayu (Air)","Jala (Water)","Agni (Fire)","Prithvi (Earth)","Vayu (Air)","Jala (Water)","Agni (Fire)","Prithvi (Earth)","Vayu (Air)","Jala (Water)"];
const PAYA=["Gold (Swarna)","Silver (Rajata)","Copper (Tamra)","Iron (Loha)"];
function avakhada(chart){
  const moon=chart.planets[1]; const nk=moon.nak.idx; const rashi=moon.sign;
  const nakLord=[8,5,0,1,2,7,4,6,3][nk%9];
  return {nakLord:PLANETS[nakLord],yoni:NAK_YONI[nk],gana:NAK_GANA[nk],nadi:NAK_NADI[nk],
    deity:NAK_DEITY[nk],varna:VARNA[rashi],vashya:VASHYA[rashi],tatva:TATVA[rashi],paya:PAYA[nk%4]};
}

/* ---------------- Functional nature / Yogakaraka ---------------- */
function ownsHouses(pi,ascSign){const out=[];for(let s=0;s<12;s++)if(SIGN_LORD[s]===pi)out.push(((s-ascSign)%12+12)%12+1);return out;}
function functionalNature(chart){
  const asc=chart.ascSign; const kendra=[1,4,7,10],trikona=[1,5,9];
  let yogakaraka=[];
  const roles={};
  for(let pi=0;pi<7;pi++){
    const h=ownsHouses(pi,asc);
    const ownsK=h.some(x=>kendra.includes(x)&&x!==1), ownsT=h.some(x=>trikona.includes(x)&&x!==1);
    if(ownsK&&ownsT)yogakaraka.push(pi);
    let role="neutral";
    if(h.some(x=>[5,9].includes(x)))role="benefic";
    if(h.some(x=>[6,8,11].includes(x)))role= role==="benefic"?"mixed":"malefic";
    if(h.some(x=>[2,7].includes(x)))role="maraka";
    roles[pi]={houses:h,role};
  }
  const benefics=[],malefics=[],marakas=[];
  for(let pi=0;pi<7;pi++){const r=roles[pi].role;
    if(r==="benefic")benefics.push(pi); if(r==="malefic")malefics.push(pi); if(r==="maraka")marakas.push(pi);}
  return {yogakaraka,roles,benefics,malefics,marakas};
}

/* ---------------- Aspects (Graha Drishti, whole-sign) ---------------- */
const SPECIAL={2:[4,7,8],4:[5,7,9],6:[3,7,10],7:[5,7,9],8:[5,7,9]}; // Mars,Jup,Sat,Rahu,Ketu
function aspects(chart){
  return chart.planets.map(p=>{
    const list=SPECIAL[p.i]||[7];
    const houses=list.map(a=>((p.house-1+a-1)%12)+1);
    return {i:p.i,house:p.house,aspects:[...new Set(houses)].sort((a,b)=>a-b)};
  });
}

/* ---------------- Friendships & Avastha ---------------- */
const NAT_FRIEND={0:{f:[1,2,4],e:[5,6],n:[3]},1:{f:[0,3],e:[],n:[2,4,5,6]},2:{f:[0,1,4],e:[3],n:[5,6]},
  3:{f:[0,5],e:[1],n:[2,4,6]},4:{f:[0,1,2],e:[3,5],n:[6]},5:{f:[3,6],e:[0,1],n:[2,4]},6:{f:[3,5],e:[0,1,2],n:[4]}};
function compoundRel(pi,other,chart){
  if(pi===other)return"self";
  const nat=NAT_FRIEND[pi]; let n=nat.f.includes(other)?1:nat.e.includes(other)?-1:0;
  // temporary: 2,3,4,10,11,12 from planet => friend
  const d=((chart.planets[other].sign-chart.planets[pi].sign)%12+12)%12+1;
  const t=[2,3,4,10,11,12].includes(d)?1:-1;
  const c=n+t;
  return c>=2?"Best":c===1?"Friend":c===0?"Neutral":c===-1?"Enemy":"Worst";
}
const BALADI=["Bala (infant)","Kumara (youth)","Yuva (adult)","Vriddha (old)","Mrita (dead)"];
function avasthas(chart){
  return chart.planets.slice(0,7).map(p=>{
    const deg=p.lon%30; const odd=(p.sign%2===0);
    let idx=Math.floor(deg/6); if(!odd)idx=4-idx;
    const lord=SIGN_LORD[p.sign];
    const rel=compoundRel(p.i,lord,chart);
    // shadvarga dignity count (approx): D1,D2,D3,D9,D12,D30 own/exalt/friend
    let good=0; [1,2,3,9,12,30].forEach(Dv=>{const vs=X.vargaSign(p.lon,Dv);
      const vl=SIGN_LORD[vs]; if(vl===p.i)good++; else if(EXALT[p.i]&&EXALT[p.i][0]===vs)good++;
      else{const nf=NAT_FRIEND[p.i]; if(nf&&nf.f.includes(vl))good++;}});
    return {i:p.i,inSign:PLANETS[lord],compound:p.i===lord?"Own":rel,avastha:BALADI[idx],varga:`${good} / 6`};
  });
}

/* ---------------- Arudha padas & Jaimini points ---------------- */
function arudhaOf(house,chart){
  const asc=chart.ascSign; const signH=(asc+house-1)%12; const lord=SIGN_LORD[signH];
  const lordSign=chart.planets[lord].sign;
  const cnt=((lordSign-signH)%12+12)%12; let ar=(lordSign+cnt)%12;
  if(ar===signH||ar===(signH+6)%12)ar=(ar+9)%12;
  return ar;
}
function jaimini(chart){
  const asc=chart.ascSign;
  const arudhas={}; for(let h=1;h<=12;h++)arudhas[h]=arudhaOf(h,chart);
  const AL=arudhas[1], UL=arudhas[12];
  const ck=J.charaKarakas(chart.planets); const ak=ck[0];
  const karakamsa=X.vargaSign(chart.planets[ak.i].lon,9);
  const ishta12=(karakamsa+11)%12; const ishtaLord=SIGN_LORD[ishta12];
  // Yogi/Avayogi
  const yogiPt=norm(chart.planets[0].lon+chart.planets[1].lon+93+20/60);
  const yogiNak=nakOf(yogiPt).idx; const yogiLord=[8,5,0,1,2,7,4,6,3][yogiNak%9];
  const avaNak=(yogiNak+5)%27; const avaLord=[8,5,0,1,2,7,4,6,3][avaNak%27%9];
  // Sree lagna (traditional: moon's nakshatra fraction added to lagna)
  const span=360/27; const frac=(chart.planets[1].lon%span)/span;
  const sreeLagna=norm(chart.asc+frac*360);
  return {arudhas,AL,UL,karakamsa,ak,ishta12,ishtaLord:PLANETS[ishtaLord],
    yogiPt,yogiNak,yogiLord:PLANETS[yogiLord],avaNak,avaLord:PLANETS[avaLord],
    sreeLagnaSign:signOf(sreeLagna)};
}
const ISHTA_DEV={0:"Surya / Shiva",1:"Parvati / Gauri",2:"Kartikeya / Hanuman",3:"Vishnu",4:"Brahma / Vishnu",5:"Lakshmi",6:"Shani / Hanuman",7:"Durga",8:"Ganesha"};

/* ---------------- Upagrahas ---------------- */
function upagrahas(chart){
  const sun=chart.planets[0].lon;
  const dhuma=norm(sun+133+20/60);
  const vyatipata=norm(360-dhuma);
  const parivesha=norm(vyatipata+180);
  const indrachapa=norm(360-parivesha);
  const upaketu=norm(indrachapa+16+40/60);
  const list=[["Dhuma",dhuma,"Point of dissatisfaction / detachment"],
    ["Vyatipata",vyatipata,"Caution / calamity-averting point"],
    ["Parivesha",parivesha,"Expenditure / spiritual point"],
    ["Indrachapa",indrachapa,"Auspicious 'rainbow' point - favourable"],
    ["Upaketu",upaketu,"Point of sudden change"]];
  return list.map(([name,lon,eff])=>({name,lon,sign:signOf(lon),
    house:((signOf(lon)-chart.ascSign)%12+12)%12+1,effect:eff}));
}

/* ---------------- Sunrise/sunset & Gulika ---------------- */
function sunEvents(chart){
  try{
    const dt=chart.input; const obs=new A.Observer(dt.lat,dt.lon,0);
    const t0=A.MakeTime(new Date(Date.UTC(dt.y,dt.mo-1,dt.d,0,0,0)));
    const rise=A.SearchRiseSet(A.Body.Sun,obs,+1,t0,1);
    const set=A.SearchRiseSet(A.Body.Sun,obs,-1,rise?rise:t0,1);
    if(!rise||!set)return null;
    return {riseJD:date2jd(rise.date),setJD:date2jd(set.date)};
  }catch(e){return null;}
}
/* Moonrise/moonset for the civil date of birth. The Moon can skip a rise or a set
   on a given date (it drifts ~50 min a day), so either half may legitimately be
   null - the caller renders a dash rather than inventing a time. */
function moonEvents(chart){
  try{
    const dt=chart.input; const obs=new A.Observer(dt.lat,dt.lon,0);
    const t0=A.MakeTime(new Date(Date.UTC(dt.y,dt.mo-1,dt.d,0,0,0)));
    const rise=A.SearchRiseSet(A.Body.Moon,obs,+1,t0,1);
    const set=A.SearchRiseSet(A.Body.Moon,obs,-1,t0,1);
    if(!rise&&!set)return null;
    return {riseJD:rise?date2jd(rise.date):null,setJD:set?date2jd(set.date):null};
  }catch(e){return null;}
}
function gulika(chart){
  const ev=sunEvents(chart); if(!ev)return null;
  const dt=chart.input; const birthJD=chart.jd;
  const wd=new Date(Date.UTC(dt.y,dt.mo-1,dt.d)).getUTCDay();
  let startJD, partLen, dayBirth=birthJD>=ev.riseJD&&birthJD<ev.setJD;
  if(dayBirth){partLen=(ev.setJD-ev.riseJD)/8; startJD=ev.riseJD;}
  else{ // night: from sunset to next sunrise
    let ns=ev.setJD, nr=ev.riseJD+1;
    try{const obs=new A.Observer(dt.lat,dt.lon,0);
      const r2=A.SearchRiseSet(A.Body.Sun,obs,+1,A.MakeTime(jd2date(ev.setJD)),2); if(r2)nr=date2jd(r2.date);}catch(e){}
    partLen=(nr-ns)/8; startJD=ns;
  }
  // Saturn's part index from day/night lord order
  const startLord = dayBirth?wd:(wd+4)%7; // night lord = 5th weekday from current
  const i=((6-startLord)%7+7)%7; // position of Saturn(6) in weekday order from startLord
  const gJD=startJD+i*partLen;
  const gLon=X.lagna(gJD,dt.lat,dt.lon);
  return {lon:gLon,sign:signOf(gLon),house:((signOf(gLon)-chart.ascSign)%12+12)%12+1};
}

/* ---------------- Shadbala (six-fold, classical model) ---------------- */
const NAISARGIKA={0:60.0,1:51.43,2:17.14,3:25.71,4:34.29,5:42.86,6:8.57};
const REQ={0:6.5,1:6.0,2:5.0,3:7.0,4:6.5,5:5.5,6:5.0};
const DEEP_EXALT={0:10,1:33,2:298,3:165,4:95,5:357,6:200}; // absolute deg of deep exaltation
function shadbala(chart){
  const P=chart.planets;
  const mc=chart._mc!=null?chart._mc:midheaven(chart.jd,chart.input.lon);
  chart._mc=mc;
  const digStrongCusp={0:mc,2:mc,3:chart.asc,4:chart.asc,1:norm(mc+180),5:norm(mc+180),6:norm(chart.asc+180)};
  const sun=P[0].lon, moon=P[1].lon;
  const paksha=arcdist(moon,sun)/3; // 0..60, benefic waxing
  const rows=[];
  for(let pi=0;pi<7;pi++){
    const p=P[pi], lon=p.lon;
    // Sthana: uccha + saptavargaja + kendradi + ojhayugma
    const uccha=(180-arcdist(lon,norm(DEEP_EXALT[pi]+180)))/3;
    let sv=0;[1,2,3,7,9,12,30].forEach(Dv=>{const vs=X.vargaSign(lon,Dv);const vl=SIGN_LORD[vs];
      if(vl===pi)sv+=30; else if(EXALT[pi]&&EXALT[pi][0]===vs)sv+=45;
      else{const nf=NAT_FRIEND[pi];if(nf&&nf.f.includes(vl))sv+=15;else if(nf&&nf.e.includes(vl))sv+=2;else sv+=7.5;}});
    sv=sv/7;
    const kendradi=[1,4,7,10].includes(p.house)?60:[2,5,8,11].includes(p.house)?30:15;
    const ojha=(p.sign%2===0)?(pi!==1&&pi!==5?15:0):(pi===1||pi===5?15:0);
    const sthana=uccha+sv+kendradi+ojha;
    // Dig
    const cusp=digStrongCusp[pi]!=null?digStrongCusp[pi]:chart.asc;
    const dig=arcdist(lon,norm(cusp+180))/3;
    // Kala (paksha + nathonnatha + nominal)
    const benefic=(pi===4||pi===5||(pi===3)||(pi===1&&paksha>30));
    const pak=benefic?paksha*2:(60-paksha*2); const pakC=Math.max(0,Math.min(60,pak));
    const dayBirth=chart._dayBirth; const dayStrong=(pi===0||pi===4||pi===5);
    const nath=(pi===3)?60:(dayStrong===!!dayBirth?45:15);
    const kala=(pakC+nath+30)/2;
    // Cheshta
    let cheshta;
    if(pi===0)cheshta=(180-arcdist(lon,norm(chart._mc)))/3; // ayana-ish
    else if(pi===1)cheshta=paksha*2>60?60:paksha*2;
    else cheshta=p.retro?50: (p.combust?12:30);
    cheshta=Math.max(0,Math.min(60,cheshta));
    // Drik (approx small)
    let drik=0;
    // Naisargika
    const nais=NAISARGIKA[pi];
    const total=(sthana+dig+kala+cheshta+nais+drik);
    const rupas=total/60;
    rows.push({i:pi,sthana:sthana,dig,kala,cheshta,nais,drik,total,rupas,req:REQ[pi],ratio:rupas/REQ[pi]});
  }
  rows.sort((a,b)=>b.ratio-a.ratio);
  return rows;
}

/* ---------------- Doshas ---------------- */
function doshas(chart){
  const P=chart.planets; const out=[];
  const marsH=P[2].house, marsFromMoon=((P[2].sign-P[1].sign)%12+12)%12+1;
  const marsFromVenus=((P[2].sign-P[5].sign)%12+12)%12+1;
  const manglikHouses=[1,2,4,7,8,12];
  const fromL=manglikHouses.includes(marsH),fromM=manglikHouses.includes(marsFromMoon),fromV=manglikHouses.includes(marsFromVenus);
  const manglik=fromL||fromM||fromV;
  const marsOwnEx=SIGN_LORD[P[2].sign]===2||(EXALT[2]&&EXALT[2][0]===P[2].sign);
  const refs=[fromL?`${marsH}th from Lagna`:'',fromM?`${marsFromMoon}th from Moon`:'',fromV?`${marsFromVenus}th from Venus`:''].filter(Boolean).join(', ');
  out.push({name:"Manglik / Kuja Dosha",status:manglik?((marsOwnEx||(!fromL&&!fromM))?"PRESENT (mild)":"PRESENT"):"Absent",
    detail:manglik?`Mars sits ${refs}.${marsOwnEx?" Softened - Mars in its own/exalted sign.":(!fromL&&!fromM)?" Mild - a Venus-reckoned form, mainly for matching.":" Match with a chart that also carries it; Hanuman worship."}`:"Mars avoids the Manglik houses (1,2,4,7,8,12) from Lagna, Moon and Venus.",
    why:{rule:"Mars occupies the 1st, 2nd, 4th, 7th, 8th or 12th counted from the Lagna, the Moon or Venus"+(marsOwnEx?"; cancelled or softened when Mars is in its own sign or exaltation":""),
      chart:`Mars in ${J.SIGNS[P[2].sign]} - ${marsH}th from Lagna, ${marsFromMoon}th from Moon, ${marsFromVenus}th from Venus`+(marsOwnEx?"; Mars is in its own/exalted sign":""),
      pis:[2],present:manglik,soft:marsOwnEx,tradition:"Kuja dosha - classical matching (melāpaka) tradition"}});
  // Pitru: Sun/Moon with Rahu/Ketu, or Sun+Saturn afflicted
  const pitru=P[1].sign===P[8].sign||P[1].sign===P[7].sign||P[0].sign===P[8].sign||P[0].sign===P[7].sign;
  out.push({name:"Pitru Dosha",status:pitru?"Present":"Absent",
    detail:pitru?"Luminary conjunct a node - an ancestral-karma signature; remedy: Tarpana / Shraddha.":"No node-luminary affliction of the classic type.",
    why:{rule:"The Sun or the Moon shares a sign with Rāhu or Ketu",
      chart:`Sun in ${J.SIGNS[P[0].sign]}, Moon in ${J.SIGNS[P[1].sign]}, Rāhu in ${J.SIGNS[P[7].sign]}, Ketu in ${J.SIGNS[P[8].sign]}`,
      pis:[P[1].sign===P[8].sign||P[0].sign===P[8].sign?8:7,P[0].sign===P[7].sign||P[0].sign===P[8].sign?0:1],present:pitru,tradition:"Ancestral-karma reading - traditional practice rather than a single canonical text"}});
  // Guru Chandala - Jupiter with a node. Rahu gives the classic form; Ketu is the milder Ketu-Guru variant.
  const gcNode=P[4].sign===P[7].sign?7:P[4].sign===P[8].sign?8:null;
  const gcJupStrong=P[4].dig&&(P[4].dig.cls==='own'||P[4].dig.cls==='exalt');
  out.push({name:"Guru Chāṇḍāla Yoga",status:gcNode===null?"Absent":(gcJupStrong?"Present (mild)":"Present"),
    detail:gcNode===null?"Jupiter shares a sign with neither Rāhu nor Ketu - the combination does not form."
      :`Jupiter is with ${gcNode===7?'Rāhu':'Ketu'} in ${J.SIGNS[P[4].sign]}. Classically read as unconventional wisdom - brilliance and rapid learning, but judgement, ethics and advice-taking need watching, and a guru's counsel may be resisted.${gcJupStrong?" Softened - Jupiter holds its own sign or exaltation and keeps its dignity.":""} Remedy: Guru worship, Thursday fast, Bṛhaspati mantra.`,
    why:{rule:"Jupiter (guru) shares a sign with Rāhu or Ketu"+(gcJupStrong?"; softened when Jupiter is in its own sign or exaltation":""),
      chart:`Jupiter in ${J.SIGNS[P[4].sign]}, Rāhu in ${J.SIGNS[P[7].sign]}, Ketu in ${J.SIGNS[P[8].sign]}`+(gcJupStrong?`; Jupiter is ${P[4].dig.label.toLowerCase()}`:''),
      pis:[4,gcNode==null?7:gcNode],present:gcNode!==null,soft:gcJupStrong,tradition:"Guru Chāṇḍāla - classical node-affliction reading (Parāśari lineage)"}});
  // Kala Sarpa
  const rl=P[7].lon; let side=null,ksp=true;
  for(let i=0;i<7;i++){const x=norm(P[i].lon-rl);if(side===null)side=x<180;else if((x<180)!==side){ksp=false;break;}}
  out.push({name:"Kala Sarpa Dosha",status:ksp?"PRESENT":"ABSENT",
    detail:ksp?"All seven planets fall on one side of the Rahu-Ketu axis.":"Planets fall on both sides of the Rahu-Ketu axis - this feared dosha does NOT apply.",
    why:{rule:"All seven grahas (Sun to Saturn) lie within the 180° arc on one side of the Rāhu-Ketu axis",
      chart:`Rāhu at ${J.dm(P[7].lon)}, Ketu at ${J.dm(P[8].lon)} - grahas ${ksp?"all fall on one side":"fall on both sides"}`,pis:[7,8],present:ksp,
      tradition:"Later tradition - popular in modern practice, not found in the classical Parāśari corpus"}});
  // Kemadruma
  const around=[];for(let i=0;i<7;i++){if(i===1)continue;const d=((P[i].sign-P[1].sign)%12+12)%12+1;if(d===2||d===12)around.push(d);}
  const withMoon=P.some((p,i)=>i>=0&&i<=6&&i!==1&&p.sign===P[1].sign);
  const kema=around.length===0&&!withMoon;
  const kendraOcc=P.some(p=>[4,7,10].includes(((p.sign-P[1].sign)%12+12)%12+1)&&p.i!==1&&p.i<=6);
  out.push({name:"Kemadruma Dosha",status:kema?"PRESENT":"Absent",
    detail:kema?(kendraOcc?"Present but cushioned by planets in a kendra from the Moon.":"No planets flank the Moon - the 'lonely Moon'."):"A planet flanks the Moon (2nd/12th) or joins it - Kemadruma is cancelled.",
    why:{rule:"No graha occupies the 2nd or the 12th from the Moon, and none is conjoined it"+(kema&&kendraOcc?"; cushioned when a graha holds a kendra from the Moon":""),
      chart:`Moon in ${J.SIGNS[P[1].sign]}; flanking signs ${around.length?"occupied ("+around.map(d=>d+"th").join(", ")+")":"empty"}, Moon ${withMoon?"conjoined by a graha":"unconjoined"}`,pis:[1],present:kema,soft:kendraOcc,invert:true,
      tradition:"Parāśari yoga tradition"}});
  // Graha Yuddha
  let war=null;
  for(let i=2;i<=6;i++)for(let j=i+1;j<=6;j++)if(i!==0&&arcdist(P[i].lon,P[j].lon)<1&&P[i].sign===P[j].sign)war=Object.assign([PLANETS[P[i].i],PLANETS[P[j].i]],{pis:[i,j]});
  out.push({name:"Graha Yuddha (planetary war)",status:war?"Present":"Absent",
    detail:war?`${war[0]} and ${war[1]} within 1° - a planetary war.`:"No two planets within 1° - no planetary war.",
    why:{rule:"Two of the five tārā grahas (Mars, Mercury, Jupiter, Venus, Saturn) stand within 1° of each other in the same sign",
      chart:war?`${war[0]} and ${war[1]} separated by under 1°`:"Closest pair of tārā grahas exceeds 1° of separation",
      pis:war?war.pis:[],present:!!war,tradition:"Graha yuddha - classical (Sūrya Siddhānta / Parāśari) rule"}});

  /* Strength and activation for each dosha (parts 3 and 4 of the contract).
     A dosha is an affliction, so the grading runs the other way from a yoga: the
     better placed the afflicting graha, the *weaker* the affliction reads, and a
     met cancellation condition weakens it further. Where the condition never
     formed there is nothing to time, so no window is offered - attaching one to
     an absent dosha would imply a prediction that was never made. */
  const vim=J.vimshottari(P[1].lon,chart.jd);
  out.forEach(d=>{
    const w=d.why; if(!w)return;
    const pis=[...new Set((w.pis||[]).filter(i=>i!=null&&i>=0&&i<=8))];
    if(!w.present){
      w.confidence={level:"weak",basis:"the classical condition is not met in this chart - the dosha does not form"};
      return;
    }
    const g=J.gradeIndication(chart,pis.filter(i=>i<=6));
    const flip={strong:"weak",weak:"strong",moderate:"moderate"};
    let level=flip[g.level];
    if(w.soft)level=level==="strong"?"moderate":"weak";
    /* The cap has to be re-applied after the flip: gradeIndication holds the
       graha's condition back to moderate, but inverting it can push the
       affliction back up to strong. Manglik and the rest are reckoned from the
       Lagna, so with no birth time they are exactly the readings that must not
       be stated firmly. */
    if(chart.timeUnknown&&level==="strong")level="moderate";
    /* Word the basis in the direction the grading actually went, so the sentence
       never argues against the pill beside it. */
    const dir=g.level==="strong"?" - the affliction reads lighter because the graha forming it is itself well placed"
      :g.level==="weak"?" - the affliction reads heavier because the graha forming it is itself poorly placed":"";
    w.confidence={level,basis:(g.basis==="no dignity or placement modifier applies"
        ?"the condition is met, with no dignity modifier either way"
        :g.basis+dir)
      +(w.soft?"; a classical softening condition is met":"")};
    const win=J.activationWindow(pis,vim,chart.timeUnknown);
    if(win)w.window=win;
  });
  return out;
}

/* ---------------- Sade-Sati & current transit ---------------- */
function transitLon(pi,jd){ // sidereal transit longitude of a planet
  if(pi===7)return X.meanNodeSid(jd);
  if(pi===8)return norm(X.meanNodeSid(jd)+180);
  const bmap=[A.Body.Sun,A.Body.Moon,A.Body.Mars,A.Body.Mercury,A.Body.Jupiter,A.Body.Venus,A.Body.Saturn];
  return X.sidLon(bmap[pi],jd);
}
function sadeSati(chart,nowJD){
  const moonSign=chart.planets[1].sign;
  const satSign=signOf(transitLon(6,nowJD));
  const from=((satSign-moonSign)%12+12)%12+1;
  let status,phase;
  if(from===12){status="ACTIVE";phase="Rising (first phase)";}
  else if(from===1){status="ACTIVE";phase="Peak (over the Moon)";}
  else if(from===2){status="ACTIVE";phase="Setting (final phase)";}
  else if(from===4){status="Kantaka Shani";phase="Saturn 4th from Moon";}
  else if(from===8){status="Ashtama Shani";phase="Saturn 8th from Moon";}
  else {status="Not active";phase=`Saturn ${from}th from Moon`;}
  // find current/next sade-sati window by scanning years
  const windows=[]; let inWin=false,startY=null;
  for(let jd=chart.jd-YEAR*5; jd<chart.jd+YEAR*100; jd+=YEAR*0.25){
    const s=signOf(transitLon(6,jd)); const f=((s-moonSign)%12+12)%12+1;
    const active=(f===12||f===1||f===2);
    if(active&&!inWin){inWin=true;startY=jd;}
    else if(!active&&inWin){inWin=false;windows.push([startY,jd]);}
  }
  return {status,phase,from,satSign,windows};
}

/* ---------------- Gochara year-by-year ---------------- */
function gochara(chart,fromYear,toYear){
  const moonSign=chart.planets[1].sign, asc=chart.ascSign;
  const dt=chart.input; const rows=[];
  const vim=J.vimshottari(chart.planets[1].lon,chart.jd);
  function dashaAt(jd){for(const md of vim.list)if(jd>=md.st&&jd<md.en){for(const a of md.ad)if(jd>=a.st&&jd<a.en)return `${PLANETS[md.lord]}-${PLANETS[a.lord]}`;return PLANETS[md.lord];}return "";}
  for(let y=fromYear;y<=toYear;y++){
    const jd=J.julday(y,dt.mo,dt.d,12-dt.tz);
    const sat=signOf(transitLon(6,jd)),jup=signOf(transitLon(4,jd)),rah=signOf(transitLon(7,jd));
    const sFromMoon=((sat-moonSign)%12+12)%12+1, jFromMoon=((jup-moonSign)%12+12)%12+1;
    const jFromLagna=((jup-asc)%12+12)%12+1;
    let note="";
    if(sFromMoon===1)note="Sade-Sati PEAK";
    else if(sFromMoon===12)note="Sade-Sati rising";
    else if(sFromMoon===2)note="Sade-Sati setting";
    else if(sFromMoon===4)note="Kantaka Shani";
    else if(sFromMoon===8)note="Ashtama Shani";
    const jFav=[2,5,7,9,11].includes(jFromMoon)||jFromLagna===1;
    if(jFav)note=note?note+"; Jupiter favourable":(jFromLagna===1?"Jupiter on Lagna":"Jupiter favourable");
    rows.push({year:y,age:y-dt.y,dasha:dashaAt(jd),
      sat:{sign:sat,h:sFromMoon},jup:{sign:jup,h:jFromMoon},rahu:{sign:rah,h:((rah-moonSign)%12+12)%12+1},
      note:note||"-",fav:jFav,ss:sFromMoon===1||sFromMoon===12||sFromMoon===2});
  }
  return rows;
}

/* near-term monthly ingresses + dasha changes */
function nearTerm(chart,years){
  const dt=chart.input; const moonSign=chart.planets[1].sign, asc=chart.ascSign;
  const start=Math.max(chart.jd, J2000+(Date.now()-EPOCH)/86400000);
  const events=[];
  [[6,"Saturn"],[4,"Jupiter"],[7,"Rahu"]].forEach(([pi,nm])=>{
    let prev=signOf(transitLon(pi,start));
    for(let jd=start;jd<start+YEAR*years;jd+=3){
      const s=signOf(transitLon(pi,jd));
      if(s!==prev){const fm=((s-moonSign)%12+12)%12+1,fl=((s-asc)%12+12)%12+1;
        const fav=(nm==="Jupiter"&&([2,5,7,9,11].includes(fm)||fl===1));
        events.push({jd,txt:`${nm} enters ${J.SIGNS[s]} (${fm} from Moon, ${fl} from Lagna)`,fav});prev=s;}
    }
  });
  // dasha antardasha changes
  const vim=J.vimshottari(chart.planets[1].lon,chart.jd);
  vim.list.forEach(md=>md.ad.forEach(a=>{if(a.st>=start&&a.st<start+YEAR*years)
    events.push({jd:a.st,txt:`Dasha: ${PLANETS[md.lord]}-${PLANETS[a.lord]} begins`,dasha:true});}));
  events.sort((a,b)=>a.jd-b.jd);
  return events;
}

/* ---------------- Bhava Chalit (Sripati cusps) ---------------- */
function midheaven(jd,lonEast){
  const time=A.MakeTime(jd-J2000); const gast=A.SiderealTime(time);
  const ramc=norm(gast*15+lonEast)*D2R; const eps=X.meanObliq(jd)*D2R;
  let mc=Math.atan2(Math.sin(ramc),Math.cos(ramc)*Math.cos(eps))*R2D;
  return norm(norm(mc)-J.ayanamsa(jd));
}
function bhavaChalit(chart){
  const dt=chart.input; const asc=chart.asc; const mc=midheaven(chart.jd,dt.lon);
  chart._mc=mc; // stash for shadbala/dig
  // Porphyry/Sripati bhava-madhya (cusps as house midpoints)
  const ic=norm(mc+180), desc=norm(asc+180);
  const cusps=new Array(13);
  cusps[1]=asc; cusps[4]=ic; cusps[7]=desc; cusps[10]=mc;
  // houses run asc(1)->ic(4)->desc(7)->mc(10)->asc; trisect each quadrant in zodiac order
  const arc1=norm(ic-asc)/3, arc2=norm(desc-ic)/3, arc3=norm(mc-desc)/3, arc4=norm(asc-mc)/3;
  cusps[2]=norm(asc+arc1);cusps[3]=norm(asc+2*arc1);
  cusps[5]=norm(ic+arc2);cusps[6]=norm(ic+2*arc2);
  cusps[8]=norm(desc+arc3);cusps[9]=norm(desc+2*arc3);
  cusps[11]=norm(mc+arc4);cusps[12]=norm(mc+2*arc4);
  // Sripati: bhava h spans from the sandhi before its madhya to the sandhi after.
  // sandhi[h] = forward midpoint between cusps[h] and cusps[h+1].
  const sandhi=new Array(13);
  for(let h=1;h<=12;h++){const nxt=h%12+1; sandhi[h]=norm(cusps[h]+norm(cusps[nxt]-cusps[h])/2);}
  function bhavaOf(lon){
    for(let h=1;h<=12;h++){const prev=h===1?12:h-1;
      const start=sandhi[prev], span=norm(sandhi[h]-start);
      if(norm(lon-start)<span)return h;
    }
    return 1;
  }
  const placements=chart.planets.map(p=>({i:p.i,signHouse:p.house,bhava:bhavaOf(p.lon),sign:p.sign}));
  return {cusps,mc,placements,ascSign:chart.ascSign};
}

/* ---------------- Dasha-based event timing (replaces generic age bands) ---------------- */
function fmtAge(a){let yr=Math.floor(a);let mo=Math.round((a-yr)*12);if(mo>=12){yr+=1;mo=0;}return mo>0?`${yr} yr ${mo} mo`:`${yr} yr`;}
function dashaWindows(chart,triggers,minAge,maxAge){
  const vim=J.vimshottari(chart.planets[1].lon,chart.jd);const wins=[];
  vim.list.forEach(md=>{md.ad.forEach(a=>{
    const sA=(a.st-chart.jd)/YEAR, eA=(a.en-chart.jd)/YEAR;
    if(eA<minAge||sA>maxAge)return;
    if(triggers.includes(md.lord)||triggers.includes(a.lord))
      wins.push({st:a.st,en:a.en,startAge:Math.max(sA,minAge),endAge:eA,md:md.lord,ad:a.lord});
  });});
  // merge consecutive windows that touch
  const merged=[];wins.forEach(w=>{const last=merged[merged.length-1];
    if(last&&w.startAge-last.endAge<0.1&&last.md===w.md)last.endAge=w.endAge;else merged.push({...w});});
  return merged;
}
function doubleTransitOK(chart,win){ // Jupiter or Saturn transiting/aspecting the 7th at the window mid-point
  const mid=(win.st+win.en)/2, asc=chart.ascSign, h7=(asc+6)%12;
  const jup=signOf(transitLon(4,mid)), sat=signOf(transitLon(6,mid));
  const asp=(from,specials)=>specials.some(a=>((from+a-1)%12)===h7);
  const jupHits=jup===h7||asp(jup,[5,7,9]);
  const satHits=sat===h7||asp(sat,[3,7,10]);
  return jupHits||satHits;
}
function marriageTiming(chart){
  const P=chart.planets, asc=chart.ascSign;
  const l7=SIGN_LORD[(asc+6)%12];
  const ck=J.charaKarakas(P); const dk=ck[6].i;
  const jm=jaimini(chart); const ulLord=SIGN_LORD[jm.UL];
  const male=(chart.input&&chart.input.gender)!=='female';
  const kaaraka=male?5:4; // Venus (male) / Jupiter (female)
  const occ7=P.filter(p=>p.house===7&&p.i<7).map(p=>p.i);
  const asp7=aspects(chart).filter(a=>a.i<7&&a.aspects.includes(7)).map(a=>a.i);
  const triggers=[...new Set([l7,dk,ulLord,kaaraka,...occ7,...asp7])].filter(x=>x<9);
  let wins=dashaWindows(chart,triggers,18,48);
  wins.forEach(w=>w.dt=doubleTransitOK(chart,w));
  const strong=wins.filter(w=>w.dt);
  const chosen=(strong.length?strong:wins).slice(0,3);
  // spouse from 7th lord in D9
  const l7d9=X.vargaSign(P[l7].lon,9);
  return {windows:chosen.map(w=>({label:`${fmtAge(w.startAge)} - ${fmtAge(w.endAge)}`,
    dasha:`${PLANETS[w.md]}-${PLANETS[w.ad]}`,dt:w.dt})),
    l7,dk,kaaraka,male,spouseSign:l7d9,delayed:chosen.length&&chosen[0].startAge>30};
}
/* ---------------- Love vs arranged inclination ----------------
   The classical axis is the 5th (romance, pūrva-puṇya, the self-chosen bond)
   against the 9th (dharma, elders, the bond arranged for you), both read on the
   7th. A tie between the 5th and 7th lords is the standard love-marriage
   signature; Venus-Mars contact and Rāhu on the 7th push the same way, while
   Jupiter or Saturn on the 7th and a 9th-7th tie pull toward the traditional
   route. This is an inclination, not an event - the chart leans, it does not
   decide, and plenty of charts lean both ways at once. */
function marriageStyle(chart){
  const P=chart.planets, asc=chart.ascSign;
  const l5=SIGN_LORD[(asc+4)%12], l7=SIGN_LORD[(asc+6)%12], l9=SIGN_LORD[(asc+8)%12];
  const conj=(a,b)=>a!==b&&P[a].sign===P[b].sign;
  const exch=(a,b)=>a!==b&&SIGN_LORD[P[a].sign]===b&&SIGN_LORD[P[b].sign]===a;
  const asp=aspects(chart);
  const aspects7=pi=>{const a=asp.find(x=>x.i===pi);return a&&a.aspects.includes(7);};
  const love=[], trad=[];
  if(conj(l5,l7))love.push(`the 5th lord ${PLANETS[l5]} and the 7th lord ${PLANETS[l7]} are conjoined in ${J.SIGNS[P[l5].sign]}`);
  if(exch(l5,l7))love.push(`the 5th and 7th lords are in mutual exchange (parivartana)`);
  if(P[l7].house===5)love.push(`the 7th lord ${PLANETS[l7]} occupies the 5th`);
  if(P[l5].house===7)love.push(`the 5th lord ${PLANETS[l5]} occupies the 7th`);
  if(conj(5,2))love.push("Venus and Mars are conjoined - the classical attraction contact");
  if(P[7].house===7)love.push("Rāhu occupies the 7th - the unconventional or self-chosen union");
  if(conj(5,7))love.push("Venus is conjoined Rāhu");
  if(conj(l9,l7))trad.push(`the 9th lord ${PLANETS[l9]} and the 7th lord ${PLANETS[l7]} are conjoined - elders and dharma tied to the marriage`);
  if(P[l7].house===9||P[l9].house===7)trad.push("the 7th and 9th are linked by placement - the match comes through family or community");
  if(aspects7(4))trad.push("Jupiter aspects the 7th - the sanctioned, ceremonial route");
  if(aspects7(6)||P[6].house===7)trad.push("Saturn holds or aspects the 7th - custom, caution and elder approval weigh heavily");
  const lean=love.length>trad.length?"love":trad.length>love.length?"arranged":"balanced";
  const pis=[...new Set([l5,l7,l9,5,2].filter(i=>i<7))];
  return {lean,love,trad,l5,l7,l9,pis,
    text:lean==="love"
      ?`The chart leans toward a self-chosen (love) marriage: ${love.join('; ')}. ${trad.length?`Traditional indications are present too (${trad.join('; ')}), so a family-approved love match - the commonest real outcome of this combination - fits the chart better than either extreme.`:'Little pulls the other way.'}`
      :lean==="arranged"
      ?`The chart leans toward an arranged or family-introduced marriage: ${trad.join('; ')}. ${love.length?`There are love indications as well (${love.join('; ')}), so an introduction that becomes a genuine choice reads more likely than a purely formal arrangement.`:'Little pulls the other way.'}`
      :love.length||trad.length
      ?`Love and traditional indications are evenly matched here - ${love.join('; ')||'no clear love signature'}, against ${trad.join('; ')||'no clear traditional signature'}. Classically this is read as a match that arrives either way, with the manner mattering less than the 7th lord's own condition.`
      :`Neither the love signature (5th-7th tie, Venus-Mars contact, Rāhu on the 7th) nor the traditional one (9th-7th tie, Jupiter or Saturn on the 7th) is present. The chart is silent on the manner of meeting, which classically means it is not a chart factor - circumstance decides it.`};
}

/* ---------------- Foreign spouse / distant match ----------------
   Read from the 7th lord's sign type (chara and dvisvabhāva signs move; sthira
   signs stay), any 12th-house connection - the bhāva of distant lands - and
   Rāhu, which classically carries the foreign and the outside-the-community. */
const CHARA=[0,3,6,9], DVISVA=[2,5,8,11];
function foreignSpouse(chart){
  const P=chart.planets, asc=chart.ascSign;
  const l7=SIGN_LORD[(asc+6)%12], l12=SIGN_LORD[(asc+11)%12];
  const s7=P[l7].sign, hits=[];
  if(CHARA.includes(s7))hits.push(`the 7th lord ${PLANETS[l7]} sits in ${J.SIGNS[s7]}, a movable (chara) sign - movement and distance in the partnership`);
  else if(DVISVA.includes(s7))hits.push(`the 7th lord ${PLANETS[l7]} sits in ${J.SIGNS[s7]}, a dual (dvisvabhāva) sign - two worlds meeting`);
  if(P[l7].house===12)hits.push(`the 7th lord occupies the 12th, the bhāva of distant lands`);
  if(P[l12].house===7)hits.push(`the 12th lord ${PLANETS[l12]} occupies the 7th`);
  if(P[7].house===7)hits.push("Rāhu occupies the 7th - classically the outsider, the foreigner, or the match outside one's own community");
  if(P[l7].sign===P[7].sign)hits.push(`the 7th lord is conjoined Rāhu in ${J.SIGNS[P[7].sign]}`);
  if(P[l7].house===9)hits.push("the 7th lord occupies the 9th, the bhāva of long journeys");
  const level=hits.length>=3?"strong":hits.length===2?"moderate":hits.length===1?"weak":"none";
  return {hits,level,l7,l12,pis:[l7,l12,7].filter(i=>i<9),
    text:hits.length>=2
      ?`Several indications point to a spouse from far away, another region, or a different community: ${hits.join('; ')}. Classically this is read as distance of background rather than a passport - a different language, community or state satisfies it as readily as another country.`
      :hits.length===1
      ?`One indication points this way - ${hits[0]}. A single factor is thin on its own; the tradition wants two or three before reading a foreign or distant match seriously.`
      :`None of the classical foreign-match indications is present: the 7th lord is in a fixed sign, has no 12th-house connection, and is untouched by Rāhu. The chart points to a partner from a familiar background.`};
}

function careerTiming(chart){
  const P=chart.planets, asc=chart.ascSign;
  const l10=SIGN_LORD[(asc+9)%12];
  const ck=J.charaKarakas(P); const amk=ck[1].i; // Amatyakaraka
  const occ10=P.filter(p=>p.house===10&&p.i<7).map(p=>p.i);
  const triggers=[...new Set([l10,amk,...occ10])].filter(x=>x<9);
  const wins=dashaWindows(chart,triggers,20,55).slice(0,3);
  return {windows:wins.map(w=>({label:`${fmtAge(w.startAge)} - ${fmtAge(w.endAge)}`,dasha:`${PLANETS[w.md]}-${PLANETS[w.ad]}`})),l10,amk};
}

/* ---------------- Health & vulnerability (6/8/12 + Kalapurusha body map + D30) ---------------- */
const KALA_BODY=["head, brain & skull","face, throat, teeth & eyes","arms, shoulders, lungs & nervous system","chest, lungs, stomach & breast","heart, upper back & spine","abdomen, intestines & digestion","kidneys, lower back & ovaries","reproductive & excretory organs","hips, thighs & liver","knees, joints, bones & skin","calves, ankles & circulation","feet, lymphatic system & sleep"];
const PLANET_SYS={0:"heart, bones, vitality & eyes",1:"body fluids, stomach & the mind",2:"blood, muscles, inflammation, accidents & injuries",3:"nervous system, skin & speech",4:"liver, fat metabolism & blood sugar",5:"kidneys, reproductive system & throat",6:"chronic conditions, bones, joints, teeth & nerves",7:"toxins, skin & hard-to-diagnose issues",8:"infections & sudden ailments"};
function healthAnalysis(chart){
  const P=chart.planets, asc=chart.ascSign;
  const l6=SIGN_LORD[(asc+5)%12], l8=SIGN_LORD[(asc+7)%12], l12=SIGN_LORD[(asc+11)%12];
  const sixthSign=(asc+5)%12, eighthSign=(asc+7)%12;
  const areas=[]; const seen=new Set();
  const push=t=>{if(t&&!seen.has(t)){seen.add(t);areas.push(t);}};
  push(KALA_BODY[sixthSign]); // the disease house's body zone
  P.forEach(p=>{if(p.i<7&&[6,8,12].includes(p.house))push(PLANET_SYS[p.i]);}); // planets in dusthanas
  P.forEach(p=>{if(p.i<7&&((p.dig&&p.dig.cls==='debil')||p.combust))push(PLANET_SYS[p.i]);}); // afflicted grahas
  const nowJD=J2000+(Date.now()-EPOCH)/86400000; const curAge=(nowJD-chart.jd)/YEAR;
  const afflicted=P.filter(p=>p.i<7&&((p.dig&&p.dig.cls==='debil')||p.combust)).map(p=>p.i);
  const triggers=[...new Set([l6,l8,l12,...afflicted])].filter(x=>x<9);
  let wins=dashaWindows(chart,triggers,0,95).filter(w=>w.endAge>curAge-1).slice(0,3);
  return {areas:areas.slice(0,4),l6,l8,l12,afflicted,sixthSign,eighthSign,
    windows:wins.map(w=>({label:`${fmtAge(w.startAge)} - ${fmtAge(w.endAge)}`,dasha:`${PLANETS[w.md]}-${PLANETS[w.ad]}`}))};
}

/* expose */
Object.assign(J,{panchanga,avakhada,functionalNature,aspects,avasthas,compoundRel,jaimini,ISHTA_DEV,
  upagrahas,gulika,sunEvents,moonEvents,shadbala,doshas,sadeSati,gochara,nearTerm,bhavaChalit,transitLon,ownsHouses,
  marriageTiming,marriageStyle,foreignSpouse,careerTiming,healthAnalysis,NAISARGIKA,REQ,
  /* raw tables the compatibility module (engine3) matches on - shared so the
     Avakhada Chakra shown in the report and the Guṇa Milan read the same data */
  AVK:{NAK_YONI,NAK_GANA,NAK_NADI,VARNA,VASHYA,NAT_FRIEND}});
})();
