/**
 * Video Intro Player
 * Cinematic introduction video with Spotify-style controls
 * Click-to-play (no autoplay)
 */

(function() {
  'use strict';

  // Constants
  const SKIP_PREFERENCE_KEY = 'mpp-video-intro-skipped';

  // Elements
  let overlay, video, playBtn, progressBar, progressFill, currentTimeEl, totalTimeEl, skipBtn;

  // State
  let isPlaying = false;

  /**
   * Initialize the video intro
   */
  function initVideoIntro() {
    // Get DOM elements
    overlay = document.getElementById('video-intro-overlay');
    video = document.getElementById('intro-video');
    playBtn = document.getElementById('play-btn');
    progressBar = document.querySelector('.video-progress-bar');
    progressFill = document.getElementById('video-progress');
    currentTimeEl = document.getElementById('current-time');
    totalTimeEl = document.getElementById('total-time');
    skipBtn = document.getElementById('skip-intro');

    // Check if user has previously skipped
    if (localStorage.getItem(SKIP_PREFERENCE_KEY)) {
      endIntro();
      return;
    }

    // Make sure overlay is visible
    if (overlay) {
      overlay.classList.add('active');
    }

    // Set up event listeners
    setupEventListeners();

    // Update total time when metadata loads
    video.addEventListener('loadedmetadata', function() {
      totalTimeEl.textContent = formatTime(video.duration);
    });

    // Announce to screen readers
    announceToScreenReader('Introduction video ready. Press space or click play button to begin.');
  }

  /**
   * Set up all event listeners
   */
  function setupEventListeners() {
    // Play button
    playBtn.addEventListener('click', togglePlayPause);

    // Video events
    video.addEventListener('timeupdate', updateProgress);
    video.addEventListener('ended', handleVideoEnd);
    video.addEventListener('play', function() {
      isPlaying = true;
      playBtn.classList.add('playing');
      announceToScreenReader('Video playing');
    });
    video.addEventListener('pause', function() {
      isPlaying = false;
      playBtn.classList.remove('playing');
      announceToScreenReader('Video paused');
    });

    // Progress bar seeking
    progressBar.addEventListener('click', seekVideo);

    // Skip button
    skipBtn.addEventListener('click', skipIntro);

    // Keyboard controls
    document.addEventListener('keydown', handleKeyboard);
  }

  /**
   * Toggle play/pause
   */
  function togglePlayPause() {
    if (isPlaying) {
      pauseVideo();
    } else {
      playVideo();
    }
  }

  /**
   * Play the video
   */
  function playVideo() {
    video.play().catch(function(error) {
      console.error('Error playing video:', error);
      announceToScreenReader('Error playing video. Please try again.');
    });
  }

  /**
   * Pause the video
   */
  function pauseVideo() {
    video.pause();
  }

  /**
   * Update progress bar and time display
   */
  function updateProgress() {
    if (!video.duration) return;

    const percent = (video.currentTime / video.duration) * 100;
    progressFill.style.width = percent + '%';
    currentTimeEl.textContent = formatTime(video.currentTime);
  }

  /**
   * Seek to a position in the video by clicking the progress bar
   */
  function seekVideo(e) {
    if (!video.duration) return;

    const rect = progressBar.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const percent = clickX / rect.width;
    const newTime = percent * video.duration;

    video.currentTime = newTime;
    announceToScreenReader('Seeking to ' + formatTime(newTime));
  }

  /**
   * Handle video end
   */
  function handleVideoEnd() {
    announceToScreenReader('Video complete');
    setTimeout(endIntro, 500); // Small delay before fading out
  }

  /**
   * Skip the intro
   */
  function skipIntro() {
    savePreference();
    announceToScreenReader('Skipping introduction');
    endIntro();
  }

  /**
   * End the intro and hide overlay
   */
  function endIntro() {
    if (overlay) {
      overlay.classList.remove('active');
      overlay.classList.add('fade-out');

      // Remove from DOM after animation
      setTimeout(function() {
        if (overlay && overlay.parentNode) {
          overlay.parentNode.removeChild(overlay);
        }
      }, 500);
    }

    // Clean up event listeners
    document.removeEventListener('keydown', handleKeyboard);
  }

  /**
   * Save user preference to skip intro
   */
  function savePreference() {
    try {
      localStorage.setItem(SKIP_PREFERENCE_KEY, 'true');
    } catch (e) {
      console.warn('Could not save preference to localStorage:', e);
    }
  }

  /**
   * Handle keyboard controls
   */
  function handleKeyboard(e) {
    // Only handle if overlay is visible
    if (!overlay || !overlay.classList.contains('active')) return;

    switch(e.key) {
      case ' ':
      case 'Spacebar': // For older browsers
        e.preventDefault();
        togglePlayPause();
        break;
      case 'Escape':
        e.preventDefault();
        skipIntro();
        break;
    }
  }

  /**
   * Format time in MM:SS format
   */
  function formatTime(seconds) {
    if (isNaN(seconds) || seconds === Infinity) return '0:00';

    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return mins + ':' + (secs < 10 ? '0' : '') + secs;
  }

  /**
   * Announce to screen readers
   */
  function announceToScreenReader(message) {
    const announcement = document.createElement('div');
    announcement.setAttribute('role', 'status');
    announcement.setAttribute('aria-live', 'polite');
    announcement.className = 'sr-only';
    announcement.textContent = message;

    document.body.appendChild(announcement);

    setTimeout(function() {
      document.body.removeChild(announcement);
    }, 1000);
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initVideoIntro);
  } else {
    initVideoIntro();
  }

})();
