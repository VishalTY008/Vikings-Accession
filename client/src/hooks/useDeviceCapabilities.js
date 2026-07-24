import { useState, useEffect } from 'react';

export default function useDeviceCapabilities() {
  const [capabilities, setCapabilities] = useState({
    isMobile: false,
    isTablet: false,
    prefersReducedMotion: false,
    gpuTier: 'high',
    particleCount: 1500,
    quality: 'high',
  });

  useEffect(() => {
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
      || window.innerWidth < 768;
    const isTablet = window.innerWidth >= 768 && window.innerWidth < 1024;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let gpuTier = 'high';
    let particleCount = 1500;
    let quality = 'high';

    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      if (gl) {
        const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
        if (debugInfo) {
          const renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
          if (/Intel|UHD|HD Graphics/i.test(renderer)) {
            gpuTier = 'low';
            particleCount = 300;
            quality = 'low';
          } else if (/Mesa|SwiftShader|llvmpipe/i.test(renderer)) {
            gpuTier = 'low';
            particleCount = 200;
            quality = 'low';
          }
        }
      }
    } catch (e) {
      gpuTier = 'medium';
      particleCount = 500;
      quality = 'medium';
    }

    if (isMobile) {
      particleCount = Math.min(particleCount, 200);
      if (quality === 'high') quality = 'medium';
    }

    if (prefersReducedMotion) {
      particleCount = 0;
    }

    setCapabilities({ isMobile, isTablet, prefersReducedMotion, gpuTier, particleCount, quality });
  }, []);

  return capabilities;
}
