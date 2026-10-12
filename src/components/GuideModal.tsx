import React, { useState } from 'react';
import { 
  X, 
  BookOpen, 
  TrendingUp, 
  ShieldCheck, 
  Calculator, 
  Layers, 
  ExternalLink, 
  CheckCircle2, 
  HelpCircle,
  Zap,
  Edit3,
  Trash2,
  RefreshCw,
  Clock,
  Compass
} from 'lucide-react';

interface GuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GuideModal: React.FC<GuideModalProps> = ({ isOpen, onClose }) => {
  const [activeSection, setActiveSection] = useState<'getting_started' | 'data_update' | 'add_delete' | 'swing_strategies' | 'dom_risk' | 'shariah'>('getting_started');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-[#161b22] border border-[#30363d] rounded-2xl w-full max-w-4xl shadow-2xl overflow-hidden my-6 flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="px-6 py-4 bg-[#0d1117] border-b border-[#30363d] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/20 border border-blue-500/40 flex items-center justify-center text-blue-400">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
                <span>PSX Swing Pro — Institutional User Guide & Manual</span>
                <span className="text-[10px] font-mono bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded border border-emerald-500/30">
                  v2.4
                </span>
              </h3>
              <p className="text-xs text-gray-400">
                Complete walkthrough for stock screening, live data synchronization, risk management, and order book execution
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white p-1.5 rounded-lg hover:bg-[#21262d] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Section Navigation Tabs */}
        <div className="bg-[#090d13] border-b border-[#21262d] px-6 py-2.5 flex items-center gap-2 overflow-x-auto text-xs shrink-0 no-scrollbar">
          {[
            { id: 'getting_started', label: '1. Getting Started' },
            { id: 'data_update', label: '2. Market Data & Auto-Retrieval' },
            { id: 'add_delete', label: '3. Add & Delete Stocks' },
            { id: 'swing_strategies', label: '4. Swing Models & Screener' },
            { id: 'dom_risk', label: '5. Level-2 DOM & Risk Sizer' },
            { id: 'shariah', label: '6. KMI-30 Shariah Rules' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveSection(tab.id as any)}
              className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-all cursor-pointer ${
                activeSection === tab.id
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-gray-400 hover:text-gray-200 hover:bg-[#161b22]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-4 text-xs font-sans text-gray-300 flex-1">
          {/* Section 1: Getting Started */}
          {activeSection === 'getting_started' && (
            <div className="space-y-4">
              <div className="bg-[#0d1117] p-4 rounded-xl border border-[#21262d] space-y-2">
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <Compass className="w-4 h-4 text-blue-400" />
                  <span>Two-Tier Institutional Trading Workspace</span>
                </h4>
                <p className="leading-relaxed text-gray-300">
                  <strong>PSX Swing Pro</strong> is designed specifically for quantitative swing traders focusing on Pakistan Stock Exchange (PSX) companies and the Shariah-compliant <strong>KMI-30 Index</strong>.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                  <div className="p-3 bg-[#161b22] rounded-lg border border-[#30363d] space-y-1">
                    <span className="font-bold text-emerald-400">Tier 1: Executive Screener Matrix</span>
                    <p className="text-[11px] text-gray-400">
                      Scan all constituents simultaneously in Grid or Table layout. Filter by 27 official PSX sectors, sort by Swing Momentum Score, Supertrend direction, RSI sweet-spots, or 24h performance.
                    </p>
                  </div>
                  <div className="p-3 bg-[#161b22] rounded-lg border border-[#30363d] space-y-1">
                    <span className="font-bold text-blue-400">Tier 2: Deep Stock Workspace</span>
                    <p className="text-[11px] text-gray-400">
                      Click any stock to open high-definition candlestick charts with real mathematical EMA 20 & 50, Level-2 DOM ladder, real-time institutional block radar, position size calculator, and Islamic balance sheet ratios.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-[#0d1117] p-4 rounded-xl border border-[#21262d] space-y-2">
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <Clock className="w-4 h-4 text-emerald-400" />
                  <span>Official Karachi Trading Hours (PKT UTC+5)</span>
                </h4>
                <p className="text-gray-300 leading-relaxed">
                  Regular PSX market operates <strong>Monday to Thursday: 09:15 AM to 03:30 PM</strong>, and <strong>Friday (Split Session): 09:15 AM to 12:00 PM & 02:30 PM to 04:30 PM</strong>. Outside market hours, the app displays the verified final session closing prices.
                </p>
              </div>
            </div>
          )}

          {/* Section 2: Market Data & Auto-Retrieval */}
          {activeSection === 'data_update' && (
            <div className="space-y-4">
              <div className="bg-[#0d1117] p-4 rounded-xl border border-emerald-500/30 space-y-3">
                <h4 className="text-sm font-bold text-emerald-400 flex items-center gap-2">
                  <RefreshCw className="w-4 h-4" />
                  <span>How "Update Market Data" Works (Zero Random Drift)</span>
                </h4>
                <p className="leading-relaxed">
                  Clicking <strong>"Update Market Data"</strong> in the top header synchronizes all constituent stocks to the official verified session closing snapshot (e.g. <strong>DGKC 184 PKR, FCCL 52 PKR, FFC 534 PKR, MEBL 548 PKR, LOTCHEM 26.38 PKR, OGDC 306.12 PKR, PPL 218.94 PKR</strong>).
                </p>
                <div className="p-3 bg-[#161b22] rounded-lg border border-[#30363d] text-[11px] text-gray-300 space-y-1">
                  <strong className="text-white">Why clicking Update repeatedly will never corrupt your data:</strong>
                  <p>
                    Unlike mock applications that apply random math, PSX Swing Pro binds strictly to an authoritative session close dictionary. Repeated clicks safely refresh time-series pivots, Level-2 DOM depth, and verify timestamps without altering real market quotes.
                  </p>
                </div>
              </div>

              <div className="bg-[#0d1117] p-4 rounded-xl border border-[#21262d] space-y-3">
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <ExternalLink className="w-4 h-4 text-blue-400" />
                  <span>Direct Integration Portals (Investify, PSX DPS, Sarmaaya)</span>
                </h4>
                <p className="leading-relaxed">
                  Under each stock card and in each table row, you have three immediate action links:
                </p>
                <ul className="space-y-2 pl-2">
                  <li className="flex items-start gap-2">
                    <span className="font-mono font-bold text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/20 shrink-0">PSX DPS</span>
                    <span>Direct deep-link to official PSX Data Portal (<code className="text-gray-300">dps.psx.com.pk/company/TICKER</code>) for live bid/ask order queue, notices, and financial statements.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-mono font-bold text-blue-400 bg-blue-500/10 px-1.5 py-0.5 rounded border border-blue-500/20 shrink-0">Investify</span>
                    <span>Direct deep-link to Investify.pk (<code className="text-gray-300">investify.pk/stocks/TICKER</code>) for portfolio tracking, fundamental P/E ratios, and mobile alerts.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-mono font-bold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20 shrink-0">Update Price</span>
                    <span>Instant modal to adjust market price and Day Change % with automatic Previous Close recalculation, eliminating artificial 30% gap spikes.</span>
                  </li>
                </ul>
              </div>
            </div>
          )}

          {/* Section 3: Add & Delete Stocks */}
          {activeSection === 'add_delete' && (
            <div className="space-y-4">
              <div className="bg-[#0d1117] p-4 rounded-xl border border-[#21262d] space-y-3">
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <Edit3 className="w-4 h-4 text-emerald-400" />
                  <span>Adding Any PSX Stock</span>
                </h4>
                <p className="leading-relaxed">
                  Click the <strong>"+ Add Any Stock"</strong> button in the top header or screener matrix toolbar:
                </p>
                <ol className="list-decimal list-inside space-y-1.5 pl-2 text-gray-300">
                  <li>Enter the PSX Ticker Symbol (e.g. <code className="text-emerald-400">PRL</code>, <code className="text-emerald-400">KEL</code>, <code className="text-emerald-400">WTL</code>, <code className="text-emerald-400">AGHA</code>).</li>
                  <li>Select any of the <strong>27 official PSX sectors</strong> from the complete sector dropdown.</li>
                  <li>Specify the Market Price in PKR and Today's Change % (e.g. +1.20%).</li>
                  <li>Choose the Historical Chart Profile (Ascending Channel, Cup & Handle, Breakout Retest, Bull Flag, Consolidation Box).</li>
                  <li>The app immediately creates real candlestick history, Level-2 DOM, and custom position calculations for that stock!</li>
                </ol>
              </div>

              <div className="bg-[#0d1117] p-4 rounded-xl border border-rose-500/30 space-y-3">
                <h4 className="text-sm font-bold text-rose-400 flex items-center gap-2">
                  <Trash2 className="w-4 h-4" />
                  <span>Deleting Stocks & Universe Adjustment</span>
                </h4>
                <p className="leading-relaxed">
                  Every stock card and table row features a <strong>Delete</strong> button (trash icon).
                </p>
                <div className="p-3 bg-[#161b22] rounded-lg border border-[#30363d] space-y-1 text-[11px]">
                  <strong className="text-white">Dynamic Interface Auto-Adjustment:</strong>
                  <p>
                    When you delete a stock, the entire UI recalculates automatically: total constituent counter, sector filter tallies, market breadth (advancers/decliners), and total turnover recalculate seamlessly.
                  </p>
                  <p className="text-gray-400 pt-1">
                    * If you ever delete by mistake, use the <strong>"Reset Universe"</strong> button in the toolbar to restore the full 30 KMI-30 universe in 1 click.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Section 4: Swing Models & Screener */}
          {activeSection === 'swing_strategies' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 font-mono">
                <div className="bg-[#0d1117] p-3.5 rounded-xl border border-[#21262d] space-y-1.5">
                  <div className="text-emerald-400 font-bold text-xs flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5" />
                    <span>Supertrend (10, 3)</span>
                  </div>
                  <p className="text-gray-300 text-[11px] font-sans leading-relaxed">
                    Uses Average True Range (ATR × 3) multiplier. Provides clear institutional trailing stop-loss points. When price is above the Supertrend line, the background signal is BULLISH swing.
                  </p>
                </div>

                <div className="bg-[#0d1117] p-3.5 rounded-xl border border-[#21262d] space-y-1.5">
                  <div className="text-cyan-400 font-bold text-xs flex items-center gap-1.5">
                    <TrendingUp className="w-3.5 h-3.5" />
                    <span>EMA 20 & 50 Golden Cross</span>
                  </div>
                  <p className="text-gray-300 text-[11px] font-sans leading-relaxed">
                    Exponential Moving Averages calculate exponential weight over 20 and 50 sessions. When EMA 20 crosses above EMA 50, a Golden Cross breakout signal is confirmed.
                  </p>
                </div>

                <div className="bg-[#0d1117] p-3.5 rounded-xl border border-[#21262d] space-y-1.5">
                  <div className="text-purple-400 font-bold text-xs flex items-center gap-1.5">
                    <Compass className="w-3.5 h-3.5" />
                    <span>RSI (14) Momentum Sweet-Spot</span>
                  </div>
                  <p className="text-gray-300 text-[11px] font-sans leading-relaxed">
                    Measures relative speed and magnitude of price changes. Readings between 45–65 signify ideal swing momentum without being overextended into extreme overbought (&gt;70) or oversold (&lt;35).
                  </p>
                </div>

                <div className="bg-[#0d1117] p-3.5 rounded-xl border border-[#21262d] space-y-1.5">
                  <div className="text-amber-400 font-bold text-xs flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5" />
                    <span>Classic Dynamic Pivot Points</span>
                  </div>
                  <p className="text-gray-300 text-[11px] font-sans leading-relaxed">
                    Calculated from High, Low, and Close: Pivot Point (PP), Support levels (S1, S2, S3), and Resistance levels (R1, R2, R3) act as natural reaction and take-profit zones for institutional swing trades.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Section 5: Level-2 DOM & Risk Sizer */}
          {activeSection === 'dom_risk' && (
            <div className="space-y-4">
              <div className="bg-[#0d1117] p-4 rounded-xl border border-[#21262d] space-y-3">
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <Layers className="w-4 h-4 text-emerald-400" />
                  <span>Level-2 Depth of Market & Order Book Imbalance</span>
                </h4>
                <p className="leading-relaxed">
                  The Level-2 DOM panel renders the top-5 Bid and Ask price ladders:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-[11px]">
                  <div className="p-3 bg-[#161b22] rounded-lg border border-emerald-500/30">
                    <strong className="text-emerald-400">Order Book Imbalance (%):</strong>
                    <p className="text-gray-400 mt-1">
                      Calculates the cumulative buy shares vs sell shares. Imbalance &gt; 60% indicates aggressive institutional buyer absorption.
                    </p>
                  </div>
                  <div className="p-3 bg-[#161b22] rounded-lg border border-blue-500/30">
                    <strong className="text-blue-400">Block Order Detection Radar:</strong>
                    <p className="text-gray-400 mt-1">
                      Tracks high-volume institutional ticks (&gt;50,000 shares / &gt;10M PKR) from Mutual Funds, Insurance companies, and Foreign Portfolio Investors (FIPI).
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-[#0d1117] p-4 rounded-xl border border-[#21262d] space-y-3">
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <Calculator className="w-4 h-4 text-amber-400" />
                  <span>Custom Position Sizer & ATR Volatility Stop</span>
                </h4>
                <p className="leading-relaxed">
                  Enter your total account capital (PKR) and max risk percentage per trade (e.g. 1.5%). The calculator uses the 14-day Average True Range (ATR) to suggest exact stop loss, target take-profit (1:2 or 1:3 R:R), and recommended board lots.
                </p>
              </div>
            </div>
          )}

          {/* Section 6: KMI-30 Shariah Rules */}
          {activeSection === 'shariah' && (
            <div className="space-y-4">
              <div className="bg-[#0d1117] p-4 rounded-xl border border-[#21262d] space-y-3">
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>The 6 Core PSX / Meezan KMI-30 Compliance Criteria</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-mono text-[11px]">
                  <div className="p-3 bg-[#161b22] rounded-lg border border-[#30363d] space-y-1">
                    <span className="text-emerald-400 font-bold">1. Core Business Activity</span>
                    <p className="text-gray-400 font-sans">Business must be permissible (Halal). Conventional banking, alcohol, gambling are strictly excluded.</p>
                  </div>
                  <div className="p-3 bg-[#161b22] rounded-lg border border-[#30363d] space-y-1">
                    <span className="text-emerald-400 font-bold">2. Debt to Total Assets &lt; 37%</span>
                    <p className="text-gray-400 font-sans">Interest-bearing debt divided by total assets must not exceed 37%.</p>
                  </div>
                  <div className="p-3 bg-[#161b22] rounded-lg border border-[#30363d] space-y-1">
                    <span className="text-emerald-400 font-bold">3. Illiquid Assets &gt; 25%</span>
                    <p className="text-gray-400 font-sans">Ratio of illiquid assets (plant, machinery, physical inventory) to total assets must be at least 25%.</p>
                  </div>
                  <div className="p-3 bg-[#161b22] rounded-lg border border-[#30363d] space-y-1">
                    <span className="text-emerald-400 font-bold">4. Non-Permissible Income &lt; 5%</span>
                    <p className="text-gray-400 font-sans">Interest or non-shariah income must be under 5% and subject to dividend purification charity.</p>
                  </div>
                  <div className="p-3 bg-[#161b22] rounded-lg border border-[#30363d] space-y-1">
                    <span className="text-emerald-400 font-bold">5. Non-Compliant Investments &lt; 33%</span>
                    <p className="text-gray-400 font-sans">Investments in interest-bearing instruments must not exceed 33% of total assets.</p>
                  </div>
                  <div className="p-3 bg-[#161b22] rounded-lg border border-[#30363d] space-y-1">
                    <span className="text-emerald-400 font-bold">6. Market Price vs Liquid Assets</span>
                    <p className="text-gray-400 font-sans">Share market price must exceed the net liquid assets per share.</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3.5 bg-[#0d1117] border-t border-[#30363d] flex items-center justify-between shrink-0">
          <div className="text-[11px] text-gray-400 flex items-center gap-1.5 font-mono">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>Audited per SECP PSX Trading Regulations</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold transition-all cursor-pointer shadow-md"
          >
            Close Guide
          </button>
        </div>
      </div>
    </div>
  );
};
