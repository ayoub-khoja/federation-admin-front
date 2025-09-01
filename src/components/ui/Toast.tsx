"use client";

import React, { useEffect, useState } from 'react';
import { Toast as ToastType } from '../../hooks/useToast';

interface ToastProps {
  toast: ToastType;
  onRemove: (id: string) => void;
}

export const Toast: React.FC<ToastProps> = ({ toast, onRemove }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    // Animation d'entrée
    setTimeout(() => setIsVisible(true), 50);
  }, []);

  const handleRemove = () => {
    setIsExiting(true);
    setTimeout(() => {
      onRemove(toast.id);
    }, 300);
  };

  const getToastStyles = () => {
    const baseStyles = "flex items-center p-4 rounded-lg shadow-lg backdrop-blur-sm border transition-all duration-300 transform";
    
    switch (toast.type) {
      case 'success':
        return `${baseStyles} bg-green-500/20 border-green-500/30 text-green-300`;
      case 'error':
        return `${baseStyles} bg-red-500/20 border-red-500/30 text-red-300`;
      case 'warning':
        return `${baseStyles} bg-yellow-500/20 border-yellow-500/30 text-yellow-300`;
      case 'info':
        return `${baseStyles} bg-blue-500/20 border-blue-500/30 text-blue-300`;
      default:
        return `${baseStyles} bg-gray-500/20 border-gray-500/30 text-gray-300`;
    }
  };

  const getIcon = () => {
    switch (toast.type) {
      case 'success':
        return '✅';
      case 'error':
        return '❌';
      case 'warning':
        return '⚠️';
      case 'info':
        return 'ℹ️';
      default:
        return '📢';
    }
  };

  const transformClass = isExiting 
    ? 'translate-x-full opacity-0' 
    : isVisible 
      ? 'translate-x-0 opacity-100' 
      : 'translate-x-full opacity-0';

  return (
    <div className={`${getToastStyles()} ${transformClass}`}>
      <div className="flex items-center">
        <span className="text-xl mr-3">{getIcon()}</span>
        <span className="text-sm font-medium">{toast.message}</span>
      </div>
      <button
        onClick={handleRemove}
        className="ml-4 text-white/60 hover:text-white transition-colors"
      >
        ✕
      </button>
    </div>
  );
};











