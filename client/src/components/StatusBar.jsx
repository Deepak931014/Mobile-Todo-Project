import React, { useState, useEffect } from 'react';
import { Wifi, Battery } from 'lucide-react';

export default function StatusBar({ dark = false }) {
  const [time, setTime] = useState('9:41');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      let hours = now.getHours();
      const minutes = String(now.getMinutes()).padStart(2, '0');
      setTime(`${hours % 12 || 12}:${minutes}`);
    };
    updateTime();
    const timer = setInterval(updateTime, 30000);
    return () => clearInterval(timer);
  }, []);

  const textColor = dark ? 'text-white' : 'text-slate-900';

  return (
    <div className={`w-full px-7 pt-3 pb-2 flex items-center justify-between text-xs font-semibold select-none z-30 transition-colors ${textColor}`}>
      <span className="tracking-tight">{time}</span>
      <div className="flex items-center space-x-1.5">
        {/* Signal Bars */}
        <div className="flex items-end space-x-0.5 h-3">
          <span className="w-0.5 h-1.5 bg-current rounded-full"></span>
          <span className="w-0.5 h-2 bg-current rounded-full"></span>
          <span className="w-0.5 h-2.5 bg-current rounded-full"></span>
          <span className="w-0.5 h-3 bg-current rounded-full"></span>
        </div>
        <Wifi className="w-3.5 h-3.5" />
        <Battery className="w-4 h-4" />
      </div>
    </div>
  );
}
