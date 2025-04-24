import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../common/Button';

export const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center">
      <h1 className="text-6xl font-bold text-gray-900">404</h1>
      <p className="mt-4 text-xl text-gray-600">Page not found</p>
      <Button 
        variant="primary" 
        className="mt-8"
        onClick={() => navigate('/')}
      >
        Go Back Home
      </Button>
    </div>
  );
};
