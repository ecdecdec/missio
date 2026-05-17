import * as fs from "fs";
import * as path from "path";
import * as https from "https";
import * as http from "http";

const AZURE_ENDPOINT = process.env.AZURE_OPENAI_ENDPOINT!;
const AZURE_KEY = process.env.AZURE_OPENAI_API_KEY!;
const AZURE_DEPLOYMENT = process.env.AZURE_OPENAI_DEPLOYMENT!;

async function callGPT(prompt: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const url = `${AZURE_ENDPOINT}/openai/deployments/${AZURE_DEPLOYMENT}/chat/completions?api-version=2025-03-01-preview`;
    const parsed = new URL(url);
    const body = JSON.stringify({
      messages: [
        { role: "system", content: "You are an expert Next.js developer. Output only valid TypeScript/TSX code. No markdown fences, no explanations." },
        { role: "user", content: prompt }
      ],
      max_tokens: 8000,
      temperature: 0.2,
    });

    const lib = parsed.protocol === "https:" ? https : http;
    const req = lib.request({
      hostname: parsed.hostname,
      port: parsed.port,
      path: parsed.pathname + parsed.search,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api-key": AZURE_KEY,
        "Content-Length": Buffer.byteLength(body),
      }
    }, (res) => {
      let data = "";
      res.on("data", (chunk) => data += chunk);
      res.on("end", () => {
        try {
          const json = JSON.parse(data);
          resolve(json.choices?.[0]?.message?.content || "");
        } catch {
          reject(new Error("Failed to parse response: " + data.substring(0, 500)));
        }
      });
    });
    req.on("error", reject);
    req.write(body);
    req.end();
  });
}

