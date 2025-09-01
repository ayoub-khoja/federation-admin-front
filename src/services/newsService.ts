"use client";

export interface News {
  id: number;
  title_fr: string;
  title_ar: string;
  content_fr: string;
  content_ar: string;
  image?: string;
  video?: string;
  author: number;
  author_name: string;
  created_at: string;
  updated_at: string;
  is_published: boolean;
  is_featured: boolean;
  order: number;
  has_media: boolean;
  media_type: 'image' | 'video' | 'none';
}

export interface NewsCreateData {
  title_fr: string;
  title_ar: string;
  content_fr: string;
  content_ar: string;
  image?: File;
  video?: File;
  is_published: boolean;
  is_featured: boolean;
  order: number;
}

export interface NewsResponse {
  results: News[];
  count: number;
  num_pages: number;
  current_page: number;
}

class NewsService {
  private getBaseURL() {
    if (typeof window !== 'undefined') {
      const hostname = window.location.hostname;
      if (hostname !== 'localhost' && hostname !== '127.0.0.1') {
        return `http://192.168.1.101:8000/api`;
      }
    }
    return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';
  }

  private get baseURL() {
    return this.getBaseURL();
  }

  private async request(endpoint: string, options: RequestInit = {}) {
    const token = localStorage.getItem('admin_token');
    
    const config: RequestInit = {
      ...options,
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
    };

    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, config);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.detail || `HTTP ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new Error('Impossible de se connecter au serveur. Vérifiez votre connexion internet.');
      }
      throw error;
    }
  }

  // Récupérer la liste des actualités pour l'admin
  async getAdminNews(page = 1, search = ''): Promise<NewsResponse> {
    const params = new URLSearchParams({
      page: page.toString(),
      ...(search && { search })
    });
    return this.request(`/news/admin/list/?${params}`);
  }

  // Récupérer les actualités publiques
  async getPublicNews(page = 1, search = '', language = 'fr', featuredOnly = false): Promise<NewsResponse> {
    const params = new URLSearchParams({
      page: page.toString(),
      ...(search && { search }),
      language,
      ...(featuredOnly && { featured: 'true' })
    });
    return this.request(`/news/?${params}`);
  }

  // Créer une nouvelle actualité
  async createNews(data: NewsCreateData): Promise<{ message: string; news: News }> {
    const formData = new FormData();
    
    // Ajouter les données texte
    formData.append('title_fr', data.title_fr);
    formData.append('title_ar', data.title_ar);
    formData.append('content_fr', data.content_fr);
    formData.append('content_ar', data.content_ar);
    formData.append('is_published', data.is_published.toString());
    formData.append('is_featured', data.is_featured.toString());
    formData.append('order', data.order.toString());
    
    // Ajouter les fichiers s'ils existent
    if (data.image) {
      formData.append('image', data.image);
    }
    if (data.video) {
      formData.append('video', data.video);
    }

    return this.request('/news/admin/create/', {
      method: 'POST',
      body: formData,
    });
  }

  // Mettre à jour une actualité
  async updateNews(id: number, data: Partial<NewsCreateData>): Promise<{ message: string; news: News }> {
    const formData = new FormData();
    
    // Ajouter seulement les champs modifiés
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined) {
        if (value instanceof File) {
          formData.append(key, value);
        } else {
          formData.append(key, value.toString());
        }
      }
    });

    return this.request(`/news/admin/${id}/update/`, {
      method: 'PATCH',
      body: formData,
    });
  }

  // Supprimer une actualité
  async deleteNews(id: number): Promise<{ message: string }> {
    return this.request(`/news/admin/${id}/delete/`, {
      method: 'DELETE',
    });
  }

  // Basculer le statut "à la une"
  async toggleFeatured(id: number): Promise<{ message: string; news: News }> {
    return this.request(`/news/admin/${id}/toggle-featured/`, {
      method: 'POST',
    });
  }

  // Obtenir le détail d'une actualité
  async getNewsDetail(id: number): Promise<News> {
    return this.request(`/news/${id}/`);
  }
}

export const newsService = new NewsService();
export default newsService;











