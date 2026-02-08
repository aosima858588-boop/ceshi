(function(){
  const toastContainer = document.createElement('div');
  toastContainer.id = 'toastContainer';
  toastContainer.className = 'toast-container';
  document.body.appendChild(toastContainer);

  window.showToast = function(message, type = 'info'){
    const t = document.createElement('div');
    t.className = 'toast';
    const icon = document.createElement('div');
    icon.innerHTML = type === 'success' ? '✓' : 'ℹ';
    const content = document.createElement('div');
    content.innerHTML = `<div style="font-weight:700">${type==='success'?'成功':'提示'}</div><div style="color:var(--muted)">${message}</div>`;
    t.appendChild(icon);
    t.appendChild(content);
    toastContainer.appendChild(t);
    setTimeout(()=>{ t.style.opacity = '0'; t.style.transform = 'translateX(12px)'; setTimeout(()=>t.remove(),300); }, 2800);
  };

  const themeToggle = document.getElementById('themeToggle');
  if(themeToggle){
    themeToggle.addEventListener('click', ()=>{
      const root = document.documentElement;
      const isLight = root.getAttribute('data-theme') === 'light';
      if(isLight){ root.removeAttribute('data-theme'); themeToggle.setAttribute('aria-pressed','false'); }
      else { root.setAttribute('data-theme','light'); themeToggle.setAttribute('aria-pressed','true'); }
    });
  }

  function attachTilt(){
    const els = document.querySelectorAll('.tilt');
    els.forEach(el=>{
      let rect = null;
      function onMove(e){
        if(window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
        if(!rect) rect = el.getBoundingClientRect();
        const cx = rect.left + rect.width/2;
        const cy = rect.top + rect.height/2;
        const px = (e.clientX - cx)/(rect.width/2);
        const py = (e.clientY - cy)/(rect.height/2);
        const rx = Math.max(Math.min(py * 6, 8), -8);
        const ry = Math.max(Math.min(px * -6, 8), -8);
        el.style.transform = `perspective(800px) rotateX(${rx}deg) rotateY(${ry}deg) translateZ(6px)`;
      }
      function onLeave(){ el.style.transform='none'; rect = null; }
      el.addEventListener('mousemove', onMove);
      el.addEventListener('mouseleave', onLeave);
      el.addEventListener('focus', ()=> el.style.transform='translateY(-6px) scale(1.01)');
      el.addEventListener('blur', ()=> el.style.transform='none');
    });
  }

  attachTilt();

  document.querySelectorAll('.feature-item').forEach(el=>{
    el.addEventListener('keydown', function(e){ if(e.key === 'Enter' || e.key === ' '){ e.preventDefault(); el.click(); } });
  });

  window.calculateYield = function(){
    const input = document.getElementById('stake');
    const out = document.getElementById('yieldResult');
    if(!input || !out) return;
    const v = Number(input.value);
    if(!v || v <= 0){ out.textContent = '请输入有效金额'; return; }
    const APR = 0.12;
    const y = v * APR;
    out.textContent = `预计年化收益: ${y.toFixed(2)} （按 ${APR*100}% APR）`;
    showToast('计算完成', 'success');
  };

  window.switchPage = function(id){
    const known = ['main','signin','lottery','model','ai','wallet','calculator'];
    if(!known.includes(id)){ showToast('页面未实现', 'info'); return; }
    if(id === 'signin') showToast('打开每日签到');
    else if(id === 'lottery') showToast('打开幸运抽奖');
    else if(id === 'ai') showToast('打开 AI 助手');
    else if(id === 'wallet') showToast('打开钱包');
    else if(id === 'calculator') { const s = document.getElementById('stake'); if(s) s.focus(); showToast('打开计算器'); }
    else window.scrollTo({ top: 0, behavior: 'smooth' });
  };

})();
