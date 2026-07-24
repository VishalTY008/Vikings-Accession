export default function Avatar({ src, name = '', size = 'md', online = false, className = '' }) {
  const sizes = { sm: 'w-8 h-8 text-xs', md: 'w-10 h-10 text-sm', lg: 'w-14 h-14 text-lg', xl: 'w-20 h-20 text-2xl' };

  return (
    <div className={`relative inline-block ${className}`}>
      {src ? (
        <img src={src} alt={name} className={`${sizes[size]} rounded-full object-cover ring-2 ring-white dark:ring-dark-800`} />
      ) : (
        <div className={`${sizes[size]} rounded-full gradient-bg flex items-center justify-center text-white font-bold ring-2 ring-white dark:ring-dark-800`}>
          {name?.charAt(0)?.toUpperCase() || 'U'}
        </div>
      )}
      {online && (
        <span className="absolute bottom-0 right-0 w-3 h-3 bg-accent-500 rounded-full ring-2 ring-white dark:ring-dark-800">
          <span className="absolute inset-0 rounded-full bg-accent-500 animate-ping opacity-75" />
        </span>
      )}
    </div>
  );
}
