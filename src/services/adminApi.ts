class AdminApiService {
  private getBaseURL() {
    // Utiliser la configuration centralisée
    if (process.env.NODE_ENV === 'development') {
      return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';
    }
    
    if (process.env.NODE_ENV === 'production') {
      return process.env.NEXT_PUBLIC_PRODUCTION_API_URL || 'https://federation-backend.onrender.com/api';
    }
    
    // Fallback basé sur l'hostname
    if (typeof window !== 'undefined') {
      const hostname = window.location.hostname;
      if (hostname === 'localhost' || hostname === '127.0.0.1') {
        return 'http://localhost:8000/api';
      }
      return 'https://federation-backend.onrender.com/api';
    }
    
    return 'http://localhost:8000/api';
  }

  private get baseURL() {
    return this.getBaseURL();
  }

  // Méthode pour construire les URLs des médias
  getMediaURL(mediaPath: string) {
    if (!mediaPath) return '';
    if (mediaPath.startsWith('http')) return mediaPath;
    
    const baseMediaURL = this.getBaseURL().replace('/api', '');
    return `${baseMediaURL}${mediaPath}`;
  }

  private async request(endpoint: string, options: RequestInit = {}) {
    const token = localStorage.getItem('admin_token');
    
    const config: RequestInit = {
      ...options,
      headers: {
        'Content-Type': 'application/json',
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

  // Méthode publique pour les requêtes (utilisée dans useAuth)
  async makeRequest(endpoint: string, options: RequestInit = {}) {
    return this.request(endpoint, options);
  }


  // Authentification Admin par email
  async login(email: string, password: string) {
    const response = await this.request('/accounts/admins/email-login/', {
      method: 'POST',
      body: JSON.stringify({
        email: email,
        password: password
      }),
    });

    if (response.access) {
      localStorage.setItem('admin_token', response.access);
      if (response.refresh) {
        localStorage.setItem('admin_refresh', response.refresh);
      }
      if (response.user) {
        localStorage.setItem('admin_user', JSON.stringify(response.user));
      }
    }

    return response;
  }

  // Authentification Admin par téléphone (conservé pour compatibilité)
  async loginByPhone(phoneNumber: string, password: string) {
    const response = await this.request('/accounts/admins/login/', {
      method: 'POST',
      body: JSON.stringify({
        phone_number: phoneNumber,
        password: password
      }),
    });

    if (response.success && response.access) {
      localStorage.setItem('admin_token', response.access);
      localStorage.setItem('admin_refresh', response.refresh);
      localStorage.setItem('admin_user', JSON.stringify(response.user));
    }

    return response;
  }

  async logout() {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_refresh');
  }

  // Vérification du numéro de téléphone
  async verifyPhoneNumber(phoneNumber: string) {
    return this.request('/accounts/verify-phone/', {
      method: 'POST',
      body: JSON.stringify({
        phone_number: phoneNumber
      }),
    });
  }

  // Gestion des Utilisateurs
  async getUsers(page = 1, search = '', type = 'all') {
    const params = new URLSearchParams({
      page: page.toString(),
      type: type,
      ...(search && { search })
    });
    return this.request(`/accounts/users/?${params}`);
  }

  // Gestion des Arbitres (pour compatibilité)
  async getArbitres(page = 1, search = '') {
    return this.getUsers(page, search, 'arbitres');
  }

  async getArbitre(id: string) {
    return this.request(`/accounts/arbitres/${id}/`);
  }

  async createArbitre(data: {first_name: string; last_name: string; phone_number: string; email: string; address: string; grade: string; ligue_id: number; birth_date: string; birth_place: string; password: string; password_confirm: string}) {
    return this.request('/accounts/arbitres/register/', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateArbitre(id: string, data: {first_name?: string; last_name?: string; phone_number?: string; email?: string; address?: string; grade?: string; ligue_id?: number; birth_date?: string; birth_place?: string}) {
    return this.request(`/accounts/arbitres/${id}/update/`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  async deleteArbitre(id: string) {
    return this.request(`/accounts/admin/arbitres/${id}/delete/`, {
      method: 'DELETE',
    });
  }

  async verifyArbitre(id: string, verified: boolean) {
    return this.request(`/accounts/arbitres/${id}/verify/`, {
      method: 'POST',
      body: JSON.stringify({ is_verified: verified }),
    });
  }

  // Gestion des Ligues
  async getLigues() {
    return this.request('/accounts/ligues/');
  }

  async createLigue(data: {nom: string; description: string; ordre: number}) {
    return this.request('/accounts/ligues/create/', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateLigue(id: string, data: {id: number; nom: string; description: string; is_active: boolean; ordre: number}) {
    return this.request(`/accounts/ligues/${id}/update/`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  async deleteLigue(id: string) {
    return this.request(`/accounts/ligues/${id}/delete/`, {
      method: 'DELETE',
    });
  }

  // Gestion des Actualités
  async getNews(page = 1, search = '') {
    const params = new URLSearchParams({
      page: page.toString(),
      ...(search && { search })
    });
    return this.request(`/news/admin/list/?${params}`);
  }

  async updateNews(id: string, data: {id: number; title_fr: string; title_ar: string; content_fr: string; content_ar: string}) {
    return this.request(`/news/admin/${id}/update/`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  async deleteNews(id: string) {
    return this.request(`/news/admin/${id}/delete/`, {
      method: 'DELETE',
    });
  }



  // Gestion des Matchs
  async getMatches(page = 1, filters: {ligue?: string; arbitre?: string; date?: string; stade?: string} = {}) {
    const params = new URLSearchParams({
      page: page.toString(),
      ...filters
    });
    return this.request(`/matches/?${params}`);
  }

  // Récupérer tous les matches de type "Ligue 1"
  async getMatchesLigue1() {
    return this.request('/matches/ligue1/');
  }

  async getMatchesLigue2() {
    return this.request('/matches/ligue2/');
  }

  async getMatchesC1() {
    return this.request('/matches/c1/');
  }

  async getMatchesC2() {
    return this.request('/matches/c2/');
  }

  async getMatchesJeunes() {
    return this.request('/matches/jeunes/');
  }

  async getMatchesCoupeTunisie() {
    return this.request('/matches/coupe-tunisie/');
  }

  // Récupérer toutes les excuses d'arbitres
  async getExcusesArbitres() {
    return this.request('/matches/excuses/');
  }

  async getMatch(id: string) {
    return this.request(`/matches/${id}/`);
  }

  async updateMatch(id: string, data: {ligue?: string; arbitre_principal?: string; assistant1?: string; assistant2?: string; quatrieme_arbitre?: string; date?: string; stade?: string; heure?: string}) {
    return this.request(`/matches/${id}/`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  async deleteMatch(id: string) {
    return this.request(`/matches/${id}/`, {
      method: 'DELETE',
    });
  }

  // Statistiques
  async getStats() {
    return this.request('/accounts/stats/');
  }

  // Excuses par période temporelle
  async getExcusesPassees(date: string) {
    return this.request(`/matches/excuses/passees/?date=${date}`);
  }

  async getExcusesEnCours(date: string) {
    return this.request(`/matches/excuses/en-cours/?date=${date}`);
  }

  async getExcusesAVenir(date: string) {
    return this.request(`/matches/excuses/a-venir/?date=${date}`);
  }
}

export const adminApi = new AdminApiService();
export default adminApi;
