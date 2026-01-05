# MPP Interactive Training

> **Best-in-class interactive eLearning for the DoD Mentor-Protégé Program**

An engaging, accessible, standalone training solution that transforms the MPP portal into an interactive learning experience.

## 🎓 Live Demo

**[Launch Training →](https://charlesmartinedd.github.io/mpp-interactive-training/)**

## ✨ Features

### 1. **Guided Tour** (Shepherd.js)
- 8-step interactive walkthrough of the entire MPP portal
- Highlights key sections with explanatory popovers
- Previous/Next navigation with progress tracking

### 2. **Interactive Hotspots** (7 locations)
- Pulsing markers on important areas
- Click to reveal detailed information
- Tracks exploration progress

**Hotspot Locations:**
- Dashboard Login Button
- Mentor Benefits Section
- Protégé Benefits Section
- Prime Contractor Logos
- MPP Summit Information
- Contact Form
- Resource Links

### 3. **Form Simulation**
- Practice completing the contact form
- Real-time validation
- Safe practice environment (no actual submission)
- Input sanitization with DOMPurify

### 4. **Knowledge Check Quiz**
- 5 multiple-choice questions
- Instant feedback
- Score display with percentage
- Passing threshold: 70%

### 5. **Progress Tracking**
- Visual progress bar
- LocalStorage persistence
- Resume capability
- Tracks: Tour, Hotspots (5+), Form, Quiz

### 6. **Training Controls Panel**
Fixed bottom-right panel:
- ▶️ Start Guided Tour
- 📍 Show/Hide Hotspots
- 📝 Practice Form
- ✅ Take Quiz
- 🔄 Reset Progress

### 7. **Completion Certificate**
- Awarded when all sections completed
- Shows completion date
- Screenshot-ready

## ♿ Section 508 Accessibility

### Keyboard Navigation
- **Tab** - Navigate elements
- **Enter/Space** - Activate buttons
- **Escape** - Close modals
- **T** - Quick-start tour
- **H** - Toggle hotspots

### Screen Reader Support
- ARIA labels on all interactive elements
- Tour announcements
- Modal focus trapping
- Semantic HTML structure

### Visual Accessibility
- 4.5:1 color contrast ratio
- Visible focus indicators
- Color-independent information
- Consistent MPP branding

## 🚀 Usage

### Direct Use
Simply open `index.html` in any modern browser. No server required!

### Embed in LMS
Upload `index.html` as HTML package content. Compatible with most LMS platforms.

### Share via URL
Use the GitHub Pages link: https://charlesmartinedd.github.io/mpp-interactive-training/

## 📊 Training Flow

1. **Welcome Modal** (auto-appears on first visit)
2. **Guided Tour** (15-20 minutes)
3. **Explore Hotspots** (5-10 minutes)
4. **Practice Form** (5 minutes)
5. **Take Quiz** (5-10 minutes)
6. **Receive Certificate** 🎉

**Total Time:** 30-45 minutes

## 🔧 Technical Stack

### Libraries (CDN)
- **Shepherd.js** (11.2.0) - Guided tours
- **Floating UI** (1.5.3) - Tooltip positioning
- **SweetAlert2** (11) - Beautiful modals
- **DOMPurify** (3.0.6) - Input sanitization

### Browser Requirements
- Chrome 90+, Edge 90+, Firefox 88+, Safari 14+
- JavaScript enabled
- LocalStorage enabled
- 1024px+ width recommended

### File Size
- **12.0 MB** (includes all CSS and images as base64)
- No external dependencies required
- Works offline

## 📁 Repository Structure

```
mpp-interactive-training/
├── index.html              # Complete standalone training (12 MB)
└── README.md              # This file
```

## 🎯 Learning Objectives

After completing this training, users will:
1. ✅ Navigate the MPP portal confidently
2. ✅ Locate key Mentor/Protégé benefits information
3. ✅ Access program resources and support
4. ✅ Complete the contact form correctly
5. ✅ Understand basic MPP program concepts

## 🔐 Privacy & Security

- **No data transmitted** - everything runs locally
- **No tracking/analytics** - completely private
- **Form data sanitized** - XSS protection
- **Progress stored locally** - browser localStorage only

## 📞 Support

**Created for:** OSBP / DoD Mentor-Protégé Program
**Date:** January 2026
**Created by:** Claude AI Assistant

## 📄 License

This training content is for the exclusive use of the Office of Small Business Programs (OSBP) and authorized DoD Mentor-Protégé Program participants.

---

## 🎨 Customization

Want to modify the training? The code is well-commented and modular:

- **Quiz questions**: Search for `quizQuestions` array
- **Hotspot content**: Search for `hotspots` array
- **Tour steps**: Search for `driverObj.addStep`
- **Branding colors**: Modify CSS variables

---

**🌟 "The best training ever at OSBP"** - Interactive, accessible, and engaging eLearning that transforms how users learn the MPP portal.
