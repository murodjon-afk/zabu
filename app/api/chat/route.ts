import { NextResponse } from "next/server";
import { askAI, type Msg } from "@/lib/ai";

export async function POST(req: Request) {
  try {
    const { messages } = (await req.json()) as { messages: Msg[] };

    if (!Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ error: "Нет сообщений" }, { status: 400 });
    }

    // берём только последние 20 сообщений и обрезаем длину
    const safe = messages.slice(-20).map((m) => ({
      role: m.role === "assistant" ? "assistant" : "user",
      content: String(m.content).slice(0, 4000),
    })) as Msg[];

    const reply = await askAI(safe);
    return NextResponse.json({ reply });
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}