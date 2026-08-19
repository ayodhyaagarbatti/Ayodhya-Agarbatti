/* ======================= UI + LOGIN + ALL SECTIONS ======================= */
(function(){
const J = window.JATHAKA;
const $ = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];
const YEAR = 365.2425, EPOCH = Date.UTC(2000,0,1,12), J2000=2451545.0;
const jd2date = jd => new Date(EPOCH + (jd-J2000)*86400000);
const MON=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
const fmtDate = d => `${String(d.getUTCDate()).padStart(2,'0')} ${MON[d.getUTCMonth()]} ${d.getUTCFullYear()}`;
const jdFmt = jd => fmtDate(jd2date(jd));
const jdMY = jd => {const d=jd2date(jd);return `${MON[d.getUTCMonth()]} ${d.getUTCFullYear()}`;};
/* JD -> local clock time (HH:MM) at the birth place. Shifting the JD by the zone
   offset and then reading the UTC fields gives the local wall clock directly. */
const jdLocalTime = (jd,tz) => {if(jd==null)return '—';
  const d=jd2date(jd+tz/24+0.5/1440);  // +30s so we round to the nearest minute
  return `${String(d.getUTCHours()).padStart(2,'0')}:${String(d.getUTCMinutes()).padStart(2,'0')}`;};
const nowJD = () => J2000+(Date.now()-EPOCH)/86400000;
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const SS=J.SIGN_SHORT, SG=J.SIGNS, SA=J.SIGN_SANS, PL=J.PLANETS, PG=J.PL_GLYPH, PSA=J.PL_SANS, SL=J.SIGN_LORD;

/* ---- offline atlas ---- */
const CITIES=[
["Bengaluru","Karnataka, India",12.9716,77.5946,5.5],["Mysuru","Karnataka, India",12.2958,76.6394,5.5],
["Bhadravathi","Karnataka, India",13.8489,75.7050,5.5],["Shivamogga","Karnataka, India",13.9299,75.5681,5.5],
["Birur","Karnataka, India",13.5936,75.9714,5.5],["Chikkamagaluru","Karnataka, India",13.3161,75.7720,5.5],
["Kadur","Karnataka, India",13.5527,76.0119,5.5],["Tumakuru","Karnataka, India",13.3379,77.1173,5.5],
["Davangere","Karnataka, India",14.4644,75.9218,5.5],["Hubballi","Karnataka, India",15.3647,75.1240,5.5],
["Dharwad","Karnataka, India",15.4589,75.0078,5.5],["Belagavi","Karnataka, India",15.8497,74.4977,5.5],
["Ballari","Karnataka, India",15.1394,76.9214,5.5],["Kalaburagi","Karnataka, India",17.3297,76.8343,5.5],
["Mangaluru","Karnataka, India",12.9141,74.8560,5.5],["Udupi","Karnataka, India",13.3409,74.7421,5.5],
["Hassan","Karnataka, India",13.0068,76.0996,5.5],["Mandya","Karnataka, India",12.5223,76.8954,5.5],
["Chitradurga","Karnataka, India",14.2251,76.3980,5.5],["Raichur","Karnataka, India",16.2076,77.3463,5.5],
["Bidar","Karnataka, India",17.9104,77.5199,5.5],["Vijayapura","Karnataka, India",16.8302,75.7100,5.5],
["Hospet","Karnataka, India",15.2689,76.3909,5.5],["Gadag","Karnataka, India",15.4315,75.6355,5.5],
["Karwar","Karnataka, India",14.8135,74.1297,5.5],["Sirsi","Karnataka, India",14.6195,74.8354,5.5],
["Kolar","Karnataka, India",13.1362,78.1291,5.5],["Chikkaballapur","Karnataka, India",13.4355,77.7315,5.5],
["Tarikere","Karnataka, India",13.7075,75.8146,5.5],["Sagara","Karnataka, India",14.1667,75.0333,5.5],
["Mumbai","Maharashtra, India",19.0760,72.8777,5.5],["Pune","Maharashtra, India",18.5204,73.8567,5.5],
["Nagpur","Maharashtra, India",21.1458,79.0882,5.5],["Nashik","Maharashtra, India",19.9975,73.7898,5.5],
["Delhi","Delhi, India",28.6139,77.2090,5.5],["New Delhi","Delhi, India",28.6139,77.2090,5.5],
["Chennai","Tamil Nadu, India",13.0827,80.2707,5.5],["Coimbatore","Tamil Nadu, India",11.0168,76.9558,5.5],
["Madurai","Tamil Nadu, India",9.9252,78.1198,5.5],["Tiruchirappalli","Tamil Nadu, India",10.7905,78.7047,5.5],
["Salem","Tamil Nadu, India",11.6643,78.1460,5.5],["Kolkata","West Bengal, India",22.5726,88.3639,5.5],
["Hyderabad","Telangana, India",17.3850,78.4867,5.5],["Warangal","Telangana, India",17.9689,79.5941,5.5],
["Visakhapatnam","Andhra Pradesh, India",17.6868,83.2185,5.5],["Vijayawada","Andhra Pradesh, India",16.5062,80.6480,5.5],
["Tirupati","Andhra Pradesh, India",13.6288,79.4192,5.5],["Guntur","Andhra Pradesh, India",16.3067,80.4365,5.5],
["Ahmedabad","Gujarat, India",23.0225,72.5714,5.5],["Surat","Gujarat, India",21.1702,72.8311,5.5],
["Vadodara","Gujarat, India",22.3072,73.1812,5.5],["Rajkot","Gujarat, India",22.3039,70.8022,5.5],
["Jaipur","Rajasthan, India",26.9124,75.7873,5.5],["Jodhpur","Rajasthan, India",26.2389,73.0243,5.5],
["Udaipur","Rajasthan, India",24.5854,73.7125,5.5],["Kota","Rajasthan, India",25.2138,75.8648,5.5],
["Lucknow","Uttar Pradesh, India",26.8467,80.9462,5.5],["Kanpur","Uttar Pradesh, India",26.4499,80.3319,5.5],
["Varanasi","Uttar Pradesh, India",25.3176,82.9739,5.5],["Agra","Uttar Pradesh, India",27.1767,78.0081,5.5],
["Prayagraj","Uttar Pradesh, India",25.4358,81.8463,5.5],["Meerut","Uttar Pradesh, India",28.9845,77.7064,5.5],
["Patna","Bihar, India",25.5941,85.1376,5.5],["Gaya","Bihar, India",24.7955,84.9994,5.5],
["Bhopal","Madhya Pradesh, India",23.2599,77.4126,5.5],["Indore","Madhya Pradesh, India",22.7196,75.8577,5.5],
["Gwalior","Madhya Pradesh, India",26.2183,78.1828,5.5],["Jabalpur","Madhya Pradesh, India",23.1815,79.9864,5.5],
["Ujjain","Madhya Pradesh, India",23.1765,75.7885,5.5],["Kochi","Kerala, India",9.9312,76.2673,5.5],
["Thiruvananthapuram","Kerala, India",8.5241,76.9366,5.5],["Kozhikode","Kerala, India",11.2588,75.7804,5.5],
["Thrissur","Kerala, India",10.5276,76.2144,5.5],["Bhubaneswar","Odisha, India",20.2961,85.8245,5.5],
["Guwahati","Assam, India",26.1445,91.7362,5.5],["Chandigarh","Chandigarh, India",30.7333,76.7794,5.5],
["Amritsar","Punjab, India",31.6340,74.8723,5.5],["Ludhiana","Punjab, India",30.9010,75.8573,5.5],
["Dehradun","Uttarakhand, India",30.3165,78.0322,5.5],["Ranchi","Jharkhand, India",23.3441,85.3096,5.5],
["Raipur","Chhattisgarh, India",21.2514,81.6296,5.5],["Panaji","Goa, India",15.4909,73.8278,5.5],
["Srinagar","J&K, India",34.0837,74.7973,5.5],["Jammu","J&K, India",32.7266,74.8570,5.5],
["Puducherry","Puducherry, India",11.9416,79.8083,5.5],["Colombo","Sri Lanka",6.9271,79.8612,5.5],
["Kathmandu","Nepal",27.7172,85.3240,5.75],["Dhaka","Bangladesh",23.8103,90.4125,6.0],
["Karachi","Pakistan",24.8607,67.0011,5.0],["Lahore","Pakistan",31.5204,74.3587,5.0],
["Dubai","UAE",25.2048,55.2708,4.0],["Abu Dhabi","UAE",24.4539,54.3773,4.0],
["Doha","Qatar",25.2854,51.5310,3.0],["Riyadh","Saudi Arabia",24.7136,46.6753,3.0],
["Muscat","Oman",23.5880,58.3829,4.0],["Singapore","Singapore",1.3521,103.8198,8.0],
["Kuala Lumpur","Malaysia",3.1390,101.6869,8.0],["Bangkok","Thailand",13.7563,100.5018,7.0],
["London","United Kingdom",51.5074,-0.1278,0.0],["Manchester","United Kingdom",53.4808,-2.2426,0.0],
["Birmingham","United Kingdom",52.4862,-1.8904,0.0],["Leicester","United Kingdom",52.6369,-1.1398,0.0],
["Paris","France",48.8566,2.3522,1.0],["Berlin","Germany",52.5200,13.4050,1.0],
["Frankfurt","Germany",50.1109,8.6821,1.0],["Zurich","Switzerland",47.3769,8.5417,1.0],
["Rome","Italy",41.9028,12.4964,1.0],["Amsterdam","Netherlands",52.3676,4.9041,1.0],
["Moscow","Russia",55.7558,37.6173,3.0],["New York","USA",40.7128,-74.0060,-5.0],
["Jersey City","USA",40.7178,-74.0431,-5.0],["Edison","USA",40.5187,-74.4121,-5.0],
["Chicago","USA",41.8781,-87.6298,-6.0],["Houston","USA",29.7604,-95.3698,-6.0],
["Dallas","USA",32.7767,-96.7970,-6.0],["Austin","USA",30.2672,-97.7431,-6.0],
["Atlanta","USA",33.7490,-84.3880,-5.0],["Boston","USA",42.3601,-71.0589,-5.0],
["Washington","USA",38.9072,-77.0369,-5.0],["Seattle","USA",47.6062,-122.3321,-8.0],
["San Francisco","USA",37.7749,-122.4194,-8.0],["San Jose","USA",37.3382,-121.8863,-8.0],
["Los Angeles","USA",34.0522,-118.2437,-8.0],["Fremont","USA",37.5485,-121.9886,-8.0],
["Toronto","Canada",43.6532,-79.3832,-5.0],["Vancouver","Canada",49.2827,-123.1207,-8.0],
["Sydney","Australia",-33.8688,151.2093,10.0],["Melbourne","Australia",-37.8136,144.9631,10.0],
["Tokyo","Japan",35.6762,139.6503,9.0],["Hong Kong","Hong Kong",22.3193,114.1694,8.0],
["Nairobi","Kenya",-1.2921,36.8219,3.0],["Auckland","New Zealand",-36.8485,174.7633,12.0],
// --- expanded set ---
["Robertsonpet","Karnataka, India",12.9560,78.2750,5.5],["Gangavati","Karnataka, India",15.4319,76.5310,5.5],
["Bagalkot","Karnataka, India",16.1691,75.6615,5.5],["Ranebennur","Karnataka, India",14.6199,75.6297,5.5],
["Kollam","Kerala, India",8.8932,76.6141,5.5],["Kannur","Kerala, India",11.8745,75.3704,5.5],
["Kottayam","Kerala, India",9.5916,76.5222,5.5],["Palakkad","Kerala, India",10.7867,76.6548,5.5],
["Tirunelveli","Tamil Nadu, India",8.7139,77.7567,5.5],["Vellore","Tamil Nadu, India",12.9165,79.1325,5.5],
["Erode","Tamil Nadu, India",11.3410,77.7172,5.5],["Thoothukudi","Tamil Nadu, India",8.7642,78.1348,5.5],
["Tiruppur","Tamil Nadu, India",11.1085,77.3411,5.5],["Nellore","Andhra Pradesh, India",14.4426,79.9865,5.5],
["Kurnool","Andhra Pradesh, India",15.8281,78.0373,5.5],["Rajahmundry","Andhra Pradesh, India",17.0005,81.8040,5.5],
["Kakinada","Andhra Pradesh, India",16.9891,82.2475,5.5],["Nizamabad","Telangana, India",18.6725,78.0941,5.5],
["Karimnagar","Telangana, India",18.4386,79.1288,5.5],["Siliguri","West Bengal, India",26.7271,88.3953,5.5],
["Asansol","West Bengal, India",23.6739,86.9524,5.5],["Durgapur","West Bengal, India",23.5204,87.3119,5.5],
["Ajmer","Rajasthan, India",26.4499,74.6399,5.5],
["Bikaner","Rajasthan, India",28.0229,73.3119,5.5],["Noida","Uttar Pradesh, India",28.5355,77.3910,5.5],
["Ghaziabad","Uttar Pradesh, India",28.6692,77.4538,5.5],["Bareilly","Uttar Pradesh, India",28.3670,79.4304,5.5],
["Aligarh","Uttar Pradesh, India",27.8974,78.0880,5.5],["Gorakhpur","Uttar Pradesh, India",26.7606,83.3732,5.5],
["Jamshedpur","Jharkhand, India",22.8046,86.2029,5.5],["Dhanbad","Jharkhand, India",23.7957,86.4304,5.5],
["Gurugram","Haryana, India",28.4595,77.0266,5.5],["Faridabad","Haryana, India",28.4089,77.3178,5.5],
["Jalandhar","Punjab, India",31.3260,75.5762,5.5],["Aurangabad","Maharashtra, India",19.8762,75.3433,5.5],
["Solapur","Maharashtra, India",17.6599,75.9064,5.5],["Kolhapur","Maharashtra, India",16.7050,74.2433,5.5],
["Thane","Maharashtra, India",19.2183,72.9781,5.5],["Navi Mumbai","Maharashtra, India",19.0330,73.0297,5.5],
["Jamnagar","Gujarat, India",22.4707,70.0577,5.5],["Bhavnagar","Gujarat, India",21.7645,72.1519,5.5],
["Gandhinagar","Gujarat, India",23.2156,72.6369,5.5],
["Perth","Australia",-31.9505,115.8605,8.0],["Brisbane","Australia",-27.4698,153.0251,10.0],
["Adelaide","Australia",-34.9285,138.6007,9.5],["Wellington","New Zealand",-41.2866,174.7756,12.0],
["Ottawa","Canada",45.4215,-75.6972,-5.0],["Calgary","Canada",51.0447,-114.0719,-7.0],
["Philadelphia","USA",39.9526,-75.1652,-5.0],["Phoenix","USA",33.4484,-112.0740,-7.0],
["San Diego","USA",32.7157,-117.1611,-8.0],["Denver","USA",39.7392,-104.9903,-7.0],
["Detroit","USA",42.3314,-83.0458,-5.0],["Minneapolis","USA",44.9778,-93.2650,-6.0],
["Kuwait City","Kuwait",29.3759,47.9774,3.0],["Manama","Bahrain",26.2285,50.5860,3.0],
["Jeddah","Saudi Arabia",21.4858,39.1925,3.0],["Istanbul","Turkey",41.0082,28.9784,3.0],
["Dublin","Ireland",53.3498,-6.2603,0.0],["Madrid","Spain",40.4168,-3.7038,1.0],
["Stockholm","Sweden",59.3293,18.0686,1.0],["Oslo","Norway",59.9139,10.7522,1.0],
["Seoul","South Korea",37.5665,126.9780,9.0],["Jakarta","Indonesia",-6.2088,106.8456,7.0],
["Manila","Philippines",14.5995,120.9842,8.0],["Ho Chi Minh City","Vietnam",10.8231,106.6297,7.0]
];

/* ======================= celebrity showcase ======================= */
/* [name, role H/F, dob, time, place, lat, lon, tz]  - commonly-cited public data */
const CELEBS=[
["Amitabh Bachchan","H","1942-10-11","16:00","Allahabad, India",25.4358,81.8463,5.5],
["Shah Rukh Khan","H","1965-11-02","02:30","New Delhi, India",28.6139,77.2090,5.5],
["Aamir Khan","H","1965-03-14","12:00","Mumbai, India",19.0760,72.8777,5.5],
["Salman Khan","H","1965-12-27","12:00","Indore, India",22.7196,75.8577,5.5],
["Hrithik Roshan","H","1974-01-10","12:00","Mumbai, India",19.0760,72.8777,5.5],
["Ranbir Kapoor","H","1982-09-28","12:00","Mumbai, India",19.0760,72.8777,5.5],
["Ranveer Singh","H","1985-07-06","12:00","Mumbai, India",19.0760,72.8777,5.5],
["Akshay Kumar","H","1967-09-09","12:00","Amritsar, India",31.6340,74.8723,5.5],
["Aishwarya Rai","F","1973-11-01","12:00","Mangaluru, India",12.9141,74.8560,5.5],
["Madhuri Dixit","F","1967-05-15","12:00","Mumbai, India",19.0760,72.8777,5.5],
["Deepika Padukone","F","1986-01-05","12:00","Copenhagen, Denmark",55.6761,12.5683,1.0],
["Priyanka Chopra","F","1982-07-18","12:00","Jamshedpur, India",22.8046,86.2029,5.5],
["Kareena Kapoor","F","1980-09-21","12:00","Mumbai, India",19.0760,72.8777,5.5],
["Katrina Kaif","F","1983-07-16","12:00","Hong Kong",22.3193,114.1694,8.0],
["Alia Bhatt","F","1993-03-15","12:00","Mumbai, India",19.0760,72.8777,5.5],
["Kajol","F","1974-08-05","12:00","Mumbai, India",19.0760,72.8777,5.5]];
function initials(n){return n.split(' ').slice(0,2).map(w=>w[0]).join('').toUpperCase();}
function renderShowcase(){
  const H=$('#heroGrid'),F=$('#heroineGrid');if(!H||!F)return;
  const card=c=>`<button class="celeb" data-name="${esc(c[0])}" type="button"><span class="ini">${initials(c[0])}</span><span class="ci"><span class="cn">${esc(c[0])}</span><span class="cd">${c[2].split('-').reverse().join('/')}</span></span></button>`;
  H.innerHTML=CELEBS.filter(c=>c[1]==='H').map(card).join('');
  F.innerHTML=CELEBS.filter(c=>c[1]==='F').map(card).join('');
  $$('#showcase .celeb').forEach(b=>b.addEventListener('click',()=>{
    const c=CELEBS.find(x=>x[0]===b.dataset.name);if(!c)return;
    // a showcase chart is one person - drop back to Horoscope mode, or the compute
    // would go looking for a bride who was never entered
    setMode('single');
    $('#name').value=c[0];$('#dob').value=c[2];$('#tob').value=c[3];$('#gender').value=c[1]==='F'?'female':'male';
    placeInput.value=c[4];$('#lat').value=c[5];$('#lon').value=c[6];$('#tz').value=c[7];
    mainPlace.zone=zoneForCity((c[4].split(',')[0]||'').trim(),c[4]);
    $('#placeHint').textContent=`✓ ${c[5].toFixed(4)}°  ${c[6].toFixed(4)}°  ·  UTC${c[7]>=0?'+':''}${c[7]}${c[3]==='12:00'?'  · time approx (noon)':''}`;
    doCompute();
  }));
}

/* ======================= LOGIN (device-local, optional) ======================= */
const LS = {get(k){try{return JSON.parse(localStorage.getItem(k));}catch(e){return null;}},
  set(k,v){try{localStorage.setItem(k,JSON.stringify(v));}catch(e){}},
  del(k){try{localStorage.removeItem(k);}catch(e){}}};
function randHex(n){const a=new Uint8Array(n);
  if(typeof crypto!=='undefined'&&crypto.getRandomValues)crypto.getRandomValues(a);
  else for(let i=0;i<n;i++)a[i]=Math.floor(Math.random()*256);
  return [...a].map(b=>b.toString(16).padStart(2,'0')).join('');}
/* PBKDF2 (100k iterations, SHA-256, per-user random salt). Falls back to a labelled
   weaker hash only on non-secure contexts where crypto.subtle is unavailable. */
async function hashPw(pass,saltHex){
  if(typeof crypto!=='undefined'&&crypto.subtle&&crypto.subtle.deriveBits){
    const salt=Uint8Array.from(saltHex.match(/../g).map(h=>parseInt(h,16)));
    const key=await crypto.subtle.importKey('raw',new TextEncoder().encode(pass),'PBKDF2',false,['deriveBits']);
    const bits=await crypto.subtle.deriveBits({name:'PBKDF2',salt,iterations:100000,hash:'SHA-256'},key,256);
    return {algo:'pbkdf2',hash:[...new Uint8Array(bits)].map(b=>b.toString(16).padStart(2,'0')).join('')};
  }
  let h=5381;const s=saltHex+'::'+pass;for(let i=0;i<s.length;i++)h=((h<<5)+h+s.charCodeAt(i))>>>0;
  return {algo:'weak',hash:'w'+h.toString(16)};
}
let CURRENT_USER=null;
function users(){return LS.get('jathaka-users')||{};}
function enterApp(user){
  CURRENT_USER=user;
  $('#loginScreen').style.display='none';
  $('#appWrap').style.display='block';
  const badge=$('#userBadge');
  if(user){badge.style.display='flex';$('#userName').textContent=user;$('#history').style.display='flex';renderHistory();}
  else{badge.style.display='none';$('#history').style.display='none';}
}
function initLogin(){
  // a shared ?c= link opens straight into the chart (as guest); ?c=&m= opens a match
  try{const q=new URLSearchParams(location.search), cs=q.get('c'), ms=q.get('m');
    if(cs){const o=decodeChart(cs), p=ms?decodeChart(ms):null;
      if(o){enterApp(null);
        setMode(p?'match':'single');
        const ok=applyShared(o)&&(!p||applySharedPartner(p));
        if(ok)doCompute();
        return;}}}catch(e){}
  const remembered=LS.get('jathaka-session');
  // tabs
  $$('.auth-tab').forEach(t=>t.addEventListener('click',()=>{
    $$('.auth-tab').forEach(x=>x.classList.remove('active'));t.classList.add('active');
    $('#authMode').value=t.dataset.mode;
    $('#authTitle').textContent=t.dataset.mode==='signup'?'Create your account':'Welcome back';
    $('#authSubmit').textContent=t.dataset.mode==='signup'?'Create account':'Sign in';
    $('#authErr').textContent='';
  }));
  $('#guestBtn').addEventListener('click',()=>enterApp(null));
  $('#authForm').addEventListener('submit',async e=>{
    e.preventDefault();const err=$('#authErr');err.textContent='';
    const u=$('#authUser').value.trim().toLowerCase(), p=$('#authPass').value;
    const mode=$('#authMode').value;
    if(u.length<3){err.textContent='Username must be at least 3 characters.';return;}
    if(p.length<4){err.textContent='Password must be at least 4 characters.';return;}
    const db=users();
    if(mode==='signup'){
      if(db[u]){err.textContent='That username already exists on this device. Try signing in.';return;}
      const salt=randHex(16);const {hash,algo}=await hashPw(p,salt);
      db[u]={algo,salt,pw:hash,sessionToken:randHex(24),charts:[]};LS.set('jathaka-users',db);
    }else{
      const rec=db[u];
      if(!rec){err.textContent='No account with that username on this device.';return;}
      const {hash}=await hashPw(p,rec.salt||'jathaka::'+u);
      if(hash!==rec.pw){err.textContent='Incorrect password.';return;}
      if(!rec.sessionToken){rec.sessionToken=randHex(24);LS.set('jathaka-users',db);}
    }
    const rec=users()[u];
    LS.set('jathaka-session',{user:u,token:rec.sessionToken});enterApp(u);
  });
  $('#logoutBtn').addEventListener('click',()=>{LS.del('jathaka-session');location.reload();});
  // verify the stored session TOKEN, not just the username (prevents session bypass)
  if(remembered&&remembered.user&&remembered.token){
    const rec=users()[remembered.user];
    if(rec&&rec.sessionToken===remembered.token)enterApp(remembered.user);
  }
}
function saveChartForUser(input){
  if(!CURRENT_USER)return;const db=users();const u=db[CURRENT_USER];if(!u)return;
  u.charts=(u.charts||[]).filter(c=>!(c.name===input.name&&c.dob===`${input.y}-${input.mo}-${input.d}`));
  u.charts.unshift({name:input.name,dob:`${input.y}-${input.mo}-${input.d}`,tob:`${input.hh}:${input.mi}`,
    place:input.place,lat:input.lat,lon:input.lon,tz:input.tz,gender:input.gender,ts:Date.now()});
  u.charts=u.charts.slice(0,20);LS.set('jathaka-users',db);renderHistory();
}
function renderHistory(){
  const box=$('#history');if(!box)return;
  const db=users();const u=CURRENT_USER&&db[CURRENT_USER];
  const charts=(u&&u.charts)||[];
  const toolbar='<div class="hist-title">Your saved charts</div><div class="hist-actions">'+
    '<button class="mini-btn" id="expBtn" type="button">⤓ Export</button>'+
    '<label class="mini-btn" for="impFile">⤒ Import<input type="file" id="impFile" accept="application/json" hidden></label></div>';
  if(!charts.length){box.innerHTML=toolbar+'<div class="hist-empty">No saved charts yet - cast one and it will appear here.</div>';wireBackup(charts);return;}
  /* In compatibility mode a saved chart is far more useful loaded INTO the match
     than cast on its own - saving people is exactly how you build a match later.
     So each row offers the two roles instead of casting and throwing the match
     away. In horoscope mode the row stays a single click-to-cast button. */
  box.innerHTML=toolbar+charts.map((c,i)=>appMode==='match'
    ? `<div class="hist-item hist-split"><span class="hist-who"><b>${esc(c.name)}</b><small>${esc(c.place)} · ${c.dob}</small></span>
        <span class="hist-roles"><button class="mini-btn" type="button" data-i="${i}" data-role="groom">→ Groom</button><button class="mini-btn" type="button" data-i="${i}" data-role="bride">→ Bride</button></span></div>`
    : `<button class="hist-item" data-i="${i}"><b>${esc(c.name)}</b><small>${esc(c.place)} · ${c.dob}</small></button>`).join('');
  wireBackup(charts);
  // horoscope mode: recalling a saved chart casts it
  box.querySelectorAll('button.hist-item').forEach(b=>b.addEventListener('click',()=>{
    setMode('single');
    fillSaved(charts[+b.dataset.i],MAIN_IDS,mainPlace,'placeHint');
    doCompute();}));
  // compatibility mode: load the saved person into one side, leave the other alone
  box.querySelectorAll('.hist-roles button').forEach(b=>b.addEventListener('click',()=>{
    const c=charts[+b.dataset.i], groom=b.dataset.role==='groom';
    fillSaved(c,groom?MAIN_IDS:PARTNER_IDS,groom?mainPlace:partnerPlace,groom?'placeHint':'pPlaceHint');
    $('#formErr').textContent='';
    b.textContent='✓ loaded';setTimeout(()=>{b.textContent=groom?'→ Groom':'→ Bride';},1400);}));
}
/* Write a saved chart record into one of the two nativity forms. The stored
   timezone is a plain offset, so the auto-DST zone is cleared - the saved number
   is what was used when the chart was first cast, and it should stay authoritative. */
function fillSaved(c,ids,place,hintId){
  const[y,mo,d]=c.dob.split('-');
  $('#'+ids.name).value=c.name;
  $('#'+ids.dob).value=`${y}-${String(mo).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
  $('#'+ids.tob).value=c.tob.split(':').map(x=>x.padStart(2,'0')).join(':');
  if(ids.gender)$('#'+ids.gender).value=c.gender||'na';
  $('#'+ids.place).value=c.place;$('#'+ids.lat).value=c.lat;$('#'+ids.lon).value=c.lon;$('#'+ids.tz).value=c.tz;
  place.zone=null;
  $('#'+hintId).textContent=`✓ ${(+c.lat).toFixed(4)}°  ${(+c.lon).toFixed(4)}°  ·  UTC${c.tz>=0?'+':''}${c.tz}`;
}
function wireBackup(charts){
  const exp=$('#expBtn');if(exp)exp.addEventListener('click',()=>{
    const blob=new Blob([JSON.stringify(charts,null,2)],{type:'application/json'});
    const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='jathaka-charts.json';
    document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(a.href),1000);});
  const imp=$('#impFile');if(imp)imp.addEventListener('change',ev=>{
    const f=ev.target.files&&ev.target.files[0];if(!f)return;const r=new FileReader();
    r.onload=()=>{try{const arr=JSON.parse(r.result);if(!Array.isArray(arr))throw 0;
      const db=users();const u=db[CURRENT_USER];if(!u)return;u.charts=u.charts||[];
      const seen=new Set(u.charts.map(c=>c.name+'|'+c.dob));let added=0;
      arr.forEach(c=>{if(c&&c.name&&c.dob&&c.lat!=null&&c.lon!=null&&!seen.has(c.name+'|'+c.dob)){u.charts.push(c);seen.add(c.name+'|'+c.dob);added++;}});
      u.charts=u.charts.slice(0,50);LS.set('jathaka-users',db);renderHistory();
      alert(added?`Imported ${added} chart${added>1?'s':''}.`:'No new charts to import.');
    }catch(e){alert('Could not import - the file is not a valid Jathaka charts export.');}};
    r.readAsText(f);});
}

/* ======================= DST-aware timezone (offline, via built-in Intl) ======================= */
const US_ZONE={'New York':'America/New_York','Jersey City':'America/New_York','Edison':'America/New_York','Chicago':'America/Chicago','Houston':'America/Chicago','Dallas':'America/Chicago','Austin':'America/Chicago','Atlanta':'America/New_York','Boston':'America/New_York','Washington':'America/New_York','Seattle':'America/Los_Angeles','San Francisco':'America/Los_Angeles','San Jose':'America/Los_Angeles','Los Angeles':'America/Los_Angeles','Fremont':'America/Los_Angeles','Toronto':'America/Toronto','Vancouver':'America/Vancouver',
  'Philadelphia':'America/New_York','Detroit':'America/Detroit','Phoenix':'America/Phoenix','San Diego':'America/Los_Angeles','Denver':'America/Denver','Minneapolis':'America/Chicago','Ottawa':'America/Toronto','Calgary':'America/Edmonton',
  'Perth':'Australia/Perth','Brisbane':'Australia/Brisbane','Adelaide':'Australia/Adelaide','Wellington':'Pacific/Auckland'};
const COUNTRY_ZONE={'India':'Asia/Kolkata','Sri Lanka':'Asia/Colombo','Nepal':'Asia/Kathmandu','Bangladesh':'Asia/Dhaka','Pakistan':'Asia/Karachi','Afghanistan':'Asia/Kabul','UAE':'Asia/Dubai','Qatar':'Asia/Qatar','Saudi Arabia':'Asia/Riyadh','Oman':'Asia/Muscat','Singapore':'Asia/Singapore','Malaysia':'Asia/Kuala_Lumpur','Thailand':'Asia/Bangkok','United Kingdom':'Europe/London','France':'Europe/Paris','Germany':'Europe/Berlin','Switzerland':'Europe/Zurich','Italy':'Europe/Rome','Netherlands':'Europe/Amsterdam','Russia':'Europe/Moscow','Japan':'Asia/Tokyo','Hong Kong':'Asia/Hong_Kong','China':'Asia/Shanghai','Kenya':'Africa/Nairobi','South Africa':'Africa/Johannesburg','New Zealand':'Pacific/Auckland','Australia':'Australia/Sydney'};
function zoneForCity(name,region){if(US_ZONE[name])return US_ZONE[name];
  const country=((region||'').split(',').pop()||region||'').trim();return COUNTRY_ZONE[country]||null;}
function zoneOffset(zone,y,mo,d,hh,mi){ // returns UTC offset in hours for that wall-clock moment, incl. DST
  try{const dtf=new Intl.DateTimeFormat('en-US',{timeZone:zone,timeZoneName:'longOffset'});
    let inst=Date.UTC(y,mo-1,d,hh,mi),off=null;
    for(let k=0;k<2;k++){ // 2 passes converge (offset depends on the instant, which depends on offset)
      const nm=dtf.formatToParts(new Date(inst)).find(p=>p.type==='timeZoneName').value;
      const m=nm.match(/GMT([+-])(\d{1,2})(?::(\d{2}))?/);if(!m)return null;
      off=(+m[2])+(m[3]?(+m[3])/60:0);if(m[1]==='-')off=-off;
      inst=Date.UTC(y,mo-1,d,hh,mi)-off*3600000;}
    return off;
  }catch(e){return null;}}
function resolveTz(tz,zone,y,mo,d,hh,mi){ // prefer the DST-aware offset when a known zone is selected
  if(!zone)return {tz,dst:false};
  const o=zoneOffset(zone,y,mo,d,hh,mi);
  if(o==null)return {tz,dst:false};
  return {tz:o,dst:Math.abs(o-tz)>0.01};}

/* ======================= shareable deep link (base64, offline; NOT encrypted) ======================= */
let lastInput=null;
function encodeChart(i){try{return btoa(unescape(encodeURIComponent(JSON.stringify(
  {n:i.name,d:`${i.y}-${i.mo}-${i.d}`,t:`${i.hh}:${i.mi}`,la:i.lat,lo:i.lon,tz:i.tz,g:i.gender,p:i.place,u:i.timeUnknown?1:0}))));}catch(e){return '';}}
function decodeChart(s){try{return JSON.parse(decodeURIComponent(escape(atob(s))));}catch(e){return null;}}
function shareUrl(i){return location.origin+location.pathname+'?c='+encodeChart(i);}
/* a match link carries both nativities - `c` is the groom's, `m` the bride's */
function shareMatchUrl(g,b){return shareUrl(g)+'&m='+encodeChart(b);}
function applyShared(o){if(!o)return false;
  const[y,mo,d]=(o.d||'').split('-'),[hh,mi]=(o.t||'').split(':');
  $('#name').value=o.n||'';$('#dob').value=`${y}-${String(mo).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
  $('#tob').value=`${String(hh).padStart(2,'0')}:${String(mi).padStart(2,'0')}`;$('#gender').value=o.g||'na';
  /* Carry the "time not known" flag across the link, or the recipient sees a
     noon chart presented as though the time were real. */
  const uk=$('#tobUnknown');if(uk){uk.checked=!!o.u;uk.dispatchEvent(new Event('change'));}
  $('#place').value=o.p||'';$('#lat').value=o.la;$('#lon').value=o.lo;$('#tz').value=o.tz;mainPlace.zone=null;
  $('#placeHint').textContent=`✓ ${(+o.la).toFixed(4)}°  ${(+o.lo).toFixed(4)}°  ·  UTC${o.tz>=0?'+':''}${o.tz}`;return true;}
function applySharedPartner(o){if(!o)return false;
  const[y,mo,d]=(o.d||'').split('-'),[hh,mi]=(o.t||'').split(':');
  $('#pName').value=o.n||'';$('#pDob').value=`${y}-${String(mo).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
  $('#pTob').value=`${String(hh).padStart(2,'0')}:${String(mi).padStart(2,'0')}`;
  const puk=$('#pTobUnknown');if(puk){puk.checked=!!o.u;puk.dispatchEvent(new Event('change'));}
  $('#pPlace').value=o.p||'';$('#pLat').value=o.la;$('#pLon').value=o.lo;$('#pTz').value=o.tz;partnerPlace.zone=null;
  $('#pPlaceHint').textContent=`✓ ${(+o.la).toFixed(4)}°  ${(+o.lo).toFixed(4)}°  ·  UTC${o.tz>=0?'+':''}${o.tz}`;return true;}

/* ======================= autocomplete / form =======================
   Two nativities can be entered - the main one and an optional partner for
   compatibility matching - so the place autocomplete is built as a factory over
   an id prefix rather than bound to one set of fields. Each instance owns its own
   resolved timezone, since the two births can sit in different zones. */
function searchCities(q){q=q.trim().toLowerCase();if(q.length<2)return[];
  const s=[],c=[];for(const x of CITIES){const n=x[0].toLowerCase();
    if(n.startsWith(q))s.push(x);else if(n.includes(q)||x[1].toLowerCase().includes(q))c.push(x);}
  return s.concat(c).slice(0,8);}
function makePlaceField(ids){
  const placeInput=$('#'+ids.place), acList=$('#'+ids.acList), hint=$('#'+ids.hint);
  let acIdx=-1, acMatches=[];
  const api={zone:null};
  function renderAC(){if(!acMatches.length){acList.classList.remove('show');return;}
    acList.innerHTML=acMatches.map((c,i)=>`<div class="ac-item${i===acIdx?' active':''}" data-i="${i}">${c[0]} <small>· ${c[1]} · ${c[2].toFixed(2)}° ${c[3].toFixed(2)}° · UTC${c[4]>=0?'+':''}${c[4]}</small></div>`).join('');
    acList.classList.add('show');}
  api.pick=function(c){placeInput.value=c[0]+', '+c[1];acList.classList.remove('show');
    $('#'+ids.lat).value=c[2];$('#'+ids.lon).value=c[3];$('#'+ids.tz).value=c[4];
    api.zone=zoneForCity(c[0],c[1]);
    const z=api.zone?'  ·  '+api.zone+' (auto DST)':'';
    hint.textContent=`✓ ${c[2].toFixed(4)}°  ${c[3].toFixed(4)}°  ·  UTC${c[4]>=0?'+':''}${c[4]}${z}`;};
  placeInput.addEventListener('input',()=>{api.zone=null;acMatches=searchCities(placeInput.value);acIdx=-1;renderAC();});
  placeInput.addEventListener('keydown',e=>{if(!acMatches.length)return;
    if(e.key==='ArrowDown'){acIdx=Math.min(acIdx+1,acMatches.length-1);renderAC();e.preventDefault();}
    else if(e.key==='ArrowUp'){acIdx=Math.max(acIdx-1,0);renderAC();e.preventDefault();}
    else if(e.key==='Enter'&&acIdx>=0){api.pick(acMatches[acIdx]);e.preventDefault();}
    else if(e.key==='Escape')acList.classList.remove('show');});
  acList.addEventListener('click',e=>{const it=e.target.closest('.ac-item');if(it)api.pick(acMatches[+it.dataset.i]);});
  document.addEventListener('click',e=>{if(!e.target.closest('.field'))acList.classList.remove('show');});
  // manual edits to coordinates/timezone disable the auto-zone (respect the user's own numbers)
  [ids.lat,ids.lon,ids.tz].forEach(id=>$('#'+id).addEventListener('input',()=>{api.zone=null;}));
  $('#'+ids.manualToggle).addEventListener('click',()=>{
    const on=$('#'+ids.mLat).classList.toggle('show');
    $('#'+ids.mLon).classList.toggle('show');$('#'+ids.mTz).classList.toggle('show');
    $('#'+ids.manualToggle).textContent=(on?'▾':'▸')+' Enter latitude / longitude / timezone manually';});
  return api;
}
const mainPlace=makePlaceField({place:'place',acList:'acList',hint:'placeHint',lat:'lat',lon:'lon',tz:'tz',
  manualToggle:'manualToggle',mLat:'mLat',mLon:'mLon',mTz:'mTz'});
const partnerPlace=makePlaceField({place:'pPlace',acList:'pAcList',hint:'pPlaceHint',lat:'pLat',lon:'pLon',tz:'pTz',
  manualToggle:'pManualToggle',mLat:'pMLat',mLon:'pMLon',mTz:'pMTz'});
const placeInput=$('#place');
const pickCity=c=>mainPlace.pick(c);

/* ---- mode switch: one horoscope, or two charts matched ----
   The two modes produce entirely different reports, so the nav, the form labels
   and the compute path all key off this one value. */
let appMode=LS.get('jathaka-mode')==='match'?'match':'single';
function setMode(m){
  const next=(m==='match')?'match':'single';
  /* Re-clicking the mode you are already in is a normal thing to do when
     re-orienting. Only an actual change invalidates the report on screen. */
  const changed=next!==appMode;
  appMode=next;
  LS.set('jathaka-mode',appMode);
  document.body.classList.toggle('mode-match',appMode==='match');
  $('#modeSingle').classList.toggle('active',appMode==='single');
  $('#modeMatch').classList.toggle('active',appMode==='match');
  $('#modeSingle').setAttribute('aria-pressed',appMode==='single'?'true':'false');
  $('#modeMatch').setAttribute('aria-pressed',appMode==='match'?'true':'false');
  $('#formEyebrow').textContent=appMode==='match'?'First nativity':'Birth particulars';
  $('#formTitle').textContent=appMode==='match'?"Groom's janma details":'Enter janma details';
  $('#calcBtn').textContent=appMode==='match'?'Match the two charts':'Cast the chart';
  $('#sampleBtn').textContent=appMode==='match'?'Load a sample pair':'Load a sample';
  $('#formErr').textContent='';
  renderHistory();   // saved-chart rows differ by mode (cast vs. load into a role)
  if(changed){
    // a report cast in the other mode no longer matches the form - clear it
    $('#report').innerHTML='';$('#report').classList.remove('show');
    $('#jumpNav').classList.remove('show');
    const mb=$('#mobileBar');if(mb)mb.classList.remove('show');
  }
}
$('#modeSingle').addEventListener('click',()=>setMode('single'));
$('#modeMatch').addEventListener('click',()=>setMode('match'));
/* Apply the remembered mode to the DOM at startup. Restoring `appMode` from
   storage without this left the form showing Horoscope labels while the compute
   path still expected two charts - so a returning user could press "Cast the
   chart" and get a match report for a bride they never entered. A shared ?c=&m=
   link calls setMode again in initLogin and correctly wins over this. */
setMode(appMode);
(function(){let t=LS.get('jathaka-theme');if(t)document.documentElement.setAttribute('data-theme',t);
  $('#themeBtn').addEventListener('click',()=>{const cur=document.documentElement.getAttribute('data-theme')||(matchMedia('(prefers-color-scheme:dark)').matches?'dark':'light');
    const nx=cur==='dark'?'light':'dark';document.documentElement.setAttribute('data-theme',nx);LS.set('jathaka-theme',nx);if(window._stars)window._stars();});})();
/* plain-English toggle */
(function(){const btn=$('#laymanBtn');if(!btn)return;
  function set(on){document.body.classList.toggle('show-layman',on);btn.setAttribute('aria-pressed',on?'true':'false');
    const lbl=btn.querySelector('.lbl');if(lbl)lbl.textContent=on?'Plain English: On':'Plain English: Off';}
  set(LS.get('jathaka-layman')===true);
  btn.addEventListener('click',()=>{const on=!document.body.classList.contains('show-layman');set(on);LS.set('jathaka-layman',on);});})();
$('#sampleBtn').addEventListener('click',()=>{
  if(appMode==='match'){
    $('#name').value='Sample Groom';$('#dob').value='1994-03-17';$('#tob').value='09:25';
    pickCity(["Bengaluru","Karnataka, India",12.9716,77.5946,5.5]);
    $('#pName').value='Sample Bride';$('#pDob').value='1996-11-02';$('#pTob').value='18:40';
    partnerPlace.pick(["Chennai","Tamil Nadu, India",13.0827,80.2707,5.5]);
    return;}
  $('#name').value='Sample Chart';$('#dob').value='2000-01-01';
  $('#tob').value='12:00';$('#gender').value='male';pickCity(["Bengaluru","Karnataka, India",12.96,77.66,5.5]);});

$('#calcBtn').addEventListener('click',doCompute);
/* Validate and normalise one set of birth fields. Returns the input object, or
   throws with a message meant for the user. `who` names the nativity in errors so
   it is clear which of the two forms needs fixing. */
function readNativity(ids,place,who,fallbackName,forcedGender){
  /* Errors carry the id of the field at fault so the caller can put the cursor
     there. With two nativities the form is long enough that a message alone
     leaves you hunting for which box is empty. */
  const bad=(m,field)=>{const e=new Error(who?`${who}: ${m}`:m);e.field=field;throw e;};
  /* An unknown birth time is a stated limitation, not a blocker. The chart is
     cast for noon - the same convention the showcase uses - and every reading
     that leans on the Lagna is held back accordingly rather than guessing. */
  const unkEl=ids.unknown?$('#'+ids.unknown):null;
  const timeUnknown=!!(unkEl&&unkEl.checked);
  const dob=$('#'+ids.dob).value;
  const tob=timeUnknown?'12:00':$('#'+ids.tob).value;
  if(!dob)bad('please enter a date of birth.',ids.dob);
  if(!tob)bad('please enter a time of birth, or tick "time not known" - the Lagna depends on it.',ids.tob);
  let lat=parseFloat($('#'+ids.lat).value),lon=parseFloat($('#'+ids.lon).value),tz=parseFloat($('#'+ids.tz).value);
  if(isNaN(lat)||isNaN(lon))bad('pick a birth place, or open the manual panel and enter latitude & longitude.',ids.place);
  if(isNaN(tz))tz=5.5;
  if(lat<-90||lat>90)bad('latitude must be between -90° and 90°.',ids.lat);
  if(lon<-180||lon>180)bad('longitude must be between -180° and 180°.',ids.lon);
  if(tz<-14||tz>14)bad('timezone must be between -14 and +14 hours from UTC.',ids.tz);
  const[y,mo,d]=dob.split('-').map(Number),[hh,mi]=tob.split(':').map(Number);
  if(!y||y<1700||y>2200)bad('please enter a birth year between 1700 and 2200 (the ephemeris range).',ids.dob);
  const rz=resolveTz(tz,place.zone,y,mo,d,hh,mi);tz=rz.tz; // DST-aware offset when a known zone is selected
  return {y,mo,d,hh,mi,lat,lon,tz,dst:rz.dst,zone:place.zone,timeUnknown,
    name:$('#'+ids.name).value.trim()||fallbackName,
    gender:forcedGender||(ids.gender?$('#'+ids.gender).value:'na'),
    place:$('#'+ids.place).value.trim()||`${lat.toFixed(3)}°, ${lon.toFixed(3)}°`};
}
function castChart(input){
  const chart=J.buildChart(input);
  J.bhavaChalit(chart); // sets chart._mc
  const ev=J.sunEvents(chart); chart._dayBirth=ev?(chart.jd>=ev.riseJD&&chart.jd<ev.setJD):true;
  return chart;
}
const MAIN_IDS={dob:'dob',tob:'tob',unknown:'tobUnknown',lat:'lat',lon:'lon',tz:'tz',name:'name',gender:'gender',place:'place'};
const PARTNER_IDS={dob:'pDob',tob:'pTob',unknown:'pTobUnknown',lat:'pLat',lon:'pLon',tz:'pTz',name:'pName',place:'pPlace'};
/* Grey the time box out while "not known" is ticked, so the form never looks
   like it is still using whatever value happens to be sitting in it. */
['tobUnknown','pTobUnknown'].forEach(id=>{
  const box=document.getElementById(id); if(!box)return;
  const field=document.getElementById(id==='tobUnknown'?'tob':'pTob');
  const sync=()=>{if(field)field.disabled=box.checked;};
  box.addEventListener('change',sync); sync();
});
function doCompute(){
  const err=$('#formErr');err.textContent='';
  const match=appMode==='match';
  let gInput,gChart,bInput=null,bChart=null;
  try{
    // in match mode the two roles ARE the gender the classical tables are reckoned from
    gInput=readNativity(MAIN_IDS,mainPlace,match?'Groom':'',match?'The groom':'This nativity',match?'male':null);
    if(match){
      bInput=readNativity(PARTNER_IDS,partnerPlace,'Bride','The bride','female');
      /* Matching a chart against itself yields a meaningless score (identical
         Moons make Nāḍī dosha certain), and it is always a data-entry slip. */
      const same=['y','mo','d','hh','mi','lat','lon','tz'].every(k=>gInput[k]===bInput[k]);
      if(same){const e=new Error('Both sets of birth details are identical - enter the second person\'s own date, time and place.');
        e.field='pDob';throw e;}
    }
  }catch(e){err.textContent=e.message;
    if(e.field){const f=$('#'+e.field);
      if(f){
        /* Latitude, longitude and timezone live in a panel that is collapsed by
           default. Complaining about a field the user cannot see - and focusing
           a display:none input, which silently does nothing - is worse than no
           guidance at all, so open the panel that holds it first. */
        const row=f.closest('.manual-row');
        if(row&&!row.classList.contains('show')){
          const tog=(row.closest('.form-grid')||document).querySelector('.manual-toggle');
          if(tog)tog.click();
        }
        smoothTo(f.closest('.field')||f);
        setTimeout(()=>{try{f.focus({preventScroll:true});}catch(_){f.focus();}},260);
      }}
    return;}
  lastInput=gInput;
  try{gChart=castChart(gInput);
    if(bInput)bChart=castChart(bInput);
  }catch(e){err.textContent='Computation error: '+e.message;console.error(e);return;}
  saveChartForUser(gInput);
  if(bInput)saveChartForUser(bInput);
  if(match)renderMatchReport(gChart,gInput,bChart,bInput);
  else renderReport(gChart,gInput);
  $('#report').classList.add('show');$('#jumpNav').classList.add('show');
  requestAnimationFrame(()=>smoothTo($('#sec-'+SECTIONS[0][0])));
}

/* ======================= small helpers ======================= */
const el=(t,c,h)=>{const e=document.createElement(t);if(c)e.className=c;if(h!=null)e.innerHTML=h;return e;};
/* The section number is the position in the active nav list, so inserting a
   section (Marriage Compatibility appears only for a two-chart report) renumbers
   the rest instead of leaving a gap. */
const secHead=(id,t,note)=>{const i=SECTIONS.findIndex(s=>s[0]===id);
  const n=String(i>=0?i+1:SECTIONS.length+1).padStart(2,'0');
  return `<div class="sec-head"><span class="num">${n}</span><h2>${t}</h2>${note?`<span class="note">${note}</span>`:''}</div>`;};
const houseFrom=(fromSign,sign)=>((sign-fromSign)%12+12)%12+1;
const ord=n=>n+({1:'st',2:'nd',3:'rd'}[n%10>3||[11,12,13].includes(n%100)?0:n%10]||'th');

/* planet attributes for remedies/lucky */
const PATTR={0:{day:'Sunday',col:'red / orange',num:'1',gem:'Ruby',metal:'Gold / Copper',dir:'East',dev:'Surya / Shiva'},
1:{day:'Monday',col:'white / cream',num:'2',gem:'Pearl',metal:'Silver',dir:'North-West',dev:'Parvati / Gauri'},
2:{day:'Tuesday',col:'red / coral',num:'9',gem:'Red Coral',metal:'Copper',dir:'South',dev:'Hanuman / Kartikeya'},
3:{day:'Wednesday',col:'green',num:'5',gem:'Emerald',metal:'Brass',dir:'North',dev:'Vishnu'},
4:{day:'Thursday',col:'yellow',num:'3',gem:'Yellow Sapphire',metal:'Gold',dir:'North-East',dev:'Brahma / Guru'},
5:{day:'Friday',col:'white / pink',num:'6',gem:'Diamond',metal:'Silver',dir:'South-East',dev:'Lakshmi'},
6:{day:'Saturday',col:'blue / black',num:'8',gem:'Blue Sapphire',metal:'Iron',dir:'West',dev:'Shani / Hanuman'},
7:{day:'-',col:'smoky grey',num:'4',gem:'Hessonite',metal:'Lead',dir:'South-West',dev:'Durga'},
8:{day:'-',col:'grey',num:'7',gem:"Cat's Eye",metal:'-',dir:'-',dev:'Ganesha'}};
const NAME_SYL={0:['Chu','Che','Cho','La'],1:['Li','Lu','Le','Lo'],2:['A','I','U','E'],3:['O','Va','Vi','Vu'],
4:['Ve','Vo','Ka','Ki'],5:['Ku','Gha','Nga','Chha'],6:['Ke','Ko','Ha','Hi'],7:['Hu','He','Ho','Da'],
8:['Di','Du','De','Do'],9:['Ma','Mi','Mu','Me'],10:['Mo','Ta','Ti','Tu'],11:['Te','To','Pa','Pi'],
12:['Pu','Sha','Na','Tha'],13:['Pe','Po','Ra','Ri'],14:['Ru','Re','Ro','Ta'],15:['Ti','Tu','Te','To'],
16:['Na','Ni','Nu','Ne'],17:['No','Ya','Yi','Yu'],18:['Ye','Yo','Bha','Bhi'],19:['Bhu','Dha','Pha','Dha'],
20:['Bhe','Bho','Ja','Ji'],21:['Ju','Je','Jo','Gha'],22:['Ga','Gi','Gu','Ge'],23:['Go','Sa','Si','Su'],
24:['Se','So','Da','Di'],25:['Du','Tha','Jha','Da'],26:['De','Do','Cha','Chi']};

/* interpretation text banks */
const LAGNA_TXT=["a pioneering, energetic Meṣa Lagna - direct, courageous, quick to initiate and happiest leading from the front.",
"a steady, sensual Vṛṣabha Lagna - patient, resourceful, value-driven and drawn to comfort, beauty and security.",
"a curious, communicative Mithuna Lagna - versatile, witty, mentally restless and skilled with words and ideas.",
"a nurturing, sensitive Karka Lagna - emotionally intelligent, protective of home and family, guided by feeling and memory.",
"a regal, warm-hearted Siṁha Lagna - confident, generous, dignified and born to be seen and to lead.",
"an analytical, service-minded Kanyā Lagna - precise, discerning, health-conscious and quietly perfectionist.",
"a graceful, relational Tulā Lagna - diplomatic, fair-minded, aesthetically refined and happiest in partnership.",
"an intense, penetrating Vṛścika Lagna - magnetic, private, deeply resilient and transformative under pressure.",
"an expansive, philosophical Dhanu Lagna - optimistic, principled, freedom-loving and a natural teacher or seeker.",
"a disciplined, ambitious Makara Lagna - pragmatic, enduring, responsible and built for the long climb to authority.",
"an original, humanitarian Kumbha Lagna - independent, inventive, socially conscious and drawn to the unconventional.",
"a compassionate, imaginative Mīna Lagna - intuitive, gentle, spiritually inclined and emotionally boundless."];
const MOON_TXT=["an impulsive, warm, pioneering emotional nature; you act first and recover fast.",
"a calm, steady, comfort-seeking mind that resists being rushed and treasures security.",
"a quick, chatty, adaptable mind that thrives on variety and mental stimulation.",
"a deeply feeling, caretaking, intuitive heart, strongly tied to home and roots.",
"a proud, generous, expressive emotional nature that needs appreciation to flourish.",
"a careful, modest, analytical mind, happiest when things are useful and in order.",
"a harmony-seeking, partnership-oriented heart that dislikes conflict and craves balance.",
"an intense, secretive, emotionally profound nature with great powers of endurance.",
"an optimistic, restless, truth-seeking mind that needs room to roam and believe.",
"a serious, self-reliant, goal-driven emotional nature that matures early and endures.",
"a detached, original, idealistic mind that thinks in systems and befriends widely.",
"a tender, dreamy, compassionate heart, porous to others and rich in imagination."];
const HOUSE_THEME=["self, vitality & body","wealth, speech & family","courage, siblings & effort","home, mother, land & comfort","children, intellect & past merit","health, service, debts & rivals","marriage, partnership & the public","longevity, transformation & hidden matters","fortune, dharma, father & higher learning","career, status & action","gains, income & aspirations","loss, expense, moksha & foreign lands"];
/* modern career domains by governing planet (traditional significations, hedged in the copy) */
const DOMAIN={0:"government, administration, leadership or politics",1:"public-facing work, hospitality, nursing, food/dairy or anything serving the wider public",2:"engineering, defence, surgery, sport, real estate or machinery",3:"IT & software, writing, accountancy, teaching, media or trade",4:"law, teaching, finance, advisory, counselling or spiritual work",5:"the arts, design, entertainment, fashion, luxury or hospitality",6:"structured institutions, labour, mining/oil, law or long-horizon organisations"};
const DIG=["North","North-East","East","South-East","South","South-West","West","North-West"];

/* ---- chart SVGs (North & South Indian) ---- */
const NI_POS=[null,[.50,.27],[.27,.13],[.13,.27],[.27,.50],[.13,.73],[.27,.87],[.50,.73],[.73,.87],[.87,.73],[.73,.50],[.87,.27],[.73,.13]];
const NI_SIGN=[null,[.50,.42],[.13,.05],[.05,.13],[.42,.50],[.05,.87],[.13,.95],[.50,.58],[.87,.95],[.95,.87],[.58,.50],[.95,.13],[.87,.05]];
function northChart(ascSign,placements){const S=300;let g=`<svg class="chart" viewBox="0 0 ${S} ${S}" role="img" aria-label="North Indian chart">`;
  g+=`<rect class="bg" x="1" y="1" width="${S-2}" height="${S-2}" rx="6"/><rect class="cl" x="1" y="1" width="${S-2}" height="${S-2}" rx="6"/>`;
  g+=`<path class="cl" d="M1 1 L${S-1} ${S-1} M${S-1} 1 L1 ${S-1}"/><path class="cl" d="M${S/2} 1 L${S-1} ${S/2} L${S/2} ${S-1} L1 ${S/2} Z"/>`;
  for(let h=1;h<=12;h++){const sign=(ascSign+h-1)%12;const sp=NI_SIGN[h];g+=`<text class="sign-no" x="${sp[0]*S}" y="${sp[1]*S}" text-anchor="middle">${sign+1}</text>`;}
  const bh={};placements.forEach(p=>{(bh[p.house]=bh[p.house]||[]).push(p);});
  for(const h in bh){const pos=NI_POS[h],arr=bh[h],per=3,lines=Math.ceil(arr.length/per);
    arr.forEach((p,i)=>{const row=Math.floor(i/per),col=i%per,inRow=Math.min(per,arr.length-row*per);
      const x=pos[0]*S+(col-(inRow-1)/2)*22,y=pos[1]*S+(row-(lines-1)/2)*15+4;
      g+=`<text class="pl ${p.cls||''}" x="${x}" y="${y}" text-anchor="middle">${p.glyph}</text>`;});}
  return g+'</svg>';}
const SI_CELL=[[0,0,11],[1,0,0],[2,0,1],[3,0,2],[3,1,3],[3,2,4],[3,3,5],[2,3,6],[1,3,7],[0,3,8],[0,2,9],[0,1,10]];
function southChart(ascSign,placements){const S=300,c=S/4;let g=`<svg class="chart" viewBox="0 0 ${S} ${S}" role="img" aria-label="South Indian chart">`;
  g+=`<rect class="bg" x="1" y="1" width="${S-2}" height="${S-2}" rx="6"/>`;
  const bs={};placements.forEach(p=>{(bs[p.sign]=bs[p.sign]||[]).push(p);});
  for(const cell of SI_CELL){const[cx,cy,sign]=cell,x=cx*c,y=cy*c;
    g+=`<rect class="${sign===ascSign?'cl':'cl-soft'}" x="${x+1}" y="${y+1}" width="${c-2}" height="${c-2}"/>`;
    g+=`<text class="sign-no" x="${x+5}" y="${y+13}">${sign+1}</text>`;
    if(sign===ascSign)g+=`<path class="cl" d="M${x+1} ${y+1} L${x+13} ${y+1} L${x+1} ${y+13} Z"/>`;
    const arr=bs[sign]||[],per=2;arr.forEach((p,i)=>{const row=Math.floor(i/per),col=i%per;
      const px=x+c/2+(col-0.5)*30,py=y+c/2+row*15+2;g+=`<text class="pl ${p.cls||''}" x="${px}" y="${py}" text-anchor="middle">${p.glyph}</text>`;});}
  return g+`<text x="${S/2}" y="${S/2}" text-anchor="middle" class="sign-no" style="font-size:11px">Rāśi</text></svg>`;}
function d1Placements(chart){return chart.planets.map(p=>({glyph:PG[p.i],house:p.house,sign:p.sign,
  cls:p.i>=7?'':''})).concat([{glyph:'La',house:1,sign:chart.ascSign,cls:'pl-asc'}]);}
function vargaPlacements(v){const it=v.items.map(x=>({glyph:PG[x.i],sign:x.sign,house:houseFrom(v.ascSign,x.sign)}));
  it.push({glyph:'La',sign:v.ascSign,house:1,cls:'pl-asc'});return it;}

/* ======================= SECTION LIST + NAV ======================= */
const BASE_SECTIONS=[['sum','At a Glance'],['birth','Birth Chart'],['snapshot','Planetary Condition'],
['ashtaka','Ashtakavarga'],['bhava','House-Lords'],['aspects','Aspects'],['karaka','Chara Kārakas'],
['yoga','Yogas'],['states','Planetary States'],['jaimini','Jaimini Points'],['strength','Strength & Upagrahas'],
['shadbala','Shadbala'],['doshas','Doshas'],['good','Strengths'],['bad','Challenges'],['life','Life Readings'],
['career','Career & Finance'],['learning','Education & Lifestyle'],
['people','People & Parents'],['chrono','Life Chronology'],['chalit','Bhava Chalit'],['depth','Āyur · Spouse · Children'],
['vargas','Divisional Charts'],['dasha','Daśā Roadmap'],['sadesati','Sade-Sati & Transits'],
['remedies','Remedies'],['gochara','Year-by-Year'],['nearterm','Near-Term'],['verify','Verification'],['glossary','Glossary']];
/* Compatibility mode is its own report with its own sections, so the nav, the
   scroll-spy and the section numbering all work off whichever list the last
   render actually used. */
const MATCH_SECTIONS=[['mglance','Match at a Glance'],['mkoota','Ashtakoota (36 pts)'],
['mgates','Nāḍī & Bhakūṭa Doshas'],['mlayers','Beyond the Kootas'],['mareas','Area by Area'],
['mcharts','Both Charts · D-1 & D-9'],['mdasha','Daśā & Timing'],['mremedy','Remedies & Next Steps'],
['mgloss','Glossary']];
let SECTIONS=BASE_SECTIONS;

/* plain-English one-liner for each section (shown when "Plain English" is on) */
const LAYMAN={
sum:"The big picture in a glance - your rising sign, moon sign, birth star, and the life-phase you are in now.",
birth:"Your exact sky-map at birth: where each planet sat, plus the five 'panchanga' qualities of that day.",
snapshot:"How strong or weak each planet is, and whether it helps or challenges you for your rising sign.",
ashtaka:"A points score (out of 56) for the strength of each life-area - higher means smoother.",
bhava:"Which life-area feeds which: e.g. how your career house connects to your money house.",
aspects:"The 'gaze' each planet casts on other houses - where its energy reaches across the chart.",
karaka:"Jaimini 'significators' - which planet stands for your soul, career, spouse, children, and so on.",
yoga:"Special planetary combinations that create defined results, good or cautionary.",
states:"Each planet's friendships, maturity 'age', and whether it is burnt by the Sun.",
jaimini:"Special sensitive points: your public image, marriage image, and lucky/unlucky planets.",
strength:"Numerical strength of each planet, plus shadow sub-points that mark hidden events.",
shadbala:"The six-fold mathematical strength score of each planet (above 1.0 = strong).",
doshas:"Well-known 'afflictions' (Manglik, Kala-Sarpa, etc.) - present or absent, with remedies.",
good:"The chart's genuine strengths, in plain sentences.",
bad:"The chart's sensitive areas and challenges, each with how to soften it.",
life:"Plain-language readings for personality, career, money, marriage, children, health and inner life.",
career:"Work and money in detail - what kind of job suits you, business or salary, how income and savings tend to behave, and property.",
learning:"Study, foreign travel, where you may settle, and the lifestyle the chart leans toward.",
people:"What the chart suggests about your spouse, children, mother and father.",
chrono:"Your life told as chapters, one per major planetary period, against your age.",
chalit:"A refined house chart using exact cusps - sometimes a planet shifts one house.",
depth:"Deeper looks at lifespan themes, the spouse, and children.",
mglance:"The headline: the traditional score out of 36, what it means in words, and the specific strong and weak points of this pairing.",
mkoota:"The 36-point score broken into its eight parts, showing exactly where points were won and lost.",
mgates:"The two heavy doshas - and, just as important, whether the classical rules that cancel them apply here.",
mlayers:"What the 36 points miss: the two whole charts read against each other, including the Navāṁśa, which is the chart the tradition actually uses to judge a marriage.",
mareas:"A separate verdict for each part of married life - feelings, thinking, talking, family, money, staying power and physical fit.",
mcharts:"Both birth charts side by side, in the two forms that matter for marriage: the main chart and the Navāṁśa.",
mdasha:"Which planetary periods each of you is running now and next, and what that says about timing.",
mremedy:"Traditional observances where a dosha stands, and the specific things worth asking a human astrologer about.",
mgloss:"Plain-English meanings of the Sanskrit terms used in this match report.",
vargas:"Zoom-in charts, each dedicated to one life-area (marriage, career, health, and more).",
dasha:"Your life timeline: which planet 'rules' each stretch of years, and the sub-periods within.",
sadesati:"Where the slow planets are transiting now, including Saturn's famous 7.5-year Sade-Sati.",
remedies:"Traditional supportive practices - mantras, colours, gemstones, charity - never guarantees.",
gochara:"A year-by-year weather-map of the slow planets against your moon and rising signs.",
nearterm:"A month-by-month timeline of the next few years' key planetary changes.",
verify:"Proof of accuracy: how the maths is computed and cross-checked against the Swiss Ephemeris.",
glossary:"Plain-English meanings of the Sanskrit terms used throughout."};

const prefersReduce=()=>matchMedia('(prefers-reduced-motion:reduce)').matches;

/* Provenance for a generated verdict: the classical condition that fired, the
   values from THIS chart that satisfied it, and the tradition it belongs to.
   Every reading in the report is the output of a deterministic test - this is
   what makes that inspectable rather than something the reader has to trust. */
/* The five-part contract. Every reading that fires a classical test carries the
   same five things: (1) the rule and the text it comes from, (2) the grahas and
   bhāvas that triggered it in THIS chart, (3) how strongly it is indicated,
   (4) when it is most likely to activate, (5) what it means in plain words.
   Parts 1-4 live in the disclosure below; part 5 is the reading prose the
   disclosure hangs off, so it is not repeated inside it. Parts 3 and 4 are
   computed per-reading by the engines from the same chart as everything else -
   never asserted by hand, and never invented where the rule has no timing. */
const CONF_CLS={strong:'c-strong',moderate:'c-mod',weak:'c-weak'};
function confPill(c){
  if(!c)return'';
  const level=(c.level||'').toLowerCase();
  return `<span class="conf-pill ${CONF_CLS[level]||'c-mod'}">${esc(c.level||'')}</span>`
    +(c.basis?` <span class="conf-basis">${esc(c.basis)}</span>`:'');
}
function whyBlock(w){
  if(!w||!w.rule)return'';
  return '<details class="why-rule"><summary>'
    +'<span class="why-screen">why this reading?</span>'
    +'<span class="why-print">Source of this reading</span></summary>'
    +`<dl><dt>Rule</dt><dd>${esc(w.rule)}</dd>`
    +`<dt>This chart</dt><dd class="mono">${esc(w.chart)}</dd>`
    +(w.confidence?`<dt>Strength</dt><dd>${confPill(w.confidence)}</dd>`:'')
    +(w.window?`<dt>Activates</dt><dd>${esc(w.window)}</dd>`:'')
    +`<dt>Tradition</dt><dd>${esc(w.tradition)}</dd></dl></details>`;
}
/* The exported PDF carries the provenance too, so a printed chart is
   self-documenting. Expand every disclosure for the print run, then put back
   exactly the ones we opened. Chrome/Firefox fire beforeprint; Safari only
   flips the print media query, so both paths are wired. */
function setWhyOpen(on){
  document.querySelectorAll('.why-rule').forEach(d=>{
    if(on){if(!d.open){d.open=true;d.dataset.autoOpen='1';}}
    else if(d.dataset.autoOpen){d.open=false;delete d.dataset.autoOpen;}
  });
}
window.addEventListener('beforeprint',()=>setWhyOpen(true));
window.addEventListener('afterprint',()=>setWhyOpen(false));
(function(){const mq=matchMedia('print');const h=e=>setWhyOpen(e.matches);
  if(mq.addEventListener)mq.addEventListener('change',h);else if(mq.addListener)mq.addListener(h);})();
function smoothTo(target){if(!target)return;
  const navH=$('#jumpNav').offsetHeight||0;
  const y=target.getBoundingClientRect().top+window.pageYOffset-navH-8;
  window.scrollTo({top:y,behavior:prefersReduce()?'auto':'smooth'});}

/* ======================= RENDER ======================= */
function renderReport(chart,input){
  SECTIONS=BASE_SECTIONS;
  const R=$('#report');R.innerHTML='';
  const P=chart.planets, moon=P[1], sun=P[0], asc=chart.ascSign;
  const pan=J.panchanga(chart), ava=J.avakhada(chart), fn=J.functionalNature(chart);
  const asp=J.aspects(chart), avs=J.avasthas(chart), jm=J.jaimini(chart), upg=J.upagrahas(chart);
  const gul=J.gulika(chart), sbala=J.shadbala(chart), dsh=J.doshas(chart);
  const sev=J.sunEvents(chart), mev=J.moonEvents(chart), lt=jd=>jdLocalTime(jd,input.tz);
  const av=J.ashtakavarga(chart), vim=J.vimshottari(moon.lon,chart.jd), yog=J.detectYogas(chart);
  const ck=J.charaKarakas(P), chalit=J.bhavaChalit(chart);
  const ss=J.sadeSati(chart,nowJD());
  const pro=input.gender==='female'?'she':input.gender==='male'?'he':'they';
  const His=input.gender==='female'?'Her':input.gender==='male'?'His':'Their';
  const first=esc(input.name.split(' ')[0]);
  const dignOf=p=>p.dig?`<span class="pill ${p.dig.cls}">${p.dig.label}</span>`:'';
  const jump=$('#jumpInner');jump.innerHTML=SECTIONS.map(s=>`<a href="#sec-${s[0]}" data-sec="${s[0]}">${s[1]}</a>`).join('');
  const jc=$('#jumpCount');if(jc)jc.textContent='1 / '+SECTIONS.length;
  requestAnimationFrame(railUpdate);

  const add=(id,html)=>{const s=el('section','rpt',html);s.id='sec-'+id;R.appendChild(s);return s;};

  /* ---------- 01 AT A GLANCE ---------- */
  const born=`${String(input.d).padStart(2,'0')} ${MON[input.mo-1]} ${input.y}, ${String(input.hh).padStart(2,'0')}:${String(input.mi).padStart(2,'0')}`;
  const curMD=vim.list.find(m=>nowJD()>=m.st&&nowJD()<m.en);
  const curAD=curMD&&curMD.ad.find(a=>nowJD()>=a.st&&nowJD()<a.en);
  const curPDs=curAD?J.pratyantardashas(curAD):null;
  const curPD=curPDs&&curPDs.find(p=>nowJD()>=p.st&&nowJD()<p.en);
  const nextMD=vim.list[vim.list.indexOf(curMD)+1];
  // compact mobile summary bar (sticky on phones)
  const mb=$('#mobileBar');if(mb){mb.innerHTML=`<span>La <b>${SS[asc]}</b></span><span>Moon <b>${moon.nak.name}</b></span><span>Daśā <b>${curMD?PL[curMD.lord]:'-'}</b></span>`;mb.classList.add('show');}
  // strengths & challenges (auto)
  const strengths=[],challenges=[];
  P.forEach(p=>{if(p.dig&&p.dig.cls==='exalt')strengths.push(`${PL[p.i]} exalted in the ${ord(p.house)} (${SG[p.sign]}) - a peak-strength graha.`);});
  if(yog.some(y=>y[0].includes('Gajakesari')))strengths.push('Gajakesari yoga - Jupiter in a kendra from the Moon: wisdom & repute.');
  if(yog.some(y=>y[0].includes('Budh')))strengths.push('Budhāditya yoga - sharp intellect and communication.');
  const sbTop=sbala[0],sbTop2=sbala[1];
  strengths.push(`Strongest by Shadbala: ${PL[sbTop.i]} (${sbTop.ratio.toFixed(2)}) & ${PL[sbTop2.i]} (${sbTop2.ratio.toFixed(2)}).`);
  const savMax=Math.max(...av.sav);strengths.push(`Ashtakavarga peak in ${SG[av.sav.indexOf(savMax)]} (${savMax} bindus).`);
  if(dsh.find(d=>d.name.includes('Kala Sarpa')).status.includes('ABSENT'))strengths.push('Kāla-Sarpa is absent.');
  dsh.forEach(d=>{if(d.status.startsWith('PRESENT')||d.status==='ACTIVE')challenges.push(`${d.name}: ${d.detail}`);});
  if(ss.status==='ACTIVE')challenges.push(`Sade-Sati is ACTIVE now - ${ss.phase}.`);
  P.forEach(p=>{if(p.dig&&p.dig.cls==='debil')challenges.push(`${PL[p.i]} debilitated in the ${ord(p.house)} - a maturing lesson.`);
    if(p.combust&&p.i===SL[asc])challenges.push(`${PL[p.i]} (Lagna lord) combust - drive needs steady channelling.`);});
  if(challenges.length===0)challenges.push('No major afflictions flagged - a relatively unobstructed chart.');
  // lucky
  const lagnaLord=SL[asc],ninthLord=SL[(asc+8)%12];
  const favP=[...new Set([lagnaLord,ninthLord,...fn.benefics,...fn.yogakaraka])].filter(x=>x<7);
  const luckyDays=[...new Set(favP.map(p=>PATTR[p].day))].filter(x=>x!=='-');
  const luckyCol=[...new Set(favP.map(p=>PATTR[p].col))];
  const luckyNum=[...new Set(favP.map(p=>PATTR[p].num))];
  const luckyGem=[...new Set([lagnaLord,ninthLord].map(p=>PATTR[p].gem))];
  const luckyDir=[...new Set(favP.map(p=>PATTR[p].dir))].filter(x=>x!=='-');
  const syl=NAME_SYL[moon.nak.idx];
  /* An unknown birth time changes what this report can honestly claim, so it is
     said once at the top in full rather than buried in a footnote. */
  const unknownBanner=chart.timeUnknown?`<div class="panel time-warn">
      <div class="tw-h">Cast for 12:00 noon - the birth time was not known</div>
      <p>Everything that does not depend on the time of day is exact: the Moon-sign and
      nakṣatra (barring a late-day change), the planets' signs, the pañcāṅga, the yogas formed
      by sign, and the whole of the compatibility arithmetic.</p>
      <p>Three things are <b>provisional</b> until a verified time is entered - the
      <b>Lagna and every house number</b> derived from it, which shift roughly one sign every
      two hours; the <b>daśā dates</b>, because Vimśottari is set by the Moon's exact nakṣatra
      position and the Moon covers about 13° in a day; and <b>anything cast on the house
      cusps</b> - Bhāva Chalit, Gulika and the upagrahas.</p>
      <p>No reading in this report is graded <b>strong</b> while the time is unknown. That is
      the classical instruction rather than a display choice: with no time there is no Lagna,
      and without a Lagna the houses are an assumption.</p></div>`:'';
  add('sum',secHead('sum','Janma Kuṇḍali - At a Glance')+
    unknownBanner+
    `<div class="panel hero"><div class="eyebrow">Complete Vedic Horoscope</div>
      <div class="name">${esc(input.name)}</div>
      <div class="born">${esc(born)} · UTC${input.tz>=0?'+':''}${input.tz}${input.dst?' (DST-adjusted)':''} · ${esc(input.place)} · ${pan.vaara}, ${pan.tithi}</div>
      <div class="hero-grid">
        <div class="stat"><div class="k">Lagna</div><div class="v">${SA[asc]}</div><div class="s">${SS[asc]} ${J.dm(chart.asc%30)} · ${chart.ascNak.name}-${chart.ascNak.pada}</div></div>
        <div class="stat"><div class="k">Rāśi (Moon)</div><div class="v">${SA[moon.sign]}</div><div class="s">${chart.planets[1].nak.name}-${moon.nak.pada} · house ${moon.house}</div></div>
        <div class="stat"><div class="k">Nakṣatra</div><div class="v">${moon.nak.name}</div><div class="s">Lord ${ava.nakLord} · pada ${moon.nak.pada}</div></div>
        <div class="stat"><div class="k">Current Daśā</div><div class="v">${curMD?PL[curMD.lord]:'-'}</div><div class="s">${curAD?'antar '+PL[curAD.lord]:''}${curPD?' · pratyantar '+PL[curPD.lord]:''} → ${curMD?jdMY(curMD.en):''}</div></div>
      </div>
      <div class="two-panel">
        <div class="mini"><div class="mini-k">Yogakāraka</div><div class="mini-v">${fn.yogakaraka.length?fn.yogakaraka.map(p=>PL[p]).join(', '):'None single - best benefics '+fn.benefics.map(p=>PL[p]).join(', ')}</div></div>
        <div class="mini"><div class="mini-k">Ātma / Dara Kāraka</div><div class="mini-v">${ck[0].name} / ${ck[6].name}</div></div>
        <div class="mini"><div class="mini-k">Sade-Sati</div><div class="mini-v">${ss.status}${ss.status==='ACTIVE'?' - '+ss.phase:''}</div></div>
        <div class="mini"><div class="mini-k">Next Mahādaśā</div><div class="mini-v">${nextMD?PL[nextMD.lord]+' ('+jd2date(nextMD.st).getUTCFullYear()+')':'-'}</div></div>
      </div>
    </div>
    <div class="sc-cols">
      <div class="panel sc-card good"><div class="sc-head">Key Strengths</div><ul class="clean">${strengths.slice(0,7).map(s=>`<li>${s}</li>`).join('')}</ul></div>
      <div class="panel sc-card bad"><div class="sc-head">Key Challenges</div><ul class="clean">${challenges.slice(0,7).map(s=>`<li>${s}</li>`).join('')}</ul></div>
    </div>
    <div class="panel oneline"><b>Life in one line:</b> ${lifeLine(chart,input,vim,curMD,ss,yog,pro)}</div>
    <div class="tbl-wrap" style="margin-top:18px"><table><thead><tr><th>Lucky / Favourable</th><th>Supportive</th><th>Use with care</th></tr></thead><tbody>
      <tr><td>Days</td><td>${luckyDays.join(', ')}</td><td>Saturday (Saturn) for major starts</td></tr>
      <tr><td>Colours</td><td>${luckyCol.join(', ')}</td><td>${PATTR[6].col} for key occasions</td></tr>
      <tr><td>Numbers</td><td>${luckyNum.join(', ')}</td><td>8 (Saturn)</td></tr>
      <tr><td>Direction</td><td>${luckyDir.join(', ')}</td><td>${PATTR[6].dir} for new ventures</td></tr>
      <tr><td>Gemstones</td><td>${luckyGem.join(', ')} (Lagna & 9th lords)</td><td>Blue Sapphire - test first</td></tr>
      <tr><td>Iṣṭa Devatā / Deity</td><td>${jm.ishtaLord} - ${J.ISHTA_DEV[SL[jm.ishta12]]}</td><td>-</td></tr>
      <tr><td>Name syllables</td><td>${syl.join(', ')} (${moon.nak.name})</td><td>-</td></tr>
    </tbody></table></div>`);

  /* ---------- 02 BIRTH CHART + PANCHANGA + AVAKHADA ---------- */
  let posRows='';
  P.forEach(p=>{const flags=[];if(p.retro&&p.i>=2&&p.i<=6)flags.push('<span class="pill retro">R</span>');
    if(p.combust)flags.push('<span class="pill comb">Comb</span>');if(p.dig)flags.push(dignOf(p));
    posRows+=`<tr><td class="glyph">${PSA[p.i]} <span class="muted">${p.name}</span></td><td>${SA[p.sign]} <small class="muted">(${SS[p.sign]})</small></td><td class="num">${J.dms(p.lon%30)}</td><td class="num">${p.house}</td><td>${p.nak.name}-${p.nak.pada}</td><td>${PL[SL[p.sign]]}</td><td>${flags.join(' ')||'<span class="muted">-</span>'}</td></tr>`;});
  add('birth',secHead('birth','Vedic Birth Chart')+
    `<div class="panch-grid">
      <div class="panch"><span>Tithi</span><b>${pan.tithi}</b></div>
      <div class="panch"><span>Vaara</span><b>${pan.vaara}</b></div>
      <div class="panch"><span>Karana</span><b>${pan.karana}</b></div>
      <div class="panch"><span>Nitya Yoga</span><b>${pan.yoga}</b></div>
      <div class="panch"><span>Sun sign (Vedic)</span><b>${SG[sun.sign]}</b></div>
      <div class="panch"><span>Sun sign (Western)</span><b>${SG[pan.sunSignWestern]}</b></div>
      <div class="panch"><span>Sunrise</span><b>${lt(sev&&sev.riseJD)}</b></div>
      <div class="panch"><span>Sunset</span><b>${lt(sev&&sev.setJD)}</b></div>
      <div class="panch"><span>Moonrise</span><b>${lt(mev&&mev.riseJD)}</b></div>
      <div class="panch"><span>Moonset</span><b>${lt(mev&&mev.setJD)}</b></div>
      <div class="panch"><span>Ayanāṁśa (Lahiri)</span><b>${J.ayanamsa(chart.jd).toFixed(4)}°</b></div>
      <div class="panch"><span>Lagna lord</span><b>${PL[lagnaLord]} (house ${P[lagnaLord].house})</b></div>
    </div>
    <p class="hint">Rise/set times are local clock time at the birth place (UTC${input.tz>=0?'+':''}${input.tz}${input.dst?', DST applied':''}), computed for the civil date of birth. A dash means the body did not rise or set on that date at that latitude. Sidereal positions use the <b>Lahiri (Chitrapakṣa) ayanāṁśa</b>.</p>
    <div class="chart-row" style="margin-top:20px">
      <div class="panel chart-card"><h3>Rāśi · North Indian</h3>${northChart(asc,d1Placements(chart))}</div>
      <div class="panel chart-card"><h3>Rāśi · South Indian</h3>${southChart(asc,d1Placements(chart))}</div>
    </div>
    <div class="tbl-wrap" style="margin-top:20px"><table><thead><tr><th>Graha</th><th>Rāśi</th><th>Degree</th><th>H</th><th>Nakṣatra-pada</th><th>Lord</th><th>State</th></tr></thead><tbody>${posRows}</tbody></table></div>
    <h3 class="sub-h">Avakhada Chakra - attributes from Janma Rāśi / Nakṣatra</h3>
    <div class="panch-grid">
      <div class="panch"><span>Varna</span><b>${ava.varna}</b></div><div class="panch"><span>Vashya</span><b>${ava.vashya}</b></div>
      <div class="panch"><span>Yoni</span><b>${ava.yoni}</b></div><div class="panch"><span>Gana</span><b>${ava.gana}</b></div>
      <div class="panch"><span>Nadi</span><b>${ava.nadi}</b></div><div class="panch"><span>Tatva</span><b>${ava.tatva}</b></div>
      <div class="panch"><span>Paya</span><b>${ava.paya}</b></div><div class="panch"><span>Nak deity</span><b>${ava.deity}</b></div>
    </div>`);

  /* ---------- 03 PLANETARY CONDITION ---------- */
  let condRows='';
  P.slice(0,7).forEach(p=>{const cond=p.dig?p.dig.label:(p.combust?'Combust':'-');
    condRows+=`<tr><td class="glyph">${PL[p.i]}</td><td>${SG[p.sign]}</td><td>${cond} in ${ord(p.house)}</td><td class="muted">${conditionNote(p,asc,fn)}</td></tr>`;});
  const fbText=fn.benefics.map(p=>PL[p]).join(', ')||'-';
  const fmText=fn.malefics.map(p=>PL[p]).join(', ')||'-';
  add('snapshot',secHead('snapshot','Chart Snapshot - Planetary Condition')+
    `<div class="tbl-wrap"><table><thead><tr><th>Planet</th><th>Sign</th><th>Dignity / Strength</th><th>Note</th></tr></thead><tbody>${condRows}</tbody></table></div>
    <p class="para">Functional nature for ${SA[asc]} Lagna: ${fn.yogakaraka.length?'Yogakāraka = '+fn.yogakaraka.map(p=>PL[p]).join(', ')+'. ':'No single Yogakāraka. '}Best functional benefics: <b>${fbText}</b> (trikona lords). Functional malefics: <b>${fmText}</b> (dusthāna/growth-house lords). Marakas (2nd/7th lords): ${fn.marakas.map(p=>PL[p]).join(', ')||'-'}.</p>`);

  /* ---------- 04 ASHTAKAVARGA ---------- */
  const savTot=av.sav.reduce((a,b)=>a+b,0),maxS=Math.max(...av.sav),minS=Math.min(...av.sav);
  const heat=v=>`background:color-mix(in srgb,var(--brass) ${Math.round((v-minS)/Math.max(1,maxS-minS)*55+6)}%,transparent)`;
  // bar chart of SAV per house
  const houseSAV=[];for(let h=1;h<=12;h++){const sign=(asc+h-1)%12;houseSAV.push({h,sign,v:av.sav[sign]});}
  const barMax=Math.max(...houseSAV.map(x=>x.v));
  let bars='';houseSAV.forEach(x=>{const ht=Math.round(x.v/barMax*100);const strong=x.v>=28;
    bars+=`<div class="bar-col"><div class="bar-v">${x.v}</div><div class="bar" style="height:${ht}%;background:${strong?'var(--good)':'var(--crit)'}"></div><div class="bar-l">H${x.h}<br>${SS[x.sign]}</div></div>`;});
  let head='<tr><th>Planet</th>';for(let s=0;s<12;s++)head+=`<th>${SS[s]}</th>`;head+='<th>Σ</th></tr>';
  let body='';for(let p=0;p<7;p++){body+=`<tr><td>${PL[p]}</td>`;for(let s=0;s<12;s++)body+=`<td>${av.bav[p][s]}</td>`;body+=`<td class="av-sav">${av.bav[p].reduce((a,b)=>a+b,0)}</td></tr>`;}
  body+='<tr class="av-sav"><td>SAV</td>';for(let s=0;s<12;s++)body+=`<td style="${heat(av.sav[s])}">${av.sav[s]}</td>`;body+=`<td>${savTot}</td></tr>`;
  add('ashtaka',secHead('ashtaka','Strength of Each House - Ashtakavarga','total '+savTot)+
    `<div class="panel bar-wrap"><div class="bar-title">Sarvashtakavarga - benefic bindus per house</div><div class="bars">${bars}</div></div>
    <div class="tbl-wrap av-wrap" style="margin-top:18px"><table class="av"><thead>${head}</thead><tbody>${body}</tbody></table></div>
    <p class="hint">Strongest sign: <b>${SG[av.sav.indexOf(maxS)]}</b> (${maxS}); weakest: <b>${SG[av.sav.indexOf(minS)]}</b> (${minS}). BAV totals are the classical constants Sun 48 · Moon 49 · Mars 39 · Mercury 54 · Jupiter 56 · Venus 52 · Saturn 39.</p>`);

  /* ---------- 05 HOUSE-LORDS ---------- */
  let hlRows='';for(let h=1;h<=12;h++){const sign=(asc+h-1)%12,lord=SL[sign],sits=P[lord].house;
    hlRows+=`<tr><td>${ord(h)} ${['Self','Wealth/Family','Courage/Siblings','Home/Mother','Children/Mind','Health/Debts','Spouse','Longevity','Fortune','Career','Gains','Loss/Moksha'][h-1]}</td><td>${SG[sign]}</td><td>${PL[lord]}</td><td>${ord(sits)}</td><td class="muted">${HOUSE_THEME[h-1]} feeds ${HOUSE_THEME[sits-1]}</td></tr>`;}
  add('bhava',secHead('bhava','Bhava (House-Lord) Analysis')+
    `<p class="para">Where each house-lord sits shows how the affairs of one house feed another.</p>
    <div class="tbl-wrap"><table><thead><tr><th>House</th><th>Sign</th><th>Lord</th><th>Sits in</th><th>Indicates</th></tr></thead><tbody>${hlRows}</tbody></table></div>`);

  /* ---------- 06 ASPECTS ---------- */
  let aspRows='';asp.forEach(a=>{aspRows+=`<tr><td class="glyph">${PL[a.i]} <span class="muted">(${ord(a.house)})</span></td><td>${a.aspects.map(ord).join(', ')}</td><td class="muted">${aspectNote(a,P,asc)}</td></tr>`;});
  add('aspects',secHead('aspects','Planetary Aspects (Graha Dṛṣṭi)')+
    `<p class="para">Every planet aspects the 7th from itself; Mars also the 4th & 8th, Jupiter the 5th & 9th, Saturn the 3rd & 10th, the nodes the 5th & 9th (whole-sign).</p>
    <div class="tbl-wrap"><table><thead><tr><th>Planet (house)</th><th>Aspects houses</th><th>Significance</th></tr></thead><tbody>${aspRows}</tbody></table></div>`);

  /* ---------- 07 CHARA KARAKAS ---------- */
  let ckRows='';const CKM={Atmakaraka:'soul, self, core desire',Amatyakaraka:'career, mind, counsel',Bhratrukaraka:'siblings, courage, guru',Matrukaraka:'mother, home, heart',Putrakaraka:'children, creativity, merit',Gnatikaraka:'obstacles, health, kin',Darakaraka:'spouse, partnership'};
  ck.forEach(k=>{ckRows+=`<tr><td class="glyph">${k.karaka}</td><td>${k.name}</td><td class="num">${J.dms(k.val)}</td><td class="muted">${CKM[k.karaka]}</td></tr>`;});
  add('karaka',secHead('karaka','Chara Kārakas (Jaimini soul-significators)')+
    `<div class="tbl-wrap"><table><thead><tr><th>Kāraka</th><th>Graha</th><th>Degree in sign</th><th>Signifies</th></tr></thead><tbody>${ckRows}</tbody></table></div>
    <p class="hint">The <b>Ātmakāraka</b> (${ck[0].name}, highest degree) is the soul-significator - the most important planet in the Jaimini scheme.</p>`);

  /* ---------- 08 YOGAS ---------- */
  add('yoga',secHead('yoga','Yogas - planetary combinations')+
    (yog.length?`<div class="yoga-list">${yog.map(y=>`<div class="yoga"><span class="icon">✦</span><div><b>${y[0]}</b><p>${y[1]}</p>${whyBlock(y[2])}</div></div>`).join('')}</div>`
    :'<p class="empty">No major classical yogas flagged.</p>'));

  /* ---------- 09 PLANETARY STATES ---------- */
  let stRows='';avs.forEach(a=>{const p=P[a.i];stRows+=`<tr><td class="glyph">${PL[a.i]}</td><td>${a.inSign} (${SG[p.sign]})</td><td>${a.compound}</td><td>${a.avastha}</td><td class="num">${a.varga}</td><td>${p.combust?'<span class="pill comb">Combust</span>':p.retro?'<span class="pill retro">Retro</span>':'<span class="muted">-</span>'}</td></tr>`;});
  add('states',secHead('states','Planetary States - Friendship, Avasthā & Combustion')+
    `<div class="tbl-wrap"><table><thead><tr><th>Planet</th><th>In sign of</th><th>Compound relation</th><th>Baladi avasthā</th><th>Varga bala</th><th>Condition</th></tr></thead><tbody>${stRows}</tbody></table></div>`);

  /* ---------- 10 JAIMINI POINTS ---------- */
  add('jaimini',secHead('jaimini','Jaimini & Special Points')+
    `<div class="tbl-wrap"><table><thead><tr><th>Point</th><th>Position</th><th>Meaning</th></tr></thead><tbody>
      <tr><td>Arudha Lagna (AL)</td><td>${SG[jm.AL]}</td><td class="muted">How the world perceives ${pro}</td></tr>
      <tr><td>Upapada (UL) - marriage</td><td>${SG[jm.UL]}</td><td class="muted">The image of the spouse & partnership</td></tr>
      <tr><td>Karakamsa (AK in D-9)</td><td>${SG[jm.karakamsa]}</td><td class="muted">Where the soul is drawn - ${SA[jm.karakamsa]}</td></tr>
      <tr><td>Yogi planet (lucky)</td><td>${jm.yogiLord} (${J.NAK[jm.yogiNak]})</td><td class="muted">Periods/people linked to it bring fortune</td></tr>
      <tr><td>Avayogi planet</td><td>${jm.avaLord}</td><td class="muted">A subtle caution point - prefer the Yogi</td></tr>
      <tr><td>Gulika / Mandi</td><td>${gul?SG[gul.sign]+' '+J.dm(gul.lon%30)+' (H'+gul.house+')':'-'}</td><td class="muted">Shadow point - adds karmic intensity to its house</td></tr>
      <tr><td>Sree Lagna (prosperity)</td><td>${SG[jm.sreeLagnaSign]}</td><td class="muted">Lakshmi / prosperity placement</td></tr>
    </tbody></table></div>
    <p class="hint">Iṣṭa Devatā (deity for spiritual growth), from the 12th-from-Karakamsa (${SG[jm.ishta12]}, lord ${jm.ishtaLord}): <b>${J.ISHTA_DEV[SL[jm.ishta12]]}</b>.</p>`);

  /* ---------- 11 STRENGTH & UPAGRAHAS ---------- */
  let sbRows='';sbala.forEach((r,i)=>{sbRows+=`<tr><td class="glyph">${PL[r.i]}</td><td class="num">${r.nais.toFixed(1)}</td><td class="num">${r.sthana.toFixed(1)}</td><td class="num">${r.dig.toFixed(1)}</td><td class="num">${r.rupas.toFixed(2)}</td><td class="num">${i+1}</td></tr>`;});
  let upgRows='';[gul?['Gulika/Mandi',gul.lon,gul.sign,gul.house,'Shadow point - karmic intensity']:null,...upg.map(u=>[u.name,u.lon,u.sign,u.house,u.effect])].filter(Boolean).forEach(u=>{upgRows+=`<tr><td>${u[0]}</td><td>${SG[u[2]]} ${J.dm(u[1]%30)}</td><td class="num">${u[3]}</td><td class="muted">${u[4]}</td></tr>`;});
  let arRows='';for(let h=1;h<=12;h++){arRows+=`<td class="ar-k">${h===1?'AL':'A'+h}</td><td>${SG[jm.arudhas[h]]}</td>`;if(h%3===0)arRows='<tr>'+arRows+'</tr>';}
  // rebuild arudha rows properly
  let arGrid='';for(let h=1;h<=12;h+=3){arGrid+='<tr>';for(let k=h;k<h+3&&k<=12;k++)arGrid+=`<td class="ar-k">${k===1?'AL':k===12?'UL':'A'+k}</td><td>${SG[jm.arudhas[k]]}</td>`;arGrid+='</tr>';}
  add('strength',secHead('strength','Planetary Strength & Upagrahas')+
    `<h3 class="sub-h">Indicative strength (Naisargika · Sthāna · Dig, in virūpas)</h3>
    <div class="tbl-wrap"><table><thead><tr><th>Planet</th><th>Naisargika</th><th>Sthāna</th><th>Dig</th><th>Rūpas</th><th>Rank</th></tr></thead><tbody>${sbRows}</tbody></table></div>
    <h3 class="sub-h">Upagrahas (sub-planets) - sensitive points</h3>
    <div class="tbl-wrap"><table><thead><tr><th>Upagraha</th><th>Position</th><th>H</th><th>Effect</th></tr></thead><tbody>${upgRows}</tbody></table></div>
    <h3 class="sub-h">All 12 Arudha Padas (how each area is perceived)</h3>
    <div class="tbl-wrap"><table class="arudha"><tbody>${arGrid}</tbody></table></div>`);

  /* ---------- 12 SHADBALA ---------- */
  let sb2='';sbala.forEach(r=>{const strong=r.ratio>=1;
    sb2+=`<tr><td class="glyph">${PL[r.i]}</td><td class="num">${r.sthana.toFixed(1)}</td><td class="num">${r.dig.toFixed(1)}</td><td class="num">${r.kala.toFixed(1)}</td><td class="num">${r.cheshta.toFixed(1)}</td><td class="num">${r.nais.toFixed(1)}</td><td class="num">${r.rupas.toFixed(2)}</td><td class="num">${r.req.toFixed(1)}</td><td class="num" style="color:${strong?'var(--good)':'var(--crit)'};font-weight:600">${r.ratio.toFixed(2)}</td></tr>`;});
  const strong=sbala.filter(r=>r.ratio>=1).map(r=>PL[r.i]);
  add('shadbala',secHead('shadbala','Shadbala (Six-fold Strength) & Bhavabala')+
    `<p class="para">Each planet scored on positional, directional, temporal, motional and natural strength (virūpas → rūpas). Ratio &gt; 1.0 means the planet meets its classical requirement.</p>
    <div class="tbl-wrap"><table><thead><tr><th>Planet</th><th>Sthāna</th><th>Dig</th><th>Kāla</th><th>Cheṣṭā</th><th>Naisarga</th><th>Rūpas</th><th>Req.</th><th>Ratio</th></tr></thead><tbody>${sb2}</tbody></table></div>
    <p class="hint">${strong.length?`Meeting the classical requirement: <b>${strong.join(', ')}</b>.`:`<b>No planet</b> meets its classical requirement in this chart.`} Bhavabala (house strength) mirrors the Ashtakavarga: strongest ${SG[av.sav.indexOf(maxS)]} (${maxS}), weakest ${SG[av.sav.indexOf(minS)]} (${minS}).</p>
    <p class="disc-inline">Shadbala here is a faithful classical model computed on-device; exact virūpa totals vary a little between authorities.</p>`);

  /* ---------- 13 DOSHAS ---------- */
  let dRows='';dsh.forEach(d=>{const cls=d.status.includes('ABSENT')||d.status==='Absent'?'good':d.status.includes('PRESENT')||d.status==='ACTIVE'?'warn':'muted';
    dRows+=`<tr><td>${d.name}</td><td><span class="stat-pill ${cls}">${d.status}</span></td><td class="muted">${d.detail}${whyBlock(d.why)}</td></tr>`;});
  add('doshas',secHead('doshas','Doshas (Afflictions) & Graha Yuddha')+
    `<div class="tbl-wrap"><table><thead><tr><th>Dosha</th><th>Status</th><th>Detail & mitigation</th></tr></thead><tbody>${dRows}</tbody></table></div>`);

  /* ---------- 14 STRENGTHS PROSE ---------- */
  add('good',secHead('good',"The Strengths - What the Chart Promises")+
    `<div class="prose">${strengthProse(chart,vim,yog,sbala,av,fn).map(s=>`<div class="read"><div class="tag good-tag">${s[0]}</div><p>${s[1]}</p></div>`).join('')}</div>`);

  /* ---------- 15 CHALLENGES PROSE ---------- */
  add('bad',secHead('bad',"The Challenges - Sensitive Areas")+
    `<div class="prose">${challengeProse(chart,dsh,ss,P,asc).map(s=>`<div class="read"><div class="tag bad-tag">${s[0]}</div><p>${s[1]}</p></div>`).join('')}</div>`);

  /* ---------- 16 LIFE READINGS ---------- */
  add('life',secHead('life','Life-Area Readings')+
    `<div class="interp">${lifeReadings(chart,input,vim,ss,fn,jm,pro,His,first).map(r=>`<div class="read"><div class="tag">${r[0]}</div><p>${r[1]}</p></div>`).join('')}</div>`);

  /* ---------- CAREER & FINANCE ---------- */
  const rd=r=>`<div class="read"><div class="tag">${r[0]}</div><p>${r[1]}</p>${r[2]?whyBlock(r[2]):''}</div>`;
  add('career',secHead('career','Career, Business & Finance in Detail')+
    `<div class="prose">${careerFinanceReadings(chart,vim,fn,sbala,av).map(rd).join('')}</div>
    <p class="disc-inline">Money sections describe the chart's traditional leanings only. Nothing here is
      investment, tax or financial advice - jyotiṣa describes inclination, not what anyone should buy, sell or
      hold, and no chart replaces a qualified adviser.</p>`);

  /* ---------- EDUCATION, FOREIGN TRAVEL & LIFESTYLE ---------- */
  add('learning',secHead('learning','Education, Foreign Travel & Lifestyle')+
    `<div class="prose">${learningReadings(chart,vim,jm).map(rd).join('')}</div>`);

  /* ---------- 17 PEOPLE & PARENTS ---------- */
  add('people',secHead('people','The People in Life - Spouse, Children, Parents')+
    `<div class="prose">${peopleReadings(chart,ck,jm,P,asc,pro,His).map(r=>`<div class="read"><div class="tag">${r[0]}</div><p>${r[1]}</p></div>`).join('')}</div>
    <p class="hint">Parents' birth details were not supplied - this reads from ${pro==='she'?'her':pro==='he'?'his':'their'} own kārakas and houses. Provide their date/time/place to add full synastry.</p>`);

  /* ---------- 18 LIFE CHRONOLOGY ---------- */
  let chrono='';const PHASE=['Childhood','Schooling','Youth & study','Career launch','Major rise','Establishment','Consolidation','Wisdom in age','Inward turn'];
  vim.list.forEach((md,i)=>{const a0=Math.round((md.st-chart.jd)/YEAR),a1=Math.round((md.en-chart.jd)/YEAR);
    const active=nowJD()>=md.st&&nowJD()<md.en;
    chrono+=`<tr class="${active?'active-row':''}"><td>${PL[md.lord]} - ${jd2date(md.st).getUTCFullYear()}-${jd2date(md.en).getUTCFullYear()} (age ${a0}-${a1})</td><td>${active?'<b>NOW: </b>':''}${dashaTheme(md.lord)}</td></tr>`;});
  add('chrono',secHead('chrono','Life Chronology - the Road Ahead')+
    `<p class="para">Reading the Vimśottari daśā against age gives the life's chapters (approximate).</p>
    <div class="tbl-wrap"><table><thead><tr><th>Period (age)</th><th>What the chart indicates</th></tr></thead><tbody>${chrono}</tbody></table></div>`);

  /* ---------- 19 BHAVA CHALIT ---------- */
  const chalitPlace=chalit.placements.map(p=>({glyph:PG[p.i],house:p.bhava,sign:p.sign,cls:p.i>=7?'':''}))
    .concat([{glyph:'La',house:1,sign:chalit.ascSign,cls:'pl-asc'}]);
  const shifts=chalit.placements.filter(p=>p.bhava!==p.signHouse&&p.i<7).map(p=>`${PL[p.i]} ${p.signHouse}→${p.bhava}`);
  add('chalit',secHead('chalit','Bhava Chalit Chart (cusp-based)')+
    `<div class="chart-row">
      <div class="panel chart-card"><h3>Bhava Chalit · North</h3>${northChart(chalit.ascSign,chalitPlace)}</div>
      <div class="panel col-note"><p>The Rāśi (D-1) places planets by <b>sign</b>; the Bhava Chalit places them by the actual house <b>cusps</b> (Sripati, Midheaven at ${SG[signOf(chalit.mc)]} ${J.dm(chalit.mc%30)}). Planets near a sign's edge can shift one house by cusp.</p>
      ${shifts.length?`<p><b>Shifts vs Rāśi:</b> ${shifts.join(' · ')}. This refines the reading of those planets' house results.</p>`:'<p>No planet shifts house by cusp - the sign-based houses hold.</p>'}</div>
    </div>`);

  /* ---------- 20 DEPTH ---------- */
  add('depth',secHead('depth','Longevity · Spouse · Children - in depth')+
    `<div class="prose">${depthReadings(chart,ck,jm,P,asc,vim,pro).map(r=>`<div class="read"><div class="tag">${r[0]}</div><p>${r[1]}</p>${whyBlock(r[2])}</div>`).join('')}</div>
    <p class="disc-inline">Longevity readings are the least certain in jyotiṣa and are offered for reflection only - never as a manner-of-death claim or medical advice.</p>`);

  /* ---------- 21 DIVISIONAL CHARTS ---------- */
  const VARGAS=[[9,'Navāṁśa · D-9 marriage/dharma'],[10,'Daśāṁśa · D-10 career'],[7,'Saptāṁśa · D-7 children'],[60,'Ṣaṣṭyāṁśa · D-60 karma'],[2,'Horā · D-2 wealth'],[3,'Drekkāṇa · D-3 siblings'],[4,'Chaturthāṁśa · D-4 property'],[12,'Dvādaśāṁśa · D-12 parents'],[16,'Ṣoḍaśāṁśa · D-16 vehicles'],[20,'Viṁśāṁśa · D-20 spiritual'],[24,'Siddhāṁśa · D-24 learning'],[27,'Bhāṁśa · D-27 strength'],[30,'Triṁśāṁśa · D-30 troubles'],[40,'Khavedāṁśa · D-40'],[45,'Akṣavedāṁśa · D-45']];
  let vcards='';VARGAS.forEach(([D,label])=>{const v=J.buildVarga(chart,D);vcards+=`<div class="panel varga-card"><h4>${label}</h4>${southChart(v.ascSign,vargaPlacements(v))}</div>`;});
  add('vargas',secHead('vargas','Divisional Charts (Vargas)','Parāśari · South Indian')+`<div class="varga-hint">← swipe to browse the divisional charts →</div><div class="varga-grid">${vcards}</div>`);

  /* ---------- 22 DASHA ROADMAP ---------- */
  /* Three levels deep: mahā → antar → pratyantar. The 81 antardaśās would carry
     729 pratyantardaśās between them, so those rows are built on first expand
     rather than all at once - only the running one is opened up front. */
  const pdRows=ad=>J.pratyantardashas(ad).map(p=>{const pa=nowJD()>=p.st&&nowJD()<p.en;
    return `<div class="pd-row${pa?' active':''}"><span class="lord">${PL[p.lord]}</span>${pa?'<span class="now">NOW</span>':''}<span class="span mono">${jdFmt(p.st)} - ${jdFmt(p.en)}</span></div>`;}).join('');
  let mdHtml='';vim.list.forEach((md,mi)=>{const active=nowJD()>=md.st&&nowJD()<md.en;let adHtml='';
    md.ad.forEach((a,ai)=>{const aa=nowJD()>=a.st&&nowJD()<a.en;
      adHtml+=`<div class="ad-row${aa?' active':''}" data-ad="${mi}-${ai}" role="button" tabindex="0" aria-expanded="${aa?'true':'false'}" title="Show pratyantardaśās"><span class="lord">${PL[a.lord]}</span>${aa?'<span class="now">NOW</span>':''}<span class="span mono">${jdFmt(a.st)} - ${jdFmt(a.en)}</span></div>`
        +`<div class="pd-wrap${aa?' show':''}" data-pdw="${mi}-${ai}">${aa?pdRows(a):''}</div>`;});
    mdHtml+=`<div class="md-row${active?' active':''}" data-md="${mi}" role="button" tabindex="0" aria-expanded="${active?'true':'false'}"><span class="lord">${PL[md.lord]}</span>${active?'<span class="now">NOW</span>':''}<span class="span mono">${jdFmt(md.st)} - ${jdFmt(md.en)}</span></div><div class="ad-wrap${active?' show':''}" data-adw="${mi}">${adHtml}</div>`;});
  let yogHtml='';yog2Yogini(chart).forEach(y=>{const active=nowJD()>=y.st&&nowJD()<y.en;
    yogHtml+=`<div class="md-row${active?' active':''}"><span class="lord" style="width:auto">${y.name}</span><span class="muted" style="font-size:12px">(${PL[y.ruler]})</span>${active?'<span class="now">NOW</span>':''}<span class="span mono">${jdFmt(y.st)} - ${jdFmt(y.en)}</span></div>`;});
  const s22=add('dasha',secHead('dasha','Daśā Roadmap & Timing',`Vimśottari balance: ${PL[vim.startLord]} ${vim.balanceYrs.toFixed(2)} yrs`)+
    (curPD?`<div class="panel oneline" style="margin:0 0 16px"><b>Running now:</b> ${PL[curMD.lord]} mahādaśā → ${PL[curAD.lord]} antardaśā → <b>${PL[curPD.lord]} pratyantardaśā</b> (${jdFmt(curPD.st)} - ${jdFmt(curPD.en)}). The pratyantardaśā is the level classical practice reads for a specific question or a particular month, rather than the broad life-phase the mahādaśā describes.</div>`:'')+
    `<div class="dasha-cols"><div><div class="eyebrow" style="margin-bottom:8px">Vimśottari Mahādaśā · Antardaśā · Pratyantardaśā</div><div class="dasha-list" id="vimList">${mdHtml}</div><p class="hint" style="margin-top:8px">Tap a mahādaśā to expand its antardaśās, then any antardaśā for its pratyantardaśās.</p></div><div><div class="eyebrow" style="margin-bottom:8px">Yoginī Daśā (36-year cycle)</div><div class="dasha-list">${yogHtml}</div></div></div>`);
  const toggle=(el,wrap)=>{if(!wrap)return;const on=wrap.classList.toggle('show');el.setAttribute('aria-expanded',on?'true':'false');};
  s22.querySelectorAll('.md-row[data-md]').forEach(row=>{
    const act=()=>toggle(row,s22.querySelector(`[data-adw="${row.dataset.md}"]`));
    row.addEventListener('click',act);
    row.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();act();}});});
  s22.querySelectorAll('.ad-row[data-ad]').forEach(row=>{
    const act=()=>{
      const w=s22.querySelector(`[data-pdw="${row.dataset.ad}"]`);
      if(w&&!w.innerHTML){const[mi,ai]=row.dataset.ad.split('-').map(Number);w.innerHTML=pdRows(vim.list[mi].ad[ai]);}
      toggle(row,w);};
    row.addEventListener('click',e=>{e.stopPropagation();act();});
    row.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();e.stopPropagation();act();}});});

  /* ---------- 23 SADE-SATI & TRANSITS ---------- */
  const satSign=ss.satSign,jupNow=signOf(J.transitLon(4,nowJD())),rahNow=signOf(J.transitLon(7,nowJD()));
  let winTxt=ss.windows.filter(w=>w[1]>nowJD()-YEAR).slice(0,3).map(w=>`${jd2date(w[0]).getUTCFullYear()}-${jd2date(w[1]).getUTCFullYear()}`).join(', ');
  add('sadesati',secHead('sadesati','Sade-Sati & Current Transits (Gochara)')+
    `<ul class="clean">
      <li><b>Sade-Sati status: ${ss.status}.</b> Transiting Saturn is in ${SG[satSign]} - the ${ord(ss.from)} from the natal Moon (${SG[moon.sign]}). ${ss.status==='ACTIVE'?ss.phase+' phase - a testing, maturing period for mind, career and health.':'The main Saturn pressure is not on the Moon right now.'}</li>
      <li>Sade-Sati windows (Saturn over 12th/1st/2nd from Moon): <b>${winTxt||'-'}</b>.</li>
      <li>Jupiter transits ${SG[jupNow]} - the ${ord(houseFrom(asc,jupNow))} from Lagna / ${ord(houseFrom(moon.sign,jupNow))} from Moon: ${[2,5,7,9,11].includes(houseFrom(moon.sign,jupNow))||houseFrom(asc,jupNow)===1?'a favourable, opportunity-bearing transit.':'a quieter Jupiter transit.'}</li>
      <li>Rahu transits ${SG[rahNow]} - the ${ord(houseFrom(moon.sign,rahNow))} from the Moon; Ketu opposite.</li>
    </ul>`);

  /* ---------- 24 REMEDIES ---------- */
  add('remedies',secHead('remedies','Traditional Remedies (Upāya) & Spiritual Guidance')+
    `<p class="para">Offered per classical custom - supportive practices, not guarantees. Use what resonates; confirm gemstones with a qualified jyotiṣi.</p>
    <ul class="clean">
      <li>Strengthen the Lagna lord ${PL[lagnaLord]}: ${PATTR[lagnaLord].dev} worship on ${PATTR[lagnaLord].day}; colour ${PATTR[lagnaLord].col}.</li>
      <li>Honour the 9th lord ${PL[ninthLord]} (fortune): ${PATTR[ninthLord].dev}; ${PATTR[ninthLord].day} observances.</li>
      ${P[2].combust||dsh.find(d=>d.name.includes('Manglik')).status.startsWith('PRESENT')?'<li>For Mars: Hanuman Chalisa on Tuesdays/Saturdays, physical discipline, avoid impulsive conflict.</li>':''}
      ${ss.status==='ACTIVE'?'<li>Through the active Sade-Sati: Saturday service to elders/workers, donate sesame/iron/mustard-oil, light a lamp to Shani/Hanuman, keep routine and avoid big risky moves.</li>':''}
      <li>Iṣṭa Devatā for inner growth: <b>${J.ISHTA_DEV[SL[jm.ishta12]]}</b> (from the 12th-from-Karakamsa).</li>
    </ul>
    <div class="tbl-wrap" style="margin-top:12px"><table><thead><tr><th>Quick reference</th><th>Favourable</th><th>Use with care</th></tr></thead><tbody>
      <tr><td>Deity / mantra</td><td>${[...new Set([lagnaLord,ninthLord].map(p=>PATTR[p].dev))].join('; ')}</td><td>-</td></tr>
      <tr><td>Gemstones</td><td>${luckyGem.join(', ')}</td><td>Blue Sapphire - test first</td></tr>
      <tr><td>Metal</td><td>${[...new Set([lagnaLord,ninthLord].map(p=>PATTR[p].metal))].join(', ')}</td><td>-</td></tr>
    </tbody></table></div>`);

  /* ---------- 25 GOCHARA YEAR-BY-YEAR ---------- */
  const goc=J.gochara(chart,Math.max(input.y+ (nowJD()>chart.jd?Math.floor((nowJD()-chart.jd)/YEAR):0), input.y), Math.min(input.y+98,2100));
  let gRows='';goc.forEach(r=>{const cls=r.ss?'row-ss':r.note.includes('Kantaka')||r.note.includes('Ashtama')?'row-kant':r.fav?'row-fav':'';
    gRows+=`<tr class="${cls}"><td class="num">${r.year}</td><td class="num">${r.age}</td><td>${r.dasha}</td><td>${SS[r.sat.sign]}(${r.sat.h})</td><td>${SS[r.jup.sign]}(${r.jup.h})</td><td>${SS[r.rahu.sign]}(${r.rahu.h})</td><td>${r.note}</td></tr>`;});
  add('gochara',secHead('gochara',`Year-by-Year Transit (Gochara) Forecast`,`to ${goc.length?goc[goc.length-1].year:''}`)+
    `<p class="para">Each year read on the birthday: the slow planets against the natal Moon (${SG[moon.sign]}) and Lagna, with the running daśā. Sign and (house-from-Moon) shown. <span class="row-ss legend-chip">Sade-Sati</span> <span class="row-kant legend-chip">Kantaka/Ashtama</span> <span class="row-fav legend-chip">Jupiter favourable</span></p>
    <div class="tbl-wrap gochara-wrap"><table class="gochara"><thead><tr><th>Yr</th><th>Age</th><th>Daśā</th><th>Saturn</th><th>Jupiter</th><th>Rahu</th><th>Key note</th></tr></thead><tbody>${gRows}</tbody></table></div>`);

  /* ---------- 26 NEAR-TERM ---------- */
  const nt=J.nearTerm(chart,5);
  let ntRows='';nt.forEach(e=>{ntRows+=`<tr class="${e.dasha?'row-dasha':e.fav?'row-fav':''}"><td class="num">${jdFmt(e.jd)}</td><td>${e.txt}${e.fav?' <b>[favourable]</b>':''}</td></tr>`;});
  add('nearterm',secHead('nearterm','Focused Near-Term Forecast (5 years)')+
    `<p class="para">Month-level timeline - Saturn/Jupiter/Rahu sign-ingresses interwoven with the Vimśottari sub-periods.</p>
    <div class="tbl-wrap gochara-wrap"><table class="gochara"><thead><tr><th>Date</th><th>Event</th></tr></thead><tbody>${ntRows||'<tr><td colspan="2" class="muted">No ingresses in the window.</td></tr>'}</tbody></table></div>`);

  /* ---------- 27 VERIFICATION ---------- */
  add('verify',secHead('verify','Accuracy & Verification')+
    `<div class="prose"><div class="read"><div class="tag">Method</div><p>All positions, nakṣatras, divisional signs, Ashtakavarga bindus, daśā dates and transit ingresses are computed on your device from the astronomy-engine ephemeris (Swiss-Ephemeris-grade) with the Lahiri (Chitrapaksha) ayanāṁśa. No internet, no artificial intelligence.</p></div>
    <div class="read"><div class="tag">Ayanāṁśa check</div><p>The Lahiri ayanāṁśa at birth computes to ${J.ayanamsa(chart.jd).toFixed(4)}° - the model reproduces the Swiss Ephemeris to under 0.001 arc-second across 1900-2100.</p></div>
    <div class="read"><div class="tag">Cross-validation</div><p>This engine was validated arc-minute against pyswisseph on independent reference charts - every planet's sign, degree, nakṣatra, pada and house matched, and the Sarvashtakavarga totalled the classical 337.</p></div>
    <div class="read"><div class="tag">Nothing is invented</div><p>No language model writes any part of this report. Every verdict is the output of a fixed classical test applied to your computed chart - the same birth details always produce the identical text, word for word. Where a rule is popular in modern practice but absent from the classical corpus - Kāla-Sarpa, for instance - it says so.</p></div>
    <div class="read"><div class="tag">The AI in Jāthaka AI</div><p><b>AI stands for Almighty Īśvara</b>, not artificial intelligence. What is calculated here is real: your grahas are placed from a Swiss-Ephemeris-grade ephemeris, your Lagna from the true sidereal time at your birth coordinates, and your daśā dates from the Moon's exact nakṣatra position. The reading is drawn from those real positions by the rules of the śāstra - by the power of Almighty Īśvara, and not by a machine that writes astrology.</p></div>
    <div class="read"><div class="tag">Five parts to every reading</div><p>Each reading here carries the same five things, so you can weigh it rather than take it on trust: <b>(1)</b> the classical rule it rests on and the text it comes from, <b>(2)</b> the grahas, bhāvas and nakṣatras in <i>your</i> chart that triggered it, <b>(3)</b> how strongly it reads - strong, moderate or weak, graded from planetary dignity, house placement and the quality of the yoga - <b>(4)</b> the daśā or transit window in which it is most likely to activate, and <b>(5)</b> a plain-language explanation, which is the reading itself. Parts one to four open under <b>"why this reading?"</b>; part five is the paragraph it hangs beneath. Strength and timing are computed from the same chart as everything else, and where a rule carries no timing - the kootas of a marriage match, for instance - it says so rather than inventing one.</p></div></div>`);

  /* ---------- 28 GLOSSARY ---------- */
  const GLOSS=[['Lagna','The rising sign/degree; the 1st house and basis of the chart.'],['Rāśi','A zodiac sign; also the Moon-sign (Janma Rāśi).'],['Nakṣatra / Pada','One of 27 lunar mansions and its quarter; the Moon\'s nakṣatra sets the daśā.'],['Bhava','An astrological house (1-12).'],['Graha','A planet (the nine: Sun…Saturn, Rahu, Ketu).'],['Exalted / Debilitated','A planet\'s sign of greatest strength / weakness.'],['Vargottama','Same sign in D-1 and D-9 - a mark of strength.'],['Combust (Asta)','A planet too close to the Sun, losing brightness.'],['Yoga','A planetary combination producing a defined result.'],['Dosha','An affliction (Manglik, Kāla-Sarpa…).'],['Vimśottari Daśā','The 120-year period timeline: Mahā → Antar → Pratyantar.'],['Ashtakavarga','A bindu (point) system scoring sign/house strength; total 337.'],['Shadbala','The six-fold mathematical strength of a planet, in rūpas.'],['Varga','A divisional/harmonic sub-chart for a life area.'],['Bhava Chalit','A chart placing planets by exact house cusps.'],['Ātmakāraka','The Jaimini soul-significator (highest-degree planet).'],['Arudha Lagna','The chart\'s "image" - how the world perceives the person.'],['Upagraha','A sensitive sub-point (e.g. Gulika/Mandi).'],['Sade-Sati','Saturn\'s ~7.5-year transit over the 12th/1st/2nd from the Moon.'],['Ayanāṁśa','The precession correction from tropical to sidereal; Lahiri is the Indian standard.']];
  add('glossary',secHead('glossary','Glossary of Terms')+
    `<div class="tbl-wrap"><table><tbody>${GLOSS.map(g=>`<tr><td style="white-space:nowrap"><b>${g[0]}</b></td><td class="muted">${g[1]}</td></tr>`).join('')}</table></div>`);

  /* plain-English glosses under each section head (shown when the toggle is on) */
  $$('#report section.rpt').forEach(s=>{const g=LAYMAN[s.id.replace('sec-','')];
    if(g){const sh=s.querySelector('.sec-head');if(sh)sh.insertAdjacentHTML('afterend',`<div class="layman-note">${g}</div>`);}});

  /* footer */
  const foot=el('div');foot.innerHTML=`<div class="footer-actions"><button class="btn btn-primary" id="pdfBtn" type="button"><svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3.5v11.5"/><path d="m7.5 10.5 4.5 4.5 4.5-4.5"/><path d="M4.5 19.5h15"/></svg><span class="lbl">Download PDF</span></button><button class="btn btn-ghost" id="shareBtn" type="button"><svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><rect x="9.5" y="9.5" width="10.5" height="10.5" rx="2.5"/><path d="M6.5 14.5h-1a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h7a2 2 0 0 1 2 2v1"/></svg><span class="lbl">Copy shareable link</span></button><button class="btn btn-ghost" id="editBtn" type="button">Edit birth details</button></div><p class="hint screen-only" style="text-align:center;margin:-8px 0 0">In the print dialog choose <b>Save as PDF</b>, and keep <b>Background graphics</b> on to preserve the full colour design. The shareable link encodes the birth details in the URL (not encrypted).</p><div class="disc">Computed entirely on your device with astronomy-engine (Swiss-Ephemeris-grade) and a Lahiri sidereal model validated to the arc-minute. No internet, no artificial intelligence. Vedic astrology is a traditional interpretive system offered for reflection and cultural interest - not prediction, and not medical, legal or financial advice.</div>`;
  R.appendChild(foot);
  $('#pdfBtn').addEventListener('click',()=>window.print());
  $('#shareBtn').addEventListener('click',()=>{const url=shareUrl(lastInput||input);const b=$('#shareBtn');
    const ok=()=>{const l=b.querySelector('.lbl');if(!l)return;const t=l.textContent;
      l.textContent='Link copied';setTimeout(()=>{l.textContent=t;},1600);};
    if(navigator.clipboard&&navigator.clipboard.writeText)navigator.clipboard.writeText(url).then(ok,()=>prompt('Copy this link:',url));
    else prompt('Copy this link:',url);});
  $('#editBtn').addEventListener('click',()=>smoothTo($('#formCard')));
}

/* jump nav handlers (fixed scrolling) */
$('#jumpInner').addEventListener('click',e=>{const a=e.target.closest('a');if(!a)return;e.preventDefault();
  const t=document.getElementById('sec-'+a.dataset.sec);smoothTo(t);});

/* ---- nav rail affordances ----------------------------------------------
   The scrollbar is hidden in CSS; these keep the end-fades, the arrows and the
   "n / total" counter honest, so it is obvious there is more nav off-screen. */
function railUpdate(){
  const rail=$('#jumpRail'),inner=$('#jumpInner');if(!rail||!inner)return;
  const max=inner.scrollWidth-inner.clientWidth,x=inner.scrollLeft;
  rail.classList.toggle('scrollable',max>4);
  inner.classList.toggle('at-start',x<=1);
  inner.classList.toggle('at-end',x>=max-1);
  const prev=$('#jumpPrev'),next=$('#jumpNext');
  if(prev)prev.disabled=x<=1;
  if(next)next.disabled=x>=max-1;
}
function railScroll(dir){const inner=$('#jumpInner');if(!inner)return;
  inner.scrollBy({left:dir*Math.max(180,inner.clientWidth*.7),
    behavior:prefersReduce()?'auto':'smooth'});}
$('#jumpPrev').addEventListener('click',()=>railScroll(-1));
$('#jumpNext').addEventListener('click',()=>railScroll(1));
let railTimer=null;
$('#jumpInner').addEventListener('scroll',()=>{if(railTimer)return;
  railTimer=setTimeout(()=>{railTimer=null;railUpdate();},60);},{passive:true});
window.addEventListener('resize',railUpdate);
/* scroll-spy: attached ONCE at load; queries the nav live so it never leaks or goes stale */
let spyTimer=null;
window.addEventListener('scroll',()=>{if(spyTimer)return;spyTimer=setTimeout(()=>{spyTimer=null;
  const nav=$('#jumpNav');if(!nav||!nav.classList.contains('show'))return;
  const navH=nav.offsetHeight+20;let cur=null,curIdx=-1;
  SECTIONS.forEach((s,i)=>{const el=document.getElementById('sec-'+s[0]);
    if(el&&el.getBoundingClientRect().top<=navH){cur=s[0];curIdx=i;}});
  const inner=$('#jumpInner');if(!inner)return;
  inner.querySelectorAll('a').forEach(a=>a.classList.remove('active-link'));
  if(cur){const a=inner.querySelector('a[data-sec="'+cur+'"]');
    if(a){a.classList.add('active-link');
      const target=a.offsetLeft-inner.clientWidth/2+a.offsetWidth/2;
      if(Math.abs(inner.scrollLeft-target)>4)inner.scrollLeft=Math.max(0,target);}}
  const cnt=$('#jumpCount');
  if(cnt)cnt.textContent=(curIdx>=0?curIdx+1:1)+' / '+SECTIONS.length;
  railUpdate();
},80);},{passive:true});

/* ======================= prose generators ======================= */
function lifeLine(chart,input,vim,curMD,ss,yog,pro){
  const asc=chart.ascSign,moon=chart.planets[1];
  const ex=chart.planets.filter(p=>p.dig&&p.dig.cls==='exalt').map(p=>PL[p.i]);
  return `${SA[asc]}-rising with ${moon.nak.name} Moon${ex.length?', carrying '+(ex.length>1?ex.length+' exalted planets ('+ex.join(' & ')+')':'exalted '+ex[0]):''}; ${curMD?'now in a '+PL[curMD.lord]+' mahādaśā':'in transition'}${ss.status==='ACTIVE'?' with an active Sade-Sati that tests and matures':''}${yog.some(y=>y[0].includes('Gajakesari'))?', blessed by Gajakesari':''}.`;
}
function conditionNote(p,asc,fn){
  if(p.dig&&p.dig.cls==='exalt')return 'Exalted - a crown jewel of the chart.';
  if(p.dig&&p.dig.cls==='debil')return 'Debilitated - a soul-lesson maturing with effort.';
  if(p.dig&&p.dig.cls==='own')return 'In own sign - comfortable and effective.';
  if(p.combust)return 'Combust - strong inwardly, its outer expression burnt.';
  if([1,4,7,10].includes(p.house))return 'Angular (kendra) - placed to act in the world.';
  if([5,9].includes(p.house))return 'Trikonal - a house of fortune and merit.';
  if([6,8,12].includes(p.house))return 'In a dusthāna - works through challenge and depth.';
  return 'Neutral placement.';
}
function aspectNote(a,P,asc){const houses=a.aspects;
  if(a.i===4)return `Jupiter's grace reaches the ${houses.map(ord).join(', ')} - wisdom and protection.`;
  if(a.i===6)return `Saturn disciplines the ${houses.map(ord).join(', ')} - tests that build endurance.`;
  if(a.i===2)return `Mars energises the ${houses.map(ord).join(', ')} - drive and initiative.`;
  return `Casts its ${houses.map(ord).join(', ')} aspect.`;
}
/* ======================= MARRIAGE COMPATIBILITY (Guṇa Milan) =======================
   Renders J.compatibility(). The order is deliberate and matches classical practice:
   the score is shown, but the dosha gates come before any of the deeper layers,
   because a total that has not been checked against the Nadi and Bhakoot exception
   rules is the commonest way machine-generated matching misleads people. */
function renderMatchReport(gChart,gInput,bChart,bInput){
  SECTIONS=MATCH_SECTIONS;
  const R=$('#report');R.innerHTML='';
  const m=J.compatibility(gChart,bChart);
  const jump=$('#jumpInner');jump.innerHTML=SECTIONS.map(s=>`<a href="#sec-${s[0]}" data-sec="${s[0]}">${s[1]}</a>`).join('');
  const jc=$('#jumpCount');if(jc)jc.textContent='1 / '+SECTIONS.length;
  requestAnimationFrame(railUpdate);
  const add=(id,html)=>{const s=el('section','rpt',html);s.id='sec-'+id;R.appendChild(s);return s;};

  const bar=(v,max)=>{const f=max?v/max:0;
    const col=f>=0.8?'var(--good)':f>=0.5?'var(--brass)':f>0?'var(--warn)':'var(--crit)';
    return {w:Math.max(f*100,v>0?4:2),col};};
  const tag=s=>`<span class="strength-tag ${s}">${s}</span>`;
  const list=(arr,empty)=>arr.length?`<ul class="clean">${arr.map(x=>`<li>${x}</li>`).join('')}</ul>`:`<p class="muted">${empty}</p>`;
  const born=i=>`${String(i.d).padStart(2,'0')} ${MON[i.mo-1]} ${i.y}, ${String(i.hh).padStart(2,'0')}:${String(i.mi).padStart(2,'0')}`;

  /* the sticky phone bar carries the headline number instead of the lagna/dasha */
  const mb=$('#mobileBar');
  if(mb){mb.innerHTML=`<span>Guṇa <b>${m.total}/36</b></span><span>Nāḍī <b>${m.gates[0].present?(m.gates[0].cancelled?'cancelled':'dosha'):'clear'}</b></span><span>Bhakūṭa <b>${m.gates[1].present?(m.gates[1].cancelled?'cancelled':'dosha'):'clear'}</b></span>`;
    mb.classList.add('show');}

  const who=(inp,mi,role)=>`<div class="who"><b>${esc(inp.name)}</b>
    <span class="who-role">${role}</span>
    ${born(inp)} · ${esc(inp.place)}<br>
    Moon in ${mi.signName} · ${mi.nakName} pada ${mi.pada} · ${mi.lordName}-ruled</div>`;
  const pair=`<div class="match-pair">${who(gInput,m.g,'Groom')}${who(bInput,m.b,'Bride')}</div>`;
  const standing=m.gates.filter(g=>g.present&&!g.cancelled);

  /* ---------- 01 MATCH AT A GLANCE ---------- */
  add('mglance',secHead('mglance','Marriage Compatibility - at a Glance',`${m.total} / 36`)+
    `<p class="para">Both nativities are cast in full - Rāśi (D-1) and Navāṁśa (D-9) - before any matching
      begins. The traditional 36-point score is below, but it is read <b>after</b> the two heavy doshas have
      been checked against their classical exception rules, not before. A total on its own is a guideline,
      never a pass or a fail.</p>
    ${pair}
    <div class="panel match-head">
      <div class="match-total">${m.total}<small> / 36</small></div>
      <div class="match-verdict"><b>${esc(m.verdict)}</b><br>
        Traditionally 18 and above is read as workable and 28 and above as strong. ${standing.length
          ?`<b>${standing.map(g=>g.name).join(' and ')}</b> ${standing.length>1?'are':'is'} standing uncancelled - which matters more than this number, and is set out in full two sections below.`
          :'Neither Nāḍī nor Bhakūṭa dosha is standing uncancelled.'}</div>
    </div>
    <div class="sc-cols" style="margin-top:16px">
      <div class="panel sc-card good"><div class="sc-head">Specific strengths</div>
        ${list(m.strengths.slice(0,8),'No koota or layer reaches the strong band.')}</div>
      <div class="panel sc-card bad"><div class="sc-head">Specific friction points</div>
        ${list(m.frictions.slice(0,8),'No koota or layer falls into the weak band.')}</div>
    </div>
    <p class="disc-inline">Guṇa Milan is a traditional interpretive system. The astronomy behind both charts is
      exact and the tables are the classical ones, but compatibility between two people is not decided by a
      36-point score - this report is offered for reflection, not as a verdict on a marriage.</p>`);

  /* ---------- 02 ASHTAKOOTA ---------- */
  const kootas=m.kootas.map(k=>{const b=bar(k.pts,k.max);
    return `<div class="koota">
      <div class="kn">${k.sans}<small>max ${k.max}</small></div>
      <div class="ktrack"><div class="kfill" style="width:${b.w}%;background:${b.col}"></div></div>
      <div class="kpts">${k.pts} / ${k.max}</div>
      <div class="kbody">${k.detail} ${k.plain}${whyBlock(k.why)}</div>
    </div>`;}).join('');
  add('mkoota',secHead('mkoota','Ashtakoota - the 36-Point Guṇa Milan',`${m.total} / 36`)+
    `<p class="para">Eight kootas, each comparing one quality of the two Moons. They are not weighted equally -
      Nāḍī alone carries eight points and Bhakūṭa seven, so nearly half the total rides on two tests. The bars
      below are drawn to each koota's own maximum, and every one opens to show the classical rule and the values
      from these two charts that satisfied it.</p>
    <div class="panel bar-wrap">
      <div class="bar-title">Guṇa Milan - the eight kootas, by weight</div>
      ${kootas}
    </div>
    <p class="hint">Points are awarded by the classical tables (Bṛhat Parāśara Horā Śāstra and the melāpaka
      tradition). Where a table differs between schools, the widely-published symmetric form is used and is
      named in the rule shown under each koota.</p>`);

  /* ---------- 03 DOSHA GATES ---------- */
  const gates=m.gates.map(g=>{
    const cls=!g.present?'clear':g.cancelled?'cancelled':'standing';
    return `<div class="gate ${cls}"><div class="gh">${g.name}</div>
      <div class="gv">${esc(g.verdict)}</div><p>${g.guidance}</p>
      ${g.exceptions.length?`<p style="margin-top:7px"><b>Cancellation conditions met:</b> ${g.exceptions.join('; ')}.</p>`:''}
      ${whyBlock(g.why)}</div>`;}).join('');
  add('mgates',secHead('mgates','The Dosha Gates - Nāḍī & Bhakūṭa',standing.length?`${standing.length} standing`:'clear')+
    `<p class="para">These two carry fifteen of the thirty-six points between them, and both have explicit
      cancellation rules in the classical texts. Quoting a score without running those rules is the commonest
      way automated matching misleads people, so they are run here and shown either way - including when the
      dosha is absent, so you can see the check was made.</p>
    ${gates}
    ${standing.length?`<p class="disc-inline">A standing dosha is a reason to consult an experienced astrologer
      with both charts in hand. It is not a verdict, and it is not something software should decide.</p>`
      :`<p class="disc-inline">Both gates are clear or cancelled, so the koota total above can be read at face
      value - alongside the chart-level layers that follow, which the kootas do not cover at all.</p>`}`);

  /* ---------- 04 BEYOND THE KOOTAS ---------- */
  const layers=m.layers.map(l=>`<div class="read"><div class="tag">${l.name} ${tag(l.strength)}</div>
    <p>${l.detail}</p><p style="margin-top:7px">${l.plain}</p>
    <p class="muted" style="margin-top:7px;font-size:12.5px"><b>Daśā window:</b> ${l.dasha}</p>
    ${whyBlock(l.why)}</div>`).join('');
  add('mlayers',secHead('mlayers','Beyond the Kootas - Chart-Level Layers')+
    `<p class="para">Ashtakoota compares two Moons and nothing else - it never looks at either Lagna, at the 7th
      house, or at the Navāṁśa. These five layers read the whole of both charts against each other, and
      classical practice weighs them at least as heavily as the score. The Navāṁśa layer in particular outranks
      the koota total on any marital question, because D-9 is the varga that governs marriage.</p>
    <div class="prose">${layers}</div>`);

  /* ---------- 05 AREA BY AREA ---------- */
  const areas=m.areas.map(a=>{const b=bar(a.score,100);
    return `<div class="area"><div class="ah"><b>${a.name}</b><span class="as" style="color:${b.col}">${a.score}%</span></div>
      <div class="atrack"><div class="afill" style="width:${b.w}%;background:${b.col}"></div></div>
      <p>${a.plain}</p><div class="af">${esc(a.factors)}</div>
      <p class="muted" style="margin-top:7px;font-size:12px"><b>Daśā:</b> ${a.dasha}</p>
      ${whyBlock(a.why)}</div>`;}).join('');
  const weakest=m.areas.slice().sort((x,y)=>x.score-y.score)[0];
  const best=m.areas.slice().sort((x,y)=>y.score-x.score)[0];
  add('mareas',secHead('mareas','Compatibility Area by Area')+
    `<p class="para">One number for a whole marriage is not much use. Each area below is scored from the kootas
      and the chart factors that classically govern it, and carries the same rule → chart → strength → daśā →
      plain-language trail as every other reading here. On this pairing the strongest area is
      <b>${best.name.toLowerCase()}</b> (${best.score}%) and the weakest <b>${weakest.name.toLowerCase()}</b>
      (${weakest.score}%).</p>
    <div class="area-grid">${areas}</div>`);

  /* ---------- 06 BOTH CHARTS, D-1 AND D-9 ---------- */
  const chartPair=(chart,inp,role)=>{
    const d9=J.buildVarga(chart,9);
    const P=chart.planets;
    const rows=P.map(p=>`<tr><td class="glyph">${PSA[p.i]} <span class="muted">${p.name}</span></td>
      <td>${SA[p.sign]}</td><td class="num">${J.dms(p.lon%30)}</td><td class="num">${p.house}</td>
      <td>${p.nak.name}-${p.nak.pada}</td>
      <td>${p.dig?`<span class="pill ${p.dig.cls}">${p.dig.label}</span>`:'<span class="muted">-</span>'}</td></tr>`).join('');
    return `<h3 class="sub-h">${esc(inp.name)} <span class="muted">· ${role} · ${born(inp)} · ${esc(inp.place)}</span></h3>
      <div class="chart-row">
        <div class="panel chart-card"><h3>Rāśi · D-1</h3>${northChart(chart.ascSign,d1Placements(chart))}</div>
        <div class="panel chart-card"><h3>Navāṁśa · D-9 <span class="muted">(the marriage varga)</span></h3>${southChart(d9.ascSign,vargaPlacements(d9))}</div>
      </div>
      <div class="tbl-wrap" style="margin-top:14px"><table><thead><tr><th>Graha</th><th>Rāśi</th><th>Degree</th><th>H</th><th>Nakṣatra-pada</th><th>Dignity</th></tr></thead><tbody>${rows}</tbody></table></div>`;
  };
  add('mcharts',secHead('mcharts','Both Charts - Rāśi (D-1) & Navāṁśa (D-9)')+
    `<p class="para">Matching is done on computed charts, not on a nakṣatra lookup, so both are shown in full.
      The Navāṁśa is included beside each Rāśi because the tradition treats D-9 as the chart that actually
      governs marriage - a promise strong in D-1 but broken in D-9 is read as a promise that does not hold.
      Positions are sidereal, Lahiri ayanāṁśa, whole-sign houses.</p>
    ${chartPair(gChart,gInput,'Groom')}
    ${chartPair(bChart,bInput,'Bride')}`);

  /* ---------- 07 DASHA & TIMING ---------- */
  const dashaCol=(chart,inp,role,ds)=>{
    const vim=J.vimshottari(chart.planets[1].lon,chart.jd);
    const cur=vim.list.find(x=>nowJD()>=x.st&&nowJD()<x.en);
    const ad=cur&&cur.ad.find(a=>nowJD()>=a.st&&nowJD()<a.en);
    const pd=ad&&J.pratyantardashas(ad).find(p=>nowJD()>=p.st&&nowJD()<p.en);
    const upcoming=vim.list.filter(x=>x.st>nowJD()).slice(0,3);
    return `<div class="panel sc-card"><div class="sc-head">${esc(inp.name)} <span class="muted">· ${role}</span></div>
      <p class="para" style="margin:8px 0 10px">Running: <b>${cur?PL[cur.lord]:'-'}</b> mahādaśā
        ${cur?`(${jdMY(cur.st)} - ${jdMY(cur.en)})`:''}${ad?`, <b>${PL[ad.lord]}</b> antardaśā (${jdMY(ad.st)} - ${jdMY(ad.en)})`:''}${pd?`, <b>${PL[pd.lord]}</b> pratyantardaśā (${jdFmt(pd.st)} - ${jdFmt(pd.en)})`:''}.
        Tone: ${ds.curTesting?'a testing period':'a supportive period'} for domestic stability.</p>
      <div class="tbl-wrap"><table><thead><tr><th>Next mahādaśās</th><th>From</th><th>To</th></tr></thead><tbody>
        ${upcoming.length?upcoming.map(x=>`<tr><td>${PL[x.lord]}</td><td>${jdMY(x.st)}</td><td>${jdMY(x.en)}</td></tr>`).join('')
          :'<tr><td colspan="3" class="muted">The 120-year Vimśottari cycle has run its course for this nativity - no further mahādaśā remains.</td></tr>'}
      </tbody></table></div></div>`;
  };
  const dashaLayer=m.layers.find(l=>l.name==='Daśā compatibility');
  add('mdasha',secHead('mdasha','Daśā & Timing - When, Not Whether')+
    `<p class="para">Classical practice separates two questions: whether to marry, and when. The kootas and
      doshas above speak to the first; the running and upcoming Vimśottari periods of both charts speak to the
      second. Mars, Saturn, Rāhu and Ketu periods bring their own pressure, and a marriage that begins inside
      one is often blamed for difficulties that belong to the daśā rather than to the pairing.</p>
    <div class="sc-cols">${dashaCol(gChart,gInput,'Groom',m.dsG)}${dashaCol(bChart,bInput,'Bride',m.dsB)}</div>
    <div class="read" style="margin-top:16px"><div class="tag">Combined reading ${tag(dashaLayer.strength)}</div>
      <p>${dashaLayer.plain}</p>${whyBlock(dashaLayer.why)}</div>
    <p class="hint">Choosing the marriage muhūrta itself needs a human astrologer working from both charts and
      the transits of the intended month - it is not something computed here.</p>`);

  /* ---------- 08 REMEDIES & NEXT STEPS ---------- */
  add('mremedy',secHead('mremedy','Remedies & What to Take to an Astrologer')+
    `<h3 class="sub-h">Traditional remedies</h3>
    <p class="para">Offered as traditional and cultural practice, in the form the texts and family custom give
      them. They are not medical, legal or financial advice, and none of them is a guarantee.</p>
    <ul class="clean">${m.remedies.map(r=>`<li>${r}</li>`).join('')}</ul>
    ${m.escalate.length?`<div class="escalate"><div class="eh">Take these to a human astrologer before deciding</div>
      <p class="muted" style="margin:0 0 9px;font-size:13px">Ranked by how much classical weight they carry.
        This report is a calculation, not an authority - a marriage decision should not rest on it alone, and
        the items below are the ones an experienced astrologer or elder will want to look at with both charts
        in hand.</p>
      <ol>${m.escalate.map(e=>`<li>${e}</li>`).join('')}</ol></div>`
      :`<div class="escalate"><div class="eh">Nothing flagged for escalation</div>
      <p class="muted" style="margin:0;font-size:13px">No uncancelled dosha, unmatched Manglik or weak Navāṁśa
        indication came up. That is a clean read on the classical checks - it is still worth discussing a
        marriage decision with people who know both families, and a muhūrta is chosen by a human astrologer.</p></div>`}
    <div class="panel col-note" style="margin-top:18px"><p><b>Want the full horoscope of either person?</b>
      Switch to <b>Horoscope</b> mode at the top of the form and cast their chart on its own - that report runs
      to ${BASE_SECTIONS.length} sections, including their own yogas, doshas, daśā roadmap, career, health and
      remedies.</p></div>
    <p class="disc-inline">Nothing in this report is generated by a language model. Every line is the output of
      a fixed classical test applied to the two computed charts, so the same two births always produce the same
      text - and each verdict opens to show the rule it came from.</p>`);

  /* ---------- 09 GLOSSARY ----------
     A match report is the one most likely to be read by people who have never
     opened an astrology text - often a whole family - and it carries the densest
     Sanskrit in the app. So it gets its own glossary rather than borrowing the
     horoscope one, covering the matching vocabulary specifically. */
  const MGLOSS=[
    ['Guṇa Milan','The traditional 36-point compatibility score, made up of the eight kootas below.'],
    ['Koota','One of the eight tests in Guṇa Milan. Each is worth a different number of points.'],
    ['Varṇa','Spiritual outlook and sense of duty. Worth 1 point - the lightest of the eight.'],
    ['Vaśya','The pull and balance of influence between the pair. Worth 2 points.'],
    ['Tārā','Mutual health and general wellbeing, counted between the two birth stars. Worth 3.'],
    ['Yoni','Physical and instinctive compatibility, keyed to an animal symbol per nakṣatra. Worth 4.'],
    ['Graha Maitrī','Mental compatibility, from the friendship of the two Moon-sign rulers. Worth 5 - and it can cancel other doshas.'],
    ['Gaṇa','Temperament class: Deva (gentle), Manuṣya (human), Rākṣasa (forceful). Worth 6.'],
    ['Bhakūṭa','Emotional bonding and household/financial harmony, from the distance between the Moon-signs. Worth 7.'],
    ['Nāḍī','Constitution and the health of children. Worth 8 - the heaviest single koota.'],
    ['Dosha','An affliction or blemish in the match. Most have classical conditions that cancel them.'],
    ['Cancellation (bhaṅga)','A classical rule that sets a dosha aside. A dosha with a cancellation in force is traditionally treated as not operating.'],
    ['Manglik / Kuja dosha','Mars placed in certain houses, traditionally read as straining marriage. It cancels when both partners carry it.'],
    ['Navāṁśa (D-9)','A second chart derived from the first. The tradition uses it, not the birth chart alone, to judge marriage.'],
    ['Rāśi (D-1)','The main birth chart - the sky as it stood at birth.'],
    ['Lagna','The sign rising on the eastern horizon at birth; the starting point of the chart.'],
    ['Nakṣatra / pada','One of 27 lunar mansions and its quarter. The Moon\'s nakṣatra drives most of the matching.'],
    ['Daśā','A planetary period. Vimśottari daśā divides a life into stretches ruled by each graha.'],
    ['Kāraka','A planet that stands for a subject - Venus for love and comfort, Jupiter for growth and commitment.'],
    ['Muhūrta','An auspicious time chosen for an event, such as the wedding itself.']];
  add('mgloss',secHead('mgloss','Glossary - the Matching Vocabulary')+
    `<p class="para">Every Sanskrit term used in this report, in plain English. Nothing here needs prior
      knowledge of astrology to follow.</p>
    <div class="tbl-wrap"><table><tbody>${MGLOSS.map(g=>`<tr><td style="white-space:nowrap"><b>${g[0]}</b></td><td class="muted">${g[1]}</td></tr>`).join('')}</tbody></table></div>`);

  /* plain-English glosses under each section head (shown when the toggle is on) */
  $$('#report section.rpt').forEach(s=>{const g=LAYMAN[s.id.replace('sec-','')];
    if(g){const sh=s.querySelector('.sec-head');if(sh)sh.insertAdjacentHTML('afterend',`<div class="layman-note">${g}</div>`);}});

  /* footer - same actions as the single-chart report, but the share link carries BOTH charts */
  const foot=el('div');foot.innerHTML=`<div class="footer-actions"><button class="btn btn-primary" id="pdfBtn" type="button"><svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3.5v11.5"/><path d="m7.5 10.5 4.5 4.5 4.5-4.5"/><path d="M4.5 19.5h15"/></svg><span class="lbl">Download PDF</span></button><button class="btn btn-ghost" id="shareBtn" type="button"><svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><rect x="9.5" y="9.5" width="10.5" height="10.5" rx="2.5"/><path d="M6.5 14.5h-1a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h7a2 2 0 0 1 2 2v1"/></svg><span class="lbl">Copy shareable link</span></button><button class="btn btn-ghost" id="editBtn" type="button">Edit birth details</button></div><p class="hint screen-only" style="text-align:center;margin:-8px 0 0">In the print dialog choose <b>Save as PDF</b>, and keep <b>Background graphics</b> on to preserve the full colour design. The shareable link encodes <b>both</b> sets of birth details in the URL (not encrypted) - think before sending it on, since it carries someone else's particulars as well as your own.</p><div class="disc">Computed entirely on your device with astronomy-engine (Swiss-Ephemeris-grade) and a Lahiri sidereal model validated to the arc-minute. No internet, no artificial intelligence. Guṇa Milan is a traditional interpretive system offered for reflection and cultural interest - not prediction, and not medical, legal or financial advice.</div>`;
  R.appendChild(foot);
  $('#pdfBtn').addEventListener('click',()=>window.print());
  $('#shareBtn').addEventListener('click',()=>{const url=shareMatchUrl(gInput,bInput);const b=$('#shareBtn');
    const ok=()=>{const l=b.querySelector('.lbl');if(!l)return;const t=l.textContent;
      l.textContent='Link copied';setTimeout(()=>{l.textContent=t;},1600);};
    if(navigator.clipboard&&navigator.clipboard.writeText)navigator.clipboard.writeText(url).then(ok,()=>prompt('Copy this link:',url));
    else prompt('Copy this link:',url);});
  $('#editBtn').addEventListener('click',()=>smoothTo($('#formCard')));
}
function strengthProse(chart,vim,yog,sbala,av,fn){
  const P=chart.planets,out=[];
  const ex=P.filter(p=>p.dig&&p.dig.cls==='exalt');
  if(ex.length)out.push([`${ex.length>1?ex.length+' exalted planets':'Exalted '+PL[ex[0].i]}`,`${ex.map(p=>PL[p.i]+' exalted in the '+ord(p.house)+' ('+SG[p.sign]+')').join('; ')}. Exaltation is a peak of dignity - these are the chart's crown jewels, delivering their significations powerfully.`]);
  const own=P.filter(p=>p.dig&&p.dig.cls==='own'&&p.i<7);
  if(own.length)out.push(['Planets in own sign',`${own.map(p=>PL[p.i]+' in own '+SG[p.sign]+' ('+ord(p.house)+')').join('; ')} - self-assured, stable strength.`]);
  yog.forEach(y=>{if(!y[0].includes('caution'))out.push([y[0],y[1]]);});
  const top=sbala[0];out.push(['Strongest by Shadbala',`${PL[top.i]} leads the chart by six-fold strength (ratio ${top.ratio.toFixed(2)}), giving its house and significations real force.`]);
  const savMax=Math.max(...av.sav);out.push(['Ashtakavarga support',`${SG[av.sav.indexOf(savMax)]} carries the most bindus (${savMax}) - activity and transits there tend to succeed easily.`]);
  return out;
}
function challengeProse(chart,dsh,ss,P,asc){
  const out=[];
  if(ss.status==='ACTIVE')out.push(['Sade-Sati is active now',`Saturn transits the ${ord(ss.from)} from the Moon (${ss.phase}) - a maturing phase asking for patience, routine and steadiness. It builds real, earned resilience; avoid big risky moves and keep Saturn remedies.`]);
  dsh.forEach(d=>{if(d.status.startsWith('PRESENT')||d.status==='PRESENT')out.push([d.name,d.detail]);});
  P.forEach(p=>{if(p.dig&&p.dig.cls==='debil'&&p.i<7)out.push([`${PL[p.i]} debilitated`,`${PL[p.i]} falls debilitated in ${SG[p.sign]} (${ord(p.house)}) - its significations become a growth area, often learned through humility before fulfilment. A debilitation met consciously becomes a source of depth.`]);
    if(p.combust&&p.i===SL[asc])out.push([`${PL[p.i]} (Lagna lord) combust`,`The Lagna lord burns close to the Sun - strong will, but drive can scatter or overheat if unchannelled. Physical discipline and routine turn it into stamina.`]);});
  if(out.length===0)out.push(['A relatively clear chart','No major afflictions are flagged. The ordinary cautions of the running daśā and transits apply, but no classic dosha dominates.']);
  return out;
}
function lifeReadings(chart,input,vim,ss,fn,jm,pro,His,first){
  const P=chart.planets,asc=chart.ascSign,moon=P[1],out=[];
  out.push(['Personality & temperament',`${first} rises in ${LAGNA_TXT[asc]} With the ${moon.nak.name} Moon in ${SA[moon.sign]}, the inner life shows ${MOON_TXT[moon.sign]}`]);
  const l10=SL[(asc+9)%12];const ct=J.careerTiming(chart);
  const occ10=P.filter(p=>p.house===10&&p.i<7).map(p=>p.i);
  const domSet=[...new Set([l10,...occ10])].filter(x=>x in DOMAIN);
  const domText=domSet.map(x=>DOMAIN[x]).join('; or ');
  out.push(['Career & profession',`The 10th (${SG[(asc+9)%12]}) is ruled by ${PL[l10]}, placed in the ${ord(P[l10].house)}${occ10.length?`, with ${occ10.map(x=>PL[x]).join(' & ')} in the 10th`:''} - profession is built through ${HOUSE_THEME[P[l10].house-1]}. By the traditional significations of ${domSet.map(x=>PL[x]).join(' & ')}, fields to consider often include ${domText} (indicative, not prescriptive).${ct.windows.length?` Career-activating windows (10th-lord/Amātya daśās): ${ct.windows.map(w=>`<b>${w.label}</b> (${w.dasha})`).join('; ')}.`:''}`]);
  const l2=SL[(asc+1)%12],l11=SL[(asc+10)%12];out.push(['Wealth & finances',`Income (2nd lord ${PL[l2]} in the ${ord(P[l2].house)}, 11th lord ${PL[l11]} in the ${ord(P[l11].house)}) builds through ${HOUSE_THEME[P[l11].house-1]}. ${chart.planets.some(p=>p.dig&&p.dig.cls==='exalt'&&[2,11].includes(p.house))?'Exalted support in the wealth houses is a strong asset.':'Steady saving beats speculation.'}`]);
  const l7=SL[(asc+6)%12];const mt=J.marriageTiming(chart);
  const mtxt=mt.windows.length?`Likeliest marriage windows, from the actual ${PL[mt.l7]}/Darakāraka/Upapada daśā periods${mt.windows.some(w=>w.dt)?' with Jupiter-Saturn double-transit support':''}: ${mt.windows.map(w=>`<b>age ${w.label}</b> (${w.dasha} daśā)`).join('; ')}.${mt.delayed?' The pattern leans later - patience serves.':''}`:'No sharply-defined marriage window stands out; timing spreads across the partnership-lord daśās.';
  out.push(['Marriage & partnership',`The 7th (${SG[(asc+6)%12]}) is ruled by ${PL[l7]} in the ${ord(P[l7].house)}; Upapada in ${SG[jm.UL]}, Darakāraka ${J.charaKarakas(P)[6].name}, spouse-sign (7th lord in D-9) ${SG[mt.spouseSign]}. ${mtxt}`]);
  const l5=SL[(asc+4)%12];out.push(['Children & progeny',`The 5th (${SG[(asc+4)%12]}) lord ${PL[l5]} sits in the ${ord(P[l5].house)}; Jupiter (children-kāraka) in the ${ord(P[4].house)}. ${P[4].dig&&P[4].dig.cls==='exalt'?'Exalted Jupiter is about the best signature for children there is.':'Supportive for progeny with Jupiter periods.'}`]);
  const ha=J.healthAnalysis(chart);
  out.push(['Health & vitality',`Underlying vitality from ${P[0].dig&&P[0].dig.cls!=='debil'?'a well-placed Sun':'the Sun'} and ${P[4].dig&&P[4].dig.cls==='exalt'?'exalted Jupiter':'Jupiter'}. Areas to keep an eye on (from the 6th sign ${SG[ha.sixthSign]}, the 6th/8th lords and any afflicted graha): <b>${ha.areas.join('; ')}</b>.${ha.windows.length?` More care is traditionally advised in the ${ha.windows.map(w=>`${w.dasha} daśā (${w.label})`).join(' and ')}.`:''}${ss.status==='ACTIVE'?' Through the current Sade-Sati, watch stress, sleep and routine.':''} The D-30 (Triṁśāṁśa) chart above is the classical varga for these themes. Moderation and routine keep it well-managed.`]);
  out.push(['Spirituality & inner life',`${P[8].house===1?'Ketu on the Lagna, ':''}${SA[asc]} rising and the Yogi linked to ${jm.yogiLord} draw ${pro} toward depth, philosophy and inner practice, especially in the ${jm.yogiLord} and later periods. Iṣṭa Devatā: ${J.ISHTA_DEV[SL[jm.ishta12]]}.`]);
  return out;
}
/* ======================= CAREER / FINANCE / EDUCATION READINGS =======================
   House-and-lord readings for the areas the life-area section only touches in one
   line each. Same contract as the rest of the report: every verdict is the output
   of a printed classical test, and carries its rule, the chart values that fired
   it, and its tradition. */
const PAR_C="Bhāva significations - Bṛhat Parāśara Horā Śāstra / Phaladīpikā";
/* the date range of a graha's Vimśottari mahādaśā, for the "when does this activate" line */
function mdSpan(vim,lord){
  const m=vim.list.find(x=>x.lord===lord);
  return m?`${PL[lord]} mahādaśā (${jdMY(m.st)} - ${jdMY(m.en)})`:`${PL[lord]} periods`;
}
const DUS=[6,8,12];                        // the dusthānas
const DUAL_SIGNS=[2,5,8,11];               // dvisvabhāva: Gemini, Virgo, Sagittarius, Pisces
function careerFinanceReadings(chart,vim,fn,sbala,av){
  const P=chart.planets, asc=chart.ascSign, out=[];
  const L=h=>SL[(asc+h-1)%12];                 // lord of the h-th bhava
  const H=pi=>P[pi].house;                     // bhava a graha occupies
  const occ=h=>P.filter(p=>p.house===h&&p.i<7).map(p=>p.i);
  const strong=pi=>P[pi].dig&&(P[pi].dig.cls==='own'||P[pi].dig.cls==='exalt');
  const weak=pi=>(P[pi].dig&&P[pi].dig.cls==='debil')||P[pi].combust;
  const l2=L(2),l4=L(4),l5=L(5),l6=L(6),l7=L(7),l8=L(8),l10=L(10),l11=L(11),l12=L(12);
  const sbRank=pi=>sbala.findIndex(s=>s.i===pi)+1;

  /* --- business vs employment: the 7th/3rd (enterprise) against the 6th/10th (service) --- */
  const bizScore=(occ(7).length?2:0)+(strong(l7)?2:0)+([1,7,10,11].includes(H(3))?1:0)
    +(occ(3).filter(x=>[2,3].includes(x)).length?1:0)+([3,7,10,11].includes(H(l11))?1:0);
  const svcScore=(occ(6).length?2:0)+(strong(l6)?1:0)+([6,10].includes(H(6))?1:0)
    +(occ(10).filter(x=>[0,6].includes(x)).length?2:0)+(strong(l10)?1:0);
  const lean=bizScore>svcScore+1?'business or self-employment':svcScore>bizScore+1?'employment and salaried service':'either, with no strong pull to one';
  out.push(['Business & startup potential vs salaried service',
    `The 7th (${SG[(asc+6)%12]}, business and dealings) is ruled by ${PL[l7]} in the ${ord(H(l7))}${occ(7).length?`, with ${occ(7).map(x=>PL[x]).join(' & ')} in the 7th`:''}; the 6th (service and employment) is ruled by ${PL[l6]} in the ${ord(H(l6))}${occ(6).length?`, with ${occ(6).map(x=>PL[x]).join(' & ')} in the 6th`:''}; the 3rd (enterprise, initiative) lord ${PL[L(3)]} sits in the ${ord(H(L(3)))}. Weighing those, the chart leans toward <b>${lean}</b>. A venture of one's own asks a working 7th and 3rd; a salaried career asks a working 6th and 10th, and many charts carry both and change track mid-life at a daśā boundary.`,
    {rule:"The 7th and 3rd bhāvas and their lords govern independent business and enterprise; the 6th and 10th govern service and employment. Occupancy by a graha, and its lord's dignity and placement, decide which side is better supported",
     chart:`7th lord ${PL[l7]} in the ${ord(H(l7))}${strong(l7)?' (strong)':''}, 7th occupied by ${occ(7).map(x=>PL[x]).join(' & ')||'none'}; 6th lord ${PL[l6]} in the ${ord(H(l6))}, 6th occupied by ${occ(6).map(x=>PL[x]).join(' & ')||'none'}; 3rd lord ${PL[L(3)]} in the ${ord(H(L(3)))} - business indications ${bizScore}, service indications ${svcScore}`,
     tradition:PAR_C}]);

  /* --- government vs private sector: the Sun and the 10th --- */
  const sunGov=(H(0)===10||H(0)===1||H(0)===11)+(strong(0)?1:0)+(l10===0?2:0)+(P[0].sign===P[l10].sign?1:0);
  const govLean=sunGov>=3?'government, public-sector or authority-linked work is well supported':sunGov>=1?'both sectors are open, with a mild tilt toward institutional or public-facing work':'private-sector, commercial or independent work is the better-supported side';
  out.push(['Government vs private sector',
    `The Sun - the graha of the state, office and delegated authority - sits in the ${ord(H(0))} in ${SG[P[0].sign]}${P[0].dig?` (${P[0].dig.label})`:''}, and the 10th lord is ${PL[l10]} in the ${ord(H(l10))}. On the classical significations, <b>${govLean}</b>. Saturn in the 10th or ruling it points to large structured organisations either way; Mercury and Venus lean commercial; Jupiter leans advisory, legal and academic institutions.`,
    {rule:"The Sun signifies government, office and authority; a Sun strong or placed in the 1st, 10th or 11th, or ruling or joining the 10th lord, supports state and public-sector work. Saturn indicates large institutions, Mercury and Venus commerce",
     chart:`Sun in ${SG[P[0].sign]}${P[0].dig?` (${P[0].dig.label})`:''}, house ${H(0)}; 10th lord ${PL[l10]} in the ${ord(H(l10))}${l10===0?' (the Sun itself rules the 10th)':''} - government indications ${sunGov} of 5`,
     tradition:PAR_C}]);

  /* --- leadership --- */
  const mpy=[2,4,5,3,6].filter(pi=>[1,4,7,10].includes(H(pi))&&strong(pi));
  const kendraCount=P.filter(p=>p.i<7&&[1,4,7,10].includes(p.house)).length;
  const leadScore=(strong(0)?2:0)+(strong(2)?1:0)+(strong(l10)?2:0)+mpy.length*2+(kendraCount>=3?1:0)+(sbRank(0)<=2?1:0);
  out.push(['Leadership indicators',
    `${leadScore>=5?'Strong.':leadScore>=3?'Moderate.':'Present but understated.'} The Sun (authority) is ${strong(0)?'strong in '+SG[P[0].sign]:weak(0)?'under pressure in '+SG[P[0].sign]:'placed in '+SG[P[0].sign]} and ranks ${ord(sbRank(0))} of seven by Shadbala; Mars (command, initiative) sits in the ${ord(H(2))}; the 10th lord ${PL[l10]} is ${strong(l10)?'strong':weak(l10)?'weak':'moderately placed'}; ${kendraCount} of the seven tārā grahas hold quadrants${mpy.length?`, and ${mpy.map(x=>PL[x]).join(' & ')} form${mpy.length>1?'':'s'} a Pañca-Mahāpuruṣa combination`:''}. ${leadScore>=5?'The classical reading is natural command - authority arrives rather than being chased.':leadScore>=3?'Authority is earned through demonstrated competence rather than conferred early.':'Influence works better through expertise and quiet leverage than through formal rank.'}`,
    {rule:"Leadership is read from the Sun (authority) and Mars (command), the dignity of the 10th lord, grahas holding kendras, and any Pañca-Mahāpuruṣa yoga",
     chart:`Sun ${P[0].dig?P[0].dig.label:'neutral'} (Shadbala rank ${sbRank(0)}/7), Mars in the ${ord(H(2))}, 10th lord ${PL[l10]} ${P[l10].dig?P[l10].dig.label:'neutral'}, ${kendraCount} grahas in kendras, Mahāpuruṣa: ${mpy.map(x=>PL[x]).join(' & ')||'none'} - score ${leadScore}`,
     tradition:"Rāja/authority significations - Bṛhat Parāśara Horā Śāstra / Phaladīpikā"}]);

  /* --- income patterns --- */
  const multi=DUAL_SIGNS.includes(P[l11].sign)||occ(11).length>=2;
  out.push(['Income patterns',
    `The 11th (${SG[(asc+10)%12]}, gains) is ruled by ${PL[l11]} in the ${ord(H(l11))}${occ(11).length?`, with ${occ(11).map(x=>PL[x]).join(' & ')} in the 11th`:''}, and the 2nd (${SG[(asc+1)%12]}, earned wealth) by ${PL[l2]} in the ${ord(H(l2))}. Gains flow mainly through ${HOUSE_THEME[H(l11)-1]}. ${multi?'The 11th lord sits in a dual sign or the 11th carries more than one graha - the classical marker of <b>several income streams</b> rather than one, which usually shows up as side work, consulting or mixed sources alongside the main one.':'The indications point to <b>one principal income stream</b> deepening over time rather than several running at once.'} ${weak(l11)?'The 11th lord is afflicted, so income tends to arrive unevenly - budgeting to the trough rather than the peak is the practical reading.':'The 11th lord is not afflicted, which favours steady rather than erratic inflow.'} Ashtakavarga gives the 11th house ${av.sav[(asc+10)%12]} bindus${av.sav[(asc+10)%12]>=28?' - above the 28 mark, a supportive sign for gains':' - below the 28 mark, so gains reward effort rather than arriving easily'}.`,
    {rule:"The 11th bhāva and its lord govern gains and income, the 2nd accumulated earnings. An 11th lord in a dual sign, or multiple grahas in the 11th, indicates plural income sources; affliction of the 11th lord indicates irregular inflow",
     chart:`11th lord ${PL[l11]} in ${SG[P[l11].sign]} (${ord(H(l11))})${weak(l11)?', afflicted':''}; 11th occupied by ${occ(11).map(x=>PL[x]).join(' & ')||'none'}; 2nd lord ${PL[l2]} in the ${ord(H(l2))}; SAV of the 11th ${av.sav[(asc+10)%12]}`,
     tradition:PAR_C}]);

  /* --- savings vs outflow: the 2nd against the 12th --- */
  const saveScore=(strong(l2)?2:0)+(!DUS.includes(H(l2))?1:0)+(H(6)===2||l2===6?1:0)+(!DUS.includes(H(l11))?1:0);
  const spendPull=(occ(12).length?1:0)+(strong(l12)?1:0)+([1,2,11].includes(H(l12))?1:0);
  out.push(['Savings tendency & outflow',
    `The 2nd lord ${PL[l2]} (accumulation) sits in the ${ord(H(l2))}${P[l2].dig?` (${P[l2].dig.label})`:''}; the 12th lord ${PL[l12]} (expenditure) in the ${ord(H(l12))}${occ(12).length?`, with ${occ(12).map(x=>PL[x]).join(' & ')} in the 12th`:''}. ${saveScore>spendPull+1?'Accumulation outweighs outflow - the chart holds what it earns, and saving comes naturally enough that it does not need enforcing.':spendPull>saveScore+1?'Outflow outweighs accumulation. Not a poverty reading - money moves through rather than sticking, and the traditional counsel is an automatic, structural set-aside rather than relying on intention.':'Accumulation and outflow are roughly balanced: what gets saved is what gets deliberately set aside.'} ${(l2===6||H(6)===2)?'Saturn touching the wealth house is the classical signature of thrift and patient, slow accumulation.':''}`,
    {rule:"The 2nd bhāva and its lord govern accumulated wealth and the 12th expenditure and loss. Their relative strength, dignity and occupancy give the saving-versus-spending balance; Saturn linked to the 2nd indicates thrift",
     chart:`2nd lord ${PL[l2]} in the ${ord(H(l2))}${P[l2].dig?` (${P[l2].dig.label})`:''}; 12th lord ${PL[l12]} in the ${ord(H(l12))}; 12th occupied by ${occ(12).map(x=>PL[x]).join(' & ')||'none'} - accumulation ${saveScore}, outflow ${spendPull}`,
     tradition:PAR_C}]);

  /* --- property & real estate: the 4th, Mars, and D-4 --- */
  const d4=J.buildVarga(chart,4);
  const propScore=(strong(l4)?2:0)+(!DUS.includes(H(l4))?1:0)+(occ(4).filter(x=>[2,5,4].includes(x)).length?1:0)+([1,4,7,10,11].includes(H(2))?1:0);
  out.push(['Property, land & real estate',
    `The 4th (${SG[(asc+3)%12]}, home and land) is ruled by ${PL[l4]} in the ${ord(H(l4))}${P[l4].dig?` (${P[l4].dig.label})`:''}${occ(4).length?`, with ${occ(4).map(x=>PL[x]).join(' & ')} in the 4th`:''}; Mars, the graha of land and immovable property, sits in the ${ord(H(2))}. The Chaturthāṁśa (D-4), the varga dedicated to property, rises in ${SG[d4.ascSign]}. ${propScore>=3?'The indications for owning property are good, and the 4th-lord and Mars periods are when it typically comes together.':propScore>=2?'Property is indicated, usually later than expected and often with support from family or a partner.':'The property houses carry pressure. Traditionally read as ownership arriving late, or through inheritance and joint holding rather than outright purchase.'} Activating window: ${mdSpan(vim,l4)}${l4!==2?` and ${mdSpan(vim,2)}`:''}.`,
    {rule:"The 4th bhāva and its lord govern home and immovable property, Mars is the kāraka of land, and the Chaturthāṁśa (D-4) is the varga dedicated to it. Results time to the periods of the 4th lord and Mars",
     chart:`4th lord ${PL[l4]} in the ${ord(H(l4))}${P[l4].dig?` (${P[l4].dig.label})`:''}; Mars in the ${ord(H(2))}; 4th occupied by ${occ(4).map(x=>PL[x]).join(' & ')||'none'}; D-4 Lagna ${SG[d4.ascSign]} - score ${propScore} of 5`,
     tradition:"4th bhāva and Chaturthāṁśa - Bṛhat Parāśara Horā Śāstra"}]);

  /* --- inheritance: the 8th (others' wealth, legacies) --- */
  const inh=(occ(8).filter(x=>[4,5].includes(x)).length?2:0)+(strong(l8)?1:0)+(!DUS.includes(H(l8))?1:0)+(H(l2)===8||H(l8)===2?1:0);
  out.push(['Inheritance & wealth from others',
    `The 8th (${SG[(asc+7)%12]}) governs legacies, dowry, insurance and wealth that arrives through others rather than through one's own earning. Its lord ${PL[l8]} sits in the ${ord(H(l8))}${occ(8).length?`, with ${occ(8).map(x=>PL[x]).join(' & ')} in the 8th`:''}. ${inh>=3?'Benefics in or ruling the 8th, or an 8th/2nd link, are the classical marks of inheritance or a substantial gain through family, marriage or settlement.':inh>=2?'Some support for inheritance, typically modest or shared rather than transforming.':'Little classical support for significant inheritance - the chart reads as self-made on the wealth side.'} ${H(l2)===8||H(l8)===2?'The 2nd and 8th lords exchange houses, which classically ties one\'s own wealth to another\'s - marriage, partnership or family estate.':''} Timing follows ${mdSpan(vim,l8)}.`,
    {rule:"The 8th bhāva and its lord govern inheritance, legacies and wealth received through others; benefics (Jupiter, Venus) in or ruling the 8th, or an exchange between the 2nd and 8th lords, support it",
     chart:`8th lord ${PL[l8]} in the ${ord(H(l8))}${P[l8].dig?` (${P[l8].dig.label})`:''}; 8th occupied by ${occ(8).map(x=>PL[x]).join(' & ')||'none'}; 2nd lord in the ${ord(H(l2))} - score ${inh} of 5`,
     tradition:PAR_C}]);

  /* --- investment inclination: educational framing only, never prescriptive --- */
  const spec=(occ(5).length?1:0)+([5,8,11].includes(H(l5))?1:0)+(P[7].house===11||P[7].house===5?1:0);
  out.push(['Investment inclination <span class="muted">(educational only)</span>',
    `This describes the temperament the chart indicates around risk - not what to do with money. The 5th (${SG[(asc+4)%12]}, speculation and intelligence) is ruled by ${PL[l5]} in the ${ord(H(l5))}${occ(5).length?`, with ${occ(5).map(x=>PL[x]).join(' & ')} in the 5th`:''}; the 8th governs others' money and leveraged holdings; the 11th, ${PL[l11]} in the ${ord(H(l11))}, governs realised gains. ${spec>=2?'The chart indicates an inclination <i>toward</i> risk and speculative interest - which classically cuts both ways, since the same signature that finds opportunity also finds volatility.':'The chart indicates an inclination <i>away from</i> speculation and toward slower, more tangible holdings.'} ${DUS.includes(H(l5))?'The 5th lord sits in a difficult house, which the texts read as speculative losses being the more likely outcome of an untested punt.':''} Jyotiṣa describes leaning and karmic tendency, never instruction: no chart can tell anyone what to buy, sell or hold, and a qualified financial adviser is the right authority for that question.`,
    {rule:"The 5th bhāva governs speculation and the 8th leveraged or others' money; grahas there, and the 5th lord's placement, indicate temperament toward risk. Rāhu in the 5th or 11th intensifies speculative appetite",
     chart:`5th lord ${PL[l5]} in the ${ord(H(l5))}; 5th occupied by ${occ(5).map(x=>PL[x]).join(' & ')||'none'}; Rāhu in the ${ord(P[7].house)}; 11th lord ${PL[l11]} in the ${ord(H(l11))} - risk indications ${spec} of 3`,
     tradition:PAR_C}]);

  return out;
}

function learningReadings(chart,vim,jm){
  const P=chart.planets, asc=chart.ascSign, out=[];
  const L=h=>SL[(asc+h-1)%12], H=pi=>P[pi].house;
  const occ=h=>P.filter(p=>p.house===h&&p.i<7).map(p=>p.i);
  const strong=pi=>P[pi].dig&&(P[pi].dig.cls==='own'||P[pi].dig.cls==='exalt');
  const weak=pi=>(P[pi].dig&&P[pi].dig.cls==='debil')||P[pi].combust;
  const l4=L(4),l5=L(5),l9=L(9),l12=L(12),l3=L(3);

  /* --- education: 4th (schooling), 5th (intelligence), 9th (higher learning), D-24 --- */
  const d24=J.buildVarga(chart,24);
  const eduScore=(strong(3)?1:0)+(!weak(3)?1:0)+(strong(4)?1:0)+(!weak(4)?1:0)
    +(!DUS.includes(H(l4))?1:0)+(!DUS.includes(H(l5))?1:0)+(!DUS.includes(H(l9))?1:0);
  const higher=!DUS.includes(H(l9))&&!weak(4);
  out.push(['Education & the pattern of study',
    `Schooling is read from the 4th (${SG[(asc+3)%12]}, lord ${PL[l4]} in the ${ord(H(l4))}), raw intelligence from the 5th (lord ${PL[l5]} in the ${ord(H(l5))}), and higher or specialised learning from the 9th (lord ${PL[l9]} in the ${ord(H(l9))}). Mercury, the graha of learning and examination, is in ${SG[P[3].sign]}${P[3].dig?` (${P[3].dig.label})`:''}${P[3].combust?' and combust':''}; Jupiter, the graha of wisdom and formal knowledge, in the ${ord(H(4))}${P[4].dig?` (${P[4].dig.label})`:''}. The Siddhāṁśa (D-24), the varga dedicated to education, rises in ${SG[d24.ascSign]}${occ(4).length?`; the 4th carries ${occ(4).map(x=>PL[x]).join(' & ')}`:''}. ${eduScore>=5?'A well-supported education - study comes readily and formal qualification suits the chart.':eduScore>=3?'A sound education with at least one interruption or change of track; the classical reading is that what is learned late is held better than what came easily.':'The learning houses carry pressure. Read as an education pursued against friction - often interrupted, resumed, or gained outside the conventional route, which the texts do not treat as a lesser path.'} ${higher?`Higher study is supported; ${mdSpan(vim,l9)} is the classical window for it.`:'Higher study asks for deliberate effort rather than arriving on momentum.'}`,
    {rule:"The 4th bhāva governs schooling, the 5th intelligence and the 9th higher learning; Mercury is the kāraka of learning and Jupiter of formal knowledge. The Siddhāṁśa (D-24) is the varga dedicated to education",
     chart:`4th lord ${PL[l4]} in the ${ord(H(l4))}, 5th lord ${PL[l5]} in the ${ord(H(l5))}, 9th lord ${PL[l9]} in the ${ord(H(l9))}; Mercury in ${SG[P[3].sign]}${P[3].combust?' (combust)':''}, Jupiter in the ${ord(H(4))}; D-24 Lagna ${SG[d24.ascSign]} - score ${eduScore} of 7`,
     tradition:"Vidyā bhāvas and Siddhāṁśa - Bṛhat Parāśara Horā Śāstra"}]);

  /* --- foreign studies & settlement abroad: 12th, 9th, Rahu --- */
  const rahuH=P[7].house, ketuH=P[8].house;
  const foreign=(occ(12).length?1:0)+([12,9,3,7].includes(H(l4))?2:0)+([12,9].includes(rahuH)?2:0)
    +(!DUS.includes(H(l12))?1:0)+([12,9,7].includes(H(l9))?1:0)+(DUAL_SIGNS.includes(P[l12].sign)?1:0);
  const fVerdict=foreign>=4?'strongly indicated':foreign>=2?'indicated as a real possibility':'not strongly indicated';
  out.push(['Foreign studies, travel & settlement abroad',
    `The 12th (${SG[(asc+11)%12]}) is the bhāva of distant lands and residence away from one's birthplace; its lord ${PL[l12]} sits in the ${ord(H(l12))}${occ(12).length?`, and the 12th carries ${occ(12).map(x=>PL[x]).join(' & ')}`:''}. The 9th (long journeys and higher learning) is ruled by ${PL[l9]} in the ${ord(H(l9))}, the 4th (homeland, roots) by ${PL[l4]} in the ${ord(H(l4))} - a 4th lord in the 12th, 9th or 3rd being the classical mark of leaving home. Rāhu, the graha of the foreign and the unfamiliar, is in the ${ord(rahuH)} and Ketu in the ${ord(ketuH)}. Foreign residence or study is <b>${fVerdict}</b>. ${foreign>=2?`The activating windows are ${mdSpan(vim,l12)} and ${mdSpan(vim,l9)}, and Rāhu's own period - ${mdSpan(vim,7)} - is the one the texts tie most directly to going abroad.`:'Travel is likelier than settlement; the chart keeps its roots close.'}`,
    {rule:"The 12th bhāva governs foreign lands and residence away from birth, the 9th long journeys and higher learning. A 4th lord placed in the 12th, 9th or 3rd indicates leaving the homeland, and Rāhu in the 9th or 12th reinforces it",
     chart:`12th lord ${PL[l12]} in the ${ord(H(l12))}, 9th lord ${PL[l9]} in the ${ord(H(l9))}, 4th lord ${PL[l4]} in the ${ord(H(l4))}; Rāhu in the ${ord(rahuH)}, Ketu in the ${ord(ketuH)}; 12th occupied by ${occ(12).map(x=>PL[x]).join(' & ')||'none'} - score ${foreign} of 8`,
     tradition:"12th/9th bhāva significations and Rāhu - Bṛhat Parāśara Horā Śāstra / Phaladīpikā"}]);

  /* --- travel & where one settles --- */
  const dirLord=SL[P[l4].sign];
  out.push(['Travel & where life settles',
    `Short journeys and mobility belong to the 3rd (lord ${PL[l3]} in the ${ord(H(l3))}${occ(3).length?`, with ${occ(3).map(x=>PL[x]).join(' & ')} in the 3rd`:''}), long journeys to the 9th, and the place one finally settles to the 4th - here ruled by ${PL[l4]} sitting in the ${ord(H(l4))} in ${SG[P[l4].sign]}, whose direction by classical attribution is <b>${PATTR[dirLord].dir}</b>. ${[3,9,12].includes(H(l4))?'With the 4th lord in a travel house, settlement tends to happen away from the birthplace - often after a period of moving before a place finally holds.':'The 4th lord holds a settled house, which favours living within reach of one\'s roots, or returning to them after a period away.'} ${occ(3).filter(x=>[2,3].includes(x)).length?'Mars or Mercury in the 3rd adds constant short-range movement - commuting, road travel, restlessness that does its thinking in motion.':''} Directional and place readings are among the softest in jyotiṣa - traditional attribution rather than a prediction of a postcode.`,
    {rule:"The 3rd bhāva governs short journeys, the 9th long ones and the 4th the place of settlement. The 4th lord in a travel bhāva (3rd, 9th, 12th) indicates settling away from the birthplace; direction follows the classical attribution of the sign lord",
     chart:`3rd lord ${PL[l3]} in the ${ord(H(l3))}, 4th lord ${PL[l4]} in the ${ord(H(l4))} in ${SG[P[l4].sign]} (lord ${PL[dirLord]} → ${PATTR[dirLord].dir}), 9th lord ${PL[l9]} in the ${ord(H(l9))}`,
     tradition:PAR_C}]);

  /* --- lifestyle --- */
  const comfort=(strong(5)?2:0)+(!DUS.includes(H(5))?1:0)+(!DUS.includes(H(l4))?1:0)+(occ(4).filter(x=>[1,4,5].includes(x)).length?1:0);
  out.push(['Lifestyle & the texture of daily life',
    `Venus - comfort, taste and the pleasant things - sits in the ${ord(H(5))} in ${SG[P[5].sign]}${P[5].dig?` (${P[5].dig.label})`:''}; the Moon (habits, daily rhythm) in the ${ord(H(1))}; the 4th (home and ease) is ruled by ${PL[l4]} in the ${ord(H(l4))}. ${comfort>=3?'The chart favours a comfortable, aesthetically-minded life - good surroundings matter to this nativity and tend to be arranged.':comfort>=2?'Comfort is available but chosen rather than inherited: what is enjoyed is what was deliberately built.'
      :'The chart leans plainer and more functional than luxurious. The texts do not read this as deprivation but as a temperament that finds ease elsewhere than in surroundings.'} ${strong(6)||H(6)===1?'Saturn\'s touch on the self or its own strength lends discipline and simplicity to daily habits - routine suits this chart better than spontaneity.':''} The Iṣṭa Devatā for inner practice is ${J.ISHTA_DEV[SL[jm.ishta12]]}, and the ${mdSpan(vim,SL[jm.ishta12])} is when inward life tends to take priority over outward arrangement.`,
    {rule:"Venus governs comfort and taste, the Moon daily habit and rhythm, and the 4th bhāva domestic ease; Saturn's strength or its contact with the Lagna indicates austerity and routine",
     chart:`Venus in ${SG[P[5].sign]}${P[5].dig?` (${P[5].dig.label})`:''} in the ${ord(H(5))}; Moon in the ${ord(H(1))}; 4th lord ${PL[l4]} in the ${ord(H(l4))}; Saturn in the ${ord(H(6))} - comfort indications ${comfort} of 5`,
     tradition:PAR_C}]);

  return out;
}

function peopleReadings(chart,ck,jm,P,asc,pro,His){
  const out=[];
  out.push(['Spouse (kārakas: Venus / 7th; Darakāraka; Upapada)',`Rahu/7th-lord placement, a ${SG[jm.UL]} Upapada and Darakāraka ${ck[6].name} point to a ${SG[jm.UL]===4||jm.UL===4?'warm, dignified':'capable, committed'} partner - the bond deepens and steadies with time.`]);
  out.push(['Children (kāraka: Jupiter / 5th)',`Jupiter in the ${ord(P[4].house)}${P[4].dig&&P[4].dig.cls==='exalt'?', exalted,':''} as children-significator favours ${P[4].dig&&P[4].dig.cls==='exalt'?'capable, fortunate children and a warm, guiding bond':'a caring bond with progeny'}.`]);
  out.push(['Mother (4th house; Moon)',`The 4th (${SG[(asc+3)%12]}) and the Moon in the ${ord(P[1].house)} describe the mother and home. ${P[1].dig&&P[1].dig.cls!=='debil'?'A supportive, nurturing tie.':'A tie that matures through care.'}`]);
  out.push(['Father (9th house; Sun)',`The 9th (${SG[(asc+8)%12]}) and the Sun in the ${ord(P[0].house)} describe the father and fortune. ${P[0].dig&&P[0].dig.cls!=='debil'?'A dignified, elevating influence.':'A bond that grows with time.'}`]);
  return out;
}
function depthReadings(chart,ck,jm,P,asc,vim,pro){
  const out=[];
  const sat=P[6];const ha=J.healthAnalysis(chart);
  out.push(['Longevity (Āyu) - the traditional picture',`Saturn (āyuṣ-kāraka) sits in the ${ord(sat.house)}; the 8th lord ${PL[ha.l8]} and the protective aspects of Jupiter shape the picture. ${P.some(p=>p.dig&&p.dig.cls==='exalt')?'Dignified benefics lend good underlying vitality.':''} The body zones the chart flags for care are <b>${ha.areas.join('; ')}</b>${ha.windows.length?`, with the ${ha.windows.map(w=>w.dasha).join(' and ')} daśās the periods to be most mindful`:''}. Classical jyotiṣa treats the timing of death as the least certain of all readings - offered for reflection only, never as a verdict or medical claim.`]);
  const mt=J.marriageTiming(chart);
  out.push(['Spouse - in depth',`7th lord ${PL[SL[(asc+6)%12]]} in the ${ord(P[SL[(asc+6)%12]].house)}, Darakāraka ${ck[6].name}, Upapada ${SG[jm.UL]}, and the D-9 Lagna colour the marriage; the 7th lord sits in ${SG[mt.spouseSign]} in the Navāṁśa. ${mt.windows.length?`The computed likely windows (from the ${PL[mt.l7]}/Darakāraka/${mt.male?'Venus':'Jupiter'}-kāraka daśās${mt.windows.some(w=>w.dt)?', double-transit-confirmed':''}) are: ${mt.windows.map(w=>`<b>age ${w.label}</b> [${w.dasha}]`).join('; ')}.`:'Timing spreads across the partnership-lord daśās rather than one sharp window.'} Conscious effort makes the bond stable and devoted.`]);
  /* Manner of meeting and distance of background - two readings the 7th house
     is classically asked for and which a koota score cannot touch at all. */
  const vimD=J.vimshottari(P[1].lon,chart.jd);
  const ms=J.marriageStyle(chart);
  out.push(['Love or arranged - the inclination',ms.text,
    {rule:"A tie between the 5th lord (romance) and the 7th lord (marriage) by conjunction, exchange or mutual placement, a Venus-Mars contact, or Rāhu on the 7th, incline toward a self-chosen union; a 9th-7th tie, or Jupiter or Saturn on the 7th, incline toward a family-arranged one",
     chart:`5th lord ${PL[ms.l5]} in the ${ord(P[ms.l5].house)}, 7th lord ${PL[ms.l7]} in the ${ord(P[ms.l7].house)}, 9th lord ${PL[ms.l9]} in the ${ord(P[ms.l9].house)} - ${ms.love.length} love indication${ms.love.length===1?'':'s'} against ${ms.trad.length} traditional`,
     confidence:(()=>{const g=J.gradeIndication(chart,ms.pis);
       const gap=Math.abs(ms.love.length-ms.trad.length);
       const lvl=gap>=2?g.level:gap===1?(g.level==="strong"?"moderate":g.level):"weak";
       return {level:chart.timeUnknown&&lvl==="strong"?"moderate":lvl,
         basis:gap>=2?`the two sides differ by ${gap} indications, a clear lean; ${g.basis}`
           :gap===1?`the two sides differ by only one indication, so the lean is slight; ${g.basis}`
           :"the indications are evenly balanced, so the chart does not lean either way"};})(),
     window:J.activationWindow(ms.pis,vimD,chart.timeUnknown),
     tradition:"7th-bhāva reading on the 5th/9th axis - Bṛhat Parāśara Horā Śāstra and later melāpaka practice"}]);
  const fs=J.foreignSpouse(chart);
  out.push(['A foreign or distant match',fs.text,
    {rule:"A foreign or distant spouse is read from the 7th lord in a movable (chara) or dual (dvisvabhāva) sign, a 7th-12th connection either way, the 7th lord in the 9th, or Rāhu on the 7th or with its lord",
     chart:`7th lord ${PL[fs.l7]} in ${SG[P[fs.l7].sign]} (${ord(P[fs.l7].house)} bhāva), 12th lord ${PL[fs.l12]} in the ${ord(P[fs.l12].house)}, Rāhu in the ${ord(P[7].house)} - ${fs.hits.length} of the classical indications present`,
     confidence:{level:chart.timeUnknown&&fs.level==="strong"?"moderate":(fs.level==="none"?"weak":fs.level),
       basis:fs.hits.length?`${fs.hits.length} independent indication${fs.hits.length===1?'':'s'} point the same way`
         :"none of the classical indications is present"},
     window:J.activationWindow(fs.pis,vimD,chart.timeUnknown),
     tradition:"Foreign-match indications - classical 7th/12th bhāva reading with Rāhu as the outsider-kāraka"}]);
  out.push(['Children - in depth',`Jupiter (5th kāraka) in the ${ord(P[4].house)}${P[4].dig&&P[4].dig.cls==='exalt'?', exalted in fortune':''}, with the D-7 Lagna, describes progeny. ${P[4].dig&&P[4].dig.cls==='exalt'?'About the best signature there is - capable, fortunate children.':'Supportive with Jupiter-period timing.'}`]);
  return out;
}
function dashaTheme(lord){return {0:'authority, recognition, the father\'s influence',1:'emotional growth, home, the public',2:'drive, courage, career action and initiative',3:'intellect, commerce, communication, study',4:'growth, family, children, wisdom and fortune',5:'comfort, relationships, art and refinement',6:'hard work, discipline, earned status and mastery',7:'ambition, worldly expansion, the unconventional rise',8:'detachment, spirituality, an inward turn'}[lord]||'';}
function yog2Yogini(chart){return J.yoginiDasha(chart.planets[1].lon,chart.jd);}

/* ---- starfield ---- */
(function(){const cv=$('#stars');if(!cv)return;const ctx=cv.getContext('2d');if(!ctx)return;let stars=[];
  const reduce=matchMedia('(prefers-reduced-motion:reduce)').matches;
  function build(){const w=cv.width=cv.offsetWidth,h=cv.height=cv.offsetHeight;stars=[];
    const n=Math.min(70,Math.round(w/16));for(let i=0;i<n;i++)stars.push({x:Math.random()*w,y:Math.random()*h,r:Math.random()*1.2+.2,p:Math.random()*Math.PI*2});}
  window._stars=build;
  function draw(t){const w=cv.width,h=cv.height;ctx.clearRect(0,0,w,h);
    const col=getComputedStyle(document.documentElement).getPropertyValue('--brass').trim();
    stars.forEach(s=>{const a=reduce?.5:(.35+.35*Math.sin(t/900+s.p));ctx.beginPath();ctx.arc(s.x,s.y,s.r,0,Math.PI*2);ctx.fillStyle=col;ctx.globalAlpha=a;ctx.fill();});
    ctx.globalAlpha=1;if(!reduce)requestAnimationFrame(draw);}
  build();requestAnimationFrame(draw);addEventListener('resize',build);})();

renderShowcase();
initLogin();
})();
