
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const API = process.env.ZABU_API_USER1;

    if (!API) {
      return NextResponse.json(
        { error: "ZABU_API_USER1 не задан" },
        { status: 500 }
      );
    }

    const body = await req.json();

    const email = String(body?.email ?? "")
      .trim()
      .toLowerCase();

    // Получаем введённый пользователем пароль
    const password = String(body?.password ?? "");

    // Проверка email
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { error: "Введите корректный email" },
        { status: 400 }
      );
    }

    // Проверка пароля
    if (password.length < 8) {
      return NextResponse.json(
        { error: "Пароль должен содержать минимум 8 символов" },
        { status: 400 }
      );
    }

    // Проверяем существование пользователя
    const check = await fetch(
      `${API}?email=${encodeURIComponent(email)}`,
      { cache: "no-store" }
    );

    if (!check.ok && check.status !== 404) {
      return NextResponse.json(
        { error: "Не удалось проверить пользователя" },
        { status: 502 }
      );
    }

    const users = check.ok ? await check.json() : [];

    const existingUser = Array.isArray(users)
      ? users.find(
          (u: { email?: string }) =>
            String(u.email ?? "").toLowerCase() === email
        )
      : null;

    // Не создаём дубликат
    if (existingUser) {
      return NextResponse.json(
        {
          error: "Пользователь с таким email уже существует",
          user: {
            id: existingUser.id,
            email: existingUser.email,
          },
        },
        { status: 409 }
      );
    }

    // Создаём пользователя
    const record = {
      namefull: body.namefull ?? "",
      email,

      status: body.status ?? "student",

      targetTongue: body.targetTongue ?? null,
      nativeTongue: body.nativeTongue ?? null,

      hw: body.hw ?? 0,
      lvl: body.lvl ?? null,

      wordsLearned: body.wordsLearned ?? 0,
      Scores: body.Scores ?? 0,
      lessonsComleted: body.lessonsComleted ?? 0,

      script: body.script ?? null,

      // Пароль без преобразования
      password: password,

      coins: body.coins ?? 0,
    };

    const created = await fetch(API, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(record),
    });

    if (!created.ok) {
      return NextResponse.json(
        { error: "Не удалось создать пользователя" },
        { status: 502 }
      );
    }

    const user = await created.json();

    // Не возвращаем пароль браузеру
    const {
      password: _password,
      ...safeUser
    } = user;

    return NextResponse.json(
      {
        user: safeUser,
        created: true,
      },
      { status: 201 }
    );

  } catch (error) {
    console.error("Registration error:", error);

    return NextResponse.json(
      { error: "Внутренняя ошибка сервера" },
      { status: 500 }
    );
  }
}
