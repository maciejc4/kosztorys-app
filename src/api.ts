// API Abstraction Layer - przygotowane do przełączenia na REST backend
import { UserData, Estimate, ItemTemplate, WorkTemplate, RoomRenovationTemplate, DEFAULT_ITEM_TEMPLATES, DEFAULT_WORK_TEMPLATES, DEFAULT_ROOM_RENOVATION_TEMPLATES } from './types';
import { v4 as uuidv4 } from 'uuid';

// Konfiguracja
export interface ApiConfig {
  useRestBackend: boolean;
  restBaseUrl: string;
  retentionHours: number; // 0 = brak retencji (dane permanentne)
}

const defaultConfig: ApiConfig = {
  useRestBackend: false,
  restBaseUrl: '/api',
  retentionHours: 24, // domyślnie 24h retencja
};

let config: ApiConfig = { ...defaultConfig };

export const setApiConfig = (newConfig: Partial<ApiConfig>) => {
  config = { ...config, ...newConfig };
};

export const getApiConfig = (): ApiConfig => ({ ...config });

// Storage key
const STORAGE_KEY = 'kosztorys_users';

// === Local Storage Implementation ===

const getLocalUsers = (): Record<string, UserData> => {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : {};
};

const saveLocalUsers = (users: Record<string, UserData>) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
};

// Sprawdzenie retencji - usuwa przeterminowane konta
const cleanupExpiredAccounts = () => {
  if (config.retentionHours <= 0) return;
  
  const users = getLocalUsers();
  const now = Date.now();
  const retentionMs = config.retentionHours * 60 * 60 * 1000;
  let hasChanges = false;
  
  for (const id in users) {
    const user = users[id];
    const createdAt = new Date(user.createdAt).getTime();
    if (now - createdAt > retentionMs) {
      delete users[id];
      hasChanges = true;
    }
  }
  
  if (hasChanges) {
    saveLocalUsers(users);
  }
};

// Sprawdź retencję przy starcie i co minutę
if (typeof window !== 'undefined') {
  cleanupExpiredAccounts();
  setInterval(cleanupExpiredAccounts, 60000);
}

// === REST API Implementation (placeholder) ===

