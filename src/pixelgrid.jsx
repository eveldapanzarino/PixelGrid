import { useEffect, useState, useRef } from "react";

export default function PixelGrid() {
  const [size, setSize] = useState({ w: window.innerWidth, h: window.innerHeight });
  const [isDrawing, setIsDrawing] = useState(false);
  const containerRef = useRef(null);

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

  const cellVW = size.w / 250; // px per 1vw
  const rows = Math.floor(size.h / cellVW);
  const cols = 250;

  function paintByCoordinates(clientX, clientY) {
    const grid = containerRef.current;
    if (!grid) return;

    const rect = grid.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;

    const col = Math.floor((x / rect.width) * cols);
    const row = Math.floor((y / rect.height) * rows);

    if (col < 0 || col >= cols || row < 0 || row >= rows) return;

    const index = row * cols + col;
    const pixel = grid.children[index];
    if (pixel) pixel.style.background = "blue";
  }

  return (
    <div
      ref={containerRef}
      style={{
        width: "100vw",
        height: "100vh",
        display: "grid",
        gridTemplateColumns: `repeat(250, 1vw)`,
        gridTemplateRows: `repeat(${rows}, 1vw)`,
        userSelect: "none",
        touchAction: "none",
      }}
      onPointerDown={(e) => {
        setIsDrawing(true);
        paintByCoordinates(e.clientX, e.clientY);
      }}
      onPointerMove={(e) => {
        if (isDrawing) paintByCoordinates(e.clientX, e.clientY);
      }}
      onPointerUp={() => setIsDrawing(false)}
    >
      {pixels.map((_, i) => (
        <div
          key={i}
          id={`pixel-${i}`}
          className="pixelgrid"
          style={{
            background: "white",
            border: "1px solid transparent",
            pointerEvents: "none", // container handles the events
          }}
        />
      ))}
    </div>
  );
}
