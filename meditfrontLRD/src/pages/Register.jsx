import React from 'react';
import { Helmet } from 'react-helmet-async';
import RegisterForm from '../components/auth/RegisterForm';
import { PublicRoute } from '../components/auth/ProtectedRoute';

const Register = () => {
  return (
    <PublicRoute>
      <Helmet>
        <title>Create Account - MeditFront</title>
        <meta name="description" content="Create your MeditFront account to start managing your medical information and accessing healthcare services." />
      </Helmet>
      
      <div className="min-h-screen bg-gray-50">
        <RegisterForm />
      </div>
    </PublicRoute>
  );
};

export default Register;