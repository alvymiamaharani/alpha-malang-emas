// File: lib/supabase/storage.js
import { supabase } from "./client";

export async function supabaseUpload(file, path) {
  const bucket = "malang-emas";
  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(path, file, { cacheControl: "3600", upsert: true });

  if (error) throw error;

  const { data: urlData } = supabase.storage
    .from(bucket)
    .getPublicUrl(data.path);

  return urlData.publicUrl;
}

export async function supabaseDeleteByUrl(image_url) {
  try {
    if (!image_url) return;

    const bucket = "malang-emas";
    // Ekstrak path dari image_url
    const path = image_url.split(`/storage/v1/object/public/${bucket}/`)[1];
    if (!path) {
      throw new Error("Invalid image URL or path");
    }

    const { error } = await supabase.storage.from(bucket).remove([path]);

    if (error) {
      console.error("Error deleting file:", error);
      throw error;
    }
  } catch (error) {
    console.error("Error in supabaseDeleteByUrl:", error);
    throw error;
  }
}
