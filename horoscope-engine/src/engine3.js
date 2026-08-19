/* ================================================================
   JĀTHAKA ENGINE - marriage compatibility (Guṇa Milan / Melāpaka).

   Two charts in, one match report out. Three layers, in order of how much
   weight the classics give them:

     1. Ashtakoota  - the 36-point Guṇa Milan, koota by koota
     2. Dosha gates - Nadi and Bhakoot dosha WITH their cancellation rules,
                      because a raw score means nothing until those are checked
     3. Chart-level - 7th-lord cross-reading, Venus/Jupiter, Manglik matching,
                      daśā overlap, and the Navāṁśa (D-9) overlay, since D-9 is
                      the varga that actually governs marriage

   Every verdict carries the same five-part provenance the rest of the report
   uses: the classical rule, the grahas/bhavas that triggered it, the strength of
   the indication, the daśā window it belongs to, and a plain-language line.
   Nothing here is generated - each number is the output of the printed test.
   ================================================================ */
(function(){
const J=window.JATHAKA, X=J._;
const SIGNS=J.SIGNS, NAK=J.NAK, PLANETS=J.PLANETS, PL_SANS=J.PL_SANS, SIGN_LORD=J.SIGN_LORD;
const AVK=J.AVK, NAT_FRIEND=AVK.NAT_FRIEND, EXALT=X.EXALT;
const YEAR=365.2425, EPOCH=Date.UTC(2000,0,1,12), J2000=2451545.0;
const nowJD=()=>J2000+(Date.now()-EPOCH)/86400000;
const ORD=n=>n+(n%10===1&&n!==11?'st':n%10===2&&n!==12?'nd':n%10===3&&n!==13?'rd':'th');
const dist=(a,b)=>((a-b)%12+12)%12+1;      // sign-distance of a, counted from b
const cap=s=>s.charAt(0).toUpperCase()+s.slice(1);

/* ---------------- the two nativities ---------------- */
function moonInfo(chart){
  const m=chart.planets[1];
  return {sign:m.sign,signName:SIGNS[m.sign],nak:m.nak.idx,nakName:NAK[m.nak.idx],pada:m.nak.pada,
    deg:m.lon%30,lord:SIGN_LORD[m.sign],lordName:PLANETS[SIGN_LORD[m.sign]]};
}

/* ---------------- 1. Varna (1) - spiritual/ego alignment ---------------- */
const VARNA_RANK={Brahmin:4,Kshatriya:3,Vaishya:2,Shudra:1};
function kVarna(g,b){
  const gv=AVK.VARNA[g.sign], bv=AVK.VARNA[b.sign];
  const pts=VARNA_RANK[gv]>=VARNA_RANK[bv]?1:0;
  return {name:"Varna",sans:"Varṇa",max:1,pts,
    detail:`Groom ${gv} (${g.signName}), bride ${bv} (${b.signName}).`,
    plain:pts?"Their basic outlook and sense of duty sit comfortably together - neither has to shrink to fit the other."
      :"The bride's varna ranks above the groom's. Traditionally read as an ego-adjustment area: he may need to grow into the partnership rather than lead it by default. It is the lightest-weighted koota of the eight - one point out of thirty-six.",
    why:{rule:"A point is given when the groom's varna, taken from his Moon-sign, ranks at or above the bride's (Brahmin > Kshatriya > Vaishya > Shudra)",
      chart:`Groom's Moon in ${g.signName} → ${gv}; bride's Moon in ${b.signName} → ${bv}`,
      tradition:"Varṇa koota - Muhūrta / melāpaka tradition"}};
}

/* ---------------- 2. Vashya (2) - the control & attraction dynamic ---------------- */
const VASHYA_CLASS=["Nara (human)","Chatushpada (quadruped)","Jalachara (water-dwelling)","Vanachara (wild)","Keeta (insect)"];
/* Sagittarius and Capricorn each change class at the midpoint of the sign, so the
   Moon's degree - not just its sign - decides which class applies. */
function vashyaClass(sign,deg){
  return [1,1,0,2,3,0,0,4,deg<15?0:1,deg<15?1:2,0,2][sign];
}
const VASHYA_M=[[2,1,1,0,0.5],[1,2,0.5,0,1],[1,0.5,2,1,1],[0,0,1,2,0],[0.5,1,1,0,2]];
function kVashya(g,b){
  const gc=vashyaClass(g.sign,g.deg), bc=vashyaClass(b.sign,b.deg);
  const pts=VASHYA_M[gc][bc];
  return {name:"Vashya",sans:"Vaśya",max:2,pts,
    detail:`Groom ${VASHYA_CLASS[gc]}, bride ${VASHYA_CLASS[bc]}.`,
    plain:pts>=2?"Equal footing - neither dominates, and the pull between them is mutual."
      :pts>=1?"A workable pull, with one of them a little more the leader in day-to-day matters."
      :"The two classes do not naturally attract on this measure. Read as a caution about one partner steering more than is comfortable for the other, not as an incompatibility on its own.",
    why:{rule:"Each Moon-sign belongs to one of five vaśya classes; the classical table scores the pair 2 (same class) down to 0 (classes that do not attract)",
      chart:`Groom's Moon in ${g.signName} at ${g.deg.toFixed(1)}° → ${VASHYA_CLASS[gc]}; bride's Moon in ${b.signName} at ${b.deg.toFixed(1)}° → ${VASHYA_CLASS[bc]}; table value ${pts}/2`,
      tradition:"Vaśya koota - melāpaka tradition (symmetric table)"}};
}

/* ---------------- 3. Tara (3) - health & general wellbeing ---------------- */
const TARA=["","Janma","Sampat","Vipat","Kshema","Pratyari","Sadhaka","Vadha","Mitra","Ati-Mitra"];
const TARA_BAD=[3,5,7];   // Vipat, Pratyari, Vadha
function taraOf(from,to){const n=((to-from)%27+27)%27+1, r=n%9; return r===0?9:r;}
function kTara(g,b){
  const t1=taraOf(b.nak,g.nak);   // groom counted from bride
  const t2=taraOf(g.nak,b.nak);   // bride counted from groom
  const ok1=!TARA_BAD.includes(t1), ok2=!TARA_BAD.includes(t2);
  const pts=(ok1?1.5:0)+(ok2?1.5:0);
  return {name:"Tara",sans:"Tārā (Dina)",max:3,pts,
    detail:`Groom's tārā from the bride: ${TARA[t1]} (${t1}). Bride's from the groom: ${TARA[t2]} (${t2}).`,
    plain:pts>=3?"Both directions fall on supportive stars - the classical reading is good mutual health and few of the small daily frictions that wear a marriage down."
      :pts>0?`One direction lands on an inauspicious tārā (${!ok1?TARA[t1]:TARA[t2]}). Traditionally a caution over the wellbeing of ${!ok1?'the groom':'the bride'} within the marriage; the other direction is clear.`
      :"Both directions land on inauspicious tārās. This is a genuine wellbeing caution and is one to raise with an astrologer rather than settle from a score.",
    why:{rule:"Count nakṣatras from one partner's to the other's, divide by 9; remainders 3 (Vipat), 5 (Pratyari) and 7 (Vadha) are inauspicious and score nothing. Each direction carries 1.5 points",
      chart:`Groom ${g.nakName} (#${g.nak+1}), bride ${b.nakName} (#${b.nak+1}) → tārās ${t1} and ${t2}; ${pts}/3`,
      tradition:"Tārā / Dina koota - Bṛhat Parāśara Horā Śāstra"}};
}

/* ---------------- 4. Yoni (4) - physical compatibility ---------------- */
const YONI=["Horse","Elephant","Sheep","Serpent","Dog","Cat","Rat","Cow","Buffalo","Tiger","Deer","Monkey","Mongoose","Lion"];
/* The classical 14x14 yoni table. Symmetric; the seven 0s are the sworn-enemy
   pairs (horse/buffalo, elephant/lion, sheep/monkey, serpent/mongoose,
   dog/deer, cat/rat, cow/tiger). */
const YONI_M=[
 [4,2,2,3,2,2,2,1,0,1,3,3,2,1],
 [2,4,3,3,3,2,2,2,3,1,2,3,2,0],
 [2,3,4,2,1,2,1,3,3,1,2,0,3,1],
 [3,3,2,4,2,1,1,1,1,2,2,2,0,2],
 [2,3,1,2,4,2,1,2,2,1,0,2,1,1],
 [2,2,2,1,2,4,0,2,2,1,3,3,2,1],
 [2,2,1,1,1,0,4,2,2,2,2,2,1,2],
 [1,2,3,1,2,2,2,4,3,0,3,2,2,1],
 [0,3,3,1,2,2,2,3,4,1,2,2,2,1],
 [1,1,1,2,1,1,2,0,1,4,1,1,2,1],
 [3,2,2,2,0,3,2,3,2,1,4,2,2,1],
 [3,3,0,2,2,3,2,2,2,1,2,4,3,2],
 [2,2,3,0,1,2,1,2,2,2,2,3,4,2],
 [1,0,1,2,1,1,2,1,1,1,1,2,2,4]];
function kYoni(g,b){
  const gy=YONI.indexOf(AVK.NAK_YONI[g.nak]), by=YONI.indexOf(AVK.NAK_YONI[b.nak]);
  const pts=YONI_M[gy][by];
  return {name:"Yoni",sans:"Yoni",max:4,pts,
    detail:`Groom's yoni ${YONI[gy]}, bride's ${YONI[by]}.`,
    plain:pts>=4?"The same yoni - the classics read this as the easiest physical and instinctive fit of all."
      :pts>=3?"Friendly yonis - physical and instinctive rapport comes without much effort."
      :pts>=2?"Neutral yonis - the physical side works, without being the strongest thread in the marriage."
      :pts>=1?"Yonis that sit awkwardly. Physical rhythms differ; it responds to patience and honesty rather than to a remedy."
      :"Sworn-enemy yonis - the classical worst reading on this koota. Instinctive and physical clash, and it is worth naming openly rather than scoring past.",
    why:{rule:"Each nakṣatra carries one of fourteen animal yonis; the classical table scores the pair from 4 (same yoni) to 0 (the seven sworn-enemy pairs)",
      chart:`Groom ${g.nakName} → ${YONI[gy]}; bride ${b.nakName} → ${YONI[by]}; table value ${pts}/4`,
      tradition:"Yoni koota - Bṛhat Parāśara Horā Śāstra"}};
}

/* ---------------- 5. Graha Maitri (5) - mental compatibility ---------------- */
function natRel(a,b){ if(a===b)return"same"; const t=NAT_FRIEND[a];
  if(!t)return"neutral"; return t.f.includes(b)?"friend":t.e.includes(b)?"enemy":"neutral"; }
function kMaitri(g,b){
  const r1=natRel(g.lord,b.lord), r2=natRel(b.lord,g.lord);
  let pts;
  if(r1==="same")pts=5;
  else{const s=[r1,r2].sort().join('+');
    pts={"friend+friend":5,"friend+neutral":4,"neutral+neutral":3,"enemy+friend":1,"enemy+neutral":0.5,"enemy+enemy":0}[s];
    if(pts==null)pts=3;}
  return {name:"Graha Maitri",sans:"Graha Maitrī",max:5,pts,
    detail:`Moon-sign lords ${g.lordName} (groom) and ${b.lordName} (bride) - ${r1==="same"?"the same graha":`${g.lordName} treats ${b.lordName} as a ${r1}, ${b.lordName} treats ${g.lordName} as a ${r2}`}.`,
    plain:pts>=5?"Minds meet naturally. This is the koota that carries a marriage through the years, and here it is at full strength - it also cancels Bhakoot and softens Nadi."
      :pts>=4?"Good mental rapport - they understand each other's reasoning without having to spell it out."
      :pts>=3?"Neutral minds: understanding is built rather than given, and it holds once built."
      :pts>=1?"The mental wiring differs. Conversations need patience; assumptions about how the other thinks will usually be wrong."
      :"Mutually inimical Moon-sign lords - the classics rate mental compatibility lowest here. Since this koota is the one that cancels other doshas, its weakness matters more than its five points suggest.",
    why:{rule:"Score the natural (naisargika) friendship between the two Moon-sign lords: mutual friends or the same graha 5, friend/neutral 4, mutual neutral 3, friend/enemy 1, neutral/enemy 0.5, mutual enemies 0",
      chart:`Groom's Moon in ${g.signName} (lord ${g.lordName}); bride's Moon in ${b.signName} (lord ${b.lordName}); relation ${r1}/${r2} → ${pts}/5`,
      tradition:"Graha Maitrī koota - Bṛhat Parāśara Horā Śāstra"}};
}

/* ---------------- 6. Gana (6) - temperament ---------------- */
const GANA=["Deva","Manushya","Rakshasa"];
const GANA_M=[[6,5,1],[5,6,0],[1,0,6]];
function kGana(g,b){
  const gg=GANA.indexOf(AVK.NAK_GANA[g.nak]), bg=GANA.indexOf(AVK.NAK_GANA[b.nak]);
  const pts=GANA_M[gg][bg];
  return {name:"Gana",sans:"Gaṇa",max:6,pts,
    detail:`Groom ${GANA[gg]} gana, bride ${GANA[bg]} gana.`,
    plain:pts>=6?"The same temperament class - they react to the world at the same speed and in the same key."
      :pts>=5?"Compatible temperaments; the differences are the useful kind."
      :pts>=1?"Temperaments pull against each other. Expect different instincts about conflict, celebration and pace - manageable, but it needs naming."
      :"Deva and Rakshasa gana across the pair - the classical maximum temperament clash on this koota, and six of the thirty-six points ride on it. Worth discussing rather than scoring past.",
    why:{rule:"Each nakṣatra belongs to a Deva, Manuṣya or Rākṣasa gana; the classical table scores same-gana 6, Deva/Manuṣya 5, Deva/Rākṣasa 1, Manuṣya/Rākṣasa 0",
      chart:`Groom ${g.nakName} → ${GANA[gg]}; bride ${b.nakName} → ${GANA[bg]}; table value ${pts}/6`,
      tradition:"Gaṇa koota - Bṛhat Parāśara Horā Śāstra"}};
}

/* ---------------- 7. Bhakoot (7) - emotional & financial harmony ---------------- */
function kBhakoot(g,b){
  const d1=dist(g.sign,b.sign), d2=dist(b.sign,g.sign);
  const pair=[d1,d2].sort((x,y)=>x-y).join('/');
  const BAD={"2/12":"the 2/12 axis - money and expenditure pull in opposite directions",
             "5/9":"the 5/9 axis - children and fortune are the strained area",
             "6/8":"the 6/8 axis (ṣaḍāṣṭaka) - the harshest of the three, touching health and longevity"};
  const bad=BAD[pair]||null;
  return {name:"Bhakoot",sans:"Bhakūṭa (Rāśi)",max:7,pts:bad?0:7,axis:pair,badReason:bad,
    detail:`Moon-signs ${g.signName} and ${b.signName} - the ${pair} axis.`,
    plain:bad?`Bhakoot dosha is present on ${bad}. Seven of the thirty-six points are lost here, which is why the total drops sharply. Check the cancellation rules below before reading anything into it.`
      :"No Bhakoot dosha. Emotional bonding, household harmony and the money side of the marriage all read as supported.",
    why:{rule:"Reckon the sign-distance between the two Moon-signs both ways. A 2/12, 5/9 or 6/8 axis is Bhakoot dosha and forfeits all seven points; any other axis takes them all",
      chart:`Groom's Moon in ${g.signName}, bride's in ${b.signName} → ${d1} and ${d2} (the ${pair} axis)`,
      tradition:"Bhakūṭa koota - Bṛhat Parāśara Horā Śāstra"}};
}

/* ---------------- 8. Nadi (8) - constitution & progeny ---------------- */
function kNadi(g,b){
  const gn=AVK.NAK_NADI[g.nak], bn=AVK.NAK_NADI[b.nak];
  const same=gn===bn;
  return {name:"Nadi",sans:"Nāḍī",max:8,pts:same?0:8,same,gn,bn,
    detail:`Groom ${gn} nāḍī, bride ${bn} nāḍī.`,
    plain:same?`Both fall in the ${gn} nāḍī - Nadi dosha. This is the heaviest koota at eight points, and the classics tie it to constitution and the health of children. Its cancellation rules are checked below and matter more than the score.`
      :"Different nāḍīs - the highest-weighted koota is clear. Constitutionally the pair reads as complementary.",
    why:{rule:"Each nakṣatra falls in the Aadi, Madhya or Antya nāḍī. Different nāḍīs take all eight points; the same nāḍī is Nāḍī dosha and takes none",
      chart:`Groom ${g.nakName} → ${gn}; bride ${b.nakName} → ${bn}`,
      tradition:"Nāḍī koota - Bṛhat Parāśara Horā Śāstra"}};
}

/* ---------------- dosha cancellation (exception) rules ----------------
   A raw Ashtakoota total is close to meaningless until these have run. The
   classics attach explicit exceptions to both heavy doshas, and quoting a score
   without them is the commonest error in machine-generated matching. */
function doshaGates(g,b,kootas){
  const maitri=kootas.find(k=>k.name==="Graha Maitri");
  const nadi=kootas.find(k=>k.name==="Nadi"), bhak=kootas.find(k=>k.name==="Bhakoot");
  const out=[];

  if(nadi.same){
    const ex=[];
    if(g.nak===b.nak&&g.pada!==b.pada) ex.push(`both are in ${g.nakName} but in different padas (${g.pada} and ${b.pada})`);
    if(g.sign===b.sign&&g.nak!==b.nak) ex.push(`both Moons share ${g.signName} but sit in different nakṣatras`);
    if(g.nak===b.nak&&g.sign!==b.sign) ex.push(`both are in ${g.nakName} but the nakṣatra spans two rāśis and their Moons fall in different ones (${g.signName} / ${b.signName})`);
    if(g.lord===b.lord) ex.push(`both Moon-signs are ruled by the same graha, ${g.lordName}`);
    if(maitri.pts>=5) ex.push("Graha Maitrī stands at its full 5 points");
    out.push({name:"Nāḍī Dosha",present:true,cancelled:ex.length>0,exceptions:ex,
      verdict:ex.length?`Present but CANCELLED - ${ex.join('; and ')}.`
        :"PRESENT, and no classical cancellation condition is met.",
      guidance:ex.length?"With a cancellation in force the traditional reading is that the dosha does not operate. It is still the item to mention first to a family astrologer."
        :"This is the single most significant item in the match. The classical concern is constitutional and touches the health of children. Treat it as a reason to consult a human astrologer before finalising - not as a verdict, and not as something an app should decide.",
      why:{rule:"Nāḍī dosha is cancelled when the pair share a nakṣatra but differ in pada, share a rāśi but differ in nakṣatra, share a nakṣatra across two rāśis, have the same Moon-sign lord, or hold full Graha Maitrī",
        chart:`Groom ${g.nakName} pada ${g.pada} in ${g.signName}; bride ${b.nakName} pada ${b.pada} in ${b.signName}; Graha Maitrī ${maitri.pts}/5`,
        tradition:"Nāḍī dosha exceptions - classical melāpaka tradition"}});
  } else out.push({name:"Nāḍī Dosha",present:false,cancelled:false,exceptions:[],
    verdict:"ABSENT - the nāḍīs differ.",guidance:"The heaviest-weighted koota is clear.",
    why:{rule:"Nāḍī dosha requires both partners to fall in the same nāḍī",
      chart:`Groom ${nadi.gn}, bride ${nadi.bn} - different`,tradition:"Nāḍī koota - Bṛhat Parāśara Horā Śāstra"}});

  if(bhak.badReason){
    const ex=[];
    if(g.lord===b.lord) ex.push(`both Moon-signs are ruled by ${g.lordName}`);
    else if(natRel(g.lord,b.lord)==="friend"&&natRel(b.lord,g.lord)==="friend") ex.push(`the Moon-sign lords ${g.lordName} and ${b.lordName} are natural friends`);
    if(maitri.pts>=5) ex.push("Graha Maitrī stands at its full 5 points");
    if(g.nak===b.nak&&g.sign===b.sign) ex.push("both Moons occupy the same rāśi and the same nakṣatra");
    out.push({name:"Bhakūṭa Dosha",present:true,cancelled:ex.length>0,exceptions:ex,
      verdict:ex.length?`Present but CANCELLED - ${ex.join('; and ')}.`:`PRESENT on ${bhak.axis}, with no cancellation condition met.`,
      guidance:ex.length?"With the cancellation in force the classics set the dosha aside; the seven points remain forfeit in the arithmetic even so, which is why the total under-reads this match."
        :`The ${bhak.axis} axis is the concern - ${bhak.badReason}. Worth naming plainly and discussing.`,
      why:{rule:"Bhakūṭa dosha is cancelled when both Moon-signs share a lord, when the two lords are natural friends, when Graha Maitrī is full, or when both Moons share rāśi and nakṣatra",
        chart:`${bhak.axis} axis; lords ${g.lordName} / ${b.lordName} (${natRel(g.lord,b.lord)}); Graha Maitrī ${maitri.pts}/5`,
        tradition:"Bhakūṭa dosha exceptions - classical melāpaka tradition"}});
  } else out.push({name:"Bhakūṭa Dosha",present:false,cancelled:false,exceptions:[],
    verdict:`ABSENT - the Moon-signs form the ${bhak.axis} axis, none of the afflicted ones.`,
    guidance:"Emotional and financial harmony are not obstructed on this count.",
    why:{rule:"Bhakūṭa dosha requires the Moon-signs to stand in a 2/12, 5/9 or 6/8 relationship",
      chart:`The ${bhak.axis} axis is not among the afflicted three`,tradition:"Bhakūṭa koota - Bṛhat Parāśara Horā Śāstra"}});

  return out;
}

/* ---------------- Manglik (Kuja) dosha for one chart, with bhaṅga ---------------- */
const MANGLIK_H=[1,2,4,7,8,12];
function manglikOf(chart){
  const P=chart.planets, mars=P[2];
  const fromL=mars.house, fromM=dist(mars.sign,P[1].sign), fromV=dist(mars.sign,P[5].sign);
  const hits=[];
  if(MANGLIK_H.includes(fromL))hits.push(`${ORD(fromL)} from the Lagna`);
  if(MANGLIK_H.includes(fromM))hits.push(`${ORD(fromM)} from the Moon`);
  if(MANGLIK_H.includes(fromV))hits.push(`${ORD(fromV)} from Venus`);
  const bhanga=[];
  if(mars.sign===0||mars.sign===7) bhanga.push(`Mars is in its own sign (${SIGNS[mars.sign]})`);
  if(mars.sign===9) bhanga.push("Mars is exalted in Capricorn");
  /* the classical house/sign pairs that cancel outright */
  const PAIRS={1:[0],4:[7],7:[9],8:[3],12:[8]};
  if(PAIRS[fromL]&&PAIRS[fromL].includes(mars.sign)) bhanga.push(`Mars stands in the ${ORD(fromL)} in ${SIGNS[mars.sign]} - one of the classical cancelling house/sign pairs`);
  if(P[4].sign===mars.sign) bhanga.push("Jupiter is conjoined Mars");
  else{const dj=dist(mars.sign,P[4].sign); if([5,7,9].includes(dj)) bhanga.push(`Jupiter casts its ${ORD(dj)} special aspect on Mars`);}
  if(P[1].sign===mars.sign) bhanga.push("the Moon is conjoined Mars");
  return {present:hits.length>0,hits,fromL,fromM,fromV,bhanga,
    sign:SIGNS[mars.sign],house:mars.house};
}

/* ---------------- daśā overlap ---------------- */
const DASHA_TONE={0:"mixed - authority and ego both rise",1:"supportive - emotional and domestic",
  2:"testing - friction and haste need managing",3:"supportive - talk, trade and mobility",
  4:"supportive - the classical marriage-friendly period",5:"supportive - the marriage kāraka's own period",
  6:"testing - delay, duty and endurance",7:"testing - restlessness and unconventional turns",
  8:"testing - detachment and an inward pull"};
const TESTING=[2,6,7,8];
function dashaState(chart){
  const vim=J.vimshottari(chart.planets[1].lon,chart.jd), n=nowJD();
  const i=vim.list.findIndex(m=>n>=m.st&&n<m.en);
  const cur=i>=0?vim.list[i]:null, next=i>=0?vim.list[i+1]:null;
  const ad=cur&&cur.ad?cur.ad.find(a=>n>=a.st&&n<a.en):null;
  return {cur,next,ad,
    curLord:cur?cur.lord:null,nextLord:next?next.lord:null,adLord:ad?ad.lord:null,
    curName:cur?PLANETS[cur.lord]:"-",nextName:next?PLANETS[next.lord]:"-",adName:ad?PLANETS[ad.lord]:"-",
    curTesting:cur?TESTING.includes(cur.lord):false,nextTesting:next?TESTING.includes(next.lord):false};
}

/* ---------------- chart-level layers ---------------- */
const SUPPORT_H=[1,2,4,5,7,9,10,11], FRICTION_H=[6,8,12];
function deepLayers(A,B,labA,labB){
  const out=[];
  const dsA=dashaState(A), dsB=dashaState(B);
  /* The Vimśottari cycle spans 120 years, so for a birth far enough in the past
     it has simply run out and there is no running period to name. Say that
     plainly rather than printing empty placeholders. */
  const CYCLE_DONE="the 120-year Vimśottari cycle has completed, so no period is running";
  const dashaPhrase=ds=>ds.cur
    ?`${ds.curName} mahādaśā (${ds.adName} antardaśā) now, ${ds.nextName} next`
    :CYCLE_DONE;
  const dashaTone=ds=>ds.cur&&DASHA_TONE[ds.curLord]?DASHA_TONE[ds.curLord]:CYCLE_DONE;
  const dashaLine=`${labA}: ${dashaPhrase(dsA)}. ${labB}: ${dashaPhrase(dsB)}.`;

  /* -- 7th house / 7th lord cross-reading -- */
  const cross=(C,D,lc,ld)=>{
    const l7=SIGN_LORD[(C.ascSign+6)%12];
    const h=dist(C.planets[l7].sign,D.ascSign);
    const kind=SUPPORT_H.includes(h)?"supports":FRICTION_H.includes(h)?"strains":"is neutral toward";
    return {l7,h,kind,text:`${lc}'s 7th lord ${PLANETS[l7]} (in ${SIGNS[C.planets[l7].sign]}) falls in the ${ORD(h)} counted from ${ld}'s Lagna - it ${kind} ${ld}'s chart.`};
  };
  const cAB=cross(A,B,labA,labB), cBA=cross(B,A,labB,labA);
  const bothGood=cAB.kind==="supports"&&cBA.kind==="supports";
  const bothBad=cAB.kind==="strains"&&cBA.kind==="strains";
  out.push({name:"7th house & 7th lord cross-reading",
    strength:bothGood?"strong":bothBad?"weak":"moderate",
    detail:`${cAB.text} ${cBA.text}`,
    plain:bothGood?"Each partner's marriage-lord lands somewhere useful in the other's chart - the pair actively helps each other's affairs, not just coexists."
      :bothBad?"Each partner's marriage-lord lands in a difficult house of the other's chart. Read as an area where the two lives complicate each other; it asks for deliberate work rather than a remedy."
      :"One direction supports, the other is neutral or strained - the ordinary asymmetry of most matches. The supported partner tends to gain more from the marriage on paper.",
    dasha:`Activates when either 7th lord (${PLANETS[cAB.l7]} / ${PLANETS[cBA.l7]}) runs as mahā or antardaśā. ${dashaLine}`,
    why:{rule:"Place one partner's 7th lord in the other's chart by sign and read the bhāva it occupies: the 1st, 2nd, 4th, 5th, 7th, 9th, 10th and 11th support; the 6th, 8th and 12th strain",
      chart:`${labA} 7th lord ${PLANETS[cAB.l7]} → ${ORD(cAB.h)} from ${labB}'s Lagna (${SIGNS[B.ascSign]}); ${labB} 7th lord ${PLANETS[cBA.l7]} → ${ORD(cBA.h)} from ${labA}'s Lagna (${SIGNS[A.ascSign]})`,
      tradition:"Cross-chart bhāva overlay - classical synastry practice beyond the kootas"}});

  /* -- Venus / Jupiter cross-check (both directions, not just the classical one) -- */
  const kar=(C,pi,lab)=>{const p=C.planets[pi];
    return {p,txt:`${lab}'s ${PLANETS[pi]} in ${SIGNS[p.sign]}, house ${p.house}${p.dig?` (${p.dig.label})`:''}${p.combust?', combust':''}${p.retro&&pi>1?', retrograde':''}`,
      good:!(p.dig&&p.dig.cls==='debil')&&!p.combust&&!FRICTION_H.includes(p.house)};};
  const vA=kar(A,5,labA), jA=kar(A,4,labA), vB=kar(B,5,labB), jB=kar(B,4,labB);
  const strongCount=[vA,jA,vB,jB].filter(k=>k.good).length;
  out.push({name:"Venus & Jupiter cross-check",
    strength:strongCount>=3?"strong":strongCount>=2?"moderate":"weak",
    detail:`${vA.txt}. ${jA.txt}. ${vB.txt}. ${jB.txt}.`,
    plain:strongCount>=3?"The two kārakas that carry a marriage - Venus for affection and comfort, Jupiter for commitment and growth - are in good shape across both charts. This is one of the better signatures for a marriage lasting well."
      :strongCount>=2?"The marriage kārakas are mixed across the two charts: one partner carries the affection and stability more visibly than the other. Workable, and it tends to settle into a division of roles."
      :"Venus and Jupiter are under pressure in both charts. Traditionally read as affection and commitment needing conscious tending rather than arriving by themselves - not as a bar to the marriage.",
    dasha:`Most active in Venus and Jupiter periods. ${dashaLine}`,
    why:{rule:"Classically Venus is weighed in the man's chart and Jupiter in the woman's; both are read in both charts here for a fuller modern reading. Debilitation, combustion or a dusthāna placement weakens the kāraka",
      chart:`${vA.txt}; ${jA.txt}; ${vB.txt}; ${jB.txt} - ${strongCount} of 4 well-placed`,
      tradition:"Venus/Jupiter kāraka reading - Bṛhat Jātaka / Phaladīpikā"}});

  /* -- Manglik matching -- */
  const mA=manglikOf(A), mB=manglikOf(B);
  let mVerdict, mStrength;
  if(!mA.present&&!mB.present){mVerdict="Neither chart is Manglik.";mStrength="strong";}
  else if(mA.present&&mB.present){mVerdict=`Both charts carry Kuja dosha - the classical mutual cancellation applies, which is precisely why a Manglik is traditionally matched with a Manglik.`;mStrength="strong";}
  else{const who=mA.present?labA:labB, m=mA.present?mA:mB;
    mVerdict=m.bhanga.length
      ?`Only ${who} is Manglik, but Manglik Bhaṅga applies - ${m.bhanga.join('; ')}.`
      :`Only ${who} is Manglik (Mars ${m.hits.join(', ')}), and no classical bhaṅga condition is met. This is the second thing to raise with an astrologer.`;
    mStrength=m.bhanga.length?"moderate":"weak";}
  out.push({name:"Manglik (Kuja) matching",strength:mStrength,
    detail:`${labA}: ${mA.present?`Manglik - Mars ${mA.hits.join(', ')}`:"not Manglik"}. ${labB}: ${mB.present?`Manglik - Mars ${mB.hits.join(', ')}`:"not Manglik"}. ${mVerdict}`,
    plain:mStrength==="strong"?"Mars raises no matching objection here."
      :mStrength==="moderate"?"Mars is a live factor but a cancelling condition is present; traditionally that settles it."
      :"An unmatched Manglik. The traditional remedies are Maṅgala/Hanuman worship, a Kumbha-vivāha before the marriage, or choosing a muhūrta on advice - all offered as traditional practice, not as guarantees.",
    dasha:`Sharpest in Mars mahā/antardaśās and during Mars transits over the 7th. ${dashaLine}`,
    why:{rule:"Mars in the 1st, 2nd, 4th, 7th, 8th or 12th from the Lagna, the Moon or Venus is Kuja dosha. It cancels when both partners carry it, when Mars is in its own sign or exaltation, in one of the classical cancelling house/sign pairs, or conjoined/aspected by Jupiter or the Moon",
      chart:`${labA}: Mars in ${mA.sign}, ${ORD(mA.fromL)} from Lagna / ${ORD(mA.fromM)} from Moon / ${ORD(mA.fromV)} from Venus. ${labB}: Mars in ${mB.sign}, ${ORD(mB.fromL)} / ${ORD(mB.fromM)} / ${ORD(mB.fromV)}`,
      tradition:"Kuja dosha and Manglik bhaṅga - classical melāpaka tradition"}});

  /* -- daśā compatibility -- */
  const testing=[dsA.curTesting&&`${labA} is in a ${dsA.curName} mahādaśā`,dsB.curTesting&&`${labB} is in a ${dsB.curName} mahādaśā`,
    dsA.nextTesting&&`${labA} moves into ${dsA.nextName} next`,dsB.nextTesting&&`${labB} moves into ${dsB.nextName} next`].filter(Boolean);
  out.push({name:"Daśā compatibility",strength:testing.length===0?"strong":testing.length<=1?"moderate":"weak",
    detail:`${labA}: ${dsA.cur?`${dsA.curName} mahādaśā (${dsA.adName} antardaśā), ${dashaTone(dsA)}; ${dsA.nextName} follows`:CYCLE_DONE}. ${labB}: ${dsB.cur?`${dsB.curName} mahādaśā (${dsB.adName} antardaśā), ${dashaTone(dsB)}; ${dsB.nextName} follows`:CYCLE_DONE}.`,
    plain:testing.length===0?"Both partners are running periods that support settling down and staying settled - a good window for the marriage itself and for its first years."
      :testing.length<=1?`One testing period is in play (${testing[0]}). The classical reading is that the strain belongs to that partner's own karma rather than to the marriage, and the other partner's steadier period carries the pair.`
      :`Several testing periods overlap: ${testing.join('; ')}. Worth knowing in advance - Saturn, Rāhu, Ketu and Mars periods bring their own pressure, and a marriage beginning inside them is often blamed for difficulties that belong to the daśā.`,
    dasha:dashaLine,
    why:{rule:"Read the running and next Vimśottari mahādaśās of both partners; Mars, Saturn, Rāhu and Ketu periods are the testing ones for domestic stability, Jupiter, Venus, Mercury and the Moon the supportive",
      chart:`${labA} ${dsA.curName}→${dsA.nextName}; ${labB} ${dsB.curName}→${dsB.nextName}`,
      tradition:"Vimśottari daśā - Bṛhat Parāśara Horā Śāstra"}});

  /* -- Navamsa (D-9) overlay: the varga that actually governs marriage -- */
  const d9=(C)=>{const v=J.buildVarga(C,9), l7=SIGN_LORD[(v.ascSign+6)%12];
    const l7item=v.items.find(x=>x.i===l7);
    return {asc:v.ascSign,l7,l7sign:l7item.sign,l7house:dist(l7item.sign,v.ascSign),
      vargottama:v.items.filter(x=>x.i<7&&x.sign===C.planets[x.i].sign).map(x=>PLANETS[x.i])};};
  const d9A=d9(A), d9B=d9(B);
  const d9dist=dist(d9A.asc,d9B.asc);
  const d9Cross=dist(d9A.l7sign,d9B.asc), d9Cross2=dist(d9B.l7sign,d9A.asc);
  const d9Bad=[6,8,12].includes(d9A.l7house)||[6,8,12].includes(d9B.l7house);
  const d9AxisBad=[2,6,8,12].includes(d9dist);
  out.push({name:"Navāṁśa (D-9) overlay",strength:(!d9Bad&&!d9AxisBad)?"strong":(d9Bad&&d9AxisBad)?"weak":"moderate",
    detail:`${labA}'s D-9 Lagna ${SIGNS[d9A.asc]}, D-9 7th lord ${PLANETS[d9A.l7]} in ${SIGNS[d9A.l7sign]} (${ORD(d9A.l7house)} in D-9). ${labB}'s D-9 Lagna ${SIGNS[d9B.asc]}, D-9 7th lord ${PLANETS[d9B.l7]} in ${SIGNS[d9B.l7sign]} (${ORD(d9B.l7house)} in D-9). The two D-9 Lagnas stand ${d9dist} signs apart; cross-placed, the 7th lords fall in the ${ORD(d9Cross)} and ${ORD(d9Cross2)} of each other's D-9.${d9A.vargottama.length||d9B.vargottama.length?` Vargottama grahas: ${labA} ${d9A.vargottama.join(', ')||'none'}; ${labB} ${d9B.vargottama.join(', ')||'none'}.`:''}`,
    plain:(!d9Bad&&!d9AxisBad)?"The Navāṁśa - the chart the classics actually use to judge a marriage, rather than the birth chart alone - reads well for both. This carries more weight than any single koota."
      :(d9Bad&&d9AxisBad)?"Both the D-9 marriage lords and the axis between the two D-9 Lagnas read as strained. Since D-9 is the varga that governs marriage specifically, this deserves more attention than the Ashtakoota total does."
      :"The Navāṁśa reads mixed: one indication is strained while the other holds. Ordinary for most matches, and the D-9 is worth walking through with an astrologer since it outranks the kootas on marital questions.",
    dasha:`Read alongside the running daśās above; D-9 results surface most in the periods of the D-9 7th lords (${PLANETS[d9A.l7]} / ${PLANETS[d9B.l7]}).`,
    why:{rule:"The Navāṁśa (D-9) is the classical varga for marriage, so the 7th house and 7th lord of both D-9 charts are cross-read, not only those of the D-1. A D-9 7th lord in a dusthāna, or a 2/6/8/12 axis between the two D-9 Lagnas, weakens the reading",
      chart:`D-9 Lagnas ${SIGNS[d9A.asc]} / ${SIGNS[d9B.asc]} (${d9dist} signs apart); D-9 7th lords in the ${ORD(d9A.l7house)} and ${ORD(d9B.l7house)} of their own D-9 charts`,
      tradition:"Navāṁśa varga - Bṛhat Parāśara Horā Śāstra; mandatory for marital questions"}});

  return {layers:out,dsA,dsB,mA,mB,d9A,d9B};
}

/* ---------------- compatibility by life area ----------------
   The Ashtakoota total is one number for a whole marriage, which is not much use.
   Each area below is scored from the kootas and chart factors that classically
   govern it, and carries the same five-part provenance as any other reading. */
function lifeAreas(A,B,labA,labB,kootas,deep){
  const k=n=>kootas.find(x=>x.name===n);
  const pct=(p,m)=>Math.round(p/m*100);
  const band=v=>v>=80?"strong":v>=55?"moderate":"weak";
  const P=A.planets, Q=B.planets;
  const out=[];
  const push=(name,score,factors,plainStrong,plainMid,plainWeak,dasha,rule,chartTxt,trad)=>{
    const s=Math.max(0,Math.min(100,Math.round(score)));
    out.push({name,score:s,strength:band(s),factors,
      plain:s>=80?plainStrong:s>=55?plainMid:plainWeak,dasha,
      why:{rule,chart:chartTxt,tradition:trad}});
  };

  /* Emotional - Bhakoot carries this, with the Moons' own condition */
  const bh=k("Bhakoot"), moonOK=[P[1],Q[1]].filter(m=>!(m.dig&&m.dig.cls==='debil')).length;
  push("Emotional compatibility",pct(bh.pts,7)*0.7+moonOK*15,
    `Bhakoot ${bh.pts}/7 (the ${bh.axis} axis); Moons in ${SIGNS[P[1].sign]} and ${SIGNS[Q[1].sign]}, ${moonOK} of 2 undebilitated.`,
    "Feelings run in the same direction. Comfort is easy between them and neither has to explain their moods.",
    "Emotionally workable. There will be moods the other reads wrongly, and talking rather than assuming closes the gap.",
    "The emotional wiring differs markedly. Neither is at fault for it; it means bids for closeness get misread, and that responds to plain speech more than to any remedy.",
    `Emotional themes surface in Moon periods. ${labA} is in ${deep.dsA.curName}, ${labB} in ${deep.dsB.curName}.`,
    "Bhakūṭa koota governs emotional bonding; the condition of both Moons (dignity, affliction) modifies it",
    `Bhakoot ${bh.pts}/7 on the ${bh.axis} axis; Moon dignity: ${labA} ${P[1].dig?P[1].dig.label:'neutral'}, ${labB} ${Q[1].dig?Q[1].dig.label:'neutral'}`,
    "Bhakūṭa koota - Bṛhat Parāśara Horā Śāstra");

  /* Mental / intellectual - Graha Maitri, plus Mercury */
  const gm=k("Graha Maitri");
  const mercOK=[P[3],Q[3]].filter(m=>!(m.dig&&m.dig.cls==='debil')&&!m.combust).length;
  push("Mental & intellectual compatibility",pct(gm.pts,5)*0.75+mercOK*12.5,
    `Graha Maitrī ${gm.pts}/5 (Moon-lords ${SIGNS[P[1].sign]}→${PLANETS[SIGN_LORD[P[1].sign]]}, ${SIGNS[Q[1].sign]}→${PLANETS[SIGN_LORD[Q[1].sign]]}); Mercury ${mercOK} of 2 unafflicted.`,
    "Minds meet. They reason the same way, which is the quality that keeps a long marriage interesting rather than merely stable.",
    "Reasonable meeting of minds - different approaches that can be bridged with a little translation.",
    "They think in different idioms. Agreement on facts will be easier than agreement on what the facts mean; expect to spell things out.",
    `Mercury and Moon-lord periods sharpen this. ${labA} ${deep.dsA.curName}-${deep.dsA.adName}, ${labB} ${deep.dsB.curName}-${deep.dsB.adName}.`,
    "Graha Maitrī scores the natural friendship of the two Moon-sign lords and is the classical measure of mental compatibility; Mercury's condition in both charts modifies it",
    `Graha Maitrī ${gm.pts}/5; Mercury: ${labA} in ${SIGNS[P[3].sign]}${P[3].combust?' (combust)':''}, ${labB} in ${SIGNS[Q[3].sign]}${Q[3].combust?' (combust)':''}`,
    "Graha Maitrī koota - Bṛhat Parāśara Horā Śāstra");

  /* Communication - Mercury and the 3rd house */
  const l3A=SIGN_LORD[(A.ascSign+2)%12], l3B=SIGN_LORD[(B.ascSign+2)%12];
  const commScore=(mercOK*25)+(SUPPORT_H.includes(P[l3A].house)?25:10)+(SUPPORT_H.includes(Q[l3B].house)?25:10);
  push("Communication compatibility",commScore,
    `Mercury in ${SIGNS[P[3].sign]} (${labA}) and ${SIGNS[Q[3].sign]} (${labB}); 3rd lords ${PLANETS[l3A]} in the ${ORD(P[l3A].house)} and ${PLANETS[l3B]} in the ${ORD(Q[l3B].house)}.`,
    "They talk well. Disagreements get discussed rather than stored, which is the single most protective habit in a marriage.",
    "Communication works with effort. One tends to say less than they mean; naming that pattern early saves years of guessing.",
    "Communication is the weak link. Both Mercurys and the speech houses are under pressure, so misunderstanding is the default and has to be actively worked against.",
    `Mercury mahā/antardaśās activate this. ${labA} ${deep.dsA.curName}, ${labB} ${deep.dsB.curName}.`,
    "Mercury is the graha of speech and exchange; the 3rd bhāva and its lord govern how each partner communicates. Combustion or debilitation of Mercury, or a 3rd lord in a dusthāna, weakens the reading",
    `Mercury ${mercOK}/2 unafflicted; 3rd lords in the ${ORD(P[l3A].house)} (${labA}) and ${ORD(Q[l3B].house)} (${labB})`,
    "Mercury and 3rd-bhāva significations - Bṛhat Jātaka / Phaladīpikā");

  /* Family & in-law harmony - Gana temperament plus 2nd/4th houses */
  const gn=k("Gana");
  const l4A=SIGN_LORD[(A.ascSign+3)%12], l4B=SIGN_LORD[(B.ascSign+3)%12];
  const famOK=[P[l4A],Q[l4B]].filter(p=>!FRICTION_H.includes(p.house)).length;
  push("Family & in-law harmony",pct(gn.pts,6)*0.65+famOK*17.5,
    `Gaṇa ${gn.pts}/6; 4th lords ${PLANETS[l4A]} in the ${ORD(P[l4A].house)} and ${PLANETS[l4B]} in the ${ORD(Q[l4B].house)}.`,
    "Temperaments and home instincts agree, and the wider families read as likely to absorb the marriage well.",
    "Family harmony is achievable but not automatic. The usual pattern is one side adapting more; agreeing who, deliberately, avoids the resentment.",
    "Temperament clash and pressured home houses. In-law friction is the classical reading - keeping the marriage's own boundary firm matters more here than in most matches.",
    `4th-lord and Gaṇa-related periods. ${labA} ${deep.dsA.curName}, ${labB} ${deep.dsB.curName}.`,
    "Gaṇa koota measures temperament, the classical predictor of household friction; the 4th bhāva and its lord govern home and mother in each chart",
    `Gaṇa ${gn.pts}/6; 4th lords in the ${ORD(P[l4A].house)} and ${ORD(Q[l4B].house)}, ${famOK} of 2 outside a dusthāna`,
    "Gaṇa koota and 4th-bhāva significations - Bṛhat Parāśara Horā Śāstra");

  /* Financial - Bhakoot's money face plus the 2nd/11th lords */
  const l2A=SIGN_LORD[(A.ascSign+1)%12], l11A=SIGN_LORD[(A.ascSign+10)%12];
  const l2B=SIGN_LORD[(B.ascSign+1)%12], l11B=SIGN_LORD[(B.ascSign+10)%12];
  const finOK=[P[l2A],P[l11A],Q[l2B],Q[l11B]].filter(p=>!FRICTION_H.includes(p.house)).length;
  const twelveTwo=bh.axis==="2/12";
  push("Financial compatibility",finOK*20+(twelveTwo?0:20),
    `2nd/11th lords: ${labA} ${PLANETS[l2A]} (${ORD(P[l2A].house)}) and ${PLANETS[l11A]} (${ORD(P[l11A].house)}); ${labB} ${PLANETS[l2B]} (${ORD(Q[l2B].house)}) and ${PLANETS[l11B]} (${ORD(Q[l11B].house)}). Bhakoot axis ${bh.axis}.`,
    "The money houses are sound on both sides and the Bhakoot axis does not touch finance - earning and saving instincts should pull together.",
    "Finances are workable with an explicit agreement. Their instincts about spending are unlikely to match by themselves.",
    twelveTwo?"The 2/12 Bhakoot axis is the classical money-drain signature, and the wealth houses are pressured on top of it. A frank, early arrangement about money matters more than usual here."
      :"The wealth houses carry pressure in both charts. Read as needing structure and agreement around money rather than as poverty.",
    `2nd and 11th-lord periods bring this forward. ${labA} ${deep.dsA.curName}, ${labB} ${deep.dsB.curName}.`,
    "The 2nd bhāva (accumulated wealth) and 11th (gains) and their lords govern finance in each chart; a 2/12 Bhakoot axis is the classical indicator of money flowing out of the household",
    `${finOK} of 4 wealth-house lords outside a dusthāna; Bhakoot axis ${bh.axis}`,
    "Dhana bhāvas and Bhakūṭa koota - Bṛhat Parāśara Horā Śāstra");

  /* Long-term stability - Nadi gate, 7th lords, Saturn */
  const nadiGate=deep.gates?deep.gates.find(g=>g.name==="Nāḍī Dosha"):null;
  const nd=k("Nadi");
  const satOK=[P[6],Q[6]].filter(s=>!FRICTION_H.includes(s.house)||s.dig&&s.dig.cls!=='debil').length;
  const nadiClear=!nd.same||(nadiGate&&nadiGate.cancelled);
  const l7layer=deep.layers.find(l=>l.name==="7th house & 7th lord cross-reading");
  const stab=(nadiClear?40:10)+(l7layer.strength==="strong"?35:l7layer.strength==="moderate"?22:8)+satOK*12;
  push("Long-term stability & longevity of the bond",stab,
    `Nāḍī ${nd.pts}/8${nd.same?(nadiClear?" (dosha cancelled)":" (dosha standing)"):""}; 7th-lord cross-reading ${l7layer.strength}; Saturn in the ${ORD(P[6].house)} (${labA}) and ${ORD(Q[6].house)} (${labB}).`,
    "The indications for a marriage that lasts are good: the heavy koota is clear, the charts support each other, and Saturn - the graha of endurance - is not obstructing.",
    "Stability is likely but earned rather than given. Most long marriages read about here; the difference is made by what the couple does, not by the chart.",
    "Several longevity indicators are weak at once. Classical practice would treat this as the section to discuss with a human astrologer before finalising, and would look at muhūrta carefully.",
    `Saturn periods and transits test this most. ${labA} ${deep.dsA.curName}→${deep.dsA.nextName}, ${labB} ${deep.dsB.curName}→${deep.dsB.nextName}.`,
    "Nāḍī koota (with its cancellation rules) is the heaviest indicator of a durable bond; the cross-chart 7th-lord reading and Saturn's placement in both charts modify it",
    `Nāḍī ${nd.pts}/8, ${nadiClear?'clear or cancelled':'dosha standing'}; 7th-lord cross ${l7layer.strength}; Saturn ${ORD(P[6].house)} / ${ORD(Q[6].house)}`,
    "Nāḍī koota and āyuṣ-kāraka Saturn - Bṛhat Parāśara Horā Śāstra");

  /* Physical & health - Yoni and Tara, with Mars and Venus */
  const yn=k("Yoni"), tr=k("Tara");
  const marsVenOK=[P[2],P[5],Q[2],Q[5]].filter(p=>!(p.dig&&p.dig.cls==='debil')&&!p.combust).length;
  push("Physical & health compatibility",pct(yn.pts,4)*0.45+pct(tr.pts,3)*0.3+marsVenOK*6.25,
    `Yoni ${yn.pts}/4, Tārā ${tr.pts}/3; Mars and Venus ${marsVenOK} of 4 unafflicted across the two charts.`,
    "Physical rapport and mutual health both read well - the instinctive side of the marriage is one of its assets.",
    "Physically workable. Rhythms differ somewhat; the classics treat this as a matter of adjustment rather than of compatibility.",
    "Yoni and Tārā are both low. Read as differing physical rhythms and a general health caution for the pair - a genuine item for discussion, and one where a physician, not an astrologer, is the right authority on the health half.",
    `Mars and Venus periods bring this forward. ${labA} ${deep.dsA.curName}, ${labB} ${deep.dsB.curName}.`,
    "Yoni koota governs physical compatibility and Tārā koota mutual wellbeing; the condition of Mars (vitality) and Venus (desire, comfort) in both charts modifies both",
    `Yoni ${yn.pts}/4, Tārā ${tr.pts}/3; Mars/Venus ${marsVenOK} of 4 unafflicted`,
    "Yoni and Tārā kootas - Bṛhat Parāśara Horā Śāstra");

  return out;
}

/* ---------------- the whole match ---------------- */
function compatibility(chartA,chartB){
  /* Roles follow the stated genders; the classical tables are written groom-first,
     so if the genders don't settle it we take the first chart as the groom's and
     say so in the output rather than guessing silently. */
  const ga=(chartA.input&&chartA.input.gender)||'na', gb=(chartB.input&&chartB.input.gender)||'na';
  let groomChart=chartA, brideChart=chartB, assumed=false;
  if(ga==='female'&&gb!=='female'){groomChart=chartB;brideChart=chartA;}
  else if(ga!=='male'&&gb==='male'){groomChart=chartB;brideChart=chartA;}
  else if(ga!=='male'&&gb!=='female') assumed=true;
  const labG=(groomChart.input.name||'Chart A').split(' ')[0];
  const labB=(brideChart.input.name||'Chart B').split(' ')[0];

  const g=moonInfo(groomChart), b=moonInfo(brideChart);
  const kootas=[kVarna(g,b),kVashya(g,b),kTara(g,b),kYoni(g,b),kMaitri(g,b),kGana(g,b),kBhakoot(g,b),kNadi(g,b)];
  const total=kootas.reduce((s,k)=>s+k.pts,0);
  const gates=doshaGates(g,b,kootas);
  const deep=deepLayers(groomChart,brideChart,labG,labB);
  deep.gates=gates;
  const areas=lifeAreas(groomChart,brideChart,labG,labB,kootas,deep);

  /* ---- Parts 3 and 4 of the contract for the kootas and the gates ----
     The chart-level layers and the seven life areas already carry all five parts
     in their own markup - a strength band, the plain reading and a daśā line -
     so nothing is added to them here; repeating it inside the disclosure would
     just print each one twice. The kootas and the gates are the two that showed
     a rule and a score but never how strongly it read or when it applies.
     Neither is daśā-timed: Ashtakoota compares two Moons and stands for life, so
     the window says exactly that rather than inventing a period. A koota's
     strength has only one honest measure - the share of its own points it took. */
  const NOT_TIMED="Not daśā-timed - a koota is a standing comparison of the two nativities, not an event that switches on. For when marital themes activate, see Daśā & Timing.";
  const bandPts=r=>r>=0.85?"strong":r>=0.5?"moderate":"weak";
  kootas.forEach(k=>{ if(!k.why)return;
    k.why.confidence={level:bandPts(k.pts/k.max),
      basis:`took ${k.pts} of its ${k.max} classical points, and it carries ${k.max} of the 36`};
    k.why.window=NOT_TIMED;
  });
  gates.forEach(x=>{ if(!x.why)return;
    x.why.confidence=!x.present
      ?{level:"weak",basis:"the classical condition is not met - the dosha does not form"}
      :x.cancelled
        ?{level:"weak",basis:`the dosha forms, but a classical cancellation is in force (${x.exceptions.length} condition${x.exceptions.length===1?'':'s'} met)`}
        :{level:"strong",basis:"the dosha forms and no classical cancellation condition is met"};
    x.why.window=NOT_TIMED;
  });

  /* Verdict in words, not just a number. The thresholds are the traditional ones
     and are guidelines - a total is never a pass/fail, and it is read only after
     the dosha gates. */
  const standing=gates.filter(x=>x.present&&!x.cancelled);
  const band=total>=28?"strong":total>=24?"good":total>=18?"workable":total>=14?"marginal":"low";
  const verdict=
    band==="strong"?`${total} of 36 is a strong traditional score.`
    :band==="good"?`${total} of 36 is a good traditional score, comfortably above the customary 18-point mark.`
    :band==="workable"?`${total} of 36 clears the customary 18-point mark and is read as workable.`
    :band==="marginal"?`${total} of 36 falls below the customary 18-point mark.`
    :`${total} of 36 is a low traditional score.`;

  const strengths=kootas.filter(k=>k.pts>=k.max*0.85).map(k=>`${k.name} at full or near-full strength (${k.pts}/${k.max})`)
    .concat(deep.layers.filter(l=>l.strength==="strong").map(l=>l.name+" reads strong"))
    .concat(areas.filter(a=>a.strength==="strong").map(a=>a.name+` (${a.score}%)`));
  const frictions=kootas.filter(k=>k.pts<=k.max*0.35).map(k=>`${k.name} weak (${k.pts}/${k.max}) - ${k.detail}`)
    .concat(standing.map(x=>`${x.name} present with no cancellation condition met`))
    .concat(deep.layers.filter(l=>l.strength==="weak").map(l=>l.name+" reads weak"))
    .concat(areas.filter(a=>a.strength==="weak").map(a=>a.name+` (${a.score}%)`));

  /* What to take to a human before deciding. Ranked, because "everything needs
     looking at" is not advice. */
  const escalate=[];
  standing.forEach(x=>escalate.push(`${x.name} - present and uncancelled. ${x.guidance}`));
  if(deep.mA.present!==deep.mB.present){
    const m=deep.mA.present?deep.mA:deep.mB, who=deep.mA.present?labG:labB;
    if(!m.bhanga.length)escalate.push(`Unmatched Manglik (${who}) - only one chart carries Kuja dosha and no bhaṅga condition applies.`);
  }
  const d9layer=deep.layers.find(l=>l.name==="Navāṁśa (D-9) overlay");
  if(d9layer.strength==="weak")escalate.push("The Navāṁśa (D-9) overlay - D-9 governs marriage specifically and outranks the koota total on marital questions.");
  if(deep.dsA.curTesting&&deep.dsB.curTesting)escalate.push(`Both partners are running testing mahādaśās (${deep.dsA.curName} and ${deep.dsB.curName}) - relevant to muhūrta, i.e. when to marry rather than whether.`);
  const weakArea=areas.slice().sort((x,y)=>x.score-y.score)[0];
  if(weakArea.score<55)escalate.push(`${weakArea.name} scores lowest of the seven life areas (${weakArea.score}%) - ${weakArea.factors}`);

  /* Remedies: traditional practice, framed as such. Never a guarantee, never
     medical, legal or financial advice. */
  const remedies=[];
  if(standing.some(x=>x.name==="Nāḍī Dosha"))remedies.push("For Nāḍī dosha: Mahā-mṛtyuñjaya japa, and a Nāḍī-dosha śānti before the marriage. Traditionally performed by the family priest.");
  if(standing.some(x=>x.name==="Bhakūṭa Dosha"))remedies.push(`For Bhakūṭa dosha on the ${kootas[6].axis} axis: Satyanārāyaṇa pūjā and Viṣṇu-sahasranāma recitation are the customary observances.`);
  if(deep.mA.present!==deep.mB.present&&!(deep.mA.present?deep.mA:deep.mB).bhanga.length)
    remedies.push("For an unmatched Manglik: Maṅgala/Hanuman worship, Tuesday observance, and where the family follows the practice, a Kumbha-vivāha before the wedding.");
  if(kootas[3].pts<=1)remedies.push("For a weak Yoni koota: the traditional advice is Durgā or Śiva-Pārvatī worship as a couple rather than a gemstone.");
  if(kootas[5].pts<=1)remedies.push("For a Gaṇa clash: Śiva worship and, traditionally, choosing a marriage muhūrta on a Deva-gana nakṣatra.");
  remedies.push("A marriage muhūrta chosen on the running daśās and transits of both charts is the remedy classical practice puts most weight on - and the one that needs a human astrologer with both charts in front of them.");

  return {total,max:36,band,verdict,kootas,gates,layers:deep.layers,areas,strengths,frictions,escalate,remedies,
    labG,labB,assumedRoles:assumed,groomName:groomChart.input.name,brideName:brideChart.input.name,
    g,b,dsG:deep.dsA,dsB:deep.dsB,manglikG:deep.mA,manglikB:deep.mB,d9G:deep.d9A,d9B:deep.d9B};
}

Object.assign(J,{compatibility,manglikOf,dashaState,ashtakootaTables:{YONI,YONI_M,VASHYA_CLASS,GANA,TARA}});
})();
