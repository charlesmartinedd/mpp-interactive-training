# MPP Interactive Training - TODO List

**Last Updated:** January 14, 2026
**Status:** Video intro refactoring in progress

## 🎬 Video Intro Feature - IN PROGRESS

### ✅ Completed
- [x] Cinematic intro video CSS (Spotify-style glowing play button, progress bar)
- [x] Video file added (`src/assets/video/intro-video.webm` - 4.9MB)
- [x] DoD logo assets prepared (`dow-logo.b64`, `src/assets/images/dow-logo.png`)
- [x] Audio narration file moved to `src/assets/audio/button-explanation.mp3`
- [x] Modular code structure created (src/css/, src/js/, scripts/)
- [x] Git LFS configured for large media files
- [x] All changes committed and pushed to GitHub

### 🚧 Next Steps (To Complete Video Intro)

#### 1. Add Video Overlay HTML
**File:** `index.html` or `index-new.html`
**Location:** Right after opening `<body>` tag (around line 765)

```html
<!-- Video Intro Overlay -->
<div id="video-intro-overlay" class="video-overlay active">
  <div class="video-container">
    <video id="intro-video" preload="auto">
      <source src="src/assets/video/intro-video.webm" type="video/webm">
      Your browser does not support the video tag.
    </video>

    <div class="video-controls">
      <!-- Spotify-style circular play button -->
      <button id="play-btn" class="play-circle" aria-label="Play introduction video">
        <div class="play-icon"></div>
      </button>

      <!-- Progress bar -->
      <div class="video-progress-bar">
        <div id="video-progress" class="video-progress-fill"></div>
      </div>

      <!-- Time display -->
      <div class="video-time">
        <span id="current-time">0:00</span> / <span id="total-time">0:00</span>
      </div>

      <!-- Skip button -->
      <button id="skip-intro" class="skip-btn">Skip Intro →</button>
    </div>
  </div>
</div>
```

#### 2. Create Video Player JavaScript
**File:** `src/js/video-intro.js` (new file)

**Features to implement:**
- Auto-play on page load (or show play button if autoplay blocked)
- Play/pause toggle on button click
- Progress bar updates as video plays
- Click progress bar to seek
- Time display (current/total)
- Skip button to dismiss overlay
- Fade out overlay when video ends
- Remember user preference (don't show again if skipped)
- Keyboard controls (Space = play/pause, Escape = skip)
- Accessibility announcements

**Core Functions:**
```javascript
- initVideoIntro()
- playVideo()
- pauseVideo()
- updateProgress()
- seekVideo(time)
- skipIntro()
- endIntro()
- savePreference()
```

#### 3. Link JavaScript Module
**File:** `index-new.html` (or create it from scratch)

Add to `<head>`:
```html
<script src="src/js/video-intro.js" defer></script>
```

Or if staying with inline, add to bottom of main script block.

#### 4. Test Video Intro
- [ ] Video loads and displays correctly
- [ ] Play button works (glowing animation)
- [ ] Progress bar updates smoothly
- [ ] Clicking progress bar seeks correctly
- [ ] Skip button dismisses overlay
- [ ] Video ends → overlay fades out
- [ ] LocalStorage saves "skip" preference
- [ ] Keyboard controls work (Space, Escape)
- [ ] Screen reader announces video state
- [ ] Works on mobile/tablet
- [ ] File size acceptable for LFS

#### 5. Decide on Architecture
**Option A:** Keep `index.html` as single-file (current production version)
**Option B:** Use `index-new.html` with modular imports (requires testing)

If Option B:
- [ ] Complete `index-new.html` with all `<link>` and `<script>` tags
- [ ] Test all features work with external files
- [ ] Update GitHub Pages to use new version
- [ ] Archive old `index.html` as `index-legacy.html`

## 📋 Other Features - BACKLOG

### Future Enhancements
- [ ] Add Spanish language toggle (EN/ES)
- [ ] Add certificate download as PDF (not just screenshot)
- [ ] Add progress export (JSON download)
- [ ] Add admin mode to customize quiz questions
- [ ] Add analytics tracking (optional, privacy-respecting)
- [ ] Add more quiz questions (10+ question bank)
- [ ] Add video captions/subtitles for accessibility
- [ ] Add "Resources" section with downloadable PDFs
- [ ] Mobile app wrapper (React Native or PWA)

### Code Quality
- [ ] Add JSDoc comments to all functions
- [ ] Add unit tests (Jest)
- [ ] Add E2E tests (Playwright)
- [ ] Optimize bundle size (tree-shaking, minification)
- [ ] Add linting (ESLint)
- [ ] Add TypeScript types
- [ ] Add build process (Vite or Rollup)

## 🚀 How to Continue in Codespaces

1. Open repo in GitHub Codespaces: https://github.com/charlesmartinedd/mpp-interactive-training
2. Open terminal and run:
   ```bash
   npm init -y  # If you want to add build tools
   # OR
   python -m http.server 8000  # Simple dev server
   ```
3. Open `index.html` in browser or preview
4. Edit files in `src/` directory
5. Test changes locally before committing

## 📁 Current File Structure

```
mpp-interactive-training/
├── index.html                  # Production version (13MB, complete)
├── index-new.html              # WIP modular version (12MB)
├── README.md                   # Documentation
├── TODO.md                     # This file
├── dow-logo.b64                # DoD logo base64 (legacy)
├── .gitattributes              # Git LFS config
├── scripts/
│   └── extract-inline.js       # Code extraction utility
└── src/
    ├── assets/
    │   ├── audio/
    │   │   └── button-explanation.mp3
    │   ├── images/
    │   │   └── dow-logo.png
    │   └── video/
    │       └── intro-video.webm    # 4.9MB - tracked by LFS
    ├── css/
    │   ├── _full-css-backup.css    # Complete extracted CSS
    │   ├── base.css
    │   ├── hotspots.css
    │   ├── main.css                # Imports all modules
    │   ├── modals.css
    │   ├── tour.css
    │   └── training-controls.css
    └── js/
        ├── _full-script-backup.js  # Complete extracted JS
        ├── main.js
        ├── state.js
        └── utils.js
```

## 🎯 Priority Tasks (Top 3)

1. **Add video overlay HTML** to body (5 minutes)
2. **Create video-intro.js** with player controls (30 minutes)
3. **Test video intro thoroughly** (15 minutes)

**Estimated Time to Complete Video Intro:** ~1 hour

---

## 📞 Questions/Decisions Needed

1. Should we use modular `index-new.html` or keep single-file `index.html`?
2. Should video autoplay or require user click? (Accessibility consideration)
3. Should we add video captions/subtitles now or later?
4. Maximum file size acceptable for LFS? (Currently 4.9MB video)
5. Should "skip" preference persist forever or expire after 30 days?

---

**Ready to continue?** Open in Codespaces and start with step 1: Add video overlay HTML! 🚀
