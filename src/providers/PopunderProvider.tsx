'use client';

import { createContext, useContext, ReactNode } from 'react';
import { usePopunder, PopunderState } from '@/hooks/usePopunder';
import { POPUNDER_CONFIG, PopunderPageKey } from '@/config/popunderConfig';

// Create the context
const PopunderContext = createContext<PopunderState | null>(null);

// Provider props interface
interface PopunderProviderProps {
  children: ReactNode;
  pageKey?: PopunderPageKey;
  customUrl?: string;
  maxTriggersPerSession?: number;
  enableLogging?: boolean;
}

// Main Provider component
export function PopunderProvider({ 
  children,
  pageKey,
  customUrl,
  maxTriggersPerSession = POPUNDER_CONFIG.maxTriggersPerSession,
  enableLogging = POPUNDER_CONFIG.enableLogging
}: PopunderProviderProps) {
  
  // Determine which URL to use
  const getUrl = () => {
    if (customUrl) return customUrl;
    if (pageKey && POPUNDER_CONFIG.urls[pageKey]) {
      return POPUNDER_CONFIG.urls[pageKey];
    }
    return POPUNDER_CONFIG.defaultUrl;
  };

  const url = getUrl();
  
  const popunderState = usePopunder({
    url,
    maxTriggersPerSession,
    enableLogging
  });

  return (
    <PopunderContext.Provider value={popunderState}>
      {children}
    </PopunderContext.Provider>
  );
}

// Hook to use the popunder context
export function usePopunderContext(): PopunderState {
  const context = useContext(PopunderContext);
  if (!context) {
    throw new Error('usePopunderContext must be used within PopunderProvider');
  }
  return context;
}

// Optional: HOC (Higher Order Component) for easier wrapping
export function withPopunder<P extends object>(
  Component: React.ComponentType<P>,
  popunderProps?: Omit<PopunderProviderProps, 'children'>
) {
  return function PopunderWrappedComponent(props: P) {
    return (
      <PopunderProvider {...popunderProps}>
        <Component {...props} />
      </PopunderProvider>
    );
  };
}