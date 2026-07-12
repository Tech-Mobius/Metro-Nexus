import { Wind, Zap, Palette } from 'lucide-react';
import { ENERGY_STATS } from '../lib/mockData';
import { GlassCard, PageHeader, StatTile, fontUi } from '../components/ui';

const STEPS = [
  {
    icon: Wind,
    title: 'Pressure launches the capsule',
    body: 'Sealed tubes and precisely metered air pressure fire each train capsule forward — pneumatic propulsion with no combustion and near-silent acceleration.',
  },
  {
    icon: Zap,
    title: 'Braking recovers the energy',
    body: 'As a capsule slows into a station, regenerative braking captures its kinetic energy instead of losing it to heat, converting motion back into electricity.',
  },
  {
    icon: Palette,
    title: 'Recovered power lights the murals',
    body: 'That reclaimed electricity feeds station lighting, the digital murals, and the interactive artwork riders shape every day — sustainability made visible.',
  },
];

export default function Impact() {
  return (
    <div className="mx-auto max-w-4xl">
      <PageHeader
        eyebrow="Sustainability"
        title="Every Brake Becomes Light"
        subtitle="The same energy that once vanished as heat now paints the murals, powers the lighting, and keeps every station's canvas alive."
      />

      <div className="mt-14 grid gap-6 sm:grid-cols-3">
        {STEPS.map((step) => {
          const Icon = step.icon;
          return (
            <GlassCard key={step.title} className="p-6">
              <div className="liquid-glass inline-flex h-11 w-11 items-center justify-center rounded-2xl">
                <Icon className="h-5 w-5 text-white" strokeWidth={1.75} />
              </div>
              <h3 className="mt-4 text-xl text-white">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-white/60" style={{ fontFamily: fontUi }}>
                {step.body}
              </p>
            </GlassCard>
          );
        })}
      </div>

      <div className="mt-14 grid gap-4 sm:grid-cols-3">
        <StatTile value={`${ENERGY_STATS.recoveredTodayKwh.toLocaleString()} kWh`} label="Energy Recovered Today" />
        <StatTile value={ENERGY_STATS.homesPowered.toLocaleString()} label="Homes That Could Be Powered" />
        <StatTile value={`${ENERGY_STATS.co2AvoidedKg.toLocaleString()} kg`} label="CO₂ Avoided Today" />
      </div>

      <GlassCard className="mt-14 p-8 text-center">
        <h3 className="text-2xl text-white">Live, and Made by Every Ride</h3>
        <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-white/60" style={{ fontFamily: fontUi }}>
          These numbers update with real rider journeys across the network — every commute, every brake, every arrival
          quietly banks power for the next mural. Sustainability here isn't a footnote to the engineering; it's the
          reason the canvas never goes dark.
        </p>
      </GlassCard>
    </div>
  );
}
