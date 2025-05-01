import React, { useEffect, useRef } from 'react';
import { DashboardNav } from "@/components/DashboardNav";
import { FeatureHero } from '../components2/features/FeatureHero'; // Import FeatureHero, though we'll adapt its starfield
import { AIChat } from '../components2/features/AIChat';
import { AppTour } from '../components2/features/AppTour';
import { MultilingualSupport } from '../components2/features/MultilingualSupport';
import { LearningTools } from '../components2/features/LearningTools';
import { Community } from '../components2/features/Community';
import { InnovativeFeatures } from '../components2/features/InnovativeFeatures';
import { FeaturesCTA } from '../components2/FeaturesCTA';
import { Footer } from '@/components2/Footer';
import { useTheme } from '@/components/ui/theme-provider';
import { cn } from "@/lib/utils"

export function Features() {
  const { theme } = useTheme();
  const canvasRef = useRef<HTMLCanvasElement>(null); // Ref for the canvas
  const animationFrameRef = useRef<number>(0);

  useEffect(() => {

    // Add scrolling animations to reveal elements with more dynamic effects
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const target = entry.target;
          target.classList.remove('opacity-0'); // Ensure it's visible before animating

          // Apply different animation classes based on element type for variety
          if (target.classList.contains('feature-section')) {
            target.classList.add('animate-slide-up', 'delay-100', 'duration-700', 'ease-out');
          } else if (target.id === 'feature-hero') {
            target.classList.add('animate-zoom-in', 'duration-500', 'ease-out');
          } else if (target.id === 'features-cta') {
            target.classList.add('animate-pulse', 'duration-1000', 'ease-in-out', 'infinite'); // Subtle CTA pulse
          } else {
            target.classList.add('animate-fade-in', 'duration-500', 'ease-out');
          }
          observer.unobserve(target);
        }
      });
    }, { threshold: 0.1 });

    document.querySelectorAll('section, .feature-section').forEach(section => {
      section.classList.add('opacity-0'); // Start with opacity 0
      observer.observe(section);
    });

    // --- Starfield Canvas Effect ---
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        let stars: { x: number; y: number; size: number; color: string; opacity: number }[] = [];
        const numStars = 200;

        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        const createStars = () => {
          stars = [];
          for (let i = 0; i < numStars; i++) {
            stars.push({
              x: Math.random() * canvas.width,
              y: Math.random() * canvas.height,
              size: Math.random() * 2 + 1,
              color: `rgba(255, 255, 255, ${Math.random() * 0.5 + 0.5})`,
              opacity: 0,
            });
          }
        };

        createStars();

        const drawStars = () => {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          stars.forEach(star => {
            ctx.beginPath();
            ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
            ctx.fillStyle = star.color;
            ctx.globalAlpha = star.opacity;
            ctx.fill();
            ctx.closePath();
          });
        };

        const animateStars = () => {
          stars.forEach(star => {
            star.opacity = Math.min(1, star.opacity + 0.01); // Fade in
            star.x += (Math.random() - 0.5) * 0.2; // subtle movement
            star.y += (Math.random() - 0.5) * 0.2;

            // Keep stars within bounds (wrap around)
            if (star.x < 0) star.x = canvas.width;
            if (star.x > canvas.width) star.x = 0;
            if (star.y < 0) star.y = canvas.height;
            if (star.y > canvas.height) star.y = 0;
          });
          drawStars();
          animationFrameRef.current = requestAnimationFrame(animateStars);
        };

        animateStars();

        const handleResize = () => {
          canvas.width = window.innerWidth;
          canvas.height = window.innerHeight;
          createStars();
          drawStars();
        };

        window.addEventListener('resize', handleResize);

        // Cleanup for the starfield animation
        return () => {
          window.removeEventListener('resize', handleResize);
          cancelAnimationFrame(animationFrameRef.current);
          observer.disconnect();
        };
      }
    }


    // Cleanup for the scroll animations
    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-white relative">
      <canvas
        ref={canvasRef}
        style={{
          position: 'fixed', // Make it fixed
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: 0,      // Ensure it's behind other content
          pointerEvents: 'none', // Allows clicks to go through
        }}
      />
      <DashboardNav />
      <section id="feature-hero" className="relative z-10"> {/* Ensure content is above canvas */}
        <FeatureHero />
      </section>
      <section className="feature-section relative z-10">
        <AIChat />
      </section>
      <section className="feature-section relative z-10">
        <AppTour />
      </section>
      <section className="feature-section relative z-10">
        <MultilingualSupport />
      </section>
      <section className="feature-section relative z-10">
        <LearningTools />
      </section>
      <section className="feature-section relative z-10">
        <Community />
      </section>
      <section className="feature-section relative z-10">
        <InnovativeFeatures />
      </section>
      <section id="features-cta" className="relative z-10">
        <FeaturesCTA />
      </section>
    </div>
  );
}
