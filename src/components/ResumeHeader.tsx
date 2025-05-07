import React from 'react';
import { FileText } from 'lucide-react';

const Header: React.FC = () => {
    return (
        <header className="bg-primary text-primary-foreground shadow-md">
            <div className="container mx-auto px-4 py-6 flex items-center">
                <FileText className="h-8 w-8 mr-3" />
                <h1 className="text-2xl font-bold">ResumeBuilder</h1>
            </div>
        </header>

    );
};

export default Header;