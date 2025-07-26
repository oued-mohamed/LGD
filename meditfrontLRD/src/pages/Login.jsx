import React from 'react';
import { Helmet } from 'react-helmet-async';
import LoginForm from '../components/auth/LoginForm';
import { PublicRoute } from '../components/auth/ProtectedRoute';

const Login = () => {
  return (
    <PublicRoute>
      <Helmet>
        <title>Sign In - MeditFront</title>
        <meta name="description" content="Sign in to your MeditFront account to access your medical dashboard and manage your health information." />
      </Helmet>
      
      <div className="min-h-screen bg-gray-50">
        <LoginForm />
      </div>
    </PublicRoute>
  );
};

export default Login;