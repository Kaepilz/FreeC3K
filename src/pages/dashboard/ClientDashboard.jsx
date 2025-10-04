import React from 'react';
import { safeParse } from '../../lib/safeLocal';

export default function ClientDashboard() {
  const user = safeParse('user', null);
  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Client Dashboard</h2>
          <div className="text-sm text-neutral-400">Welcome back, {user?.name}</div>
        </div>
        <div>
          <button className="px-4 py-2 bg-accent text-black rounded">Post New Project</button>
        </div>
      </div>

      <div className="mt-6 grid md:grid-cols-3 gap-4">
        <div className="glass p-4 rounded">
          <div className="text-sm text-neutral-400">Active Projects</div>
          <div className="text-2xl font-bold mt-2">3</div>
        </div>
        <div className="glass p-4 rounded">
          <div className="text-sm text-neutral-400">Pending Proposals</div>
          <div className="text-2xl font-bold mt-2">8</div>
        </div>
        <div className="glass p-4 rounded">
          <div className="text-sm text-neutral-400">Escrow Balance</div>
          <div className="text-2xl font-bold mt-2">Rs. 12,500</div>
        </div>
      </div>

      <section className="mt-6 glass p-4 rounded">
        <h3 className="font-semibold">Recent Activity</h3>
        <ul className="mt-3 text-sm text-neutral-300 space-y-2">
          <li>Proposal from Freelancer A for Website Landing page</li>
          <li>Milestone completed on Project X</li>
          <li>Invoice paid to Freelancer B</li>
        </ul>
      </section>
    </div>
  );
}
