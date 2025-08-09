(function(){
  const viewport = document.querySelector('.carousel-viewport');
  if(!viewport) return;
  const prev = document.querySelector('.carousel .prev');
  const next = document.querySelector('.carousel .next');
  function scrollByAmount(dir){
    const step = Math.max(320, viewport.clientWidth * 0.6);
    viewport.scrollBy({left: dir*step, behavior:'smooth'});
  }
  prev.addEventListener('click',()=> scrollByAmount(-1));
  next.addEventListener('click',()=> scrollByAmount(1));
  viewport.setAttribute('tabindex','0');
  viewport.addEventListener('keydown',e=>{
    if(e.key==='ArrowLeft') scrollByAmount(-1);
    if(e.key==='ArrowRight') scrollByAmount(1);
  });
})();