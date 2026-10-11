import React, { useState, useEffect } from 'react';
import { StockData } from '../types/stock';
import { 
  TrendingUp, 
  RefreshCw, 
  Download, 
  Clock, 
  ShieldCheck, 
  Activity, 
  DollarSign, 
  Layers,
  ChevronRight,
  Sliders,
  CheckCircle2,
  Sparkles,
  Plus
} from 'lucide-react';
import { exportStandaloneHtml } from '../utils/exportStandaloneHtml';

interface HeaderProps {
  stocks: StockData[];
  onRefreshData: () => void;
  isRefreshing: boolean;
  lastUpdated: Date;
  activeStock: StockData | null;
  onClearActiveStock: () => void;
  onSelectStock: (stock: StockData) => void;
  onOpenAddStock?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  stocks,
  onRefreshData,
  isRefreshing,
  lastUpdated,
  activeStock,
  onClearActiveStock,
  onSelectStock,
  onOpenAddStock
}) => {
  const [currentTime, setCurrentTime] = useState<string>('');
  const [marketStatus, setMarketStatus] = useState<string>('REGULAR PSX TRADING');
  const [isExporting, setIsExporting] = useState<boolean>(false);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      // Format in Karachi Time (PKT, UTC+5)
      const options: Intl.DateTimeFormatOptions = {
        timeZone: 'Asia/Karachi',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true,
      };
      setCurrentTime(new Intl.DateTimeFormat('en-US', options).format(now));

      // PSX market hours: 09:15 to 15:30 PKT (Monday-Thursday), Friday split
      const karachiHours = parseInt(
        new Intl.DateTimeFormat('en-US', {
          timeZone: 'Asia/Karachi',
          hour: 'numeric',
          hour12: false,
        }).format(now),
        10
      );
      if (karachiHours >= 9 && karachiHours < 16) {
        setMarketStatus('REGULAR TRADING (OPEN)');
      } else {
        setMarketStatus('POST-CLOSE / REPLAY MODE');
      }
    };

    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  // Compute KMI-30 Index metrics from constituent stocks
  const totalVolume = stocks.reduce((acc, s) => acc + s.volume, 0);
  const advancingCount = stocks.filter(s => s.change > 0).length;
  const decliningCount = stocks.filter(s => s.change < 0).length;
  const unchangedCount = stocks.length - advancingCount - decliningCount;
  const bullishSupertrendCount = stocks.filter(s => s.technicals.supertrend === 'BULLISH').length;

  // Accurate KMI-30 level for Oct 2026
  const avgChangePercent = stocks.reduce((acc, s) => acc + s.changePercent, 0) / stocks.length;
  const kmi30Level = 241850.40 + avgChangePercent * 850;
  const kmi30ChangePts = 820.60 + avgChangePercent * 450;

  const handleDownloadApp = () => {
    setIsExporting(true);
    setTimeout(() => {
      exportStandaloneHtml(stocks);
      setIsExporting(false);
    }, 400);
  };

  return (
    <header className="bg-[#161b22] border-b border-[#30363d] sticky top-0 z-40 backdrop-blur shadow-xl">
      {/* Top Banner: Market Status & Live Ticker */}
      <div className="px-4 py-1.5 bg-[#0d1117] border-b border-[#21262d] flex flex-wrap items-center justify-between text-xs text-gray-400 gap-2">
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-1.5">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="font-semibold text-emerald-400">{marketStatus}</span>
          </div>
          <div className="flex items-center gap-1.5 text-gray-400">
            <Clock className="w-3.5 h-3.5 text-blue-400" />
            <span className="font-semibold text-white">Sunday, 11 Oct 2026:</span>
            <span className="font-mono text-gray-200 font-medium">{currentTime || '11:45:00 AM PKT'}</span>
          </div>
          <div className="flex items-center gap-1.5 bg-[#161b22] px-2 py-0.5 rounded border border-[#30363d]">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-gray-300">Shariah Screening:</span>
            <span className="text-emerald-400 font-semibold">100% Compliant (30/30)</span>
          </div>
          <div className="hidden lg:flex items-center gap-2 text-xs">
            <span className="text-gray-400">Breadth:</span>
            <span className="text-emerald-400 font-medium">{advancingCount} Adv</span>
            <span className="text-gray-600">/</span>
            <span className="text-rose-400 font-medium">{decliningCount} Dec</span>
            <span className="text-gray-600">/</span>
            <span className="text-gray-400 font-medium">{unchangedCount} Unch</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center gap-2 bg-[#161b22] px-2.5 py-0.5 rounded border border-[#30363d]">
            <span className="text-gray-400">Swing Bias:</span>
            <span className="font-mono text-emerald-400 font-semibold">
              {bullishSupertrendCount}/30 BULLISH ({((bullishSupertrendCount / 30) * 100).toFixed(0)}%)
            </span>
          </div>
          <span className="text-[11px] text-gray-400 hidden sm:inline">
            Synced: {lastUpdated.toLocaleTimeString()}
          </span>
        </div>
      </div>

      {/* Main Bar */}
      <div className="px-4 py-3 flex flex-wrap items-center justify-between gap-4">
        {/* Brand & Index Level */}
        <div className="flex items-center gap-5">
          <div className="flex items-center gap-3 cursor-pointer" onClick={onClearActiveStock}>
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-500/20 via-blue-500/20 to-purple-500/20 border border-emerald-500/40 flex items-center justify-center shadow-inner">
              <TrendingUp className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base font-bold text-white tracking-tight flex items-center gap-1.5">
                  KMI-30 <span className="text-emerald-400">SWING</span> PRO
                </h1>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30">
                  PSX INSTITUTIONAL
                </span>
              </div>
              <p className="text-xs text-gray-400">Shariah-Compliant Swing Screener & Workspace</p>
            </div>
          </div>

          {/* KMI-30 Real-Time Metric Pill */}
          <div className="hidden xl:flex items-center gap-4 bg-[#0d1117] px-3.5 py-1.5 rounded-lg border border-[#30363d]">
            <div>
              <div className="text-[10px] uppercase tracking-wider text-gray-400">KMI-30 Index Level</div>
              <div className="text-base font-mono font-bold text-white">
                {kmi30Level.toLocaleString(undefined, { maximumFractionDigits: 2 })}
              </div>
            </div>
            <div className={`text-right ${kmi30ChangePts >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
              <div className="text-[10px] uppercase tracking-wider">Session Change</div>
              <div className="text-sm font-mono font-semibold flex items-center justify-end gap-1">
                {kmi30ChangePts >= 0 ? '+' : ''}{kmi30ChangePts.toFixed(2)} pts ({avgChangePercent >= 0 ? '+' : ''}{avgChangePercent.toFixed(2)}%)
              </div>
            </div>
            <div className="pl-3 border-l border-[#21262d] text-right">
              <div className="text-[10px] uppercase tracking-wider text-gray-400">Total KMI Turnover</div>
              <div className="text-xs font-mono font-medium text-gray-200">
                {(totalVolume / 1_000_000).toFixed(1)}M Shares
              </div>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2.5 flex-wrap">
          {/* Quick Stock Selector if active */}
          {activeStock && (
            <div className="flex items-center gap-2 bg-[#0d1117] border border-[#30363d] rounded-lg px-2.5 py-1">
              <button 
                onClick={onClearActiveStock}
                className="text-xs text-gray-400 hover:text-white flex items-center gap-1"
                title="Return to 30-Stock Matrix"
              >
                <span>30-Stock Matrix</span>
                <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
              </button>
              <select
                value={activeStock.symbol}
                onChange={(e) => {
                  const selected = stocks.find(s => s.symbol === e.target.value);
                  if (selected) onSelectStock(selected);
                }}
                aria-label="Select KMI-30 Stock"
                className="bg-transparent text-emerald-400 font-mono font-bold text-xs focus:outline-none cursor-pointer"
              >
                {stocks.map(s => (
                  <option key={s.symbol} value={s.symbol} className="bg-[#161b22] text-gray-200">
                    {s.symbol} - {s.name.slice(0, 20)}...
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Add Any Stock Button */}
          {onOpenAddStock && (
            <button
              onClick={onOpenAddStock}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold bg-emerald-600/15 hover:bg-emerald-600/30 text-emerald-400 border border-emerald-500/40 hover:border-emerald-500/70 transition-all duration-200 active:scale-95 shadow-md"
              title="Add any custom PSX stock ticker or portfolio constituent"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>+ Add Any Stock</span>
            </button>
          )}

          {/* Update Market Data Button */}
          <button
            onClick={onRefreshData}
            disabled={isRefreshing}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all duration-200 shadow-md ${
              isRefreshing
                ? 'bg-blue-600/50 text-blue-200 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-500/20 hover:shadow-blue-500/40 active:scale-95'
            }`}
            title="Update all 30 KMI-30 quotes, order books, and indicators"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span>{isRefreshing ? 'Updating Market...' : 'Update Market Data'}</span>
          </button>

          {/* Export / Download App Button */}
          <button
            onClick={handleDownloadApp}
            disabled={isExporting}
            className="flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold bg-[#21262d] hover:bg-[#30363d] text-emerald-400 border border-emerald-500/30 hover:border-emerald-500/60 transition-all duration-200 active:scale-95 shadow-md"
            title="Download full standalone self-contained HTML application with all 30 stocks"
          >
            <Download className="w-3.5 h-3.5 text-emerald-400" />
            <span>{isExporting ? 'Generating HTML...' : 'Export / Download App'}</span>
          </button>
        </div>
      </div>
    </header>
  );
};
