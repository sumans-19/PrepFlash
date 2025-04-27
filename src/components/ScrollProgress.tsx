
import { useScroll, motion, useSpring } from "framer-motion";

export const ScrollProgress = () => {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-2 z-50 origin-left"
      style={{
        scaleX,
        background: "linear-gradient(90deg, #9b87f5 0%, #7E69AB 50%, #33C3F0 100%)"
      }}
    />
  );
};
