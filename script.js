const root=document.documentElement;
const boot=document.getElementById("boot");
const clock=document.getElementById("clock");
const filters=[...document.querySelectorAll(".filter")];
const cards=[...document.querySelectorAll(".project-card")];
const grid=document.getElementById("projectsGrid");
const modal=document.getElementById("projectModal");
const modalImg=document.getElementById("modalImage");
const modalTitle=document.getElementById("modalTitle");
const modalMeta=document.getElementById("modalMeta");
const closeModal=document.getElementById("closeModal");
const themeToggle=document.getElementById("themeToggle");
const accentButtons=[...document.querySelectorAll(".accent-row button")];



function tick(){clock.textContent=new Intl.DateTimeFormat("en-US",{timeZone:"Asia/Colombo",hour:"2-digit",minute:"2-digit",second:"2-digit"}).format(new Date())}
tick(); setInterval(tick,1000);

function haptic(p=8){if("vibrate" in navigator)navigator.vibrate(p)}
document.querySelectorAll("a,button,.project-card").forEach(el=>el.addEventListener("pointerdown",()=>haptic(),{passive:true}));

filters.forEach(btn=>btn.addEventListener("click",()=>{
  filters.forEach(b=>b.classList.remove("active"));btn.classList.add("active");
  const f=btn.dataset.filter;
  cards.forEach(card=>{card.style.display=(f==="all"||card.dataset.category===f)?"":"none";});
}));

document.getElementById("gridView").onclick=()=>{grid.classList.remove("list");gridView.classList.add("active");listView.classList.remove("active")};
document.getElementById("listView").onclick=()=>{grid.classList.add("list");listView.classList.add("active");gridView.classList.remove("active")};

cards.forEach(card=>card.addEventListener("click",()=>{
  const img=card.querySelector("img");
  modalImg.src=img.src; modalImg.alt=img.alt;
  modalTitle.textContent=card.dataset.title;
  modalMeta.textContent=card.dataset.meta;
  modal.showModal();
}));
closeModal.onclick=()=>modal.close();
modal.addEventListener("click",e=>{if(e.target===modal)modal.close()});

themeToggle.addEventListener("change",()=>{root.dataset.theme=themeToggle.checked?"light":"dark";localStorage.setItem("saran-grid-theme",root.dataset.theme)});
const savedTheme=localStorage.getItem("saran-grid-theme"); if(savedTheme==="light"){root.dataset.theme="light";themeToggle.checked=true}

accentButtons.forEach(btn=>btn.addEventListener("click",()=>{
  accentButtons.forEach(b=>b.classList.remove("active"));btn.classList.add("active");
  root.dataset.accent=btn.dataset.accent; localStorage.setItem("saran-grid-accent",btn.dataset.accent);
}));
const savedAccent=localStorage.getItem("saran-grid-accent"); if(savedAccent){root.dataset.accent=savedAccent;accentButtons.forEach(b=>b.classList.toggle("active",b.dataset.accent===savedAccent));}

const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add("show");io.unobserve(e.target)}}),{threshold:.12});
document.querySelectorAll(".reveal").forEach(el=>io.observe(el));

