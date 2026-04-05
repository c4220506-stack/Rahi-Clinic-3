ap
const navbar=document.getElementById('navbar');
window.addEventListener('scroll',()=>{navbar.classList.toggle('scrolled',window.scrollY>10)},{passive:true});
const hamburger=document.getElementById('hamburger');
const mobileMenu=document.getElementById('mobile-menu');
hamburger.addEventListener('click',()=>{const open=hamburger.classList.toggle('open');mobileMenu.classList.toggle('open',open);hamburger.setAttribute('aria-expanded',open);});
mobileMenu.querySelectorAll('a').forEach(link=>{link.addEventListener('click',()=>{hamburger.classList.remove('open');mobileMenu.classList.remove('open');});});

const slides=document.querySelectorAll('.gallery-slide');
const dots=document.querySelectorAll('.gallery-dot');
const thumbs=document.querySelectorAll('.gallery-thumb');
let galleryIndex=0,galleryPaused=false,galleryTimer;
function goToSlide(n){slides[galleryIndex].classList.remove('active');dots[galleryIndex].classList.remove('active');thumbs[galleryIndex]&&thumbs[galleryIndex].classList.remove('active');galleryIndex=(n+slides.length)%slides.length;slides[galleryIndex].classList.add('active');dots[galleryIndex].classList.add('active');thumbs[galleryIndex]&&thumbs[galleryIndex].classList.add('active');}
function startGalleryTimer(){clearInterval(galleryTimer);galleryTimer=setInterval(()=>{if(!galleryPaused)goToSlide(galleryIndex+1);},4500);}
document.getElementById('gallery-prev').addEventListener('click',()=>{goToSlide(galleryIndex-1);startGalleryTimer();});
document.getElementById('gallery-next').addEventListener('click',()=>{goToSlide(galleryIndex+1);startGalleryTimer();});
dots.forEach((dot,i)=>dot.addEventListener('click',()=>{goToSlide(i);startGalleryTimer();}));
thumbs.forEach((thumb,i)=>thumb.addEventListener('click',()=>{goToSlide(i);startGalleryTimer();}));
const gallerySlider=document.getElementById('gallery-slider');
gallerySlider.addEventListener('mouseenter',()=>galleryPaused=true);
gallerySlider.addEventListener('mouseleave',()=>galleryPaused=false);
let touchStartX=null;
gallerySlider.addEventListener('touchstart',e=>{touchStartX=e.touches[0].clientX;},{passive:true});
gallerySlider.addEventListener('touchend',e=>{if(touchStartX===null)return;const diff=touchStartX-e.changedTouches[0].clientX;if(Math.abs(diff)>50){goToSlide(galleryIndex+(diff>0?1:-1));startGalleryTimer();}touchStartX=null;});
slides[0].classList.add('active');dots[0].classList.add('active');thumbs[0]&&thumbs[0].classList.add('active');
startGalleryTimer();

