import { useEffect, useState, useRef } from "react";

export default function PixelGrid() {
  const [size, setSize] = useState({ w: window.innerWidth, h: window.innerHeight });
  const [isDrawing, setIsDrawing] = useState(false);
  const gridRef = useRef(null);

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

  const cellVW = size.w / 250;
  const rows = Math.floor(size.h / cellVW);
  const cols = 250;

  function paintPixelAt(clientX, clientY) {
    const grid = gridRef.current;
    if (!grid) return;

    const rect = grid.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;

    const col = Math.floor((x / rect.width) * cols);
    const row = Math.floor((y / rect.height) * rows);
    const index = row * cols + col;

    const pixel = grid.children[index];
    if (pixel) pixel.style.background = "blue";
  }

  // --- Attach all drawing logic to the container ---
  return (
    <div
      ref={gridRef}
      style={{
        width: "100vw",
        height: "100vh",
        display: "grid",
        gridTemplateColumns: `repeat(250, 1vw)`,
        gridTemplateRows: `repeat(${rows}, 1vw)`,
        userSelect: "none",
        touchAction: "none", // prevents page scroll on touch
      }}
      onPointerDown={(e) => {
        e.preventDefault();
        setIsDrawing(true);
        paintPixelAt(e.clientX, e.clientY);
      }}
      onPointerMove={(e) => {
        if (isDrawing) paintPixelAt(e.clientX, e.clientY);
      }}
      onPointerUp={() => setIsDrawing(false)}
    >
      {pixels.map((_, i) => (
        <div
          key={i}
          id={`pixel-${i}`}
          style={{
            background: "white",
            minWidth: "1vw",
            minHeight: "1vw",
            pointerEvents: "none", // ✅ allow touches to pass through to container
          }}
        />
      ))}
    </div>
  );
}
