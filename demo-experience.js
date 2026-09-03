(() => {
  const banner = document.createElement('aside');
  banner.textContent = 'INTERACTIVE PORTFOLIO DEMO — Sample business, prices, people, reviews and availability. Nothing here books, pays, sends a message or provides professional advice.';
  Object.assign(banner.style, {position:'relative',zIndex:10000,background:'#242b31',color:'#fff',padding:'16px 24px',font:'14px/1.5 system-ui'});
  document.body.prepend(banner);
  const dialog = document.createElement('dialog');
  dialog.setAttribute('aria-labelledby','demoReviewTitle');
  Object.assign(dialog.style,{maxWidth:'560px',width:'calc(100% - 32px)',padding:'28px',border:'1px solid #ddd',borderRadius:'16px',background:'#fff',color:'#242b31',font:'16px/1.6 system-ui'});
  dialog.innerHTML = '<h2 id="demoReviewTitle">Review your demo</h2><p>This simulation stays on this page. Do not enter personal information. No payment or request will be sent.</p><div id="demoReviewSummary" style="white-space:pre-wrap"></div><p id="demoReviewStatus" role="status"></p><button type="button" id="demoReviewConfirm">Complete simulation</button> <button type="button" id="demoReviewClose">Back to demo</button><p><a href="https://sion-united.vercel.app/#contact" target="_blank" rel="noopener">Want a website like this? Request a Sion United proposal →</a></p>';
  document.body.append(dialog);
  let opener;
  window.openDemoReview = (title = 'Review your demo', description = '') => {
    opener = document.activeElement;
    dialog.querySelector('h2').textContent = title;
    const choices = Array.from(document.querySelectorAll('select')).map(s => s.options[s.selectedIndex]?.textContent).filter(Boolean);
    const result = document.querySelector('aside.answer, aside.result, .result, [id="selectedDate"]');
    dialog.querySelector('#demoReviewSummary').textContent = description || [choices.join(' · '), result?.innerText || 'Explore the options, then return here to complete the simulated journey.'].join('\n');
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
