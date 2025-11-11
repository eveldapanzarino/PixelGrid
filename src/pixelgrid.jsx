import { useEffect, useState } from "react";

export default function PixelGrid() {
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

  const cellVW = size.w / 100;
  const rows = Math.max(1, Math.floor(size.h / cellVW));
  const totalPixels = Math.max(1, Math.floor(250 * rows * 1.2));

  // NEW: Pixel color state
  const [pixelColors, setPixelColors] = useState(() => Array(totalPixels).fill("#000000"));

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

  function paintPixel(e, index) {
    setPixelColors((prev) => {
      const copy = [...prev];
      copy[index] = color;
      return copy;
    });
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

  // ✅ SAVE FUNCTION
  function saveToHTML() {
    const data = JSON.stringify(pixelColors);
    const html = `
<!DOCTYPE html>
<html>
<body style="margin:0;background:black;">
<div style="display:grid;grid-template-columns:repeat(250,10px);grid-auto-rows:10px;">
${pixelColors.map(c => `<div style="width:10px;height:10px;background:${c}"></div>`).join("")}
</div>
<script>
const colors = ${data};
</script>
</body>
</html>`;

    const blob = new Blob([html], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "pixel-art.html";
    a.click();
    URL.revokeObjectURL(url);
  }

  // ✅ LOAD FUNCTION
  function loadFromHTML(file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target.result;
      const match = text.match(/const colors = (\\[[^;]+\\])/);
      if (match) {
        const arr = JSON.parse(match[1]);
        setPixelColors(arr);
      }
    };
    reader.readAsText(file);
  }

 return (
  <div style={{ width: "100vw", height: "100vh", display: "flex", flexDirection: "column" }}>

    {/* TOP BAR (BLOCK) */}
    <div
      style={{
        height: "5vh",
        minHeight: "40px",
        background: "#111",
        borderBottom: "0.4vw solid #333",
        display: "flex",
        alignItems: "center",
        padding: "0 1vw",
        gap: "1vw",
      }}
    >
      <button
        onClick={() => alert("Save will be reconnected in next step")}
        style={{
          background: "#333",
          color: "white",
          padding: "0.5vw 1vw",
          borderRadius: "0.5vw",
          border: "0.2vw solid #666",
          cursor: "pointer",
        }}
      >
        Save
      </button>

      <input type="file" style={{ color: "white" }} />
    </div>

    {/* MAIN CONTENT ROW */}
    <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>

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

        <button
          type="button"
          onClick={() => {
            if (swatches.length < 4) {
              setSwatches((prev) => [...prev, "#ffffff"]);
              setSelectedIndex(swatches.length);
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
  </div>
);
