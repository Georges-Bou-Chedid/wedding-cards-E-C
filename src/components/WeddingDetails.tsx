import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import RSVPForm from "./RSVPForm";
import GiftRegistry from "./GiftRegistry";
import WeddingTimeline from "./WeddingTimeline";
import CountdownTimer from "./CountdownTimer";

/*
 * ─── BACKGROUND PHOTOS ────────────────────────────────────────────────────────
 * Replace these files in  src/assets/  to use your own photos:
 *   heroBg    →  verse section
 *   footerBg  →  wish account + RSVP + closing section
 * ─────────────────────────────────────────────────────────────────────────────
 */
import heroBg        from "@/assets/couple-chapel-steps.webp";
import footerBg      from "@/assets/couple-sunset.webp";
import coupleWalking from "@/assets/couple-walking.webp";
import coupleBench   from "@/assets/couple-bench.webp";
import coupleHands   from "@/assets/couple-hands.webp";
import coupleVenue   from "@/assets/couple-venue.webp";

/*
 * ─── EVENT DETAILS ────────────────────────────────────────────────────────────
 */
const COUPLE = { groom: "Elie", bride: "Christine" };
const WEDDING_DATE_ISO = "2026-09-26T19:30:00";
const EVENTS = {
  groomHome: { mapHref: "https://maps.app.goo.gl/hDHh2ML1opzAhm1P7" },
  brideHome: { mapHref: "https://goo.gl/maps/f7JxVts1s2rhytk99?g_st=awb" },
  ceremony:  { mapQuery: "Notre Dame Church Fanar Lebanon" },
  venue:     { mapHref: "https://maps.app.goo.gl/KshmE32eMgNXJ8Rd6?g_st=awb" },
};

/* ─── Scroll-reveal ─────────────────────────────────────────────────────── */
const useScrollReveal = (ref: React.RefObject<HTMLElement | null>) => {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) el.classList.add("in-view"); },
      { threshold: 0.1 }
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

/* ─── Ornamental divider ────────────────────────────────────────────────── */
const Ornament = ({ light = false }: { light?: boolean }) => (
  <div className="ornament my-5">
    <div className="ornament-line" style={light ? { background: "rgba(255,255,255,0.3)" } : {}} />
    <div className="ornament-diamond" style={light ? { background: "rgba(255,255,255,0.6)" } : {}} />
    <div className="ornament-line" style={light ? { background: "rgba(255,255,255,0.3)" } : {}} />
  </div>
);

/* ─── Full-bleed photo section (no fixed attachment — mobile performance) ─ */
const FullBleed = ({
  src, fallbackColor, overlay = "rgba(0,0,0,0.38)", minH = "100vh", bgPosition = "center top", children,
}: {
  src: string; fallbackColor: string; overlay?: string; minH?: string; bgPosition?: string; children: React.ReactNode;
}) => (
  <section
    className="relative flex items-center justify-center"
    style={{
      minHeight: minH,
      backgroundImage: src ? `url('${src}')` : undefined,
      backgroundColor: src ? undefined : fallbackColor,
      backgroundSize: "cover",
      backgroundPosition: bgPosition,
    }}
  >
    <div className="absolute inset-0" style={{ background: overlay }} />
    <div className="relative z-10 w-full">{children}</div>
  </section>
);

