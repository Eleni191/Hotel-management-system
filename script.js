// ==========================================================
// Sunrise Hotel – public site scripts
// ==========================================================

const ROOM_PRICES = { single: 2000, double: 2800, luxury: 3500 };
const ROOM_NAMES = { single: 'Single room', double: 'Double room', luxury: 'Luxury room' };
const SERVICE_NAMES = {
  spa: 'Spa & wellness package',
  airport: 'Airport transfer',
  breakfast: 'Breakfast buffet',
  dinner: 'Romantic dinner',
  '': 'None'
};

const form = document.getElementById('bookingForm');
const roomSelect = document.getElementById('roomType');
const nightsSelect = document.getElementById('nights');
const checkinInput = document.getElementById('checkin');
const totalEl = document.getElementById('estimateTotal');
const messageEl = document.getElementById('formMessage');

// ---------- Mobile menu ----------
const nav = document.getElementById('nav');
const navToggle = document.getElementById('navToggle');

function setMenu(open) {
  nav.classList.toggle('is-open', open);
  navToggle.setAttribute('aria-expanded', String(open));
  navToggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
}

navToggle.addEventListener('click', () => {
  setMenu(!nav.classList.contains('is-open'));
});

// Close the menu after tapping a link, or pressing Escape
nav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => setMenu(false)));
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') setMenu(false);
});

// ---------- Select a room from a card ----------
document.querySelectorAll('[data-room]').forEach(btn => {
  btn.addEventListener('click', () => {
    roomSelect.value = btn.dataset.room;
    updateEstimate();
    document.getElementById('booking').scrollIntoView({ behavior: 'smooth' });
  });
});

// ---------- Live price estimate ----------
function updateEstimate() {
  const price = ROOM_PRICES[roomSelect.value] || 0;
  const nights = parseInt(nightsSelect.value, 10) || 1;
  totalEl.textContent = (price * nights).toLocaleString('en-US') + ' ETB';
}

roomSelect.addEventListener('change', updateEstimate);
nightsSelect.addEventListener('change', updateEstimate);

// ---------- Check-in can't be in the past ----------
checkinInput.min = new Date().toISOString().split('T')[0];

// ---------- Form submit ----------
function showMessage(text, isError) {
  messageEl.textContent = text;
  messageEl.classList.toggle('is-error', Boolean(isError));
  messageEl.classList.add('is-visible');
}

form.addEventListener('submit', e => {
  e.preventDefault();

  const name = form.name.value.trim();
  const email = form.email.value.trim();
  const roomType = roomSelect.value;
  const checkin = checkinInput.value;
  const nights = nightsSelect.value;
  const service = form.services.value;

  if (!name || !email || !roomType || !checkin) {
    showMessage('Please fill in all required fields.', true);
    return;
  }

  if (!form.email.checkValidity()) {
    showMessage('Please enter a valid email address.', true);
    return;
  }

  // In a real application you would send this data to a server.
  showMessage(
    `Thank you, ${name}! Your booking request is in. ` +
    `${ROOM_NAMES[roomType]}, check-in ${checkin}, ${nights} night(s), ` +
    `extra service: ${SERVICE_NAMES[service]}. ` +
    `We will email ${email} to confirm your reservation.`,
    false
  );

  form.reset();
  updateEstimate();
});

// ---------- Footer year ----------
document.getElementById('year').textContent = new Date().getFullYear();