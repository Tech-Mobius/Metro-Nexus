/* eslint-disable react-refresh/only-export-components */
import type { ReactNode } from 'react';
import { LINES, type LineId } from '../lib/mockData';

const SYSTEM_FONT = 'system-ui, sans-serif';

export function GlassCard({
  children,
  className = '',
  hover = false,
}: {
  children: ReactNode;
  className?: string;
  hover?: boolean;
}) {
  return (
    <div
      className={`liquid-glass rounded-3xl ${hover ? 'transition-transform duration-300 hover:-translate-y-1' : ''} ${className}`}
    >
      {children}
    </div>
  );
}

export function LineBadge({ lineId, className = '' }: { lineId: LineId; className?: string }) {
  const line = LINES[lineId];
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] ${className}`}
      style={{ fontFamily: SYSTEM_FONT, backgroundColor: `${line.color}22`, color: line.color }}
    >
      <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: line.color }} />
      {line.name}
    </span>
  );
}

export function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <div className="liquid-glass mb-6 inline-flex rounded-full px-4 py-2">
      <span className="text-xs sm:text-sm" style={{ fontFamily: SYSTEM_FONT }}>
        {children}
      </span>
    </div>
  );
}

export function PageHeader({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow: string;
  title: ReactNode;
  subtitle?: ReactNode;
}) {
  return (
    <div className="mx-auto max-w-3xl text-center">
      <Eyebrow>{eyebrow}</Eyebrow>
      <h1 className="text-4xl leading-[1.1] text-white sm:text-5xl md:text-6xl">{title}</h1>
      {subtitle && (
        <p className="mx-auto mt-5 max-w-xl leading-relaxed text-white/70" style={{ fontFamily: SYSTEM_FONT }}>
          {subtitle}
        </p>
      )}
    </div>
  );
}

export function StatTile({ label, value }: { label: string; value: ReactNode }) {
  return (
    <GlassCard className="px-6 py-5 text-center">
      <div className="text-3xl text-white sm:text-4xl">{value}</div>
      <div className="mt-1 text-xs uppercase tracking-wide text-white/50" style={{ fontFamily: SYSTEM_FONT }}>
        {label}
      </div>
    </GlassCard>
  );
}

export const fontUi = SYSTEM_FONT;
