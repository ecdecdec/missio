import * as dotenv from "dotenv";
dotenv.config({ path: ".env" });
dotenv.config({ path: ".env.local", override: true });

import { azureChat } from "../lib/azure-openai";
import fs from "fs";
import { execSync } from "child_process";

const TARGET_COMPANIES = ["BI Group", "Kaspi", "Freedom Holding"];
const SEED_PEOPLE = [
  { name: "Marat Rakhimov", company: "BI Group" },
  { name: "Beibars Tusipbekov", company: "BI Group" },
  { name: "Diana Kadyrova", company: "BI Group" },
  { name: "Nazgul Sutemgenova", company: "BI Group" },
  { name: "Aisulu Karimbayeva", company: "BI Group" },
  { name: "Sultan Kenzhekhanov", company: "Kaspi" },
  { name: "Alan Aralbayev", company: "Kaspi" },
  { name: "Renat Tukanov", company: "Freedom Holding" },
  { name: "Zarina Kashkimbayeva", company: "Freedom Holding" },
  { name: "Viktoria Narmetova", company: "Freedom Holding" },
];

// Генерация людей
async function generateMorePeople(excludedNames: string[]) {
  const excludeStr = excludedNames.length > 0 ? `\n\nУЖЕ ПРОВЕРЕННЫЕ ИЛИ НЕ НУЖНЫЕ ЛЮДИ (ИХ НЕЛЬЗЯ ВКЛЮЧАТЬ В СПИСОК): ${excludedNames.join(", ")}` : "";
  
  const prompt = `Пожалуйста, составь список из 40 реальных, известных в Казахстане людей, которые могли бы стать ментором или взять на летнюю стажировку в Астане (июнь-август 2025) 16-летнего школьника из НИШ. 
Бэкграунд школьника: победитель олимпиад по математике, заработал $10k на арбитраже трафика, делает стартап Poam (матчит школьников с грантами и стажировками).

Кто нужен:
1. Рекрутеры, HR-директора из BI Group, Kaspi, Freedom, Jusan, Kolesa.
2. CTO, Tech Lead, Product Manager из тех же компаний.
3. Фаундеры сильных стартапов в КЗ (кроме Astana Hub).
4. Крупные венчурные инвесторы, бизнес-ангелы (MOST Ventures, QazAngels и др.).
5. Авторы популярных Telegram-каналов про IT, бизнес и карьеру в КЗ.

ВАЖНОЕ ПРАВИЛО: СТРОГО ИСКЛЮЧИТЬ ЛЮБЫХ ЛЮДЕЙ ИЗ ASTANA HUB (например, Магжана Мадиева и всех, кто там работает). Школьник считает, что уровень там слабый, и ищет менторов только из топового корпоративного и венчурного сектора. Обязательно включи реальных людей (Alim Khamitov, Assem Nurgaliyeva и других топ-менеджеров из Kaspi/Jusan/Freedom/Kolesa).${excludeStr}

Return the response strictly as a JSON object with a single key "people", containing an array of objects. Each object must have: "name" (string), "title" (string), "company" (string), "reason" (string - why they are useful for this student in 1 short sentence). Do not return an empty array.`;

  const response = await azureChat({
    messages: [
      { role: "system", content: "You are a helpful data assistant. Output ONLY valid JSON." },
      { role: "user", content: prompt }
    ],
    responseFormat: { type: "json_object" }
  });

  try {
    let cleanResp = response.trim();
    if (cleanResp.startsWith("```json")) {
      cleanResp = cleanResp.replace(/^```json/, "").replace(/```$/, "");
    }
    const data = JSON.parse(cleanResp);
    console.log("GPT raw JSON parsed:", JSON.stringify(data, null, 2));
    
    // Sometimes the model returns { "people": [...] } or just [...]
    let peopleArray = [];
    if (Array.isArray(data)) {
      peopleArray = data;
    } else if (data.people && Array.isArray(data.people)) {
      peopleArray = data.people;
    } else {
      // Find any array inside the object
      for (const key of Object.keys(data)) {
        if (Array.isArray(data[key])) {
          peopleArray = data[key];
          break;
        }
      }
    }
    
    console.log(`GPT returned ${peopleArray.length} people.`);
    return peopleArray;
  } catch (e) {
    console.error("Failed to parse GPT response. Raw response was:", response.substring(0, 500));
    console.error("Error:", e);
    return [];
  }
}

