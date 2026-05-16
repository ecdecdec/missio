"""
MISSIO — Agent Swarm
GPT-5 (Azure) пишет код, Claude (OpenRouter) планирует и ревьюит.

Запуск:
  pip install crewai crewai-tools anthropic openai python-dotenv
  python crew.py

Нужные env переменные (в .env.local или экспортом):
  AZURE_OPENAI_API_KEY=...
  AZURE_OPENAI_ENDPOINT=https://YOUR_RESOURCE.openai.azure.com/
  AZURE_OPENAI_DEPLOYMENT=gpt-5  (или как назвал деплоймент)
  OPENROUTER_API_KEY=...
  PROJECT_PATH=./  (путь к папке missio next.js проекта)
"""

import os
import subprocess
from pathlib import Path
from dotenv import load_dotenv

from crewai import Agent, Task, Crew, Process, LLM
from crewai.tools import tool
from openai import AzureOpenAI
import anthropic

load_dotenv(".env")
load_dotenv(".env.local", override=True)

# ─────────────────────────────────────────────
# КОНФИГИ
# ─────────────────────────────────────────────

PROJECT_PATH = Path(os.getenv("PROJECT_PATH", "./"))

AZURE_CLIENT = AzureOpenAI(
    api_key=os.getenv("AZURE_OPENAI_API_KEY"),
    azure_endpoint=os.getenv("AZURE_OPENAI_ENDPOINT"),
    api_version="2025-01-01-preview",
)
AZURE_DEPLOYMENT = os.getenv("AZURE_OPENAI_DEPLOYMENT", "gpt-5.1")

# LLM для агентов CrewAI
os.environ["AZURE_API_KEY"] = os.getenv("AZURE_OPENAI_API_KEY", "")
os.environ["AZURE_API_BASE"] = "https://ai-meirkhan26077696ai904311294957.openai.azure.com/"
os.environ["AZURE_API_VERSION"] = "2024-12-01-preview"

AZURE_LLM = LLM(
    model="azure/gpt-5.1",
)

ANTHROPIC_CLIENT = anthropic.Anthropic(
    base_url="https://openrouter.ai/api/v1",
    api_key=os.getenv("OPENROUTER_API_KEY"),
)

# ─────────────────────────────────────────────
# ИНСТРУМЕНТЫ
# ─────────────────────────────────────────────

@tool("write_file")
def write_file(path: str, content: str) -> str:
    """Записывает файл в проект. path — относительный путь от корня проекта."""
    full_path = PROJECT_PATH / path
    full_path.parent.mkdir(parents=True, exist_ok=True)
    full_path.write_text(content, encoding="utf-8")
    return f"✅ Записан: {path} ({len(content)} символов)"

@tool("read_file")
def read_file(path: str) -> str:
    """Читает файл из проекта."""
    full_path = PROJECT_PATH / path
    if not full_path.exists():
        return f"❌ Файл не найден: {path}"
    return full_path.read_text(encoding="utf-8")

@tool("list_files")
def list_files(directory: str = "") -> str:
    """Показывает список файлов в директории проекта."""
    target = PROJECT_PATH / directory
    if not target.exists():
        return f"❌ Директория не найдена: {directory}"
    files = []
    for f in sorted(target.rglob("*")):
        if f.is_file() and "node_modules" not in str(f) and ".next" not in str(f):
            files.append(str(f.relative_to(PROJECT_PATH)))
    return "\n".join(files[:100])

@tool("run_build")
def run_build() -> str:
    """Запускает npm run build и возвращает ошибки если есть."""
    result = subprocess.run(
        ["npm", "run", "build"],
        capture_output=True,
        text=True,
        cwd=PROJECT_PATH,
        timeout=120,
    )
    if result.returncode == 0:
        return "✅ Build успешен"
    return f"❌ Build ошибки:\n{result.stderr[-3000:]}"

@tool("run_lint")
def run_lint() -> str:
    """Запускает eslint и возвращает предупреждения."""
    result = subprocess.run(
        ["npm", "run", "lint"],
        capture_output=True,
        text=True,
        cwd=PROJECT_PATH,
        timeout=60,
    )
    output = result.stdout + result.stderr
    return output[-2000:] if output else "✅ Lint чист"

