// Synchronization Service - obsługa offline/online synchronizacji
import { UserData, Estimate, ItemTemplate, WorkTemplate, RoomRenovationTemplate } from './types';
import { SyncConfig, DEFAULT_SYNC_CONFIG, STORAGE_KEYS } from './config';

// Re-export SyncConfig for external use
export type { SyncConfig };

// Transform data for backend - converts roomType/roomTypes to uppercase
const transformForBackend = <T>(data: T): T => {
  if (data === null || data === undefined) return data;
  if (Array.isArray(data)) {
    return data.map(item => transformForBackend(item)) as T;
  }
  if (typeof data === 'object') {
    const result: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(data as Record<string, unknown>)) {
      if (key === 'roomType' && typeof value === 'string') {
        result[key] = value.toUpperCase();
      } else if (key === 'roomTypes' && Array.isArray(value)) {
        result[key] = value.map(v => typeof v === 'string' ? v.toUpperCase() : v);
      } else {
        result[key] = transformForBackend(value);
      }
    }
    return result as T;
  }
  return data;
};

// Typy operacji synchronizacji
export type SyncOperation =
  | { type: 'CREATE_USER'; payload: { username: string; useDefaultData: boolean } }
  | { type: 'UPDATE_USER'; payload: { uniqueId: string; updates: Partial<UserData> } }
  | { type: 'CREATE_ESTIMATE'; payload: { uniqueId: string; estimate: Estimate } }
  | { type: 'UPDATE_ESTIMATE'; payload: { uniqueId: string; estimateId: string; updates: Partial<Estimate> } }
  | { type: 'DELETE_ESTIMATE'; payload: { uniqueId: string; estimateId: string } }
  | { type: 'ADD_ITEM_TEMPLATE'; payload: { uniqueId: string; template: Omit<ItemTemplate, 'id'>; localId: string } }
  | { type: 'UPDATE_ITEM_TEMPLATE'; payload: { uniqueId: string; templateId: string; updates: Partial<ItemTemplate> } }
  | { type: 'DELETE_ITEM_TEMPLATE'; payload: { uniqueId: string; templateId: string } }
  | { type: 'ADD_WORK_TEMPLATE'; payload: { uniqueId: string; template: Omit<WorkTemplate, 'id'>; localId: string } }
  | { type: 'UPDATE_WORK_TEMPLATE'; payload: { uniqueId: string; templateId: string; updates: Partial<WorkTemplate> } }
  | { type: 'DELETE_WORK_TEMPLATE'; payload: { uniqueId: string; templateId: string } }
  | { type: 'ADD_RENOVATION_TEMPLATE'; payload: { uniqueId: string; template: Omit<RoomRenovationTemplate, 'id'>; localId: string } }
  | { type: 'UPDATE_RENOVATION_TEMPLATE'; payload: { uniqueId: string; templateId: string; updates: Partial<RoomRenovationTemplate> } }
  | { type: 'DELETE_RENOVATION_TEMPLATE'; payload: { uniqueId: string; templateId: string } };

export interface PendingSync {
  id: string;
  operation: SyncOperation;
  timestamp: number;
  retryCount: number;
}

export interface SyncState {
  isOnline: boolean;
  isSyncing: boolean;
  lastSyncTime: number | null;
  pendingOperations: PendingSync[];
  syncErrors: string[];
}

let syncConfig: SyncConfig = { ...DEFAULT_SYNC_CONFIG };
let syncState: SyncState = {
  isOnline: navigator.onLine,
  isSyncing: false,
  lastSyncTime: null,
  pendingOperations: [],
  syncErrors: []
};
let syncListeners: ((state: SyncState) => void)[] = [];
let syncInterval: number | null = null;

// Inicjalizacja serwisu
export const initSyncService = (config?: Partial<SyncConfig>): void => {
  if (config) {
    syncConfig = { ...syncConfig, ...config };
  }

  // Załaduj oczekujące operacje z localStorage
  loadPendingOperations();

  // Załaduj ostatni czas synchronizacji
  const lastSync = localStorage.getItem(STORAGE_KEYS.LAST_SYNC);
  if (lastSync) {
    syncState.lastSyncTime = parseInt(lastSync, 10);
  }

  // Nasłuchuj na zmiany stanu sieci
  window.addEventListener('online', handleOnline);
  window.addEventListener('offline', handleOffline);

  // Rozpocznij automatyczną synchronizację
  startAutoSync();

  // Jeśli online, spróbuj zsynchronizować
  if (navigator.onLine) {
    triggerSync();
  }
};

