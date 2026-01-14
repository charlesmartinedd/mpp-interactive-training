// Training Progress State Management
// Handles localStorage persistence and progress tracking

export const trainingState = {
  tourComplete: false,
  hotspotsViewed: [],
  formPracticed: false,
  quizComplete: false,
  quizScore: 0
};

// Load saved progress from localStorage
export function loadProgress() {
  const saved = localStorage.getItem('mpp-training-progress');
  if (saved) {
    Object.assign(trainingState, JSON.parse(saved));
    updateProgressBar();
  }
}

// Save progress to localStorage
export function saveProgress() {
  localStorage.setItem('mpp-training-progress', JSON.stringify(trainingState));
  updateProgressBar();
}

// Update progress bar visual
export function updateProgressBar() {
  const total = 3; // tour, hotspots (5), quiz
  let completed = 0;

  if (trainingState.tourComplete) completed++;
  if (trainingState.hotspotsViewed.length >= 5) completed++;
  if (trainingState.quizComplete) completed++;

  const percentage = (completed / total) * 100;
  const progressBar = document.getElementById('training-progress-bar');
  if (progressBar) {
    progressBar.style.width = percentage + '%';
  }

  // Check for completion
  if (completed === total) {
    showCompletionCertificate();
  }
}

// Reset all training progress
export function resetProgress() {
  trainingState.tourComplete = false;
  trainingState.hotspotsViewed = [];
  trainingState.formPracticed = false;
  trainingState.quizComplete = false;
  trainingState.quizScore = 0;
  localStorage.removeItem('mpp-training-progress');
  localStorage.removeItem('mpp-welcome-seen');
  updateProgressBar();
}

// Show completion certificate
function showCompletionCertificate() {
  Swal.fire({
    title: 'Training Complete!',
    html: `
      <div style="text-align: center;">
        <h3 style="color: #243d80; margin-bottom: 20px;">Certificate of Completion</h3>
        <p>Congratulations! You have successfully completed the MPP Interactive Training.</p>
        <p><strong>Completed:</strong> ${new Date().toLocaleDateString()}</p>
        <p style="margin-top: 20px; font-size: 14px; color: #666;">
          You may now confidently navigate the Mentor-Protégé Program portal.
        </p>
      </div>
    `,
    icon: 'success',
    confirmButtonText: 'Close',
    confirmButtonColor: '#243d80',
    customClass: {
      popup: 'modal-gold-border'
    }
  });
}
