
import { Lightbulb, Mic, Video, MessageSquare } from "lucide-react";

export function HowItWorksSection() {
  return (
    <section className="relative z-10 py-16 md:py-24 px-2 md:px-0 bg-muted/20 dark:bg-background">
      <div className="mx-auto max-w-6xl flex flex-col md:flex-row items-center gap-12">
        {/* Visual area - uploaded image with effect */}
        <div className="flex-1 flex justify-center items-center relative">
          <div className="relative w-full max-w-md">
            <img
              src="/interview-panel.webp"
              alt="PrepFlash Experience Visual"
              className="rounded-3xl shadow-2xl border border-border object-cover w-full"
              style={{ minHeight: 340, aspectRatio: "16/11" }}
            />
            <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 bg-white/80 dark:bg-background/80 py-2 px-6 rounded-full shadow-xl border border-muted flex gap-2 items-center text-indigo-700 dark:text-fuchsia-400 font-bold text-lg backdrop-blur-lg">
              <Lightbulb className="mr-2 w-6 h-6 text-fuchsia-500" />
              Real Insights, Real Results
            </div>
          </div>
        </div>

        {/* Text & cards area */}
        <div className="flex-1 flex flex-col items-center md:items-start">
          <h2 className="text-3xl md:text-5xl font-extrabold mb-4 text-center md:text-left bg-gradient-to-r from-indigo-600 via-purple-400 to-fuchsia-400 bg-clip-text text-transparent animate-fade-in drop-shadow">
            How PrepFlash <span className="text-fuchsia-400">Works</span>
          </h2>
          <p className="mb-8 text-base md:text-xl max-w-xl text-muted-foreground/90 text-center md:text-left">
            Sharpen your interview skills with a blend of adaptive mock sessions, real-time analytics, and next-gen AI feedback—all designed to ensure you shine.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full">
            <div className="bg-white/70 dark:bg-card/80 p-6 rounded-2xl shadow-lg flex items-start gap-4 border border-border">
              <MessageSquare className="w-8 h-8 text-indigo-500" />
              <div>
                <p className="font-bold text-lg mb-1">Personalized Practice</p>
                <p className="text-muted-foreground text-sm">Text, voice, or video mock interviews, with instant feedback after each session.</p>
              </div>
            </div>
            <div className="bg-white/70 dark:bg-card/80 p-6 rounded-2xl shadow-lg flex items-start gap-4 border border-border">
              <Mic className="w-8 h-8 text-fuchsia-400" />
              <div>
                <p className="font-bold text-lg mb-1">Voice & Language Insights</p>
                <p className="text-muted-foreground text-sm">Detects tone, filler words, and pacing so you sound sharp and confident.</p>
              </div>
            </div>
            <div className="bg-white/70 dark:bg-card/80 p-6 rounded-2xl shadow-lg flex items-start gap-4 border border-border">
              <Video className="w-8 h-8 text-violet-500" />
              <div>
                <p className="font-bold text-lg mb-1">Live Video Analysis</p>
                <p className="text-muted-foreground text-sm">Get AI-powered analysis of facial expressions and communication style.</p>
              </div>
            </div>
            <div className="bg-white/70 dark:bg-card/80 p-6 rounded-2xl shadow-lg flex items-start gap-4 border border-border">
              <Lightbulb className="w-8 h-8 text-yellow-400" />
              <div>
                <p className="font-bold text-lg mb-1">Actionable Analytics</p>
                <p className="text-muted-foreground text-sm">Track growth, discover focus areas, and see detailed progress over time.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
export default HowItWorksSection;
