"use client";

import React, { useState } from 'react';

interface Designation {
  id: string;
  date: string;
  time: string;
  match: string;
  equipe1: string;
  equipe2: string;
  stade: string;
  arbitre_principal: string;
  assistant1: string;
  assistant2: string;
  quatrieme_arbitre: string;
  ligue?: string; // Ajout du type de ligue
}

interface DesignationsListProps {
  designations: Designation[];
  onAddNew: () => void;
}

// Types de ligues disponibles
const LIGUE_TYPES = [
  { value: 'all', label: 'Toutes les Ligues', color: 'bg-blue-500/30' },
  { value: 'ligue1', label: 'Ligue 1', color: 'bg-red-500/30' },
  { value: 'ligue2', label: 'Ligue 2', color: 'bg-orange-500/30' },
  { value: 'c1', label: 'Coupe 1', color: 'bg-green-500/30' },
  { value: 'c2', label: 'Coupe 2', color: 'bg-purple-500/30' },
  { value: 'jeunes', label: 'Jeunes', color: 'bg-yellow-500/30' }
];

export default function DesignationsList({ designations, onAddNew }: DesignationsListProps) {
  const [selectedLigue, setSelectedLigue] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    };
    return date.toLocaleDateString('fr-FR', options);
  };

  const formatTime = (timeString: string) => {
    return timeString;
  };

  // Filtrer les désignations selon la ligue sélectionnée et le terme de recherche
  const filteredDesignations = designations.filter(designation => {
    const matchesLigue = selectedLigue === 'all' || designation.ligue === selectedLigue;
    const matchesSearch = searchTerm === '' || 
      designation.equipe1.toLowerCase().includes(searchTerm.toLowerCase()) ||
      designation.equipe2.toLowerCase().includes(searchTerm.toLowerCase()) ||
      designation.stade.toLowerCase().includes(searchTerm.toLowerCase()) ||
      designation.arbitre_principal.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesLigue && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* En-tête exactement comme l'image */}
      <div className="bg-red-900/95 backdrop-blur-md rounded-2xl p-8 border-2 border-red-700/50 shadow-2xl">
        <div className="text-center relative">
          {/* Logo FTF en haut à droite comme dans l'image */}
          <div className="absolute top-0 right-0">
            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-lg">
              <div className="text-center">
                <div className="text-red-900 text-2xl font-bold">⚽</div>
                <div className="text-red-900 text-xs font-bold mt-1">FTF</div>
              </div>
            </div>
          </div>
          
          {/* Titres en arabe centrés exactement comme l'image */}
          <div className="text-center mb-6">
            <h1 className="text-5xl font-bold text-white mb-4" dir="rtl">
              الإدارة الوطنية للتحكيم
            </h1>
            <h2 className="text-4xl font-semibold text-white/95 mb-4" dir="rtl">
              تعيينات الحكام
            </h2>
            <p className="text-3xl text-white/90" dir="rtl">
              مباريات ودية
            </p>
          </div>
          
          {/* Bouton d'ajout */}
          <button
            onClick={onAddNew}
            className="bg-green-500/30 backdrop-blur-sm text-green-300 px-8 py-4 rounded-xl hover:bg-green-500/40 transition-all duration-300 border-2 border-green-500/50 flex items-center space-x-3 mx-auto text-lg font-semibold"
          >
            <span>➕</span>
            <span>Ajouter une Désignation</span>
          </button>
        </div>
      </div>

      {/* Filtres et recherche */}
      <div className="bg-red-800/60 rounded-xl p-6 border-2 border-red-600/60">
        <h3 className="text-2xl font-bold text-white mb-6 text-center">
          🔍 Filtres et Recherche
        </h3>
        
        {/* Barre de recherche */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Rechercher par équipe, stade ou arbitre..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-5 py-4 bg-white/15 backdrop-blur-sm border-2 rounded-xl focus:outline-none transition-all duration-300 text-white text-lg placeholder-white/60 border-red-500/60 focus:border-white/70"
          />
        </div>

        {/* Filtres par ligue */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {LIGUE_TYPES.map((ligue) => (
            <button
              key={ligue.value}
              onClick={() => setSelectedLigue(ligue.value)}
              className={`px-4 py-3 rounded-xl border-2 transition-all duration-300 text-white font-semibold ${
                selectedLigue === ligue.value
                  ? `${ligue.color} border-white/50 shadow-lg`
                  : 'bg-white/10 border-red-500/40 hover:bg-white/20'
              }`}
            >
              {ligue.label}
            </button>
          ))}
        </div>

        {/* Statistiques des filtres */}
        <div className="mt-6 text-center">
          <p className="text-white/80 text-lg">
            Affichage de <span className="font-bold text-white">{filteredDesignations.length}</span> matchs sur <span className="font-bold text-white">{designations.length}</span> total
          </p>
        </div>
      </div>

      {/* Liste des désignations avec design exact de l'image */}
      {filteredDesignations.length > 0 ? (
        <div className="space-y-6">
          {filteredDesignations.map((designation, index) => (
            <div
              key={designation.id}
              className="bg-red-900/95 backdrop-blur-md rounded-2xl p-8 border-2 border-red-700/50 shadow-2xl"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* En-tête de la section avec date et heure exactement comme l'image */}
              <div className="text-center mb-8">
                <h3 className="text-3xl font-bold text-white mb-4">
                  {formatDate(designation.date)} - {formatTime(designation.time)}
                </h3>
                <div className="w-32 h-1 bg-white/30 mx-auto rounded-full"></div>
                
                {/* Type de ligue */}
                {designation.ligue && (
                  <div className="mt-4">
                    <span className={`px-4 py-2 rounded-full text-sm font-semibold ${
                      designation.ligue === 'ligue1' ? 'bg-red-500/30 text-red-300 border border-red-500/50' :
                      designation.ligue === 'ligue2' ? 'bg-orange-500/30 text-orange-300 border border-orange-500/50' :
                      designation.ligue === 'c1' ? 'bg-green-500/30 text-green-300 border border-green-500/50' :
                      designation.ligue === 'c2' ? 'bg-purple-500/30 text-purple-300 border border-purple-500/50' :
                      designation.ligue === 'jeunes' ? 'bg-yellow-500/30 text-yellow-300 border border-yellow-500/50' :
                      'bg-blue-500/30 text-blue-300 border border-blue-500/50'
                    }`}>
                      {designation.ligue === 'ligue1' ? 'Ligue 1' :
                       designation.ligue === 'ligue2' ? 'Ligue 2' :
                       designation.ligue === 'c1' ? 'Coupe 1' :
                       designation.ligue === 'c2' ? 'Coupe 2' :
                       designation.ligue === 'jeunes' ? 'Jeunes' : 'Autre'}
                    </span>
                  </div>
                )}
              </div>

              {/* Informations du match avec design exact de l'image */}
              <div className="bg-red-800/60 rounded-xl p-6 border-2 border-red-600/60 mb-6">
                <h4 className="text-2xl font-bold text-white mb-6 text-center">معلومات المباراة</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                  <div className="bg-red-700/40 rounded-lg p-4 border border-red-500/40">
                    <h5 className="text-xl font-semibold text-white mb-3">المقابلة</h5>
                    <p className="text-white/90 text-lg font-medium">{designation.match}</p>
                    <p className="text-white/70 text-sm mt-2">Match</p>
                  </div>
                  <div className="bg-red-700/40 rounded-lg p-4 border border-red-500/40">
                    <h5 className="text-xl font-semibold text-white mb-3">الملعب</h5>
                    <p className="text-white/90 text-lg font-medium">{designation.stade}</p>
                    <p className="text-white/70 text-sm mt-2">Stade</p>
                  </div>
                  <div className="bg-red-700/40 rounded-lg p-4 border border-red-500/40">
                    <h5 className="text-xl font-semibold text-white mb-3">الفرق</h5>
                    <p className="text-white/90 text-lg font-medium">{designation.equipe1}</p>
                    <p className="text-white/90 text-lg font-medium">vs</p>
                    <p className="text-white/90 text-lg font-medium">{designation.equipe2}</p>
                    <p className="text-white/70 text-sm mt-2">Équipes</p>
                  </div>
                </div>
              </div>

              {/* Équipe arbitrale avec design exact de l'image */}
              <div className="bg-red-800/60 rounded-xl p-6 border-2 border-red-600/60">
                <h4 className="text-2xl font-bold text-white mb-6 text-center">فريق التحكيم</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="bg-red-700/40 rounded-lg p-4 border border-red-500/40 text-center">
                    <h5 className="text-lg font-semibold text-white/90 mb-3">الحكم</h5>
                    <p className="text-white font-bold text-xl">{designation.arbitre_principal}</p>
                    <p className="text-sm text-white/70">Arbitre Principal</p>
                  </div>
                  <div className="bg-red-700/40 rounded-lg p-4 border border-red-500/40 text-center">
                    <h5 className="text-lg font-semibold text-white/90 mb-3">المساعد الأول</h5>
                    <p className="text-white font-bold text-xl">{designation.assistant1}</p>
                    <p className="text-sm text-white/70">Assistant 1</p>
                  </div>
                  <div className="bg-red-700/40 rounded-lg p-4 border border-red-500/40 text-center">
                    <h5 className="text-lg font-semibold text-white/90 mb-3">المساعد الثاني</h5>
                    <p className="text-white font-bold text-xl">{designation.assistant2}</p>
                    <p className="text-sm text-white/70">Assistant 2</p>
                  </div>
                  <div className="bg-red-700/40 rounded-lg p-4 border border-red-500/40 text-center">
                    <h5 className="text-lg font-semibold text-white/90 mb-3">الحكم الرابع</h5>
                    <p className="text-white font-bold text-xl">{designation.quatrieme_arbitre}</p>
                    <p className="text-sm text-white/70">4ème Arbitre</p>
                  </div>
                </div>
              </div>

              {/* Séparateur entre les matchs */}
              {index < filteredDesignations.length - 1 && (
                <div className="mt-8 pt-6 border-t-2 border-red-600/50">
                  <div className="text-center">
                    <div className="w-24 h-1 bg-white/30 mx-auto rounded-full"></div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-red-900/95 backdrop-blur-md rounded-2xl p-12 text-center border-2 border-red-700/50 shadow-2xl">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-xl font-bold text-white mb-2">Aucun match trouvé</h3>
          <p className="text-white/70 mb-6">
            {searchTerm || selectedLigue !== 'all' 
              ? 'Aucun match ne correspond aux filtres sélectionnés'
              : 'Commencez par créer votre première désignation d\'arbitres'
            }
          </p>
          <button
            onClick={onAddNew}
            className="bg-green-500/30 backdrop-blur-sm text-green-300 px-8 py-4 rounded-xl hover:bg-green-500/40 transition-all duration-300 border-2 border-green-500/50 text-lg font-semibold"
          >
            ➕ Créer une Désignation
          </button>
        </div>
      )}
    </div>
  );
}
