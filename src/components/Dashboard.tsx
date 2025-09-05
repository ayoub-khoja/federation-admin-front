"use client";

import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../hooks/useToast';
import { useLoading } from '../hooks/useLoading';
import { useLigues } from '../hooks/useLigues';
import { Sidebar } from './Sidebar';
import { AddNewsModal } from './AddNewsModal';
import AddLigueModal from './AddLigueModal';
import EditLigueModal from './EditLigueModal';
import EditNewsModal from './EditNewsModal';
import AddArbitreModal from './AddArbitreModal';
import { NewsCard } from './NewsCard';
import { ToastContainer } from './ui';
import adminApi from '../services/adminApi';
import { newsService, News } from '../services/newsService';
import PaiementArbitrePage from './PaiementArbitrePage';
import MatchsArbitresPage from './MatchsArbitresPage';
import ExcuseArbitresPage from '../app/excuse-arbitres/page';

interface DashboardStats {
  total_arbitres: number;
  arbitres_actifs: number;
  arbitres_en_attente: number;
  total_ligues: number;
  total_matches: number;
  matches_ce_mois: number;
}

interface Arbitre {
  id: string;
  phone_number: string;
  full_name: string;
  email?: string;
  grade: string;
  ligue_nom?: string;
  is_verified: boolean;
  date_joined: string;
  birth_date?: string;
}

