import React from 'react';
import { CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const features = [
  { title: 'Local payments (eSewa/Khalti)', desc: 'Pay & receive easily in Nepal.' },
  { title: 'Starter Boost for new freelancers', desc: 'Priority visibility for first projects.' },
  { title: 'Trusted Escrow', desc: 'Money held until job completion.' },
  { title: 'AI proposal helper (demo)', desc: 'Write better proposals in seconds.' }
];

export default function Features() {
  return (
    <section className="mt-12 grid md:grid-cols-2 gap-6">
      {features.map((f, i) => (
        <motion.div key={f.title} className="glass p-5 rounded-xl" initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: i * 0.12 }}>
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-md bg-neutral-800">
              <CheckCircle size={20} className="text-accent" />
            </div>
            <div>
              <div className="font-semibold">{f.title}</div>
              <div className="text-sm text-neutral-400">{f.desc}</div>
            </div>
          </div>
        </motion.div>
      ))}
    </section>
  );
}
