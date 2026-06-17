'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { ShoppingCart, AlertOctagon, AlertTriangle } from 'lucide-react';

export default function AlertsPanel({ alerts }: { alerts: any[] }) {
  const [ordering, setOrdering] = useState<number | null>(null);

  const handleOrder = (productId: number, productName: string) => {
    setOrdering(productId);
    
    // Show toast message
    toast.success("Opening WhatsApp with pre-filled order message...", { duration: 3000 });
    
    // WhatsApp Click-to-Chat
    const phone = "+918074362695";
    const message = `Hello, I would like to place an order.\n\nProduct: ${productName}\nQuantity: 50 packs\nExpected Delivery: ASAP\n\nPlease confirm availability.`;
    const whatsappUrl = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
    
    // Open in new tab
    window.open(whatsappUrl, "_blank");
    
    setTimeout(() => {
      setOrdering(null);
    }, 1000);
  };

  if (!alerts || alerts.length === 0) return (
    <div className="glass p-6 h-full flex flex-col justify-center items-center text-center">
      <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mb-4">
        <span className="text-2xl">✨</span>
      </div>
      <h3 className="text-xl font-bold text-white mb-2">Stock Levels Healthy</h3>
      <p className="text-slate-400 text-sm">No critical items detected. You're fully stocked.</p>
    </div>
  );

  return (
    <div className="glass p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-white flex items-center gap-2">
          <AlertOctagon className="text-red-400" /> Action Required
        </h3>
        <span className="px-3 py-1 bg-red-500/20 text-red-400 text-xs font-bold rounded-full">
          {alerts.length} Alerts
        </span>
      </div>

      <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2">
        {alerts.map((alert, idx) => (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            key={idx} 
            className="p-4 rounded-xl glass-dark flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-l-4 border-l-red-500 hover:bg-white/5 transition-colors"
          >
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h4 className="text-white font-bold">{alert.product_name}</h4>
                <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-sm ${alert.status === 'CRITICAL' ? 'bg-red-500/20 text-red-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                  {alert.status}
                </span>
              </div>
              <p className="text-xs text-slate-400 flex items-center gap-3">
                <span>Stock: <strong className="text-white">{alert.current_stock}</strong></span>
                <span>Demand (3d): <strong className="text-blue-400">{alert.predicted_demand_3d}</strong></span>
              </p>
            </div>
            
            <button
              onClick={() => handleOrder(alert.product_id, alert.product_name)}
              disabled={ordering === alert.product_id}
              className="w-full sm:w-auto px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white rounded-lg transition-all font-medium text-sm flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed group"
            >
              <ShoppingCart size={16} className="group-hover:animate-bounce" />
              {ordering === alert.product_id ? 'Routing...' : '1-Click Reorder'}
            </button>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
