// script.js

document.addEventListener('DOMContentLoaded', () => {
  const screen1 = document.getElementById('screen1');
  const screen2 = document.getElementById('screen2');
  const yesBtn = document.getElementById('yesBtn');
  const noBtn = document.getElementById('noBtn');
  const btnRow = document.getElementById('btnRow');

  let noBtnPlaced = false; // tracks whether the "No" button has left its original flow position

  // ---- Bulletproof "No" Button Evasion ----
  function teleportNoButton(event) {
    // Prevent the mobile "ghost click" that fires after touchstart on old coordinates
    if (event) event.preventDefault();

    const btnWidth = noBtn.offsetWidth;
    const btnHeight = noBtn.offsetHeight;
    const safetyPadding = 20;

    // Dynamically calculated safe zone so the button never renders off-screen
    const maxX = window.innerWidth - btnWidth - safetyPadding;
    const maxY = window.innerHeight - btnHeight - safetyPadding;

    // Clamp to a minimum of 0 in case viewport is smaller than the button itself
    const safeMaxX = Math.max(maxX, 0);
    const safeMaxY = Math.max(maxY, 0);

    const randomX = Math.random() * safeMaxX;
    const randomY = Math.random() * safeMaxY;

    // Switch to fixed positioning (only once) so left/top actually move it around the viewport
    if (!noBtnPlaced) {
      noBtn.style.position = 'fixed';
      noBtnPlaced = true;
    }

    noBtn.style.left = `${randomX}px`;
    noBtn.style.top = `${randomY}px`;
  }

  // Bind to all events needed to outrun touch-delay and hover tricks
  noBtn.addEventListener('pointerdown', teleportNoButton);
  noBtn.addEventListener('touchstart', teleportNoButton, { passive: false });
  noBtn.addEventListener('mouseover', teleportNoButton);

  // Recalculate safe zone if the viewport resizes/rotates while button is placed
  window.addEventListener('resize', () => {
    if (noBtnPlaced) teleportNoButton();
  });

  // ---- "Yes" Button: Smooth Screen Transition ----
  yesBtn.addEventListener('click', () => {
    // Fade out Screen 1
    screen1.classList.add('fade-out');

    setTimeout(() => {
      screen1.classList.add('hidden');

      // Fade in Screen 2
      screen2.classList.remove('hidden');
      // Force reflow so the transition actually plays
      void screen2.offsetWidth;
      screen2.classList.add('fade-in');

      startHeartShower();
    }, 500); // matches the 0.5s CSS transition duration
  });

  // ---- Heart Shower ----
  function startHeartShower() {
    const heartCount = 30;

    for (let i = 0; i < heartCount; i++) {
      setTimeout(() => createHeart(), i * 150);
    }
  }

  function createHeart() {
    const heart = document.createElement('span');
    heart.classList.add('heart');
    heart.textContent = '❤️';

    const size = Math.random() * 1.5 + 1; // 1rem to 2.5rem
    const leftPos = Math.random() * 100; // vw
    const duration = Math.random() * 2 + 3; // 3s to 5s

    heart.style.fontSize = `${size}rem`;
    heart.style.left = `${leftPos}vw`;
    heart.style.animationDuration = `${duration}s`;

    document.body.appendChild(heart);

    // Clean up after animation ends to prevent memory leaks
    heart.addEventListener('animationend', () => {
      heart.remove();
    });
  }
});
