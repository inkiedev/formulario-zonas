import { NextResponse } from "next/server";
import {createClient} from "@/lib/server";


export async function GET() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("asuntos")
    .select("*");

  return NextResponse.json({ data, error });
}
