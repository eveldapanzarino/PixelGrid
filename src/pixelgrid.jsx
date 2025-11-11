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
const [showFileMenu, setShowFileMenu] = useState(false);

  return (
    <div style={{ display: "flex", width: "100vw", height: "100vh", overflow: "hidden" }}>

   {/* ✅ TOP BAR */}
<div style={{
  position: "absolute",
  top: 0,
  left: 0,
  width: "100vw",
  height: "5vh",
  background: "#ffffff",
  borderBottom: "0.3vw solid #444",
  display: "grid",
  gridTemplateColumns: "repeat(12, 8.35vw)",
  alignItems: "center",

  zIndex: 20
}}>
  
<div>
  {/* use public/ assets via root path so Vite serves them correctly */}
  <img src="/favicon-32x32.png" alt="favicon" style={{
    width: "3vw",
    height: "3vw",
    textalign: "center",
  }} />
</div>

  {/* FILE BUTTON */}
  <div style={{ position: "relative", }}>
    <button
      onClick={() => setShowFileMenu(v => !v)}
      style={{
        background: "#222",
        color: "white",
        border: "0.2vw solid #555",
        width: "100%",
        cursor: "pointer",
        fontSize: "2vw"
      }}
    >
      File
    </button>

    {/* DROPDOWN MENU */}
    {showFileMenu && (
      <div
        style={{
          position: "absolute",
          top: "100%",
          left: 0,
          background: "#222",
          border: "0.25vw solid #555",
          borderRadius: "0.5vw",
          display: "grid",
          gridTemplateColumns: "7, 8vw",
          padding: "0.5vw 0",
          marginTop: "0.4vw",
          width: "10vw",
          boxShadow: "0 0.6vw 2vw rgba(0,0,0,0.5)",
          zIndex: 30
        }}
      >
        
        {/* SAVE OPTION */}
        <div
          onClick={() => {
            setShowFileMenu(false);
            saveToHTML();
          }}
          style={{
            cursor: "pointer",
            color: "white",
            fontSize: ".9vw",
            borderBottom: "0.2vw solid #333"
          }}
        >
          Save
        </div>

        {/* FUTURE OPTIONS (Load, Export PNG, etc) */}
        <div style={{ padding: "0.8vw 1vw", color: "#666", fontSize: "0.9vw" }}>
         
        </div>
      </div>
    )}
  </div>
</div>

     {/* SIDEBAR */}
<div
  style={{
    width: "8vw",
    background: "#222",
    paddingTop: "5vh",
    paddingLeft: "1.5vw",
    paddingRight: "1.5vw",
    paddingBottom: "1.5vw",
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
          borderRadius: "50%",
          background: "#900",
          color: "#fff",
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

      {/* GRID */}
      <div
        style={{
          flex: 1,
          display: "grid",
          gridTemplateColumns: `repeat(250, 1vw)`,
          gridTemplateRows: `repeat(${rows}, 1vw)`,
          userSelect: "none",
          touchAction: "none",
          paddingTop: "4vh", // shifted down for top bar
        }}
      >
        {pixelColors.map((c, i) => (
          <div
            key={i}
            style={{ background: c }}
            onPointerDown={(e) => {
              setIsDrawing(true);
              paintPixel(e, i);
            }}
            onPointerEnter={() => {
              if (isDrawing) paintPixel(null, i);
            }}
          />
        ))}
      </div>
    </div>
  );
}
