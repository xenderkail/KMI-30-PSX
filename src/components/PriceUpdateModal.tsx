import React, { useState, useEffect } from 'react';
import { StockData } from '../types/stock';
import { 
  DollarSign, 
  ExternalLink, 
  Check, 
  X, 
  Info, 
  TrendingUp, 
  TrendingDown, 
  Building2, 
  ShieldCheck,
  RefreshCw,
  Edit3
} from 'lucide-react';

interface PriceUpdateModalProps {
  stock: StockData | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdatePrice: (symbol: string, newPrice: number, changePercent?: number) => void;
}

export const PriceUpdateModal: React.FC<PriceUpdateModalProps> = ({
  stock,
  isOpen,
  onClose,
  onUpdatePrice,
}) => {
  const [priceInput, setPriceInput] = useState<string>('');
  const [changePercentInput, setChangePercentInput] = useState<string>('');
  const [syncOption, setSyncOption] = useState<'keep_percent' | 'custom_percent' | 'zero_change'>('custom_percent');

  useEffect(() => {
    if (stock) {
      setPriceInput(stock.price.toString());
      setChangePercentInput(stock.changePercent.toString());
    }
  }, [stock]);

  if (!isOpen || !stock) return null;

  const currentEnteredPrice = parseFloat(priceInput) || stock.price;
  const currentEnteredPct = parseFloat(changePercentInput) || 0;
  const calculatedPrevClose = Number((currentEnteredPrice / (1 + currentEnteredPct / 100)).toFixed(2));
  const calculatedDelta = Number((currentEnteredPrice - calculatedPrevClose).toFixed(2));

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(priceInput);
    if (isNaN(val) || val <= 0) return;

    let targetPct: number | undefined;
    if (syncOption === 'zero_change') {
      targetPct = 0;
    } else if (syncOption === 'custom_percent') {
      const p = parseFloat(changePercentInput);
      targetPct = isNaN(p) ? stock.changePercent : p;
    } else {
      // keep_percent
      targetPct = stock.changePercent;
    }

    onUpdatePrice(stock.symbol, val, targetPct);
    onClose();
  };

  const psxDpsLink = `https://dps.psx.com.pk/company/${stock.symbol}`;
  const investifyLink = `https://investify.pk/stocks/${stock.symbol}`;
  const sarmaayaLink = `https://sarmaaya.pk/stocks/${stock.symbol}`;

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-[#161b22] border border-[#30363d] rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-5 py-4 bg-[#0d1117] border-b border-[#30363d] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center font-mono font-bold text-emerald-400">
              {stock.symbol}
            </div>
            <div>
              <h3 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
                <span>Update Price: {stock.symbol}</span>
                <span className="text-[10px] font-mono bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded border border-blue-500/30">
                  {stock.sector}
                </span>
              </h3>
              <p className="text-xs text-gray-400 truncate max-w-xs">{stock.name}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white p-1.5 rounded-lg hover:bg-[#21262d] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Live Portal Reference Links */}
        <div className="px-5 py-3 bg-[#090d13] border-b border-[#21262d] flex items-center justify-between flex-wrap gap-2 text-xs">
          <span className="text-gray-400 font-medium">Verify Live Quotes:</span>
          <div className="flex items-center gap-2">
            <a
              href={psxDpsLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 px-2.5 py-1 rounded bg-[#161b22] hover:bg-[#21262d] text-amber-400 border border-amber-500/30 font-mono text-[11px] transition-colors"
              title="Open Official PSX Data Portal"
            >
              <span>PSX DPS</span>
              <ExternalLink className="w-3 h-3" />
            </a>
            <a
              href={investifyLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 px-2.5 py-1 rounded bg-[#161b22] hover:bg-[#21262d] text-emerald-400 border border-emerald-500/30 font-mono text-[11px] transition-colors"
              title="Open Investify.pk stock quote"
            >
              <span>Investify</span>
              <ExternalLink className="w-3 h-3" />
            </a>
            <a
              href={sarmaayaLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 px-2.5 py-1 rounded bg-[#161b22] hover:bg-[#21262d] text-purple-400 border border-purple-500/30 font-mono text-[11px] transition-colors"
              title="Open Sarmaaya.pk profile"
            >
              <span>Sarmaaya</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSave} className="p-5 space-y-4 text-xs">
          <div className="bg-[#0d1117] p-3 rounded-xl border border-[#21262d] flex items-center justify-between font-mono">
            <div>
              <span className="text-[10px] text-gray-400 uppercase">Current Workspace Price</span>
              <div className="text-base font-bold text-white">PKR {stock.price.toFixed(2)}</div>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-gray-400 uppercase">Previous Close</span>
              <div className="text-sm font-semibold text-gray-300">PKR {stock.prevClose.toFixed(2)}</div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1">
                New Market Price (PKR) *
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-mono text-xs">PKR</span>
                <input
                  type="number"
                  step="0.01"
                  value={priceInput}
                  onChange={(e) => setPriceInput(e.target.value)}
                  className="w-full bg-[#0d1117] border border-[#30363d] rounded-lg pl-12 pr-3 py-2 text-sm text-emerald-400 font-mono font-bold focus:outline-none focus:border-emerald-500"
                  required
                  autoFocus
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1">
                Today's Change (%) *
              </label>
              <div className="relative">
                <input
                  type="number"
                  step="0.05"
                  value={changePercentInput}
                  onChange={(e) => {
                    setChangePercentInput(e.target.value);
                    setSyncOption('custom_percent');
                  }}
                  className="w-full bg-[#0d1117] border border-[#30363d] rounded-lg px-3 py-2 text-sm text-white font-mono font-bold focus:outline-none focus:border-emerald-500"
                  required
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 font-mono text-xs">%</span>
              </div>
            </div>
          </div>

          {/* Quick Change Presets */}
          <div className="flex items-center gap-2 pt-1 flex-wrap">
            <span className="text-[11px] text-gray-400 font-mono">Quick Preset:</span>
            {[
              { label: 'Unchanged (0.0%)', pct: '0.00', mode: 'zero_change' },
              { label: '+0.85%', pct: '0.85', mode: 'custom_percent' },
              { label: '+1.50%', pct: '1.50', mode: 'custom_percent' },
              { label: '-0.75%', pct: '-0.75', mode: 'custom_percent' },
            ].map((preset) => (
              <button
                key={preset.label}
                type="button"
                onClick={() => {
                  setChangePercentInput(preset.pct);
                  setSyncOption(preset.mode as any);
                }}
                className="px-2 py-1 rounded bg-[#0d1117] hover:bg-[#21262d] text-gray-300 hover:text-white border border-[#30363d] text-[11px] font-mono transition-colors"
              >
                {preset.label}
              </button>
            ))}
          </div>

          {/* Real-time Calculation Preview */}
          <div className="bg-emerald-500/10 border border-emerald-500/30 p-3 rounded-xl text-xs space-y-1">
            <div className="flex items-center justify-between font-mono">
              <span className="text-gray-300">Calculated Today's Change:</span>
              <strong className={calculatedDelta >= 0 ? 'text-emerald-400' : 'text-rose-400'}>
                {calculatedDelta >= 0 ? '+' : ''}{calculatedDelta.toFixed(2)} PKR ({currentEnteredPct >= 0 ? '+' : ''}{currentEnteredPct.toFixed(2)}%)
              </strong>
            </div>
            <div className="flex items-center justify-between font-mono text-gray-400 text-[11px]">
              <span>Synchronized Previous Close:</span>
              <span>PKR {calculatedPrevClose.toFixed(2)}</span>
            </div>
            <div className="text-[10px] text-emerald-300 pt-1 border-t border-emerald-500/20">
              * Automatically rescales chart candles and indicator pivots to eliminate artificial 30% gap spikes.
            </div>
          </div>

          {/* Actions */}
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
              className="px-5 py-2 rounded-lg text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white transition-all shadow-lg shadow-emerald-600/20 active:scale-95 flex items-center gap-1.5"
            >
              <Check className="w-4 h-4" />
              <span>Update & Synchronize</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
