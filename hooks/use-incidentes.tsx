"use client"

import {useEffect, useState, useCallback, useMemo, Key} from "react";
import { Incidente } from "@/types/incidente";
import {SortDirection} from "@react-types/shared";

interface UseIncidentesParams {
  page?: number;
  limit?: number;
  search?: string;
  searchType?: "incidente" | "dispositivo";
  statusFilter?: Key[] | "all";
  zonaFilter?: Key[] | "all";
  sortBy?: string;
  sortDirection?: SortDirection;
}

interface UseIncidentesReturn {
  incidentes: Incidente[];
  total: number;
  loading: boolean;
  error: string | null;
  refetch: () => void;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export function useIncidentes(params: UseIncidentesParams = {}): UseIncidentesReturn {
  const {
    page = 1,
    limit = 10,
    search = "",
    searchType = "incidente",
    statusFilter = "all",
    zonaFilter = "all",
    sortBy = "fecha_creacion",
    sortDirection = "desc"
  } = params;

  const [incidentes, setIncidentes] = useState<Incidente[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Memoizar los parámetros de query para evitar requests innecesarios
  const queryParams = useMemo(() => {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      sortBy,
      sortDirection,
    });

    if (search.trim()) {
      params.append('search', search.trim());
      params.append('searchType', searchType);
    }

    if (statusFilter !== "all" && Array.isArray(statusFilter)) {
      statusFilter.forEach(status => params.append('status', status as string));
    }

    if (zonaFilter !== "all" && Array.isArray(zonaFilter)) {
      zonaFilter.forEach(zona => params.append('zona', zona as string));
    }

    return params.toString();
  }, [page, limit, search, searchType, statusFilter, zonaFilter, sortBy, sortDirection]);

  const fetchIncidentes = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`/api/incidentes?${queryParams}`);

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();

      setIncidentes(result.data as Incidente[]);
      setTotal(result.total);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
      setIncidentes([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }, [queryParams]);

  useEffect(() => {
    fetchIncidentes().then();
  }, [fetchIncidentes]);

  // Calcular información de paginación
  const hasNextPage = useMemo(() => page * limit < total, [page, limit, total]);
  const hasPreviousPage = useMemo(() => page > 1, [page]);

  return {
    incidentes,
    total,
    loading,
    error,
    refetch: fetchIncidentes,
    hasNextPage,
    hasPreviousPage
  };
}