/* ═══════════════════════════════════════════════════════════════════════════
   WEDDING DETAILS
═══════════════════════════════════════════════════════════════════════════ */
const WeddingDetails = () => (
  <div className="overflow-x-hidden" style={{ background: "hsl(var(--cream))" }}>

    {/* ── 1. HERO — Arabic verse ── */}
    <FullBleed src={heroBg} fallbackColor="hsl(var(--dusty-blue-dark))" overlay="rgba(28,38,50,0.50)" minH="65vh">
      <div className="flex flex-col items-center justify-center min-h-[65vh] text-center px-6 py-16 max-w-2xl mx-auto">
        <FadeUp>
          <p
            className="font-arabic2 text-white leading-[2.2]"
            dir="rtl" lang="ar"
            style={{ fontSize: "clamp(1.05rem,3.2vw,1.6rem)", lineHeight: "2.4",
              letterSpacing: "0.02em", textShadow: "0 2px 12px rgba(0,0,0,0.45)" }}
          >
            "الحبُّ لا تُطفِئُهُ المياهُ الغزيرةُ، ولا تَغمُرُهُ الأنهارُ."
          </p>
        </FadeUp>
        <FadeUp delay={150}>
          <p className="font-arabic2 text-white/65 mt-3" dir="rtl" lang="ar" style={{ fontSize: "0.95rem" }}>
            سفر نشيد الأنشاد 8:‏7
          </p>
        </FadeUp>
      </div>
    </FullBleed>

    {/* ── 2. INVITATION DETAILS (swapped to come before date) ── */}
    <section className="py-24 px-6 text-center" style={{ background: "white" }}>
      <div className="max-w-xl mx-auto">
        <FadeUp>
          <Ornament />
        </FadeUp>

        <FadeUp delay={80}>
          <p
            className="text-foreground tracking-[0.2em] uppercase leading-loose"
            style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "clamp(0.85rem,2vw,1.05rem)" }}
          >
            Rachid &amp; Wadiaa Dahdouh
          </p>
          <p
            className="text-muted-foreground italic"
            style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "clamp(0.95rem,2.4vw,1.15rem)" }}
          >
            Father and Mother of the Groom
          </p>
        </FadeUp>

        <FadeUp delay={140}>
          <p
            className="text-muted-foreground tracking-[0.3em] uppercase my-2"
            style={{ fontFamily: "'Cormorant Garamond',serif", fontStyle: "italic", fontSize: "0.82rem" }}
          >
            Along With
          </p>
        </FadeUp>

        <FadeUp delay={200}>
          <p
            className="text-foreground tracking-[0.2em] uppercase leading-loose"
            style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "clamp(0.85rem,2vw,1.05rem)" }}
          >
            Joseph &amp; Nada Tawk
          </p>
          <p
            className="text-muted-foreground italic"
            style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "clamp(0.95rem,2.4vw,1.15rem)" }}
          >
            Father and Mother of the Bride
          </p>
        </FadeUp>

        <FadeUp delay={260}>
          <Ornament />
        </FadeUp>

        <FadeUp delay={320}>
          <p
            className="text-muted-foreground italic my-4"
            style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "clamp(0.9rem,2.2vw,1.1rem)" }}
          >
            Request the Honor of Your Presence<br />
            at the Wedding of Their Son and Daughter
          </p>
        </FadeUp>

        {/* Couple names — Amelia (Bodoni Moda) + Great Vibes */}
        <FadeUp delay={380}>
          <div className="my-8 flex items-center justify-center gap-4 flex-wrap">
            <p
              className="text-foreground leading-none"
              style={{
                fontFamily: "var(--font-script)",
                fontWeight: 400,
                fontSize: "clamp(2rem, 6vw, 2.2rem)",
              }}
            >
              {COUPLE.groom}
            </p>
            <p
              className="text-dusty-blue"
              style={{
                fontFamily: "var(--font-script)",
                fontSize: "clamp(1.5rem, 4vw, 1.4rem)",
                marginTop: "0.5rem"
              }}
            >
              &amp;
            </p>
            <p
              className="text-foreground leading-none"
              style={{
                fontFamily: "var(--font-script)",
                fontWeight: 400,
                fontSize: "clamp(2rem, 6vw, 2.2rem)"
              }}
            >
              {COUPLE.bride}
            </p>
          </div>
        </FadeUp>

        <FadeUp delay={440}>
          <Ornament />
        </FadeUp>
      </div>
    </section>

    {/* ── 3. DATE + COUNTDOWN — solid color, compact ── */}
    <section
      className="flex flex-col items-center justify-center text-center px-6 py-14"
      style={{ background: "hsl(212,25%,16%)" }}
    >
      <FadeUp delay={80}>
        <p style={{
          fontFamily: "'Cormorant Garamond',serif",
          fontSize: "clamp(1.4rem, 4vw, 2rem)",
          letterSpacing: "0.08em",
          color: "white",
          lineHeight: 1,
          textShadow: "0 2px 20px rgba(0,0,0,0.35)",
          marginBottom: "1.5rem",
        }}>
          26 September 2026
        </p>
      </FadeUp>

      <FadeUp delay={160}>
        <CountdownTimer targetDate={WEDDING_DATE_ISO} variant="light" size="small" />
      </FadeUp>
    </section>

    {/* ── 4. WEDDING DAY TIMELINE ── */}
    <WeddingTimeline
      events={[
        {
          time: "12:00 PM",
          title: "Groom's Home",
          caption: "Elie gets ready with his family",
          photo: coupleWalking,
          photoPosition: "center 20%",
          mapHref: EVENTS.groomHome.mapHref,
        },
        {
          time: "12:00 PM",
          title: "Bride's Home",
          caption: "Christine gets ready with her family",
          photo: coupleBench,
          mapHref: EVENTS.brideHome.mapHref,
        },
        {
          time: "7:30 PM",
          title: "Ceremony",
          caption: "Notre Dame — El Sayde Church, Fanar",
          photo: coupleHands,
          mapQuery: EVENTS.ceremony.mapQuery,
        },
        {
          time: "8:00 PM",
          title: "Venue",
          caption: "Zone, Mansourieh",
          photo: coupleVenue,
          mapHref: EVENTS.venue.mapHref,
        },
      ]}
    />

    {/* ── 5. WISH ACCOUNT — standalone, small, plain white background ── */}
    <FullBleed
      src=""
      fallbackColor="white"
      overlay="transparent"
      minH="auto"
    >
      <div className="py-14 px-6">
        <GiftRegistry
          compact
          coupleLabel={`${COUPLE.groom.toUpperCase()} & ${COUPLE.bride.toUpperCase()}`}
        />
      </div>
    </FullBleed>

    {/* ── 6. RSVP + CLOSING — photo visible throughout, no card ── */}
    <FullBleed src={footerBg} fallbackColor="hsl(var(--dusty-blue-dark))" overlay="rgba(28,38,50,0.50)" minH="auto" bgPosition="center center">
      <div className="py-20">
        <RSVPForm variant="onPhoto" />
        <div className="max-w-lg mx-auto px-6">
          <Ornament light />
        </div>

        {/* Closing — moved up from the old footer section */}
        <div className="text-center px-6 pt-4">
          <motion.p
            className="text-white"
            style={{ fontFamily: "var(--font-script)", fontSize: "clamp(2rem,10vw,2.2rem)", lineHeight: 1.05 }}
            initial={{ opacity: 0, y: 22 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1.1, delay: 0.3 }}
          >
            {COUPLE.groom} &amp; {COUPLE.bride}
          </motion.p>
          <motion.p
            className="mt-4 tracking-[0.42em] uppercase"
            style={{ fontFamily: "'Montserrat',sans-serif", fontSize: "0.68rem", color: "rgba(255,255,255,0.55)" }}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.65 }}
          >
            26 · 09 · 2026
          </motion.p>
        </div>
      </div>
    </FullBleed>
  </div>
);

export default WeddingDetails;
