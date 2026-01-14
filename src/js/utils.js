// Utility Functions
// Helper functions for scroll management, panel control, etc.

let scrollLocked = false;
let programmaticScroll = false;

// Lock scrolling (prevents user scroll but allows programmatic)
export function lockScroll() {
  scrollLocked = true;
  document.body.classList.add('scroll-locked');
}

// Unlock scrolling
export function unlockScroll() {
  scrollLocked = false;
  document.body.classList.remove('scroll-locked');
}

// Programmatically scroll to an element
export function scrollToElement(element) {
  if (!element) return;
  programmaticScroll = true;

  element.scrollIntoView({
    behavior: 'smooth',
    block: 'center'
  });

  setTimeout(() => {
    programmaticScroll = false;
  }, 1000);
}

// Hide training control panel
export function hidePanel() {
  const panel = document.getElementById('training-controls');
  const showBtn = document.getElementById('show-training-btn');
  if (panel) panel.classList.add('hidden');
  if (showBtn) showBtn.classList.add('visible');
}

// Show training control panel
export function showPanel() {
  const panel = document.getElementById('training-controls');
  const showBtn = document.getElementById('show-training-btn');
  if (panel) panel.classList.remove('hidden');
  if (showBtn) showBtn.classList.remove('visible');
}

// Show control panel with animation
export function showControlPanelWithAnimation() {
  const panel = document.getElementById('training-controls');
  if (!panel) return;

  // Start off-screen
  panel.style.transform = 'translateX(400px)';
  panel.style.opacity = '0';

  // Trigger animation
  setTimeout(() => {
    panel.style.transition = 'transform 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55), opacity 0.5s ease';
    panel.style.transform = 'translateX(0)';
    panel.style.opacity = '1';
  }, 100);
}

// Format time for audio player (seconds to MM:SS)
export function formatTime(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
}
