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
        width: `${size.w}px`,
        height: `${size.h}px`,
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
  style={{ background: i % 2 ? "white" : "white" }}
       onClick={(e) => { e.target.style.background = "blue"; }}
/>
      ))}
    </div>
  );
  
}
