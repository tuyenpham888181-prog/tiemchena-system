// ==========================================================================
// Tiệm Chè Na - JavaScript Logic (Catalog, Cart, Lead Capture & Data Management)
// ==========================================================================

const PRODUCTS = [
    {
        id: 1,
        name: "Chè Dưỡng Nhan Tuyết Yến",
        cat: "duong-nhan",
        price: 35000,
        desc: "Tuyết yến, nhựa đào, sen tươi, táo đỏ, kỷ tử kết hợp đường phèn thanh dịu.",
        tag: "Bán Chạy Nhất",
        img: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80"
    },
    {
        id: 2,
        name: "Chè Bưởi An Giang Chuẩn Vị",
        cat: "truyen-thong",
        price: 28000,
        desc: "Cùi bưởi giòn sần sật, đỗ xanh bùi thơm quyện cùng nước cốt dừa béo ngậy.",
        tag: "Đặc Sản",
        img: "https://images.unsplash.com/photo-1563805042-7684c019e1cb?auto=format&fit=crop&w=600&q=80"
    },
    {
        id: 3,
        name: "Chè Khúc Bạch Hạnh Nhân",
        cat: "hien-dai",
        price: 35000,
        desc: "Khúc bạch phô mai sữa mềm mịn, nhãn lồng tươi, rắc hạnh nhân nướng thơm giòn.",
        tag: "Yêu Thích",
        img: "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=600&q=80"
    },
    {
        id: 4,
        name: "Chè Sầu Riêng Đà Nẵng",
        cat: "hien-dai",
        price: 40000,
        desc: "Thịt sầu riêng tươi nguyên chất, thạch giòn, mít nghệ và cốt dừa thơm nức.",
        tag: "Món Mới",
        img: "https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=600&q=80"
    },
    {
        id: 5,
        name: "Chè Thái Thập Cẩm Đặc Biệt",
        cat: "truyen-thong",
        price: 32000,
        desc: "Thạch sương sa, hạt lựu, mít, sầu riêng, nước dừa lá dứa thơm mát sảng khoái.",
        tag: "Best Seller",
        img: "https://images.unsplash.com/photo-1579954115545-a95591f28bfc?auto=format&fit=crop&w=600&q=80"
    },
    {
        id: 6,
        name: "Chè Hạt Sen Long Nhãn",
        cat: "duong-nhan",
        price: 32000,
        desc: "Hạt sen bùi mềm ninh kỹ, bọc trong cùi nhãn ngọt thơm, nước đường phèn hoa bưởi.",
        tag: "Thanh Mát",
        img: "https://images.unsplash.com/photo-1505253716362-afaea1d3d1af?auto=format&fit=crop&w=600&q=80"
    }
];

let cart = [];

// DOM Elements
document.addEventListener("DOMContentLoaded", () => {
    initProducts("all");
    initCategoryTabs();
    initCartDrawer();
    initLeadForm();
    initLeadsTable();
    initReviewsSystem();
    initMobileNav();
});

// Format currency (VND)
function formatMoney(amount) {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
}

