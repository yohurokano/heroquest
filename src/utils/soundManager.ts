import { Howl } from 'howler';

export const sounds = {
  click: new Howl({ src: ['src/assets/sounds/click.mp3'], volume: 0.5 }),
  xp: new Howl({ src: ['src/assets/sounds/xp.mp3'], volume: 0.6 }),
  levelUp: new Howl({ src: ['src/assets/sounds/level-up.wav'], volume: 0.7 }),
  success: new Howl({ src: ['src/assets/sounds/success.mp3'], volume: 0.7}),
  error: new Howl({ src: ['src/assests/sounds/eror.mp3'], volume: 0.7}),
};

export function playSound(name: keyof typeof sounds) {
  sounds[name].play();
}
