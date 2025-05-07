
import React from 'react';
import InterviewPractice from '@/components/InterviewPractice';
import { DashboardNav } from '@/components/DashboardNav';

const Index = () => {
    return (

        <div className="min-h-screen bg-gradient-to-br from-background via-muted to-background dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
            <DashboardNav />
            <main className="container mx-auto py-8 px-4 mt-12">
                <InterviewPractice />
            </main>


        </div>
    );
};

export default Index;
