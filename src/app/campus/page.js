import AvailableCampusesMapWrapper from "@/_components/AvailableCampusesMapWrapper";
import { supabase } from "@/_lib/supabaseClient";

export const metadata = {
  title: "Campus Directory | Campus Route Finder",
  description: "Explore registered academic campuses, spatial pathway grids, and navigation networks.",
};

export default async function CampusPage() {
  const { data: campuses, error } = await supabase
    .from("campuses")
    .select("*")
    .order("name", { ascending: true });

  if (error) {
    throw new Error(`Failed to load campus directory: ${error.message}`);
  }

  return (
    <div className="relative isolate flex-1">
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,hsl(var(--border)/0.2)_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--border)/0.2)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_40%_at_50%_0%,#000_70%,transparent_100%)]" />

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <AvailableCampusesMapWrapper campuses={campuses ?? []} />
      </div>
    </div>
  );
}