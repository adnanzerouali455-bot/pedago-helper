import Image from "next/image";

interface LogoSymbolProps {
  className?: string;
  src?: string;
}

export default function LogoSymbol({ className = "", src = "/pedago-helper-logo.jpeg" }: LogoSymbolProps) {
  return <span aria-hidden="true" className={`ph-logo-symbol ${className}`}>
    <Image src={src} alt="" width={256} height={256} preload className="ph-logo-symbol-image" />
  </span>;
}
