/**
 * Urban Luxe Real Estate — Client Logic (Properties Filtering, Mortgage Calculator & Tours)
 */

const propertiesData = [
  {
    id: 1,
    title: 'Skyline Glass Penthouse',
    type: 'Penthouse',
    location: 'Distrito Financiero, Torre 42',
    price: 850000,
    beds: 3,
    baths: 3.5,
    area: 280
  },
  {
    id: 2,
    title: 'Villa Serena & Private Pool',
    type: 'Villa',
    location: 'Colinas del Lago, Sector Exclusivo',
    price: 620000,
    beds: 4,
    baths: 4,
    area: 390
  },
  {
    id: 3,
    title: 'Metropolitan Minimalist Loft',
    type: 'Loft',
    location: 'Zona Rosa / Design District',
    price: 340000,
    beds: 1,
    baths: 1.5,
    area: 110
  },
  {
    id: 4,
    title: 'Modernist Horizon Residence',
    type: 'Villa',
    location: 'Altos del Bosque',
    price: 780000,
    beds: 4,
    baths: 5,
    area: 450
  },
  {
    id: 5,
    title: 'Minimalist Garden Studio',
    type: 'Loft',
    location: 'Paseo de las Artes',
    price: 260000,
    beds: 1,
    baths: 1,
    area: 85
  },
  {
    id: 6,
    title: 'Crown Imperial Sky Penthouse',
    type: 'Penthouse',
    location: 'Avenida Costanera Luxury',
    price: 1250000,
    beds: 4,
    baths: 4.5,
    area: 420
  }
];

document.addEventListener('DOMContentLoaded', () => {
  renderProperties();
  initFilters();
  initCalculator();
  initTourModal();
});

function renderProperties() {
  const container = document.getElementById('propertiesGrid');
  if (!container) return;

  const typeFilter = document.getElementById('filterType')?.value || 'todos';
  const priceFilter = document.getElementById('filterPrice')?.value || 'todos';

  let filtered = propertiesData.filter(p => {
    const matchType = typeFilter === 'todos' || p.type === typeFilter;
    let matchPrice = true;
    if (priceFilter === 'under500k') matchPrice = p.price <= 500000;
    if (priceFilter === 'over500k') matchPrice = p.price > 500000;
    return matchType && matchPrice;
  });

  container.innerHTML = filtered.map(p => `
    <article class="prop-card">
      <div class="prop-preview">
        <span class="prop-type-badge">${p.type}</span>
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.4)" stroke-width="1.5">
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
          <polyline points="9 22 9 12 15 12 15 22"></polyline>
        </svg>
      </div>

      <div class="prop-body">
        <h3 class="prop-title">${p.title}</h3>
        <span class="prop-location">${p.location}</span>

        <div class="prop-features">
          <span>🛏 ${p.beds} Hab</span>
          <span>🚿 ${p.baths} Baños</span>
          <span>📐 ${p.area} m²</span>
        </div>

        <div class="prop-bottom">
          <span class="prop-price">$${p.price.toLocaleString()} USD</span>
          <button class="btn-schedule-sm" onclick="openTour('${p.title}')">Agendar Visita</button>
        </div>
      </div>
    </article>
  `).join('');
}

function initFilters() {
  document.getElementById('filterType')?.addEventListener('change', renderProperties);
  document.getElementById('filterPrice')?.addEventListener('change', renderProperties);
}

function initCalculator() {
  const priceInput = document.getElementById('calcPrice');
  const downPctInput = document.getElementById('calcDownPct');
  const yearsInput = document.getElementById('calcYears');
  const rateInput = document.getElementById('calcRate');

  function calculate() {
    const price = parseFloat(priceInput.value) || 450000;
    const downPct = parseFloat(downPctInput.value) || 20;
    const years = parseInt(yearsInput.value) || 20;
    const rate = parseFloat(rateInput.value) || 6.5;

    const downPayment = price * (downPct / 100);
    const loanAmount = price - downPayment;
    const monthlyRate = (rate / 100) / 12;
    const numberOfPayments = years * 12;

    const monthlyPayment = (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) / (Math.pow(1 + monthlyRate, numberOfPayments) - 1);

    document.getElementById('monthlyPaymentOutput').textContent = `$${Math.round(monthlyPayment).toLocaleString()} USD`;
    document.getElementById('loanAmountOutput').textContent = `$${Math.round(loanAmount).toLocaleString()} USD`;
    document.getElementById('downPaymentOutput').textContent = `$${Math.round(downPayment).toLocaleString()} USD`;
  }

  [priceInput, downPctInput, yearsInput, rateInput].forEach(el => {
    el?.addEventListener('input', calculate);
    el?.addEventListener('change', calculate);
  });

  calculate();
}

function initTourModal() {
  const modal = document.getElementById('tourModal');
  const openBtn = document.getElementById('openTourModalBtn');
  const closeBtn = document.getElementById('closeTourBtn');
  const form = document.getElementById('tourForm');

  const closeModal = () => modal?.classList.remove('open');

  openBtn?.addEventListener('click', () => modal?.classList.add('open'));
  closeBtn?.addEventListener('click', closeModal);

  modal?.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  form?.addEventListener('submit', (e) => {
    e.preventDefault();
    const prop = document.getElementById('tourPropertySelect').value;
    const name = document.getElementById('tourName').value;
    const phone = document.getElementById('tourPhone').value;

    const msg = `Hola Urban Luxe Real Estate,%0A%0ASolicito visita privada para la propiedad:%0A• *Inmueble:* ${prop}%0A• *Cliente:* ${name}%0A• *WhatsApp:* ${phone}`;

    window.open(`https://wa.me/573150135016?text=${msg}`, '_blank');
    form.reset();
    closeModal();
  });
}

window.openTour = function(propertyTitle) {
  const modal = document.getElementById('tourModal');
  const select = document.getElementById('tourPropertySelect');
  if (modal) {
    if (select && propertyTitle) {
      for (let opt of select.options) {
        if (opt.text.includes(propertyTitle)) {
          opt.selected = true;
          break;
        }
      }
    }
    modal.classList.add('open');
  }
};
