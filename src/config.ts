/**
 * =====================================================
 * CENTRALIZED APPLICATION CONFIGURATION
 * =====================================================
 * 
 * This file contains all configurable properties for the Kosztorys App.
 * Modify these values to customize the application behavior.
 * 
 * Sections:
 * 1. API Configuration - REST backend settings
 * 2. Sync Configuration - Offline/online synchronization settings
 * 3. Storage Configuration - Local storage keys and settings
 * 4. App Metadata - Application name, branding, etc.
 */

// =====================================================
// 1. API CONFIGURATION
// =====================================================

/**
 * API Configuration interface for REST backend connection.
 */
export interface ApiConfig {
    /** Whether to use REST backend instead of local storage */
    useRestBackend: boolean;
    /** Base URL for the REST API endpoints */
    restBaseUrl: string;
    /** 
     * Data retention period in hours. 
     * Set to 0 for permanent data (no automatic cleanup).
     * Non-zero values will automatically delete accounts older than this period.
     */
    retentionHours: number;
}

/**
 * Default API configuration.
 * - Uses local storage by default (useRestBackend: false)
 * - REST API base URL for when REST backend is enabled
 * - 24-hour data retention for demo/trial accounts
 */
export const DEFAULT_API_CONFIG: ApiConfig = {
    useRestBackend: false,
    restBaseUrl: '/api',
    retentionHours: 24,
};

// =====================================================
// 2. SYNC CONFIGURATION
// =====================================================

/**
 * Configuration for offline/online synchronization service.
 */
export interface SyncConfig {
    /** Backend URL for synchronization (full URL including /api path) */
    backendUrl: string;
    /** Interval between automatic sync attempts in milliseconds */
    syncIntervalMs: number;
    /** Maximum number of retry attempts for failed sync operations */
    maxRetries: number;
}

/**
 * Default synchronization configuration.
 * - Backend URL for local development
 * - 30-second sync interval
 * - 3 retry attempts before giving up on an operation
 */
export const DEFAULT_SYNC_CONFIG: SyncConfig = {
    backendUrl: 'http://localhost:8080/api',
    syncIntervalMs: 30000, // 30 seconds
    maxRetries: 3,
};

// =====================================================
// 3. STORAGE CONFIGURATION
// =====================================================

/**
 * Storage configuration - LocalStorage keys used by the application.
 * Prefixed with 'kosztorys_' to avoid conflicts with other applications.
 */
export const STORAGE_KEYS = {
    /** Key for storing user data */
    USERS: 'kosztorys_users',
    /** Key for storing pending sync operations */
    PENDING_SYNC: 'kosztorys_pending_sync',
    /** Key for storing last synchronization timestamp */
    LAST_SYNC: 'kosztorys_last_sync',
    /** Key for storing selected language preference */
    LANGUAGE: 'kosztorys_language',
} as const;

// =====================================================
// 4. APP METADATA
// =====================================================

/**
 * Application metadata and branding configuration.
 */
export const APP_METADATA = {
    /** Application name */
    name: 'Kosztorys Budowlany',
    /** Short application name (for PWA, icons, etc.) */
    shortName: 'Kosztorys',
    /** Application description */
    description: 'Aplikacja do szybkiego kosztorysowania dla firm wykończeniowych',
    /** Application version */
    version: '1.0.0',
    /** Base path for deployment (GitHub Pages, etc.) */
    basePath: '/kosztorys-app/',
} as const;

/**
 * PWA (Progressive Web App) configuration.
 */
export const PWA_CONFIG = {
    /** Theme color for browser UI */
    themeColor: '#f97316',
    /** Background color for splash screen */
    backgroundColor: '#1f2937',
    /** Display mode for PWA */
    display: 'standalone' as const,
} as const;

// =====================================================
// 5. PDF CONFIGURATION
// =====================================================

/**
 * PDF generation configuration.
 */
export const PDF_CONFIG = {
    /** File name prefix for generated PDF estimates */
    fileNamePrefix: 'kosztorys',
} as const;

// =====================================================
// 6. CLEANUP CONFIGURATION
// =====================================================

/**
 * Configuration for automatic data cleanup.
 */
export const CLEANUP_CONFIG = {
    /** Interval for checking expired accounts in milliseconds (1 minute) */
    checkIntervalMs: 60000,
} as const;

// =====================================================
// 7. APP BEHAVIOR CONFIGURATION
// =====================================================

/**
 * Application behavior configuration.
 */
export const APP_BEHAVIOR = {
    /** 
     * Set to true to require online access (blocks offline usage).
     * Set to false to allow full PWA/offline functionality.
     */
    requireOnlineAccess: true,
} as const;
