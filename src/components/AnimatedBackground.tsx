
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export const AnimatedBackground = () => {
  const [particles, setParticles] = useState<{x: number, y: number, size: number, delay: number}[]>([]);

  useEffect(() => {
    // Generate random particles
    const newParticles = Array.from({ length: 20 }).map(() => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 20 + 5,
      delay: Math.random() * 5
    }));
    
    setParticles(newParticles);
  }, []);

  return (
    <div className="fixed inset-0 overflow-hidden -z-10">
      {particles.map((particle, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full bg-gradient-to-br from-purple-300/10 to-indigo-300/10 backdrop-blur-sm"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: `${particle.size}vmin`,
            height: `${particle.size}vmin`,
          }}
          animate={{
            x: [0, 10, -10, 5, -5, 0],
            y: [0, -15, 10, -5, 10, 0],
          }}
          transition={{
            duration: 20,
            delay: particle.delay,
            repeat: Infinity,
            repeatType: "reverse",
          }}
        />
      ))}
    </div>
  );
};
