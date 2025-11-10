import { useEffect, useState } from "react";

export default function PixelGrid() {
  const [size, setSize] = useState({ w: window.innerWidth, h: window.innerHeight });
  const [isDrawing, setIsDrawing] = useState(false);

  useEffect(() => {
    function handleResize() {
      setSize({ w: window.innerWidth, h: window.innerHeight });
    }
    window.addEventListener("resize", handleResize);
    window.addEventListener("pointerup", () => setIsDrawing(false));
    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("pointerup", () => setIsDrawing(false));
    };
  }, []);

  const totalPixels = 250 * 160;
  const pixels = Array.from({ length: totalPixels });

  const cellVW = size.w / 100;
  const rows = Math.floor(size.h / cellVW);

  function paint(e) {
    e.target.style.background = "blue";
  }

  function pointerDown(e) {
    setIsDrawing(true);
    paint(e);
    // Capture pointer for smooth continuous drawing
    e.target.setPointerCapture?.(e.pointerId);
  }

  function pointerMove(e) {
    if (isDrawing) paint(e);
  }

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        display: "grid",
        gridTemplateColumns: `repeat(100, 1vw)`,
        gridTemplateRows: `repeat(${rows}, 1vw)`,
        userSelect: "none",
        touchAction: "none", // ✅ prevents scrolling on touch
      }}
    >
      {pixels.map((_, i) => (
        <div
          key={i}
          id={`pixel-${i}`}
          style={{
            background: "white",
            minWidth: "1vw",
            minHeight: "1vw",
            pointerEvents: "auto",
          }}
          onPointerDown={pointerDown}
          onPointerEnter={pointerMove}
          onPointerMove={pointerMove}
        />
      ))}
    </div>
  );
}
