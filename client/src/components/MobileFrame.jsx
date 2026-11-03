import React, { useState } from 'react';
import { Smartphone, Monitor, RotateCcw } from 'lucide-react';

export default function MobileFrame({ children, onResetData }) {
  const [frameMode, setFrameMode] = useState(true);

  return (
    <div className="w-full h-[100dvh] sm:min-h-screen bg-white sm:bg-gradient-to-br sm:from-slate-900 sm:via-slate-800 sm:to-indigo-950 flex flex-col items-center justify-start sm:justify-center p-0 sm:p-6 select-none font-sans overflow-hidden">
      {/* Top Desktop Controls Toolbar (only visible on desktop sm screens) */}
      <header className="hidden sm:flex items-center justify-between w-full max-w-4xl mb-4 px-4 py-2.5 bg-white/10 backdrop-blur-md rounded-2xl border border-white/10 text-white shadow-xl">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-xl bg-[#3B5DF7] flex items-center justify-center font-bold text-white shadow-md text-sm">
            ✓
          </div>
          <div>
            <h1 className="text-sm font-bold leading-none tracking-tight">TaskFlow</h1>
            <span className="text-[10px] text-blue-200">SDE-1 Mobile To-Do Assignment</span>
          </div>
        </div>

        {/* View Switcher and Demo Reset */}
        <div className="flex items-center space-x-2.5">
          <button
            onClick={onResetData}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs text-white transition active:scale-95"
            title="Reload initial Figma mock tasks"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Demo Tasks</span>
          </button>

          <button
            onClick={() => setFrameMode(!frameMode)}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-[#3B5DF7] hover:bg-blue-600 text-xs font-semibold text-white shadow-sm transition active:scale-95"
          >
            {frameMode ? (
              <>
                <Monitor className="w-3.5 h-3.5" />
                <span>Full Responsive</span>
              </>
            ) : (
              <>
                <Smartphone className="w-3.5 h-3.5" />
                <span>Phone Frame</span>
              </>
            )}
          </button>
        </div>
      </header>

      {/* Main Container: On mobile it is 100% full viewport height and width */}
      <div
        className={`w-full h-full transition-all duration-300 flex justify-center ${
          frameMode
            ? 'sm:w-[412px] sm:h-[844px] sm:max-h-[92vh]'
            : 'sm:max-w-md sm:h-[844px]'
        }`}
      >
        <div
          className={`w-full h-full bg-white relative flex flex-col overflow-hidden transition-all duration-300 ${
            frameMode
              ? 'sm:rounded-[44px] sm:border-[8px] sm:border-slate-800 sm:shadow-2xl sm:ring-1 sm:ring-white/20'
              : 'sm:rounded-3xl sm:shadow-xl'
          }`}
        >
          {/* Hardware Dynamic Island Notch (only on desktop mockup) */}
          {frameMode && (
            <div className="hidden sm:flex absolute top-3 inset-x-0 justify-center z-40 pointer-events-none">
              <div className="w-24 h-4 bg-slate-900 rounded-full flex items-center justify-end pr-2 space-x-1">
                <span className="w-2 h-2 rounded-full bg-blue-900/60"></span>
              </div>
            </div>
          )}

          {/* Children View (Onboarding, Home, Search, Modals) */}
          <div className="w-full h-full flex flex-col overflow-hidden">
            {children}
          </div>

          {/* Bottom Home Indicator Bar (only on desktop mockup) */}
          <div className="hidden sm:flex w-full h-4 bg-transparent items-center justify-center pointer-events-none absolute bottom-1 inset-x-0 z-30">
            <div className="w-32 h-1 bg-slate-300 rounded-full"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
