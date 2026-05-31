export interface OHLCVData {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume?: number;
}

export interface RSIResult {
  value: number;
  signal: "oversold" | "neutral" | "overbought";
}

export interface MACDResult {
  macd: number;
  signal: number;
  histogram: number;
  trend: "bullish" | "bearish" | "neutral";
}

export interface BollingerBandsResult {
  upper: number;
  middle: number;
  lower: number;
  position: "above" | "near_upper" | "middle" | "near_lower" | "below";
  percentB: number;
}

export interface MAResult {
  ma7: number;
  ma30: number;
  ma200: number;
  trend: "bullish" | "bearish" | "neutral";
}

export interface PredictionScore {
  total: number;
  direction: "strong_buy" | "buy" | "neutral" | "sell" | "strong_sell";
  label: string;
  signals: SignalItem[];
}

export interface SignalItem {
  name: string;
  signal: "bullish" | "bearish" | "neutral";
  score: number;
  description: string;
}

function calculateEMA(data: number[], period: number): number[] {
  const k = 2 / (period + 1);
  const ema: number[] = [];

  let sum = 0;
  for (let i = 0; i < period; i++) {
    sum += data[i];
  }
  ema[period - 1] = sum / period;

  for (let i = period; i < data.length; i++) {
    ema[i] = data[i] * k + ema[i - 1] * (1 - k);
  }

  return ema;
}

export function calculateRSI(closes: number[], period = 14): RSIResult {
  if (closes.length < period + 1) {
    return { value: 50, signal: "neutral" };
  }

  let gains = 0;
  let losses = 0;

  for (let i = 1; i <= period; i++) {
    const change = closes[i] - closes[i - 1];
    if (change > 0) gains += change;
    else losses += Math.abs(change);
  }

  let avgGain = gains / period;
  let avgLoss = losses / period;

  for (let i = period + 1; i < closes.length; i++) {
    const change = closes[i] - closes[i - 1];
    const gain = change > 0 ? change : 0;
    const loss = change < 0 ? Math.abs(change) : 0;

    avgGain = (avgGain * (period - 1) + gain) / period;
    avgLoss = (avgLoss * (period - 1) + loss) / period;
  }

  const rs = avgLoss === 0 ? 100 : avgGain / avgLoss;
  const rsi = 100 - 100 / (1 + rs);

  let signal: RSIResult["signal"] = "neutral";
  if (rsi <= 30) signal = "oversold";
  else if (rsi >= 70) signal = "overbought";

  return { value: Math.round(rsi * 100) / 100, signal };
}

export function calculateMACD(
  closes: number[],
  fastPeriod = 12,
  slowPeriod = 26,
  signalPeriod = 9
): MACDResult {
  if (closes.length < slowPeriod + signalPeriod) {
    return { macd: 0, signal: 0, histogram: 0, trend: "neutral" };
  }

  const fastEMA = calculateEMA(closes, fastPeriod);
  const slowEMA = calculateEMA(closes, slowPeriod);

  const macdLine: number[] = [];
  for (let i = slowPeriod - 1; i < closes.length; i++) {
    macdLine.push(fastEMA[i] - slowEMA[i]);
  }

  const signalLine = calculateEMA(macdLine, signalPeriod);

  const lastMACD = macdLine[macdLine.length - 1];
  const lastSignal = signalLine[signalLine.length - 1];
  const histogram = lastMACD - lastSignal;

  let trend: MACDResult["trend"] = "neutral";
  if (lastMACD > lastSignal) trend = "bullish";
  else if (lastMACD < lastSignal) trend = "bearish";

  return {
    macd: Math.round(lastMACD * 100) / 100,
    signal: Math.round(lastSignal * 100) / 100,
    histogram: Math.round(histogram * 100) / 100,
    trend,
  };
}

