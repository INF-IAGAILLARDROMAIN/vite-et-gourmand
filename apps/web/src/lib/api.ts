const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

async function request<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const url = `${API_URL}${endpoint}`;

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options?.headers,
  };

  // Add auth token if available
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    if (token) {
      (headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
    }
  }

  const res = await fetch(url, { ...options, headers });

  if (!res.ok) {
    const body = await res.json().catch(() => ({ message: 'Erreur serveur' }));
    throw new ApiError(res.status, body.message || 'Erreur serveur');
  }

  return res.json();
}

// Auth
export const auth = {
  register: (data: { email: string; password: string; nom: string; prenom: string; telephone: string; adressePostale: string }) =>
    request('/auth/register', { method: 'POST', body: JSON.stringify(data) }),

  login: (data: { email: string; password: string }) =>
    request<{ access_token: string; user: { id: number; email: string; nom: string; prenom: string; role: string } }>(
      '/auth/login', { method: 'POST', body: JSON.stringify(data) }
    ),

  forgotPassword: (email: string) =>
    request('/auth/forgot-password', { method: 'POST', body: JSON.stringify({ email }) }),

  resetPassword: (token: string, password: string) =>
    request('/auth/reset-password', { method: 'POST', body: JSON.stringify({ token, password }) }),
};

// Menus
export const menus = {
  getAll: (params?: Record<string, string>) => {
    const query = params ? '?' + new URLSearchParams(params).toString() : '';
    return request<import('./types').Menu[]>(`/menus${query}`);
  },

  getById: (id: number) =>
    request<import('./types').Menu>(`/menus/${id}`),

  create: (data: FormData | Record<string, unknown>) =>
    request('/menus', { method: 'POST', body: JSON.stringify(data) }),

  update: (id: number, data: Record<string, unknown>) =>
    request(`/menus/${id}`, { method: 'PUT', body: JSON.stringify(data) }),

  delete: (id: number) =>
    request(`/menus/${id}`, { method: 'DELETE' }),
};

// Plats
export const plats = {
  getAll: () => request<import('./types').Plat[]>('/plats'),
  getAllergenes: () => request<import('./types').Allergene[]>('/plats/allergenes'),
};

// Commandes
export const commandes = {
  create: (data: { menuId: number; datePrestation: string; heurePrestation: string; adresse: string; nombrePersonnes: number; modeContact?: string }) =>
    request<import('./types').Commande>('/commandes', { method: 'POST', body: JSON.stringify(data) }),

  getMine: () =>
    request<import('./types').Commande[]>('/commandes'),

  getById: (id: number) =>
    request<import('./types').Commande>(`/commandes/${id}`),

  cancel: (id: number) =>
    request(`/commandes/${id}`, { method: 'DELETE' }),

  updateStatus: (id: number, statut: string) =>
    request(`/commandes/${id}/status`, { method: 'PUT', body: JSON.stringify({ statut }) }),

  getAll: () =>
    request<import('./types').Commande[]>('/commandes'),
};

// Avis
export const avis = {
  create: (data: { commandeId: number; note: number; description: string }) =>
    request('/avis', { method: 'POST', body: JSON.stringify(data) }),

  getValidated: () =>
    request<import('./types').Avis[]>('/avis'),

  getPending: () =>
    request<import('./types').Avis[]>('/avis/pending'),

  validate: (id: number, statut: 'VALIDE' | 'REFUSE') =>
    request(`/avis/${id}/validate`, { method: 'PUT', body: JSON.stringify({ statut }) }),
};

// Horaires
export const horaires = {
  getAll: () => request<import('./types').Horaire[]>('/horaires'),

  update: (id: number, data: { heureOuverture: string; heureFermeture: string }) =>
    request(`/horaires/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
};

// Contact
export const contact = {
  send: (data: { nom: string; email: string; sujet: string; message: string }) =>
    request('/contact', { method: 'POST', body: JSON.stringify(data) }),
};

// Admin
export const admin = {
  getEmployees: () =>
    request<{ id: number; email: string; nom: string; prenom: string; telephone: string; isActive: boolean; createdAt: string; role: string }[]>('/admin/employees'),

  createEmployee: (data: { email: string; password: string; nom: string; prenom: string; telephone: string; adressePostale: string }) =>
    request('/admin/employees', { method: 'POST', body: JSON.stringify(data) }),

  disableEmployee: (id: number) =>
    request(`/admin/employees/${id}/disable`, { method: 'PUT' }),

  getOrderStats: () =>
    request<import('./types').OrderStats[]>('/admin/stats/orders'),

  getRevenueStats: (menuId?: number) => {
    const query = menuId ? `?menuId=${menuId}` : '';
    return request<import('./types').RevenueEntry[]>(`/admin/stats/revenue${query}`);
  },
};
