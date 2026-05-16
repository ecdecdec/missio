import os
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

page_path = PROJECT_PATH / "app/page.tsx"

# Read with latin-1 to handle any encoding
try:
    current = page_path.read_text(encoding="utf-8")
except:
    current = page_path.read_text(encoding="latin-1")

# Take only first 200 lines (clean part)
lines = current.splitlines()
clean = "\n".join(lines[:370])

print(f"Sending {len(clean.splitlines())} lines to GPT-5...")

response = CLIENT.responses.create(
    model=DEPLOYMENT,
    instructions="You are a senior React/Next.js developer. Complete truncated TSX. Return ONLY complete working code. No markdown. No explanations. Must end with: export default Home;",
    input=f"Complete this truncated Next.js page.tsx. Add proper closing tags, a simple Footer section, and export default. Keep all existing code intact:\n\n{clean}",
    max_output_tokens=3000,
)

fixed = response.output_text

# Remove any markdown fences if present
fixed = fixed.replace("```tsx", "").replace("```typescript", "").replace("```", "").strip()

page_path.write_text(fixed, encoding="utf-8")
print(f"Fixed! Lines: {len(fixed.splitlines())}")
print("Run: npm run dev")
