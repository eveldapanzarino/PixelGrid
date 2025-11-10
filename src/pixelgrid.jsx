import { useEffect, useState } from "react";

export default function PixelGrid() {
  const [size, setSize] = useState({ w: window.innerWidth, h: window.innerHeight });

  useEffect(() => {
    function handleResize() {
      setSize({ w: window.innerWidth, h: window.innerHeight });
    }
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  
  const totalPixels = 250 * 160;
  const pixels = Array.from({ length: totalPixels });

  return (
    <div
      style={{
        width: `250vw`,   // 250 pixels * 1vw each
        height: `160vw`,  // 160 pixels * 1vw each
        display: "grid",
        gridTemplateColumns: `repeat(250, 1vw)`,
        gridTemplateRows: `repeat(160, 1vh)`,

      }}
    >
      {pixels.map((_, i) => (
        <div
          key={i}
          id={`pixel-${i}`}
          className="pixelgrid"
          style={{ background: "white" }}
          onClick={(e) => { e.target.style.background = "blue"; }}
        />
      ))}
    </div>
  );
}