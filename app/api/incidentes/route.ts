import { NextRequest, NextResponse } from 'next/server';
import {atencionSchema, editarSchema, incidentSchema} from "@/lib/validation";
import {createClient} from "@/lib/server";

export async function GET(request: NextRequest) {
  const supabase = await createClient();

  try {
    const { searchParams } = new URL(request.url);

    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';
    const sortBy = searchParams.get('sortBy') || 'fecha_creacion';
    const sortDirection = searchParams.get('sortDirection') || 'desc';

    const statusFilters = searchParams.getAll('status');
    const zonaFilters = searchParams.getAll('zona');

    const offset = (page - 1) * limit;

    let query = supabase
      .from('incidentes')
      .select(`
        id,
        numero_item,
        incidente,
        fecha_creacion,
        esta_atendido,
        asunto,
        motivo,
        dispositivo,
        nombre_dispositivo,
        atencion,
        operador,
        superintendente,
        id_responsable,
        direccion,
        observaciones,
        tiene_archivo,
        fecha_atencion,
        observaciones_atencion,
        operador_atencion,
        zona,
        responsables (
          id,
          alimentador,
          responsable,
          auxiliar,
          zona
        )
      `, { count: 'exact' });

    const searchType = searchParams.get('searchType') || 'incidente';
    if (search.trim()) {
      if (searchType === 'dispositivo') {
        query = query.ilike('nombre_dispositivo', `%${search}%`);
      } else {
        query = query.ilike('incidente', `%${search}%`);
      }
    }

    if (statusFilters.length > 0) {
      const statusConditions = statusFilters.map(status => {
        return status === 'atendido' ? 'esta_atendido.eq.true' : 'esta_atendido.eq.false';
      });
      query = query.or(statusConditions.join(','));
    }

    if (zonaFilters.length > 0) {
      query = query.in('zona', zonaFilters);
    }

    const ascending = sortDirection === 'asc';

    if (sortBy.startsWith('responsables.')) {
      const responsableField = sortBy.replace('responsables.', '');
      query = query.order(responsableField, {
        ascending,
        foreignTable: 'responsables'
      });
    } else {
      query = query.order(sortBy, { ascending });
    }

    query = query.range(offset, offset + limit - 1);

    const { data, error, count } = await query;

    if (error) {
      console.error('Error en query de Supabase:', error);
      return NextResponse.json(
        { error: 'Error al obtener incidentes', details: error.message },
        { status: 500 }
      );
    }

    if (!data) {
      return NextResponse.json(
        { error: 'No se obtuvieron datos' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      data,
      total: count || 0,
      page,
      limit,
      totalPages: Math.ceil((count || 0) / limit),
      hasNextPage: offset + limit < (count || 0),
      hasPreviousPage: page > 1,
    });

  } catch (error) {
    console.error('Error en API de incidentes:', error);
    return NextResponse.json(
      {
        error: 'Error interno del servidor',
        details: error instanceof Error ? error.message : 'Error desconocido'
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const payload = await request.json();

  const validation = incidentSchema.safeParse(payload);

  if (!validation.success) {
    return NextResponse.json({ error: validation.error.format() }, { status: 422 });
  }

  const incidente = validation.data;

  const { data, error } = await supabase.rpc('crear_incidente', {
    incidente_data: incidente
  });

  if (error) {
    switch (error?.code) {
      case '23505':
        return NextResponse.json({ error: "El incidente ya esta registrado" }, { status: 422 });
      default:
        return NextResponse.json({ error }, { status: 500 });
    }

  }

  return NextResponse.json({ data }, { status: 200 })
}

export async function PATCH(request: NextRequest) {
  const supabase = await createClient();
  const payload = await request.json();

  if (payload.data?.incidente || payload.data?.nombre_dispositivo) {
    const validation = editarSchema.safeParse(payload.data);

    if (!validation.success) {
      console.error('Validation error:', validation.error);
      return NextResponse.json({ error: validation.error.format() }, { status: 422 });
    }

    const {data, error} = await supabase
      .from('incidentes')
      .update(payload.data)
      .eq('id', payload.incidente)

    if (error) {
      return NextResponse.json({ error }, { status: 500 });
    }

    return NextResponse.json({ data }, {status: 200})
  }

  const validation = atencionSchema.safeParse(payload.data);

  if (!validation.success) {
    console.error('Validation error:', validation.error);
    return NextResponse.json({ error: validation.error.format() }, { status: 422 });
  }

  const {data, error} = await supabase
    .from('incidentes')
    .update(payload.data)
    .eq('id', payload.incidente)

  if (error) {
    return NextResponse.json({ error }, { status: 500 });
  }

  return NextResponse.json({ data }, {status: 200})
}
