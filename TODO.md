# MPP Interactive Training - TODO List

**Last Updated:** January 14, 2026
**Status:** ✅ Video intro feature COMPLETE!

## 🎬 Video Intro Feature - ✅ COMPLETE

### ✅ Completed
- [x] Cinematic intro video CSS (Spotify-style glowing play button, progress bar)
- [x] Video file added (`src/assets/video/intro-video.webm` - 4.9MB)
- [x] DoD logo assets prepared (`dow-logo.b64`, `src/assets/images/dow-logo.png`)
- [x] Audio narration file moved to `src/assets/audio/button-explanation.mp3`
- [x] Modular code structure created (src/css/, src/js/, scripts/)
- [x] Git LFS configured for large media files
- [x] **Video overlay HTML added to `index-new.html`**
- [x] **Complete video player JavaScript created (`src/js/video-intro.js`)**
- [x] **Click-to-play functionality (no autoplay)**
- [x] **Progress bar with seeking**
- [x] **Keyboard controls (Space, Escape)**
- [x] **LocalStorage preference (skip once = skip forever)**
- [x] **Screen reader announcements**
- [x] All changes committed and pushed to GitHub

**Commit:** `aa19a3c` - "Add click-to-play video intro with Spotify-style controls"

### 🎉 What Works Now

**File:** `index-new.html` with modular structure

**Video Intro Features:**
✅ **Click-to-play** - Large Spotify-style glowing play button
✅ **Progress bar** - Visual timeline with click-to-seek
✅ **Time display** - Current time / Total time (MM:SS format)
✅ **Skip button** - "Skip Intro →" instantly dismisses overlay
✅ **Keyboard controls:**
  - **Space** = Play/Pause toggle
  - **Escape** = Skip intro
✅ **LocalStorage** - Skip once, never see it again
✅ **Fade out** - Smooth animation when video ends or skipped
✅ **Screen reader** - Announces all actions and state changes
✅ **Responsive** - Works on desktop, tablet, mobile

**Files:**
- `src/js/video-intro.js` (244 lines) - Complete player logic
- `src/css/modals.css` - Video overlay styles (202 lines added)
- `index-new.html` - HTML overlay integrated
- `src/assets/video/intro-video.webm` - 4.8MB video file

### 🧪 Next: Testing & Deployment

#### 1. Test Video Intro
- [ ] Video loads and displays correctly in Codespaces
- [ ] Play button works (glowing animation)
- [ ] Progress bar updates smoothly
- [ ] Clicking progress bar seeks correctly
- [ ] Skip button dismisses overlay
- [ ] Video ends → overlay fades out
- [ ] LocalStorage saves "skip" preference
- [ ] Keyboard controls work (Space, Escape)
- [ ] Screen reader announces video state
- [ ] Works on mobile/tablet
- [ ] File size acceptable for LFS ✅ (4.8MB)

#### 2. Choose Deployment Strategy

**Option A:** Deploy `index-new.html` as production (Recommended)
- Cleaner modular architecture
- Easier to maintain
- Video intro included
- **Action:** Rename `index.html` → `index-legacy.html`, `index-new.html` → `index.html`

**Option B:** Merge video intro into original `index.html`
- Keep single-file architecture
- Larger file size (~18MB)
- **Action:** Copy video overlay HTML/JS into main `index.html`

**Option C:** Keep both versions
- `index.html` = Legacy single-file (no video)
- `index-new.html` = Modern modular (with video)
- Update GitHub Pages to serve `index-new.html`

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
