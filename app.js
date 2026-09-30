function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

window.copyTextToClipboard = function(text, successMsg) {
  if (!text) return;
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text).then(() => {
      if (typeof showToast === 'function') {
        showToast(successMsg || 'Đã sao chép vào bộ nhớ tạm!');
      } else {
        alert(successMsg || 'Đã sao chép!');
      }
    }).catch(() => {
      prompt("Nhấn Ctrl+C để sao chép:", text);
    });
  } else {
    prompt("Nhấn Ctrl+C để sao chép:", text);
  }
};

/**
 * TIỆM CHÈ NA - APPLICATION LOGIC & STATE MANAGEMENT
 */

// Master Menu Database
const MENU_DATA = [
  {
    id: "nem-nuong",
    name: "Nem Nướng Nha Trang Đặc Biệt",
    category: "hot",
    price: 35000,
    image: "images/img_06.jpg",
    badge: "BEST-SELLER",
    badgeType: "hot",
    description: "Nem nướng than hoa thơm lừng, cuốn kèm bánh tráng mềm, ram giòn rụm, dưa leo, xoài xanh và nước chấm thịt băm béo bùi gia truyền."
  },
  {
    id: "che-xoai",
    name: "Chè Xoài Caramen Núng Nính",
    category: "cold",
    price: 30000,
    image: "images/img_02.jpg",
    badge: "MÁT LẠNH",
    badgeType: "cold",
    description: "Caramen mịn màng núng nính, thịt xoài tươi vàng mọng ngọt thanh quyện cùng nước cốt dừa thơm ngậy và thạch giòn sần sật."
  },
  {
    id: "my-tron",
    name: "Mỳ Trộn Sốt Cay Đậm Đà",
    category: "hot",
    price: 35000,
    image: "images/img_07.jpg",
    badge: "ĐẬM VỊ",
    badgeType: "hot",
    description: "Sợi mỳ dai mềm thấm đẫm sốt chua ngọt cay tê, topping trứng cút, thịt bò khô, chả viên, rau thơm và hành phi thơm nức mũi."
  },
  {
    id: "chan-ga",
    name: "Chân Gà Sốt Thái Xoài Cóc",
    category: "hot",
    price: 35000,
    image: "images/img_04.jpg",
    badge: "CỰC CUỐN",
    badgeType: "hot",
    description: "Chân gà giòn sần sật rút xương, ngập trong sốt Thái chua cay tê lưỡi, thơm mùi sả quất và quả xoài, cóc tươi giòn rụm."
  },
  {
    id: "my-cay",
    name: "Mỳ Cay 7 Cấp Độ Hải Sản/Bò",
    category: "hot",
    price: 35000,
    image: "images/img_05.jpg",
    badge: "CAY TÊ",
    badgeType: "hot",
    description: "Nước dùng chua cay kim chi đậm đà, tôm sú tươi, xúc xích, mực viên, nấm kim châm và rau cải tươi mát kích thích vị giác."
  },
  {
    id: "tra-sua",
    name: "Trà Sữa Trân Châu Đường Đen",
    category: "cold",
    price: 25000,
    image: "images/img_01.jpg",
    badge: "THƠM BÉO",
    badgeType: "cold",
    description: "Trà sữa pha mới đậm vị trà thơm lừng, ngọt thanh dịu nhẹ, trân châu dẻo dai nấu đường đen ấm nóng ngậy béo."
  },
  {
    id: "che-dua-dam",
    name: "Chè Dừa Dầm Hải Phòng",
    category: "cold",
    price: 25000,
    image: "images/img_03.jpg",
    badge: "THANH MÁT",
    badgeType: "cold",
    description: "Cơm dừa non giòn bùi, thạch dừa thanh mát, trân châu dừa nhân cùi dừa tươi chan đẫm sữa dừa béo ngậy đặc biệt."
  },
  {
    id: "banh-mi-chao",
    name: "Bánh Mì Chảo Thập Cẩm",
    category: "hot",
    price: 35000,
    image: "images/img_09.jpg",
    badge: "NÓNG GIÒN",
    badgeType: "hot",
    description: "Chảo sốt nóng hổi xèo xèo gồm trứng ốp la lòng đào, pate béo ngậy, xúc xích rán giòn, chả lụa kèm bánh mì giòn tan."
  },
  {
    id: "ga-ran-kimbap",
    name: "Mẹt Đồ Chiên & Gà Rán Cay",
    category: "hot",
    price: 45000,
    image: "images/img_08.jpg",
    badge: "GIÒN RỤM",
    badgeType: "hot",
    description: "Gà rán sốt cay Hàn Quốc đậm vị, nem chua rán béo ngậy, xúc xích và khoai tây lắc phô mai giòn rụm chấm tương ớt cay."
  },
  {
    id: "tao-pho-caramen",
    name: "Tào Phớ Caramen Thạch Trắng",
    category: "cold",
    price: 20000,
    image: "images/img_10.jpg",
    badge: "MỀM MƯỚT",
    badgeType: "cold",
    description: "Tào phớ mướt mịn tự làm từ đậu nành nguyên chất, nước đường hoa nhài thanh dịu kết hợp bánh caramen béo ngậy thơm ngon."
  },
  {
    id: "sua-chua-mit",
    name: "Sữa Chua Mít Hạt Đác Rim",
    category: "cold",
    price: 25000,
    image: "images/img_10.jpg",
    badge: "GIẢI NHIỆT",
    badgeType: "cold",
    description: "Mít dai ngọt thơm lừng, sữa chua lên men tự nhiên, trân châu giòn sần sật và hạt đác rim đường phèn dẻo bùi."
  },
  {
    id: "tra-chanh-quat",
    name: "Trà Chanh Giã Tay & Nước Ép",
    category: "cold",
    price: 20000,
    image: "images/img_13.jpg",
    badge: "TƯƠI MÁT",
    badgeType: "cold",
    description: "Trà chanh Quảng Đông thơm nồng tinh dầu chanh giã tay tươi mới, chua thanh ngọt mát giải ngấy tức thì."
  },
  {
    id: "pack-nem-nuong",
    name: "Nem Nướng Túi Hút Chân Không",
    category: "pack",
    price: 95000,
    image: "images/img_14.jpg",
    badge: "CHUẨN ATTP",
    badgeType: "hot",
    description: "Gói nem nướng Nha Trang đóng gói vô trùng hút chân không (10 xiên lớn), có tem mác ATTP và tặng kèm túi nước chấm gia truyền."
  },
  {
    id: "pack-nem-lui",
    name: "Nem Lụi Huế Que Sả Hút Chân Không",
    category: "pack",
    price: 95000,
    image: "images/img_15.jpg",
    badge: "CHUẨN ATTP",
    badgeType: "hot",
    description: "Gói nem lụi bọc que sả tươi đóng gói hút chân không (10 que), có nhãn mác rõ ràng, tặng kèm túi nước lèo đậu phộng thơm bùi."
  }
];

