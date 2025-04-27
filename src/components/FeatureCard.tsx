
import { useRef, useEffect } from 'react';
import { motion, useAnimation, useInView } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface FeatureCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  index: number;
  direction: 'left' | 'right';
  delay?: number;
}

const FeatureCard = ({ 
  title, 
  description, 
  icon, 
  index, 
  direction, 
  delay = 0 
}: FeatureCardProps) => {
  const controls = useAnimation();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, margin: "-50px 0px" });

  useEffect(() => {
    if (isInView) {
      controls.start("visible");
    }
  }, [controls, isInView]);

  const xOffset = direction === 'left' ? -100 : 100;

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={controls}
      variants={{
        hidden: { x: xOffset, opacity: 0, rotateY: direction === 'left' ? -10 : 10 },
        visible: { 
          x: 0, 
          opacity: 1, 
          rotateY: 0,
          transition: { 
            duration: 0.6, 
            delay: delay + index * 0.1,
            type: "spring", 
            stiffness: 100, 
            damping: 15 
          } 
        }
      }}
      whileHover={{ 
        scale: 1.05,
        boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)",
        transition: { duration: 0.2 }
      }}
      className="w-full max-w-md"
    >
      <Card className="border-2 overflow-hidden backdrop-blur-sm bg-card/50 feature-card">
        <div 
          className="absolute inset-0 opacity-10 bg-gradient-to-br"
          style={{
            background: index % 3 === 0 ? 'linear-gradient(135deg, #9b87f5 0%, #7E69AB 100%)' : 
                     index % 3 === 1 ? 'linear-gradient(135deg, #7E69AB 0%, #33C3F0 100%)' :
                     'linear-gradient(135deg, #33C3F0 0%, #9b87f5 100%)'
          }}
        />
        <CardHeader className="flex flex-row items-center gap-4 pb-2">
          <div 
            className="w-14 h-14 rounded-full flex items-center justify-center"
            style={{
              background: index % 3 === 0 ? 'linear-gradient(135deg, #9b87f5 0%, #7E69AB 100%)' : 
                       index % 3 === 1 ? 'linear-gradient(135deg, #7E69AB 0%, #33C3F0 100%)' :
                       'linear-gradient(135deg, #33C3F0 0%, #9b87f5 100%)'
            }}
          >
            {icon}
          </div>
          <CardTitle className="text-xl font-bold">{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <CardDescription className="text-base">{description}</CardDescription>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default FeatureCard;
