import os
import time
from pathlib import Path
from dotenv import load_dotenv
from openai import AzureOpenAI

load_dotenv(".env")
load_dotenv(".env.local", override=True)

PROJECT_PATH = Path(os.getenv("PROJECT_PATH", "./"))
API_KEY = os.getenv("AZURE_OPENAI_API_KEY")
ENDPOINT = "https://ai-meirkhan26077696ai904311294957.openai.azure.com/"
DEPLOYMENT = "gpt-5.1"

CLIENT = AzureOpenAI(
    api_key=API_KEY,
    azure_endpoint=ENDPOINT,
    api_version="2025-03-01-preview",
)

SYSTEM = "You are a senior full-stack developer writing code for Missio, a platform for Kazakhstan students. Stack: Next.js 16, React 19, TypeScript, Tailwind CSS 4, Framer Motion. Design tokens: primary #1D9E75, bg #F9F8F6, text #1A1A18, Instrument Serif display font, Onest body font. Reply ONLY with clean code. No explanations. No markdown fences."

def ask(prompt):
    print("  Generating...")
    response = CLIENT.responses.create(
        model=DEPLOYMENT,
        instructions=SYSTEM,
        input=prompt,
        max_output_tokens=4000,
    )
    return response.output_text

def write(path, content):
    full = PROJECT_PATH / path
    full.parent.mkdir(parents=True, exist_ok=True)
    full.write_text(content, encoding="utf-8")
    print("  Written: " + path)

def task(name, file_path, prompt):
    print("\n[" + name + "]")
    code = ask(prompt)
    write(file_path, code)
    time.sleep(2)

print("Missio Agent started")
print("Project: " + str(PROJECT_PATH.absolute()))
print("="*50)

task("globals.css", "app/globals.css",
"Write app/globals.css for Next.js 16 Tailwind 4. Include: @import Google Fonts Instrument Serif and Onest. @import tailwindcss. @theme with --color-primary #1D9E75 --color-bg #F9F8F6 --color-text #1A1A18 --font-display and --font-body. Base body and heading styles. @keyframes fadeUp fadeIn marquee. Utility classes .display-xl .display-lg .label .animate-marquee.")

task("Button", "components/ui/Button.tsx",
"Write components/ui/Button.tsx. Props: variant (primary|secondary|ghost), size (sm|md|lg), children, onClick, className, disabled, type. primary: bg #1D9E75 white text hover #0F6E56 rounded-full. secondary: border rounded-full hover bg #F1EFE8. ghost: transparent hover #F1EFE8. Framer Motion whileHover scale 1.02 whileTap 0.98. TypeScript default export.")

task("Card", "components/ui/Card.tsx",
"Write components/ui/Card.tsx. Props: variant (default|elevated|accent), children, className, onClick. default: white bg border 1px rgba(0,0,0,0.08) rounded-2xl p-5. elevated: +shadow. accent: +border-left 3px #1D9E75. Hover translateY(-4px). Framer Motion mount animation opacity y. TypeScript default export.")

task("Badge", "components/ui/Badge.tsx",
"Write components/ui/Badge.tsx. Props: variant (green|amber|blue|coral|gray), children, className. Colors: green bg #E1F5EE text #0F6E56, amber bg #FAEEDA text #854F0B, blue bg #E6F1FB text #185FA5, coral bg #FAECE7 text #993C1D, gray bg #F1EFE8 text #5F5E5A. All: rounded-full px-3 py-1 text-xs font-medium. TypeScript default export.")

task("Input", "components/ui/Input.tsx",
"Write components/ui/Input.tsx. Props: label, helperText, error boolean, errorMessage, placeholder, value, onChange, type, disabled, className. Normal border 1px rgba(0,0,0,0.12) rounded-xl. Focus border #1D9E75. Error border #E24B4A. use client directive. TypeScript default export.")

task("Navbar", "components/layout/Navbar.tsx",
"Write components/layout/Navbar.tsx. Fixed top-0 z-50 full-width. Blur backdrop on scroll >50px via useEffect useState. Logo: Missi + green span o in Instrument Serif. Nav links in Russian: Programmy Kak-rabotaet Dlya-organizaciy. Right buttons: ghost Войти + primary green Начать-бесплатно. Mobile hamburger with useState. use client. TypeScript default export.")

task("Landing page", "app/page.tsx",
"Write app/page.tsx Missio landing. use client. Import Navbar. Sections: 1) Navbar 2) Hero min-h-screen grid 60/40 with Instrument Serif heading in Russian about grants and internships + italic green span + email form + Framer Motion stagger + right side card mockup with CSS animation 3) Marquee bar bg #F1EFE8 with school names scrolling 4) Problem section two mockups side by side 5) How it works 3 steps in Russian 6) B2B section dark bg #1A1A18 with metrics 7) Footer. TypeScript default export.")

task("Match API", "app/api/match/route.ts",
"Write app/api/match/route.ts Next.js 16 App Router POST endpoint. Accepts studentProfile and programs. Uses @anthropic-ai/sdk claude-sonnet-4-20250514 model. Returns matches array with programId score reasons warnings. TypeScript.")

task("Types", "lib/types.ts",
"Write lib/types.ts TypeScript types for Missio. Export: StudentProfile Program Match Application interfaces. Program type union. Application status union. AlertChannel ProgramType types.")

print("\n" + "="*50)
print("Done!")
for f in sorted(PROJECT_PATH.rglob("*")):
    if f.is_file() and "node_modules" not in str(f) and ".next" not in str(f) and ".git" not in str(f):
        rel = str(f.relative_to(PROJECT_PATH))
        if any(rel.startswith(p) for p in ["app/", "components/", "lib/"]):
            print("  " + rel)
print("\nNext: npm run dev")
