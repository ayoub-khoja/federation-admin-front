"use client";

import React, { useState } from 'react';
import AddDesignationModal from './AddDesignationModal';
import AddMatchModal from './AddMatchModal';

interface Match {
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
  ligue: string;
}

interface Designation {
  id: string;
  date: string;
  stade: string;
  equipe1: string;
  equipe2: string;
  arbitre_principal: string;
  assistant1: string;
  assistant2: string;
  quatrieme_arbitre: string;
  ligue: string;
}



// Types de ligues disponibles
const LIGUE_TYPES = [
  { value: 'all', label: 'Toutes les Ligues' },
  { value: 'ligue1', label: 'Ligue 1' },
  { value: 'ligue2', label: 'Ligue 2' },
  { value: 'c1', label: 'Coupe 1' },
  { value: 'c2', label: 'Coupe 2' },
  { value: 'jeunes', label: 'Jeunes' }
];

// Données d'exemple pour les matchs
const MATCHES_DATA: Match[] = [
  {
    id: '1',
    date: '2024-01-15',
    time: '20:00',
    match: 'Club Africain vs Étoile du Sahel',
    equipe1: 'Club Africain',
    equipe2: 'Étoile du Sahel',
    stade: 'Stade Olympique de Radès',
    arbitre_principal: 'Ahmed Ben Ali',
    assistant1: 'Mohamed Trabelsi',
    assistant2: 'Hassan Dridi',
    quatrieme_arbitre: 'Karim Mejri',
    ligue: 'ligue1'
  },
  {
    id: '2',
    date: '2024-01-20',
    time: '16:00',
    match: 'CA vs US Monastir',
    equipe1: 'CA',
    equipe2: 'US Monastir',
    stade: 'Stade Municipal de Hammam-Lif',
    arbitre_principal: 'Sami Ben Salah',
    assistant1: 'Riadh Hamdi',
    assistant2: 'Wassim Ben Youssef',
    quatrieme_arbitre: 'Fares Ben Ammar',
    ligue: 'ligue2'
  },
  {
    id: '3',
    date: '2024-01-25',
    time: '19:30',
    match: 'Stade Tunisien vs AS Marsa',
    equipe1: 'Stade Tunisien',
    equipe2: 'AS Marsa',
    stade: 'Stade Chedli Zouiten',
    arbitre_principal: 'Nabil Ben Salem',
    assistant1: 'Tarek Ben Romdhane',
    assistant2: 'Sofiene Ben Amor',
    quatrieme_arbitre: 'Hatem Ben Othman',
    ligue: 'c1'
  },
  {
    id: '4',
    date: '2024-01-30',
    time: '15:00',
    match: 'JS Kairouan vs CS Sfaxien',
    equipe1: 'JS Kairouan',
    equipe2: 'CS Sfaxien',
    stade: 'Stade Hamda Laouani',
    arbitre_principal: 'Lotfi Ben Mansour',
    assistant1: 'Hamza Ben Hassen',
    assistant2: 'Youssef Ben Hamida',
    quatrieme_arbitre: 'Aymen Ben Khelifa',
    ligue: 'c2'
  },
  {
    id: '5',
    date: '2024-02-05',
    time: '14:00',
    match: 'Équipe U17 vs Équipe U19',
    equipe1: 'Équipe U17',
    equipe2: 'Équipe U19',
    stade: 'Centre Technique de la FTF',
    arbitre_principal: 'Adel Ben Youssef',
    assistant1: 'Rami Ben Salem',
    assistant2: 'Omar Ben Ali',
    quatrieme_arbitre: 'Yassine Ben Romdhane',
    ligue: 'jeunes'
  }
];

// Données d'exemple pour les désignations
const DESIGNATIONS_DATA: Designation[] = [
  {
    id: '1',
    date: '2024-01-15',
    stade: 'Stade Olympique de Radès',
    equipe1: 'Club Africain',
    equipe2: 'Étoile du Sahel',
    arbitre_principal: 'Ahmed Ben Ali',
    assistant1: 'Mohamed Trabelsi',
    assistant2: 'Hassan Dridi',
    quatrieme_arbitre: 'Karim Mejri',
    ligue: 'ligue1'
  },
  {
    id: '2',
    date: '2024-01-20',
    stade: 'Stade Municipal de Hammam-Lif',
    equipe1: 'CA',
    equipe2: 'US Monastir',
    arbitre_principal: 'Sami Ben Salah',
    assistant1: 'Riadh Hamdi',
    assistant2: 'Wassim Ben Youssef',
    quatrieme_arbitre: 'Fares Ben Ammar',
    ligue: 'ligue2'
  },
  {
    id: '3',
    date: '2024-01-25',
    stade: 'Stade Chedli Zouiten',
    equipe1: 'Stade Tunisien',
    equipe2: 'AS Marsa',
    arbitre_principal: 'Nabil Ben Salem',
    assistant1: 'Tarek Ben Romdhane',
    assistant2: 'Sofiene Ben Amor',
    quatrieme_arbitre: 'Hatem Ben Othman',
    ligue: 'c1'
  }
];

