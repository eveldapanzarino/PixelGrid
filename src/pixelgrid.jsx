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

  
  const cellVW = size.w / 100; // px per 1vw
  const rows = Math.floor(size.h / cellVW);

const totalPixels = 200 * rows * 3;
  const pixels = Array.from({ length: totalPixels });

  function paintPixel(e) {
    e.target.style.background = "blue";
  }

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        display: "grid",
        gridTemplateColumns: `repeat(200, 1vw)`,
        gridTemplateRows: `repeat(${rows}, 1vw)`,
        userSelect: "none",
        touchAction: "none", // IMPORTANT for mobile drawing
      }}
    >
      {pixels.map((_, i) => (
        <div
          key={i}
          id={`pixel-${i}`}
          className="pixelgrid"
          style={{
            background: "white"
          }}
          onPointerDown={(e) => {
            setIsDrawing(true);
            paintPixel(e);
          }}
          onPointerEnter={(e) => {
            if (isDrawing) paintPixel(e);
          }}
        />
      ))}
    </div>
  );
}
