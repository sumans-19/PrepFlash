
import { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "./ui/tabs";
import { Mic, Video, MessageSquare } from "lucide-react";

/** Demo visuals ("screenshots") are represented using the uploaded images or stylized cards to mimic your screenshots */
const tabData = [
  {
    id: "chat",
    label: "Text Chat",
    icon: <MessageSquare className="mr-2" />,
    visual: (
      <img
        src="/lovable-uploads/d9399170-86a6-40ff-8784-162bca04697f.png"
        alt="Text-based Interview Example"
        className="rounded-2xl shadow-xl w-full max-w-3xl mx-auto"
      />
    ),
  },
  {
    id: "audio",
    label: "Voice Audio",
    icon: <Mic className="mr-2" />,
    visual: (
      <img
        src="/lovable-uploads/6e0dedf8-bfa5-4619-bbf2-f99e0619c690.png"
        alt="Audio Interview Example"
        className="rounded-2xl shadow-xl w-full max-w-3xl mx-auto"
      />
    ),
  },
  {
    id: "video",
    label: "Live Video",
    icon: <Video className="mr-2" />,
    visual: (
      <img
        src="/lovable-uploads/87c9473e-ae26-410c-a03d-09a239bc2d80.png"
        alt="Video Interview Example"
        className="rounded-2xl shadow-xl w-full max-w-3xl mx-auto"
      />
    ),
  },
];

export function InterviewModesDemo() {
  const [tab, setTab] = useState("chat");
  return (
    <section className="relative z-10 py-16 md:py-24 px-2 md:px-0 bg-background">
      <div className="mx-auto max-w-5xl flex flex-col items-center">
        {/* Badge */}
        <span className="mb-4 text-xs px-4 py-1.5 rounded-full bg-muted font-bold tracking-wide text-muted-foreground/80 select-none shadow">
          Interview Technology
        </span>
        {/* Title */}
        <h2 className="text-3xl md:text-5xl font-extrabold text-center mb-3 bg-gradient-to-r from-indigo-400 via-purple-400 to-fuchsia-400 bg-clip-text text-transparent animate-fade-in drop-shadow-md">
          Personalized <span className="animate-pulse text-indigo-400">Interview Experiences</span>
        </h2>
        <p className="max-w-2xl text-center mb-7 md:mb-10 text-base md:text-xl text-muted-foreground/90">
          Choose your comfort level and gradually build confidence with our adaptive interview formats.
        </p>
        {/* Tabs for Interview Modes */}
        <Tabs value={tab} onValueChange={setTab} className="w-full flex flex-col items-center">
          <TabsList className="mb-7 flex gap-1 rounded-xl bg-card/80 overflow-x-auto">
            {tabData.map((mode) => (
              <TabsTrigger key={mode.id} value={mode.id} className="flex items-center px-6 md:px-8 py-2 text-lg font-medium rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-700 data-[state=active]:to-fuchsia-500 data-[state=active]:text-white transition-all">
                {mode.icon}
                {mode.label}
              </TabsTrigger>
            ))}
          </TabsList>
          {/* Animated Visual per tab */}
          {tabData.map((mode) => (
            <TabsContent key={mode.id} value={mode.id} forceMount>
              <div className="min-h-[430px] flex justify-center items-center">
                {mode.visual}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </section>
  );
}

export default InterviewModesDemo;

