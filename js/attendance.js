function attendance(){
 if(!ui.emp||!emp(ui.emp))ui.emp=S.emps[0]?.id||'';
 $('#app').innerHTML=`<h1>Attendance</h1><p class="sub">Check-in and exit times, biometric method, leaves and company holidays (holidays count as positive/paid days).</p>
 <div class="tabs"><button data-t="cal" class="${ui.tab==='cal'?'on':''}">Calendar</button><button data-t="day" class="${ui.tab==='day'?'on':''}">Daily register</button><button data-t="hol" class="${ui.tab==='hol'?'on':''}">Holidays</button></div><div id="tb"></div>`;
 document.querySelectorAll('[data-t]').forEach(b=>b.onclick=()=>{ui.tab=b.dataset.t;attendance()});
 if(!S.emps.length&&ui.tab!=='hol')return $('#tb').innerHTML='<div class="card empty">Add employees first.</div>';
 ({cal:attCal,day:attDay,hol:attHol}[ui.tab])()}
function attCal(){
 const[y,m]=ui.month.split('-').map(Number),first=new Date(y,m-1,1).getDay(),n=new Date(y,m,0).getDate(),st=stat(ui.emp,ui.month);
 let cells='<div class="h">Sun</div><div class="h">Mon</div><div class="h">Tue</div><div class="h">Wed</div><div class="h">Thu</div><div class="h">Fri</div><div class="h">Sat</div>'+'<div class="day blank"></div>'.repeat(first);
 for(let d=1;d<=n;d++){const ds=ui.month+'-'+String(d).padStart(2,'0'),i=dayInfo(ui.emp,ds),r=i.r;
  cells+=`<div class="day ${i.k}" data-d="${ds}"><b>${d}</b><br>${i.k==='present'?`${H(r.in)}–${H(r.out||'…')}<br>${H(r.method||'')}`:H(i.t)}</div>`}
 $('#tb').innerHTML=`<div class="card"><div class="row"><div><label>Person</label><select id="se">${empOpts(ui.emp)}</select></div><div><label>Month</label><input type="month" id="sm" value="${ui.month}"></div></div>
 <div class="leg" style="margin-bottom:10px"><span><i style="background:var(--ok)"></i>Present ${st.present}</span><span><i style="background:var(--warn)"></i>Leave ${st.leave}</span><span><i style="background:var(--hol)"></i>Holiday ${st.holiday}</span><span><i style="background:var(--bad)"></i>Absent ${st.absent}</span><span><i style="background:var(--line)"></i>Weekly off (Sat & Sun)</span><span><i style="background:var(--wk)"></i>Not joined</span></div>
 <div class="cal">${cells}</div><p class="sub" style="margin-top:10px">Click any day to register or edit.</p></div>`;
 $('#se').onchange=e=>{ui.emp=e.target.value;attendance()};$('#sm').onchange=e=>{ui.month=e.target.value||ui.month;attendance()};
 document.querySelectorAll('.day[data-d]').forEach(c=>c.onclick=()=>dayForm(ui.emp,c.dataset.d))}
function attDay(){
 const rows=S.emps.map(e=>{const i=dayInfo(e.id,ui.date),r=i.r||{};return`<tr><td>${avatar(e)} ${H(e.name)}</td><td><span class="pill ${{present:'ok',leave:'wn',holiday:'hl',absent:'no'}[i.k]||'pr'}">${H(i.t||'—')}</span></td><td>${H(r.in||'—')}</td><td>${H(r.out||'—')}</td><td>${r.method?`<span class="pill pr">${H(r.method)}</span>`:'—'}</td><td>${H(r.bioTime||'—')}</td><td>${H(r.reason||'')}</td><td><button class="s" data-e="${e.id}">Edit</button></td></tr>`}).join('');
 $('#tb').innerHTML=`<div class="card"><div class="row"><div><label>Date</label><input type="date" id="sd" value="${ui.date}"></div></div><div class="tw"><table><tr><th>Person</th><th>Status</th><th>Entry</th><th>Exit</th><th>Method</th><th>Biometric time</th><th>Reason</th><th></th></tr>${rows}</table></div></div>`;
 $('#sd').onchange=e=>{ui.date=e.target.value||today;attendance()};document.querySelectorAll('[data-e]').forEach(b=>b.onclick=()=>dayForm(b.dataset.e,ui.date))}
