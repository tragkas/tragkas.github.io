"use client";

import React, { useState } from "react";
import { ImageOff } from "lucide-react";

interface SmartMediaProps {
  src?: string;
  alt: string;
  className?: string;
  fallbackTitle?: string;
  priority?: boolean;
}

export default function SmartMedia({
  src,
  alt,
  className = "w-full h-full object-cover",
  fallbackTitle,
  priority = false,
}: SmartMediaProps) {
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    return (
      <div
        className="w-full h-full min-h-[160px] bg-neutral-100 border border-neutral-200 flex flex-col items-center justify-center p-6 text-center text-neutral-500"
        role="img"
        aria-label={alt}
      >
        <ImageOff className="w-5 h-5 mb-2 text-neutral-400" aria-hidden="true" />
        <span className="text-xs font-medium text-neutral-600 line-clamp-2">
          {fallbackTitle || alt}
        </span>
      </div>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      referrerPolicy="no-referrer"
      loading={priority ? "eager" : "lazy"}
      onError={() => setFailed(true)}
      className={className}
    />
  );
}
