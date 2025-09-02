"use client";

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useRouter } from 'next/navigation';

interface Commissaire {
  id: number;
  nom: string;
  telephone: string;
  email: string;
  ligue: string;
  statut: string;
  date_creation: string;
}

export default function CommissairePage() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const [commissaires, setCommissaires] = useState<Commissaire[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/');
    }
  }, [isAuthenticated, isLoading, router]);

  useEffect(() => {
    // Simuler le chargement des commissaires
    const loadCommissaires = async () => {
      setLoading(true);
      try {
        // TODO: Remplacer par un vrai appel API
        await new Promise(resolve => setTimeout(resolve, 1000));
        setCommissaires([
          {
            id: 1,
            nom: 'Ahmed Ben Ali',
            telephone: '+21612345678',
            email: 'ahmed.benali@example.com',
            ligue: 'Ligue de Tunis',
            statut: 'Actif',
            date_creation: '2024-01-15'
          },
          {
            id: 2,
            nom: 'Fatma Khelil',
            telephone: '+21687654321',
            email: 'fatma.khelil@example.com',
            ligue: 'Ligue de Sfax',
            statut: 'Actif',
            date_creation: '2024-02-20'
          }
        ]);
      } catch (error) {
        console.error('Erreur lors du chargement des commissaires:', error);
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated) {
      loadCommissaires();
    }
  }, [isAuthenticated]);

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
            <span className="mr-3">👨‍💼</span>
            Gestion des Commissaires
          </h1>
          <p className="text-white/80 text-lg">
            Administration et suivi des commissaires de match
          </p>
        </div>

        {/* Statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/80 text-sm">Total Commissaires</p>
                <p className="text-3xl font-bold text-white">{commissaires.length}</p>
              </div>
              <div className="text-4xl">👥</div>
            </div>
          </div>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/80 text-sm">Actifs</p>
                <p className="text-3xl font-bold text-green-400">
                  {commissaires.filter(c => c.statut === 'Actif').length}
                </p>
              </div>
              <div className="text-4xl">✅</div>
            </div>
          </div>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/80 text-sm">Inactifs</p>
                <p className="text-3xl font-bold text-red-400">
                  {commissaires.filter(c => c.statut === 'Inactif').length}
                </p>
              </div>
              <div className="text-4xl">❌</div>
            </div>
          </div>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/80 text-sm">Nouveaux ce mois</p>
                <p className="text-3xl font-bold text-blue-400">2</p>
              </div>
              <div className="text-4xl">🆕</div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex space-x-4">
            <button className="bg-green-500/20 backdrop-blur-sm text-green-300 px-6 py-3 rounded-lg hover:bg-green-500/30 transition-all duration-300 border border-green-500/30 flex items-center space-x-2">
              <span>➕</span>
              <span>Ajouter un Commissaire</span>
            </button>
            <button className="bg-blue-500/20 backdrop-blur-sm text-blue-300 px-6 py-3 rounded-lg hover:bg-blue-500/30 transition-all duration-300 border border-blue-500/30 flex items-center space-x-2">
              <span>📊</span>
              <span>Rapport Commissaire</span>
            </button>
          </div>
          
          <div className="flex space-x-2">
            <input
              type="text"
              placeholder="Rechercher un commissaire..."
              className="px-4 py-2 bg-white/20 backdrop-blur-sm border border-white/30 rounded-lg text-white placeholder-white/60 focus:outline-none focus:border-white/50"
            />
            <button className="bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-lg hover:bg-white/30 transition-all duration-300 border border-white/30">
              🔍
            </button>
          </div>
        </div>

        {/* Tableau des commissaires */}
        <div className="bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-white/10">
                <tr>
                  <th className="px-6 py-4 text-left text-white/90 font-semibold">Nom</th>
                  <th className="px-6 py-4 text-left text-white/90 font-semibold">Téléphone</th>
                  <th className="px-6 py-4 text-left text-white/90 font-semibold">Email</th>
                  <th className="px-6 py-4 text-left text-white/90 font-semibold">Ligue</th>
                  <th className="px-6 py-4 text-left text-white/90 font-semibold">Statut</th>
                  <th className="px-6 py-4 text-left text-white/90 font-semibold">Date Création</th>
                  <th className="px-6 py-4 text-left text-white/90 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-8 text-center">
                      <div className="flex items-center justify-center space-x-2">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                        <span className="text-white/80">Chargement des commissaires...</span>
                      </div>
                    </td>
                  </tr>
                ) : commissaires.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-8 text-center text-white/80">
                      Aucun commissaire trouvé
                    </td>
                  </tr>
                ) : (
                  commissaires.map((commissaire) => (
                    <tr key={commissaire.id} className="border-t border-white/10 hover:bg-white/5 transition-colors">
                      <td className="px-6 py-4 text-white font-medium">{commissaire.nom}</td>
                      <td className="px-6 py-4 text-white/80">{commissaire.telephone}</td>
                      <td className="px-6 py-4 text-white/80">{commissaire.email}</td>
                      <td className="px-6 py-4 text-white/80">{commissaire.ligue}</td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          commissaire.statut === 'Actif' 
                            ? 'bg-green-500/20 text-green-300 border border-green-500/30'
                            : 'bg-red-500/20 text-red-300 border border-red-500/30'
                        }`}>
                          {commissaire.statut}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-white/80">{commissaire.date_creation}</td>
                      <td className="px-6 py-4">
                        <div className="flex space-x-2">
                          <button className="text-blue-400 hover:text-blue-300 transition-colors" title="Modifier">
                            ✏️
                          </button>
                          <button className="text-red-400 hover:text-red-300 transition-colors" title="Supprimer">
                            🗑️
                          </button>
                          <button className="text-green-400 hover:text-green-300 transition-colors" title="Voir détails">
                            👁️
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

