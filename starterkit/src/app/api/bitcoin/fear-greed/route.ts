import { NextResponse } from "next/server";

export async function GET() {
  try {
    const res = await fetch("https://api.alternative.me/fng/?limit=30", {
      next: { revalidate: 3600 },
    });

    const data = await res.json();
    const list = data.data as Array<{ value: string; value_classification: string; timestamp: string }>;

    return NextResponse.json({
      current: {
        value: parseInt(list[0].value),
        classification: list[0].value_classification,
      },
      history: list.map((item) => ({
        value: parseInt(item.value),
        classification: item.value_classification,
        timestamp: parseInt(item.timestamp),
      })),
    });
  } catch {
    return NextResponse.json({ error: "공포탐욕지수를 가져오지 못했습니다." }, { status: 500 });
  }
}
