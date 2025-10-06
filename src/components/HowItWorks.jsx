import React from 'react';

export default function HowItWorks() {
  const steps = [
    { title: 'Post a Project', desc: 'Describe your need — website, design, or marketing.' },
    { title: 'Get Proposals', desc: 'Local freelancers apply quickly.' },
    { title: 'Pay via Escrow', desc: 'Secure payments with milestone control.' },
    { title: 'Rate & Repeat', desc: 'Leave feedback & build your trusted team.' }
  ];

  return (
    <section className="mt-10">
      <h3 className="text-xl font-bold mb-4">How it works</h3>
      <div className="grid md:grid-cols-4 gap-4">
        {steps.map((s, i) => (
          <div key={i} className="glass p-4 rounded-lg">
            <div className="text-3xl font-bold text-accent">{i + 1}</div>
            <div className="font-semibold mt-2">{s.title}</div>
            <div className="text-sm text-neutral-400 mt-1">{s.desc}</div>
          </div>
        ))}
      </div>
    </section>
  );
}