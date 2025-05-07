import React, { useState ,useRef} from 'react';
import { useResumeContext } from '../../context/ResumeContext';
import { Mail, Phone, MapPin, Linkedin, Globe, Check, X, WandSparkles } from 'lucide-react';
import axios from 'axios';
import html2pdf from 'html2pdf.js';

interface ResumePreviewProps {
  isEditable?: boolean;
}

const ResumePreview: React.FC<ResumePreviewProps> = ({ isEditable = false }) => {
  const { resumeData } = useResumeContext();
  const { personalInfo, targetRole, experience, education, skills, achievements, additionalInfo } = resumeData;

  const [editingField, setEditingField] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');
  const [loadingPreview, setLoadingPreview] = useState(false);
  const [generatedResume, setGeneratedResume] = useState<string | null>(null);

  const startEditing = (field: string, value: string) => {
    if (!isEditable) return;
    setEditingField(field);
    setEditValue(value);
  };
  const resumeRef = useRef<HTMLDivElement>(null);

  const handleDownload = () => {
    if (!resumeRef.current) return;

    html2pdf().set({
      margin: 0,
      filename: 'resume.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 4, dpi: 300, letterRendering: true },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    })
      .from(resumeRef.current)
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
      const response = await axios.post('http://localhost:8000/api/generate-resume/', { resumeData });
      if (response.data.generatedResume) {
        console.log(response.data.generatedResume)
        setGeneratedResume(response.data.generatedResume); // Expecting clean HTML from backend
      }
    } catch (error) {
      console.error('Failed to generate resume preview:', error);
    } finally {
      setLoadingPreview(false);
    }
  };



  if (generatedResume) {
    const cleanHTML = generatedResume
      .replace(/^```html\n/, '') // Remove starting ```html and the following newline
      .replace(/```$/, '');

    return (
      <div className="bg-white border rounded-md shadow-sm">
        <div
          ref={resumeRef}
          style={{
            background: 'white',
            boxSizing: 'border-box'
          }}
        >
          <div style={{boxSizing: 'border-box', width: '100%', height: '100%' }}>
            <div
              className="prose max-w-none"
              dangerouslySetInnerHTML={{ __html: cleanHTML }}
            />
          </div>
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

      {/* You can continue rendering other editable fields if needed */}
    </div>
  );
};

export default ResumePreview;
