// Reveal on scroll
  const reveals = document.querySelectorAll('.reveal');
  const io = new IntersectionObserver((entries)=>{
    entries.forEach(e=>{
      if(e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target); }
    });
  }, {threshold:0.15});
  reveals.forEach(el=>io.observe(el));

  // Product tour showcase — clickable thumbnails, dots, arrows, auto-rotate
  function initShowcase(){
    const root = document.getElementById('heroCard');
    const stage = document.getElementById('showcaseStage');
    if(!root || !stage) return;

    const slides = Array.from(stage.querySelectorAll('img'));
    const dotsWrap = document.getElementById('showcaseDots');
    const thumbsWrap = document.getElementById('showcaseThumbs');
    const dots = dotsWrap ? Array.from(dotsWrap.children) : [];
    const thumbs = thumbsWrap ? Array.from(thumbsWrap.children) : [];
    const captionEl = document.getElementById('showcaseCaption');
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let idx = 0;
    let timer = null;

    function render(){
      slides.forEach((s,i)=> s.classList.toggle('active', i === idx));
      dots.forEach((d,i)=> d.classList.toggle('active', i === idx));
      thumbs.forEach((t,i)=> t.classList.toggle('active', i === idx));
      if(captionEl && slides[idx]) captionEl.textContent = slides[idx].getAttribute('data-caption') || '';
    }
    function goTo(n){
      if(!slides.length) return;
      idx = ((n % slides.length) + slides.length) % slides.length;
      render();
    }
    function next(){ goTo(idx + 1); }
    function prev(){ goTo(idx - 1); }
    function restart(){
      clearInterval(timer);
      if(!prefersReduced){ timer = setInterval(next, 4200); }
    }

    // single delegated click handler — robust against any one element failing to bind
    root.addEventListener('click', function(e){
      const t = e.target;
      if(!(t instanceof Element)) return;

      const dotBtn = t.closest('#showcaseDots button');
      if(dotBtn){ goTo(dots.indexOf(dotBtn)); restart(); return; }

      const thumbBtn = t.closest('.st-thumb');
      if(thumbBtn){ goTo(thumbs.indexOf(thumbBtn)); restart(); return; }

      if(t.closest('#showcaseNext')){ next(); restart(); return; }
      if(t.closest('#showcasePrev')){ prev(); restart(); return; }
    });

    root.addEventListener('mouseenter', ()=> clearInterval(timer));
    root.addEventListener('mouseleave', restart);

    render();
    restart();
  }

  if(document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', initShowcase);
  } else {
    initShowcase();
  }

  
