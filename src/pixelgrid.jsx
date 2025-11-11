import { useEffect, useState } from "react";

export default function PixelGrid() {
  const [size, setSize] = useState({ w: window.innerWidth, h: window.innerHeight });
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState("#3498db"); // current paint color
  const [swatches, setSwatches] = useState([
    "#3498db",
    "#e74c3c",
    "#2ecc71",
    "#f1c40f",
    "#ffffff",
    "#000000",
  ]);
  const [selectedIndex, setSelectedIndex] = useState(0); // which swatch is selected

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
    // guard: don't try to paint container elements
    if (!e.target || !(e.target instanceof HTMLElement)) return;
    e.target.style.background = color;
  }

  // helper: normalize hex to #rrggbb (or return input if incomplete)
  function normalizeHexInput(raw) {
    if (!raw) return "#";
    const v = raw.startsWith("#") ? raw.slice(1) : raw;
    // allow partial typing (0..6 hex chars)
    const partial = v.slice(0, 6);
    return "#" + partial;
  }

  function handleHexChange(e) {
    const raw = e.target.value;
    const normalized = normalizeHexInput(raw);
    // update the paint color immediately
    setColor(normalized);

    // if a swatch is selected and the input is a complete 6-digit hex, update the swatch
    const hexOnly = normalized.replace("#", "");
    if (hexOnly.length === 6) {
      setSwatches((prev) => {
        const copy = [...prev];
        // if selected index is valid, update that swatch color
        if (selectedIndex != null && selectedIndex >= 0 && selectedIndex < copy.length) {
          copy[selectedIndex] = normalized;
        }
        return copy;
      });
    } else {
      // For partial input, we still reflect the live color but don't overwrite swatch until a full hex is typed.
      // Optionally you can uncomment the block below to update swatch even on partial input:
      // setSwatches(prev => { const c = [...prev]; c[selectedIndex] = normalized; return c; });
    }
  }

  function handleSwatchClick(idx) {
    setSelectedIndex(idx);
    // if swatch exists, use it as current color
    const sw = swatches[idx] || "#000000";
    setColor(sw);
  }

  return (
    <div style={{ display: "flex", width: "100vw", height: "100vh", overflow: "hidden" }}>
 
<div
  style={{
    width: "8vw",
    minWidth: "60px",
    maxWidth: "140px",
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
        width: "6vw",
        height: "6vw",
        minWidth: "35px",
        minHeight: "35px",
        maxWidth: "80px",
        maxHeight: "80px",
        background: sw,
        border: i === selectedIndex ? "0.4vw solid white" : "0.3vw solid #666",
        borderRadius: "1vw",
        cursor: "pointer",
        position: "relative",
      }}
    >
 \
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


  <div
    style={{
      width: "6vw",
      height: "6vw",
      minWidth: "35px",
      minHeight: "35px",
      maxWidth: "80px",
      maxHeight: "80px",
      background: color,
      border: "0.3vw solid #888",
      borderRadius: "1vw",
      marginTop: "6px",
    }}
  />


  <input
    type="text"
    value={color}
    onChange={(e) => {
      const raw = e.target.value;
      const normalized = normalizeHexInput(raw);
      setColor(normalized);
      // Update selected swatch live
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
  ))}


  <div
    style={{
      width: "6vw",
      height: "6vw",
      minWidth: "35px",
      minHeight: "35px",
      maxWidth: "80px",
      maxHeight: "80px",
      background: color,
      border: "0.3vw solid #888",
      borderRadius: "1vw",
      marginTop: "6px",
    }}
  />


  <input
    type="text"
    value={color}
    onChange={(e) => {
      const raw = e.target.value;
      const normalized = normalizeHexInput(raw);
      setColor(normalized);
      // Update selected swatch live
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

  <button
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
        {/* Optional: Add a button to apply the current input to the selected swatch even if it's partial */}

      </div>

     
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
