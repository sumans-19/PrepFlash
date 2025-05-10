// ResumeBuilderPage.tsx
import { ResumeProvider } from '../context/ResumeContext';
import ResumeBuilder from '@/components/ResumeBuilder';
import Header from '@/components/ResumeHeader';
import Navigation from '@/components/ResumeNav';


const ResumeBuilderPage = () => {
    return (
        <ResumeProvider>
           
            <div className="min-h-screen bg-background text-foreground">
                <Header/>
                <Navigation/>
                <main className="container mx-auto px-4 py-8 ">
                    <ResumeBuilder />
                </main>
            </div>
        </ResumeProvider>

    );
};

export default ResumeBuilderPage;