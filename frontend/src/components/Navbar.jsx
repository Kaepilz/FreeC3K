import React from 'react';
import { safeParse } from '../lib/safeLocal';
import { Link, useNavigate } from 'react-router-dom';
import { Sun, Moon } from 'lucide-react';

function useDarkToggle() {
  // simple theme toggle
  const [theme, setTheme] = React.useState(() => localStorage.getItem('theme') || 'dark');
  React.useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    localStorage.setItem('theme', theme);
  }, [theme]);
  return [theme, setTheme];
}

export default function Navbar() {
  const [theme, setTheme] = useDarkToggle();
  const navigate = useNavigate();
  const user = safeParse('user', null);

  const logout = () => {
    localStorage.removeItem('user');
    navigate('/');
  };

  return (
    <header className="glass border-b border-neutral-800 py-3">
      <div className="container mx-auto px-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-black font-extrabold">
            FH
          </div>
          <div className="hidden md:block">
            <div className="text-xl font-bold">Freelance<span className="text-accent">Hub</span></div>
            <div className="text-xs text-neutral-400">Nepal-first • Made with ❤️</div>
          </div>
        </Link>

        <nav className="flex items-center gap-4">
          <Link to="/browse" className="hidden md:inline text-neutral-300 hover:text-white">Browse</Link>
          <Link to="/projects" className="hidden md:inline text-neutral-300 hover:text-white">Projects</Link>

          {user ? (
            <>
              <button className="px-3 py-1 text-sm rounded bg-primary/20 text-primary" onClick={() => navigate(user.role === 'client' ? '/client' : '/freelancer')}>Dashboard</button>
              <button onClick={logout} className="px-3 py-1 rounded border border-neutral-700 text-sm">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-sm text-neutral-300 hover:text-white">Login</Link>
              <Link to="/signup" className="text-sm px-3 py-1 rounded bg-primary text-black font-medium">Sign up</Link>
            </>
          )}
          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="ml-2 p-2 rounded hover:bg-neutral-800"
            title="Toggle theme"
          >
            {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
          </button>
        </nav>
      </div>
    </header>
  );
}