@tool("gpt5_code")
def gpt5_code(prompt: str) -> str:
    """
    Вызывает GPT-5 через Azure для генерации кода.
    Используй для написания компонентов, страниц, API роутов.
    prompt — детальное описание что нужно написать.
    """
    response = AZURE_CLIENT.chat.completions.create(
        model=AZURE_DEPLOYMENT,
        messages=[
            {
                "role": "system",
                "content": """Ты senior full-stack разработчик.
Пишешь код для Missio — платформы для школьников КЗ (гранты, стажировки, олимпиады).

Стек: Next.js 16, React 19, TypeScript, Tailwind CSS 4, Framer Motion, Supabase, Anthropic SDK.

Дизайн-система:
- Fonts: Instrument Serif (display) + Onest (body) — import из Google Fonts
- Primary color: #1D9E75 (green)
- Neutral: #1A1A18 (text), #F9F8F6 (bg), #F1EFE8 (bg-secondary)
- Border radius: rounded-2xl для карточек, rounded-full для кнопок/бейджей
- Анимации: Framer Motion fadeUp, stagger, scaleIn

Правила:
- Всегда TypeScript с типами
- Tailwind классы, не inline styles
- 'use client' только когда нужны хуки/события
- Красивый production-ready код
- Комментарии на русском для сложных мест
- Отвечай ТОЛЬКО кодом без объяснений, без markdown блоков"""
            },
            {"role": "user", "content": prompt}
        ],
        max_tokens=4000,
        temperature=0.3,
    )
    return response.choices[0].message.content

@tool("claude_review")
def claude_review(code: str, context: str = "") -> str:
    """
    Отправляет код на ревью Claude через OpenRouter.
    Возвращает список проблем и улучшений.
    """
    response = ANTHROPIC_CLIENT.messages.create(
        model="anthropic/claude-sonnet-4-5",
        max_tokens=1500,
        system="""Ты senior code reviewer для проекта Missio (Next.js 16, React 19, TypeScript, Tailwind 4).

Проверяй:
1. TypeScript ошибки и missing types
2. React best practices (hooks rules, missing keys, etc)
3. Tailwind 4 синтаксис (НЕ использует устаревший v3 синтаксис)
4. Framer Motion правильное использование
5. Accessibility (aria labels, semantic HTML)
6. Performance (unnecessary re-renders, missing memo)
7. Соответствие дизайн-системе Missio (цвета, шрифты, анимации)

Отвечай кратко. Формат:
ПРОБЛЕМЫ:
- [критично] описание
- [важно] описание  
- [мелко] описание

ИТОГ: [готово к деплою / нужны правки]""",
        messages=[{
            "role": "user",
            "content": f"Контекст: {context}\n\nКод для ревью:\n{code[:6000]}"
        }]
    )
    return response.content[0].text

# ─────────────────────────────────────────────
# АГЕНТЫ
# ─────────────────────────────────────────────

# Оркестратор — планирует и координирует
orchestrator = Agent(
    role="Tech Lead & Orchestrator",
    llm=AZURE_LLM,
    goal="""Спланировать и скоординировать разработку Missio.
    Разбить работу на чёткие задачи, убедиться что агенты не конфликтуют,
    финально проверить что всё собирается.""",
    backstory="""Ты опытный tech lead который строил продукты уровня Qapp и ScholarshipOwl.
    Понимаешь архитектуру Next.js 16 App Router, знаешь как разбить большой проект
    на независимые задачи которые можно писать параллельно.""",
    tools=[list_files, read_file, run_build, claude_review],
    verbose=True,
    allow_delegation=True,
)

# Дизайн-система агент
design_agent = Agent(
    role="Design System Engineer",
    llm=AZURE_LLM,
    goal="""Создать полную дизайн-систему Missio: globals.css с токенами,
    базовые компоненты (Button, Card, Badge, Input, Modal), layout компоненты.""",
    backstory="""Специализируешься на дизайн-системах. Делал системы для Apple, Linear, Vercel.
    Знаешь Tailwind 4 (новый синтаксис с @theme), Framer Motion, CSS переменные.
    Твой код — образец чистоты и красоты.""",
    tools=[write_file, read_file, gpt5_code, claude_review],
    verbose=True,
)

