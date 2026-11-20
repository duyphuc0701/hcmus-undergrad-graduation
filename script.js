(function () {
  'use strict';

  // Target graduation event time: 11:00 AM - 12:30 PM, Nov 26, 2026 (GMT+7)
  const EVENT_START = new Date('2026-11-26T11:00:00+07:00').getTime();
  const EVENT_END = new Date('2026-11-26T12:30:00+07:00').getTime();

  // DOM Elements
  const envelopeOverlay = document.getElementById('envelope-overlay');
  const btnOpenCard = document.getElementById('btn-open-card');
  const envelopeGuestName = document.getElementById('envelope-guest-name');
  const guestDisplayName = document.getElementById('guest-display-name');

  const cdDays = document.getElementById('cd-days');
  const cdHours = document.getElementById('cd-hours');
  const cdMinutes = document.getElementById('cd-minutes');
  const cdSeconds = document.getElementById('cd-seconds');
  const countdownStatus = document.getElementById('countdown-status');

  const btnCelebrate = document.getElementById('btn-celebrate');
  const btnCopyAddress = document.getElementById('btn-copy-address');
  const btnCopyPhone = document.getElementById('btn-copy-phone');
  const btnDownloadIcs = document.getElementById('btn-download-ics');

  const shareModal = document.getElementById('share-modal');
  const btnShareModal = document.getElementById('btn-share-modal');
  const btnCloseModal = document.getElementById('btn-close-modal');
  const inputGuestName = document.getElementById('input-guest-name');
  const generatedUrlPreview = document.getElementById('generated-url-preview');
  const btnCopyCustomLink = document.getElementById('btn-copy-custom-link');
  const btnApplyGuestPreview = document.getElementById('btn-apply-guest-preview');

  const toastEl = document.getElementById('toast');

  // 1. Read Guest Name from URL query parameter (?to=... or ?guest=... or ?name=...)
  function initGuestName() {
    const params = new URLSearchParams(window.location.search);
    const rawGuest =
      params.get('to') ||
      params.get('guest') ||
      params.get('name') ||
      params.get('khach');

    if (rawGuest && rawGuest.trim()) {
      setGuestNameOnPage(rawGuest.trim());
    }
  }

  function setGuestNameOnPage(name) {
    envelopeGuestName.textContent = name;
    guestDisplayName.textContent = name;
    document.title = `Thiệp Mời Tốt Nghiệp gửi ${name} | Nguyễn Duy Phúc`;
  }

  // 2. Toast helper
  let toastTimer = null;
  function showToast(message) {
    if (!toastEl) return;
    toastEl.textContent = message;
    toastEl.hidden = false;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toastEl.hidden = true;
    }, 2800);
  }

  // 3. Copy to clipboard helper
  async function copyText(text, label) {
    try {
      await navigator.clipboard.writeText(text);
      showToast(`✅ Đã sao chép ${label}`);
    } catch {
      const textarea = document.createElement('textarea');
      textarea.value = text;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      showToast(`✅ Đã sao chép ${label}`);
    }
  }

  // 4. Countdown Timer
  function updateCountdown() {
    const now = Date.now();

    if (now >= EVENT_START && now <= EVENT_END) {
      cdDays.textContent = '00';
      cdHours.textContent = '00';
      cdMinutes.textContent = '00';
      cdSeconds.textContent = '00';
      countdownStatus.textContent =
        '🎓 Lễ tốt nghiệp đang diễn ra ngay lúc này tại ĐH Khoa học Tự nhiên (227 Nguyễn Văn Cừ)!';
      return;
    }

    if (now > EVENT_END) {
      cdDays.textContent = '00';
      cdHours.textContent = '00';
      cdMinutes.textContent = '00';
      cdSeconds.textContent = '00';
      countdownStatus.textContent =
        '🎉 Cảm ơn bạn đã đồng hành cùng lễ tốt nghiệp của Nguyễn Duy Phúc!';
      return;
    }

    const diff = EVENT_START - now;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / (1000 * 60)) % 60);
    const seconds = Math.floor((diff / 1000) % 60);

    cdDays.textContent = String(days).padStart(2, '0');
    cdHours.textContent = String(hours).padStart(2, '0');
    cdMinutes.textContent = String(minutes).padStart(2, '0');
    cdSeconds.textContent = String(seconds).padStart(2, '0');
  }

  // 5. Generate & Download .ICS Calendar File
  function downloadIcsFile() {
    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Nguyen Duy Phuc//Graduation Invitation 2026//VI',
      'CALSCALE:GREGORIAN',
      'METHOD:PUBLISH',
      'BEGIN:VEVENT',
      'UID:graduation-2026-nguyenduyphuc@hcmus.edu.vn',
      'SUMMARY:🎓 Lễ Tốt Nghiệp Đại Học - Nguyễn Duy Phúc',
      'DTSTART:20261126T040000Z',
      'DTEND:20261126T053000Z',
      'LOCATION:Trường Đại học Khoa học Tự nhiên (Cơ sở 1)\\, 227 Nguyễn Văn Cừ\\, Phường Chợ Quán\\, TP.HCM',
      'DESCRIPTION:Thân mời bạn tham dự Lễ Tốt Nghiệp của Nguyễn Duy Phúc (11:00 - 12:30 Thứ Năm 26/11/2026). Liên hệ: 0936197861.',
      'STATUS:CONFIRMED',
      'END:VEVENT',
      'END:VCALENDAR'
    ].join('\r\n');

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'Le-Tot-Nghiep-Nguyen-Duy-Phuc-26-11-2026.ics';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showToast('📅 Đã tải file lịch (.ics)');
  }

  // 6. Lightweight Confetti Animation
  const canvas = document.getElementById('confetti-canvas');
  const ctx = canvas ? canvas.getContext('2d') : null;
  let confettiParticles = [];
  let confettiAnimId = null;

  function resizeCanvas() {
    if (!canvas) return;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  window.addEventListener('resize', resizeCanvas);
  resizeCanvas();

  function launchConfetti(count = 110) {
    if (!ctx || !canvas) return;
    const colors = ['#d4a843', '#f6e09e', '#1d3c6a', '#ffffff', '#e8c468', '#3b82f6'];

    for (let i = 0; i < count; i++) {
      confettiParticles.push({
        x: Math.random() * canvas.width,
        y: -20 - Math.random() * 120,
        w: 6 + Math.random() * 7,
        h: 8 + Math.random() * 10,
        color: colors[Math.floor(Math.random() * colors.length)],
        vx: -2 + Math.random() * 4,
        vy: 2.5 + Math.random() * 4.5,
        rotation: Math.random() * 360,
        rotationSpeed: -6 + Math.random() * 12,
        opacity: 1
      });
    }

    if (!confettiAnimId) {
      animateConfetti();
    }
  }

  function animateConfetti() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    confettiParticles.forEach((p) => {
      p.x += p.vx;
      p.y += p.vy;
      p.rotation += p.rotationSpeed;
      if (p.y > canvas.height * 0.75) {
        p.opacity -= 0.018;
      }

      ctx.save();
      ctx.globalAlpha = Math.max(0, p.opacity);
      ctx.translate(p.x, p.y);
      ctx.rotate((p.rotation * Math.PI) / 180);
      ctx.fillStyle = p.color;
      ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
      ctx.restore();
    });

    confettiParticles = confettiParticles.filter(
      (p) => p.y < canvas.height + 30 && p.opacity > 0
    );

    if (confettiParticles.length > 0) {
      confettiAnimId = requestAnimationFrame(animateConfetti);
    } else {
      confettiAnimId = null;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  }

  // 7. Personalized Share Link Modal
  function getCustomShareUrl(guestName) {
    const baseUrl = window.location.origin + window.location.pathname;
    if (!guestName || !guestName.trim()) {
      return baseUrl;
    }
    const url = new URL(baseUrl);
    url.searchParams.set('to', guestName.trim());
    return url.toString();
  }

  function updateSharePreview() {
    const val = inputGuestName.value;
    generatedUrlPreview.textContent = getCustomShareUrl(val);
  }

  // Event Listeners
  if (btnOpenCard) {
    btnOpenCard.addEventListener('click', () => {
      envelopeOverlay.classList.add('is-opened');
      launchConfetti(130);
    });
  }

  if (btnCelebrate) {
    btnCelebrate.addEventListener('click', () => {
      launchConfetti(100);
      showToast('🎓 Hẹn gặp bạn ngày 26/11/2026 nhé!');
    });
  }

  if (btnCopyAddress) {
    btnCopyAddress.addEventListener('click', () => {
      copyText(btnCopyAddress.dataset.copy, 'địa chỉ trường');
    });
  }

  if (btnCopyPhone) {
    btnCopyPhone.addEventListener('click', () => {
      copyText(btnCopyPhone.dataset.copy, 'số điện thoại 0936197861');
    });
  }

  if (btnDownloadIcs) {
    btnDownloadIcs.addEventListener('click', downloadIcsFile);
  }

  if (btnShareModal) {
    btnShareModal.addEventListener('click', () => {
      shareModal.hidden = false;
      updateSharePreview();
      inputGuestName.focus();
    });
  }

  if (btnCloseModal) {
    btnCloseModal.addEventListener('click', () => {
      shareModal.hidden = true;
    });
  }

  if (shareModal) {
    shareModal.addEventListener('click', (e) => {
      if (e.target === shareModal) {
        shareModal.hidden = true;
      }
    });
  }

  if (inputGuestName) {
    inputGuestName.addEventListener('input', updateSharePreview);
  }

  if (btnCopyCustomLink) {
    btnCopyCustomLink.addEventListener('click', () => {
      const url = getCustomShareUrl(inputGuestName.value);
      copyText(url, 'link thiệp mời');
    });
  }

  if (btnApplyGuestPreview) {
    btnApplyGuestPreview.addEventListener('click', () => {
      const name = inputGuestName.value.trim() || 'Bạn cùng người thương';
      setGuestNameOnPage(name);
      shareModal.hidden = true;
      showToast(`✨ Đã cập nhật tên khách mời: ${name}`);
    });
  }

  // Initialize
  initGuestName();
  updateCountdown();
  setInterval(updateCountdown, 1000);
})();
