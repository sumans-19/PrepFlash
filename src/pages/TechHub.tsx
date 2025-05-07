import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Header from "../components/NewsHeader";
// import Footer from "../components/Footer";
import NewsSection from "../components/NewsSection";
import JobsSection from "../components/JobsSection";
import InternshipsSection from "@/components/InternshipsSection";

const Index = () => {
  const [activeTab, setActiveTab] = useState("news");

  return (
    <div className="min-h-screen flex flex-col">
      <Header activeTab={activeTab} onTabChange={setActiveTab} />
      
      <main className="flex-1">
        {activeTab === "news" ? (
          <NewsSection />
        ) : activeTab === "jobs" ? (
          <JobsSection />
        ) : (
          <InternshipsSection />
        )}
      </main>
      
      {/* <Footer /> */}
    </div>
  );
};

export default Index;