// Zatrzymaj serwis
export const stopSyncService = (): void => {
  window.removeEventListener('online', handleOnline);
  window.removeEventListener('offline', handleOffline);

  if (syncInterval) {
    clearInterval(syncInterval);
    syncInterval = null;
  }
};

// Subskrypcja do zmian stanu
export const subscribeSyncState = (listener: (state: SyncState) => void): () => void => {
  syncListeners.push(listener);
  listener(syncState); // Natychmiast wywołaj z aktualnym stanem

  return () => {
    syncListeners = syncListeners.filter(l => l !== listener);
  };
};

// Aktualizuj i powiadom subskrybentów
const updateState = (updates: Partial<SyncState>): void => {
  syncState = { ...syncState, ...updates };
  syncListeners.forEach(listener => listener(syncState));
};

// Obsługa zmiany stanu sieci
const handleOnline = (): void => {
  updateState({ isOnline: true });
  triggerSync();
};

const handleOffline = (): void => {
  updateState({ isOnline: false });
};

// Zapisz operację do kolejki
export const queueOperation = (operation: SyncOperation): void => {
  const pendingOp: PendingSync = {
    id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    operation,
    timestamp: Date.now(),
    retryCount: 0
  };

  const pending = [...syncState.pendingOperations, pendingOp];
  updateState({ pendingOperations: pending });
  savePendingOperations();

  // Jeśli online, spróbuj zsynchronizować
  if (syncState.isOnline && !syncState.isSyncing) {
    triggerSync();
  }
};

// Zapisz oczekujące operacje do localStorage
const savePendingOperations = (): void => {
  localStorage.setItem(STORAGE_KEYS.PENDING_SYNC, JSON.stringify(syncState.pendingOperations));
};

// Załaduj oczekujące operacje z localStorage
const loadPendingOperations = (): void => {
  const stored = localStorage.getItem(STORAGE_KEYS.PENDING_SYNC);
  if (stored) {
    try {
      const operations = JSON.parse(stored) as PendingSync[];
      updateState({ pendingOperations: operations });
    } catch (e) {
      console.error('Failed to load pending operations:', e);
    }
  }
};

// Sprawdź czy backend jest dostępny
export const checkBackendAvailability = async (): Promise<boolean> => {
  try {
    const response = await fetch(`${syncConfig.backendUrl}/health`, {
      method: 'GET',
      headers: { 'Accept': 'application/json' },
      signal: AbortSignal.timeout(5000)
    });
    return response.ok;
  } catch {
    return false;
  }
};

// Wykonaj synchronizację
export const triggerSync = async (): Promise<void> => {
  if (!syncState.isOnline || syncState.isSyncing) {
    return;
  }

  const backendAvailable = await checkBackendAvailability();
  if (!backendAvailable) {
    return;
  }

  updateState({ isSyncing: true, syncErrors: [] });

  const errors: string[] = [];
  const successfulOps: string[] = [];

  for (const pendingOp of syncState.pendingOperations) {
    try {
      await executeSyncOperation(pendingOp.operation);
      successfulOps.push(pendingOp.id);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';

      if (pendingOp.retryCount >= syncConfig.maxRetries) {
        errors.push(`Operation ${pendingOp.operation.type} failed after ${syncConfig.maxRetries} retries: ${errorMessage}`);
        successfulOps.push(pendingOp.id); // Usuń po przekroczeniu limitu prób
      } else {
        // Zwiększ licznik prób
        pendingOp.retryCount++;
      }
    }
  }

  // Usuń pomyślnie wykonane operacje
  const remaining = syncState.pendingOperations.filter(op => !successfulOps.includes(op.id));

  updateState({
    isSyncing: false,
    lastSyncTime: Date.now(),
    pendingOperations: remaining,
    syncErrors: errors
  });

  savePendingOperations();
  localStorage.setItem(STORAGE_KEYS.LAST_SYNC, Date.now().toString());
};

