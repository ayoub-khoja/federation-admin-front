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
  montant: number;
  statut: string;
  date_paiement: string;
  methode_paiement: string;
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
            montant: 150,
            statut: 'Payé',
            date_paiement: '2024-01-20',
            methode_paiement: 'Virement bancaire'
          },
          {
            id: 2,
            arbitre: 'Fatma Khelil',
            match: 'CS Sfaxien vs US Monastir',
            date: '2024-01-20',
            ligue: 'Ligue 1',
            montant: 120,
            statut: 'En attente',
            date_paiement: '',
            methode_paiement: 'Chèque'
          },
          {
            id: 3,
            arbitre: 'Mohamed Trabelsi',
            match: 'CA Bizertin vs AS Marsa',
            date: '2024-01-25',
            ligue: 'Ligue 2',
            montant: 100,
            statut: 'En attente',
            date_paiement: '',
            methode_paiement: 'Espèces'
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

  const getStatutColor = (statut: string) => {
    switch (statut) {
      case 'Payé':
        return 'bg-green-500/20 text-green-300 border-green-500/30';
      case 'En attente':
        return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
      case 'Rejeté':
        return 'bg-red-500/20 text-red-300 border-red-500/30';
      default:
        return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
    }
  };

  const totalMontant = paiements.reduce((sum, p) => sum + p.montant, 0);
  const totalPaye = paiements.filter(p => p.statut === 'Payé').reduce((sum, p) => sum + p.montant, 0);
  const totalEnAttente = paiements.filter(p => p.statut === 'En attente').reduce((sum, p) => sum + p.montant, 0);

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
            <span className="mr-3">💰</span>
            Paiement Arbitre
          </h1>
          <p className="text-white/80 text-lg">
            Gestion des paiements et rémunérations des arbitres
          </p>
        </div>

        {/* Statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/80 text-sm">Total Montant</p>
                <p className="text-3xl font-bold text-white">{totalMontant} TND</p>
              </div>
              <div className="text-4xl">💵</div>
            </div>
          </div>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/80 text-sm">Payé</p>
                <p className="text-3xl font-bold text-green-400">{totalPaye} TND</p>
              </div>
              <div className="text-4xl">✅</div>
            </div>
          </div>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/80 text-sm">En Attente</p>
                <p className="text-3xl font-bold text-yellow-400">{totalEnAttente} TND</p>
              </div>
              <div className="text-4xl">⏳</div>
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
            <table className="w-full">
              <thead className="bg-white/20">
                <tr>
                  <th className="px-6 py-4 text-left text-white font-semibold">Arbitre</th>
                  <th className="px-6 py-4 text-left text-white font-semibold">Match</th>
                  <th className="px-6 py-4 text-left text-white font-semibold">Date</th>
                  <th className="px-6 py-4 text-left text-white font-semibold">Ligue</th>
                  <th className="px-6 py-4 text-left text-white font-semibold">Montant</th>
                  <th className="px-6 py-4 text-left text-white font-semibold">Statut</th>
                  <th className="px-6 py-4 text-left text-white font-semibold">Date Paiement</th>
                  <th className="px-6 py-4 text-left text-white font-semibold">Méthode</th>
                  <th className="px-6 py-4 text-left text-white font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/20">
                {loading ? (
                  <tr>
                    <td colSpan={9} className="px-6 py-8 text-center">
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mr-3"></div>
                        <span className="text-white/80">Chargement des paiements...</span>
                      </div>
                    </td>
                  </tr>
                ) : paiements.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="px-6 py-8 text-center text-white/80">
                      Aucun paiement trouvé
                    </td>
                  </tr>
                ) : (
                  paiements.map((paiement) => (
                    <tr key={paiement.id} className="hover:bg-white/10 transition-colors">
                      <td className="px-6 py-4 text-white">{paiement.arbitre}</td>
                      <td className="px-6 py-4 text-white/90">{paiement.match}</td>
                      <td className="px-6 py-4 text-white/90">{paiement.date}</td>
                      <td className="px-6 py-4 text-white/90">{paiement.ligue}</td>
                      <td className="px-6 py-4 text-white font-semibold">{paiement.montant} TND</td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatutColor(paiement.statut)}`}>
                          {paiement.statut}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-white/90">{paiement.date_paiement || '-'}</td>
                      <td className="px-6 py-4 text-white/90">{paiement.methode_paiement}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          <button className="text-blue-400 hover:text-blue-300 transition-colors">
                            👁️
                          </button>
                          <button className="text-green-400 hover:text-green-300 transition-colors">
                            ✏️
                          </button>
                          <button className="text-red-400 hover:text-red-300 transition-colors">
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
      </div>
    </div>
  );
}


