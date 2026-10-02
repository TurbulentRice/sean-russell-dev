import { useEffect, useState } from 'react';

/** Proves an island hydrates: the timestamp is set in the browser, never at build. */
export default function Counter() {
  const [count, setCount] = useState(0);
  const [hydrated, setHydrated] = useState<string | null>(null);
  useEffect(() => setHydrated(new Date().toLocaleTimeString()), []);

  return (
    <div className="island-demo">
      <p className="label">{hydrated ? `Hydrated at ${hydrated}` : 'Static HTML, not hydrated yet'}</p>
      <button type="button" onClick={() => setCount((c) => c + 1)}>
        Clicked {count} {count === 1 ? 'time' : 'times'}
      </button>
    </div>
  );
}
