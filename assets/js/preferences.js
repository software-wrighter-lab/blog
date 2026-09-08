// Preferences Onboarding Script
// Shows tooltips for first-time visitors to help them discover font/theme controls

(function() {
  'use strict';

  const PREFS_ACK_KEY = 'sw-lab-prefs-ack';

  // Check if localStorage is available
  function storageAvailable() {
    try {
      const test = '__storage_test__';
      localStorage.setItem(test, test);
      localStorage.removeItem(test);
      return true;
    } catch (e) {
      return false;
    }
  }

  function isAcknowledged() {
    if (!storageAvailable()) return true; // Don't show if no storage
    return localStorage.getItem(PREFS_ACK_KEY) === 'true';
  }

  function setAcknowledged() {
    if (!storageAvailable()) return;
    localStorage.setItem(PREFS_ACK_KEY, 'true');
  }

  function createTooltipOverlay() {
    // Create overlay container
    const overlay = document.createElement('div');
    overlay.className = 'prefs-onboarding-overlay';
    overlay.innerHTML = `
      <div class="prefs-onboarding-backdrop"></div>
      <div class="prefs-onboarding-content">
        <div class="prefs-onboarding-message">
          <h3>Customize Your Reading Experience</h3>
          <p>Adjust text size and color theme using the controls in the header.</p>
          <div class="prefs-onboarding-controls-preview">
            <div class="prefs-preview-item">
              <span class="prefs-preview-label">Font Size:</span>
              <span class="prefs-preview-buttons">A- A A+</span>
            </div>
            <div class="prefs-preview-item">
              <span class="prefs-preview-label">Theme:</span>
              <span class="prefs-preview-icon">☀/☾</span>
            </div>
          </div>
          <button class="prefs-onboarding-accept" type="button">Got it!</button>
        </div>
        <div class="prefs-onboarding-pointer prefs-pointer-font"></div>
        <div class="prefs-onboarding-pointer prefs-pointer-theme"></div>
      </div>
    `;
    return overlay;
  }

  function positionPointers(overlay) {
    const fontControls = document.querySelector('.font-size-controls');
    const themeToggle = document.querySelector('.theme-toggle');
    const fontPointer = overlay.querySelector('.prefs-pointer-font');
    const themePointer = overlay.querySelector('.prefs-pointer-theme');

    if (fontControls && fontPointer) {
      const rect = fontControls.getBoundingClientRect();
      fontPointer.style.left = (rect.left + rect.width / 2) + 'px';
      fontPointer.style.top = (rect.bottom + 10) + 'px';
      fontPointer.style.display = 'block';
    }

    if (themeToggle && themePointer) {
      const rect = themeToggle.getBoundingClientRect();
      themePointer.style.left = (rect.left + rect.width / 2) + 'px';
      themePointer.style.top = (rect.bottom + 10) + 'px';
      themePointer.style.display = 'block';
    }
  }

  function showOnboarding() {
    const overlay = createTooltipOverlay();
    document.body.appendChild(overlay);

    // Position pointers after a brief delay to ensure layout is complete
    setTimeout(function() {
      positionPointers(overlay);
    }, 100);

    // Reposition on resize
    const resizeHandler = function() {
      positionPointers(overlay);
    };
    window.addEventListener('resize', resizeHandler);

    // Handle accept button
    const acceptBtn = overlay.querySelector('.prefs-onboarding-accept');
    if (acceptBtn) {
      acceptBtn.addEventListener('click', function() {
        dismissOnboarding(overlay, resizeHandler);
      });
    }

    // Also dismiss on backdrop click
    const backdrop = overlay.querySelector('.prefs-onboarding-backdrop');
    if (backdrop) {
      backdrop.addEventListener('click', function() {
        dismissOnboarding(overlay, resizeHandler);
      });
    }

    // Also dismiss on Escape key
    const escHandler = function(e) {
      if (e.key === 'Escape') {
        dismissOnboarding(overlay, resizeHandler);
        document.removeEventListener('keydown', escHandler);
      }
    };
    document.addEventListener('keydown', escHandler);
  }

  function dismissOnboarding(overlay, resizeHandler) {
    setAcknowledged();
    if (overlay && overlay.parentNode) {
      overlay.classList.add('prefs-onboarding-fade-out');
      setTimeout(function() {
        if (overlay.parentNode) {
          overlay.parentNode.removeChild(overlay);
        }
      }, 300);
    }
    if (resizeHandler) {
      window.removeEventListener('resize', resizeHandler);
    }
  }

  function init() {
    // Don't show if localStorage unavailable or already acknowledged
    if (!storageAvailable() || isAcknowledged()) {
      return;
    }

    // Wait a moment for the page to settle, then show onboarding
    setTimeout(function() {
      // Double-check in case another script set it
      if (!isAcknowledged()) {
        showOnboarding();
      }
    }, 500);

    // Listen for acknowledgment from other scripts
    window.addEventListener('swlab-prefs-acknowledged', function() {
      const overlay = document.querySelector('.prefs-onboarding-overlay');
      if (overlay) {
        dismissOnboarding(overlay, null);
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
