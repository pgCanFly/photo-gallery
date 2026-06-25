export interface CloudinaryPhoto {
  public_id: string;
  url: string;
  created_at: string;
  isUploaded: true;
}

export function getCloudinaryConfig() {
  return {
    cloudName: process.env.CLOUDINARY_CLOUD_NAME!,
    apiKey: process.env.CLOUDINARY_API_KEY!,
    apiSecret: process.env.CLOUDINARY_API_SECRET!,
  };
}

export async function listUploadedPhotos(): Promise<CloudinaryPhoto[]> {
  const { cloudName, apiKey, apiSecret } = getCloudinaryConfig();
  const auth = Buffer.from(apiKey + ":" + apiSecret).toString("base64");

  const url = "https://api.cloudinary.com/v1_1/" + cloudName + "/resources/image/upload?prefix=photo-gallery%2F&max_results=100&type=upload";

  const res = await fetch(url, {
    headers: { Authorization: "Basic " + auth },
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error("Cloudinary API error " + res.status + ": " + text);
  }

  const data = await res.json();
  return (data.resources || []).map((r: any) => ({
    public_id: r.public_id,
    url: r.secure_url,
    created_at: r.created_at,
    isUploaded: true as const,
  }));
}

export async function deletePhoto(publicId: string): Promise<void> {
  const { cloudName, apiKey, apiSecret } = getCloudinaryConfig();
  const auth = Buffer.from(apiKey + ":" + apiSecret).toString("base64");

  const url = "https://api.cloudinary.com/v1_1/" + cloudName + "/resources/image/upload/" + publicId;

  const res = await fetch(url, {
    method: "DELETE",
    headers: {
      Authorization: "Basic " + auth,
    },
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error("Failed to delete: " + res.status + " " + text);
  }
}
