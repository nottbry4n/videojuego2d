const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const clickCountElement = document.getElementById("clickCount");
let clickedObjects = 0;

const TOTAL_OBJECTS = 25;
const objects = [];
const impacts = [];

const backgroundImage = new Image();
backgroundImage.src = "assets/fondo.png";

let width = 0;
let height = 0;
let lastTime = 0;
let nextSpawnId = 0;

const PALETTE = {
  balloon: { main: "#ff3159", glow: "rgba(255,49,89,0.55)", light: "#ffd2dc" },
  pumpkin: { main: "#ff9b45", glow: "rgba(255,155,69,0.5)", light: "#fff0c2" },
  ghost:   { main: "#bd8cff", glow: "rgba(189,140,255,0.5)", light: "#f4e9ff" },
  orb:     { main: "#72e9ff", glow: "rgba(114,233,255,0.5)", light: "#e4fcff" },
  candy:   { main: "#ff78bd", glow: "rgba(255,120,189,0.5)", light: "#ffe5f4" }
};

const TYPES = Object.keys(PALETTE);
const MOVEMENTS = ["up", "down", "diagonal", "circular"];

const OBJECT_IMAGES = {};
for (const type of TYPES) {
  const image = new Image();
  image.src = `assets/${type}.svg`;
  OBJECT_IMAGES[type] = image;
}

function random(min, max) {
  return Math.random() * (max - min) + min;
}

function choose(array) {
  return array[Math.floor(Math.random() * array.length)];
}

function resizeCanvas() {
  const rect = canvas.getBoundingClientRect();
  const dpr = Math.min(window.devicePixelRatio || 1, 2);

  width = rect.width;
  height = rect.height;
  canvas.width = Math.round(width * dpr);
  canvas.height = Math.round(height * dpr);
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}

function createObject(initial = false) {
  const type = choose(TYPES);
  const radius = type === "balloon" ? random(13, 19) : random(12, 18);
  const obj = {
    id: nextSpawnId++,
    type,
    movement: choose(MOVEMENTS),
    x: random(radius, Math.max(radius + 1, width - radius)),
    y: initial ? random(radius, Math.max(radius + 1, height - radius)) : random(-height * 0.2, -radius * 2),
    radius,
    speed: random(34, 105),
    vx: random(-65, 65),
    vy: random(-65, 65),
    angle: random(0, Math.PI * 2),
    orbitRadius: random(22, 65),
    orbitSpeed: random(0.5, 1.6) * (Math.random() < 0.5 ? -1 : 1),
    alpha: initial ? random(0.55, 1) : 0,
    targetAlpha: random(0.65, 1),
    fadeSpeed: random(0.65, 1.35),
    wobble: random(0, Math.PI * 2),
    rotation: random(0, Math.PI * 2),
    rotationSpeed: random(-1.2, 1.2),
    hitCooldown: 0,
    orbitCenterX: 0,
    orbitCenterY: 0
  };

  if (obj.movement === "up") {
    obj.vx = random(-18, 18);
    obj.vy = -obj.speed;
  } else if (obj.movement === "down") {
    obj.vx = random(-18, 18);
    obj.vy = obj.speed;
  } else if (obj.movement === "diagonal") {
    const direction = Math.random() < 0.5 ? -1 : 1;
    obj.vx = direction * obj.speed * random(0.55, 0.9);
    obj.vy = (Math.random() < 0.5 ? -1 : 1) * obj.speed * random(0.55, 0.9);
  } else {
    obj.orbitCenterX = obj.x;
    obj.orbitCenterY = obj.y;
    obj.vx = 0;
    obj.vy = 0;
  }

  return obj;
}

function respawnObject(obj) {
  const fresh = createObject(false);
  Object.assign(obj, fresh);
}

