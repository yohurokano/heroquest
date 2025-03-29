// src/utils/sparkle.ts
import confetti from 'canvas-confetti';

export function triggerSparkles() {
  confetti({
    particleCount: 60,
    spread: 70,
    origin: { y: 0.6 },
    zIndex: 1000,
  });
}
