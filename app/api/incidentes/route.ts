import {NextRequest, NextResponse} from "next/server";
import {createClient} from "@/lib/server";
import {incidentSchema} from "@/lib/validation";

export async function GET(request: NextRequest) {
  const supabase = await createClient();

  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = parseInt(searchParams.get("limit") || "10", 10);

  const from = (page - 1) * limit;
  const to = from + limit - 1;

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
    .range(from, to)
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

  return NextResponse.redirect(new URL('/incidentes', request.url))
}
