import React, { useState } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';

import { FileText, Upload, Loader2 } from 'lucide-react';
import Header from './ResumeHeader';
import Navigation from './ResumeNav';

import 'pdfjs-dist/build/pdf.worker.entry';

import * as pdfjsLib from 'pdfjs-dist';

pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

interface ATSResponse {
    score: number;
    improvements: string[];
    suggestions: string[];
}

const ATSScoreChecker: React.FC = () => {
    const [file, setFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<ATSResponse | null>(null);
    const [error, setError] = useState<string | null>(null);

    const extractTextFromPDF = async (file: File): Promise<string> => {
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
        let fullText = '';

        for (let i = 1; i <= pdf.numPages; i++) {
            const page = await pdf.getPage(i);
            const textContent = await page.getTextContent();
            const pageText = textContent.items.map((item: any) => item.str).join(' ');
            fullText += pageText + '\n';
        }

        return fullText;
    };

    const analyzeWithGemini = async (text: string): Promise<ATSResponse> => {
        const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ 
            model: 'gemini-2.0-flash',
           
        });

        const prompt = `
      You are an ATS (Applicant Tracking System) expert. Analyze this resume thoroughly and provide:
      1. An ATS compatibility score (0-100)
      2. List of improvements needed
      3. Specific suggestions for better ATS optimization
      
      Resume text:
      ${text}
      
      You must respond ONLY with a valid JSON object using this exact structure:
      {
        "score": number,
        "improvements": string[],
        "suggestions": string[]
      }
      
      Do not include any text before or after the JSON object. Return only the JSON.
    `;

        try {
            const result = await model.generateContent(prompt);
            const response = await result.response;
            const responseText = response.text();
            
            // Try to extract JSON from the response if it's not already pure JSON
            let jsonStr = responseText;
            
            // Look for JSON-like pattern in case the model adds extra text
            const jsonMatch = responseText.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                jsonStr = jsonMatch[0];
            }
            
            try {
                return JSON.parse(jsonStr);
            } catch (parseError) {
                console.error("JSON parse error:", parseError);
                console.log("Raw response:", responseText);
                
                // Fallback response if parsing fails
                return {
                    score: 50,
                    improvements: ["Could not parse AI response. Try again or check PDF format."],
                    suggestions: ["Ensure your PDF is properly formatted and text is extractable."]
                };
            }
        } catch (error) {
            console.error("Gemini API error:", error);
            throw new Error("Failed to analyze resume with AI");
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const selectedFile = e.target.files[0];
            if (selectedFile.type === 'application/pdf') {
                setFile(selectedFile);
                setError(null);
            } else {
                setError('Please upload a PDF file');
                setFile(null);
            }
        }
    };

    const handleAnalyze = async () => {
        if (!file) return;

        try {
            setLoading(true);
            setError(null);
            const text = await extractTextFromPDF(file);
            const analysis = await analyzeWithGemini(text);
            setResult(analysis);
        } catch (err) {
            setError('Error analyzing resume. Please try again.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Header />
            <Navigation />
            <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-sm p-6 mt-8">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">ATS Score Checker</h2>
                <p className="text-gray-600 mb-6">Upload your resume to check its ATS compatibility score</p>

                <div className="space-y-6">
                    <div className="flex items-center justify-center w-full">
                        <label
                            htmlFor="pdf-upload"
                            className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer
              ${file ? 'border-teal-600 bg-teal-50' : 'border-gray-300 bg-gray-50'} 
              hover:bg-gray-100 transition-colors`}
                        >
                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                {file ? (
                                    <>
                                        <FileText className="w-8 h-8 mb-2 text-teal-600" />
                                        <p className="text-sm text-gray-700">{file.name}</p>
                                    </>
                                ) : (
                                    <>
                                        <Upload className="w-8 h-8 mb-2 text-gray-500" />
                                        <p className="mb-2 text-sm text-gray-700">
                                            <span className="font-semibold">Click to upload</span> or drag and drop
                                        </p>
                                        <p className="text-xs text-gray-500">PDF files only</p>
                                    </>
                                )}
                            </div>
                            <input
                                id="pdf-upload"
                                type="file"
                                accept=".pdf"
                                className="hidden"
                                onChange={handleFileChange}
                            />
                        </label>
                    </div>

                    {error && (
                        <p className="text-red-600 text-sm text-center">{error}</p>
                    )}

                    <div className="flex justify-center">
                        <button
                            onClick={handleAnalyze}
                            disabled={!file || loading}
                            className={`inline-flex items-center px-4 py-2 rounded-md text-white
              ${!file || loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-teal-600 hover:bg-teal-700'}
              transition-colors`}
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    Analyzing...
                                </>
                            ) : (
                                'Analyze Resume'
                            )}
                        </button>
                    </div>

                    {result && (
                        <div className="mt-6 p-6 bg-white rounded-lg shadow-sm border border-gray-200">
                            <div className="mb-4">
                                <div className="flex items-center justify-between mb-2">
                                    <h3 className="text-lg font-semibold">ATS Compatibility Score</h3>
                                    <span className={`text-2xl font-bold
                  ${result.score >= 80 ? 'text-green-600' :
                                            result.score >= 60 ? 'text-yellow-600' : 'text-red-600'}`}
                                    >
                                        {result.score}%
                                    </span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2.5">
                                    <div
                                        className={`h-2.5 rounded-full
                    ${result.score >= 80 ? 'bg-green-600' :
                                                result.score >= 60 ? 'bg-yellow-600' : 'bg-red-600'}`}
                                        style={{ width: `${result.score}%` }}
                                    ></div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <h4 className="font-semibold text-gray-800 mb-2">Needed Improvements</h4>
                                    <ul className="list-disc list-inside space-y-1">
                                        {result.improvements.map((improvement, index) => (
                                            <li key={index} className="text-gray-600">{improvement}</li>
                                        ))}
                                    </ul>
                                </div>

                                <div>
                                    <h4 className="font-semibold text-gray-800 mb-2">Suggestions</h4>
                                    <ul className="list-disc list-inside space-y-1">
                                        {result.suggestions.map((suggestion, index) => (
                                            <li key={index} className="text-gray-600">{suggestion}</li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default ATSScoreChecker;