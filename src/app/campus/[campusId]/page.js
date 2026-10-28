import { supabase } from "@/_lib/supabaseClient";
import Link from "next/link";

export default async function CampusDetails({ params }) {
  const { campusId } = await params;
  const { data: campus, error } = await supabase
    .from("campuses")
    .select()
    .eq("id", campusId)
    .single();

  if (error) throw new Error("Failed to fetch Campus details", error.message);

  return (
    <>
      <div>
        <h1>{campus.name}</h1>
        <p>ID: {campus.id}</p>
        <p>{campus.address}</p>
      </div>
      <div>
        <Link href={`/campus/${campusId}/network`}>View Campus Network</Link>
      </div>
    </>
  );
}
