/* ═══════════════════════════════════════════════════════
   KARIO — Script
   ═══════════════════════════════════════════════════════ */

// ── Navbar Scroll Effect ──────────────────────────────────
const navbar = document.getElementById('navbar');

window.addEventListener('scroll', () => {
  if (window.scrollY > 40) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
});

// ── Mobile Nav ────────────────────────────────────────────
function toggleMobileNav() {
  const hamburger = document.getElementById('hamburger');
  const mobileNav = document.getElementById('mobileNav');
  hamburger.classList.toggle('active');
  mobileNav.classList.toggle('active');
  document.body.style.overflow = mobileNav.classList.contains('active') ? 'hidden' : '';
}

function closeMobileNav() {
  const hamburger = document.getElementById('hamburger');
  const mobileNav = document.getElementById('mobileNav');
  hamburger.classList.remove('active');
  mobileNav.classList.remove('active');
  document.body.style.overflow = '';
}

// ── Scroll Reveal Animations ──────────────────────────────
const revealElements = document.querySelectorAll('.reveal');

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('revealed');
      revealObserver.unobserve(entry.target);
    }
  });
}, {
  threshold: 0.12,
  rootMargin: '0px 0px -40px 0px'
});

revealElements.forEach(el => revealObserver.observe(el));


// ── Contact Form ──────────────────────────────────────────
async function submitContact(e) {
  e.preventDefault();
  const name = document.getElementById('contactName').value.trim();
  const email = document.getElementById('contactEmail').value.trim();
  const company = document.getElementById('contactCompany').value.trim();
  const phone = document.getElementById('contactPhone').value.trim();
  const message = document.getElementById('contactMessage').value.trim();

  if (!name || !email || !message) return;

  console.log('%c[KARIO] Contact form submitted', 'color: #f59e0b; font-weight: bold;');
  console.log(`  From: ${name} (${email}) | Phone: ${phone || 'N/A'}`);

  // Send to Telegram Instantly
  const telegramMsg = `*New Website Lead*\n\n*Name:* ${name}\n*Email:* ${email}\n*Phone:* ${phone || 'Not Provided'}\n*Company:* ${company || 'N/A'}\n*Message:* ${message}`;
  await forwardToTelegram(telegramMsg);

  showToast("Consultation request sent! We'll be in touch within 24 hours.");
  document.getElementById('contactForm').reset();
}


// ── Utilities ─────────────────────────────────────────────
function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// Toast notification
function showToast(message) {
  const existing = document.querySelector('.kario-toast');
  if (existing) existing.remove();

  const toast = document.createElement('div');
  toast.className = 'kario-toast';
  toast.textContent = message;
  toast.style.cssText = `
    position: fixed;
    bottom: 32px;
    left: 50%;
    transform: translateX(-50%) translateY(20px);
    background: #ffffff;
    color: #000000;
    padding: 14px 28px;
    border-radius: 4px;
    font-family: 'Inter', sans-serif;
    font-size: 0.85rem;
    font-weight: 600;
    letter-spacing: 0.02em;
    z-index: 9999;
    opacity: 0;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    box-shadow: 0 8px 30px rgba(255, 255, 255, 0.15);
  `;
  document.body.appendChild(toast);

  requestAnimationFrame(() => {
    toast.style.opacity = '1';
    toast.style.transform = 'translateX(-50%) translateY(0)';
  });

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(-50%) translateY(20px)';
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

// ── Keyboard shortcut: ESC closes overlays ────────────────
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeMobileNav();
  }
});

// ── Motion & Interaction Upgrade ──────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  // 1. Smooth Scrolling Logic (Subtle Momentum)
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        window.scrollTo({
          top: target.offsetTop - 80,
          behavior: 'smooth'
        });
      }
    });
  });

  // 3. 3D Background Engine (KARIO AI Aerodynamic Flow)
  // Optimized for performance: Less waves, slower speed
  if (typeof VANTA !== 'undefined') {
    VANTA.WAVES({
      el: "#vanta-bg",
      mouseControls: true,
      touchControls: true,
      gyroControls: false,
      minHeight: 200.00,
      minWidth: 200.00,
      scale: 1.00,
      scaleMobile: 1.00,
      color: 0x050505,
      shininess: 20.00, // Reduced from 35 for performance
      waveHeight: 12.00, // Reduced from 15
      waveSpeed: 0.40,  // Slower for smoother feel
      zoom: 1.00
    });
  }
});

// Telegram Config is now loaded from config.js (ignored by Git)


// Utility to send to Telegram (Smart Routing: Bridge vs. Direct)
async function forwardToTelegram(messageText) {
  // HTML Sanitization for reliability
  const cleanMsg = messageText
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  // 1. Detect Environment (Local vs. Vercel)
  const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

  if (!isLocal) {
    // 🚀 VERCEL MODE: Use the secure Private Bridge (zero keys exposed)
    console.log('[KARIO] Routing via Secure Serverless Bridge...');
    try {
      const bridgeResponse = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: cleanMsg, parse_mode: 'HTML' })
      });
      if (bridgeResponse.ok) return true;
      throw new Error('Bridge failed, checking local config');
    } catch (err) {
      console.warn('[KARIO] Bridge error, falling back to local config:', err);
    }
  }

  // 🛠️ LOCAL MODE (OR FALLBACK): Use direct API via config.js
  if (typeof TELEGRAM_CONFIG === 'undefined' || TELEGRAM_CONFIG.token === 'YOUR_BOT_TOKEN') {
    console.warn('[KARIO] Telegram direct config missing or default.');
    return;
  }

  const directUrl = `https://api.telegram.org/bot${TELEGRAM_CONFIG.token}/sendMessage?chat_id=${TELEGRAM_CONFIG.chatId}&text=${encodeURIComponent(cleanMsg)}&parse_mode=HTML`;

  try {
    const response = await fetch(directUrl);
    const data = await response.json();
    if (!data.ok) throw new Error(data.description);
    console.log('[KARIO] Telegram Direct Success');
    return data;
  } catch (err) {
    console.error('[KARIO] Telegram Error:', err);
    if (typeof showToast === 'function') showToast("⚠️ Telegram Error: Check Connection");
  }
}



