import { useEffect, useState } from "react";

export default function PixelGrid() {
  const [size, setSize] = useState({ w: window.innerWidth, h: window.innerHeight });
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState("#3498db");
  const [swatches, setSwatches] = useState([
    "#3498db",
    "#e74c3c",
    "#2ecc71",
    "#f1c40f",
    "#ffffff",
    "#000000",
  ]);
  const [selectedIndex, setSelectedIndex] = useState(0);

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
  const rows = Math.max(1, Math.floor(size.h / cellVW));
  const totalPixels = Math.max(1, Math.floor(250 * rows * 1.2));
  const pixels = Array.from({ length: totalPixels });

  function paintPixel(e) {
    if (!e.target || !(e.target instanceof HTMLElement)) return;
    e.target.style.background = color;
  }

  function normalizeHexInput(raw) {
    if (!raw) return "#";
    const v = raw.startsWith("#") ? raw.slice(1) : raw;
    return "#" + v.slice(0, 6);
  }

  function handleSwatchClick(idx) {
    setSelectedIndex(idx);
    setColor(swatches[idx] || "#000000");
  }

  return (
    <div style={{ display: "flex", width: "100vw", height: "100vh", overflow: "hidden" }}>
      {/* COLOR SIDEBAR */}
      <div
        style={{
          width: "8vw",
      
          background: "#222",
          padding: "1.5vw",
          display: "flex",
          flexDirection: "column",
          gap: "1vw",
          alignItems: "center",
          borderRight: "0.4vw solid #444",
        }}
      >
{swatches.map((sw, i) => {
  const uniqueIndex = i % 4; // Only 0, 1, 2, 3
  return (
    <div
      key={i}
      onClick={() => handleSwatchClick(uniqueIndex)}
      style={{
        width: "6vw",
        height: "6vw",
        background: sw,
        border: uniqueIndex === selectedIndex ? "0.4vw solid white" : "0.3vw solid #666",
        borderRadius: "1vw",
        cursor: "pointer",
        position: "relative",
      }}
    >

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setSwatches((prev) => prev.filter((_, idx) => idx !== i));
                if (selectedIndex === i) setSelectedIndex(null);
              }}
              style={{
                position: "absolute",
                top: "-0.5vw",
                right: "-0.5vw",
                width: "1.5vw",
                height: "1.5vw",
                minWidth: "12px",
                minHeight: "12px",
                maxWidth: "20px",
                maxHeight: "20px",
                borderRadius: "50%",
                background: "#900",
                color: "#fff",
                fontSize: "0.8vw",
                lineHeight: "1.5vw",
                textAlign: "center",
                border: "none",
                cursor: "pointer",
              }}
            >
              ×
            </button>
          </div>
        ))}

        {/* Color Preview */}
        <div
          style={{
            width: "6vw",
            height: "6vw",
            background: color,
            border: "0.3vw solid #888",
            borderRadius: "1vw",
            marginTop: "6px",
          }}
        />

        {/* Hex Input */}
        <input
          type="text"
          value={color}
          onChange={(e) => {
            const normalized = normalizeHexInput(e.target.value);
            setColor(normalized);
            if (selectedIndex != null) {
              setSwatches((prev) => {
                const copy = [...prev];
                copy[selectedIndex] = normalized;
                return copy;
              });
            }
          }}
          maxLength={7}
          style={{
            width: "6vw",
            marginTop: "1vw",
            background: "#111",
            border: "0.3vw solid #666",
            color: "white",
            textAlign: "center",
            borderRadius: "1vw",
            fontSize: "1vw",
          }}
        />

        {/* Add Swatch */}
        <button
          type="button"
          onClick={() => {
            setSwatches((prev) => [...prev, "#ffffff"]);
            setSelectedIndex(swatches.length);
            setColor("#ffffff");
          }}
          style={{
            marginTop: "1vw",
            padding: "0.5vw 1vw",
            background: "#333",
            color: "#fff",
            border: "0.3vw solid #666",
            borderRadius: "1vw",
            cursor: "pointer",
            fontSize: "0.9vw",
          }}
        >
          + Add
        </button>
      </div>

      {/* DRAWING GRID */}
      <div
        style={{
          flex: 1,
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
