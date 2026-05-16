"use client";

const PHOTOS = [
  { seed: "arch1",  w: 180, h: 240, rot: -8,  top: -10, left: 0   },
  { seed: "arch2",  w: 160, h: 200, rot: 5,   top: 20,  left: 6   },
  { seed: "arch3",  w: 200, h: 140, rot: -3,  top: 60,  left: 2   },
  { seed: "arch4",  w: 150, h: 210, rot: 11,  top: 5,   left: 16  },
  { seed: "arch5",  w: 190, h: 130, rot: -14, top: 45,  left: 22  },
  { seed: "arch6",  w: 170, h: 220, rot: 7,   top: -5,  left: 31  },
  { seed: "arch7",  w: 155, h: 185, rot: -6,  top: 35,  left: 39  },
  { seed: "arch8",  w: 210, h: 145, rot: 12,  top: 55,  left: 44  },
  { seed: "arch9",  w: 165, h: 230, rot: -10, top: -8,  left: 52  },
  { seed: "arch10", w: 180, h: 120, rot: 4,   top: 42,  left: 59  },
  { seed: "arch11", w: 145, h: 200, rot: -7,  top: 10,  left: 64  },
  { seed: "arch12", w: 195, h: 150, rot: 9,   top: 50,  left: 71  },
  { seed: "arch13", w: 160, h: 215, rot: -13, top: 0,   left: 78  },
  { seed: "arch14", w: 175, h: 135, rot: 6,   top: 38,  left: 83  },
  { seed: "arch15", w: 155, h: 195, rot: -4,  top: 15,  left: 88  },
  { seed: "arch16", w: 185, h: 125, rot: 10,  top: 58,  left: 93  },
];

export default function Collage() {
  return (
    <div
      className="relative w-full border-b border-[var(--border)] bg-[var(--background)]"
      style={{ height: "340px", overflow: "hidden" }}
    >
      {PHOTOS.map((p, i) => (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          key={p.seed}
          src={`https://picsum.photos/seed/${p.seed}/${p.w}/${p.h}`}
          alt=""
          width={p.w}
          height={p.h}
          className="absolute object-cover border-2 border-[var(--foreground)] shadow-brutal select-none"
          style={{
            top: `${p.top}%`,
            left: `${p.left}%`,
            width: p.w,
            height: p.h,
            transform: `rotate(${p.rot}deg)`,
            zIndex: i + 1,
            transition: "transform 0.15s ease, z-index 0s",
          }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLImageElement).style.transform = `rotate(${p.rot}deg) scale(1.06)`;
            (e.currentTarget as HTMLImageElement).style.zIndex = "99";
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLImageElement).style.transform = `rotate(${p.rot}deg) scale(1)`;
            (e.currentTarget as HTMLImageElement).style.zIndex = String(i + 1);
          }}
          draggable={false}
        />
      ))}
    </div>
  );
}
