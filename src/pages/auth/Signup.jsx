import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Signup() {
  const navigate = useNavigate();
  const [role, setRole] = React.useState('freelancer');

  const submit = (e) => {
    e.preventDefault();
    const user = { id: 'u_' + Date.now(), name: 'New User', role };
    localStorage.setItem('user', JSON.stringify(user));
    navigate(role === 'client' ? '/client' : '/freelancer');
  };

  return (
    <div className="max-w-md mx-auto mt-8">
      <div className="glass p-6 rounded-xl">
        <h2 className="text-2xl font-bold mb-2">Create account</h2>
        <form onSubmit={submit} className="space-y-3">
          <input required className="w-full p-3 rounded bg-neutral-900 border border-neutral-800" placeholder="Full name" />
          <input required className="w-full p-3 rounded bg-neutral-900 border border-neutral-800" placeholder="Email" />
          <input required type="password" className="w-full p-3 rounded bg-neutral-900 border border-neutral-800" placeholder="Password" />
          <div className="flex gap-2 items-center text-sm">
            <label className="flex items-center gap-2">
              <input type="radio" name="role" checked={role === 'freelancer'} onChange={() => setRole('freelancer')} /> Freelancer
            </label>
            <label className="flex items-center gap-2">
              <input type="radio" name="role" checked={role === 'client'} onChange={() => setRole('client')} /> Client
            </label>
          </div>
          <button className="w-full py-3 bg-accent text-black rounded font-semibold">Create account</button>
        </form>
      </div>
    </div>
  );
}
