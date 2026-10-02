import type { ButtonHTMLAttributes } from "react";

type Variant = "primary" | "dark" | "secondary" | "ghost";
type Size = "small" | "normal" | "large" | "icon";

export default function StudioButton({ variant = "primary", size = "normal", className = "", type = "button", ...props }: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant; size?: Size }) {
  return <button type={type} className={`ph-button ph-button--${variant} ph-button--${size} ${className}`.trim()} {...props} />;
}
