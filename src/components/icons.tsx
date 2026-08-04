import type { ReactNode, SVGProps } from "react";
import type { IconName } from "@/data/services";

export function PawIcon({ className = "", ...props }: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 64 64" fill="currentColor" className={className} aria-hidden {...props}>
      <ellipse cx="20" cy="20" rx="7.5" ry="9.5" transform="rotate(-18 20 20)" />
      <ellipse cx="32" cy="14.5" rx="7" ry="9.5" />
      <ellipse cx="44" cy="20" rx="7.5" ry="9.5" transform="rotate(18 44 20)" />
      <ellipse cx="52" cy="33" rx="6.5" ry="8" transform="rotate(32 52 33)" />
      <path d="M32 28c8.5 0 15.5 6.4 15.5 13.6 0 6.2-4.8 9.9-11.2 9.9-2.1 0-3.1.7-4.3.7s-2.2-.7-4.3-.7c-6.4 0-11.2-3.7-11.2-9.9C16.5 34.4 23.5 28 32 28Z" />
    </svg>
  );
}

export function CatIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" fill="none" className={className} aria-hidden>
      <path
        d="M14 30c0-9 8-16 18-16s18 7 18 16v6c0 8-8 14-18 14s-18-6-18-14v-6Z"
        fill="currentColor"
        opacity=".18"
      />
      <path d="M16 22 13 8l12 7M48 22l3-14-12 7" stroke="currentColor" strokeWidth="3" strokeLinejoin="round" />
      <circle cx="25" cy="31" r="2.6" fill="currentColor" />
      <circle cx="39" cy="31" r="2.6" fill="currentColor" />
      <path
        d="M32 37.5c-1.6 0-2.6 1-2.6 2.2 0 1.5 1.5 2.6 2.6 2.6s2.6-1.1 2.6-2.6c0-1.2-1-2.2-2.6-2.2Z"
        fill="currentColor"
      />
      <path d="M8 34h12M8 40h12M44 34h12M44 40h12" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
    </svg>
  );
}

export function StarIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="m12 2 2.9 6.1 6.6.9-4.8 4.6 1.2 6.6L12 17.1 6.1 20.2l1.2-6.6L2.5 9l6.6-.9L12 2Z" />
    </svg>
  );
}

export function WhatsAppIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M17.47 14.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.48-.89-.79-1.49-1.76-1.66-2.06-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.61-.92-2.2-.24-.58-.48-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48s1.06 2.88 1.21 3.08c.15.2 2.1 3.2 5.08 4.49.71.3 1.26.49 1.69.63.71.22 1.36.19 1.87.12.57-.09 1.76-.72 2.01-1.41.25-.7.25-1.29.17-1.42-.07-.13-.27-.2-.57-.35Z" />
      <path d="M12.04 2C6.6 2 2.18 6.42 2.18 11.86c0 1.74.46 3.44 1.32 4.93L2 22l5.35-1.4a9.8 9.8 0 0 0 4.69 1.19h.01c5.43 0 9.85-4.42 9.85-9.86A9.79 9.79 0 0 0 19 4.9 9.8 9.8 0 0 0 12.04 2Zm0 17.94h-.01a8.2 8.2 0 0 1-4.17-1.14l-.3-.18-3.1.81.83-3.02-.2-.31a8.15 8.15 0 0 1-1.25-4.35c0-4.51 3.68-8.19 8.2-8.19a8.15 8.15 0 0 1 8.19 8.2c0 4.51-3.68 8.18-8.19 8.18Z" />
    </svg>
  );
}

const iconPaths: Record<IconName, ReactNode> = {
  stethoscope: (
    <>
      <path d="M6 3v6a6 6 0 0 0 12 0V3" strokeWidth="2" />
      <path d="M4 3h4M16 3h4M12 15v2a5 5 0 0 0 10 0v-1" strokeWidth="2" />
      <circle cx="22" cy="13" r="2.5" strokeWidth="2" />
    </>
  ),
  syringe: (
    <>
      <path d="M3 21l4-4M8 16l-3 3M14 4l6 6M17 3l4 4M11 7l6 6-6 6-4-1-1-4 5-6Z" strokeWidth="2" />
    </>
  ),
  scalpel: (
    <>
      <path d="M4 20l7-7M20 4l-9 9 5 1 4-4V4h-4Z" strokeWidth="2" />
      <path d="M4 20l3 1" strokeWidth="2" />
    </>
  ),
  microscope: (
    <>
      <path d="M6 20h14M9 20a7 7 0 0 0 9-6.7M10 4h4l1 8h-6l1-8ZM12 12v4M9 16h6" strokeWidth="2" />
    </>
  ),
  xray: (
    <>
      <rect x="3" y="3" width="18" height="18" rx="4" strokeWidth="2" />
      <path d="M8 8c2 3 6 3 8 0M8 16c2-3 6-3 8 0M12 8v8" strokeWidth="2" />
    </>
  ),
  tooth: (
    <>
      <path d="M7 3c2 0 2.5 1 5 1s3-1 5-1c2 0 3 2 3 5 0 4-1.5 5-2 9-.4 3-1 5-2.5 5S13 18 12 18s-1.5 4-3 4-2.1-2-2.5-5c-.5-4-2-5-2-9 0-3 1-5 2.5-5Z" strokeWidth="2" />
    </>
  ),
  scissors: (
    <>
      <circle cx="6" cy="6" r="3" strokeWidth="2" />
      <circle cx="6" cy="18" r="3" strokeWidth="2" />
      <path d="M20 4 8.5 15.5M20 20 8.5 8.5" strokeWidth="2" />
    </>
  ),
  chip: (
    <>
      <rect x="7" y="7" width="10" height="10" rx="2" strokeWidth="2" />
      <path d="M10 3v4M14 3v4M10 17v4M14 17v4M3 10h4M3 14h4M17 10h4M17 14h4" strokeWidth="2" />
    </>
  ),
  heart: (
    <>
      <path d="M12 20s-7-4.4-7-9.4A4.6 4.6 0 0 1 12 7a4.6 4.6 0 0 1 7 3.6C19 15.6 12 20 12 20Z" strokeWidth="2" />
      <path d="M6 13h3l1.5-2.5L12 15l1.5-2h4" strokeWidth="1.6" />
    </>
  ),
  bird: (
    <>
      <path d="M14 5a3 3 0 1 1 5 2c0 1.5-1 2-1 3.5 0 4.5-3.5 8.5-8 8.5H5c2-2 2.5-4 2.5-6.5A7 7 0 0 1 14 5Z" strokeWidth="2" />
      <path d="M19 7h2M12 19l-2 2M15 18l-1 3" strokeWidth="2" />
    </>
  ),
  ambulance: (
    <>
      <path d="M3 16V7h11v9M14 10h4l3 3v3h-2" strokeWidth="2" />
      <circle cx="7" cy="17" r="2" strokeWidth="2" />
      <circle cx="17" cy="17" r="2" strokeWidth="2" />
      <path d="M8 9v4M6 11h4" strokeWidth="2" />
    </>
  ),
  home: (
    <>
      <path d="M4 11 12 4l8 7v8a1 1 0 0 1-1 1h-4v-6H9v6H5a1 1 0 0 1-1-1v-8Z" strokeWidth="2" />
    </>
  ),
};

export function ServiceIcon({ name, className = "" }: { name: IconName; className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      {iconPaths[name]}
    </svg>
  );
}
