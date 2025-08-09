(function(){
  const track = document.querySelector('.carousel-track');
  if(!track) return;
  const prev = document.querySelector('.carousel .prev');
  const next = document.querySelector('.carousel .next');
  const step = 220;
  prev.addEventListener('click',()=> track.scrollBy({left:-step, behavior:'smooth'}));
  next.addEventListener('click',()=> track.scrollBy({left: step, behavior:'smooth'}));
  let dir = 1;
  setInterval(()=>{
    if (track.scrollLeft + track.clientWidth >= track.scrollWidth - 2) dir = -1;
    if (track.scrollLeft <= 2) dir = 1;
    track.scrollBy({left: dir*step/2, behavior:'smooth'});
  }, 2500);
})();