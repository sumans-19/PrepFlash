
import { motion } from "framer-motion";
import { Sparkles, LayoutDashboard, Layers, ArrowRight, Users, FileText, Mic, Video } from "lucide-react";

// Each feature with motion/gradient/hover
const features = [
  {
    icon: LayoutDashboard,
    title: "AI Interview Simulation",
    description: "Intelligent, adaptive interview practice with instant feedback and dynamic question selection.",
  },
  {
    icon: Mic,
    title: "Voice & Video Practice",
    description: "Realistic interview experiences with voice and video, including analysis of your speaking tone, clarity, and confidence.",
  },
  {
    icon: Users,
    title: "Peer Mock Interviews",
    description: "Connect with other learners, perform mock interviews, share feedback in a safe, supportive environment.",
  },
  {
    icon: Layers,
    title: "Career Roadmaps",
    description: "Expert-crafted interview prep paths, resources, and progress tracking for every industry.",
  },
  {
    icon: FileText,
    title: "Smart Resume Analysis",
    description: "Upload and optimize your CV/resume with actionable, AI-driven feedback.",
  },
  {
    icon: Sparkles,
    title: "Emotion & Sentiment Analysis",
    description: "Get insight into your body language, emotions, and how you’re perceived in real interviews.",
  },
];

export function Features() {
  return (
    <section className="py-24 bg-gradient-to-br from-background via-primary/5 to-secondary/5 relative z-10 overflow-hidden">
      <div className="container mx-auto px-4">
        <motion.h2 
          className="text-5xl font-bold text-center mb-12 bg-gradient-to-r from-indigo-500 via-purple-400 to-fuchsia-400 bg-clip-text text-transparent drop-shadow-xl"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          Next-Gen Interview Prep Features
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-9">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, scale: 0.96, y: 30 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ delay: index * 0.075 + 0.12, type: "spring", stiffness: 90 }}
              viewport={{ once: true }}
              className="relative cursor-pointer flex flex-col items-center justify-start rounded-2xl bg-gradient-to-br from-white/70 via-indigo-100/50 to-fuchsia-100/30 dark:from-background dark:via-indigo-900/20 dark:to-fuchsia-900/10 border-b-4 border-indigo-300/50 dark:border-fuchsia-700/30 p-8 group shadow-xl hover:scale-105 transition-all duration-300"
            >
              <div className="flex items-center justify-center mb-6">
                <feature.icon className="w-12 h-12 text-indigo-700 dark:text-fuchsia-300 transition-all group-hover:text-fuchsia-600 group-hover:scale-110" />
              </div>
              <h3 className="text-2xl font-semibold mb-2 text-indigo-900 dark:text-fuchsia-200 tracking-tight">{feature.title}</h3>
              <p className="text-muted-foreground text-base text-center mb-4">{feature.description}</p>
              <div className="flex items-center gap-2 mt-auto font-semibold text-indigo-600 dark:text-fuchsia-300 group-hover:text-fuchsia-600 transition-colors">
                Learn More <ArrowRight className="w-5 h-5 animate-slide-in-right group-hover:translate-x-2 transition-transform" />
              </div>
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-36 h-1 rounded-full bg-gradient-to-r from-indigo-400 via-indigo-200 to-fuchsia-200 opacity-30 blur-md pointer-events-none animate-pulse group-hover:opacity-80 transition"></div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
