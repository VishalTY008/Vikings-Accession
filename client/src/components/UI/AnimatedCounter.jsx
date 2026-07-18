import useAnimatedCounter from '../../hooks/useAnimatedCounter';

export default function AnimatedCounter({ end, duration = 2000, suffix = '', prefix = '' }) {
  const count = useAnimatedCounter(end, duration);
  return (
    <span id={`counter-${end}`}>
      {prefix}{count.toLocaleString()}{suffix}
    </span>
  );
}
