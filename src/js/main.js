(function() {
  'use strict';
  
  // Training Progress State
  const trainingState = {
    tourComplete: false,
    hotspotsViewed: [],
    formPracticed: false,
    quizComplete: false,
    quizScore: 0
  };
  
  // Load saved progress
  function loadProgress() {
    const saved = localStorage.getItem('mpp-training-progress');
    if (saved) {
      Object.assign(trainingState, JSON.parse(saved));
      updateProgressBar();
    }
  }
  
  // Save progress
  function saveProgress() {
    localStorage.setItem('mpp-training-progress', JSON.stringify(trainingState));
    updateProgressBar();
  }
  
  // Update progress bar
  function updateProgressBar() {
    const total = 3; // tour, hotspots (5), quiz
    let completed = 0;

    if (trainingState.tourComplete) completed++;
    if (trainingState.hotspotsViewed.length >= 5) completed++;
    if (trainingState.quizComplete) completed++;
    
    const percentage = (completed / total) * 100;
    document.getElementById('training-progress-bar').style.width = percentage + '%';
  }
  
  // ============================================
  // GUIDED TOUR IMPLEMENTATION
  // ============================================
  
  let driverObj;

  // Track if user has started training (to prevent welcome modal overlap)
  let trainingStarted = false;
  let welcomeModalTimeout = null;

  // Hide/Show panel functions
  window.hidePanel = function() {
    const panel = document.getElementById('training-controls');
    const showBtn = document.getElementById('show-training-btn');
    panel.classList.remove('panel-visible');
    panel.classList.add('hidden');
    showBtn.classList.add('visible');
  };

  window.showPanel = function() {
    const panel = document.getElementById('training-controls');
    const showBtn = document.getElementById('show-training-btn');
    panel.classList.remove('hidden');
    panel.classList.add('panel-visible');
    showBtn.classList.remove('visible');
  };

  window.startTour = function() {
    console.log('startTour called');
    console.log('Shepherd available?', typeof Shepherd);

    // Mark training as started and close any open modals
    trainingStarted = true;
    if (welcomeModalTimeout) clearTimeout(welcomeModalTimeout);
    if (typeof Swal !== 'undefined') {
      Swal.close();
      // Also close after a brief delay to catch any modal that appears
      setTimeout(() => Swal.close(), 100);
    }

    // Lock scrolling during tour
    document.body.classList.add('tour-active');

    if (typeof Shepherd === 'undefined') {
      alert('Error: Tour library not loaded. Please check your internet connection and refresh.');
      return;
    }

    if (driverObj) {
      driverObj.start();
      return;
    }
    
    console.log('Creating new Shepherd tour');
    driverObj = new Shepherd.Tour({
      useModalOverlay: true,
      defaultStepOptions: {
        cancelIcon: {
          enabled: true
        },
        classes: 'shepherd-theme-custom',
        scrollTo: true,
        scrollToHandler: function(element) {
          // Smooth scroll with offset - uses programmaticScroll flag to bypass scroll lock
          if (element) {
            programmaticScroll = true;
            const rect = element.getBoundingClientRect();
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            const targetY = scrollTop + rect.top - (window.innerHeight * 0.25);
            window.scrollTo({
              top: Math.max(0, targetY),
              behavior: 'smooth'
            });
            setTimeout(() => { programmaticScroll = false; }, 1000);
          }
        },
        popperOptions: {
          modifiers: [
            { name: 'offset', options: { offset: [0, 12] } },
            { name: 'preventOverflow', options: { padding: 20 } }
          ]
        }
      }
    });
    
    // Welcome step removed - tour starts directly at homepage

    // Step 1: Homepage
    driverObj.addStep({
      id: 'homepage',
      text: '<h3>MPP Portal Homepage</h3><p>This is the main landing page where users learn about the Mentor-Protégé Program. Notice the prominent login button and navigation.</p>',
      attachTo: {
        element: 'section.relative',
        on: 'bottom'
      },
      buttons: [
        {
          text: 'Back',
          action: driverObj.back,
          secondary: true
        },
        {
          text: 'Next',
          action: driverObj.next
        }
      ]
    });
    
    // Step 3: Welcome message
    driverObj.addStep({
      id: 'welcome-message',
      text: '<h3>Portal Welcome Message</h3><p>The MPP portal provides access to dashboard features for both Mentors and Protégés to manage their partnerships.</p>',
      attachTo: {
        element: 'h1',
        on: 'bottom'
      },
      buttons: [
        {
          text: 'Back',
          action: driverObj.back,
          secondary: true
        },
        {
          text: 'Next',
          action: driverObj.next
        }
      ]
    });
    
    // Step 4: Mentor Benefits
    driverObj.addStep({
      id: 'mentor-benefits',
      text: '<h3>Mentor Benefits Section</h3><p>This section highlights the key benefits for companies serving as Mentors: developing subcontracting pools, receiving cost reimbursement, and pursuing team opportunities.</p>',
      attachTo: {
        element: 'section.bg-linearBlue500',
        on: 'right'
      },
      buttons: [
        {
          text: 'Back',
          action: driverObj.back,
          secondary: true
        },
        {
          text: 'Next',
          action: driverObj.next
        }
      ]
    });
    
    // Step 5: Protégé Benefits
    driverObj.addStep({
      id: 'protege-benefits',
      text: '<h3>Protégé Benefits Section</h3><p>Protégés receive technical assistance, management guidance, general administrative help, and training from top Prime Contractors.</p>',
      attachTo: {
        element: 'section.bg-linearBlue500',
        on: 'left'
      },
      buttons: [
        {
          text: 'Back',
          action: driverObj.back,
          secondary: true
        },
        {
          text: 'Next',
          action: driverObj.next
        }
      ]
    });
    
    // Step 6: Summit info
    driverObj.addStep({
      id: 'summit',
      text: '<h3>Annual Summit Information</h3><p>The MPP Summit is an annual event where Mentors and Protégés can network and learn. Check here for summit updates and recordings.</p>',
      attachTo: {
        element: 'section.relative.bg-black',
        on: 'top'
      },
      buttons: [
        {
          text: 'Back',
          action: driverObj.back,
          secondary: true
        },
        {
          text: 'Next',
          action: driverObj.next
        }
      ]
    });
    
    // Step 7: Footer
    driverObj.addStep({
      id: 'footer',
      text: '<h3>Get Connected Form</h3><p><strong>Ready to take the next step?</strong> Use the "Get Connected" contact form to have someone from the OSBP team reach out with more information about the Mentor-Protégé Program.</p><p>Simply fill in your name, email, phone, organization, and a message—a program representative will follow up with you!</p>',
      attachTo: {
        element: 'footer',
        on: 'top'
      },
      buttons: [
        {
          text: 'Back',
          action: driverObj.back,
          secondary: true
        },
        {
          text: 'Next',
          action: driverObj.next
        }
      ]
    });
    
    // Step 8: Complete
    driverObj.addStep({
      id: 'complete',
      text: '<h3>Tour Complete! 🎉</h3><p>Great job! You\'ve completed the guided tour. Next, try exploring the hotspots or practicing the contact form.</p>',
      buttons: [
        {
          text: 'Finish',
          action: driverObj.complete
        }
      ]
    });
    
    // Handle tour completion
    driverObj.on('complete', () => {
      document.body.classList.remove('tour-active'); // Unlock scrolling
      trainingState.tourComplete = true;
      saveProgress();
      Swal.fire({
        icon: 'success',
        title: 'Tour Complete!',
        text: 'You\'ve completed the guided walkthrough. Try exploring hotspots next!',
        confirmButtonText: 'Continue Learning',
        confirmButtonColor: '#243d80'
      });
    });
    
    // Handle tour cancellation
    driverObj.on('cancel', () => {
      document.body.classList.remove('tour-active'); // Unlock scrolling
    });

    // Start the tour
    driverObj.start();
  };

  // ============================================
  // HOTSPOTS IMPLEMENTATION
  // ============================================
  
  const hotspots = [
    {
      id: 'login-button',
      element: 'button',
      title: 'Dashboard Login',
      content: '<h3>Dashboard Access</h3><p>Click here to access your personalized MPP dashboard where you can:</p><ul><li>Track your mentor/protégé agreements</li><li>Submit quarterly reports</li><li>View partnership milestones</li><li>Access program resources</li></ul><p><strong>Note:</strong> You must have an updated SAM profile to register.</p>'
    },
    {
      id: 'mentor-benefits',
      element: 'section.bg-linearBlue500:nth-of-type(1)',
      title: 'Mentor Benefits',
      content: '<h3>Why Become a Mentor?</h3><p>Prime contractors who serve as Mentors receive:</p><ul><li><strong>Cost Reimbursement:</strong> Credits toward small business contracting goals</li><li><strong>Quality Pool:</strong> Develop reliable subcontractors</li><li><strong>Team Opportunities:</strong> Pursue new markets with qualified partners</li><li><strong>Industry Leadership:</strong> Shape the future defense industrial base</li></ul>'
    },
    {
      id: 'protege-benefits',
      element: 'section.bg-linearBlue500:nth-of-type(2)',
      title: 'Protégé Benefits',
      content: '<h3>What Protégés Receive</h3><p>Small businesses accepted as Protégés get:</p><ul><li><strong>Expert Guidance:</strong> From top Prime Contractors</li><li><strong>Technical Assistance:</strong> Improve capabilities and processes</li><li><strong>Business Development:</strong> Learn how to compete for contracts</li><li><strong>Training & Education:</strong> Professional development opportunities</li><li><strong>Networking:</strong> Connections with defense industry leaders</li></ul>'
    },
    {
      id: 'prime-logos',
      element: 'section.bg-\\[\\#071646\\]',
      title: 'Mentor Community',
      content: '<h3>Join Our Mentor Community</h3><p>The MPP includes partnerships with leading defense contractors including Lockheed Martin, Northrop Grumman, Raytheon, Boeing, and many more.</p><p>These industry leaders provide mentorship, guidance, and support to small businesses seeking to grow in the defense sector.</p>'
    },
    {
      id: 'summit',
      element: 'section.relative.bg-black',
      title: 'MPP Summit',
      content: '<h3>Annual MPP Summit</h3><p>The Mentor-Protégé Program Summit is an annual event that brings together:</p><ul><li>Current Mentors and Protégés</li><li>Prospective participants</li><li>DoD contracting officials</li><li>Industry experts</li></ul><p>Attend to network, learn best practices, and discover partnership opportunities!</p>'
    },
    {
      id: 'contact-form',
      element: 'footer form',
      title: 'Get Connected',
      content: '<h3>Contact OSBP</h3><p>Use this form to:</p><ul><li>Request more information about MPP</li><li>Ask questions about eligibility</li><li>Schedule a consultation</li><li>Report technical issues</li></ul><p>The OSBP team typically responds within 2-3 business days.</p>'
    },
    {
      id: 'resources',
      element: 'footer nav',
      title: 'Program Resources',
      content: '<h3>Essential Resources</h3><p>Access important program information:</p><ul><li><strong>How to Participate:</strong> Step-by-step enrollment guide</li><li><strong>Eligibility Requirements:</strong> Determine if you qualify</li><li><strong>MPP Resources:</strong> Forms, templates, and guidance</li><li><strong>FAQs:</strong> Answers to common questions</li></ul>'
    }
  ];
  
  let hotspotsVisible = false;
  
  window.toggleHotspots = function() {
    // Mark training as started and close any open modals
    trainingStarted = true;
    if (welcomeModalTimeout) clearTimeout(welcomeModalTimeout);
    if (typeof Swal !== 'undefined') Swal.close();

    hotspotsVisible = !hotspotsVisible;

    if (hotspotsVisible) {
      showHotspots();
      document.getElementById('btn-show-hotspots').textContent = '🔴 Hide Hotspots';
    } else {
      hideHotspots();
      document.getElementById('btn-show-hotspots').textContent = '📍 Show Hotspots';
    }
  };
  
  function showHotspots() {
    hotspots.forEach((spot, index) => {
      let element;
      try {
        element = document.querySelector(spot.element);
      } catch (e) {
        console.warn(`Invalid selector for hotspot ${spot.id}: ${spot.element}`, e);
        return; // Skip this hotspot but continue with others
      }
      if (element) {
        const rect = element.getBoundingClientRect();
        const hotspot = document.createElement('div');
        hotspot.className = 'training-hotspot';
        hotspot.id = `hotspot-${spot.id}`;
        hotspot.textContent = (index + 1).toString();
        hotspot.setAttribute('role', 'button');
        hotspot.setAttribute('tabindex', '0');
        hotspot.setAttribute('aria-label', spot.title);
        
        hotspot.style.left = (rect.left + rect.width / 2 - 16 + window.scrollX) + 'px';
        hotspot.style.top = (rect.top + rect.height / 2 - 16 + window.scrollY) + 'px';
        
        hotspot.onclick = () => showHotspotModal(spot);
        hotspot.onkeydown = (e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            showHotspotModal(spot);
          }
        };
        
        document.body.appendChild(hotspot);
      }
    });
  }
  
  function hideHotspots() {
    document.querySelectorAll('.training-hotspot').forEach(el => el.remove());
  }
  
  function showHotspotModal(spot) {
    if (!trainingState.hotspotsViewed.includes(spot.id)) {
      trainingState.hotspotsViewed.push(spot.id);
      saveProgress();
    }
    
    Swal.fire({
      title: spot.title,
      html: spot.content,
      icon: 'info',
      confirmButtonText: 'Got it!',
      confirmButtonColor: '#243d80',
      width: '600px'
    });
  }
  
  // ============================================
  // FORM SIMULATION
  // ============================================
  
  // practiceForm function removed - button no longer exists

  // Initialize form handling
  function initFormSimulation() {
    const form = document.querySelector('footer form');
    if (form) {
      form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const formData = new FormData(form);
        const data = {};
        let allFilled = true;
        
        for (let [key, value] of formData.entries()) {
          data[key] = DOMPurify.sanitize(value);
          if (!value.trim()) allFilled = false;
        }
        
        if (!allFilled) {
          Swal.fire({
            icon: 'warning',
            title: 'Incomplete Form',
            text: 'Please fill out all required fields before submitting.',
            confirmButtonColor: '#243d80'
          });
          return;
        }
        
        trainingState.formPracticed = true;
        saveProgress();
        
        Swal.fire({
          icon: 'success',
          title: 'Excellent Work!',
          html: '<p>In a real scenario, your message would be sent to the OSBP team.</p><p>They typically respond within 2-3 business days.</p><p><strong>Form data (practice only):</strong></p><pre style="text-align: left; font-size: 12px;">' + JSON.stringify(data, null, 2) + '</pre>',
          confirmButtonText: 'Continue Training',
          confirmButtonColor: '#243d80',
          width: '600px'
        });
        
        form.reset();
      });
    }
  }
  
  // ============================================
  // QUIZ IMPLEMENTATION
  // ============================================
  
  const quizQuestions = [
    {
      question: 'What is one benefit for companies serving as Mentors in the MPP?',
      options: [
        'Cost reimbursement and credits toward small business goals',
        'Free government contracts',
        'Tax exemptions',
        'Automatic DoD certification'
      ],
      correct: 0
    },
    {
      question: 'What type of assistance do Protégés receive from Mentors?',
      options: [
        'Only financial support',
        'Technical, management, and business development assistance',
        'Just networking opportunities',
        'Only training materials'
      ],
      correct: 1
    },
    {
      question: 'What is required to register for the MPP portal dashboard?',
      options: [
        'A business license',
        'DoD security clearance',
        'An updated SAM profile',
        'Previous government contracts'
      ],
      correct: 2
    },
    {
      question: 'What is the purpose of the annual MPP Summit?',
      options: [
        'To award contracts',
        'To network with current and potential Mentors and Protégés',
        'To enforce program rules',
        'To conduct audits'
      ],
      correct: 1
    },
    {
      question: 'Where can users find program resources, FAQs, and eligibility requirements?',
      options: [
        'Social media',
        'The hero section',
        'The footer navigation links',
        'The login dashboard only'
      ],
      correct: 2
    }
  ];
  
  let currentQuestion = 0;
  let score = 0;
  
  window.takeQuiz = function() {
    // Mark training as started and close any open modals
    trainingStarted = true;
    if (welcomeModalTimeout) clearTimeout(welcomeModalTimeout);
    if (typeof Swal !== 'undefined') Swal.close();

    currentQuestion = 0;
    score = 0;
    showQuestion();
  };
  
  function showQuestion() {
    if (currentQuestion >= quizQuestions.length) {
      showQuizResults();
      return;
    }
    
    const q = quizQuestions[currentQuestion];
    const optionsHtml = q.options.map((opt, i) => 
      `<button onclick="answerQuestion(${i})" style="display: block; width: 100%; padding: 12px; margin: 8px 0; background: #f0f0f0; border: 2px solid #ddd; border-radius: 8px; cursor: pointer; text-align: left; font-size: 14px; transition: all 0.2s;" onmouseover="this.style.background='#e0e0e0'; this.style.borderColor='#243d80';" onmouseout="this.style.background='#f0f0f0'; this.style.borderColor='#ddd';">${opt}</button>`
    ).join('');
    
    Swal.fire({
      title: `Question ${currentQuestion + 1} of ${quizQuestions.length}`,
      html: `<p style="font-size: 16px; margin: 20px 0;"><strong>${q.question}</strong></p>${optionsHtml}`,
      showConfirmButton: false,
      showCloseButton: true,
      width: '600px',
      allowOutsideClick: false
    });
  }
  
  window.answerQuestion = function(selected) {
    const q = quizQuestions[currentQuestion];
    const isCorrect = selected === q.correct;
    
    if (isCorrect) {
      score++;
      Swal.fire({
        icon: 'success',
        title: 'Correct!',
        text: 'Great job!',
        timer: 1500,
        showConfirmButton: false
      }).then(() => {
        currentQuestion++;
        showQuestion();
      });
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Not Quite',
        html: `<p>The correct answer is:</p><p><strong>${q.options[q.correct]}</strong></p>`,
        confirmButtonText: 'Continue',
        confirmButtonColor: '#243d80'
      }).then(() => {
        currentQuestion++;
        showQuestion();
      });
    }
  };
  
  function showQuizResults() {
    const percentage = Math.round((score / quizQuestions.length) * 100);
    const passed = percentage >= 70;
    
    trainingState.quizComplete = true;
    trainingState.quizScore = percentage;
    saveProgress();
    
    Swal.fire({
      icon: passed ? 'success' : 'info',
      title: passed ? 'Quiz Complete!' : 'Quiz Complete',
      html: `<p style="font-size: 24px; margin: 20px 0;"><strong>Score: ${score}/${quizQuestions.length} (${percentage}%)</strong></p>
             <p>${passed ? 'Excellent work! You have a strong understanding of the MPP portal.' : 'Good effort! Review the portal content and try again to improve your score.'}</p>`,
      confirmButtonText: passed ? 'Finish Training' : 'Review & Retry',
      confirmButtonColor: '#243d80'
    }).then(() => {
      if (passed && trainingState.tourComplete && trainingState.hotspotsViewed.length >= 5) {
        showCompletionCertificate();
      }
    });
  }
  
  // ============================================
  // COMPLETION & PROGRESS
  // ============================================
  
  function showCompletionCertificate() {
    const completionDate = new Date().toLocaleDateString();
    
    Swal.fire({
      icon: 'success',
      title: '🎉 Training Complete!',
      html: `<div style="padding: 20px; border: 3px solid #243d80; border-radius: 12px; margin: 20px 0;">
               <h2 style="color: #243d80; margin: 0;">Certificate of Completion</h2>
               <p style="margin: 20px 0;">This certifies that you have successfully completed the</p>
               <h3 style="color: #FF4B52; margin: 10px 0;">MPP Portal Navigation Training</h3>
               <p style="margin: 20px 0;">Date: ${completionDate}</p>
               <p style="font-size: 12px; color: #666;">You have demonstrated proficiency in navigating the Mentor-Protégé Program portal.</p>
             </div>`,
      confirmButtonText: 'Finish',
      confirmButtonColor: '#243d80',
      width: '600px'
    });
  }
  
  window.resetProgress = function() {
    Swal.fire({
      title: 'Reset Progress?',
      text: 'This will clear all your training progress. Are you sure?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, reset',
      cancelButtonText: 'Cancel',
      confirmButtonColor: '#FF4B52',
      cancelButtonColor: '#666'
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.removeItem('mpp-training-progress');
        trainingState.tourComplete = false;
        trainingState.hotspotsViewed = [];
        trainingState.formPracticed = false;
        trainingState.quizComplete = false;
        trainingState.quizScore = 0;
        updateProgressBar();
        
        Swal.fire({
          icon: 'success',
          title: 'Progress Reset',
          text: 'Your training progress has been cleared.',
          timer: 2000,
          showConfirmButton: false
        });
      }
    });
  };
  
  // ============================================
  // INITIALIZATION
  // ============================================
  
  // Show welcome modal on first visit

