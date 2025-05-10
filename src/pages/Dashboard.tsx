import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Sparkles, Terminal, BookMarked, BookOpen, Users, GitBranch, User, Monitor, Target } from "lucide-react";
import { DashboardNav } from '@/components/DashboardNav';
import { useTheme } from '@/components/ui/theme-provider';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import SectionCard from './SectionCard'; // Adjust the path as needed

// SVG imports
import MockInterviewSVG2 from '@/assets/svgs/undraw_interview_yz52.svg';
import CodingSVG from '@/assets/svgs/undraw_programmer_raqr.svg';
import StudyToolkitSVG from '@/assets/svgs/studytoolkit.svg';
import LearningHubSVG from '@/assets/svgs/learninghub.svg';
import DevCommunitySVG from '@/assets/svgs/devcommunity.svg';
import CodeLabSVG from '@/assets/svgs/codelab.svg';
import DevProfileSVG from '@/assets/svgs/profile.svg';
import TechRadarSVG from '@/assets/svgs/technews.svg';
import Resume from '@/assets/svgs/undraw_resume-folder_hf4p.svg';
import Jobs from '@/assets/svgs/undraw_career-progress_vfq5.svg';
import { motion } from 'framer-motion';

const Dashboard = () => {
    const [userName, setUserName] = useState("");
    const [timeOfDay, setTimeOfDay] = useState("");
    const { theme } = useTheme();
    const isDark = theme === 'dark';
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserName = async () => {
            if (auth.currentUser) {
                const userDoc = await getDoc(doc(db, 'profiles', auth.currentUser.uid));
                if (userDoc.exists()) {
                    setUserName(userDoc.data().firstName || '');
                }
            }
        };
        fetchUserName();

        const hour = new Date().getHours();
        setTimeOfDay(hour < 12 ? "morning" : hour < 17 ? "afternoon" : "evening");
    }, []);

    const patternUrl = isDark
        ? "data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' fill='none' xmlns='http://www.w3.org/2000/svg'><path d='M0 0L20 20M20 0L0 20' stroke='%234A5568' stroke-opacity='0.12' stroke-width='1.5'/></svg>"
        : "data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' fill='none' xmlns='http://www.w3.org/2000/svg'><path d='M0 0L20 20M20 0L0 20' stroke='%23A0AEC0' stroke-opacity='0.1' stroke-width='1.5'/></svg>";

    const codePatternUrl = isDark
        ? "data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' fill='none' xmlns='http://www.w3.org/2000/svg'><rect x='0' y='0' width='2' height='2' fill='%234A5568' fill-opacity='0.15'/></svg>"
        : "data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' fill='none' xmlns='http://www.w3.org/2000/svg'><rect x='0' y='0' width='2' height='2' fill='%23A0AEC0' fill-opacity='0.1'/></svg>";

    const getRandomEmoji = () => {
        const emojis = ["💻", "🚀", "⚡", "🔥", "✨", "🎯", "🧠", "🔍"];
        return emojis[Math.floor(Math.random() * emojis.length)];
    };

    const sections = [
        {
            title: "Mock Interview",
            icon: <Sparkles className="h-5 w-5" />,
            description: "Master your interview skills with our AI-powered mock interview system.",
            features: ["Interactive AI-driven interview practice", "Real-time performance feedback"],
            to: "/practice",
            accentColor: "#9b87f5",
            bgPattern: patternUrl,
            sectionSvg: MockInterviewSVG2
        },
        {
            title: "Aptitude Analysis",
            icon: <Terminal className="h-5 w-5" />,
            description: "Comprehensive aptitude preparation with topic-specific questions.",
            features: ["Topic, difficulty & company specific", "Daily coding challenges"],
            to: "/aptitudehome",
            accentColor: "#7E69AB",
            bgPattern: codePatternUrl,
            sectionSvg: CodingSVG
        },
        {
            title: "Preparation Toolkit",
            icon: <BookMarked className="h-5 w-5" />,
            description: "Structured preparation tools and resources for comprehensive interview prep.",
            features: ["Formula cards and flashcards", "Mini quizzes and practice sets"],
            to: "/prep-kit",
            accentColor: "#D6BCFA",
            bgPattern: patternUrl,
            sectionSvg: StudyToolkitSVG
        },
        {
            title: "Learning ToolKit",
            icon: <BookOpen className="h-5 w-5" />,
            description: "Customized learning paths and resources for skill development.",
            features: ["Role-based learning roadmaps", "Smart resume builder"],
            to: "/learningtoolkit",
            accentColor: "#b0a1f8",
            bgPattern: patternUrl,
            sectionSvg: LearningHubSVG
        },
        {
            title: "Community Collab",
            icon: <Users className="h-5 w-5" />,
            description: "Connect with peers and engage in collaborative learning.",
            features: ["Discussion forums and Q&A", "Daily tech trends and insights"],
            to: "/community",
            accentColor: "#8870f3",
            bgPattern: patternUrl,
            sectionSvg: DevCommunitySVG
        },
        {
            title: "Project Zone",
            icon: <GitBranch className="h-5 w-5" />,
            description: "Hands-on project experience and portfolio building.",
            features: ["Mini and mega projects", "Challenge-based learning"],
            to: "/projects",
            accentColor: "#a792f2",
            bgPattern: codePatternUrl,
            sectionSvg: CodeLabSVG
        },
        {
            title: "Behavioral Hub",
            icon: <User className="h-5 w-5" />,
            description: "Manage your well versed behaviour and track your progress.",
            features: ["Skills assessment and tracking", "Resume builder and analyzer"],
            to: "/behaviour",
            accentColor: "#9b9bf5",
            bgPattern: patternUrl,
            sectionSvg: DevProfileSVG
        },
        {
            title: "Tech Trends",
            icon: <Monitor className="h-5 w-5" />,
            description: "Stay updated with latest industry trends and insights.",
            features: ["Daily tech news digest", "Industry insights and analysis"],
            to: "/tech-news",
            accentColor: "#9f87f5",
            bgPattern: patternUrl,
            sectionSvg: TechRadarSVG
        },
        {
            title: "Resume Replit",
            icon: <Monitor className="h-5 w-5" />,
            description: "Resume generator and Resume Analyser",
            features: ["Upload resume", "generate & analysis"],
            to: "/resume-builder",
            accentColor: "#A3BDF9",
            bgPattern: patternUrl,
            sectionSvg: Resume
        },
        {
            title: "Job & Interviews",
            icon: <Monitor className="h-5 w-5" />,
            description: "Stay updated with latest job and internship oportunities.",
            features: ["Daily Job Updates", "Internship insights and analysis"],
            to: "/tech-hub",
            accentColor: "#D0A9FF",
            bgPattern: patternUrl,
            sectionSvg: Jobs
        }
    ];

    return (
        <div className={`min-h-screen`}>
            <DashboardNav />
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-20 relative z-10">
                <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
                    <div className="inline-block mb-4 px-5 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium">
                        <Calendar className="inline w-4 h-4 mr-2" /> {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                    </div>
                    <h1 className="text-4xl md:text-5xl font-extrabold mb-5 bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-600">
                        Good {timeOfDay}, {userName || "Developer"} {getRandomEmoji()}
                    </h1>
                    <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
                        Your personalized tech preparation platform. Let's level up your skills today!
                    </p>
                </motion.div>

                {/* Grid to ensure two cards per row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-8">
                    {sections.map((section, index) => (
                        <div key={index} className="flex flex-col justify-between">
                            <SectionCard {...section} />
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.2 * index }}
                                className="mt-4"
                            >
                                <button
                                    onClick={() => navigate(section.to)}
                                    className="flex items-center justify-center gap-2 py-2 px-4 rounded-lg font-medium text-white shadow-md transition-all hover:shadow-lg text-sm sm:text-base w-full"
                                    style={{
                                        background: `linear-gradient(135deg, ${section.accentColor} 0%, ${section.accentColor}90 100%)`
                                    }}
                                >
                                    <Target className="w-4 h-4" />
                                    {section.title}
                                </button>
                            </motion.div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