let scene,camera,renderer,pts,mat,mouseX=0,mouseY=0;
function init3d(){
 if(!window.THREE)return;
 scene=new THREE.Scene();camera=new THREE.PerspectiveCamera(55,innerWidth/innerHeight,.1,1000);camera.position.z=6;
 renderer=new THREE.WebGLRenderer({canvas:document.getElementById("scene"),alpha:true,antialias:true});
 renderer.setPixelRatio(Math.min(devicePixelRatio,2));renderer.setSize(innerWidth,innerHeight,false);
 const count=innerWidth<700?450:1100, pos=new Float32Array(count*3);
 for(let i=0;i<count;i++){pos[i*3]=(Math.random()-.5)*12;pos[i*3+1]=(Math.random()-.5)*6;pos[i*3+2]=(Math.random()-.5)*4}
 const geo=new THREE.BufferGeometry();geo.setAttribute("position",new THREE.BufferAttribute(pos,3));
 mat=new THREE.PointsMaterial({size:innerWidth<700?.025:.017,color:0xffffff,transparent:true,opacity:.45});
 pts=new THREE.Points(geo,mat);scene.add(pts);animate();
}
function animate(t=0){requestAnimationFrame(animate);if(!pts)return;pts.rotation.y=t*.00006+mouseX*.0002;pts.rotation.x=mouseY*.0001;mat.color.set(root.dataset.theme==="light"?0x111111:0xffffff);renderer.render(scene,camera)}
window.addEventListener("pointermove",e=>{mouseX=e.clientX-innerWidth/2;mouseY=e.clientY-innerHeight/2},{passive:true});
window.addEventListener("resize",()=>{if(!renderer)return;camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();renderer.setSize(innerWidth,innerHeight,false)});
init3d();


/* V4: stronger mobile haptics */
function mobileHaptic(pattern = 10) {
  if ("vibrate" in navigator) navigator.vibrate(pattern);
}

document.querySelectorAll(
  "a, button, .filter, .project-card, .accent-row button, .mobile-nav a, .theme-pill"
).forEach((element) => {
  element.addEventListener("touchstart", () => mobileHaptic(8), { passive: true });
  element.addEventListener("pointerdown", () => mobileHaptic(6), { passive: true });
});

/* V4: enhanced Three.js parallax background */
(() => {
  const canvas = document.getElementById("scene");
  if (!canvas || !window.THREE) return;

  const enhancedScene = new THREE.Scene();
  const enhancedCamera = new THREE.PerspectiveCamera(60, innerWidth / innerHeight, 0.1, 1000);
  enhancedCamera.position.z = 7.5;

  const enhancedRenderer = new THREE.WebGLRenderer({
    canvas,
    alpha: true,
    antialias: true
  });

  enhancedRenderer.setPixelRatio(Math.min(devicePixelRatio || 1, 2));
  enhancedRenderer.setSize(innerWidth, innerHeight, false);

  const isMobile = innerWidth < 760;
  const count = isMobile ? 700 : 1800;
  const positions = new Float32Array(count * 3);
  const speeds = new Float32Array(count);

  for (let i = 0; i < count; i++) {
    const index = i * 3;
    const lane = Math.floor(Math.random() * 7) - 3;
    positions[index] = (Math.random() - 0.5) * 15;
    positions[index + 1] = lane * 0.7 + (Math.random() - 0.5) * 0.28;
    positions[index + 2] = (Math.random() - 0.5) * 7;
    speeds[i] = Math.random() * 0.8 + 0.25;
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));

  const material = new THREE.PointsMaterial({
    size: isMobile ? 0.026 : 0.018,
    color: 0xffffff,
    transparent: true,
    opacity: isMobile ? 0.38 : 0.52,
    depthWrite: false
  });

  const particles = new THREE.Points(geometry, material);
  particles.rotation.x = -0.22;
  enhancedScene.add(particles);

  const lineMaterial = new THREE.LineBasicMaterial({
    color: 0xffffff,
    transparent: true,
    opacity: isMobile ? 0.04 : 0.07
  });

  const lineGroup = new THREE.Group();
  for (let i = 0; i < (isMobile ? 18 : 34); i++) {
    const y = (Math.random() - 0.5) * 4.8;
    const points = [
      new THREE.Vector3(-8, y, (Math.random() - 0.5) * 5),
      new THREE.Vector3(8, y + (Math.random() - 0.5) * 0.6, (Math.random() - 0.5) * 5)
    ];
    const line = new THREE.Line(new THREE.BufferGeometry().setFromPoints(points), lineMaterial);
    lineGroup.add(line);
  }
  enhancedScene.add(lineGroup);

  let pointerX = 0;
  let pointerY = 0;
  let targetPointerX = 0;
  let targetPointerY = 0;

  window.addEventListener("pointermove", (event) => {
    targetPointerX = (event.clientX / innerWidth - 0.5) * 2;
    targetPointerY = (event.clientY / innerHeight - 0.5) * 2;
  }, { passive: true });

  function currentAccentColor() {
    const styles = getComputedStyle(document.documentElement);
    const raw = styles.getPropertyValue("--accent").trim() || "#ff0033";
    return new THREE.Color(raw);
  }

  function animate(time = 0) {
    requestAnimationFrame(animate);

    pointerX += (targetPointerX - pointerX) * 0.05;
    pointerY += (targetPointerY - pointerY) * 0.05;

    const scroll = window.scrollY || 0;
    const theme = document.documentElement.dataset.theme;

    particles.rotation.y = time * 0.00007 + pointerX * 0.16;
    particles.rotation.x = -0.22 + pointerY * 0.08;
    particles.position.y = Math.sin(time * 0.00055) * 0.12 - scroll * 0.00055;
    particles.position.x = pointerX * 0.18;

    lineGroup.rotation.y = -time * 0.00004 + pointerX * 0.08;
    lineGroup.position.y = scroll * 0.00022;

    const accent = currentAccentColor();
    const base = theme === "light" ? new THREE.Color("#101010") : new THREE.Color("#ffffff");
    material.color.copy(base).lerp(accent, 0.22);
    lineMaterial.color.copy(accent);

    enhancedRenderer.render(enhancedScene, enhancedCamera);
  }

  window.addEventListener("resize", () => {
    enhancedCamera.aspect = innerWidth / innerHeight;
    enhancedCamera.updateProjectionMatrix();
    enhancedRenderer.setSize(innerWidth, innerHeight, false);
  }, { passive: true });

  animate();
})();






});


