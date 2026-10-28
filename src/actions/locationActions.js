"use server";

import { supabase } from "@/_lib/supabaseClient";
import { revalidatePath } from "next/cache";

export default async function addLocation(formData) {
  try {
    const name = formData.get("name").trim();
    const description = formData.get("description").trim() || null;
    const lat = parseFloat(formData.get("lat"));
    const lng = parseFloat(formData.get("lng"));
    const campus_id = formData.get("campusId");

    if (!name || !lat || !lng) {
      return {
        success: false,
        error: "Name and valid coordinates are required.",
      };
    }

    const { data, error } = await supabase
      .from("locations")
      .insert([{ name, description, lat, lng, campus_id }])
      .select()
      .single();

    if (error) return { success: false, error: error.message };

    revalidatePath(`/campus/${campus_id}`, "layout");
    return { success: true, data };
  } catch (err) {
    return {
      success: false,
      error: err.message || "Failed to create location!",
    };
  }
}
