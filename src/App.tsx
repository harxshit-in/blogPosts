/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { Toaster } from 'sonner';
import { AuthProvider } from './contexts/AuthContext';
import { Layout } from './components/layout/Layout';
import { ProtectedRoute } from './components/ProtectedRoute';

// Pages
import { Home } from './pages/Home';
import { Post } from './pages/Post';
import { Dashboard } from './pages/Dashboard';
import { Admin } from './pages/Admin';
import { Editor } from './pages/Editor';

export default function App() {
  return (
    <HelmetProvider>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="post/:slug" element={<Post />} />
              
              {/* Protected Routes */}
              <Route element={<ProtectedRoute />}>
                <Route path="dashboard" element={<Dashboard />} />
              </Route>
              
              {/* Writer Routes */}
              <Route element={<ProtectedRoute requireVerified={true} />}>
                <Route path="editor" element={<Editor />} />
              </Route>
              
              {/* Admin Routes */}
              <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
                <Route path="admin" element={<Admin />} />
              </Route>
            </Route>
          </Routes>
        </Router>
        <Toaster position="top-center" />
      </AuthProvider>
    </HelmetProvider>
  );
}