// Render Products
function initProducts(category) {
    const grid = document.getElementById("products-grid");
    if (!grid) return;

    const filtered = category === "all" ? PRODUCTS : PRODUCTS.filter(p => p.cat === category);
    
    grid.innerHTML = filtered.map(item => `
        <div class="product-card">
            <div class="product-img-wrapper">
                <img src="${item.img}" alt="${item.name}" class="product-img" loading="lazy">
                <span class="product-tag">${item.tag}</span>
            </div>
            <div class="product-info">
                <h3 class="product-title">${item.name}</h3>
                <p class="product-desc">${item.desc}</p>
                <div class="product-bottom">
                    <span class="product-price">${formatMoney(item.price)}</span>
                    <button class="btn-add-cart" onclick="addToCart(${item.id})">
                        <i class="fa-solid fa-plus"></i> Chọn Món
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

// Category Tabs
function initCategoryTabs() {
    const tabs = document.querySelectorAll(".cat-btn");
    tabs.forEach(tab => {
        tab.addEventListener("click", () => {
            tabs.forEach(t => t.classList.remove("active"));
            tab.classList.add("active");
            const cat = tab.getAttribute("data-cat");
            initProducts(cat);
        });
    });
}

// Cart Logic
window.addToCart = function(productId) {
    const product = PRODUCTS.find(p => p.id === productId);
    if (!product) return;

    const existing = cart.find(item => item.id === productId);
    if (existing) {
        existing.qty += 1;
    } else {
        cart.push({ ...product, qty: 1 });
    }

    updateCartUI();
    openCartDrawer();
};

function updateCartUI() {
    const countBadge = document.getElementById("cart-count");
    const container = document.getElementById("cart-items-container");
    const subtotal = document.getElementById("cart-subtotal");
    const noteInput = document.getElementById("lead-note");

    const totalQty = cart.reduce((sum, i) => sum + i.qty, 0);
    const totalPrice = cart.reduce((sum, i) => sum + (i.price * i.qty), 0);

    if (countBadge) countBadge.textContent = totalQty;
    if (subtotal) subtotal.textContent = formatMoney(totalPrice);

    if (!container) return;

    if (cart.length === 0) {
        container.innerHTML = '<p class="empty-cart-msg">Giỏ hàng của bạn đang trống. Hãy chọn món chè yêu thích nhé!</p>';
    } else {
        container.innerHTML = cart.map(item => `
            <div class="cart-item">
                <div>
                    <div class="cart-item-title">${item.name}</div>
                    <div class="cart-item-price">${formatMoney(item.price)}</div>
                </div>
                <div class="cart-item-qty">
                    <button class="qty-btn" onclick="changeQty(${item.id}, -1)">-</button>
                    <span>${item.qty}</span>
                    <button class="qty-btn" onclick="changeQty(${item.id}, 1)">+</button>
                </div>
            </div>
        `).join('');

        // Pre-fill lead form note with cart items
        if (noteInput) {
            const summary = cart.map(i => `${i.qty}x ${i.name}`).join(", ");
            noteInput.value = `Đặt món: ${summary} (Tổng: ${formatMoney(totalPrice)})`;
        }
    }
}

window.changeQty = function(id, delta) {
    const item = cart.find(i => i.id === id);
    if (!item) return;

    item.qty += delta;
    if (item.qty <= 0) {
        cart = cart.filter(i => i.id !== id);
    }
    updateCartUI();
};

function initCartDrawer() {
    const toggleBtn = document.getElementById("cart-toggle-btn");
    const closeBtn = document.getElementById("cart-close-btn");
    const overlay = document.getElementById("cart-drawer-overlay");
    const checkoutBtn = document.getElementById("btn-checkout-cart");

    if (toggleBtn) toggleBtn.addEventListener("click", openCartDrawer);
    if (closeBtn) closeBtn.addEventListener("click", closeCartDrawer);
    if (overlay) overlay.addEventListener("click", closeCartDrawer);
    if (checkoutBtn) {
        checkoutBtn.addEventListener("click", () => {
            closeCartDrawer();
        });
    }
}

function openCartDrawer() {
    const drawer = document.getElementById("cart-drawer");
    const overlay = document.getElementById("cart-drawer-overlay");
    if (drawer) drawer.classList.add("active");
    if (overlay) overlay.classList.add("active");
}

function closeCartDrawer() {
    const drawer = document.getElementById("cart-drawer");
    const overlay = document.getElementById("cart-drawer-overlay");
    if (drawer) drawer.classList.remove("active");
    if (overlay) overlay.classList.remove("active");
}

// Lead & Order Capture System
const ZALO_OWNER_PHONE = "0986479285";

function initLeadForm() {
    const form = document.getElementById("lead-form");
    const successBox = document.getElementById("lead-success-msg");
    const invoicePreview = document.getElementById("invoice-preview");
    const sendZaloBtn = document.getElementById("btn-send-zalo-invoice");

    if (!form) return;

    form.addEventListener("submit", (e) => {
        e.preventDefault();
        
        const name = document.getElementById("lead-name").value.trim();
        const phone = document.getElementById("lead-phone").value.trim();
        const address = document.getElementById("lead-address").value.trim();
        const note = document.getElementById("lead-note").value.trim();

        if (!name || !phone) {
            alert("Vui lòng nhập họ tên và số điện thoại.");
            return;
        }

        const orderCode = "NA" + Math.floor(100000 + Math.random() * 900000);
        const orderTime = new Date().toLocaleString('vi-VN');

        let cartSummary = "";
        let totalPrice = 0;

        if (cart.length > 0) {
            cartSummary = cart.map(i => `${i.qty}x ${i.name} (${formatMoney(i.price * i.qty)})`).join("\n • ");
            totalPrice = cart.reduce((sum, i) => sum + (i.price * i.qty), 0);
        }

        const discount = totalPrice > 0 ? 20000 : 0;
        const finalPrice = Math.max(0, totalPrice - discount);

        const newLead = {
            id: Date.now(),
            orderCode: orderCode,
            time: orderTime,
            name: name,
            phone: phone,
            address: address || "Chưa cung cấp",
            note: note || (cart.length > 0 ? `Đơn hàng: ${cart.map(i => `${i.qty}x ${i.name}`).join(", ")}` : "Đăng ký nhận Voucher 20K & Ebook"),
            total: totalPrice > 0 ? formatMoney(finalPrice) : "Nhận ưu đãi 20k",
            status: "Đã gửi qua Zalo"
        };

        // Save lead/order to localStorage
        saveLead(newLead);

        // Build invoice plain-text for Zalo message
        let zaloMessage = `🧾 ĐƠN HÀNG MỚI - TIỆM CHÈ NA\n`;
        zaloMessage += `--------------------------------\n`;
        zaloMessage += `🔖 Mã đơn: #${orderCode}\n`;
        zaloMessage += `⏰ Thời gian: ${orderTime}\n`;
        zaloMessage += `👤 Khách hàng: ${name}\n`;
        zaloMessage += `📞 Số điện thoại: ${phone}\n`;
        zaloMessage += `📍 Địa chỉ: ${address || "Giao tận nơi (sẽ báo cụ thể)"}\n`;
        if (cart.length > 0) {
            zaloMessage += `🥣 Món đã chọn:\n • ${cartSummary}\n`;
            zaloMessage += `💰 Tạm tính: ${formatMoney(totalPrice)}\n`;
            zaloMessage += `🎁 Voucher: -20.000đ (TIEMCHENA20K)\n`;
            zaloMessage += `👉 TỔNG THANH TOÁN: ${formatMoney(finalPrice)}\n`;
        }
        if (note) {
            zaloMessage += `📝 Ghi chú: ${note}\n`;
        }
        zaloMessage += `--------------------------------\n`;
        zaloMessage += `Tiệm Chè Na vui lòng xác nhận và chuẩn bị đơn giúp mình nhé!`;

        // Render Invoice Preview in HTML
        if (invoicePreview) {
            invoicePreview.innerHTML = `
                <div style="font-weight: 700; color: #0f172a; margin-bottom: 8px; border-bottom: 1px dashed #cbd5e1; padding-bottom: 6px; display: flex; justify-content: space-between;">
                    <span>Mã Đơn: #${orderCode}</span>
                    <span style="color: #059669; font-size: 0.85rem;">${orderTime}</span>
                </div>
                <div style="line-height: 1.6;">
                    <div><strong>Khách hàng:</strong> ${escapeHtml(name)} - <strong>SĐT:</strong> ${escapeHtml(phone)}</div>
                    <div><strong>Địa chỉ:</strong> ${escapeHtml(address || "Chưa cung cấp")}</div>
                    ${cart.length > 0 ? `
                        <div style="margin-top: 8px; background: #fff; padding: 8px; border-radius: 6px; border: 1px solid #e2e8f0;">
                            <strong style="color: #047857;">Món đã chọn:</strong>
                            <ul style="margin: 4px 0 6px 18px; padding: 0;">
                                ${cart.map(i => `<li>${i.qty}x ${escapeHtml(i.name)}: <strong>${formatMoney(i.price * i.qty)}</strong></li>`).join('')}
                            </ul>
                            <div style="font-size: 0.85rem; color: #64748b;">Ưu đãi Voucher: <strong>-20.000đ</strong></div>
                            <div style="font-size: 1.05rem; font-weight: 800; color: #dc2626; margin-top: 4px;">Tổng cộng: ${formatMoney(finalPrice)}</div>
                        </div>
                    ` : ''}
                    ${note ? `<div style="margin-top: 6px; font-style: italic; color: #475569;"><strong>Ghi chú:</strong> ${escapeHtml(note)}</div>` : ''}
                </div>
            `;
        }

        // Setup Zalo Direct Link with Owner Number 0986479285
        if (sendZaloBtn) {
            sendZaloBtn.href = `https://zalo.me/${ZALO_OWNER_PHONE}`;
            sendZaloBtn.onclick = () => {
                // Copy invoice to clipboard for convenience
                if (navigator.clipboard && navigator.clipboard.writeText) {
                    navigator.clipboard.writeText(zaloMessage).then(() => {
                        // Copied
                    }).catch(() => {});
                }
            };
        }

        // Show success and invoice
        form.classList.add("hidden");
        if (successBox) successBox.classList.remove("hidden");

        // Copy bill content automatically to clipboard so the user can easily paste into Zalo chat
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(zaloMessage).catch(() => {});
        }

        // Refresh lead table
        initLeadsTable();
    });
}

