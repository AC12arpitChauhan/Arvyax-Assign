import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Shield, Zap, Globe } from 'lucide-react';

const Home: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-16">
        <h1 className="text-5xl font-bold text-gray-900 mb-6">
          Welcome to MERN App
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          A modern full-stack application built with React, Node.js, Express, and MongoDB
        </p>
        <div className="flex justify-center space-x-4">
          <Link
            to="/register"
            className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition duration-300 flex items-center"
          >
            Get Started
            <ArrowRight className="ml-2" size={20} />
          </Link>
          <Link
            to="/login"
            className="border border-gray-300 text-gray-700 px-8 py-3 rounded-lg font-semibold hover:bg-gray-50 transition duration-300"
          >
            Login
          </Link>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-8 mb-16">
        <div className="text-center p-6 bg-white rounded-lg shadow-md">
          <Shield className="mx-auto mb-4 text-blue-600" size={48} />
          <h3 className="text-xl font-semibold mb-2">Secure Authentication</h3>
          <p className="text-gray-600">JWT-based authentication with bcrypt password hashing</p>
        </div>
        <div className="text-center p-6 bg-white rounded-lg shadow-md">
          <Zap className="mx-auto mb-4 text-blue-600" size={48} />
          <h3 className="text-xl font-semibold mb-2">Fast & Modern</h3>
          <p className="text-gray-600">Built with Vite for lightning-fast development and builds</p>
        </div>
        <div className="text-center p-6 bg-white rounded-lg shadow-md">
          <Globe className="mx-auto mb-4 text-blue-600" size={48} />
          <h3 className="text-xl font-semibold mb-2">Ready to Deploy</h3>
          <p className="text-gray-600">Optimized for deployment on Vercel and Render</p>
        </div>
      </div>
    </div>
  );
};

export default Home;