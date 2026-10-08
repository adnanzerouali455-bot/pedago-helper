import type { ReactNode } from "react";
import Image from "next/image";
import LogoSymbol from "./LogoSymbol";

export default function BrandMark({ src, subtitle }: { src?: string; subtitle?: ReactNode }) {
  return <span className="ph-brand">
    {src ? <LogoSymbol src={src} className="ph-brand-icon" /> : <svg className="ph-brand-icon" viewBox="0 0 96 76" fill="none" aria-hidden="true">
      <path d="M8 24V66H31C31 47 37 33 48 29C59 33 65 47 65 66H88V24" stroke="currentColor" strokeWidth="8" strokeLinejoin="miter" />
      <path d="M16 39V9C31 7 43 13 48 27C53 13 65 7 80 9V39" stroke="currentColor" strokeWidth="8" strokeLinejoin="miter" />
      <path d="M17 57C21 38 33 31 48 37C63 31 75 38 79 57M25 46C34 45 42 49 48 57C54 49 62 45 71 46M48 28V66" stroke="currentColor" strokeWidth="8" strokeLinejoin="miter" />
    </svg>}
    <span className="ph-brand-copy">
      {src ? <span className="ph-brand-wordmark" aria-hidden="true"><Image src={src} alt="" width={256} height={256} className="ph-brand-wordmark-image" /></span> : <span className="ph-brand-name"><strong>Pedago</strong> <span>Helper</span></span>}
      {subtitle && <small>{subtitle}</small>}
    </span>
  </span>;
}
