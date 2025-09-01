"use client";

import React from 'react';

interface LoaderProps {
  size?: 'small' | 'medium' | 'large';
  color?: 'red' | 'white' | 'blue';
  className?: string;
}

export const ButtonLoader: React.FC<LoaderProps> = ({ 
  size = 'small', 
  color = 'white', 
  className = '' 
}) => {
  const sizeClasses = {
    small: 'w-4 h-4',
    medium: 'w-6 h-6',
    large: 'w-8 h-8'
  };

  const colorClasses = {
    red: 'border-red-600',
    white: 'border-white',
    blue: 'border-blue-600'
  };

  return (
    <div 
      className={`${sizeClasses[size]} ${colorClasses[color]} border-2 border-t-transparent rounded-full animate-spin ${className}`}
    />
  );
};

interface FullScreenLoaderProps {
  message?: string;
  isVisible: boolean;
}

export const FullScreenLoader: React.FC<FullScreenLoaderProps> = ({ 
  message = 'Chargement...', 
  isVisible 
}) => {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-red-500 via-red-600 to-red-700">
      {/* Motifs géométriques */}
      <div className="absolute top-0 right-0 w-48 h-48 bg-red-400/20 rounded-full -translate-y-24 translate-x-24 blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-red-400/20 rounded-full translate-y-32 -translate-x-32 blur-3xl"></div>
      
      <div className="relative bg-white/20 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-white/30 text-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
            <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-r-white/50 rounded-full animate-spin" style={{animationDirection: 'reverse', animationDuration: '1s'}}></div>
          </div>
          <p className="text-white text-lg font-medium">{message}</p>
        </div>
      </div>
    </div>
  );
};











