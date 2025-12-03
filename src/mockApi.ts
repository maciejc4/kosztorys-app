import { UserData, Estimate, ItemTemplate, WorkTemplate, DEFAULT_ITEM_TEMPLATES, DEFAULT_WORK_TEMPLATES, DEFAULT_ROOM_RENOVATION_TEMPLATES } from './types';
import { v4 as uuidv4 } from 'uuid';

const STORAGE_KEY = 'kosztorys_users';

// Mockowany backend - wszystko w localStorage
export const mockApi = {
  // Generowanie unikalnego ID użytkownika
  generateUserId: (): string => {
    return uuidv4().slice(0, 8);
  },

  // Create new user
  createUser: (username: string): UserData => {
    const users = mockApi.getAllUsers();
    const uniqueId = mockApi.generateUserId();
    
    const newUser: UserData = {
      username,
      uniqueId,
      companyName: '',
      phoneNumber: '',
      itemTemplates: [...DEFAULT_ITEM_TEMPLATES],
      workTemplates: [...DEFAULT_WORK_TEMPLATES],
      roomRenovationTemplates: [...DEFAULT_ROOM_RENOVATION_TEMPLATES],
      estimates: [],
      createdAt: new Date().toISOString()
    };

    users[uniqueId] = newUser;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
    
    return newUser;
  },

  // Pobieranie użytkownika po ID
  getUser: (uniqueId: string): UserData | null => {
    const users = mockApi.getAllUsers();
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
    
    // Migracja starych kosztorysów
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
      mockApi.updateUser(uniqueId, user);
    }
    
    return user;
  },

  // Pobieranie wszystkich użytkowników
  getAllUsers: (): Record<string, UserData> => {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : {};
  },

  // Aktualizacja użytkownika
  updateUser: (uniqueId: string, updates: Partial<UserData>): UserData | null => {
    const users = mockApi.getAllUsers();
    if (!users[uniqueId]) return null;

    users[uniqueId] = { ...users[uniqueId], ...updates };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
    
    return users[uniqueId];
  },

  // Dodawanie szablonu pozycji
  addItemTemplate: (uniqueId: string, template: Omit<ItemTemplate, 'id'>): ItemTemplate | null => {
    const user = mockApi.getUser(uniqueId);
    if (!user) return null;

    const newTemplate: ItemTemplate = {
      ...template,
      id: uuidv4()
    };

    user.itemTemplates.push(newTemplate);
    mockApi.updateUser(uniqueId, { itemTemplates: user.itemTemplates });
    
    return newTemplate;
  },

  // Aktualizacja szablonu pozycji
  updateItemTemplate: (uniqueId: string, templateId: string, updates: Partial<ItemTemplate>): boolean => {
    const user = mockApi.getUser(uniqueId);
    if (!user) return false;

    const index = user.itemTemplates.findIndex(t => t.id === templateId);
    if (index === -1) return false;

    user.itemTemplates[index] = { ...user.itemTemplates[index], ...updates };
    mockApi.updateUser(uniqueId, { itemTemplates: user.itemTemplates });
    
    return true;
  },

  // Usuwanie szablonu pozycji
  deleteItemTemplate: (uniqueId: string, templateId: string): boolean => {
    const user = mockApi.getUser(uniqueId);
    if (!user) return false;

    user.itemTemplates = user.itemTemplates.filter(t => t.id !== templateId);
    mockApi.updateUser(uniqueId, { itemTemplates: user.itemTemplates });
    
    return true;
  },

  // Dodawanie szablonu pracy
  addWorkTemplate: (uniqueId: string, template: Omit<WorkTemplate, 'id'>): WorkTemplate | null => {
    const user = mockApi.getUser(uniqueId);
    if (!user) return null;

    const newTemplate: WorkTemplate = {
      ...template,
      id: uuidv4()
    };

    user.workTemplates.push(newTemplate);
    mockApi.updateUser(uniqueId, { workTemplates: user.workTemplates });
    
    return newTemplate;
  },

  // Aktualizacja szablonu pracy
  updateWorkTemplate: (uniqueId: string, templateId: string, updates: Partial<WorkTemplate>): boolean => {
    const user = mockApi.getUser(uniqueId);
    if (!user) return false;

    const index = user.workTemplates.findIndex(t => t.id === templateId);
    if (index === -1) return false;

    user.workTemplates[index] = { ...user.workTemplates[index], ...updates };
    mockApi.updateUser(uniqueId, { workTemplates: user.workTemplates });
    
    return true;
  },

  // Usuwanie szablonu pracy
  deleteWorkTemplate: (uniqueId: string, templateId: string): boolean => {
    const user = mockApi.getUser(uniqueId);
    if (!user) return false;

    user.workTemplates = user.workTemplates.filter(t => t.id !== templateId);
    mockApi.updateUser(uniqueId, { workTemplates: user.workTemplates });
    
    return true;
  },

  // Dodawanie szablonu remontu
  addRenovationTemplate: (uniqueId: string, template: Omit<import('./types').RoomRenovationTemplate, 'id'>): import('./types').RoomRenovationTemplate | null => {
    const user = mockApi.getUser(uniqueId);
    if (!user) return null;

    const newTemplate = { ...template, id: uuidv4() };
    user.roomRenovationTemplates.push(newTemplate);
    mockApi.updateUser(uniqueId, { roomRenovationTemplates: user.roomRenovationTemplates });
    
    return newTemplate;
  },

  // Aktualizacja szablonu remontu
  updateRenovationTemplate: (uniqueId: string, templateId: string, updates: Partial<import('./types').RoomRenovationTemplate>): boolean => {
    const user = mockApi.getUser(uniqueId);
    if (!user) return false;

    const index = user.roomRenovationTemplates.findIndex(t => t.id === templateId);
    if (index === -1) return false;

    user.roomRenovationTemplates[index] = { ...user.roomRenovationTemplates[index], ...updates };
    mockApi.updateUser(uniqueId, { roomRenovationTemplates: user.roomRenovationTemplates });
    
    return true;
  },

  // Usuwanie szablonu remontu
  deleteRenovationTemplate: (uniqueId: string, templateId: string): boolean => {
    const user = mockApi.getUser(uniqueId);
    if (!user) return false;

    user.roomRenovationTemplates = user.roomRenovationTemplates.filter(t => t.id !== templateId);
    mockApi.updateUser(uniqueId, { roomRenovationTemplates: user.roomRenovationTemplates });
    
    return true;
  },

  // Tworzenie kosztorysu
  createEstimate: (uniqueId: string, estimate: Omit<Estimate, 'id' | 'createdAt' | 'updatedAt'>): Estimate | null => {
    const user = mockApi.getUser(uniqueId);
    if (!user) return null;

    const newEstimate: Estimate = {
      ...estimate,
      id: uuidv4(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    user.estimates.push(newEstimate);
    mockApi.updateUser(uniqueId, { estimates: user.estimates });
    
    return newEstimate;
  },

  // Aktualizacja kosztorysu
  updateEstimate: (uniqueId: string, estimateId: string, updates: Partial<Estimate>): boolean => {
    const user = mockApi.getUser(uniqueId);
    if (!user) return false;

    const index = user.estimates.findIndex(e => e.id === estimateId);
    if (index === -1) return false;

    user.estimates[index] = { 
      ...user.estimates[index], 
      ...updates,
      updatedAt: new Date().toISOString()
    };
    mockApi.updateUser(uniqueId, { estimates: user.estimates });
    
    return true;
  },

  // Usuwanie kosztorysu
  deleteEstimate: (uniqueId: string, estimateId: string): boolean => {
    const user = mockApi.getUser(uniqueId);
    if (!user) return false;

    user.estimates = user.estimates.filter(e => e.id !== estimateId);
    mockApi.updateUser(uniqueId, { estimates: user.estimates });
    
    return true;
  },

  // Pobieranie kosztorysu
  getEstimate: (uniqueId: string, estimateId: string): Estimate | null => {
    const user = mockApi.getUser(uniqueId);
    if (!user) return null;

    return user.estimates.find(e => e.id === estimateId) || null;
  }
};
