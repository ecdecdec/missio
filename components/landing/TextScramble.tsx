"use client";

import { useEffect, useState, useCallback, useRef } from "react";

interface TextScrambleProps {
  words: string[];
  interval?: number;
  scrambleDuration?: number;
  className?: string;
}

const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%АБВГДЕЖЗИКЛМНОПРСТ";

function randomChar() {
  return CHARS[Math.floor(Math.random() * CHARS.length)];
}

export default function TextScramble({
  words,
  interval = 3000,
  scrambleDuration = 600,
  className = "",
}: TextScrambleProps) {
  const [display, setDisplay] = useState(words[0] ?? "");
  const indexRef = useRef(0);
  const frameRef = useRef<number | null>(null);

  const scrambleTo = useCallback(
    (target: string) => {
      const maxLen = Math.max(display.length, target.length);
      const totalFrames = Math.ceil(scrambleDuration / 30);
      let frame = 0;

      const step = () => {
        frame++;
        const progress = frame / totalFrames;
        const revealCount = Math.floor(progress * target.length);
        let result = "";

        for (let i = 0; i < maxLen; i++) {
          if (i < revealCount) {
            result += target[i] ?? "";
          } else if (i < target.length) {
            result += randomChar();
          }
        }

        setDisplay(result);

        if (frame < totalFrames) {
          frameRef.current = requestAnimationFrame(step);
        } else {
          setDisplay(target);
        }
      };

      if (frameRef.current) cancelAnimationFrame(frameRef.current);
      frameRef.current = requestAnimationFrame(step);
    },
    [display.length, scrambleDuration]
  );

  useEffect(() => {
    const timer = setInterval(() => {
      indexRef.current = (indexRef.current + 1) % words.length;
      scrambleTo(words[indexRef.current]);
    }, interval);

    return () => {
      clearInterval(timer);
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
  }, [words, interval, scrambleTo]);

  return <span className={className}>{display}</span>;
}
