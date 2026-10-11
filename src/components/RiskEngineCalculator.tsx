import React, { useState, useMemo } from 'react';
import { StockData, RiskCalculation } from '../types/stock';
import { 
  Calculator, 
  ShieldAlert, 
  Target, 
  DollarSign, 
  Percent, 
  Sliders, 
  Copy, 
  Check, 
  AlertTriangle,
  ArrowRight,
  Sparkles
} from 'lucide-react';

interface RiskEngineCalculatorProps {
  stock: StockData;
}

export const RiskEngineCalculator: React.FC<RiskEngineCalculatorProps> = ({ stock }) => {
  // User adjustable inputs
  const [accountCapital, setAccountCapital] = useState<number>(5000000); // 5 Million PKR default
  const [riskPercent, setRiskPercent] = useState<number>(1.5); // 1.5% max risk
  const [targetRR, setTargetRR] = useState<number>(2.5); // 1:2.5 Risk-to-Reward
  const [entryPrice, setEntryPrice] = useState<number>(stock.price);
  const [atrMultiplier, setAtrMultiplier] = useState<number>(1.5); // 1.5x ATR
  const [copied, setCopied] = useState<boolean>(false);

  // Sync entry price when stock changes
  React.useEffect(() => {
    setEntryPrice(stock.price);
  }, [stock.symbol, stock.price]);

  // Perform quantitative risk calculation
  const calc: RiskCalculation = useMemo(() => {
    const validEntry = entryPrice > 0 ? entryPrice : stock.price;
    const atrStopDistance = stock.technicals.atr14 * atrMultiplier;
    const stopLossPrice = Math.max(0.01, Number((validEntry - atrStopDistance).toFixed(2)));
    const riskPerShare = Number((validEntry - stopLossPrice).toFixed(2));
    const stopDistancePercent = Number(((riskPerShare / validEntry) * 100).toFixed(2));

    // Capital at risk
    const maxRiskAmountPKR = (accountCapital * (riskPercent / 100));

    // Position size in shares
    let rawShares = riskPerShare > 0 ? Math.floor(maxRiskAmountPKR / riskPerShare) : 0;
    // PSX standard board lot is usually 100 or 500 shares for stocks
    const boardLotUnit = validEntry > 100 ? 100 : 500;
    let recommendedShares = Math.floor(rawShares / boardLotUnit) * boardLotUnit;
    if (recommendedShares === 0 && rawShares > 0) recommendedShares = boardLotUnit;
    const boardLots = Math.floor(recommendedShares / boardLotUnit);

    // Total capital exposure
    const totalExposurePKR = Number((recommendedShares * validEntry).toFixed(2));
    const exposurePercent = Number(((totalExposurePKR / accountCapital) * 100).toFixed(1));

    // Targets based on R:R
    const rewardPerShareTP1 = riskPerShare * targetRR;
    const takeProfit1Price = Number((validEntry + rewardPerShareTP1).toFixed(2));
    const takeProfit2Price = Number((validEntry + rewardPerShareTP1 * 1.5).toFixed(2));

    // PSX Brokerage & CDC/SECP transaction fee approx 0.15% round-trip
    const estimatedBrokerageFeesPKR = Number(((totalExposurePKR * 2 * 0.0015)).toFixed(2));
    const grossProfitTP1 = recommendedShares * rewardPerShareTP1;
    const potentialNetProfitPKR = Number((grossProfitTP1 - estimatedBrokerageFeesPKR).toFixed(2));
    const actualRiskAmountPKR = Number((recommendedShares * riskPerShare).toFixed(2));

    return {
      accountCapital,
      riskPercent,
      riskRewardRatio: targetRR,
      entryPrice: validEntry,
      stopLossPrice,
      takeProfit1Price,
      takeProfit2Price,
      riskAmountPKR: actualRiskAmountPKR,
      riskPerSharePKR: riskPerShare,
      stopDistancePercent,
      recommendedShares,
      boardLots,
      totalExposurePKR,
      exposurePercent,
      estimatedBrokerageFeesPKR,
      potentialNetProfitPKR,
      actualRRRatio: targetRR,
    };
  }, [accountCapital, riskPercent, targetRR, entryPrice, atrMultiplier, stock.price, stock.technicals.atr14]);

  const handleCopyPlan = () => {
    const text = `=== PSX SWING TRADE ORDER SPECIFICATION ===
Symbol: ${stock.symbol} (${stock.name})
TradingView: ${stock.tradingViewSymbol}
Strategy: Daily Swing Breakout / Pullback
Entry Price: PKR ${calc.entryPrice.toFixed(2)}
Stop-Loss (ATR ${atrMultiplier}x): PKR ${calc.stopLossPrice.toFixed(2)} (-${calc.stopDistancePercent}%)
Take-Profit 1 (R:R 1:${calc.riskRewardRatio}): PKR ${calc.takeProfit1Price.toFixed(2)} (+${(calc.riskRewardRatio * calc.stopDistancePercent).toFixed(1)}%)
Take-Profit 2 (Runner): PKR ${calc.takeProfit2Price.toFixed(2)}
Recommended Position Size: ${calc.recommendedShares.toLocaleString()} Shares (${calc.boardLots} Board Lots)
Max Capital Exposure: PKR ${calc.totalExposurePKR.toLocaleString()} (${calc.exposurePercent}% of Capital)
Max Defined Risk: PKR ${calc.riskAmountPKR.toLocaleString()} (${calc.riskPercent}% of Portfolio)
Potential Net Gain: PKR ${calc.potentialNetProfitPKR.toLocaleString()}
Brokerage / CDC Est: PKR ${calc.estimatedBrokerageFeesPKR.toLocaleString()}
Shariah Status: KMI-30 Compliant (Purification: ${stock.shariah.dividendPurificationPercent}%)
===========================================`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-[#161b22] border border-[#30363d] rounded-xl p-4 shadow-xl space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#21262d] pb-3">
        <div className="flex items-center gap-2">
          <Calculator className="w-4 h-4 text-emerald-400" />
          <h3 className="text-sm font-bold text-white tracking-tight">
            Institutional Risk Engine & Position Sizing
          </h3>
        </div>
        <button
          onClick={handleCopyPlan}
          className="flex items-center gap-1.5 px-3 py-1 rounded bg-[#0d1117] hover:bg-[#21262d] text-emerald-400 border border-emerald-500/30 text-xs font-medium transition-all"
          title="Copy formatted trade order spec"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          <span>{copied ? 'Trade Spec Copied!' : 'Copy Order Spec'}</span>
        </button>
      </div>

      {/* Inputs Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Account Capital */}
        <div className="bg-[#0d1117] border border-[#30363d] rounded-lg p-3 space-y-1.5">
          <label className="text-[11px] text-gray-400 font-medium flex items-center justify-between">
            <span>Total Capital (PKR)</span>
            <span className="font-mono text-gray-500 text-[10px]">PKR Lacs/M</span>
          </label>
          <div className="relative">
            <input
              type="number"
              value={accountCapital}
              onChange={(e) => setAccountCapital(Math.max(10000, Number(e.target.value)))}
              step="500000"
              className="w-full bg-[#161b22] border border-[#30363d] rounded px-3 py-1.5 text-xs font-mono font-bold text-white focus:outline-none focus:border-emerald-500"
            />
          </div>
          <div className="text-[10px] text-gray-400 font-mono">
            = PKR {(accountCapital / 1_000_000).toFixed(2)} Million
          </div>
        </div>

        {/* Max Risk % */}
        <div className="bg-[#0d1117] border border-[#30363d] rounded-lg p-3 space-y-1.5">
          <label className="text-[11px] text-gray-400 font-medium flex items-center justify-between">
            <span>Max Risk Per Trade (%)</span>
            <span className="font-mono text-emerald-400 text-[10px]">{riskPercent}%</span>
          </label>
          <div className="flex items-center gap-2">
            <input
              type="range"
              min="0.5"
              max="5.0"
              step="0.25"
              value={riskPercent}
              onChange={(e) => setRiskPercent(Number(e.target.value))}
              className="w-full accent-emerald-500 cursor-pointer"
            />
            <span className="font-mono text-xs font-bold text-white w-10 text-right">{riskPercent}%</span>
          </div>
          <div className="text-[10px] text-gray-400 font-mono">
            Max Risk: PKR {((accountCapital * riskPercent) / 100).toLocaleString()}
          </div>
        </div>

        {/* Target Risk:Reward Ratio */}
        <div className="bg-[#0d1117] border border-[#30363d] rounded-lg p-3 space-y-1.5">
          <label className="text-[11px] text-gray-400 font-medium flex items-center justify-between">
            <span>Target R:R Ratio</span>
            <span className="font-mono text-blue-400 text-[10px]">1 : {targetRR}</span>
          </label>
          <div className="flex items-center gap-2">
            <input
              type="range"
              min="1.5"
              max="5.0"
              step="0.5"
              value={targetRR}
              onChange={(e) => setTargetRR(Number(e.target.value))}
              className="w-full accent-blue-500 cursor-pointer"
            />
            <span className="font-mono text-xs font-bold text-white w-10 text-right">1:{targetRR}</span>
          </div>
          <div className="text-[10px] text-gray-400 font-mono">
            Asymmetric Swing Edge
          </div>
        </div>

        {/* Share Entry Price (PKR) */}
        <div className="bg-[#0d1117] border border-[#30363d] rounded-lg p-3 space-y-1.5">
          <label className="text-[11px] text-gray-400 font-medium flex items-center justify-between">
            <span>Share Entry Price (PKR)</span>
            <button
              onClick={() => setEntryPrice(stock.price)}
              className="text-[10px] text-emerald-400 hover:underline"
            >
              Reset Market
            </button>
          </label>
          <input
            type="number"
            value={entryPrice}
            onChange={(e) => setEntryPrice(Number(e.target.value))}
            step="0.1"
            className="w-full bg-[#161b22] border border-[#30363d] rounded px-3 py-1.5 text-xs font-mono font-bold text-white focus:outline-none focus:border-emerald-500"
          />
          <div className="flex items-center justify-between text-[10px] text-gray-400 font-mono">
            <span>ATR (14): {stock.technicals.atr14.toFixed(2)}</span>
            <div className="flex gap-1">
              <button
                onClick={() => setAtrMultiplier(1.0)}
                className={`px-1 rounded ${atrMultiplier === 1.0 ? 'bg-blue-600 text-white' : 'bg-[#21262d]'}`}
              >
                1x
              </button>
              <button
                onClick={() => setAtrMultiplier(1.5)}
                className={`px-1 rounded ${atrMultiplier === 1.5 ? 'bg-blue-600 text-white' : 'bg-[#21262d]'}`}
              >
                1.5x
              </button>
              <button
                onClick={() => setAtrMultiplier(2.0)}
                className={`px-1 rounded ${atrMultiplier === 2.0 ? 'bg-blue-600 text-white' : 'bg-[#21262d]'}`}
              >
                2x
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Outputs Dashboard */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 bg-[#0d1117] border border-[#30363d] rounded-lg p-4 font-mono">
        {/* Recommended Shares */}
        <div className="space-y-1">
          <div className="text-[10px] uppercase text-gray-400">Recommended Shares</div>
          <div className="text-xl font-bold text-emerald-400">
            {calc.recommendedShares.toLocaleString()}
          </div>
          <div className="text-[10px] text-gray-400">
            {calc.boardLots} PSX Board Lots
          </div>
        </div>

        {/* Stop Loss (PKR) */}
        <div className="space-y-1">
          <div className="text-[10px] uppercase text-gray-400">ATR Stop Loss</div>
          <div className="text-xl font-bold text-rose-400">
            PKR {calc.stopLossPrice.toFixed(2)}
          </div>
          <div className="text-[10px] text-rose-300">
            -{calc.stopDistancePercent}% ({atrMultiplier}x ATR {stock.technicals.atr14.toFixed(2)})
          </div>
        </div>

        {/* Take Profit 1 */}
        <div className="space-y-1">
          <div className="text-[10px] uppercase text-gray-400">Target Take Profit 1</div>
          <div className="text-xl font-bold text-emerald-300">
            PKR {calc.takeProfit1Price.toFixed(2)}
          </div>
          <div className="text-[10px] text-emerald-400">
            +{(calc.riskRewardRatio * calc.stopDistancePercent).toFixed(1)}% (1:{calc.riskRewardRatio} R:R)
          </div>
        </div>

        {/* Capital Exposure */}
        <div className="space-y-1">
          <div className="text-[10px] uppercase text-gray-400">Total Capital Exposure</div>
          <div className="text-xl font-bold text-blue-400">
            PKR {calc.totalExposurePKR.toLocaleString()}
          </div>
          <div className="text-[10px] text-blue-300">
            {calc.exposurePercent}% of Portfolio
          </div>
        </div>
      </div>

      {/* PnL & Transaction Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs font-mono">
        <div className="bg-[#161b22] border border-[#21262d] rounded-lg p-2.5 flex items-center justify-between">
          <span className="text-gray-400">Max Portfolio Risk:</span>
          <span className="font-bold text-rose-400">PKR {calc.riskAmountPKR.toLocaleString()}</span>
        </div>

        <div className="bg-[#161b22] border border-[#21262d] rounded-lg p-2.5 flex items-center justify-between">
          <span className="text-gray-400">Potential Net Profit (TP1):</span>
          <span className="font-bold text-emerald-400">+PKR {calc.potentialNetProfitPKR.toLocaleString()}</span>
        </div>

        <div className="bg-[#161b22] border border-[#21262d] rounded-lg p-2.5 flex items-center justify-between">
          <span className="text-gray-400">Est. CDC / Brokerage (0.15%):</span>
          <span className="font-bold text-amber-300">PKR {calc.estimatedBrokerageFeesPKR.toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
};
