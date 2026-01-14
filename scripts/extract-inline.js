const fs = require('fs');
const path = require('path');

console.log('=== MPP Interactive Training - Code Extraction Script ===\n');

// Read the original index.html
const indexPath = path.join(__dirname, '..', 'index.html');
console.log('Reading index.html...');
const html = fs.readFileSync(indexPath, 'utf-8');

// Extract CSS (between <style> and </style> tags)
console.log('Extracting CSS...');
const styleMatch = html.match(/<style>([\s\S]*?)<\/style>/);
if (!styleMatch) {
  console.error('ERROR: Could not find <style> block!');
  process.exit(1);
}
const css = styleMatch[1].trim();

// Extract JavaScript (between last <script> and </script> tags)
console.log('Extracting JavaScript...');
// Find all script blocks
const scriptMatches = html.matchAll(/<script>([\s\S]*?)<\/script>/g);
const scripts = [...scriptMatches];

// The large inline script is the last one (before </body>)
if (scripts.length === 0) {
  console.error('ERROR: Could not find <script> blocks!');
  process.exit(1);
}

// Get the last (largest) script block which contains the main application logic
const mainScript = scripts[scripts.length - 1][1].trim();

console.log(`\nExtracted ${css.split('\n').length} lines of CSS`);
console.log(`Extracted ${mainScript.split('\n').length} lines of JavaScript`);

// Split CSS into logical files based on comments and selectors
console.log('\n--- Splitting CSS into modules ---');

const cssModules = {
  'base.css': extractCSS(css, [
    '/* Training UI Styles */',
    '#training-progress',
    '#training-progress-bar'
  ], [
    '#training-controls'
  ]),

  'training-controls.css': extractCSS(css, [
    '#training-controls',
    '#show-training-btn',
    '#training-controls button',
    '.hide-btn',
    '@keyframes buttonPulse',
    '@keyframes arrowBounce',
    'button-highlighted'
  ], [
    '/* === DARKER MODAL OVERLAYS ==='
  ]),

  'tour.css': extractCSS(css, [
    '/* === DARKER MODAL OVERLAYS ===',
    '.shepherd-',
    '/* === TOUR SCROLL LOCK',
    'body.tour-active',
    'body.scroll-locked',
    '@keyframes modalFadeIn',
    '@keyframes overlayFadeIn'
  ], [
    '/* === DARKER PROTÉGÉ SECTION ==='
  ]),

  'hotspots.css': extractCSS(css, [
    '.training-hotspot',
    '@keyframes pulse'
  ], [
    '.modal '
  ]),

  'modals.css': extractCSS(css, [
    '.modal',
    '.swal2-',
    '/* === REDESIGNED MODAL STYLES ===',
    '.modal-gold-border',
    '.play-circle',
    '.audio-timeline',
    '.modal-logo-icon',
    '.modal-title-redesign',
    '.modal-body-redesign',
    'no-icon-border'
  ], [
    '/* END OF STYLES */'
  ])
};

// Write CSS files
const cssDir = path.join(__dirname, '..', 'src', 'css');
fs.mkdirSync(cssDir, { recursive: true });

Object.entries(cssModules).forEach(([filename, content]) => {
  const filePath = path.join(cssDir, filename);
  fs.writeFileSync(filePath, content.trim() + '\n', 'utf-8');
  console.log(`  ✓ Created ${filename} (${content.split('\n').length} lines)`);
});

// Create main.css that imports all modules
const mainCSS = `/* MPP Interactive Training - Main Styles */
/* Modular CSS architecture for maintainability */

@import url('base.css');
@import url('training-controls.css');
@import url('tour.css');
@import url('hotspots.css');
@import url('modals.css');
`;

fs.writeFileSync(path.join(cssDir, 'main.css'), mainCSS, 'utf-8');
console.log(`  ✓ Created main.css (imports all modules)`);

console.log('\n--- Splitting JavaScript into modules ---');

// For JavaScript, we'll create stub files with extracted sections
// This is more complex and may require manual editing

const jsDir = path.join(__dirname, '..', 'src', 'js');
fs.mkdirSync(jsDir, { recursive: true });

// Extract key JavaScript sections
const jsModules = {
  'config.js': extractJS(mainScript, 'config', 300),
  'state.js': extractJS(mainScript, 'trainingState', 100),
  'utils.js': extractJS(mainScript, 'function scroll', 100),
  'welcome-modal.js': extractJS(mainScript, 'function showWelcomeModal', 200),
  'tour.js': extractJS(mainScript, 'function startTour', 400),
  'hotspots.js': extractJS(mainScript, 'HOTSPOTS', 300),
  'quiz.js': extractJS(mainScript, 'function takeQuiz', 300),
  'progress.js': extractJS(mainScript, 'function updateProgress', 150),
  'controls.js': extractJS(mainScript, 'training-controls', 200),
  'link-interceptor.js': extractJS(mainScript, 'LINK_DESCRIPTIONS', 150)
};

// Note: Due to complexity, we'll save the entire script for manual splitting
const fullScriptPath = path.join(jsDir, '_full-script-backup.js');
fs.writeFileSync(fullScriptPath, mainScript, 'utf-8');
console.log(`  ✓ Saved full script backup for manual extraction`);
console.log(`    (${mainScript.split('\n').length} lines total)`);

console.log('\n=== Extraction Complete ===');
console.log('\nNext steps:');
console.log('1. Review extracted CSS files in src/css/');
console.log('2. Manually split JavaScript from _full-script-backup.js');
console.log('3. Create new modular index.html');
console.log('4. Test thoroughly\n');

// Helper function to extract CSS sections
function extractCSS(css, includePatterns, stopPatterns = []) {
  const lines = css.split('\n');
  let result = [];
  let capturing = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Check if we should stop
    if (stopPatterns.some(pattern => line.includes(pattern))) {
      if (capturing) break;
    }

    // Check if we should start capturing
    if (includePatterns.some(pattern => line.includes(pattern))) {
      capturing = true;
    }

    if (capturing) {
      result.push(line);

      // Stop capturing after closing brace (end of rule)
      if (line.trim() === '}' && !line.includes('@keyframes')) {
        // Check if next rule matches our patterns
        let shouldContinue = false;
        for (let j = i + 1; j < Math.min(i + 5, lines.length); j++) {
          if (includePatterns.some(pattern => lines[j].includes(pattern))) {
            shouldContinue = true;
            break;
          }
        }
        if (!shouldContinue) {
          capturing = false;
        }
      }
    }
  }

  return result.join('\n');
}

// Helper function to extract JavaScript sections
function extractJS(script, keyword, maxLines = 100) {
  const lines = script.split('\n');
  let result = [];
  let foundStart = false;

  for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes(keyword)) {
      foundStart = true;
    }

    if (foundStart) {
      result.push(lines[i]);
      if (result.length >= maxLines) break;
    }
  }

  return result.join('\n');
}
