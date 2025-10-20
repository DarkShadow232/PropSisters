import { useState, useEffect, useCallback } from 'react';
import { 
  fetchPropertiesFromMongo, 
  convertMongoToApartment, 
  PropertyFilters 
} from '@/services/mongoPropertyService';
import type { Apartment } from '@/data/rentalData';

interface UsePropertiesOptions {
  pollInterval?: number; // in milliseconds, 0 to disable polling
  filters?: PropertyFilters;
  autoFetch?: boolean;
}

interface UsePropertiesReturn {
  properties: Apartment[];
  loading: boolean;
  error: string | null;
  lastFetch: Date | null;
  refetch: () => Promise<void>;
}

/**
 * Custom hook to fetch and manage properties from MongoDB
 * Optimized for fast loading - polling disabled by default
 * 
 * @param options Configuration options
 * @returns Properties data and control functions
 */
export const useProperties = ({
  pollInterval = 0, // Default: 0 (polling disabled for performance)
  filters = {},
  autoFetch = true
}: UsePropertiesOptions = {}): UsePropertiesReturn => {
  const [properties, setProperties] = useState<Apartment[]>([]);
  const [loading, setLoading] = useState(autoFetch);
  const [error, setError] = useState<string | null>(null);
  const [lastFetch, setLastFetch] = useState<Date | null>(null);

  /**
   * Fetch properties from MongoDB API
   */
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetchPropertiesFromMongo({
        ...filters,
        limit: filters.limit || 100, // Fetch all properties by default
      });

      const apartments = response.data.map(convertMongoToApartment);
      setProperties(apartments);
      setLastFetch(new Date());
      
      console.log(`✓ Fetched ${apartments.length} properties from MongoDB`);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load properties';
      console.error('Failed to fetch properties:', err);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  /**
   * Initial fetch on mount
   */
  useEffect(() => {
    if (autoFetch) {
      fetchData();
    }
  }, [fetchData, autoFetch]);

  /**
   * Set up polling interval (only if explicitly enabled)
   */
  useEffect(() => {
    if (pollInterval > 0 && autoFetch) {
      console.log(`Setting up property polling every ${pollInterval}ms`);
      const interval = setInterval(() => {
        console.log('Polling for property updates...');
        fetchData();
      }, pollInterval);
      
      return () => clearInterval(interval);
    }
  }, [pollInterval, fetchData, autoFetch]);

  return { 
    properties, 
    loading, 
    error, 
    lastFetch, 
    refetch: fetchData 
  };
};

