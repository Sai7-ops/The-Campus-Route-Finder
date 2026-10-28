"use server";

import { supabase } from "@/_lib/supabaseClient";
import { revalidatePath } from "next/cache";

export async function addCampus(campusData) {
  let createdData = null;
  try {
    const { name, lng, lat, state, district, address } = campusData;

    if (!name || !lat || !lng)
      return {
        success: false,
        error: "Campus name, latitude, and longitude are required.",
      };

    const { data, error } = await supabase
      .from("campuses")
      .insert({
        name: name.trim(),
        lat: parseFloat(lat),
        lng: parseFloat(lng),
        address: address || null,
        district: district || null,
        state: state || null,
      })
      .select()
      .single();

    createdData = data;

    if (error) {
      console.error("Supabase insert error (campuses):", error.message);
      return { success: false, error: error.message };
    }
  } catch (err) {
    console.error("Unexpected error in addCampus:", err);
    return { success: false, error: "Internal server error." };
  }
  revalidatePath("/campus");
  return { success: true, createdData };
}

export async function fetchCampus(campusId) {
  try {
    const { data, error } = await supabase
      .from("campuses")
      .select("id, name, lat, lng, address")
      .eq("id", campusId)
      .single();

    if (error) return { success: false, error: error.message, data: null };
    return { success: true, data };
  } catch (err) {
    return { success: false, error: err.message, data: null };
  }
}

export async function fetchLocations(campusId) {
  try {
    const { data, error } = await supabase
      .from("locations")
      .select("id, name, lat, lng, description")
      .eq("campus_id", campusId);

    if (error) return { success: false, error: error.message, data: null };
    return { success: true, data };
  } catch (err) {
    return { success: false, error: err.message, data: null };
  }
}

export async function fetchPathways(campusId) {
  try {
    const { data, error } = await supabase
      .from("pathways")
      .select("id, location1_id, location2_id, distance_m, is_blocked, tags, cautions, description, coordinates")
      .eq("campus_id", campusId);

    if (error) return { success: false, error: error.message, data: null };
    return { success: true, data };
  } catch (err) {
    return { success: false, error: err.message, data: null };
  }
}
