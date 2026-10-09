import React, { useEffect } from 'react';
import { ArrowRight, Clock, ShieldCheck, Zap } from 'lucide-react';

interface TypeformWelcomeProps {
  onStart: () => void;
  hasSavedDraft?: boolean;
}

export const TypeformWelcome: React.FC<TypeformWelcomeProps> = ({
  onStart,
  hasSavedDraft = false,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        onStart();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onStart]);

  return (
    <div className="fixed inset-0 w-full h-full overflow-y-auto overflow-x-hidden flex flex-col justify-center items-center p-3 sm:p-6 md:p-8 z-30">
      {/* Full-Page Background Aerial Forest Image - 100% visible & sharp */}
      <img
        src="/src/assets/images/greenpath_forest_banner_1791585835081.jpg"
        alt="Aerial view of road through forest canopy"
        className="fixed inset-0 w-full h-full object-cover object-center select-none pointer-events-none -z-20"
        referrerPolicy="no-referrer"
      />

      {/* Very subtle ambient tint for text legibility without obscuring the photography */}
      <div className="fixed inset-0 bg-black/20 bg-gradient-to-t from-black/50 via-transparent to-black/30 select-none pointer-events-none -z-10" />

      {/* Transparent Framed Container (Matches reference: no blur, 100% see-through) */}
      <div className="w-full max-w-5xl my-auto rounded-2xl sm:rounded-3xl border border-white/40 sm:border-white/50 bg-transparent p-5 sm:p-10 md:p-12 flex flex-col justify-between min-h-[560px] sm:min-h-[640px] text-white typeform-slide-forward relative shadow-2xl">
        
        {/* Top Navigation & Meta Header inside Frame */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-5 sm:pb-6 border-b border-white/25">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-[#E5A93C] text-black flex items-center justify-center font-bold shadow-md">
              <Zap className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-black stroke-black" />
            </div>
            <div>
              <span className="font-display font-bold tracking-tight text-sm sm:text-base text-white block leading-none drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]">
                GreenPath Survey
              </span>
              <span className="text-[10px] sm:text-xs font-mono uppercase tracking-wider text-white/80 block mt-0.5 drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
                Nigeria Clean Energy Research
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 text-xs sm:text-sm font-medium text-white">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/30 border border-white/30 text-white text-xs drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#E5A93C]" />
              Field Experience Study
            </span>
            <span className="hidden md:inline-block text-white/80 font-mono text-xs drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
              Placement Cohort
            </span>
          </div>
        </div>

        {/* Center Main Hero Typography & Call-To-Action directly on image */}
        <div className="py-8 sm:py-12 space-y-6 max-w-3xl">
          <div className="space-y-3">
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-[1.12] font-display drop-shadow-[0_2px_8px_rgba(0,0,0,0.85)]">
              Inside Nigeria's Renewable Energy Workforce.
            </h1>
            
            <p className="text-base sm:text-xl font-medium text-[#FBBF24] tracking-wide drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]">
              A 12-Month Field Experience Study
            </p>

            <p className="text-sm sm:text-lg text-white/90 font-normal leading-relaxed max-w-2xl drop-shadow-[0_2px_5px_rgba(0,0,0,0.85)]">
              Understanding the people, challenges and operational realities behind clean energy deployment.
            </p>
          </div>

          {/* Action Button styled as translucent pill button with circle icon */}
          <div className="pt-2 flex flex-wrap items-center gap-4">
            <button
              type="button"
              onClick={onStart}
              className="group pl-6 pr-2.5 py-2.5 rounded-full bg-black/45 hover:bg-black/65 active:scale-[0.98] border border-white/40 hover:border-white/70 text-white font-medium text-sm sm:text-base transition-all shadow-xl inline-flex items-center gap-4 cursor-pointer backdrop-blur-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E5A93C]"
            >
              <span className="drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
                {hasSavedDraft ? 'Continue Your Experience' : 'Share Your Experience'}
              </span>
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#E5A93C] text-black flex items-center justify-center transition-transform group-hover:translate-x-0.5 shadow-md">
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.5]" />
              </div>
            </button>

            <span className="text-xs text-white/80 hidden sm:inline-block font-mono drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)]">
              press <strong className="text-white font-bold">Enter ↵</strong>
            </span>
          </div>
        </div>

        {/* Bottom Context & Participation Details directly on image */}
        <div className="pt-5 sm:pt-6 border-t border-white/25 flex flex-col md:flex-row md:items-end justify-between gap-4 text-xs sm:text-sm text-white/85">
          <p className="max-w-xl leading-relaxed drop-shadow-[0_1px_3px_rgba(0,0,0,0.85)]">
            An exploratory study of workforce, technician and operational challenges experienced during RESCO placements. All submissions are confidential and voluntary.
          </p>

          <div className="flex flex-wrap items-center gap-4 shrink-0 font-mono text-[11px] sm:text-xs text-white/80">
            <span className="inline-flex items-center gap-1.5 drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
              <Clock className="w-3.5 h-3.5 text-[#E5A93C]" />
              ~7–10 Mins
            </span>
            <span className="inline-flex items-center gap-1.5 drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
              <ShieldCheck className="w-3.5 h-3.5 text-[#E5A93C]" />
              Strictly Anonymous
            </span>
          </div>
        </div>

      </div>
    </div>
  );
};