function dayForm(id,ds){
 if(isNJ(id,ds))return alert('Not joined yet. Joining date: '+emp(id).join+'.');
 const e=emp(id),r=S.att[id+'|'+ds]||{},st=r.status||(r.in?'present':'');
 open(`<h2 style="margin-top:0">${H(e.name)}<br><small style="font-weight:400;color:var(--mut)">${new Date(ds+'T00:00').toDateString()}</small></h2>${S.hol[ds]?`<p><span class="pill hl">Company holiday: ${H(S.hol[ds])}</span></p>`:''}
 <form id="f" class="grid g2"><div style="grid-column:1/-1"><label>Status</label><select name="status" id="ss"><option value="present" ${st==='present'?'selected':''}>Present</option><option value="leave" ${st==='leave'?'selected':''}>On leave</option><option value="absent" ${st==='absent'?'selected':''}>Absent</option><option value="" ${st===''?'selected':''}>Not recorded</option></select></div>
 <div class="pf"><label>Entry time</label><input type="time" name="in" value="${H(r.in)}"></div><div class="pf"><label>Exit time</label><input type="time" name="out" value="${H(r.out)}"></div>
 <div class="pf"><label>Verified by</label><select name="method">${METH.map(m=>`<option ${r.method===m?'selected':''}>${m}</option>`).join('')}</select></div><div class="pf"><label>Biometric log time</label><input type="time" name="bioTime" value="${H(r.bioTime)}"></div>
 <div style="grid-column:1/-1" class="lf"><label>Leave / absence reason</label><textarea name="reason" rows="2">${H(r.reason)}</textarea></div>
 <div style="grid-column:1/-1"><label>Company holiday (applies to everyone; counts as positive)</label><input name="hol" placeholder="Holiday name – leave blank for none" value="${H(S.hol[ds])}"></div>
 <div style="grid-column:1/-1;text-align:right"><button type="button" id="x">Cancel</button> <button class="p">Save</button></div></form>`);
 const tog=()=>{const v=$('#ss').value;document.querySelectorAll('.pf').forEach(x=>x.style.display=v==='present'?'':'none');$('.lf').style.display=v==='leave'||v==='absent'?'':'none'};$('#ss').onchange=tog;tog();
 $('#x').onclick=close;
 $('#f').onsubmit=ev=>{ev.preventDefault();const f=Object.fromEntries(new FormData(ev.target)),k=id+'|'+ds;
  if(f.status==='present'&&!f.in)return alert('Enter the entry time.');
  if(f.in&&f.out&&f.out<f.in)return alert('Exit time cannot be before entry time.');
  if(!f.status)delete S.att[k];else S.att[k]={status:f.status,in:f.status==='present'?f.in:'',out:f.status==='present'?f.out:'',method:f.method,bioTime:f.status==='present'?f.bioTime:'',reason:f.status==='present'?'':f.reason};
  f.hol.trim()?S.hol[ds]=f.hol.trim():delete S.hol[ds];save();close();attendance()}}
function attHol(){
 const hs=Object.entries(S.hol).sort();
 $('#tb').innerHTML=`<div class="card"><div class="row"><div><label>Date</label><input type="date" id="hd"></div><div><label>Holiday name</label><input id="hn" placeholder="e.g. Dashain"></div><button class="p" id="ha">Add holiday</button></div>
 ${hs.length?`<table>${hs.map(([d,n])=>`<tr><td>${d}</td><td><span class="pill hl">${H(n)}</span></td><td><button class="s d" data-x="${d}">Remove</button></td></tr>`).join('')}</table>`:'<div class="empty">No holidays added.</div>'}</div>`;
 $('#ha').onclick=()=>{if(!$('#hd').value||!$('#hn').value.trim())return;S.hol[$('#hd').value]=$('#hn').value.trim();save();attHol()};
 document.querySelectorAll('[data-x]').forEach(b=>b.onclick=()=>{delete S.hol[b.dataset.x];save();attHol()})}
window.__page=attendance;attendance();
