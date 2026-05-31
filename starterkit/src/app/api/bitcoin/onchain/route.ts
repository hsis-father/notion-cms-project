import { NextResponse } from "next/server";

export async function GET() {
  try {
    const [hashRateRes, txCountRes, mempoolRes] = await Promise.all([
      fetch("https://blockchain.info/q/hashrate", { next: { revalidate: 600 } }),
      fetch("https://blockchain.info/q/24hrtransactioncount", { next: { revalidate: 300 } }),
      fetch("https://mempool.space/api/v1/statistics", { next: { revalidate: 60 } }),
    ]);

    const hashRate = await hashRateRes.text();
    const txCount = await txCountRes.text();
    let mempoolData = null;

    if (mempoolRes.ok) {
      mempoolData = await mempoolRes.json();
    }

    return NextResponse.json({
      hashRate: parseFloat(hashRate) / 1e9,
      txCount24h: parseInt(txCount),
      mempoolSize: mempoolData?.mempool_byte_size ?? 0,
      mempoolTxCount: mempoolData?.mempool_tx_count ?? 0,
    });
  } catch {
    return NextResponse.json({ error: "온체인 데이터를 가져오지 못했습니다." }, { status: 500 });
  }
}
