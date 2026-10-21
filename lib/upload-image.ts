import { createSupabaseBrowserClient } from "@/lib/supabase-browser";

const BUCKET = "blog-images";
const MAX_DIMENSION = 2000;
const ACCEPTED = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/avif"];

export const ACCEPTED_IMAGE_TYPES = ACCEPTED.join(",");

// Downscales large photos and re-encodes them as WebP. GIFs are left alone (animation).
async function optimize(file: File): Promise<Blob> {
  if (file.type === "image/gif") return file;

  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, MAX_DIMENSION / Math.max(bitmap.width, bitmap.height));
  const width = Math.round(bitmap.width * scale);
  const height = Math.round(bitmap.height * scale);

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  canvas.getContext("2d")!.drawImage(bitmap, 0, 0, width, height);
  bitmap.close();

  const blob = await new Promise<Blob | null>((resolve) =>
    canvas.toBlob(resolve, "image/webp", 0.85)
  );
  // Keep the original if re-encoding did not help.
  return blob && blob.size < file.size ? blob : file;
}

export async function uploadImage(file: File): Promise<string> {
  if (!ACCEPTED.includes(file.type)) {
    throw new Error("Format neacceptat. Folosește JPG, PNG, WebP, GIF sau AVIF.");
  }

  const body = await optimize(file);
  if (body.size > 10 * 1024 * 1024) throw new Error("Imaginea depășește 10 MB.");

  const ext = body.type === "image/webp" ? "webp" : (file.name.split(".").pop() ?? "jpg").toLowerCase();
  const now = new Date();
  const path = `${now.getFullYear()}/${String(now.getMonth() + 1).padStart(2, "0")}/${crypto.randomUUID()}.${ext}`;

  const supabase = createSupabaseBrowserClient();
  const { error } = await supabase.storage.from(BUCKET).upload(path, body, {
    contentType: body.type || file.type,
    cacheControl: "31536000",
  });
  if (error) throw new Error(`Încărcarea a eșuat: ${error.message}`);

  return supabase.storage.from(BUCKET).getPublicUrl(path).data.publicUrl;
}
