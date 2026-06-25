"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

import { type GalleryPhoto } from "@/data/photos";
import { Lightbox } from "@/components/ui/lightbox";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export interface GridPhoto extends GalleryPhoto {
  public_id?: string;
  isUploaded?: boolean;
}

interface GalleryGridProps {
  photos: GridPhoto[];
  onDeletePhoto?: (publicId: string) => void;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.06,
      delayChildren: 0.15,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring" as const,
      stiffness: 100,
      damping: 18,
    },
  },
};

export function GalleryGrid({ photos, onDeletePhoto }: GalleryGridProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [loadedImages, setLoadedImages] = useState<Record<number, boolean>>({});

  const handleImageLoad = (id: number) => {
    setLoadedImages((prev) => ({ ...prev, [id]: true }));
  };

  return (
    <>
      <motion.div
        className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {photos.map((photo, index) => (
          <motion.div
            key={photo.id}
            variants={cardVariants}
            className="group relative aspect-[4/3] cursor-pointer overflow-hidden rounded-2xl shadow-sm transition-shadow duration-300 hover:shadow-xl"
            onClick={() => setSelectedIndex(index)}
          >
            {/* Skeleton placeholder */}
            {!loadedImages[photo.id] && (
              <Skeleton className="absolute inset-0 h-full w-full rounded-2xl" />
            )}

            {/* Image */}
            <Image
              src={photo.src}
              alt={photo.alt}
              fill
              className={cn(
                "object-cover transition-all duration-500 group-hover:scale-110",
                loadedImages[photo.id] ? "opacity-100" : "opacity-0"
              )}
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
              onLoad={() => handleImageLoad(photo.id)}
            />

            {/* Delete button — only for uploaded photos */}
            {photo.isUploaded && photo.public_id && onDeletePhoto && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (confirm("确定删除这张照片？")) {
                    onDeletePhoto(photo.public_id!);
                  }
                }}
                className="absolute right-2 top-2 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-black/40 text-white/80 transition-all duration-200 hover:bg-red-500 hover:text-white"
                aria-label="删除照片"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="3 6 5 6 21 6" />
                  <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
                </svg>
              </button>
            )}

            {/* Hover overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100">
              <div className="absolute bottom-0 left-0 right-0 p-5">
                <h3 className="text-lg font-semibold text-white">
                  {photo.title}
                </h3>
                <p className="mt-1 text-sm text-white/70">{photo.alt}</p>
              </div>
            </div>

            {/* Subtle bottom gradient */}
            <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-black/30 to-transparent" />
          </motion.div>
        ))}
      </motion.div>

      {/* Lightbox */}
      <AnimatePresence>
        {selectedIndex !== null && (
          <Lightbox
            photos={photos}
            currentIndex={selectedIndex}
            onClose={() => setSelectedIndex(null)}
            onPrev={() =>
              setSelectedIndex((prev) =>
                prev !== null && prev > 0 ? prev - 1 : prev
              )
            }
            onNext={() =>
              setSelectedIndex((prev) =>
                prev !== null && prev < photos.length - 1 ? prev + 1 : prev
              )
            }
          />
        )}
      </AnimatePresence>
    </>
  );
}
