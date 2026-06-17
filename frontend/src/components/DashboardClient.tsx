'use client';

import { useState } from 'react';
import StatsCard from '@/components/StatsCard';
import AlertsPanel from '@/components/AlertsPanel';
import ForecastChart from '@/components/ForecastChart';
import InsightsPanel from '@/components/InsightsPanel';
import { IndianRupee, PackageOpen, BellRing, TrendingUp, Calendar, BrainCircuit } from 'lucide-react';
import toast from 'react-hot-toast';

export default function DashboardClient({ 
  initialStats, 
  alerts, 
  initialForecastData,
  initialSeasonData
}: { 
  initialStats: any[];
  alerts: any[];
  initialForecastData: any[];
  initialSeasonData?: any;
}) {
  const [dateRange, setDateRange] = useState('Last 7 Days');

  const handleWhatsAppOrder = (productName: string, qty: string) => {
    toast.success("Opening WhatsApp with pre-filled order message...", { duration: 3000 });
    const phone = "+918074362695";
    const message = `Hello, I would like to place an order.\n\nProduct: ${productName}\nQuantity: ${qty}\nExpected Delivery: ASAP\n\nPlease confirm availability.`;
    const whatsappUrl = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank");
  };

  // Simulation logic for date range
  const getSimulatedData = () => {
    let multiplier = 1;
    
    switch(dateRange) {
      case 'Today':
        multiplier = 0.15;
        break;
      case 'Yesterday':
        multiplier = 0.14;
        break;
      case 'Last 7 Days':
        multiplier = 1;
        break;
      case 'Last 30 Days':
        multiplier = 4.2;
        break;
      case 'Custom Range':
        multiplier = 2.5; // Arbitrary for demo
        break;
    }

    const newStats = initialStats.map(stat => {
      if (stat.title === "Today's Sales") {
        const baseValue = 5400;
        return { 
          ...stat, 
          title: dateRange === 'Last 7 Days' ? "7-Day Sales" : 
                 dateRange === 'Last 30 Days' ? "30-Day Sales" : 
                 dateRange === 'Custom Range' ? "Custom Range Sales" : `${dateRange}'s Sales`,
          value: `₹${Math.floor(baseValue * multiplier).toLocaleString()}` 
        };
      }
      return stat;
    });

    const newForecastData = initialForecastData.map(d => ({
      ...d,
      historical: d.historical !== null ? Math.floor(d.historical * (multiplier > 1 ? multiplier / 4 : 1)) : null,
      predicted: d.predicted !== null ? Math.floor(d.predicted * (multiplier > 1 ? multiplier / 4 : 1)) : null
    }));

    return { newStats, newForecastData };
  };

  const { newStats, newForecastData } = getSimulatedData();

  return (
    <>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
        <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0 hide-scrollbar">
          {['Today', 'Yesterday', 'Last 7 Days', 'Last 30 Days', 'Custom Range'].map((range) => (
            <button
              key={range}
              onClick={() => setDateRange(range)}
              className={`whitespace-nowrap px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                dateRange === range 
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30 border border-blue-500' 
                  : 'bg-slate-800/50 text-slate-300 border border-slate-700 hover:bg-slate-700/50'
              }`}
            >
              {range === 'Custom Range' ? (
                <span className="flex items-center gap-2">
                  <Calendar size={14} /> Custom
                </span>
              ) : range}
            </button>
          ))}
        </div>
      </div>

      {/* Top Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
        {newStats.map((s, i) => (
          <StatsCard key={i} title={s.title} value={s.value} icon={s.icon} trend={s.trend} positive={s.positive} />
        ))}
      </div>

      {/* Dynamic Seasonal/Festival Demand Spike Cards */}
      {initialSeasonData && (
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <h2 className="text-xl font-bold text-white">
              {initialSeasonData.upcoming_festival 
                ? `Upcoming Event: ${initialSeasonData.upcoming_festival} (${initialSeasonData.festival_days_away} days)` 
                : `Current Season: ${initialSeasonData.current_season}`}
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {(initialSeasonData.upcoming_festival ? initialSeasonData.festival_products : initialSeasonData.season_products).map((product: any, idx: number) => {
              const colors = [
                { bg: "from-orange-500/20 to-red-500/20", border: "border-orange-500/30", text: "text-orange-400", btn: "bg-orange-600 hover:bg-orange-500", badge: "bg-orange-500/20 text-orange-400" },
                { bg: "from-yellow-500/20 to-amber-500/20", border: "border-yellow-500/30", text: "text-yellow-400", btn: "bg-yellow-600 hover:bg-yellow-500", badge: "bg-yellow-500/20 text-yellow-400" },
                { bg: "from-emerald-500/20 to-teal-500/20", border: "border-emerald-500/30", text: "text-emerald-400", btn: "bg-emerald-600 hover:bg-emerald-500", badge: "bg-emerald-500/20 text-emerald-400" }
              ];
              const theme = colors[idx % colors.length];
              
              return (
                <div key={idx} className={`bg-gradient-to-br ${theme.bg} border ${theme.border} rounded-xl p-5 shadow-lg`}>
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-white font-bold text-lg flex items-center gap-2">
                      <TrendingUp size={18} className={theme.text}/> {product.name}
                    </h3>
                    <span className={`${theme.badge} text-xs px-2 py-1 rounded font-bold uppercase tracking-wide animate-pulse`}>
                      {initialSeasonData.upcoming_festival ? 'Festival Alert' : 'Season Alert'}
                    </span>
                  </div>
                  <p className="text-slate-300 text-sm mb-3">
                    Demand Spike: <span className={`${theme.text} font-bold`}>+{product.spike_percent}%</span><br/>
                    Recommended Stock Increase: <span className="text-white">+{product.recommended_qty}</span>
                  </p>
                  <button 
                    onClick={() => handleWhatsAppOrder(product.name, product.recommended_qty)}
                    className={`w-full ${theme.btn} text-white font-medium py-2 rounded-lg transition-colors text-sm`}
                  >
                    Auto-Reorder {product.recommended_qty}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 mb-8">
        {/* Left Column */}
        <div className="xl:col-span-2 space-y-8">
          
          {/* AI Insight Context Panel */}
          <div className="bg-gradient-to-r from-slate-900 to-slate-800 border border-slate-700 rounded-xl p-4 flex items-start gap-4 shadow-lg">
            <div className="p-3 bg-blue-500/20 rounded-lg border border-blue-500/30">
              <BrainCircuit className="text-blue-400" size={24} />
            </div>
            <div>
              <h4 className="text-white font-semibold flex items-center gap-2 mb-1">
                AI Analysis Context <span className="px-2 py-0.5 text-[10px] bg-blue-500/20 text-blue-300 rounded uppercase font-bold tracking-wider">Active</span>
              </h4>
              <p className="text-slate-300 text-sm leading-relaxed">
                {initialSeasonData?.upcoming_festival 
                  ? `Seasonal Intelligence Agent detected upcoming ${initialSeasonData.upcoming_festival} demand patterns using historical sales + festival context.`
                  : `Seasonal Intelligence Agent detected active ${initialSeasonData?.current_season || 'Summer'} demand patterns using historical sales + seasonal context.`
                }
              </p>
            </div>
          </div>

          <ForecastChart data={newForecastData} />
          <AlertsPanel alerts={alerts} />
        </div>

        {/* Right Column */}
        <div className="space-y-8">
          <InsightsPanel />
        </div>
      </div>
    </>
  );
}
