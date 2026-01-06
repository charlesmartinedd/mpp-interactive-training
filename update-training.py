#!/usr/bin/env python3
"""
MPP Interactive Training Enhancement Script
Updates index.html with:
1. Welcome modal shows every time (remove localStorage check)
2. Remove Practice Form button
3. Add CSS for panel animation and button highlights
4. Add scroll lock during guided tour
5. Add link interception with info modals
6. 20% larger modals and fonts
"""

import re
import base64
import os

def read_file(path):
    with open(path, 'r', encoding='utf-8') as f:
        return f.read()

def write_file(path, content):
    with open(path, 'w', encoding='utf-8') as f:
        f.write(content)

def main():
    html_path = os.path.join(os.path.dirname(__file__), 'index.html')
    audio_path = os.path.join(os.path.dirname(__file__), 'button-explanation-base64.txt')

    html = read_file(html_path)

    # Read the button explanation audio base64
    button_audio_base64 = ""
    if os.path.exists(audio_path):
        button_audio_base64 = read_file(audio_path).strip()
        print(f"Loaded button audio: {len(button_audio_base64)} chars")

    # 1. Add new CSS after existing #training-controls styles
    new_css = '''
/* === ENHANCED CONTROL PANEL ANIMATIONS === */
#training-controls {
  left: 20px !important;
  right: auto !important;
  transform: translateX(-350px);
  opacity: 0;
  transition: transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.4s ease;
}

#training-controls.panel-visible {
  transform: translateX(0) !important;
  opacity: 1 !important;
}

/* Button highlight animation */
@keyframes buttonPulse {
  0%, 100% {
    box-shadow: 0 0 0 0 rgba(255,75,82,0.7), 0 0 20px rgba(255,228,95,0.5);
    transform: scale(1.05);
  }
  50% {
    box-shadow: 0 0 0 10px rgba(255,75,82,0), 0 0 35px rgba(255,228,95,0.9);
    transform: scale(1.08);
  }
}

#training-controls button.button-highlighted {
  animation: buttonPulse 0.8s ease-in-out infinite !important;
  background: linear-gradient(135deg, #FF4B52 0%, #FFE45F 100%) !important;
  position: relative;
}

#training-controls button.button-highlighted::before {
  content: '\\25B6';
  position: absolute;
  left: -20px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 14px;
  color: #FFE45F;
  text-shadow: 0 0 10px rgba(255, 228, 95, 0.8);
  animation: arrowBounce 0.4s ease-in-out infinite alternate;
}

@keyframes arrowBounce {
  from { transform: translateY(-50%) translateX(0); }
  to { transform: translateY(-50%) translateX(5px); }
}

/* Scroll lock */
body.scroll-locked {
  overflow: hidden !important;
  position: fixed !important;
  width: 100% !important;
}

/* Larger Shepherd modals (20% increase) */
.shepherd-element {
  max-width: 480px !important;
}
.shepherd-text {
  font-size: 18px !important;
  line-height: 1.6 !important;
}
.shepherd-text h3 {
  font-size: 22px !important;
}
.shepherd-header {
  font-size: 20px !important;
}

/* Larger SweetAlert modals */
.swal2-popup {
  font-size: 1.2em !important;
}
.swal2-title {
  font-size: 1.5em !important;
}
.swal2-html-container {
  font-size: 1.1em !important;
}
'''

    # Insert CSS before the closing </style> tag in the inline styles section
    # Find a good insertion point - after training-controls styles
    css_insert_pattern = r'(#training-controls button:focus \{[^}]+\})'
    html = re.sub(css_insert_pattern, r'\1' + new_css, html, count=1)
    print("Added new CSS styles")

    # 2. Remove Practice Form button from HTML
    html = re.sub(
        r'<button id="btn-practice-form"[^>]*>[^<]*</button>\s*',
        '',
        html
    )
    print("Removed Practice Form button from HTML")

    # 3. Update showWelcomeModal to always show (remove localStorage check)
    # Replace the function to remove the hasVisited check
    old_welcome_pattern = r'''function showWelcomeModal\(\) \{
  const hasVisited = localStorage\.getItem\('mpp-training-visited'\);

  if \(!hasVisited\) \{'''

    new_welcome_start = '''function showWelcomeModal() {
  // Always show welcome modal (localStorage check removed for training)
  {'''

    html = re.sub(old_welcome_pattern, new_welcome_start, html)
    print("Updated showWelcomeModal to always show")

    # 4. Remove localStorage.setItem for visited flag in the .then() callback
    html = re.sub(
        r"localStorage\.setItem\('mpp-training-visited', 'true'\);\s*",
        "showControlPanelWithAnimation(); // Show panel after welcome\n      ",
        html
    )
    print("Replaced localStorage.setItem with panel animation trigger")

    # 5. Add new JavaScript functions before the closing </script> tag
    new_js = '''

// === BUTTON EXPLANATION AUDIO SYSTEM ===
const BUTTON_EXPLANATION_AUDIO_BASE64 = 'data:audio/mpeg;base64,''' + button_audio_base64 + '''';

const BUTTON_HIGHLIGHT_TIMINGS = [
  { buttonId: 'btn-start-tour', start: 0.0, end: 4.5 },
  { buttonId: 'btn-show-hotspots', start: 4.5, end: 8.5 },
  { buttonId: 'btn-take-quiz', start: 8.5, end: 12.5 },
  { buttonId: 'btn-reset', start: 12.5, end: 17.0 }
];

const ButtonExplanationAudio = {
  audio: null,
  isPlaying: false,

  init() {
    if (!BUTTON_EXPLANATION_AUDIO_BASE64 || BUTTON_EXPLANATION_AUDIO_BASE64 === 'data:audio/mpeg;base64,') {
      console.warn('Button explanation audio not loaded');
      return;
    }
    this.audio = new Audio(BUTTON_EXPLANATION_AUDIO_BASE64);
    this.audio.addEventListener('timeupdate', () => this.syncHighlights());
    this.audio.addEventListener('ended', () => this.onComplete());
    this.audio.addEventListener('error', (e) => console.error('Button audio error:', e));
  },

  play() {
    if (!this.audio) this.init();
    if (!this.audio) return;
    this.isPlaying = true;
    this.audio.play().catch(err => {
      console.warn('Button audio autoplay blocked:', err);
    });
  },

  syncHighlights() {
    if (!this.audio) return;
    const time = this.audio.currentTime;

    BUTTON_HIGHLIGHT_TIMINGS.forEach(({ buttonId, start, end }) => {
      const btn = document.getElementById(buttonId);
      if (!btn) return;

      if (time >= start && time < end) {
        btn.classList.add('button-highlighted');
      } else {
        btn.classList.remove('button-highlighted');
      }
    });
  },

  onComplete() {
    this.isPlaying = false;
    this.clearHighlights();
  },

  clearHighlights() {
    BUTTON_HIGHLIGHT_TIMINGS.forEach(({ buttonId }) => {
      const btn = document.getElementById(buttonId);
      if (btn) btn.classList.remove('button-highlighted');
    });
  },

  stop() {
    if (this.audio) {
      this.audio.pause();
      this.audio.currentTime = 0;
    }
    this.clearHighlights();
    this.isPlaying = false;
  }
};

// === CONTROL PANEL ANIMATION ===
function showControlPanelWithAnimation() {
  const panel = document.getElementById('training-controls');
  if (!panel) return;

  setTimeout(() => {
    panel.classList.add('panel-visible');
    // Start button explanation audio after panel slides in
    setTimeout(() => ButtonExplanationAudio.play(), 500);
  }, 300);
}

// === SCROLL LOCK FOR GUIDED TOUR ===
let savedScrollPosition = 0;

function lockScroll() {
  savedScrollPosition = window.scrollY;
  document.body.classList.add('scroll-locked');
  document.body.style.top = `-${savedScrollPosition}px`;
}

function unlockScroll() {
  document.body.classList.remove('scroll-locked');
  document.body.style.top = '';
  window.scrollTo(0, savedScrollPosition);
}

// === LINK INTERCEPTION ===
const LINK_DESCRIPTIONS = {
  'https://business.defense.gov/Programs/Mentor-Protege-Program/MPP-Resources/': {
    title: 'MPP Resources',
    text: 'This page provides official program materials including the Mentor-Protege Program Portal link, the approved mentor list PDF, key regulations (DFARS, 10 USC 4902), and contact information for program questions.'
  },
  'https://sam.gov/content/home': {
    title: 'SAM.gov Registration',
    text: 'SAM.gov is the official U.S. Government system for federal contracting. Here you can register your business, obtain a Unique Entity ID, and access contract opportunities required for DoD program participation.'
  },
  'https://business.defense.gov/Programs/Mentor-Protege-Program/How-to-Participate/': {
    title: 'How to Participate',
    text: 'This page outlines the seven-step process for joining the MPP, from finding a mentor or protege partner, choosing between credit or reimbursed agreements, to submitting applications and meeting reporting requirements.'
  },
  'https://business.defense.gov/Programs/Mentor-Protege-Program/Protege-Eligibility-Requirements/': {
    title: 'Eligibility Requirements',
    text: 'This page details qualification criteria for both mentors (active subcontracting plan, $25M+ DoD contracts) and proteges (SDB, WOSB, SDVOSB, HUBZone, or organizations employing the severely disabled).'
  },
  'https://dev-mpp.eccalon.com/mppdev/assets/DoD_Approved_Mentor_List_080624-vnKFkIOs.pdf': {
    title: 'Approved Mentor List',
    text: 'This PDF contains the official list of DoD-approved mentor companies that are authorized to participate in the Mentor-Protege Program and can partner with eligible small businesses.'
  },
  'https://business.defense.gov/Programs/Mentor-Prot%C3%A9g%C3%A9-Program/Regulation-Legislation/': {
    title: 'Why We Have MPP',
    text: "This page explains the Mentor-Protege Program's history as the oldest federal mentor-protege program, its mission to help small businesses enter the defense industrial base, and how successful agreements benefit all parties."
  },
  'https://business.defense.gov/Programs/Mentor-Protege-Program/Contacts/': {
    title: 'DoD OSBP Contacts',
    text: 'This page provides contact information for the MPP Director, Associate Director, and program managers at each military branch and defense agency including Army, Navy, Air Force, DCMA, DLA, and others.'
  },
  'https://business.defense.gov/Programs/Mentor-Protege-Program/FAQs/': {
    title: 'Frequently Asked Questions',
    text: 'This page answers common questions about program requirements, eligibility criteria, agreement types, finding mentors, cost reimbursement, reporting obligations, and includes a helpful acronym reference table.'
  },
  'https://dodcio.defense.gov/DoD-Web-Policy/': {
    title: 'DoD Web Policy',
    text: 'This page contains DoD policies governing official websites and social media, including security requirements, privacy guidelines, accessibility standards (Section 508), and applicable federal legislation.'
  },
  'https://business.defense.gov/Programs/Mentor-Prot%C3%A9g%C3%A9-Program/Contacts/': {
    title: 'Contact Us',
    text: 'This page provides contact information for the MPP Director, Associate Director, and program managers at each military branch and defense agency.'
  }
};

function interceptLinks() {
  document.querySelectorAll('a[href]').forEach(link => {
    const href = link.getAttribute('href');
    if (!href || href.startsWith('#') || href.startsWith('javascript:')) return;

    link.addEventListener('click', function(e) {
      e.preventDefault();

      // Find matching description
      let info = null;
      for (const [url, desc] of Object.entries(LINK_DESCRIPTIONS)) {
        if (href.includes(url) || url.includes(href)) {
          info = desc;
          break;
        }
      }

      if (!info) {
        // Generic message for unrecognized links
        info = {
          title: 'External Link',
          text: 'This link would take you to an external page. In this training, links are disabled to keep you focused on learning the portal navigation.'
        };
      }

      Swal.fire({
        title: info.title,
        html: `<p style="font-size: 16px; line-height: 1.6;">${info.text}</p>
               <p style="font-size: 14px; color: #666; margin-top: 15px;">
                 <em>In the live portal, this link would open: ${href}</em>
               </p>`,
        icon: 'info',
        confirmButtonText: 'Got it!',
        confirmButtonColor: '#243d80',
        width: '600px'
      });
    });
  });
}

// Initialize link interception on page load
document.addEventListener('DOMContentLoaded', function() {
  interceptLinks();
  ButtonExplanationAudio.init();
});
'''

    # Find the last </script> tag and insert before it
    # First, find the main script section
    script_end_pattern = r'(}\s*</script>\s*</body>)'
    html = re.sub(script_end_pattern, new_js + r'\n\1', html, count=1)
    print("Added new JavaScript functions")

    # 6. Update startTour to add scroll lock
    # Find startTour function and add lockScroll() at the beginning
    html = re.sub(
        r'(window\.startTour = function\(\) \{)',
        r'\1\n    lockScroll();',
        html
    )
    print("Added scroll lock to startTour")

    # 7. Add unlockScroll to tour completion
    html = re.sub(
        r"(trainingState\.tourComplete = true;\s*saveProgress\(\);)",
        r"unlockScroll();\n      \1",
        html
    )
    print("Added unlockScroll to tour completion")

    # 8. Update progress bar total (remove form from count)
    html = re.sub(
        r'const total = 4;',
        'const total = 3; // tour, hotspots (5), quiz',
        html
    )
    print("Updated progress bar total")

    # 9. Remove formPracticed from progress calculation
    html = re.sub(
        r'\+ \(trainingState\.formPracticed \? 1 : 0\)',
        '',
        html
    )
    print("Removed formPracticed from progress calculation")

    # 10. Remove practiceForm function (optional cleanup)
    html = re.sub(
        r'window\.practiceForm = function\(\) \{[^}]+\}[^}]+\};',
        '// practiceForm function removed',
        html,
        flags=re.DOTALL
    )
    print("Removed practiceForm function")

    # Write the updated HTML
    write_file(html_path, html)
    print(f"\nUpdated {html_path}")
    print("All changes applied successfully!")

if __name__ == '__main__':
    main()
