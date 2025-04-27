
import React from "react";
import { useScroll, motion, useSpring } from "framer-motion";

export const ScrollProgress: React.FC = () => {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  return (
    <>
      {/* Primary progress bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1.5 z-50 origin-left"
        style={{
          scaleX,
          background: "linear-gradient(90deg, #9b87f5 0%, #7E69AB 50%, #33C3F0 100%)",
          boxShadow: "0 0 10px rgba(155, 135, 245, 0.5)"
        }}
      />
      
      {/* Subtle glow effect underneath */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1.5 z-40 origin-left"
        style={{
          scaleX,
          opacity: 0.5,
          filter: "blur(4px)",
          background: "linear-gradient(90deg, #9b87f5 0%, #7E69AB 50%, #33C3F0 100%)"
        }}
      />
    </>
  );
};
