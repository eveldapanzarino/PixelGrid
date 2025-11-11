
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
      {/* Optional remove button */}
      <button
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

  {/* Dynamic preview of current color */}
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

  {/* Hex Input */}
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

  {/* Add new swatch */}
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


