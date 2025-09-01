"use client";

import React, { useState } from 'react';
import Image from 'next/image';

interface MenuItem {
  id: string;
  name: string;
  icon: string;
  count?: number;
}

interface SidebarProps {
  activeItem: string;
  onItemSelect: (itemId: string) => void;
  liguesCount?: number;
  arbitresCount?: number;
  arbitresEnAttenteCount?: number;
  matchesCount?: number;
  newsCount?: number;
}

export const Sidebar: React.FC<SidebarProps> = ({ 
  activeItem, 
  onItemSelect, 
  liguesCount = 0,
  arbitresCount = 0,
  arbitresEnAttenteCount = 0,
  matchesCount = 0,

}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const menuItems: MenuItem[] = [
    { id: 'accueil-arbitres', name: 'Accueil Arbitres', icon: '🏠', count: 1 },
    { id: 'arbitres', name: 'Arbitres', icon: '👥', count: arbitresCount },
    { id: 'designations', name: 'Désignations', icon: '⚽', count: arbitresEnAttenteCount },
    { id: 'ligues', name: 'Ligues', icon: '🏛️', count: liguesCount },
    { id: 'matchs', name: 'Matchs', icon: '⚽', count: matchesCount },
    { id: 'rapports', name: 'Rapports', icon: '📄', count: 0 },
    { id: 'statistiques', name: 'Statistiques', icon: '📊', count: 0 },
    { id: 'parametres', name: 'Paramètres', icon: '⚙️', count: 0 }
  ];

  return (
    <div className={`bg-white/10 backdrop-blur-sm border-r border-white/20 transition-all duration-300 ${isCollapsed ? 'w-16' : 'w-64'}`}>
      {/* Header du sidebar */}
      <div className="p-4 border-b border-white/20">
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <div className="flex items-center space-x-3">
              <div className="relative animate-float">
                <Image
                  src="/ftf-logo.png"
                  alt="FTF Logo"
                  width={32}
                  height={32}
                  className="drop-shadow-lg"
                />
              </div>
              <div>
                <h2 className="text-white font-bold text-sm">Admin FTF</h2>
                <p className="text-white/70 text-xs">Direction Arbitrage</p>
              </div>
            </div>
          )}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="text-white/80 hover:text-white transition-colors p-1 rounded"
          >
            {isCollapsed ? '▶️' : '◀️'}
          </button>
        </div>
      </div>

      {/* Menu Items */}
      <nav className="p-2">
        <ul className="space-y-1">
          {menuItems.map((item) => (
            <li key={item.id}>
              <button
                onClick={() => onItemSelect(item.id)}
                className={`w-full flex items-center ${isCollapsed ? 'justify-center px-2' : 'justify-between px-3'} py-3 rounded-lg transition-all duration-200 group ${
                  activeItem === item.id
                    ? 'bg-white/20 text-white border border-white/30'
                    : 'text-white/80 hover:bg-white/10 hover:text-white'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <span className="text-lg group-hover:scale-110 transition-transform duration-200">
                    {item.icon}
                  </span>
                  {!isCollapsed && (
                    <span className="font-medium text-sm">{item.name}</span>
                  )}
                </div>
                
                {!isCollapsed && item.count && (
                  <span className="bg-white/20 text-white text-xs px-2 py-1 rounded-full">
                    {item.count}
                  </span>
                )}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {/* Footer du sidebar */}
      {!isCollapsed && (
        <div className="absolute bottom-4 left-4 right-4">
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 border border-white/20">
            <div className="flex items-center space-x-2 mb-2">
              <span className="text-lg">📱</span>
              <span className="text-white/90 text-sm font-medium">Support</span>
            </div>
            <p className="text-white/70 text-xs">
              Besoin d&apos;aide ? Contactez l&apos;équipe technique
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
