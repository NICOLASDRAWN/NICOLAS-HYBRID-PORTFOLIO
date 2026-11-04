/**
 * Gourmet Bistro — Client Logic (Menu Filtering, Interactive Cart & NFC Table Orders)
 */

const menuData = [
  { id: 1, category: 'entradas', name: 'Carpaccio de Res Trufado', desc: 'Finas láminas de lomo sellado, parmesano reggiano 24 meses y aceite de trufa blanca.', price: 16.50, tag: 'Recomendado' },
  { id: 2, category: 'entradas', name: 'Burrata Pugliese Artesanal', desc: 'Tomates reliquia confitados, pesto de albahaca fresca y reducción balsámica de Módena.', price: 14.00, tag: 'Vegetariano' },
  { id: 3, category: 'fuertes', name: 'Bife Ancho Angus 350g', desc: 'Madurado 30 días, mantequilla de romero, papas rústicas al vapor y vegetales asados.', price: 29.00, tag: 'Corte Premium' },
  { id: 4, category: 'fuertes', name: 'Risotto de Hongos Silvestres', desc: 'Arroz arborio cremoso, mix de setas porcini, mantequilla trufada y crocante de parmesano.', price: 22.50, tag: 'Especialidad' },
  { id: 5, category: 'fuertes', name: 'Salmón Noruego en Costra de Pistacho', desc: 'Puré de coliflor trufado, espárragos al grill y salsa cítrica de maracuyá.', price: 26.00, tag: 'Sin Gluten' },
  { id: 6, category: 'vinos', name: 'Malbec Reserva Mendoza 2021', desc: 'Notas de frutos negros, roble francés y taninos sedosos. Botella 750ml.', price: 38.00, tag: 'Sommelier Pick' },
  { id: 7, category: 'vinos', name: 'Negroni Clásico Ahumado', desc: 'Gin premium, Campari, Vermouth rojo y twist de naranja flameada en madera de cedro.', price: 12.00, tag: 'Coctel de Autor' },
  { id: 8, category: 'postres', name: 'Volcán de Chocolate Belga', desc: 'Centro líquido de cacao 70%, servido con helado artesanal de vainilla de Madagascar.', price: 9.50, tag: 'Favorito' }
];

let cart = [];

document.addEventListener('DOMContentLoaded', () => {
  renderDishes('todos');
  initTabs();
  initCart();
  initWaiterCall();
});

function renderDishes(category) {
  const container = document.getElementById('dishesGrid');
  if (!container) return;

  const filtered = category === 'todos' ? menuData : menuData.filter(d => d.category === category);

  container.innerHTML = filtered.map(dish => `
    <article class="dish-card">
      <div class="dish-body">
        <div class="dish-badge">${dish.tag}</div>
        <h3 class="dish-title">${dish.name}</h3>
        <p class="dish-desc">${dish.desc}</p>
        <div class="dish-footer">
          <div class="dish-price">$${dish.price.toFixed(2)}</div>
          <button class="btn-add-dish" onclick="addToCart(${dish.id})">+ Añadir</button>
        </div>
      </div>
    </article>
  `).join('');
}

function initTabs() {
  const tabs = document.querySelectorAll('.menu-tab');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const cat = tab.getAttribute('data-category');
      renderDishes(cat);
    });
  });
}

function initCart() {
  const openBtn = document.getElementById('openCartBtn');
  const closeBtn = document.getElementById('closeCartBtn');
  const drawer = document.getElementById('cartDrawer');
  const backdrop = document.getElementById('cartBackdrop');
  const sendBtn = document.getElementById('sendOrderBtn');

  openBtn?.addEventListener('click', () => {
    drawer?.classList.add('open');
    backdrop?.classList.add('open');
  });

  const closeCart = () => {
    drawer?.classList.remove('open');
    backdrop?.classList.remove('open');
  };

  closeBtn?.addEventListener('click', closeCart);
  backdrop?.addEventListener('click', closeCart);

  sendBtn?.addEventListener('click', () => {
    if (cart.length === 0) {
      alert('Tu comanda está vacía.');
      return;
    }
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const summary = cart.map(i => `• ${i.quantity}x ${i.name} ($${(i.price * i.quantity).toFixed(2)})`).join('%0A');
    const msg = `Hola Gourmet Bistro, pedido desde *Mesa #07* (NFC):%0A%0A${summary}%0A%0A*Total: $${total.toFixed(2)} USD*`;
    
    window.open(`https://wa.me/573150135016?text=${msg}`, '_blank');
    cart = [];
    updateCartUI();
    closeCart();
  });
}

window.addToCart = function(id) {
  const dish = menuData.find(d => d.id === id);
  if (!dish) return;

  const existing = cart.find(i => i.id === id);
  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({ ...dish, quantity: 1 });
  }

  updateCartUI();

  // Open cart drawer briefly
  document.getElementById('cartDrawer')?.classList.add('open');
  document.getElementById('cartBackdrop')?.classList.add('open');
};

function updateCartUI() {
  const countEl = document.getElementById('cartCount');
  const container = document.getElementById('cartItemsContainer');
  const totalEl = document.getElementById('cartTotalPrice');

  const totalCount = cart.reduce((sum, i) => sum + i.quantity, 0);
  if (countEl) countEl.textContent = totalCount;

  if (!container || !totalEl) return;

  if (cart.length === 0) {
    container.innerHTML = '<div class="cart-empty-state">Tu comanda está vacía. Añade platos desde el menú.</div>';
    totalEl.textContent = '$0.00';
    return;
  }

  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  totalEl.textContent = `$${total.toFixed(2)}`;

  container.innerHTML = cart.map(item => `
    <div class="cart-item-row">
      <div>
        <div style="font-weight: 700; font-size: 0.9rem;">${item.name}</div>
        <div style="font-size: 0.8rem; color: var(--bistro-muted);">$${item.price.toFixed(2)} c/u</div>
      </div>
      <div style="display: flex; align-items: center; gap: 0.5rem;">
        <button onclick="changeQty(${item.id}, -1)" style="background:#27272A; border:none; color:#fff; width:24px; height:24px; border-radius:4px; cursor:pointer;">-</button>
        <span style="font-weight:700; font-size:0.9rem;">${item.quantity}</span>
        <button onclick="changeQty(${item.id}, 1)" style="background:#27272A; border:none; color:#fff; width:24px; height:24px; border-radius:4px; cursor:pointer;">+</button>
      </div>
    </div>
  `).join('');
}

window.changeQty = function(id, delta) {
  const item = cart.find(i => i.id === id);
  if (!item) return;

  item.quantity += delta;
  if (item.quantity <= 0) {
    cart = cart.filter(i => i.id !== id);
  }
  updateCartUI();
};

function initWaiterCall() {
  const btn = document.getElementById('callWaiterBtn');
  btn?.addEventListener('click', () => {
    alert('🔔 Solicitud enviada: Un mesero se aproxima a la Mesa #07.');
  });
}
