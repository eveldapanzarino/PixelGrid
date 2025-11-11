import { useEffect, useState } from "react";

export default function PixelGrid() {
  const [size, setSize] = useState({ w: window.innerWidth, h: window.innerHeight });
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState("#3498db"); // default color

  const swatches = ["#3498db", "#e74c3c", "#2ecc71", "#f1c40f", "#ffffff", "#000000"];

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
  const totalPixels = 250 * rows * 1.2;
  const pixels = Array.from({ length: totalPixels });

  function paintPixel(e) {
    e.target.style.background = color;
  }

  return (
    <div style={{ display: "flex", width: "100vw", height: "100vh", overflow: "hidden" }}>

      {/* --- COLOR SWATCH PANEL --- */}
      <div
        style={{
          width: "70px",
          background: "#222",
          padding: "10px",
          display: "flex",
          flexDirection: "column",
          gap: "8px",
          alignItems: "center",
          borderRight: "2px solid #444",
        }}
      >
      {swatches.map((sw, index) => (
  <div
    key={index}
    onClick={() => setColor(sw)}
    style={{
      width: "40px",
      height: "40px",
      background: sw,
      border: sw.toLowerCase() === color.toLowerCase()
        ? "3px solid white"
        : "2px solid #666",
      borderRadius: "6px",
      cursor: "pointer",
    }}
  />
))}

{/* Show the currently selected color as a dynamic swatch */}
<div
  style={{
    width: "40px",
    height: "40px",
    background: color,
    border: "3px solid white",
    borderRadius: "6px",
    marginTop: "10px",
  }}
/>
        ))}

        {/* Hex Input */}
        <input
          type="text"
          value={color}
          onChange={(e) => setColor(e.target.value)}
          maxLength={7}
          style={{
            width: "60px",
            marginTop: "10px",
            background: "#111",
            border: "1px solid #666",
            color: "white",
            textAlign: "center",
            borderRadius: "4px",
            fontSize: "12px",
          }}
        />
      </div>

      {/* --- PIXEL GRID --- */}
      <div
        style={{
         
          display: "grid",
          gridTemplateColumns: `repeat(250, 1.5vw)`,
          gridTemplateRows: `repeat(${rows}, 1.5vw)`,
          userSelect: "none",
          touchAction: "none",
        }}
      >
        {pixels.map((_, i) => (
          <div
            key={i}
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
    </div>
  );
}
