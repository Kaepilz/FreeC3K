import React from 'react';
import Hero from '../components/Hero';
import Features from '../components/Features';
import HowItWorks from '../components/HowItWorks';

export default function Home() {
  return (
    <div>
      <Hero />
      <Features />
      <HowItWorks />

      <section className="mt-12 glass p-6 rounded-xl">
        <h3 className="text-lg font-bold">Featured freelancers</h3>
        <div className="mt-4 grid md:grid-cols-3 gap-4">
          {[1,2,3].map(i => (
            <div key={i} className="p-4 rounded-lg border border-neutral-800">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-accent border border-neutral-800"></div>
                <div>
                  <div className="font-semibold">Freelancer {i}</div>
                  <div className="text-xs text-neutral-400">UI/UX & Web Dev</div>
                </div>
              </div>
              <div className="mt-3 text-sm text-neutral-300">Short description of service and strengths. Fast delivery, good reviews.</div>
              <div className="mt-3 flex gap-2">
                <button className="px-3 py-1 rounded border border-neutral-700 text-sm">View profile</button>
                <button className="px-3 py-1 rounded bg-accent text-black text-sm">Hire</button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

