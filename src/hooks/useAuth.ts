"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import adminApi from '../services/adminApi';

export interface AdminUser {
  id: string;
  phone_number: string;
  full_name: string;
  email?: string;
  is_staff: boolean;
  is_superuser: boolean;
}

export const useAuth = () => {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const token = localStorage.getItem('admin_token');
    if (!token) {
      setIsLoading(false);
      return;
    }

    try {
      // Vérifier si le token est valide en récupérant le profil
      const profile = await adminApi.makeRequest('/accounts/admins/profile/');
      if (profile.is_staff || profile.is_superuser) {
        setUser(profile);
        setError(null);
      } else {
        // L'utilisateur n'est pas admin
        localStorage.removeItem('admin_token');
        localStorage.removeItem('admin_refresh');
        setUser(null);
        setError('Accès non autorisé');
      }
    } catch {
      // Si l'endpoint profile ne fonctionne pas, vérifier simplement si on a un token valide
      // et les informations d'utilisateur stockées
      const storedUser = localStorage.getItem('admin_user');
      if (storedUser) {
        try {
          const userData = JSON.parse(storedUser);
          if (userData.is_staff || userData.is_superuser) {
            setUser(userData);
            setError(null);
          } else {
            localStorage.removeItem('admin_token');
            localStorage.removeItem('admin_refresh');
            localStorage.removeItem('admin_user');
            setUser(null);
            setError('Accès non autorisé');
          }
        } catch {
          localStorage.removeItem('admin_token');
          localStorage.removeItem('admin_refresh');
          localStorage.removeItem('admin_user');
          setUser(null);
          setError('Session expirée');
        }
      } else {
        localStorage.removeItem('admin_token');
        localStorage.removeItem('admin_refresh');
        setUser(null);
        setError('Session expirée');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);

    try {
      console.log('🔍 Tentative de connexion avec:', { email, password });
      const response = await adminApi.login(email, password);
      console.log('📡 Réponse de l\'API:', response);
      
      // Les données utilisateur sont retournées dans la réponse de connexion
      if (response.user) {
        console.log('👤 Données utilisateur:', response.user);
        console.log('🔐 Vérification des permissions:', {
          is_staff: response.user.is_staff,
          is_superuser: response.user.is_superuser
        });
        
        // Vérifier que l'utilisateur est admin
        if (!response.user.is_staff && !response.user.is_superuser) {
          console.log('❌ Utilisateur non admin, déconnexion...');
          await adminApi.logout();
          throw new Error('Accès non autorisé. Vous devez être administrateur.');
        }

        // Stocker les informations utilisateur dans localStorage pour la persistance
        localStorage.setItem('admin_user', JSON.stringify(response.user));
        
        setUser(response.user);
        setError(null);
        
        // Rediriger vers le dashboard après connexion réussie
        router.push('/dashboard');
        
        return true;
      } else {
        throw new Error('Réponse de connexion invalide');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur de connexion');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    await adminApi.logout();
    localStorage.removeItem('admin_user');
    setUser(null);
    setError(null);
  };

  return {
    user,
    isLoading,
    error,
    login,
    logout,
    isAuthenticated: !!user
  };
};
