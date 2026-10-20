(async()=>{
  'use strict';
  const keyText=new URLSearchParams(location.hash.slice(1)).get('k');
  const show=(t,m)=>{document.getElementById('state-title').textContent=t;document.getElementById('state-text').textContent=m;};
  const decode=s=>Uint8Array.from(atob(s.replace(/-/g,'+').replace(/_/g,'/')+'='.repeat((4-s.length%4)%4)),c=>c.charCodeAt(0));
  if(!keyText||!/^[A-Za-z0-9_-]{43}$/.test(keyText)){show('Documento com acesso por link','Abra o endereço completo compartilhado com você.');return;}
  try{
    const res=await fetch('/caico-roteiro-2013/relatorio.enc',{credentials:'omit',cache:'no-cache',referrerPolicy:'no-referrer'});
    if(!res.ok)throw Error();
    const key=await crypto.subtle.importKey('raw',decode(keyText),'AES-GCM',false,['decrypt']);
    const plain=await crypto.subtle.decrypt({name:'AES-GCM',iv:decode(document.querySelector('[name=portal-iv]').content),tagLength:128},key,await res.arrayBuffer());
    const html=await new Response(new Blob([plain]).stream().pipeThrough(new DecompressionStream('gzip'))).text();
    const frame=document.getElementById('content');
    frame.onload=()=>{document.getElementById('state').hidden=true;frame.hidden=false;};
    frame.srcdoc=html;
  }catch(e){show('Não foi possível abrir o documento','Confira se o link está completo e tente de novo em um navegador atualizado.');}
})();
