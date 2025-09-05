"use client";

import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useRouter } from 'next/navigation';
import adminApi from '../services/adminApi';

interface Match {
  id: number;
  equipe1: string;
  equipe2: string;
  date: string;
  heure: string;
  stade: string;
  arbitre_principal: string;
  arbitre_assistant1: string;
  arbitre_assistant2: string;
  quatrieme_arbitre: string;
  statut: string;
  score1?: number;
  score2?: number;
}

export default function MatchsArbitresPage() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const [selectedLigue, setSelectedLigue] = useState('ligue1');
  const [selectedStatus, setSelectedStatus] = useState('tous');
  const [allMatches, setAllMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [apiStats, setApiStats] = useState<{
    total_matches: number;
    page: number;
    page_size: number;
    total_pages: number;
    has_next: boolean;
    has_previous: boolean;
  } | null>(null);

  const ligues = [
    { id: 'ligue1', name: 'Ligue 1', icon: '🥇' },
    { id: 'ligue2', name: 'Ligue 2', icon: '🥈' },
    { id: 'c1', name: 'C1', icon: '🏆' },
    { id: 'c2', name: 'C2', icon: '🏅' },
    { id: 'jeunes', name: 'Jeunes', icon: '⚽' },
    { id: 'coupe-tunisie', name: 'Coupe de Tunisie', icon: '🏆' }
  ];

  const statusOptions = [
    { id: 'tous', name: 'Tous les matchs', icon: '⚽' },
    { id: 'termine', name: 'Matchs Terminés', icon: '✅' },
    { id: 'en-cours', name: 'Matchs En Cours', icon: '🔄' },
    { id: 'programme', name: 'Matchs Programmé', icon: '📅' }
  ];

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/');
    }
  }, [isAuthenticated, isLoading, router]);

  // Fonction pour appeler la bonne API selon la ligue
  const getApiForLigue = async (ligueId: string) => {
    switch (ligueId) {
      case 'ligue1':
        return await adminApi.getMatchesLigue1();
      case 'ligue2':
        return await adminApi.getMatchesLigue2();
      case 'c1':
        return await adminApi.getMatchesC1();
      case 'c2':
        return await adminApi.getMatchesC2();
      case 'jeunes':
        return await adminApi.getMatchesJeunes();
      case 'coupe-tunisie':
        return await adminApi.getMatchesCoupeTunisie();
      default:
        return null;
    }
  };

  // Fonction pour transformer les données de l'API
  const transformApiData = (response: Record<string, unknown>): Match[] => {
    return (response.matches as Record<string, unknown>[]).map((match: Record<string, unknown>) => ({
      id: Number(match.id),
      equipe1: String(match.home_team),
      equipe2: String(match.away_team),
      date: String(match.match_date),
      heure: String(match.match_time),
      stade: String(match.stadium),
      arbitre_principal: (match.referee as Record<string, unknown>)?.full_name ? String((match.referee as Record<string, unknown>).full_name) : 'Non assigné',
      arbitre_assistant1: 'Assistant 1', // À remplacer par les vraies données quand disponibles
      arbitre_assistant2: 'Assistant 2', // À remplacer par les vraies données quand disponibles
      quatrieme_arbitre: '4ème Arbitre', // À remplacer par les vraies données quand disponibles
      statut: match.status === 'completed' ? 'Terminé' : 
             match.status === 'in_progress' ? 'En cours' : 
             match.status === 'scheduled' ? 'Programmé' : 'Programmé',
      score1: Number(match.home_score) || 0,
      score2: Number(match.away_score) || 0
    }));
  };

  // Fonction pour filtrer les matches selon le statut
  const getFilteredMatches = (allMatches: Match[]) => {
    if (selectedStatus === 'tous') {
      return allMatches;
    }
    
    const statusMap: { [key: string]: string } = {
      'termine': 'Terminé',
      'en-cours': 'En cours',
      'programme': 'Programmé'
    };
    
    const targetStatus = statusMap[selectedStatus];
    return allMatches.filter(match => match.statut === targetStatus);
  };

  // Fonction pour compter les matches par statut
  const getMatchCountByStatus = (statusId: string) => {
    if (statusId === 'tous') {
      return allMatches.length;
    }
    
    const statusMap: { [key: string]: string } = {
      'termine': 'Terminé',
      'en-cours': 'En cours',
      'programme': 'Programmé'
    };
    
    const targetStatus = statusMap[statusId];
    return allMatches.filter(match => match.statut === targetStatus).length;
  };

  useEffect(() => {
    const loadMatches = async () => {
      setLoading(true);
      try {
        // Vérifier si cette ligue a une API
        const ligueAvecApi = ['ligue1', 'ligue2', 'c1', 'c2', 'jeunes', 'coupe-tunisie'];
        
        if (ligueAvecApi.includes(selectedLigue)) {
          // Utiliser l'API réelle pour cette ligue
          const response = await getApiForLigue(selectedLigue);
          
          if (response) {
            // Sauvegarder les statistiques de l'API
            setApiStats(response.statistics);
            
            // Transformer les données de l'API en format attendu
            const apiMatches = transformApiData(response);
            setAllMatches(apiMatches);
          } else {
            // Fallback vers les données mock si l'API échoue
            throw new Error('API non disponible');
          }
        } else {
          // Utiliser les données de démonstration pour les autres ligues
          await new Promise(resolve => setTimeout(resolve, 500));
          
          const mockMatches: Match[] = [
            {
              id: 1,
              equipe1: 'ES Tunis',
              equipe2: 'Club Africain',
              date: '2024-01-15',
              heure: '20:00',
              stade: 'Stade Olympique de Radès',
              arbitre_principal: 'Ahmed Ben Ali',
              arbitre_assistant1: 'Fatma Khelil',
              arbitre_assistant2: 'Mohamed Trabelsi',
              quatrieme_arbitre: 'Salah Ben Youssef',
              statut: 'Programmé'
            },
            {
              id: 2,
              equipe1: 'CS Sfaxien',
              equipe2: 'US Monastir',
              date: '2024-01-20',
              heure: '19:30',
              stade: 'Stade Taïeb Mhiri',
              arbitre_principal: 'Amina Khelil',
              arbitre_assistant1: 'Hassan Ben Salem',
              arbitre_assistant2: 'Nadia Ben Amor',
              quatrieme_arbitre: 'Karim Ben Ali',
              statut: 'En cours'
            },
            {
              id: 3,
              equipe1: 'CA Bizertin',
              equipe2: 'AS Marsa',
              date: '2024-01-25',
              heure: '18:00',
              stade: 'Stade Municipal de Bizerte',
              arbitre_principal: 'Omar Ben Youssef',
              arbitre_assistant1: 'Leila Ben Salem',
              arbitre_assistant2: 'Youssef Ben Ali',
              quatrieme_arbitre: 'Samira Ben Amor',
              statut: 'Terminé'
            }
          ];
          
          setAllMatches(mockMatches);
        }
      } catch (error) {
        console.error('Erreur lors du chargement des matches:', error);
        
        // En cas d'erreur API, utiliser les données de démonstration comme fallback
        const ligueAvecApi = ['ligue1', 'ligue2', 'c1', 'c2', 'jeunes', 'coupe-tunisie'];
        
        if (ligueAvecApi.includes(selectedLigue)) {
          console.log(`API non disponible pour ${selectedLigue}, utilisation des données de démonstration`);
          
          // Données de démonstration pour la ligue sélectionnée
          const mockMatches: Match[] = [
            {
              id: 1,
              equipe1: 'Équipe A',
              equipe2: 'Équipe B',
              date: '2024-01-15',
              heure: '20:00',
              stade: 'Stade Municipal',
              arbitre_principal: 'Arbitre Principal',
              arbitre_assistant1: 'Assistant 1',
              arbitre_assistant2: 'Assistant 2',
              quatrieme_arbitre: '4ème Arbitre',
              statut: 'Programmé'
            },
            {
              id: 2,
              equipe1: 'Équipe C',
              equipe2: 'Équipe D',
              date: '2024-01-20',
              heure: '19:30',
              stade: 'Stade Olympique',
              arbitre_principal: 'Arbitre Principal 2',
              arbitre_assistant1: 'Assistant 3',
              arbitre_assistant2: 'Assistant 4',
              quatrieme_arbitre: '4ème Arbitre 2',
              statut: 'En cours'
            }
          ];
          
          setAllMatches(mockMatches);
          setApiStats(null); // Pas de statistiques API en mode fallback
        } else {
          setAllMatches([]);
        }
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated) {
      loadMatches();
    }
  }, [isAuthenticated, selectedLigue]);

  // Filtrer les matches quand le statut change
  const matches = getFilteredMatches(allMatches);

  const getStatutColor = (statut: string) => {
    switch (statut) {
      case 'Programmé':
        return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
      case 'En cours':
        return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
      case 'Terminé':
        return 'bg-green-500/20 text-green-300 border-green-500/30';
      case 'Annulé':
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
      <div className="max-w-full mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2 flex items-center">
            <span className="mr-3">⚽</span>
            Matchs Arbitrés
          </h1>
          <p className="text-white/80 text-lg">
            Gestion des matches et désignations d&apos;arbitres
          </p>
        </div>

        {/* Menu horizontal des ligues */}
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20 mb-6">
          <h3 className="text-white font-semibold mb-4 flex items-center">
            <span className="mr-2">🏆</span>
            Sélectionner une ligue
            {selectedLigue === 'ligue1' && (
              <span className="ml-2 px-2 py-1 bg-green-500/20 text-green-300 text-xs rounded-full border border-green-500/30">
                📡 API Réelle
              </span>
            )}
          </h3>
          <div className="flex flex-wrap gap-3">
            {ligues.map((ligue) => (
              <button
                key={ligue.id}
                onClick={() => setSelectedLigue(ligue.id)}
                className={`flex items-center space-x-2 px-4 py-3 rounded-lg transition-all duration-300 border ${
                  selectedLigue === ligue.id
                    ? 'bg-white/20 text-white border-white/30 shadow-lg'
                    : 'bg-white/10 text-white/80 border-white/20 hover:bg-white/15 hover:text-white'
                }`}
              >
                <span className="text-xl">{ligue.icon}</span>
                <span className="font-medium">{ligue.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Statistiques de la ligue sélectionnée */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/80 text-sm">Total Matches</p>
                <p className="text-3xl font-bold text-white">
                  {['ligue1', 'ligue2', 'c1', 'c2', 'jeunes', 'coupe-tunisie'].includes(selectedLigue) && apiStats ? apiStats.total_matches : matches.length}
                </p>
                {['ligue1', 'ligue2', 'c1', 'c2', 'jeunes', 'coupe-tunisie'].includes(selectedLigue) && apiStats && (
                  <p className="text-xs text-green-300 mt-1">📡 Données API</p>
                )}
              </div>
              <div className="text-4xl">⚽</div>
            </div>
          </div>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/80 text-sm">Programmés</p>
                <p className="text-3xl font-bold text-blue-400">
                  {matches.filter(m => m.statut === 'Programmé').length}
                </p>
              </div>
              <div className="text-4xl">📅</div>
            </div>
          </div>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/80 text-sm">En Cours</p>
                <p className="text-3xl font-bold text-yellow-400">
                  {matches.filter(m => m.statut === 'En cours').length}
                </p>
              </div>
              <div className="text-4xl">🔄</div>
            </div>
          </div>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/80 text-sm">Terminés</p>
                <p className="text-3xl font-bold text-green-400">
                  {matches.filter(m => m.statut === 'Terminé').length}
                </p>
              </div>
              <div className="text-4xl">✅</div>
            </div>
          </div>
        </div>

        {/* Menu d'onglets pour filtrer par statut */}
        <div className="mb-6">
          <div className="flex space-x-1 bg-white/10 backdrop-blur-sm rounded-lg p-1 border border-white/20">
            {statusOptions.map((status) => (
              <button
                key={status.id}
                onClick={() => setSelectedStatus(status.id)}
                className={`relative flex-1 px-4 py-3 rounded-md transition-all duration-300 flex items-center justify-center ${
                  selectedStatus === status.id
                    ? 'bg-blue-500 text-white shadow-lg'
                    : 'text-white/70 hover:text-white hover:bg-white/10'
                }`}
              >
                <span className="mr-2">{status.icon}</span>
                <span className="font-medium">{status.name}</span>
                <span className="ml-2 bg-white/20 text-white/80 px-2 py-1 rounded-full text-xs">
                  {getMatchCountByStatus(status.id)}
                </span>
                {selectedStatus === status.id && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-400 rounded-full"></div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-4">
            <button className="bg-green-500/20 backdrop-blur-sm text-green-300 px-4 py-2 rounded-lg hover:bg-green-500/30 transition-all duration-300 border border-green-500/30 flex items-center">
              <span className="mr-2">➕</span>
              Nouveau Match
            </button>
            <button className="bg-blue-500/20 backdrop-blur-sm text-blue-300 px-4 py-2 rounded-lg hover:bg-blue-500/30 transition-all duration-300 border border-blue-500/30 flex items-center">
              <span className="mr-2">👥</span>
              Désigner Arbitres
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

        {/* Tableau des matches */}
        <div className="bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1400px]">
              <thead className="bg-white/20">
                <tr>
                  <th className="px-4 py-4 text-left text-white font-semibold w-48">Équipes</th>
                  <th className="px-4 py-4 text-left text-white font-semibold w-32">Date & Heure</th>
                  <th className="px-4 py-4 text-left text-white font-semibold w-48">Stade</th>
                  <th className="px-4 py-4 text-left text-white font-semibold w-40">Arbitre Principal</th>
                  <th className="px-4 py-4 text-left text-white font-semibold w-40">Assistants</th>
                  <th className="px-4 py-4 text-left text-white font-semibold w-32">4ème Arbitre</th>
                  <th className="px-4 py-4 text-left text-white font-semibold w-24">Statut</th>
                  <th className="px-4 py-4 text-left text-white font-semibold w-32">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/20">
                {loading ? (
                  <tr>
                    <td colSpan={8} className="px-4 py-8 text-center">
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mr-3"></div>
                        <span className="text-white/80">Chargement des matches...</span>
                      </div>
                    </td>
                  </tr>
                ) : matches.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-4 py-8 text-center text-white/80">
                      Aucun match trouvé pour cette ligue
                    </td>
                  </tr>
                ) : (
                  matches.map((match) => (
                    <tr key={match.id} className="hover:bg-white/10 transition-colors">
                      <td className="px-4 py-4">
                        <div className="text-white font-semibold">
                          {match.equipe1} vs {match.equipe2}
                        </div>
                        {match.score1 !== undefined && match.score2 !== undefined && (
                          <div className="text-green-400 font-bold text-sm mt-1">
                            {match.score1} - {match.score2}
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-4 text-white/90">
                        <div className="font-medium">{match.date}</div>
                        <div className="text-sm text-white/70">{match.heure}</div>
                      </td>
                      <td className="px-4 py-4 text-white/90">{match.stade}</td>
                      <td className="px-4 py-4 text-white font-medium">{match.arbitre_principal}</td>
                      <td className="px-4 py-4 text-white/90">
                        <div className="text-sm">{match.arbitre_assistant1}</div>
                        <div className="text-sm">{match.arbitre_assistant2}</div>
                      </td>
                      <td className="px-4 py-4 text-white/90">{match.quatrieme_arbitre}</td>
                      <td className="px-4 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatutColor(match.statut)}`}>
                          {match.statut}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center justify-center space-x-1">
                          <button className="text-blue-400 hover:text-blue-300 transition-colors p-1" title="Voir détails">
                            👁️
                          </button>
                          <button className="text-green-400 hover:text-green-300 transition-colors p-1" title="Modifier">
                            ✏️
                          </button>
                          <button className="text-yellow-400 hover:text-yellow-300 transition-colors p-1" title="Désigner arbitres">
                            👥
                          </button>
                          <button className="text-red-400 hover:text-red-300 transition-colors p-1" title="Supprimer">
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
            {['ligue1', 'ligue2', 'c1', 'c2', 'jeunes', 'coupe-tunisie'].includes(selectedLigue) && apiStats ? (
              <>
                Affichage de {((apiStats.page - 1) * apiStats.page_size) + 1} à {Math.min(apiStats.page * apiStats.page_size, apiStats.total_matches)} sur {apiStats.total_matches} matches
                <span className="ml-2 text-green-300">📡 API</span>
              </>
            ) : (
              `Affichage de 1 à ${matches.length} sur ${matches.length} matches`
            )}
          </div>
          <div className="flex items-center space-x-2">
            <button 
              className={`px-3 py-2 rounded-lg transition-all duration-300 border ${
                ['ligue1', 'ligue2', 'c1', 'c2', 'jeunes', 'coupe-tunisie'].includes(selectedLigue) && apiStats ? !apiStats.has_previous : false
                  ? 'bg-gray-500/20 text-gray-500 border-gray-500/30 cursor-not-allowed'
                  : 'bg-white/20 backdrop-blur-sm text-white border-white/30 hover:bg-white/30'
              }`}
              disabled={['ligue1', 'ligue2', 'c1', 'c2', 'jeunes', 'coupe-tunisie'].includes(selectedLigue) && apiStats ? !apiStats.has_previous : false}
            >
              ← Précédent
            </button>
            <span className="text-white/80 px-3 py-2">
              {['ligue1', 'ligue2', 'c1', 'c2', 'jeunes', 'coupe-tunisie'].includes(selectedLigue) && apiStats 
                ? `Page ${apiStats.page} sur ${apiStats.total_pages}`
                : 'Page 1 sur 1'
              }
            </span>
            <button 
              className={`px-3 py-2 rounded-lg transition-all duration-300 border ${
                ['ligue1', 'ligue2', 'c1', 'c2', 'jeunes', 'coupe-tunisie'].includes(selectedLigue) && apiStats ? !apiStats.has_next : false
                  ? 'bg-gray-500/20 text-gray-500 border-gray-500/30 cursor-not-allowed'
                  : 'bg-white/20 backdrop-blur-sm text-white border-white/30 hover:bg-white/30'
              }`}
              disabled={['ligue1', 'ligue2', 'c1', 'c2', 'jeunes', 'coupe-tunisie'].includes(selectedLigue) && apiStats ? !apiStats.has_next : false}
            >
              Suivant →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