// Поиск через Yahoo (без жестких капч)
async function searchYahoo(query: string) {
  try {
    const res = await fetch(`https://search.yahoo.com/search?p=${encodeURIComponent(query)}`, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
      }
    });
    const html = await res.text();
    // Удаляем скрипты и стили
    let text = html.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, ' ');
    text = text.replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, ' ');
    // Оставляем текст
    text = text.replace(/<[^>]*>?/gm, ' ').replace(/\s+/g, ' ');
    return text.substring(0, 15000);
  } catch (e) {
    return "";
  }
}

// Использование Azure GPT-5.1 для извлечения Telegram-юзернейма из результатов поиска
async function findTelegram(name: string, company: string, title: string) {
  const queries = [
    `"${name}" telegram -site:linkedin.com`,
    `"${name}" тг -site:linkedin.com`,
    `"${name}" @ -site:linkedin.com`,
    `site:t.me "${name}"`
  ];
  
  let combinedContext = "";
  for (const q of queries) {
    const results = await searchYahoo(q);
    combinedContext += `\nResults for query '${q}':\n${results}\n`;
    // Небольшая пауза, чтобы не забанили IP
    await new Promise(r => setTimeout(r, 1000));
  }
  
  console.log(`   [i] Search context length: ${combinedContext.length}`);
  
  const prompt = `Based on the following search results, find the public Telegram handle, Telegram channel link, or "@" username for ${name} (${title} at ${company}).
Return ONLY a JSON object with keys "telegram" (the handle with @ or link, or null if not found) and "source" (context or snippet where it was found, else null).
Search results context:
${combinedContext.substring(0, 30000)}
`;

  const response = await azureChat({
    messages: [
      { role: "system", content: "You are a data extractor. Output ONLY valid JSON." },
      { role: "user", content: prompt }
    ],
    responseFormat: { type: "json_object" }
  });
  
  try {
    return JSON.parse(response);
  } catch(e) {
    return { telegram: null, source: null };
  }
}

async function main() {
  console.log("🚀 Запуск поиска Telegram аккаунтов...");
  
  let foundCount = 0;
  const excludedNames: string[] = [];
  
  let markdown = "| Имя | Должность | Компания | Польза | Telegram | Источник |\n|---|---|---|---|---|---|\n";
  fs.writeFileSync("telegrams-result.md", markdown);
  
  while (foundCount < 30) {
    console.log(`\n1️⃣ Генерация людей через Azure GPT-5.1 (уже найдено: ${foundCount}/30)...`);
    const morePeople = await generateMorePeople(excludedNames);
    console.log(`✅ Сгенерировано ${morePeople.length} кандидатов.`);
    
    if (morePeople.length === 0) {
      console.log("GPT не смог сгенерировать больше людей. Завершаем работу.");
      break;
    }
    
    for (let i = 0; i < morePeople.length; i++) {
      if (foundCount >= 30) break;
      
      const p = morePeople[i];
      excludedNames.push(p.name);
      
      console.log(`⏳ [Найденных: ${foundCount}/30] Ищем Telegram для: ${p.name} (${p.company})...`);
      const tgInfo = await findTelegram(p.name, p.company, p.title);
      
      if (tgInfo.telegram && tgInfo.telegram !== "Не найдено" && tgInfo.telegram !== "null") {
        const tgStr = tgInfo.telegram;
        const srcStr = tgInfo.source ? tgInfo.source.substring(0, 100) : "-"; 
        
        const row = `| ${p.name} | ${p.title} | ${p.company} | ${p.reason || "-"} | ${tgStr} | ${srcStr} |\n`;
        markdown += row;
        
        fs.writeFileSync("telegrams-result.md", markdown);
        foundCount++;
        console.log(`   ➡️ Результат: ${tgStr} (Всего найдено: ${foundCount})`);
      } else {
        console.log(`   ➡️ Результат: Не найдено (пропущено)`);
      }
    }
  }
  
  console.log(`✅ Готово! Найдено ${foundCount} Telegram аккаунтов. Результаты в telegrams-result.md`);
}

main().catch(console.error);
