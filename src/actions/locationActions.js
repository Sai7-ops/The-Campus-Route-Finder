export default async function addLocation(formData) {
  try {
    const name = formData.get("name");
    const description = formData.get("description");
    const lat = parseFloat(formData.get("lat"));
    const lng = parseFloat(formData.get("lng"));
    const campusId = formData.get("campusId");

    const payload = {
      name: name.trim(),
      description: description.trim() || null,
      lat,
      lng,
      campus_id: campusId,
    };

    if (!name || !lat || !lng) {
      return {
        success: false,
        error: "Name and valid coordinates are required.",
      };
    }

    const { data, error } = await supabase
      .from("locations")
      .insert(payload)
      .select()
      .single();

    if (error) return { success: false, error: error.message };

    return { success: true, data };
  } catch (err) {
    return {
      success: false,
      error: err.message || "Failed to create location!",
    };
  }
}
