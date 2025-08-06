import { useEffect, useCallback, useRef } from 'react';

interface PopunderConfig {
  url: string;
  maxTriggersPerSession?: number;
  enableLogging?: boolean;
  sessionTimeoutMinutes?: number;
}

export interface PopunderState {
  triggerPopunder: () => boolean;
  hasTriggered: boolean;
  sessionCount: number;
}

export const usePopunder = (config: PopunderConfig): PopunderState => {
  const { url, maxTriggersPerSession = 1, enableLogging = false, sessionTimeoutMinutes = 30 } = config;
  const hasTriggeredRef = useRef(false);
  const listenerAddedRef = useRef(false);
  const componentMountedRef = useRef(false);

  const log = useCallback((message: string, data?: any) => {
    if (enableLogging) {
      console.log(`[Popunder] ${message}`, data || '');
    }
  }, [enableLogging]);

  const getSessionCount = useCallback(() => {
    try {
      const count = sessionStorage.getItem('popunder_session_count');
      const lastReset = sessionStorage.getItem('popunder_last_reset');
      const now = Date.now();
      
      // Reset count if it's been more than 30 minutes since last reset (new session)
      if (!lastReset || (now - parseInt(lastReset)) > (sessionTimeoutMinutes) * 60 * 1000) {
        sessionStorage.setItem('popunder_session_count', '0');
        sessionStorage.setItem('popunder_last_reset', now.toString());
        return 0;
      }
      
      return count ? parseInt(count, 10) : 0;
    } catch {
      return 0;
    }
  }, []);

  const incrementSessionCount = useCallback(() => {
    try {
      const current = getSessionCount();
      const newCount = current + 1;
      sessionStorage.setItem('popunder_session_count', newCount.toString());
      sessionStorage.setItem('popunder_last_reset', Date.now().toString());
      log(`Session count incremented to: ${newCount}`);
    } catch (error) {
      log('Failed to update session count', error);
    }
  }, [getSessionCount, log]);

  const triggerPopunder = useCallback(() => {
    // Check if already triggered globally (across all component instances)
    const currentCount = getSessionCount();
    
    if (currentCount >= maxTriggersPerSession) {
      log(`Max triggers reached: ${currentCount}/${maxTriggersPerSession}`);
      return false;
    }

    // Check if this specific component instance already triggered
    if (hasTriggeredRef.current) {
      log('Popunder already triggered in this component instance');
      return false;
    }

    try {
      log('Attempting to trigger popunder', { url, sessionCount: currentCount });
      
      const popunder = window.open(url, '_blank', 'noopener,noreferrer');
      
      if (popunder) {
        // Focus back to original window to make it a popunder
        window.focus();
        
        // Additional focus attempts to ensure popunder behavior
        setTimeout(() => {
          window.focus();
          if (document.hasFocus && !document.hasFocus()) {
            window.focus();
          }
        }, 50);

        setTimeout(() => {
          window.focus();
        }, 150);
        
        hasTriggeredRef.current = true;
        incrementSessionCount();
        log('Popunder triggered successfully');
        return true;
      } else {
        log('Popunder blocked by browser or failed to open');
        // If popunder failed to open, we still increment the session count to avoid user abuse
        hasTriggeredRef.current = true;
        incrementSessionCount();
      }
    } catch (error) {
      log('Popunder error', error);
    }
    
    return false;
  }, [url, getSessionCount, maxTriggersPerSession, incrementSessionCount, log]);

  const handleFirstClick = useCallback((event: Event) => {
    // Ignore clicks that happen too quickly after page load (likely programmatic)
    if (!componentMountedRef.current) {
      log('Ignoring click - component not fully mounted');
      return;
    }

    // Check if we've already reached max triggers globally
    const currentCount = getSessionCount();
    if (currentCount >= maxTriggersPerSession) {
      log('Max session triggers reached, removing listeners');
      document.removeEventListener('click', handleFirstClick, { capture: true });
      document.removeEventListener('touchstart', handleFirstClick, { capture: true });
      listenerAddedRef.current = false;
      return;
    }

    log('First genuine click detected', { 
      target: (event.target as HTMLElement)?.tagName,
      currentCount,
      maxTriggers: maxTriggersPerSession
    });
    
    if (triggerPopunder()) {
      // Remove the event listener after successful trigger
      document.removeEventListener('click', handleFirstClick, { capture: true });
      document.removeEventListener('touchstart', handleFirstClick, { capture: true });
      listenerAddedRef.current = false;
      log('Click listeners removed after successful popunder');
    }
  }, [triggerPopunder, log, getSessionCount, maxTriggersPerSession]);

  // Setup click listeners
  useEffect(() => {
    // Mark component as mounted after a short delay
    const mountTimer = setTimeout(() => {
      componentMountedRef.current = true;
      log('Component marked as fully mounted');
    }, 500); // 500ms delay to avoid immediate clicks

    return () => {
      clearTimeout(mountTimer);
      componentMountedRef.current = false;
    };
  }, [log]);

  useEffect(() => {
    if (listenerAddedRef.current || hasTriggeredRef.current) {
      return;
    }

    const currentCount = getSessionCount();
    if (currentCount >= maxTriggersPerSession) {
      log('Max session triggers reached, not setting up listeners');
      return;
    }

    // Don't set up listeners immediately, wait a bit
    const setupTimer = setTimeout(() => {
      if (!listenerAddedRef.current && !hasTriggeredRef.current) {
        log('Setting up first-click popunder listeners');
        
        // Use capture phase to catch clicks before they bubble
        document.addEventListener('click', handleFirstClick, { capture: true, passive: true });
        document.addEventListener('touchstart', handleFirstClick, { capture: true, passive: true });
        
        listenerAddedRef.current = true;
      }
    }, 1000); // 1 second delay before setting up listeners

    // Cleanup function
    return () => {
      clearTimeout(setupTimer);
      if (listenerAddedRef.current) {
        document.removeEventListener('click', handleFirstClick, { capture: true });
        document.removeEventListener('touchstart', handleFirstClick, { capture: true });
        listenerAddedRef.current = false;
        log('Click listeners cleaned up');
      }
    };
  }, [handleFirstClick, getSessionCount, maxTriggersPerSession, log]);

  return { 
    triggerPopunder,
    hasTriggered: hasTriggeredRef.current,
    sessionCount: getSessionCount()
  };
};