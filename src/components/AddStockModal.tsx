import React, { useState } from 'react';
import { StockData } from '../types/stock';
import { calculatePivots, generateOrderBook, generateStockHistory } from '../data/kmi30Data';
import { 
  Plus, 
  X, 
  ShieldCheck, 
  TrendingUp, 
  Calculator, 
  Building2, 
  Check, 
  AlertCircle,
  HelpCircle,
  Info
} from 'lucide-react';

interface AddStockModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddStock: (newStock: StockData) => void;
}

export const AddStockModal: React.FC<AddStockModalProps> = ({
  isOpen,
  onClose,
  onAddStock,
}) => {
  const [symbol, setSymbol] = useState('');
  const [name, setName] = useState('');
  const [sector, setSector] = useState('Oil & Gas');
  const [price, setPrice] = useState('26.38');
  const [changePercent, setChangePercent] = useState('0.88');
  const [volume, setVolume] = useState('9800000');
  const [debtToAssets, setDebtToAssets] = useState('14.5');
  const [illiquidAssets, setIlliquidAssets] = useState('68.0');
  const [chartPattern, setChartPattern] = useState<'ASCENDING_CHANNEL' | 'CUP_AND_HANDLE' | 'BREAKOUT_RETEST' | 'CONSOLIDATION_BOX' | 'BULL_FLAG' | 'DOUBLE_BOTTOM'>('CONSOLIDATION_BOX');
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanSym = symbol.trim().toUpperCase();
    if (!cleanSym) {
      setError('Please enter a valid PSX ticker symbol (e.g. PRL, LOTCHEM, WTL, KEL).');
      return;
    }

    const currentPrice = parseFloat(price);
    if (isNaN(currentPrice) || currentPrice <= 0) {
      setError('Please enter a valid market price in PKR.');
      return;
    }

    const pct = parseFloat(changePercent) || 0;
    // Calculate previous close smoothly to prevent false 31% jumps
    const prevClose = Number((currentPrice / (1 + pct / 100)).toFixed(2));
    const delta = Number((currentPrice - prevClose).toFixed(2));

    const vol = parseInt(volume, 10) || 5000000;
    const debt = parseFloat(debtToAssets) || 15.0;
    const illiquid = parseFloat(illiquidAssets) || 65.0;

    const high = Number((Math.max(currentPrice, prevClose) * 1.018).toFixed(2));
    const low = Number((Math.min(currentPrice, prevClose) * 0.985).toFixed(2));
    const open = Number((prevClose * (1 + (pct > 0 ? 0.003 : -0.003))).toFixed(2));
    const atr = Number((currentPrice * 0.026).toFixed(2));

    const isBullish = pct >= 0;
    const supertrendVal = isBullish ? Number((currentPrice - atr * 2).toFixed(2)) : Number((currentPrice + atr * 2).toFixed(2));
    const trailingSL = isBullish ? Number((currentPrice - atr * 1.5).toFixed(2)) : Number((currentPrice + atr * 1.5).toFixed(2));

    const rsi = Math.min(85, Math.max(30, 52 + pct * 5));
    const rsiZone = rsi >= 70 ? 'OVERBOUGHT' : rsi <= 35 ? 'OVERSOLD' : rsi >= 55 ? 'BULLISH' : 'NEUTRAL';

    const pivots = calculatePivots(high, low, currentPrice);
    const orderBook = generateOrderBook(currentPrice, vol);
    const history = generateStockHistory(cleanSym, currentPrice, vol, chartPattern);

    const swingScore = Math.min(96, Math.max(40, Math.round(60 + pct * 8 + (debt < 25 ? 10 : 0))));
    const swingSignal = swingScore >= 80 ? 'STRONG_BUY' : swingScore >= 65 ? 'BUY' : swingScore >= 50 ? 'ACCUMULATE' : 'NEUTRAL';

    const newStock: StockData = {
      symbol: cleanSym,
      name: name.trim() || `${cleanSym} Limited`,
      sector: sector as any,
      tradingViewSymbol: `PSX:${cleanSym}`,
      price: currentPrice,
      change: delta,
      changePercent: pct,
      open,
      high,
      low,
      prevClose,
      volume: vol,
      high52: Number((currentPrice * 1.25).toFixed(2)),
      low52: Number((currentPrice * 0.70).toFixed(2)),
      marketCapBillionPKR: Number(((currentPrice * (vol * 40)) / 1_000_000_000).toFixed(1)),
      peRatio: 6.5,
      swingScore,
      swingSignal,
      shariah: {
        debtToAssets: debt,
        illiquidAssets: illiquid,
        nonCompliantInvestments: 2.0,
        nonPermissibleIncomePercent: 1.0,
        netLiquidAssetsPerShare: Number((currentPrice * 0.35).toFixed(2)),
        marketPriceVsLiquidAssets: true,
        isCompliant: debt <= 37 && illiquid >= 25,
        dividendPurificationPercent: 1.0,
        shariahAdvisor: 'Al-Meezan / PSX Shariah Board',
      },
      technicals: {
        supertrend: isBullish ? 'BULLISH' : 'BEARISH',
        supertrendValue: supertrendVal,
        supertrendTrailingStop: trailingSL,
        rsi14: Number(rsi.toFixed(1)),
        rsiZone,
        macdLine: Number((currentPrice * 0.015).toFixed(2)),
        macdSignal: Number((currentPrice * 0.011).toFixed(2)),
        macdHist: Number((currentPrice * 0.004).toFixed(2)),
        ema20: Number((currentPrice * 0.985).toFixed(2)),
        ema50: Number((currentPrice * 0.940).toFixed(2)),
        emaCross: 'GOLDEN_CROSS',
        atr14: atr,
        pivots,
      },
      orderBook,
      history,
      investifyUrl: `https://investify.pk`,
      kseAlertUrl: `https://ksealert.com/stocks/${cleanSym}`,
      sarmaayaUrl: `https://sarmaaya.pk/stocks/${cleanSym}`,
      psxDpsUrl: `https://dps.psx.com.pk/company/${cleanSym}`,
    };

    onAddStock(newStock);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-[#161b22] border border-[#30363d] rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="px-6 py-4 bg-[#0d1117] border-b border-[#30363d] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
              <Plus className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
                <span>Add Any PSX Stock to Workspace</span>
                <span className="text-[10px] font-mono bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded border border-blue-500/30">
                  INSTITUTIONAL SCREENER
                </span>
              </h3>
              <p className="text-xs text-gray-400">
                Track any Pakistan Stock Exchange company with full candlestick charts, DOM, & Shariah screening
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white p-1.5 rounded-lg hover:bg-[#21262d] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="bg-rose-500/10 border border-rose-500/30 text-rose-300 px-4 py-2.5 rounded-xl text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Quick Notice on avoiding false 31% spikes */}
          <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 p-3 rounded-xl text-xs flex items-start gap-2.5">
            <Info className="w-4 h-4 shrink-0 mt-0.5" />
            <div>
              <strong className="text-white">Zero False-Signal Protection:</strong>
              <p className="text-gray-300 text-[11px] mt-0.5">
                When you specify the price and Day Change %, previous close and candlestick history are automatically synchronized proportionally, so you never get false 31% breakout signals.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1">
                PSX Ticker Symbol *
              </label>
              <input
                type="text"
                placeholder="e.g. PRL, LOTCHEM, WTL, KEL"
                value={symbol}
                onChange={(e) => setSymbol(e.target.value.toUpperCase())}
                className="w-full bg-[#0d1117] border border-[#30363d] rounded-lg px-3 py-2 text-sm text-white font-mono uppercase focus:outline-none focus:border-emerald-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1">
                Company Full Name
              </label>
              <input
                type="text"
                placeholder="e.g. Pakistan Refinery Limited"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-[#0d1117] border border-[#30363d] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1">
                Sector
              </label>
              <select
                value={sector}
                onChange={(e) => setSector(e.target.value)}
                className="w-full bg-[#0d1117] border border-[#30363d] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
              >
                <option value="Oil & Gas">Oil & Gas</option>
                <option value="Cement">Cement</option>
                <option value="Fertilizer">Fertilizer</option>
                <option value="Technology">Technology</option>
                <option value="Power">Power</option>
                <option value="Commercial Banks">Commercial Banks</option>
                <option value="Automobile Assembler">Automobile Assembler</option>
                <option value="Automobile Parts & Accessories">Automobile Parts & Accessories</option>
                <option value="Cable & Electrical Goods">Cable & Electrical Goods</option>
                <option value="Chemicals">Chemicals</option>
                <option value="Engineering">Engineering</option>
                <option value="Food & Personal Care">Food & Personal Care</option>
                <option value="Glass & Ceramics">Glass & Ceramics</option>
                <option value="Insurance">Insurance</option>
                <option value="Investment Banks / Cos">Investment Banks / Cos</option>
                <option value="Leather & Tanneries">Leather & Tanneries</option>
                <option value="Miscellaneous">Miscellaneous</option>
                <option value="Paper & Board">Paper & Board</option>
                <option value="Pharmaceuticals">Pharmaceuticals</option>
                <option value="Refinery">Refinery</option>
                <option value="Sugar & Allied Industries">Sugar & Allied Industries</option>
                <option value="Synthetic & Rayon">Synthetic & Rayon</option>
                <option value="Textile Composite">Textile Composite</option>
                <option value="Textile Spinning">Textile Spinning</option>
                <option value="Tobacco">Tobacco</option>
                <option value="Transport">Transport</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1">
                Current Price (PKR) *
              </label>
              <input
                type="number"
                step="0.01"
                placeholder="e.g. 26.38"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full bg-[#0d1117] border border-[#30363d] rounded-lg px-3 py-2 text-sm text-emerald-400 font-mono font-bold focus:outline-none focus:border-emerald-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1">
                Today's Change (%)
              </label>
              <input
                type="number"
                step="0.05"
                placeholder="e.g. 0.88"
                value={changePercent}
                onChange={(e) => setChangePercent(e.target.value)}
                className="w-full bg-[#0d1117] border border-[#30363d] rounded-lg px-3 py-2 text-sm text-white font-mono focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1">
                Daily Volume (Shares)
              </label>
              <input
                type="number"
                step="10000"
                placeholder="e.g. 8500000"
                value={volume}
                onChange={(e) => setVolume(e.target.value)}
                className="w-full bg-[#0d1117] border border-[#30363d] rounded-lg px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1">
                Chart Pattern Profile
              </label>
              <select
                value={chartPattern}
                onChange={(e) => setChartPattern(e.target.value as any)}
                className="w-full bg-[#0d1117] border border-[#30363d] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
              >
                <option value="CONSOLIDATION_BOX">Consolidation Box (Tight Range)</option>
                <option value="ASCENDING_CHANNEL">Ascending Channel (Higher Lows)</option>
                <option value="BREAKOUT_RETEST">Breakout Retest (Support Bounce)</option>
                <option value="CUP_AND_HANDLE">Cup & Handle (Rounded Base)</option>
                <option value="BULL_FLAG">Bull Flag (Continuation)</option>
                <option value="DOUBLE_BOTTOM">Double Bottom (W Reversal)</option>
              </select>
            </div>
          </div>

          <div className="p-3.5 bg-[#0d1117] rounded-xl border border-[#21262d] space-y-2">
            <div className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4" />
              <span>KMI-30 Shariah Compliance Parameters</span>
            </div>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block text-[11px] text-gray-400 mb-0.5">
                  Debt to Total Assets (&lt;37%)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={debtToAssets}
                  onChange={(e) => setDebtToAssets(e.target.value)}
                  className="w-full bg-[#161b22] border border-[#30363d] rounded px-2 py-1 text-xs text-gray-200 font-mono"
                />
              </div>
              <div>
                <label className="block text-[11px] text-gray-400 mb-0.5">
                  Illiquid Assets (&gt;25%)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={illiquidAssets}
                  onChange={(e) => setIlliquidAssets(e.target.value)}
                  className="w-full bg-[#161b22] border border-[#30363d] rounded px-2 py-1 text-xs text-gray-200 font-mono"
                />
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="pt-2 flex items-center justify-end gap-3 border-t border-[#21262d]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-xs font-semibold text-gray-400 hover:text-white hover:bg-[#21262d] transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-lg text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white transition-all shadow-lg shadow-emerald-600/20 active:scale-95 flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>Add Stock to Workspace</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
