import React, { useEffect, useState } from 'react';
import {
  initSyncService,
  subscribeSyncState,
  getSyncState,
  triggerSync,
  SyncState
} from './syncService';
import { DEFAULT_SYNC_CONFIG } from './config';

/**
 * Hook do obsługi stanu synchronizacji w komponentach React.
 */
export const useSyncState = (): SyncState => {
  const [syncState, setSyncState] = useState<SyncState>(getSyncState());

  useEffect(() => {
    const unsubscribe = subscribeSyncState(setSyncState);
    return unsubscribe;
  }, []);

  return syncState;
};

/**
 * Komponent wyświetlający status synchronizacji.
 */
export const SyncStatusIndicator: React.FC = () => {
  const syncState = useSyncState();

  const getStatusInfo = () => {
    if (!syncState.isOnline) {
      return {
        icon: '📴',
        text: 'Offline',
        className: 'sync-status offline'
      };
    }

    if (syncState.isSyncing) {
      return {
        icon: '🔄',
        text: 'Synchronizacja...',
        className: 'sync-status syncing'
      };
    }

    if (syncState.pendingOperations.length > 0) {
      return {
        icon: '⏳',
        text: `${syncState.pendingOperations.length} oczekujących`,
        className: 'sync-status pending'
      };
    }

    if (syncState.syncErrors.length > 0) {
      return {
        icon: '⚠️',
        text: 'Błędy synchronizacji',
        className: 'sync-status error'
      };
    }

    return {
      icon: '✅',
      text: 'Zsynchronizowano',
      className: 'sync-status synced'
    };
  };

  const status = getStatusInfo();

  const handleClick = () => {
    if (syncState.isOnline && !syncState.isSyncing) {
      triggerSync();
    }
  };

  return (
    <button
      className={status.className}
      onClick={handleClick}
      title={syncState.lastSyncTime
        ? `Ostatnia synchronizacja: ${new Date(syncState.lastSyncTime).toLocaleTimeString('pl-PL')}`
        : 'Kliknij aby zsynchronizować'
      }
    >
      <span className="sync-status-icon">{status.icon}</span>
      <span className="sync-status-text">{status.text}</span>
    </button>
  );
};

/**
 * Komponent inicjalizujący synchronizację.
 */
export const SyncProvider: React.FC<{ children: React.ReactNode; backendUrl?: string }> = ({
  children,
  backendUrl = DEFAULT_SYNC_CONFIG.backendUrl
}) => {
  useEffect(() => {
    initSyncService({ backendUrl });
  }, [backendUrl]);

  return <>{children}</>;
};
