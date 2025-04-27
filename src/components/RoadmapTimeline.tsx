
import { useRef, useEffect } from "react";
import { motion, useInView, useAnimation, AnimatePresence } from "framer-motion";
import { Circle } from "lucide-react";

interface TimelineNodeProps {
  active: boolean;
  index: number;
  isLast: boolean;
}

const TimelineNode = ({ active, index, isLast }: TimelineNodeProps) => {
  const controls = useAnimation();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, margin: "-100px 0px" });

  useEffect(() => {
    if (isInView) {
      controls.start("visible");
    }
  }, [controls, isInView]);

  return (
    <div ref={ref} className="relative">
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={controls}
        variants={{
          visible: {
            scale: 1,
            opacity: 1,
            transition: { duration: 0.5, delay: index * 0.2 }
          }
        }}
        className="absolute left-1/2 transform -translate-x-1/2 z-20 flex items-center justify-center rounded-full"
        style={{ 
          width: active ? "60px" : "40px", 
          height: active ? "60px" : "40px",
          transition: "all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)",
          background: active 
            ? 'linear-gradient(135deg, #9b87f5 0%, #7E69AB 100%)' 
            : 'rgba(255, 255, 255, 0.1)',
          boxShadow: active 
            ? '0 0 20px rgba(155, 135, 245, 0.6)' 
            : '0 0 10px rgba(155, 135, 245, 0.2)',
          border: `2px solid ${active ? '#9b87f5' : 'rgba(155, 135, 245, 0.3)'}`,
        }}
      >
        {active ? (
          <span className="font-bold text-white">{index + 1}</span>
        ) : (
          <Circle className="h-4 w-4 text-[#9b87f5]/70" />
        )}
        
        {/* Ripple effect for active node */}
        {active && (
          <motion.div
            className="absolute inset-0 rounded-full"
            animate={{ 
              scale: [1, 1.5, 1],
              opacity: [0.7, 0, 0.7] 
            }}
            transition={{ 
              repeat: Infinity, 
              duration: 2,
              ease: "easeInOut" 
            }}
            style={{ 
              border: '2px solid #9b87f5',
            }}
          />
        )}
      </motion.div>
      
      {!isLast && (
        <motion.div
          initial={{ height: 0 }}
          animate={controls}
          variants={{
            visible: {
              height: "100px",
              transition: { duration: 0.5, delay: index * 0.2 + 0.3 }
            }
          }}
          className="absolute left-1/2 transform -translate-x-1/2 w-1"
          style={{ 
            top: "60px", 
            background: "linear-gradient(to bottom, #9b87f5, rgba(126, 105, 171, 0.2))",
            boxShadow: "0 0 10px rgba(155, 135, 245, 0.3)"
          }}
        />
      )}
      
      {/* Feature name label */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={controls}
        variants={{
          visible: {
            opacity: active ? 1 : 0.6,
            x: 0,
            transition: { duration: 0.5, delay: index * 0.2 + 0.2 }
          }
        }}
        className="absolute left-[-120px] top-[10px] w-[100px] text-right"
      >
        <span 
          className={`text-sm font-medium ${active ? 'text-[#9b87f5]' : 'text-muted-foreground'}`}
          style={{ 
            transition: "all 0.3s ease",
            textShadow: active ? '0 0 10px rgba(155, 135, 245, 0.3)' : 'none'
          }}
        >
          Section {index + 1}
        </span>
      </motion.div>
    </div>
  );
};

interface RoadmapTimelineProps {
  activeSection: number;
  sections: number;
}

export const RoadmapTimeline = ({ activeSection, sections }: RoadmapTimelineProps) => {
  return (
    <div className="h-full flex flex-col items-center justify-around py-10 relative">
      {/* Glowing background line */}
      <div className="absolute left-1/2 transform -translate-x-1/2 w-[1px] h-full bg-gradient-to-b from-[#9b87f5]/50 via-[#7E69AB]/30 to-transparent z-0" />
      
      {Array.from({ length: sections }).map((_, i) => (
        <TimelineNode key={i} active={i === activeSection} index={i} isLast={i === sections - 1} />
      ))}
    </div>
  );
};
