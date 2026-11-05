"use client";

import { useState } from "react";
import { Car } from "lucide-react";
import { getOfficialCarImage } from "@/lib/official-car-images";

interface CarImageProps {
  src?: string | null;
  alt: string;
  modelSlug?: string;
  className?: string;
  showOfficialBadge?: boolean;
  priority?: boolean;
}

export function CarImage({
  src,
  alt,
  modelSlug,
  className = "w-full h-full object-contain p-2",
  showOfficialBadge = false,
  priority = false,
}: CarImageProps) {
  // Determine initial image url: passed src or official manufacturer image
  const officialSrc = modelSlug ? getOfficialCarImage(modelSlug) : undefined;
  const initialUrl = src || officialSrc;

  const [currentSrc, setCurrentSrc] = useState<string | undefined>(initialUrl);
  const [hasError, setHasError] = useState(false);

  const handleError = () => {
    // If external official CDN failed, try local mirror
    if (modelSlug && currentSrc?.startsWith("http")) {
      setCurrentSrc(`/images/cars/${modelSlug}.png`);
    } else {
      setHasError(true);
    }
  };

  if (hasError || !currentSrc) {
    return (
      <div className="w-full h-full flex items-center justify-center text-slate-300 bg-slate-100">
        <Car className="w-12 h-12" />
      </div>
    );
  }

  return (
    <div className="relative w-full h-full overflow-hidden bg-slate-100/70 flex items-center justify-center">
      <img
        src={currentSrc}
        alt={alt}
        className={`${className} transition-transform duration-300 group-hover:scale-105`}
        loading={priority ? "eager" : "lazy"}
        referrerPolicy="no-referrer"
        onError={handleError}
      />
      {showOfficialBadge && (
        <span className="absolute bottom-2 left-2 px-2 py-0.5 text-[10px] font-bold rounded bg-slate-900/75 text-white backdrop-blur-xs">
          제조사 공식
        </span>
      )}
    </div>
  );
}
