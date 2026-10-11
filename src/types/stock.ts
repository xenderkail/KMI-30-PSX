export interface ShariahMetrics {
  debtToAssets: number; // Max 37%
  illiquidAssets: number; // Min 25%
  nonCompliantInvestments: number; // Max 33%
  nonPermissibleIncomePercent: number; // Max 5%
  netLiquidAssetsPerShare: number; // PKR
  marketPriceVsLiquidAssets: boolean; // Price > Net Liquid Assets
  isCompliant: boolean;
  dividendPurificationPercent: number; // % to purify
  shariahAdvisor: string; // e.g. "Al-Meezan / Shariah Board"
}

export interface TechnicalIndicators {
  supertrend: 'BULLISH' | 'BEARISH';
  supertrendValue: number;
  supertrendTrailingStop: number;
  rsi14: number;
  rsiZone: 'OVERSOLD' | 'BEARISH' | 'NEUTRAL' | 'BULLISH' | 'OVERBOUGHT';
  macdLine: number;
  macdSignal: number;
  macdHist: number;
  macdStatus?: 'BULLISH_CROSS' | 'BEARISH_CROSS' | 'EXPANDING_UP' | 'EXPANDING_DOWN';
  ema20: number;
  ema50: number;
  emaCross: 'GOLDEN_CROSS' | 'DEATH_CROSS' | 'BULLISH_ALIGN' | 'BEARISH_ALIGN';
  atr14: number;
  pivots: {
    r3: number;
    r2: number;
    r1: number;
    pp: number;
    s1: number;
    s2: number;
    s3: number;
  };
}

export interface OrderBookLevel {
  price: number;
  orders: number;
  shares: number;
  totalValueMillion: number;
  cumulativeShares: number;
  isBlockOrder?: boolean;
}

export interface BlockOrder {
  id: string;
  time: string;
  type: 'BUY' | 'SELL';
  price: number;
  shares: number;
  valuePKRMillion: number;
  institutionType: 'MUTUAL_FUND' | 'INSURANCE' | 'FOREIGN_FIPI' | 'LOCAL_NBFC';
}

export interface OrderBook {
  bids: OrderBookLevel[];
  asks: OrderBookLevel[];
  buyerImbalancePercent: number; // e.g. 62%
  sellerImbalancePercent: number; // e.g. 38%
  spreadPKR: number;
  spreadBps: number;
  recentBlocks: BlockOrder[];
}

export interface Candle {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface StockData {
  symbol: string;
  name: string;
  sector: string;
  tradingViewSymbol: string; // e.g. 'PSX:OGDC'
  price: number;
  change: number;
  changePercent: number;
  open: number;
  high: number;
  low: number;
  prevClose: number;
  volume: number;
  high52: number;
  low52: number;
  marketCapBillionPKR: number;
  peRatio: number;
  swingScore: number; // -100 to +100
  swingSignal: 'STRONG_BUY' | 'BUY' | 'ACCUMULATE' | 'NEUTRAL' | 'REDUCE' | 'EXIT';
  shariah: ShariahMetrics;
  technicals: TechnicalIndicators;
  orderBook: OrderBook;
  history: Candle[];
  investifyUrl: string;
  kseAlertUrl: string;
  sarmaayaUrl: string;
  psxDpsUrl: string;
}

export interface RiskCalculation {
  accountCapital: number;
  riskPercent: number;
  riskRewardRatio: number;
  entryPrice: number;
  stopLossPrice: number;
  takeProfit1Price: number;
  takeProfit2Price: number;
  riskAmountPKR: number;
  riskPerSharePKR: number;
  stopDistancePercent: number;
  recommendedShares: number;
  boardLots: number;
  totalExposurePKR: number;
  exposurePercent: number;
  estimatedBrokerageFeesPKR: number;
  potentialNetProfitPKR: number;
  actualRRRatio: number;
}
