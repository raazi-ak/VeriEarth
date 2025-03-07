import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navigation from './components/Navigation';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import About from './pages/About';
import Contact from './pages/Contact';
import ApiDocs from './pages/ApiDocs';
import Login from './pages/Login';
import { AuthProvider, useAuth } from './context/AuthContext';

const useVeriEarthAuth = () => {
  const { authToken } = useAuth();

  const veriEarthFetch = async (url: string, options: RequestInit = {}) => {
    const headers = new Headers(options.headers);
    if (authToken) {
      headers.set('Authorization', authToken);
    }

    const newOptions: RequestInit = {
      ...options,
      headers: headers,
    };

    return fetch(url, newOptions);
  };

  return veriEarthFetch;
};

export { useVeriEarthAuth };

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return <>{children}</>;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Navigation />
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/about" element={<ProtectedRoute><About /></ProtectedRoute>} />
            <Route path="/contact" element={<ProtectedRoute><Contact /></ProtectedRoute>} />
            <Route path="/docs" element={<ProtectedRoute><ApiDocs /></ProtectedRoute>} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
