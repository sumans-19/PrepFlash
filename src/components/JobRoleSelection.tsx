import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, TrendingUp,Briefcase } from 'lucide-react';
import * as Icons from 'lucide-react';
import { jobRoles } from '@/data/jobRoles';
import { ThemeToggle } from './ui/theme-toggle';
import { motion } from 'framer-motion';
import { DashboardNav } from './DashboardNav';

interface Category {
    id: string;
    name: string;
}

const categories: Category[] = [
    { id: 'all', name: 'All' },
    { id: 'development', name: 'Development' },
    { id: 'data', name: 'Data & AI' },
    { id: 'operations', name: 'Cloud & DevOps' },
    { id: 'security', name: 'Cybersecurity' },
    { id: 'quality', name: 'Testing & QA' },
    { id: 'design', name: 'Design & UI/UX' },
    { id: 'it', name: 'IT & Systems' },
    { id: 'management', name: 'Business & Tech' },
];

const JobRoleSelection: React.FC = () => {
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');

    const filteredRoles = useMemo(() => {
        return jobRoles.filter(role => {
            const matchesSearch =
                role.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                role.description.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesCategory = selectedCategory === 'all' || role.category === selectedCategory;
            return matchesSearch && matchesCategory;
        });
    }, [searchQuery, selectedCategory]);

    const popularRoles = useMemo(() => {
        return jobRoles.filter(role => role.popular);
    }, []);

    const getIcon = (iconName: string) => {
        const Icon = (Icons as any)[iconName];
        return Icon ? <Icon size={24} /> : <Icons.Code size={24} />;
    };

    return (
        <>
            <div className="min-h-screen bg-gradient-to-br from-background via-muted to-background dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
                  <DashboardNav />

            <div className="min-h-screen bg-gradient-to-b from-background to-background/80 mt-5">
                <div className="max-w-7xl mx-auto px-4 py-12">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="text-center mb-12"
                    >
                        <h1 className="text-4xl font-bold mb-4 mt-4">
                            Prepare for Your Dream Job Interview
                        </h1>
                        <p className="text-lg text-muted-foreground">
                            Select your target role to practice with job-specific flashcards and quizzes
                        </p>
                    </motion.div>

                    {/* Search and Filter */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2, duration: 0.6 }}
                        className="flex flex-col md:flex-row gap-4 mb-12"
                    >
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
                            <input
                                type="text"
                                placeholder="Search for a role..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 rounded-lg border border-border bg-card focus:outline-none focus:ring-2 focus:ring-primary/20"
                            />
                        </div>
                        <select
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                            className="px-4 py-2 rounded-lg border border-border bg-card focus:outline-none focus:ring-2 focus:ring-primary/20"
                        >
                            {categories.map(category => (
                                <option key={category.id} value={category.id}>
                                    {category.name}
                                </option>
                            ))}
                        </select>
                    </motion.div>

                    {/* Popular Roles */}
                    {searchQuery === '' && selectedCategory === 'all' && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.4 }}
                            className="mb-12"
                        >
                            <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                                <TrendingUp size={20} className="text-primary" />
                                Popular Roles
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {popularRoles.map((role, index) => (
                                    <motion.button
                                        key={role.id}
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.98 }}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.05 }}
                                        onClick={() => navigate(`/prep-options/${role.id}`)}
                                        className="group p-6 rounded-xl border border-border bg-card hover:bg-accent/10 transition-all duration-300 shadow-sm hover:shadow-lg"
                                    >
                                        <div className="flex items-start gap-4">
                                            <div className="p-3 rounded-lg bg-primary/10 text-primary">
                                                {getIcon(role.icon)}
                                            </div>
                                            <div className="text-left">
                                                <h3 className="font-semibold mb-1 group-hover:text-primary transition-colors">
                                                    {role.name}
                                                </h3>
                                                <p className="text-sm text-muted-foreground">
                                                    {role.description}
                                                </p>
                                            </div>
                                        </div>
                                    </motion.button>
                                ))}
                            </div>
                        </motion.div>
                    )}
                    <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                                <Briefcase size={20} className="text-primary" />
                                Other Roles
                            </h2>

                    {/* All Roles Grid */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
                    >
                        {filteredRoles.map((role, index) => (
                            <motion.button
                                key={role.id}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.98 }}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                                onClick={() => navigate(`/prep-options/${role.id}`)}
                                className="group p-6 rounded-xl border border-border bg-card hover:bg-accent/10 transition-all duration-300 shadow-sm hover:shadow-lg"
                            >
                                <div className="flex items-start gap-4">
                                    <div className="p-3 rounded-lg bg-primary/10 text-primary">
                                        {getIcon(role.icon)}
                                    </div>
                                    <div className="text-left">
                                        <h3 className="font-semibold mb-1 group-hover:text-primary transition-colors">
                                            {role.name}
                                        </h3>
                                        <p className="text-sm text-muted-foreground">
                                            {role.description}
                                        </p>
                                    </div>
                                </div>
                            </motion.button>
                        ))}
                    </motion.div>

                    {filteredRoles.length === 0 && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.5 }}
                            className="text-center py-12"
                        >
                            <p className="text-muted-foreground">
                                No roles found matching your search criteria
                            </p>
                        </motion.div>
                    )}
                </div>
            </div>
            </div>
        </>
    );
};

export default JobRoleSelection;
