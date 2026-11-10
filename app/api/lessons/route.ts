import { NextResponse } from "next/server";

export async function GET() {
  try {
    const url = process.env.ZABU_API_LESSONS;

    if (!url) {
      return NextResponse.json(
        { error: "Не задан ZABU_API_LESSONS" },
        { status: 500 }
      );
    }

    const response = await fetch(url, {
      method: "GET",
      next: { revalidate: 3600 }, // кэш на час
      headers: { Accept: "application/json" },
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: "Не удалось получить уроки с сервера" },
        { status: response.status }
      );
    }

    const data = await response.json();
    const lessons = Array.isArray(data) ? data : data.lessons ?? [];

    return NextResponse.json(
      { success: true, lessons },
      {
        headers: {
          "Cache-Control":
            "public, s-maxage=3600, stale-while-revalidate=86400",
        },
      }
    );
  } catch (error) {
    console.error("Lessons API error:", error);

    return NextResponse.json(
      { error: "Ошибка подключения к API уроков" },
      { status: 500 }
    );
  }
}