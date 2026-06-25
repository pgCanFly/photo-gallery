import { NextRequest, NextResponse } from "next/server";
import { listUploadedPhotos, deletePhoto } from "@/lib/cloudinary";

/**
 * GET /api/photos – list uploaded photos from Cloudinary.
 */
export async function GET() {
  try {
    const photos = await listUploadedPhotos();
    return NextResponse.json({ photos });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Failed to fetch photos" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/photos?public_id=xxx – delete a photo.
 */
export async function DELETE(req: NextRequest) {
  const publicId = req.nextUrl.searchParams.get("public_id");

  if (!publicId) {
    return NextResponse.json(
      { error: "Missing public_id" },
      { status: 400 }
    );
  }

  try {
    await deletePhoto(publicId);
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Failed to delete photo" },
      { status: 500 }
    );
  }
}
