import * as THREE from 'three';

// Procedural Canvas Texture Generator
// Produces detailed realistic surface maps without requiring external image downloads

export function createGasGiantTexture(primaryColor: string, secondaryColor: string): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;

  // Base background
  ctx.fillStyle = primaryColor;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Atmospheric horizontal bands with noise
  const bandCount = 28;
  for (let i = 0; i < bandCount; i++) {
    const y = (i / bandCount) * canvas.height;
    const bandHeight = (canvas.height / bandCount) * (0.8 + Math.random() * 0.4);
    
    ctx.fillStyle = i % 2 === 0 ? secondaryColor : primaryColor;
    ctx.globalAlpha = 0.35 + Math.random() * 0.45;
    ctx.fillRect(0, y, canvas.width, bandHeight);

    // Turbulence / storm eddies
    for (let j = 0; j < 6; j++) {
      const cx = Math.random() * canvas.width;
      const cy = y + Math.random() * bandHeight;
      const radius = 10 + Math.random() * 30;

      const grad = ctx.createRadialGradient(cx, cy, 2, cx, cy, radius);
      grad.addColorStop(0, 'rgba(255,255,255,0.4)');
      grad.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(cx, cy, radius, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // Giant storm vortex (like Jupiter's red spot)
  const spotX = canvas.width * 0.65;
  const spotY = canvas.height * 0.6;
  const spotGrad = ctx.createRadialGradient(spotX, spotY, 5, spotX, spotY, 55);
  spotGrad.addColorStop(0, 'rgba(255,255,255,0.7)');
  spotGrad.addColorStop(0.6, primaryColor);
  spotGrad.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = spotGrad;
  ctx.beginPath();
  ctx.ellipse(spotX, spotY, 55, 30, 0.1, 0, Math.PI * 2);
  ctx.fill();

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  return texture;
}

export function createNeuralTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;

  // Deep indigo void
  ctx.fillStyle = '#0f0728';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Synaptic grid lines
  ctx.strokeStyle = 'rgba(168, 85, 247, 0.25)';
  ctx.lineWidth = 1.5;
  const gridSize = 32;

  for (let x = 0; x < canvas.width; x += gridSize) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, canvas.height);
    ctx.stroke();
  }
  for (let y = 0; y < canvas.height; y += gridSize) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(canvas.width, y);
    ctx.stroke();
  }

  // Neural tensor nodes & synaptic interlinks
  const nodeCount = 90;
  const nodes: { x: number; y: number }[] = [];

  for (let i = 0; i < nodeCount; i++) {
    nodes.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
    });
  }

  // Draw synapses between nearby nodes
  ctx.strokeStyle = 'rgba(192, 132, 252, 0.4)';
  ctx.lineWidth = 1;
  nodes.forEach((n1, i) => {
    nodes.slice(i + 1).forEach((n2) => {
      const dist = Math.hypot(n1.x - n2.x, n1.y - n2.y);
      if (dist < 85) {
        ctx.beginPath();
        ctx.moveTo(n1.x, n1.y);
        ctx.lineTo(n2.x, n2.y);
        ctx.stroke();
      }
    });
  });

  // Draw glowing nodes
  nodes.forEach((node) => {
    const grad = ctx.createRadialGradient(node.x, node.y, 1, node.x, node.y, 8);
    grad.addColorStop(0, '#ffffff');
    grad.addColorStop(0.3, '#c084fc');
    grad.addColorStop(1, 'rgba(168, 85, 247, 0)');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(node.x, node.y, 8, 0, Math.PI * 2);
    ctx.fill();
  });

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  return texture;
}

export function createLavaCrustTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;

  // Obsidian dark rock
  ctx.fillStyle = '#0a0a0c';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Molten magma fissures
  ctx.strokeStyle = '#f59e0b';
  ctx.shadowColor = '#fbbf24';
  ctx.shadowBlur = 10;
  ctx.lineWidth = 2.5;

  const fissureCount = 20;
  for (let i = 0; i < fissureCount; i++) {
    let x = Math.random() * canvas.width;
    let y = Math.random() * canvas.height;

    ctx.beginPath();
    ctx.moveTo(x, y);

    const steps = 15 + Math.floor(Math.random() * 20);
    for (let s = 0; s < steps; s++) {
      x += (Math.random() - 0.5) * 40;
      y += (Math.random() - 0.5) * 30;
      ctx.lineTo(x, y);
    }
    ctx.stroke();
  }

  // Reset shadow
  ctx.shadowBlur = 0;

  // Add crater roughness dots
  ctx.fillStyle = 'rgba(245, 158, 11, 0.15)';
  for (let i = 0; i < 400; i++) {
    const cx = Math.random() * canvas.width;
    const cy = Math.random() * canvas.height;
    const r = 1 + Math.random() * 4;
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.fill();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  return texture;
}

export function createCrystallineTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;

  // Deep rose prism base
  ctx.fillStyle = '#260416';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Geometric crystal facet triangles
  const cols = 20;
  const rows = 12;
  const cellW = canvas.width / cols;
  const cellH = canvas.height / rows;

  for (let c = 0; c < cols; c++) {
    for (let r = 0; r < rows; r++) {
      const x = c * cellW;
      const y = r * cellH;

      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x + cellW, y);
      ctx.lineTo(x + cellW / 2, y + cellH);
      ctx.closePath();

      const lum = 15 + Math.random() * 45;
      ctx.fillStyle = `hsl(${320 + Math.random() * 30}, 85%, ${lum}%)`;
      ctx.fill();
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
      ctx.lineWidth = 0.8;
      ctx.stroke();
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  return texture;
}

export function createHexShieldTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;

  // Dark alloy titanium base
  ctx.fillStyle = '#061a14';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Hexagonal grid
  const hexRadius = 18;
  const hexH = hexRadius * Math.sqrt(3);
  const hexW = hexRadius * 2;

  ctx.strokeStyle = '#10b981';
  ctx.lineWidth = 1;

  for (let y = 0; y < canvas.height + hexH; y += hexH) {
    let col = 0;
    for (let x = 0; x < canvas.width + hexW; x += hexW * 0.75) {
      const cy = y + (col % 2 === 0 ? 0 : hexH / 2);

      ctx.beginPath();
      for (let side = 0; side < 6; side++) {
        const angle = (side * Math.PI) / 3;
        const px = x + hexRadius * Math.cos(angle);
        const py = cy + hexRadius * Math.sin(angle);
        if (side === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.closePath();
      ctx.globalAlpha = 0.2 + Math.random() * 0.4;
      ctx.stroke();

      col++;
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  return texture;
}

export function createSunTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;

  // Golden core
  ctx.fillStyle = '#ff8800';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Granular convection cells
  for (let i = 0; i < 600; i++) {
    const x = Math.random() * canvas.width;
    const y = Math.random() * canvas.height;
    const r = 4 + Math.random() * 20;

    const grad = ctx.createRadialGradient(x, y, 1, x, y, r);
    grad.addColorStop(0, '#fff4cc');
    grad.addColorStop(0.5, '#ffa200');
    grad.addColorStop(1, 'rgba(255, 60, 0, 0)');

    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  return texture;
}
