import React from 'react';

export default function Footer() {
  return (
    <footer className="mt-8">
      <div className="container mx-auto px-4 py-6 border-t border-neutral-800 flex flex-col md:flex-row items-center justify-between">
        <div className="text-sm text-neutral-400">© {new Date().getFullYear()} FreelanceHub — Built for Nepal</div>
        <div className="flex gap-4 mt-3 md:mt-0">
          <a className="text-neutral-400 hover:text-white">Privacy</a>
          <a className="text-neutral-400 hover:text-white">Terms</a>
          <a className="text-neutral-400 hover:text-white">Contact</a>
        </div>
      </div>
    </footer>
  );
}