import { useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import EnvelopeCard from "@/components/EnvelopeCard";
import WeddingDetails from "@/components/WeddingDetails";
import MusicPlayer from "@/components/MusicPlayer";

const Index = () => {
  const [isOpen, setIsOpen] = useState(false);
  const musicStartRef = useRef<(() => void) | null>(null);

  const handleInteraction = () => {
    musicStartRef.current?.();
  };

  const handleOpen = () => {
    setIsOpen(true);
  };

  return (
    <>
      <MusicPlayer startRef={musicStartRef} />
      <AnimatePresence>
        {!isOpen && <EnvelopeCard onOpen={handleOpen} onInteraction={handleInteraction}/>}
      </AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.9 }}
        >
          <WeddingDetails />
        </motion.div>
      )}
    </>
  );
};

export default Index;
