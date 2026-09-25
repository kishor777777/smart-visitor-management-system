import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { LiveProvider } from './context/LiveContext';
import { AppRoutes } from './routes/AppRoutes';

export function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <LiveProvider>
          <AppRoutes />
        </LiveProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