export function calculateBollingerBands(
  closes: number[],
  period = 20,
  multiplier = 2
): BollingerBandsResult {
  if (closes.length < period) {
    const price = closes[closes.length - 1];
    return {
      upper: price,
      middle: price,
      lower: price,
      position: "middle",
      percentB: 50,
    };
  }

  const slice = closes.slice(-period);
  const sma = slice.reduce((a, b) => a + b, 0) / period;

  const variance =
    slice.reduce((sum, val) => sum + Math.pow(val - sma, 2), 0) / period;
  const stdDev = Math.sqrt(variance);

  const upper = sma + multiplier * stdDev;
  const lower = sma - multiplier * stdDev;
  const currentPrice = closes[closes.length - 1];

  const percentB = ((currentPrice - lower) / (upper - lower)) * 100;

  let position: BollingerBandsResult["position"] = "middle";
  if (currentPrice > upper) position = "above";
  else if (percentB >= 75) position = "near_upper";
  else if (percentB <= 25) position = "near_lower";
  else if (currentPrice < lower) position = "below";

  return {
    upper: Math.round(upper),
    middle: Math.round(sma),
    lower: Math.round(lower),
    position,
    percentB: Math.round(percentB * 100) / 100,
  };
}

export function calculateMovingAverages(closes: number[]): MAResult {
  const calcMA = (period: number) => {
    if (closes.length < period) return 0;
    const slice = closes.slice(-period);
    return slice.reduce((a, b) => a + b, 0) / period;
  };

  const ma7 = calcMA(7);
  const ma30 = calcMA(30);
  const ma200 = calcMA(200);
  const currentPrice = closes[closes.length - 1];

  let trend: MAResult["trend"] = "neutral";
  if (currentPrice > ma200 && ma7 > ma30) trend = "bullish";
  else if (currentPrice < ma200 && ma7 < ma30) trend = "bearish";

  return {
    ma7: Math.round(ma7),
    ma30: Math.round(ma30),
    ma200: Math.round(ma200),
    trend,
  };
}