function respawnClickedObject(obj) {
  const originalType = obj.type;
  const fresh = createObject(true);
  fresh.type = originalType;
  fresh.radius = originalType === "balloon" ? random(13, 19) : random(12, 18);
  fresh.x = random(fresh.radius, Math.max(fresh.radius + 1, width - fresh.radius));
  fresh.y = random(fresh.radius, Math.max(fresh.radius + 1, height - fresh.radius));
  fresh.orbitCenterX = fresh.x;
  fresh.orbitCenterY = fresh.y;
  fresh.alpha = 0;
  Object.assign(obj, fresh);
}

function keepInside(obj) {
  let bounced = false;

  if (obj.x - obj.radius < 0) {
    obj.x = obj.radius;
    obj.vx = Math.abs(obj.vx);
    bounced = true;
  } else if (obj.x + obj.radius > width) {
    obj.x = width - obj.radius;
    obj.vx = -Math.abs(obj.vx);
    bounced = true;
  }

  if (obj.y - obj.radius < 0) {
    obj.y = obj.radius;
    obj.vy = Math.abs(obj.vy);
    bounced = true;
  } else if (obj.y + obj.radius > height) {
    obj.y = height - obj.radius;
    obj.vy = -Math.abs(obj.vy);
    bounced = true;
  }

  if (bounced) {
    obj.hitCooldown = Math.max(obj.hitCooldown, 0.12);
  }
}

function updateObject(obj, dt, time) {
  obj.hitCooldown = Math.max(0, obj.hitCooldown - dt);
  obj.rotation += obj.rotationSpeed * dt;
  obj.wobble += dt * 2.2;

  if (obj.alpha < obj.targetAlpha) {
    obj.alpha = Math.min(obj.targetAlpha, obj.alpha + obj.fadeSpeed * dt);
  }

  if (obj.movement === "up" || obj.movement === "down" || obj.movement === "diagonal") {
    obj.x += obj.vx * dt;
    obj.y += obj.vy * dt;
  } else {
    obj.angle += obj.orbitSpeed * dt;
    obj.x = obj.orbitCenterX + Math.cos(obj.angle) * obj.orbitRadius;
    obj.y = obj.orbitCenterY + Math.sin(obj.angle) * obj.orbitRadius;
  }

  const margin = obj.radius + 5;
  if (obj.x < -margin || obj.x > width + margin || obj.y < -margin || obj.y > height + margin) {
    respawnObject(obj);
    return;
  }

  keepInside(obj);
}

function createImpact(x, y, power = 1) {
  impacts.push({
    x, y,
    age: 0,
    life: 0.34,
    radius: random(8, 15) * power,
    power,
    particles: Array.from({ length: 8 }, () => ({
      angle: random(0, Math.PI * 2),
      speed: random(35, 110) * power,
      size: random(1.2, 3.2)
    }))
  });
}

function resolveCollisions() {
  for (let i = 0; i < objects.length; i++) {
    for (let j = i + 1; j < objects.length; j++) {
      const a = objects[i];
      const b = objects[j];
      const dx = b.x - a.x;
      const dy = b.y - a.y;
      const distance = Math.hypot(dx, dy);
      const minDistance = a.radius + b.radius;

      if (distance < minDistance && a.hitCooldown <= 0 && b.hitCooldown <= 0) {
        const safeDistance = Math.max(distance, 0.001);
        const nx = dx / safeDistance;
        const ny = dy / safeDistance;
        const overlap = minDistance - safeDistance;

        a.x -= nx * overlap * 0.5;
        a.y -= ny * overlap * 0.5;
        b.x += nx * overlap * 0.5;
        b.y += ny * overlap * 0.5;

        const relativeVelocity = (a.vx - b.vx) * nx + (a.vy - b.vy) * ny;
        if (relativeVelocity > 0) {
          a.vx -= relativeVelocity * nx;
          a.vy -= relativeVelocity * ny;
          b.vx += relativeVelocity * nx;
          b.vy += relativeVelocity * ny;
        }

        if (a.movement === "circular") {
          a.vx += -ny * 22;
          a.vy += nx * 22;
          a.movement = "diagonal";
        }
        if (b.movement === "circular") {
          b.vx += ny * 22;
          b.vy += -nx * 22;
          b.movement = "diagonal";
        }

        a.hitCooldown = 0.22;
        b.hitCooldown = 0.22;
        createImpact((a.x + b.x) / 2, (a.y + b.y) / 2, random(0.8, 1.15));
      }
    }
  }
}

