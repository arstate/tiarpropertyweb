import React from 'react';

/**
 * 4 USP Feature highlights bar matching Reome layout.
 * Single Responsibility: Present value propositions with left-aligned circular icons.
 */
export function UspFeatureBar() {
  const uspItems = [
    {
      title: 'DP 0% (Tanpa DP)',
      icon: (
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
        />
      ),
    },
    {
      title: 'All-In Free Biaya',
      icon: (
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7"
        />
      ),
    },
    {
      title: 'Subsidi Angsuran 1,4 Jt',
      icon: (
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
        />
      ),
    },
    {
      title: 'Kawal KPR 100% ACC',
      icon: (
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      ),
    },
  ];

  return (
    <div className="flex items-center gap-1.5 sm:gap-2 md:gap-1.5 lg:gap-2 xl:gap-3 overflow-x-auto no-scrollbar py-0.5 justify-start md:justify-center px-0.5 md:px-0">
      {uspItems.map((item, index) => (
        <div
          key={index}
          className="bg-white/95 backdrop-blur-sm rounded-full shadow-[0_2px_10px_rgba(8,22,19,0.04)] px-2.5 sm:px-3 md:px-2.5 lg:px-3 xl:px-4 py-1 sm:py-1.5 md:py-1 lg:py-1.5 xl:py-2 border border-[#dde8e2] flex items-center gap-1.5 sm:gap-2 md:gap-1.5 lg:gap-2 xl:gap-2.5 hover:border-[#3a6356]/40 transition-all hover:shadow-md shrink-0"
        >
          <div className="w-4 h-4 sm:w-4.5 sm:h-4.5 md:w-4 md:h-4 lg:w-4.5 lg:h-4.5 xl:w-5 xl:h-5 rounded-full bg-[#f7faf8] border border-[#dde8e2] flex items-center justify-center text-[#3a6356] shrink-0">
            <svg className="w-2.5 h-2.5 sm:w-2.5 sm:h-2.5 md:w-2.5 md:h-2.5 lg:w-2.5 lg:h-2.5 xl:w-3 xl:h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {item.icon}
            </svg>
          </div>
          <span className="text-[11px] sm:text-xs md:text-[11px] lg:text-xs xl:text-[13px] font-bold text-[#081613] tracking-tight whitespace-nowrap">
            {item.title}
          </span>
        </div>
      ))}
    </div>
  );
}
