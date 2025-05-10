
import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import { motion } from "framer-motion";

/**
 * Modern hero area: left text, right visual (no 3D). 
 * Uses a key demo image as the visual for a crisp, up-to-date first impression.
 */
export function Hero() {
  return (
    <div className="min-h-screen flex flex-col md:flex-row items-center justify-center bg-gradient-to-br from-background via-primary/5 to-secondary/5 relative z-10 pb-0 md:pb-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="container mx-auto px-4 pt-24 flex flex-col md:flex-row items-center gap-8"
      >
        {/* Hero text */}
        <div className="flex-1">
          <motion.h1 
            className="text-5xl md:text-7xl font-extrabold mb-6 bg-gradient-to-r from-indigo-500 via-purple-400 to-fuchsia-400 bg-clip-text text-transparent drop-shadow-xl animate-fade-in"
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            Master Your <span className="text-fuchsia-500">Interview</span> Skills
          </motion.h1>
          <motion.p 
            className="max-w-xl text-xl md:text-2xl mx-auto text-muted-foreground mb-7 font-medium"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            Personalized AI prep, real-time feedback, and confidence-building mock sessions.
          </motion.p>
          <motion.div 
            className="bg-gradient-to-r from-indigo-300/40 to-fuchsia-300/20 rounded-xl p-5 mb-7 mx-auto max-w-lg shadow-lg border border-indigo-400/40"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <p className="text-base md:text-lg text-indigo-900 dark:text-indigo-200 font-semibold animate-fade-in text-center">
              <span className="text-fuchsia-500 font-bold">AI Assists:</span>{" "}
              Emotion-aware interviews, live feedback, resume advice & career planning.<br/>
              <span className="text-violet-800 dark:text-fuchsia-300 font-bold">Try Now:</span>{" "}
              <span className="italic">Gamified modes & real AI interview challenges!</span>
            </p>
          </motion.div>
          <motion.div 
            className="flex gap-6 justify-center md:justify-start"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <Link to="/dashboard">
            <Button className="bg-gradient-to-r from-indigo-500 to-fuchsia-400 hover:opacity-90 hover:scale-110 transition-all text-white px-10 py-6 text-xl rounded-xl shadow-lg">
              Start Practicing
            </Button>
            </Link>
            <Link to="/features">
            <Button variant="outline" className="hover:scale-110 transition-transform px-10 py-6 text-xl rounded-xl border-2 border-indigo-400 dark:border-fuchsia-400 hover:bg-indigo-50 dark:hover:bg-fuchsia-900/10">
              Learn More
            </Button>
            </Link>
          </motion.div>
        </div>
        <div className="flex-1 flex justify-center items-center w-200 h-200">
          <img
            src="/immmi2.png"
            alt="Hero Visual Preview"
            className="rounded-2xl  max-w-md "
            style={{ objectFit: "cover" }}
          />
        </div>
      </motion.div>
    </div>
  );
}
export default Hero;
