import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FileText, BookOpen, ArrowLeft, ArrowRight } from 'lucide-react';
import { jobRoles } from '@/data/jobRoles';
import { ThemeToggle } from './ui/theme-toggle';
import { DashboardNav } from './DashboardNav';

const PrepOptions: React.FC = () => {
    const { roleId } = useParams<{ roleId: string }>();
    const navigate = useNavigate();

    // Find the selected job role
    const selectedRole = jobRoles.find(role => role.id === roleId);

    if (!selectedRole) {
        return (
            <div className="text-center py-12">
                <h2 className="text-xl font-medium text-muted-foreground">Role not found. Please select a valid role.</h2>
                <button
                    onClick={() => navigate('/')}
                    className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-md"
                >
                    Go Back
                </button>
            </div>
        );
    }

    const options = [
        {
            id: 'flash-cards',
            title: 'Flash Cards',
            description: 'Learn and review key concepts with our interactive flash cards',
            icon: <BookOpen size={24} />,
            path: `/flash-cards/${roleId}`
        },
        {
            id: 'mini-quiz',
            title: 'Mini Quiz',
            description: 'Test your knowledge with timed quizzes specific to your role',
            icon: <FileText size={24} />,
            path: `/quiz/${roleId}`
        }
    ];

    return (
        <>
            <div className="min-h-screen bg-gradient-to-br from-background via-muted to-background dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
                  <DashboardNav />


            <div className="max-w-4xl mx-auto mt-10">
                <button
                    onClick={() => navigate('/prep-kit')}
                    className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8"
                >
                    <ArrowLeft size={16} />
                    Back to Role Selection
                </button>

                <div className="text-center mb-12">
                    <h1 className="text-3xl font-bold mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                        Prepare for {selectedRole.name} Interview
                    </h1>
                    <p className="text-muted-foreground max-w-2xl mx-auto">
                        Choose how you'd like to prepare for your upcoming interview. Both options are tailored specifically for {selectedRole.name} positions.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {options.map((option) => (
                        <div
                            key={option.id}
                            onClick={() => navigate(option.path)}
                            className="
              relative overflow-hidden rounded-xl border border-border bg-card 
              hover:shadow-md hover:border-primary/50 transition-all duration-300
              cursor-pointer group
            "
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-secondary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            <div className="relative p-8 flex flex-col items-center text-center gap-4">
                                <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                                    {option.icon}
                                </div>
                                <div>
                                    <h3 className="text-xl font-medium">{option.title}</h3>
                                    <p className="text-muted-foreground mt-2">{option.description}</p>
                                </div>
                                <span className="mt-4 inline-flex items-center text-primary font-medium">
                                    Get Started
                                    <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            </div>
        </>
    );
};

export default PrepOptions;