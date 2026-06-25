"use client";

import { useState, useEffect, useCallback } from "react";

export interface UploadedPhoto {
  public_id: string;
  url: string;
  created_at: string;
  isUploaded: true;
}

export function useUploadedPhotos() {
  const [photos, setPhotos] = useState<UploadedPhoto[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPhotos = useCallback(async () => {
    try {
      const res = await fetch("/api/photos");
      if (res.ok) {
        const data = await res.json();
        setPhotos(data.photos || []);
      }
    } catch (e) {
      console.error("Failed to fetch photos:", e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPhotos();
  }, [fetchPhotos]);

  const refresh = useCallback(() => {
    setLoading(true);
    fetchPhotos();
  }, [fetchPhotos]);

  const deletePhoto = useCallback(
    async (publicId: string) => {
      try {
        const res = await fetch(`/api/photos?public_id=${encodeURIComponent(publicId)}`, {
          method: "DELETE",
        });
        if (res.ok) {
          setPhotos((prev) => prev.filter((p) => p.public_id !== publicId));
        } else {
          alert("删除失败");
        }
      } catch (e) {
        console.error("Delete error:", e);
        alert("删除失败");
      }
    },
    []
  );

  return { photos, loading, refresh, deletePhoto };
}