const TESTIMONIALS=[
  {name:'Priya Sharma',role:'Orthodontics Patient',avatar:'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',quote:'Dr. Rahi and his team are absolutely wonderful. My Invisalign treatment was painless and I saw results within weeks. The clinic is spotlessly clean and the staff are so warm and professional.'},
  {name:'Rahul Mehta',role:'Dental Implant Patient',avatar:'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',quote:'I was extremely nervous about my implant procedure but Dr. Rahi made me feel completely at ease. The implants look so natural — no one can tell they aren\'t my real teeth. Life-changing!'},
  {name:'Anjali Singh',role:'General Dentistry Patient',avatar:'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=150&q=80',quote:"I've been bringing my entire family to Rahi Clinic for three years now. The children feel completely comfortable here — no tears, no fear!"},
  {name:'Vikram Patel',role:'Oral Surgery Patient',avatar:'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=150&q=80',quote:'Had a complex wisdom tooth extraction and was dreading it. The procedure was smooth, recovery was fast. Best dental clinic in Mumbai, without a doubt.'},
  {name:'Kavitha Nair',role:'Cosmetic Dentistry Patient',avatar:'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=150&q=80',quote:'My smile makeover at Rahi Clinic was the best investment I\'ve ever made. The veneers look stunning and completely natural.'}
];
let tmCurrent=0,tmPaused=false,tmTimer;
const tmGrid=document.getElementById('testimonials-grid');
const tmDots=document.querySelectorAll('.ctrl-dot');
function starSVG(){return`<svg class="star" viewBox="0 0 16 16"><path d="M8 1l1.8 3.6L14 5.4l-3 2.9.7 4.1L8 10.4l-3.7 2 .7-4.1L2 5.4l4.2-.8L8 1z"/></svg>`;}
function renderTestimonials(){const visible=[tmCurrent,(tmCurrent+1)%TESTIMONIALS.length];tmGrid.innerHTML=visible.map(i=>{const t=TESTIMONIALS[i];return`<article class="testimonial-card"><div class="stars">${[1,2,3,4,5].map(starSVG).join('')}</div><p class="testimonial-quote"><span class="quote-open">&ldquo;</span>${t.quote}<span class="quote-close">&rdquo;</span></p><div class="testimonial-patient"><div class="patient-avatar"><img src="${t.avatar}" alt="${t.name}" loading="lazy" onerror="this.style.display='none'"></div><div><p class="patient-name">${t.name}</p><p class="patient-role">${t.role}</p></div></div></article>`;}).join('');tmDots.forEach((dot,idx)=>dot.classList.toggle('active',idx===tmCurrent));}
function tmNext(){tmCurrent=(tmCurrent+1)%TESTIMONIALS.length;renderTestimonials();}
function tmPrev(){tmCurrent=(tmCurrent-1+TESTIMONIALS.length)%TESTIMONIALS.length;renderTestimonials();}
document.getElementById('tm-prev').addEventListener('click',()=>{tmPrev();resetTmTimer();});
document.getElementById('tm-next').addEventListener('click',()=>{tmNext();resetTmTimer();});
tmDots.forEach((dot,i)=>dot.addEventListener('click',()=>{tmCurrent=i;renderTestimonials();resetTmTimer();}));
document.getElementById('testimonials').addEventListener('mouseenter',()=>tmPaused=true);
document.getElementById('testimonials').addEventListener('mouseleave',()=>tmPaused=false);
function resetTmTimer(){clearInterval(tmTimer);tmTimer=setInterval(()=>{if(!tmPaused)tmNext();},4000);}
renderTestimonials();resetTmTimer();

const problemBtns=document.querySelectorAll('.problem-btn');
const selectedProblems=new Set();
problemBtns.forEach(btn=>{btn.addEventListener('click',()=>{const id=btn.dataset.id;if(selectedProblems.has(id)){selectedProblems.delete(id);btn.classList.remove('selected');btn.setAttribute('aria-pressed','false');}else{selectedProblems.add(id);btn.classList.add('selected');btn.setAttribute('aria-pressed','true');}});});

const PROBLEM_LABELS={routine_checkup:'Routine Checkup & Cleaning',tooth_ache:'Tooth Ache or Sharp Pain',whitening:'Teeth Whitening & Brightening',gum_issues:'Bleeding or Swollen Gums',broken_tooth:'Broken or Chipped Tooth',implants:'Missing Tooth / Dental Implants',braces:'Straightening / Braces / Aligners',bad_breath:'Bad Breath (Halitosis) Treatment',wisdom_tooth:'Wisdom Tooth Consultation',sensitivity:'Sensitivity to Hot or Cold'};
const contactForm=document.getElementById('contact-form');
const formBody=document.getElementById('form-body');
const formSuccess=document.getElementById('form-success');
const formError=document.getElementById('form-error');
const formErrorMsg=document.getElementById('form-error-msg');
const submitBtn=document.getElementById('submit-btn');
document.getElementById('reset-form-btn').addEventListener('click',()=>{contactForm.reset();selectedProblems.clear();problemBtns.forEach(btn=>{btn.classList.remove('selected');btn.setAttribute('aria-pressed','false');});formSuccess.classList.remove('active');formBody.style.display='';});
contactForm.addEventListener('submit',async(e)=>{e.preventDefault();formError.classList.remove('active');submitBtn.disabled=true;submitBtn.textContent='Sending…';
const dentalConcerns=selectedProblems.size?[...selectedProblems].map(id=>PROBLEM_LABELS[id]).join(', '):'Not specified';
const payload={access_key:'f5d8849a-990e-40ac-970c-af12635ea46e','Patient Name':document.getElementById('patientName').value.trim(),'Phone Number':document.getElementById('phone').value.trim(),'Dental Concerns':dentalConcerns,'Brief Message':document.getElementById('message').value.trim(),botcheck:''};
try{const res=await fetch('https://api.web3forms.com/submit',{method:'POST',headers:{'Content-Type':'application/json',Accept:'application/json'},body:JSON.stringify(payload)});const result=await res.json();if(result.success){formBody.style.display='none';formSuccess.classList.add('active');}else{formErrorMsg.textContent=result.message||'Something went wrong.';formError.classList.add('active');submitBtn.disabled=false;submitBtn.textContent='Send Message';}}catch{formErrorMsg.textContent='Network error. Please check your connection.';formError.classList.add('active');submitBtn.disabled=false;submitBtn.textContent='Send Message';}});
How 
