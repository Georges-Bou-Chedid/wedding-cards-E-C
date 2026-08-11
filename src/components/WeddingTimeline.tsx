import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { MapPin } from "lucide-react";

export interface TimelineEvent {
  time: string;
  title: string;
  caption: string;
  photo: string;
  /** CSS object-position for the photo crop — defaults to "center" */
  photoPosition?: string;
  /** Direct Google Maps link. Falls back to a text search via mapQuery if omitted. */
  mapHref?: string;
  /** Free-text address/venue name — used to build a Google Maps search link when mapHref isn't set */
  mapQuery?: string;
}

interface WeddingTimelineProps {
  events: TimelineEvent[];
}

const mapsSearchUrl = (query: string) =>
  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;

/* ─── Scroll-reveal (mirrors WeddingDetails' FadeUp) ──────────────────────── */
const useScrollReveal = (ref: React.RefObject<HTMLElement | null>) => {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) el.classList.add("in-view"); },
      { threshold: 0.15 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [ref]);
};

const FadeUp = ({
  children, delay = 0, className = "",
}: {
  children: React.ReactNode; delay?: number; className?: string;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  useScrollReveal(ref as React.RefObject<HTMLElement>);
  return (
    <div ref={ref} className={`animate-fade-up ${className}`} style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </div>
  );
};

const MapBtn = ({ href, query }: { href?: string; query?: string }) => (
  <a
    href={href ?? mapsSearchUrl(query ?? "")}
    target="_blank"
    rel="noopener noreferrer"
    className="inline-flex items-center gap-2 border rounded-sm px-4 py-2 transition-all duration-300"
    style={{
      fontFamily: "'Montserrat',sans-serif",
      fontSize: "0.58rem",
      letterSpacing: "0.2em",
      textTransform: "uppercase",
      borderColor: "hsl(var(--dusty-blue))",
      color: "hsl(var(--dusty-blue))",
    }}
    onMouseEnter={(e) => {
      const a = e.currentTarget as HTMLAnchorElement;
      a.style.background = "hsl(var(--dusty-blue))";
      a.style.color = "white";
    }}
    onMouseLeave={(e) => {
      const a = e.currentTarget as HTMLAnchorElement;
      a.style.background = "transparent";
      a.style.color = "hsl(var(--dusty-blue))";
    }}
  >
    <MapPin size={12} />
    Get Directions
  </a>
);

/* ── One stop on the timeline — polaroid photo + details, alternating sides on sm+ ── */
const TimelineStop = ({ event, index }: { event: TimelineEvent; index: number }) => {
  const isRight = index % 2 === 1;

  return (
    <div className="relative flex items-start sm:items-center gap-6 sm:gap-0">
      {/* Mobile: fixed left rail. Desktop: centered rail with alternating content */}
      <div className="sm:hidden relative flex-shrink-0 w-10 flex justify-center">
        <span
          className="mt-2 block rounded-full"
          style={{ width: 10, height: 10, background: "hsl(var(--dusty-blue))" }}
        />
      </div>

      <FadeUp delay={index * 90} className="flex-1 sm:hidden">
        <StopCard event={event} align="left" />
      </FadeUp>

      {/* Desktop zig-zag layout */}
      <div className="hidden sm:flex w-full items-center">
        <div className="w-1/2 flex justify-end pr-10">
          {!isRight && (
            <FadeUp delay={index * 90}>
              <StopCard event={event} align="right" />
            </FadeUp>
          )}
        </div>

        <span
          className="relative flex-shrink-0 rounded-full z-10"
          style={{ width: 12, height: 12, background: "hsl(var(--dusty-blue))", border: "3px solid hsl(var(--ivory))" }}
        />

        <div className="w-1/2 flex justify-start pl-10">
          {isRight && (
            <FadeUp delay={index * 90}>
              <StopCard event={event} align="left" />
            </FadeUp>
          )}
        </div>
      </div>
    </div>
  );
};

const StopCard = ({ event, align }: { event: TimelineEvent; align: "left" | "right" }) => (
  <div className={`max-w-[280px] ${align === "right" ? "text-right sm:items-end" : "text-left sm:items-start"} flex flex-col`}>
    {/* Polaroid-style photo */}
    <div
      className="bg-white p-2 pb-8 shadow-lg rounded-[2px] mb-3"
      style={{ transform: align === "right" ? "rotate(-1.5deg)" : "rotate(1.5deg)" }}
    >
      <img
        src={event.photo}
        alt={event.title}
        className="w-full h-40 sm:h-44 object-cover rounded-[1px]"
        style={{ objectPosition: event.photoPosition ?? "center" }}
        loading="lazy"
        decoding="async"
      />
    </div>

    <p
      className="text-dusty-blue tracking-[0.3em] uppercase mb-1"
      style={{ fontFamily: "'Montserrat',sans-serif", fontSize: "0.6rem" }}
    >
      {event.time}
    </p>
    <p
      className="text-foreground mb-1"
      style={{ fontFamily: "var(--font-amelia)", fontWeight: 300, fontSize: "clamp(1.25rem,3.6vw,1.6rem)", letterSpacing: "0.02em" }}
    >
      {event.title}
    </p>
    <p
      className="text-muted-foreground italic mb-3"
      style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "0.92rem" }}
    >
      {event.caption}
    </p>
    <MapBtn href={event.mapHref} query={event.mapQuery} />
  </div>
);

/* ═══════════════════════════════════════════════════════════════════════════
   WEDDING TIMELINE — "Memory Lane" style vertical timeline for the wedding day
═══════════════════════════════════════════════════════════════════════════ */
const WeddingTimeline = ({ events }: WeddingTimelineProps) => (
  <section className="py-24 px-6" style={{ background: "white" }}>
    <div className="max-w-4xl mx-auto">
      <FadeUp className="text-center mb-16">
        <p
          className="text-dusty-blue tracking-[0.35em] uppercase mb-2"
          style={{ fontFamily: "'Montserrat',sans-serif", fontSize: "0.6rem" }}
        >
          Join Us
        </p>
        <h2
          className="text-foreground"
          style={{ fontFamily: "var(--font-amelia)", fontWeight: 300, fontSize: "clamp(2rem,6vw,3rem)", letterSpacing: "0.04em" }}
        >
          The Wedding Day
        </h2>
      </FadeUp>

      {/* Connecting dashed line */}
      <div className="relative">
        <div
          className="absolute top-0 bottom-0 left-[19px] sm:left-1/2 sm:-translate-x-1/2 w-px"
          style={{
            backgroundImage: "linear-gradient(hsl(var(--dusty-blue-pale)) 60%, transparent 0%)",
            backgroundSize: "1px 10px",
            backgroundRepeat: "repeat-y",
          }}
          aria-hidden="true"
        />

        <div className="flex flex-col gap-14 sm:gap-16">
          {events.map((event, i) => (
            <TimelineStop key={event.title} event={event} index={i} />
          ))}
        </div>
      </div>
    </div>
  </section>
);

export default WeddingTimeline;
