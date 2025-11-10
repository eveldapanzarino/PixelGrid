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
  }, []);

  const cellVW = size.w / 100;
  const rows = Math.floor(size.h / cellVW);
  const totalPixels = 250 * rows;
  const pixels = Array.from({ length: totalPixels });

  function paintPixel(e) {
    e.target.style.background = "blue";
  }

  return (
    <div
      style={{
        width: "100vw",
        height: "100dvh", // mobile-correct viewport
        display: "grid",
        gridTemplateColumns: `repeat(250, 1vw)`,
        gridTemplateRows: `repeat(${rows}, 1vw)`,
        userSelect: "none",
        touchAction: "none",
      }}
    >
      {pixels.map((_, i) => (
        <div
          key={i}
          className="pixelgrid"
          style={{ background: "white" }}
          onPointerDown={(e) => {
            setIsDrawing(true);
            paintPixel(e);
          }}
          onPointerMove={(e) => {
            if (isDrawing) paintPixel(e);
          }}
        />
      ))}
    </div>
  );
}