# Лендинг агент
landing_agent = Agent(
    role="Landing Page Developer",
    llm=AZURE_LLM,
    goal="""Создать убийственную главную страницу Missio которая лучше чем Qapp.
    Hero секция, How It Works, Programme Grid, B2B секция, Footer.
    Анимации через Framer Motion. Полная мобильная адаптация.""",
    backstory="""Ты делал лендинги для Y Combinator стартапов и крупных SaaS продуктов.
    Понимаешь как сделать Hero который цепляет, как показать продукт через живые мокапы,
    как использовать Framer Motion для stagger анимаций при скролле.""",
    tools=[write_file, read_file, gpt5_code, claude_review],
    verbose=True,
)

# Дашборд агент  
dashboard_agent = Agent(
    role="Dashboard & App Developer",
    llm=AZURE_LLM,
    goal="""Создать внутренние страницы платформы: онбординг (4 шага),
    дашборд с sidebar, страницу программы, трекер заявок (kanban).""",
    backstory="""Специализируешься на сложных SaaS интерфейсах.
    Делал дашборды для Notion, Linear, Vercel. Знаешь как сделать
    многошаговые формы, kanban доски, sidebar навигацию.""",
    tools=[write_file, read_file, gpt5_code, claude_review],
    verbose=True,
)

# API агент
api_agent = Agent(
    role="Backend & API Developer",
    llm=AZURE_LLM,
    goal="""Создать все API роуты: матчинг через Claude AI,
    чат-ассистент, генерация алертов, Supabase интеграция.""",
    backstory="""Senior backend разработчик. Специализируешься на Next.js API routes,
    интеграции с AI API (Anthropic, OpenAI), Supabase.
    Пишешь чистый TypeScript с proper error handling и валидацией через Zod.""",
    tools=[write_file, read_file, gpt5_code, claude_review],
    verbose=True,
)

# ─────────────────────────────────────────────
# ЗАДАЧИ
# ─────────────────────────────────────────────

DESIGN_SYSTEM_BRIEF = """
Создай дизайн-систему для Missio. Нужно написать эти файлы:

1. app/globals.css — полная дизайн-система:
   - @import Google Fonts (Instrument Serif, Onest)
   - @theme блок с CSS переменными (Tailwind 4 синтаксис)
   - Базовые стили body, h1-h6, a
   - Анимации: fadeUp, fadeIn, slideIn keyframes
   - Утилити классы: .display-xl, .display-lg, .label

2. components/ui/Button.tsx — кнопка с вариантами:
   - primary (зелёный, rounded-full)
   - secondary (border, rounded-full)
   - ghost (прозрачный)
   - Framer Motion whileHover/whileTap
   - TypeScript props с size и variant

3. components/ui/Card.tsx — карточка:
   - default, elevated, accent варианты
   - hover эффект (translateY -4px)
   - Framer Motion анимация при появлении

4. components/ui/Badge.tsx — бейдж:
   - варианты: green, amber, blue, coral, gray
   - маленький, pill форма

5. components/ui/Input.tsx — инпут:
   - focus ring зелёный
   - error state красный
   - label + helper text

6. components/layout/Navbar.tsx — навбар:
   - Missio лого (Instrument Serif + зелёная точка)
   - Links: Программы, Как работает, Для организаций
   - Кнопки: Войти (ghost) + Начать бесплатно (primary)
   - blur backdrop при скролле > 50px
   - Мобильное меню (hamburger)

Цвета: primary #1D9E75, bg #F9F8F6, text #1A1A18, border rgba(0,0,0,0.08)
"""

