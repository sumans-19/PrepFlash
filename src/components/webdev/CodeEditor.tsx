import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Code as CodeIcon, Play } from 'lucide-react'; // Import icons

interface CodeEditorProps {
  defaultCode: string;
}

const CodeEditor: React.FC<CodeEditorProps> = ({ defaultCode }) => {
  const [code, setCode] = useState(defaultCode);
  const [output, setOutput] = useState<string | null>(null);
  const { toast } = useToast();

  const handleRunCode = () => {
    try {
      const iframeContent = `
        <html>
          <head>
            <style>
              body {
                font-family: system-ui, sans-serif;
                margin: 20px;
                background-color: #0a0a0a; /* Dark cosmic background */
                color: #f0f0f0; /* Light text */
              }
            </style>
          </head>
          <body>
            ${code}
          </body>
        </html>
      `;

      setOutput(iframeContent);
      toast({
        title: "Code Warp Initiated!",
        description: "Your creation is materializing in the preview dimension.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Code Anomaly Detected!",
        description: "A temporal distortion occurred during execution.",
      });
    }
  };

  return (
    <div className="rounded-xl overflow-hidden shadow-lg border border-zinc-700 bg-zinc-800/80 backdrop-blur-md">
      {/* Cosmic Header */}
      <div className="bg-gradient-to-r from-purple-800 to-indigo-900 text-white p-3 flex justify-between items-center">
        <div className="flex space-x-2 animate-pulse">
          <div className="w-3 h-3 rounded-full bg-red-400 shadow-sm"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-400 shadow-sm"></div>
          <div className="w-3 h-3 rounded-full bg-green-400 shadow-sm"></div>
        </div>
        <span className="text-sm text-indigo-200 font-mono">cosmic_code.html</span>
        <div></div>
      </div>

      {/* Code and Output Dimensions */}
      <div className="grid md:grid-cols-2 border-t border-zinc-700">
        {/* Code Nebula */}
        <div className="border-r border-zinc-700">
          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="w-full h-80 p-4 font-mono text-sm bg-zinc-900 text-indigo-100 resize-none focus:outline-none code-editor caret-indigo-300"
            spellCheck="false"
            placeholder="// Begin your cosmic script here..."
          />
        </div>

        {/* Output Portal */}
        <div className="bg-black/80 backdrop-blur-md">
          {output ? (
            <div className="w-full h-80 overflow-auto rounded-sm">
              <iframe
                title="code-output"
                srcDoc={output}
                className="w-full h-full border-0"
                sandbox="allow-scripts"
              />
            </div>
          ) : (
            <div className="w-full h-80 flex items-center justify-center text-indigo-300 font-mono text-sm animate-pulse">
              <CodeIcon className="mr-2 h-5 w-5" /> Awaiting Genesis...
            </div>
          )}
        </div>
      </div>

      {/* Propulsion Unit (Run Button) */}
      <div className="bg-gradient-to-r from-indigo-900 to-purple-800 p-2 flex justify-end">
        <Button
          onClick={handleRunCode}
          className="bg-gradient-to-br from-green-400 to-lime-500 text-gray-900 hover:from-green-500 hover:to-lime-600 shadow-md transition-all duration-200"
        >
          <Play className="mr-2 h-4 w-4" /> Initiate Simulation
        </Button>
      </div>
    </div>
  );
};

export default CodeEditor;