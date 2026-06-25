"use client";

import { useState, useCallback } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import { GalleryGrid } from "@/components/ui/gallery-grid";
import { galleryPhotos } from "@/data/photos";
import { Button } from "@/components/ui/button";

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export default function GalleryPage() {
  const [shuffleKey, setShuffleKey] = useState(0);
  const [shuffledPhotos, setShuffledPhotos] = useState(galleryPhotos);
  const [isAnimating, setIsAnimating] = useState(false);

  // ── Parallax scroll ──
  const { scrollY } = useScroll();
  const heroBgParallaxY = useTransform(scrollY, [0, 400], [0, -60]);
  const titleParallaxY = useTransform(scrollY, [0, 400], [0, -40]);
  const descParallaxY = useTransform(scrollY, [0, 400], [0, -20]);

  const handleShuffle = useCallback(() => {
    if (isAnimating) return;
    setIsAnimating(true);

    // Fisher-Yates shuffle
    const shuffled = shuffleArray(galleryPhotos);
    setShuffledPhotos(shuffled);
    setShuffleKey((k) => k + 1);

    // Briefly disable button while stagger animation plays
    setTimeout(() => setIsAnimating(false), 700);
  }, [isAnimating]);

  return (
    <main className="min-h-screen overflow-hidden bg-background">
      {/* ── Hero section ── */}
      <motion.div
        className="relative border-b border-border/40"
        style={{ y: heroBgParallaxY }}
      >
        <div className="mx-auto max-w-7xl px-6 pb-16 pt-24 sm:px-8 sm:pb-20 sm:pt-32">
          {/* Back link */}
          <Link
            href="/"
            className="group mb-8 inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
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
              className="transition-transform group-hover:-translate-x-1"
            >
              <path d="M19 12H5" />
              <path d="M12 19l-7-7 7-7" />
            </svg>
            Back to Home
          </Link>

          <motion.h1
            className="max-w-3xl bg-gradient-to-r from-foreground via-foreground/80 to-foreground/60 bg-clip-text text-4xl font-bold tracking-tight text-transparent sm:text-5xl md:text-6xl"
            style={{ y: titleParallaxY }}
          >
            All Stories
          </motion.h1>
          <motion.p
            className="mt-4 max-w-xl text-lg text-muted-foreground"
            style={{ y: descParallaxY }}
          >
          光影凝眸处。收纳了山川的浩荡，也记取了咫尺的温柔。
          </motion.p>

          {/* Badge + Shuffle button row */}
          <div className="mt-6 flex flex-wrap items-center gap-3">
            {/* Photo count badge */}
            <div className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-muted/50 px-4 py-1.5 text-sm font-medium text-muted-foreground">
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
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                <circle cx="8.5" cy="8.5" r="1.5" />
                <polyline points="21 15 16 10 5 21" />
              </svg>
              {galleryPhotos.length} photos
            </div>

            {/* Shuffle button */}
            <Button
              variant="outline"
              size="sm"
              onClick={handleShuffle}
              disabled={isAnimating}
              className="gap-2 transition-all"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="15"
                height="15"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className={
                  isAnimating ? "animate-spin" : "transition-transform"
                }
              >
                <polyline points="16 3 21 3 21 8" />
                <line x1="4" x2="21" y1="20" y2="3" />
                <polyline points="21 16 21 21 16 21" />
                <line x1="15" x2="21" y1="15" y2="21" />
                <line x1="4" x2="9" y1="4" y2="9" />
              </svg>
              洗牌
            </Button>
          </div>
        </div>
      </motion.div>

      {/* ── Gallery grid (key change → full remount → stagger re-animation) ── */}
      <div className="mx-auto max-w-7xl px-6 py-12 sm:px-8 sm:py-16">
        <GalleryGrid key={shuffleKey} photos={shuffledPhotos} />
      </div>
    </main>
  );
}