LANDING_BRIEF = """
Создай главную страницу Missio app/page.tsx.

ВАЖНО: Импортируй компоненты из components/ui/ и components/layout/

Секции в порядке:

1. <Navbar /> — импорт из components/layout/Navbar

2. Hero Section:
   - Асимметричный layout: текст слева (60%), мокап справа (40%)
   - Заголовок Instrument Serif 72px: "Гранты и стажировки, которые ждут тебя"
   - слово "ждут тебя" курсивом зелёным цветом
   - Подзаголовок Onest 18px серый
   - Форма: email input + кнопка "Получить доступ →"
   - Под формой: "Бесплатно · 312 школьников уже ждут"
   - Справа: анимированная карточка алерта (CSS анимация slide-up)
   - Framer Motion stagger для появления элементов

3. Marquee Bar:
   - Серый фон, бесконечный скролл логотипов школ
   - НИШ Алматы, НИШ Астана, БИЛ, Haileybury, Мектеп-лицей...
   - CSS animation для бесконечного движения

4. Problem Section:
   - Заголовок: "Узнаёшь о гранте за 2 дня до дедлайна?"
   - Два мокапа рядом: чат (красный) vs алерт Missio (зелёный)
   - Большая стрелка между ними

5. How It Works:
   - 3 шага горизонтально с номерами 01, 02, 03
   - Иконки из lucide-react
   - Hover эффект на каждом шаге

6. Programs Grid:
   - Заголовок + фильтры [Все][Гранты][Стажировки][Олимпиады]
   - 6 карточек программ в сетке 3x2
   - Каждая карточка: бейдж типа, название, дедлайн, countdown
   - Кнопка "Смотреть все 200+ программ →"

7. B2B Section:
   - Тёмный фон (#1A1A18)
   - 3 метрики: 3000+ школьников, 94% точность, 2 нед время
   - CTA кнопка белая

8. <Footer /> — создай в components/layout/Footer.tsx

Используй 'use client' для интерактивных элементов.
Framer Motion useInView для анимаций при скролле.
"""

DASHBOARD_BRIEF = """
Создай внутренние страницы приложения:

1. app/onboarding/page.tsx — 4-шаговый онбординг:
   - Прогресс бар сверху (4 шага)
   - Шаг 1: Школа, город, класс (8-11), имя
   - Шаг 2: Предметы (мультиселект), уровень английского, достижения
   - Шаг 3: Типы программ (мультиселект), страны интереса
   - Шаг 4: Канал алертов (WhatsApp/Telegram/Email), частота
   - Framer Motion AnimatePresence для перехода между шагами
   - useState для хранения данных формы

2. app/dashboard/layout.tsx — layout с sidebar:
   - Sidebar 240px: аватар, навигация, прогресс профиля
   - Main content area
   - Mobile: sidebar скрыт, hamburger меню

3. app/dashboard/page.tsx — главный дашборд:
   - Приветствие с именем
   - 4 матча (горизонтальный скролл карточек)
   - Каждая карточка: название, совместимость (прогресс бар), дедлайн
   - Deadline tracker: списки по срочности (красный/жёлтый/зелёный)
   - AI чат блок с быстрыми кнопками

4. app/dashboard/applications/page.tsx — kanban трекер:
   - 4 колонки: Планирую, Пишу заявку, Отправил, Результат
   - Drag-and-drop через @hello-pangea/dnd (добавь в package.json)
   - Карточки с названием, дедлайном, прогрессом документов

5. components/program/ProgramCard.tsx — карточка программы:
   - Бейдж типа (цвет по типу)
   - Название + организация
   - Countdown до дедлайна (useEffect для таймера)
   - Прогресс бар дедлайна (красный < 7 дней, жёлтый < 21, зелёный)
   - Совместимость в процентах
   - Hover: translateY -4px

6. components/dashboard/AIChat.tsx — чат компонент:
   - Быстрые кнопки (4 штуки)
   - История сообщений (useState)
   - Input + кнопка отправки
   - Стримящийся ответ (typewriter эффект)
   - Вызов /api/chat
"""

