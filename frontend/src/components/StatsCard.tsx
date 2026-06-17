'use client';
import { motion } from 'framer-motion';

export default function StatsCard({ title, value, icon, trend, positive }: { title: string, value: string | number, icon: React.ReactNode, trend: string, positive: boolean }) {
  return (
    <motion.div 
      whileHover={{ scale: 1.02, y: -5 }}
      transition={{ type: "spring", stiffness: 300 }}
      className="glass p-6 relative overflow-hidden group"
    >
      <div className="absolute -right-4 -top-4 w-24 h-24 bg-blue-500/10 rounded-full blur-2xl group-hover:bg-blue-500/20 transition-all"></div>
      
      <div className="flex items-center justify-between mb-4 relative z-10">
        <h3 className="text-slate-300 text-sm font-medium">{title}</h3>
        <div className="text-blue-400 p-2 bg-blue-500/10 rounded-lg">
          {icon}
        </div>
      </div>
      
      <div className="relative z-10">
        <p className="text-3xl font-bold text-white mb-2">{value}</p>
        <p className={`text-xs font-medium flex items-center ${positive ? 'text-emerald-400' : 'text-red-400'}`}>
          <span className="mr-1">{positive ? '↑' : '↓'}</span>
          {trend} from last week
        </p>
      </div>
    </motion.div>
  );
}
