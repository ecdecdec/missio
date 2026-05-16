"use client";

import { useEffect, useRef, useState, useCallback } from "react";

export default function MagneticCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const circleRef = useRef<HTMLDivElement>(null);
  const [isHovering, setIsHovering] = useState(false);
  const posRef = useRef({ x: 0, y: 0 });
  const targetRef = useRef({ x: 0, y: 0 });
  const rafRef = useRef<number>(0);

  const animate = useCallback(() => {
    const lerp = 0.15;
    posRef.current.x += (targetRef.current.x - posRef.current.x) * lerp;
    posRef.current.y += (targetRef.current.y - posRef.current.y) * lerp;

    if (dotRef.current) {
      dotRef.current.style.transform = `translate(${targetRef.current.x}px, ${targetRef.current.y}px)`;
    }
    if (circleRef.current) {
      circleRef.current.style.transform = `translate(${posRef.current.x}px, ${posRef.current.y}px) scale(${isHovering ? 1.5 : 1})`;
    }

    rafRef.current = requestAnimationFrame(animate);
  }, [isHovering]);

  useEffect(() => {
    // Don't show custom cursor on touch devices
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const onMove = (e: MouseEvent) => {
      targetRef.current = { x: e.clientX, y: e.clientY };
    };

    const onEnter = (e: Event) => {
      const target = e.target as HTMLElement;
      if (
        target.tagName === "A" ||
        target.tagName === "BUTTON" ||
        target.closest("a") ||
        target.closest("button") ||
        target.classList.contains("magnetic")
      ) {
        setIsHovering(true);
      }
    };

    const onLeave = () => {
      setIsHovering(false);
    };

    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseenter", onEnter, true);
    document.addEventListener("mouseleave", onLeave, true);

    rafRef.current = requestAnimationFrame(animate);

    return () => {
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseenter", onEnter, true);
      document.removeEventListener("mouseleave", onLeave, true);
      cancelAnimationFrame(rafRef.current);
    };
  }, [animate]);

  // Don't render on SSR or touch devices
  if (typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches) {
    return null;
  }

  return (
    <>
      {/* Small dot */}
      <div
        ref={dotRef}
        className="pointer-events-none fixed left-0 top-0 z-[10000] hidden md:block"
        style={{ width: 6, height: 6, marginLeft: -3, marginTop: -3 }}
      >
        <div
          className="h-full w-full rounded-full"
          style={{ background: isHovering ? "#1B3BFF" : "#080808" }}
        />
      </div>
      {/* Follower circle */}
      <div
        ref={circleRef}
        className="pointer-events-none fixed left-0 top-0 z-[9999] hidden md:block transition-[width,height,border-color] duration-200"
        style={{
          width: isHovering ? 40 : 28,
          height: isHovering ? 40 : 28,
          marginLeft: isHovering ? -20 : -14,
          marginTop: isHovering ? -20 : -14,
          border: `1.5px solid ${isHovering ? "#1B3BFF" : "rgba(8,8,8,0.3)"}`,
          borderRadius: "50%",
        }}
      />
    </>
  );
}
