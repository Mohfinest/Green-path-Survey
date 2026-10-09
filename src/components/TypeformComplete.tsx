import React from 'react';
import { Check } from 'lucide-react';

export const TypeformComplete: React.FC = () => {
  return (
    <div className="w-full max-w-2xl px-6 py-8 mx-auto text-left typeform-slide-forward">
      <div className="space-y-6 sm:space-y-7">
        {/* Subtle checkmark icon with forest green & solar accent */}
        <div className="w-14 h-14 rounded-2xl bg-[#144D30]/10 border border-[#144D30]/20 flex items-center justify-center text-[#144D30]">
          <Check className="w-7 h-7 stroke-[2.5]" />
        </div>

        {/* Heading */}
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#1C1E21] leading-[1.16] font-display">
          YOUR EXPERIENCE MATTERS.
        </h1>

        {/* Message */}
        <div className="space-y-4 text-base sm:text-lg text-stone-600 leading-relaxed font-normal">
          <p className="text-stone-800 font-medium">
            Thank you for sharing what you've seen and experienced in the field. Your contribution will help deepen our understanding of the workforce and operational challenges facing Nigeria's renewable energy sector.
          </p>
          <p className="text-stone-500 text-sm sm:text-base">
            This study is focused on grounding clean energy policy and workforce training in direct operational realities. Your answers are stored securely and anonymously.
          </p>
        </div>

        {/* Safe to close indication */}
        <div className="pt-4 border-t border-[#E6E3DC] flex items-center justify-between text-xs sm:text-sm text-stone-400">
          <span>Response recorded · You may safely close this tab</span>
        </div>
      </div>
    </div>
  );
};
