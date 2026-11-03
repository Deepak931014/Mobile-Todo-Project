import React from 'react';
import { Smartphone, Monitor, RotateCcw } from 'lucide-react';

export default function MobileFrame({
  children,
  onResetData,
  isPhoneFrame = true,
  onToggleFrameMode,
}) {
  return (
    <div
      className={`w-full font-sans select-none transition-colors duration-300 ${
        isPhoneFrame
          ? 'h-[100dvh] sm:min-h-screen bg-white sm:bg-gradient-to-br sm:from-slate-900 sm:via-slate-800 sm:to-indigo-950 flex flex-col items-center justify-start sm:justify-center p-0 sm:p-6 overflow-hidden'
          : 'min-h-screen bg-slate-100 flex flex-col items-center justify-start p-0 overflow-y-auto'
      }`}
    >
      {/* Top Desktop Controls Toolbar (visible on screens >= sm) */}
      <header
        className={`hidden sm:flex items-center justify-between w-full transition-all duration-300 ${
          isPhoneFrame
            ? 'max-w-4xl mb-4 px-4 py-2.5 bg-white/10 backdrop-blur-md rounded-2xl border border-white/10 text-white shadow-xl'
            : 'max-w-6xl mt-4 mb-4 px-6 py-3 bg-white rounded-2xl border border-slate-200 text-slate-800 shadow-sm'
        }`}
      >
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-xl bg-[#3B5DF7] flex items-center justify-center font-bold text-white shadow-md text-sm">
            ✓
          </div>
          <div>
            <h1 className={`text-sm font-bold leading-none tracking-tight ${isPhoneFrame ? 'text-white' : 'text-slate-900'}`}>
              TaskFlow
            </h1>
            <span className={`text-[10px] ${isPhoneFrame ? 'text-blue-200' : 'text-slate-500'}`}>
              SDE-1 Mobile To-Do Assignment
            </span>
          </div>
        </div>

        {/* View Switcher and Demo Reset */}
        <div className="flex items-center space-x-2.5">
          <button
            onClick={onResetData}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs transition active:scale-95 ${
              isPhoneFrame
                ? 'bg-white/10 hover:bg-white/20 text-white'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
            title="Reload initial Figma mock tasks"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Demo Tasks</span>
          </button>

          <button
            onClick={onToggleFrameMode}
            className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl bg-[#3B5DF7] hover:bg-blue-600 text-xs font-semibold text-white shadow-sm transition active:scale-95"
            title={isPhoneFrame ? 'Switch to Full Laptop Screen' : 'Switch to Mobile Mockup Frame'}
          >
            {isPhoneFrame ? (
              <>
                <Monitor className="w-3.5 h-3.5" />
                <span>Full Responsive (Laptop)</span>
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

      {/* Frame Container */}
      {isPhoneFrame ? (
        // Phone Mockup Mode (Centered iPhone 15 frame on desktop, 100% on actual mobile)
        <div className="w-full h-full sm:w-[412px] sm:h-[844px] sm:max-h-[92vh] flex justify-center flex-shrink-0">
          <div className="w-full h-full bg-white relative flex flex-col overflow-hidden sm:rounded-[44px] sm:border-[8px] sm:border-slate-800 sm:shadow-2xl sm:ring-1 sm:ring-white/20">
            {/* Hardware Dynamic Island Notch (desktop mockup only) */}
            <div className="hidden sm:flex absolute top-3 inset-x-0 justify-center z-40 pointer-events-none">
              <div className="w-24 h-4 bg-slate-900 rounded-full flex items-center justify-end pr-2 space-x-1">
                <span className="w-2 h-2 rounded-full bg-blue-900/60"></span>
              </div>
            </div>

            {/* Inner App Container with min-h-0 to ensure smooth child scrolling */}
            <div className="w-full h-full min-h-0 flex flex-col overflow-hidden">
              {children}
            </div>

            {/* Bottom Home Indicator Bar (desktop mockup only) */}
            <div className="hidden sm:flex w-full h-4 bg-transparent items-center justify-center pointer-events-none absolute bottom-1 inset-x-0 z-30">
              <div className="w-32 h-1 bg-slate-300 rounded-full"></div>
            </div>
          </div>
        </div>
      ) : (
        // Full Responsive Mode (Expands across full laptop screen with smooth natural page scrolling)
        <div className="w-full max-w-6xl px-4 sm:px-6 pb-12 min-h-0 flex-1 flex flex-col">
          <div className="w-full bg-white rounded-3xl shadow-sm border border-slate-200/80 overflow-hidden flex flex-col min-h-[82vh]">
            {children}
          </div>
        </div>
      )}
    </div>
  );
}
