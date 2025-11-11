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
    <div
    style={{
      display: "flex",
      width: "100vw",
      height: "100vh",
      overflow: "hidden",
      background: "#111",
    }}
  >

    <div
      style={{
        width: "8vw",
        background: "#222",
        padding: "10px",
        display: "flex",
        display: "grid",
        flexDirection: "column",
        gap: "8px",
        alignItems: "center",
        borderRight: "2px solid #444",
      }}
    >
      {["#3498db", "#e74c3c", "#2ecc71", "#f1c40f", "#ffffff", "#000000"].map(
        (swatch, i) => (
          <div
            key={i}
            onClick={() => setColor(swatch)}
            style={{
              width: "4.6vw",
              height: "4.6vw",
              background: swatch,
              border: swatch === color ? "3px solid white" : "2px solid #666",
              borderRadius: "6px",
              cursor: "pointer",
            }}
          />
    
        )
      )}

      <input
        type="text"
        value={color}
        onChange={(e) => setColor(e.target.value)}
        maxLength={7}
        style={{
          width: "500px",
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
            )}