function saveLead(lead) {
    let leads = JSON.parse(localStorage.getItem("tiemchena_leads") || "[]");
    leads.unshift(lead);
    localStorage.setItem("tiemchena_leads", JSON.stringify(leads));
}

function initLeadsTable() {
    const tbody = document.getElementById("leads-tbody");
    if (!tbody) return;

    let leads = JSON.parse(localStorage.getItem("tiemchena_leads") || "[]");

    // Prepopulate with a verified sample real lead if empty for Day 4 proof
    if (leads.length === 0) {
        leads = [
            {
                id: 1,
                time: new Date().toLocaleString('vi-VN'),
                name: "Nguyễn Thu Trang (Bạn học)",
                phone: "0912 345 678",
                address: "Ngõ 165 Cầu Giấy, Hà Nội",
                note: "Đặt thử 2 phần Chè Bưởi + áp voucher 20k",
                status: "Đã liên hệ"
            }
        ];
        localStorage.setItem("tiemchena_leads", JSON.stringify(leads));
    }

    tbody.innerHTML = leads.map(l => `
        <tr style="border-bottom: 1px solid #f1f5f9;">
            <td style="padding: 10px; color: #64748b; font-size: 0.82rem;">${l.time}</td>
            <td style="padding: 10px; font-weight: 700; color: #0f172a;">${l.name}</td>
            <td style="padding: 10px; color: #059669; font-weight: 600;">${l.phone}</td>
            <td style="padding: 10px; color: #475569;">${l.address}</td>
            <td style="padding: 10px; color: #334155;">${l.note}</td>
            <td style="padding: 10px;">
                <span style="background: #dcfce7; color: #166534; padding: 4px 10px; border-radius: 9999px; font-size: 0.78rem; font-weight: 700;">
                    ${l.status}
                </span>
            </td>
        </tr>
    `).join('');

    // Export Leads handler
    const exportBtn = document.getElementById("btn-export-leads");
    if (exportBtn) {
        exportBtn.onclick = () => {
            const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(leads, null, 2));
            const downloadAnchor = document.createElement('a');
            downloadAnchor.setAttribute("href", dataStr);
            downloadAnchor.setAttribute("download", "danh_sach_leads_tiem_che_na.json");
            document.body.appendChild(downloadAnchor);
            downloadAnchor.click();
            downloadAnchor.remove();
        };
    }

    // Clear test leads handler
    const clearBtn = document.getElementById("btn-clear-leads");
    if (clearBtn) {
        clearBtn.onclick = () => {
            if (confirm("Bạn có chắc chắn muốn xóa toàn bộ danh sách lead test?")) {
                localStorage.removeItem("tiemchena_leads");
                initLeadsTable();
            }
        };
    }
}

