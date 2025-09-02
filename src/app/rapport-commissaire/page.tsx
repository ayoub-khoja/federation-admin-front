"use client";

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useRouter } from 'next/navigation';

export default function RapportCommissairePage() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const [rapports, setRapports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    dateDebut: '',
    dateFin: '',
    commissaire: '',
    statut: ''
  });

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/');
    }
  }, [isAuthenticated, isLoading, router]);

  useEffect(() => {
    // Simuler le chargement des rapports
    const loadRapports = async () => {
      setLoading(true);
      try {
        // TODO: Remplacer par un vrai appel API
        await new Promise(resolve => setTimeout(resolve, 1000));
        setRapports([
          {
            id: 1,
            commissaire: 'Ahmed Ben Ali',
            match: 'ES Tunis vs Club Africain',
            date: '2024-01-15',
            ligue: 'Ligue 1',
            statut: 'Validé',
            observations: 'Match bien arbitré, aucune incident',
            note: 8.5
          },
          {
            id: 2,
            commissaire: 'Fatma Khelil',
            match: 'CS Sfaxien vs US Monastir',
            date: '2024-01-20',
            ligue: 'Ligue 1',
            statut: 'En attente',
            observations: 'Rapport en cours de rédaction',
            note: null
          },
          {
            id: 3,
            commissaire: 'Ahmed Ben Ali',
            match: 'CA Bizertin vs AS Marsa',
            date: '2024-01-25',
            ligue: 'Ligue 2',
            statut: 'Rejeté',
            observations: 'Rapport incomplet, informations manquantes',
            note: 3.0
          }
        ]);
      } catch (error) {
        console.error('Erreur lors du chargement des rapports:', error);
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated) {
      loadRapports();
    }
  }, [isAuthenticated]);

  const handleFilterChange = (field: string, value: string) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  };

  const getStatutColor = (statut: string) => {
    switch (statut) {
      case 'Validé':
        return 'bg-green-500/20 text-green-300 border-green-500/30';
      case 'En attente':
        return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
      case 'Rejeté':
        return 'bg-red-500/20 text-red-300 border-red-500/30';
      default:
        return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-900 via-red-800 to-red-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white/80">Chargement...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-900 via-red-800 to-red-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2 flex items-center">
            <span className="mr-3">📋</span>
            Rapport Commissaire
          </h1>
          <p className="text-white/80 text-lg">
            Consultation et gestion des rapports de commissaires
          </p>
        </div>

        {/* Statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/80 text-sm">Total Rapports</p>
                <p className="text-3xl font-bold text-white">{rapports.length}</p>
              </div>
              <div className="text-4xl">📄</div>
            </div>
          </div>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/80 text-sm">Validés</p>
                <p className="text-3xl font-bold text-green-400">
                  {rapports.filter(r => r.statut === 'Validé').length}
                </p>
              </div>
              <div className="text-4xl">✅</div>
            </div>
          </div>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/80 text-sm">En Attente</p>
                <p className="text-3xl font-bold text-yellow-400">
                  {rapports.filter(r => r.statut === 'En attente').length}
                </p>
              </div>
              <div className="text-4xl">⏳</div>
            </div>
          </div>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/80 text-sm">Rejetés</p>
                <p className="text-3xl font-bold text-red-400">
                  {rapports.filter(r => r.statut === 'Rejeté').length}
                </p>
              </div>
              <div className="text-4xl">❌</div>
            </div>
          </div>
        </div>

        {/* Filtres */}
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 mb-6">
          <h3 className="text-white font-semibold mb-4 flex items-center">
            <span className="mr-2">🔍</span>
            Filtres de recherche
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-white/80 text-sm mb-2">Date de début</label>
              <input
                type="date"
                value={filters.dateDebut}
                onChange={(e) => handleFilterChange('dateDebut', e.target.value)}
                className="w-full px-3 py-2 bg-white/20 backdrop-blur-sm border border-white/30 rounded-lg text-white focus:outline-none focus:border-white/50"
              />
            </div>
            <div>
              <label className="block text-white/80 text-sm mb-2">Date de fin</label>
              <input
                type="date"
                value={filters.dateFin}
                onChange={(e) => handleFilterChange('dateFin', e.target.value)}
                className="w-full px-3 py-2 bg-white/20 backdrop-blur-sm border border-white/30 rounded-lg text-white focus:outline-none focus:border-white/50"
              />
            </div>
            <div>
              <label className="block text-white/80 text-sm mb-2">Commissaire</label>
              <select
                value={filters.commissaire}
                onChange={(e) => handleFilterChange('commissaire', e.target.value)}
                className="w-full px-3 py-2 bg-white/20 backdrop-blur-sm border border-white/30 rounded-lg text-white focus:outline-none focus:border-white/50"
              >
                <option value="">Tous les commissaires</option>
                <option value="Ahmed Ben Ali">Ahmed Ben Ali</option>
                <option value="Fatma Khelil">Fatma Khelil</option>
              </select>
            </div>
            <div>
              <label className="block text-white/80 text-sm mb-2">Statut</label>
              <select
                value={filters.statut}
                onChange={(e) => handleFilterChange('statut', e.target.value)}
                className="w-full px-3 py-2 bg-white/20 backdrop-blur-sm border border-white/30 rounded-lg text-white focus:outline-none focus:border-white/50"
              >
                <option value="">Tous les statuts</option>
                <option value="Validé">Validé</option>
                <option value="En attente">En attente</option>
                <option value="Rejeté">Rejeté</option>
              </select>
            </div>
          </div>
          <div className="flex justify-end mt-4 space-x-2">
            <button className="bg-blue-500/20 backdrop-blur-sm text-blue-300 px-4 py-2 rounded-lg hover:bg-blue-500/30 transition-all duration-300 border border-blue-500/30">
              🔍 Rechercher
            </button>
            <button className="bg-gray-500/20 backdrop-blur-sm text-gray-300 px-4 py-2 rounded-lg hover:bg-gray-500/30 transition-all duration-300 border border-gray-500/30">
              🔄 Réinitialiser
            </button>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex space-x-4">
            <button className="bg-green-500/20 backdrop-blur-sm text-green-300 px-6 py-3 rounded-lg hover:bg-green-500/30 transition-all duration-300 border border-green-500/30 flex items-center space-x-2">
              <span>📊</span>
              <span>Exporter Excel</span>
            </button>
            <button className="bg-blue-500/20 backdrop-blur-sm text-blue-300 px-6 py-3 rounded-lg hover:bg-blue-500/30 transition-all duration-300 border border-blue-500/30 flex items-center space-x-2">
              <span>📄</span>
              <span>Générer PDF</span>
            </button>
          </div>
        </div>

        {/* Tableau des rapports */}
        <div className="bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-white/10">
                <tr>
                  <th className="px-6 py-4 text-left text-white/90 font-semibold">Commissaire</th>
                  <th className="px-6 py-4 text-left text-white/90 font-semibold">Match</th>
                  <th className="px-6 py-4 text-left text-white/90 font-semibold">Date</th>
                  <th className="px-6 py-4 text-left text-white/90 font-semibold">Ligue</th>
                  <th className="px-6 py-4 text-left text-white/90 font-semibold">Statut</th>
                  <th className="px-6 py-4 text-left text-white/90 font-semibold">Note</th>
                  <th className="px-6 py-4 text-left text-white/90 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-8 text-center">
                      <div className="flex items-center justify-center space-x-2">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                        <span className="text-white/80">Chargement des rapports...</span>
                      </div>
                    </td>
                  </tr>
                ) : rapports.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-8 text-center text-white/80">
                      Aucun rapport trouvé
                    </td>
                  </tr>
                ) : (
                  rapports.map((rapport) => (
                    <tr key={rapport.id} className="border-t border-white/10 hover:bg-white/5 transition-colors">
                      <td className="px-6 py-4 text-white font-medium">{rapport.commissaire}</td>
                      <td className="px-6 py-4 text-white/80">{rapport.match}</td>
                      <td className="px-6 py-4 text-white/80">{rapport.date}</td>
                      <td className="px-6 py-4 text-white/80">{rapport.ligue}</td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatutColor(rapport.statut)}`}>
                          {rapport.statut}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-white/80">
                        {rapport.note ? (
                          <span className={`px-2 py-1 rounded text-xs font-medium ${
                            rapport.note >= 7 ? 'bg-green-500/20 text-green-300' :
                            rapport.note >= 5 ? 'bg-yellow-500/20 text-yellow-300' :
                            'bg-red-500/20 text-red-300'
                          }`}>
                            {rapport.note}/10
                          </span>
                        ) : (
                          <span className="text-white/50">-</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex space-x-2">
                          <button className="text-blue-400 hover:text-blue-300 transition-colors" title="Voir rapport">
                            👁️
                          </button>
                          <button className="text-green-400 hover:text-green-300 transition-colors" title="Valider">
                            ✅
                          </button>
                          <button className="text-red-400 hover:text-red-300 transition-colors" title="Rejeter">
                            ❌
                          </button>
                          <button className="text-yellow-400 hover:text-yellow-300 transition-colors" title="Télécharger">
                            📥
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

