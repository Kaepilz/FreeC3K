import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/auth/Login';
import Signup from './pages/auth/Signup';
import ClientDashboard from './pages/dashboard/ClientDashboard';
import FreelancerDashboard from './pages/dashboard/FreelancerDashboard';
import MainLayout from './layouts/Mainlayout';
import ProtectedRoute from './components/ProtectedRoute';

export default function App() {
  return (
    <MainLayout>
      {/* debug: test element to check Tailwind utilities */}
      <div className="p-4">
      
      </div>
      <Routes>
        <Route index element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/ClientDashboard" element={<ClientDashboard />} />
        <Route path="/FreelancerDashboard" element={<FreelancerDashboard />} />


        {/* demo protected routes (frontend-only using localStorage) */}
        <Route path="/client" element={
          <ProtectedRoute role="client">
            <ClientDashboard />
          </ProtectedRoute>
        } />
        <Route path="/freelancer" element={
          <ProtectedRoute role="freelancer">
            <FreelancerDashboard />
          </ProtectedRoute>
        } />

        <Route path="*" element={<Home />} />
      </Routes>
    </MainLayout>
  );
}



