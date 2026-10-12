/* =========================================================================
 * CodeZ Academy - mã dùng chung cho mọi trang
 *  - Cấu hình + khởi tạo Supabase
 *  - Navbar / Footer (chèn vào #site-header, #site-footer)
 *  - Trạng thái đăng nhập (hiển thị trên navbar, nút Đăng xuất)
 *  - Hàm tiện ích: window.CodeZ
 *
 * Cần nạp SAU Supabase SDK và TRƯỚC script riêng của từng trang.
 * Thẻ <body> khai báo data-page="home | about | detail | login | register".
 * ========================================================================= */
(function () {
  'use strict';

  /* ---------- 1. Cấu hình Supabase ----------
   * Dùng URL + khóa "anon" (khóa công khai). KHÔNG đặt Database password
   * hay khóa service_role ở đây. Quyền thực tế do RLS trên Supabase quyết định. */
  const SUPABASE_URL = 'https://swgqjirufusmoiulhxco.supabase.co';
  const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN3Z3FqaXJ1ZnVzbW9pdWxoeGNvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTE3NDgzNDcsImV4cCI6MjEwNzMyNDM0N30.xKKuJOFsF7W9NIzZnhm742hx3_VGGAaDGrOHvpKevzE';

  const hasSdk = !!(window.supabase && window.supabase.createClient);
  const db = hasSdk ? window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY) : null;
  if (!hasSdk) console.error('Không tải được Supabase SDK. Kiểm tra kết nối mạng.');

  /* ---------- 2. Tiện ích ---------- */

  // Chống XSS: dữ liệu từ DB luôn được escape trước khi chèn vào innerHTML
  function esc(value) {
    return String(value ?? '').replace(/[&<>"']/g, (c) => (
      { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]
    ));
  }

  // Chỉ cho phép ảnh http(s)
  function safeImageUrl(url) {
    return /^https?:\/\//i.test(url || '') ? url : '';
  }

  // Định dạng giá tiền kiểu Việt Nam
  function formatPrice(price) {
    const n = Number(price);
    if (!Number.isFinite(n) || n <= 0) return 'Miễn phí';
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(n);
  }

  function formatDate(value) {
    const d = new Date(value);
    return Number.isNaN(d.getTime()) ? '' : d.toLocaleDateString('vi-VN');
  }

  // Giá trị toàn chữ số -> Number (cột id kiểu bigint), ngược lại giữ nguyên (uuid...)
  function normalizeId(value) {
    const v = String(value).trim();
    return /^\d+$/.test(v) ? Number(v) : v;
  }

  // Số điện thoại Việt Nam: 10 số, bắt đầu bằng 0 (cho phép +84)
  function isValidPhone(phone) {
    return /^(0|\+?84)\d{9}$/.test(String(phone).replace(/[\s.\-]/g, ''));
  }

  // Hộp thông báo (type: success | error | info)
  function showMessage(el, type, html) {
    const styles = {
      success: 'border-emerald-200 bg-emerald-50 text-emerald-900',
      error: 'border-red-200 bg-red-50 text-red-800',
      info: 'border-amber-200 bg-amber-50 text-amber-900',
    };
    el.className = `mt-5 rounded-lg border p-4 text-sm leading-relaxed ${styles[type]}`;
    el.innerHTML = html;
  }

  // Bật/tắt trạng thái đang xử lý của nút
  function setBusy(button, labelEl, busy, busyText, idleText) {
    button.disabled = busy;
    labelEl.textContent = busy ? busyText : idleText;
  }

  // Việt hóa các lỗi thường gặp của Supabase Auth
  function authError(err) {
    const msg = String((err && err.message) || err || '');
    if (/invalid login credentials/i.test(msg)) return 'Email hoặc mật khẩu không đúng.';
    if (/email not confirmed/i.test(msg)) return 'Email chưa được xác nhận. Vui lòng kiểm tra hộp thư của bạn.';
    if (/already registered|already been registered/i.test(msg)) return 'Email này đã được đăng ký. Hãy đăng nhập.';
    if (/password should be at least/i.test(msg)) return 'Mật khẩu quá ngắn (tối thiểu 6 ký tự).';
    if (/valid email|invalid format|unable to validate email/i.test(msg)) return 'Địa chỉ email không hợp lệ.';
    if (/rate limit|too many|after \d+ seconds/i.test(msg)) return 'Bạn thao tác quá nhanh, vui lòng thử lại sau ít phút.';
    if (/failed to fetch|networkerror/i.test(msg)) return 'Không kết nối được máy chủ. Vui lòng kiểm tra mạng.';
    return msg || 'Đã xảy ra lỗi không xác định.';
  }

  // Thẻ khóa học dùng chung. mode: 'link' (trang chủ) | 'pick' (trang chi tiết)
  function courseCard(c, mode) {
    const img = safeImageUrl(c.image_url);
    const placeholder = '<div class="cover-fallback flex h-44 items-center justify-center bg-gradient-to-br from-primary to-sky-400 font-heading text-4xl font-extrabold text-white">&lt;/&gt;</div>';
    const cover = img
      ? `<img src="${esc(img)}" alt="${esc(c.title)}" loading="lazy" data-cover class="h-44 w-full object-cover" />`
      : placeholder;

    const action = mode === 'link'
      ? `<a href="detail.html?course=${encodeURIComponent(String(c.id))}#dang-ky" class="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white transition hover:bg-primary-light">Đăng ký nhanh</a>`
      : `<button type="button" data-course-id="${esc(c.id)}" class="pick-course rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white transition hover:bg-primary-light">Đăng ký</button>`;

    return `
      <article class="group flex flex-col overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200 transition hover:-translate-y-1 hover:shadow-xl">
        ${cover}
        <div class="flex flex-1 flex-col p-6">
          <h3 class="font-heading text-lg font-bold leading-snug text-ink">${esc(c.title)}</h3>
          <p class="mt-2 line-clamp-3 text-sm leading-relaxed text-slate-600">${esc(c.description) || 'Chưa có mô tả.'}</p>
          <div class="mt-auto flex items-center justify-between gap-3 pt-6">
            <span class="font-heading text-xl font-bold text-primary">${esc(formatPrice(c.price))}</span>
            ${action}
          </div>
        </div>
      </article>`;
  }

  // Ảnh bìa lỗi (link hỏng) -> thay bằng nền gradient
  function bindCoverFallback(root) {
    root.querySelectorAll('img[data-cover]').forEach((img) => {
      img.addEventListener('error', () => {
        const holder = document.createElement('div');
        holder.innerHTML = '<div class="flex h-44 items-center justify-center bg-gradient-to-br from-primary to-sky-400 font-heading text-4xl font-extrabold text-white">&lt;/&gt;</div>';
        img.replaceWith(holder.firstElementChild);
      }, { once: true });
    });
  }

  /* ---------- 3. Navbar + Footer ---------- */
  const page = document.body.dataset.page || '';
  const NAV = [
    { key: 'home', href: 'index.html', label: 'Trang Chủ' },
    { key: 'about', href: 'about.html', label: 'Về Chúng Tôi' },
    { key: 'detail', href: 'detail.html', label: 'Chi tiết khóa học' },
  ];

  function headerHtml() {
    const desktop = NAV.map((n) => n.key === page
      ? `<li><a href="${n.href}" class="nav-link active relative text-ink transition hover:text-primary" aria-current="page">${n.label}</a></li>`
      : `<li><a href="${n.href}" class="nav-link relative text-ink transition hover:text-primary">${n.label}</a></li>`).join('');
    const mobile = NAV.map((n) => n.key === page
      ? `<li><a href="${n.href}" class="block rounded-lg bg-blue-50 px-3 py-2 text-primary" aria-current="page">${n.label}</a></li>`
      : `<li><a href="${n.href}" class="block rounded-lg px-3 py-2 text-ink hover:bg-slate-100">${n.label}</a></li>`).join('');

    return `
      <header class="sticky top-0 z-50 border-b border-slate-200/80 bg-white/90 backdrop-blur">
        <nav class="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8" aria-label="Điều hướng chính">
          <a href="index.html" class="logo-crop shrink-0" aria-label="CodeZ Academy - Trang chủ">
            <img src="images/logo.png" alt="CodeZ Academy" />
          </a>

          <ul class="hidden items-center gap-8 font-medium md:flex">${desktop}</ul>

          <div id="auth-desktop" class="hidden items-center gap-3 opacity-0 transition-opacity md:flex"></div>

          <button id="menu-toggle" type="button" class="inline-flex h-10 w-10 items-center justify-center rounded-lg text-ink hover:bg-slate-100 md:hidden"
                  aria-controls="mobile-menu" aria-expanded="false" aria-label="Mở menu">
            <svg id="icon-open" class="h-6 w-6" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" d="M4 6h16M4 12h16M4 18h16"/></svg>
            <svg id="icon-close" class="hidden h-6 w-6" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" d="M6 6l12 12M18 6L6 18"/></svg>
          </button>
        </nav>

        <div id="mobile-menu" class="hidden border-t border-slate-200 bg-white md:hidden">
          <ul class="space-y-1 px-4 py-3 font-medium">${mobile}</ul>
          <div id="auth-mobile" class="border-t border-slate-200 px-4 py-3"></div>
        </div>
      </header>`;
  }

  function footerHtml() {
    return `
      <footer class="bg-ink text-slate-400">
        <div class="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-2 lg:grid-cols-4 lg:px-8">
          <div>
            <a href="index.html" class="inline-block rounded-lg bg-white px-2 py-1" aria-label="CodeZ Academy - Trang chủ">
              <span class="logo-crop"><img src="images/logo.png" alt="CodeZ Academy" /></span>
            </a>
            <p class="mt-4 text-sm leading-relaxed">
              Nền tảng học lập trình trực tuyến giúp bạn tiếp cận kiến thức công nghệ dễ dàng, theo dõi tiến độ và nâng cao kỹ năng thực chiến.
            </p>
          </div>

          <div>
            <h3 class="font-heading font-semibold text-white">Khám phá</h3>
            <ul class="mt-4 space-y-2 text-sm">
              <li><a href="index.html" class="transition hover:text-white">Trang Chủ</a></li>
              <li><a href="about.html" class="transition hover:text-white">Về Chúng Tôi</a></li>
              <li><a href="detail.html" class="transition hover:text-white">Chi tiết khóa học</a></li>
              <li><a href="login.html" class="transition hover:text-white">Đăng nhập</a></li>
            </ul>
          </div>

          <div>
            <h3 class="font-heading font-semibold text-white">Hỗ trợ</h3>
            <ul class="mt-4 space-y-2 text-sm">
              <li><a href="detail.html#huy-dang-ky" class="transition hover:text-white">Hủy đăng ký khóa học</a></li>
              <li><a href="about.html#lien-he" class="transition hover:text-white">Liên hệ hỗ trợ</a></li>
              <li><a href="mailto:contact@codezacademy.vn" class="transition hover:text-white">Gửi email cho chúng tôi</a></li>
            </ul>
          </div>

          <div>
            <h3 class="font-heading font-semibold text-white">Liên hệ</h3>
            <ul class="mt-4 space-y-3 text-sm">
              <li class="flex items-start gap-2">
                <svg class="mt-0.5 h-4 w-4 shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M3 8l9 6 9-6M5 5h14a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2z"/></svg>
                <a href="mailto:contact@codezacademy.vn" class="transition hover:text-white">contact@codezacademy.vn</a>
              </li>
              <li class="flex items-start gap-2">
                <svg class="mt-0.5 h-4 w-4 shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M3 5a2 2 0 012-2h2.3a1 1 0 01.95.68l1.1 3.3a1 1 0 01-.5 1.2L7.2 9.3a11 11 0 007.5 7.5l1.1-1.65a1 1 0 011.2-.5l3.3 1.1a1 1 0 01.7.95V19a2 2 0 01-2 2h-1C9.7 21 3 14.3 3 6V5z"/></svg>
                <a href="tel:0123456789" class="transition hover:text-white">0123 456 789</a>
              </li>
              <li class="flex items-start gap-2">
                <svg class="mt-0.5 h-4 w-4 shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 21s-7-6.2-7-11a7 7 0 1114 0c0 4.8-7 11-7 11z"/><circle cx="12" cy="10" r="2.5"/></svg>
                <span>TP. Hồ Chí Minh, Việt Nam</span>
              </li>
            </ul>
          </div>
        </div>

        <div class="border-t border-white/10">
          <p class="mx-auto max-w-7xl px-4 py-6 text-center text-sm sm:px-6 lg:px-8">
            © ${new Date().getFullYear()} CodeZ Academy. All rights reserved.
          </p>
        </div>
      </footer>`;
  }

  // outerHTML để <header> nằm trực tiếp trong <body> (sticky hoạt động đúng)
  const headerSlot = document.getElementById('site-header');
  const footerSlot = document.getElementById('site-footer');
  if (headerSlot) headerSlot.outerHTML = headerHtml();
  if (footerSlot) footerSlot.outerHTML = footerHtml();

  // Menu mobile
  const toggle = document.getElementById('menu-toggle');
  const menu = document.getElementById('mobile-menu');
  if (toggle && menu) {
    toggle.addEventListener('click', () => {
      const isOpen = menu.classList.toggle('hidden') === false;
      toggle.setAttribute('aria-expanded', String(isOpen));
      toggle.setAttribute('aria-label', isOpen ? 'Đóng menu' : 'Mở menu');
      document.getElementById('icon-open').classList.toggle('hidden', isOpen);
      document.getElementById('icon-close').classList.toggle('hidden', !isOpen);
    });
  }

  /* ---------- 4. Trạng thái đăng nhập ---------- */
  let currentUser = null;
  let authReady = false;
  const userListeners = [];

  function displayName(user) {
    const meta = user && user.user_metadata;
    return (meta && meta.full_name) || (user && user.email ? user.email.split('@')[0] : '');
  }

  function renderAuth(user) {
    const desktop = document.getElementById('auth-desktop');
    const mobile = document.getElementById('auth-mobile');

    if (user) {
      const name = esc(displayName(user));
      if (desktop) desktop.innerHTML = `
        <span class="max-w-[12rem] truncate text-sm text-slate-600">Xin chào, <strong class="text-ink">${name}</strong></span>
        <button type="button" data-logout class="rounded-lg border border-slate-300 px-4 py-2 font-medium text-ink transition hover:border-primary hover:text-primary">Đăng xuất</button>`;
      if (mobile) mobile.innerHTML = `
        <p class="mb-3 truncate text-sm text-slate-600">Xin chào, <strong class="text-ink">${name}</strong></p>
        <button type="button" data-logout class="w-full rounded-lg border border-slate-300 px-4 py-2 font-medium text-ink">Đăng xuất</button>`;
    } else {
      if (desktop) desktop.innerHTML = `
        <a href="login.html" class="rounded-lg px-4 py-2 font-medium text-ink transition hover:text-primary">Đăng nhập</a>
        <a href="register.html" class="rounded-lg bg-primary px-5 py-2.5 font-medium text-white shadow-sm transition hover:bg-primary-light">Đăng ký</a>`;
      if (mobile) mobile.innerHTML = `
        <div class="flex gap-3">
          <a href="login.html" class="flex-1 rounded-lg border border-slate-300 px-4 py-2 text-center font-medium text-ink">Đăng nhập</a>
          <a href="register.html" class="flex-1 rounded-lg bg-primary px-4 py-2 text-center font-medium text-white">Đăng ký</a>
        </div>`;
    }
    if (desktop) desktop.classList.remove('opacity-0');
  }

  function setUser(user) {
    const sameUser = (currentUser && currentUser.id) === (user && user.id);
    currentUser = user || null;
    if (authReady && sameUser) return; // TOKEN_REFRESHED... không cần vẽ lại
    authReady = true;
    renderAuth(currentUser);
    userListeners.forEach((fn) => fn(currentUser));
  }

  // Đăng ký lắng nghe: gọi ngay nếu đã biết trạng thái, và gọi lại mỗi khi đổi
  function onUser(fn) {
    userListeners.push(fn);
    if (authReady) fn(currentUser);
  }

  document.addEventListener('click', async (e) => {
    if (!e.target.closest('[data-logout]')) return;
    try {
      if (db) await db.auth.signOut();
    } catch (err) {
      console.error('[signOut]', err);
    }
    window.location.href = 'index.html';
  });

  if (db) {
    // setTimeout 0: tránh gọi Supabase ngay trong callback (có thể gây treo SDK)
    db.auth.onAuthStateChange((_event, session) => {
      setTimeout(() => setUser(session ? session.user : null), 0);
    });
  }
  // Phòng khi SDK không phản hồi: vẫn hiển thị nút Đăng nhập/Đăng ký
  setTimeout(() => { if (!authReady) setUser(null); }, 2000);

  window.CodeZ = {
    db, esc, safeImageUrl, formatPrice, formatDate, normalizeId, isValidPhone,
    showMessage, setBusy, authError, courseCard, bindCoverFallback,
    displayName, onUser, getUser: () => currentUser,
  };
})();