function drawGlassOrb(obj, palette) {
  const r = obj.radius;
  const gradient = ctx.createRadialGradient(
    obj.x - r * 0.35, obj.y - r * 0.42, r * 0.08,
    obj.x, obj.y, r * 1.2
  );
  gradient.addColorStop(0, palette.light);
  gradient.addColorStop(0.22, palette.main);
  gradient.addColorStop(0.68, palette.glow);
  gradient.addColorStop(1, "rgba(10,8,22,0.08)");

  ctx.save();
  ctx.globalAlpha = obj.alpha;
  ctx.shadowColor = palette.main;
  ctx.shadowBlur = 17;
  ctx.fillStyle = gradient;
  ctx.beginPath();
  ctx.arc(obj.x, obj.y, r, 0, Math.PI * 2);
  ctx.fill();
  ctx.shadowBlur = 0;
  ctx.strokeStyle = "rgba(255,255,255,0.72)";
  ctx.lineWidth = 1.1;
  ctx.beginPath();
  ctx.arc(obj.x, obj.y, r * 0.91, -2.6, 0.9);
  ctx.stroke();
  ctx.fillStyle = "rgba(255,255,255,0.8)";
  ctx.beginPath();
  ctx.ellipse(obj.x - r * 0.3, obj.y - r * 0.38, r * 0.22, r * 0.11, -0.65, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function drawBalloon(obj, palette) {
  const r = obj.radius;
  ctx.save();
  ctx.globalAlpha = obj.alpha;
  ctx.shadowColor = palette.main;
  ctx.shadowBlur = 20;
  const g = ctx.createRadialGradient(obj.x - r * .35, obj.y - r * .45, 1, obj.x, obj.y, r * 1.25);
  g.addColorStop(0, "#fff0f3");
  g.addColorStop(.18, "#ff6682");
  g.addColorStop(.62, palette.main);
  g.addColorStop(1, "#8e0d36");
  ctx.fillStyle = g;
  ctx.beginPath();
  ctx.ellipse(obj.x, obj.y, r * .78, r, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.shadowBlur = 0;
  ctx.fillStyle = "rgba(255,255,255,.8)";
  ctx.beginPath();
  ctx.ellipse(obj.x - r * .25, obj.y - r * .48, r * .19, r * .1, -.55, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = "rgba(255,215,225,.78)";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(obj.x, obj.y + r * .94);
  ctx.lineTo(obj.x + Math.sin(obj.wobble) * 5, obj.y + r * 1.45);
  ctx.stroke();
  ctx.restore();
}

function drawPumpkin(obj, palette) {
  const r = obj.radius;
  ctx.save();
  ctx.translate(obj.x, obj.y);
  ctx.rotate(Math.sin(obj.wobble) * .09);
  ctx.globalAlpha = obj.alpha;
  ctx.shadowColor = palette.main;
  ctx.shadowBlur = 17;
  const g = ctx.createRadialGradient(-r * .35, -r * .35, 1, 0, 0, r * 1.3);
  g.addColorStop(0, "#ffe5a1");
  g.addColorStop(.25, "#ffb24f");
  g.addColorStop(.75, palette.main);
  g.addColorStop(1, "#a64019");
  ctx.fillStyle = g;
  for (let i = -1; i <= 1; i++) {
    ctx.beginPath();
    ctx.ellipse(i * r * .27, 0, r * .39, r * .72, 0, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.shadowBlur = 0;
  ctx.fillStyle = "#8be08b";
  ctx.beginPath();
  ctx.ellipse(0, -r * .7, r * .13, r * .27, -.25, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#321126";
  ctx.beginPath();
  ctx.moveTo(-r * .48, -r * .12); ctx.lineTo(-r * .2, -r * .34); ctx.lineTo(-r * .12, -r * .02); ctx.closePath();
  ctx.moveTo(r * .48, -r * .12); ctx.lineTo(r * .2, -r * .34); ctx.lineTo(r * .12, -r * .02); ctx.closePath();
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(-r * .35, r * .2);
  ctx.quadraticCurveTo(0, r * .65, r * .35, r * .2);
  ctx.lineTo(r * .23, r * .42); ctx.lineTo(r * .1, r * .32); ctx.lineTo(0, r * .44); ctx.lineTo(-r * .1, r * .32); ctx.lineTo(-r * .23, r * .42);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

function drawGhost(obj, palette) {
  const r = obj.radius;
  ctx.save();
  ctx.globalAlpha = obj.alpha;
  ctx.translate(obj.x, obj.y + Math.sin(obj.wobble) * 2.5);
  ctx.shadowColor = palette.main;
  ctx.shadowBlur = 17;
  const g = ctx.createLinearGradient(-r, -r, r, r);
  g.addColorStop(0, "#fff7ff");
  g.addColorStop(.45, palette.main);
  g.addColorStop(1, "rgba(92,57,159,.5)");
  ctx.fillStyle = g;
  ctx.beginPath();
  ctx.moveTo(-r * .8, r * .65);
  ctx.lineTo(-r * .8, -r * .15);
  ctx.quadraticCurveTo(-r * .8, -r, 0, -r);
  ctx.quadraticCurveTo(r * .8, -r, r * .8, -r * .15);
  ctx.lineTo(r * .8, r * .65);
  ctx.lineTo(r * .4, r * .42);
  ctx.lineTo(0, r * .68);
  ctx.lineTo(-r * .4, r * .42);
  ctx.closePath();
  ctx.fill();
  ctx.shadowBlur = 0;
  ctx.fillStyle = "#20102d";
  ctx.beginPath();
  ctx.ellipse(-r * .28, -r * .1, r * .09, r * .15, 0, 0, Math.PI * 2);
  ctx.ellipse(r * .28, -r * .1, r * .09, r * .15, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function drawCandy(obj, palette) {
  const r = obj.radius;
  ctx.save();
  ctx.translate(obj.x, obj.y);
  ctx.rotate(obj.rotation);
  ctx.globalAlpha = obj.alpha;
  ctx.shadowColor = palette.main;
  ctx.shadowBlur = 15;
  ctx.fillStyle = palette.main;
  ctx.beginPath();
  ctx.moveTo(-r * .55, -r * .25);
  ctx.lineTo(-r, -r * .65);
  ctx.lineTo(-r * .94, 0);
  ctx.lineTo(-r, r * .65);
  ctx.lineTo(-r * .52, r * .25);
  ctx.quadraticCurveTo(0, r * .5, r * .52, r * .25);
  ctx.lineTo(r, r * .65);
  ctx.lineTo(r * .94, 0);
  ctx.lineTo(r, -r * .65);
  ctx.lineTo(r * .55, -r * .25);
  ctx.quadraticCurveTo(0, -r * .5, -r * .55, -r * .25);
  ctx.fill();
  ctx.shadowBlur = 0;
  ctx.strokeStyle = "rgba(255,255,255,.85)";
  ctx.lineWidth = 1.3;
  ctx.beginPath();
  ctx.moveTo(-r * .4, -r * .18);
  ctx.quadraticCurveTo(0, -r * .38, r * .4, -r * .18);
  ctx.stroke();
  ctx.restore();
}

function drawObject(obj) {
  const palette = PALETTE[obj.type];
  const image = OBJECT_IMAGES[obj.type];

  if (image && image.complete && image.naturalWidth > 0) {
    const bob = obj.type === "balloon" || obj.type === "ghost" ? Math.sin(obj.wobble) * 2.5 : 0;
    const imageWidth = obj.type === "balloon" ? obj.radius * 2.35 : obj.radius * 2.5;
    const imageHeight = obj.type === "balloon" ? obj.radius * 3.25 : obj.radius * 2.5;

    ctx.save();
    ctx.globalAlpha = obj.alpha;
    ctx.translate(obj.x, obj.y + bob);
    if (obj.type === "candy") ctx.rotate(obj.rotation);
    else if (obj.type === "pumpkin") ctx.rotate(Math.sin(obj.wobble) * 0.09);
    ctx.shadowColor = palette.main;
    ctx.shadowBlur = 13;
    ctx.drawImage(image, -imageWidth / 2, -imageHeight / 2, imageWidth, imageHeight);
    ctx.restore();
    return;
  }

  if (obj.type === "balloon") drawBalloon(obj, palette);
  else if (obj.type === "pumpkin") drawPumpkin(obj, palette);
  else if (obj.type === "ghost") drawGhost(obj, palette);
  else if (obj.type === "candy") drawCandy(obj, palette);
  else drawGlassOrb(obj, palette);
}

function drawBackground(time) {
  ctx.clearRect(0, 0, width, height);
  const bg = ctx.createLinearGradient(0, 0, width, height);
  bg.addColorStop(0, "#100c20");
  bg.addColorStop(.52, "#090a18");
  bg.addColorStop(1, "#160817");
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, width, height);

  if (backgroundImage.complete && backgroundImage.naturalWidth > 0) {
    const imageScale = Math.max(width / backgroundImage.naturalWidth, height / backgroundImage.naturalHeight);
    const imageWidth = backgroundImage.naturalWidth * imageScale;
    const imageHeight = backgroundImage.naturalHeight * imageScale;
    ctx.save();
    ctx.globalAlpha = 0.72;
    ctx.drawImage(backgroundImage, (width - imageWidth) / 2, (height - imageHeight) / 2, imageWidth, imageHeight);
    const shade = ctx.createLinearGradient(0, 0, 0, height);
    shade.addColorStop(0, "rgba(8,7,18,0.22)");
    shade.addColorStop(1, "rgba(8,7,18,0.58)");
    ctx.globalAlpha = 1;
    ctx.fillStyle = shade;
    ctx.fillRect(0, 0, width, height);
    ctx.restore();
  }

  const halos = [
    { x: width * .17, y: height * .23, r: Math.min(width, height) * .3, c: "rgba(104,52,160,0.12)" },
    { x: width * .82, y: height * .72, r: Math.min(width, height) * .32, c: "rgba(255,49,89,0.09)" },
    { x: width * (.5 + Math.sin(time * .0002) * .08), y: height * .45, r: Math.min(width, height) * .22, c: "rgba(54,124,164,0.06)" }
  ];
  for (const halo of halos) {
    const g = ctx.createRadialGradient(halo.x, halo.y, 0, halo.x, halo.y, halo.r);
    g.addColorStop(0, halo.c);
    g.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = g;
    ctx.fillRect(halo.x - halo.r, halo.y - halo.r, halo.r * 2, halo.r * 2);
  }

  ctx.fillStyle = "rgba(255,255,255,.25)";
  for (let i = 0; i < 38; i++) {
    const x = (i * 97.3 + 19) % width;
    const y = (i * 53.7 + 11) % height;
    const twinkle = .25 + (Math.sin(time * .0015 + i) + 1) * .22;
    ctx.globalAlpha = twinkle;
    ctx.fillRect(x, y, 1.2, 1.2);
  }
  ctx.globalAlpha = 1;
}

function updateImpacts(dt) {
  for (let i = impacts.length - 1; i >= 0; i--) {
    impacts[i].age += dt;
    if (impacts[i].age >= impacts[i].life) impacts.splice(i, 1);
  }
}

function drawImpacts() {
  for (const impact of impacts) {
    const progress = impact.age / impact.life;
    const alpha = 1 - progress;
    const radius = impact.radius + progress * 27;
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.strokeStyle = progress < .45 ? "#fff1f5" : "#ff4770";
    ctx.lineWidth = 2 * alpha;
    ctx.shadowColor = "#ff3159";
    ctx.shadowBlur = 16;
    ctx.beginPath();
    ctx.arc(impact.x, impact.y, radius, 0, Math.PI * 2);
    ctx.stroke();

    for (const particle of impact.particles) {
      const distance = particle.speed * impact.age;
      const px = impact.x + Math.cos(particle.angle) * distance;
      const py = impact.y + Math.sin(particle.angle) * distance;
      ctx.fillStyle = particle.size > 2.2 ? "#ffd9e2" : "#ff5479";
      ctx.beginPath();
      ctx.arc(px, py, particle.size * alpha, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }
}

function animate(timestamp) {
  const dt = Math.min((timestamp - (lastTime || timestamp)) / 1000, 0.033);
  lastTime = timestamp;

  drawBackground(timestamp);
  for (const obj of objects) updateObject(obj, dt, timestamp);
  resolveCollisions();
  for (const obj of objects) drawObject(obj);
  updateImpacts(dt);
  drawImpacts();

  requestAnimationFrame(animate);
}

function initialize() {
  resizeCanvas();
  objects.length = 0;
  for (let i = 0; i < TOTAL_OBJECTS; i++) {
    objects.push(createObject(true));
  }
  requestAnimationFrame(animate);
}

function getObjectAtPoint(mouseX, mouseY) {
  for (let i = objects.length - 1; i >= 0; i--) {
    const obj = objects[i];
    const dx = mouseX - obj.x;
    const dy = mouseY - obj.y;
    const hitRadius = obj.type === "balloon" ? obj.radius * 1.45 : obj.radius * 1.3;
    if (Math.hypot(dx, dy) <= hitRadius) return obj;
  }
  return null;
}

canvas.addEventListener("mousemove", (event) => {
  const rect = canvas.getBoundingClientRect();
  const mouseX = event.clientX - rect.left;
  const mouseY = event.clientY - rect.top;
  canvas.classList.toggle("is-target", Boolean(getObjectAtPoint(mouseX, mouseY)));
});

canvas.addEventListener("mouseleave", () => {
  canvas.classList.remove("is-target");
});

canvas.addEventListener("click", (event) => {
  const rect = canvas.getBoundingClientRect();
  const mouseX = event.clientX - rect.left;
  const mouseY = event.clientY - rect.top;
  const obj = getObjectAtPoint(mouseX, mouseY);
  if (obj) {
    clickedObjects += 1;
    if (clickCountElement) {
      clickCountElement.textContent = String(clickedObjects);
    }

    createImpact(obj.x, obj.y, 1.15);
    respawnClickedObject(obj);
  }
});

window.addEventListener("resize", resizeCanvas);
initialize();

const music = document.getElementById("backgroundMusic");
const musicToggle = document.getElementById("musicToggle");
if (music && musicToggle) {
  music.volume = 0.15;
  musicToggle.addEventListener("click", async () => {
    if (music.paused) {
      try {
        await music.play();
        musicToggle.textContent = "♫ SILENCIAR AMBIENTE";
        musicToggle.setAttribute("aria-pressed", "true");
      } catch (error) {
        musicToggle.textContent = "♫ INTENTAR DE NUEVO";
      }
    } else {
      music.pause();
      musicToggle.textContent = "♫ ACTIVAR AMBIENTE";
      musicToggle.setAttribute("aria-pressed", "false");
    }
  });
  
}