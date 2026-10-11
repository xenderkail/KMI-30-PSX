import React from 'react';
import { StockData } from '../types/stock';
import { 
  Activity, 
  TrendingUp, 
  TrendingDown, 
  Sliders, 
  Target, 
  ShieldAlert, 
  Zap, 
  CheckCircle2, 
  AlertTriangle 
} from 'lucide-react';

interface TechnicalSwingPanelProps {
  stock: StockData;
}

export const TechnicalSwingPanel: React.FC<TechnicalSwingPanelProps> = ({ stock }) => {
  const { technicals, price } = stock;
  const isSupertrendBullish = technicals.supertrend === 'BULLISH';
  const isEmaGolden = technicals.emaCross === 'GOLDEN_CROSS' || technicals.emaCross === 'BULLISH_ALIGN';
  const priceVsEma20Percent = Number((((price - technicals.ema20) / technicals.ema20) * 100).toFixed(2));
  const ema20Vs50Percent = Number((((technicals.ema20 - technicals.ema50) / technicals.ema50) * 100).toFixed(2));

  return (
    <div className="bg-[#161b22] border border-[#30363d] rounded-xl p-4 shadow-xl space-y-4">
      <div className="flex items-center justify-between border-b border-[#21262d] pb-3">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-emerald-400" />
          <h3 className="text-sm font-bold text-white tracking-tight">
            Institutional Swing Trading Engine (1D Daily)
          </h3>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[11px] text-gray-400">Composite Score:</span>
          <span className={`font-mono font-bold text-xs px-2 py-0.5 rounded ${
            stock.swingScore >= 80 ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' :
            stock.swingScore >= 60 ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30' :
            'bg-amber-500/20 text-amber-300 border border-amber-500/30'
          }`}>
            {stock.swingScore} / 100
          </span>
        </div>
      </div>

      {/* 4 Quantitative Model Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Model 1: Supertrend (10, 3) */}
        <div className="bg-[#0d1117] border border-[#30363d] rounded-lg p-3 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-gray-300">Supertrend (10, 3)</span>
            <span className={`font-mono text-[10px] font-bold px-1.5 py-0.5 rounded ${
              isSupertrendBullish ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'
            }`}>
              {technicals.supertrend}
            </span>
          </div>
          <div className="font-mono text-base font-bold text-white">
            PKR {technicals.supertrendValue.toFixed(2)}
          </div>
          <div className="text-[11px] text-gray-400 space-y-0.5 border-t border-[#21262d] pt-1.5">
            <div className="flex justify-between">
              <span>Trailing SL:</span>
              <span className="font-mono font-medium text-amber-300">PKR {technicals.supertrendTrailingStop.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Price vs Trend:</span>
              <span className={`font-mono font-medium ${price > technicals.supertrendValue ? 'text-emerald-400' : 'text-rose-400'}`}>
                {price > technicals.supertrendValue ? '+' : ''}{(price - technicals.supertrendValue).toFixed(2)} PKR
              </span>
            </div>
          </div>
        </div>

        {/* Model 2: Relative Strength Index (RSI 14) */}
        <div className="bg-[#0d1117] border border-[#30363d] rounded-lg p-3 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-gray-300">RSI (14 Days)</span>
            <span className="font-mono text-[10px] text-blue-400 bg-blue-500/10 px-1.5 py-0.5 rounded">
              {technicals.rsiZone}
            </span>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="font-mono text-base font-bold text-white">
              {technicals.rsi14.toFixed(1)}
            </span>
            <span className="text-[11px] text-gray-400 font-mono">Range 30-70</span>
          </div>
          {/* RSI Visual bar */}
          <div className="space-y-1 border-t border-[#21262d] pt-1.5">
            <div className="w-full bg-[#21262d] h-2 rounded-full overflow-hidden relative">
              <div 
                className={`h-full ${
                  technicals.rsi14 >= 70 ? 'bg-amber-400' :
                  technicals.rsi14 <= 35 ? 'bg-cyan-400' : 'bg-emerald-400'
                }`}
                style={{ width: `${Math.min(100, Math.max(5, technicals.rsi14))}%` }}
              />
            </div>
            <div className="flex justify-between text-[9px] text-gray-500 font-mono">
              <span>30 (Oversold)</span>
              <span>50 (Center)</span>
              <span>70 (Overbought)</span>
            </div>
          </div>
        </div>

        {/* Model 3: MACD (12, 26, 9) */}
        <div className="bg-[#0d1117] border border-[#30363d] rounded-lg p-3 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-gray-300">MACD (12, 26, 9)</span>
            <span className={`font-mono text-[10px] px-1.5 py-0.5 rounded ${
              technicals.macdHist >= 0 ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'
            }`}>
              {technicals.macdHist >= 0 ? 'BULL EXPANSION' : 'BEAR CONTRACTION'}
            </span>
          </div>
          <div className="font-mono text-base font-bold text-white flex items-baseline gap-2">
            <span className={technicals.macdHist >= 0 ? 'text-emerald-400' : 'text-rose-400'}>
              {technicals.macdHist >= 0 ? '+' : ''}{technicals.macdHist.toFixed(2)}
            </span>
            <span className="text-xs text-gray-400">Hist</span>
          </div>
          <div className="text-[11px] text-gray-400 space-y-0.5 border-t border-[#21262d] pt-1.5 font-mono">
            <div className="flex justify-between">
              <span>MACD Line:</span>
              <span className="text-blue-300">{technicals.macdLine.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Signal Line:</span>
              <span className="text-purple-300">{technicals.macdSignal.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Model 4: EMA 20 & EMA 50 System */}
        <div className="bg-[#0d1117] border border-[#30363d] rounded-lg p-3 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-gray-300">EMA 20 & EMA 50</span>
            <span className={`font-mono text-[10px] font-bold px-1.5 py-0.5 rounded ${
              isEmaGolden ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'
            }`}>
              {isEmaGolden ? 'GOLDEN CROSS' : 'DEATH CROSS'}
            </span>
          </div>
          <div className="font-mono text-xs text-gray-200 space-y-1">
            <div className="flex justify-between">
              <span className="text-cyan-400 font-semibold">EMA 20:</span>
              <span className="font-bold">PKR {technicals.ema20.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-purple-400 font-semibold">EMA 50:</span>
              <span className="font-bold">PKR {technicals.ema50.toFixed(2)}</span>
            </div>
          </div>
          <div className="text-[11px] text-gray-400 space-y-0.5 border-t border-[#21262d] pt-1.5 font-mono">
            <div className="flex justify-between">
              <span>Price vs EMA20:</span>
              <span className={priceVsEma20Percent >= 0 ? 'text-emerald-400' : 'text-rose-400'}>
                {priceVsEma20Percent >= 0 ? '+' : ''}{priceVsEma20Percent}%
              </span>
            </div>
            <div className="flex justify-between">
              <span>EMA 20/50 Spread:</span>
              <span className={ema20Vs50Percent >= 0 ? 'text-emerald-400' : 'text-rose-400'}>
                {ema20Vs50Percent >= 0 ? '+' : ''}{ema20Vs50Percent}%
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Dynamic Pivot Points (Classic & Fibonacci Levels) */}
      <div className="bg-[#0d1117] border border-[#30363d] rounded-lg p-3.5 space-y-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Target className="w-3.5 h-3.5 text-blue-400" />
            <span className="text-xs font-bold text-gray-200">
              Dynamic Pivot Points (Daily Standard Ladder)
            </span>
          </div>
          <span className="text-[11px] font-mono text-gray-400">
            Current Price: <strong className="text-white">PKR {price.toFixed(2)}</strong>
          </span>
        </div>

        <div className="grid grid-cols-7 gap-1.5 text-center text-xs font-mono">
          {/* S3 */}
          <div className={`p-2 rounded border ${price <= technicals.pivots.s3 ? 'bg-rose-500/20 border-rose-500/60' : 'bg-[#161b22] border-[#21262d]'}`}>
            <div className="text-[10px] text-rose-400 font-bold uppercase">S3</div>
            <div className="text-xs text-white mt-0.5 font-semibold">{technicals.pivots.s3.toFixed(2)}</div>
            <div className="text-[9px] text-gray-400">Extreme Ext</div>
          </div>

          {/* S2 */}
          <div className={`p-2 rounded border ${price > technicals.pivots.s3 && price <= technicals.pivots.s2 ? 'bg-rose-500/20 border-rose-500/60' : 'bg-[#161b22] border-[#21262d]'}`}>
            <div className="text-[10px] text-rose-300 font-bold uppercase">S2</div>
            <div className="text-xs text-white mt-0.5 font-semibold">{technicals.pivots.s2.toFixed(2)}</div>
            <div className="text-[9px] text-gray-400">Swing Base</div>
          </div>

          {/* S1 */}
          <div className={`p-2 rounded border ${price > technicals.pivots.s2 && price <= technicals.pivots.s1 ? 'bg-amber-500/20 border-amber-500/60' : 'bg-[#161b22] border-[#21262d]'}`}>
            <div className="text-[10px] text-amber-400 font-bold uppercase">S1</div>
            <div className="text-xs text-white mt-0.5 font-semibold">{technicals.pivots.s1.toFixed(2)}</div>
            <div className="text-[9px] text-gray-400">Pullback Zone</div>
          </div>

          {/* PP */}
          <div className={`p-2 rounded border ${Math.abs(price - technicals.pivots.pp) < (price * 0.005) ? 'bg-blue-500/25 border-blue-500/70 shadow' : 'bg-[#161b22] border-blue-500/30'}`}>
            <div className="text-[10px] text-blue-300 font-bold uppercase">Pivot (PP)</div>
            <div className="text-xs text-blue-200 mt-0.5 font-bold">{technicals.pivots.pp.toFixed(2)}</div>
            <div className="text-[9px] text-blue-400">Equilibrium</div>
          </div>

          {/* R1 */}
          <div className={`p-2 rounded border ${price >= technicals.pivots.r1 && price < technicals.pivots.r2 ? 'bg-emerald-500/20 border-emerald-500/60' : 'bg-[#161b22] border-[#21262d]'}`}>
            <div className="text-[10px] text-emerald-400 font-bold uppercase">R1</div>
            <div className="text-xs text-white mt-0.5 font-semibold">{technicals.pivots.r1.toFixed(2)}</div>
            <div className="text-[9px] text-gray-400">Target 1 (TP1)</div>
          </div>

          {/* R2 */}
          <div className={`p-2 rounded border ${price >= technicals.pivots.r2 && price < technicals.pivots.r3 ? 'bg-emerald-500/20 border-emerald-500/60' : 'bg-[#161b22] border-[#21262d]'}`}>
            <div className="text-[10px] text-emerald-300 font-bold uppercase">R2</div>
            <div className="text-xs text-white mt-0.5 font-semibold">{technicals.pivots.r2.toFixed(2)}</div>
            <div className="text-[9px] text-gray-400">Target 2 (TP2)</div>
          </div>

          {/* R3 */}
          <div className={`p-2 rounded border ${price >= technicals.pivots.r3 ? 'bg-emerald-500/20 border-emerald-500/60' : 'bg-[#161b22] border-[#21262d]'}`}>
            <div className="text-[10px] text-emerald-200 font-bold uppercase">R3</div>
            <div className="text-xs text-white mt-0.5 font-semibold">{technicals.pivots.r3.toFixed(2)}</div>
            <div className="text-[9px] text-gray-400">Breakout Expansion</div>
          </div>
        </div>
      </div>
    </div>
  );
};
