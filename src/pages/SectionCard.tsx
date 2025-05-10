import { Card } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { Target } from "lucide-react";

interface SectionCardProps {
    title: string;
    icon: React.ReactNode;
    description: string;
    features: string[];
    to: string;
    accentColor: string;
    bgPattern?: string;
    sectionSvg: string;
}

const cardVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    hover: {
        y: -8,
        scale: 1.02,
        boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)",
        transition: { duration: 0.2, ease: "easeOut" }
    }
};

const SectionCard = ({ title, icon, description, features, to, accentColor, bgPattern, sectionSvg }: SectionCardProps) => {
    return (
        <motion.div variants={cardVariants} initial="initial" animate="animate" whileHover="hover" className="w-full">
            <Card className="relative overflow-hidden border dark:border-gray-700 shadow-lg dark:shadow-gray-800/30 dark:bg-gray-800/60 bg-white/80 backdrop-blur-sm h-full max-w-[700px] min-h-[300px] grid grid-cols-1 md:grid-cols-2 mx-auto">
                {bgPattern && (
                    <div className="absolute inset-0 opacity-5" style={{ backgroundImage: `url(${bgPattern})` }} />
                )}
                <div className="absolute inset-0 opacity-10"
                    style={{ background: `linear-gradient(135deg, ${accentColor}40 0%, transparent 100%)` }} />
                <div className="absolute top-0 left-0 w-full h-2" style={{ backgroundColor: accentColor }} />

                <div className="p-6 flex flex-col justify-between">
                    <div>
                        <div className="flex items-center gap-3 mb-4">
                            <span className="p-2.5 rounded-lg" style={{ backgroundColor: `${accentColor}20`, color: accentColor }}>
                                {icon}
                            </span>
                            <h3 className="text-xl font-bold">{title}</h3>
                        </div>
                        <p className="text-sm mb-4 opacity-80 line-clamp-2">{description}</p>
                        <ul className="space-y-2.5">
                            {features.map((feature, index) => (
                                <li key={index} className="flex items-center gap-2.5 text-sm font-medium text-muted-foreground">
                                    <span className="flex-shrink-0 w-5 h-5 flex items-center justify-center rounded-full" style={{ backgroundColor: `${accentColor}20` }}>
                                        <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: accentColor }}></span>
                                    </span>
                                    {feature}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
                <div className="hidden md:flex items-center justify-center p-6 relative z-0">
                    <img src={sectionSvg} alt={title} className="w-4/5 h-auto max-h-56 object-contain" />
                </div>
            </Card>
        </motion.div>
    );
};

export default SectionCard;
