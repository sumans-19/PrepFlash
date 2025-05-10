import React from 'react';
import { DashboardNav } from "@/components/DashboardNav";
import { FeatureHero } from '../components2/features/FeatureHero';
import { AIChat } from '../components2/features/AIChat';
import { MultilingualSupport } from '../components2/features/MultilingualSupport';
import { LearningTools } from '../components2/features/LearningTools';
import { Community } from '../components2/features/Community';
import { Footer } from '@/components2/Footer';

export function Features() {
  return (
    <div className="min-h-screen bg-gray-900 text-white relative overflow-x-hidden">
      <DashboardNav />

      <section id="feature-hero" className="relative z-10">
        <FeatureHero />
      </section>
      <section className="relative z-10">
        <AIChat />
      </section>
      <section className="relative z-10">
        <MultilingualSupport />
      </section>
      <section className="relative z-10">
        <LearningTools />
      </section>
      <section className="relative z-10">
        <Community />
      </section>

      <Footer />
    </div>
  );
}
