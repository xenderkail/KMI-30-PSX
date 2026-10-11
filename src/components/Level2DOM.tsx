import React, { useState } from 'react';
import { StockData, BlockOrder } from '../types/stock';
import { 
  Building2, 
  ArrowDownUp, 
  Layers, 
  ShieldAlert, 
  Zap, 
  Flame, 
  TrendingUp, 
  TrendingDown, 
  RefreshCw 
} from 'lucide-react';

interface Level2DOMProps {
  stock: StockData;
}

export const Level2DOM: React.FC<Level2DOMProps> = ({ stock }) => {
  const { orderBook, price } = stock;
  const maxBidCumulative = Math.max(...orderBook.bids.map(b => b.cumulativeShares), 1);
  const maxAskCumulative = Math.max(...orderBook.asks.map(a => a.cumulativeShares), 1);
  const maxCumulative = Math.max(maxBidCumulative, maxAskCumulative);

  const getInstitutionBadge = (inst: BlockOrder['institutionType']) => {
    switch (inst) {
      case 'MUTUAL_FUND':
        return <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[9px] px-1.5 py-0.5 rounded font-mono">Mutual Fund</span>;
      case 'INSURANCE':
        return <span className="bg-blue-500/20 text-blue-300 border border-blue-500/40 text-[9px] px-1.5 py-0.5 rounded font-mono">Insurance Co</span>;
      case 'FOREIGN_FIPI':
        return <span className="bg-purple-500/20 text-purple-300 border border-purple-500/40 text-[9px] px-1.5 py-0.5 rounded font-mono">FIPI Foreign</span>;
      case 'LOCAL_NBFC':
        return <span className="bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[9px] px-1.5 py-0.5 rounded font-mono">Broker Prop</span>;
    }
  };

  return (
    <div className="bg-[#161b22] border border-[#30363d] rounded-xl p-4 shadow-xl space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#21262d] pb-3">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-emerald-400" />
          <h3 className="text-sm font-bold text-white tracking-tight">
            Level-2 Depth of Market (DOM) & Institutional Liquidity
          </h3>
        </div>
        <div className="flex items-center gap-2 font-mono text-xs">
          <span className="text-gray-400">Spread:</span>
          <span className="font-semibold text-white">PKR {orderBook.spreadPKR.toFixed(2)}</span>
          <span className="text-gray-500">({orderBook.spreadBps.toFixed(0)} bps)</span>
        </div>
      </div>

      {/* Buyer vs Seller Imbalance Meter */}
      <div className="bg-[#0d1117] border border-[#30363d] rounded-lg p-3 space-y-2">
        <div className="flex items-center justify-between text-xs font-mono">
          <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Total Bids Depth: {orderBook.buyerImbalancePercent}%</span>
          </div>
          <div className="text-gray-400 text-[11px]">
            {orderBook.buyerImbalancePercent > 55 ? (
              <span className="text-emerald-300 font-semibold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                Institutional Buyer Dominated
              </span>
            ) : orderBook.buyerImbalancePercent < 45 ? (
              <span className="text-rose-300 font-semibold bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/20">
                Seller Supply Pressure
              </span>
            ) : (
              <span className="text-gray-300 font-medium bg-gray-500/10 px-2 py-0.5 rounded border border-gray-500/20">
                Balanced Two-Sided Market
              </span>
            )}
          </div>
          <div className="flex items-center gap-1.5 text-rose-400 font-bold">
            <span>Total Asks Depth: {orderBook.sellerImbalancePercent}%</span>
            <TrendingDown className="w-3.5 h-3.5" />
          </div>
        </div>

        {/* Dual Color Horizontal Progress Bar */}
        <div className="w-full h-3 rounded-full overflow-hidden flex bg-[#21262d]">
          <div 
            className="h-full bg-gradient-to-r from-emerald-600 to-emerald-400 transition-all duration-300"
            style={{ width: `${orderBook.buyerImbalancePercent}%` }}
          />
          <div 
            className="h-full bg-gradient-to-r from-rose-400 to-rose-600 transition-all duration-300"
            style={{ width: `${orderBook.sellerImbalancePercent}%` }}
          />
        </div>
      </div>

      {/* Level-2 Ladder (Top 5 Bids vs Top 5 Asks) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {/* Bids Ladder (Buy Orders) */}
        <div className="bg-[#0d1117] border border-[#30363d] rounded-lg overflow-hidden">
          <div className="bg-[#121d17] px-3 py-1.5 border-b border-emerald-500/30 flex items-center justify-between text-xs font-semibold text-emerald-400">
            <span>BUYERS / BIDS (Demand Ladder)</span>
            <span className="text-[10px] text-gray-400">Top 5 Depth</span>
          </div>

          <div className="divide-y divide-[#21262d] text-xs font-mono">
            <div className="grid grid-cols-5 text-[10px] text-gray-400 p-2 font-mono uppercase bg-[#161b22]/50">
              <span className="text-center">Orders</span>
              <span className="text-right">Shares</span>
              <span className="text-right">Val (PKR M)</span>
              <span className="text-right font-bold text-emerald-400">Bid Price</span>
              <span className="text-center">Depth</span>
            </div>

            {orderBook.bids.map((bid, idx) => {
              const depthPercent = (bid.cumulativeShares / maxCumulative) * 100;
              return (
                <div key={idx} className="relative p-2 grid grid-cols-5 items-center hover:bg-[#1a231d] transition-colors">
                  {/* Depth bar underlay */}
                  <div 
                    className="absolute top-0 bottom-0 right-0 bg-emerald-500/15 pointer-events-none"
                    style={{ width: `${depthPercent}%` }}
                  />

                  <span className="text-center text-gray-400 relative z-10">{bid.orders}</span>
                  <span className="text-right text-gray-200 relative z-10">{bid.shares.toLocaleString()}</span>
                  <span className="text-right text-gray-400 relative z-10">{bid.totalValueMillion.toFixed(1)}M</span>
                  <span className="text-right font-bold text-emerald-400 relative z-10">{bid.price.toFixed(2)}</span>
                  <span className="text-center text-[10px] relative z-10">
                    {bid.isBlockOrder ? (
                      <span className="bg-emerald-500/30 text-emerald-300 px-1 rounded text-[9px] font-bold">
                        BLOCK
                      </span>
                    ) : (
                      <span className="text-gray-500">{(bid.shares / 1000).toFixed(0)}k</span>
                    )}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Asks Ladder (Sell Orders) */}
        <div className="bg-[#0d1117] border border-[#30363d] rounded-lg overflow-hidden">
          <div className="bg-[#241517] px-3 py-1.5 border-b border-rose-500/30 flex items-center justify-between text-xs font-semibold text-rose-400">
            <span>SELLERS / ASKS (Supply Ladder)</span>
            <span className="text-[10px] text-gray-400">Top 5 Depth</span>
          </div>

          <div className="divide-y divide-[#21262d] text-xs font-mono">
            <div className="grid grid-cols-5 text-[10px] text-gray-400 p-2 font-mono uppercase bg-[#161b22]/50">
              <span className="text-left font-bold text-rose-400">Ask Price</span>
              <span className="text-right">Shares</span>
              <span className="text-right">Val (PKR M)</span>
              <span className="text-center">Orders</span>
              <span className="text-center">Depth</span>
            </div>

            {orderBook.asks.map((ask, idx) => {
              const depthPercent = (ask.cumulativeShares / maxCumulative) * 100;
              return (
                <div key={idx} className="relative p-2 grid grid-cols-5 items-center hover:bg-[#28181b] transition-colors">
                  {/* Depth bar underlay */}
                  <div 
                    className="absolute top-0 bottom-0 left-0 bg-rose-500/15 pointer-events-none"
                    style={{ width: `${depthPercent}%` }}
                  />

                  <span className="text-left font-bold text-rose-400 relative z-10">{ask.price.toFixed(2)}</span>
                  <span className="text-right text-gray-200 relative z-10">{ask.shares.toLocaleString()}</span>
                  <span className="text-right text-gray-400 relative z-10">{ask.totalValueMillion.toFixed(1)}M</span>
                  <span className="text-center text-gray-400 relative z-10">{ask.orders}</span>
                  <span className="text-center text-[10px] relative z-10">
                    {ask.isBlockOrder ? (
                      <span className="bg-rose-500/30 text-rose-300 px-1 rounded text-[9px] font-bold">
                        BLOCK
                      </span>
                    ) : (
                      <span className="text-gray-500">{(ask.shares / 1000).toFixed(0)}k</span>
                    )}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Institutional Block Order Detection Feed */}
      <div className="bg-[#0d1117] border border-[#30363d] rounded-lg p-3 space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs font-bold text-white">
            <Building2 className="w-3.5 h-3.5 text-blue-400" />
            <span>Institutional Block Order Detection (&gt; 50,000 shares / &gt; 10M PKR)</span>
          </div>
          <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
            Real-Time Tick Monitor
          </span>
        </div>

        <div className="space-y-1.5">
          {orderBook.recentBlocks.map((block) => (
            <div 
              key={block.id}
              className="flex items-center justify-between p-2 rounded bg-[#161b22] border border-[#21262d] text-xs font-mono"
            >
              <div className="flex items-center gap-2">
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                  block.type === 'BUY' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'
                }`}>
                  {block.type}
                </span>
                <span className="text-white font-semibold">{block.shares.toLocaleString()} shares</span>
                <span className="text-gray-400">@ PKR {block.price.toFixed(2)}</span>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-gray-300 font-bold">PKR {block.valuePKRMillion.toFixed(2)}M</span>
                {getInstitutionBadge(block.institutionType)}
                <span className="text-gray-500 text-[10px]">{block.time}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
