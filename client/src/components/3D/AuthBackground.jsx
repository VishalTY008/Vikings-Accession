export default function AuthBackground() {
  return (
    <div className="fixed inset-0 z-0" aria-hidden="true">
      <div className="absolute inset-0 bg-gradient-to-br from-primary-50 via-white to-secondary-50 dark:from-dark-900 dark:via-dark-800 dark:to-dark-900" />
      <div className="floating-orb bg-primary-500" style={{ width: 500, height: 500, top: '-10%', right: '-10%', animationDelay: '0s', opacity: 0.08 }} />
      <div className="floating-orb bg-secondary-500" style={{ width: 400, height: 400, bottom: '-10%', left: '-5%', animationDelay: '-5s', opacity: 0.06 }} />
      <div className="floating-orb bg-accent-500" style={{ width: 300, height: 300, top: '50%', left: '50%', animationDelay: '-10s', opacity: 0.04 }} />
      <svg className="noise-overlay" aria-hidden="true">
        <filter id="auth-noise">
          <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
        </filter>
        <rect width="100%" height="100%" filter="url(#auth-noise)" />
      </svg>
    </div>
  );
}
