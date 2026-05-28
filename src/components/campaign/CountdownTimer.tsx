import { useState, useEffect } from 'react';

interface Props {
  eventDateStr: string;
  accentColor?: string;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

function parseEventDate(dateStr: string): Date {
  const months: Record<string, number> = {
    January: 0, February: 1, March: 2, April: 3, May: 4, June: 5,
    July: 6, August: 7, September: 8, October: 9, November: 10, December: 11,
  };
  const clean = dateStr.replace(/\b(st|nd|rd|th)\b/g, '');
  const parts = clean.split(/[,\s]+/).filter(Boolean);
  const monthName = parts.find((p) => months[p] !== undefined) || 'May';
  const day = parseInt(parts.find((p) => /^\d{1,2}$/.test(p)) || '1');
  const year = parseInt(parts.find((p) => /^\d{4}$/.test(p)) || '2026');
  return new Date(year, months[monthName], day, 0, 0, 0);
}

export default function CountdownTimer({ eventDateStr, accentColor = '#f59e0b' }: Props) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [passed, setPassed] = useState(false);

  useEffect(() => {
    const target = parseEventDate(eventDateStr);

    const compute = () => {
      const diff = target.getTime() - Date.now();
      if (diff <= 0) { setPassed(true); return; }
      setTimeLeft({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((diff / (1000 * 60)) % 60),
        seconds: Math.floor((diff / 1000) % 60),
      });
    };

    compute();
    const id = setInterval(compute, 1000);
    return () => clearInterval(id);
  }, [eventDateStr]);

  if (passed) {
    return (
      <div className="text-center py-4">
        <p className="text-lg font-display font-semibold" style={{ color: accentColor }}>
          This event has passed
        </p>
      </div>
    );
  }

  const units: [keyof TimeLeft, string][] = [
    ['days', 'Days'], ['hours', 'Hrs'], ['minutes', 'Min'], ['seconds', 'Sec'],
  ];

  return (
    <div className="flex items-center justify-center gap-3">
      {units.map(([key, label]) => (
        <div key={key} className="flex flex-col items-center">
          <div
            className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl flex items-center justify-center font-mono text-xl sm:text-2xl font-bold relative overflow-hidden"
            style={{ background: accentColor + '15', border: `1px solid ${accentColor}30` }}
          >
            <span style={{ color: accentColor }}>{String(timeLeft[key]).padStart(2, '0')}</span>
          </div>
          <span className="text-xs text-ink-500 mt-1 font-medium tracking-wider uppercase">{label}</span>
        </div>
      ))}
    </div>
  );
}
