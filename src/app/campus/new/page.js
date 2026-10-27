import CampusSearchBar from "@/_components/CampusSearchBar";
import { addCampus } from "@/actions/campusActions";

export default function NewCampus(){
    return(
        <div>
            <h1>Add New Campus</h1>
            <CampusSearchBar addCampus={addCampus}/>
        </div>
    )
}