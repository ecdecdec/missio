"""Запусти этот скрипт один раз чтобы пофиксить crew.py"""
from pathlib import Path

crew = Path("crew.py").read_text(encoding="utf-8")

# 1. Добавить импорт LLM
crew = crew.replace(
    "from crewai import Agent, Task, Crew, Process",
    "from crewai import Agent, Task, Crew, Process, LLM"
)

# 2. Добавить load_dotenv для обоих файлов
crew = crew.replace(
    'load_dotenv(".env.local")',
    'load_dotenv(".env")\nload_dotenv(".env.local", override=True)'
)

# 3. Добавить AZURE_LLM после AZURE_DEPLOYMENT
crew = crew.replace(
    'AZURE_DEPLOYMENT = os.getenv("AZURE_OPENAI_DEPLOYMENT", "gpt-5")',
    '''AZURE_DEPLOYMENT = os.getenv("AZURE_OPENAI_DEPLOYMENT", "gpt-5.1")

# LLM для агентов CrewAI
AZURE_LLM = LLM(
    model=f"azure/{AZURE_DEPLOYMENT}",
    base_url=os.getenv("AZURE_OPENAI_ENDPOINT"),
    api_key=os.getenv("AZURE_OPENAI_API_KEY"),
    api_version="2025-01-01-preview",
)'''
)

# 4. Добавить llm= в каждый агент
agents = [
    "Tech Lead & Orchestrator",
    "Design System Engineer", 
    "Landing Page Developer",
    "Dashboard & App Developer",
    "Backend & API Developer",
]

for role in agents:
    crew = crew.replace(
        f'    role="{role}",',
        f'    role="{role}",\n    llm=AZURE_LLM,'
    )

# 5. Убрать memory=True (требует OpenAI key)
crew = crew.replace(
    "    memory=True,  # агенты помнят контекст предыдущих задач",
    "    memory=False,  # отключено — требует OpenAI embeddings"
)

Path("crew.py").write_text(crew, encoding="utf-8")
print("✅ crew.py успешно пропатчен!")
print("Теперь запускай: python crew.py")