/* V9 boot timing, start from landing, search */
window.addEventListener("load", () => {
  if ("scrollRestoration" in history) history.scrollRestoration = "manual";
  if (location.hash && location.hash !== "#landing") {
    history.replaceState(null, "", location.pathname + location.search);
  }
  window.scrollTo({ top: 0, left: 0, behavior: "instant" });

  setTimeout(() => {
    document.getElementById("boot")?.classList.add("done");
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, 2200);
});

const projectSearch = document.getElementById("projectSearch");

function applyProjectSearch() {
  const query = (projectSearch?.value || "").trim().toLowerCase();
  const activeFilter = document.querySelector(".filter.active")?.dataset.filter || "all";

  cards.forEach((card) => {
    const matchesFilter = activeFilter === "all" || card.dataset.category === activeFilter;
    const haystack = [
      card.dataset.title,
      card.dataset.meta,
      card.dataset.category,
      card.dataset.tools
    ].join(" ").toLowerCase();

    const matchesSearch = !query || haystack.includes(query);
    card.classList.toggle("search-hidden", !(matchesFilter && matchesSearch));
    card.style.display = matchesFilter && matchesSearch ? "" : "none";
  });
}

projectSearch?.addEventListener("input", applyProjectSearch);

filters.forEach((btn) => {
  btn.addEventListener("click", () => {
    setTimeout(applyProjectSearch, 0);
  });
});

/* mobile theme button restored */
const mobileThemeToggle2 = document.getElementById("mobileThemeToggle");
function syncMobileLightText2(){
  if(mobileThemeToggle2) mobileThemeToggle2.textContent = document.documentElement.dataset.theme === "light" ? "Dark Mode" : "Light Mode";
}
mobileThemeToggle2?.addEventListener("click",()=>{
  const nextLight = document.documentElement.dataset.theme !== "light";
  document.documentElement.dataset.theme = nextLight ? "light" : "dark";
  localStorage.setItem("saran-grid-theme", document.documentElement.dataset.theme);
  const desktopToggle = document.getElementById("themeToggle");
  if(desktopToggle) desktopToggle.checked = nextLight;
  syncMobileLightText2();
  if("vibrate" in navigator) navigator.vibrate([8,14,8]);
});
syncMobileLightText2();
document.getElementById("themeToggle")?.addEventListener("change", syncMobileLightText2);
