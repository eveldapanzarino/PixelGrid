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
          minWidth: "60px",
          maxWidth: "140px",
          background: "#222",
          padding: "1.5vw",
          display: "flex",
          flexDirection: "column",
          borderRight: "0.4vw solid #444",
          boxSizing: "border-box",
          height: "100vh",
        }}
      >
        {/* Scrollable swatches */}
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "1vw",
            overflowY: "auto",
            width: "100%",
          }}
        >
          {swatches.map((sw, i) => (
            <div
              key={i}
              onClick={() => handleSwatchClick(i)}
              style={{
                width: "80%", // proportional width of sidebar
                aspectRatio: "1/1", // maintain square shape
                background: sw,
                border: i === selectedIndex ? "0.4vw solid white" : "0.3vw solid #666",
                borderRadius: "0.5vw",
                cursor: "pointer",
                position: "relative",
                flexShrink: 0, // prevent shrinking
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
        </div>

        {/* Fixed preview, input, add button */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "1vw",
            marginTop: "1vw",
          }}
        >
          <div
            style={{
              width: "80%",
              aspectRatio: "1/1",
              background: color,
              border: "0.3vw solid #888",
              borderRadius: "0.5vw",
            }}
          />
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
              width: "80%",
              background: "#111",
              border: "0.3vw solid #666",
              color: "white",
              textAlign: "center",
              borderRadius: "0.5vw",
              fontSize: "1vw",
            }}
          />
          <button
            type="button"
            onClick={() => {
              setSwatches((prev) => [...prev, "#ffffff"]);
              setSelectedIndex(swatches.length);
              setColor("#ffffff");
            }}
            style={{
              width: "80%",
              padding: "0.5vw 1vw",
              background: "#333",
              color: "#fff",
              border: "0.3vw solid #666",
              borderRadius: "0.5vw",
              cursor: "pointer",
              fontSize: "0.9vw",
            }}
          >
            + Add
          </button>
        </div>
      </div>

      {/* DRAWING GRID */}
      <div
        style={{
          flex: 1,
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
