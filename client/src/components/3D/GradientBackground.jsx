export default function GradientBackground() {
  return (
    <div className="gradient-mesh-bg" aria-hidden="true">
      <div className="floating-orb bg-primary-500" style={{ width: 400, height: 400, top: '10%', left: '10%', animationDelay: '0s' }} />
      <div className="floating-orb bg-secondary-500" style={{ width: 300, height: 300, top: '60%', right: '10%', animationDelay: '-4s' }} />
      <div className="floating-orb bg-accent-500" style={{ width: 250, height: 250, bottom: '10%', left: '40%', animationDelay: '-8s' }} />
    </div>
  );
}
