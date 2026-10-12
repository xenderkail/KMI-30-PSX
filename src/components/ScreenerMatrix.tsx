import React, { useState, useMemo } from 'react';
import { StockData } from '../types/stock';
import { 
  Search, 
  LayoutGrid, 
  Table as TableIcon, 
  ArrowUpDown, 
  TrendingUp, 
  TrendingDown, 
  ExternalLink, 
  ShieldCheck, 
  Zap, 
  Activity,
  Layers,
  Flame,
  CheckCircle2,
  SlidersHorizontal,
  ChevronRight,
  Plus,
  Edit3,
  Trash2,
  Building2
} from 'lucide-react';

interface ScreenerMatrixProps {
  stocks: StockData[];
  onSelectStock: (stock: StockData) => void;
  onOpenAddStock?: () => void;
  onOpenPriceModal?: (stock: StockData) => void;
  onDeleteStock?: (symbol: string) => void;
}

type SortField = 'swingScore' | 'changePercent' | 'price' | 'volume' | 'rsi14' | 'symbol';
type SortOrder = 'asc' | 'desc';

export const ScreenerMatrix: React.FC<ScreenerMatrixProps> = ({
  stocks,
  onSelectStock,
  onOpenAddStock,
  onOpenPriceModal,
  onDeleteStock,
}) => {
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedSector, setSelectedSector] = useState<string>('All');
  const [strategyPreset, setStrategyPreset] = useState<string>('ALL');
  const [sortField, setSortField] = useState<SortField>('swingScore');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');

  // Comprehensive PSX Sectors list for dropdown filter
  const allPsxSectors = useMemo(() => {
    const canonical = [
      'All',
      'Automobile Assembler',
      'Automobile Parts & Accessories',
      'Cable & Electrical Goods',
      'Cement',
      'Chemicals',
      'Commercial Banks',
      'Engineering',
      'Fertilizer',
      'Food & Personal Care',
      'Glass & Ceramics',
      'Insurance',
      'Investment Banks / Cos',
      'Leather & Tanneries',
      'Miscellaneous',
      'Oil & Gas',
      'Paper & Board',
      'Pharmaceuticals',
      'Power',
      'Refinery',
      'Sugar & Allied Industries',
      'Synthetic & Rayon',
      'Technology',
      'Textile',
      'Tobacco',
      'Transport'
    ];
    const fromStocks = Array.from(new Set(stocks.map(s => s.sector)));
    const merged = ['All', ...Array.from(new Set([...canonical.filter(c => c !== 'All'), ...fromStocks]))];
    return merged;
  }, [stocks]);

  // Quick sector filter chips
  const sectors = useMemo(() => {
    const list = ['All', 'Oil & Gas', 'Cement', 'Fertilizer', 'Technology', 'Power', 'Commercial Banks', 'Automobile', 'Pharmaceuticals', 'Chemicals', 'Textile', 'Engineering', 'Food & Personal Care'];
    return list;
  }, []);

  // Filtered and sorted stocks
  const filteredStocks = useMemo(() => {
    return stocks
      .filter((s) => {
        // Search query
        if (searchQuery) {
          const q = searchQuery.toLowerCase();
          const matchSym = s.symbol.toLowerCase().includes(q);
          const matchName = s.name.toLowerCase().includes(q);
          const matchTv = s.tradingViewSymbol.toLowerCase().includes(q);
          if (!matchSym && !matchName && !matchTv) return false;
        }

        // Sector filter
        if (selectedSector !== 'All') {
          if (s.sector !== selectedSector) return false;
        }

        // Strategy Presets
        if (strategyPreset === 'SUPERTREND_BULLISH') {
          if (s.technicals.supertrend !== 'BULLISH') return false;
        } else if (strategyPreset === 'RSI_SWEETSPOT') {
          if (s.technicals.rsi14 < 45 || s.technicals.rsi14 > 65) return false;
        } else if (strategyPreset === 'GOLDEN_CROSS') {
          if (s.technicals.emaCross !== 'GOLDEN_CROSS' && s.technicals.emaCross !== 'BULLISH_ALIGN') return false;
        } else if (strategyPreset === 'HIGH_SWING_SCORE') {
          if (s.swingScore < 75) return false;
        } else if (strategyPreset === 'MACD_MOMENTUM') {
          if (s.technicals.macdHist <= 0) return false;
        }

        return true;
      })
      .sort((a, b) => {
        let valA: number | string = 0;
        let valB: number | string = 0;

        if (sortField === 'swingScore') {
          valA = a.swingScore;
          valB = b.swingScore;
        } else if (sortField === 'changePercent') {
          valA = a.changePercent;
          valB = b.changePercent;
        } else if (sortField === 'price') {
          valA = a.price;
          valB = b.price;
        } else if (sortField === 'volume') {
          valA = a.volume;
          valB = b.volume;
        } else if (sortField === 'rsi14') {
          valA = a.technicals.rsi14;
          valB = b.technicals.rsi14;
        } else if (sortField === 'symbol') {
          valA = a.symbol;
          valB = b.symbol;
        }

        if (typeof valA === 'string' && typeof valB === 'string') {
          return sortOrder === 'asc' ? valA.localeCompare(valB) : valB.localeCompare(valA);
        }
        return sortOrder === 'asc' ? (valA as number) - (valB as number) : (valB as number) - (valA as number);
      });
  }, [stocks, searchQuery, selectedSector, strategyPreset, sortField, sortOrder]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
  };

  const getSignalBadge = (signal: StockData['swingSignal']) => {
    switch (signal) {
      case 'STRONG_BUY':
        return <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-bold px-2 py-0.5 rounded uppercase">Strong Buy</span>;
      case 'BUY':
        return <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-semibold px-2 py-0.5 rounded uppercase">Buy</span>;
      case 'ACCUMULATE':
        return <span className="bg-blue-500/15 text-blue-300 border border-blue-500/30 text-[10px] font-medium px-2 py-0.5 rounded uppercase">Accumulate</span>;
      case 'NEUTRAL':
        return <span className="bg-gray-500/15 text-gray-400 border border-gray-500/30 text-[10px] font-medium px-2 py-0.5 rounded uppercase">Neutral</span>;
      case 'REDUCE':
        return <span className="bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[10px] font-medium px-2 py-0.5 rounded uppercase">Reduce</span>;
      case 'EXIT':
        return <span className="bg-rose-500/20 text-rose-300 border border-rose-500/40 text-[10px] font-bold px-2 py-0.5 rounded uppercase">Exit</span>;
    }
  };

  const getRsiColor = (rsi: number) => {
    if (rsi >= 70) return 'text-amber-400 bg-amber-500/10 border-amber-500/30';
    if (rsi <= 35) return 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30';
    if (rsi > 50) return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
    return 'text-gray-300 bg-gray-500/10 border-gray-500/20';
  };

  return (
    <div className="space-y-4">
      {/* Tier 1 Header & Quick Sector Filters */}
      <div className="bg-[#161b22] border border-[#30363d] rounded-xl p-4 shadow-lg space-y-3.5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
                <Layers className="w-4 h-4 text-emerald-400" />
                <span>Executive 30-Stock Matrix</span>
              </h2>
              <span className="text-xs font-mono bg-[#0d1117] px-2 py-0.5 rounded text-gray-300 border border-[#30363d]">
                Showing {filteredStocks.length} / 30 KMI-30 Constituents
              </span>
            </div>
            <p className="text-xs text-gray-400 mt-0.5">
              Select any constituent to open the Tier-2 deep TradingView workspace, Level-2 DOM, and risk engine.
            </p>
          </div>

          {/* Search and Layout Toggle */}
          <div className="flex items-center gap-2.5 flex-wrap">
            {/* Search input */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search symbol, company, PSX ticker..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-[#0d1117] border border-[#30363d] rounded-lg pl-8 pr-3 py-1.5 text-xs text-gray-200 placeholder-gray-500 focus:outline-none focus:border-emerald-500/60 w-56 transition-colors"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 text-xs"
                >
                  ×
                </button>
              )}
            </div>

            {/* View Mode Toggle */}
            <div className="bg-[#0d1117] p-0.5 rounded-lg border border-[#30363d] flex items-center">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded text-xs flex items-center gap-1.5 transition-all ${
                  viewMode === 'grid'
                    ? 'bg-[#21262d] text-emerald-400 shadow'
                    : 'text-gray-400 hover:text-gray-200'
                }`}
                title="Grid Cards View"
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                <span className="hidden sm:inline text-[11px] font-medium">Grid</span>
              </button>
              <button
                onClick={() => setViewMode('table')}
                className={`p-1.5 rounded text-xs flex items-center gap-1.5 transition-all ${
                  viewMode === 'table'
                    ? 'bg-[#21262d] text-emerald-400 shadow'
                    : 'text-gray-400 hover:text-gray-200'
                }`}
                title="Institutional Table View"
              >
                <TableIcon className="w-3.5 h-3.5" />
                <span className="hidden sm:inline text-[11px] font-medium">Table</span>
              </button>
            </div>

            {/* Quick Add Stock Action */}
            {onOpenAddStock && (
              <button
                onClick={onOpenAddStock}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600/15 hover:bg-emerald-600/30 text-emerald-400 border border-emerald-500/40 text-xs font-semibold transition-all active:scale-95 shadow-sm"
                title="Add any custom PSX stock ticker to this screener"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>+ Add Stock</span>
              </button>
            )}
          </div>
        </div>

        {/* Sector Filters: Full Dropdown & Quick Chips */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-2.5 pb-2 border-b border-[#21262d]">
          {/* Full Sector Dropdown */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 bg-[#0d1117] border border-[#30363d] rounded-lg px-2.5 py-1 text-xs">
              <Building2 className="w-3.5 h-3.5 text-blue-400 shrink-0" />
              <label htmlFor="sector-filter-dropdown" className="text-gray-400 font-semibold shrink-0">
                Sector:
              </label>
              <select
                id="sector-filter-dropdown"
                value={selectedSector}
                onChange={(e) => setSelectedSector(e.target.value)}
                className="bg-transparent text-emerald-400 font-bold focus:outline-none cursor-pointer text-xs max-w-[210px]"
                aria-label="Filter stocks by sector dropdown"
              >
                {allPsxSectors.map((sec) => {
                  const count = sec === 'All' ? stocks.length : stocks.filter(s => s.sector === sec).length;
                  return (
                    <option key={sec} value={sec} className="bg-[#161b22] text-gray-200">
                      {sec} {count > 0 ? `(${count})` : ''}
                    </option>
                  );
                })}
              </select>
            </div>
            {selectedSector !== 'All' && (
              <button
                onClick={() => setSelectedSector('All')}
                className="text-[11px] text-gray-400 hover:text-white underline cursor-pointer"
              >
                Clear
              </button>
            )}
          </div>

          {/* Quick Sector Filter Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto text-xs no-scrollbar">
            <span className="text-[11px] text-gray-400 font-medium mr-1 uppercase tracking-wider shrink-0 hidden sm:inline">
              Quick:
            </span>
            {sectors.map((sec) => {
              const count = sec === 'All' ? stocks.length : stocks.filter(s => s.sector === sec).length;
              if (count === 0 && sec !== 'All') return null;
              const isSelected = selectedSector === sec;
              return (
                <button
                  key={sec}
                  onClick={() => setSelectedSector(sec)}
                  className={`px-2 py-1 rounded text-[11px] whitespace-nowrap transition-all font-medium flex items-center gap-1 cursor-pointer ${
                    isSelected
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm'
                      : 'bg-[#0d1117] text-gray-400 hover:text-gray-200 hover:bg-[#21262d] border border-[#30363d]'
                  }`}
                >
                  <span>{sec}</span>
                  <span className={`text-[9px] px-1 rounded ${isSelected ? 'bg-emerald-500/30 text-emerald-200' : 'bg-[#21262d] text-gray-500'}`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Quantitative Swing Strategy Presets */}
        <div className="flex items-center gap-1.5 overflow-x-auto pt-1 border-t border-[#21262d] text-xs">
          <span className="text-[11px] text-gray-400 font-medium mr-1 uppercase tracking-wider shrink-0 flex items-center gap-1">
            <Zap className="w-3 h-3 text-amber-400" />
            <span>Preset:</span>
          </span>
          {[
            { id: 'ALL', label: 'All Constituents' },
            { id: 'SUPERTREND_BULLISH', label: 'Supertrend Bullish (10,3)' },
            { id: 'GOLDEN_CROSS', label: 'Golden Cross (EMA 20 > 50)' },
            { id: 'RSI_SWEETSPOT', label: 'RSI Momentum (45-65)' },
            { id: 'MACD_MOMENTUM', label: 'MACD Expanding Up' },
            { id: 'HIGH_SWING_SCORE', label: 'Top Swing Score (≥75)' },
          ].map((preset) => {
            const isSelected = strategyPreset === preset.id;
            return (
              <button
                key={preset.id}
                onClick={() => setStrategyPreset(preset.id)}
                className={`px-2.5 py-1 rounded-md text-[11px] whitespace-nowrap transition-all font-medium ${
                  isSelected
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-[#0d1117] text-gray-400 hover:text-gray-200 border border-[#21262d]'
                }`}
              >
                {preset.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Grid View */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-3.5">
          {filteredStocks.map((stock) => {
            const isPositive = stock.change >= 0;
            const isSupertrendBull = stock.technicals.supertrend === 'BULLISH';
            const isEmaGolden = stock.technicals.emaCross === 'GOLDEN_CROSS' || stock.technicals.emaCross === 'BULLISH_ALIGN';

            return (
              <div
                key={stock.symbol}
                onClick={() => onSelectStock(stock)}
                className="group bg-[#161b22] hover:bg-[#1c2128] border border-[#30363d] hover:border-emerald-500/50 rounded-xl p-3.5 transition-all duration-200 cursor-pointer shadow-md hover:shadow-xl relative overflow-hidden flex flex-col justify-between"
              >
                {/* Accent top stripe based on swing score */}
                <div 
                  className={`absolute top-0 left-0 right-0 h-1 ${
                    stock.swingScore >= 80 ? 'bg-emerald-400' :
                    stock.swingScore >= 65 ? 'bg-blue-400' :
                    stock.swingScore >= 50 ? 'bg-amber-400' : 'bg-rose-400'
                  }`} 
                />

                <div>
                  {/* Top line: Symbol, TradingView code, and Shariah Badge */}
                  <div className="flex items-start justify-between gap-1 mb-1.5">
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono font-bold text-white text-base tracking-tight group-hover:text-emerald-300 transition-colors">
                          {stock.symbol}
                        </span>
                        <span className="text-[10px] font-mono text-gray-400 bg-[#0d1117] px-1.5 py-0.2 rounded border border-[#30363d]">
                          {stock.tradingViewSymbol}
                        </span>
                      </div>
                      <div className="text-[11px] text-gray-400 truncate max-w-[170px]" title={stock.name}>
                        {stock.name}
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-1">
                      {getSignalBadge(stock.swingSignal)}
                      <div className="flex items-center gap-1 text-[10px] text-emerald-400" title="KMI-30 Shariah Compliant">
                        <ShieldCheck className="w-3 h-3" />
                        <span>KMI-30</span>
                      </div>
                    </div>
                  </div>

                  {/* Price and Change */}
                  <div className="my-2.5 flex items-baseline justify-between border-y border-[#21262d] py-2">
                    <div>
                      <div className="text-[10px] uppercase text-gray-400 font-mono">Last Price</div>
                      <div className="text-lg font-mono font-bold text-white">
                        PKR {stock.price.toFixed(2)}
                      </div>
                    </div>
                    <div className={`text-right ${isPositive ? 'text-emerald-400' : 'text-rose-400'}`}>
                      <div className="flex items-center justify-end gap-0.5 text-xs font-mono font-semibold">
                        {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                        <span>{isPositive ? '+' : ''}{stock.change.toFixed(2)}</span>
                      </div>
                      <div className="text-[11px] font-mono font-medium">
                        {isPositive ? '+' : ''}{stock.changePercent.toFixed(2)}%
                      </div>
                    </div>
                  </div>

                  {/* Technical Indicators Matrix Pill */}
                  <div className="grid grid-cols-3 gap-1.5 text-center text-[10px] mb-2.5">
                    {/* Supertrend */}
                    <div className="bg-[#0d1117] p-1.5 rounded border border-[#21262d]">
                      <div className="text-gray-400 text-[9px] uppercase">Supertrend</div>
                      <div className={`font-mono font-bold text-[10px] mt-0.5 ${isSupertrendBull ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {isSupertrendBull ? 'BULL (10,3)' : 'BEAR (10,3)'}
                      </div>
                    </div>

                    {/* RSI */}
                    <div className={`p-1.5 rounded border ${getRsiColor(stock.technicals.rsi14)}`}>
                      <div className="text-[9px] uppercase opacity-80">RSI (14)</div>
                      <div className="font-mono font-bold text-[10px] mt-0.5">
                        {stock.technicals.rsi14.toFixed(1)}
                      </div>
                    </div>

                    {/* EMA Cross */}
                    <div className="bg-[#0d1117] p-1.5 rounded border border-[#21262d]">
                      <div className="text-gray-400 text-[9px] uppercase">EMA 20/50</div>
                      <div className={`font-mono font-bold text-[10px] mt-0.5 ${isEmaGolden ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {isEmaGolden ? 'GOLDEN' : 'BEARISH'}
                      </div>
                    </div>
                  </div>

                  {/* Quantitative Swing Score Bar */}
                  <div className="space-y-1 mb-2">
                    <div className="flex items-center justify-between text-[10px] text-gray-400">
                      <span>Swing Momentum Score</span>
                      <span className="font-mono font-semibold text-white">{stock.swingScore}/100</span>
                    </div>
                    <div className="w-full bg-[#0d1117] h-1.5 rounded-full overflow-hidden border border-[#21262d]">
                      <div
                        className={`h-full rounded-full ${
                          stock.swingScore >= 80 ? 'bg-emerald-400' :
                          stock.swingScore >= 65 ? 'bg-blue-400' :
                          stock.swingScore >= 50 ? 'bg-amber-400' : 'bg-rose-400'
                        }`}
                        style={{ width: `${Math.max(5, stock.swingScore)}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Under Stock Action Tabs: Update Price, Investify, PSX DPS, Delete */}
                <div className="my-2 pt-2 border-t border-[#21262d] flex items-center justify-between gap-1.5 text-[10px] font-mono">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (onOpenPriceModal) onOpenPriceModal(stock);
                    }}
                    className="flex-1 px-2 py-1 bg-[#0d1117] hover:bg-emerald-600/20 text-emerald-400 hover:text-emerald-300 border border-emerald-500/30 rounded flex items-center justify-center gap-1 transition-colors font-semibold shadow-sm cursor-pointer"
                    title={`Click to update current market price for ${stock.symbol}`}
                  >
                    <Edit3 className="w-2.5 h-2.5" />
                    <span>Update</span>
                  </button>

                  <a
                    href={`https://dps.psx.com.pk/company/${stock.symbol}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="px-2 py-1 bg-[#0d1117] hover:bg-amber-600/20 text-amber-400 hover:text-amber-300 border border-amber-500/30 rounded flex items-center gap-1 transition-colors"
                    title={`Open ${stock.symbol} live quote on official PSX Data Portal`}
                  >
                    <span>DPS</span>
                    <ExternalLink className="w-2.5 h-2.5" />
                  </a>

                  <a
                    href={`https://investify.pk/stocks/${stock.symbol}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="px-2 py-1 bg-[#0d1117] hover:bg-blue-600/20 text-blue-400 hover:text-blue-300 border border-blue-500/30 rounded flex items-center gap-1 transition-colors"
                    title={`Open ${stock.symbol} profile on Investify.pk`}
                  >
                    <span>INV</span>
                    <ExternalLink className="w-2.5 h-2.5" />
                  </a>

                  {onDeleteStock && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (window.confirm(`Delete ${stock.symbol} (${stock.name}) from workspace?`)) {
                          onDeleteStock(stock.symbol);
                        }
                      }}
                      className="px-1.5 py-1 bg-[#0d1117] hover:bg-rose-900/30 text-gray-500 hover:text-rose-400 border border-[#30363d] hover:border-rose-500/40 rounded transition-colors cursor-pointer"
                      title={`Remove ${stock.symbol} from workspace`}
                    >
                      <Trash2 className="w-2.5 h-2.5" />
                    </button>
                  )}
                </div>

                {/* Card Footer: Volume and Click Indicator */}
                <div className="pt-1.5 border-t border-[#21262d] flex items-center justify-between text-[11px] text-gray-400">
                  <div className="truncate">
                    <span className="text-gray-400">Vol: </span>
                    <span className="font-mono text-gray-300">{(stock.volume / 1_000_000).toFixed(2)}M</span>
                  </div>
                  <div className="flex items-center gap-1 text-emerald-400 group-hover:translate-x-0.5 transition-transform font-medium text-[11px]">
                    <span>Workspace</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Table View */
        <div className="bg-[#161b22] border border-[#30363d] rounded-xl overflow-hidden shadow-lg">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#0d1117] border-b border-[#30363d] text-gray-400 uppercase text-[10px] font-mono tracking-wider">
                <tr>
                  <th className="py-3 px-3 cursor-pointer hover:text-white" onClick={() => handleSort('symbol')}>
                    <div className="flex items-center gap-1">
                      <span>Ticker / Company</span>
                      <ArrowUpDown className="w-3 h-3" />
                    </div>
                  </th>
                  <th className="py-3 px-3">Sector</th>
                  <th className="py-3 px-3 cursor-pointer hover:text-white text-right" onClick={() => handleSort('price')}>
                    <div className="flex items-center justify-end gap-1">
                      <span>Price (PKR)</span>
                      <ArrowUpDown className="w-3 h-3" />
                    </div>
                  </th>
                  <th className="py-3 px-3 cursor-pointer hover:text-white text-right" onClick={() => handleSort('changePercent')}>
                    <div className="flex items-center justify-end gap-1">
                      <span>24h Change</span>
                      <ArrowUpDown className="w-3 h-3" />
                    </div>
                  </th>
                  <th className="py-3 px-3 text-center">Supertrend (10,3)</th>
                  <th className="py-3 px-3 cursor-pointer hover:text-white text-center" onClick={() => handleSort('rsi14')}>
                    <div className="flex items-center justify-center gap-1">
                      <span>RSI (14)</span>
                      <ArrowUpDown className="w-3 h-3" />
                    </div>
                  </th>
                  <th className="py-3 px-3 text-center">EMA 20/50</th>
                  <th className="py-3 px-3 text-right">Pivot (PP / S1 / R1)</th>
                  <th className="py-3 px-3 cursor-pointer hover:text-white text-right" onClick={() => handleSort('volume')}>
                    <div className="flex items-center justify-end gap-1">
                      <span>Volume</span>
                      <ArrowUpDown className="w-3 h-3" />
                    </div>
                  </th>
                  <th className="py-3 px-3 cursor-pointer hover:text-white text-center" onClick={() => handleSort('swingScore')}>
                    <div className="flex items-center justify-center gap-1">
                      <span>Swing Score</span>
                      <ArrowUpDown className="w-3 h-3" />
                    </div>
                  </th>
                  <th className="py-3 px-3 text-center">Shariah</th>
                  <th className="py-3 px-3 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#21262d]">
                {filteredStocks.map((stock) => {
                  const isPositive = stock.change >= 0;
                  const isSupertrendBull = stock.technicals.supertrend === 'BULLISH';
                  const isEmaGolden = stock.technicals.emaCross === 'GOLDEN_CROSS' || stock.technicals.emaCross === 'BULLISH_ALIGN';

                  return (
                    <tr
                      key={stock.symbol}
                      onClick={() => onSelectStock(stock)}
                      className="hover:bg-[#1f242c] cursor-pointer transition-colors group"
                    >
                      {/* Symbol & Name */}
                      <td className="py-2.5 px-3">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-white group-hover:text-emerald-400">
                            {stock.symbol}
                          </span>
                          <span className="text-[10px] font-mono text-gray-400 bg-[#0d1117] px-1 py-0.5 rounded border border-[#30363d]">
                            {stock.tradingViewSymbol}
                          </span>
                        </div>
                        <div className="text-[11px] text-gray-400 truncate max-w-[160px]">
                          {stock.name}
                        </div>
                      </td>

                      {/* Sector */}
                      <td className="py-2.5 px-3">
                        <span className="px-2 py-0.5 bg-[#0d1117] border border-[#30363d] rounded text-[11px] text-gray-300">
                          {stock.sector}
                        </span>
                      </td>

                      {/* Price */}
                      <td className="py-2.5 px-3 text-right font-mono font-bold text-white">
                        {stock.price.toFixed(2)}
                      </td>

                      {/* Change */}
                      <td className={`py-2.5 px-3 text-right font-mono font-semibold ${isPositive ? 'text-emerald-400' : 'text-rose-400'}`}>
                        <div>{isPositive ? '+' : ''}{stock.change.toFixed(2)}</div>
                        <div className="text-[10px]">{isPositive ? '+' : ''}{stock.changePercent.toFixed(2)}%</div>
                      </td>

                      {/* Supertrend */}
                      <td className="py-2.5 px-3 text-center">
                        <span className={`inline-block font-mono text-[10px] font-bold px-2 py-0.5 rounded border ${
                          isSupertrendBull 
                            ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30' 
                            : 'bg-rose-500/15 text-rose-400 border-rose-500/30'
                        }`}>
                          {isSupertrendBull ? 'BULLISH' : 'BEARISH'}
                        </span>
                      </td>

                      {/* RSI 14 */}
                      <td className="py-2.5 px-3 text-center">
                        <span className={`inline-block font-mono text-[11px] font-semibold px-2 py-0.5 rounded border ${getRsiColor(stock.technicals.rsi14)}`}>
                          {stock.technicals.rsi14.toFixed(1)}
                        </span>
                      </td>

                      {/* EMA Cross */}
                      <td className="py-2.5 px-3 text-center">
                        <span className={`font-mono text-[10px] font-semibold ${isEmaGolden ? 'text-emerald-400' : 'text-rose-400'}`}>
                          {isEmaGolden ? 'GOLDEN (20>50)' : 'BEAR (20<50)'}
                        </span>
                      </td>

                      {/* Pivots */}
                      <td className="py-2.5 px-3 text-right font-mono text-[11px] text-gray-300">
                        <div>PP: {stock.technicals.pivots.pp.toFixed(1)}</div>
                        <div className="text-[10px] text-gray-400">
                          S1: {stock.technicals.pivots.s1.toFixed(1)} | R1: {stock.technicals.pivots.r1.toFixed(1)}
                        </div>
                      </td>

                      {/* Volume */}
                      <td className="py-2.5 px-3 text-right font-mono text-gray-300">
                        {(stock.volume / 1_000_000).toFixed(2)}M
                      </td>

                      {/* Swing Score */}
                      <td className="py-2.5 px-3 text-center">
                        <div className="flex flex-col items-center gap-1">
                          {getSignalBadge(stock.swingSignal)}
                          <span className="font-mono text-[10px] font-semibold text-gray-300">
                            {stock.swingScore}/100
                          </span>
                        </div>
                      </td>

                      {/* Shariah */}
                      <td className="py-2.5 px-3 text-center">
                        <div className="flex items-center justify-center gap-1 text-emerald-400 text-[11px]">
                          <ShieldCheck className="w-3.5 h-3.5" />
                          <span>PASS</span>
                        </div>
                        <div className="text-[9px] text-gray-400">
                          Debt {stock.shariah.debtToAssets}% &lt; 37%
                        </div>
                      </td>

                      {/* Action & Direct Portals */}
                      <td className="py-2.5 px-3 text-center" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-center gap-1 font-mono text-[11px]">
                          <button
                            onClick={() => onOpenPriceModal && onOpenPriceModal(stock)}
                            className="px-2 py-1 rounded bg-[#0d1117] hover:bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1 transition-colors font-semibold cursor-pointer"
                            title={`Update price for ${stock.symbol}`}
                          >
                            <Edit3 className="w-2.5 h-2.5" />
                            <span>Update</span>
                          </button>
                          <a
                            href={`https://dps.psx.com.pk/company/${stock.symbol}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-2 py-1 rounded bg-[#0d1117] hover:bg-amber-600/20 text-amber-400 border border-amber-500/30 flex items-center gap-1 transition-colors text-[10px]"
                            title="Official PSX Data Portal"
                          >
                            <span>DPS</span>
                            <ExternalLink className="w-2.5 h-2.5" />
                          </a>
                          <a
                            href={`https://investify.pk/stocks/${stock.symbol}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-2 py-1 rounded bg-[#0d1117] hover:bg-blue-600/20 text-blue-400 border border-blue-500/30 flex items-center gap-1 transition-colors text-[10px]"
                            title="Investify.pk stock profile"
                          >
                            <span>INV</span>
                            <ExternalLink className="w-2.5 h-2.5" />
                          </a>
                          <button
                            onClick={() => onSelectStock(stock)}
                            className="px-2 py-1 rounded bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 border border-blue-500/30 text-[10px] font-semibold transition-colors cursor-pointer"
                            title="Open Deep Workspace"
                          >
                            Chart
                          </button>
                          {onDeleteStock && (
                            <button
                              onClick={() => {
                                if (window.confirm(`Delete ${stock.symbol} (${stock.name}) from workspace?`)) {
                                  onDeleteStock(stock.symbol);
                                }
                              }}
                              className="p-1 rounded bg-[#0d1117] hover:bg-rose-900/30 text-gray-500 hover:text-rose-400 border border-[#30363d] hover:border-rose-500/40 transition-colors cursor-pointer"
                              title={`Delete ${stock.symbol} from workspace`}
                            >
                              <Trash2 className="w-2.5 h-2.5" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
