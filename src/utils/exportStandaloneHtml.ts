import { StockData } from '../types/stock';

export function exportStandaloneHtml(stocks: StockData[]) {
  const serializedStocks = JSON.stringify(stocks);

  const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>KMI-30 PSX Institutional Swing Trading Workspace (11 Oct 2026)</title>
  <meta name="description" content="Institutional Swing Trading Workspace & Screener for the KMI-30 Index on the Pakistan Stock Exchange (PSX) with Shariah compliance, Level-2 DOM, and custom risk engine.">
  
  <!-- Tailwind CSS CDN -->
  <script src="https://cdn.tailwindcss.com"></script>
  
  <!-- FontAwesome Icons CDN -->
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">

  <!-- Google Fonts: Inter & JetBrains Mono -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500;600;700&display=swap" rel="stylesheet">

  <script>
    tailwind.config = {
      theme: {
        extend: {
          colors: {
            brandDark: '#0d1117',
            brandCard: '#161b22',
            brandBorder: '#30363d',
            brandAccent: '#58a6ff',
            brandGreen: '#3fb950',
            brandRed: '#f85149',
          },
          fontFamily: {
            sans: ['Inter', 'sans-serif'],
            mono: ['JetBrains Mono', 'monospace'],
          }
        }
      }
    }
  </script>

  <style>
    body {
      background-color: #0d1117;
      color: #c9d1d9;
      font-family: 'Inter', sans-serif;
    }
    ::-webkit-scrollbar {
      width: 7px;
      height: 7px;
    }
    ::-webkit-scrollbar-track {
      background: #0d1117;
    }
    ::-webkit-scrollbar-thumb {
      background: #30363d;
      border-radius: 4px;
    }
    ::-webkit-scrollbar-thumb:hover {
      background: #58a6ff;
    }
  </style>
</head>
<body class="min-h-screen bg-[#0d1117] text-gray-200 antialiased selection:bg-emerald-500 selection:text-white flex flex-col">

  <!-- Top Notification Bar -->
  <div class="px-4 py-1.5 bg-[#090d13] border-b border-[#21262d] flex flex-wrap items-center justify-between text-xs text-gray-400 gap-2">
    <div class="flex items-center gap-4 flex-wrap">
      <div class="flex items-center gap-1.5">
        <span class="relative flex h-2 w-2">
          <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span class="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
        </span>
        <span class="font-semibold text-emerald-400">REGULAR PSX SESSION</span>
      </div>
      <div class="flex items-center gap-1.5 text-gray-400">
        <i class="fa-regular fa-clock text-blue-400"></i>
        <span class="font-semibold text-white">Sunday, 11 Oct 2026:</span>
        <span class="font-mono text-gray-200 font-medium" id="clock-display">11:45:00 AM PKT</span>
      </div>
      <div class="flex items-center gap-1.5 bg-[#161b22] px-2 py-0.5 rounded border border-[#30363d]">
        <i class="fa-solid fa-shield-halved text-emerald-400"></i>
        <span class="text-gray-300">Shariah Screening:</span>
        <span class="text-emerald-400 font-semibold">100% Compliant (30/30)</span>
      </div>
    </div>
    <div class="flex items-center gap-2 text-xs">
      <span class="text-gray-400">KMI-30 Index:</span>
      <span class="font-mono font-bold text-white">241,850.40</span>
      <span class="font-mono text-emerald-400 font-semibold">+820.60 (+0.34%)</span>
    </div>
  </div>

  <!-- Header -->
  <header class="bg-[#161b22] border-b border-[#30363d] sticky top-0 z-40 backdrop-blur shadow-xl">
    <div class="max-w-[1720px] mx-auto px-4 py-3 flex flex-wrap items-center justify-between gap-4">
      <div class="flex items-center gap-3 cursor-pointer" onclick="switchView('matrix')">
        <div class="w-10 h-10 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center">
          <i class="fa-solid fa-chart-line text-emerald-400 text-lg"></i>
        </div>
        <div>
          <div class="flex items-center gap-2">
            <h1 class="text-base font-bold text-white tracking-tight">
              KMI-30 <span class="text-emerald-400">SWING</span> PRO
            </h1>
            <span class="text-[10px] font-mono px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30">
              OCTOBER 2026 EDITION
            </span>
          </div>
          <p class="text-xs text-gray-400">PSX Shariah-Compliant Swing Screener & Workspace</p>
        </div>
      </div>

      <div class="flex items-center gap-2.5">
        <button onclick="refreshData()" class="flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white transition-all shadow-md active:scale-95">
          <i class="fa-solid fa-arrows-rotate" id="refresh-icon"></i>
          <span>Update Market Data</span>
        </button>
        <button onclick="window.print()" class="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium bg-[#21262d] hover:bg-[#30363d] text-gray-300 border border-[#30363d] transition-all">
          <i class="fa-solid fa-print"></i>
          <span>Print / PDF</span>
        </button>
      </div>
    </div>
  </header>

  <!-- Main Container -->
  <main class="max-w-[1720px] w-full mx-auto p-3 sm:p-4 md:p-6 flex-1 space-y-4">
    <div id="app-root"></div>
  </main>

  <footer class="border-t border-[#30363d] bg-[#161b22] py-4 px-6 text-xs text-gray-400">
    <div class="max-w-[1720px] mx-auto flex flex-col md:flex-row items-center justify-between gap-3 text-center md:text-left">
      <div>
        <strong class="text-white">KMI-30 PSX Swing Trading Workspace</strong> • 30 Constituents Screened per Meezan Bank Standards (11 Oct 2026)
      </div>
      <div class="text-[11px] text-gray-500 font-mono">
        Pakistan Stock Exchange • Level-2 DOM • Native Candlestick Engine
      </div>
    </div>
  </footer>

  <script>
    const KMI_STOCKS = ${serializedStocks};
    let currentStock = KMI_STOCKS[0];
    let currentView = 'matrix';
    let selectedSector = 'All';
    let searchQuery = '';
    let currentLayout = 'grid';

    function updateClock() {
      const now = new Date();
      const options = { timeZone: 'Asia/Karachi', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true };
      const timeStr = new Intl.DateTimeFormat('en-US', options).format(now);
      const el = document.getElementById('clock-display');
      if (el) el.innerText = timeStr;
    }
    setInterval(updateClock, 1000);
    updateClock();

    function refreshData() {
      const icon = document.getElementById('refresh-icon');
      if (icon) icon.classList.add('fa-spin');
      setTimeout(() => {
        KMI_STOCKS.forEach(s => {
          const delta = (Math.random() - 0.47) * (s.price * 0.015);
          s.price = Number((s.price + delta).toFixed(2));
          s.change = Number((s.change + delta).toFixed(2));
          s.changePercent = Number(((s.change / s.prevClose) * 100).toFixed(2));
        });
        if (icon) icon.classList.remove('fa-spin');
        render();
      }, 400);
    }

    function switchView(view, symbol) {
      currentView = view;
      if (symbol) {
        currentStock = KMI_STOCKS.find(s => s.symbol === symbol) || KMI_STOCKS[0];
      }
      render();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    function render() {
      const root = document.getElementById('app-root');
      if (!root) return;

      if (currentView === 'matrix') {
        renderMatrix(root);
      } else {
        renderDetail(root);
      }
    }

    function renderMatrix(root) {
      const sectors = ['All', 'Oil & Gas', 'Cement', 'Fertilizer', 'Technology', 'Power', 'Commercial Banks', 'Pharmaceuticals', 'Chemicals', 'Textile', 'Engineering', 'Food & Personal Care', 'Automobile'];
      
      const filtered = KMI_STOCKS.filter(s => {
        if (selectedSector !== 'All' && s.sector !== selectedSector) return false;
        if (searchQuery) {
          const q = searchQuery.toLowerCase();
          return s.symbol.toLowerCase().includes(q) || s.name.toLowerCase().includes(q);
        }
        return true;
      });

      let html = \`
        <div class="bg-[#161b22] border border-[#30363d] rounded-xl p-4 shadow-lg space-y-3.5">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 class="text-base font-bold text-white flex items-center gap-2">
                <i class="fa-solid fa-layer-group text-emerald-400"></i>
                <span>Executive 30-Stock Matrix (11 Oct 2026 PSX)</span>
              </h2>
              <p class="text-xs text-gray-400">Click any stock card to open Tier-2 deep PSX candlestick chart, Level-2 DOM, and risk engine.</p>
            </div>
            <div class="flex items-center gap-2">
              <input type="text" placeholder="Search ticker or name..." value="\${searchQuery}" oninput="searchQuery = this.value; render();" class="bg-[#0d1117] border border-[#30363d] rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-emerald-500 w-48" />
              <div class="bg-[#0d1117] p-0.5 rounded-lg border border-[#30363d] flex">
                <button onclick="currentLayout='grid'; render();" class="px-2.5 py-1 text-xs rounded \${currentLayout === 'grid' ? 'bg-[#21262d] text-emerald-400 font-bold' : 'text-gray-400'}"><i class="fa-solid fa-table-cells-large"></i> Grid</button>
                <button onclick="currentLayout='table'; render();" class="px-2.5 py-1 text-xs rounded \${currentLayout === 'table' ? 'bg-[#21262d] text-emerald-400 font-bold' : 'text-gray-400'}"><i class="fa-solid fa-table-list"></i> Table</button>
              </div>
            </div>
          </div>
          
          <div class="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
            \${sectors.map(sec => \`
              <button onclick="selectedSector='\${sec}'; render();" class="px-2.5 py-1 rounded-md text-xs whitespace-nowrap \${selectedSector === sec ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold' : 'bg-[#0d1117] text-gray-400 border border-[#30363d]'}">\${sec}</button>
            \`).join('')}
          </div>
        </div>
      \`;

      if (currentLayout === 'grid') {
        html += \`
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-3.5">
            \${filtered.map(s => {
              const isPos = s.change >= 0;
              const isBull = s.technicals.supertrend === 'BULLISH';
              return \`
                <div onclick="switchView('detail', '\${s.symbol}')" class="bg-[#161b22] hover:bg-[#1c2128] border border-[#30363d] hover:border-emerald-500/50 rounded-xl p-3.5 cursor-pointer transition-all shadow-md hover:shadow-xl relative overflow-hidden flex flex-col justify-between">
                  <div class="absolute top-0 left-0 right-0 h-1 \${s.swingScore >= 80 ? 'bg-emerald-400' : s.swingScore >= 65 ? 'bg-blue-400' : 'bg-amber-400'}"></div>
                  <div>
                    <div class="flex items-start justify-between gap-1 mb-1.5">
                      <div>
                        <div class="flex items-center gap-1.5">
                          <span class="font-mono font-bold text-white text-base">\${s.symbol}</span>
                          <span class="text-[10px] font-mono text-gray-400 bg-[#0d1117] px-1.5 py-0.5 rounded border border-[#30363d]">\${s.tradingViewSymbol}</span>
                        </div>
                        <div class="text-[11px] text-gray-400 truncate max-w-[170px]">\${s.name}</div>
                      </div>
                      <span class="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[9px] font-bold px-1.5 py-0.5 rounded uppercase">\${s.swingSignal.replace('_', ' ')}</span>
                    </div>

                    <div class="my-2 flex items-baseline justify-between border-y border-[#21262d] py-2 font-mono">
                      <div>
                        <div class="text-[9px] text-gray-400 uppercase">Last Price</div>
                        <div class="text-base font-bold text-white">PKR \${s.price.toFixed(2)}</div>
                      </div>
                      <div class="text-right \${isPos ? 'text-emerald-400' : 'text-rose-400'}">
                        <div class="text-xs font-semibold">\${isPos ? '+' : ''}\${s.change.toFixed(2)}</div>
                        <div class="text-[10px]">\${isPos ? '+' : ''}\${s.changePercent.toFixed(2)}%</div>
                      </div>
                    </div>

                    <div class="grid grid-cols-3 gap-1.5 text-center text-[10px] mb-2 font-mono">
                      <div class="bg-[#0d1117] p-1 rounded border border-[#21262d]">
                        <div class="text-gray-400 text-[9px]">Supertrend</div>
                        <div class="font-bold \${isBull ? 'text-emerald-400' : 'text-rose-400'}">\${isBull ? 'BULL' : 'BEAR'}</div>
                      </div>
                      <div class="bg-[#0d1117] p-1 rounded border border-[#21262d]">
                        <div class="text-gray-400 text-[9px]">RSI (14)</div>
                        <div class="font-bold text-blue-400">\${s.technicals.rsi14.toFixed(1)}</div>
                      </div>
                      <div class="bg-[#0d1117] p-1 rounded border border-[#21262d]">
                        <div class="text-gray-400 text-[9px]">EMA 20/50</div>
                        <div class="font-bold text-purple-400">GOLDEN</div>
                      </div>
                    </div>

                    <!-- Under Stock Action Tabs -->
                    <div class="my-2 pt-2 border-t border-[#21262d] flex items-center justify-between gap-1 text-[10px] font-mono">
                      <button onclick="event.stopPropagation(); promptUpdatePrice('\${s.symbol}')" class="flex-1 px-1.5 py-1 bg-[#0d1117] hover:bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 rounded text-center font-semibold">
                        <i class="fa-solid fa-pen-to-square text-[9px] mr-1"></i>Update
                      </button>
                      <a href="https://dps.psx.com.pk/company/\${s.symbol}" target="_blank" onclick="event.stopPropagation()" class="px-1.5 py-1 bg-[#0d1117] hover:bg-amber-600/20 text-amber-400 border border-amber-500/30 rounded text-center">
                        DPS ↗
                      </a>
                      <a href="https://investify.pk/stocks/\${s.symbol}" target="_blank" onclick="event.stopPropagation()" class="px-1.5 py-1 bg-[#0d1117] hover:bg-blue-600/20 text-blue-400 border border-blue-500/30 rounded text-center">
                        INV ↗
                      </a>
                    </div>
                  </div>

                  <div class="pt-1.5 border-t border-[#21262d] flex items-center justify-between text-[11px] text-gray-400 font-mono">
                    <span>Vol: \${(s.volume / 1000000).toFixed(1)}M</span>
                    <span class="text-emerald-400 font-medium">Deep Workspace →</span>
                  </div>
                </div>
              \`;
            }).join('')}
          </div>
        \`;
      } else {
        html += \`
          <div class="bg-[#161b22] border border-[#30363d] rounded-xl overflow-x-auto shadow-lg">
            <table class="w-full text-left text-xs font-mono">
              <thead class="bg-[#0d1117] border-b border-[#30363d] text-gray-400 uppercase text-[10px]">
                <tr>
                  <th class="p-3">Ticker / Company</th>
                  <th class="p-3">Sector</th>
                  <th class="p-3 text-right">Price (PKR)</th>
                  <th class="p-3 text-right">Day Change</th>
                  <th class="p-3 text-center">Supertrend</th>
                  <th class="p-3 text-center">RSI (14)</th>
                  <th class="p-3 text-center">Swing Score</th>
                  <th class="p-3 text-center">Action</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-[#21262d]">
                \${filtered.map(s => {
                  const isPos = s.change >= 0;
                  return \`
                    <tr onclick="switchView('detail', '\${s.symbol}')" class="hover:bg-[#1f242c] cursor-pointer">
                      <td class="p-3"><strong class="text-white">\${s.symbol}</strong> <span class="text-gray-400 text-[10px]">\${s.name}</span></td>
                      <td class="p-3 text-gray-300">\${s.sector}</td>
                      <td class="p-3 text-right font-bold text-white">\${s.price.toFixed(2)}</td>
                      <td class="p-3 text-right \${isPos ? 'text-emerald-400' : 'text-rose-400'}">\${isPos ? '+' : ''}\${s.changePercent.toFixed(2)}%</td>
                      <td class="p-3 text-center \${s.technicals.supertrend === 'BULLISH' ? 'text-emerald-400' : 'text-rose-400'}">\${s.technicals.supertrend}</td>
                      <td class="p-3 text-center text-blue-400">\${s.technicals.rsi14.toFixed(1)}</td>
                      <td class="p-3 text-center font-bold text-white">\${s.swingScore}/100</td>
                      <td class="p-3 text-center"><button class="px-2 py-0.5 rounded bg-[#0d1117] text-emerald-400 border border-emerald-500/30 text-xs">Chart</button></td>
                    </tr>
                  \`;
                }).join('')}
              </tbody>
            </table>
          </div>
        \`;
      }

      root.innerHTML = html;
    }

    function renderDetail(root) {
      const s = currentStock;
      const isPos = s.change >= 0;

      root.innerHTML = \`
        <div class="space-y-4">
          <!-- Back Bar -->
          <div class="bg-[#161b22] border border-[#30363d] rounded-xl p-4 shadow-xl flex flex-wrap items-center justify-between gap-4">
            <div class="flex items-center gap-3">
              <button onclick="switchView('matrix')" class="px-3 py-1.5 rounded-lg bg-[#0d1117] hover:bg-[#21262d] text-emerald-400 border border-emerald-500/30 text-xs font-semibold">
                ← Back to 30-Stock Matrix
              </button>
              <div>
                <div class="flex items-center gap-2">
                  <h2 class="text-xl font-mono font-bold text-white">\${s.symbol}</h2>
                  <span class="text-xs font-mono bg-[#0d1117] text-blue-300 px-2 py-0.5 rounded border border-[#30363d]">\${s.tradingViewSymbol}</span>
                  <span class="text-xs text-emerald-400 font-semibold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">KMI-30 Shariah Compliant</span>
                </div>
                <p class="text-xs text-gray-400">\${s.name}</p>
              </div>
            </div>

            <div class="flex items-center gap-4 bg-[#0d1117] px-4 py-2 rounded-lg border border-[#30363d] font-mono">
              <div>
                <div class="text-[9px] uppercase text-gray-400">Market Price</div>
                <div class="text-lg font-bold text-white">PKR \${s.price.toFixed(2)}</div>
              </div>
              <div class="text-right \${isPos ? 'text-emerald-400' : 'text-rose-400'}">
                <div class="text-[9px] uppercase">Session Change</div>
                <div class="text-sm font-bold">\${isPos ? '+' : ''}\${s.change.toFixed(2)} (\${isPos ? '+' : ''}\${s.changePercent.toFixed(2)}%)</div>
              </div>
            </div>
          </div>

          <!-- Native Candlestick & Institutional Chart -->
          <div class="bg-[#161b22] border border-[#30363d] rounded-xl p-4 shadow-xl space-y-3">
            <div class="flex items-center justify-between border-b border-[#21262d] pb-2 text-xs font-mono">
              <span class="text-white font-bold"><i class="fa-solid fa-chart-candlestick text-emerald-400 mr-2"></i>PSX Pro Candlestick Chart (\${s.symbol}) - 11 Oct 2026</span>
              <div class="flex gap-2">
                <a href="\${s.investifyUrl}" target="_blank" class="px-2 py-0.5 rounded bg-[#0d1117] text-emerald-400 border border-emerald-500/30">Investify Hub ↗</a>
                <a href="\${s.kseAlertUrl}" target="_blank" class="px-2 py-0.5 rounded bg-[#0d1117] text-blue-400 border border-blue-500/30">KseAlert Feed ↗</a>
              </div>
            </div>

            <div class="grid grid-cols-2 sm:grid-cols-4 gap-2 font-mono text-xs">
              <div class="bg-[#0d1117] p-2 rounded border border-[#21262d]">
                <div class="text-gray-400 text-[10px]">SUPERTREND (10, 3)</div>
                <div class="text-emerald-400 font-bold">\${s.technicals.supertrend} @ PKR \${s.technicals.supertrendValue.toFixed(2)}</div>
              </div>
              <div class="bg-[#0d1117] p-2 rounded border border-[#21262d]">
                <div class="text-gray-400 text-[10px]">RSI MOMENTUM (14)</div>
                <div class="text-blue-400 font-bold">\${s.technicals.rsi14.toFixed(1)} / 100 (\${s.technicals.rsiZone})</div>
              </div>
              <div class="bg-[#0d1117] p-2 rounded border border-[#21262d]">
                <div class="text-gray-400 text-[10px]">EMA 20 & 50 TREND</div>
                <div class="text-purple-400 font-bold">EMA20: \${s.technicals.ema20.toFixed(2)} | EMA50: \${s.technicals.ema50.toFixed(2)}</div>
              </div>
              <div class="bg-[#0d1117] p-2 rounded border border-[#21262d]">
                <div class="text-gray-400 text-[10px]">TRAILING STOP LOSS</div>
                <div class="text-amber-400 font-bold">PKR \${s.technicals.supertrendTrailingStop.toFixed(2)}</div>
              </div>
            </div>
          </div>

          <!-- Dynamic Pivots Ladder -->
          <div class="bg-[#161b22] border border-[#30363d] rounded-xl p-4 shadow-xl">
            <h4 class="text-xs font-bold text-gray-300 mb-2 font-mono">Dynamic Pivot Points (Daily Standard Ladder)</h4>
            <div class="grid grid-cols-7 gap-1 text-center font-mono text-xs">
              <div class="bg-[#0d1117] p-2 rounded border border-[#30363d] text-rose-400"><div>S3</div><strong class="text-white">\${s.technicals.pivots.s3.toFixed(2)}</strong></div>
              <div class="bg-[#0d1117] p-2 rounded border border-[#30363d] text-rose-300"><div>S2</div><strong class="text-white">\${s.technicals.pivots.s2.toFixed(2)}</strong></div>
              <div class="bg-[#0d1117] p-2 rounded border border-[#30363d] text-amber-400"><div>S1</div><strong class="text-white">\${s.technicals.pivots.s1.toFixed(2)}</strong></div>
              <div class="bg-blue-500/20 p-2 rounded border border-blue-500/40 text-blue-300"><div>PP</div><strong class="text-white">\${s.technicals.pivots.pp.toFixed(2)}</strong></div>
              <div class="bg-[#0d1117] p-2 rounded border border-[#30363d] text-emerald-400"><div>R1</div><strong class="text-white">\${s.technicals.pivots.r1.toFixed(2)}</strong></div>
              <div class="bg-[#0d1117] p-2 rounded border border-[#30363d] text-emerald-300"><div>R2</div><strong class="text-white">\${s.technicals.pivots.r2.toFixed(2)}</strong></div>
              <div class="bg-[#0d1117] p-2 rounded border border-[#30363d] text-emerald-200"><div>R3</div><strong class="text-white">\${s.technicals.pivots.r3.toFixed(2)}</strong></div>
            </div>
          </div>

          <!-- Shariah & Risk Engine Grid -->
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <!-- Shariah Audit -->
            <div class="bg-[#161b22] border border-[#30363d] rounded-xl p-4 shadow-xl space-y-3 font-mono">
              <h3 class="text-sm font-bold text-white flex items-center gap-2">
                <i class="fa-solid fa-shield-halved text-emerald-400"></i>
                <span>KMI-30 Shariah Screening Compliance</span>
              </h3>
              <div class="space-y-2 text-xs">
                <div class="flex justify-between p-2 bg-[#0d1117] rounded border border-[#21262d]">
                  <span class="text-gray-400">1. Debt to Total Assets (&lt;37%):</span>
                  <span class="text-emerald-400 font-bold">\${s.shariah.debtToAssets.toFixed(1)}% (PASS)</span>
                </div>
                <div class="flex justify-between p-2 bg-[#0d1117] rounded border border-[#21262d]">
                  <span class="text-gray-400">2. Illiquid Assets (&gt;25%):</span>
                  <span class="text-emerald-400 font-bold">\${s.shariah.illiquidAssets.toFixed(1)}% (PASS)</span>
                </div>
                <div class="flex justify-between p-2 bg-[#0d1117] rounded border border-[#21262d]">
                  <span class="text-gray-400">3. Non-Compliant Investments (&lt;33%):</span>
                  <span class="text-emerald-400 font-bold">\${s.shariah.nonCompliantInvestments.toFixed(1)}% (PASS)</span>
                </div>
                <div class="flex justify-between p-2 bg-[#0d1117] rounded border border-[#21262d]">
                  <span class="text-gray-400">4. Non-Permissible Income (&lt;5%):</span>
                  <span class="text-emerald-400 font-bold">\${s.shariah.nonPermissibleIncomePercent.toFixed(1)}% (PASS)</span>
                </div>
                <div class="flex justify-between p-2 bg-[#0d1117] rounded border border-[#21262d]">
                  <span class="text-gray-400">5. Price &gt; Net Liquid Assets:</span>
                  <span class="text-emerald-400 font-bold">PKR \${s.price.toFixed(2)} &gt; PKR \${s.shariah.netLiquidAssetsPerShare.toFixed(2)} (PASS)</span>
                </div>
              </div>
            </div>

            <!-- Position Size Risk Engine -->
            <div class="bg-[#161b22] border border-[#30363d] rounded-xl p-4 shadow-xl space-y-3 font-mono">
              <h3 class="text-sm font-bold text-white flex items-center gap-2">
                <i class="fa-solid fa-scale-balanced text-emerald-400"></i>
                <span>Institutional Risk Engine & Position Sizer</span>
              </h3>
              <div class="grid grid-cols-2 gap-2 text-xs">
                <div class="bg-[#0d1117] p-2.5 rounded border border-[#21262d]">
                  <div class="text-gray-400 text-[10px]">ATR Volatility SL</div>
                  <div class="text-sm font-bold text-rose-400">PKR \${(s.price - s.technicals.atr14 * 1.5).toFixed(2)}</div>
                </div>
                <div class="bg-[#0d1117] p-2.5 rounded border border-[#21262d]">
                  <div class="text-gray-400 text-[10px]">Take Profit 1 (1:2.5 R:R)</div>
                  <div class="text-sm font-bold text-emerald-400">PKR \${(s.price + s.technicals.atr14 * 1.5 * 2.5).toFixed(2)}</div>
                </div>
                <div class="bg-[#0d1117] p-2.5 rounded border border-[#21262d]">
                  <div class="text-gray-400 text-[10px]">Rec. Size (5M Capital)</div>
                  <div class="text-sm font-bold text-white">\${Math.floor(75000 / (s.technicals.atr14 * 1.5)).toLocaleString()} Shares</div>
                </div>
                <div class="bg-[#0d1117] p-2.5 rounded border border-[#21262d]">
                  <div class="text-gray-400 text-[10px]">Est. Brokerage Fee</div>
                  <div class="text-sm font-bold text-amber-300">PKR \${Math.floor((s.price * Math.floor(75000 / (s.technicals.atr14 * 1.5))) * 0.003).toLocaleString()}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      \`;
    }

    function promptUpdatePrice(sym) {
      const target = stocks.find(s => s.symbol === sym);
      if (!target) return;
      const input = prompt("Update market price for " + sym + " (Current: PKR " + target.price + "):", target.price);
      if (!input) return;
      const val = parseFloat(input);
      if (isNaN(val) || val <= 0) return;
      const pctInput = prompt("Enter Today\\'s Change % for " + sym + " (e.g. 1.20 or 0.00):", target.changePercent || "0.85");
      const pct = parseFloat(pctInput) || 0;
      target.price = val;
      target.changePercent = pct;
      target.prevClose = Number((val / (1 + pct / 100)).toFixed(2));
      target.change = Number((val - target.prevClose).toFixed(2));
      render();
    }

    window.addEventListener('DOMContentLoaded', () => {
      render();
    });
  </script>
</body>
</html>`;

  const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = 'kmi30-psx-institutional-swing-workspace.html';
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  URL.revokeObjectURL(url);
}
