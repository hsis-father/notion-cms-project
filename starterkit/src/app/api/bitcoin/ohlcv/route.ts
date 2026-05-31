import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const days = searchParams.get("days") ?? "90";

  try {
    const res = await fetch(
      `https://api.coingecko.com/api/v3/coins/bitcoin/ohlc?vs_currency=usd&days=${days}`,
      { next: { revalidate: 300 } }
    );

    const raw: number[][] = await res.json();

    const data = raw.map(([time, open, high, low, close]) => ({
      time,
      open,
      high,
      low,
      close,
    }));

    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "OHLCV 데이터를 가져오지 못했습니다." }, { status: 500 });
  }
}
