'use client';
import { motion } from 'framer-motion';
import { Sparkles, AlertTriangle, Truck } from 'lucide-react';

export default function InsightsPanel() {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const item = {
    hidden: { opacity: 0, x: 20 },
    show: { opacity: 1, x: 0, transition: { type: "spring" } }
  };

  return (
    <div className="glass p-6">
      <div className="flex items-center gap-2 mb-6">
        <Sparkles className="text-purple-400" size={24} />
        <h3 className="text-xl font-bold text-white">AI Insights</h3>
      </div>
      
      <motion.div variants={container} initial="hidden" animate="show" className="space-y-4">
        
        {/* Insight 1 */}
        <motion.div variants={item} className="p-4 rounded-xl bg-purple-500/10 border border-purple-500/20 flex gap-4">
          <div className="w-2 h-full bg-purple-500 rounded-full shrink-0"></div>
          <div>
            <h4 className="text-purple-300 font-semibold text-sm mb-1">Festival Alert: Diwali</h4>
            <p className="text-slate-300 text-xs leading-relaxed">Demand for Sugar and Ghee is predicted to spike by 40% next week. Suggesting early procurement.</p>
          </div>
        </motion.div>

        {/* Insight 2 */}
        <motion.div variants={item} className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex gap-4">
          <div className="w-2 h-full bg-emerald-500 rounded-full shrink-0"></div>
          <div>
            <h4 className="text-emerald-400 font-semibold text-sm mb-1 flex items-center gap-2"><Truck size={14}/> Supplier Optimization</h4>
            <p className="text-slate-300 text-xs leading-relaxed">Switched 3 pending orders to Raju Wholesale saving ₹450 with faster delivery.</p>
          </div>
        </motion.div>

        {/* Insight 3 */}
        <motion.div variants={item} className="p-4 rounded-xl bg-yellow-500/10 border border-yellow-500/20 flex gap-4">
          <div className="w-2 h-full bg-yellow-500 rounded-full shrink-0"></div>
          <div>
            <h4 className="text-yellow-400 font-semibold text-sm mb-1 flex items-center gap-2"><AlertTriangle size={14}/> Demand Spike Warning</h4>
            <p className="text-slate-300 text-xs leading-relaxed">Maggi 70g sales are up 20% today due to local weather (rain). Stock depletion imminent.</p>
          </div>
        </motion.div>

      </motion.div>
    </div>
  );
}
