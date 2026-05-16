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

# Read current broken file
page_path = PROJECT_PATH / "app/page.tsx"
current = page_path.read_text(encoding="utf-8")

print("Fixing app/page.tsx...")
print(f"Current lines: {len(current.splitlines())}")

response = CLIENT.responses.create(
    model=DEPLOYMENT,
    instructions="You are a senior React/Next.js developer. Fix truncated TSX code by completing it properly. Return ONLY the complete fixed code, no explanations, no markdown fences.",
    input=f"This TSX file is truncated and broken. Complete it properly by closing all open tags and adding any missing sections (B2B section and Footer). Return the COMPLETE fixed file:\n\n{current}",
    max_output_tokens=4000,
)

fixed = response.output_text
page_path.write_text(fixed, encoding="utf-8")
print(f"Fixed! New lines: {len(fixed.splitlines())}")
print("Now run: npm run dev")
