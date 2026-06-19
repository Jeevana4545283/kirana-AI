import ChatWidget from '@/components/ChatWidget';
import DashboardClient from '@/components/DashboardClient';
import { IndianRupee, PackageOpen, BellRing, TrendingUp, Sparkles } from 'lucide-react';

export default async function Dashboard() {
  const stats = [
    { title: "Today's Sales", value: "₹5,400", icon: <IndianRupee size={20}/>, trend: "12%", positive: true },
    { title: "Low Stock Items", value: "2", icon: <PackageOpen size={20}/>, trend: "5%", positive: false },
    { title: "Pending Orders", value: "1", icon: <BellRing size={20}/>, trend: "20%", positive: true },
    { title: "Predicted Demand", value: "High", icon: <TrendingUp size={20}/>, trend: "Stable", positive: true }
  ];

  let alerts = [];
  let forecastData = [];
  let seasonData = null;
  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
    const seasonRes = await fetch(`${baseUrl}/api/season`, { cache: 'no-store' });
    if (seasonRes.ok) {
      seasonData = await seasonRes.json();
    }

    const res = await fetch(`${baseUrl}/api/inventory`, { cache: 'no-store' });
    if (res.ok) {
      const data = await res.json();
      alerts = data.alerts || [];
    }
    
    // Fetch forecast for item 101 as an example
    const fRes = await fetch(`${baseUrl}/api/forecast/101`, { cache: 'no-store' });
    if (fRes.ok) {
      const fData = await fRes.json();
      if(fData.forecast && Array.isArray(fData.forecast)) {
         // mock historical data and attach predicted
         const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
         forecastData = fData.forecast.slice(0,7).map((f: any, i: number) => ({
           name: days[i],
           historical: i < 3 ? Math.floor(Math.random() * 20) + 10 : null,
           predicted: f.predicted_demand
         }));
      }
    }
  } catch (e) {
    console.log("Backend offline, using fallback UI.");
    alerts = [
      { product_id: 101, product_name: "Aashirvaad Atta 5kg", current_stock: 8, predicted_demand_3d: 12, status: "CRITICAL" }
    ];
  }

  return (
    <main className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8">

      <header className="mb-10 flex justify-between items-end">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">
              Dashboard
            </h1>
            <span className="px-3 py-1 bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-xs font-bold rounded-full flex items-center shadow-[0_0_15px_rgba(16,185,129,0.3)]">
              <span className="w-2 h-2 rounded-full bg-emerald-400 mr-2 animate-ping"></span> AI Active
            </span>
          </div>
          <p className="text-slate-400">Your Agentic AI Supply Chain Optimizer</p>
        </div>
      </header>

      <DashboardClient 
        initialStats={stats} 
        alerts={alerts} 
        initialForecastData={forecastData} 
        initialSeasonData={seasonData}
      />

      <ChatWidget />
    </main>
  );
}
