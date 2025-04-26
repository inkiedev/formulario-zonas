import { useEffect, useState, useCallback } from "react";
import { Incidente } from "@/types/incidente";

export function useIncidentes() {
  const [incidentes, setIncidentes] = useState<Incidente[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchIncidentes = useCallback(() => {
    setLoading(true);

    fetch(`/api/incidentes`)
      .then(res => res.json())
      .then(res => {
        console.log(res.data);
        setIncidentes(res.data as Incidente[]);
        setTotal(res.total);
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    fetchIncidentes();
  }, [fetchIncidentes]);

  return { incidentes, total, loading, refetch: fetchIncidentes };
}
