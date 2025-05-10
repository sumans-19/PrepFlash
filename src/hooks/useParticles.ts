import { useEffect } from 'react';

type Particle = {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  opacity: number;
  color: string;
};

export const useParticles = (containerRef: React.RefObject<HTMLElement>, count: number = 15) => {
  useEffect(() => {
    if (!containerRef.current) return;
    
    const container = containerRef.current;
    const containerRect = container.getBoundingClientRect();
    
    // Create particles
    const createParticles = (count: number): Particle[] => {
      const particles: Particle[] = [];
      const colors = ['rgba(99, 102, 241, 0.4)', 'rgba(139, 92, 246, 0.4)', 'rgba(79, 70, 229, 0.4)'];
      
      for (let i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * containerRect.width,
          y: Math.random() * containerRect.height,
          size: Math.random() * 10 + 5,
          speedX: Math.random() * 0.5 - 0.25,
          speedY: Math.random() * 0.5 - 0.25,
          opacity: Math.random() * 0.5 + 0.1,
          color: colors[Math.floor(Math.random() * colors.length)]
        });
      }
      
      return particles;
    };
    
    // Create and append canvas
    const canvas = document.createElement('canvas');
    canvas.style.position = 'absolute';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.pointerEvents = 'none';
    canvas.style.zIndex = '-1';
    
    // Set actual canvas dimensions
    canvas.width = containerRect.width;
    canvas.height = containerRect.height;
    
    container.style.position = 'relative';
    container.appendChild(canvas);
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const particles = createParticles(count);
    
    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      particles.forEach(particle => {
        // Update position
        particle.x += particle.speedX;
        particle.y += particle.speedY;
        
        // Bounce off edges
        if (particle.x < 0 || particle.x > canvas.width) {
          particle.speedX *= -1;
        }
        
        if (particle.y < 0 || particle.y > canvas.height) {
          particle.speedY *= -1;
        }
        
        // Draw particle
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = particle.color.replace('0.4', particle.opacity.toString());
        ctx.fill();
      });
      
      animationId = requestAnimationFrame(animate);
    };
    
    let animationId = requestAnimationFrame(animate);
    
    // Handle window resize
    const handleResize = () => {
      if (!containerRef.current) return;
      
      const newRect = containerRef.current.getBoundingClientRect();
      canvas.width = newRect.width;
      canvas.height = newRect.height;
    };
    
    window.addEventListener('resize', handleResize);
    
    // Cleanup
    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', handleResize);
      if (container.contains(canvas)) {
        container.removeChild(canvas);
      }
    };
  }, [containerRef, count]);
};