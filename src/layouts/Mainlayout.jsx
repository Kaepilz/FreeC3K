import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import DevDebug from '../components/DevDebug';

export default function MainLayout({ children }) {
  return (

    <div className="app-bg">
      <Navbar className="ambient" />
      <main className="flex-1 container mx-auto px-4 py-8">
        {children}
      </main>
      <Footer />
    </div>
  );
}