export default function DashboardEnhancement({ children }) {
  return (
    <div className="relative">
      {/* Subtle animated gradient at top */}
      <div
        className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary-500 via-secondary-500 to-accent-500 opacity-60"
        aria-hidden="true"
      />

      {children}
    </div>
  );
}