API_BRIEF = """
Создай API роуты для Missio:

1. app/api/match/route.ts — AI матчинг:
   POST { studentProfile, programs[] }
   - Вызывает Anthropic claude-sonnet-4-20250514
   - System prompt: матчинг школьника с программами
   - Возвращает { matches: [{ programId, score, reasons[], warnings[] }] }
   - Zod валидация входных данных
   - Error handling с proper HTTP статусами

2. app/api/chat/route.ts — AI чат ассистент:
   POST { messages[], studentProfile }
   - Стриминг через StreamingTextResponse
   - System prompt включает профиль школьника
   - Знает о программах, помогает с эссе и мотивационными письмами
   - Использует anthropic SDK stream

3. app/api/alert/generate/route.ts — генерация алерта:
   POST { student, program, score }
   - Claude генерирует персональный текст алерта
   - Возвращает { message: string }

4. lib/anthropic.ts — Anthropic клиент:
   - Создаёт и экспортирует клиент
   - Читает ANTHROPIC_API_KEY из env

5. lib/supabase.ts — Supabase клиенты:
   - createClient для браузера
   - createServerClient для серверных компонентов
   - Типы из database.types.ts

6. lib/types.ts — TypeScript типы:
   - StudentProfile интерфейс
   - Program интерфейс
   - Match интерфейс
   - Application интерфейс (канбан статусы)
   - AlertChannel тип

7. app/api/programs/route.ts — получение программ:
   GET /api/programs?type=grant&limit=6
   - Возвращает mock данные (20 реальных программ КЗ)
   - Включи: FLEX, Болашак Youth, MIT PRIMES, Science Olympiad,
     Deutsche Schülerakademie, YES Program, DAAD, Erasmus+,
     Chevening (для будущих), AIESEC, Nazarbayev University гранты
   - Каждая с дедлайном, требованиями, описанием на русском
"""

# ─────────────────────────────────────────────
# ЗАДАЧИ
# ─────────────────────────────────────────────

task_design = Task(
    description=DESIGN_SYSTEM_BRIEF,
    agent=design_agent,
    expected_output="Все файлы дизайн-системы созданы и прошли ревью Claude. Нет TypeScript ошибок.",
)

task_landing = Task(
    description=LANDING_BRIEF,
    agent=landing_agent,
    expected_output="app/page.tsx создан. Все секции реализованы. Анимации работают. Мобильная адаптация есть.",
    context=[task_design],
)

task_dashboard = Task(
    description=DASHBOARD_BRIEF,
    agent=dashboard_agent,
    expected_output="Онбординг, дашборд, kanban созданы. Все компоненты типизированы. Нет ошибок.",
    context=[task_design],
)

task_api = Task(
    description=API_BRIEF,
    agent=api_agent,
    expected_output="Все API роуты созданы. Zod валидация. Anthropic и Supabase интеграции работают.",
    context=[task_design],
)

task_final = Task(
    description="""
    Финальная проверка проекта:
    1. Запусти run_build и убедись что нет ошибок
    2. Запусти run_lint
    3. Прочитай ключевые файлы и убедись что всё связано
    4. Если есть ошибки — исправь их
    5. Создай PROGRESS.md с отчётом что сделано
    
    PROGRESS.md должен содержать:
    - Список созданных файлов
    - Что работает
    - Что нужно доделать вручную (Supabase настройка, env переменные)
    - Команды для запуска
    """,
    agent=orchestrator,
    expected_output="Build успешен. PROGRESS.md создан с полным отчётом.",
    context=[task_design, task_landing, task_dashboard, task_api],
)

# ─────────────────────────────────────────────
# ЗАПУСК
# ─────────────────────────────────────────────

crew = Crew(
    agents=[orchestrator, design_agent, landing_agent, dashboard_agent, api_agent],
    tasks=[task_design, task_landing, task_dashboard, task_api, task_final],
    process=Process.sequential,  # последовательно чтобы не конфликтовали файлы
    verbose=True,
    memory=False,  # отключено — требует OpenAI embeddings
)

if __name__ == "__main__":
    print("🚀 Missio Agent Swarm запущен")
    print("=" * 50)
    print(f"📁 Проект: {PROJECT_PATH.absolute()}")
    print(f"🤖 GPT-5 Azure: пишет код")
    print(f"🧠 Claude: планирует и ревьюит")
    print("=" * 50)
    print("⏱️  Ожидаемое время: 6-8 часов")
    print("=" * 50)

    result = crew.kickoff()

    print("\n" + "=" * 50)
    print("✅ Swarm завершил работу")
    print("=" * 50)
    print(result)
