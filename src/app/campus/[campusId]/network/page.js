import CampusNetworkWrapper from "@/_components/CampusNetworkWrapper";
import {
  fetchCampus,
  fetchLocations,
  fetchPathways,
} from "@/actions/campusActions";

export default async function CampusNetwork({ params }) {
  try {
    const { campusId } = await params;

    const [campus, locations, pathways] = await Promise.all([
      fetchCampus(campusId),
      fetchLocations(campusId),
      fetchPathways(campusId),
    ]);

    if (!campus.success) {
      console.error("Failed to load campus details:", campusRes.error);
    }
    if (!locations.success) {
      console.error("Failed to load locations:", locationsRes.error);
    }
    if (!pathways.success) {
      console.error("Failed to load pathways:", pathwaysRes.error);
    }
  } catch (err) {
    console.error("Failed to load campus network:", error);
    throw new Error("Campus Network display Error:", err.message);
  }

  return (
    <div>
      <h1>Display Campus Network</h1>
      <CampusNetworkWrapper
        campus={campus}
        locations={locations}
        pathways={pathways}
      />
    </div>
  );
}
