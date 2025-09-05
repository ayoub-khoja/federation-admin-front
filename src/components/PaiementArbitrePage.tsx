"use client";

import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useRouter } from 'next/navigation';

interface PaiementArbitre {
  id: number;
  arbitre: string;
  match: string;
  date: string;
  ligue: string;
  role: string;
  stade: string;
  mt_deplacement: number;
  mt_match: number;
  totale: number;
}

export default function PaiementArbitrePage() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const [paiements, setPaiements] = useState<PaiementArbitre[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    arbitre: '',
    ligue: '',
    typeMatch: ''
  });
  const [selectedPaiement, setSelectedPaiement] = useState<PaiementArbitre | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/');
    }
  }, [isAuthenticated, isLoading, router]);

  useEffect(() => {
    // Simuler le chargement des paiements
    const loadPaiements = async () => {
      setLoading(true);
      try {
        // TODO: Remplacer par un vrai appel API
        await new Promise(resolve => setTimeout(resolve, 1000));
        setPaiements([
          {
            id: 1,
            arbitre: 'Ahmed Ben Ali',
            match: 'ES Tunis vs Club Africain',
            date: '2024-01-15',
            ligue: 'Ligue 1',
            role: 'Arbitre Principal',
            stade: 'Stade Olympique de Radès',
            mt_deplacement: 50,
            mt_match: 100,
            totale: 150
          },
          {
            id: 2,
            arbitre: 'Fatma Khelil',
            match: 'CS Sfaxien vs US Monastir',
            date: '2024-01-20',
            ligue: 'Ligue 1',
            role: 'Arbitre Assistant',
            stade: 'Stade Taïeb Mhiri',
            mt_deplacement: 40,
            mt_match: 80,
            totale: 120
          },
          {
            id: 3,
            arbitre: 'Mohamed Trabelsi',
            match: 'CA Bizertin vs AS Marsa',
            date: '2024-01-25',
            ligue: 'Ligue 2',
            role: 'Arbitre Principal',
            stade: 'Stade 15 Octobre',
            mt_deplacement: 30,
            mt_match: 70,
            totale: 100
          }
        ]);
      } catch (error) {
        console.error('Erreur lors du chargement des paiements:', error);
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated) {
      loadPaiements();
    }
  }, [isAuthenticated]);

  const handleFilterChange = (field: string, value: string) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  };

  const handleViewDetails = (paiement: PaiementArbitre) => {
    setSelectedPaiement(paiement);
    setShowDetailsModal(true);
  };

  const closeDetailsModal = () => {
    setShowDetailsModal(false);
    setSelectedPaiement(null);
  };


  const totalMontant = paiements.reduce((sum, p) => sum + p.totale, 0);
  const totalDeplacement = paiements.reduce((sum, p) => sum + p.mt_deplacement, 0);
  const totalMatch = paiements.reduce((sum, p) => sum + p.mt_match, 0);

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
      <div className="max-w-full mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2 flex items-center">
            <span className="mr-3">💰</span>
            Paiement Arbitre
          </h1>
          <p className="text-white/80 text-lg">
            Gestion des paiements et rémunérations des arbitres
          </p>
        </div>

        {/* Filtres */}
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 mb-6">
          <h3 className="text-white font-semibold mb-4 flex items-center">
            <span className="mr-2">🔍</span>
            Filtres de recherche
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-white/80 text-sm mb-2">Arbitre</label>
              <select
                value={filters.arbitre}
                onChange={(e) => handleFilterChange('arbitre', e.target.value)}
                className="w-full px-3 py-2 bg-white/20 backdrop-blur-sm border border-white/30 rounded-lg text-white focus:outline-none focus:border-white/50"
              >
                <option value="">Tous les arbitres</option>
                <option value="Ahmed Ben Ali">Ahmed Ben Ali</option>
                <option value="Fatma Khelil">Fatma Khelil</option>
                <option value="Mohamed Trabelsi">Mohamed Trabelsi</option>
                <option value="Salah Ben Youssef">Salah Ben Youssef</option>
                <option value="Amina Khelil">Amina Khelil</option>
              </select>
            </div>
            <div>
              <label className="block text-white/80 text-sm mb-2">Ligue</label>
              <select
                value={filters.ligue}
                onChange={(e) => handleFilterChange('ligue', e.target.value)}
                className="w-full px-3 py-2 bg-white/20 backdrop-blur-sm border border-white/30 rounded-lg text-white focus:outline-none focus:border-white/50"
              >
                <option value="">Toutes les ligues</option>
                <option value="Ligue 1">Ligue 1</option>
                <option value="Ligue 2">Ligue 2</option>
                <option value="Ligue 3">Ligue 3</option>
                <option value="Coupe de Tunisie">Coupe de Tunisie</option>
              </select>
            </div>
            <div>
              <label className="block text-white/80 text-sm mb-2">Type de match</label>
              <select
                value={filters.typeMatch}
                onChange={(e) => handleFilterChange('typeMatch', e.target.value)}
                className="w-full px-3 py-2 bg-white/20 backdrop-blur-sm border border-white/30 rounded-lg text-white focus:outline-none focus:border-white/50"
              >
                <option value="">Tous les types</option>
                <option value="Championnat">Championnat</option>
                <option value="Coupe">Coupe</option>
                <option value="Amical">Amical</option>
                <option value="Play-off">Play-off</option>
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

        {/* Statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/80 text-sm">Total Général</p>
                <p className="text-3xl font-bold text-white">{totalMontant} TND</p>
              </div>
              <div className="text-4xl">💵</div>
            </div>
          </div>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/80 text-sm">MT Déplacement</p>
                <p className="text-3xl font-bold text-green-400">{totalDeplacement} TND</p>
              </div>
              <div className="text-4xl">🚗</div>
            </div>
          </div>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/80 text-sm">MT Match</p>
                <p className="text-3xl font-bold text-yellow-400">{totalMatch} TND</p>
              </div>
              <div className="text-4xl">⚽</div>
            </div>
          </div>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/80 text-sm">Nombre Paiements</p>
                <p className="text-3xl font-bold text-blue-400">{paiements.length}</p>
              </div>
              <div className="text-4xl">📊</div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-4">
            <button className="bg-green-500/20 backdrop-blur-sm text-green-300 px-4 py-2 rounded-lg hover:bg-green-500/30 transition-all duration-300 border border-green-500/30 flex items-center">
              <span className="mr-2">➕</span>
              Nouveau Paiement
            </button>
            <button className="bg-blue-500/20 backdrop-blur-sm text-blue-300 px-4 py-2 rounded-lg hover:bg-blue-500/30 transition-all duration-300 border border-blue-500/30 flex items-center">
              <span className="mr-2">📊</span>
              Exporter
            </button>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-white/80 text-sm">Affichage:</span>
            <select className="bg-white/20 backdrop-blur-sm border border-white/30 rounded-lg text-white px-3 py-1 text-sm">
              <option value="10">10 par page</option>
              <option value="25">25 par page</option>
              <option value="50">50 par page</option>
            </select>
          </div>
        </div>

        {/* Tableau des paiements */}
        <div className="bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1200px]">
              <thead className="bg-white/20">
                <tr>
                  <th className="px-4 py-4 text-left text-white font-semibold w-32">Arbitre</th>
                  <th className="px-4 py-4 text-left text-white font-semibold w-48">Match</th>
                  <th className="px-4 py-4 text-left text-white font-semibold w-24">Date</th>
                  <th className="px-4 py-4 text-left text-white font-semibold w-24">Ligue</th>
                  <th className="px-4 py-4 text-left text-white font-semibold w-32">Rôle</th>
                  <th className="px-4 py-4 text-left text-white font-semibold w-48">Stade</th>
                  <th className="px-4 py-4 text-left text-white font-semibold w-28">MT Déplacement</th>
                  <th className="px-4 py-4 text-left text-white font-semibold w-24">MT Match</th>
                  <th className="px-4 py-4 text-left text-white font-semibold w-24">Totale</th>
                  <th className="px-4 py-4 text-left text-white font-semibold w-24">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/20">
                {loading ? (
                  <tr>
                    <td colSpan={10} className="px-4 py-8 text-center">
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mr-3"></div>
                        <span className="text-white/80">Chargement des paiements...</span>
                      </div>
                    </td>
                  </tr>
                ) : paiements.length === 0 ? (
                  <tr>
                    <td colSpan={10} className="px-4 py-8 text-center text-white/80">
                      Aucun paiement trouvé
                    </td>
                  </tr>
                ) : (
                  paiements.map((paiement) => (
                    <tr key={paiement.id} className="hover:bg-white/10 transition-colors">
                      <td className="px-4 py-4 text-white font-medium">{paiement.arbitre}</td>
                      <td className="px-4 py-4 text-white/90">{paiement.match}</td>
                      <td className="px-4 py-4 text-white/90 text-center">{paiement.date}</td>
                      <td className="px-4 py-4 text-white/90 text-center">{paiement.ligue}</td>
                      <td className="px-4 py-4 text-white/90">{paiement.role}</td>
                      <td className="px-4 py-4 text-white/90">{paiement.stade}</td>
                      <td className="px-4 py-4 text-white font-semibold text-center">{paiement.mt_deplacement} TND</td>
                      <td className="px-4 py-4 text-white font-semibold text-center">{paiement.mt_match} TND</td>
                      <td className="px-4 py-4 font-bold text-green-400 text-center">{paiement.totale} TND</td>
                      <td className="px-4 py-4">
                        <div className="flex items-center justify-center space-x-2">
                          <button 
                            onClick={() => handleViewDetails(paiement)}
                            className="text-blue-400 hover:text-blue-300 transition-colors p-1"
                            title="Voir les détails"
                          >
                            👁️
                          </button>
                          <button className="text-green-400 hover:text-green-300 transition-colors p-1">
                            ✏️
                          </button>
                          <button className="text-red-400 hover:text-red-300 transition-colors p-1">
                            🗑️
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

        {/* Pagination */}
        <div className="flex justify-between items-center mt-6">
          <div className="text-white/80 text-sm">
            Affichage de 1 à {paiements.length} sur {paiements.length} paiements
          </div>
          <div className="flex items-center space-x-2">
            <button className="bg-white/20 backdrop-blur-sm text-white px-3 py-2 rounded-lg hover:bg-white/30 transition-all duration-300 border border-white/30">
              ← Précédent
            </button>
            <span className="text-white/80 px-3 py-2">Page 1 sur 1</span>
            <button className="bg-white/20 backdrop-blur-sm text-white px-3 py-2 rounded-lg hover:bg-white/30 transition-all duration-300 border border-white/30">
              Suivant →
            </button>
          </div>
        </div>

        {/* Modal de détails */}
        {showDetailsModal && selectedPaiement && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-white flex items-center">
                    <span className="mr-3">👁️</span>
                    Détails du Paiement
                  </h2>
                  <button
                    onClick={closeDetailsModal}
                    className="text-white/60 hover:text-white transition-colors text-2xl"
                  >
                    ✕
                  </button>
                </div>

                <div className="space-y-6">
                  {/* Informations générales */}
                  <div className="bg-white/5 rounded-lg p-4">
                    <h3 className="text-white font-semibold mb-4 flex items-center">
                      <span className="mr-2">ℹ️</span>
                      Informations Générales
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-white/70 text-sm">Arbitre</label>
                        <p className="text-white font-medium">{selectedPaiement.arbitre}</p>
                      </div>
                      <div>
                        <label className="text-white/70 text-sm">Rôle</label>
                        <p className="text-white font-medium">{selectedPaiement.role}</p>
                      </div>
                      <div>
                        <label className="text-white/70 text-sm">Match</label>
                        <p className="text-white font-medium">{selectedPaiement.match}</p>
                      </div>
                      <div>
                        <label className="text-white/70 text-sm">Date</label>
                        <p className="text-white font-medium">{selectedPaiement.date}</p>
                      </div>
                      <div>
                        <label className="text-white/70 text-sm">Ligue</label>
                        <p className="text-white font-medium">{selectedPaiement.ligue}</p>
                      </div>
                      <div>
                        <label className="text-white/70 text-sm">Stade</label>
                        <p className="text-white font-medium">{selectedPaiement.stade}</p>
                      </div>
                    </div>
                  </div>

                  {/* Détails financiers */}
                  <div className="bg-white/5 rounded-lg p-4">
                    <h3 className="text-white font-semibold mb-4 flex items-center">
                      <span className="mr-2">💰</span>
                      Détails Financiers
                    </h3>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center py-2 border-b border-white/10">
                        <span className="text-white/70">Montant Déplacement</span>
                        <span className="text-white font-semibold">{selectedPaiement.mt_deplacement} TND</span>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b border-white/10">
                        <span className="text-white/70">Montant Match</span>
                        <span className="text-white font-semibold">{selectedPaiement.mt_match} TND</span>
                      </div>
                      <div className="flex justify-between items-center py-3 bg-green-500/10 rounded-lg px-4">
                        <span className="text-white font-bold text-lg">Total</span>
                        <span className="text-green-400 font-bold text-xl">{selectedPaiement.totale} TND</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex justify-end space-x-3">
                    <button
                      onClick={closeDetailsModal}
                      className="bg-gray-500/20 backdrop-blur-sm text-gray-300 px-6 py-2 rounded-lg hover:bg-gray-500/30 transition-all duration-300 border border-gray-500/30"
                    >
                      Fermer
                    </button>
                    <button className="bg-blue-500/20 backdrop-blur-sm text-blue-300 px-6 py-2 rounded-lg hover:bg-blue-500/30 transition-all duration-300 border border-blue-500/30">
                      Modifier
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}



