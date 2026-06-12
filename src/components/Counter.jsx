import { useEffect, useState } from 'react';

export default function Counter({ value, suffix = '' }) {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    let frame;
    const start = performance.now();
    const from = display;
    const delta = value - from;
    const tick = (now) => {
      const progress = Math.min((now - start) / 650, 1);
      setDisplay(Math.round(from + delta * progress));
      if (progress < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [value]);

  return <>{display}{suffix}</>;
}

