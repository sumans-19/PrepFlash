
import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "./ui/button";
import { MessageSquare, Video, Mic, Link } from "lucide-react";

const modes = [
  {
    id: "chat",
    icon: MessageSquare,
    title: "Chat Practice",
    description: "Text-based interview practice"
  },
  {
    id: "video",
    icon: Video,
    title: "Video Interview",
    description: "Full video interview simulation"
  },
  {
    id: "voice",
    icon: Mic,
    title: "Voice Practice",
    description: "Audio-only interview practice"
  }
];

export function PracticeMode() {
  const [selectedMode, setSelectedMode] = useState("chat");

  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <motion.h2 
          className="text-4xl font-bold text-center mb-12 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          Choose Your Practice Mode
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          {modes.map((mode) => (
            <motion.div
              key={mode.id}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.05 }}
              className={`cursor-pointer rounded-xl p-6 border transition-colors ${
                selectedMode === mode.id
                  ? "bg-primary/10 border-primary"
                  : "bg-card/50 hover:bg-card/80"
              }`}
              onClick={() => setSelectedMode(mode.id)}
            >
              <mode.icon className={`w-12 h-12 mb-4 ${
                selectedMode === mode.id ? "text-primary" : "text-muted-foreground"
              }`} />
              <h3 className="text-xl font-semibold mb-2">{mode.title}</h3>
              <p className="text-muted-foreground mb-4">{mode.description}</p>
              
              <Button
                className={`w-full ${
                  selectedMode === mode.id
                    ? "bg-gradient-to-r from-primary to-secondary text-white"
                    : "bg-muted"
                }`}
              >
                Start Practice
              </Button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
