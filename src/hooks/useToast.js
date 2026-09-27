import { useCallback, useEffect, useRef, useState } from 'react';

export function useToast() {
  const [toasts, setToasts] = useState([]);
  const nextId = useRef(0);
  const timers = useRef(new Set());

  useEffect(() => () => {
    timers.current.forEach((timer) => window.clearTimeout(timer));
    timers.current.clear();
  }, []);

  const showToast = useCallback((message) => {
    nextId.current += 1;
    const id = nextId.current;
    setToasts(prev => [...prev, { id, message }]);
    const timer = window.setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
      timers.current.delete(timer);
    }, 2000);
    timers.current.add(timer);
  }, []);

  return { toasts, showToast };
}
