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

export async function listUploadedPhotos() {
  const { cloudName, apiKey, apiSecret } = getCloudinaryConfig();
  const body = JSON.stringify({
    expression: "resource_type:image",
    max_results: 100,
    sort_by: [{created_at: "desc"}],
  });
  const ba = Buffer.from(apiKey + ":" + apiSecret).toString("base64");
  const url = "https://api.cloudinary.com/v1_1/" + cloudName + "/resources/search";
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Basic " + ba,
    },
    body,
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error("Search API error " + res.status + ": " + text);
  }
  const data = await res.json();
  return (data.resources || []).map((r: any) => ({
    public_id: r.public_id,
    url: r.secure_url,
    created_at: r.created_at,
    isUploaded: true,
  }));
}

export async function deletePhoto(publicId: string) {
  const { cloudName, apiKey, apiSecret } = getCloudinaryConfig();
  const url = "https://api.cloudinary.com/v1_1/" + cloudName + "/image/destroy";
  const formData = new URLSearchParams();
  formData.append("public_id", publicId);
  formData.append("api_key", apiKey);
  formData.append("api_secret", apiSecret);
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: formData.toString(),
  });
  const data = await res.json();
  if (data.result !== "ok") {
    throw new Error("Failed to delete: " + JSON.stringify(data));
  }
}
