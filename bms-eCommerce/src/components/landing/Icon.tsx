import type { CSSProperties } from "react";

/**
 * Wrapper for Lineicons (https://lineicons.com) loaded via the CDN webfont
 * in index.html. Use the Lineicons name without the "lni-" prefix.
 *
 * <Icon name="cart-1" size={24} />  →  <i class="lni lni-cart-1" style="font-size:24px" />
 */
export default function Icon({
  name,
  size = 16,
  className = "",
  style,
}: {
  name: string;
  size?: number;
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <i
      className={`lni lni-${name} ${className}`}
      style={{
        fontSize: size,
        lineHeight: 1,
        flexShrink: 0,
        ...style,
      }}
    />
  );
}