/**
 * Creates accessible audio player HTML for modal
 * @returns {string} HTML string with audio controls
 */
function createWelcomeAudioPlayer() {
  return `
    <div id="welcome-audio-container"
         class="mpp-welcome-audio"
         role="region"
         aria-label="Introduction narration">

      <audio id="welcome-audio"
             preload="auto"
             aria-label="Welcome narration audio">
        <source src="${WELCOME_AUDIO_BASE64}" type="audio/mpeg">
        Your browser does not support the audio element.
      </audio>

      <div class="mpp-welcome-audio__row">
        <button id="audio-play-pause"
                class="mpp-audio-btn"
                type="button"
                aria-label="Play welcome narration">
          <span class="mpp-audio-btn__icon" aria-hidden="true">
            <svg class="icon-play" viewBox="0 0 24 24" width="18" height="18" fill="currentColor" focusable="false" aria-hidden="true">
              <path d="M8 5v14l11-7z"></path>
            </svg>
            <svg class="icon-pause" viewBox="0 0 24 24" width="18" height="18" fill="currentColor" focusable="false" aria-hidden="true">
              <path d="M6 5h4v14H6zm8 0h4v14h-4z"></path>
            </svg>
          </span>
          <span id="play-text">Play narration</span>
        </button>

        <button id="audio-mute"
                class="mpp-audio-mute"
                type="button"
                aria-label="Mute audio"
                aria-pressed="false">
          <span class="mpp-audio-btn__icon" aria-hidden="true">
            <svg class="icon-volume" viewBox="0 0 24 24" width="18" height="18" fill="currentColor" focusable="false" aria-hidden="true">
              <path d="M3 10v4h4l5 5V5L7 10H3z"></path>
              <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z"></path>
            </svg>
            <svg class="icon-muted" viewBox="0 0 24 24" width="18" height="18" fill="currentColor" focusable="false" aria-hidden="true">
              <path d="M3 10v4h4l5 5V5L7 10H3z"></path>
              <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.2l2.5 2.5V12zM14 14.83v2.2c.8-.4 1.48-1.02 1.95-1.78L14 14.83z"></path>
              <path d="M19 9l-1.41-1.41L15 10.17l-2.59-2.58L11 9l2.59 2.59L11 14.17 12.41 15.6 15 13l2.59 2.59L19 14.17l-2.59-2.58L19 9z"></path>
            </svg>
          </span>
        </button>
      </div>

      <div class="audio-timeline">
        <span id="audio-time-current" class="time">0:00</span>
        <div class="progress-track"
             id="audio-progress-bar"
             role="progressbar"
             aria-label="Audio playback progress"
             aria-valuemin="0"
             aria-valuemax="100"
             aria-valuenow="0">
          <div id="audio-progress-fill" class="progress-fill"></div>
        </div>
        <span id="audio-time-duration" class="time">0:00</span>
      </div>

      <div class="mpp-welcome-audio__status">
        <span id="audio-status" role="status" aria-live="polite">Audio ready to play</span>
      </div>
    </div>
  `;
}

  function showWelcomeModal() {
    // Don't show if user already started training or tour is active
    if (trainingStarted || (driverObj && driverObj.isActive && driverObj.isActive())) {
      return;
    }

    let showPanelAfterWelcome = false;

    Swal.fire({
      title: 'Welcome to MPP Training! 🎓',
      html: `
        <p style="font-size: 16px; line-height: 1.6; margin-top: 15px;">
          This interactive training will help you learn to navigate the Mentor-Protégé Program portal.
        </p>
        <div style="text-align: left; margin: 20px 0;">
          <h4 style="color: #243d80;">What you'll learn:</h4>
          <ul style="line-height: 1.8;">
            <li>Portal navigation and key features</li>
            <li>Benefits for Mentors and Protégés</li>
            <li>How to access resources and support</li>
          </ul>
        </div>
        <p style="font-size: 14px; color: #666;">
          <strong>Estimated time:</strong> 15-20 minutes<br>
          <strong>Accessibility:</strong> Fully keyboard navigable
        </p>

        ${createWelcomeAudioPlayer()}
      `,
      icon: 'info',
      confirmButtonText: 'Start Training',
      confirmButtonColor: '#243d80',
      width: '700px',
      customClass: {
        popup: 'modal-gold-border',
        title: 'modal-title-redesign',
        htmlContainer: 'modal-body-redesign'
      },
      allowOutsideClick: false,
      preConfirm: () => {
        showPanelAfterWelcome = true;
        trainingStarted = true;
        if (welcomeModalTimeout) clearTimeout(welcomeModalTimeout);
        setTimeout(() => {
          if (typeof Swal !== 'undefined') Swal.close();
          showControlPanelWithAnimation();
        }, 0);
        return true;
      },
      didOpen: () => {
        initWelcomeAudio();
      },
      willClose: () => {
        cleanupWelcomeAudio();
      }
    }).then((result) => {
      if (result.isConfirmed && showPanelAfterWelcome) {
        showControlPanelWithAnimation(); // Show panel after welcome
      }
    });
  }

