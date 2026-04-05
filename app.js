
// 1. NAVBAR SCROLL
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 40);
});

// 2. HAMBURGER MENU
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobile-menu');
hamburger.addEventListener('click', () => {
  const open = mobileMenu.classList.toggle('open');
  hamburger.setAttribute('aria-expanded', open);
});
mobileMenu.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    mobileMenu.classList.remove('open');
    hamburger.setAttribute('aria-expanded', false);
  });
});

// 3. GALLERY SLIDER
const track = document.querySelector('.gallery-track');
const slides = document.querySelectorAll('.gallery-slide');
const dots = document.querySelectorAll('.gallery-dot');
const thumbs = document.querySelectorAll('.gallery-thumb');
let current = 0, autoTimer = null;

function goTo(index) {
  current = (index + slides.length) % slides.length;
  slides.forEach((s, i) => { s.style.opacity = i === current ? '1' : '0'; s.style.position = i === current ? 'relative' : 'absolute'; });
  dots.forEach((d, i) => d.classList.toggle('active', i === current));
  thumbs.forEach((t, i) => t.classList.toggle('active', i === current));
}

function initGallery() {
  track.style.position = 'relative';
  slides.forEach((s, i) => {
    s.style.transition = 'opacity 0.6s ease';
    s.style.minWidth = '100%';
    if (i !== 0) { s.style.opacity = '0'; s.style.position = 'absolute'; s.style.top = '0'; s.style.left = '0'; }
  });
  goTo(0);
}

function startAuto() { autoTimer = setInterval(() => goTo(current + 1), 4500); }
function stopAuto() { clearInterval(autoTimer); }

initGallery();
startAuto();
document.getElementById('gallery-prev').addEventListener('click', () => { stopAuto(); goTo(current - 1); startAuto(); });
document.getElementById('gallery-next').addEventListener('click', () => { stopAuto(); goTo(current + 1); startAuto(); });
dots.forEach((d, i) => d.addEventListener('click', () => { stopAuto(); goTo(i); startAuto(); }));
thumbs.forEach((t, i) => t.addEventListener('click', () => { stopAuto(); goTo(i); startAuto(); }));
document.getElementById('gallery-slider').addEventListener('mouseenter', stopAuto);
document.getElementById('gallery-slider').addEventListener('mouseleave', startAuto);

// 4. TESTIMONIALS
const testimonials = [
  { name: 'Priya Sharma', loc: 'Bandra, Mumbai', text: 'Dr. Rahi transformed my smile completely. The clinic is spotless and the staff are incredibly warm. Best dental experience I have ever had!', stars: 5 },
  { name: 'Rahul Mehta', loc: 'Andheri, Mumbai', text: 'I was terrified of dental visits but Rahi Clinic changed that. Pain-free procedure, modern equipment, and a doctor who genuinely cares.', stars: 5 },
  { name: 'Sneha Iyer', loc: 'Powai, Mumbai', text: 'Got my braces here and the results are fantastic. Clear communication throughout the treatment. Highly recommend to everyone!', stars: 5 },
  { name: 'Amit Patel', loc: 'Dadar, Mumbai', text: 'Prompt appointment, friendly staff, and expert care. My entire family now comes to Rahi Clinic for all dental needs.', stars: 5 },
  { name: 'Kavya Nair', loc: 'Juhu, Mumbai', text: 'The teeth whitening treatment gave me incredible results. Very professional setup and the doctor explained everything clearly.', stars: 5 },
  { name: 'Rohan Desai', loc: 'Worli, Mumbai', text: 'Dental implant procedure was smooth and recovery was quick. Dr. Rahi is truly a master of his craft. Thank you!', stars: 5 }
];
let tmPage = 0;
const tmGrid = document.getElementById('testimonials-grid');
const tmDots = document.querySelectorAll('.ctrl-dot');

function renderTm() {
  const perPage = window.innerWidth < 768 ? 1 : 3;
  const start = tmPage * perPage;
  tmGrid.innerHTML = testimonials.slice(start, start + perPage).map(t => `
    <div class="tm-card">
      <div class="tm-stars">${'★'.repeat(t.stars)}</div>
      <p class="tm-text">"${t.text}"</p>
      <div class="tm-author">
        <div class="tm-avatar">${t.name.charAt(0)}</div>
        <div><div class="tm-name">${t.name}</div><div class="tm-loc">${t.loc}</div></div>
      </div>
    </div>`).join('');
  const pages = Math.ceil(testimonials.length / perPage);
  tmDots.forEach((d, i) => d.classList.toggle('active', i === tmPage % pages));
}

function tmNext() { const p = window.innerWidth < 768 ? 1 : 3; tmPage = (tmPage + 1) % Math.ceil(testimonials.length / p); renderTm(); }
function tmPrev() { const p = window.innerWidth < 768 ? 1 : 3; tmPage = (tmPage - 1 + Math.ceil(testimonials.length / p)) % Math.ceil(testimonials.length / p); renderTm(); }

document.getElementById('tm-next').addEventListener('click', tmNext);
document.getElementById('tm-prev').addEventListener('click', tmPrev);
tmDots.forEach((d, i) => d.addEventListener('click', () => { tmPage = i; renderTm(); }));
window.addEventListener('resize', renderTm);
renderTm();

// 5. PROBLEM BUTTONS
const problemBtns = document.querySelectorAll('.problem-btn');
const selectedProblems = new Set();
problemBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    const id = btn.dataset.id;
    if (selectedProblems.has(id)) { selectedProblems.delete(id); btn.classList.remove('selected'); btn.setAttribute('aria-pressed', 'false'); }
    else { selectedProblems.add(id); btn.classList.add('selected'); btn.setAttribute('aria-pressed', 'true'); }
  });
});

// 6. CONTACT FORM
const form = document.getElementById('appt-form');
const submitBtn = document.getElementById('submit-btn');
const formError = document.getElementById('form-error');
const formSuccess = document.getElementById('form-success');
const formBody = document.getElementById('form-body');

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  formError.classList.remove('visible');
  if (selectedProblems.size > 0) {
    const hidden = document.createElement('input');
    hidden.type = 'hidden'; hidden.name = 'dental_concerns';
    hidden.value = [...selectedProblems].join(', ');
    form.appendChild(hidden);
  }
  submitBtn.disabled = true; submitBtn.textContent = 'Sending…';
  try {
    const res = await fetch('https://api.web3forms.com/submit', { method: 'POST', body: new FormData(form) });
    const data = await res.json();
    if (data.success) { formBody.style.display = 'none'; formSuccess.classList.add('visible'); }
    else { throw new Error(data.message || 'Submission failed'); }
  } catch (err) {
    document.getElementById('form-error-msg').textContent = err.message || 'Something went wrong. Please try again.';
    formError.classList.add('visible');
    submitBtn.disabled = false; submitBtn.textContent = 'Send Message';
  }
});

document.getElementById('reset-form-btn').addEventListener('click', () => {
  form.reset(); selectedProblems.clear();
  problemBtns.forEach(b => { b.classList.remove('selected'); b.setAttribute('aria-pressed', 'false'); });
  formSuccess.classList.remove('visible'); formBody.style.display = 'block';
  submitBtn.disabled = false; submitBtn.textContent = 'Send Message';
});
