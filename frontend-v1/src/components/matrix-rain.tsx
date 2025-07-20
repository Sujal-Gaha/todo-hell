import { useEffect, useState } from "react";

export const MatrixRain = () => {
  const [chars, setChars] = useState<
    Array<{ id: number; char: string; x: number; delay: number }>
  >([]);

  useEffect(() => {
    const characters =
      "アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const newChars = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      char: characters[Math.floor(Math.random() * characters.length)],
      x: Math.random() * 100,
      delay: Math.random() * 3,
    }));
    setChars(newChars);
  }, []);

  return (
    <div className="matrix-bg">
      {chars.map((char) => (
        <div
          key={char.id}
          className="matrix-char"
          style={{
            left: `${char.x}%`,
            animationDelay: `${char.delay}s`,
          }}
        >
          {char.char}
        </div>
      ))}
    </div>
  );
};
