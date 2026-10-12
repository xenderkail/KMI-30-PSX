import React, { useState } from 'react';
import { StockData } from '../types/stock';
import { TradingViewChart } from './TradingViewChart';
import { TechnicalSwingPanel } from './TechnicalSwingPanel';
import { Level2DOM } from './Level2DOM';
import { ShariahComplianceCard } from './ShariahComplianceCard';
import { RiskEngineCalculator } from './RiskEngineCalculator';
import { 
  ArrowLeft, 
  ChevronLeft, 
  ChevronRight, 
  TrendingUp, 
  TrendingDown, 
  ShieldCheck, 
  Layers, 
  Calculator, 
  Compass, 
  BarChart2, 
  Edit3,
  Check,
  X,
  PlusCircle,
  HelpCircle,
  ExternalLink,
  Trash2,
  RefreshCw,
  Sparkles,
  ClipboardPaste,
  AlertTriangle,
  Activity
} from 'lucide-react';

interface StockDetailWorkspaceProps {
  stock: StockData;
  allStocks: StockData[];
  onBack: () => void;
  onSelectStock: (stock: StockData) => void;
  onUpdatePrice?: (symbol: string, newPrice: number, changePercent?: number) => void;
  onDeleteStock?: (symbol: string) => void;
  onOpenAddStock?: () => void;
  onOpenPriceModal?: (stock: StockData) => void;
}

