
import React from "react";

/**
 * Mimics the "Personalized Analytics Insights" section. 
 * Uses the uploaded analytics screenshot as the content visual.
 */
export function AnalyticsInsightsDemo() {
  return (
    <section className="relative z-10 py-16 md:py-24 px-2 md:px-0 bg-background">
      <div className="mx-auto max-w-6xl flex flex-col items-center">
        <span className="mb-4 text-xs px-4 py-1.5 rounded-full bg-muted font-bold tracking-wide text-muted-foreground/80 select-none shadow">
          Data-Driven Improvement
        </span>
        <h2 className="text-3xl md:text-5xl font-extrabold text-center mb-3 bg-gradient-to-r from-indigo-400 via-purple-400 to-fuchsia-400 bg-clip-text text-transparent animate-fade-in drop-shadow-md">
          Personalized Analytics <span className="text-fuchsia-400">Insights</span>
        </h2>
        <p className="max-w-xl text-center mb-8 text-base md:text-xl text-muted-foreground/90">
          Track your progress and discover improvement areas with detailed analytics and smart feedback.
        </p>
        {/* Analytics Demo - mimic analytics screenshot */}
        <div className="w-full flex justify-center animate-fade-in">
          <img
            src="/lovable-uploads/0f875996-6743-410b-ba1c-65072e5ad0af.png"
            alt="Analytics Insights"
            className="rounded-2xl shadow-2xl w-full max-w-5xl border border-border"
          />
        </div>
      </div>
    </section>
  );
}

export default AnalyticsInsightsDemo;
