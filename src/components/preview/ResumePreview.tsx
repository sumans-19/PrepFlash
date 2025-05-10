import React, { useState, useRef, useEffect } from 'react';
import { useResume } from '../../context/ResumeContext';
import { Mail, Phone, MapPin, Linkedin, Globe, Check, X, WandSparkles } from 'lucide-react';
import axios from 'axios';
import html2pdf from 'html2pdf.js';

interface ResumePreviewProps {
  isEditable?: boolean;
}

const ResumePreview: React.FC<ResumePreviewProps> = ({ isEditable = false }) => {
  const { resumeData, currentPrompt } = useResume();
  const { personalInfo, targetRole, experience, education, skills, achievements, additionalInfo } = resumeData;

  const [editingField, setEditingField] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');
  const [loadingPreview, setLoadingPreview] = useState(false);
  const [generatedResume, setGeneratedResume] = useState<string | null>(null);

  const resumeRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const startEditing = (field: string, value: string) => {
    if (!isEditable) return;
    setEditingField(field);
    setEditValue(value);
  };

  const handleDownload = () => {
    if (!iframeRef.current) return;
    
    const iframe = iframeRef.current;
    const iframeDoc = iframe.contentDocument || (iframe.contentWindow && iframe.contentWindow.document);
    
    if (!iframeDoc) return;
    
    html2pdf().set({
      margin: 0,
      filename: 'resume.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 4, dpi: 300, letterRendering: true },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    })
      .from(iframeDoc.body)
      .save();
  };

  const saveEdit = () => {
    // Ideally, update resumeData state or backend here
    setEditingField(null);
  };

  const cancelEdit = () => {
    setEditingField(null);
  };

  const renderEditableText = (content: string, field: string) => {
    if (editingField === field) {
      return (
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            className="flex-grow px-2 py-1 border border-gray-300 rounded-md"
          />
          <button onClick={saveEdit} className="p-1 text-green-600 hover:text-green-700">
            <Check className="w-4 h-4" />
          </button>
          <button onClick={cancelEdit} className="p-1 text-red-600 hover:text-red-700">
            <X className="w-4 h-4" />
          </button>
        </div>
      );
    }

    return (
      <div
        className={`${isEditable ? 'cursor-pointer hover:bg-gray-50 p-1 rounded' : ''}`}
        onClick={() => startEditing(field, content)}
      >
        {content}
      </div>
    );
  };

  const handlePreviewClick = async () => {
    setLoadingPreview(true);
    try {
      const response = await axios.post('http://localhost:8000/api/generate-resume/', {
        resumeData,
        currentPrompt,
      });
      
      if (response.data.generatedResume) {
        setGeneratedResume(response.data.generatedResume);
        
        // After setting the generated resume, we need to set up the iframe
        // This will happen via the useEffect hook
      }
    } catch (error) {
      console.error('Failed to generate resume preview:', error);
    } finally {
      setLoadingPreview(false);
    }
  };

  // Function to set up the iframe with proper HTML content
  const setupIframe = () => {
    if (!iframeRef.current || !generatedResume) return;
    
    const iframe = iframeRef.current;
    const iframeDoc = iframe.contentDocument || (iframe.contentWindow && iframe.contentWindow.document);
    
    if (!iframeDoc) return;
    
    // Clean the HTML (remove markdown code block markers if present)
    const cleanHTML = generatedResume
      .replace(/^```html\n/, '')
      .replace(/```$/, '');
    
    // Create a complete HTML document
    iframeDoc.open();
    iframeDoc.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Resume Preview</title>
          <style>
            body {
              margin: 0;
              padding: 16px;
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            }
            /* Reset all styles to prevent conflicts */
            * {
              box-sizing: border-box;
            }
            /* Add any other global styles for the resume here */
          </style>
        </head>
        <body>
          ${cleanHTML}
        </body>
      </html>
    `);
    iframeDoc.close();
    
    // Adjust iframe height to fit content
    const resizeIframe = () => {
      if (iframe && iframe.contentWindow && iframe.contentWindow.document.body) {
        const height = iframe.contentWindow.document.body.scrollHeight;
        iframe.style.height = `${height + 32}px`; // Add padding
      }
    };
    
    // Handle iframe load event
    iframe.onload = resizeIframe;
    // Also try after a short delay in case onload doesn't fire properly
    setTimeout(resizeIframe, 100);
  };

  // Set up the iframe when generatedResume changes
  useEffect(() => {
    if (generatedResume) {
      setupIframe();
    }
  }, [generatedResume]);

  if (generatedResume) {
    return (
      <div className="bg-white border rounded-md shadow-sm">
        <div 
          ref={resumeRef} 
          className="a4-wrapper"
          style={{
            background: 'white',
            width: '100%',
            boxSizing: 'border-box',
            margin: '0 auto',
          }}
        >
          <iframe 
            ref={iframeRef}
            className="w-full border-0 overflow-hidden" 
            title="Resume Preview"
            style={{ minHeight: '800px' }}
          />
        </div>

        <div className="flex justify-center mt-6">
          <button
            onClick={handleDownload}
            className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
          >
            Download Resume (PDF)
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white text-gray-800 p-8 border border-gray-200 shadow-sm rounded-md">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold text-gray-900">
          {renderEditableText(personalInfo.name || 'Your Name', 'name')}
        </h1>
        <button
          onClick={handlePreviewClick}
          disabled={loadingPreview}
          className="flex items-center gap-2 px-3 py-1 text-white bg-teal-600 hover:bg-teal-700 rounded text-sm"
        >
          <WandSparkles className="w-4 h-4" />
          {loadingPreview ? 'Generating...' : 'Preview Resume'}
        </button>
      </div>
      {/* Add other editable content blocks here */}
    </div>
  );
};

export default ResumePreview;