import React from 'react';
import  { motion } from 'framer-motion';
// no-op reference so ESLint recognizes `motion` as used when we use JSX namespace like <motion.h1>
void motion;
import SpinWheel from './SpinWheel';

export default function Hero() {
  return (
    <section className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
      <div>
        <motion.h1 initial={{ y: -10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.6 }} className="text-4xl md:text-5xl font-extrabold leading-tight">
          Find talented freelancers <span className="text-accent">fast</span>, hire local, pay local.
        </motion.h1>
        <motion.p initial={{ y: 8, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.8 }} className="mt-4 text-neutral-300 max-w-xl">
          FreelanceHub connects Nepali businesses & freelancers with trust-first tools — escrow, referrals, and viral offers to grow fast.
        </motion.p>

        <div className="mt-6 flex gap-3">
          <a href="#post" className="px-5 py-3 rounded-md bg-accent text-black font-medium shadow hover:scale-105 transform transition">Post a Project</a>
          <a href="#browse" className="px-5 py-3 rounded-md border border-neutral-700 text-neutral-200 hover:bg-neutral-800">Browse Freelancers</a>
        </div>

        <div className="mt-6 text-sm text-neutral-400">
          <strong>Limited viral offers:</strong> try our Spin & Win to earn discounts or a free offer.
        </div>
      </div>

      <div className="relative">
        <div className="glass p-6 rounded-2xl spin-shadow">
          <SpinWheel />
        </div>
      </div>
    </section>
  );
}
