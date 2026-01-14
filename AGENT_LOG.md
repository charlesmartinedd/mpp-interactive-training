### 2026-01-14 14:57:11 — Codex (GPT)
**Task**: Redesign welcome modal audio layout and styling
**Changes**:
- Moved welcome narration controls to a bottom “audio dock” with a cleaner outlined look and SVG icons.
- Updated welcome modal JS to use class toggles for play/pause + mute, and applied modal custom classes.
- Synced changes across `index.html`, `index-legacy.html`, and `src/js/main.js`.

**Commit**: `feat: redesign welcome narration modal`
**Status**: ✅ Pushed

---

### 2026-01-14 15:01:16 — Codex (GPT)
**Task**: Apply redesigned modal styling to welcome modal
**Changes**:
- Updated welcome modal to use the gold outline popup class (matches redesigned modal style).

**Commit**: style: apply gold outline to welcome modal
**Status**: ✅ Pushed

---
### 2026-01-14 15:12:39 — Codex (GPT)
**Task**: Fix welcome modal not closing on Start Training
**Changes**:
- Added preConfirm + guarded .then() so clicking "Start Training" reliably closes the modal, marks training started, and shows the control panel.

**Commit**: ix: close welcome modal on start
**Status**: ✅ Pushed

---
