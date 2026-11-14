function payroll(){
 const rows=S.pay.filter(p=>!ui.pe||p.empId===ui.pe).sort((a,b)=>a.date.localeCompare(b.date)||0);let run=0;
 const body=rows.map(p=>{run+=p.type==='Credit'?p.amount:-p.amount;return{p,run}}).reverse();
 const cr=rows.filter(p=>p.type==='Credit').reduce((a,p)=>a+p.amount,0),db=rows.filter(p=>p.type==='Debit').reduce((a,p)=>a+p.amount,0);
 const wallet=rows.filter(p=>p.mode==='Wallet').reduce((a,p)=>a+(p.type==='Credit'?p.amount:-p.amount),0);
 $('#app').innerHTML=`<h1>Stipend &amp; Salary</h1><p class="sub">Credit/debit statement across wallet and direct bank deposits.</p>
 <div class="row"><div><label>Filter by person</label><select id="pf">${empOpts(ui.pe,true)}</select></div><button class="p" id="pa">+ New entry</button></div>
 <div class="grid g4"><div class="card stat"><b class="cr">${money(cr)}</b><span>Total credited</span></div><div class="card stat"><b class="db">${money(db)}</b><span>Total debited</span></div><div class="card stat"><b>${money(cr-db)}</b><span>Net</span></div><div class="card stat"><b>${money(wallet)}</b><span>Wallet balance</span></div></div>
 <div class="card tw">${body.length?`<table><tr><th>Date</th>${ui.pe?'':'<th>Person</th>'}<th>Category</th><th>Mode</th><th>Reference</th><th>Credit</th><th>Debit</th>${ui.pe?'<th>Balance</th>':''}<th></th></tr>${body.map(({p,run})=>`<tr><td>${p.date}</td>${ui.pe?'':`<td>${H(emp(p.empId)?.name||'—')}</td>`}<td>${H(p.cat)}${p.note?`<br><small style="color:var(--mut)">${H(p.note)}</small>`:''}</td><td><span class="pill ${p.mode==='Wallet'?'pr':'hl'}">${p.mode}</span></td><td>${H(p.ref)}</td><td class="cr">${p.type==='Credit'?money(p.amount):''}</td><td class="db">${p.type==='Debit'?money(p.amount):''}</td>${ui.pe?`<td>${money(run)}</td>`:''}<td><button class="s" data-p="${p.id}">Edit</button></td></tr>`).join('')}</table>`:'<div class="empty">No transactions yet.</div>'}</div>`;
 $('#pf').onchange=e=>{ui.pe=e.target.value;payroll()};$('#pa').onclick=()=>payForm();document.querySelectorAll('[data-p]').forEach(b=>b.onclick=()=>payForm(b.dataset.p))}
function payForm(id){
 if(!S.emps.length)return alert('Add an employee first.');
 const p=id?S.pay.find(x=>x.id===id):{type:'Credit',mode:'Bank deposit',date:today,cat:'Stipend',empId:ui.pe||S.emps[0].id};
 const sel=(n,a,v)=>`<select name="${n}">${a.map(x=>`<option ${x===v?'selected':''}>${x}</option>`).join('')}</select>`;
 open(`<h2 style="margin-top:0">${id?'Edit':'New'} transaction</h2><form id="f" class="grid g2">
 <div><label>Person</label><select name="empId">${empOpts(p.empId)}</select></div><div><label>Date</label><input type="date" name="date" value="${p.date}" required></div>
 <div><label>Type</label>${sel('type',['Credit','Debit'],p.type)}</div><div><label>Category</label>${sel('cat',PAYCAT,p.cat)}</div>
 <div><label>Mode</label>${sel('mode',['Bank deposit','Wallet'],p.mode)}</div><div><label>Amount (NPR)</label><input type="number" name="amount" min="0.01" step="0.01" required value="${p.amount||''}"></div>
 <div><label>Reference (txn / cheque no.)</label><input name="ref" value="${H(p.ref)}"></div><div><label>Note</label><input name="note" value="${H(p.note)}"></div>
 <div style="grid-column:1/-1;display:flex;justify-content:space-between"><span>${id?'<button type="button" class="d" id="del">Delete</button>':''}</span><span><button type="button" id="x">Cancel</button> <button class="p">Save</button></span></div></form>`);
 $('#x').onclick=close;if(id)$('#del').onclick=()=>{S.pay=S.pay.filter(x=>x.id!==id);save();close();payroll()};
 $('#f').onsubmit=ev=>{ev.preventDefault();const f=Object.fromEntries(new FormData(ev.target));f.amount=parseFloat(f.amount);Object.assign(p,f);if(!id){p.id=uid();S.pay.push(p)}save();close();payroll()}}
window.__page=payroll;payroll();
