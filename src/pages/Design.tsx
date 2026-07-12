import { GlassCard, PageHeader, fontUi } from '../components/ui';

export default function Design() {
  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader
        eyebrow="Design Rationale"
        title="Why We Built It This Way"
        subtitle="Metro Nexus explaining itself: the reasoning behind the murals, the eras, the motion, and the door left open to everyone."
      />

      <div className="mt-14 space-y-8">
        <GlassCard className="p-8">
          <h2 className="text-2xl text-white sm:text-3xl">Why Blend, Not Generate</h2>
          <p className="mt-4 leading-relaxed text-white/70" style={{ fontFamily: fontUi }}>
            The AI at the center of Metro Nexus was never meant to be an artist. It's a weaver. Every mural you
            see on a platform wall is stitched together from things real passengers actually made — a sketch
            drawn on a phone during a delayed transfer, a theme vote cast at a kiosk, a lighting preference
            someone set on their morning commute, a melody hummed into a booth at the end of the line.
          </p>
          <p className="mt-3 leading-relaxed text-white/70" style={{ fontFamily: fontUi }}>
            We drew this line deliberately. An AI that generates its own designs makes the station about the
            model. An AI that blends makes the station about the riders. If you trace any mural back far enough,
            it resolves into people, not prompts — that traceability is the entire point.
          </p>
        </GlassCard>

        <GlassCard className="p-8">
          <h2 className="text-2xl text-white sm:text-3xl">Stations as Generations</h2>
          <p className="mt-4 leading-relaxed text-white/70" style={{ fontFamily: fontUi }}>
            A mural could technically drift forever, one contribution nudging the last into oblivion until
            nothing of the original remains and no one remembers what changed. We didn't want that. So every
            twenty-five contributions, a station's design archives into a new Era, and the weaver starts
            building the next one on top of it.
          </p>
          <p className="mt-3 leading-relaxed text-white/70" style={{ fontFamily: fontUi }}>
            Eras give the network a memory. Riders can look back at what their station used to be — the palette
            it wore two years ago, the theme that won out before this one — and feel the accumulation of
            everyone who passed through, rather than watching a single canvas erase itself in real time.
          </p>
        </GlassCard>

        <GlassCard className="p-8">
          <h2 className="text-2xl text-white sm:text-3xl">Every Animation Means Something</h2>
          <p className="mt-4 leading-relaxed text-white/70" style={{ fontFamily: fontUi }}>
            Nothing on this site moves just to look alive. The pulsing core you see on the network overview is
            reading live contribution activity — it beats faster when more riders are submitting ideas at once.
            The dots crossing the map aren't decorative; they represent actual trains, in actual transit, along
            actual lines.
          </p>
          <p className="mt-3 leading-relaxed text-white/70" style={{ fontFamily: fontUi }}>
            Even the color transitions on a station page are grounded in something real — they shift as new
            contributions get blended into the current Era. The interface isn't illustrating the system
            metaphorically. It's modeling it, so what you watch is what's actually happening underground.
          </p>
        </GlassCard>

        <GlassCard className="p-8">
          <h2 className="text-2xl text-white sm:text-3xl">No Login Required</h2>
          <p className="mt-4 leading-relaxed text-white/70" style={{ fontFamily: fontUi }}>
            You can contribute a sketch, a vote, a lighting choice, or a melody without ever creating an
            account. That was non-negotiable from the start. The moment we ask for a login, we've turned a
            shared creative act into a tracked one, and we've quietly told riders the goal is engagement, not
            expression.
          </p>
          <p className="mt-3 leading-relaxed text-white/70" style={{ fontFamily: fontUi }}>
            Frictionless participation means the murals reflect whoever happened to be riding that day, not
            just the riders motivated enough to sign up. The lower the barrier, the more the network looks like
            the city it runs through.
          </p>
        </GlassCard>

        <GlassCard className="p-8">
          <h2 className="text-2xl text-white sm:text-3xl">Sustainability as Creative Fuel</h2>
          <p className="mt-4 leading-relaxed text-white/70" style={{ fontFamily: fontUi }}>
            Every mural is quite literally powered by the trains themselves. Regenerative braking recovers
            energy each time a train slows into a station, and that recovered energy is what runs the lighting
            and displays that bring the blended designs to life.
          </p>
          <p className="mt-3 leading-relaxed text-white/70" style={{ fontFamily: fontUi }}>
            We like that the environmental story and the creative one are the same story. The network doesn't
            just carry riders past the art — the act of carrying them is what keeps the art lit.
          </p>
        </GlassCard>
      </div>
    </div>
  );
}
