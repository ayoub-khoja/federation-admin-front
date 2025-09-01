import { useState, useEffect, useCallback } from 'react';
import adminApi from '../services/adminApi';

export interface Ligue {
  id: number;
  nom: string;
  description: string;
  is_active: boolean;
  date_creation: string;
  ordre: number;
}

export interface LiguesResponse {
  success: boolean;
  ligues: Ligue[];
  count: number;
  message?: string;
}

export const useLigues = () => {
  const [ligues, setLigues] = useState<Ligue[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);



  // Charger la liste des ligues
  const fetchLigues = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await adminApi.getLigues();
      if (data.success) {
        setLigues(data.ligues);
      } else {
        throw new Error(data.message || 'Erreur lors du chargement des ligues');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur inconnue';
      setError(errorMessage);
      console.error('Erreur lors du chargement des ligues:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Créer une nouvelle ligue - ordre est obligatoire
  const createLigue = useCallback(async (ligueData: {
    nom: string;
    description: string;
    ordre: number;
  }) => {
    setIsLoading(true);
    setError(null);

    try {
      console.log('🏛️ Tentative de création de ligue:', ligueData);
      const data = await adminApi.createLigue(ligueData);
      console.log('📡 Réponse de création de ligue:', data);
      
      if (data.success) {
        console.log('✅ Ligue créée avec succès');
        // Recharger la liste des ligues
        await fetchLigues();
        return data.ligue;
      } else {
        throw new Error(data.message || 'Erreur lors de la création de la ligue');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur inconnue';
      console.error('❌ Erreur lors de la création de la ligue:', err);
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [fetchLigues]);

  // Supprimer une ligue
  const deleteLigue = useCallback(async (ligueId: number) => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await adminApi.deleteLigue(ligueId.toString());
      if (data.success) {
        // Recharger la liste des ligues
        await fetchLigues();
        return true;
      } else {
        throw new Error(data.message || 'Erreur lors de la suppression de la ligue');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur inconnue';
      setError(errorMessage);
      console.error('Erreur lors de la suppression de la ligue:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [fetchLigues]);

  // Mettre à jour une ligue
  const updateLigue = useCallback(async (ligueData: {
    id: number;
    nom: string;
    description: string;
    is_active: boolean;
    ordre: number;
  }) => {
    setIsLoading(true);
    setError(null);

    try {
      console.log('🏛️ Tentative de mise à jour de ligue:', ligueData);
      const data = await adminApi.updateLigue(ligueData.id.toString(), ligueData);
      console.log('📡 Réponse de mise à jour de ligue:', data);
      
      if (data.success) {
        console.log('✅ Ligue mise à jour avec succès');
        // Recharger la liste des ligues
        await fetchLigues();
        return data.ligue;
      } else {
        throw new Error(data.message || 'Erreur lors de la mise à jour de la ligue');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur inconnue';
      setError(errorMessage);
      console.error('❌ Erreur lors de la mise à jour de la ligue:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [fetchLigues]);

  // Charger les ligues au montage du composant
  useEffect(() => {
    fetchLigues();
  }, [fetchLigues]);

  return {
    ligues,
    isLoading,
    error,
    fetchLigues,
    createLigue,
    updateLigue,
    deleteLigue,
    hasLigues: ligues.length > 0
  };
};
