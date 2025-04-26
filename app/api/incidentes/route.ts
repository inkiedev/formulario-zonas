import {NextRequest, NextResponse} from "next/server";
import {createClient} from "@/lib/server";
import {atencionSchema, incidentSchema} from "@/lib/validation";

export async function GET() {
  const supabase = await createClient();

  const { data, error, count } = await supabase
    .from("incidentes")
    .select(`
    *,
    responsables(
      alimentador,
      responsable,
      auxiliar,
      zona
    )
  `, { count: "exact" })
    .order("fecha_creacion", { ascending: false });

  if (error) {
    return NextResponse.json({ error }, { status: 500 });
  }

  return NextResponse.json({ data, total: count });
}

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const payload = await request.json();

  const validation = incidentSchema.safeParse(payload);

  if (!validation.success) {
    return NextResponse.json({ error: validation.error.format() }, { status: 422 });
  }

  const incidente = validation.data;
  const { data, error } = await supabase
    .from('incidentes')
    .insert([
      incidente
    ])
    .select()

  if (error) {
    return NextResponse.json({ error }, { status: 500 });
  }

  return NextResponse.json({ data }, { status: 200 })
}

export async function PATCH(request: NextRequest) {
  const supabase = await createClient();
  const payload = await request.json();

  console.log(payload)

  const validation = atencionSchema.safeParse(payload.data);

  if (!validation.success) {
    return NextResponse.json({ error: validation.error.format() }, { status: 422 });
  }

  const {data, error} = await supabase
    .from('incidentes')
    .update(payload.data)
    .eq('id', payload.incidente)

  if (error) {
    console.log(error)
    return NextResponse.json({ error }, { status: 500 });
  }

  return NextResponse.json({ data }, {status: 200})
}
