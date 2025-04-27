
import { Navigation } from "@/components/Navigation";
import { Hero } from "@/components/Hero";
import { Features } from "@/components/Features";
import  {PracticeMode}  from "@/components/PracticeMode";
import ParticlesBackground from "@/components/ParticlesBackground";
import InterviewModesDemo from "@/components/InterviewModesDemo";
import {AnalyticsInsights} from "@/components/AnalyticsInsights";
import { AnimatedBackground } from "@/components/AnimatedBackground";
import HowItWorksSection from "@/components/HowItWorksSection";
import { InterviewModes }from "@/components/InterviewModes";
/**
 * Home page layout:
 * - Hero
 * - Features shortlist (if present)
 * - PracticeMode (choose practice, short)
 * - HowItWorksSection (NEW: App explanation/cards/visual)
 * - InterviewModesDemo (toggle between chat/audio/video demo)
 * - AnalyticsInsightsDemo (analytics, charts, stats etc.)
 */
const Index = () => {
  return (
    <div className="min-h-screen bg-background text-foreground relative font-playfair">
      <ParticlesBackground />
      <AnimatedBackground />
      <Navigation />
      <Hero />
      <Features />
      <InterviewModes/>
      <HowItWorksSection />
      <AnalyticsInsights/>
    </div>
  );
};
export default Index;
