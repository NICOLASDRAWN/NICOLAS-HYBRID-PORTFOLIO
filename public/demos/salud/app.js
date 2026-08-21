/**
 * Aura Wellness Center — Client Logic (Treatments Catalog & Appointment Booking)
 */

const treatments = [
  { id: 1, title: 'Hidrafacial & Limpieza Médica', tag: 'Dermatología', desc: 'Protocolo de microdermoabrasión con infusión de ácido hialurónico y antioxidantes.', price: 65, duration: '60 min' },
  { id: 2, title: 'Drenaje Linfático Postural', tag: 'Fisioterapia', desc: 'Terapia manual biomecánica para reducción de inflamación y activación circulatoria.', price: 50, duration: '50 min' },
  { id: 3, title: 'Terapia Láser Rejuvenecedora', tag: 'Medicina Estética', desc: 'Estimulación de neocilágeno y elastina sin periodo de recuperación ni descamación.', price: 120, duration: '45 min' },
  { id: 4, title: 'Masaje Holístico Anti-Estrés', tag: 'Spa Terapéutico', desc: 'Aromaterapia con aceites esenciales de lavanda orgánica y piedras volcánicas cálidas.', price: 45, duration: '60 min' },
  { id: 5, title: 'Sueroterapia Inmunológica (IV Drip)', tag: 'Salud Celular', desc: 'Complejo de altas dosis de Vitamina C, Glutatión y minerales quelados.', price: 85, duration: '40 min' },
  { id: 6, title: 'Consulta Nutricional Antiedad', tag: 'Nutrición', desc: 'Plan metabólico personalizado con medición de composición corporal InBody.', price: 55, duration: '45 min' }
];

document.addEventListener('DOMContentLoaded', () => {
  renderTreatments();
  initBookingModal();
});

function renderTreatments() {
  const container = document.getElementById('treatmentsContainer');
  if (!container) return;

  container.innerHTML = treatments.map(t => `
    <div class="treatment-card">
      <div class="treatment-tag">${t.tag} • ${t.duration}</div>
      <h3 class="treatment-title">${t.title}</h3>
      <p class="treatment-desc">${t.desc}</p>
      <div class="treatment-bottom">
        <span class="treatment-price">$${t.price} USD</span>
        <button class="btn-primary" style="padding: 0.45rem 1rem; font-size: 0.85rem;" onclick="openBooking('${t.title}')">Reservar</button>
      </div>
    </div>
  `).join('');
}

function initBookingModal() {
  const modal = document.getElementById('bookingModal');
  const openBtn = document.getElementById('openBookingModalBtn');
  const closeBtn = document.getElementById('closeModalBtn');
  const form = document.getElementById('appointmentForm');

  const closeModal = () => modal?.classList.remove('open');

  openBtn?.addEventListener('click', () => modal?.classList.add('open'));
  closeBtn?.addEventListener('click', closeModal);

  modal?.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  form?.addEventListener('submit', (e) => {
    e.preventDefault();
    const treatment = document.getElementById('modalTreatmentSelect').value;
    const doctor = document.getElementById('modalDoctorSelect').value;
    const date = document.getElementById('modalDate').value;
    const time = document.getElementById('modalTime').value;
    const name = document.getElementById('modalPatientName').value;
    const phone = document.getElementById('modalPatientPhone').value;

    const msg = `Hola Aura Wellness Center,%0A%0ASolicito agendar cita médica:%0A• *Tratamiento:* ${treatment}%0A• *Especialista:* ${doctor}%0A• *Fecha:* ${date} a las ${time}%0A• *Paciente:* ${name}%0A• *Tel:* ${phone}`;

    window.open(`https://wa.me/573150135016?text=${msg}`, '_blank');
    form.reset();
    closeModal();
  });
}

window.openBooking = function(treatmentTitle) {
  const modal = document.getElementById('bookingModal');
  const select = document.getElementById('modalTreatmentSelect');
  if (modal) {
    if (select && treatmentTitle) {
      // Find matching option or select first
      for (let opt of select.options) {
        if (opt.text.includes(treatmentTitle)) {
          opt.selected = true;
          break;
        }
      }
    }
    modal.classList.add('open');
  }
};

window.openBookingWithDoc = function(doctorName) {
  const modal = document.getElementById('bookingModal');
  const docSelect = document.getElementById('modalDoctorSelect');
  if (modal) {
    if (docSelect && doctorName) {
      docSelect.value = doctorName;
    }
    modal.classList.add('open');
  }
};
