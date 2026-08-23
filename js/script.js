(() => {
  "use strict";

  const $ = (s, root=document) => root.querySelector(s);
  const $$ = (s, root=document) => [...root.querySelectorAll(s)];

  $("#year").textContent = new Date().getFullYear();

  const nav = $("#siteNav");
  const progress = $("#scrollProgress");

  const onScroll = () => {
    const top = window.scrollY || document.documentElement.scrollTop;
    const max = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    progress.style.width = `${max ? (top / max) * 100 : 0}%`;
    nav.classList.toggle("scrolled", top > 30);
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  // Reveal sections as they enter the viewport.
  const reveals = $$(".reveal");
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    reveals.forEach(el => observer.observe(el));
  } else {
    reveals.forEach(el => el.classList.add("is-visible"));
  }

  // Subtle cursor spotlight on desktop.
  const glow = $("#cursorGlow");
  if (glow && window.matchMedia("(pointer:fine)").matches) {
    glow.style.opacity = "1";
    window.addEventListener("pointermove", e => {
      glow.style.left = `${e.clientX}px`;
      glow.style.top = `${e.clientY}px`;
    }, { passive: true });
  }

  // Magnetic buttons.
  if (window.matchMedia("(pointer:fine)").matches) {
    $$(".magnetic").forEach(btn => {
      btn.addEventListener("pointermove", e => {
        const r = btn.getBoundingClientRect();
        const x = (e.clientX - (r.left + r.width / 2)) * 0.12;
        const y = (e.clientY - (r.top + r.height / 2)) * 0.12;
        btn.style.transform = `translate(${x}px, ${y}px)`;
      });
      btn.addEventListener("pointerleave", () => btn.style.transform = "");
    });
  }

  // Small 3D tilt effect for cards.
  if (window.matchMedia("(pointer:fine)").matches) {
    $$(".tilt-card").forEach(card => {
      card.addEventListener("pointermove", e => {
        const r = card.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - .5;
        const y = (e.clientY - r.top) / r.height - .5;
        card.style.transform = `perspective(900px) rotateX(${(-y * 3).toFixed(2)}deg) rotateY(${(x * 4).toFixed(2)}deg) translateY(-4px)`;
      });
      card.addEventListener("pointerleave", () => {
        card.style.transform = "";
      });
    });
  }

  // Animated hero counter.
  const counter = $('[data-count]');
  if (counter && "IntersectionObserver" in window) {
    const counterObserver = new IntersectionObserver(entries => {
      if (!entries[0].isIntersecting) return;
      const target = Number(counter.dataset.count);
      let current = 0;
      const duration = 900;
      const start = performance.now();
      const tick = now => {
        const progress = Math.min((now - start) / duration, 1);
        current = Math.floor(progress * target);
        counter.textContent = current;
        if (progress < 1) requestAnimationFrame(tick);
        else counter.textContent = target;
      };
      requestAnimationFrame(tick);
      counterObserver.disconnect();
    }, { threshold: .8 });
    counterObserver.observe(counter);
  }

  // Close mobile menu after navigation.
  $$(".nav-link").forEach(link => {
    link.addEventListener("click", () => {
      const menu = $("#navMenu");
      if (menu && menu.classList.contains("show") && window.bootstrap) {
        bootstrap.Collapse.getOrCreateInstance(menu).hide();
      }
    });
  });
})();
