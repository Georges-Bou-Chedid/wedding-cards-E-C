import { useState, useEffect } from "react";
import { motion } from "framer-motion";

interface CountdownTimerProps {
  targetDate: string;
  /** Use 'light' when the timer sits on a dark background */
  variant?: "dark" | "light";
  /** Use 'small' for a compact inline countdown */
  size?: "default" | "small";
}

function getTimeLeft(target: string) {
  const diff = Math.max(0, new Date(target).getTime() - Date.now());
  return {
    days:    Math.floor(diff / 86400000),
    hours:   Math.floor((diff % 86400000) / 3600000),
    minutes: Math.floor((diff % 3600000)  / 60000),
    seconds: Math.floor((diff % 60000)    / 1000),
  };
}

const CountdownTimer = ({ targetDate, variant = "dark", size = "default" }: CountdownTimerProps) => {
  const [timeLeft, setTimeLeft] = useState(getTimeLeft(targetDate));

  useEffect(() => {
    const timer = setInterval(() => setTimeLeft(getTimeLeft(targetDate)), 1000);
    return () => clearInterval(timer);
  }, [targetDate]);

  const isLight = variant === "light";
  const isSmall = size === "small";

  const numStyle: React.CSSProperties = {
    fontFamily: "'Cormorant Garamond',serif",
    fontWeight: 300,
    fontSize: isSmall ? "clamp(1.5rem,5vw,2.2rem)" : "clamp(2.8rem,10vw,5rem)",
    lineHeight: 1,
    color: isLight ? "white" : "hsl(var(--foreground))",
    tabularNums: true,
  } as React.CSSProperties;

  const labelStyle: React.CSSProperties = {
    fontFamily: "'Montserrat',sans-serif",
    fontSize: isSmall ? "0.45rem" : "0.55rem",
    letterSpacing: "0.3em",
    textTransform: "uppercase",
    marginTop: "0.4rem",
    color: isLight ? "rgba(255,255,255,0.55)" : "hsl(var(--muted-foreground))",
  };

  const sepStyle: React.CSSProperties = {
    fontFamily: "'Cormorant Garamond',serif",
    fontWeight: 300,
    fontSize: isSmall ? "clamp(1.1rem,3.5vw,1.6rem)" : "clamp(2rem,7vw,3.5rem)",
    color: isLight ? "rgba(255,255,255,0.3)" : "hsl(var(--dusty-blue-pale))",
    lineHeight: 1,
    alignSelf: "flex-start",
    paddingTop: "0.15em",
  };

  const units = [
    { label: "Days",    value: timeLeft.days },
    { label: "Hours",   value: timeLeft.hours },
    { label: "Minutes", value: timeLeft.minutes },
    { label: "Seconds", value: timeLeft.seconds },
  ];

  return (
    <div className="flex items-start justify-center gap-2 sm:gap-4">
      {units.map((unit, i) => (
        <div key={unit.label} className="flex items-start gap-2 sm:gap-4">
          <motion.div
            className="flex flex-col items-center"
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08, duration: 0.6 }}
          >
            <span style={numStyle}>
              {String(unit.value).padStart(2, "0")}
            </span>
            <span style={labelStyle}>{unit.label}</span>
          </motion.div>
          {i < units.length - 1 && (
            <span style={sepStyle}>:</span>
          )}
        </div>
      ))}
    </div>
  );
};

export default CountdownTimer;