async function main() {
  console.log("🤖 Запрашиваю GPT-5.1 для генерации страниц...\n");

  // ─── 1. Generate new profile page ─────────────────────────────────────────
  console.log("1️⃣ Генерирую страницу профиля /app/profile/page.tsx...");
  
  const profilePagePrompt = `
Create a complete Next.js "use client" page for the file app/profile/page.tsx.

Design system constraints (MUST follow exactly):
- Colors: background #FFFFFF, foreground #1A1A1A, accent #1B3BFF, border #D9D5CD
- Fonts: font-display = "Space Grotesk" (var(--font-display)), font-mono-c = "Space Mono" (var(--font-mono))
- Border-box design: use sharp corners (no rounded), use border lines, NOT cards with rounded corners
- This is a minimalist archival design, NOT a SaaS green dashboard. No green colors.
- Match the landing page aesthetic: monochrome + electric blue accent
- CSS variables available: --background, --foreground, --border, --blue (#1B3BFF), --text-primary, --text-secondary, --text-tertiary, --bg-secondary (#F5F3EE)

Page content:
- This is a profile page shown AFTER registration
- Import Navbar from "@/components/landing/Navbar"
- Read profile from localStorage key "missio_profile" (JSON)
- Display: name, email, school, grade, city, englishLevel, subjects (array), targetTypes (array), targetCountries (array)
- Show profile completion % with a horizontal progress bar (blue, not green)
- Show a "Редактировать профиль" button that links to /onboarding
- Show a section "Мои программы" with 3 dummy cards (programs saved to apply) - use border style like the landing ProgramGrid
- Show a section "Статистика" with 3 stats: "Просмотрено программ: 47", "Добавлено в план: 3", "Дней до ближайшего дедлайна: 12"
- Use framer-motion for fade-in animations (import { motion } from "framer-motion")
- The page should look PREMIUM and unique, NOT like a generic user profile
- Use monospace font for labels (font-mono-c text-[11px] uppercase)  
- Use Space Grotesk for headings (font-display font-bold)

Imports needed:
import { useEffect, useState } from "react";
import Navbar from "@/components/landing/Navbar";
import { motion } from "framer-motion";
import Link from "next/link";
import type { StudentProfileInput } from "@/lib/program-types";

Output ONLY the complete valid TSX file content. No explanations.
`;

  const profilePage = await callGPT(profilePagePrompt);
  
  // Ensure directory exists
  fs.mkdirSync("app/profile", { recursive: true });
  fs.writeFileSync("app/profile/page.tsx", profilePage);
  console.log("✅ Записан app/profile/page.tsx\n");

  // ─── 2. Fix SpinningSphere using Canvas (no DOM freeze) ───────────────────
  console.log("2️⃣ Генерирую SpinningSphere на canvas...");
  
  const spherePrompt = `
Create a Next.js "use client" component SpinningSphere.tsx for the file components/landing/SpinningSphere.tsx.

Requirements:
- Use HTML5 Canvas API (NOT DOM element manipulation, NOT requestAnimationFrame on div elements)
- Draw a 3D rotating sphere effect using canvas 2D context
- Words to display around the sphere (pick from): SYSTEM, NEURAL, QUANTUM, CYBER, VOID, NEXUS, HOLO, MATRIX, FLUX, SYNC, DATA, NODE, PULSE, AETHER, CORE, GRID, ECHO, WAVE, ZENITH, ARCHIVE, PROTOCOL, ORBIT, VECTOR, LOGIC, SYNAPSE
- Words should orbit the sphere in 3D using sin/cos math (golden angle distribution)
- Color: #1B3BFF for words closer to viewer, rgba with lower opacity for far words
- Background: transparent (canvas background should be clear)
- The container fills its parent (100% width and height)
- Font: bold 11px monospace uppercase
- Smooth rotation on both Y and X axis slowly
- Use useEffect with cleanup (cancelAnimationFrame) and useRef for canvas
- The component should be performant and NOT cause browser freezes
- Return a div with style={{width:"100%",height:"100%"}} containing only the canvas

Output ONLY the complete TSX file. No markdown, no explanations.
`;

  const sphereCode = await callGPT(spherePrompt);
  fs.writeFileSync("components/landing/SpinningSphere.tsx", sphereCode);
  console.log("✅ Записан components/landing/SpinningSphere.tsx\n");

  // ─── 3. Fix Sidebar to match landing design ───────────────────────────────
  console.log("3️⃣ Генерирую новый Sidebar в стиле лендинга...");

  const sidebarPrompt = `
Rewrite the Next.js "use client" Sidebar component for components/dashboard/Sidebar.tsx.

Current NAV items (keep exactly):
- /dashboard → Главная (Home icon)
- /dashboard/matches → Мои матчи (Star icon)  
- /dashboard/deadlines → Дедлайны (Calendar icon)
- /dashboard/applications → Мои заявки (ClipboardList icon)
- /dashboard/chat → AI-ассистент (Bot icon)

Design requirements (match landing page aesthetic, NOT green SaaS):
- Colors: background white #FFFFFF, border #D9D5CD, text #1A1A1A, accent #1B3BFF
- NO green colors anywhere - use #1B3BFF as the active/highlight color
- Sharp corners everywhere (no border-radius except for tiny details)
- Width: w-56 (224px)
- Active nav item: bg-[#1B3BFF] text-white
- Inactive nav item: hover:bg-[#F5F3EE] text-[#4A4A4A]
- Logo area: just show "POAM" in font-mono-c uppercase, linked to /
- User section: show first letter of name in a border box (not rounded), name + grade + school
- Bottom: Settings link → /dashboard/settings, and a "Профиль →" link → /profile
- Use font-mono-c (Space Mono) for nav labels (text-[11px] uppercase)
- Profile completion bar at bottom: use #1B3BFF color, not green

Imports to use:
import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Star, Calendar, ClipboardList, Bot, Settings } from "lucide-react";

Read profile from localStorage "missio_profile". Keep the calcCompletion function.

Output ONLY the complete valid TSX file. No markdown, no explanations.
`;

  const sidebarCode = await callGPT(sidebarPrompt);
  fs.writeFileSync("components/dashboard/Sidebar.tsx", sidebarCode);
  console.log("✅ Записан components/dashboard/Sidebar.tsx\n");

  console.log("🎉 Всё готово! Проверяй изменения.");
}

main().catch(console.error);
