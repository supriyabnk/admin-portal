function dashboard(){
 const pres=S.emps.filter(e=>S.att[e.id+'|'+today]?.in).length,lv=S.emps.filter(e=>S.att[e.id+'|'+today]?.status==='leave').length;
 const unen=S.emps.filter(e=>BIO.some(b=>!e.bio?.[b])).length;
 const bal=S.pay.reduce((a,p)=>a+(p.type==='Credit'?p.amount:-p.amount),0);
 $('#app').innerHTML=`<h1>Dashboard</h1><p class="sub">${new Date().toDateString()}${S.hol[today]?` · <span class="pill hl">Holiday: ${H(S.hol[today])}</span>`:''}</p>
 <div class="grid g4"><div class="card stat"><b>${S.emps.length}</b><span>Employees &amp; interns</span></div><div class="card stat"><b>${pres}</b><span>Present today</span></div><div class="card stat"><b>${lv}</b><span>On leave today</span></div><div class="card stat"><b>${unen}</b><span>Biometrics incomplete</span></div></div>
 <div class="card"><b>Net payouts recorded</b><div style="font-size:22px" class="${bal>=0?'cr':'db'}">${money(bal)}</div><span class="sub">Credits minus debits across all records</span></div>
 ${S.emps.length?'':`<div class="card empty">No one added yet. <a href="employees.html">Add your first employee or intern →</a></div>`}`}
window.__page=dashboard;dashboard();
