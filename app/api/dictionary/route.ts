
import { connection, NextRequest, NextResponse } from "next/server";
const LANGUAGE_CODES: Record<string, string> = {
  tajik: "tjk",
  farsi: "far",
  russian: "rus",
  english: "eng",
};

export async function GET(request: NextRequest) {
  await connection();

  try {
    const tongue = request.nextUrl.searchParams.get("lang");
    const languageCode = tongue ? LANGUAGE_CODES[tongue.toLowerCase()] : null;

    if (!languageCode) {
      return NextResponse.json(
        { error: "Неизвестный язык словаря" },
        { status: 400 }
      );
    }

    const baseUrl = process.env.ZABU_API_DICTIONARY;

    if (!baseUrl) {
      return NextResponse.json(
        { error: "Не задан ZABU_API_DICTIONARY" },
        { status: 500 }
      );
    }

    const response = await fetch(
      `${baseUrl.replace(/\/$/, "")}/${languageCode}`,
      {
        method: "GET",
        cache: "no-store",
        headers: {
          Accept: "application/json",
        },
      }
    );

    if (!response.ok) {
      return NextResponse.json(
        { error: "Не удалось получить слова с сервера" },
        { status: response.status }
      );
    }

    const data = await response.json();

    // Готовый словарь
    const dictionary = Array.isArray(data) ? data : data.words ?? [];

    return NextResponse.json({
      success: true,
      language: tongue,
      dictionary,
    });
  } catch (error) {
    console.error("Dictionary API error:", error);

    return NextResponse.json(
      { error: "Ошибка подключения к API словаря" },
      { status: 500 }
    );
  }
}