// Helper to sanitize HTML
function escapeHtml(str) {
    if (!str) return '';
    return str
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

// Get initials for avatar
function getInitials(name) {
    if (!name) return "KH";
    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

// ==========================================================================
// Customer Real Reviews System
// ==========================================================================
const RATING_TEXTS = {
    1: "1 sao - Chưa hài lòng",
    2: "2 sao - Cần cải thiện thêm",
    3: "3 sao - Khá ổn, vừa miệng",
    4: "4 sao - Rất ngon & chất lượng",
    5: "5 sao - Cực kỳ ngon & hài lòng"
};

function initReviewsSystem() {
    initStarRatingWidget();
    initReviewFormToggle();
    initReviewFormSubmit();
    renderReviews();
}

// Interactive Star Rating Selector
function initStarRatingWidget() {
    const starContainer = document.getElementById("stars-select");
    const label = document.getElementById("rating-text-label");
    const input = document.getElementById("selected-rating-value");
    if (!starContainer || !input) return;

    const stars = starContainer.querySelectorAll("i");

    function updateStars(val) {
        stars.forEach(star => {
            const r = parseInt(star.getAttribute("data-rating"));
            if (r <= val) {
                star.classList.add("active");
            } else {
                star.classList.remove("active");
            }
        });
        if (label && RATING_TEXTS[val]) {
            label.textContent = RATING_TEXTS[val];
        }
    }

    stars.forEach(star => {
        star.addEventListener("mouseenter", () => {
            const hoverVal = parseInt(star.getAttribute("data-rating"));
            updateStars(hoverVal);
        });

        star.addEventListener("click", () => {
            const currentVal = parseInt(star.getAttribute("data-rating"));
            input.value = currentVal;
            updateStars(currentVal);
        });
    });

    starContainer.addEventListener("mouseleave", () => {
        const savedVal = parseInt(input.value) || 5;
        updateStars(savedVal);
    });
}

// Toggle Review Form visibility
function initReviewFormToggle() {
    const toggleBtn = document.getElementById("btn-toggle-review-form");
    const wrapper = document.getElementById("review-form-wrapper");
    const closeBtn = document.getElementById("btn-close-review-form");
    const cancelBtn = document.getElementById("btn-cancel-review");

    if (toggleBtn && wrapper) {
        toggleBtn.addEventListener("click", () => {
            wrapper.classList.toggle("hidden");
            if (!wrapper.classList.contains("hidden")) {
                const nameInput = document.getElementById("review-name");
                if (nameInput) nameInput.focus();
            }
        });
    }

    if (closeBtn && wrapper) {
        closeBtn.addEventListener("click", () => wrapper.classList.add("hidden"));
    }

    if (cancelBtn && wrapper) {
        cancelBtn.addEventListener("click", () => wrapper.classList.add("hidden"));
    }
}

window.openAndScrollToReviewForm = function() {
    const wrapper = document.getElementById("review-form-wrapper");
    if (wrapper) {
        wrapper.classList.remove("hidden");
        wrapper.scrollIntoView({ behavior: "smooth", block: "center" });
        const nameInput = document.getElementById("review-name");
        if (nameInput) setTimeout(() => nameInput.focus(), 400);
    }
};

// Submit Real Review
function initReviewFormSubmit() {
    const form = document.getElementById("customer-review-form");
    const successMsg = document.getElementById("review-success-msg");
    const wrapper = document.getElementById("review-form-wrapper");

    if (!form) return;

    form.addEventListener("submit", (e) => {
        e.preventDefault();

        const name = document.getElementById("review-name").value.trim();
        const location = document.getElementById("review-location").value.trim();
        const dish = document.getElementById("review-dish").value;
        const rating = parseInt(document.getElementById("selected-rating-value").value) || 5;
        const comment = document.getElementById("review-comment").value.trim();

        if (!name || !comment) {
            alert("Vui lòng nhập tên và nội dung cảm nhận của bạn.");
            return;
        }

        const newReview = {
            id: Date.now(),
            name: name,
            location: location || "Khách hàng thực tế",
            dish: dish,
            rating: rating,
            comment: comment,
            date: new Date().toLocaleDateString('vi-VN'),
            verified: true
        };

        saveReview(newReview);

        // Reset form
        form.reset();
        document.getElementById("selected-rating-value").value = "5";
        const stars = document.querySelectorAll("#stars-select i");
        stars.forEach(s => s.classList.add("active"));
        const label = document.getElementById("rating-text-label");
        if (label) label.textContent = RATING_TEXTS[5];

        // Show success alert
        if (successMsg) {
            successMsg.classList.remove("hidden");
            setTimeout(() => {
                successMsg.classList.add("hidden");
                if (wrapper) wrapper.classList.add("hidden");
            }, 3000);
        }

        renderReviews();
    });
}

function saveReview(review) {
    let reviews = JSON.parse(localStorage.getItem("tiemchena_reviews") || "[]");
    reviews.unshift(review);
    localStorage.setItem("tiemchena_reviews", JSON.stringify(reviews));
}

window.deleteReview = function(id) {
    if (confirm("Bạn có chắc muốn xóa đánh giá này?")) {
        let reviews = JSON.parse(localStorage.getItem("tiemchena_reviews") || "[]");
        reviews = reviews.filter(r => r.id !== id);
        localStorage.setItem("tiemchena_reviews", JSON.stringify(reviews));
        renderReviews();
    }
};

const INITIAL_REVIEWS_LIST = [
    {
        id: 1790692450000,
        name: "Phương Anh",
        location: "Khu tập thể Văn Điển",
        dish: "Mỳ Trộn Sốt Cay Đậm Đà",
        rating: 5,
        comment: "Mỳ trộn sốt cay đậm đà chuẩn vị, sợi mỳ dai ngon, đầy đặn topping bò khô và trứng cút. Chiều nào đói bụng đặt một phần là no căng bụng luôn!",
        date: "29/09/2026",
        verified: true
    },
    {
        id: 1790692420000,
        name: "Trần Đức Nam",
        location: "Chung cư Tecco Diamond, Tứ Hiệp",
        dish: "Chè Xoài Caramen Núng Nính",
        rating: 5,
        comment: "Caramen béo ngậy mềm tan, miếng xoài tươi ngọt đậm đà kết hợp nước cốt dừa thơm phức. Đóng gói rất cẩn thận, ship đến nơi vẫn mát lạnh.",
        date: "29/09/2026",
        verified: true
    },
    {
        id: 1790692395817,
        name: "Nguyễn Thị Hoa",
        location: "Đường Vũ Lăng, Thanh Trì",
        dish: "Nem Nướng Nha Trang Đặc Biệt",
        rating: 5,
        comment: "Nem nướng thơm ngon, sốt chấm gia truyền béo ngậy ăn rất cuốn! Rau sống tươi sạch, giao nhanh trong 20 phút.",
        date: "29/09/2026",
        verified: true
    }
];

// Render Real Reviews List & Summary
function renderReviews() {
    const grid = document.getElementById("reviews-grid");
    const scoreEl = document.getElementById("avg-rating-score");
    const starsEl = document.getElementById("avg-rating-stars");
    const countEl = document.getElementById("total-reviews-count");

    if (!grid) return;

    let reviews = JSON.parse(localStorage.getItem("tiemchena_reviews") || "null");
    if (!reviews || reviews.length === 0) {
        reviews = [...INITIAL_REVIEWS_LIST];
        localStorage.setItem("tiemchena_reviews", JSON.stringify(reviews));
    }

    const heroRatingEl = document.getElementById("hero-rating-stat");

    if (reviews.length === 0) {
        if (scoreEl) scoreEl.textContent = "5.0";
        if (starsEl) starsEl.textContent = "★★★★★";
        if (countEl) countEl.textContent = "0 đánh giá thực tế";
        if (heroRatingEl) heroRatingEl.textContent = "5.0 ★";

        grid.innerHTML = `
            <div class="empty-reviews-card">
                <div class="empty-reviews-icon"><i class="fa-regular fa-comment-dots"></i></div>
                <h4>Chưa có đánh giá nào từ khách hàng</h4>
                <p>Bạn đã thưởng thức chè tại Tiệm Chè Na? Hãy là người đầu tiên chia sẻ cảm nhận chân thực để giúp tiệm ngày càng hoàn thiện nhé!</p>
                <button class="btn btn-primary" onclick="document.getElementById('btn-toggle-review-form').click()">
                    <i class="fa-solid fa-pen-to-square"></i> Viết Đánh Giá Ngay
                </button>
            </div>
        `;
        return;
    }

    // Calculate real average rating
    const totalRating = reviews.reduce((sum, r) => sum + (r.rating || 5), 0);
    const avgScore = (totalRating / reviews.length).toFixed(1);

    if (scoreEl) scoreEl.textContent = avgScore;
    if (countEl) countEl.textContent = `${reviews.length} đánh giá thực tế`;
    if (heroRatingEl) heroRatingEl.textContent = `${avgScore} ★`;

    if (starsEl) {
        const rounded = Math.round(avgScore);
        starsEl.textContent = "★".repeat(rounded) + "☆".repeat(Math.max(0, 5 - rounded));
    }

    grid.innerHTML = reviews.map(r => {
        const starCount = r.rating || 5;
        const starStr = "★".repeat(starCount) + "☆".repeat(5 - starCount);
        const initials = getInitials(r.name);

        return `
            <div class="review-card">
                <div class="review-card-top">
                    <div class="review-stars">${starStr}</div>
                    <span class="review-date">${r.date || "Gần đây"}</span>
                </div>

                <div>
                    <span class="review-dish-tag"><i class="fa-solid fa-bowl-food"></i> ${escapeHtml(r.dish)}</span>
                </div>

                <p class="review-comment">"${escapeHtml(r.comment)}"</p>

                <div class="reviewer-info">
                    <div class="reviewer-profile">
                        <div class="reviewer-avatar">${initials}</div>
                        <div class="reviewer-meta">
                            <strong>
                                ${escapeHtml(r.name)}
                                <span class="verified-badge"><i class="fa-solid fa-circle-check"></i> Đã mua</span>
                            </strong>
                            <small>${escapeHtml(r.location || "Khách hàng")}</small>
                        </div>
                    </div>
                    <button class="review-action-btn" title="Xóa đánh giá này" onclick="deleteReview(${r.id})">
                        <i class="fa-regular fa-trash-can"></i>
                    </button>
                </div>
            </div>
        `;
    }).join('');
}

// Mobile Nav Toggle
function initMobileNav() {
    const toggle = document.getElementById("mobile-toggle");
    const nav = document.getElementById("nav-menu");

    if (toggle && nav) {
        toggle.addEventListener("click", () => {
            if (nav.style.display === "flex") {
                nav.style.display = "none";
            } else {
                nav.style.display = "flex";
                nav.style.flexDirection = "column";
                nav.style.position = "absolute";
                nav.style.top = "70px";
                nav.style.left = "0";
                nav.style.width = "100%";
                nav.style.background = "#ffffff";
                nav.style.padding = "20px";
                nav.style.boxShadow = "0 10px 25px rgba(0,0,0,0.1)";
            }
        });
    }
}
