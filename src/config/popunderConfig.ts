export const POPUNDER_CONFIG = {
  // Your main Adstera URL
  defaultUrl: "https://www.profitableratecpm.com/vz23hychc?key=90b6a685772e36eadffa06a203a0d21d",
  
  // Maximum popunders per browser session
  maxTriggersPerSession: 1,
  
  // Session timeout in minutes (after this time, counter resets)
  sessionTimeoutMinutes: 15,
  
  // Delay before setting up click listeners (prevents immediate triggers)
  setupDelayMs: 1000,
  
  // Delay before allowing clicks to trigger popunder (prevents programmatic clicks)
  clickDelayMs: 500,
  
  // Enable logging in development
  enableLogging: process.env.NODE_ENV === 'development',
  
  // Optional: Different URLs for different pages/components
  urls: {
    home: "https://statespiecehooter.com/vz23hychc?key=90b6a685772e36eadffa06a203a0d21d",
    // upload: "https://www.profitableratecpm.com/vsadfaz23asdfasdhychcfad?key=90asdfasdb6a685772easfasdff36eadffa06a203a0d21d",
    // download: "https://www.profitableratecpm.com/vsadfaz23asdfasdhychcfad?key=90asdfasdb6a685772easfasdff36eadffa06a203a0d21d",
  }
} as const;

export type PopunderPageKey = keyof typeof POPUNDER_CONFIG.urls;

// Utility functions for session management
export const popunderUtils = {
  // Clear the session count (useful for testing)
  clearSession: () => {
    try {
      sessionStorage.removeItem('popunder_session_count');
      sessionStorage.removeItem('popunder_last_reset');
      console.log('[Popunder] Session cleared');
    } catch (error) {
      console.warn('[Popunder] Failed to clear session', error);
    }
  },
  
  // Get current session status
  getSessionStatus: () => {
    try {
      const count = sessionStorage.getItem('popunder_session_count') || '0';
      const lastReset = sessionStorage.getItem('popunder_last_reset') || '0';
      return {
        count: parseInt(count),
        lastReset: new Date(parseInt(lastReset)),
        isActive: parseInt(count) < POPUNDER_CONFIG.maxTriggersPerSession
      };
    } catch {
      return { count: 0, lastReset: new Date(), isActive: true };
    }
  }
};