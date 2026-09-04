(() => {
  const accessibilityStyle = document.createElement('style');
  accessibilityStyle.textContent = `
    :where(a,button,input,select,textarea,[role="button"]):focus-visible {
      outline: 3px solid #0b74de !important;
      outline-offset: 3px !important;
    }
    .demo-skip-link { position:fixed; left:16px; top:8px; z-index:20000; padding:10px 14px; background:#fff; color:#111; border-radius:8px; transform:translateY(-160%); }
    .demo-skip-link:focus { transform:translateY(0); }
    @media (max-width:480px) {
      .demo-notice { padding:10px 14px !important; font-size:11px !important; line-height:1.4 !important; }
      .demo-notice-long { display:none !important; }
      .demo-notice-short { display:inline !important; }
      .badge, .concept { display:none !important; }
      dialog.demo-dialog { max-height:calc(100dvh - 32px) !important; overflow-y:auto !important; padding:18px !important; font-size:14px !important; }
      dialog.demo-dialog h2 { margin:0 0 10px; font-size:24px; line-height:1.15; }
      dialog.demo-dialog button { display:block; width:100%; margin:8px 0; padding:12px; border:1px solid #bbb; border-radius:999px; background:#fff; color:#242b31; font:600 14px/1.2 system-ui; }
      dialog.demo-dialog button[hidden] { display:none !important; }
      dialog.demo-dialog p { margin:10px 0; }
      dialog.demo-dialog a { display:block; overflow-wrap:anywhere; }
    }
    .demo-notice-short { display:none; }
  `;
  document.head.append(accessibilityStyle);
  const mainTarget = document.querySelector('main, #hero, #home, section');
  if(mainTarget){
    if(!mainTarget.id) mainTarget.id = 'demo-main-content';
    const skip = document.createElement('a');
    skip.className = 'demo-skip-link';
    skip.href = '#' + mainTarget.id;
    skip.textContent = 'Skip to main content';
    document.body.prepend(skip);
  }
  const banner = document.createElement('aside');
  banner.className = 'demo-notice';
  banner.innerHTML = '<span class="demo-notice-long">INTERACTIVE PORTFOLIO DEMO — Sample business, prices, people, reviews and availability. Nothing here books, pays, sends a message or provides professional advice.</span><span class="demo-notice-short">PORTFOLIO DEMO — No real booking, payment or message is sent.</span>';
  Object.assign(banner.style, {position:'relative',zIndex:10000,background:'#242b31',color:'#fff',padding:'16px 24px',font:'14px/1.5 system-ui'});
  document.body.prepend(banner);
  if(window.matchMedia?.('(max-width:480px)').matches){
    banner.textContent = 'PORTFOLIO DEMO — No real booking, payment or message is sent.';
    document.querySelectorAll('.badge, .concept').forEach(label => { label.hidden = true; label.style.setProperty('display','none','important'); });
    const bloomNav = document.querySelector('nav.nav');
    if(document.title.includes('Bloom Studio') && bloomNav){
      bloomNav.style.position = 'sticky';
      bloomNav.style.inset = 'auto';
      bloomNav.style.top = '0';
    }
  }
  const dialog = document.createElement('dialog');
  dialog.className = 'demo-dialog';
  dialog.setAttribute('aria-labelledby','demoReviewTitle');
  Object.assign(dialog.style,{maxWidth:'560px',width:'calc(100% - 32px)',padding:'28px',border:'1px solid #ddd',borderRadius:'16px',background:'#fff',color:'#242b31',font:'16px/1.6 system-ui'});
  dialog.innerHTML = '<h2 id="demoReviewTitle">Review your demo</h2><p>This simulation stays on this page. Do not enter personal information. No payment or request will be sent.</p><div id="demoReviewSummary" style="white-space:pre-wrap"></div><p id="demoReviewStatus" role="status"></p><button type="button" id="demoReviewConfirm">Complete simulation</button> <button type="button" id="demoReviewClose">Back to demo</button><p><a href="https://sion-united.vercel.app/#contact" target="_blank" rel="noopener">Want a website like this? Request a Sion United proposal →</a></p>';
  document.body.append(dialog);
  let opener;
  window.openDemoReview = (title = 'Review your demo', description = '') => {
    opener = document.activeElement;
    dialog.querySelector('h2').textContent = title;
    const choices = Array.from(document.querySelectorAll('select')).map(s => s.options[s.selectedIndex]?.textContent).filter(Boolean);
    const result = document.querySelector('aside.estimate-result, aside.answer, aside.result, .result, [id="selectedDate"]');
    dialog.querySelector('#demoReviewSummary').textContent = description || [choices.join(' · '), result?.innerText || result?.textContent || 'Explore the options, then return here to complete the simulated journey.'].join('\n');
    dialog.querySelector('#demoReviewStatus').textContent = '';
    dialog.querySelector('#demoReviewConfirm').hidden = false;
    if(!dialog.open) dialog.showModal();
  };
  dialog.querySelector('#demoReviewClose').addEventListener('click', () => dialog.close());
  dialog.addEventListener('close', () => opener?.focus());
  dialog.querySelector('#demoReviewConfirm').addEventListener('click', e => {
    dialog.querySelector('#demoReviewStatus').textContent = 'Simulation complete. No booking, charge or message was created. A client implementation would connect this step to a verified booking or payment provider.';
    e.target.hidden = true;
  });
  // Intercept demonstration-only calls before existing inline handlers can contact third parties.
  document.addEventListener('click', e => {
    const control = e.target.closest('a,button,[onclick]');
    if(!control || dialog.contains(control)) return;
    const label = (control.textContent || control.getAttribute('aria-label') || '').trim();
    const href = control.getAttribute('href') || '';
    const inline = control.getAttribute('onclick') || '';
    const externalAction = /^(tel:|mailto:)|wa.me/.test(href) || /wa.me|tel:|confirmBooking/.test(inline);
    const review = /Continue to reservation|Request exact service quote|Contact for an exact quote|View matching option|Private Inquiry|Reservations|Apply for CareCredit|Confirm booking/i.test(label);
    const placeholder = href === '#' && !control.closest('nav') || control.matches('.footer-social-btn');
    if(externalAction || review || placeholder){
      e.preventDefault(); e.stopImmediatePropagation();
      window.openDemoReview(review ? 'Review your demo selection' : 'Demo information', placeholder ? 'This portfolio concept does not have a live ' + (label || 'social') + ' destination. This is not a real business account or legal notice.' : '');
    }
  }, true);
  document.addEventListener('submit', e => {
    if(e.target.closest('dialog')) return;
    e.preventDefault(); e.stopImmediatePropagation();
    window.openDemoReview('Review your demo request');
  }, true);
  document.querySelectorAll('form input:not([type=hidden]),form textarea').forEach(input => {
    input.removeAttribute('required');
    input.placeholder = 'Demo only — do not enter personal information';
  });
  document.querySelectorAll('label:not([for])').forEach((label, index) => {
    const control = label.querySelector('input,select,textarea') || label.parentElement?.querySelector('input,select,textarea');
    if(!control) return;
    if(!control.id) control.id = `demo-control-${index + 1}`;
    label.htmlFor = control.id;
  });
  document.querySelectorAll('input:not([type=hidden]),select,textarea').forEach((control, index) => {
    if(control.getAttribute('aria-label') || control.getAttribute('aria-labelledby') || (control.id && document.querySelector(`label[for="${control.id}"]`)) || control.closest('label')) return;
    control.setAttribute('aria-label', control.getAttribute('placeholder') || control.name || `Demo control ${index + 1}`);
  });
  document.querySelectorAll('[onclick]').forEach(control => {
    if(control.matches('a,button,input,select,textarea') || control.hasAttribute('tabindex')) return;
    control.setAttribute('role','button');
    control.tabIndex = 0;
    control.addEventListener('keydown', event => {
      if(event.key === 'Enter' || event.key === ' '){ event.preventDefault(); control.click(); }
    });
  });
  document.querySelectorAll('img').forEach(img => {
    const fallback = () => {
      const notice = document.createElement('span');
      notice.textContent = 'Demo image unavailable';
      notice.setAttribute('role','img');
      notice.setAttribute('aria-label',img.alt || 'Demo image unavailable');
      img.replaceWith(notice);
    };
    img.addEventListener('error', fallback, {once:true});
    if(img.complete && img.naturalWidth === 0) fallback();
  });
  document.querySelectorAll('a').forEach(link => {
    if(link.textContent.trim() === 'Learn more'){
      link.addEventListener('click', e => {
        e.preventDefault();
        const card = link.parentElement;
        window.openDemoReview('Treatment presentation — demo', card.innerText.replace('Learn more','') + '\nThis is sample presentation content, not medical advice or a treatment recommendation.');
      }, true);
      link.href = '#demo-treatment';
    }
  });
  const treatment = document.getElementById('treatmentSelect');
  if(treatment){
    document.querySelectorAll('.service-card').forEach(card => {
      const name = card.querySelector('.service-name')?.textContent;
      const button = card.querySelector('button');
      if(!name || !button) return;
      let option = Array.from(treatment.options).find(o => o.textContent.startsWith(name));
      if(!option){ option = new Option(name, name); treatment.add(option); }
      button.addEventListener('click', () => { treatment.value = option.value; });
    });
  }
})();