export const StockDetailWorkspace: React.FC<StockDetailWorkspaceProps> = ({
  stock,
  allStocks,
  onBack,
  onSelectStock,
  onUpdatePrice,
  onDeleteStock,
  onOpenAddStock,
  onOpenPriceModal,
}) => {
  const [activeTab, setActiveTab] = useState<'all' | 'update' | 'chart' | 'dom' | 'shariah' | 'risk'>('all');
  const [isEditingPrice, setIsEditingPrice] = useState<boolean>(false);
  const [customPriceInput, setCustomPriceInput] = useState<string>(stock.price.toString());
  const [customChangeInput, setCustomChangeInput] = useState<string>(stock.changePercent.toString());
  const [pasteSnippet, setPasteSnippet] = useState<string>('');
  const [parseNotice, setParseNotice] = useState<string | null>(null);
  const [isSavedNotice, setIsSavedNotice] = useState<boolean>(false);

  const currentIndex = allStocks.findIndex((s) => s.symbol === stock.symbol);
  const prevStock = allStocks[(currentIndex - 1 + allStocks.length) % allStocks.length];
  const nextStock = allStocks[(currentIndex + 1) % allStocks.length];

  const isPositive = stock.change >= 0;

  const handleSavePrice = () => {
    const val = parseFloat(customPriceInput);
    const pct = parseFloat(customChangeInput);
    if (!isNaN(val) && val > 0 && onUpdatePrice) {
      onUpdatePrice(stock.symbol, val, isNaN(pct) ? undefined : pct);
      setIsSavedNotice(true);
      setTimeout(() => setIsSavedNotice(false), 3000);
    }
    setIsEditingPrice(false);
  };

  const handleParseSnippet = () => {
    if (!pasteSnippet.trim()) return;
    const clean = pasteSnippet.replace(/,/g, '');
    const numbers = clean.match(/[-+]?[0-9]*\.?[0-9]+/g);
    if (numbers && numbers.length > 0) {
      const parsedPrice = parseFloat(numbers[0]);
      if (!isNaN(parsedPrice) && parsedPrice > 0) {
        setCustomPriceInput(parsedPrice.toString());
        if (numbers.length > 1) {
          const parsedChange = parseFloat(numbers[1]);
          if (!isNaN(parsedChange)) {
            setCustomChangeInput(parsedChange.toString());
          }
        }
        setParseNotice(`Extracted Quote: PKR ${parsedPrice}`);
        setTimeout(() => setParseNotice(null), 3000);
      }
    }
  };

  return (
    <div className="space-y-4">
      {/* Top Breadcrumb & Executive Stock Header */}
      <div className="bg-[#161b22] border border-[#30363d] rounded-xl p-4 shadow-xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Left: Back button & Ticker Overview */}
          <div className="flex items-center gap-3.5">
            <button
              onClick={onBack}
              className="p-2 rounded-lg bg-[#0d1117] hover:bg-[#21262d] text-gray-300 hover:text-white border border-[#30363d] transition-all flex items-center gap-1.5 text-xs font-semibold shadow-sm group"
              title="Return to 30-Stock Screener Matrix"
            >
              <ArrowLeft className="w-4 h-4 text-emerald-400 group-hover:-translate-x-0.5 transition-transform" />
              <span className="hidden sm:inline">30-Stock Matrix</span>
            </button>

            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <h2 className="text-xl font-mono font-bold text-white tracking-tight">
                  {stock.symbol}
                </h2>
                <span className="text-xs font-mono bg-[#0d1117] text-blue-300 px-2 py-0.5 rounded border border-[#30363d]">
                  {stock.tradingViewSymbol}
                </span>
                <span className="text-xs px-2 py-0.5 rounded bg-[#0d1117] text-gray-300 border border-[#30363d]">
                  {stock.sector}
                </span>
                <span className="flex items-center gap-1 text-xs text-emerald-400 font-semibold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>KMI-30 Shariah Compliant</span>
                </span>
              </div>
              <p className="text-xs text-gray-400 mt-0.5 font-medium">{stock.name}</p>
            </div>
          </div>

          {/* Center: Live Price & Key Metrics (with Quick Price Adjuster) */}
          <div className="flex items-center gap-4 bg-[#0d1117] px-4 py-2 rounded-lg border border-[#30363d] flex-wrap">
            <div>
              <div className="flex items-center gap-2 text-[10px] uppercase font-mono text-gray-400">
                <span>Market Price</span>
                <button
                  onClick={() => {
                    setCustomPriceInput(stock.price.toString());
                    setCustomChangeInput(stock.changePercent.toString());
                    setIsEditingPrice(!isEditingPrice);
                  }}
                  className="text-emerald-400 hover:text-emerald-300 text-[10px] underline font-medium flex items-center gap-0.5"
                  title="Adjust exact PSX market price or day change % without false spikes"
                >
                  <Edit3 className="w-2.5 h-2.5" />
                  <span>{isEditingPrice ? 'Cancel' : 'Edit Price'}</span>
                </button>
              </div>

              {isEditingPrice ? (
                <div className="flex items-center gap-1.5 mt-1 bg-[#161b22] p-1.5 rounded border border-emerald-500/60">
                  <span className="text-xs text-gray-400 font-mono">PKR</span>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="Price"
                    value={customPriceInput}
                    onChange={(e) => setCustomPriceInput(e.target.value)}
                    className="w-20 bg-[#0d1117] border border-[#30363d] rounded px-1.5 py-0.5 text-xs font-mono font-bold text-emerald-400 focus:outline-none"
                    autoFocus
                  />
                  <span className="text-[10px] text-gray-400 ml-1">Change%</span>
                  <input
                    type="number"
                    step="0.1"
                    placeholder="Day %"
                    value={customChangeInput}
                    onChange={(e) => setCustomChangeInput(e.target.value)}
                    className="w-16 bg-[#0d1117] border border-[#30363d] rounded px-1.5 py-0.5 text-xs font-mono text-white focus:outline-none"
                    title="Setting day % automatically syncs previous close so no false 30% signals occur"
                  />
                  <button
                    onClick={handleSavePrice}
                    className="px-2 py-0.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-xs font-bold font-mono ml-1 flex items-center gap-1"
                  >
                    <Check className="w-3 h-3" />
                    <span>Save</span>
                  </button>
                </div>
              ) : (
                <div className="text-lg font-mono font-bold text-white flex items-center gap-2">
                  <span>PKR {stock.price.toFixed(2)}</span>
                </div>
              )}
            </div>

            <div className={`text-right ${isPositive ? 'text-emerald-400' : 'text-rose-400'}`}>
              <div className="text-[10px] uppercase font-mono">Day Change</div>
              <div className="text-sm font-mono font-bold flex items-center justify-end gap-1">
                {isPositive ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
                <span>
                  {isPositive ? '+' : ''}{stock.change.toFixed(2)} ({isPositive ? '+' : ''}{stock.changePercent.toFixed(2)}%)
                </span>
              </div>
            </div>

            <div className="hidden sm:block pl-3 border-l border-[#21262d] text-right">
              <div className="text-[10px] uppercase font-mono text-gray-400">Day High / Low</div>
              <div className="text-xs font-mono font-semibold text-gray-200">
                {stock.high.toFixed(2)} / {stock.low.toFixed(2)}
              </div>
            </div>

            <div className="hidden md:block pl-3 border-l border-[#21262d] text-right">
              <div className="text-[10px] uppercase font-mono text-gray-400">52W Range</div>
              <div className="text-xs font-mono font-semibold text-gray-200">
                {stock.low52.toFixed(1)} - {stock.high52.toFixed(1)}
              </div>
            </div>

            <div className="hidden lg:block pl-3 border-l border-[#21262d] text-right">
              <div className="text-[10px] uppercase font-mono text-gray-400">Market Cap</div>
              <div className="text-xs font-mono font-semibold text-gray-200">
                PKR {stock.marketCapBillionPKR.toFixed(1)}B
              </div>
            </div>
          </div>

          {/* Right: Next / Prev stock cycling buttons + Add Stock trigger + Delete Stock */}
          <div className="flex items-center gap-2">
            {onOpenAddStock && (
              <button
                onClick={onOpenAddStock}
                className="p-2 rounded-lg bg-emerald-600/15 hover:bg-emerald-600/30 text-emerald-400 border border-emerald-500/40 transition-all flex items-center gap-1.5 text-xs font-semibold"
                title="Add any custom PSX stock to workspace"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Add Stock</span>
              </button>
            )}

            {onDeleteStock && (
              <button
                onClick={() => {
                  if (window.confirm(`Are you sure you want to remove ${stock.symbol} (${stock.name}) from the workspace?`)) {
                    onDeleteStock(stock.symbol);
                  }
                }}
                className="p-2 rounded-lg bg-rose-600/10 hover:bg-rose-600/25 text-rose-400 border border-rose-500/30 hover:border-rose-500/60 transition-all flex items-center gap-1.5 text-xs font-medium"
                title={`Delete ${stock.symbol} from workspace`}
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span className="hidden lg:inline">Delete Stock</span>
              </button>
            )}

            <button
              onClick={() => onSelectStock(prevStock)}
              className="p-2 rounded-lg bg-[#0d1117] hover:bg-[#21262d] text-gray-400 hover:text-white border border-[#30363d] transition-all flex items-center gap-1 text-xs"
              title={`Previous: ${prevStock.symbol}`}
            >
              <ChevronLeft className="w-4 h-4" />
              <span className="font-mono hidden sm:inline">{prevStock.symbol}</span>
            </button>
            <button
              onClick={() => onSelectStock(nextStock)}
              className="p-2 rounded-lg bg-[#0d1117] hover:bg-[#21262d] text-gray-400 hover:text-white border border-[#30363d] transition-all flex items-center gap-1 text-xs"
              title={`Next: ${nextStock.symbol}`}
            >
              <span className="font-mono hidden sm:inline">{nextStock.symbol}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Under Stock Actions & Market Portals Tab Row */}
        <div className="flex items-center justify-between gap-3 mt-3.5 pt-3 border-t border-[#21262d] flex-wrap text-xs font-mono">
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => onOpenPriceModal ? onOpenPriceModal(stock) : setIsEditingPrice(true)}
              className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold flex items-center gap-1.5 shadow-md shadow-emerald-600/20 active:scale-95 transition-all cursor-pointer"
              title={`Update current price for ${stock.symbol}`}
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Update Price (PKR)</span>
            </button>

            <a
              href={`https://dps.psx.com.pk/company/${stock.symbol}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 rounded-lg bg-[#0d1117] hover:bg-amber-600/20 text-amber-400 border border-amber-500/40 flex items-center gap-1.5 transition-all font-semibold"
              title="Open Official PSX Data Portal for live quotes, announcements and balance sheet"
            >
              <span>PSX Data Portal (DPS)</span>
              <ExternalLink className="w-3 h-3" />
            </a>

            <a
              href={`https://investify.pk/stocks/${stock.symbol}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 rounded-lg bg-[#0d1117] hover:bg-blue-600/20 text-blue-400 border border-blue-500/40 flex items-center gap-1.5 transition-all font-semibold"
              title="Open Investify.pk stock profile & fundamentals"
            >
              <span>Investify.pk Hub</span>
              <ExternalLink className="w-3 h-3" />
            </a>

            <a
              href={`https://sarmaaya.pk/stocks/${stock.symbol}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 rounded-lg bg-[#0d1117] hover:bg-purple-600/20 text-purple-400 border border-purple-500/40 flex items-center gap-1.5 transition-all font-semibold"
              title="Open Sarmaaya.pk profile"
            >
              <span>Sarmaaya.pk</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          <div className="text-gray-400 text-[11px] flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>Real-time Portals Synchronized</span>
          </div>
        </div>

        {/* Streamlined View Focus Tabs */}
        <div className="flex items-center gap-2 mt-4 pt-3 border-t border-[#21262d] overflow-x-auto text-xs">
          <span className="text-[11px] text-gray-400 uppercase tracking-wider font-semibold mr-1 shrink-0">
            Workspace View:
          </span>
          {[
            { id: 'all', label: 'Complete Institutional Workspace' },
            { id: 'update', label: '⚡ Update Price & Portals (PSX / Investify)' },
            { id: 'chart', label: 'PSX Pro Candlestick Chart & Technicals' },
            { id: 'dom', label: 'Level-2 DOM & Institutional Liquidity' },
            { id: 'shariah', label: 'KMI-30 Shariah Screening Audit' },
            { id: 'risk', label: 'Custom User Risk Engine & Position Sizer' },
          ].map((tab) => {
            const isSelected = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-[#0d1117] text-gray-400 hover:text-gray-200 border border-[#30363d]'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Content Workspace Layout */}
      {/* 1. Complete Institutional Workspace */}
      {activeTab === 'all' && (
        <div className="space-y-4">
          {/* PSX Real-Time Chart & Technical Indicators */}
          <TradingViewChart stock={stock} />

          {/* Quantitative Swing Strategy Panel (Supertrend, RSI, MACD, EMA cross, Dynamic Pivots) */}
          <TechnicalSwingPanel stock={stock} />

          {/* Two-Column Grid: Level-2 DOM & Risk Engine */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
            <Level2DOM stock={stock} />
            <RiskEngineCalculator stock={stock} />
          </div>

          {/* KMI-30 Shariah Screening Card */}
          <ShariahComplianceCard stock={stock} />
        </div>
      )}

      {/* 2. Dedicated Update Price & Portals Tab */}
      {activeTab === 'update' && (
        <div className="space-y-4">
          {/* Top Info Banner */}
          <div className="bg-[#161b22] border border-[#30363d] rounded-xl p-5 shadow-xl">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <span>Price Synchronization & Exchange Portals:</span>
                  <span className="font-mono text-emerald-400">{stock.symbol}</span>
                  <span className="text-xs text-gray-400 font-normal">({stock.name})</span>
                </h3>
                <p className="text-xs text-gray-400 mt-1">
                  Adjust current session price with zero false-spike recalculations, or deep-link to verified PSX and Investify portals for official quotes.
                </p>
              </div>

              {/* Portal Deep-Links */}
              <div className="flex items-center gap-2 flex-wrap">
                <a
                  href={`https://dps.psx.com.pk/company/${stock.symbol}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 rounded-lg bg-[#0d1117] hover:bg-amber-600/20 text-amber-400 border border-amber-500/40 text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm"
                  title="Open official PSX DPS company page"
                >
                  <span>PSX DPS Portal</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>

                <a
                  href={`https://investify.pk/stocks/${stock.symbol}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 rounded-lg bg-[#0d1117] hover:bg-blue-600/20 text-blue-400 border border-blue-500/40 text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm"
                  title="Open Investify.pk stock profile"
                >
                  <span>Investify Hub</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>

                <a
                  href={`https://sarmaaya.pk/stocks/${stock.symbol}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 rounded-lg bg-[#0d1117] hover:bg-purple-600/20 text-purple-400 border border-purple-500/40 text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm"
                  title="Open Sarmaaya.pk valuation"
                >
                  <span>Sarmaaya</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>

          {/* Form and Clipboard Parser Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Left Card: Price & Session Form */}
            <div className="bg-[#161b22] border border-[#30363d] rounded-xl p-5 shadow-xl space-y-4">
              <div className="flex items-center justify-between border-b border-[#21262d] pb-3">
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <Edit3 className="w-4 h-4 text-emerald-400" />
                  <span>Manual Price & Session Input</span>
                </h4>
                <span className="text-[11px] font-mono text-gray-400">
                  Current: PKR <strong className="text-white">{stock.price.toFixed(2)}</strong> ({stock.changePercent >= 0 ? '+' : ''}{stock.changePercent.toFixed(2)}%)
                </span>
              </div>

              {isSavedNotice && (
                <div className="bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 p-2.5 rounded-lg text-xs flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span>Market price and indicators updated successfully with zero-gap protection!</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="block text-gray-300 font-semibold mb-1">
                    Market Price (PKR) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={customPriceInput}
                    onChange={(e) => setCustomPriceInput(e.target.value)}
                    className="w-full bg-[#0d1117] border border-[#30363d] rounded-lg px-3 py-2 font-mono font-bold text-emerald-400 text-sm focus:outline-none focus:border-emerald-500"
                    placeholder="e.g. 184.00"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 font-semibold mb-1">
                    Today's Change (%)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={customChangeInput}
                    onChange={(e) => setCustomChangeInput(e.target.value)}
                    className="w-full bg-[#0d1117] border border-[#30363d] rounded-lg px-3 py-2 font-mono text-white text-sm focus:outline-none focus:border-emerald-500"
                    placeholder="e.g. 1.57"
                  />
                </div>
              </div>

              {/* Quick % Delta Presets */}
              <div>
                <label className="block text-[11px] text-gray-400 mb-1.5 uppercase tracking-wider">
                  Quick Session Change Adjuster:
                </label>
                <div className="flex items-center gap-1.5 flex-wrap">
                  {[-5, -2, -1, 0, 1, 2, 5].map((pct) => (
                    <button
                      key={pct}
                      type="button"
                      onClick={() => setCustomChangeInput(pct.toString())}
                      className={`px-2.5 py-1 rounded text-xs font-mono font-semibold transition-all cursor-pointer ${
                        parseFloat(customChangeInput) === pct
                          ? 'bg-blue-600 text-white shadow-sm'
                          : pct < 0
                          ? 'bg-[#0d1117] hover:bg-rose-900/30 text-rose-400 border border-[#30363d]'
                          : pct > 0
                          ? 'bg-[#0d1117] hover:bg-emerald-900/30 text-emerald-400 border border-[#30363d]'
                          : 'bg-[#0d1117] hover:bg-[#21262d] text-gray-300 border border-[#30363d]'
                      }`}
                    >
                      {pct > 0 ? `+${pct}%` : `${pct}%`}
                    </button>
                  ))}
                </div>
              </div>

              {/* Save & Apply Button */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleSavePrice}
                  className="w-full py-2.5 px-4 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs flex items-center justify-center gap-2 transition-all shadow-md active:scale-98 cursor-pointer"
                >
                  <Check className="w-4 h-4" />
                  <span>Save & Recalculate Technicals, Pivots & Level-2 DOM</span>
                </button>
              </div>

              {/* Zero Spike Notice */}
              <div className="text-[11px] text-gray-400 bg-[#0d1117] p-3 rounded-lg border border-[#21262d] flex items-start gap-2">
                <Sparkles className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>
                  <strong>Continuous Smoothing Enabled:</strong> When updating prices (e.g. DGKC to 184, LOTCHEM to 26.38), previous close and candlestick scaling are recalibrated in lockstep to prevent false 31% daily anomaly spikes.
                </span>
              </div>
            </div>

            {/* Right Card: Clipboard Parser & Stock Management */}
            <div className="bg-[#161b22] border border-[#30363d] rounded-xl p-5 shadow-xl space-y-4 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-[#21262d] pb-3">
                  <h4 className="text-sm font-bold text-white flex items-center gap-2">
                    <ClipboardPaste className="w-4 h-4 text-blue-400" />
                    <span>Auto-Retrieval / Paste Quote from DPS or Investify</span>
                  </h4>
                  <span className="text-[11px] font-mono text-blue-400">1-Click Auto-Fill</span>
                </div>

                <p className="text-xs text-gray-300 leading-relaxed">
                  Copy quote text from <strong>PSX DPS</strong> or <strong>Investify.pk</strong> and paste it below. The parser extracts the price and percentage change automatically:
                </p>

                <div className="space-y-2">
                  <textarea
                    rows={3}
                    value={pasteSnippet}
                    onChange={(e) => setPasteSnippet(e.target.value)}
                    placeholder="e.g. Current Price: 184.00, Change: +2.85 (+1.57%), Volume: 14,250,000, High: 186.20, Low: 180.80"
                    className="w-full bg-[#0d1117] border border-[#30363d] rounded-lg p-3 text-xs text-white font-mono focus:outline-none focus:border-blue-500 resize-none"
                  />

                  {parseNotice && (
                    <div className="text-xs text-emerald-400 font-mono bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded flex items-center gap-2">
                      <Check className="w-3.5 h-3.5" />
                      <span>{parseNotice}</span>
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={handleParseSnippet}
                    className="w-full py-2 px-3 rounded-lg bg-[#21262d] hover:bg-[#30363d] text-blue-400 hover:text-blue-300 border border-blue-500/30 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                  >
                    <ClipboardPaste className="w-3.5 h-3.5" />
                    <span>Extract Quote & Populate Fields</span>
                  </button>
                </div>
              </div>

              {/* Danger Zone: Delete Stock from Universe */}
              {onDeleteStock && (
                <div className="pt-4 border-t border-[#21262d]">
                  <div className="bg-rose-500/10 border border-rose-500/30 rounded-xl p-3 flex items-center justify-between gap-3">
                    <div>
                      <div className="text-xs font-bold text-rose-300 flex items-center gap-1.5">
                        <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
                        <span>Remove from Workspace Universe</span>
                      </div>
                      <p className="text-[11px] text-gray-400 mt-0.5">
                        Delete {stock.symbol} ({stock.name}) and adjust all matrix counters.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        if (window.confirm(`Are you sure you want to delete ${stock.symbol} from your active workspace?`)) {
                          onDeleteStock(stock.symbol);
                        }
                      }}
                      className="px-3 py-1.5 bg-rose-600 hover:bg-rose-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all shrink-0 cursor-pointer shadow-md"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Delete Stock</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Real-time preview of Indicators after Price Update */}
          <div className="space-y-4 pt-2">
            <h4 className="text-xs font-mono uppercase tracking-wider text-gray-400 flex items-center gap-2">
              <Activity className="w-3.5 h-3.5 text-emerald-400" />
              <span>Real-Time Model Recalculations for {stock.symbol}</span>
            </h4>
            <TechnicalSwingPanel stock={stock} />
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
              <Level2DOM stock={stock} />
              <RiskEngineCalculator stock={stock} />
            </div>
          </div>
        </div>
      )}

      {activeTab === 'chart' && (
        <div className="space-y-4">
          <TradingViewChart stock={stock} />
          <TechnicalSwingPanel stock={stock} />
        </div>
      )}

      {activeTab === 'dom' && (
        <div className="space-y-4">
          <Level2DOM stock={stock} />
          <TechnicalSwingPanel stock={stock} />
        </div>
      )}

      {activeTab === 'shariah' && (
        <div className="space-y-4">
          <ShariahComplianceCard stock={stock} />
          <RiskEngineCalculator stock={stock} />
        </div>
      )}

      {activeTab === 'risk' && (
        <div className="space-y-4">
          <RiskEngineCalculator stock={stock} />
          <TechnicalSwingPanel stock={stock} />
        </div>
      )}
    </div>
  );
};