export default function MatchsList() {
  const [selectedLigue, setSelectedLigue] = useState('all');
  const [selectedArbitre, setSelectedArbitre] = useState('all');
  const [selectedDate, setSelectedDate] = useState('all');
  const [selectedStade, setSelectedStade] = useState('all');
  const [activeTab, setActiveTab] = useState<'matchs' | 'designations'>('matchs');
  const [showAddDesignationModal, setShowAddDesignationModal] = useState(false);
  const [showAddMatchModal, setShowAddMatchModal] = useState(false);

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

  // Obtenir la liste unique des arbitres
  const allArbitres = Array.from(new Set([
    ...MATCHES_DATA.map(m => m.arbitre_principal),
    ...MATCHES_DATA.map(m => m.assistant1),
    ...MATCHES_DATA.map(m => m.assistant2),
    ...MATCHES_DATA.map(m => m.quatrieme_arbitre)
  ])).sort();

  // Obtenir la liste unique des stades
  const allStades = Array.from(new Set(MATCHES_DATA.map(m => m.stade))).sort();

  // Obtenir la liste unique des dates
  const allDates = Array.from(new Set(MATCHES_DATA.map(m => m.date))).sort();

  // Filtrer les matchs selon les critères sélectionnés
  const filteredMatches = MATCHES_DATA.filter(match => {
    const matchesLigue = selectedLigue === 'all' || match.ligue === selectedLigue;
    const matchesArbitre = selectedArbitre === 'all' || 
      match.arbitre_principal === selectedArbitre ||
      match.assistant1 === selectedArbitre ||
      match.assistant2 === selectedArbitre ||
      match.quatrieme_arbitre === selectedArbitre;
    const matchesDate = selectedDate === 'all' || match.date === selectedDate;
    const matchesStade = selectedStade === 'all' || match.stade === selectedStade;
    
    return matchesLigue && matchesArbitre && matchesDate && matchesStade;
  });

  // Filtrer les désignations selon les critères sélectionnés
  const filteredDesignations = DESIGNATIONS_DATA.filter(designation => {
    const matchesLigue = selectedLigue === 'all' || designation.ligue === selectedLigue;
    const matchesArbitre = selectedArbitre === 'all' || 
      designation.arbitre_principal === selectedArbitre ||
      designation.assistant1 === selectedArbitre ||
      designation.assistant2 === selectedArbitre ||
      designation.quatrieme_arbitre === selectedArbitre;
    const matchesDate = selectedDate === 'all' || designation.date === selectedDate;
    const matchesStade = selectedStade === 'all' || designation.stade === selectedStade;
    
    return matchesLigue && matchesArbitre && matchesDate && matchesStade;
  });

  const handleCreateDesignation = (designationData: {date: string; stade: string; equipe1: string; equipe2: string; arbitre_principal: string; assistant1: string; assistant2: string; quatrieme_arbitre: string; ligue: string}) => {
    // Ici vous pouvez ajouter la logique pour créer une nouvelle désignation
    console.log('Nouvelle désignation:', designationData);
    // Pour l'instant, on peut juste fermer le modal
    setShowAddDesignationModal(false);
  };

  const handleCreateMatch = (matchData: {date: string; time: string; equipe1: string; equipe2: string; stade: string; arbitre_principal: string; assistant1: string; assistant2: string; quatrieme_arbitre: string; ligue: string}) => {
    // Ici vous pouvez ajouter la logique pour créer un nouveau match
    console.log('Nouveau match:', matchData);
    // Pour l'instant, on peut juste fermer le modal
    setShowAddMatchModal(false);
  };

  return (
    <div className="space-y-6">
      {/* En-tête de la section avec onglets */}
      <div className="bg-white/20 backdrop-blur-sm rounded-2xl shadow-lg border border-white/30 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">⚽ Gestion des Matchs et Désignations</h2>
            <p className="text-white/70">Planification et suivi des matchs avec filtres avancés</p>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => setActiveTab('matchs')}
              className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                activeTab === 'matchs'
                  ? 'bg-white/20 text-white border border-white/30'
                  : 'bg-white/10 text-white/70 hover:bg-white/20'
              }`}
            >
              Matchs
            </button>
            <button
              onClick={() => setActiveTab('designations')}
              className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                activeTab === 'designations'
                  ? 'bg-white/20 text-white border border-white/30'
                  : 'bg-white/10 text-white/70 hover:bg-white/20'
              }`}
            >
              Désignations
            </button>
          </div>
        </div>
      </div>

      {/* Filtres avec listes déroulantes */}
      <div className="bg-red-800/60 rounded-xl p-6 border-2 border-red-600/60">
        <h3 className="text-2xl font-bold text-white mb-6 text-center">
          🔍 Filtres de Recherche
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Filtre par ligue */}
          <div>
            <label className="block text-white/90 text-sm font-semibold mb-2">Ligue</label>
            <select
              value={selectedLigue}
              onChange={(e) => setSelectedLigue(e.target.value)}
              className="w-full px-4 py-3 bg-white/15 backdrop-blur-sm border-2 rounded-xl focus:outline-none transition-all duration-300 text-white border-red-500/60 focus:border-white/70"
            >
              {LIGUE_TYPES.map((ligue) => (
                <option key={ligue.value} value={ligue.value} className="bg-red-800 text-white">
                  {ligue.label}
                </option>
              ))}
            </select>
          </div>

          {/* Filtre par arbitre */}
          <div>
            <label className="block text-white/90 text-sm font-semibold mb-2">Arbitre</label>
            <select
              value={selectedArbitre}
              onChange={(e) => setSelectedArbitre(e.target.value)}
              className="w-full px-4 py-3 bg-white/15 backdrop-blur-sm border-2 rounded-xl focus:outline-none transition-all duration-300 text-white border-red-500/60 focus:border-white/70"
            >
              <option value="all" className="bg-red-800 text-white">Tous les Arbitres</option>
              {allArbitres.map((arbitre) => (
                <option key={arbitre} value={arbitre} className="bg-red-800 text-white">
                  {arbitre}
                </option>
              ))}
            </select>
          </div>

          {/* Filtre par date */}
          <div>
            <label className="block text-white/90 text-sm font-semibold mb-2">Date</label>
            <select
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full px-4 py-3 bg-white/15 backdrop-blur-sm border-2 rounded-xl focus:outline-none transition-all duration-300 text-white border-red-500/60 focus:border-white/70"
            >
              <option value="all" className="bg-red-800 text-white">Toutes les Dates</option>
              {allDates.map((date) => (
                <option key={date} value={date} className="bg-red-800 text-white">
                  {formatDate(date)}
                </option>
              ))}
            </select>
          </div>

          {/* Filtre par stade */}
          <div>
            <label className="block text-white/90 text-sm font-semibold mb-2">Stade</label>
            <select
              value={selectedStade}
              onChange={(e) => setSelectedStade(e.target.value)}
              className="w-full px-4 py-3 bg-white/15 backdrop-blur-sm border-2 rounded-xl focus:outline-none transition-all duration-300 text-white border-red-500/60 focus:border-white/70"
            >
              <option value="all" className="bg-red-800 text-white">Tous les Stades</option>
              {allStades.map((stade) => (
                <option key={stade} value={stade} className="bg-red-800 text-white">
                  {stade}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Statistiques des filtres */}
        <div className="mt-6 text-center">
          <p className="text-white/80 text-lg">
            {activeTab === 'matchs' ? (
              <>Affichage de <span className="font-bold text-white">{filteredMatches.length}</span> matchs sur <span className="font-bold text-white">{MATCHES_DATA.length}</span> total</>
            ) : (
              <>Affichage de <span className="font-bold text-white">{filteredDesignations.length}</span> désignations sur <span className="font-bold text-white">{DESIGNATIONS_DATA.length}</span> total</>
            )}
          </p>
        </div>
      </div>

      {/* Contenu des onglets */}
      {activeTab === 'matchs' ? (
        // Onglet Matchs
        <div className="space-y-6">
          {filteredMatches.length > 0 ? (
            filteredMatches.map((match, index) => (
              <div
                key={match.id}
                className="bg-red-900/95 backdrop-blur-md rounded-2xl p-8 border-2 border-red-700/50 shadow-2xl"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {/* En-tête de la section avec date et heure */}
                <div className="text-center mb-8">
                  <h3 className="text-3xl font-bold text-white mb-4">
                    {formatDate(match.date)} - {formatTime(match.time)}
                  </h3>
                  <div className="w-32 h-1 bg-white/30 mx-auto rounded-full mb-4"></div>
                  
                  {/* Type de ligue */}
                  <span className={`px-4 py-2 rounded-full text-sm font-semibold ${
                    match.ligue === 'ligue1' ? 'bg-red-500/30 text-red-300 border border-red-500/50' :
                    match.ligue === 'ligue2' ? 'bg-orange-500/30 text-orange-300 border border-orange-500/50' :
                    match.ligue === 'c1' ? 'bg-green-500/30 text-green-300 border border-green-500/50' :
                    match.ligue === 'c2' ? 'bg-purple-500/30 text-purple-300 border border-purple-500/50' :
                    match.ligue === 'jeunes' ? 'bg-yellow-500/30 text-yellow-300 border border-yellow-500/50' :
                    'bg-blue-500/30 text-blue-300 border border-blue-500/50'
                  }`}>
                    {match.ligue === 'ligue1' ? 'Ligue 1' :
                     match.ligue === 'ligue2' ? 'Ligue 2' :
                     match.ligue === 'c1' ? 'Coupe 1' :
                     match.ligue === 'c2' ? 'Coupe 2' :
                     match.ligue === 'jeunes' ? 'Jeunes' : 'Autre'}
                  </span>
                </div>

                {/* Informations du match */}
                <div className="bg-red-800/60 rounded-xl p-6 border-2 border-red-600/60 mb-6">
                  <h4 className="text-2xl font-bold text-white mb-6 text-center">معلومات المباراة</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                    <div className="bg-red-700/40 rounded-lg p-4 border border-red-500/40">
                      <h5 className="text-xl font-semibold text-white mb-3">المقابلة</h5>
                      <p className="text-white/90 text-lg font-medium">{match.match}</p>
                      <p className="text-white/70 text-sm mt-2">Match</p>
                    </div>
                    <div className="bg-red-700/40 rounded-lg p-4 border border-red-500/40">
                      <h5 className="text-xl font-semibold text-white mb-3">الملعب</h5>
                      <p className="text-white/90 text-lg font-medium">{match.stade}</p>
                      <p className="text-white/70 text-sm mt-2">Stade</p>
                    </div>
                    <div className="bg-red-700/40 rounded-lg p-4 border border-red-500/40">
                      <h5 className="text-xl font-semibold text-white mb-3">الفرق</h5>
                      <p className="text-white/90 text-lg font-medium">{match.equipe1}</p>
                      <p className="text-white/90 text-lg font-medium">vs</p>
                      <p className="text-white/90 text-lg font-medium">{match.equipe2}</p>
                      <p className="text-white/70 text-sm mt-2">Équipes</p>
                    </div>
                  </div>
                </div>

                {/* Équipe arbitrale */}
                <div className="bg-red-800/60 rounded-xl p-6 border-2 border-red-600/60">
                  <h4 className="text-2xl font-bold text-white mb-6 text-center">فريق التحكيم</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="bg-red-700/40 rounded-lg p-4 border border-red-500/40 text-center">
                      <h5 className="text-lg font-semibold text-white/90 mb-3">الحكم</h5>
                      <p className="text-white font-bold text-xl">{match.arbitre_principal}</p>
                      <p className="text-sm text-white/70">Arbitre Principal</p>
                    </div>
                    <div className="bg-red-700/40 rounded-lg p-4 border border-red-500/40 text-center">
                      <h5 className="text-lg font-semibold text-white/90 mb-3">المساعد الأول</h5>
                      <p className="text-white font-bold text-xl">{match.assistant1}</p>
                      <p className="text-sm text-white/70">Assistant 1</p>
                    </div>
                    <div className="bg-red-700/40 rounded-lg p-4 border border-red-500/40 text-center">
                      <h5 className="text-lg font-semibold text-white/90 mb-3">المساعد الثاني</h5>
                      <p className="text-white font-bold text-xl">{match.assistant2}</p>
                      <p className="text-sm text-white/70">Assistant 2</p>
                    </div>
                    <div className="bg-red-700/40 rounded-lg p-4 border border-red-500/40 text-center">
                      <h5 className="text-lg font-semibold text-white/90 mb-3">الحكم الرابع</h5>
                      <p className="text-white font-bold text-xl">{match.quatrieme_arbitre}</p>
                      <p className="text-sm text-white/70">4ème Arbitre</p>
                    </div>
                  </div>
                </div>

                {/* Séparateur entre les matchs */}
                {index < filteredMatches.length - 1 && (
                  <div className="mt-8 pt-6 border-t-2 border-red-600/50">
                    <div className="text-center">
                      <div className="w-24 h-1 bg-white/30 mx-auto rounded-full"></div>
                    </div>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="bg-red-900/95 backdrop-blur-md rounded-2xl p-12 text-center border-2 border-red-700/50 shadow-2xl">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-bold text-white mb-2">Aucun match trouvé</h3>
              <p className="text-white/70 mb-6">
                Aucun match ne correspond aux filtres sélectionnés
              </p>
              <button
                onClick={() => setShowAddMatchModal(true)}
                className="bg-green-500/30 backdrop-blur-sm text-green-300 px-8 py-4 rounded-xl hover:bg-green-500/40 transition-all duration-300 border-2 border-green-500/50 text-lg font-semibold"
              >
                ➕ Créer un Match
              </button>
            </div>
          )}
        </div>
      ) : (
        // Onglet Désignations
        <div className="space-y-6">
          {filteredDesignations.length > 0 ? (
            filteredDesignations.map((designation, index) => (
              <div
                key={designation.id}
                className="bg-red-900/95 backdrop-blur-md rounded-2xl p-8 border-2 border-red-700/50 shadow-2xl"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {/* En-tête de la section avec date */}
                <div className="text-center mb-8">
                  <h3 className="text-3xl font-bold text-white mb-4">
                    {formatDate(designation.date)}
                  </h3>
                  <div className="w-32 h-1 bg-white/30 mx-auto rounded-full mb-4"></div>
                  
                  {/* Type de ligue */}
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

                {/* Informations de la désignation */}
                <div className="bg-red-800/60 rounded-xl p-6 border-2 border-red-600/60 mb-6">
                  <h4 className="text-2xl font-bold text-white mb-6 text-center">معلومات المباراة</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                    <div className="bg-red-700/40 rounded-lg p-4 border border-red-500/40">
                      <h5 className="text-xl font-semibold text-white mb-3">المقابلة</h5>
                      <p className="text-white/90 text-lg font-medium">{designation.equipe1} vs {designation.equipe2}</p>
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

                {/* Équipe arbitrale */}
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

                {/* Séparateur entre les désignations */}
                {index < filteredDesignations.length - 1 && (
                  <div className="mt-8 pt-6 border-t-2 border-red-600/50">
                    <div className="text-center">
                      <div className="w-24 h-1 bg-white/30 mx-auto rounded-full"></div>
                    </div>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="bg-red-900/95 backdrop-blur-md rounded-2xl p-12 text-center border-2 border-red-700/50 shadow-2xl">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-bold text-white mb-2">Aucune désignation trouvée</h3>
              <p className="text-white/70 mb-6">
                Aucune désignation ne correspond aux filtres sélectionnés
              </p>
              <button
                onClick={() => setShowAddDesignationModal(true)}
                className="bg-green-500/30 backdrop-blur-sm text-green-300 px-8 py-4 rounded-xl hover:bg-green-500/40 transition-all duration-300 border-2 border-green-500/50 text-lg font-semibold"
              >
                ➕ Créer une Désignation
              </button>
            </div>
          )}
        </div>
      )}

      {/* Bouton pour ajouter plus d'éléments */}
      {(activeTab === 'matchs' ? filteredMatches.length > 0 : filteredDesignations.length > 0) && (
        <div className="text-center">
          <button
            onClick={activeTab === 'matchs' ? () => setShowAddMatchModal(true) : () => setShowAddDesignationModal(true)}
            className="bg-green-500/30 backdrop-blur-sm text-green-300 px-8 py-4 rounded-xl hover:bg-green-500/40 transition-all duration-300 border-2 border-green-500/50 text-lg font-semibold"
          >
            ➕ Ajouter un Nouveau {activeTab === 'matchs' ? 'Match' : 'Désignation'}
          </button>
        </div>
      )}

      {/* Modal d'ajout de match */}
      <AddMatchModal
        isOpen={showAddMatchModal}
        onClose={() => setShowAddMatchModal(false)}
        onSubmit={handleCreateMatch}
      />

      {/* Modal d'ajout de désignation */}
      <AddDesignationModal
        isOpen={showAddDesignationModal}
        onClose={() => setShowAddDesignationModal(false)}
        onSubmit={handleCreateDesignation}
      />
    </div>
  );
}
