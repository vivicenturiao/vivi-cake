var MES=['janeiro','fevereiro','março','abril','maio','junho','julho','agosto','setembro','outubro','novembro','dezembro'];
var DIA=['domingo','segunda','terça','quarta','quinta','sexta','sábado'];
var orders={};
var fixos=[];
var fichas=[];
var cardapio=[];
var estoque=[];
var KEY='vivicake-v4';
function saveLocal(){try{localStorage.setItem(KEY,JSON.stringify({orders:orders,estoque:estoque,fichas:fichas,cardapio:cardapio,fixos:fixos}))}catch(e){}}
function save(){saveLocal();if(typeof syncDirty==='function')syncDirty()}
try{var sv0=JSON.parse(localStorage.getItem(KEY)||'null');if(sv0){orders=sv0.orders||orders;estoque=sv0.estoque||estoque;fichas=sv0.fichas||fichas;cardapio=sv0.cardapio||cardapio;fixos=sv0.fixos||fixos}}catch(e){}
var brl=function(v){return 'R$ '+(+v||0).toFixed(2).replace('.',',').replace(/\B(?=(\d{3})+(?!\d))/g,'.')};
var RM=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches;
var pad=function(n){return n<10?'0'+n:''+n};
var td=new Date(),cy=td.getFullYear(),cm=td.getMonth(),sel=null,form=false,ed=null;
var key=function(y,m,d){return y+'-'+pad(m+1)+'-'+pad(d)};
var $=function(i){return document.getElementById(i)};
function cal(){$('mt').textContent=MES[cm][0].toUpperCase()+MES[cm].slice(1)+' de '+cy;var h='';
['D','S','T','Q','Q','S','S'].forEach(function(w){h+='<span class="w">'+w+'</span>'});
var f=new Date(cy,cm,1).getDay(),n=new Date(cy,cm+1,0).getDate();
for(var i=0;i<f;i++)h+='<button class="d e"></button>';
for(var d=1;d<=n;d++){var k=key(cy,cm,d),c='d'+(orders[k]&&orders[k].length?' has':'')+(k===key(td.getFullYear(),td.getMonth(),td.getDate())?' today':'')+(k===sel?' sel':'');h+='<button class="'+c+'" data-k="'+k+'">'+d+'</button>'}
$('cal').innerHTML=h;
$('cal').querySelectorAll('.d[data-k]').forEach(function(b){b.onclick=function(){sel=b.dataset.k;form=false;cal();day()}})}
function esc(s){return String(s).replace(/[&<>"]/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})}
function gAuto(){try{return localStorage.getItem('vivicake-gauto')!=='0'}catch(e){return true}}
function hm(o){var m=String(o.h||'').match(/(\d{1,2})(?:\s*[:hH]\s*(\d{2}))?/);return m?[Math.min(23,+m[1]),m[2]?Math.min(59,+m[2]):0]:[9,0]}
function stamp(k,H,M){return k.replace(/-/g,'')+'T'+pad(H)+pad(M)+'00'}
function gcal(k,o){var t=hm(o),p=k.split('-'),e=new Date(+p[0],+p[1]-1,+p[2],t[0]+1,t[1]),ek=key(e.getFullYear(),e.getMonth(),e.getDate());
return 'https://calendar.google.com/calendar/render?action=TEMPLATE&text='+encodeURIComponent('Entrega: '+o.b+' ('+o.c+')')+'&dates='+stamp(k,t[0],t[1])+'/'+stamp(ek,e.getHours(),e.getMinutes())+'&ctz=America/Sao_Paulo&details='+encodeURIComponent('Cliente: '+o.c+'\nTelefone: '+o.t+'\nBolo: '+o.b+' · '+o.s+'\nValor: '+brl(o.v)+'\nObs.: '+o.o+'\n\nVivi Cake')}
function lbl(k){var q=k.split('-'),dt=new Date(+q[0],+q[1]-1,+q[2]);return DIA[dt.getDay()]+', '+(+q[2])+' de '+MES[dt.getMonth()]}
var CAL='<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3.5" y="5" width="17" height="15" rx="3"/><path d="M3.5 10h17M8 3v4M16 3v4M12 13v4M10 15h4"/></svg>',SPK='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 9v6h4l5 4V5L8 9z"/><path d="M16.5 8.5a5 5 0 0 1 0 7"/></svg>';
function day(){var p=$('dp');if(!sel)sel=key(td.getFullYear(),td.getMonth(),td.getDate());
var L=(orders[sel]||[]).slice().sort(function(a,b){var x=hm(a),y=hm(b);return x[0]*60+x[1]-y[0]*60-y[1]});orders[sel]&&(orders[sel]=L);
var h='<div class="dh"><div><h3>'+lbl(sel)+'</h3><span class="m">'+(L.length?L.length+(L.length>1?' pedidos':' pedido'):'Nenhum pedido neste dia')+'</span></div><div class="dact">'+(L.length?'<button class="btn soft sm" id="sd">'+SPK+'Ouvir</button>':'')+'<button class="btn sm" id="np">'+(form?'Cancelar':'+ Novo pedido')+'</button></div></div>';
var E=form&&ed!=null&&L[ed]?L[ed]:null,ev=function(k){var v=E?E[k]:'';return v&&v!=='—'?esc(String(v)):''};
if(form)h+='<div class="ord fo">'+(E?'<div class="t" style="margin-bottom:6px">Editando pedido</div>':'')+'<label class="fl">Data da entrega<input id="fdt" type="date" value="'+sel+'"></label><label class="fl">Cliente<input id="fc" autocomplete="name" value="'+ev('c')+'"></label><label class="fl">Telefone<input id="ft" type="tel" inputmode="tel" value="'+ev('t')+'"></label><label class="fl">Bolo<input id="fb" list="cdl" placeholder="Escolha do cardápio ou digite" value="'+ev('b')+'"></label><datalist id="cdl">'+cardapio.map(function(c){return '<option value="'+esc(c[0])+'">'}).join('')+'</datalist><div class="two"><label class="fl">Quantidade<input id="fs" placeholder="1 unidade" value="'+ev('s')+'"></label><label class="fl">Horário<input id="fh" placeholder="14h" value="'+ev('h')+'"></label></div><label class="fl">Valor (R$)<input id="fv" type="number" inputmode="decimal" step="any" value="'+(E&&E.v?E.v:'')+'"></label><label class="fl">Observações<input id="fo" value="'+ev('o')+'"></label><label class="ck"><input type="checkbox" id="fg"'+(gAuto()&&!E?' checked':'')+'> Abrir o Google Agenda para salvar o aviso</label><button class="btn" id="sv" style="margin-top:10px;width:100%">'+(E?'Salvar alterações':'Salvar pedido')+'</button></div>';
if(!L.length&&!form)h+='<div class="empty-day">Dia livre. Toque em <b>+ Novo pedido</b> para agendar uma entrega.</div>';
L.forEach(function(o,i){h+='<div class="ord"><div class="oh"><div class="av">'+esc(o.c[0]||'?')+'</div><div><div class="t">'+esc(o.c)+'</div><div class="m">'+esc(o.t)+'</div></div></div><div class="ob">'+esc(o.b)+'</div><div class="tags"><span class="tagr">'+esc(o.h)+'</span><span class="tagr">'+esc(o.s)+'</span><span class="tagr">'+brl(o.v)+'</span></div>'+(o.o&&o.o!=='—'?'<div class="m" style="margin-top:8px">'+esc(o.o)+'</div>':'')+'<div class="oa"><a class="btn soft sm" href="'+gcal(sel,o)+'" target="_blank" rel="noopener">'+CAL+'Adicionar ao Google Agenda</a><button class="btn ghost sm eo" data-i="'+i+'">'+EDI+'Editar</button><button class="btn soft sm rm" data-i="'+i+'">Remover</button></div></div>'});
p.innerHTML=h;reveal(p.querySelectorAll('.ord,.empty-day'),.04);
p.querySelectorAll('.rm').forEach(function(b){b.onclick=function(){var o=orders[sel][+b.dataset.i];if(!confirm('Remover o pedido de '+o.c+'?'))return;orders[sel].splice(+b.dataset.i,1);save();cal();day();money();hero();toast('Pedido removido')}});
p.querySelectorAll('.eo').forEach(function(b){b.onclick=function(){ed=+b.dataset.i;form=true;day();$('fc').focus();$('dp').querySelector('.fo').scrollIntoView({behavior:'smooth',block:'center'})}});
$('np').onclick=function(){form=!form;ed=null;day();if(form)$('fc').focus()};if($('sd'))$('sd').onclick=function(){speak(sel)};
if(form){$('fb').oninput=function(){var c=cardapio.filter(function(x){return norm(x[0])===norm($('fb').value)})[0];if(c&&!$('fv').value)$('fv').value=c[2]};
$('sv').onclick=function(){var c=$('fc').value.trim(),b=$('fb').value.trim();if(!c||!b){toast('Preencha cliente e bolo para salvar');return}
var no={c:c,t:$('ft').value||'—',b:b,s:$('fs').value||'1 unidade',h:$('fh').value||'—',v:+String($('fv').value).replace(',','.')||0,o:$('fo').value||'—'},ga=$('fg').checked;try{localStorage.setItem('vivicake-gauto',ga?'1':'0')}catch(e){}
var dk=/^\d{4}-\d{2}-\d{2}$/.test($('fdt').value)?$('fdt').value:sel,was=ed!=null;if(was&&orders[sel])orders[sel].splice(ed,1);if(orders[sel]&&!orders[sel].length)delete orders[sel];(orders[dk]=orders[dk]||[]).push(no);if(dk!==sel){sel=dk;var pd=dk.split('-');cy=+pd[0];cm=+pd[1]-1}save();if(ga)window.open(gcal(dk,no),'_blank','noopener');form=false;ed=null;cal();day();money();hero();toast(ga?'Pedido salvo. Agora toque em Salvar no Google Agenda':(was?'Pedido atualizado':'Pedido salvo'))}}}
$('pv').onclick=function(){cm--;if(cm<0){cm=11;cy--}cal();money()};$('nx').onclick=function(){cm++;if(cm>11){cm=0;cy++}cal();money()};
function vt(t,L,w){return '<table class="ft"><tr><th colspan="'+(w||2)+'">'+t+'</th></tr>'+L.join('')+'</table>'}
function fv(f){var n=function(i){return '<td class="n">'+(i+1)+'</td>'},q=function(x,i){return '<tr>'+n(i)+'<td>'+x[0]+'</td><td class="r">'+x[1]+' '+x[2]+'</td></tr>'},h=vt('INGREDIENTES',f.i.map(q),3);
if(f.e&&f.e.length)h+=vt('EMBALAGEM',f.e.map(q),3);var any=0;
[['UTENSÍLIOS','u'],['PRÉ-PRODUÇÃO','p'],['FINALIZAÇÃO','f']].forEach(function(s){var L=f[s[1]]||[];if(L.length){any=1;h+=vt(s[0],L.map(function(x,i){return '<tr>'+n(i)+'<td>'+x+'</td></tr>'}))}});
if(!any)h+='<p class="m">Utensílios e modo de preparo: preencha no Word baixado.</p>';return h}
var TAG='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 12V4h8l10 10-8 8z"/><circle cx="7.5" cy="8.5" r="1.5"/></svg>';
var EDI='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 20h4L19 9l-4-4L4 16z"/><path d="M13.5 6.5l4 4"/></svg>';
var DLI='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 4v11M7 10l5 5 5-5M5 20h14"/></svg>';
function norm(s){return String(s).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'')}
function rl(){var q=norm($('rq').value.trim()),a=0,b=0;
$('fl').innerHTML=fichas.map(function(f,k){if(q&&norm(f.n+' '+(f.t||'')+' '+f.i.map(function(x){return x[0]}).join(' ')).indexOf(q)<0)return '';a++;return '<div class="fc"><div class="row"><div><div class="t">'+f.n+'</div><div class="meta"><span>'+f.r+'</span>'+(f.va?'<span>Validade '+f.va.toLowerCase()+'</span>':'')+(f.c&&f.c!=='—'?'<span>Custo <b>'+f.c+'</b></span>':'')+(f.pv?'<span>Venda <b>'+f.pv+'</b></span>':'')+'</div></div><div class="cr"><button class="btn ghost sm ef" data-k="'+k+'">'+EDI+'Editar</button><button class="btn soft sm dlb" data-k="f:'+k+'">'+DLI+'Baixar ficha</button></div></div><div class="ia"><button class="lk xf" data-k="'+k+'">Remover ficha</button></div><details><summary class="m">Ver ficha completa</summary>'+fv(f)+'</details></div>'}).join('')||(fichas.length?'<div class="empty">Nenhuma ficha encontrada para essa busca.</div>':'<div class="empty">Nenhuma ficha técnica ainda.<br>Toque em <b>+ Nova ficha</b> para cadastrar a primeira receita.</div>');
$('cd').innerHTML=cardapio.map(function(c,k){if(q&&norm(c[0]+' '+c[1]).indexOf(q)<0)return '';b++;return '<div class="fc"><div class="row"><div><div class="t">'+esc(c[0])+'</div><div class="meta">'+(c[3]?'<span>'+esc(c[3])+'</span>':'')+(c[1]?'<span>'+esc(c[1])+'</span>':'')+'</div></div><div class="cr"><span class="tagr">'+brl(c[2])+uLbl(c[4])+'</span><button class="btn ghost sm ps" data-k="'+k+'">'+TAG+'Preço sugerido</button><button class="btn ghost sm ec" data-k="'+k+'">'+EDI+'Editar</button><button class="btn soft sm dlb" data-k="c:'+k+'">'+DLI+'Baixar item do cardápio</button></div></div><div class="ia"><button class="lk xc" data-k="'+k+'">Remover do cardápio</button></div></div>'}).join('')||(cardapio.length?'<div class="empty">Nenhum item encontrado para essa busca.</div>':'<div class="empty">O cardápio está vazio.<br>Toque em <b>+ Novo item</b> ou cadastre uma ficha com preço de venda.</div>');
document.querySelectorAll('.dlb[data-k="f"]').forEach(function(b){b.disabled=!fichas.length});document.querySelectorAll('.dlb[data-k="c"]').forEach(function(b){b.disabled=!cardapio.length});
$('rc').textContent=q?'Encontrado: '+a+' de '+fichas.length+' fichas e '+b+' de '+cardapio.length+' itens do cardápio':''}
rl();$('rq').oninput=rl;var _rl=rl;rl=function(){_rl();if(typeof cdView==='function'&&cdv==='p')cdView()};
var gt='c',fq='';
function migE(){(estoque||[]).forEach(function(e){if(e.length<6){var t=+e[2]||0;e[5]=(e[3]==='g'||e[3]==='ml')?t:0;if(e[3]==='g'||e[3]==='ml')e[2]=0}})}migE();
var emb=function(e){return e[5]?nf(e[5])+' '+e[3]:(e[3]==='und'?'unidade':e[3])};
var val=function(e){return e[1]*(e[4]||0)},isLow=function(e){return e[2]>0&&e[1]<=e[2]};
var nf=function(v){return (Math.round(v*100)/100).toString().replace('.',',')};
function bars(L,fmt){var mx=Math.max.apply(null,L.map(function(x){return x[1]}))||1;return L.map(function(x){return '<div class="br"><span class="bn">'+esc(x[0])+'</span><div class="bt"><i class="'+(x[2]?'lo':'')+'" style="width:'+Math.max(3,x[1]/mx*100)+'%"></i></div><span class="bv">'+fmt(x[1])+'</span></div>'}).join('')}
function gr(){var h='';
if(gt==='c'){var L=estoque.filter(function(e){return val(e)>0}).sort(function(a,b){return val(b)-val(a)}).slice(0,10).map(function(e){return [e[0],val(e),isLow(e)]});h=L.length?bars(L,brl):'<p class="m">Digite as quantidades na tabela para ver o custo do estoque.</p>'}
else{var ph=function(e){var t=e[1]*(e[5]||1);return e[3]==='g'?['kg',e[5]?t/1000:e[1]/1000]:e[3]==='ml'?['L',e[5]?t/1000:e[1]/1000]:e[3]==='kg'||e[3]==='L'?[e[3],t]:['und',e[1]]};[['kg','Peso (kg)'],['L','Volume (L)'],['und','Unidades']].forEach(function(g){var L=estoque.filter(function(e){return ph(e)[0]===g[0]&&e[1]>0}).map(function(e){return [e[0],ph(e)[1],isLow(e)]}).sort(function(a,b){return b[1]-a[1]}).slice(0,6);if(L.length)h+='<div class="gh">'+g[1]+'</div>'+bars(L,function(v){return nf(v)+' '+g[0]})});if(!h)h='<p class="m">Digite as quantidades na tabela para ver o estoque físico.</p>'}
if(estoque.some(function(e){return isLow(e)&&e[1]>0}))h+='<p class="m bkey"><i></i>Abaixo do mínimo: precisa repor</p>';$('gb').innerHTML=h;document.querySelectorAll('.gt').forEach(function(b){b.classList.toggle('on',b.dataset.g===gt)});
var tot=0,low=0,n=0;estoque.forEach(function(e){tot+=val(e);if(isLow(e))low++;if(e[1]>0)n++});
if(!$('kp').firstChild)$('kp').innerHTML='<div class="kc rv"><span class="m">Valor em estoque</span><b id="k1"></b></div><div class="kc rv"><span class="m">Itens com estoque</span><b id="k2"></b></div><div class="kc rv"><span class="m">Para repor</span><b id="k3"></b></div>';
count($('k1'),tot,brl);count($('k2'),n,function(v){return Math.round(v)+' de '+estoque.length});count($('k3'),low,function(v){return Math.round(v)});$('k3').parentNode.classList.toggle('warn',low>0)}
function row(i){var r=$('r'+i);if(!r)return;var e=estoque[i];r.querySelector('.vv').textContent=brl(val(e));r.classList.toggle('lowr',isLow(e))}
function stk(){var q=norm(fq),N=function(i,f,v,lab,suf,pre){return '<label class="qi'+(pre?' cv':'')+'">'+(pre?'<span class="pre">R$</span>':'')+'<input type="text" inputmode="decimal" data-i="'+i+'" data-f="'+f+'" value="'+(v?(pre?(+v).toFixed(2):String(v)).replace('.',','):'')+'" placeholder="0" aria-label="'+lab+'">'+(suf?'<span>'+suf+'</span>':'')+'</label>'};
$('sk').innerHTML='<table class="stt"><thead><tr><th>Insumo</th><th>Embalagem</th><th>Quantidade</th><th>Valor da unidade</th><th>Total</th></tr></thead><tbody>'+estoque.map(function(e,i){if(q&&norm(e[0]).indexOf(q)<0)return '';var u=esc(e[3]),nm=esc(e[0]);return '<tr id="r'+i+'"><td><div class="t">'+nm+'</div><div class="m">'+(e[2]?'Mínimo '+nf(e[2])+' und':'Sem mínimo')+'<span class="rp">Repor</span></div><button class="lk ei" data-i="'+i+'">'+EDI+'Editar</button></td><td>'+N(i,5,e[5],'Tamanho da embalagem de '+nm,u)+'</td><td>'+N(i,1,e[1],'Quantidade de '+nm,'und')+'</td><td>'+N(i,4,e[4],'Valor da unidade de '+nm,'',1)+'</td><td class="vv"></td></tr>'}).join('')+'</tbody></table>';
$('sk').querySelectorAll('input').forEach(function(b){b.oninput=function(){var e=estoque[+b.dataset.i];e[+b.dataset.f]=Math.max(0,parseFloat(String(b.value).replace(',','.'))||0);save();row(+b.dataset.i);gr()}});
$('sk').querySelectorAll('.ei').forEach(function(b){b.onclick=function(){formIns(+b.dataset.i)}});
estoque.forEach(function(e,i){row(i)})}
function toast(t){var x=$('ts');x.textContent=t;x.classList.add('on');clearTimeout(x._t);x._t=setTimeout(function(){x.classList.remove('on')},2600)}
function xe(s){return String(s).replace(/[&<>]/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;'}[c]})}
function par(t,o){o=o||{};return '<w:p><w:pPr><w:spacing w:after="'+(o.a||120)+'"/></w:pPr><w:r><w:rPr>'+(o.b?'<w:b/>':'')+'<w:color w:val="'+(o.c||'3D2B35')+'"/><w:sz w:val="'+(o.z||22)+'"/></w:rPr><w:t xml:space="preserve">'+xe(t)+'</w:t></w:r></w:p>'}
var G='D9D9D9';
function tc(w,t,o){o=o||{};return '<w:tc><w:tcPr><w:tcW w:w="'+w+'" w:type="dxa"/>'+(o.s?'<w:gridSpan w:val="'+o.s+'"/>':'')+(o.f?'<w:shd w:val="clear" w:color="auto" w:fill="'+o.f+'"/>':'')+'</w:tcPr><w:p><w:pPr><w:spacing w:before="40" w:after="40"/>'+(o.j?'<w:jc w:val="'+o.j+'"/>':'')+'</w:pPr><w:r><w:rPr>'+(o.b?'<w:b/>':'')+'<w:sz w:val="20"/></w:rPr><w:t xml:space="preserve">'+xe(t)+'</w:t></w:r></w:p></w:tc>'}
function tb(g,rows){return '<w:tbl><w:tblPr><w:tblW w:w="9638" w:type="dxa"/><w:tblBorders>'+['top','left','bottom','right','insideH','insideV'].map(function(s){return '<w:'+s+' w:val="single" w:sz="6" w:space="0" w:color="444444"/>'}).join('')+'</w:tblBorders><w:tblLayout w:type="fixed"/></w:tblPr><w:tblGrid>'+g.map(function(x){return '<w:gridCol w:w="'+x+'"/>'}).join('')+'</w:tblGrid>'+rows.map(function(r){return '<w:tr>'+r+'</w:tr>'}).join('')+'</w:tbl>'}
var GAP='<w:p><w:pPr><w:spacing w:after="0"/></w:pPr></w:p>';
function fill(L,n){L=(L||[]).slice();while(L.length<n)L.push('');return L}
function sec(t,L){return tb([600,9038],[tc(9638,t,{s:2,f:G,b:1,j:'center'})].concat(L.map(function(x,i){return tc(600,i+1,{j:'center'})+tc(9038,x)})))}
function ig(t,L){var c={b:1,f:G,j:'center'};return tb([600,5538,1750,1750],[tc(600,'',{f:G})+tc(5538,t,c)+tc(1750,'QTD',c)+tc(1750,'UND',c)].concat(L.map(function(x,i){return tc(600,i+1,{j:'center'})+tc(5538,x[0])+tc(1750,x[1],{j:'center'})+tc(1750,x[2],{j:'center'})})))}
function fx(f){var h={b:1,f:G},R=[['Produção',f.n,1],['Rendimento',f.r]];if(f.va)R.push(['Validade',f.va]);R.push(['Custo de produção',f.c]);if(f.pv)R.push(['Preço de venda',f.pv]);
var t1=tb([2200,7438],R.map(function(r){return tc(2200,r[0],h)+tc(7438,r[1],{j:'center',b:r[2]})}));
return par('VIVI CAKE',{b:1,z:30,c:'B5586F',a:40})+par('Ficha técnica',{c:'9A8590',a:120})+t1+GAP+ig('INGREDIENTES',f.i)+(f.e&&f.e.length?GAP+ig('EMBALAGEM',f.e):'')+GAP+sec('UTENSÍLIOS',fill(f.u,5))+GAP+sec('PRÉ-PRODUÇÃO',fill(f.p,6))+GAP+sec('FINALIZAÇÃO',fill(f.f,3))}
function mk(kind){var b=[];
if(kind[0]==='f'){var x=kind.split(':')[1],L=x===undefined?fichas:[fichas[+x]];b.push(L.map(fx).join('<w:p><w:r><w:br w:type="page"/></w:r></w:p>'),GAP)}
else{var y=kind.split(':')[1],cx=y===undefined?cardapio:[cardapio[+y]];b.push(par('Vivi Cake — Cardápio',{b:1,z:40,c:'B5586F',a:240}));var lc=null;cx.forEach(function(c){var ct=c[3]||'';if(ct!==lc&&y===undefined){b.push(par(ct||'Cardápio',{b:1,z:30,c:'E2557E',a:120}));lc=ct}b.push(par(c[0]+' — '+brl(c[2])+uLbl(c[4]),{b:1,z:26,a:c[1]?40:160}));if(c[1])b.push(par(c[1],{c:'9A8590',a:160}))})}
return b.join('')}
function slug(s){return s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'')}
function fname(kind){var x=kind.split(':')[1],f=kind[0]==='f';if(x===undefined)return f?'vivi-cake-fichas-tecnicas.docx':'vivi-cake-cardapio.docx';return (f?'':'cardapio-')+slug(f?fichas[+x].n:cardapio[+x][0])+'.docx'}
function crc(u){var t=crc.t;if(!t){t=crc.t=[];for(var n=0;n<256;n++){var c=n;for(var k=0;k<8;k++)c=c&1?0xEDB88320^(c>>>1):c>>>1;t[n]=c>>>0}}var r=-1;for(var i=0;i<u.length;i++)r=t[(r^u[i])&255]^(r>>>8);return(r^-1)>>>0}
function zip(fs){var e=new TextEncoder(),P=[],C=[],off=0;
fs.forEach(function(f){var n=e.encode(f[0]),d=e.encode(f[1]),c=crc(d);
var h=new DataView(new ArrayBuffer(30));h.setUint32(0,0x04034b50,true);h.setUint16(4,20,true);h.setUint16(6,0x0800,true);h.setUint16(12,0x21,true);h.setUint32(14,c,true);h.setUint32(18,d.length,true);h.setUint32(22,d.length,true);h.setUint16(26,n.length,true);
P.push(new Uint8Array(h.buffer),n,d);
var g=new DataView(new ArrayBuffer(46));g.setUint32(0,0x02014b50,true);g.setUint16(4,20,true);g.setUint16(6,20,true);g.setUint16(8,0x0800,true);g.setUint16(14,0x21,true);g.setUint32(16,c,true);g.setUint32(20,d.length,true);g.setUint32(24,d.length,true);g.setUint16(28,n.length,true);g.setUint32(42,off,true);
C.push(new Uint8Array(g.buffer),n);off+=30+n.length+d.length});
var cs=C.reduce(function(a,x){return a+x.length},0),r=new DataView(new ArrayBuffer(22));r.setUint32(0,0x06054b50,true);r.setUint16(8,fs.length,true);r.setUint16(10,fs.length,true);r.setUint32(12,cs,true);r.setUint32(16,off,true);
return new Blob(P.concat(C,[new Uint8Array(r.buffer)]),{type:'application/vnd.openxmlformats-officedocument.wordprocessingml.document'})}
async function out(blob,name){var cl=window.claude;if(cl&&cl.use){var dn=null;try{dn=await cl.use('downloads')}catch(e){}if(dn){try{await dn.save({filename:name,data:blob});if(/\.docx$/.test(name))toast('Arquivo Word baixado');return true}catch(e){var c=e&&e.code;if(c==='declined')return false;toast(c==='rejected_extension'||c==='extension_not_enabled'?'Este formato só baixa pelo app no GitHub Pages':'Não foi possível baixar nesta tela');return false}}}
try{var f=new File([blob],name,{type:blob.type});
if(/iPhone|iPad|Android/i.test(navigator.userAgent)&&navigator.canShare&&navigator.canShare({files:[f]})){await navigator.share({files:[f],title:name});return true}}catch(e){if(e&&e.name==='AbortError')return false}
var a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=name;document.body.appendChild(a);a.click();a.remove();setTimeout(function(){URL.revokeObjectURL(a.href)},4000);if(/\.docx$/.test(name))toast('Arquivo Word baixado');return true}
async function dl(kind){if(kind==='f'&&!fichas.length){toast('Cadastre uma ficha primeiro');return}if(kind==='c'&&!cardapio.length){toast('Cadastre um item do cardápio primeiro');return}var ns='xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"';var z={f:[],file:function(n,c){this.f.push([n,c])}};
z.file('[Content_Types].xml','<?xml version="1.0" encoding="UTF-8"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/></Types>');
z.file('_rels/.rels','<?xml version="1.0" encoding="UTF-8"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/></Relationships>');
z.file('word/document.xml','<?xml version="1.0" encoding="UTF-8"?><w:document '+ns+'><w:body>'+mk(kind)+'<w:sectPr><w:pgSz w:w="11906" w:h="16838"/><w:pgMar w:top="1134" w:right="1134" w:bottom="1134" w:left="1134"/></w:sectPr></w:body></w:document>');
await out(zip(z.f),fname(kind))}
document.addEventListener('click',function(e){var b=e.target.closest&&e.target.closest('.dlb');if(b)dl(b.dataset.k)});
document.querySelectorAll('nav button').forEach(function(b){b.onclick=function(){if(b.classList.contains('on'))return;document.querySelectorAll('nav button,.pg').forEach(function(x){x.classList.remove('on');x.removeAttribute('aria-current')});b.classList.add('on');b.setAttribute('aria-current','page');var pg=$(b.dataset.p);pg.classList.add('on');ind();window.scrollTo({top:0,behavior:RM?'auto':'smooth'});reveal(pg.querySelectorAll('.rv'));if(b.dataset.p==='est'){gr()}if(b.dataset.p==='ped'){hero();money()}if(b.dataset.p==='cus'){cus()}}});
window.addEventListener('resize',function(){ind(true)});

/* ---------- motion ---------- */
function reveal(els,step){els=[].slice.call(els||[]);if(RM||!els.length)return;step=step||.06;
var M=window.Motion;try{if(M&&M.animate&&M.stagger){els.forEach(function(e){e.style.opacity=0});M.animate(els,{opacity:[0,1],transform:['translateY(16px)','translateY(0px)'],filter:['blur(8px)','blur(0px)']},{delay:M.stagger(step),duration:.65,ease:[.22,1,.36,1]});return}}catch(e){}
els.forEach(function(e,i){e.animate&&e.animate([{opacity:0,transform:'translateY(16px)',filter:'blur(8px)'},{opacity:1,transform:'none',filter:'blur(0)'}],{duration:650,delay:i*step*1000,easing:'cubic-bezier(.22,1,.36,1)',fill:'backwards'})})}
function count(el,to,fmt){if(!el)return;var from=+el.dataset.v||0;el.dataset.v=to;if(RM||from===to){el.textContent=fmt(to);return}
var t0=performance.now(),d=900;cancelAnimationFrame(el._r);(function f(t){var p=Math.min(1,(t-t0)/d),e=1-Math.pow(1-p,3);el.textContent=fmt(from+(to-from)*e);if(p<1)el._r=requestAnimationFrame(f)})(t0)}
function ind(now){var n=document.querySelector('nav'),b=n.querySelector('button.on'),i=n.querySelector('.ind');if(!b)return;if(now){i.style.transition='none';setTimeout(function(){i.style.transition=''},50)}
i.style.width=b.offsetWidth+'px';i.style.height=b.offsetHeight+'px';i.style.transform='translate('+b.offsetLeft+'px,'+b.offsetTop+'px)'}

/* ---------- hero ---------- */
function todayK(){return key(td.getFullYear(),td.getMonth(),td.getDate())}
function hero(){var hr=new Date().getHours(),k=todayK(),L=orders[k]||[],wk=0,mo=0;
$('hi').textContent=(hr<12?'Bom dia':hr<18?'Boa tarde':'Boa noite')+', Vivi';
for(var i=0;i<7;i++){var d=new Date(td.getFullYear(),td.getMonth(),td.getDate()+i);wk+=(orders[key(d.getFullYear(),d.getMonth(),d.getDate())]||[]).length}
Object.keys(orders).forEach(function(x){var p=x.split('-');if(+p[0]===td.getFullYear()&&+p[1]-1===td.getMonth())orders[x].forEach(function(o){mo+=+o.v||0})});
var nx=L.slice().sort(function(a,b){var x=hm(a),y=hm(b);return x[0]*60+x[1]-y[0]*60-y[1]})[0];
var hasH=nx&&/\d/.test(String(nx.h));$('hs').textContent=L.length?'Hoje você tem '+L.length+(L.length>1?' entregas':' entrega')+(hasH?'. A primeira é às '+nx.h+'.':'.'):'Nenhuma entrega hoje. Um bom dia para adiantar a produção.';
if(!$('hst').firstChild)$('hst').innerHTML='<div><b id="h1"></b><span>Pedidos hoje</span></div><div><b id="h2"></b><span>Próximos 7 dias</span></div><div><b id="h3"></b><span>Vendido no mês</span></div>';
count($('h1'),L.length,function(v){return Math.round(v)});count($('h2'),wk,function(v){return Math.round(v)});count($('h3'),mo,function(v){return brl(v).replace(/,\d\d$/,'')})}

/* ---------- money pies ---------- */
var COLS=['var(--s1)','var(--s2)','var(--s3)','var(--s4)','var(--s5)'];
function fcost(b){var f=fichas.filter(function(x){return norm(x.n)===norm(b)})[0];if(!f||!f.c)return null;var v=parseFloat(String(f.c).replace(/[^\d,]/g,'').replace(',','.'));return isNaN(v)?null:v}
function qty(o){var m=String(o.s||'').match(/\d+/);return m?Math.max(1,+m[0]):1}
function monthOrders(){var L=[];Object.keys(orders).forEach(function(x){var p=x.split('-');if(+p[0]===cy&&+p[1]-1===cm)orders[x].forEach(function(o){L.push(o)})});return L}
function fold(rows,max){rows.sort(function(a,b){return b[1]-a[1]});if(rows.length<=max)return rows;var top=rows.slice(0,max-1),rest=rows.slice(max-1).reduce(function(a,r){return a+r[1]},0);top.push(['Outros',rest,1]);return top}
function pie(id,title,rows,note,emptyMsg){rows=rows.filter(function(r){return r[1]>0});var tot=rows.reduce(function(a,r){return a+r[1]},0),el=$(id);
var h='<div class="row"><h3>'+title+'</h3><span class="m" style="text-transform:capitalize">'+MES[cm]+'</span></div>';
if(!tot){el.innerHTML=h+'<div class="empty">'+emptyMsg+'</div>';return}
var a0=-Math.PI/2,R=72,C=75,paths='',lg='';
rows.forEach(function(r,i){var col=r[2]?'var(--s0)':COLS[i%5],fr=r[1]/tot,a1=a0+fr*Math.PI*2,d;
if(fr>=.9999)d='M'+C+' '+(C-R)+'A'+R+' '+R+' 0 1 1 '+(C-.01)+' '+(C-R)+'Z';else{var x0=C+R*Math.cos(a0),y0=C+R*Math.sin(a0),x1=C+R*Math.cos(a1),y1=C+R*Math.sin(a1);d='M'+C+' '+C+'L'+x0.toFixed(2)+' '+y0.toFixed(2)+'A'+R+' '+R+' 0 '+(fr>.5?1:0)+' 1 '+x1.toFixed(2)+' '+y1.toFixed(2)+'Z'}
var pct=Math.round(fr*100);paths+='<path d="'+d+'" fill="'+col+'" stroke="var(--card)" stroke-width="2" stroke-linejoin="round" data-i="'+i+'" data-t="'+esc(r[0])+'|'+brl(r[1])+' ('+pct+'%)"/>';
lg+='<li data-i="'+i+'"><i style="background:'+col+'"></i><span class="ln">'+esc(r[0])+'</span><span class="lv">'+brl(r[1]).replace(/,\d\d$/,'')+' · '+pct+'%</span></li>';a0=a1});
el.innerHTML=h+'<div class="tot" data-v="0"></div><div class="pie"><div class="pw"><svg viewBox="0 0 150 150" role="img" aria-label="'+esc(title)+'">'+paths+'</svg></div><ul class="lgd">'+lg+'</ul></div>'+(note||'');
count(el.querySelector('.tot'),tot,brl);
var svg=el.querySelector('svg');if(!RM&&svg.animate)svg.animate([{transform:'rotate(-90deg) scale(.6)',opacity:0},{transform:'none',opacity:1}],{duration:800,easing:'cubic-bezier(.22,1,.36,1)'});
function hl(i,e){el.querySelectorAll('path').forEach(function(p){p.classList.toggle('dim',i!=null&&p.dataset.i!=i);p.classList.toggle('hi',i!=null&&p.dataset.i==i)});el.querySelectorAll('.lgd li').forEach(function(l){l.classList.toggle('hi',l.dataset.i==i)});
var tp=$('tip');if(i==null||!e){tp.classList.remove('on');return}var p=el.querySelector('path[data-i="'+i+'"]').dataset.t.split('|');tp.innerHTML='<b>'+p[0]+'</b><br>'+p[1];tp.style.left=Math.min(innerWidth-180,e.clientX+14)+'px';tp.style.top=(e.clientY+14)+'px';tp.classList.add('on')}
el.querySelectorAll('path,.lgd li').forEach(function(p){p.onmousemove=function(e){hl(p.dataset.i,p.tagName==='path'?e:null)};p.onmouseleave=function(){hl(null)};p.onclick=function(e){hl(p.dataset.i,e);clearTimeout(el._t);el._t=setTimeout(function(){hl(null)},2200)}})}
function money(){var L=monthOrders(),by={},rev=0,mp=0,miss=0;
L.forEach(function(o){var v=+o.v||0;rev+=v;by[o.b]=(by[o.b]||0)+v;var c=fcost(o.b);if(c==null)miss++;else mp+=c*qty(o)});
var fx=fixos.reduce(function(a,r){return a+r[1]},0);
pie('fat','Faturamento do mês',fold(Object.keys(by).map(function(k){return [k,by[k]]}),5),'<div class="pnote"><span>'+L.length+(L.length===1?' pedido':' pedidos')+' no mês</span><span>Ticket médio <b>'+brl(L.length?rev/L.length:0)+'</b></span></div>','Nenhum pedido em '+MES[cm]+'. Os valores aparecem aqui assim que você cadastrar pedidos.');
var fr=fold(fixos.filter(function(r){return r[1]>0}).map(function(r){return [r[0],r[1]]}),4);if(fr.length&&fr[fr.length-1][2])fr[fr.length-1][0]='Outros custos fixos';var crow=[['Insumos e embalagem dos pedidos',mp]].concat(fr);
var res=rev-mp-fx;
pie('cst','Custo do mês',crow,'<div class="pnote"><span>Resultado estimado</span><b style="color:'+(res<0?'var(--bad)':'var(--ok)')+'">'+(res<0?'− ':'')+brl(Math.abs(res))+'</b></div>'+(miss?'<p class="m" style="margin:8px 0 0">'+miss+(miss>1?' pedidos sem ficha técnica não entraram':' pedido sem ficha técnica não entrou')+' no custo de insumos.</p>':'')+(fixos.length?'':'<p class="m" style="margin:8px 0 0">Cadastre aluguel, luz e outros gastos na aba <b>Custos</b>.</p>'),'Nenhum custo em '+MES[cm]+'. Cadastre seus gastos do mês na aba Custos.')}

/* ---------- voz e agenda ---------- */
function speak(k){if(!('speechSynthesis' in window)){toast('Este navegador não lê em voz alta');return}
var L=(orders[k]||[]).slice().sort(function(a,b){var x=hm(a),y=hm(b);return x[0]*60+x[1]-y[0]*60-y[1]}),hj=k===todayK(),t=(hj?'Pedidos de hoje, ':'Pedidos de ')+lbl(k)+'. ';
if(!L.length)t+='Nenhum pedido agendado.';else{t+=(L.length===1?'Um pedido. ':L.length+' pedidos. ');L.forEach(function(o){var h=hm(o);t+='Às '+h[0]+(h[1]?' e '+h[1]:'')+' horas: '+o.c+', '+o.b+', '+o.s+'. '+(o.o&&o.o!=='—'?'Observação: '+o.o+'. ':'')})}
var u=new SpeechSynthesisUtterance(t);u.lang='pt-BR';u.rate=1;var v=speechSynthesis.getVoices().filter(function(v){return /pt[-_]BR/i.test(v.lang)})[0];if(v)u.voice=v;speechSynthesis.cancel();speechSynthesis.speak(u);toast('Lendo os pedidos em voz alta')}
function ics(){var now=new Date(),t0=todayK(),ev=[],z=function(s){return String(s).replace(/[\;,]/g,function(c){return '\\'+c}).replace(/\n/g,'\\n')};
Object.keys(orders).sort().forEach(function(k){if(k<t0)return;orders[k].forEach(function(o,i){var h=hm(o),p=k.split('-'),e=new Date(+p[0],+p[1]-1,+p[2],h[0]+1,h[1]);
ev.push('BEGIN:VEVENT\r\nUID:'+k+'-'+i+'-'+slug(o.c)+'@vivicake\r\nDTSTAMP:'+now.toISOString().replace(/[-:]/g,'').replace(/\.\d+/,'')+'\r\nDTSTART;TZID=America/Sao_Paulo:'+stamp(k,h[0],h[1])+'\r\nDTEND;TZID=America/Sao_Paulo:'+stamp(key(e.getFullYear(),e.getMonth(),e.getDate()),e.getHours(),e.getMinutes())+'\r\nSUMMARY:'+z('Entrega: '+o.b+' ('+o.c+')')+'\r\nDESCRIPTION:'+z('Telefone: '+o.t+'\nQuantidade: '+o.s+'\nValor: '+brl(o.v)+'\nObs.: '+o.o)+'\r\nBEGIN:VALARM\r\nACTION:DISPLAY\r\nDESCRIPTION:'+z('Amanhã: '+o.b)+'\r\nTRIGGER:-P1D\r\nEND:VALARM\r\nBEGIN:VALARM\r\nACTION:DISPLAY\r\nDESCRIPTION:'+z('Em 2 horas: '+o.b)+'\r\nTRIGGER:-PT2H\r\nEND:VALARM\r\nEND:VEVENT')})});
if(!ev.length){toast('Não há pedidos de hoje em diante');return}
out(new Blob(['BEGIN:VCALENDAR\r\nVERSION:2.0\r\nPRODID:-//Vivi Cake//Pedidos//PT\r\nCALSCALE:GREGORIAN\r\n'+ev.join('\r\n')+'\r\nEND:VCALENDAR\r\n'],{type:'text/calendar'}),'vivi-cake-pedidos.ics').then(function(ok){if(ok)toast(ev.length+(ev.length>1?' pedidos exportados':' pedido exportado')+' para a agenda')})}

/* ---------- cadastros ---------- */
var dlg=document.createElement('dialog');dlg.className='sheet';document.body.appendChild(dlg);
dlg.addEventListener('click',function(e){if(e.target===dlg)dlg.close()});
function num(v){v=String(v||'').replace(/[^\d,.-]/g,'');if(v.indexOf(',')>=0)v=v.replace(/\./g,'').replace(',','.');var n=parseFloat(v);return isNaN(n)?null:n}
function lines(t){return String(t||'').split('\n').map(function(s){return s.trim()}).filter(Boolean)}
function triples(t){return lines(t).map(function(s){var p=s.split(';').map(function(x){return x.trim()});return [p[0],p[1]||'',p[2]||'']})}
function fld(id,lab,v,o){o=o||{};return '<label class="fl">'+lab+(o.ta?'<textarea id="'+id+'" rows="'+(o.rows||3)+'" placeholder="'+esc(o.ph||'')+'">'+esc(v||'')+'</textarea>':'<input id="'+id+'" value="'+esc(v==null?'':v)+'"'+(o.ph?' placeholder="'+esc(o.ph)+'"':'')+(o.im?' inputmode="'+o.im+'"':'')+'>')+(o.hint?'<span class="hint">'+o.hint+'</span>':'')+'</label>'}
function openSheet(title,body,onSave,saveLabel){dlg.innerHTML='<form method="dialog" class="sh"><div class="shh"><h2>'+title+'</h2><button type="button" class="btn soft ico" id="dx" aria-label="Fechar">×</button></div><div class="shb">'+body+'</div><div class="shf"><button type="button" class="btn soft" id="dc">Cancelar</button><button type="submit" class="btn" id="ds">'+(saveLabel||'Salvar')+'</button></div></form>';
$('dx').onclick=$('dc').onclick=function(){dlg.close()};dlg.querySelector('form').onsubmit=function(e){e.preventDefault();if(onSave()!==false)dlg.close()};
dlg.showModal();var f=dlg.querySelector('input,textarea');if(f)f.focus();if(!RM&&dlg.animate)dlg.animate([{opacity:0,transform:'translateY(24px) scale(.98)'},{opacity:1,transform:'none'}],{duration:380,easing:'cubic-bezier(.22,1,.36,1)'})}
function tj(L){return (L||[]).map(function(x){return x.filter(function(y){return y!==''}).join('; ')}).join('\n')}
function formFicha(k){var f=k==null?{n:'',t:'',r:'',va:'',c:'',pv:'',i:[],e:[],u:[],p:[],f:[]}:fichas[k];
var b=fld('xn','Nome da receita *',f.n,{ph:'Ex.: Vulcão Brigadeiro'})+'<div class="two">'+fld('xt','Tipo',f.t,{ph:'Bolo, massa, cobertura…'})+fld('xr','Rendimento',f.r,{ph:'1 unidade'})+'</div><div class="two">'+fld('xv','Validade',f.va,{ph:'3 dias'})+fld('xc','Custo de produção (R$)',f.c&&f.c!=='—'?String(f.c).replace(/^R\$\s*/,''):'',{im:'decimal',ph:'0,00'})+'</div>'+fld('xp','Preço de venda (R$)',f.pv?String(f.pv).replace(/^R\$\s*/,''):'',{im:'decimal',ph:'Deixe vazio se não vende sozinho'})
+fld('xi','Ingredientes',tj(f.i),{ta:1,rows:5,ph:'Farinha de trigo; 300; g\nOvos; 4; und',hint:'Um por linha: nome; quantidade; unidade'})+fld('xe','Embalagem',tj(f.e),{ta:1,rows:2,ph:'Caixa 28x28; 1; und'})
+fld('xu','Utensílios',(f.u||[]).join('\n'),{ta:1,rows:3,ph:'Batedeira\nForma de 20 cm',hint:'Um por linha'})+fld('xpp','Pré-produção',(f.p||[]).join('\n'),{ta:1,rows:4,hint:'Um passo por linha'})+fld('xf','Finalização',(f.f||[]).join('\n'),{ta:1,rows:3,hint:'Um passo por linha'})
+(k==null?'<label class="ck"><input type="checkbox" id="xm" checked> Colocar no cardápio quando tiver preço de venda</label>':'');
openSheet(k==null?'Nova ficha técnica':'Editar ficha técnica',b,function(){var n=$('xn').value.trim();if(!n){toast('Dê um nome para a receita');$('xn').focus();return false}
var c=num($('xc').value),pv=num($('xp').value);
var o={n:n,t:$('xt').value.trim(),r:$('xr').value.trim()||'1 unidade',va:$('xv').value.trim(),c:c==null?'—':brl(c),pv:pv==null?'':brl(pv),i:triples($('xi').value),e:triples($('xe').value),u:lines($('xu').value),p:lines($('xpp').value),f:lines($('xf').value)};
if(k==null){fichas.push(o);if(pv!=null&&$('xm').checked&&!cardapio.some(function(x){return norm(x[0])===norm(n)}))cardapio.push([n,o.i.slice(0,4).map(function(x){return x[0]}).join(' + ')||o.t||'',pv])}else{var old=norm(fichas[k].n);cardapio.forEach(function(x){if(norm(x[0])===old){x[0]=o.n;if(pv!=null)x[2]=pv}});fichas[k]=o}
save();rl();money();toast(k==null?'Ficha cadastrada':'Ficha atualizada')},k==null?'Cadastrar ficha':'Salvar alterações')}
function catList(){return cardapio.map(function(c){return c[3]||''}).filter(function(x,i,a){return x&&a.indexOf(x)===i})}
function lastCat(){return cardapio.length?(cardapio[cardapio.length-1][3]||''):'Tradicionais'}
function uLbl(u){return u==='kg'?' / kg':u==='fatia'?' / fatia':''}
function formItem(k){var c=k==null?['','',null,lastCat(),'kg',false]:cardapio[k],cats=catList();
openSheet(k==null?'Novo item do cardápio':'Editar item do cardápio',fld('yn','Nome *',c[0],{ph:'Ex.: Ninho trufado'})+'<div class="two">'+fld('yc','Seção do cardápio',c[3]||'',{ph:'Tradicionais'})+'<label class="fl">Preço por<select id="yu"><option value="kg"'+(c[4]==='kg'?' selected':'')+'>Kg</option><option value="un"'+(c[4]==='un'?' selected':'')+'>Unidade</option><option value="fatia"'+(c[4]==='fatia'?' selected':'')+'>Fatia</option></select></label></div><datalist id="ycl">'+cats.concat(['Tradicionais','Especiais','Bolos vulcão','Adicionais']).filter(function(x,i,a){return a.indexOf(x)===i}).map(function(x){return '<option value="'+esc(x)+'">'}).join('')+'</datalist>'+fld('yp','Preço (R$) *',c[2]==null?'':String(c[2]).replace('.',','),{im:'decimal',ph:'78,00'})+fld('yd','Descrição (opcional)',c[1],{ph:'Aparece só na lista e no Word'})+'<label class="ck"><input type="checkbox" id="ys"'+(c[5]?' checked':'')+'> Linha divisória antes deste item no cardápio</label><p class="hint">Use a seção <b>Adicionais</b> para extras (ex.: frutas). Eles aparecem na faixa de baixo do cardápio.</p>',
function(){var n=$('yn').value.trim(),p=num($('yp').value);if(!n||p==null){toast('Preencha nome e preço');return false}var o=[n,$('yd').value.trim(),p,$('yc').value.trim(),$('yu').value,$('ys').checked];if(k==null)cardapio.push(o);else cardapio[k]=o;save();rl();toast(k==null?'Item adicionado ao cardápio':'Item atualizado')},k==null?'Adicionar ao cardápio':'Salvar alterações');$('yc').setAttribute('list','ycl')}
function formIns(k){var us=['g','ml','kg','L','und'],e=k==null?['',0,0,'g',0,0]:estoque[k],v=function(x){return x?String(x).replace('.',','):''};
openSheet(k==null?'Novo insumo':'Editar insumo',fld('zn','Nome *',e[0],{ph:'Ex.: Leite condensado'})+'<div class="two">'+fld('zt','Tamanho da embalagem',v(e[5]),{im:'decimal',ph:'Ex.: 395'})+'<label class="fl">Medida<select id="zu">'+us.map(function(u){return '<option'+(u===e[3]?' selected':'')+'>'+u+'</option>'}).join('')+'</select></label></div><div class="two">'+fld('zq','Quantidade (unidades)',v(e[1]),{im:'decimal',ph:'Ex.: 30'})+fld('zc','Valor da unidade (R$)',e[4]?(+e[4]).toFixed(2).replace('.',','):'',{im:'decimal',ph:'Ex.: 6,20'})+'</div>'+fld('zm','Estoque mínimo (unidades)',v(e[2]),{im:'decimal',ph:'Ex.: 5'})+'<p class="hint">Ex.: leite condensado de <b>395 g</b>, você tem <b>30 latas</b> e cada uma custa <b>R$ 6,20</b>. Quando tiver menos que o mínimo, aparece <b>Repor</b>.</p>'+(k==null?'':'<button type="button" class="lk" id="zx" style="margin-top:6px">Remover este insumo</button>'),
function(){var n=$('zn').value.trim();if(!n){toast('Dê um nome para o insumo');return false}var o=[n,num($('zq').value)||0,num($('zm').value)||0,$('zu').value,num($('zc').value)||0,num($('zt').value)||0];if(k==null)estoque.push(o);else estoque[k]=o;estoque.sort(function(a,b){return a[0].localeCompare(b[0],'pt')});save();stk();gr();toast(k==null?'Insumo adicionado':'Insumo atualizado')},k==null?'Adicionar insumo':'Salvar alterações');
if($('zx'))$('zx').onclick=function(){if(!confirm('Remover "'+e[0]+'" do estoque?'))return;estoque.splice(k,1);save();stk();gr();dlg.close();toast('Insumo removido')}}
document.addEventListener('click',function(e){var b=e.target.closest&&e.target.closest('.ef,.xf,.ec,.xc');if(!b)return;var k=+b.dataset.k;
if(b.classList.contains('ef'))formFicha(k);else if(b.classList.contains('ec'))formItem(k);
else if(b.classList.contains('xf')){if(confirm('Remover a ficha "'+fichas[k].n+'"?')){fichas.splice(k,1);save();rl();money();toast('Ficha removida')}}
else if(confirm('Remover "'+cardapio[k][0]+'" do cardápio?')){cardapio.splice(k,1);save();rl();toast('Item removido do cardápio')}});
$('nf').onclick=function(){formFicha()};$('imf').onclick=function(){$('bkf').click()};$('ni').onclick=function(){formItem()};
var APP=/github\.io$/.test(location.hostname)?location.origin+location.pathname:'https://vivicenturiao.github.io/vivi-cake/';
function daily(){var n=new Date(td.getFullYear(),td.getMonth(),td.getDate()+1),k=key(n.getFullYear(),n.getMonth(),n.getDate());
var u='https://calendar.google.com/calendar/render?action=TEMPLATE&text='+encodeURIComponent('Vivi Cake: pedidos do dia')+'&dates='+stamp(k,7,0)+'/'+stamp(k,7,15)+'&ctz=America/Sao_Paulo&recur='+encodeURIComponent('RRULE:FREQ=DAILY')+'&details='+encodeURIComponent('Toque para ver as entregas e os bolos de hoje:\n'+APP+'?hoje=1');
window.open(u,'_blank','noopener')}
$('dly').onclick=daily;
if(/[?&]hoje=1/.test(location.search)){sel=todayK();cal();day();setTimeout(function(){toast('Toque em “Ouvir pedidos de hoje” para ouvir as entregas');var b=$('spk');b.classList.add('pulse');setTimeout(function(){b.classList.remove('pulse')},4000)},700)}

/* ---------- custos do mês ---------- */
var SUG=['Aluguel','Energia','Água','Gás','Internet','Telefone','Salários','MEI e contador','Embalagens','Divulgação','Transporte','Maquininha'];
function ctot(){return fixos.reduce(function(a,r){return a+(+r[1]||0)},0)}
function cus(){var used=fixos.map(function(r){return norm(r[0])});
$('cs').innerHTML=fixos.length?'<div class="cl">'+fixos.map(function(r,i){return '<div class="crw"><label class="cn"><span class="sr">Nome do custo</span><input data-i="'+i+'" data-f="0" value="'+esc(r[0])+'" placeholder="Nome do custo"></label><label class="qi cv"><span class="pre">R$</span><input data-i="'+i+'" data-f="1" type="text" inputmode="decimal" value="'+(r[1]?String(r[1].toFixed(2)).replace('.',','):'')+'" placeholder="0,00" aria-label="Valor de '+esc(r[0])+'"></label><button class="lk xr" data-i="'+i+'" aria-label="Remover '+esc(r[0])+'">Remover</button></div>'}).join('')+'</div>':'<div class="empty">Nenhum custo cadastrado ainda.<br>Toque em uma sugestão abaixo ou em <b>+ Novo custo</b>.</div>';
$('csg').innerHTML=SUG.filter(function(s){return used.indexOf(norm(s))<0}).map(function(s){return '<button class="chip" data-s="'+esc(s)+'">+ '+esc(s)+'</button>'}).join('');
ctu(true);
$('cs').querySelectorAll('input').forEach(function(x){x.oninput=function(){var r=fixos[+x.dataset.i];if(x.dataset.f==='0')r[0]=x.value;else r[1]=num(x.value)||0;save();ctu()};x.onblur=function(){if(x.dataset.f==='1'&&x.value){x.value=(fixos[+x.dataset.i][1]||0).toFixed(2).replace('.',',')}}});
$('cs').querySelectorAll('.xr').forEach(function(b){b.onclick=function(){var r=fixos[+b.dataset.i];if(!confirm('Remover "'+(r[0]||'este custo')+'"?'))return;fixos.splice(+b.dataset.i,1);save();cus();toast('Custo removido')}});
$('csg').querySelectorAll('.chip').forEach(function(b){b.onclick=function(){addCusto(b.dataset.s)}})}
function ctu(first){var t=ctot(),n=fixos.filter(function(r){return r[1]>0}).length;count($('ct1'),t,brl);$('ct2').textContent=n;
var dd=new Date(cy,cm+1,0).getDate();count($('ct3'),t/dd,brl)}
function addCusto(nome){fixos.push([nome||'',0]);save();cus();var ins=$('cs').querySelectorAll('.crw');var last=ins[ins.length-1];if(last){last.querySelector(nome?'[data-f="1"]':'[data-f="0"]').focus();reveal([last])}}
$('nc').onclick=function(){addCusto('')};

/* ---------- backup ---------- */
var BKK='vivicake-ultimo-backup';
function lastBk(){try{return localStorage.getItem(BKK)||''}catch(e){return ''}}
function hasData(){return Object.keys(orders).some(function(k){return orders[k].length})||fichas.length||cardapio.length||estoque.length||fixos.length}
function bkInfo(){var l=lastBk(),el=$('bki');if(!el)return;if(!l){el.textContent='Nenhum backup feito ainda neste aparelho.';return}var p=l.split('-');el.textContent='Último backup: '+(+p[2])+' de '+MES[+p[1]-1]+' de '+p[0]+'.'}
function bkBanner(){var b=$('bkb');if(!b)return;var show=hasData()&&lastBk()!==todayK()&&new Date().getHours()>=7;b.hidden=!show}
async function backup(){var d={app:'vivi-cake',versao:1,salvoEm:new Date().toISOString(),dados:{orders:orders,fichas:fichas,cardapio:cardapio,estoque:estoque,fixos:fixos}};
var ok=await out(new Blob([JSON.stringify(d,null,1)],{type:'application/json'}),'vivi-cake-backup-'+todayK()+'.json');
if(ok!==false){try{localStorage.setItem(BKK,todayK())}catch(e){}bkInfo();bkBanner();toast('Backup criado. Guarde no Google Drive, na pasta Sistema Vivi Cake')}}
function restore(file){if(!file)return;var r=new FileReader();r.onload=function(){try{var d=JSON.parse(r.result),x=d&&d.dados;if(!x||d.app!=='vivi-cake')throw 0;
if(d.tipo==='fichas'){var nw=x.fichas||[],add=0,upd=0,ca=0;nw.forEach(function(f){var i=fichas.findIndex(function(y){return norm(y.n)===norm(f.n)});if(i>=0){fichas[i]=f;upd++}else{fichas.push(f);add++}});(x.cardapio||[]).forEach(function(c){var i=cardapio.findIndex(function(y){return norm(y[0])===norm(c[0])});if(i>=0)cardapio[i]=c;else cardapio.push(c);ca++});save();rl();money();if(ca)setTimeout(function(){toast(ca+' itens no cardápio e '+(add+upd)+' receitas importadas')},2700);toast((add?add+(add>1?' receitas adicionadas':' receita adicionada'):'')+(add&&upd?' e ':'')+(upd?upd+(upd>1?' atualizadas':' atualizada'):''));return}
var n=(x.fichas||[]).length,p=Object.keys(x.orders||{}).reduce(function(a,k){return a+x.orders[k].length},0);
if(!confirm('Restaurar o backup de '+String(d.salvoEm||'').slice(0,10).split('-').reverse().join('/')+'?\n'+p+' pedidos e '+n+' fichas.\n\nIsso substitui o que está neste aparelho agora.'))return;
orders=x.orders||{};fichas=x.fichas||[];cardapio=x.cardapio||[];estoque=x.estoque||[];migE();fixos=x.fixos||[];save();cal();day();rl();stk();gr();cus();hero();money();toast('Backup restaurado')}catch(e){toast('Esse arquivo não é um backup da Vivi Cake')}};r.readAsText(file)}
$('bkd').onclick=backup;$('bkn').onclick=backup;$('bkr').onclick=function(){$('bkf').click()};$('bkf').onchange=function(){restore(this.files[0]);this.value=''};

/* ---------- planilha financeira (.xlsx) ---------- */
function colL(i){return String.fromCharCode(65+i)}
function xc(r,i,v,s){var ref=colL(i)+r,st=s?' s="'+s+'"':'';if(v==null||v==='')return '';if(typeof v==='object'&&v.f)return '<c r="'+ref+'"'+st+'><f>'+xe(v.f)+'</f></c>';if(typeof v==='number')return '<c r="'+ref+'"'+st+'><v>'+v+'</v></c>';return '<c r="'+ref+'"'+st+' t="inlineStr"><is><t xml:space="preserve">'+xe(v)+'</t></is></c>'}
function xsheet(rows,widths){return '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"><sheetViews><sheetView workbookViewId="0"><pane ySplit="1" topLeftCell="A2" activePane="bottomLeft" state="frozen"/></sheetView></sheetViews><cols>'+widths.map(function(w,i){return '<col min="'+(i+1)+'" max="'+(i+1)+'" width="'+w+'" customWidth="1"/>'}).join('')+'</cols><sheetData>'+rows.map(function(r,ri){return '<row r="'+(ri+1)+'">'+r.map(function(c,ci){return c==null?'':Array.isArray(c)?xc(ri+1,ci,c[0],c[1]):xc(ri+1,ci,c,0)}).join('')+'</row>'}).join('')+'</sheetData></worksheet>'}
async function planilha(){var y=cy,m=cm,L=[],H=['Data','Cliente','Bolo','Quantidade','Horário','Valor (renda)','Custo de material','Lucro do pedido'].map(function(t){return [t,1]});
Object.keys(orders).sort().forEach(function(k){var p=k.split('-');if(+p[0]===y&&+p[1]-1===m)orders[k].forEach(function(o){var c=fcost(o.b);L.push([p[2]+'/'+p[1]+'/'+p[0],o.c,o.b,o.s,o.h,[+o.v||0,2],[c==null?0:c*qty(o),2]])})});
var ped=[H].concat(L.map(function(r,i){r.push([{f:'F'+(i+2)+'-G'+(i+2)},2]);return r}));
var fx=[[['Custo fixo',1],['Valor mensal',1]]].concat(fixos.filter(function(r){return r[0]||r[1]}).map(function(r){return [r[0]||'Sem nome',[+r[1]||0,2]]}));
var nm=MES[m][0].toUpperCase()+MES[m].slice(1)+' de '+y,np=L.length+1,nf=fx.length;
var res=[[['Vivi Cake — '+nm,5],null],[null,null],[['Resumo do mês',1],['Valor',1]],
['Renda (faturamento)',[{f:'SUM(Pedidos!F2:F'+Math.max(2,np)+')'},2]],['Custo de material',[{f:'SUM(Pedidos!G2:G'+Math.max(2,np)+')'},2]],['Custos fixos',[{f:"SUM('Custos fixos'!B2:B"+Math.max(2,nf)+')'},2]],
['Custo total',[{f:'B5+B6'},2]],[['Lucro',5],[{f:'B4-B7'},3]],['Margem de lucro',[{f:'IF(B4=0,0,B8/B4)'},4]],['Pedidos no mês',L.length],[null,null],['Na aba Mensal, os custos fixos entram a partir do primeiro mês com pedidos até o mês atual.',null],['Os valores de material vêm das fichas técnicas (custo de produção). Pedidos sem ficha entram com custo de material zero.',null]];
var men=[[['Mês',1],['Renda',1],['Custo de material',1],['Custos fixos',1],['Custo total',1],['Lucro',1],['Margem',1]]],ft=fixos.reduce(function(a,r){return a+(+r[1]||0)},0),ks=Object.keys(orders).filter(function(k){return orders[k].length}).sort(),first=ks.length?ks[0].slice(0,7):null,lastM=(y<td.getFullYear()?11:y>td.getFullYear()?-1:Math.max(td.getMonth(),m));
for(var i=0;i<12;i++){var rv=0,mt=0;Object.keys(orders).forEach(function(k){var p=k.split('-');if(+p[0]===y&&+p[1]-1===i)orders[k].forEach(function(o){rv+=+o.v||0;var c=fcost(o.b);if(c!=null)mt+=c*qty(o)})});var r=i+2;
var ym=y+'-'+pad(i+1),fxm=(first&&ym>=first&&i<=lastM)||i===m?ft:0;men.push([MES[i][0].toUpperCase()+MES[i].slice(1),[rv,2],[mt,2],[fxm,2],[{f:'C'+r+'+D'+r},2],[{f:'B'+r+'-E'+r},2],[{f:'IF(B'+r+'=0,0,F'+r+'/B'+r+')'},4]])}
men.push([['Total do ano',5],[{f:'SUM(B2:B13)'},3],[{f:'SUM(C2:C13)'},3],[{f:'SUM(D2:D13)'},3],[{f:'SUM(E2:E13)'},3],[{f:'SUM(F2:F13)'},3],[{f:'IF(B14=0,0,F14/B14)'},4]]);
var sh=[['Resumo do mês',xsheet(res,[34,18])],['Pedidos',xsheet(ped,[12,22,28,14,10,16,18,16])],['Custos fixos',xsheet(fx,[30,16])],['Mensal '+y,xsheet(men,[14,16,18,16,16,16,10])]];
var st='<?xml version="1.0" encoding="UTF-8" standalone="yes"?><styleSheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"><numFmts count="2"><numFmt numFmtId="164" formatCode="&quot;R$&quot; #,##0.00"/><numFmt numFmtId="165" formatCode="0.0%"/></numFmts><fonts count="2"><font><sz val="11"/><name val="Calibri"/></font><font><b/><sz val="11"/><name val="Calibri"/></font></fonts><fills count="3"><fill><patternFill patternType="none"/></fill><fill><patternFill patternType="gray125"/></fill><fill><patternFill patternType="solid"><fgColor rgb="FFF6E1E4"/><bgColor indexed="64"/></patternFill></fill></fills><borders count="1"><border><left/><right/><top/><bottom/><diagonal/></border></borders><cellStyleXfs count="1"><xf numFmtId="0" fontId="0" fillId="0" borderId="0"/></cellStyleXfs><cellXfs count="6"><xf numFmtId="0" fontId="0" fillId="0" borderId="0" xfId="0"/><xf numFmtId="0" fontId="1" fillId="2" borderId="0" xfId="0" applyFont="1" applyFill="1"/><xf numFmtId="164" fontId="0" fillId="0" borderId="0" xfId="0" applyNumberFormat="1"/><xf numFmtId="164" fontId="1" fillId="0" borderId="0" xfId="0" applyNumberFormat="1" applyFont="1"/><xf numFmtId="165" fontId="0" fillId="0" borderId="0" xfId="0" applyNumberFormat="1"/><xf numFmtId="0" fontId="1" fillId="0" borderId="0" xfId="0" applyFont="1"/></cellXfs><cellStyles count="1"><cellStyle name="Normal" xfId="0" builtinId="0"/></cellStyles></styleSheet>';
var f=[['[Content_Types].xml','<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/><Override PartName="/xl/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml"/>'+sh.map(function(s,i){return '<Override PartName="/xl/worksheets/sheet'+(i+1)+'.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>'}).join('')+'</Types>'],
['_rels/.rels','<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/></Relationships>'],
['xl/workbook.xml','<?xml version="1.0" encoding="UTF-8" standalone="yes"?><workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"><calcPr fullCalcOnLoad="1"/><sheets>'.replace('<calcPr fullCalcOnLoad="1"/>','')+sh.map(function(s,i){return '<sheet name="'+xe(s[0])+'" sheetId="'+(i+1)+'" r:id="rId'+(i+1)+'"/>'}).join('')+'</sheets><calcPr fullCalcOnLoad="1"/></workbook>'],
['xl/_rels/workbook.xml.rels','<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">'+sh.map(function(s,i){return '<Relationship Id="rId'+(i+1)+'" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet'+(i+1)+'.xml"/>'}).join('')+'<Relationship Id="rId'+(sh.length+1)+'" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/></Relationships>'],
['xl/styles.xml',st]].concat(sh.map(function(s,i){return ['xl/worksheets/sheet'+(i+1)+'.xml',s[1]]}));
var b=zip(f);b=new Blob([b],{type:'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'});
var ok=await out(b,'vivi-cake-financeiro-'+y+'-'+pad(m+1)+'.xlsx');if(ok!==false)toast('Planilha de '+MES[m]+' baixada')}
$('xls').onclick=planilha;$('xls2').onclick=planilha;

/* ---------- preço sugerido (markup) ---------- */
var MKK='vivicake-markup';
function mkGet(){var d={l:30,c:1.95,a:18.5,f:null};try{var s=JSON.parse(localStorage.getItem(MKK)||'null');if(s)for(var k in s)d[k]=s[k]}catch(e){}return d}
function fixPct(){var by={};Object.keys(orders).forEach(function(k){var mk=k.slice(0,7);orders[k].forEach(function(o){by[mk]=(by[mk]||0)+(+o.v||0)})});var ms=Object.keys(by).filter(function(k){return by[k]>0});var ft=fixos.reduce(function(a,r){return a+(+r[1]||0)},0);
if(!ms.length||!ft)return {p:ft?15:0,auto:false,ft:ft};var avg=ms.reduce(function(a,k){return a+by[k]},0)/ms.length;var raw=Math.round(ft/avg*1000)/10;return {p:Math.min(25,raw),raw:raw,auto:true,ft:ft,avg:avg}}
function pc(v){return String(v).replace('.',',')}
function r90(p){var c=Math.ceil(p)-0.1;return c>=p?c:c+1}
function priceSheet(k){var it=cardapio[k],f=fichas.filter(function(x){return norm(x.n)===norm(it[0])})[0],c0=f?fcost(f.n):null,L=40;
var b='<p class="m" style="margin:0 0 6px"><b>'+esc(it[0])+'</b>'+(f?' · custo da ficha técnica':' · sem ficha técnica com esse nome')+'</p>'
+fld('pc','Custo dos produtos para fazer (R$)',c0==null?'':String(c0.toFixed(2)).replace('.',','),{im:'decimal',ph:'Ex.: 38,50',hint:f?'Vem da ficha técnica. Pode ajustar aqui.':'Digite quanto você gasta de ingredientes e embalagem para fazer este item.'})
+'<div class="pres" id="pres"></div>';
openSheet('Preço sugerido',b,function(){var s=$('pres').dataset.s;if(!s){toast('Informe o custo dos produtos');return false}var v=+s;it[2]=v;if(f)f.pv=brl(v);save();rl();toast('Preço de '+it[0]+' atualizado para '+brl(v))},'Usar este preço');
function calc(){var c=num($('pc').value),el=$('pres');
if(c==null||c<=0){el.innerHTML='<div class="empty" style="padding:18px">Digite o custo dos produtos para ver o preço.</div>';el.dataset.s='';return}
var pv=Math.round(c*(1+L/100)*100)/100,cur=+it[2]||0;
el.dataset.s=pv.toFixed(2);
el.innerHTML='<div class="pgrid"><div class="pbx"><span class="m">Custo dos produtos</span><b>'+brl(c)+'</b></div><div class="pbx"><span class="m">Seu lucro (40%)</span><b>'+brl(pv-c)+'</b></div><div class="pbx hi"><span class="m">Preço de venda</span><b>'+brl(pv)+'</b></div></div>'
+(cur?'<div class="pcur '+(cur<c?'bad':cur<pv?'mid':'ok')+'"><span>Hoje: <b>'+brl(cur)+'</b></span><span>'+(cur<c?'Dá prejuízo: não paga os produtos':cur<pv?'Lucro de '+brl(cur-c)+', abaixo de 40%':'Lucro de '+brl(cur-c)+' ('+Math.round((cur-c)/c*100)+'% sobre o custo)')+'</span></div>':'')
+'<p class="m" style="margin:10px 0 0">Conta: custo dos produtos + 40% de lucro em cima dele.</p>'}
$('pc').oninput=calc;calc()}
document.addEventListener('click',function(e){var b=e.target.closest&&e.target.closest('.ps');if(b)priceSheet(+b.dataset.k)});

/* ---------- cardápio: prévia no modelo da Vivi ---------- */
var cdv='l';
function pz(v){v=+v||0;return 'R$ '+(v%1?v.toFixed(2).replace('.',','):v)}
function groups(){var g=[],ad=[];cardapio.forEach(function(c){var ct=(c[3]||'Cardápio').trim();if(norm(ct)==='adicionais'){ad.push(c);return}var x=g.filter(function(y){return y.n===ct})[0];if(!x){x={n:ct,it:[]};g.push(x)}x.it.push(c)});return {g:g,ad:ad}}
function unitHead(it){var u=it.map(function(c){return c[4]||'un'});return u.every(function(x){return x==='kg'})?'Valor por Kg':u.every(function(x){return x==='fatia'})?'Valor por fatia':''}
function menuHTML(){var G=groups(),lg=document.querySelector('.mtop .mk');var h='<div class="menu"><div class="mhd">'+(lg?lg.outerHTML:'')+'<span class="ma">A T E L I Ê</span><span class="mv">Vivi cake</span></div>';
if(!cardapio.length)return h+'<p class="mempty">Cadastre itens do cardápio para ver a prévia.</p></div>';
G.g.forEach(function(s){var uh=unitHead(s.it);h+='<div class="msec"><h4>'+esc(s.n.toUpperCase())+'</h4>'+(uh?'<span class="mu">'+uh+'</span>':'')+'</div>';s.it.forEach(function(c){if(c[5])h+='<hr class="mdiv">';h+='<div class="mi"><span>'+esc(c[0])+'</span><i></i><b>'+pz(c[2])+(uh||!c[4]||c[4]==='un'?'':(c[4]==='kg'?'/kg':'/fatia'))+'</b></div>'})});
G.ad.forEach(function(c){h+='<div class="madd">'+esc(c[0])+' <i></i> + '+pz(c[2])+'</div>'});return h+'</div>'}
function cdView(){document.querySelectorAll('.cdt').forEach(function(b){b.classList.toggle('on',b.dataset.v===cdv)});$('cd').hidden=cdv!=='l';$('cdp').hidden=cdv!=='p';$('rq').disabled=false;if(cdv==='p'){$('cdp').innerHTML=menuHTML()+'<button class="btn" id="mimg" style="margin-top:12px;width:100%">Baixar imagem do cardápio</button>';$('mimg').onclick=menuPNG;reveal($('cdp').querySelectorAll('.menu'))}}
document.querySelectorAll('.cdt').forEach(function(b){b.onclick=function(){cdv=b.dataset.v;cdView()}});
async function menuPNG(){var G=groups();if(!cardapio.length){toast('Cadastre itens primeiro');return}
try{await Promise.all(['600 64px "Alegreya"','400 36px "Alegreya"','64px "Great Vibes"'].map(function(f){return document.fonts?document.fonts.load(f):0}))}catch(e){}
var W=1080,hh=440;G.g.forEach(function(s){hh+=116+46+s.it.length*60;s.it.forEach(function(c){if(c[5])hh+=40})});var H=Math.max(1100,hh+(G.ad.length?G.ad.length*80+60:0)+110);
var cv=document.createElement('canvas');cv.width=W;cv.height=H;var x=cv.getContext('2d');
var gr=x.createLinearGradient(0,0,0,H);gr.addColorStop(0,'#fde9ef');gr.addColorStop(1,'#fbeef3');x.fillStyle=gr;x.fillRect(0,0,W,H);
x.strokeStyle='#ef9ab5';x.lineWidth=3;x.beginPath();var m=36,r=34;x.moveTo(m+r,m);x.lineTo(W-m-r,m);x.arc(W-m,m,r,Math.PI,Math.PI/2,true);x.lineTo(W-m,H-m-r);x.arc(W-m,H-m,r,-Math.PI/2,Math.PI,true);x.lineTo(m+r,H-m);x.arc(m,H-m,r,0,-Math.PI/2,true);x.lineTo(m,m+r);x.arc(m,m,r,Math.PI/2,0,true);x.stroke();
var lg=document.querySelector('.mtop .mk');if(lg){try{var s=new XMLSerializer().serializeToString(lg).replace(/currentColor/g,'#b98d65').replace('<svg','<svg width="404" height="252"');var im=new Image();await new Promise(function(ok,no){im.onload=ok;im.onerror=no;im.src='data:image/svg+xml;charset=utf-8,'+encodeURIComponent(s)});x.drawImage(im,W/2-110,70,220,137)}catch(e){}}
x.textAlign='center';x.fillStyle='#2b1d22';x.font='500 30px "Figtree",sans-serif';x.fillText('A   T   E   L   I   Ê',W/2,250);x.strokeStyle='#2b1d22';x.lineWidth=2;x.beginPath();x.moveTo(W/2-330,240);x.lineTo(W/2-190,240);x.moveTo(W/2+190,240);x.lineTo(W/2+330,240);x.stroke();
x.font='86px "Great Vibes","Brush Script MT",cursive';x.fillText('Vivi cake',W/2,345);
var y=440,L=110,R=W-100;
G.g.forEach(function(s){var uh=unitHead(s.it);x.textAlign='center';x.fillStyle='#e2557e';x.font='700 64px "Alegreya",Georgia,serif';var t=s.n.toUpperCase().split('').join(String.fromCharCode(8202));x.fillText(t,W/2,y);
if(uh){x.font='400 26px "Alegreya",Georgia,serif';var tw=x.measureText(uh).width+36;x.fillStyle='#f8d3df';x.fillRect(R-tw+10,y+12,tw,44);x.fillStyle='#2b1d22';x.textAlign='center';x.fillText(uh,R-tw/2+10,y+43)}
y+=(uh?116:96);s.it.forEach(function(c){if(c[5]){x.strokeStyle='#e2557e';x.lineWidth=4;x.beginPath();x.moveTo(W/2-310,y-28);x.lineTo(W/2+310,y-28);x.stroke();y+=40}
x.textAlign='left';x.fillStyle='#2b1d22';x.font='400 40px "Alegreya",Georgia,serif';x.fillText(c[0],L,y);var nw=x.measureText(c[0]).width;
var pr=pz(c[2])+(uh||!c[4]||c[4]==='un'?'':(c[4]==='kg'?'/kg':'/fatia'));x.font='400 40px "Alegreya",Georgia,serif';var pw=x.measureText(pr).width;x.fillStyle='#e2557e';x.textAlign='right';x.fillText(pr,R,y);
x.fillStyle='#e2557e';for(var dx=L+nw+14;dx<R-pw-18;dx+=13){x.beginPath();x.arc(dx,y-4,2.6,0,7);x.fill()}y+=60});y+=46});
if(G.ad.length){y+=20;G.ad.forEach(function(c){x.fillStyle='#f6c6d6';x.fillRect(60,y-46,W-120,66);x.fillStyle='#d6336c';x.textAlign='center';x.font='700 34px "Alegreya",Georgia,serif';x.fillText(c[0]+'.... + '+pz(c[2]),W/2,y);y+=80})}
cv.toBlob(function(b){out(b,'vivi-cake-cardapio.png').then(function(ok){if(ok)toast('Imagem do cardápio pronta para enviar')})},'image/png')}

/* ---------- ponte com o Google Drive (Apps Script) ---------- */
var SYK='vivicake-sync',sy=(function(){try{return JSON.parse(localStorage.getItem(SYK)||'null')||{}}catch(e){return {}}})(),syT=null,syBusy=false,syState='off',syAt=0;
function sySave(){try{localStorage.setItem(SYK,JSON.stringify(sy))}catch(e){}}
function syOn(){return !!(sy.u&&sy.t)}
function syData(){return {orders:orders,fichas:fichas,cardapio:cardapio,estoque:estoque,fixos:fixos}}
function syApply(d){if(!d)return;orders=d.orders||{};fichas=d.fichas||[];cardapio=d.cardapio||[];estoque=d.estoque||[];migE();fixos=d.fixos||[];saveLocal();cal();day();rl();stk();gr();cus();hero();money()}
function syMerge(srv,loc){var by=function(a,b,k){var m={},o=[];(a||[]).concat(b||[]).forEach(function(x){var key=norm(k(x));if(!(key in m)){m[key]=o.length;o.push(x)}});return o};
var r={orders:{},fichas:by((loc.fichas||[]),srv.fichas,function(f){return f.n}),cardapio:by(loc.cardapio,srv.cardapio,function(c){return c[0]}),estoque:by(loc.estoque,srv.estoque,function(e){return e[0]}),fixos:by(loc.fixos,srv.fixos,function(f){return f[0]+'|'+f[1]})};
[srv.orders||{},loc.orders||{}].forEach(function(src){Object.keys(src).forEach(function(k){var a=r.orders[k]=r.orders[k]||[];src[k].forEach(function(o){var s=JSON.stringify(o);if(!a.some(function(x){return JSON.stringify(x)===s}))a.push(o)})})});return r}
function syStatus(st,msg){syState=st;var el=$('sy');if(el){el.hidden=!syOn();el.className='sync '+st;el.innerHTML='<i></i>'+(msg||({ok:'Sincronizado com o Drive',busy:'Sincronizando…',off:'Sem internet: salvo no aparelho',err:'Não sincronizou'})[st]||'')}var sc=$('syc');if(sc)syCard()}
function syCard(){var c=$('syc');if(!c)return;if(!syOn()){c.innerHTML='<h3>Sincronização com o Drive</h3><p class="m" style="margin:4px 0 10px">Cole aqui o <b>link de conexão</b> da Vivi Cake para este aparelho salvar e buscar tudo na planilha do Drive.</p><div class="row" style="gap:8px"><input id="syl" placeholder="Link de conexão" style="margin:0"><button class="btn" id="syb">Conectar</button></div>';$('syb').onclick=function(){syLink($('syl').value)};return}
var t=sy.last?new Date(sy.last):null;c.innerHTML='<div class="row"><div><h3>Sincronização com o Drive</h3><p class="m" style="margin:4px 0 0">'+(syState==='ok'&&t?'Tudo salvo no Drive. Última sincronização: '+pad(t.getDate())+'/'+pad(t.getMonth()+1)+' às '+pad(t.getHours())+':'+pad(t.getMinutes())+'.':syState==='off'?'Sem internet agora. Suas alterações ficam no aparelho e vão para o Drive quando a conexão voltar.':syState==='err'?'A última tentativa falhou. O app tenta de novo sozinho.':'Sincronizando…')+'</p></div><div class="hb"><button class="btn soft" id="syx">Desconectar</button><button class="btn" id="syn">Sincronizar agora</button></div></div>';
$('syn').onclick=function(){syPull(true)};$('syx').onclick=function(){if(!confirm('Desconectar este aparelho do Drive? Os dados continuam no aparelho e no Drive.'))return;sy={};sySave();syStatus('off');syCard();toast('Aparelho desconectado do Drive')}}
function syLink(v){try{var m=String(v||'').match(/#c=([A-Za-z0-9_\-]+)/)||[null,String(v||'').trim()];var s=atob(m[1].replace(/-/g,'+').replace(/_/g,'/'));var o=JSON.parse(s);if(!/^https:\/\/script\.google\.com\//.test(o.u)||!o.t)throw 0;sy={u:o.u,t:o.t,last:0,base:0,dirty:true,first:true};sySave();toast('Aparelho conectado ao Drive');syPull(true)}catch(e){toast('Esse link de conexão não é válido')}}
async function syFetchGet(){var r=await fetch(sy.u+'?t='+encodeURIComponent(sy.t)+'&_='+Date.now(),{cache:'no-store'});return r.json()}
async function syFetchPost(){var r=await fetch(sy.u,{method:'POST',body:JSON.stringify({t:sy.t,base:sy.base||0,data:syData()})});return r.json()}
async function syPull(manual){if(!syOn()||syBusy)return;if(!navigator.onLine){syStatus('off');return}syBusy=true;syStatus('busy');
try{var r=await syFetchGet();if(!r.ok)throw new Error(r.err||'erro');
if(sy.first){sy.first=false;if(r.data){var mg=syMerge(r.data,syData());syApply(mg);sy.dirty=true}sy.base=r.updatedAt||0;sySave()}
else if((r.updatedAt||0)>(sy.base||0)){if(sy.dirty){syApply(syMerge(r.data||{},syData()))}else{syApply(r.data||{});if(manual!==true)toast('Dados atualizados de outro aparelho')}sy.base=r.updatedAt;sySave()}
syBusy=false;if(sy.dirty)await syPush();else{sy.last=Date.now();sySave();syStatus('ok');if(manual===true)toast('Sincronizado com o Drive')}}
catch(e){syBusy=false;syStatus(navigator.onLine?'err':'off')}}
async function syPush(){if(!syOn()||syBusy)return;if(!navigator.onLine){syStatus('off');return}syBusy=true;syStatus('busy');
try{var r=await syFetchPost();if(!r.ok&&r.err==='conflict'){syApply(syMerge(r.data||{},syData()));sy.base=r.updatedAt;sySave();r=await syFetchPost()}
if(!r.ok)throw new Error(r.err||'erro');sy.base=r.updatedAt;sy.dirty=false;sy.last=Date.now();sySave();syBusy=false;syStatus('ok')}
catch(e){syBusy=false;syStatus(navigator.onLine?'err':'off')}}
function syncDirty(){if(!syOn())return;sy.dirty=true;sySave();clearTimeout(syT);syT=setTimeout(syPush,1500)}
(function(){var h=location.hash.match(/#c=([A-Za-z0-9_\-]+)/);if(h){history.replaceState(null,'',location.pathname+location.search);syLink(h[0])}})();
if(syOn()){syStatus('busy');syPull()}else syStatus('off');
window.addEventListener('online',function(){if(syOn())syPull()});window.addEventListener('offline',function(){if(syOn())syStatus('off')});
document.addEventListener('visibilitychange',function(){if(!document.hidden&&syOn())syPull()});
setInterval(function(){if(!document.hidden&&syOn()&&!syBusy)syPull()},60000);
syCard();
$('spk').onclick=function(){speak(todayK())};$('ics').onclick=ics;
var tipEl=document.createElement('div');tipEl.id='tip';tipEl.className='tip';document.body.appendChild(tipEl);
if('speechSynthesis' in window)speechSynthesis.getVoices();

cal();day();stk();gr();cus();hero();money();bkInfo();bkBanner();ind(true);reveal(document.querySelectorAll('#ped .rv'));$('sq').oninput=function(){fq=this.value;stk()};document.querySelectorAll('.gt').forEach(function(b){b.onclick=function(){gt=b.dataset.g;gr()}});
$('ai').onclick=function(){formIns()};
if('serviceWorker' in navigator)navigator.serviceWorker.register('sw.js').catch(function(){});
