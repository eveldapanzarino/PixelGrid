export default function PixelGrid() {
  const [size, setSize] = useState({ w: window.innerWidth, h: window.innerHeight });
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState("#3498db"); // default color

  const swatches = ["#3498db", "#e74c3c", "#2ecc71", "#f1c40f", "#ffffff", "#000000"];

  useEffect(() => {
    function handleResize() {
  } [];

  
  const cellVW = size.w / 100; // px per 1vw
 
  const rows = Math.floor(size.h / cellVW);


  const totalPixels = 250 * rows * 1.2;
  const pixels = Array.from({ length: totalPixels });

  function paintPixel(e) {
    e.target.style.background = "blue";
    e.target.style.background = color;
  }

  return (
    <div style={{
      display: "grid", 
      width: "12vw",
        height: "100vw", 
      background: "black", 
      gridTemplateColumns: `repeat(1, 200px)`,
        gridTemplateRows: `repeat(5, 200px) }} 
        >
       <div class="color-swatch"></div>
       <div class="color-swatch"></div>
       <div class="color-swatch"></div>
      <div class="add-color"></div>
      <div class="hex-field"></div>
    </div>
    <div
      style={{
        width: "50vw",
        height: "50vh",
        display: "grid",
        gridTemplateColumns: `repeat(250, 1.5vw)`,
        gridTemplateRows: `repeat(${rows}, 1.5vw)`,
        userSelect: "none",
        touchAction: "none", // IMPORTANT for mobile drawing
      }}
    >
      {pixels.map((_, i) => (
        <div
          key={i}
          id={`pixel-${i}`}
          className="pixelgrid"
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
              border: sw === color ? "3px solid white" : "2px solid #666",
              borderRadius: "6px",
              cursor: "pointer",
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
            background: "white"
          }}
          onPointerDown={(e) => {
            setIsDrawing(true);
            paintPixel(e);
          }}
          onPointerEnter={(e) => {
            if (isDrawing) paintPixel(e);
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
      ))}
      </div>

      {/* --- PIXEL GRID --- */}
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
