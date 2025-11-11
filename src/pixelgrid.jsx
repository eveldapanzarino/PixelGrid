import { useEffect, useState, useRef } from "react";

export default function PixelGrid() {

  const [size, setSize] = useState({
    w: typeof window !== "undefined" ? window.innerWidth : 1200,
    h: typeof window !== "undefined" ? window.innerHeight : 800,
  });
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState("#3498db");
  const [swatches, setSwatches] = useState([
    "#3498db",
    "#e74c3c",
    "#2ecc71",
    "#ffffff",
  ]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const drawingRef = useRef(null);

  useEffect(() => {
    function handleResize() {
      setSize({ w: window.innerWidth, h: window.innerHeight });
    }
    function handlePointerUp() {
      setIsDrawing(false);
    }

    window.addEventListener("resize", handleResize);
    window.addEventListener("pointerup", handlePointerUp);
    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("pointerup", handlePointerUp);
    };
  }, []);

  const cellVW = size.w / 100;


  // compute rows and columns based on available space and cell size (1vw)
 
  const columns = Math.max(1, Math.floor(size.w / cellVW));

  const pixels = Array.from({ length: totalPixels });

  function paintPixel(e) {
    const el = e.target instanceof HTMLElement ? e.target : null;
    if (!el) return;
    el.style.background = color;
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
        {swatches.map((sw, i) => (
          <div
            key={i}
            onClick={() => handleSwatchClick(i)}
            style={{
              width: "6vh",
              height: "6vh",
              background: sw,
              border: i === selectedIndex ? "0.4vw solid white" : "0.3vw solid #666",
              borderRadius: "1vw",
              cursor: "pointer",
              position: "relative",
              overflow: "hidden",
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
            width: "10vh",
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
            width: "6vh",
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
            if (swatches.length >= 4) return;
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
            cursor: swatches.length >= 4 ? "not-allowed" : "pointer",
            opacity: swatches.length >= 4 ? 0.5 : 1,
            fontSize: "0.9vw",
          }}
        >
          + Add
        </button>
      </div>

      {/* DRAWING GRID */}
      <div
        ref={drawingRef}
        style={{
          flex: 1,
          display: "grid",
          gridTemplateColumns: `repeat(${columns}, 1vw)`,
          gridTemplateRows: `repeat(${rows}, 1vw)`,
          userSelect: "none",
          touchAction: "none",
          height: "100%",
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
            style={{
              width: "1vw",
              height: "1vw",
              boxSizing: "border-box",
              border: "0.05vw solid rgba(0,0,0,0.05)",
            }}
          />
        ))}
      </div>
    </div>
  );
}