export function calculatePrediction(
  rsi: RSIResult,
  macd: MACDResult,
  bb: BollingerBandsResult,
  ma: MAResult,
  fearGreedIndex: number
): PredictionScore {
  const signals: SignalItem[] = [];
  let totalScore = 0;

  // RSI 신호 (-25 ~ +25)
  let rsiScore = 0;
  let rsiSignal: SignalItem["signal"] = "neutral";
  let rsiDesc = "";

  if (rsi.signal === "oversold") {
    rsiScore = 25;
    rsiSignal = "bullish";
    rsiDesc = `RSI ${rsi.value} - 과매도 구간 (매수 신호)`;
  } else if (rsi.signal === "overbought") {
    rsiScore = -25;
    rsiSignal = "bearish";
    rsiDesc = `RSI ${rsi.value} - 과매수 구간 (매도 신호)`;
  } else if (rsi.value < 45) {
    rsiScore = 10;
    rsiSignal = "bullish";
    rsiDesc = `RSI ${rsi.value} - 중립 하단 (약한 매수)`;
  } else if (rsi.value > 55) {
    rsiScore = -10;
    rsiSignal = "bearish";
    rsiDesc = `RSI ${rsi.value} - 중립 상단 (약한 매도)`;
  } else {
    rsiDesc = `RSI ${rsi.value} - 중립 구간`;
  }

  signals.push({ name: "RSI", signal: rsiSignal, score: rsiScore, description: rsiDesc });
  totalScore += rsiScore;

  // MACD 신호 (-20 ~ +20)
  let macdScore = 0;
  let macdDesc = "";

  if (macd.trend === "bullish") {
    macdScore = macd.histogram > 0 ? 20 : 10;
    macdDesc = `MACD 상승 교차 (히스토그램: ${macd.histogram.toFixed(0)})`;
  } else if (macd.trend === "bearish") {
    macdScore = macd.histogram < 0 ? -20 : -10;
    macdDesc = `MACD 하락 교차 (히스토그램: ${macd.histogram.toFixed(0)})`;
  } else {
    macdDesc = "MACD 중립";
  }

  signals.push({
    name: "MACD",
    signal: macd.trend === "bullish" ? "bullish" : macd.trend === "bearish" ? "bearish" : "neutral",
    score: macdScore,
    description: macdDesc,
  });
  totalScore += macdScore;

  // 볼린저 밴드 신호 (-20 ~ +20)
  let bbScore = 0;
  let bbSignal: SignalItem["signal"] = "neutral";
  let bbDesc = "";

  if (bb.position === "below" || bb.position === "near_lower") {
    bbScore = bb.position === "below" ? 20 : 10;
    bbSignal = "bullish";
    bbDesc = `%B ${bb.percentB.toFixed(1)} - 하단 밴드 근접 (반등 신호)`;
  } else if (bb.position === "above" || bb.position === "near_upper") {
    bbScore = bb.position === "above" ? -20 : -10;
    bbSignal = "bearish";
    bbDesc = `%B ${bb.percentB.toFixed(1)} - 상단 밴드 근접 (조정 신호)`;
  } else {
    bbDesc = `%B ${bb.percentB.toFixed(1)} - 밴드 중간`;
  }

  signals.push({ name: "볼린저 밴드", signal: bbSignal, score: bbScore, description: bbDesc });
  totalScore += bbScore;

  // 이동평균선 신호 (-20 ~ +20)
  let maScore = 0;
  let maDesc = "";

  if (ma.trend === "bullish") {
    maScore = 20;
    maDesc = "MA7 > MA30, 가격 > MA200 (강세 배열)";
  } else if (ma.trend === "bearish") {
    maScore = -20;
    maDesc = "MA7 < MA30, 가격 < MA200 (약세 배열)";
  } else {
    maDesc = "이동평균선 혼조";
  }

  signals.push({
    name: "이동평균선",
    signal: ma.trend === "bullish" ? "bullish" : ma.trend === "bearish" ? "bearish" : "neutral",
    score: maScore,
    description: maDesc,
  });
  totalScore += maScore;

  // Fear & Greed 신호 (-15 ~ +15)
  let fgScore = 0;
  let fgSignal: SignalItem["signal"] = "neutral";
  let fgDesc = "";

  if (fearGreedIndex <= 20) {
    fgScore = 15;
    fgSignal = "bullish";
    fgDesc = `공포탐욕지수 ${fearGreedIndex} - 극도의 공포 (역발상 매수)`;
  } else if (fearGreedIndex <= 40) {
    fgScore = 7;
    fgSignal = "bullish";
    fgDesc = `공포탐욕지수 ${fearGreedIndex} - 공포 구간`;
  } else if (fearGreedIndex >= 80) {
    fgScore = -15;
    fgSignal = "bearish";
    fgDesc = `공포탐욕지수 ${fearGreedIndex} - 극도의 탐욕 (역발상 매도)`;
  } else if (fearGreedIndex >= 60) {
    fgScore = -7;
    fgSignal = "bearish";
    fgDesc = `공포탐욕지수 ${fearGreedIndex} - 탐욕 구간`;
  } else {
    fgDesc = `공포탐욕지수 ${fearGreedIndex} - 중립`;
  }

  signals.push({ name: "공포탐욕지수", signal: fgSignal, score: fgScore, description: fgDesc });
  totalScore += fgScore;

  // 총점 -100 ~ +100을 0 ~ 100으로 변환
  const normalizedScore = Math.min(100, Math.max(0, (totalScore + 100) / 2));

  let direction: PredictionScore["direction"] = "neutral";
  let label = "";

  if (normalizedScore >= 70) {
    direction = "strong_buy";
    label = "강한 매수";
  } else if (normalizedScore >= 55) {
    direction = "buy";
    label = "매수";
  } else if (normalizedScore >= 45) {
    direction = "neutral";
    label = "중립";
  } else if (normalizedScore >= 30) {
    direction = "sell";
    label = "매도";
  } else {
    direction = "strong_sell";
    label = "강한 매도";
  }

  return {
    total: Math.round(normalizedScore),
    direction,
    label,
    signals,
  };
}
