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
  
  const cellVW = size.w / 100;           // px per 1vw
  const rows = Math.floor(size.h / cellVW);
  
  return (
     <div
      style={{
        width: "100vw",
        height: "100vh",
        display: "grid",
        gridTemplateColumns: `repeat(100, 1vw)`,
        gridTemplateRows: `repeat(${rows}, 1vw)`,
      }}
    >
      {pixels.map((_, i) => (
        <div
  key={i}
  id={`pixel-${i}`}
  className="pixelgrid"
  style={{ background: i % 2 ? "white" : "white" }}
       onClick={(e) => { e.target.style.background = "blue"; }}
/>
      ))}
    </div>
  );
  
}