// Shopping Cart State (saved to LocalStorage)
let cart = {};

// Filter & Search State
let activeCategory = 'all';
let searchQuery = '';
let currentCustomizingId = null;

// Initialize App
document.addEventListener('DOMContentLoaded', () => {
  loadCartFromStorage();
  updateCategoryCounts();
  renderMenu();
  updateCartUI();
  initStoreHours();
  initReviewsSystem();
});

// Format VND Money
function formatMoney(amount) {
  return new Intl.NumberFormat('vi-VN').format(amount) + 'đ';
}

// Check Opening Hours (09:00 - 22:30)
function initStoreHours() {
  const now = new Date();
  const hours = now.getHours();
  const minutes = now.getMinutes();
  const time = hours + minutes / 60;
  const statusDot = document.querySelector('.status-dot');
  const statusText = document.getElementById('statusText');

  if (statusText && statusDot) {
    if (time >= 9 && time <= 22.5) {
      statusDot.style.background = '#27AE60';
      statusText.textContent = 'Đang mở cửa phục vụ nóng hổi • 09:00 - 22:30';
    } else {
      statusDot.style.background = '#E67E22';
      statusText.textContent = 'Tiệm nhận đặt trước cho ngày mai • Mở cửa lúc 09:00';
    }
  }
}

// Update category item counts
function updateCategoryCounts() {
  const allCount = MENU_DATA.length;
  const hotCount = MENU_DATA.filter(i => i.category === 'hot').length;
  const coldCount = MENU_DATA.filter(i => i.category === 'cold').length;
  const packCount = MENU_DATA.filter(i => i.category === 'pack').length;

  if (document.getElementById('countAll')) document.getElementById('countAll').textContent = allCount;
  if (document.getElementById('countHot')) document.getElementById('countHot').textContent = hotCount;
  if (document.getElementById('countCold')) document.getElementById('countCold').textContent = coldCount;
  if (document.getElementById('countPack')) document.getElementById('countPack').textContent = packCount;
}

// Render Menu Items
function renderMenu() {
  const container = document.getElementById('menuGridContainer');
  const emptyState = document.getElementById('menuEmptyState');
  if (!container) return;

  const filtered = MENU_DATA.filter(item => {
    const matchCategory = (activeCategory === 'all') || (item.category === activeCategory);
    const matchSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        item.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCategory && matchSearch;
  });

  if (filtered.length === 0) {
    container.innerHTML = '';
    if (emptyState) emptyState.style.display = 'block';
    return;
  }

  if (emptyState) emptyState.style.display = 'none';

  container.innerHTML = filtered.map(item => `
    <div class="menu-card" data-id="${item.id}">
      <div class="menu-card-img-wrap" onclick="openLightbox('${item.image}', '${item.name}')">
        ${item.badge ? `<span class="menu-card-tag badge-${item.badgeType}">${item.badge}</span>` : ''}
        <img src="${item.image}" alt="${item.name}" loading="lazy">
      </div>
      <div class="menu-card-body">
        <h4 class="menu-card-title">${item.name}</h4>
        <p class="menu-card-desc">${item.description}</p>
        <div class="menu-card-footer">
          <span class="menu-card-price">${formatMoney(item.price)}</span>
          <button class="btn-card-add" onclick="addToCart('${item.id}')">
            <i class="fa-solid fa-plus"></i> Chọn Món
          </button>
        </div>
      </div>
    </div>
  `).join('');
}

