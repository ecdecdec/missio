import os
from pathlib import Path
from dotenv import load_dotenv
from openai import AzureOpenAI

load_dotenv(".env")
load_dotenv(".env.local", override=True)

PROJECT_PATH = Path(os.getenv("PROJECT_PATH", "./"))
CLIENT = AzureOpenAI(
    api_key=os.getenv("AZURE_OPENAI_API_KEY"),
    azure_endpoint="https://ai-meirkhan26077696ai904311294957.openai.azure.com/",
    api_version="2025-03-01-preview",
)

print("Regenerating app/page.tsx in English only...")

response = CLIENT.responses.create(
    model="gpt-5.1",
    instructions="Senior Next.js developer. Write clean TypeScript React code. Use ONLY ASCII characters and English text. No Cyrillic, no Unicode special chars. Return ONLY code, no markdown.",
    input="""Write a complete app/page.tsx for Missio - a grant and internship matching platform for Kazakhstan students.

USE ONLY ENGLISH TEXT (no Russian/Cyrillic). Import Navbar from 'components/layout/Navbar'.

Structure:
1. Navbar
2. Hero section: heading 'Grants and Internships That Wait For You', subtitle, email form with green button, social proof text
3. How It Works: 3 steps - Fill Profile, AI Matches You, Get Alerts
4. Programs grid: 4 program cards with badge, name, deadline countdown
5. B2B section dark bg #1A1A18: heading 'Find Strong Applicants in Kazakhstan', 3 metrics, CTA button
6. Footer: logo + links + copyright

Use Tailwind classes. Framer Motion for animations. bg-[#F9F8F6] body, #1D9E75 primary green.
Must be complete valid TSX. Export default Home.""",
    max_output_tokens=3500,
)

code = response.output_text.replace("```tsx", "").replace("```typescript", "").replace("```", "").strip()

path = PROJECT_PATH / "app/page.tsx"
path.write_text(code, encoding="utf-8")
print(f"Done! {len(code.splitlines())} lines written.")
print("Run: npm run dev")
