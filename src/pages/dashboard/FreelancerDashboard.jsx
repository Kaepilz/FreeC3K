import React from 'react';
import { safeParse } from '../../lib/safeLocal';

export default function FreelancerDashboard() {
  const user = safeParse('user', null);
  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Freelancer Dashboard</h2>
          <div className="text-sm text-neutral-400">Hi, {user?.name}</div>
        </div>
        <div>
          <button className="px-4 py-2 bg-accent text-black rounded">Edit Profile</button>
        </div>
      </div>

      <div className="mt-6 grid md:grid-cols-3 gap-4">
        <div className="glass p-4 rounded">
          <div className="text-sm text-neutral-400">Active Contracts</div>
          <div className="text-2xl font-bold mt-2">2</div>
        </div>
        <div className="glass p-4 rounded">
          <div className="text-sm text-neutral-400">Earnings (This month)</div>
          <div className="text-2xl font-bold mt-2">Rs. 18,400</div>
        </div>
        <div className="glass p-4 rounded">
          <div className="text-sm text-neutral-400">Proposals Sent</div>
          <div className="text-2xl font-bold mt-2">24</div>
        </div>
      </div>

      <section className="mt-6 glass p-4 rounded">
        <h3 className="font-semibold">Suggested Projects</h3>
        <div className="mt-3 grid md:grid-cols-2 gap-3">
          {[1,2,3].map(i => (
            <div key={i} className="p-3 rounded border border-neutral-800">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-semibold">Project #{i} - Landing page</div>
                  <div className="text-sm text-neutral-400">Budget: Rs. 10,000</div>
                </div>
                <div>
                  <button className="px-3 py-1 bg-accent text-black rounded">Apply</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
