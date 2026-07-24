import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

let initialized = false;

export function registerGSAP() {
  if (initialized) return;
  gsap.registerPlugin(ScrollTrigger);
  ScrollTrigger.config({ limitCallbacks: true });
  initialized = true;
}

export function refreshScrollTrigger() {
  requestAnimationFrame(() => {
    ScrollTrigger.refresh();
  });
}

export function killAllScrollTriggers() {
  ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
}

export { gsap, ScrollTrigger };