/**
 * Initializes audio controls and event listeners for welcome modal
 */
function initWelcomeAudio() {
  const audio = document.getElementById('welcome-audio');
  const playPauseBtn = document.getElementById('audio-play-pause');
  const muteBtn = document.getElementById('audio-mute');
  const progressBar = document.getElementById('audio-progress-bar');
  const progressFill = document.getElementById('audio-progress-fill');
  const currentTimeEl = document.getElementById('audio-time-current');
  const durationEl = document.getElementById('audio-time-duration');
  const statusEl = document.getElementById('audio-status');
  const playText = document.getElementById('play-text');

  if (!audio) return;

  // Check user preference for autoplay
  const audioMuted = localStorage.getItem('mpp-audio-muted') === 'true';
  if (audioMuted) {
    audio.muted = true;
    muteBtn.setAttribute('aria-pressed', 'true');
    muteBtn.classList.add('is-muted');
  }

  // Format time helper (seconds to MM:SS)
  function formatTime(seconds) {
    if (isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }

  // Update progress bar and time display
  function updateProgress() {
    const percent = (audio.currentTime / audio.duration) * 100;
    progressFill.style.width = `${percent}%`;
    progressBar.setAttribute('aria-valuenow', percent.toFixed(0));
    currentTimeEl.textContent = formatTime(audio.currentTime);
  }

  // Play/Pause toggle
  playPauseBtn.addEventListener('click', () => {
    if (audio.paused) {
      audio.play()
        .then(() => {
          playPauseBtn.classList.add('is-playing');
          playText.textContent = 'Pause';
          playPauseBtn.setAttribute('aria-label', 'Pause welcome narration');
          statusEl.textContent = 'Playing narration';
        })
        .catch(err => {
          console.error('Audio playback failed:', err);
          statusEl.textContent = 'Playback failed. Please try again.';
        });
    } else {
      audio.pause();
      playPauseBtn.classList.remove('is-playing');
      playText.textContent = 'Play narration';
      playPauseBtn.setAttribute('aria-label', 'Play welcome narration');
      statusEl.textContent = 'Paused';
    }
  });

  // Mute toggle
  muteBtn.addEventListener('click', () => {
    audio.muted = !audio.muted;
    muteBtn.classList.toggle('is-muted', audio.muted);
    muteBtn.setAttribute('aria-label', audio.muted ? 'Unmute audio' : 'Mute audio');
    muteBtn.setAttribute('aria-pressed', audio.muted.toString());

    // Save preference
    localStorage.setItem('mpp-audio-muted', audio.muted.toString());

    statusEl.textContent = audio.muted ? 'Audio muted' : 'Audio unmuted';
  });

  // Progress bar click to seek
  progressBar.addEventListener('click', (e) => {
    const rect = progressBar.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    audio.currentTime = percent * audio.duration;
  });

  // Audio event listeners
  audio.addEventListener('loadedmetadata', () => {
    durationEl.textContent = formatTime(audio.duration);
    statusEl.textContent = `Audio ready (${formatTime(audio.duration)})`;
  });

  audio.addEventListener('timeupdate', updateProgress);

  audio.addEventListener('ended', () => {
    playPauseBtn.classList.remove('is-playing');
    playText.textContent = 'Play narration';
    playPauseBtn.setAttribute('aria-label', 'Play welcome narration');
    statusEl.textContent = 'Audio finished';
    progressFill.style.width = '0%';
    progressBar.setAttribute('aria-valuenow', '0');
  });

  audio.addEventListener('error', (e) => {
    console.error('Audio error:', e);
    statusEl.textContent = 'Audio unavailable - click Start Training to continue';
    // Disable audio controls since audio failed
    if (playPauseBtn) playPauseBtn.disabled = true;
    if (muteBtn) muteBtn.disabled = true;
  });

  // Autoplay if not muted (with browser permission handling)
  if (!audioMuted) {
    // Delay autoplay slightly to ensure modal is fully rendered
    setTimeout(() => {
      audio.play()
        .then(() => {
          playPauseBtn.classList.add('is-playing');
          playText.textContent = 'Pause';
          playPauseBtn.setAttribute('aria-label', 'Pause welcome narration');
          statusEl.textContent = 'Playing narration';
        })
        .catch(err => {
          // Autoplay blocked by browser - this is expected behavior
          console.info('Autoplay prevented by browser policy:', err.message);
          statusEl.textContent = 'Click play to hear narration';
        });
    }, 500);
  }
}

/**
 * Cleanup audio resources when modal closes
 */
function cleanupWelcomeAudio() {
  const audio = document.getElementById('welcome-audio');
  if (audio) {
    audio.pause();
    audio.currentTime = 0;
    // Remove all event listeners by cloning and replacing
    const clone = audio.cloneNode(true);
    audio.parentNode?.replaceChild(clone, audio);
    // Clear source on the clone (now without listeners)
    clone.src = '';
  }
}

  // Initialize on page load
  document.addEventListener('DOMContentLoaded', function() {
    loadProgress();
    initFormSimulation();

    // Show welcome after a brief delay (if user hasn't started training)
    welcomeModalTimeout = setTimeout(function() {
      if (!trainingStarted) showWelcomeModal();
    }, 1000);
    
    // Add keyboard shortcuts
    document.addEventListener('keydown', function(e) {
      // Press 'T' to start tour
      if (e.key === 't' && !e.ctrlKey && !e.metaKey && !e.altKey) {
        const activeElement = document.activeElement;
        if (activeElement.tagName !== 'INPUT' && activeElement.tagName !== 'TEXTAREA') {
          startTour();
        }
      }
      
      // Press 'H' to toggle hotspots
      if (e.key === 'h' && !e.ctrlKey && !e.metaKey && !e.altKey) {
        const activeElement = document.activeElement;
        if (activeElement.tagName !== 'INPUT' && activeElement.tagName !== 'TEXTAREA') {
          toggleHotspots();
        }
      }
    });
  });

// === BUTTON EXPLANATION AUDIO SYSTEM ===
const BUTTON_HIGHLIGHT_TIMINGS = [
  { buttonId: 'btn-start-tour', start: 0.0, end: 4.5 },
  { buttonId: 'btn-show-hotspots', start: 4.5, end: 8.5 },
  { buttonId: 'btn-take-quiz', start: 8.5, end: 12.5 },
  { buttonId: 'btn-reset', start: 12.5, end: 17.0 }
];

const ButtonExplanationAudio = {
  audio: null,
  isPlaying: false,
  audioSrc: './button-explanation.mp3',

  init() {
    // Load audio from external file
    if (!this.audioSrc) {
      console.warn('Button explanation audio not loaded');
      return;
    }
    this.audio = new Audio(this.audioSrc);
    this.audio.addEventListener('timeupdate', () => this.syncHighlights());
    this.audio.addEventListener('ended', () => this.onComplete());
    this.audio.addEventListener('error', (e) => console.error('Button audio error:', e));
  },

  setAudioSource(src) {
    this.audioSrc = src;
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
    panel.classList.remove('hidden');
    panel.classList.add('panel-visible');
    // Start button explanation audio after panel slides in
    setTimeout(() => ButtonExplanationAudio.play(), 500);
  }, 300);
}

