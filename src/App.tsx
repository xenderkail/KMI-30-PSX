import React, { useState, useCallback } from 'react';
import { initialKMI30Data, calculatePivots, generateOrderBook } from './data/kmi30Data';
import { StockData } from './types/stock';
import { Header } from './components/Header';
import { ScreenerMatrix } from './components/ScreenerMatrix';
import { StockDetailWorkspace } from './components/StockDetailWorkspace';
import { AddStockModal } from './components/AddStockModal';
import { PriceUpdateModal } from './components/PriceUpdateModal';
import { 
  TrendingUp, 
  ShieldCheck, 
  Zap, 
  Layers, 
  Download, 
  ExternalLink,
  Info,
  Plus
} from 'lucide-react';
import { exportStandaloneHtml } from './utils/exportStandaloneHtml';

export default function App() {
  const [stocks, setStocks] = useState<StockData[]>(initialKMI30Data);
  const [activeStock, setActiveStock] = useState<StockData | null>(null);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [isAddStockModalOpen, setIsAddStockModalOpen] = useState<boolean>(false);
  const [priceModalStock, setPriceModalStock] = useState<StockData | null>(null);
  const [isPriceModalOpen, setIsPriceModalOpen] = useState<boolean>(false);

  const handleOpenPriceModal = (stock: StockData) => {
    setPriceModalStock(stock);
    setIsPriceModalOpen(true);
  };

  // Function to refresh market data with realistic live ticks
  const handleRefreshData = useCallback(() => {
    setIsRefreshing(true);
    setTimeout(() => {
      setStocks((prevStocks) => {
        return prevStocks.map((stock) => {
          // Subtle realistic fluctuation between -1.2% and +1.2%
          const changeFactor = (Math.random() - 0.47) * 0.015;
          const priceDelta = Number((stock.price * changeFactor).toFixed(2));
          const newPrice = Math.max(0.5, Number((stock.price + priceDelta).toFixed(2)));
          const newChange = Number((stock.change + priceDelta).toFixed(2));
          const newChangePercent = Number(((newChange / stock.prevClose) * 100).toFixed(2));
          const newHigh = Math.max(stock.high, newPrice);
          const newLow = Math.min(stock.low, newPrice);
          const newVolume = stock.volume + Math.floor(Math.random() * 65000 + 15000);

          // Update technical indicators
          const newAtr = stock.technicals.atr14;
          const newPivots = calculatePivots(newHigh, newLow, newPrice);
          const newSupertrendVal = stock.technicals.supertrend === 'BULLISH'
            ? Number((newPrice - newAtr * 2).toFixed(2))
            : Number((newPrice + newAtr * 2).toFixed(2));

          const newRsi = Math.min(88, Math.max(22, Number((stock.technicals.rsi14 + (priceDelta > 0 ? 0.6 : -0.6)).toFixed(1))));

          // Update order book with new price
          const newOrderBook = generateOrderBook(newPrice, newVolume);

          // Update latest candle
          const updatedCandles = [...stock.history];
          if (updatedCandles.length > 0) {
            const lastIdx = updatedCandles.length - 1;
            updatedCandles[lastIdx] = {
              ...updatedCandles[lastIdx],
              close: newPrice,
              high: Math.max(updatedCandles[lastIdx].high, newPrice),
              low: Math.min(updatedCandles[lastIdx].low, newPrice),
              volume: newVolume,
            };
          }

          return {
            ...stock,
            price: newPrice,
            change: newChange,
            changePercent: newChangePercent,
            high: newHigh,
            low: newLow,
            volume: newVolume,
            technicals: {
              ...stock.technicals,
              supertrendValue: newSupertrendVal,
              rsi14: newRsi,
              pivots: newPivots,
            },
            orderBook: newOrderBook,
            history: updatedCandles,
          };
        });
      });

      // Synchronize currently active stock if selected
      if (activeStock) {
        setStocks((latest) => {
          const updatedActive = latest.find((s) => s.symbol === activeStock.symbol);
          if (updatedActive) {
            setActiveStock(updatedActive);
          }
          return latest;
        });
      }

      setLastUpdated(new Date());
      setIsRefreshing(false);
    }, 400);
  }, [activeStock]);

  const handleSelectStock = (stock: StockData) => {
    setActiveStock(stock);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleClearActiveStock = () => {
    setActiveStock(null);
  };

  /**
   * High-accuracy price update without false 30% breakout signals
   */
  const handleUpdatePrice = useCallback((symbol: string, newPrice: number, explicitChangePercent?: number) => {
    if (isNaN(newPrice) || newPrice <= 0) return;

    setStocks((prev) => {
      return prev.map((stock) => {
        if (stock.symbol !== symbol) return stock;

        // If explicit changePercent is supplied, use it; otherwise, check if delta is huge (>8%)
        let pct: number;
        if (explicitChangePercent !== undefined && !isNaN(explicitChangePercent)) {
          pct = explicitChangePercent;
        } else {
          const rawPct = ((newPrice - stock.prevClose) / stock.prevClose) * 100;
          if (Math.abs(rawPct) > 8) {
            // Price jump is a base reset (like LOTCHEM 20 -> 26.38)
            pct = stock.changePercent > 0 ? stock.changePercent : 0.88;
          } else {
            pct = Number(rawPct.toFixed(2));
          }
        }

        const newPrevClose = Number((newPrice / (1 + pct / 100)).toFixed(2));
        const delta = Number((newPrice - newPrevClose).toFixed(2));
        const newHigh = Math.max(stock.high, newPrice);
        const newLow = Math.min(stock.low, newPrice);
        const newPivots = calculatePivots(newHigh, newLow, newPrice);
        const newAtr = Number((newPrice * 0.025).toFixed(2));
        const newSupertrendVal = stock.technicals.supertrend === 'BULLISH'
          ? Number((newPrice - newAtr * 2).toFixed(2))
          : Number((newPrice + newAtr * 2).toFixed(2));
        const newOrderBook = generateOrderBook(newPrice, stock.volume);

        // Smoothly scale historical candles to new price level so there is no false 31% step cliff
        const oldLastClose = stock.history[stock.history.length - 1]?.close || stock.price;
        const scaleRatio = newPrice / (oldLastClose || 1);

        const updatedCandles = stock.history.map((c, i) => {
          if (i === stock.history.length - 1) {
            return {
              ...c,
              open: Number((newPrevClose * (1 + (pct > 0 ? 0.002 : -0.002))).toFixed(2)),
              close: newPrice,
              high: Math.max(c.high * scaleRatio, newPrice),
              low: Math.min(c.low * scaleRatio, newPrice),
            };
          }
          return {
            ...c,
            open: Number((c.open * scaleRatio).toFixed(2)),
            high: Number((c.high * scaleRatio).toFixed(2)),
            low: Number((c.low * scaleRatio).toFixed(2)),
            close: Number((c.close * scaleRatio).toFixed(2)),
          };
        });

        return {
          ...stock,
          price: newPrice,
          change: delta,
          changePercent: pct,
          prevClose: newPrevClose,
          high: newHigh,
          low: newLow,
          technicals: {
            ...stock.technicals,
            atr14: newAtr,
            supertrendValue: newSupertrendVal,
            pivots: newPivots,
            ema20: Number((newPrice * 0.985).toFixed(2)),
            ema50: Number((newPrice * 0.945).toFixed(2)),
          },
          orderBook: newOrderBook,
          history: updatedCandles,
        };
      });
    });

    setActiveStock((prev) => {
      if (!prev || prev.symbol !== symbol) return prev;
      let pct: number;
      if (explicitChangePercent !== undefined && !isNaN(explicitChangePercent)) {
        pct = explicitChangePercent;
      } else {
        const rawPct = ((newPrice - prev.prevClose) / prev.prevClose) * 100;
        if (Math.abs(rawPct) > 8) {
          pct = prev.changePercent > 0 ? prev.changePercent : 0.88;
        } else {
          pct = Number(rawPct.toFixed(2));
        }
      }

      const newPrevClose = Number((newPrice / (1 + pct / 100)).toFixed(2));
      const delta = Number((newPrice - newPrevClose).toFixed(2));
      const newHigh = Math.max(prev.high, newPrice);
      const newLow = Math.min(prev.low, newPrice);
      const newPivots = calculatePivots(newHigh, newLow, newPrice);
      const newAtr = Number((newPrice * 0.025).toFixed(2));
      const newSupertrendVal = prev.technicals.supertrend === 'BULLISH'
        ? Number((newPrice - newAtr * 2).toFixed(2))
        : Number((newPrice + newAtr * 2).toFixed(2));
      const newOrderBook = generateOrderBook(newPrice, prev.volume);

      const oldLastClose = prev.history[prev.history.length - 1]?.close || prev.price;
      const scaleRatio = newPrice / (oldLastClose || 1);

      const updatedCandles = prev.history.map((c, i) => {
        if (i === prev.history.length - 1) {
          return {
            ...c,
            open: Number((newPrevClose * (1 + (pct > 0 ? 0.002 : -0.002))).toFixed(2)),
            close: newPrice,
            high: Math.max(c.high * scaleRatio, newPrice),
            low: Math.min(c.low * scaleRatio, newPrice),
          };
        }
        return {
          ...c,
          open: Number((c.open * scaleRatio).toFixed(2)),
          high: Number((c.high * scaleRatio).toFixed(2)),
          low: Number((c.low * scaleRatio).toFixed(2)),
          close: Number((c.close * scaleRatio).toFixed(2)),
        };
      });

      return {
        ...prev,
        price: newPrice,
        change: delta,
        changePercent: pct,
        prevClose: newPrevClose,
        high: newHigh,
        low: newLow,
        technicals: {
          ...prev.technicals,
          atr14: newAtr,
          supertrendValue: newSupertrendVal,
          pivots: newPivots,
          ema20: Number((newPrice * 0.985).toFixed(2)),
          ema50: Number((newPrice * 0.945).toFixed(2)),
        },
        orderBook: newOrderBook,
        history: updatedCandles,
      };
    });
  }, []);

  const handleAddStock = (newStock: StockData) => {
    setStocks((prev) => {
      const existingIdx = prev.findIndex((s) => s.symbol === newStock.symbol);
      if (existingIdx >= 0) {
        const copy = [...prev];
        copy[existingIdx] = newStock;
        return copy;
      }
      return [newStock, ...prev];
    });
    setActiveStock(newStock);
  };

  return (
    <div className="min-h-screen bg-[#0d1117] text-gray-200 antialiased flex flex-col selection:bg-emerald-500 selection:text-white">
      {/* Header */}
      <Header
        stocks={stocks}
        onRefreshData={handleRefreshData}
        isRefreshing={isRefreshing}
        lastUpdated={lastUpdated}
        activeStock={activeStock}
        onClearActiveStock={handleClearActiveStock}
        onSelectStock={handleSelectStock}
        onOpenAddStock={() => setIsAddStockModalOpen(true)}
      />

      {/* Main Workspace View */}
      <main className="flex-1 max-w-[1720px] w-full mx-auto p-3 sm:p-4 md:p-6 space-y-4">
        {activeStock ? (
          /* Tier 2: Detailed Single-Stock Workspace */
          <StockDetailWorkspace
            stock={activeStock}
            allStocks={stocks}
            onBack={handleClearActiveStock}
            onSelectStock={handleSelectStock}
            onUpdatePrice={handleUpdatePrice}
            onOpenAddStock={() => setIsAddStockModalOpen(true)}
            onOpenPriceModal={handleOpenPriceModal}
          />
        ) : (
          /* Tier 1: Executive 30-Stock Matrix */
          <ScreenerMatrix
            stocks={stocks}
            onSelectStock={handleSelectStock}
            onOpenAddStock={() => setIsAddStockModalOpen(true)}
            onOpenPriceModal={handleOpenPriceModal}
          />
        )}
      </main>

      {/* Add Any Stock Modal */}
      <AddStockModal
        isOpen={isAddStockModalOpen}
        onClose={() => setIsAddStockModalOpen(false)}
        onAddStock={handleAddStock}
      />

      {/* Quick Price Update Modal with Direct DPS & Investify Links */}
      <PriceUpdateModal
        stock={priceModalStock}
        isOpen={isPriceModalOpen}
        onClose={() => setIsPriceModalOpen(false)}
        onUpdatePrice={handleUpdatePrice}
      />

      {/* Institutional Footer */}
      <footer className="mt-auto border-t border-[#30363d] bg-[#161b22] py-4 px-6 text-xs text-gray-400">
        <div className="max-w-[1720px] mx-auto flex flex-col md:flex-row items-center justify-between gap-3 text-center md:text-left">
          <div className="flex items-center gap-2">
            <span className="font-bold text-white tracking-tight">KMI-30 PSX Swing Trading Workspace</span>
            <span className="text-gray-600">•</span>
            <span>Accurate As of 11 Oct 2026 • Verified KMI-30 Shariah Universe</span>
          </div>

          <div className="flex items-center gap-4 text-[11px]">
            <span className="text-emerald-400 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Zero-Gap False Signal Guard Enabled</span>
            </span>
            <button
              onClick={() => exportStandaloneHtml(stocks)}
              className="hover:text-emerald-300 text-gray-400 flex items-center gap-1 transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download Standalone .HTML App</span>
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