// Category Filter Actions
function filterCategory(category) {
  activeCategory = category;
  document.querySelectorAll('.cat-btn').forEach(btn => {
    if (btn.getAttribute('data-category') === category) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });
  renderMenu();
}

function filterAndScroll(category) {
  filterCategory(category);
  const menuEl = document.getElementById('menu');
  if (menuEl) {
    menuEl.scrollIntoView({ behavior: 'smooth' });
  }
}

// Search Actions
function handleSearch(val) {
  searchQuery = val.trim();
  const clearBtn = document.getElementById('clearSearchBtn');
  if (clearBtn) {
    clearBtn.style.display = searchQuery ? 'block' : 'none';
  }
  renderMenu();
}

function clearSearch() {
  const input = document.getElementById('menuSearchInput');
  if (input) {
    input.value = '';
    handleSearch('');
  }
}

// ==========================================================================
// CART OPERATIONS
// ==========================================================================

function loadCartFromStorage() {
  try {
    const saved = localStorage.getItem('tiemchena_cart');
    if (saved) {
      cart = JSON.parse(saved);
    }
  } catch (e) {
    cart = {};
  }
}

function saveCartToStorage() {
  try {
    localStorage.setItem('tiemchena_cart', JSON.stringify(cart));
  } catch (e) {}
}

function addToCart(itemId, note = '') {
  const item = MENU_DATA.find(i => i.id === itemId);
  if (!item) return;

  const cartKey = itemId + (note ? '_' + note : '');

  if (cart[cartKey]) {
    cart[cartKey].qty++;
  } else {
    cart[cartKey] = {
      id: itemId,
      name: item.name,
      price: item.price,
      image: item.image,
      note: note,
      qty: 1
    };
  }

  saveCartToStorage();
  updateCartUI();
  showToast(`Đã thêm "${item.name}" vào giỏ!`);
}

function updateCartQty(cartKey, change) {
  if (!cart[cartKey]) return;

  cart[cartKey].qty += change;
  if (cart[cartKey].qty <= 0) {
    delete cart[cartKey];
  }

  saveCartToStorage();
  updateCartUI();
}

function updateCartUI() {
  const keys = Object.keys(cart);
  let totalCount = 0;
  let subtotal = 0;

  keys.forEach(k => {
    totalCount += cart[k].qty;
    subtotal += cart[k].price * cart[k].qty;
  });

  // Calculate 5% discount promo
  const discount = Math.round(subtotal * 0.05);
  const finalTotal = subtotal - discount;

  // Header & Mobile Badges
  const cartBadge = document.getElementById('cartBadge');
  const mobileCartCount = document.getElementById('mobileCartCount');
  const mobileCartTotal = document.getElementById('mobileCartTotal');
  const cartDrawerCount = document.getElementById('cartDrawerCount');

  if (cartBadge) cartBadge.textContent = totalCount;
  if (mobileCartCount) mobileCartCount.textContent = totalCount;
  if (mobileCartTotal) mobileCartTotal.textContent = formatMoney(finalTotal > 0 ? finalTotal : 0);
  if (cartDrawerCount) cartDrawerCount.textContent = `(${totalCount} món)`;

  // Summary fields
  const subtotalEl = document.getElementById('cartSubtotal');
  const discountEl = document.getElementById('cartDiscount');
  const finalTotalEl = document.getElementById('cartFinalTotal');

  if (subtotalEl) subtotalEl.textContent = formatMoney(subtotal);
  if (discountEl) discountEl.textContent = '-' + formatMoney(discount);
  if (finalTotalEl) finalTotalEl.textContent = formatMoney(finalTotal > 0 ? finalTotal : 0);

  // Render items list inside drawer
  const cartList = document.getElementById('cartItemsList');
  const cartFooter = document.getElementById('cartFooter');

  if (cartList) {
    if (keys.length === 0) {
      cartList.innerHTML = `
        <div class="cart-empty-box">
          <i class="fa-solid fa-cart-arrow-down"></i>
          <h4>Giỏ hàng của bạn đang trống!</h4>
          <p>Hãy chọn những món ăn vặt giòn ngon hoặc chè thanh mát ở menu nhé.</p>
          <button class="btn btn-primary btn-sm mt-4" onclick="closeCartDrawer()">Xem Menu Ngay</button>
        </div>
      `;
      if (cartFooter) cartFooter.style.display = 'none';
    } else {
      if (cartFooter) cartFooter.style.display = 'block';
      cartList.innerHTML = keys.map(k => {
        const it = cart[k];
        return `
          <div class="cart-item-row">
            <img src="${it.image}" alt="${it.name}" class="cart-item-thumb">
            <div class="cart-item-details">
              <div class="cart-item-name">${it.name}</div>
              ${it.note ? `<div class="cart-item-note"><i class="fa-solid fa-pen"></i> ${it.note}</div>` : ''}
              <div class="cart-item-price">${formatMoney(it.price * it.qty)}</div>
            </div>
            <div class="cart-qty-ctrl">
              <button class="qty-btn" onclick="updateCartQty('${k}', -1)" title="Giảm">-</button>
              <span class="qty-val">${it.qty}</span>
              <button class="qty-btn" onclick="updateCartQty('${k}', 1)" title="Tăng">+</button>
            </div>
          </div>
        `;
      }).join('');
    }
  }
}

