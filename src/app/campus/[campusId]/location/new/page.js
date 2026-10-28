import NewLocationMapWrapper from "@/_components/NewLocationMapWrapper";
import { supabase } from "@/_lib/supabaseClient";

export default async function Newlocation({ params }) {
  const { campusId } = await params;
  const { data: campus, campusError } = await supabase
    .from("campuses")
    .select("*")
    .eq("id", campusId)
    .single();

  const { data: locations, error: locationsError } = await supabase
    .from("locations")
    .select("*")
    .eq("campus_id", campusId);

  if (campusError) throw new Error("Failed to fetch campus details");

  return (
    <div>
      <h1>Add New Location for {campus.name}</h1>
      <NewLocationMapWrapper campus={campus} locations={locations}/>
    </div>
  );
}
