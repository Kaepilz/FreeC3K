import React from 'react';
import { motion } from 'framer-motion';
// ensure motion isn't flagged as unused by eslint when used as JSX namespace
void motion;
import { safeGetArray } from '../lib/safeLocal';

/**
 * Simple spin wheel demo. No images required.
 * Wins are simulated. This is frontend-only and uses probabilities.
 */
const SEGMENTS = [
  { label: 'Try Again', chance: 40, color: 'from-neutral-700 to-neutral-800' },
  { label: '50% OFF', chance: 25, color: 'from-indigo-700 to-indigo-800' },
  { label: 'Free Logo', chance: 15, color: 'from-violet-700 to-violet-800' },
  { label: 'Free Website design', chance: 5, color: 'from-yellow-600 to-yellow-700' },
  { label: '25% OFF', chance: 15, color: 'from-teal-700 to-teal-800' }
];

function weightedPick() {
  const total = SEGMENTS.reduce((s, g) => s + g.chance, 0);
  let r = Math.random() * total;
  for (const seg of SEGMENTS) {
    if (r < seg.chance) return seg;
    r -= seg.chance;
  }
  return SEGMENTS[0];
}

export default function SpinWheel() {
  const [spinning, setSpinning] = React.useState(false);
  const [result, setResult] = React.useState(null);

  const spin = () => {
    if (spinning) return;
    setSpinning(true);
    setResult(null);
    // simulate spin duration
    setTimeout(() => {
      const pick = weightedPick();
      setResult(pick);
      setSpinning(false);
      // save analytics to localStorage for demo
      const wins = safeGetArray('wins');
      wins.unshift({ ...pick, when: new Date().toISOString() });
      localStorage.setItem('wins', JSON.stringify(wins.slice(0, 50)));
    }, 1600);
  };

  return (
    <div className="flex flex-col md:flex-column gap-6 items-center">
      <div className="w-64 h-64 rounded-full relative flex items-center justify-center">
        <motion.div
          animate={spinning ? { rotate: 720 } : { rotate: 0 }}
          transition={{ duration: 1.6, ease: 'easeOut' }}
          className="w-full h-full rounded-full spin-shadow flex items-center justify-center"
          style={{ background: 'conic-gradient(from 0deg, rgba(124,58,237,0.22), rgba(6,182,212,0.06))' }}
        >
          <div className="absolute w-40 h-40 rounded-full flex items-center justify-center glass">
            <div className="text-center">
              <div className="text-sm text-neutral-300">Spin & Win</div>
              <div className="text-xl font-bold text-white">Tap to try</div>
              <div className="text-xs text-neutral-400 mt-1">Limited-time offers</div>
            </div>
          </div>
        </motion.div>
        <div className="absolute -bottom-6 md:bottom-0 md:-right-10">
          <button onClick={spin} className="px-4 py-2 bg-accent text-black rounded-md shadow hover:scale-105 transform">
            {spinning ? 'Spinning...' : 'Spin'}
          </button>
        </div>
      </div>

      <div className="text-sm text-neutral-300 max-w-sm">
        <h4 className="text-lg font-semibold mb-2">Daily Spin</h4>
        <p>If you win a big prize you may need to invite friends or complete a small task to claim it</p>

        <div className="mt-4">
          <div className="text-xs text-neutral-400">Recent wins</div>
          <ul className="mt-2 space-y-2">
            {safeGetArray('wins').slice(0,5).map((w, i) => (
              <li key={i} className="text-sm text-neutral-200">{w.label} • <span className="text-neutral-400">{new Date(w.when).toLocaleString()}</span></li>
            ))}
            {(!safeGetArray('wins').length) && <li className="text-neutral-500">No winners yet — be first!</li>}
          </ul>
        </div>

        {result && (
          <div className="mt-4 p-3 rounded bg-neutral-800 border border-neutral-700 text-neutral-100">
            <div className="font-semibold">You won: {result.label}</div>
            <div className="text-xs text-neutral-400 mt-1">Follow the instructions in your dashboard to claim (this is a demo).</div>
          </div>
        )}
      </div>
    </div>
  );
}
