// Apple-style "genie" / fly-to-cart animation.
// Clones the source image and animates it along a curved arc to the cart icon
// (any element with `data-cart-target`), then bounces the cart on arrival.
export function flyToCart(source: HTMLElement | HTMLImageElement | null) {
  if (!source) return;
  const target = document.querySelector<HTMLElement>("[data-cart-target]");
  if (!target) return;

  const sourceImg =
    source.tagName === "IMG"
      ? (source as HTMLImageElement)
      : (source.querySelector("img") as HTMLImageElement | null);
  if (!sourceImg) return;

  const srcRect = sourceImg.getBoundingClientRect();
  const tgtRect = target.getBoundingClientRect();

  const clone = sourceImg.cloneNode(true) as HTMLImageElement;
  Object.assign(clone.style, {
    position: "fixed",
    left: `${srcRect.left}px`,
    top: `${srcRect.top}px`,
    width: `${srcRect.width}px`,
    height: `${srcRect.height}px`,
    margin: "0",
    objectFit: "cover",
    borderRadius: "12px",
    boxShadow: "0 12px 32px rgba(2,77,143,0.35)",
    zIndex: "9999",
    pointerEvents: "none",
    willChange: "transform, opacity, border-radius",
  } as Partial<CSSStyleDeclaration>);
  document.body.appendChild(clone);

  const sx = srcRect.left + srcRect.width / 2;
  const sy = srcRect.top + srcRect.height / 2;
  const tx = tgtRect.left + tgtRect.width / 2;
  const ty = tgtRect.top + tgtRect.height / 2;

  const dx = tx - sx;
  const dy = ty - sy;

  // Arc apex: rise above the higher of the two points before swooping in.
  const apexY = Math.min(sy, ty) - Math.max(120, Math.abs(dy) * 0.5) - sy;
  const apexX = dx * 0.55;

  const anim = clone.animate(
    [
      {
        transform: "translate(0,0) scale(1) rotate(0deg)",
        borderRadius: "12px",
        opacity: 1,
      },
      {
        transform: `translate(${apexX}px, ${apexY}px) scale(0.45) rotate(160deg)`,
        borderRadius: "50%",
        opacity: 0.95,
        offset: 0.55,
      },
      {
        transform: `translate(${dx}px, ${dy}px) scale(0.12) rotate(360deg)`,
        borderRadius: "50%",
        opacity: 0.2,
      },
    ],
    {
      duration: 850,
      easing: "cubic-bezier(0.55, -0.05, 0.4, 1.05)",
      fill: "forwards",
    }
  );

  anim.onfinish = () => {
    clone.remove();
    // Cart bounce
    target.animate(
      [
        { transform: "scale(1)" },
        { transform: "scale(1.35)" },
        { transform: "scale(0.95)" },
        { transform: "scale(1)" },
      ],
      { duration: 360, easing: "cubic-bezier(0.34, 1.56, 0.64, 1)" }
    );
    // Pulse the badge if present
    const badge = target.querySelector<HTMLElement>("[data-cart-badge]");
    if (badge) {
      badge.animate(
        [
          { transform: "scale(1)", opacity: 1 },
          { transform: "scale(1.6)", opacity: 1 },
          { transform: "scale(1)", opacity: 1 },
        ],
        { duration: 360, easing: "cubic-bezier(0.34, 1.56, 0.64, 1)" }
      );
    }
  };
}
