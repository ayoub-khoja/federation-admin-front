'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useRouter } from 'next/navigation';
import adminApi from '../../services/adminApi';

interface ExcuseArbitre {
  id: number;
  nom: string;
  prenom: string;
  date_debut: string;
  date_fin: string;
  cause: string;
  piece_jointe?: string;
  statut: 'en_attente' | 'accepte' | 'refuse';
  date_creation: string;
  ligue?: string;
}

export default function ExcuseArbitresPage() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const [excuses, setExcuses] = useState<ExcuseArbitre[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    nom: '',
    ligue: 'toutes'
  });
  const [ligues, setLigues] = useState<{ id: number; nom: string }[]>([]);
  const [selectedTimeFilter, setSelectedTimeFilter] = useState('tous');
  const [isUsingAPI, setIsUsingAPI] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [timeFilterCounts, setTimeFilterCounts] = useState({
    tous: 0,
    passees: 0,
    'en-cours': 0,
    'a-venir': 0
  });

  // Options de filtrage temporel
  const timeFilterOptions = [
    { id: 'tous', name: 'Toutes les excuses', icon: '📄' },
    { id: 'passees', name: 'Excuses Passées', icon: '✅' },
    { id: 'en-cours', name: 'Excuses En Cours', icon: '🔄' },
    { id: 'a-venir', name: 'Excuses À Venir', icon: '📅' }
  ];

  // Données de démonstration avec des dates variées
  const mockExcuses: ExcuseArbitre[] = useMemo(() => [
    {
      id: 1,
      nom: 'Ben Ali',
      prenom: 'Ahmed',
      date_debut: '2024-01-15',
      date_fin: '2024-01-20',
      cause: 'Maladie avec certificat médical',
      piece_jointe: 'certificat_medical_ahmed.pdf',
      statut: 'accepte',
      date_creation: '2024-01-14',
      ligue: 'Ligue 1'
    },
    {
      id: 2,
      nom: 'Khelil',
      prenom: 'Fatma',
      date_debut: '2024-01-18',
      date_fin: '2024-01-25',
      cause: 'Décès dans la famille',
      piece_jointe: 'acte_deces.pdf',
      statut: 'accepte',
      date_creation: '2024-01-17',
      ligue: 'Ligue 2'
    },
    {
      id: 3,
      nom: 'Trabelsi',
      prenom: 'Mohamed',
      date_debut: '2024-01-22',
      date_fin: '2024-01-28',
      cause: 'Problème de transport',
      statut: 'refuse',
      date_creation: '2024-01-21',
      ligue: 'C1'
    },
    {
      id: 4,
      nom: 'Ben Youssef',
      prenom: 'Salah',
      date_debut: '2024-02-15',
      date_fin: '2024-02-20',
      cause: 'Urgence familiale',
      piece_jointe: 'justificatif_urgence.pdf',
      statut: 'en_attente',
      date_creation: '2024-01-24',
      ligue: 'C2'
    },
    {
      id: 5,
      nom: 'Ben Salem',
      prenom: 'Hassan',
      date_debut: '2024-02-18',
      date_fin: '2024-02-25',
      cause: 'Blessure sportive',
      piece_jointe: 'certificat_blessure.pdf',
      statut: 'en_attente',
      date_creation: '2024-01-27',
      ligue: 'Jeunes'
    },
    {
      id: 6,
      nom: 'Ben Amor',
      prenom: 'Nadia',
      date_debut: '2024-03-10',
      date_fin: '2024-03-15',
      cause: 'Formation professionnelle',
      statut: 'en_attente',
      date_creation: '2024-01-30',
      ligue: 'Coupe de Tunisie'
    },
    {
      id: 7,
      nom: 'Khelil',
      prenom: 'Omar',
      date_debut: '2024-03-20',
      date_fin: '2024-03-25',
      cause: 'Voyage familial',
      statut: 'en_attente',
      date_creation: '2024-02-01',
      ligue: 'Ligue 1'
    }
  ], []);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/');
    }
  }, [isAuthenticated, isLoading, router]);

  // Fonction pour charger les excuses selon le filtre temporel
  const loadExcusesByTimeFilter = useCallback(async (timeFilter: string, date: string) => {
    try {
      let response;
      
      switch (timeFilter) {
        case 'passees':
          response = await adminApi.getExcusesPassees(date);
          break;
        case 'en-cours':
          response = await adminApi.getExcusesEnCours(date);
          break;
        case 'a-venir':
          response = await adminApi.getExcusesAVenir(date);
          break;
        default:
          response = await adminApi.getExcusesArbitres();
      }
      
      console.log(`🔍 Réponse API excuses ${timeFilter}:`, response);
      
      // Déterminer la clé des excuses selon le filtre
      let excusesData = [];
      if (timeFilter === 'passees') {
        excusesData = response.excuses_passees || [];
        console.log('📋 Données excuses passées:', excusesData);
      } else if (timeFilter === 'en-cours') {
        excusesData = response.excuses_en_cours || [];
        console.log('📋 Données excuses en cours:', excusesData);
      } else if (timeFilter === 'a-venir') {
        excusesData = response.excuses_a_venir || [];
        console.log('📋 Données excuses à venir:', excusesData);
      } else {
        excusesData = response.excuses || response.results || response;
        console.log('📋 Données excuses générales:', excusesData);
      }
      
      // Transformer les données de l'API en format attendu
      const apiExcuses: ExcuseArbitre[] = excusesData.map((excuse: Record<string, unknown>) => {
        // Gérer les différents formats de nom
        let nom: string, prenom: string;
        if (excuse.nom_arbitre && excuse.prenom_arbitre) {
          // Format: nom_arbitre et prenom_arbitre séparés
          nom = String(excuse.nom_arbitre);
          prenom = String(excuse.prenom_arbitre);
        } else if (excuse.nom_complet || excuse.full_name) {
          // Format: nom_complet à diviser
          const nomComplet = String(excuse.nom_complet || excuse.full_name || '');
          const [prenomPart, ...nomParts] = nomComplet.split(' ');
          prenom = prenomPart || 'N/A';
          nom = nomParts.join(' ') || 'N/A';
        } else {
          nom = 'N/A';
          prenom = 'N/A';
        }
        
        return {
          id: Number(excuse.id),
          nom: nom,
          prenom: prenom,
          date_debut: String(excuse.date_debut || excuse.start_date || excuse.period_start || '2024-01-01'),
          date_fin: String(excuse.date_fin || excuse.end_date || excuse.period_end || '2024-01-01'),
          cause: String(excuse.cause || excuse.reason || excuse.motif || 'Non spécifiée'),
          piece_jointe: excuse.piece_jointe || excuse.attachment || excuse.justificatif ? String(excuse.piece_jointe || excuse.attachment || excuse.justificatif) : undefined,
          statut: (excuse.statut || excuse.status || excuse.etat || 'en_attente') as 'en_attente' | 'accepte' | 'refuse',
          date_creation: String(excuse.created_at || excuse.date_creation || excuse.date_soumission || new Date().toISOString().split('T')[0]),
          ligue: excuse.ligue || excuse.league || (excuse.type_match as Record<string, unknown>)?.nom ? String(excuse.ligue || excuse.league || (excuse.type_match as Record<string, unknown>)?.nom) : 'Non spécifiée'
        };
      });
      
      console.log('🔄 Données transformées:', apiExcuses);
      return apiExcuses;
    } catch (error) {
      console.error(`Erreur lors du chargement des excuses ${timeFilter}:`, error);
      return mockExcuses;
    }
  }, [mockExcuses]);

  // Fonction pour charger tous les compteurs
  const loadAllCounts = useCallback(async (date: string) => {
    try {
      const [tousResponse, passeesResponse, enCoursResponse, aVenirResponse] = await Promise.all([
        adminApi.getExcusesArbitres(),
        adminApi.getExcusesPassees(date),
        adminApi.getExcusesEnCours(date),
        adminApi.getExcusesAVenir(date)
      ]);

      const counts = {
        tous: (tousResponse.excuses || tousResponse.results || tousResponse).length,
        passees: (passeesResponse.excuses_passees || []).length,
        'en-cours': (enCoursResponse.excuses_en_cours || []).length,
        'a-venir': (aVenirResponse.excuses_a_venir || []).length
      };

      console.log('📊 Compteurs chargés:', counts);
      setTimeFilterCounts(counts);
    } catch (error) {
      console.error('Erreur lors du chargement des compteurs:', error);
      // Utiliser les données mock pour les compteurs
      setTimeFilterCounts({
        tous: mockExcuses.length,
        passees: mockExcuses.filter(e => getTimeCategory(e) === 'passees').length,
        'en-cours': mockExcuses.filter(e => getTimeCategory(e) === 'en-cours').length,
        'a-venir': mockExcuses.filter(e => getTimeCategory(e) === 'a-venir').length
      });
    }
  }, [mockExcuses]);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        // Charger les ligues
        const liguesResponse = await adminApi.getLigues();
        console.log('🔍 Réponse API ligues:', liguesResponse);
        const liguesData = liguesResponse.results || liguesResponse;
        console.log('🔄 Données ligues transformées:', liguesData);
        setLigues(Array.isArray(liguesData) ? liguesData : []);

        // Charger tous les compteurs
        await loadAllCounts(selectedDate);

        // Charger les excuses selon le filtre temporel
        const apiExcuses = await loadExcusesByTimeFilter(selectedTimeFilter, selectedDate);
        setExcuses(apiExcuses);
        setIsUsingAPI(true);
      } catch (error) {
        console.error('Erreur lors du chargement des données:', error);
        console.log('Utilisation des données de démonstration en cas d\'erreur API');
        
        // Fallback vers les données de démonstration
        setExcuses(mockExcuses);
        setLigues([
          { id: 1, nom: 'Ligue 1' },
          { id: 2, nom: 'Ligue 2' },
          { id: 3, nom: 'C1' },
          { id: 4, nom: 'C2' },
          { id: 5, nom: 'Jeunes' },
          { id: 6, nom: 'Coupe de Tunisie' }
        ]);
        setIsUsingAPI(false);
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated) {
      loadData();
    }
  }, [isAuthenticated, selectedDate, loadAllCounts, loadExcusesByTimeFilter, selectedTimeFilter, mockExcuses]);


  // Fonction pour déterminer la catégorie temporelle d'une excuse
  const getTimeCategory = (excuse: ExcuseArbitre) => {
    const today = new Date();
    const dateDebut = new Date(excuse.date_debut);
    const dateFin = new Date(excuse.date_fin);
    
    if (dateFin < today) {
      return 'passees'; // Excuse passée
    } else if (dateDebut <= today && dateFin >= today) {
      return 'en-cours'; // Excuse en cours
    } else {
      return 'a-venir'; // Excuse à venir
    }
  };

  const filteredExcuses = excuses.filter(excuse => {
    const matchesNom = excuse.nom.toLowerCase().includes(filters.nom.toLowerCase()) ||
                      excuse.prenom.toLowerCase().includes(filters.nom.toLowerCase());
    const matchesLigue = filters.ligue === 'toutes' || excuse.ligue === filters.ligue;
    // Le filtrage temporel est maintenant géré par l'API
    return matchesNom && matchesLigue;
  });


  // Gestionnaire pour le changement de filtre temporel
  const handleTimeFilterChange = async (timeFilter: string) => {
    setSelectedTimeFilter(timeFilter);
    setLoading(true);
    
    try {
      const apiExcuses = await loadExcusesByTimeFilter(timeFilter, selectedDate);
      setExcuses(apiExcuses);
      setIsUsingAPI(true);
      
      // Recharger les compteurs après le changement de filtre
      await loadAllCounts(selectedDate);
    } catch (error) {
      console.error('Erreur lors du changement de filtre temporel:', error);
      setExcuses(mockExcuses);
      setIsUsingAPI(false);
    } finally {
      setLoading(false);
    }
  };

  // Fonction pour compter les excuses par catégorie temporelle
  const getTimeFilterCounts = () => {
    // Utiliser les compteurs chargés dynamiquement
    return timeFilterCounts;
  };


  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 flex items-center justify-center">
        <div className="text-white text-xl">Chargement des excuses d&apos;arbitres...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-900 via-red-800 to-red-700 p-4">
      <div className="max-w-none mx-auto">
        {/* En-tête */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">Excuses Arbitres</h1>
              <p className="text-white/80">Gestion des excuses et justificatifs des arbitres</p>
            </div>
            {isUsingAPI && (
              <div className="bg-green-500/20 backdrop-blur-sm text-green-300 px-4 py-2 rounded-lg border border-green-500/30 flex items-center">
                <span className="mr-2">🏆</span>
                <span className="text-sm font-medium">Saison 2024-2025</span>
              </div>
            )}
          </div>
        </div>


        {/* Menu d'onglets pour filtrage temporel */}
        <div className="mb-6">
          <div className="flex space-x-1 bg-red-900/30 backdrop-blur-sm rounded-lg p-1 border border-red-500/30">
            {timeFilterOptions.map((option) => (
              <button
                key={option.id}
                onClick={() => handleTimeFilterChange(option.id)}
                className={`relative flex-1 px-4 py-3 rounded-md transition-all duration-300 flex items-center justify-center ${
                  selectedTimeFilter === option.id
                    ? 'bg-blue-500 text-white shadow-lg'
                    : 'text-white/70 hover:text-white hover:bg-white/10'
                }`}
              >
                <span className="mr-2">{option.icon}</span>
                <span className="font-medium">{option.name}</span>
                <span className="ml-2 bg-white/20 text-white/80 px-2 py-1 rounded-full text-xs">
                  {getTimeFilterCounts()[option.id as keyof typeof getTimeFilterCounts]}
                </span>
                {selectedTimeFilter === option.id && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-400 rounded-full"></div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Filtres */}
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-white/80 text-sm font-medium mb-2">
                Rechercher par nom/prénom
              </label>
              <input
                type="text"
                value={filters.nom}
                onChange={(e) => setFilters({...filters, nom: e.target.value})}
                placeholder="Nom ou prénom de l'arbitre..."
                className="w-full px-4 py-2 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-white/80 text-sm font-medium mb-2">
                Ligue
              </label>
              <select
                value={filters.ligue}
                onChange={(e) => setFilters({...filters, ligue: e.target.value})}
                className="w-full px-4 py-2 bg-white/20 border border-white/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="toutes">Toutes les ligues</option>
                {Array.isArray(ligues) && ligues.map((ligue) => (
                  <option key={ligue.id} value={ligue.nom}>
                    {ligue.nom}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-white/80 text-sm font-medium mb-2">
                Date de référence
              </label>
              <input
                type="date"
                value={selectedDate}
                onChange={async (e) => {
                  const newDate = e.target.value;
                  setSelectedDate(newDate);
                  setLoading(true);
                  
                  try {
                    // Recharger les compteurs avec la nouvelle date
                    await loadAllCounts(newDate);
                    
                    // Recharger les excuses avec la nouvelle date
                    const apiExcuses = await loadExcusesByTimeFilter(selectedTimeFilter, newDate);
                    setExcuses(apiExcuses);
                    setIsUsingAPI(true);
                  } catch (error) {
                    console.error('Erreur lors du changement de date:', error);
                    setExcuses(mockExcuses);
                    setIsUsingAPI(false);
                  } finally {
                    setLoading(false);
                  }
                }}
                className="w-full px-4 py-2 bg-white/20 border border-white/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-4">
            <button className="bg-green-500/20 backdrop-blur-sm text-green-300 px-4 py-2 rounded-lg hover:bg-green-500/30 transition-all duration-300 border border-green-500/30 flex items-center">
              <span className="mr-2">📊</span>
              Exporter
            </button>
            <button className="bg-blue-500/20 backdrop-blur-sm text-blue-300 px-4 py-2 rounded-lg hover:bg-blue-500/30 transition-all duration-300 border border-blue-500/30 flex items-center">
              <span className="mr-2">📧</span>
              Notifier
            </button>
          </div>
          <div className="text-white/80 text-sm">
            {filteredExcuses.length} excuse(s) trouvée(s)
          </div>
        </div>

        {/* Tableau des excuses */}
        <div className="bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1400px]">
              <thead className="bg-white/20">
                <tr>
                  <th className="px-12 py-6 text-left text-white/80 font-semibold text-xl w-1/6">Arbitre</th>
                  <th className="px-12 py-6 text-left text-white/80 font-semibold text-xl w-1/6">Période</th>
                  <th className="px-12 py-6 text-left text-white/80 font-semibold text-xl w-1/3">Cause</th>
                  <th className="px-12 py-6 text-left text-white/80 font-semibold text-xl w-1/6">Pièce Jointe</th>
                  <th className="px-12 py-6 text-left text-white/80 font-semibold text-xl w-1/6">Date Création</th>
                  <th className="px-12 py-6 text-left text-white/80 font-semibold text-xl w-1/12">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={6} className="px-12 py-20 text-center text-white/80">
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
                        <span className="ml-4 text-xl">Chargement des excuses...</span>
                      </div>
                    </td>
                  </tr>
                ) : filteredExcuses.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-12 py-20 text-center text-white/80 text-xl">
                      Aucune excuse trouvée
                    </td>
                  </tr>
                ) : (
                  filteredExcuses.map((excuse) => (
                    <tr key={excuse.id} className="hover:bg-white/10 transition-colors border-b border-white/10">
                      <td className="px-12 py-8">
                        <div className="text-white font-semibold text-xl">
                          {excuse.prenom} {excuse.nom}
                        </div>
                      </td>
                      <td className="px-12 py-8 text-white/90">
                        <div className="text-lg">
                          <div className="font-medium">Du: {new Date(excuse.date_debut).toLocaleDateString('fr-FR')}</div>
                          <div className="font-medium">Au: {new Date(excuse.date_fin).toLocaleDateString('fr-FR')}</div>
                        </div>
                      </td>
                      <td className="px-12 py-8 text-white/90">
                        <div className="text-lg" title={excuse.cause}>
                          {excuse.cause}
                        </div>
                      </td>
                      <td className="px-12 py-8 text-white/90">
                        {excuse.piece_jointe ? (
                          <a
                            href="#"
                            className="text-blue-400 hover:text-blue-300 underline flex items-center text-lg"
                          >
                            <span className="mr-2 text-xl">📎</span>
                            {excuse.piece_jointe}
                          </a>
                        ) : (
                          <span className="text-white/50 text-lg">Aucune</span>
                        )}
                      </td>
                      <td className="px-12 py-8 text-white/90">
                        <div className="text-lg font-medium">
                          {new Date(excuse.date_creation).toLocaleDateString('fr-FR')}
                        </div>
                      </td>
                      <td className="px-12 py-8">
                        <div className="flex items-center space-x-3">
                          <button className="text-blue-400 hover:text-blue-300 p-3 hover:bg-blue-500/20 rounded-lg transition-all duration-200" title="Voir détails">
                            <span className="text-2xl">👁️</span>
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
            Affichage de 1 à {filteredExcuses.length} sur {filteredExcuses.length} excuses
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
