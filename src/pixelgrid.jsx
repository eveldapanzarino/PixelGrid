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

  function paintPixel(e) {
    const grid = gridRef.current;
    if (!grid) return;

    const rect = grid.getBoundingClientRect();

    // Get the pointer coordinates relative to the grid
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Convert to col/row
    let col = Math.floor((x / rect.width) * cols);
    let row = Math.floor((y / rect.height) * rows);

    // Clamp to valid indices
    col = Math.max(0, Math.min(cols - 1, col));
    row = Math.max(0, Math.min(rows - 1, row));

    const index = row * cols + col;
    const pixel = grid.children[index];
    if (pixel) pixel.style.background = "blue";
  }

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
        touchAction: "none",
        position: "relative", // ensures bounding rect matches visual grid
      }}
      onPointerDown={(e) => {
        e.preventDefault();
        setIsDrawing(true);
        paintPixel(e);
      }}
      onPointerMove={(e) => {
        if (isDrawing) paintPixel(e);
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
            pointerEvents: "none", // container handles all pointer events
          }}
        />
      ))}
    </div>
  );
}

