
import React from 'react';
import { Card } from '@/components/ui/card';
import { Download, Github, ExternalLink, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';

const ExportGuide: React.FC = () => {
  return (
    <Card className="p-6 bg-gradient-to-br from-slate-50 to-slate-100 border border-slate-200">
      <div className="flex items-start gap-4">
        <div className="p-2 bg-blue-100 rounded-full">
          <Info className="h-6 w-6 text-blue-600" />
        </div>
        <div className="flex-1">
          <h2 className="text-xl font-semibold mb-2">How to Export Your Project</h2>
          <p className="text-muted-foreground mb-4">
            There are several ways to export and save your code from Lovable to your local machine:
          </p>
          
          <div className="space-y-4">
            <div className="p-4 bg-white rounded-lg border border-slate-200">
              <h3 className="font-medium text-lg mb-2 flex items-center">
                <Github className="h-5 w-5 mr-2" /> 
                GitHub Integration (Recommended)
              </h3>
              <p className="text-sm text-muted-foreground mb-3">
                Connect to GitHub to push your project to a repository.
              </p>
              <ol className="list-decimal pl-5 text-sm space-y-1 mb-3">
                <li>Click the GitHub button in the top right corner</li>
                <li>Follow the prompts to connect your account</li>
                <li>Push your project to a new or existing repository</li>
                <li>Clone the repository locally using git commands</li>
              </ol>
              <Button variant="outline" className="w-full">
                <Github className="h-4 w-4 mr-2" /> 
                Connect to GitHub
              </Button>
            </div>
            
            <div className="p-4 bg-white rounded-lg border border-slate-200">
              <h3 className="font-medium text-lg mb-2 flex items-center">
                <Download className="h-5 w-5 mr-2" /> 
                Download as ZIP
              </h3>
              <p className="text-sm text-muted-foreground mb-3">
                Download a complete ZIP archive of your project files.
              </p>
              <ol className="list-decimal pl-5 text-sm space-y-1 mb-3">
                <li>Click on Project in the top menu</li>
                <li>Select "Download as ZIP"</li>
                <li>Save the ZIP file to your preferred location</li>
                <li>Extract the files to start working locally</li>
              </ol>
              <Button variant="outline" className="w-full">
                <Download className="h-4 w-4 mr-2" /> 
                Download ZIP
              </Button>
            </div>
            
            <div className="p-4 bg-white rounded-lg border border-slate-200">
              <h3 className="font-medium text-lg mb-2 flex items-center">
                <ExternalLink className="h-5 w-5 mr-2" /> 
                Dev Mode Access
              </h3>
              <p className="text-sm text-muted-foreground mb-3">
                View and copy individual files using the Dev Mode.
              </p>
              <ol className="list-decimal pl-5 text-sm space-y-1">
                <li>Toggle "Dev Mode" in the top left corner</li>
                <li>Browse the file explorer to find your files</li>
                <li>Click on files to view their content</li>
                <li>Copy and save files individually to your local system</li>
              </ol>
            </div>
          </div>
          
          <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
            <h4 className="font-medium flex items-center text-amber-800">
              <Info className="h-4 w-4 mr-2" />
              Important Note
            </h4>
            <p className="text-sm text-amber-700 mt-1">
              Remember to set up the <code>VITE_GEMINI_API_KEY</code> in your <code>.env</code> file after exporting the project 
              to ensure the Gemini AI integration continues to work.
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default ExportGuide;
