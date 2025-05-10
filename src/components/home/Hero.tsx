
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Hero = () => {
  return (
    <section className="py-16 md:py-24 bg-prep-light">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-prep-dark mb-6">
            Prepare, Practice, <span className="text-prep-secondary">Succeed</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-600 mb-8">
            Your comprehensive toolkit for interview preparation, custom-tailored to your career path.
            Flashcards, quizzes, and specialized prep options all in one place.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button asChild className="bg-prep-primary hover:bg-prep-secondary px-8 py-6 text-lg">
              <Link to="/prep-kit">Get Started</Link>
            </Button>
            <Button asChild variant="outline" className="px-8 py-6 text-lg">
              <Link to="#">Learn More</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
