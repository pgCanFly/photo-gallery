"use client";

import { Ref, forwardRef, useState, useEffect } from "react";
import Image, { ImageProps } from "next/image";
import { motion, useMotionValue, AnimatePresence, useScroll, useTransform } from "framer-motion";
import Link from "next/link";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Lightbox } from "@/components/ui/lightbox";
import { useUploadedPhotos } from "@/hooks/uploaded-photos";
import { UploadButton } from "@/components/upload-button";

export const PhotoGallery = ({
  animationDelay = 0.5,
}: {
  animationDelay?: number;
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  // ── Parallax scroll ──
  const { scrollY } = useScroll();
  const gridParallaxY = useTransform(scrollY, [0, 600], [0, 80]);
  const subtitleParallaxY = useTransform(scrollY, [0, 600], [0, -50]);
  const titleParallaxY = useTransform(scrollY, [0, 600], [0, -70]);
  const photosParallaxY = useTransform(scrollY, [0, 600], [0, -120]);

  // ── Uploaded photos ──
  const { photos: uploadedPhotos, refresh } = useUploadedPhotos();

  // Dynamic fan: static 5 photos + uploaded photos
  const staticPhotos = [
    { id: 1, order: 0, x: "-320px", y: "15px", zIndex: 50, direction: "left" as Direction, src: "https://images.pexels.com/photos/32025694/pexels-photo-32025694/free-photo-of-romantic-wedding-in-ancient-ruins.jpeg", alt: "Romantic wedding in ancient ruins" },
    { id: 2, order: 1, x: "-160px", y: "32px", zIndex: 40, direction: "left" as Direction, src: "https://images.pexels.com/photos/31596551/pexels-photo-31596551/free-photo-of-winter-scene-with-lake-view-in-van-turkiye.jpeg", alt: "Winter scene with lake view in Van" },
    { id: 3, order: 2, x: "0px", y: "8px", zIndex: 30, direction: "right" as Direction, src: "https://images.pexels.com/photos/31890053/pexels-photo-31890053/free-photo-of-moody-portrait-with-heart-shaped-light.jpeg", alt: "Moody portrait with heart-shaped light" },
    { id: 4, order: 3, x: "160px", y: "22px", zIndex: 20, direction: "right" as Direction, src: "https://images.pexels.com/photos/19936068/pexels-photo-19936068/free-photo-of-women-sitting-on-hilltop-with-clouds-below.jpeg", alt: "Women sitting on hilltop with clouds below" },
    { id: 5, order: 4, x: "320px", y: "44px", zIndex: 10, direction: "left" as Direction, src: "https://images.pexels.com/photos/20494995/pexels-photo-20494995/free-photo-of-head-of-peacock.jpeg", alt: "Head of peacock" },
  ];

  // Generate positions for uploaded photos extending to the right
  const uploadedFanPhotos = uploadedPhotos.map((up, i) => ({
    id: 100 + i,
    order: 5 + i,
    x: `${480 + i * 160}px`,
    y: `${10 + (i % 3) * 15}px`,
    zIndex: 5 - i,
    direction: (i % 2 === 0 ? "left" : "right") as Direction,
    src: up.url,
    alt: `Uploaded photo ${i + 1}`,
  }));

  const allPhotos = [...staticPhotos, ...uploadedFanPhotos];
  // Calculate needed container width: static = 640px + uploaded = N*160px + padding
  const fanWidth = uploadedFanPhotos.length > 0
    ? Math.max(640, 640 + uploadedFanPhotos.length * 160 + 80)
    : 640;

  useEffect(() => {
    // First make the container visible with a fade-in
    const visibilityTimer = setTimeout(() => {
      setIsVisible(true);
    }, animationDelay * 1000);

    // Then start the photo animations after a short delay
    const animationTimer = setTimeout(
      () => {
        setIsLoaded(true);
      },
      (animationDelay + 0.4) * 1000
    ); // Add 0.4s for the opacity transition

    return () => {
      clearTimeout(visibilityTimer);
      clearTimeout(animationTimer);
    };
  }, [animationDelay]);

  // Animation variants for the container
  const containerVariants = {
    hidden: { opacity: 1 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1, // Reduced from 0.3 to 0.1 since we already have the fade-in delay
      },
    },
  };

  // Animation variants for each photo
  const photoVariants = {
    hidden: () => ({
      x: 0,
      y: 0,
      rotate: 0,
      scale: 1,
      // Keep the same z-index throughout animation
    }),
    visible: (custom: { x: any; y: any; order: number }) => ({
      x: custom.x,
      y: custom.y,
      rotate: 0, // No rotation
      scale: 1,
      transition: {
        type: "spring" as const,
        stiffness: 70,
        damping: 12,
        mass: 1,
        delay: custom.order * 0.15, // Explicit delay based on order
      },
    }),
  };

  return (
    <div className="mt-40 relative">
      <motion.div
        className="absolute inset-0 max-md:hidden top-[200px] -z-10 h-[300px] w-full bg-transparent bg-[linear-gradient(to_right,#57534e_1px,transparent_1px),linear-gradient(to_bottom,#57534e_1px,transparent_1px)] bg-[size:3rem_3rem] opacity-20 [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)] dark:bg-[linear-gradient(to_right,#a8a29e_1px,transparent_1px),linear-gradient(to_bottom,#a8a29e_1px,transparent_1px)]"
        style={{ y: gridParallaxY }}
      ></motion.div>
      <motion.p
        className="lg:text-md my-2 text-center text-xs font-light uppercase tracking-widest text-slate-600 dark:text-slate-400"
        style={{ y: subtitleParallaxY }}
      >
        A Journey Through Visual Stories
      </motion.p>
      <motion.h3
        className="z-20 mx-auto max-w-2xl justify-center bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 bg-clip-text py-3 text-center text-4xl text-transparent dark:bg-gradient-to-r dark:from-slate-100 dark:via-slate-200 dark:to-slate-100 dark:bg-clip-text md:text-7xl"
        style={{ y: titleParallaxY }}
      >
        Welcome to My <span className="text-rose-500"> Stories</span>
      </motion.h3>
      <motion.div
        className="relative mb-8 h-[350px] w-full items-center justify-center lg:flex"
        style={{ y: photosParallaxY }}
      >
        <motion.div
          className="relative mx-auto flex w-full max-w-7xl justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: isVisible ? 1 : 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        >
          <motion.div
            className="relative flex w-full justify-center"
            variants={containerVariants}
            initial="hidden"
            animate={isLoaded ? "visible" : "hidden"}
          >
            <div
              className="relative"
              style={{ width: fanWidth, height: 220 }}
            >
              {/* Render photos in reverse order so that higher z-index photos are rendered later in the DOM */}
              {[...allPhotos].reverse().map((photo) => (
                <motion.div
                  key={photo.id}
                  className="absolute left-0 top-0"
                  style={{ zIndex: photo.zIndex }} // Apply z-index directly in style
                  variants={photoVariants}
                  custom={{
                    x: photo.x,
                    y: photo.y,
                    order: photo.order,
                  }}
                >
                  <Photo
                    width={220}
                    height={220}
                    src={photo.src}
                    alt={photo.alt}
                    direction={photo.direction}
                    onClick={() => setSelectedIndex(photo.order)}
                  />
                </motion.div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </motion.div>
      <div className="flex w-full justify-center">
        <Link href="/gallery">
          <Button>
            View All Stories ✦
          </Button>
        </Link>
      </div>
      <AnimatePresence>
        {selectedIndex !== null && (
          <Lightbox
            photos={allPhotos}
            currentIndex={selectedIndex}
            onClose={() => setSelectedIndex(null)}
            onPrev={() =>
              setSelectedIndex((prev) =>
                prev !== null && prev > 0 ? prev - 1 : prev
              )
            }
            onNext={() =>
              setSelectedIndex((prev) =>
                prev !== null && prev < allPhotos.length - 1 ? prev + 1 : prev
              )
            }
          />
        )}
      </AnimatePresence>
      <UploadButton onUploadComplete={refresh} />
    </div>
  );
};

function getRandomNumberInRange(min: number, max: number): number {
  if (min >= max) {
    throw new Error("Min value should be less than max value");
  }
  return Math.random() * (max - min) + min;
}

const MotionImage = motion(
  forwardRef(function MotionImage(
    props: ImageProps,
    ref: Ref<HTMLImageElement>
  ) {
    return <Image ref={ref} {...props} />;
  })
);

type Direction = "left" | "right";

export const Photo = ({
  src,
  alt,
  className,
  direction,
  width,
  height,
  onClick,
  ...props
}: {
  src: string;
  alt: string;
  className?: string;
  direction?: Direction;
  width: number;
  height: number;
  onClick?: () => void;
}) => {
  const [rotation, setRotation] = useState<number>(0);
  const x = useMotionValue(200);
  const y = useMotionValue(200);

  useEffect(() => {
    const randomRotation =
      getRandomNumberInRange(1, 4) * (direction === "left" ? -1 : 1);
    setRotation(randomRotation);
  }, []);

  function handleMouse(event: {
    currentTarget: { getBoundingClientRect: () => any };
    clientX: number;
    clientY: number;
  }) {
    const rect = event.currentTarget.getBoundingClientRect();
    x.set(event.clientX - rect.left);
    y.set(event.clientY - rect.top);
  }

  const resetMouse = () => {
    x.set(200);
    y.set(200);
  };

  return (
    <motion.div
      drag
      dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
      whileTap={{ scale: 1.2, zIndex: 9999 }}
      whileHover={{
        scale: 1.1,
        rotateZ: 2 * (direction === "left" ? -1 : 1),
        zIndex: 9999,
      }}
      whileDrag={{
        scale: 1.1,
        zIndex: 9999,
      }}
      initial={{ rotate: 0 }}
      animate={{ rotate: rotation }}
      style={{
        width,
        height,
        perspective: 400,
        transform: `rotate(0deg) rotateX(0deg) rotateY(0deg)`,
        zIndex: 1,
        WebkitTouchCallout: "none",
        WebkitUserSelect: "none",
        userSelect: "none",
        touchAction: "none",
      }}
      className={cn(
        className,
        "relative mx-auto shrink-0 cursor-grab active:cursor-grabbing"
      )}
      onMouseMove={handleMouse}
      onMouseLeave={resetMouse}
      onTap={onClick}
      draggable={false}
      tabIndex={0}
    >
      <div className="relative h-full w-full overflow-hidden rounded-3xl shadow-sm">
        <MotionImage
          className={cn("rounded-3xl  object-cover")}
          fill
          src={src}
          alt={alt}
          {...props}
          draggable={false}
        />
      </div>
    </motion.div>
  );
};
