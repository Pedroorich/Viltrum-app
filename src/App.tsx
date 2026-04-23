/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './lib/authContext';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Scanner from './pages/Scanner';
import DiagnosticResult from './pages/DiagnosticResult';
import Conquests from './pages/Conquests';
import Execution from './pages/Execution';
import Legion from './pages/Legion';
import Arsenal from './pages/Arsenal';
import Profile from './pages/Profile';
import Settings from './pages/Settings';

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" />;
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/home" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
          <Route path="/diagnosticar" element={<PrivateRoute><Scanner /></PrivateRoute>} />
          <Route path="/resultado" element={<PrivateRoute><DiagnosticResult /></PrivateRoute>} />
          <Route path="/conquistas" element={<PrivateRoute><Conquests /></PrivateRoute>} />
          <Route path="/executar" element={<PrivateRoute><Execution /></PrivateRoute>} />
          <Route path="/legiao" element={<PrivateRoute><Legion /></PrivateRoute>} />
          <Route path="/arsenal" element={<PrivateRoute><Arsenal /></PrivateRoute>} />
          <Route path="/perfil" element={<PrivateRoute><Profile /></PrivateRoute>} />
          <Route path="/configuracoes" element={<PrivateRoute><Settings /></PrivateRoute>} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
