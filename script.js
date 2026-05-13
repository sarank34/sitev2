(() => {
  const root = document.documentElement;
  const cards = [...document.querySelectorAll(".project-card")];
  const filters = [...document.querySelectorAll(".filter")];
  const search = document.getElementById("projectSearch");
  const themeToggle = document.getElementById("themeToggle");
  const mobileTheme = document.getElementById("mobileTheme");
  const accentButtons = [...document.querySelectorAll(".accent-picker button")];

  if ("scrollRestoration" in history) history.scrollRestoration = "manual";
  window.addEventListener("load", () => window.scrollTo(0, 0), { once: true });

  function haptic(pattern = 6) {
    if ("vibrate" in navigator) navigator.vibrate(pattern);
  }

  document.querySelectorAll("a, button, .project-card").forEach(el => {
    el.addEventListener("pointerdown", () => haptic(5), { passive: true });
  });

  function setTheme(mode) {
    root.dataset.theme = mode;
    localStorage.setItem("saran-theme", mode);
    if (themeToggle) themeToggle.checked = mode === "light";
    if (mobileTheme) mobileTheme.textContent = mode === "light" ? "Dark" : "Light";
  }

  setTheme(localStorage.getItem("saran-theme") || root.dataset.theme || "dark");

  themeToggle?.addEventListener("change", () => setTheme(themeToggle.checked ? "light" : "dark"));
  mobileTheme?.addEventListener("click", () => {
    setTheme(root.dataset.theme === "light" ? "dark" : "light");
    haptic([8, 12, 8]);
  });

  function setAccent(accent) {
    root.dataset.accent = accent;
    localStorage.setItem("saran-accent", accent);
    accentButtons.forEach(b => b.classList.toggle("active", b.dataset.accent === accent));
  }

  setAccent(localStorage.getItem("saran-accent") || root.dataset.accent || "red");
  accentButtons.forEach(btn => btn.addEventListener("click", () => setAccent(btn.dataset.accent)));

  function currentFilter() {
    return document.querySelector(".filter.active")?.dataset.filter || "all";
  }

  function filterProjects() {
    const q = (search?.value || "").toLowerCase().trim();
    const f = currentFilter();

    cards.forEach(card => {
      const text = [
        card.dataset.title,
        card.dataset.meta,
        card.dataset.category,
        card.dataset.tools,
        card.dataset.desc
      ].join(" ").toLowerCase();

      card.hidden = !((f === "all" || card.dataset.category === f) && (!q || text.includes(q)));
    });
  }

  filters.forEach(btn => {
    btn.addEventListener("click", () => {
      filters.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      filterProjects();
    });
  });

  search?.addEventListener("input", filterProjects);

  const modal = document.getElementById("projectModal");
  const modalImage = document.getElementById("modalImage");
  const modalTitle = document.getElementById("modalTitle");
  const modalMeta = document.getElementById("modalMeta");
  const modalDesc = document.getElementById("modalDesc");
  const modalTools = document.getElementById("modalTools");
  const modalClose = document.getElementById("modalClose");

  cards.forEach(card => {
    card.addEventListener("click", () => {
      const img = card.querySelector("img");
      modalImage.src = img.src;
      modalImage.alt = img.alt;
      modalTitle.textContent = card.dataset.title;
      modalMeta.textContent = card.dataset.meta;
      modalDesc.textContent = card.dataset.desc;
      modalTools.innerHTML = "";
      (card.dataset.tools || "").split("•").forEach(tool => {
        const tag = document.createElement("span");
        tag.textContent = tool.trim();
        modalTools.appendChild(tag);
      });
      modal.showModal();
    });
  });

  modalClose?.addEventListener("click", () => modal.close());
  modal?.addEventListener("click", e => { if (e.target === modal) modal.close(); });

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("show");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  document.querySelectorAll(".reveal").forEach(el => observer.observe(el));

  // Three.js parallax background
  const canvas = document.getElementById("scene");
  if (canvas && window.THREE) {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(55, innerWidth / innerHeight, 0.1, 1000);
    camera.position.z = 7;

    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 2));
    renderer.setSize(innerWidth, innerHeight, false);

    const count = innerWidth < 760 ? 650 : 1500;
    const positions = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      const ix = i * 3;
      positions[ix] = (Math.random() - 0.5) * 14;
      positions[ix + 1] = (Math.random() - 0.5) * 7;
      positions[ix + 2] = (Math.random() - 0.5) * 5;
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));

    const mat = new THREE.PointsMaterial({
      size: innerWidth < 760 ? 0.025 : 0.017,
      color: 0xffffff,
      transparent: true,
      opacity: 0.55
    });

    const points = new THREE.Points(geo, mat);
    points.rotation.x = -0.18;
    scene.add(points);

    let mx = 0, my = 0;
    window.addEventListener("pointermove", e => {
      mx = (e.clientX / innerWidth - 0.5);
      my = (e.clientY / innerHeight - 0.5);
    }, { passive: true });

    function animate(t = 0) {
      requestAnimationFrame(animate);
      points.rotation.y = t * 0.00007 + mx * 0.22;
      points.rotation.x = -0.18 + my * 0.12;
      points.position.y = -scrollY * 0.00035;
      mat.color.set(root.dataset.theme === "light" ? 0x111111 : 0xffffff);
      renderer.render(scene, camera);
    }
    animate();

    window.addEventListener("resize", () => {
      camera.aspect = innerWidth / innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(innerWidth, innerHeight, false);
    });
  }
})();