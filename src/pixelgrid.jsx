import { useEffect, useState } from "react";

export default function PixelGrid() {
  const [size, setSize] = useState({ w: window.innerWidth, h: window.innerHeight });
  const [isDrawing, setIsDrawing] = useState(false);
  const [grid, setGrid] = useState([]);

  useEffect(() => {
    // initialize grid once
    const totalPixels = 100 * Math.floor(window.innerHeight / (window.innerWidth / 100));
    setGrid(Array(totalPixels).fill("white"));
  }, []);

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

  const cellVW = size.w / 100;
  const rows = Math.floor(size.h / cellVW);
  const cols = 100;

  function paintAt(clientX, clientY) {
    const rect = document.getElementById("grid").getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;

    const col = Math.floor((x / rect.width) * cols);
    const row = Math.floor((y / rect.height) * rows);
    const index = row * cols + col;

    setGrid((g) => {
      if (index < 0 || index >= g.length) return g;
      if (g[index] === "blue") return g;
      const newGrid = g.slice();
      newGrid[index] = "blue";
      return newGrid;
    });
  }

  return (
    <div
      id="grid"
      style={{
        width: "100vw",
        height: "100vh",
        display: "grid",
        gridTemplateColumns: `repeat(${cols}, 1fr)`,
        gridTemplateRows: `repeat(${rows}, 1fr)`,
        touchAction: "none", // <--- required for mobile drawing
      }}
      onPointerDown={(e) => {
        setIsDrawing(true);
        paintAt(e.clientX, e.clientY);
      }}
      onPointerMove={(e) => {
        if (isDrawing) paintAt(e.clientX, e.clientY);
      }}
    >
      {grid.map((color, i) => (
        <div key={i} style={{ background: color }} />
      ))}
    </div>
  );
}
