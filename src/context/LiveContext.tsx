import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';

interface LiveEvent {
  type: string;
  data: any;
  timestamp: string;
}

interface LiveContextType {
  isConnected: boolean;
  lastEvent: LiveEvent | null;
  refreshTrigger: number;
  triggerRefresh: () => void;
}

const LiveContext = createContext<LiveContextType | undefined>(undefined);

export const LiveProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [lastEvent, setLastEvent] = useState<LiveEvent | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const triggerRefresh = useCallback(() => {
    setRefreshTrigger((prev) => prev + 1);
  }, []);

  useEffect(() => {
    let eventSource: EventSource | null = null;
    let reconnectTimeout: any = null;

    const connect = () => {
      try {
        eventSource = new EventSource('/api/events');

        eventSource.onopen = () => {
          setIsConnected(true);
        };

        eventSource.addEventListener('connected', () => {
          setIsConnected(true);
        });

        eventSource.addEventListener('visitor_registered', (e: MessageEvent) => {
          setLastEvent({ type: 'visitor_registered', data: JSON.parse(e.data), timestamp: new Date().toISOString() });
          setRefreshTrigger((prev) => prev + 1);
        });

        eventSource.addEventListener('visitor_approved', (e: MessageEvent) => {
          setLastEvent({ type: 'visitor_approved', data: JSON.parse(e.data), timestamp: new Date().toISOString() });
          setRefreshTrigger((prev) => prev + 1);
        });

        eventSource.addEventListener('scan_completed', (e: MessageEvent) => {
          setLastEvent({ type: 'scan_completed', data: JSON.parse(e.data), timestamp: new Date().toISOString() });
          setRefreshTrigger((prev) => prev + 1);
        });

        eventSource.addEventListener('stats_updated', (e: MessageEvent) => {
          setLastEvent({ type: 'stats_updated', data: JSON.parse(e.data), timestamp: new Date().toISOString() });
          setRefreshTrigger((prev) => prev + 1);
        });

        eventSource.addEventListener('system_reset', () => {
          setLastEvent({ type: 'system_reset', data: {}, timestamp: new Date().toISOString() });
          setRefreshTrigger((prev) => prev + 1);
        });

        eventSource.onerror = () => {
          setIsConnected(false);
          eventSource?.close();
          reconnectTimeout = setTimeout(connect, 5000);
        };
      } catch (err) {
        setIsConnected(false);
      }
    };

    connect();

    return () => {
      if (eventSource) eventSource.close();
      if (reconnectTimeout) clearTimeout(reconnectTimeout);
    };
  }, []);

  return (
    <LiveContext.Provider value={{ isConnected, lastEvent, refreshTrigger, triggerRefresh }}>
      {children}
    </LiveContext.Provider>
  );
};

export const useLive = () => {
  const context = useContext(LiveContext);
  if (!context) {
    throw new Error('useLive must be used within a LiveProvider');
  }
  return context;
};