// ── KARIO AI: PREMIUM CONCIERGE ENGINE ────────────────────────
const kTrigger = document.getElementById('chatTrigger');
const kWindow = document.getElementById('chatWindow');
const kClose = document.getElementById('chatClose');
const kMessages = document.getElementById('chatMessages');
const kInput = document.getElementById('chatInput');
const kSend = document.getElementById('chatSend');
const kTyping = document.getElementById('chatTyping');

let kChatState = {
  isOpen: false,
  step: 1, // 1: Initial Ask, 2: Name Capture, 3: Contact Capture, 4: Social Capture, 5: Finished
  userData: { name: '', contact: '', extra: '', initialRequest: '' }
};

function kToggle() {
  kChatState.isOpen = !kChatState.isOpen;
  kWindow.classList.toggle('active', kChatState.isOpen);
  
  // Initial Greeting when first opened
  if (kChatState.isOpen && kChatState.step === 1 && kMessages.children.length === 0) {
    setTimeout(async () => {
      await kSimType(500);
      kAddMsg("Hey! I'm KARIO AI, your agency assistant. 👋 How can I help you elevate your business today?");
    }, 400);
  }

  if (kChatState.isOpen && kChatState.step > 2 && kChatState.step < 5) {
    // Re-engagement nudge ONLY if chat was already started and then reopened
    setTimeout(() => {
      kAddMsg("Ready to finish? Let's get your system live. 🏎️");
    }, 1000);
  }
}

function kAddMsg(text, type = 'bot') {
  const div = document.createElement('div');
  div.className = `chat-msg ${type}`;
  div.textContent = text;
  kMessages.appendChild(div);
  kMessages.scrollTop = kMessages.scrollHeight;
}

async function kSimType(duration = 1000) {
  if (kTyping) kTyping.style.display = 'flex';
  kMessages.scrollTop = kMessages.scrollHeight;
  return new Promise(res => setTimeout(() => {
    if (kTyping) kTyping.style.display = 'none';
    res();
  }, duration));
}

function isValidContact(str) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phoneRegex = /^[\d\s\-\+\(\)]{7,20}$/; 
  return emailRegex.test(str) || phoneRegex.test(str);
}

async function karioReply(text) {
  await kSimType(1000);
  const input = text.toLowerCase();

  // 1. Specialized Service Handling (Only fallback if already finished)
  if (kChatState.step >= 6) {
    if (input.includes('service') || input.includes('offer') || input.includes('website')) {
      kAddMsg("We build custom elite websites and AI systems for brokers. But look, my partners have your info now and they'll give you the full breakdown soon! 🏎️");
      return;
    }
  }

  // 2. State Machine (Conversational Lead Capture)
  if (kChatState.step === 1) {
    kChatState.userData.initialRequest = text;
    kAddMsg("That sounds like something we can definitely handle. 🏎️");
    await kSimType(800);
    kAddMsg("To get you the right details, how should I call you?");
    kChatState.step = 2;
  } else if (kChatState.step === 2) {
    kChatState.userData.name = text;
    kAddMsg(`Nice to meet you, ${text}! 🙌 What's the best email or phone number for us to reach you?`);
    kChatState.step = 3;
  } else if (kChatState.step === 3) {
    kChatState.userData.contact = text;
    
    // PUSH 1: Name + Contact + Request (Instant delivery)
    const report1 = `<b>🔥 NEW LEAD (CONVERSATIONAL)</b>\n\n<b>Name:</b> ${kChatState.userData.name}\n<b>Contact:</b> ${kChatState.userData.contact}\n<b>Request:</b> ${kChatState.userData.initialRequest}\n\n<i>Waiting for social info...</i>`;
    await forwardToTelegram(report1);
    
    kAddMsg("Got it. Just one more thing: What's your Instagram or X handle?");
    kChatState.step = 4;
  } else if (kChatState.step === 4) {
    kChatState.userData.extra = text;
    
    // PUSH 2: Full Profile
    const report2 = `<b>✅ COMPLETE LEAD PROFILE</b>\n\n<b>Name:</b> ${kChatState.userData.name}\n<b>Contact:</b> ${kChatState.userData.contact}\n<b>Request:</b> ${kChatState.userData.initialRequest}\n<b>Social:</b> ${kChatState.userData.extra}\n\n<i>System: Secure Lead Routing Active</i>`;
    await forwardToTelegram(report2);
    
    kAddMsg("Thanks! 🥂 I've sent everything to my partners. We'll be in touch soon!");
    kChatState.step = 5;
  } else if (kChatState.step === 5) {
    kAddMsg("You're already on our list! 🥂 We'll reach out to you within 24 hours.");
  } else {
    kAddMsg("I'm all ears! Feel free to ask about our services. 🏎️");
  }
}

async function handleChatInput() {
  const text = kInput.value.trim();
  if (!text) return;
  kInput.value = '';
  kAddMsg(text, 'user');
  await karioReply(text);
}

// Global Event Listeners
kTrigger.addEventListener('click', kToggle);
kClose.addEventListener('click', kToggle);
kSend.addEventListener('click', handleChatInput);
kInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') handleChatInput(); });

// Chat event listeners are already active via Trigger/Close buttons.
// Auto-pop removed per user request for a cleaner experience.
