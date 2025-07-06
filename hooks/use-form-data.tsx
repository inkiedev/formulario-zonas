import { useState, useEffect } from 'react';
import { Superintendente } from "@/types/superintendente";
import { Jefe } from "@/types/jefe";
import { Operador } from "@/types/operador";

interface UseFormDataReturn {
  superintendentes: Superintendente[];
  jefes: Jefe[];
  operadores: Operador[];
  loading: boolean;
  error: string | null;
}

export function useFormData(): UseFormDataReturn {
  const [superintendentes, setSuperintendentes] = useState<Superintendente[]>([]);
  const [jefes, setJefes] = useState<Jefe[]>([]);
  const [operadores, setOperadores] = useState<Operador[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const [superintendentesRes, jefesRes, operadoresRes] = await Promise.all([
          fetch('/api/superintendentes'),
          fetch('/api/jefes'),
          fetch('/api/operadores'),
        ]);

        if (!superintendentesRes.ok || !jefesRes.ok || !operadoresRes.ok) {
          throw new Error('Error al cargar los datos del formulario');
        }

        const [superintendentesData, jefesData, operadoresData] = await Promise.all([
          superintendentesRes.json(),
          jefesRes.json(),
          operadoresRes.json(),
        ]);

        setSuperintendentes(superintendentesData.data || []);
        setJefes(jefesData.data || []);
        setOperadores(operadoresData.data || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error desconocido');
        console.error('Error cargando datos del formulario:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData().then();
  }, []);

  return {
    superintendentes,
    jefes,
    operadores,
    loading,
    error,
  };
}
