import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Check } from "lucide-react";

const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbx5dg507u42vWhTJO2DYWmOgae26C1_qA5FQp9DP-2i031-wvb_McUXQW5m4oXx3qPkgA/exec";

type Attendance = "yes" | "no";

interface RSVPFormProps {
  /** Use 'onPhoto' when sitting directly on a photo background (no card behind it) */
  variant?: "default" | "onPhoto";
}

const RSVPForm = ({ variant = "default" }: RSVPFormProps) => {
  const [invitedNames, setInvitedNames] = useState<string[]>([]);
  const [responses, setResponses] = useState<Record<string, Attendance>>({});
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");

  const onPhoto = variant === "onPhoto";

  // Parse names from URL on load — e.g. ?names=Boucho,Charbel
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const namesParam = params.get("names");
    if (namesParam) {
      const namesArray = namesParam.split(",").map(n => n.trim()).filter(Boolean);
      setInvitedNames(namesArray);
    }
  }, []);

  const setResponse = (name: string, value: Attendance) => {
    setResponses(prev => ({ ...prev, [name]: value }));
  };

  const allAnswered = invitedNames.length > 0 && invitedNames.every(n => responses[n]);
  const allYes = invitedNames.every(n => responses[n] === "yes");
  const allNo = invitedNames.every(n => responses[n] === "no");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!allAnswered) return;
    setStatus("submitting");

    // Format data for Google Sheets — one readable "Name: Yes/No" pair per guest
    const attendeesSummary = invitedNames
      .map((n) => `${n}: ${responses[n] === "yes" ? "Yes" : "No"}`)
      .join(", ");

    const payload = new URLSearchParams({
      name: invitedNames.join(", "), // Who the link was sent to
      attendees: attendeesSummary, // Per-person response
      attendance: allYes ? "All Attending" : allNo ? "All Declined" : "Mixed",
      message,
      date: new Date().toLocaleString("en-GB"), // Clean date format
    });

    try {
      await fetch(GOOGLE_SCRIPT_URL, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: payload.toString(),
      });
      setStatus("success");
    } catch {
      setStatus("error");
    }
  };

  if (invitedNames.length === 0) return null; // Don't show RSVP if no names in link

  const labelColor = onPhoto ? "rgba(255,255,255,0.65)" : "hsl(var(--muted-foreground))";
  const borderColor = onPhoto ? "rgba(255,255,255,0.28)" : "hsl(var(--dusty-blue-pale))";

  return (
    <motion.div
      className="text-center py-20 px-6 max-w-lg mx-auto"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
    >
      <p
        className="tracking-[0.3em] uppercase mb-2 text-[0.62rem] font-montserrat"
        style={{ color: onPhoto ? "rgba(255,255,255,0.75)" : "hsl(var(--dusty-blue))" }}
      >
        Be Our Guest
      </p>
      <h2
        className="mb-1 font-serif text-[clamp(2rem,6vw,2.8rem)] font-light tracking-wider"
        style={{ color: onPhoto ? "white" : "hsl(var(--foreground))" }}
      >
        RSVP
      </h2>
      <p
        className="italic mb-8 font-serif"
        style={{ color: onPhoto ? "rgba(255,255,255,0.75)" : "hsl(var(--muted-foreground))" }}
      >
        Kindly respond before September 1st, 2026.
      </p>

      {status === "success" ? (
        <motion.div className="flex flex-col items-center gap-4 py-10" initial={{ scale: 0.9 }}>
          <div className="w-14 h-14 rounded-full flex items-center justify-center bg-dusty-blue">
            <Check className="w-7 h-7 text-white" />
          </div>
          <p
            className="font-serif italic text-lg"
            style={{ color: onPhoto ? "white" : "hsl(var(--foreground))" }}
          >
            {allYes
              ? "We can't wait to celebrate with you!"
              : allNo
              ? "Thank you for letting us know."
              : "Thank you for your response!"}
          </p>
        </motion.div>
      ) : (
        <form onSubmit={handleSubmit} className="text-left space-y-8">

          {/* One row per invited guest, each with its own Yes / No */}
          <div>
            <label
              className="block tracking-widest uppercase mb-4 text-[0.6rem] font-montserrat"
              style={{ color: labelColor }}
            >
              Guests
            </label>
            <div>
              {invitedNames.map((name) => (
                <div
                  key={name}
                  className="flex items-center justify-between gap-4 py-3 border-b"
                  style={{ borderColor }}
                >
                  <p
                    className="font-serif italic text-base truncate"
                    style={{ color: onPhoto ? "white" : "hsl(var(--foreground))" }}
                  >
                    {name}
                  </p>
                  <div className="flex gap-2 flex-shrink-0">
                    {(["yes", "no"] as const).map((val) => (
                      <button
                        key={val}
                        type="button"
                        onClick={() => setResponse(name, val)}
                        className={`px-4 py-1.5 rounded-full border transition-all text-[0.6rem] tracking-widest uppercase font-montserrat ${
                          responses[name] === val
                            ? "bg-dusty-blue border-dusty-blue text-white"
                            : ""
                        }`}
                        style={
                          responses[name] === val
                            ? undefined
                            : { borderColor, color: onPhoto ? "rgba(255,255,255,0.8)" : "hsl(var(--muted-foreground))" }
                        }
                      >
                        {val === "yes" ? "Yes" : "No"}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Message */}
          <div>
            <label
              className="block tracking-widest uppercase mb-2 text-[0.6rem] font-montserrat"
              style={{ color: labelColor }}
            >
              Message (Optional)
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className={`w-full px-4 py-3 rounded-sm bg-transparent focus:outline-none border ${
                onPhoto ? "placeholder:text-white/50" : "placeholder:text-muted-foreground"
              }`}
              style={{
                borderColor,
                color: onPhoto ? "white" : "hsl(var(--foreground))",
              }}
              placeholder="Leave a note..."
              rows={2}
            />
          </div>

          <button
            type="submit"
            disabled={status === "submitting" || !allAnswered}
            className={`w-full py-4 uppercase tracking-[0.2em] text-[0.7rem] transition-colors disabled:opacity-30 ${
              onPhoto
                ? "bg-white/90 text-[#1C2632] hover:bg-white"
                : "bg-foreground text-white hover:bg-dusty-blue"
            }`}
          >
            {status === "submitting" ? "Sending..." : "Confirm RSVP"}
          </button>
        </form>
      )}
    </motion.div>
  );
};

export default RSVPForm;