// === SCROLL LOCK FOR GUIDED TOUR ===
let scrollLocked = false;
let programmaticScroll = false;

function preventScroll(e) {
  if (scrollLocked && !programmaticScroll) {
    e.preventDefault();
  }
}

function lockScroll() {
  scrollLocked = true;
  document.body.classList.add('scroll-locked');
  window.addEventListener('wheel', preventScroll, { passive: false });
  window.addEventListener('touchmove', preventScroll, { passive: false });
}

function unlockScroll() {
  scrollLocked = false;
  document.body.classList.remove('scroll-locked');
  window.removeEventListener('wheel', preventScroll);
  window.removeEventListener('touchmove', preventScroll);
}

// Allow programmatic scroll during tour
function scrollToElement(element) {
  if (!element) return;
  programmaticScroll = true;
  const rect = element.getBoundingClientRect();
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
  const targetY = scrollTop + rect.top - (window.innerHeight * 0.25);
  window.scrollTo({ top: Math.max(0, targetY), behavior: 'smooth' });
  setTimeout(() => { programmaticScroll = false; }, 1000);
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
  'dev-mpp.eccalon.com/mppdev/assets/DoD_Approved_Mentor_List': {
    title: 'Approved Mentor List',
    text: 'This PDF contains the official list of DoD-approved mentor companies that are authorized to participate in the Mentor-Protege Program and can partner with eligible small businesses.'
  },
  'business.defense.gov/Programs/Mentor-Prot%C3%A9g%C3%A9-Program/Regulation-Legislation/': {
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
  'business.defense.gov/Programs/Mentor-Prot%C3%A9g%C3%A9-Program/Contacts/': {
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

})();
</script>
