
import { useRef } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";

export const ParallaxBackground = () => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"]
  });

  // Create more floating elements with various sizes and opacities
  const smallCircles = Array.from({ length: 20 }).map(() => ({
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 150 + 20,
    opacity: Math.random() * 0.15 + 0.05,
    rotation: Math.random() * 360,
    rotationSpeed: Math.random() > 0.5 ? 1 : -1,
  }));

  return (
    <div ref={ref} className="absolute inset-0 overflow-hidden -z-10">
      {smallCircles.map((circle, i) => {
        const y = useTransform(
          scrollYProgress,
          [0, 1],
          [0, circle.y < 50 ? 300 : -300]
        );
        
        const rotate = useTransform(
          scrollYProgress,
          [0, 1],
          [0, circle.rotation * circle.rotationSpeed]
        );
        
        const springY = useSpring(y, { stiffness: 50, damping: 30 });
        const springRotate = useSpring(rotate, { stiffness: 20, damping: 10 });
        
        return (
          <motion.div
            key={i}
            style={{
              position: "absolute",
              left: `${circle.x}%`,
              top: `${circle.y}%`,
              y: springY,
              rotate: springRotate,
              width: `${circle.size}px`,
              height: `${circle.size}px`,
              borderRadius: i % 3 === 0 ? "50%" : i % 3 === 1 ? "30%" : "40%",
              background: i % 4 === 0 
                ? `linear-gradient(135deg, rgba(155, 135, 245, ${circle.opacity}) 0%, rgba(126, 105, 171, ${circle.opacity}) 100%)`
                : i % 4 === 1 
                ? `linear-gradient(135deg, rgba(51, 195, 240, ${circle.opacity}) 0%, rgba(126, 105, 171, ${circle.opacity}) 100%)`
                : i % 4 === 2
                ? `linear-gradient(135deg, rgba(240, 103, 167, ${circle.opacity}) 0%, rgba(155, 135, 245, ${circle.opacity}) 100%)`
                : `linear-gradient(135deg, rgba(110, 217, 189, ${circle.opacity}) 0%, rgba(51, 195, 240, ${circle.opacity}) 100%)`,
              filter: "blur(40px)",
              transform: "translateZ(0)",
              willChange: "transform"
            }}
          />
        );
      })}
    </div>
  );
};
