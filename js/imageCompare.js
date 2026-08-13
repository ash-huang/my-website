document.addEventListener('DOMContentLoaded', () => {
  const sliders = document.querySelectorAll('.image-comparison');

  sliders.forEach((container) => {
    const imageClip = container.querySelector('.image-clip');
    const handle = container.querySelector('.comparison-handle');

    if (!imageClip || !handle) return;

    function updateSlider(clientX) {
      const rect = container.getBoundingClientRect();
      const offsetX = clientX - rect.left;
      
      let percentage = (offsetX / rect.width) * 100;
      percentage = Math.max(0, Math.min(100, percentage));
      
      imageClip.style.clipPath = `polygon(0 0, ${percentage}% 0, ${percentage}% 100%, 0 100%)`;
      handle.style.left = `${percentage}%`;
    }

    container.addEventListener('mousemove', (e) => {
      updateSlider(e.clientX);
    });

    container.addEventListener('touchmove', (e) => {
      if (e.touches.length > 0) {
        updateSlider(e.touches[0].clientX);
      }
    }, { passive: true });
  });
});