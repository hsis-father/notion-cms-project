import { NextResponse } from "next/server";

export async function GET() {
  try {
    const [priceRes, globalRes] = await Promise.all([
      fetch(
        "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd&include_24hr_change=true&include_market_cap=true&include_24hr_vol=true",
        { next: { revalidate: 60 } }
      ),
      fetch("https://api.coingecko.com/api/v3/global", {
        next: { revalidate: 300 },
      }),
    ]);

    const priceData = await priceRes.json();
    const globalData = await globalRes.json();

    const bitcoin = priceData.bitcoin;

    return NextResponse.json({
      price: bitcoin.usd,
      change24h: bitcoin.usd_24h_change,
      marketCap: bitcoin.usd_market_cap,
      volume24h: bitcoin.usd_24h_vol,
      btcDominance: globalData.data?.market_cap_percentage?.btc ?? 0,
    });
  } catch {
    return NextResponse.json({ error: "데이터를 가져오지 못했습니다." }, { status: 500 });
  }
}
