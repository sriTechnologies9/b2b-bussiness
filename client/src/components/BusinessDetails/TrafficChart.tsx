import React, { useState } from 'react';
import { TrendingUp } from 'lucide-react';

export const TrafficChart: React.FC = () => {
  const [selectedDay, setSelectedDay] = useState<'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri' | 'Sat' | 'Sun'>('Mon');

  // Traffic density levels (0-100) for hours 9 AM to 8 PM
  const trafficData: Record<string, number[]> = {
    Mon: [15, 25, 45, 60, 75, 80, 70, 50, 40, 30, 20, 10],
    Tue: [20, 30, 50, 65, 70, 75, 65, 55, 45, 35, 25, 15],
    Wed: [18, 28, 48, 62, 72, 78, 68, 52, 42, 32, 22, 12],
    Thu: [22, 32, 52, 68, 74, 82, 72, 58, 48, 38, 28, 18],
    Fri: [25, 40, 65, 85, 90, 95, 85, 75, 60, 45, 30, 20],
    Sat: [30, 55, 80, 95, 100, 95, 90, 85, 70, 50, 35, 25],
    Sun: [10, 20, 35, 45, 50, 45, 40, 35, 25, 15, 10, 5]
  };

  const hoursList = [
    "9 AM", "10 AM", "11 AM", "12 PM", "1 PM", "2 PM",
    "3 PM", "4 PM", "5 PM", "6 PM", "7 PM", "8 PM"
  ];

  const currentHour = new Date().getHours();

  const isTodaySelected = () => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    return days[new Date().getDay()] === selectedDay;
  };

  const activeTraffic = trafficData[selectedDay];

  return (
    <div className="rounded-none border border-slate-200 bg-white p-6 md:p-8 text-left space-y-6 shadow-glass-sm mt-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-150 pb-4 gap-4">
        <div className="space-y-1">
          <h3 className="text-lg font-black text-slate-900 flex items-center space-x-2">
            <TrendingUp className="w-5 h-5 text-indigo-650" />
            <span>Popular Times & storefront Traffic</span>
          </h3>
          <p className="text-2xs text-slate-450 font-semibold font-sans">Storefront visitor traffic density and communication response peaks.</p>
        </div>

        {/* Day Selectors */}
        <div className="flex flex-wrap gap-1">
          {(['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] as const).map(day => (
            <button
              key={day}
              type="button"
              onClick={() => setSelectedDay(day)}
              className={`px-2 py-1 text-3xs font-extrabold transition-all border uppercase ${selectedDay === day
                ? 'bg-indigo-650 border-indigo-650 text-white shadow-2xs'
                : 'bg-slate-50 border-slate-200 text-slate-550 hover:bg-slate-100'
                }`}
            >
              {day}
            </button>
          ))}
        </div>
      </div>

      {/* Chart Bars */}
      <div className="space-y-5">
        <div className="flex items-end justify-between h-36 pt-4 border-b border-slate-100 px-1 gap-1.5 sm:gap-2 overflow-x-auto select-none">
          {activeTraffic.map((val, idx) => {
            const hourText = hoursList[idx];
            const hrNum = 9 + idx; // 9 AM is 9, 8 PM is 20
            const isLive = isTodaySelected() && currentHour === hrNum;

            return (
              <div key={idx} className="flex flex-col items-center flex-grow min-w-[20px] group relative">
                {/* Hover Tooltip */}
                <div className="absolute bottom-full mb-1 bg-slate-900 text-white text-[8px] font-bold px-1.5 py-0.5 rounded-sm opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10 shadow">
                  {isLive ? "LIVE: " : ""}{val}% busy
                </div>

                {/* Vertical Bar */}
                <div className="w-full bg-slate-100 rounded-t-sm h-28 flex items-end">
                  <div
                    className={`w-full rounded-t-sm transition-all duration-700 ${isLive
                      ? 'bg-rose-500 animate-pulse'
                      : 'bg-indigo-600 group-hover:bg-indigo-500'
                      }`}
                    style={{ height: `${val}%` }}
                  ></div>
                </div>

                {/* Label */}
                <span className={`text-[8px] font-black uppercase tracking-wider mt-2 whitespace-nowrap ${isLive ? 'text-rose-600 font-black' : 'text-slate-400 font-bold'
                  }`}>
                  {isLive ? "Live" : hourText}
                </span>
              </div>
            );
          })}
        </div>

        {/* Summary text */}
        <div className="flex items-start space-x-2 text-2xs text-slate-500 leading-normal font-semibold">
          <span className="inline-block w-2.5 h-2.5 bg-rose-500 rounded-full mt-0.5 shrink-0 animate-ping"></span>
          <p>
            Showing visitor volume for <strong className="text-slate-900 uppercase">{selectedDay}</strong>.
            {selectedDay === 'Sat' || selectedDay === 'Fri'
              ? " Typically busiest between 12 PM and 4 PM. High response delays might occur."
              : " Normal traffic levels. Average lead response is under 15 minutes."}
          </p>
        </div>
      </div>
    </div>
  );
};
