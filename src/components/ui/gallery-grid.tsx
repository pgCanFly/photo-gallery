"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

import { type GalleryPhoto } from "@/data/photos";
import { Lightbox } from "@/components/ui/lightbox";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface GalleryGridProps {
  photos: GalleryPhoto[];
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

export function GalleryGrid({ photos }: GalleryGridProps) {
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
            {/* Skeleton placeholder — visible while image loads */}
            {!loadedImages[photo.id] && (
              <Skeleton className="absolute inset-0 h-full w-full rounded-2xl" />
            )}

            {/* Image — fades in once loaded */}
            <Image
              src={photo.src}
              alt={photo.alt}
              fill
              className={cn(
                "object-cover transition-all duration-500 group-hover:scale-110",
                loadedImages[photo.id]
                  ? "opacity-100"
                  : "opacity-0"
              )}
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
              onLoad={() => handleImageLoad(photo.id)}
            />

            {/* Hover overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100">
              <div className="absolute bottom-0 left-0 right-0 p-5">
                <h3 className="text-lg font-semibold text-white">
                  {photo.title}
                </h3>
                <p className="mt-1 text-sm text-white/70">{photo.alt}</p>
              </div>
            </div>

            {/* Subtle bottom gradient (always visible) */}
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
