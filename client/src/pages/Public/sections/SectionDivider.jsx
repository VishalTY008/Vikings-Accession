export default function SectionDivider({ variant = 'default' }) {
  if (variant === 'wave') {
    return (
      <div className="w-full overflow-hidden leading-none" aria-hidden="true">
        <svg viewBox="0 0 1200 40" className="w-full h-10" preserveAspectRatio="none">
          <path
            d="M0,20 C200,40 400,0 600,20 C800,40 1000,0 1200,20 L1200,40 L0,40 Z"
            className="fill-gray-50/50 dark:fill-dark-800/30"
          />
        </svg>
      </div>
    );
  }

  return (
    <div className="py-4 flex items-center justify-center" aria-hidden="true">
      <div className="h-px w-full max-w-2xl bg-gradient-to-r from-transparent via-primary-500/20 to-transparent" />
    </div>
  );
}
