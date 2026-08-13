// js/quilt-mp4.js (Viewport-Aware Low-CPU Animated MP4 Quilt)
(() => {
  const CONFIG = {
    cols: 7,
    rows: 7
  };

  const totalFrames = CONFIG.cols * CONFIG.rows;
  let container, canvas, ctx, video;
  let tileWidth = 0;
  let tileHeight = 0;
  let currentTileIndex = Math.floor(totalFrames / 2);
  let cachedRect = null;
  let animationFrameId = null;
  let isVideoCallbackActive = false;
  let isInView = false;

  document.addEventListener('DOMContentLoaded', () => {
    container = document.getElementById('quiltVideoContainer');
    canvas = document.getElementById('quiltVideoCanvas');
    video = document.getElementById('quiltVideo');

    if (!container || !canvas || !video) return;

    // 1. Disable alpha channel transparency calculations for performance
    ctx = canvas.getContext('2d', { alpha: false });

    function initCanvas() {
      if (!video.videoWidth || !video.videoHeight) return;

      tileWidth = video.videoWidth / CONFIG.cols;
      tileHeight = video.videoHeight / CONFIG.rows;

      const dpr = window.devicePixelRatio || 1;
      canvas.width = tileWidth * dpr;
      canvas.height = tileHeight * dpr;

      ctx.scale(dpr, dpr);
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';

      updateCachedRect();
      setupIntersectionObserver();
    }

    if (video.readyState >= 1) {
      initCanvas();
    } else {
      video.addEventListener('loadedmetadata', initCanvas);
    }

    // Cache bounding box on enter/resize to eliminate layout thrashing
    function updateCachedRect() {
      if (container) cachedRect = container.getBoundingClientRect();
    }

    container.addEventListener('mouseenter', updateCachedRect);
    window.addEventListener('resize', updateCachedRect);

    // Scrubbing input listeners
    container.addEventListener('mousemove', (e) => updateAngleInput(e.clientX));
    container.addEventListener('touchmove', (e) => {
      if (e.touches.length > 0) updateAngleInput(e.touches[0].clientX);
    }, { passive: true });

    // Pause rendering when user switches browser tabs
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        stopLoop();
      } else if (isInView) {
        startLoop();
      }
    });
  });

  // 2. INTERSECTION OBSERVER: Pause/resume based on scroll visibility
  function setupIntersectionObserver() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        isInView = entry.isIntersecting;
        if (isInView) {
          startLoop();
        } else {
          stopLoop();
        }
      });
    }, {
      root: null, // Default: browser viewport
      threshold: 0.1 // Triggers as soon as 10% of the container is visible
    });

    observer.observe(container);
  }

  function startLoop() {
    video.play().catch(err => console.warn("Autoplay blocked:", err));

    if (isVideoCallbackActive) return;
    isVideoCallbackActive = true;

    if ('requestVideoFrameCallback' in HTMLVideoElement.prototype) {
      const onVideoFrame = () => {
        if (isInView && !document.hidden && !video.paused && !video.ended) {
          drawTile(currentTileIndex);
          video.requestVideoFrameCallback(onVideoFrame);
        } else {
          isVideoCallbackActive = false;
        }
      };
      video.requestVideoFrameCallback(onVideoFrame);
    } else {
      const fallbackLoop = () => {
        if (isInView && !document.hidden && !video.paused && !video.ended) {
          drawTile(currentTileIndex);
          animationFrameId = requestAnimationFrame(fallbackLoop);
        } else {
          isVideoCallbackActive = false;
        }
      };
      fallbackLoop();
    }
  }

  function stopLoop() {
    isVideoCallbackActive = false;
    if (animationFrameId) {
      cancelAnimationFrame(animationFrameId);
      animationFrameId = null;
    }
    video.pause();
  }

  function drawTile(tileIndex) {
    tileIndex = Math.max(0, Math.min(totalFrames - 1, tileIndex));

    const col = tileIndex % CONFIG.cols;
    const row = Math.floor(tileIndex / CONFIG.cols);
    const flippedRow = (CONFIG.rows - 1) - row;

    const sourceX = col * tileWidth;
    const sourceY = flippedRow * tileHeight;

    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    ctx.drawImage(
      video,
      sourceX, sourceY, tileWidth, tileHeight,
      0, 0, tileWidth, tileHeight
    );
  }

  function updateAngleInput(clientX) {
    if (!cachedRect) cachedRect = container.getBoundingClientRect();
    const normalizedX = (clientX - cachedRect.left) / cachedRect.width;
    const clampedX = Math.max(0, Math.min(1, normalizedX));

    currentTileIndex = Math.floor(clampedX * (totalFrames - 1));
  }
})();