return (
  <div
    style={{
      display: "grid",
      width: "100w",
      height: "100vh",
      overflow: "hidden",
      background: "#111",
    }}
  >

    {/* LEFT COLOR PALETTE */}
<div
  style={{
    width: "12vw",               // <-- responsive width
    minWidth: "60px",            // <-- prevents too small on tiny screens
    maxWidth: "140px",           // <-- prevents too large on huge screens
    background: "#222",
    padding: "1vw",
    display: "flex",
    flexDirection: "column",
    gap: "1vw",
    alignItems: "center",
    borderRight: "0.4vw solid #444",
  }}
>
  {["#3498db", "#e74c3c", "#2ecc71", "#f1c40f", "#ffffff", "#000000"].map(
    (swatch, i) => (
      <div
        key={i}
        onClick={() => setColor(swatch)}
        style={{
          width: "6vw",
          height: "6vw",
          minWidth: "35px",
          minHeight: "35px",
          maxWidth: "80px",
          maxHeight: "80px",
          background: swatch,
          border: swatch === color ? "0.4vw solid white" : "0.3vw solid #666",
          borderRadius: "1vw",
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
      width: "8vw",
      minWidth: "50px",
      maxWidth: "120px",
      marginTop: "1vw",
      background: "#111",
      border: "0.3vw solid #666",
      color: "white",
      textAlign: "center",
      borderRadius: "1vw",
      fontSize: "2vw",
    }}
  />
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
