import { useEffect, useRef, useState } from 'react';

// Only mounts children when the placeholder scrolls into view (within rootMargin).
// Once mounted, stays mounted. Use to defer expensive WebGL / data-bound sections.
export default function LazyMount({ children, rootMargin = '300px', minHeight = 400, placeholder = null }) {
  const ref = useRef(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (mounted) return;
    if (typeof IntersectionObserver === 'undefined') {
      // Fallback: mount immediately
      setMounted(true);
      return;
    }
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setMounted(true);
          io.disconnect();
        }
      },
      { rootMargin },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [mounted, rootMargin]);

  if (mounted) return children;
  return <div ref={ref} style={{ minHeight }}>{placeholder}</div>;
}
