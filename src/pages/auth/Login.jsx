import React from 'react';
import { useNavigate, Link } from 'react-router-dom';

export default function Login() {
  const navigate = useNavigate();
  const [role, setRole] = React.useState('client');

  const handleLogin = (e) => {
    e.preventDefault();
    // demo - save user to localStorage
    const user = { id: 'u_' + Date.now(), name: 'Demo User', role };
    localStorage.setItem('user', JSON.stringify(user));
    navigate(role === 'client' ? '/client' : '/freelancer');
  };

  return (
    <div className="max-w-md mx-auto mt-8">
      <div className="glass p-6 rounded-xl">
        <h2 className="text-2xl font-bold mb-2">Login</h2>
        <form onSubmit={handleLogin} className="space-y-3">
          <input required className="w-full p-3 rounded bg-neutral-900 border border-neutral-800" placeholder="Email" />
          <input required type="password" className="w-full p-3 rounded bg-neutral-900 border border-neutral-800" placeholder="Password" />
          <div className="flex gap-2 items-center text-sm">
            <label className="flex items-center gap-2">
              <input type="radio" name="role" checked={role === 'client'} onChange={() => setRole('client')} /> Client
            </label>
            <label className="flex items-center gap-2">
              <input type="radio" name="role" checked={role === 'freelancer'} onChange={() => setRole('freelancer')} /> Freelancer
            </label>
          </div>
          <button className="w-full py-3 bg-accent text-black rounded font-semibold">Login</button>
        </form>

        <div className="mt-4 text-sm text-neutral-400">
          No account? <Link to="/signup" className="text-accent">Sign up</Link>
        </div>
      </div>
    </div>
  );
}

