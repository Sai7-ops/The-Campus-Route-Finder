import CampusNetworkWrapper from "@/_components/CampusNetworkWrapper";
import {
  fetchCampus,
  fetchLocations,
  fetchPathways,
} from "@/actions/campusActions";

export default async function CampusNetwork({ params }) {
    const { campusId } = await params;

    const [campus, locations, pathways] = await Promise.all([
      fetchCampus(campusId),
      fetchLocations(campusId),
      fetchPathways(campusId),
    ]);
    
    if (!campus.success) {
      console.error("Failed to load campus details:", campus.error);
    }
    if (!locations.success) {
      console.error("Failed to load locations:", locations.error);
    }
    if (!pathways.success) {
      console.error("Failed to load pathways:", pathways.error);
    }

  return (
    <div>
      <h1>Display Campus Network</h1>
      <CampusNetworkWrapper
        campus={campus?.data ?? null}
        locations={locations?.data ?? null}
        pathways={pathways?.data ?? null}
      />
    </div>
  );
}
