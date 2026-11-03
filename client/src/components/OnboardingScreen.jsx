import React from 'react';
import StatusBar from './StatusBar';

export default function OnboardingScreen({ onGetStarted }) {
  return (
    <div className="flex flex-col h-full w-full bg-[#3B5DF7] relative overflow-hidden select-none">
      {/* Status Bar */}
      <StatusBar dark={true} />

      {/* Top Graphic Section with Chevron Wave Motifs */}
      <div className="flex-1 relative flex items-center justify-center p-8 overflow-hidden">
        {/* Subtle decorative circles */}
        <div className="absolute -top-10 -right-10 w-48 h-48 rounded-full bg-white/10 blur-xl"></div>
        <div className="absolute bottom-10 -left-10 w-40 h-40 rounded-full bg-blue-400/20 blur-lg"></div>

        {/* Chevron Zig-Zag Wave Icon - Top Left */}
        <div className="absolute top-16 left-8 text-white/30">
          <svg width="80" height="60" viewBox="0 0 90 70" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 20 L25 5 L45 20 L65 5 L85 20" opacity="0.9" />
            <path d="M5 38 L25 23 L45 38 L65 23 L85 38" opacity="0.6" />
            <path d="M5 56 L25 41 L45 56 L65 41 L85 56" opacity="0.3" />
          </svg>
        </div>

        {/* Chevron Zig-Zag Wave Icon - Bottom Right */}
        <div className="absolute bottom-12 right-8 text-white/30">
          <svg width="100" height="75" viewBox="0 0 90 70" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 20 L25 5 L45 20 L65 5 L85 20" opacity="0.9" />
            <path d="M5 38 L25 23 L45 38 L65 23 L85 38" opacity="0.6" />
            <path d="M5 56 L25 41 L45 56 L65 41 L85 56" opacity="0.3" />
          </svg>
        </div>

        {/* Center Illustration Badge */}
        <div className="relative z-10 w-32 h-32 rounded-3xl bg-white/15 backdrop-blur-md border border-white/20 flex items-center justify-center shadow-2xl">
          <svg className="w-16 h-16 text-white drop-shadow-md" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 11l3 3L22 4" />
            <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
          </svg>
        </div>
      </div>

      {/* Bottom Sheet Card */}
      <div className="bg-white rounded-t-[32px] px-8 pt-8 pb-10 shadow-2xl flex flex-col justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight leading-snug">
            Manage What To Do
          </h1>
          <p className="mt-3 text-sm text-slate-500 leading-relaxed max-w-xs">
            The best way to manage what you have to do, don't forget your plans
          </p>
        </div>

        <div className="mt-8">
          <button
            onClick={onGetStarted}
            className="w-full py-4 bg-[#3B5DF7] hover:bg-[#2F4FE0] active:scale-[0.98] transition-all text-white font-semibold text-base rounded-2xl shadow-lg shadow-blue-500/25 flex items-center justify-center"
          >
            Get Started
          </button>
        </div>
      </div>
    </div>
  );
}
