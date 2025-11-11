import { useEffect, useState, useRef } from "react";

export default function PixelGrid() {
  // top bar uses a proportional viewport height (in vh)
 // top bar height as a proportion of viewport

  const [size, setSize] = useState({ w: window.innerWidth, h: window.innerHeight });
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
  const [showFileMenu, setShowFileMenu] = useState(false);

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
  // subtract top bar height (in px) from available height for rows
  const topbarPx = (TOPBAR_VH / 100) * size.h;
  const rows = Math.max(1, Math.floor((size.h - topbarPx) / cellVW));
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

  function saveDrawingHTML() {
    const el = drawingRef.current;
    if (!el) return;
    // Include the drawing area's outerHTML so inline styles and children are preserved
    const html = `<body style="margin:0">${el.outerHTML}</body></html>`;
    const blob = new Blob([html], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `pixelgrid-${Date.now()}.html`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
    setShowFileMenu(false);
  }

  return (
    <div style={{ display: "grid", gridTemplateColumns: "7, 1fr", width: "100vw", height: "100vh", overflow: "hidden" }}>
      {/* TOP BAR */}
      <div
        style={{
          height: `3vh`,
          display: "grid",
          gridTemplateColumns: "repeat(7, 1fr)",
          alignItems: "center",
          padding: "0 1vw",
          background: "#111",
          color: "#fff",
          borderBottom: "0.2vw solid #333",
          gap: "0.5rem",
        }}
      >
        {/* Column 1 - File menu */}
        <div style={{ display: "flex", alignItems: "center", position: "relative" }}>
          <button
            type="button"
            onClick={() => setShowFileMenu((s) => !s)}
            style={{
              background: "#222",
              color: "#fff",
              border: "0.15vw solid #444",
              padding: "0.6vh 1vw",
              cursor: "pointer",
              borderRadius: "0.4vw",
            }}
          >
            File
          </button>
          {showFileMenu && (
            <div
              style={{
                position: "absolute",
                top: "calc(100% + 6px)",
                left: 0,
                background: "#222",
                border: "0.15vw solid #444",
                padding: "0.5rem",
                zIndex: 40,
                minWidth: "10rem",
                boxShadow: "0 6px 18px rgba(0,0,0,0.5)",
              }}
            >
              <button
                type="button"
                onClick={saveDrawingHTML}
                style={{
                  display: "block",
                  width: "100%",
                  textAlign: "left",
                  background: "transparent",
                  color: "#fff",
                  border: "none",
                  padding: "0.4rem 0.6rem",
                  cursor: "pointer",
                }}
              >
                Save HTML
              </button>
            </div>
          )}
        </div>

        {/* Columns 2..7 are placeholders for future controls */}
        <div />
        <div />
        <div />
        <div />
        <div />
        <div />
      </div>

      {/* MAIN AREA */}
      <div style={{ display: "flex", flex: 1 }}>
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
            width: "6vh",
            height: "6vh",
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
            width: "9vh",
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
            // Only add if there are less than 4 swatches
            if (swatches.length < 4) {
              setSwatches((prev) => [...prev, "#ffffff"]);
              setSelectedIndex(swatches.length); // select the new one
              setColor("#ffffff");
            }
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
            gridTemplateColumns: `repeat(250, 1vw)`,
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
            />
          ))}
        </div>
      </div>
    </div>
  );

}
