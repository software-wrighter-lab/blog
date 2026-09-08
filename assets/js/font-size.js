// Font Size Control Script
// Allows users to adjust font size with persistence

(function() {
  'use strict';

  const FONT_SIZE_KEY = 'sw-lab-font-size';
  const PREFS_ACK_KEY = 'sw-lab-prefs-ack';
  const MIN_SIZE = 50;    // 50% minimum
  const MAX_SIZE = 180;   // 180% maximum
  const STEP = 10;        // 10% increments
  const DEFAULT_SIZE = 100;      // Browser default (16px base)
  const OLD_DEFAULT_SIZE = 110;  // Previous default for migration

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

  function getStoredSize() {
    if (!storageAvailable()) return DEFAULT_SIZE;
    const stored = localStorage.getItem(FONT_SIZE_KEY);
    return stored ? parseInt(stored, 10) : null;
  }

  function setStoredSize(size) {
    if (!storageAvailable()) return;
    localStorage.setItem(FONT_SIZE_KEY, size.toString());
  }

  function isAcknowledged() {
    if (!storageAvailable()) return true; // Don't show tooltips if no storage
    return localStorage.getItem(PREFS_ACK_KEY) === 'true';
  }

  function setAcknowledged() {
    if (!storageAvailable()) return;
    localStorage.setItem(PREFS_ACK_KEY, 'true');
    // Dispatch event so preferences.js can react
    window.dispatchEvent(new CustomEvent('swlab-prefs-acknowledged'));
  }

  function applySize(size) {
    // Apply to html element so all text scales
    document.documentElement.style.fontSize = size + '%';
    updateButtons(size);
  }

  function updateButtons(size) {
    const decreaseBtn = document.getElementById('font-decrease');
    const increaseBtn = document.getElementById('font-increase');
    const resetBtn = document.getElementById('font-reset');

    if (decreaseBtn) {
      decreaseBtn.disabled = size <= MIN_SIZE;
    }
    if (increaseBtn) {
      increaseBtn.disabled = size >= MAX_SIZE;
    }
    if (resetBtn) {
      resetBtn.style.fontWeight = size === DEFAULT_SIZE ? 'normal' : 'bold';
    }
  }

  function changeSize(delta) {
    let size = (getStoredSize() || DEFAULT_SIZE) + delta;
    size = Math.max(MIN_SIZE, Math.min(MAX_SIZE, size));
    setStoredSize(size);
    applySize(size);
    // Mark as acknowledged when user changes size
    if (!isAcknowledged()) {
      setAcknowledged();
    }
  }

  function resetSize() {
    setStoredSize(DEFAULT_SIZE);
    applySize(DEFAULT_SIZE);
    // Mark as acknowledged when user resets
    if (!isAcknowledged()) {
      setAcknowledged();
    }
  }

  function initFontSize() {
    let storedSize = getStoredSize();

    // Migration logic: if user had old default and hasn't acknowledged,
    // migrate them to new default
    if (storedSize === OLD_DEFAULT_SIZE && !isAcknowledged()) {
      // User was on old default, migrate to new default
      storedSize = DEFAULT_SIZE;
      setStoredSize(DEFAULT_SIZE);
    } else if (storedSize === null) {
      // First time visitor, use new default
      storedSize = DEFAULT_SIZE;
      // Don't store yet - let them see the tooltip first
    }

    applySize(storedSize);
  }

  function initButtons() {
    const decreaseBtn = document.getElementById('font-decrease');
    const increaseBtn = document.getElementById('font-increase');
    const resetBtn = document.getElementById('font-reset');

    if (decreaseBtn) {
      decreaseBtn.addEventListener('click', function() {
        changeSize(-STEP);
      });
    }
    if (increaseBtn) {
      increaseBtn.addEventListener('click', function() {
        changeSize(STEP);
      });
    }
    if (resetBtn) {
      resetBtn.addEventListener('click', resetSize);
    }
  }

  function init() {
    initFontSize();
    initButtons();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Expose for debugging and preferences.js
  window.swlabFontSize = {
    reset: resetSize,
    getDefault: function() { return DEFAULT_SIZE; },
    isAcknowledged: isAcknowledged,
    setAcknowledged: setAcknowledged
  };
})();
