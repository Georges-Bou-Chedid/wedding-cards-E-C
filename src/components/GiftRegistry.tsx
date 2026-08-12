import { useState } from "react";
import { motion } from "framer-motion";
import { Copy, Check } from "lucide-react";

const WHISH_ACCOUNT = "30695437-03";

interface GiftRegistryProps {
  /** Tighter spacing/type scale for embedding inside another section (e.g. RSVP) */
  compact?: boolean;
  coupleLabel?: string;
  /** Use 'onPhoto' when sitting directly on a photo background (no card behind it) */
  variant?: "default" | "onPhoto";
}

const GiftRegistry = ({ compact = false, coupleLabel = "", variant = "default" }: GiftRegistryProps) => {
  const [copied, setCopied] = useState(false);
  const onPhoto = variant === "onPhoto";

  const copyAccount = () => {
    navigator.clipboard.writeText(WHISH_ACCOUNT).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  return (
    <motion.div
      className={`text-center max-w-lg mx-auto ${compact ? "px-6" : ""}`}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7 }}
    >
      {/* Gift icon */}
      <div className={`flex justify-center ${compact ? "mb-2" : "mb-6"}`}>
        <svg width={compact ? 18 : 32} height={compact ? 18 : 32} viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path
            d="M20 12v10H4V12M22 7H2v5h20V7zM12 22V7M12 7H7.5a2.5 2.5 0 010-5C11 2 12 7 12 7zM12 7h4.5a2.5 2.5 0 000-5C13 2 12 7 12 7z"
            stroke={onPhoto ? "white" : "#1C2632"}
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      <p
        className={`tracking-[0.3em] uppercase ${compact ? "mb-1.5" : "mb-3"}`}
        style={{
          fontFamily: "'Montserrat',sans-serif",
          fontSize: compact ? "0.58rem" : "0.65rem",
          color: onPhoto ? "rgba(255,255,255,0.75)" : "hsl(var(--dusty-blue-dark))",
        }}
      >
        Wedding Gift
      </p>

      <p
        className={`leading-relaxed ${compact ? "mb-3 text-xs" : "mb-10"}`}
        style={{
          fontFamily: "'Cormorant Garamond',serif",
          fontStyle: "italic",
          fontSize: compact ? "0.8rem" : "1.2rem",
          color: onPhoto ? "rgba(255,255,255,0.92)" : "#1C2632",
        }}
      >
        {compact
          ? "A Whish money account is available for those wishing to celebrate us with a gift."
          : <>The joy of sharing this day with you is the greatest gift we could receive.<br />For those wishing to celebrate us with a gift, a Whish money account is available.</>}
      </p>

      {/* Account card — frosted glass on photo, solid white on a light background */}
      <div
        className={`inline-flex items-center rounded-sm ${onPhoto ? "" : "shadow-sm"} ${compact ? "gap-3 px-4 py-2.5" : "gap-6 px-8 py-6"}`}
        style={
          onPhoto
            ? { background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.35)", backdropFilter: "blur(2px)" }
            : { background: "white", border: "1px solid hsl(var(--dusty-blue-pale))" }
        }
      >
        <div className="text-left">
          <p
            style={{
              fontFamily: "'Montserrat',sans-serif",
              fontSize: compact ? "0.5rem" : "0.6rem",
              letterSpacing: "0.25em",
              textTransform: "uppercase",
              color: onPhoto ? "rgba(255,255,255,0.65)" : "hsl(var(--dusty-blue))",
              marginBottom: "3px",
            }}
          >
            Account Number
          </p>
          <p
            style={{
              fontFamily: "'Cormorant Garamond',serif",
              fontSize: compact ? "1.15rem" : "1.9rem",
              letterSpacing: "0.05em",
              color: onPhoto ? "white" : "#1C2632",
              fontWeight: 500,
            }}
          >
            {WHISH_ACCOUNT}
          </p>
          {coupleLabel && (
            <p
              style={{
                fontFamily: "'Montserrat',sans-serif",
                fontSize: compact ? "0.52rem" : "0.6rem",
                letterSpacing: "0.15em",
                color: onPhoto ? "rgba(255,255,255,0.7)" : "hsl(var(--dusty-blue-dark))",
                marginTop: "3px",
              }}
            >
              {coupleLabel}
            </p>
          )}
        </div>

        <button
          onClick={copyAccount}
          className={`transition-all rounded-full ${onPhoto ? "hover:bg-white/10" : "hover:bg-slate-50"}`}
          style={{ color: onPhoto ? "white" : "#1C2632", padding: compact ? 6 : 8 }}
          title="Copy account number"
        >
          {copied ? (
            <Check className={compact ? "w-4 h-4" : "w-6 h-6"} style={{ color: onPhoto ? "#8fd19e" : "green" }} />
          ) : (
            <Copy className={`opacity-70 hover:opacity-100 ${compact ? "w-4 h-4" : "w-6 h-6"}`} />
          )}
        </button>
      </div>

      {copied && (
        <motion.p
          className="mt-4"
          style={{
            fontFamily: "'Montserrat',sans-serif",
            fontSize: "0.65rem",
            color: "green",
            letterSpacing: "0.1em"
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          Copied to clipboard ✓
        </motion.p>
      )}
    </motion.div>
  );
};

export default GiftRegistry;