// Drawer Toggle
function openCartDrawer() {
  const backdrop = document.getElementById('cartBackdrop');
  if (backdrop) backdrop.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeCartDrawer() {
  const backdrop = document.getElementById('cartBackdrop');
  if (backdrop) backdrop.classList.remove('active');
  document.body.style.overflow = '';
}

function handleBackdropClick(e) {
  if (e.target.id === 'cartBackdrop') {
    closeCartDrawer();
  }
}

// ==========================================================================
// ITEM CUSTOMIZATION MODAL
// ==========================================================================

function openCustomizeModal(itemId) {
  const item = MENU_DATA.find(i => i.id === itemId);
  if (!item) return;

  currentCustomizingId = itemId;
  const modalBackdrop = document.getElementById('customizeModalBackdrop');
  const title = document.getElementById('custItemTitle');
  const body = document.getElementById('custModalBody');
  const saveBtn = document.getElementById('custSaveBtn');

  if (title) title.textContent = `Tùy chọn: ${item.name}`;

  let optionsHtml = '';
  if (item.category === 'hot') {
    optionsHtml = `
      <div class="form-group">
        <label><strong>Độ Cay / Gia Vị:</strong></label>
        <select id="custSpiceOption" class="form-input" style="margin-top:6px;">
          <option value="Cay vừa (Mặc định)">Cay vừa (Chuẩn vị ngon)</option>
          <option value="Không cay / Ít cay">Không cay / Ít cay</option>
          <option value="Cay nhiều (Tê lưỡi)">Cay nhiều (Tê lưỡi)</option>
        </select>
      </div>
      <div class="form-group">
        <label><strong>Ghi chú riêng:</strong></label>
        <input type="text" id="custCustomNote" class="form-input" placeholder="VD: Thêm nhiều ram giòn, nhiều nước sốt..." style="margin-top:6px;">
      </div>
    `;
  } else if (item.category === 'cold') {
    optionsHtml = `
      <div class="form-group">
        <label><strong>Lượng Đá:</strong></label>
        <select id="custIceOption" class="form-input" style="margin-top:6px;">
          <option value="Đá riêng (Mặc định)">Đá để riêng (Giữ trọn vị)</option>
          <option value="Đá chung (Ăn ngay)">Đá chung (Ăn ngay)</option>
          <option value="Ít đá">Ít đá</option>
        </select>
      </div>
      <div class="form-group">
        <label><strong>Ghi chú riêng:</strong></label>
        <input type="text" id="custCustomNote" class="form-input" placeholder="VD: Ít ngọt, thêm cốt dừa..." style="margin-top:6px;">
      </div>
    `;
  } else {
    optionsHtml = `
      <div class="form-group">
        <label><strong>Ghi chú đơn hàng:</strong></label>
        <input type="text" id="custCustomNote" class="form-input" placeholder="VD: Cần gấp trong 20 phút..." style="margin-top:6px;">
      </div>
    `;
  }

  if (body) body.innerHTML = optionsHtml;

  if (saveBtn) {
    saveBtn.onclick = () => {
      let notes = [];
      const spice = document.getElementById('custSpiceOption');
      const ice = document.getElementById('custIceOption');
      const customNote = document.getElementById('custCustomNote');

      if (spice && spice.value) notes.push(spice.value);
      if (ice && ice.value) notes.push(ice.value);
      if (customNote && customNote.value.trim()) notes.push(customNote.value.trim());

      addToCart(currentCustomizingId, notes.join(' • '));
      closeCustomizeModal();
    };
  }

  if (modalBackdrop) modalBackdrop.classList.add('active');
}

function closeCustomizeModal() {
  const modalBackdrop = document.getElementById('customizeModalBackdrop');
  if (modalBackdrop) modalBackdrop.classList.remove('active');
}

function handleCustomizeBackdropClick(e) {
  if (e.target.id === 'customizeModalBackdrop') {
    closeCustomizeModal();
  }
}

// ==========================================================================
// GPS LOCATION HELPER FOR CART CHECKOUT
// ==========================================================================

function getCartGpsLocation() {
  const btn = document.getElementById('btnGetCartGps');
  const mapInput = document.getElementById('orderCustomerMapUrl');
  const addressInput = document.getElementById('orderCustomerAddress');

  if (!navigator.geolocation) {
    if (typeof showToast === 'function') {
      showToast('Trình duyệt không hỗ trợ định vị GPS tự động.', 'warning');
    } else {
      alert('Trình duyệt không hỗ trợ GPS');
    }
    return;
  }

  const originalHtml = btn ? btn.innerHTML : '';
  if (btn) {
    btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Lấy GPS...';
    btn.disabled = true;
  }

  navigator.geolocation.getCurrentPosition(
    (position) => {
      const lat = position.coords.latitude;
      const lng = position.coords.longitude;
      const mapsUrl = `https://www.google.com/maps?q=${lat.toFixed(6)},${lng.toFixed(6)}`;

      if (mapInput) {
        mapInput.value = mapsUrl;
      }

      if (btn) {
        btn.innerHTML = '<i class="fa-solid fa-check"></i> Đã lấy';
        btn.classList.add('btn-gps-success');
        setTimeout(() => {
          btn.innerHTML = originalHtml;
          btn.disabled = false;
        }, 3000);
      }

      if (typeof showToast === 'function') {
        showToast('📍 Đã lấy vị trí GPS Google Maps thành công!');
      }

      // Reverse geocode suggestion if address is blank
      if (addressInput && !addressInput.value.trim()) {
        fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`)
          .then(res => res.json())
          .then(data => {
            if (data && data.display_name && !addressInput.value.trim()) {
              addressInput.value = data.display_name;
            }
          })
          .catch(() => {});
      }
    },
    (error) => {
      if (btn) {
        btn.innerHTML = originalHtml;
        btn.disabled = false;
      }
      let msg = 'Không thể lấy GPS. Bạn vui lòng dán đường link từ Google Maps nhé!';
      if (error.code === error.PERMISSION_DENIED) {
        msg = 'Bạn đã chặn quyền truy cập vị trí. Hãy dán trực tiếp đường link Google Maps vào ô nhé!';
      }
      if (typeof showToast === 'function') {
        showToast(msg, 'warning');
      } else {
        alert(msg);
      }
    },
    { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
  );
}

// ==========================================================================
// CHECKOUT & ZALO ORDER CREATOR
// ==========================================================================

let lastGeneratedZaloOrder = "";

function submitOrderToZalo() {
  const keys = Object.keys(cart);
  if (keys.length === 0) {
    if (typeof showToast === 'function') {
      showToast('Giỏ hàng của bạn đang trống! Hãy chọn món nhé.', 'warning');
    } else {
      alert('Giỏ hàng của bạn đang trống!');
    }
    return;
  }

  const nameInput = document.getElementById('orderCustomerName');
  const phoneInput = document.getElementById('orderCustomerPhone');
  const addressInput = document.getElementById('orderCustomerAddress');
  const mapInput = document.getElementById('orderCustomerMapUrl');
  const noteInput = document.getElementById('orderCustomerNote');

  const customerName = nameInput ? nameInput.value.trim() : '';
  const customerPhone = phoneInput ? phoneInput.value.trim() : '';
  const customerAddress = addressInput ? addressInput.value.trim() : '';
  const customerMapUrl = mapInput ? mapInput.value.trim() : '';
  const customerNote = noteInput ? noteInput.value.trim() : '';

  if (!customerPhone || !customerAddress) {
    if (typeof showToast === 'function') {
      showToast('Vui lòng điền Số điện thoại & Địa chỉ nhận hàng!', 'warning');
    } else {
      alert('Vui lòng điền Số điện thoại & Địa chỉ nhận hàng!');
    }
    if (!customerPhone && phoneInput) phoneInput.focus();
    else if (!customerAddress && addressInput) addressInput.focus();
    return;
  }

  let subtotal = 0;
  let itemsHtml = '';
  let itemsZaloText = '';

  keys.forEach((k, idx) => {
    const item = cart[k];
    if (!item) return;
    const itemTotal = (item.price || 0) * (item.qty || 1);
    subtotal += itemTotal;
    
    itemsHtml += `
      <tr>
        <td class="item-name-cell">
          <strong>${escapeHtml(item.name || 'Món ăn')}</strong>
          ${item.note ? `<span class="item-note-sub"><i class="fa-solid fa-tag"></i> ${escapeHtml(item.note)}</span>` : ''}
        </td>
        <td class="text-center font-bold">x${item.qty || 1}</td>
        <td class="text-right">${formatMoney(item.price || 0)}</td>
        <td class="text-right font-bold">${formatMoney(itemTotal)}</td>
      </tr>
    `;

    itemsZaloText += `${idx + 1}. ${item.name} x${item.qty} (${formatMoney(itemTotal)})${item.note ? ` [${item.note}]` : ''}\n`;
  });

  const discount = Math.round(subtotal * 0.05);
  const finalTotal = subtotal - discount;
  const orderCode = '#TCN-' + Math.floor(1000 + Math.random() * 9000);
  const orderTime = new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }) + ' ' + new Date().toLocaleDateString('vi-VN');

  // Build structured Zalo order message with Google Maps Link
  lastGeneratedZaloOrder = 
`🍲 ĐƠN HÀNG TỪ WEBSITE TIỆM CHÈ NA 🍲
---------------------------------------
🔖 Mã đơn: ${orderCode} (${orderTime})
👤 Khách hàng: ${customerName || 'Khách đặt online'}
📞 Điện thoại: ${customerPhone}
📍 Địa chỉ: ${customerAddress}
${customerMapUrl ? `🗺️ Link vị trí Google Maps: ${customerMapUrl}\n` : ''}${customerNote ? `📝 Ghi chú: ${customerNote}\n` : ''}---------------------------------------
📋 DANH SÁCH MÓN:
${itemsZaloText}---------------------------------------
💵 Tạm tính: ${formatMoney(subtotal)}
🎁 Ưu đãi đặt trước (-5%): -${formatMoney(discount)}
👉 TỔNG THANH TOÁN: ${formatMoney(finalTotal)}
---------------------------------------
💳 MB Bank (Quân Đội) - STK: 836888181 - HỘ KINH DOANH TIỆM CHÈ NA
(Tiệm Chè Na Vũ Lăng, Ngũ Hiệp • Giao nhanh 30 phút)`;

  // Auto copy to clipboard for immediate convenience
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(lastGeneratedZaloOrder).catch(() => {});
  }

  // 1. POPULATE INVOICE (HÓA ĐƠN ĐIỆN TỬ)
  const invCode = document.getElementById('invOrderCode');
  const invTime = document.getElementById('invOrderTime');
  const invName = document.getElementById('invCustName');
  const invPhone = document.getElementById('invCustPhone');
  const invAddr = document.getElementById('invCustAddress');
  const invMapWrap = document.getElementById('invMapWrap');
  const invMapLink = document.getElementById('invCustMapLink');
  const invNote = document.getElementById('invCustNote');
  const invNoteWrap = document.getElementById('invNoteWrap');
  const invTbody = document.getElementById('invItemsTbody');
  const invSubtotal = document.getElementById('invSubtotal');
  const invDiscount = document.getElementById('invDiscount');
  const invFinal = document.getElementById('invFinalTotal');

  if (invCode) invCode.textContent = orderCode;
  if (invTime) invTime.textContent = orderTime;
  if (invName) invName.textContent = customerName || 'Khách đặt online';
  if (invPhone) invPhone.textContent = customerPhone;
  if (invAddr) invAddr.textContent = customerAddress;

  if (invMapWrap && invMapLink) {
    if (customerMapUrl) {
      invMapLink.href = customerMapUrl;
      invMapWrap.style.display = 'flex';
    } else {
      invMapWrap.style.display = 'none';
    }
  }
  
  if (invNote && invNoteWrap) {
    if (customerNote) {
      invNote.textContent = customerNote;
      invNoteWrap.style.display = 'flex';
    } else {
      invNoteWrap.style.display = 'none';
    }
  }

  if (invTbody) invTbody.innerHTML = itemsHtml;
  if (invSubtotal) invSubtotal.textContent = formatMoney(subtotal);
  if (invDiscount) invDiscount.textContent = '-' + formatMoney(discount);
  if (invFinal) invFinal.textContent = formatMoney(finalTotal);

  // 2. POPULATE VIETQR PAYMENT CODE
  const qrImg = document.getElementById('orderQrImage');
  const qrAmountDisplay = document.getElementById('qrAmountDisplay');
  const qrAmountValue = document.getElementById('qrAmountValue');
  const qrContentDisplay = document.getElementById('qrContentDisplay');
  
  const cleanPhone = customerPhone.replace(/\s+/g, '');
  const orderTransferContent = 'TIEMCHENA ' + (cleanPhone ? cleanPhone.slice(-4) : 'ONLINE');
  const vietQrUrl = `https://img.vietqr.io/image/MB-836888181-compact2.png?amount=${finalTotal}&addInfo=${encodeURIComponent(orderTransferContent)}&accountName=${encodeURIComponent('HO KINH DOANH TIEM CHE NA')}`;
  
  if (qrImg) qrImg.src = vietQrUrl;
  if (qrAmountDisplay) qrAmountDisplay.textContent = formatMoney(finalTotal);
  if (qrAmountValue) qrAmountValue.value = finalTotal;
  if (qrContentDisplay) qrContentDisplay.textContent = orderTransferContent;

  // 3. SET ZALO DIRECT LINK
  const btnZalo = document.getElementById('btnOpenZaloDirect');
  if (btnZalo) {
    btnZalo.href = 'https://zalo.me/0986479285';
    btnZalo.onclick = function() {
      if (lastGeneratedZaloOrder && navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(lastGeneratedZaloOrder).then(() => {
          if (typeof showToast === 'function') showToast('Đã sao chép đơn! Bạn chỉ cần gửi tin nhắn trên Zalo.');
        }).catch(() => {});
      }
    };
  }

  // 4. CLOSE CART & OPEN INVOICE MODAL
  closeCartDrawer();

  const successModal = document.getElementById('orderSuccessModal');
  if (successModal) {
    successModal.classList.add('active');
  }

  // Reset cart
  cart = {};
  saveCartToStorage();
  updateCartUI();

  if (typeof showToast === 'function') {
    showToast('🎉 Đặt hàng thành công! Hóa đơn đã hiển thị.');
  }
}

function copyOrderAgain() {
  if (lastGeneratedZaloOrder) {
    try {
      navigator.clipboard.writeText(lastGeneratedZaloOrder);
      showToast('Đã sao chép lại đơn hàng!');
    } catch (e) {
      showToast('Không thể sao chép tự động.', 'warning');
    }
  }
}

function closeOrderSuccessModal() {
  const modal = document.getElementById('orderSuccessModal');
  if (modal) modal.classList.remove('active');
}

function handleOrderSuccessBackdropClick(e) {
  if (e.target.id === 'orderSuccessModal') {
    closeOrderSuccessModal();
  }
}

// ==========================================================================
// LIGHTBOX MODAL
// ==========================================================================

function openLightbox(imgSrc, caption) {
  const modal = document.getElementById('lightboxModal');
  const img = document.getElementById('lightboxImage');
  const cap = document.getElementById('lightboxCaption');

  if (img) img.src = imgSrc;
  if (cap) cap.textContent = caption || '';
  if (modal) modal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  const modal = document.getElementById('lightboxModal');
  if (modal) modal.classList.remove('active');
  document.body.style.overflow = '';
}

// ==========================================================================
// TOAST NOTIFICATION UTILITY
// ==========================================================================

function showToast(message, type = 'success') {
  const container = document.getElementById('toastContainer');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `toast ${type === 'warning' ? 'toast-warning' : ''}`;
  toast.innerHTML = `
    <i class="fa-solid ${type === 'warning' ? 'fa-triangle-exclamation' : 'fa-circle-check'}"></i>
    <span>${escapeHtml(message)}</span>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 2800);
}

// ==========================================================================
// REAL CUSTOMER REVIEWS SYSTEM
// ==========================================================================

const INITIAL_REVIEWS = [
  {
    id: 1,
    name: "Hoàng Yến",
    location: "KĐT Tứ Hiệp, Thanh Trì",
    dish: "Nem Nướng Nha Trang Đặc Biệt",
    rating: 5,
    comment: "Nem nướng thơm lừng, sốt chấm gia truyền béo bùi chuẩn vị Nha Trang! Đầy đủ rau sống sạch sẽ, bánh tráng và ram giòn rụm. Ship đến nơi vẫn còn ấm nóng.",
    date: "29/09/2026"
  },
  {
    id: 2,
    name: "Anh Minh",
    location: "Vũ Lăng, Ngũ Hiệp",
    dish: "Chè Xoài Caramen Núng Nính",
    rating: 5,
    comment: "Caramen mềm mướt không hề bị rỗ, xoài tươi vàng mọng ngọt lịm. Nước cốt dừa thơm ngậy vừa phải không bị ngọt gắt. Buổi chiều làm cốc chè này tỉnh cả người!",
    date: "29/09/2026"
  },
  {
    id: 3,
    name: "Thu Trang",
    location: "Văn Điển, Thanh Trì",
    dish: "Mỳ Trộn Sốt Cay Đậm Đà",
    rating: 5,
    comment: "Mỳ trộn sốt cay tê rất cuốn, đầy đặn topping trứng cút, khô bò và chả. Quán đóng hộp giấy sạch sẽ và giao nhanh chỉ tầm 20 phút là tới.",
    date: "28/09/2026"
  }
];

function initReviewsSystem() {
  initRatingPicker();
  initReviewFormSubmit();
  renderReviewsList();
}

function initRatingPicker() {
  const starsContainer = document.getElementById('starsSelect');
  const label = document.getElementById('ratingTextLabel');
  const input = document.getElementById('selectedRatingValue');
  if (!starsContainer || !input) return;

  const labels = {
    1: '1 sao - Cần cải thiện',
    2: '2 sao - Tạm ổn',
    3: '3 sao - Khá ngon',
    4: '4 sao - Rất ngon & hài lòng',
    5: '5 sao - Cực kỳ ngon & hài lòng'
  };

  const stars = starsContainer.querySelectorAll('i');

  function updateStarsUI(val) {
    stars.forEach(s => {
      const r = parseInt(s.getAttribute('data-rating'));
      if (r <= val) s.classList.add('active');
      else s.classList.remove('active');
    });
    if (label && labels[val]) label.textContent = labels[val];
  }

  stars.forEach(star => {
    star.addEventListener('mouseenter', () => {
      const r = parseInt(star.getAttribute('data-rating'));
      updateStarsUI(r);
    });
    star.addEventListener('click', () => {
      const r = parseInt(star.getAttribute('data-rating'));
      input.value = r;
      updateStarsUI(r);
    });
  });

  starsContainer.addEventListener('mouseleave', () => {
    const saved = parseInt(input.value) || 5;
    updateStarsUI(saved);
  });
}

function initReviewFormSubmit() {
  const form = document.getElementById('customerReviewForm');
  const alertBox = document.getElementById('reviewSuccessAlert');
  const toggleBtn = document.getElementById('btnToggleReviewForm');
  const wrapper = document.getElementById('reviewFormWrapper');
  const closeBtn = document.getElementById('btnCloseReviewForm');
  const cancelBtn = document.getElementById('btnCancelReview');

  if (toggleBtn && wrapper) {
    toggleBtn.addEventListener('click', () => {
      wrapper.classList.toggle('hidden');
      if (!wrapper.classList.contains('hidden')) {
        const nameInput = document.getElementById('reviewName');
        if (nameInput) nameInput.focus();
      }
    });
  }

  if (closeBtn && wrapper) closeBtn.addEventListener('click', () => wrapper.classList.add('hidden'));
  if (cancelBtn && wrapper) cancelBtn.addEventListener('click', () => wrapper.classList.add('hidden'));

  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('reviewName').value.trim();
    const location = document.getElementById('reviewLocation').value.trim();
    const dish = document.getElementById('reviewDish').value;
    const rating = parseInt(document.getElementById('selectedRatingValue').value) || 5;
    const comment = document.getElementById('reviewComment').value.trim();

    if (!name || !comment) {
      alert('Vui lòng nhập họ tên và nội dung cảm nhận của bạn.');
      return;
    }

    const newReview = {
      id: Date.now(),
      name: name,
      location: location || 'Khách hàng thực tế',
      dish: dish,
      rating: rating,
      comment: comment,
      date: new Date().toLocaleDateString('vi-VN')
    };

    let reviews = JSON.parse(localStorage.getItem('tiemchena_reviews') || '[]');
    reviews.unshift(newReview);
    localStorage.setItem('tiemchena_reviews', JSON.stringify(reviews));

    form.reset();
    document.getElementById('selectedRatingValue').value = '5';
    const stars = document.querySelectorAll('#starsSelect i');
    stars.forEach(s => s.classList.add('active'));

    if (alertBox) {
      alertBox.classList.remove('hidden');
      setTimeout(() => {
        alertBox.classList.add('hidden');
        if (wrapper) wrapper.classList.add('hidden');
      }, 2500);
    }

    renderReviewsList();
    showToast('Cảm ơn bạn đã gửi đánh giá thực tế!');
  });
}

function renderReviewsList() {
  const grid = document.getElementById('reviewsGrid');
  const avgScore = document.getElementById('avgRatingScore');
  const totalCount = document.getElementById('totalReviewsCount');
  if (!grid) return;

  let reviews = JSON.parse(localStorage.getItem('tiemchena_reviews') || 'null');
  if (!reviews || reviews.length === 0) {
    reviews = [...INITIAL_REVIEWS];
    localStorage.setItem('tiemchena_reviews', JSON.stringify(reviews));
  }

  const totalRating = reviews.reduce((sum, r) => sum + (r.rating || 5), 0);
  const score = (totalRating / reviews.length).toFixed(1);

  if (avgScore) avgScore.textContent = score;
  if (totalCount) totalCount.textContent = `${reviews.length} đánh giá thực tế`;

  grid.innerHTML = reviews.map(r => {
    const starStr = '★'.repeat(r.rating || 5) + '☆'.repeat(Math.max(0, 5 - (r.rating || 5)));
    return `
      <div class="review-card">
        <div class="review-card-top">
          <div class="review-stars-text">${starStr}</div>
          <span class="review-date-text">${r.date || 'Gần đây'}</span>
        </div>
        <div class="review-dish-badge">
          <i class="fa-solid fa-bowl-food"></i> ${escapeHtml(r.dish)}
        </div>
        <p class="review-body-text">"${escapeHtml(r.comment)}"</p>
        <div class="reviewer-meta-box">
          <div class="reviewer-avatar-circle">${escapeHtml(r.name.substring(0, 1).toUpperCase())}</div>
          <div class="reviewer-name-col">
            <strong>${escapeHtml(r.name)} <span class="verified-tag"><i class="fa-solid fa-circle-check"></i> Đã mua</span></strong>
            <small>${escapeHtml(r.location || 'Thanh Trì, Hà Nội')}</small>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

window.openAndScrollToReviewForm = function() {
  const wrapper = document.getElementById('reviewFormWrapper');
  if (wrapper) {
    wrapper.classList.remove('hidden');
    wrapper.scrollIntoView({ behavior: 'smooth', block: 'center' });
    const nameInput = document.getElementById('reviewName');
    if (nameInput) setTimeout(() => nameInput.focus(), 400);
  }
};