const restFetch = async <T>(endpoint: string, options?: RequestInit): Promise<T> => {
  const response = await fetch(`${config.restBaseUrl}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });
  if (!response.ok) {
    throw new Error(`API Error: ${response.status}`);
  }
  return response.json();
};

// === Unified API ===

export interface Api {
  // User operations
  createUser: (username: string, useDefaultData: boolean) => Promise<UserData>;
  getUser: (uniqueId: string) => Promise<UserData | null>;
  getAllUsers: () => Promise<Record<string, UserData>>;
  deleteUser: (uniqueId: string) => Promise<boolean>;
  getRemainingTime: (user: UserData) => number | null; // zwraca pozostały czas w ms lub null jeśli brak retencji
  
  // Item templates
  addItemTemplate: (uniqueId: string, template: Omit<ItemTemplate, 'id'>) => Promise<ItemTemplate | null>;
  updateItemTemplate: (uniqueId: string, templateId: string, updates: Partial<ItemTemplate>) => Promise<boolean>;
  deleteItemTemplate: (uniqueId: string, templateId: string) => Promise<boolean>;
  
  // Work templates
  addWorkTemplate: (uniqueId: string, template: Omit<WorkTemplate, 'id'>) => Promise<WorkTemplate | null>;
  updateWorkTemplate: (uniqueId: string, templateId: string, updates: Partial<WorkTemplate>) => Promise<boolean>;
  deleteWorkTemplate: (uniqueId: string, templateId: string) => Promise<boolean>;
  
  // Renovation templates
  addRenovationTemplate: (uniqueId: string, template: Omit<RoomRenovationTemplate, 'id'>) => Promise<RoomRenovationTemplate | null>;
  updateRenovationTemplate: (uniqueId: string, templateId: string, updates: Partial<RoomRenovationTemplate>) => Promise<boolean>;
  deleteRenovationTemplate: (uniqueId: string, templateId: string) => Promise<boolean>;
  
  // Estimates
  createEstimate: (uniqueId: string, estimate: Estimate) => Promise<Estimate | null>;
  updateEstimate: (uniqueId: string, estimateId: string, updates: Partial<Estimate>) => Promise<boolean>;
  deleteEstimate: (uniqueId: string, estimateId: string) => Promise<boolean>;
  getEstimate: (uniqueId: string, estimateId: string) => Promise<Estimate | null>;
}

// === Local Implementation ===

const localApi: Api = {
  createUser: async (username: string, useDefaultData: boolean = true): Promise<UserData> => {
    cleanupExpiredAccounts();
    const users = getLocalUsers();
    const uniqueId = uuidv4().slice(0, 8);
    
    const newUser: UserData = {
      username,
      uniqueId,
      companyName: '',
      phoneNumber: '',
      itemTemplates: useDefaultData ? [...DEFAULT_ITEM_TEMPLATES] : [],
      workTemplates: useDefaultData ? [...DEFAULT_WORK_TEMPLATES] : [],
      roomRenovationTemplates: useDefaultData ? [...DEFAULT_ROOM_RENOVATION_TEMPLATES] : [],
      estimates: [],
      createdAt: new Date().toISOString()
    };
    
    users[uniqueId] = newUser;
    saveLocalUsers(users);
    return newUser;
  },
  
  getUser: async (uniqueId: string): Promise<UserData | null> => {
    cleanupExpiredAccounts();
    const users = getLocalUsers();
    const user = users[uniqueId];
    if (!user) return null;
    
    // Migracja starych danych
    let needsUpdate = false;
    
    if (!user.itemTemplates) {
      user.itemTemplates = [...DEFAULT_ITEM_TEMPLATES];
      user.workTemplates = [...DEFAULT_WORK_TEMPLATES];
      user.roomRenovationTemplates = [...DEFAULT_ROOM_RENOVATION_TEMPLATES];
      needsUpdate = true;
    }
    
    if (user.estimates) {
      user.estimates = user.estimates.map((e: any) => {
        const updated = {
          ...e,
          rooms: e.rooms || (e.items ? [{ id: uuidv4(), name: 'Główne', roomType: 'inne', items: e.items }] : []),
          includeMaterials: e.includeMaterials ?? true,
          laborDiscountPercent: e.laborDiscountPercent ?? 0,
          materialDiscountPercent: e.materialDiscountPercent ?? 0
        };
        if (!e.rooms || e.includeMaterials === undefined) needsUpdate = true;
        return updated;
      });
    }
    
    if (needsUpdate) {
      users[uniqueId] = user;
      saveLocalUsers(users);
    }
    
    return user;
  },
  
  getAllUsers: async (): Promise<Record<string, UserData>> => {
    cleanupExpiredAccounts();
    return getLocalUsers();
  },
  
  deleteUser: async (uniqueId: string): Promise<boolean> => {
    const users = getLocalUsers();
    if (!users[uniqueId]) return false;
    delete users[uniqueId];
    saveLocalUsers(users);
    return true;
  },
  
  getRemainingTime: (user: UserData): number | null => {
    if (config.retentionHours <= 0) return null;
    const createdAt = new Date(user.createdAt).getTime();
    const expiresAt = createdAt + (config.retentionHours * 60 * 60 * 1000);
    const remaining = expiresAt - Date.now();
    return remaining > 0 ? remaining : 0;
  },
  
  // Item templates
  addItemTemplate: async (uniqueId: string, template: Omit<ItemTemplate, 'id'>): Promise<ItemTemplate | null> => {
    const users = getLocalUsers();
    const user = users[uniqueId];
    if (!user) return null;
    
    const newTemplate: ItemTemplate = { ...template, id: uuidv4() };
    user.itemTemplates.push(newTemplate);
    saveLocalUsers(users);
    return newTemplate;
  },
  
  updateItemTemplate: async (uniqueId: string, templateId: string, updates: Partial<ItemTemplate>): Promise<boolean> => {
    const users = getLocalUsers();
    const user = users[uniqueId];
    if (!user) return false;
    
    const index = user.itemTemplates.findIndex(t => t.id === templateId);
    if (index === -1) return false;
    
    user.itemTemplates[index] = { ...user.itemTemplates[index], ...updates };
    saveLocalUsers(users);
    return true;
  },
  
  deleteItemTemplate: async (uniqueId: string, templateId: string): Promise<boolean> => {
    const users = getLocalUsers();
    const user = users[uniqueId];
    if (!user) return false;
    
    user.itemTemplates = user.itemTemplates.filter(t => t.id !== templateId);
    saveLocalUsers(users);
    return true;
  },
  
  // Work templates
  addWorkTemplate: async (uniqueId: string, template: Omit<WorkTemplate, 'id'>): Promise<WorkTemplate | null> => {
    const users = getLocalUsers();
    const user = users[uniqueId];
    if (!user) return null;
    
    const newTemplate: WorkTemplate = { ...template, id: uuidv4() };
    user.workTemplates.push(newTemplate);
    saveLocalUsers(users);
    return newTemplate;
  },
  
  updateWorkTemplate: async (uniqueId: string, templateId: string, updates: Partial<WorkTemplate>): Promise<boolean> => {
    const users = getLocalUsers();
    const user = users[uniqueId];
    if (!user) return false;
    
    const index = user.workTemplates.findIndex(t => t.id === templateId);
    if (index === -1) return false;
    
    user.workTemplates[index] = { ...user.workTemplates[index], ...updates };
    saveLocalUsers(users);
    return true;
  },
  
  deleteWorkTemplate: async (uniqueId: string, templateId: string): Promise<boolean> => {
    const users = getLocalUsers();
    const user = users[uniqueId];
    if (!user) return false;
    
    user.workTemplates = user.workTemplates.filter(t => t.id !== templateId);
    saveLocalUsers(users);
    return true;
  },
  
  // Renovation templates
  addRenovationTemplate: async (uniqueId: string, template: Omit<RoomRenovationTemplate, 'id'>): Promise<RoomRenovationTemplate | null> => {
    const users = getLocalUsers();
    const user = users[uniqueId];
    if (!user) return null;
    
    const newTemplate: RoomRenovationTemplate = { ...template, id: uuidv4() };
    user.roomRenovationTemplates.push(newTemplate);
    saveLocalUsers(users);
    return newTemplate;
  },
  
  updateRenovationTemplate: async (uniqueId: string, templateId: string, updates: Partial<RoomRenovationTemplate>): Promise<boolean> => {
    const users = getLocalUsers();
    const user = users[uniqueId];
    if (!user) return false;
    
    const index = user.roomRenovationTemplates.findIndex(t => t.id === templateId);
    if (index === -1) return false;
    
    user.roomRenovationTemplates[index] = { ...user.roomRenovationTemplates[index], ...updates };
    saveLocalUsers(users);
    return true;
  },
  
  deleteRenovationTemplate: async (uniqueId: string, templateId: string): Promise<boolean> => {
    const users = getLocalUsers();
    const user = users[uniqueId];
    if (!user) return false;
    
    user.roomRenovationTemplates = user.roomRenovationTemplates.filter(t => t.id !== templateId);
    saveLocalUsers(users);
    return true;
  },
  
  // Estimates
  createEstimate: async (uniqueId: string, estimate: Estimate): Promise<Estimate | null> => {
    const users = getLocalUsers();
    const user = users[uniqueId];
    if (!user) return null;
    
    const newEstimate: Estimate = {
      ...estimate,
      id: estimate.id || uuidv4(),
      createdAt: estimate.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    user.estimates.push(newEstimate);
    saveLocalUsers(users);
    return newEstimate;
  },
  
  updateEstimate: async (uniqueId: string, estimateId: string, updates: Partial<Estimate>): Promise<boolean> => {
    const users = getLocalUsers();
    const user = users[uniqueId];
    if (!user) return false;
    
    const index = user.estimates.findIndex(e => e.id === estimateId);
    if (index === -1) return false;
    
    user.estimates[index] = {
      ...user.estimates[index],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    saveLocalUsers(users);
    return true;
  },
  
  deleteEstimate: async (uniqueId: string, estimateId: string): Promise<boolean> => {
    const users = getLocalUsers();
    const user = users[uniqueId];
    if (!user) return false;
    
    user.estimates = user.estimates.filter(e => e.id !== estimateId);
    saveLocalUsers(users);
    return true;
  },
  
  getEstimate: async (uniqueId: string, estimateId: string): Promise<Estimate | null> => {
    const user = await localApi.getUser(uniqueId);
    if (!user) return null;
    return user.estimates.find(e => e.id === estimateId) || null;
  }
};

// === REST Implementation (placeholder) ===

const restApi: Api = {
  createUser: async (username: string, useDefaultData: boolean = true): Promise<UserData> => {
    return restFetch<UserData>('/users', {
      method: 'POST',
      body: JSON.stringify({ username, useDefaultData })
    });
  },
  
  getUser: async (uniqueId: string): Promise<UserData | null> => {
    try {
      return await restFetch<UserData>(`/users/${uniqueId}`);
    } catch {
      return null;
    }
  },
  
  getAllUsers: async (): Promise<Record<string, UserData>> => {
    const users = await restFetch<UserData[]>('/users');
    return users.reduce((acc, user) => ({ ...acc, [user.uniqueId]: user }), {});
  },
  
  deleteUser: async (uniqueId: string): Promise<boolean> => {
    try {
      await restFetch(`/users/${uniqueId}`, { method: 'DELETE' });
      return true;
    } catch {
      return false;
    }
  },
  
  getRemainingTime: (user: UserData): number | null => {
    if (config.retentionHours <= 0) return null;
    const createdAt = new Date(user.createdAt).getTime();
    const expiresAt = createdAt + (config.retentionHours * 60 * 60 * 1000);
    const remaining = expiresAt - Date.now();
    return remaining > 0 ? remaining : 0;
  },
  
  // ... pozostałe metody analogicznie
  addItemTemplate: async (uniqueId: string, template: Omit<ItemTemplate, 'id'>): Promise<ItemTemplate | null> => {
    return restFetch<ItemTemplate>(`/users/${uniqueId}/items`, {
      method: 'POST',
      body: JSON.stringify(template)
    });
  },
  
  updateItemTemplate: async (uniqueId: string, templateId: string, updates: Partial<ItemTemplate>): Promise<boolean> => {
    try {
      await restFetch(`/users/${uniqueId}/items/${templateId}`, {
        method: 'PATCH',
        body: JSON.stringify(updates)
      });
      return true;
    } catch {
      return false;
    }
  },
  
  deleteItemTemplate: async (uniqueId: string, templateId: string): Promise<boolean> => {
    try {
      await restFetch(`/users/${uniqueId}/items/${templateId}`, { method: 'DELETE' });
      return true;
    } catch {
      return false;
    }
  },
  
  addWorkTemplate: async (uniqueId: string, template: Omit<WorkTemplate, 'id'>): Promise<WorkTemplate | null> => {
    return restFetch<WorkTemplate>(`/users/${uniqueId}/works`, {
      method: 'POST',
      body: JSON.stringify(template)
    });
  },
  
  updateWorkTemplate: async (uniqueId: string, templateId: string, updates: Partial<WorkTemplate>): Promise<boolean> => {
    try {
      await restFetch(`/users/${uniqueId}/works/${templateId}`, {
        method: 'PATCH',
        body: JSON.stringify(updates)
      });
      return true;
    } catch {
      return false;
    }
  },
  
  deleteWorkTemplate: async (uniqueId: string, templateId: string): Promise<boolean> => {
    try {
      await restFetch(`/users/${uniqueId}/works/${templateId}`, { method: 'DELETE' });
      return true;
    } catch {
      return false;
    }
  },
  
  addRenovationTemplate: async (uniqueId: string, template: Omit<RoomRenovationTemplate, 'id'>): Promise<RoomRenovationTemplate | null> => {
    return restFetch<RoomRenovationTemplate>(`/users/${uniqueId}/renovations`, {
      method: 'POST',
      body: JSON.stringify(template)
    });
  },
  
  updateRenovationTemplate: async (uniqueId: string, templateId: string, updates: Partial<RoomRenovationTemplate>): Promise<boolean> => {
    try {
      await restFetch(`/users/${uniqueId}/renovations/${templateId}`, {
        method: 'PATCH',
        body: JSON.stringify(updates)
      });
      return true;
    } catch {
      return false;
    }
  },
  
  deleteRenovationTemplate: async (uniqueId: string, templateId: string): Promise<boolean> => {
    try {
      await restFetch(`/users/${uniqueId}/renovations/${templateId}`, { method: 'DELETE' });
      return true;
    } catch {
      return false;
    }
  },
  
  createEstimate: async (uniqueId: string, estimate: Estimate): Promise<Estimate | null> => {
    return restFetch<Estimate>(`/users/${uniqueId}/estimates`, {
      method: 'POST',
      body: JSON.stringify(estimate)
    });
  },
  
  updateEstimate: async (uniqueId: string, estimateId: string, updates: Partial<Estimate>): Promise<boolean> => {
    try {
      await restFetch(`/users/${uniqueId}/estimates/${estimateId}`, {
        method: 'PATCH',
        body: JSON.stringify(updates)
      });
      return true;
    } catch {
      return false;
    }
  },
  
  deleteEstimate: async (uniqueId: string, estimateId: string): Promise<boolean> => {
    try {
      await restFetch(`/users/${uniqueId}/estimates/${estimateId}`, { method: 'DELETE' });
      return true;
    } catch {
      return false;
    }
  },
  
  getEstimate: async (uniqueId: string, estimateId: string): Promise<Estimate | null> => {
    try {
      return await restFetch<Estimate>(`/users/${uniqueId}/estimates/${estimateId}`);
    } catch {
      return null;
    }
  }
};

// Export the current API based on config
export const api: Api = new Proxy({} as Api, {
  get: (_, prop: keyof Api) => {
    const currentApi = config.useRestBackend ? restApi : localApi;
    return currentApi[prop];
  }
});

// For backward compatibility with mockApi
export const mockApi = {
  generateUserId: () => uuidv4().slice(0, 8),
  createUser: (username: string, useDefaultData: boolean = true) => {
    // Create user synchronously for backward compatibility
    cleanupExpiredAccounts();
    const users = getLocalUsers();
    const uniqueId = uuidv4().slice(0, 8);
    
    const newUser: UserData = {
      username,
      uniqueId,
      companyName: '',
      phoneNumber: '',
      itemTemplates: useDefaultData ? [...DEFAULT_ITEM_TEMPLATES] : [],
      workTemplates: useDefaultData ? [...DEFAULT_WORK_TEMPLATES] : [],
      roomRenovationTemplates: useDefaultData ? [...DEFAULT_ROOM_RENOVATION_TEMPLATES] : [],
      estimates: [],
      createdAt: new Date().toISOString()
    };
    
    users[uniqueId] = newUser;
    saveLocalUsers(users);
    return newUser;
  },
  getUser: (uniqueId: string) => {
    cleanupExpiredAccounts();
    const users = getLocalUsers();
    return users[uniqueId] || null;
  },
  getAllUsers: () => {
    cleanupExpiredAccounts();
    return getLocalUsers();
  },
  updateUser: (uniqueId: string, updates: Partial<UserData>) => {
    const users = getLocalUsers();
    if (!users[uniqueId]) return null;
    users[uniqueId] = { ...users[uniqueId], ...updates };
    saveLocalUsers(users);
    return users[uniqueId];
  },
  addItemTemplate: (uniqueId: string, template: Omit<ItemTemplate, 'id'>) => {
    const users = getLocalUsers();
    const user = users[uniqueId];
    if (!user) return null;
    const newTemplate: ItemTemplate = { ...template, id: uuidv4() };
    user.itemTemplates.push(newTemplate);
    saveLocalUsers(users);
    return newTemplate;
  },
  updateItemTemplate: (uniqueId: string, templateId: string, updates: Partial<ItemTemplate>) => {
    const users = getLocalUsers();
    const user = users[uniqueId];
    if (!user) return false;
    const index = user.itemTemplates.findIndex(t => t.id === templateId);
    if (index === -1) return false;
    user.itemTemplates[index] = { ...user.itemTemplates[index], ...updates };
    saveLocalUsers(users);
    return true;
  },
  deleteItemTemplate: (uniqueId: string, templateId: string) => {
    const users = getLocalUsers();
    const user = users[uniqueId];
    if (!user) return false;
    user.itemTemplates = user.itemTemplates.filter(t => t.id !== templateId);
    saveLocalUsers(users);
    return true;
  },
  addWorkTemplate: (uniqueId: string, template: Omit<WorkTemplate, 'id'>) => {
    const users = getLocalUsers();
    const user = users[uniqueId];
    if (!user) return null;
    const newTemplate: WorkTemplate = { ...template, id: uuidv4() };
    user.workTemplates.push(newTemplate);
    saveLocalUsers(users);
    return newTemplate;
  },
  updateWorkTemplate: (uniqueId: string, templateId: string, updates: Partial<WorkTemplate>) => {
    const users = getLocalUsers();
    const user = users[uniqueId];
    if (!user) return false;
    const index = user.workTemplates.findIndex(t => t.id === templateId);
    if (index === -1) return false;
    user.workTemplates[index] = { ...user.workTemplates[index], ...updates };
    saveLocalUsers(users);
    return true;
  },
  deleteWorkTemplate: (uniqueId: string, templateId: string) => {
    const users = getLocalUsers();
    const user = users[uniqueId];
    if (!user) return false;
    user.workTemplates = user.workTemplates.filter(t => t.id !== templateId);
    saveLocalUsers(users);
    return true;
  },
  addRenovationTemplate: (uniqueId: string, template: Omit<RoomRenovationTemplate, 'id'>) => {
    const users = getLocalUsers();
    const user = users[uniqueId];
    if (!user) return null;
    const newTemplate: RoomRenovationTemplate = { ...template, id: uuidv4() };
    user.roomRenovationTemplates.push(newTemplate);
    saveLocalUsers(users);
    return newTemplate;
  },
  updateRenovationTemplate: (uniqueId: string, templateId: string, updates: Partial<RoomRenovationTemplate>) => {
    const users = getLocalUsers();
    const user = users[uniqueId];
    if (!user) return false;
    const index = user.roomRenovationTemplates.findIndex(t => t.id === templateId);
    if (index === -1) return false;
    user.roomRenovationTemplates[index] = { ...user.roomRenovationTemplates[index], ...updates };
    saveLocalUsers(users);
    return true;
  },
  deleteRenovationTemplate: (uniqueId: string, templateId: string) => {
    const users = getLocalUsers();
    const user = users[uniqueId];
    if (!user) return false;
    user.roomRenovationTemplates = user.roomRenovationTemplates.filter(t => t.id !== templateId);
    saveLocalUsers(users);
    return true;
  },
  createEstimate: (uniqueId: string, estimate: Estimate) => {
    const users = getLocalUsers();
    const user = users[uniqueId];
    if (!user) return null;
    const newEstimate: Estimate = {
      ...estimate,
      id: estimate.id || uuidv4(),
      createdAt: estimate.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    user.estimates.push(newEstimate);
    saveLocalUsers(users);
    return newEstimate;
  },
  updateEstimate: (uniqueId: string, estimateId: string, updates: Partial<Estimate>) => {
    const users = getLocalUsers();
    const user = users[uniqueId];
    if (!user) return false;
    const index = user.estimates.findIndex(e => e.id === estimateId);
    if (index === -1) return false;
    user.estimates[index] = { ...user.estimates[index], ...updates, updatedAt: new Date().toISOString() };
    saveLocalUsers(users);
    return true;
  },
  deleteEstimate: (uniqueId: string, estimateId: string) => {
    const users = getLocalUsers();
    const user = users[uniqueId];
    if (!user) return false;
    user.estimates = user.estimates.filter(e => e.id !== estimateId);
    saveLocalUsers(users);
    return true;
  },
  getEstimate: (uniqueId: string, estimateId: string) => {
    const users = getLocalUsers();
    const user = users[uniqueId];
    if (!user) return null;
    return user.estimates.find(e => e.id === estimateId) || null;
  },
  getRemainingTime: (user: UserData): number | null => {
    if (config.retentionHours <= 0) return null;
    const createdAt = new Date(user.createdAt).getTime();
    const expiresAt = createdAt + (config.retentionHours * 60 * 60 * 1000);
    const remaining = expiresAt - Date.now();
    return remaining > 0 ? remaining : 0;
  }
};
