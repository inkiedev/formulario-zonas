import IncidenteForm from "@/components/formulario/incidente-form";
import {Asunto} from "@/types/asuntos";
import {createClient} from "@/lib/server";
import {Motivo} from "@/types/motivos";
import {Dispositivo} from "@/types/dispositivo";
import {Responsable} from "@/types/responsable";
import {Superintendente} from "@/types/superintendente";
import {Jefe} from "@/types/jefe";
import {Operador} from "@/types/operador";

export default async function Home() {
  const supabase = await createClient();

  const [asuntosRes, motivosRes, dispositivosRes, responsablesRes, superintendentesRes, jefesRes, operadoresRes] = await Promise.all([
    supabase.from('asuntos').select('*').order('descripcion', { ascending: true }),
    supabase.from('motivos').select('*').order('descripcion', { ascending: true }),
    supabase.from('dispositivos').select('*').order('descripcion', { ascending: true }),
    supabase.from('responsables').select('*').order('alimentador', { ascending: true }),
    supabase.from('superintendentes').select('*').order('nombre', { ascending: true }),
    supabase.from('jefes').select('*').order('grupo', { ascending: true }),
    supabase.from('operadores').select('*').order('operador', { ascending: true }),
  ]);

  if (asuntosRes.error) {
    console.error('Error al cargar asuntos: ', asuntosRes.error);
  }
  if (motivosRes.error) {
    console.error('Error al cargar motivos: ', motivosRes.error);
  }

  if (dispositivosRes.error) {
    console.error('Error al cargar motivos: ', motivosRes.error);
  }

  if (responsablesRes.error) {
    console.error('Error al cargar responsables: ', motivosRes.error);
  }

  if (superintendentesRes.error) {
    console.error('Error al cargar superintendentes: ', superintendentesRes.error);
  }

  if (jefesRes.error) {
    console.error('Error al cargar jefes: ', jefesRes.error);
  }

  if (operadoresRes.error) {
    console.error('Error al cargar jefes: ', jefesRes.error);
  }

  return (
    <div>
      <IncidenteForm
        asuntos={asuntosRes.data as Asunto[]}
        motivos={motivosRes.data as Motivo[]}
        dispositivos={dispositivosRes.data as Dispositivo[]}
        responsables={responsablesRes.data as Responsable[]}
        superintendentes={superintendentesRes.data as Superintendente[]}
        jefes={jefesRes.data as Jefe[]}
        operadores={operadoresRes.data as Operador[]}
      />
    </div>
  );
}
