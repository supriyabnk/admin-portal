function employees(){
 const q=ui.q.toLowerCase(),list=S.emps.filter(e=>[e.name,e.user,e.pos,e.email].join(' ').toLowerCase().includes(q));
 $('#app').innerHTML=`<h1>Employees &amp; Interns</h1><p class="sub">Profiles, login credentials and biometric enrollment.</p>
 <div class="row"><div><input id="q" placeholder="Search name, username, position…" value="${H(ui.q)}"></div><button class="p" id="add">+ Add person</button></div>
 <div class="card tw">${list.length?`<table><tr><th>Person</th><th>Type / Position</th><th>Username</th><th>Contact</th><th>Biometrics</th><th></th></tr>${list.map(e=>`<tr><td>${avatar(e)} <b>${H(e.name)}</b><br><small style="color:var(--mut)">DOB ${H(e.dob||'—')}</small></td><td><span class="pill pr">${H(e.type)}</span> ${H(e.pos)}</td><td>${H(e.user)}</td><td>${H(e.phone)}<br><small style="color:var(--mut)">${H(e.email)}</small></td><td>${bioPills(e)}</td><td><button class="s" data-e="${e.id}">Edit</button></td></tr>`).join('')}</table>`:'<div class="empty">No matching people.</div>'}</div>`;
 $('#q').oninput=e=>{ui.q=e.target.value;const p=e.target.selectionStart;employees();const n=$('#q');n.focus();n.setSelectionRange(p,p)};
 $('#add').onclick=()=>empForm();document.querySelectorAll('[data-e]').forEach(b=>b.onclick=()=>empForm(b.dataset.e))}
function empForm(id){
 const e=id?emp(id):{type:'Employee',bio:{}};let photo=e.photo||'';
 open(`<h2 style="margin-top:0">${id?'Edit':'Add'} person</h2><form id="f" class="grid g2">
 <div style="grid-column:1/-1"><label>Photo</label><span id="pv">${photo?`<img class="av" style="width:64px;height:64px" src="${photo}">`:''}</span> <input type="file" id="ph" accept="image/*" style="margin-top:6px"></div>
 <div><label>Full name</label><input name="name" required value="${H(e.name)}"></div>
 <div><label>Date of birth</label><input type="date" name="dob" value="${H(e.dob)}"></div>
 <div><label>Type</label><select name="type">${['Employee','Intern'].map(t=>`<option ${e.type===t?'selected':''}>${t}</option>`).join('')}</select></div>
 <div><label>Position</label><input name="pos" value="${H(e.pos)}" placeholder="e.g. Web Developer"></div>
 <div><label>Email</label><input type="email" name="email" value="${H(e.email)}"></div>
 <div><label>Phone</label><input name="phone" value="${H(e.phone)}"></div>
 <div><label>Username (set by admin)</label><input name="user" required value="${H(e.user)}" autocomplete="off"></div>
 <div><label>${id?'New password (leave blank to keep)':'Password'}</label><div style="display:flex;gap:6px"><input name="pass" id="pw" ${id?'':'required'} minlength="6" autocomplete="new-password"><button type="button" class="s" id="gen">Generate</button></div></div>
 <div style="grid-column:1/-1"><label>Biometric enrollment</label><div class="bio">${BIO.map(b=>`<label><input type="checkbox" name="b_${b}" ${e.bio?.[b]?'checked':''}> ${b}</label>`).join('')}</div><small style="color:var(--mut)">Ticked = enrolled (green), unticked = not enrolled (red).</small></div>
 <div style="grid-column:1/-1;display:flex;gap:8px;justify-content:space-between"><span>${id?'<button type="button" class="d" id="del">Delete</button>':''}</span><span><button type="button" id="x">Cancel</button> <button class="p">Save</button></span></div></form>`);
 $('#x').onclick=close;$('#gen').onclick=()=>{$('#pw').value=Math.random().toString(36).slice(2,6)+Math.random().toString(36).slice(2,6).toUpperCase()+'#7';$('#pw').type='text'};
 $('#ph').onchange=ev=>{const f=ev.target.files[0];if(!f)return;const r=new FileReader();r.onload=()=>{const i=new Image();i.onload=()=>{const c=document.createElement('canvas'),s=Math.min(1,200/Math.max(i.width,i.height));c.width=i.width*s;c.height=i.height*s;c.getContext('2d').drawImage(i,0,0,c.width,c.height);photo=c.toDataURL('image/jpeg',.8);$('#pv').innerHTML=`<img class="av" style="width:64px;height:64px" src="${photo}">`};i.src=r.result};r.readAsDataURL(f)};
 if(id)$('#del').onclick=()=>{if(confirm('Delete this person and their records?')){S.emps=S.emps.filter(x=>x.id!==id);Object.keys(S.att).forEach(k=>k.startsWith(id+'|')&&delete S.att[k]);S.pay=S.pay.filter(p=>p.empId!==id);save();close();render()}};
 $('#f').onsubmit=async ev=>{ev.preventDefault();const f=new FormData(ev.target),o=id?e:{id:uid()};
  const user=f.get('user').trim();if(S.emps.some(x=>x.user===user&&x.id!==o.id))return alert('That username is already taken.');
  Object.assign(o,{name:f.get('name').trim(),dob:f.get('dob'),type:f.get('type'),pos:f.get('pos'),email:f.get('email'),phone:f.get('phone'),user,photo,bio:Object.fromEntries(BIO.map(b=>[b,f.has('b_'+b)]))});
  if(f.get('pass'))o.pass=await sha(f.get('pass'));
  if(!id)S.emps.push(o);save();close();render();
  if(f.get('pass')&&!id)alert('Saved. Share these credentials with the person:\nUsername: '+user+'\nPassword: '+f.get('pass')+'\n(Passwords are stored hashed and cannot be viewed again.)')}}
window.__page=employees;employees();
