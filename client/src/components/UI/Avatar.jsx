export default function Avatar({ src, name = '', size = 'md', className = '' }) {
  const sizes = { sm: 'w-8 h-8 text-xs', md: 'w-10 h-10 text-sm', lg: 'w-14 h-14 text-lg', xl: 'w-20 h-20 text-2xl' };

  if (src) {
    return (
      <img src={src} alt={name} className={`${sizes[size]} rounded-full object-cover ring-2 ring-white dark:ring-dark-800 ${className}`} />
    );
  }

  return (
    <div className={`${sizes[size]} rounded-full gradient-bg flex items-center justify-center text-white font-bold ring-2 ring-white dark:ring-dark-800 ${className}`}>
      {name?.charAt(0)?.toUpperCase() || 'U'}
    </div>
  );
}
