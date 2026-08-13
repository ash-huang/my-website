// js/quilt.js (Static Image)
(() => {
  const CONFIG = { cols: 7, rows: 7 };
  const totalFrames = CONFIG.cols * CONFIG.rows;
  let container, canvas, ctx, tileWidth, tileHeight, quiltImg;
  let currentFrame = Math.floor(totalFrames / 2);

  document.addEventListener('DOMContentLoaded', () => {
    container = document.getElementById('quiltImageContainer');
    canvas = document.getElementById('quiltImageCanvas');
    
    if (!container || !canvas) return;

    const quiltUrl = container.dataset.quilt;
    if (!quiltUrl) return;

    ctx = canvas.getContext('2d');

    quiltImg = new Image();
    quiltImg.crossOrigin = "Anonymous";
    quiltImg.src = quiltUrl;

    quiltImg.onload = () => {
      tileWidth = quiltImg.width / CONFIG.cols;
      tileHeight = quiltImg.height / CONFIG.rows;

      canvas.width = tileWidth;
      canvas.height = tileHeight;

      renderTile(currentFrame);
    };

    quiltImg.onerror = () => console.error("Failed to load quilt image at:", quiltUrl);

    container.addEventListener('mousemove', (e) => updateInput(e.clientX));
    container.addEventListener('touchmove', (e) => {
      if (e.touches.length > 0) updateInput(e.touches[0].clientX);
    });
  });

  function renderTile(frameIndex) {
    if (!tileWidth || !tileHeight || !ctx || !quiltImg) return;

    frameIndex = Math.max(0, Math.min(totalFrames - 1, frameIndex));

    const col = frameIndex % CONFIG.cols;
    const row = Math.floor(frameIndex / CONFIG.cols);
    const flippedRow = (CONFIG.rows - 1) - row;

    const sourceX = col * tileWidth;
    const sourceY = flippedRow * tileHeight;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(
      quiltImg,
      sourceX, sourceY, tileWidth, tileHeight,
      0, 0, canvas.width, canvas.height
    );
  }

  function updateInput(clientX) {
    const rect = container.getBoundingClientRect();
    const normalizedX = (clientX - rect.left) / rect.width;
    const clampedX = Math.max(0, Math.min(1, normalizedX));

    const newFrame = Math.floor(clampedX * (totalFrames - 1));
    if (newFrame !== currentFrame) {
      currentFrame = newFrame;
      renderTile(currentFrame);
    }
  }
})();