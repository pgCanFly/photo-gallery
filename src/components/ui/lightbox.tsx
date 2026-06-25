"use client";

import { useEffect, useCallback } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

interface LightboxPhoto {
  src: string;
  alt: string;
}

interface LightboxProps {
  photos: LightboxPhoto[];
  currentIndex: number;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}

export function Lightbox({
  photos,
  currentIndex,
  onClose,
  onPrev,
  onNext,
}: LightboxProps) {
  const current = photos[currentIndex];
  const total = photos.length;
  const isFirst = currentIndex === 0;
  const isLast = currentIndex === total - 1;

  // ── Keyboard events ──
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      switch (e.key) {
        case "Escape":
          onClose();
          break;
        case "ArrowLeft":
          if (!isFirst) onPrev();
          break;
        case "ArrowRight":
          if (!isLast) onNext();
          break;
      }
    },
    [onClose, onPrev, onNext, isFirst, isLast]
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    // Lock body scroll
    document.body.classList.add("lightbox-open");
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.classList.remove("lightbox-open");
    };
  }, [handleKeyDown]);

  // ── Click on backdrop to close ──
  const handleBackdropClick = (e: React.MouseEvent) => {
    // Only close when clicking the backdrop itself, not the image/arrows
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25, ease: "easeInOut" }}
      onClick={handleBackdropClick}
    >
      {/* ── Close button ── */}
      <button
        onClick={onClose}
        className="absolute right-5 top-5 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white/70 transition-colors hover:bg-white/20 hover:text-white"
        aria-label="Close lightbox"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="22"
          height="22"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>

      {/* ── Counter ── */}
      <div className="absolute left-5 top-5 z-10 rounded-full bg-white/10 px-3 py-1 text-sm font-medium text-white/80">
        {currentIndex + 1} / {total}
      </div>

      {/* ── Prev arrow ── */}
      {!isFirst && (
        <button
          onClick={onPrev}
          className="absolute left-4 z-10 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white/70 transition-colors hover:bg-white/20 hover:text-white max-sm:left-2 max-sm:h-10 max-sm:w-10"
          aria-label="Previous photo"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>
      )}

      {/* ── Next arrow ── */}
      {!isLast && (
        <button
          onClick={onNext}
          className="absolute right-4 z-10 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white/70 transition-colors hover:bg-white/20 hover:text-white max-sm:right-2 max-sm:h-10 max-sm:w-10"
          aria-label="Next photo"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M9 18l6-6-6-6" />
          </svg>
        </button>
      )}

      {/* ── Image with animation ── */}
      <div
        className="flex h-full w-full items-center justify-center p-16 max-sm:p-8"
        onClick={handleBackdropClick}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            className="relative h-full max-h-[85vh] w-full max-w-5xl"
            initial={{ opacity: 0, scale: 0.9, x: 80 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.9, x: -80 }}
            transition={{
              type: "spring",
              stiffness: 260,
              damping: 24,
            }}
          >
            <Image
              src={current.src}
              alt={current.alt}
              fill
              className="rounded-xl object-contain"
              sizes="(max-width: 768px) 100vw, 80vw"
              draggable={false}
              priority
            />
          </motion.div>
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
