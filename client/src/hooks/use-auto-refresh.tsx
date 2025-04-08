import { useEffect } from 'react';
import { queryClient } from "@/lib/queryClient";

/**
 * A hook that automatically refreshes data in background at specific intervals
 * @param queryKeys Array of query keys to refresh
 * @param interval Refresh interval in ms, defaults to 10 seconds
 */
export function useAutoRefresh(queryKeys: string[], interval = 10000) {
  useEffect(() => {
    // Immediately refresh when component mounts
    queryKeys.forEach(key => {
      queryClient.invalidateQueries({ queryKey: [key] });
    });
    
    // Set up interval for refreshing
    const refreshTimer = setInterval(() => {
      queryKeys.forEach(key => {
        queryClient.invalidateQueries({ queryKey: [key] });
      });
    }, interval);
    
    // Clean up timer on component unmount
    return () => clearInterval(refreshTimer);
  }, [queryKeys, interval]);
}

/**
 * Utility to invalidate multiple queries at once
 * @param queryKeys Array of query keys to invalidate
 */
export function refreshQueries(queryKeys: string[]) {
  queryKeys.forEach(key => {
    queryClient.invalidateQueries({ queryKey: [key] });
  });
}