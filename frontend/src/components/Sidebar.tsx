'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { LayoutDashboard, Package, TrendingUp, Bot, Settings, LogOut } from 'lucide-react';

export default function Sidebar() {
  const router = useRouter();

  const handleLogout = (e: React.MouseEvent) => {
    e.preventDefault();
    localStorage.removeItem('isLoggedIn');
    router.push('/login');
  };

  return (
    <div className="hidden lg:flex flex-col w-64 h-screen fixed left-0 top-0 border-r border-white/10 glass z-40 p-6">
      <div className="flex items-center gap-3 mb-12">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/30">
          <span className="text-white font-bold text-xl">K</span>
        </div>
        <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
          KiranaAI
        </h1>
      </div>

      <nav className="flex-1 space-y-2">
        <NavItem icon={<LayoutDashboard size={20} />} label="Dashboard" active />
        <NavItem icon={<Package size={20} />} label="Inventory" />
        <NavItem icon={<TrendingUp size={20} />} label="Forecasts" />
        <NavItem icon={<Bot size={20} />} label="AI Agents" />
      </nav>

      <div className="mt-auto space-y-2 pt-6 border-t border-white/10">
        <NavItem icon={<Settings size={20} />} label="Settings" />
        <button 
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all text-slate-400 hover:text-white hover:bg-white/5"
        >
          <LogOut size={20} />
          <span className="font-medium text-sm">Logout</span>
        </button>
      </div>
    </div>
  );
}

function NavItem({ icon, label, active = false }: { icon: React.ReactNode; label: string; active?: boolean }) {
  return (
    <Link href="#" className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${active ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20 shadow-inner' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}>
      {icon}
      <span className="font-medium text-sm">{label}</span>
    </Link>
  );
}
