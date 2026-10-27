import AvailableCampusesMapWrapper from "@/_components/AvailableCampusesMapWrapper.js";
import { supabase } from "@/_lib/supabaseClient";

export const metadata = {
  title: "Available Campuses | Campus Route Finder",
  description: "Browse and navigate university campuses",
};

export default async function CampusPage() {
  const { data, error } = await supabase.from("campuses").select("*");

  if(error) throw new Error("Failed to fetch Campus Data: ", error.message);

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-4">
      <h1 className="text-2xl font-bold text-gray-800">
        Available Campuses
      </h1>
      <AvailableCampusesMapWrapper campuses={data}/>
    </div>
  );
}
