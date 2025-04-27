
import { useState, useEffect } from 'react';
import { motion, useAnimation, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/card';

interface Feature {
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
}

interface Section {
  title: string;
  description?: string;
  features: Feature[];
}

interface SpiralFeatureCardsProps {
  sections: Section[];
  selectedFeature: number | null;
  setSelectedFeature: (index: number | null) => void;
}

export const SpiralFeatureCards = ({ sections, selectedFeature, setSelectedFeature }: SpiralFeatureCardsProps) => {
  const allFeatures = sections.flatMap(section => section.features);
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const controls = useAnimation();

  // Start animation on component mount
  useEffect(() => {
    controls.start("visible");
  }, [controls]);

  return (
    <div className="relative h-[600px] w-full max-w-5xl mx-auto my-20">
      {/* Central glowing orb */}
      <motion.div
        className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full z-10"
        style={{ 
          background: 'radial-gradient(circle, rgba(155, 135, 245, 1) 0%, rgba(126, 105, 171, 0.8) 50%, rgba(51, 195, 240, 0) 100%)',
          boxShadow: '0 0 30px 10px rgba(155, 135, 245, 0.5)'
        }}
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.7, 1, 0.7]
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          repeatType: "reverse"
        }}
      />

      {/* Feature cards in 3D space */}
      <AnimatePresence>
        {allFeatures.map((feature, index) => {
          // Calculate position in the spiral
          const totalCards = allFeatures.length;
          const angleStep = (2 * Math.PI) / totalCards;
          const angle = angleStep * index;
          
          // Spiral parameters
          const spiralRadius = 220; // Base radius
          const heightVariation = 20; // Variation in height
          
          // Calculate positions with slight z-offset for 3D effect
          const x = spiralRadius * Math.cos(angle);
          const y = spiralRadius * Math.sin(angle) / 2; // Make it more oval
          const z = Math.sin(angle * 2) * heightVariation;
          
          // Calculate scale based on z position (perspective effect)
          const scale = 0.8 + (z + heightVariation) / (heightVariation * 2) * 0.4;
          
          // Calculate rotation
          const rotateY = angle * (180 / Math.PI);

          const isExpanded = selectedFeature === index;
          const isHovered = hoveredCard === index;

          return (
            <motion.div
              key={index}
              className="absolute left-1/2 top-1/2 w-64"
              initial={{ opacity: 0, x: 0, y: 0, rotateY: 0 }}
              animate={{
                opacity: isExpanded ? 0 : 1,
                x: isExpanded ? 0 : x,
                y: isExpanded ? 0 : y,
                z: z,
                rotateY: rotateY,
                scale: isHovered ? scale * 1.1 : scale
              }}
              transition={{
                type: "spring",
                stiffness: 100,
                damping: 20,
                duration: 0.8
              }}
              style={{
                transformStyle: "preserve-3d",
                transformOrigin: "center center",
                zIndex: isHovered ? 20 : 10
              }}
              whileHover={{ scale: scale * 1.1, zIndex: 20 }}
              onClick={() => setSelectedFeature(index)}
              onHoverStart={() => setHoveredCard(index)}
              onHoverEnd={() => setHoveredCard(null)}
            >
              <Card className="w-full backdrop-blur-sm bg-card/50 border overflow-hidden">
                <div className="p-5 space-y-2">
                  <div 
                    className="w-10 h-10 rounded-full flex items-center justify-center mb-2"
                    style={{ background: `linear-gradient(135deg, ${feature.color} 0%, rgba(126, 105, 171, 1) 100%)` }}
                  >
                    {feature.icon}
                  </div>
                  <h3 className="text-lg font-semibold">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-2">{feature.description}</p>
                </div>
                
                {/* Animated border effect */}
                <motion.div
                  className="absolute inset-0 pointer-events-none opacity-0"
                  animate={{ opacity: isHovered ? 1 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="h-[2px] w-full absolute top-0 left-0" style={{ 
                    background: `linear-gradient(90deg, transparent, ${feature.color}, transparent)`,
                    animation: 'slide 2s infinite' 
                  }} />
                  <div className="h-full w-[2px] absolute top-0 right-0" style={{ 
                    background: `linear-gradient(180deg, transparent, ${feature.color}, transparent)`,
                    animation: 'slide-down 2s infinite' 
                  }} />
                  <div className="h-[2px] w-full absolute bottom-0 right-0" style={{ 
                    background: `linear-gradient(270deg, transparent, ${feature.color}, transparent)`,
                    animation: 'slide-left 2s infinite' 
                  }} />
                  <div className="h-full w-[2px] absolute bottom-0 left-0" style={{ 
                    background: `linear-gradient(0deg, transparent, ${feature.color}, transparent)`,
                    animation: 'slide-up 2s infinite' 
                  }} />
                </motion.div>
              </Card>
            </motion.div>
          );
        })}
      </AnimatePresence>

      {/* Expanded feature view */}
      <AnimatePresence>
        {selectedFeature !== null && (
          <motion.div
            className="absolute inset-0 flex items-center justify-center z-30"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div 
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
              onClick={() => setSelectedFeature(null)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />
            
            <motion.div
              className="relative bg-card/90 backdrop-blur-md border-2 rounded-xl w-11/12 max-w-2xl overflow-hidden"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              style={{ borderColor: selectedFeature !== null ? allFeatures[selectedFeature].color : 'transparent' }}
            >
              {selectedFeature !== null && (
                <div className="p-6 md:p-8">
                  <div 
                    className="w-14 h-14 rounded-full flex items-center justify-center mb-4"
                    style={{ background: `linear-gradient(135deg, ${allFeatures[selectedFeature].color} 0%, rgba(126, 105, 171, 1) 100%)` }}
                  >
                    {allFeatures[selectedFeature].icon}
                  </div>
                  
                  <h3 className="text-2xl font-bold mb-4">{allFeatures[selectedFeature].title}</h3>
                  <p className="text-muted-foreground mb-6">{allFeatures[selectedFeature].description}</p>
                  
                  <button 
                    className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center bg-muted/50 hover:bg-muted"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedFeature(null);
                    }}
                  >
                    ✕
                  </button>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Connecting lines between cards and central orb */}
      <svg className="absolute inset-0 w-full h-full z-0" style={{ overflow: 'visible' }}>
        <motion.g>
          {allFeatures.map((_, index) => {
            const totalCards = allFeatures.length;
            const angleStep = (2 * Math.PI) / totalCards;
            const angle = angleStep * index;
            
            const spiralRadius = 220;
            const x = spiralRadius * Math.cos(angle);
            const y = spiralRadius * Math.sin(angle) / 2;
            
            return (
              <motion.line
                key={`line-${index}`}
                x1="50%"
                y1="50%"
                x2={`calc(50% + ${x}px)`}
                y2={`calc(50% + ${y}px)`}
                stroke="url(#lineGradient)"
                strokeWidth="1"
                strokeDasharray="5,5"
                initial={{ opacity: 0, pathLength: 0 }}
                animate={{ 
                  opacity: hoveredCard === index ? 0.8 : 0.2,
                  pathLength: 1 
                }}
                transition={{ duration: 1.5, delay: index * 0.1 }}
              />
            );
          })}
        </motion.g>
        
        {/* Gradient definition */}
        <defs>
          <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#9b87f5" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#33C3F0" stopOpacity="0.7" />
          </linearGradient>
        </defs>
      </svg>

      {/* Ambient particles */}
      <div className="absolute inset-0 pointer-events-none">
        {Array.from({ length: 20 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{
              width: Math.random() * 8 + 2 + 'px',
              height: Math.random() * 8 + 2 + 'px',
              backgroundColor: i % 3 === 0 ? '#9b87f5' : i % 3 === 1 ? '#7E69AB' : '#33C3F0',
              left: Math.random() * 100 + '%',
              top: Math.random() * 100 + '%',
              opacity: Math.random() * 0.5 + 0.2
            }}
            animate={{
              x: [
                Math.random() * 100 - 50,
                Math.random() * 100 - 50,
                Math.random() * 100 - 50
              ],
              y: [
                Math.random() * 100 - 50,
                Math.random() * 100 - 50,
                Math.random() * 100 - 50
              ],
              opacity: [
                Math.random() * 0.5 + 0.2,
                Math.random() * 0.5 + 0.5,
                Math.random() * 0.5 + 0.2
              ]
            }}
            transition={{
              duration: 10 + Math.random() * 20,
              repeat: Infinity,
              repeatType: "reverse"
            }}
          />
        ))}
      </div>
    </div>
  );
};