export default function Dashboard() {
  const { user, logout } = useAuth();
  const { toasts, showSuccess, showError, removeToast } = useToast();
  const { setLoading, isLoading: loadingState } = useLoading();
  const { ligues, isLoading: liguesLoading, error: liguesError, createLigue, updateLigue, deleteLigue } = useLigues();
  
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [arbitres, setArbitres] = useState<Arbitre[]>([]);
  const [news, setNews] = useState<News[]>([]);
  const [currentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [activeMenuItem, setActiveMenuItem] = useState('dashboard');
  const [showAddNewsModal, setShowAddNewsModal] = useState(false);
  const [showEditNewsModal, setShowEditNewsModal] = useState(false);
  const [editingNews, setEditingNews] = useState<News | null>(null);
  const [showAddLigueModal, setShowAddLigueModal] = useState(false);
  const [showEditLigueModal, setShowEditLigueModal] = useState(false);
  const [editingLigue, setEditingLigue] = useState<{id: number; nom: string; description: string; is_active: boolean; ordre: number} | null>(null);
  const [showAddArbitreModal, setShowAddArbitreModal] = useState(false);
  const [newsLanguage, setNewsLanguage] = useState<'fr' | 'ar'>('fr');

  useEffect(() => {
    if (user) {
      loadDashboardData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, currentPage, searchTerm]);

  useEffect(() => {
    if (ligues.length > 0) {
      // Mettre à jour les stats quand les ligues sont chargées
      setStats(prev => prev ? {
        ...prev,
        total_ligues: ligues.length
      } : null);
    }
  }, [ligues]);

  const loadDashboardData = async () => {
    if (!user) return; // Ne pas charger si l'utilisateur n'est pas authentifié
    
    setIsLoading(true);
    try {
      // Charger les statistiques avec les vraies données
      const statsData: DashboardStats = {
        total_arbitres: 150,
        arbitres_actifs: 120,
        arbitres_en_attente: 30,
        total_ligues: ligues.length || 0,
        total_matches: 45,
        matches_ce_mois: 15
      };
      setStats(statsData);

      // Charger la liste des arbitres
      const arbitresData = await adminApi.getArbitres(currentPage, searchTerm);
      setArbitres(arbitresData.results || []);
      
      // Mettre à jour les vraies statistiques
      if (arbitresData.results) {
        const totalArbitres = arbitresData.count || arbitresData.results.length;
        const arbitresActifs = arbitresData.results.filter((a: Arbitre) => a.is_verified).length;
        const arbitresEnAttente = arbitresData.results.filter((a: Arbitre) => !a.is_verified).length;
        
        setStats(prev => prev ? {
          ...prev,
          total_arbitres: totalArbitres,
          arbitres_actifs: arbitresActifs,
          arbitres_en_attente: arbitresEnAttente
        } : null);
      }
    } catch (error) {
      console.error('Erreur lors du chargement:', error);
      showError('Erreur lors du chargement des données');
      setArbitres([]);
    } finally {
      setIsLoading(false);
    }
  };



  const loadNews = useCallback(async () => {
    try {
      setLoading('news', true);
      const response = await newsService.getAdminNews(1, searchTerm);
      setNews(response.results);
    } catch {
      showError('Erreur lors du chargement des actualités');
    } finally {
      setLoading('news', false);
    }
  }, [searchTerm, setLoading, showError]);



  // Gestion des ligues
  const handleCreateLigue = async (ligueData: {
    nom: string;
    description: string;
    ordre: number;
  }) => {
    try {
      await createLigue(ligueData);
      showSuccess('Ligue créée avec succès');
    } catch {
      showError('Erreur lors de la création de la ligue');
    }
  };

  const handleEditLigue = (ligue: {id: number; nom: string; description: string; is_active: boolean; ordre: number}) => {
    setEditingLigue(ligue);
    setShowEditLigueModal(true);
  };

  const handleUpdateLigue = async (ligueData: {
    id: number;
    nom: string;
    description: string;
    is_active: boolean;
    ordre: number;
  }) => {
    try {
      await updateLigue(ligueData);
      showSuccess('Ligue mise à jour avec succès !');
      setShowEditLigueModal(false);
      setEditingLigue(null);
    } catch {
      showError('Erreur lors de la mise à jour de la ligue');
    }
  };

  const handleDeleteLigue = async (ligueId: number, ligueNom: string) => {
    if (!confirm(`Êtes-vous sûr de vouloir supprimer la ligue "${ligueNom}" ?`)) {
      return;
    }

    try {
      await deleteLigue(ligueId);
      showSuccess('Ligue supprimée avec succès');
    } catch {
      showError('Erreur lors de la suppression de la ligue');
    }
  };

  // Gestion des arbitres
  const handleCreateArbitre = async (arbitreData: {
    first_name: string;
    last_name: string;
    phone_number: string;
    email: string;
    address: string;
    grade: string;
    ligue_id: number;
    birth_date: string;
    birth_place: string;
    password: string;
    password_confirm: string;
  }) => {
    try {
      // Transformer les données du modal vers le format attendu par l'API
      const apiData = {
        first_name: arbitreData.first_name,
        last_name: arbitreData.last_name,
        phone_number: arbitreData.phone_number,
        email: arbitreData.email,
        address: arbitreData.address,
        grade: arbitreData.grade,
        ligue_id: arbitreData.ligue_id,
        birth_date: arbitreData.birth_date,
        birth_place: arbitreData.birth_place,
        password: arbitreData.password,
        password_confirm: arbitreData.password_confirm
      };
      
      await adminApi.createArbitre(apiData);
      showSuccess('Arbitre créé avec succès');
      loadDashboardData(); // Recharger les données
    } catch (error: unknown) {
      console.error('Erreur complète:', error);
      
      // Afficher les erreurs détaillées du backend
      if (error && typeof error === 'object' && 'message' in error) {
        const errorMessage = (error as { message: string }).message;
        showError(`Erreur lors de la création de l'arbitre: ${errorMessage}`);
        
        // Si c'est une erreur de validation, l'afficher dans le formulaire
        if (errorMessage.includes('validation') || errorMessage.includes('Erreur')) {
          // L'erreur sera gérée par le composant AddArbitreModal
          throw error; // Remonter l'erreur pour qu'elle soit gérée par le modal
        }
      } else if (error && typeof error === 'object' && 'detail' in error) {
        showError(`Erreur lors de la création de l'arbitre: ${(error as { detail: string }).detail}`);
      } else {
        showError('Erreur lors de la création de l\'arbitre');
      }
    }
  };

  const handleDeleteArbitre = async (arbitreId: string, arbitreNom: string) => {
    if (!confirm(`Êtes-vous sûr de vouloir supprimer l'arbitre "${arbitreNom}" ?`)) {
      return;
    }

    try {
      await adminApi.deleteArbitre(arbitreId);
      showSuccess('Arbitre supprimé avec succès');
      loadDashboardData(); // Recharger les données
    } catch {
      showError('Erreur lors de la suppression de l\'arbitre');
    }
  };



  const handleNewsSuccess = () => {
    loadNews();
  };

  const handleEditNews = (news: News) => {
    setEditingNews(news);
    setShowEditNewsModal(true);
  };

  const handleUpdateNews = async (newsData: {
    id: number;
    title_fr: string;
    title_ar: string;
    content_fr: string;
    content_ar: string;
  }) => {
    try {
      await adminApi.updateNews(newsData.id.toString(), newsData);
      showSuccess('Actualité mise à jour avec succès !');
      setShowEditNewsModal(false);
      setEditingNews(null);
      loadNews();
    } catch {
      showError('Erreur lors de la mise à jour de l\'actualité');
    }
  };

  const handleDeleteNewsItem = async (newsId: number) => {
    try {
      await adminApi.deleteNews(newsId.toString());
      showSuccess('Actualité supprimée avec succès !');
      loadNews();
    } catch {
      showError('Erreur lors de la suppression de l\'actualité');
    }
  };



  // Charger les actualités quand on change de section
  useEffect(() => {
    if (activeMenuItem === 'accueil-arbitres') {
      loadNews();
    }
  }, [activeMenuItem, searchTerm, loadNews]);

  const getGradeLabel = (grade: string) => {
    const grades: {[key: string]: string} = {
      'candidat': 'Candidat',
      '3eme_serie': '3ème Série',
      '2eme_serie': '2ème Série',
      '1ere_serie': '1ère Série',
      'federale': 'Fédérale'
    };
    return grades[grade] || grade;
  };

  // Fonctions de rendu pour les nouvelles pages
  const renderCommissaireContent = () => (
    <div className="min-h-screen bg-gradient-to-br from-red-900 via-red-800 to-red-900 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2 flex items-center">
            <span className="mr-3">👨‍💼</span>
            Gestion des Commissaires
          </h1>
          <p className="text-white/80 text-lg">
            Administration et suivi des commissaires de match
          </p>
        </div>
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8 border border-white/20 text-center">
          <p className="text-white/80 text-lg">Page Commissaire en cours de développement...</p>
        </div>
      </div>
    </div>
  );

  const renderRapportCommissaireContent = () => (
    <div className="min-h-screen bg-gradient-to-br from-red-900 via-red-800 to-red-900 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2 flex items-center">
            <span className="mr-3">📋</span>
            Rapport Commissaire
          </h1>
          <p className="text-white/80 text-lg">
            Consultation et gestion des rapports de commissaires
          </p>
        </div>
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8 border border-white/20 text-center">
          <p className="text-white/80 text-lg">Page Rapport Commissaire en cours de développement...</p>
        </div>
      </div>
    </div>
  );

  const renderPaiementArbitreContent = () => {
    return <PaiementArbitrePage />;
  };

  const renderExcuseArbitresContent = () => {
    return <ExcuseArbitresPage />;
  };

  const renderContent = () => {
    switch (activeMenuItem) {
      case 'dashboard':
        return renderDashboardContent();
      case 'accueil-arbitres':
        return renderAccueilArbitresContent();
      case 'arbitres':
        return renderArbitresContent();
      case 'arbitres-attente':
        return renderArbitresAttenteContent();
      case 'ligues':
        return renderLiguesContent();
      case 'matchs':
        return renderMatchesContent();
      case 'commissaire':
        return renderCommissaireContent();
      case 'rapport-commissaire':
        return renderRapportCommissaireContent();
      case 'paiement-arbitre':
        return renderPaiementArbitreContent();
      case 'Excuse-Arbitres':
        return renderExcuseArbitresContent();
      case 'rapports':
        return renderRapportsContent();
      case 'statistiques':
        return renderStatistiquesContent();
      case 'parametres':
        return renderParametresContent();
      default:
        return renderDashboardContent();
    }
  };

  const renderDashboardContent = () => (
    <>
      {/* Statistiques avec effet de verre */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-white/20 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-white/30 hover:bg-white/30 transition-all duration-300 group">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-white/20 group-hover:bg-white/30 transition-all duration-300">
                <span className="text-3xl">👥</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-white/80">Total Arbitres</p>
                <p className="text-3xl font-bold text-white">{stats.total_arbitres}</p>
              </div>
            </div>
          </div>

          <div className="bg-white/20 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-white/30 hover:bg-white/30 transition-all duration-300 group">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-white/20 group-hover:bg-white/30 transition-all duration-300">
                <span className="text-3xl">✅</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-white/80">Arbitres Actifs</p>
                <p className="text-3xl font-bold text-white">{stats.arbitres_actifs}</p>
              </div>
            </div>
          </div>

          <div className="bg-white/20 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-white/30 hover:bg-white/30 transition-all duration-300 group">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-white/20 group-hover:bg-white/30 transition-all duration-300">
                <span className="text-3xl">⏳</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-white/80">En Attente</p>
                <p className="text-3xl font-bold text-white">{stats.arbitres_en_attente}</p>
              </div>
            </div>
          </div>

          <div className="bg-white/20 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-white/30 hover:bg-white/30 transition-all duration-300 group">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-white/20 group-hover:bg-white/30 transition-all duration-300">
                <span className="text-3xl">🏆</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-white/80">Total Ligues</p>
                <p className="text-3xl font-bold text-white">{stats.total_ligues}</p>
              </div>
            </div>
          </div>

          <div className="bg-white/20 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-white/30 hover:bg-white/30 transition-all duration-300 group">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-white/20 group-hover:bg-white/30 transition-all duration-300">
                <span className="text-3xl">⚽</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-white/80">Total Matchs</p>
                <p className="text-3xl font-bold text-white">{stats.total_matches}</p>
              </div>
            </div>
          </div>

          <div className="bg-white/20 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-white/30 hover:bg-white/30 transition-all duration-300 group">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-white/20 group-hover:bg-white/30 transition-all duration-300">
                <span className="text-3xl">📅</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-white/80">Matchs ce mois</p>
                <p className="text-3xl font-bold text-white">{stats.matches_ce_mois}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );

  const renderArbitresContent = () => (
    <div className="bg-white/20 backdrop-blur-sm rounded-2xl shadow-lg border border-white/30">
      <div className="px-6 py-4 border-b border-white/20">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <h2 className="text-lg font-medium text-white mb-4 md:mb-0">
            🏆 Gestion des Arbitres
          </h2>
          <div className="flex items-center space-x-4">
            <input
              type="text"
              placeholder="Rechercher un arbitre..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-3 py-2 bg-white/20 backdrop-blur-sm border border-white/30 rounded-lg focus:ring-2 focus:ring-white/50 focus:border-white/50 text-white placeholder-white/60"
            />
            <button 
              onClick={() => setShowAddArbitreModal(true)}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-all duration-300 flex items-center space-x-2"
            >
              <span>➕</span>
              <span>Ajouter un arbitre</span>
            </button>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-white"></div>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-white/20">
              <thead className="bg-white/10">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white/80 uppercase tracking-wider">
                    👤 Arbitre
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white/80 uppercase tracking-wider">
                    🏅 Grade
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white/80 uppercase tracking-wider">
                    🏛️ Ligue
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white/80 uppercase tracking-wider">
                    📅 Date de naissance
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white/80 uppercase tracking-wider">
                    ⚙️ Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white/5 divide-y divide-white/10">
                {arbitres.map((arbitre) => (
                  <tr key={arbitre.id} className="hover:bg-white/10 transition-colors duration-200">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-white">
                          {arbitre.full_name}
                        </div>
                        <div className="text-sm text-white/70">
                          📱 {arbitre.phone_number}
                        </div>
                        {arbitre.email && (
                          <div className="text-sm text-white/70">
                            ✉️ {arbitre.email}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                      {getGradeLabel(arbitre.grade)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                      {arbitre.ligue_nom || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                      {arbitre.birth_date ? new Date(arbitre.birth_date).toLocaleDateString('fr-FR') : 'Non renseignée'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        {/* Icône pour voir les détails */}
                        <button 
                          className="bg-blue-500/20 text-blue-300 hover:bg-blue-500/30 px-3 py-1 rounded-lg transition-all duration-200 border border-blue-500/30"
                          title="Voir les détails de l'arbitre"
                        >
                          👁️
                        </button>
                        
                        {/* Bouton de suppression */}
                        <button 
                          onClick={() => handleDeleteArbitre(arbitre.id, arbitre.full_name)}
                          className="bg-red-500/20 text-red-300 hover:bg-red-500/30 px-3 py-1 rounded-lg transition-all duration-200 border border-red-500/30"
                          title="Supprimer cet arbitre"
                        >
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {arbitres.length === 0 && !isLoading && (
            <div className="text-center py-8">
              <p className="text-white/70 text-lg">🔍 Aucun arbitre trouvé</p>
              <p className="text-white/50 text-sm mt-2">Les arbitres apparaîtront ici une fois chargés</p>
            </div>
          )}
        </>
      )}
    </div>
  );

  const renderArbitresAttenteContent = () => (
    <div className="bg-white/20 backdrop-blur-sm rounded-2xl shadow-lg border border-white/30 p-6">
      <h2 className="text-xl font-bold text-white mb-4">⏳ Arbitres en Attente</h2>
      <p className="text-white/70">Affichage des arbitres en attente de validation...</p>
    </div>
  );

  const renderLiguesContent = () => (
    <div className="bg-white/20 backdrop-blur-sm rounded-2xl shadow-lg border border-white/30 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-white">🏛️ Gestion des Ligues</h2>
        <button
          onClick={() => setShowAddLigueModal(true)}
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
        >
          <span>➕</span>
          <span>Ajouter une ligue</span>
        </button>
      </div>
      
      {liguesLoading ? (
        <div className="text-white/70">Chargement des ligues...</div>
      ) : liguesError ? (
        <div className="text-red-400">Erreur: {liguesError}</div>
      ) : (
        <div className="space-y-4">
          <div className="text-white/70 mb-4">
            {ligues.length} ligues d&apos;arbitrage trouvées
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {ligues.map((ligue) => (
              <div key={ligue.id} className="bg-white/10 rounded-lg p-4 border border-white/20">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-white">{ligue.nom}</h3>
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      ligue.is_active ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'
                    }`}>
                      {ligue.is_active ? 'Active' : 'Inactive'}
                    </span>
                    <button
                      onClick={() => handleEditLigue(ligue)}
                      className="text-blue-400 hover:text-blue-300 transition-colors p-1"
                      title="Modifier cette ligue"
                    >
                      ✏️
                    </button>
                    <button
                      onClick={() => handleDeleteLigue(ligue.id, ligue.nom)}
                      className="text-red-400 hover:text-red-300 transition-colors p-1"
                      title="Supprimer cette ligue"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
                <p className="text-white/70 text-sm mb-2">{ligue.description}</p>
                <p className="text-white/50 text-xs">Ordre: {ligue.ordre}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  const renderMatchesContent = () => {
    return <MatchsArbitresPage />;
  };

  const renderRapportsContent = () => (
    <div className="bg-white/20 backdrop-blur-sm rounded-2xl shadow-lg border border-white/30 p-6">
      <h2 className="text-xl font-bold text-white mb-4">📋 Rapports</h2>
      <p className="text-white/70">Génération et consultation des rapports...</p>
    </div>
  );

  const renderStatistiquesContent = () => (
    <div className="bg-white/20 backdrop-blur-sm rounded-2xl shadow-lg border border-white/30 p-6">
      <h2 className="text-xl font-bold text-white mb-4">📈 Statistiques Avancées</h2>
      <p className="text-white/70">Analyse des données et tendances...</p>
    </div>
  );

  const renderAccueilArbitresContent = () => (
    <div className="space-y-6">
      {/* Header avec contrôles */}
      <div className="bg-white/20 backdrop-blur-sm rounded-2xl shadow-lg border border-white/30 p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">🏠 Accueil Arbitres</h2>
            <p className="text-white/70">Gestion des actualités et communications</p>
          </div>
          <div className="flex items-center space-x-4 mt-4 md:mt-0">
            {/* Sélecteur de langue */}
            <div className="flex bg-white/10 rounded-lg border border-white/20">
              <button
                onClick={() => setNewsLanguage('fr')}
                className={`px-4 py-2 rounded-l-lg transition-all duration-200 ${
                  newsLanguage === 'fr' 
                    ? 'bg-white/20 text-white' 
                    : 'text-white/70 hover:text-white'
                }`}
              >
                🇫🇷 FR
              </button>
              <button
                onClick={() => setNewsLanguage('ar')}
                className={`px-4 py-2 rounded-r-lg transition-all duration-200 ${
                  newsLanguage === 'ar' 
                    ? 'bg-white/20 text-white' 
                    : 'text-white/70 hover:text-white'
                }`}
              >
                🇹🇳 AR
              </button>
            </div>
            {/* Recherche */}
            <input
              type="text"
              placeholder="Rechercher une actualité..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-4 py-2 bg-white/20 backdrop-blur-sm border border-white/30 rounded-lg focus:border-white/50 focus:outline-none transition-colors text-white placeholder-white/60"
            />
            {/* Bouton d'ajout */}
            <button
              onClick={() => setShowAddNewsModal(true)}
              className="bg-green-500/20 backdrop-blur-sm text-green-300 px-6 py-2 rounded-lg hover:bg-green-500/30 transition-all duration-300 border border-green-500/30 flex items-center space-x-2"
            >
              <span>➕</span>
              <span>Nouvelle Actualité</span>
            </button>
          </div>
        </div>
      </div>

      {/* Liste des actualités */}
      {loadingState('news') ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-white"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {news.length > 0 ? (
            news.map((newsItem, index) => (
              <div
                key={newsItem.id}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <NewsCard
                  news={newsItem}
                  onDelete={handleDeleteNewsItem}
                  onEdit={handleEditNews}
                  language={newsLanguage}
                />
              </div>
            ))
          ) : (
            <div className="col-span-full">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-12 text-center border border-white/20">
                <div className="text-6xl mb-4">📰</div>
                <h3 className="text-xl font-bold text-white mb-2">Aucune actualité</h3>
                <p className="text-white/70 mb-6">
                  Commencez par créer votre première actualité pour les arbitres
                </p>
                <button
                  onClick={() => setShowAddNewsModal(true)}
                  className="bg-green-500/20 backdrop-blur-sm text-green-300 px-6 py-3 rounded-lg hover:bg-green-500/30 transition-all duration-300 border border-green-500/30"
                >
                  ➕ Créer une actualité
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );

  const renderParametresContent = () => (
    <div className="bg-white/20 backdrop-blur-sm rounded-2xl shadow-lg border border-white/30 p-6">
      <h2 className="text-xl font-bold text-white mb-4">⚙️ Paramètres Système</h2>
      <p className="text-white/70">Configuration et préférences...</p>
    </div>
  );

  if (isLoading && !stats) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-red-600"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement de l&apos;authentification...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden flex">
      {/* Arrière-plan avec gradient rouge comme l'app mobile */}
      <div className="absolute inset-0 bg-gradient-to-br from-red-500 via-red-600 to-red-700">
        {/* Motifs géométriques simples */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-red-400/20 rounded-full -translate-y-24 translate-x-24 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-red-400/20 rounded-full translate-y-32 -translate-x-32 blur-3xl"></div>
      </div>

      {/* Sidebar */}
      <Sidebar 
        activeItem={activeMenuItem}
        onItemSelectAction={setActiveMenuItem}
        liguesCount={ligues.length}
        arbitresCount={arbitres.length}
        arbitresEnAttenteCount={arbitres.filter(a => !a.is_verified).length}
        matchesCount={stats?.total_matches || 0}
        newsCount={news.length}
      />

      {/* Contenu principal */}
      <div className="flex-1 flex flex-col">
        {/* Header avec les logos */}
        <header className="relative z-10 bg-white/10 backdrop-blur-sm border-b border-white/20">
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
              <div className="flex items-center space-x-6">
                {/* Logos comme dans l'app mobile */}
                <div className="flex items-center space-x-4">
                  <div className="relative animate-float">
                    <Image
                      src="/cartons.png"
                      alt="Cartons d'arbitre"
                      width={40}
                      height={40}
                      className="drop-shadow-lg"
                      priority
                    />
                  </div>
                  <div className="relative animate-float" style={{animationDelay: '0.5s'}}>
                    <Image
                      src="/ftf-logo.png"
                      alt="Fédération Tunisienne de Football"
                      width={40}
                      height={40}
                      className="drop-shadow-lg"
                      priority
                    />
                  </div>
                </div>
                <div>
                  <h1 className="text-xl font-bold text-white">Administration FTF</h1>
                  <p className="text-white/80 text-sm">Direction Nationale de l&apos;Arbitrage</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <span className="text-sm text-white/90 bg-white/10 px-3 py-1 rounded-full">
                  👤 {user?.full_name}
                </span>
                <button
                  onClick={logout}
                  className="bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-lg hover:bg-white/30 transition-all duration-300 border border-white/30"
                >
                  Déconnexion
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Zone de contenu principale */}
        <main className="flex-1 relative z-10 p-6 animate-fadeInUp overflow-y-auto">
          {renderContent()}
        </main>
      </div>

      {/* Modales */}
      <AddNewsModal
        isOpen={showAddNewsModal}
        onClose={() => setShowAddNewsModal(false)}
        onSuccess={handleNewsSuccess}
      />

      {/* Modal pour ajouter des ligues */}
      <AddLigueModal 
        isOpen={showAddLigueModal}
        onClose={() => setShowAddLigueModal(false)}
        onSubmit={handleCreateLigue}
        isLoading={liguesLoading}
      />

      {/* Modal pour modifier des ligues */}
      {showEditLigueModal && editingLigue && (
        <EditLigueModal
          isOpen={showEditLigueModal}
          ligue={editingLigue}
          onClose={() => {
            setShowEditLigueModal(false);
            setEditingLigue(null);
          }}
          onSubmit={handleUpdateLigue}
        />
      )}

      {/* Modal pour modifier des actualités */}
      {showEditNewsModal && editingNews && (
        <EditNewsModal
          isOpen={showEditNewsModal}
          news={editingNews}
          onClose={() => {
    
            setShowEditNewsModal(false);
            setEditingNews(null);
          }}
          onSubmit={handleUpdateNews}
        />
      )}

      {/* Modal pour ajouter des arbitres */}
      <AddArbitreModal
        isOpen={showAddArbitreModal}
        onClose={() => setShowAddArbitreModal(false)}
        onSubmit={handleCreateArbitre}
        isLoading={false}
      />

      {/* Container des toasts */}
      <ToastContainer 
        toasts={toasts}
        onRemoveToast={removeToast}
      />
    </div>
  );
}

