import React from 'react';
import { Navbar } from './Navbar';
import { AuthModal } from '../auth/AuthModal';
import { Outlet } from 'react-router-dom';

export function Layout() {
  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900 flex flex-col">
      <Navbar />
      <AuthModal />
      <main className="flex-1 flex flex-col">
        <Outlet />
      </main>
      <footer className="bg-white border-t border-gray-200 py-8 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-gray-500 text-sm">
          <p>&copy; {new Date().getFullYear()} BlogSpace. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
