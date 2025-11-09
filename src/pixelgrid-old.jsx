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

  const totalPixels = size.w * size.h;
  const pixels = Array.from({ length: totalPixels });

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(${size.w}, 5px)`,
        gridTemplateRows: `repeat(${size.h}, 5px)`,
        width: `${size.w}px`,
        height: `${size.h}px`,
      }}
    >
      {pixels.map((_, i) => (
        <div key={i} style={{ background: i % 2 ? "black" : "white" }} />
      ))}
    </div>
  );
}

