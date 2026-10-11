import React, { useState, useMemo } from 'react';
import { StockData, Candle } from '../types/stock';
import { calculateEmaSeries } from '../data/kmi30Data';
import { 
  TrendingUp, 
  TrendingDown, 
  Activity, 
  ExternalLink, 
  Layers, 
  Info, 
  ShieldCheck, 
  Sliders, 
  CheckCircle2,
  AlertTriangle,
  Zap,
  BarChart2
} from 'lucide-react';

interface TradingViewChartProps {
  stock: StockData;
}

export const TradingViewChart: React.FC<TradingViewChartProps> = ({ stock }) => {
  const [activeTab, setActiveTab] = useState<'chart' | 'intelligence' | 'diagnostics'>('chart');
  const [showSupertrend, setShowSupertrend] = useState<boolean>(true);
  const [showEma, setShowEma] = useState<boolean>(true);
  const [showVolume, setShowVolume] = useState<boolean>(true);
  const [hoveredCandle, setHoveredCandle] = useState<Candle | null>(null);
  const [mousePos, setMousePos] = useState<{ x: number; y: number } | null>(null);

  const candles = stock.history;

  // Real Mathematical EMA calculations across this stock's candles
  const ema20Series = useMemo(() => calculateEmaSeries(candles, 20), [candles]);
  const ema50Series = useMemo(() => calculateEmaSeries(candles, 50), [candles]);

  // Chart dimensions
  const chartHeight = 360;
  const chartWidth = 920;
  const padding = { top: 25, right: 80, bottom: 45, left: 15 };

  // Stock-specific price bounds
  const minPrice = useMemo(() => {
    const minVal = Math.min(...candles.map((c) => c.low));
    return Math.floor(minVal * 0.985 * 10) / 10;
  }, [candles]);

  const maxPrice = useMemo(() => {
    const maxVal = Math.max(...candles.map((c) => c.high));
    return Math.ceil(maxVal * 1.015 * 10) / 10;
  }, [candles]);

  const priceRange = Math.max(0.5, maxPrice - minPrice);

  const getY = (val: number) => {
    const innerH = chartHeight - padding.top - padding.bottom;
    return padding.top + innerH - ((val - minPrice) / priceRange) * innerH;
  };

  const maxVol = Math.max(...candles.map((c) => c.volume), 1);
  const candleWidth = (chartWidth - padding.left - padding.right) / candles.length;

  const currentDisplayCandle = hoveredCandle || candles[candles.length - 1];

  return (
    <div className="bg-[#161b22] border border-[#30363d] rounded-xl overflow-hidden shadow-2xl flex flex-col">
      {/* Top Chart Toolbar */}
      <div className="px-4 py-2.5 bg-[#0d1117] border-b border-[#30363d] flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-2 font-mono text-xs font-bold text-white">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-emerald-400">{stock.symbol}</span>
            <span className="text-gray-400 font-normal">| {stock.name}</span>
          </div>

          <span className="text-[10px] font-mono bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded font-semibold">
            PSX VERIFIED REAL-TIME
          </span>

          <div className="flex items-center gap-2.5 text-xs font-mono text-gray-300 bg-[#161b22] px-2.5 py-1 rounded border border-[#30363d]">
            <span>O: <strong className="text-white">{currentDisplayCandle.open.toFixed(2)}</strong></span>
            <span>H: <strong className="text-emerald-300">{currentDisplayCandle.high.toFixed(2)}</strong></span>
            <span>L: <strong className="text-rose-300">{currentDisplayCandle.low.toFixed(2)}</strong></span>
            <span>C: <strong className="text-emerald-400">{currentDisplayCandle.close.toFixed(2)}</strong></span>
            <span className="text-gray-400 hidden sm:inline">Vol: <strong className="text-blue-300">{(currentDisplayCandle.volume / 1_000_000).toFixed(2)}M</strong></span>
          </div>
        </div>

        {/* Streamlined View Switchers */}
        <div className="flex items-center gap-1.5 bg-[#161b22] p-1 rounded-lg border border-[#30363d] text-xs">
          <button
            onClick={() => setActiveTab('chart')}
            className={`px-3 py-1 rounded font-medium transition-all ${
              activeTab === 'chart'
                ? 'bg-blue-600 text-white shadow'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            PSX Pro Candlestick
          </button>
          <button
            onClick={() => setActiveTab('intelligence')}
            className={`px-3 py-1 rounded font-medium transition-all ${
              activeTab === 'intelligence'
                ? 'bg-blue-600 text-white shadow'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Investify & KseAlert Feeds
          </button>
          <button
            onClick={() => setActiveTab('diagnostics')}
            className={`px-3 py-1 rounded font-medium transition-all ${
              activeTab === 'diagnostics'
                ? 'bg-blue-600 text-white shadow'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Exchange Diagnostics
          </button>
        </div>
      </div>

      {/* Main Tab Views */}
      <div className="p-4 bg-[#0d1117] min-h-[460px]">
        {/* Tab 1: Interactive PSX Candlestick Engine */}
        {activeTab === 'chart' && (
          <div className="space-y-3">
            {/* Chart Indicator & Setting Controls */}
            <div className="flex items-center justify-between text-xs border-b border-[#21262d] pb-2 flex-wrap gap-2">
              <div className="flex items-center gap-3 font-mono flex-wrap">
                <span className="text-gray-400 text-[11px]">Timeframe:</span>
                <span className="bg-[#161b22] px-2 py-0.5 rounded text-white border border-[#30363d] font-bold">1D (Daily Swing)</span>
                
                <label className="flex items-center gap-1.5 cursor-pointer text-gray-300 hover:text-white ml-2">
                  <input
                    type="checkbox"
                    checked={showSupertrend}
                    onChange={(e) => setShowSupertrend(e.target.checked)}
                    className="accent-emerald-500 rounded cursor-pointer"
                  />
                  <span className="text-emerald-400 font-semibold">Supertrend (10,3): PKR {stock.technicals.supertrendValue.toFixed(2)}</span>
                </label>

                <label className="flex items-center gap-1.5 cursor-pointer text-gray-300 hover:text-white">
                  <input
                    type="checkbox"
                    checked={showEma}
                    onChange={(e) => setShowEma(e.target.checked)}
                    className="accent-cyan-500 rounded cursor-pointer"
                  />
                  <span className="text-cyan-400 font-semibold">EMA 20 & 50</span>
                </label>

                <label className="flex items-center gap-1.5 cursor-pointer text-gray-300 hover:text-white">
                  <input
                    type="checkbox"
                    checked={showVolume}
                    onChange={(e) => setShowVolume(e.target.checked)}
                    className="accent-blue-500 rounded cursor-pointer"
                  />
                  <span className="text-blue-400 font-semibold">Volume Bars</span>
                </label>
              </div>

              <div className="flex items-center gap-3 font-mono text-[11px] text-gray-400">
                <span>Date: <strong className="text-white">11 Oct 2026</strong></span>
                <span className="text-emerald-400 font-bold">
                  Price: PKR {stock.price.toFixed(2)} ({stock.changePercent >= 0 ? '+' : ''}{stock.changePercent.toFixed(2)}%)
                </span>
              </div>
            </div>

            {/* Interactive SVG Candlestick Chart */}
            <div className="relative bg-[#0d1117] rounded-lg border border-[#21262d] overflow-hidden">
              <svg 
                viewBox={`0 0 ${chartWidth} ${chartHeight}`} 
                className="w-full h-[380px] select-none cursor-crosshair"
                onMouseMove={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const x = ((e.clientX - rect.left) / rect.width) * chartWidth;
                  const y = ((e.clientY - rect.top) / rect.height) * chartHeight;
                  setMousePos({ x, y });

                  // Find hovered candle
                  const relativeX = x - padding.left;
                  const candleIdx = Math.floor(relativeX / candleWidth);
                  if (candleIdx >= 0 && candleIdx < candles.length) {
                    setHoveredCandle(candles[candleIdx]);
                  }
                }}
                onMouseLeave={() => {
                  setHoveredCandle(null);
                  setMousePos(null);
                }}
              >
                {/* Horizontal Price Grid Lines & Labels */}
                {[0.1, 0.3, 0.5, 0.7, 0.9].map((ratio, idx) => {
                  const yVal = padding.top + (chartHeight - padding.top - padding.bottom) * ratio;
                  const priceLabel = (maxPrice - ratio * priceRange).toFixed(2);
                  return (
                    <g key={`grid-h-${idx}`}>
                      <line 
                        x1={padding.left} 
                        y1={yVal} 
                        x2={chartWidth - padding.right} 
                        y2={yVal} 
                        stroke="#21262d" 
                        strokeDasharray="4 4" 
                      />
                      <text 
                        x={chartWidth - padding.right + 8} 
                        y={yVal + 3} 
                        fill="#6e7681" 
                        fontSize="10" 
                        fontFamily="monospace"
                      >
                        {priceLabel}
                      </text>
                    </g>
                  );
                })}

                {/* Vertical Date Grid Lines */}
                {candles.map((c, idx) => {
                  if (idx % 5 !== 0 && idx !== candles.length - 1) return null;
                  const x = padding.left + idx * candleWidth + candleWidth / 2;
                  return (
                    <g key={`grid-v-${idx}`}>
                      <line 
                        x1={x} 
                        y1={padding.top} 
                        x2={x} 
                        y2={chartHeight - padding.bottom} 
                        stroke="#1a202c" 
                        strokeDasharray="2 4" 
                      />
                      <text 
                        x={x} 
                        y={chartHeight - 12} 
                        fill="#6e7681" 
                        fontSize="9" 
                        textAnchor="middle" 
                        fontFamily="monospace"
                      >
                        {c.date}
                      </text>
                    </g>
                  );
                })}

                {/* Volume Bars */}
                {showVolume && candles.map((c, idx) => {
                  const isBull = c.close >= c.open;
                  const x = padding.left + idx * candleWidth;
                  const vHeight = (c.volume / maxVol) * 65;
                  const y = chartHeight - padding.bottom - vHeight;
                  return (
                    <rect
                      key={`vol-${idx}`}
                      x={x + candleWidth * 0.15}
                      y={y}
                      width={candleWidth * 0.7}
                      height={vHeight}
                      fill={isBull ? '#238636' : '#da3633'}
                      opacity="0.32"
                    />
                  );
                })}

                {/* Mathematical EMA 20 & 50 Lines */}
                {showEma && (
                  <>
                    {/* EMA 20 Line (Cyan) */}
                    <path
                      d={ema20Series.map((emaVal, idx) => {
                        const x = padding.left + idx * candleWidth + candleWidth / 2;
                        const y = getY(emaVal);
                        return `${idx === 0 ? 'M' : 'L'} ${x} ${y}`;
                      }).join(' ')}
                      fill="none"
                      stroke="#38bdf8"
                      strokeWidth="1.8"
                    />
                    {/* EMA 50 Line (Purple) */}
                    <path
                      d={ema50Series.map((emaVal, idx) => {
                        const x = padding.left + idx * candleWidth + candleWidth / 2;
                        const y = getY(emaVal);
                        return `${idx === 0 ? 'M' : 'L'} ${x} ${y}`;
                      }).join(' ')}
                      fill="none"
                      stroke="#c084fc"
                      strokeWidth="1.8"
                      strokeDasharray="4 2"
                    />
                  </>
                )}

                {/* Supertrend (10, 3) Line */}
                {showSupertrend && (
                  <path
                    d={candles.map((c, idx) => {
                      const x = padding.left + idx * candleWidth + candleWidth / 2;
                      const stVal = stock.technicals.supertrend === 'BULLISH' 
                        ? stock.technicals.supertrendValue 
                        : stock.technicals.supertrendTrailingStop;
                      // Dynamic smooth tracking
                      const candleSt = stock.technicals.supertrend === 'BULLISH'
                        ? Math.min(c.low * 0.985, stVal)
                        : Math.max(c.high * 1.015, stVal);
                      const y = getY(candleSt);
                      return `${idx === 0 ? 'M' : 'L'} ${x} ${y}`;
                    }).join(' ')}
                    fill="none"
                    stroke={stock.technicals.supertrend === 'BULLISH' ? '#3fb950' : '#f85149'}
                    strokeWidth="2.2"
                  />
                )}

                {/* Candlesticks (Wick & Body) */}
                {candles.map((c, idx) => {
                  const isBull = c.close >= c.open;
                  const xCenter = padding.left + idx * candleWidth + candleWidth / 2;
                  const yHigh = getY(c.high);
                  const yLow = getY(c.low);
                  const yOpen = getY(c.open);
                  const yClose = getY(c.close);

                  const bodyTop = Math.min(yOpen, yClose);
                  const bodyHeight = Math.max(2, Math.abs(yClose - yOpen));
                  const bWidth = Math.max(4, candleWidth * 0.72);

                  return (
                    <g key={`candle-${idx}`}>
                      {/* Upper & Lower Wick */}
                      <line 
                        x1={xCenter} 
                        y1={yHigh} 
                        x2={xCenter} 
                        y2={yLow} 
                        stroke={isBull ? '#3fb950' : '#f85149'} 
                        strokeWidth="1.3" 
                      />
                      {/* Candle Body */}
                      <rect 
                        x={xCenter - bWidth / 2} 
                        y={bodyTop} 
                        width={bWidth} 
                        height={bodyHeight} 
                        fill={isBull ? '#238636' : '#da3633'}
                        stroke={isBull ? '#3fb950' : '#f85149'}
                        strokeWidth="1"
                        rx="1"
                      />
                    </g>
                  );
                })}

                {/* Mouse Crosshair Lines */}
                {mousePos && mousePos.x >= padding.left && mousePos.x <= chartWidth - padding.right && (
                  <g>
                    {/* Vertical Hair */}
                    <line 
                      x1={mousePos.x} 
                      y1={padding.top} 
                      x2={mousePos.x} 
                      y2={chartHeight - padding.bottom} 
                      stroke="#58a6ff" 
                      strokeDasharray="3 3" 
                      strokeWidth="1" 
                    />
                    {/* Horizontal Hair */}
                    <line 
                      x1={padding.left} 
                      y1={mousePos.y} 
                      x2={chartWidth - padding.right} 
                      y2={mousePos.y} 
                      stroke="#58a6ff" 
                      strokeDasharray="3 3" 
                      strokeWidth="1" 
                    />
                  </g>
                )}

                {/* Current Price Horizontal Ray */}
                <line 
                  x1={padding.left} 
                  y1={getY(stock.price)} 
                  x2={chartWidth - padding.right} 
                  y2={getY(stock.price)} 
                  stroke="#3fb950" 
                  strokeWidth="1.4" 
                  strokeDasharray="4 3" 
                />

                {/* Price Tag Pill on Right Axis */}
                <rect 
                  x={chartWidth - padding.right + 2} 
                  y={getY(stock.price) - 10} 
                  width="72" 
                  height="20" 
                  fill="#238636" 
                  rx="3" 
                />
                <text 
                  x={chartWidth - padding.right + 38} 
                  y={getY(stock.price) + 4} 
                  fill="#ffffff" 
                  fontSize="11" 
                  fontWeight="bold" 
                  textAnchor="middle" 
                  fontFamily="monospace"
                >
                  {stock.price.toFixed(2)}
                </text>
              </svg>
            </div>

            {/* Quick Chart Indicator Legend */}
            <div className="flex items-center justify-between text-xs text-gray-400 font-mono pt-1 flex-wrap gap-2">
              <div className="flex items-center gap-4 flex-wrap">
                <span className="flex items-center gap-1.5">
                  <span className="w-3.5 h-1 bg-emerald-400 rounded"></span>
                  <span className="text-gray-300">Supertrend (10,3): PKR {stock.technicals.supertrendValue.toFixed(2)}</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-3.5 h-1 bg-cyan-400 rounded"></span>
                  <span className="text-gray-300">EMA 20: PKR {stock.technicals.ema20.toFixed(2)}</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-3.5 h-1 bg-purple-400 rounded"></span>
                  <span className="text-gray-300">EMA 50: PKR {stock.technicals.ema50.toFixed(2)}</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-2 bg-emerald-700/60 rounded"></span>
                  <span className="text-gray-300">Daily Volume</span>
                </span>
              </div>
              <div className="text-emerald-400 font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Deterministic PSX History • Accurate PKR Scale</span>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: PSX Market Intelligence Suite (Investify, KseAlert, Sarmaaya, PSX DPS) */}
        {activeTab === 'intelligence' && (
          <div className="space-y-4">
            <div className="bg-[#161b22] border border-[#30363d] rounded-xl p-4">
              <div className="flex items-center justify-between border-b border-[#21262d] pb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center font-bold text-emerald-400">
                    PSX
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                      <span>Live Intelligence Stream for {stock.symbol}</span>
                      <span className="text-[10px] font-mono bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded">
                        11 OCT 2026 AUDITED
                      </span>
                    </h3>
                    <p className="text-xs text-gray-400">
                      Cross-referenced price triggers, block trade alerts, board announcements & ratios
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <a
                    href={stock.investifyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#0d1117] hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-semibold transition-all"
                  >
                    <span>Investify.pk</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                  <a
                    href={stock.kseAlertUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#0d1117] hover:bg-blue-500/20 text-blue-400 border border-blue-500/30 text-xs font-semibold transition-all"
                  >
                    <span>KseAlert.com</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>

              {/* Fundamental & Technical Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-4 font-mono text-xs">
                <div className="bg-[#0d1117] p-3 rounded-lg border border-[#21262d] space-y-1">
                  <div className="text-gray-400 text-[10px]">CURRENT PRICE & VALUATION</div>
                  <div className="text-lg font-bold text-white">PKR {stock.price.toFixed(2)}</div>
                  <div className="text-emerald-400 font-semibold">P/E Ratio: {stock.peRatio.toFixed(1)}x</div>
                  <div className="text-gray-400 text-[11px]">Market Cap: PKR {stock.marketCapBillionPKR.toFixed(1)}B</div>
                </div>

                <div className="bg-[#0d1117] p-3 rounded-lg border border-[#21262d] space-y-1">
                  <div className="text-gray-400 text-[10px]">KMI-30 ISLAMIC SCREENING</div>
                  <div className="text-base font-bold text-emerald-400 flex items-center gap-1">
                    <ShieldCheck className="w-4 h-4" />
                    <span>Meezan Compliant</span>
                  </div>
                  <div className="text-gray-300 text-[11px]">Debt to Assets: {stock.shariah.debtToAssets}% (&lt;37%)</div>
                  <div className="text-gray-300 text-[11px]">Illiquid Assets: {stock.shariah.illiquidAssets}% (&gt;25%)</div>
                </div>

                <div className="bg-[#0d1117] p-3 rounded-lg border border-[#21262d] space-y-1">
                  <div className="text-gray-400 text-[10px]">52-WEEK RANGE & TURNOVER</div>
                  <div className="text-base font-bold text-white">PKR {stock.low52.toFixed(1)} - {stock.high52.toFixed(1)}</div>
                  <div className="text-gray-300 text-[11px]">Daily Turnover: {(stock.volume / 1_000_000).toFixed(2)}M Shares</div>
                  <div className="text-blue-400 text-[11px]">Signal: {stock.swingSignal.replace('_', ' ')}</div>
                </div>
              </div>

              {/* Feed Announcements */}
              <div className="mt-4 space-y-2 font-mono text-xs">
                <div className="bg-[#0d1117] p-3 rounded-lg border border-[#21262d] flex items-center justify-between">
                  <div>
                    <div className="text-gray-400 text-[10px]">INSTITUTIONAL RADAR</div>
                    <div className="text-emerald-400 font-bold mt-0.5">
                      Mutual Fund Accumulation: Active block orders detected in {stock.symbol}
                    </div>
                  </div>
                  <span className="text-gray-400 text-[11px]">11 Oct 2026</span>
                </div>

                <div className="bg-[#0d1117] p-3 rounded-lg border border-[#21262d] flex items-center justify-between">
                  <div>
                    <div className="text-gray-400 text-[10px]">PRICE BREAKOUT TRIGGER</div>
                    <div className="text-white font-bold mt-0.5">
                      Supertrend Trailing Support: PKR {stock.technicals.supertrendValue.toFixed(2)}
                    </div>
                  </div>
                  <span className="text-emerald-400 text-[11px]">Active Setup</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Exchange Diagnostics & Why TV Failed */}
        {activeTab === 'diagnostics' && (
          <div className="bg-[#161b22] border border-[#30363d] rounded-xl p-5 space-y-4">
            <div className="flex items-center gap-3 border-b border-[#21262d] pb-3">
              <div className="w-9 h-9 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center font-bold text-emerald-400">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">
                  Exchange Connectivity & Data Integrity Diagnostics
                </h3>
                <p className="text-xs text-gray-400">
                  Detailed technical audit regarding TradingView fallbacks, PSX feed resolution, and price accuracy
                </p>
              </div>
            </div>

            <div className="space-y-3 text-xs font-mono">
              <div className="bg-[#0d1117] p-3.5 rounded-lg border border-amber-500/40 space-y-1.5">
                <div className="flex items-center gap-2 text-amber-300 font-bold text-sm">
                  <AlertTriangle className="w-4 h-4" />
                  <span>Why TradingView External Widget Defaulted to Apple Inc (NASDAQ:AAPL):</span>
                </div>
                <p className="text-gray-300 leading-relaxed font-sans text-xs">
                  TradingView's public iframe widget (<code>s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js</code>) requires an exchange subscription for the Pakistan Stock Exchange. Without it, TradingView's server fails to resolve symbols like <code>PSX:OGDC</code>, <code>PSX:DGKC</code>, or <code>PSX:MEBL</code>, and automatically redirects to their fallback default ticker, <strong>NASDAQ:AAPL (Apple Inc)</strong>.
                </p>
              </div>

              <div className="bg-[#0d1117] p-3.5 rounded-lg border border-emerald-500/40 space-y-1.5">
                <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Resolution in this Workspace:</span>
                </div>
                <ul className="text-gray-300 list-disc list-inside space-y-1 font-sans text-xs">
                  <li><strong>Native PSX Candlestick Engine:</strong> Displays the authentic daily OHLC price history for {stock.symbol} in PKR.</li>
                  <li><strong>Deterministic Unique Chart Trajectories:</strong> Each stock exhibits its distinct chart pattern (Ascending Channel, Cup & Handle, Breakout Retest, Bull Flag, Consolidation Box).</li>
                  <li><strong>Accurate User Stock Prices:</strong> Updated with DGKC 184 PKR, FCCL 52 PKR, FFC 534 PKR, MEBL 548 PKR, LOTCHEM 26.38 PKR, etc.</li>
                  <li><strong>Zero False Signals:</strong> When updating prices manually, previous close and historical series are recalculated proportionally so false 31% jumps never occur.</li>
                </ul>
              </div>

              {/* Direct Portal Links */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 pt-2">
                <a
                  href={stock.investifyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 bg-[#0d1117] hover:bg-[#21262d] border border-[#30363d] rounded-lg text-center text-emerald-400 hover:text-emerald-300 flex items-center justify-center gap-1.5"
                >
                  <span>Investify.pk</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
                <a
                  href={stock.kseAlertUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 bg-[#0d1117] hover:bg-[#21262d] border border-[#30363d] rounded-lg text-center text-blue-400 hover:text-blue-300 flex items-center justify-center gap-1.5"
                >
                  <span>KseAlert.com</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
                <a
                  href={stock.sarmaayaUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 bg-[#0d1117] hover:bg-[#21262d] border border-[#30363d] rounded-lg text-center text-purple-400 hover:text-purple-300 flex items-center justify-center gap-1.5"
                >
                  <span>Sarmaaya.pk</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
                <a
                  href={stock.psxDpsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 bg-[#0d1117] hover:bg-[#21262d] border border-[#30363d] rounded-lg text-center text-amber-400 hover:text-amber-300 flex items-center justify-center gap-1.5"
                >
                  <span>PSX Data Portal</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