// Wykonaj pojedynczą operację synchronizacji
const executeSyncOperation = async (operation: SyncOperation): Promise<void> => {
  const baseUrl = syncConfig.backendUrl;

  switch (operation.type) {
    case 'CREATE_USER':
      await fetch(`${baseUrl}/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(transformForBackend(operation.payload))
      });
      break;

    case 'UPDATE_USER':
      await fetch(`${baseUrl}/users/${operation.payload.uniqueId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(transformForBackend(operation.payload.updates))
      });
      break;

    case 'CREATE_ESTIMATE':
      await fetch(`${baseUrl}/users/${operation.payload.uniqueId}/estimates`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(transformForBackend(operation.payload.estimate))
      });
      break;

    case 'UPDATE_ESTIMATE':
      await fetch(`${baseUrl}/users/${operation.payload.uniqueId}/estimates/${operation.payload.estimateId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(transformForBackend(operation.payload.updates))
      });
      break;

    case 'DELETE_ESTIMATE':
      await fetch(`${baseUrl}/users/${operation.payload.uniqueId}/estimates/${operation.payload.estimateId}`, {
        method: 'DELETE'
      });
      break;

    case 'ADD_ITEM_TEMPLATE':
      await fetch(`${baseUrl}/users/${operation.payload.uniqueId}/items`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(transformForBackend({ ...operation.payload.template, localId: operation.payload.localId }))
      });
      break;

    case 'UPDATE_ITEM_TEMPLATE':
      await fetch(`${baseUrl}/users/${operation.payload.uniqueId}/items/${operation.payload.templateId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(transformForBackend(operation.payload.updates))
      });
      break;

    case 'DELETE_ITEM_TEMPLATE':
      await fetch(`${baseUrl}/users/${operation.payload.uniqueId}/items/${operation.payload.templateId}`, {
        method: 'DELETE'
      });
      break;

    case 'ADD_WORK_TEMPLATE':
      await fetch(`${baseUrl}/users/${operation.payload.uniqueId}/works`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(transformForBackend({ ...operation.payload.template, localId: operation.payload.localId }))
      });
      break;

    case 'UPDATE_WORK_TEMPLATE':
      await fetch(`${baseUrl}/users/${operation.payload.uniqueId}/works/${operation.payload.templateId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(transformForBackend(operation.payload.updates))
      });
      break;

    case 'DELETE_WORK_TEMPLATE':
      await fetch(`${baseUrl}/users/${operation.payload.uniqueId}/works/${operation.payload.templateId}`, {
        method: 'DELETE'
      });
      break;

    case 'ADD_RENOVATION_TEMPLATE':
      await fetch(`${baseUrl}/users/${operation.payload.uniqueId}/renovations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(transformForBackend({ ...operation.payload.template, localId: operation.payload.localId }))
      });
      break;

    case 'UPDATE_RENOVATION_TEMPLATE':
      await fetch(`${baseUrl}/users/${operation.payload.uniqueId}/renovations/${operation.payload.templateId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(transformForBackend(operation.payload.updates))
      });
      break;

    case 'DELETE_RENOVATION_TEMPLATE':
      await fetch(`${baseUrl}/users/${operation.payload.uniqueId}/renovations/${operation.payload.templateId}`, {
        method: 'DELETE'
      });
      break;
  }
};

// Pobierz dane użytkownika z backendu
export const fetchUserFromBackend = async (uniqueId: string): Promise<UserData | null> => {
  try {
    const response = await fetch(`${syncConfig.backendUrl}/users/${uniqueId}`, {
      headers: { 'Accept': 'application/json' },
      signal: AbortSignal.timeout(10000)
    });

    if (!response.ok) {
      return null;
    }

    return await response.json();
  } catch {
    return null;
  }
};

// Synchronizacja pełnych danych użytkownika z backendem
export const syncUserData = async (localUser: UserData): Promise<UserData> => {
  const backendAvailable = await checkBackendAvailability();

  if (!backendAvailable) {
    return localUser; // Zwróć lokalne dane jeśli backend niedostępny
  }

  try {
    const response = await fetch(`${syncConfig.backendUrl}/users/${localUser.uniqueId}/sync`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(transformForBackend(localUser))
    });

    if (!response.ok) {
      return localUser;
    }

    return await response.json();
  } catch {
    return localUser;
  }
};

// Automatyczna synchronizacja
const startAutoSync = (): void => {
  if (syncInterval) {
    clearInterval(syncInterval);
  }

  syncInterval = window.setInterval(() => {
    if (syncState.isOnline && syncState.pendingOperations.length > 0) {
      triggerSync();
    }
  }, syncConfig.syncIntervalMs);
};

// Pobierz aktualny stan synchronizacji
export const getSyncState = (): SyncState => ({ ...syncState });

// Pobierz konfigurację
export const getSyncConfig = (): SyncConfig => ({ ...syncConfig });

// Aktualizuj konfigurację
export const updateSyncConfig = (config: Partial<SyncConfig>): void => {
  syncConfig = { ...syncConfig, ...config };

  // Zrestartuj auto sync z nowym interwałem
  if (config.syncIntervalMs) {
    startAutoSync();
  }
};
