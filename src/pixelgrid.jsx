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

    {/* LEFT COLOR PALETTE */}
    <div
      style={{
        width: "8vw",
        background: "#222",
        padding: "10px",
        display: "flex",
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
