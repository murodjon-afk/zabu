import { NextResponse, connection } from "next/server";

const API_URL = process.env.ZABU_API_USER1;

export async function GET() {
  await connection();

  try {
    if (!API_URL) {
      throw new Error("ZABU_API_USER1 не настроен в .env.local");
    }

    const res = await fetch(API_URL, {
      cache: "no-store",
    });

    if (!res.ok) {
      return NextResponse.json(
        { error: "Не удалось получить пользователей" },
        { status: res.status }
      );
    }

    const users: Record<string, unknown>[] = await res.json();

    // Пароли на клиент не отдаём
    const safe = users.map(({ password, ...rest }) => rest);

    return NextResponse.json({ users: safe });

  } catch (e) {
    console.error("user/get ошибка:", e);

    return NextResponse.json(
      { error: "Ошибка сети" },
      { status: 500 }
    );
  }
}