// Правила ассистента + перебор провайдеров (fallback). Только серверный код.

export type Msg = { role: "user" | "assistant"; content: string };

export const SYSTEM_RULES = `Ты — дружелюбный ассистент.
- Отвечай на языке пользователя.
- Отвечай кратко и по делу.
- Если не знаешь ответа — честно скажи об этом.`;

type Provider = { name: string; url: string; key?: string; model: string };

function getProviders(): Provider[] {
  return [
    {
      name: "groq",
      url: "https://api.groq.com/openai/v1/chat/completions",
      key: process.env.ZABU_AI_GROQ ?? process.env.GROQ_API_KEY,
      model: process.env.GROQ_MODEL ?? "openai/gpt-oss-120b",
    },
    {
      name: "openrouter",
      url: "https://openrouter.ai/api/v1/chat/completions",
      key: process.env.OPENROUTER_API_KEY,
      model: process.env.OPENROUTER_MODEL ?? "openai/gpt-oss-120b",
    },
  ].filter((p) => p.key); // пропускаем провайдеров без ключа
}

export async function askAI(messages: Msg[]): Promise<string> {
  const providers = getProviders();
  if (providers.length === 0) throw new Error("Не задан ни один API-ключ");

  const errors: string[] = [];

  for (const p of providers) {
    try {
      const res = await fetch(p.url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${p.key}`,
        },
        body: JSON.stringify({
          model: p.model,
          messages: [{ role: "system", content: SYSTEM_RULES }, ...messages],
        }),
      });

      if (!res.ok) {
        errors.push(`${p.name}: HTTP ${res.status}`);
        continue; // пробуем следующего провайдера
      }

      const data = await res.json();
      const text = data?.choices?.[0]?.message?.content;
      if (text) return text;
      errors.push(`${p.name}: пустой ответ`);
    } catch (e) {
      errors.push(`${p.name}: ${(e as Error).message}`);
    }
  }

  throw new Error("Все провайдеры недоступны — " + errors.join("; "));
}