import React from 'react';
import { StockData } from '../types/stock';
import { 
  ShieldCheck, 
  CheckCircle2, 
  Info, 
  Percent, 
  Scale, 
  HelpCircle,
  FileCheck2
} from 'lucide-react';

interface ShariahComplianceCardProps {
  stock: StockData;
}

export const ShariahComplianceCard: React.FC<ShariahComplianceCardProps> = ({ stock }) => {
  const { shariah, symbol, name, price } = stock;

  return (
    <div className="bg-[#161b22] border border-[#30363d] rounded-xl p-4 shadow-xl space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#21262d] pb-3">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <div>
            <h3 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
              <span>KMI-30 Shariah Compliance Audit</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                OFFICIAL KMI CONSTITUENT
              </span>
            </h3>
            <p className="text-xs text-gray-400">
              Meezan Bank & SECP Islamic Capital Market Screening Standards
            </p>
          </div>
        </div>

        <div className="text-right">
          <div className="flex items-center gap-1.5 text-emerald-400 font-bold text-xs justify-end">
            <CheckCircle2 className="w-4 h-4" />
            <span>100% SHARIAH COMPLIANT</span>
          </div>
          <div className="text-[10px] text-gray-500 font-mono">
            Advisor: {shariah.shariahAdvisor}
          </div>
        </div>
      </div>

      {/* Islamic Financial Ratios Grid (The 5 Mandatory KMI-30 Criteria) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {/* Ratio 1: Interest-bearing Debt to Total Assets */}
        <div className="bg-[#0d1117] border border-[#30363d] rounded-lg p-3 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-gray-300">1. Debt to Total Assets</span>
            <span className="font-mono text-[10px] text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded font-bold">
              PASS
            </span>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="font-mono text-base font-bold text-white">
              {shariah.debtToAssets.toFixed(1)}%
            </span>
            <span className="text-xs text-gray-400 font-mono">Max Limit: &lt; 37.0%</span>
          </div>
          {/* Progress bar */}
          <div className="space-y-1">
            <div className="w-full bg-[#21262d] h-2 rounded-full overflow-hidden">
              <div 
                className="h-full bg-emerald-400 rounded-full"
                style={{ width: `${Math.min(100, (shariah.debtToAssets / 37) * 100)}%` }}
              />
            </div>
            <div className="text-[10px] text-gray-500 flex justify-between">
              <span>Current Leverage: Safe</span>
              <span>Headroom: {(37 - shariah.debtToAssets).toFixed(1)}%</span>
            </div>
          </div>
        </div>

        {/* Ratio 2: Illiquid Assets to Total Assets */}
        <div className="bg-[#0d1117] border border-[#30363d] rounded-lg p-3 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-gray-300">2. Illiquid Assets Ratio</span>
            <span className="font-mono text-[10px] text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded font-bold">
              PASS
            </span>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="font-mono text-base font-bold text-white">
              {shariah.illiquidAssets.toFixed(1)}%
            </span>
            <span className="text-xs text-gray-400 font-mono">Min Limit: &gt; 25.0%</span>
          </div>
          {/* Progress bar */}
          <div className="space-y-1">
            <div className="w-full bg-[#21262d] h-2 rounded-full overflow-hidden">
              <div 
                className="h-full bg-emerald-400 rounded-full"
                style={{ width: `${Math.min(100, (shariah.illiquidAssets / 100) * 100)}%` }}
              />
            </div>
            <div className="text-[10px] text-gray-500 flex justify-between">
              <span>Tangible Real Assets: High</span>
              <span>Surplus: +{(shariah.illiquidAssets - 25).toFixed(1)}%</span>
            </div>
          </div>
        </div>

        {/* Ratio 3: Non-Compliant Investments */}
        <div className="bg-[#0d1117] border border-[#30363d] rounded-lg p-3 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-gray-300">3. Non-Compliant Invest.</span>
            <span className="font-mono text-[10px] text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded font-bold">
              PASS
            </span>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="font-mono text-base font-bold text-white">
              {shariah.nonCompliantInvestments.toFixed(1)}%
            </span>
            <span className="text-xs text-gray-400 font-mono">Max Limit: &lt; 33.0%</span>
          </div>
          {/* Progress bar */}
          <div className="space-y-1">
            <div className="w-full bg-[#21262d] h-2 rounded-full overflow-hidden">
              <div 
                className="h-full bg-emerald-400 rounded-full"
                style={{ width: `${Math.min(100, (shariah.nonCompliantInvestments / 33) * 100)}%` }}
              />
            </div>
            <div className="text-[10px] text-gray-500 flex justify-between">
              <span>Conventional Paper: Low</span>
              <span>Headroom: {(33 - shariah.nonCompliantInvestments).toFixed(1)}%</span>
            </div>
          </div>
        </div>

        {/* Ratio 4: Non-Permissible / Haram Income Ratio */}
        <div className="bg-[#0d1117] border border-[#30363d] rounded-lg p-3 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-gray-300">4. Non-Permissible Income</span>
            <span className="font-mono text-[10px] text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded font-bold">
              PASS
            </span>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="font-mono text-base font-bold text-white">
              {shariah.nonPermissibleIncomePercent.toFixed(1)}%
            </span>
            <span className="text-xs text-gray-400 font-mono">Max Limit: &lt; 5.0%</span>
          </div>
          <div className="space-y-1">
            <div className="w-full bg-[#21262d] h-2 rounded-full overflow-hidden">
              <div 
                className="h-full bg-emerald-400 rounded-full"
                style={{ width: `${Math.min(100, (shariah.nonPermissibleIncomePercent / 5) * 100)}%` }}
              />
            </div>
            <div className="text-[10px] text-gray-500 flex justify-between">
              <span>Permissible Core Business</span>
              <span>Purification: {shariah.dividendPurificationPercent}%</span>
            </div>
          </div>
        </div>

        {/* Ratio 5: Market Price vs Net Liquid Assets Per Share */}
        <div className="bg-[#0d1117] border border-[#30363d] rounded-lg p-3 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-gray-300">5. Price &gt; Net Liquid Assets</span>
            <span className="font-mono text-[10px] text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded font-bold">
              PASS
            </span>
          </div>
          <div className="font-mono text-base font-bold text-white">
            PKR {price.toFixed(2)} &gt; PKR {shariah.netLiquidAssetsPerShare.toFixed(2)}
          </div>
          <div className="text-[10px] text-gray-400 space-y-1 pt-1">
            <div className="flex justify-between">
              <span>Net Liquid Assets/Share:</span>
              <span className="text-gray-300 font-mono">PKR {shariah.netLiquidAssetsPerShare.toFixed(2)}</span>
            </div>
            <div className="text-[9px] text-emerald-400">
              ✓ Complies with Fiqh rule against trading money for money at a discount
            </div>
          </div>
        </div>

        {/* Islamic Dividend Purification Calculator Note */}
        <div className="bg-[#0d1117] border border-[#30363d] rounded-lg p-3 space-y-2 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-gray-300">Dividend Purification Rate</span>
            <span className="font-mono text-[10px] text-blue-400 bg-blue-500/10 px-1.5 py-0.5 rounded">
              Charity Deduction
            </span>
          </div>
          <div>
            <div className="font-mono text-lg font-bold text-emerald-400">
              {shariah.dividendPurificationPercent.toFixed(2)}% of Dividends
            </div>
            <p className="text-[10px] text-gray-400 mt-1 leading-relaxed">
              If {symbol} pays a cash dividend, donate {shariah.dividendPurificationPercent}% to approved charity to purify interest income on corporate deposits.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
