import { useEffect, useState } from "react";
import {Incidente} from "@/types/incidente";

export function useIncidentes(page = 1, limit = 10) {
  const [incidentes, setIncidentes] = useState<Incidente[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);

    fetch(`/api/incidentes?page=${page}&limit=${limit}`)
      .then(res => res.json())
      .then(res => {
        console.log(res.data)
        setIncidentes(res.data as Incidente[]);
        setTotal(res.total);
      })
      .finally(() => setLoading(false));
  }, [page, limit]);

  return { incidentes, total, loading };
}
