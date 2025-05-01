
import React, { useState, useRef } from 'react';
import { DashboardNav } from '@/components/DashboardNav';
import { toast } from 'sonner';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import {
  Button
} from "@/components/ui/button";
import {
  Input
} from "@/components/ui/input";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  RotateCw,
  Lightbulb,
  BookOpen,
  Calculator,
  Code,
  Sparkles,
  ChevronDown
} from 'lucide-react';
import { generateAptitudeBrushUp } from '@/lib/gemini.sdk';

const AptitudeBrushUp = () => {
  const [topic, setTopic] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [contentGenerated, setContentGenerated] = useState(false);
  const [theory, setTheory] = useState('');
  const [formulas, setFormulas] = useState('');
  const [examples, setExamples] = useState('');
  
  // Refs for each section to enable scrolling
  const theoryRef = useRef<HTMLDivElement>(null);
  const formulasRef = useRef<HTMLDivElement>(null);
  const examplesRef = useRef<HTMLDivElement>(null);

  const handleGenerateBrushUp = async () => {
    if (!topic) {
      toast.error('Please enter a topic for brush up');
      return;
    }

    setIsGenerating(true);
    setContentGenerated(false);
    setTheory('');
    setFormulas('');
    setExamples('');

    try {
      toast.info('Generating brush-up content...', {
        description: `Creating comprehensive review for ${topic}`
      });

      const result = await generateAptitudeBrushUp({ topic });
      
      // Process the content to format it properly
      setTheory(formatContent(result.theory));
      setFormulas(formatContent(result.formulas));
      setExamples(formatContent(result.examples));
      
      toast.success('Brush-up content generated!', {
        description: 'All sections have been populated with relevant information'
      });
      setContentGenerated(true);
    } catch (error) {
      console.error('Error generating brush-up content:', error);
      toast.error('Failed to generate content', {
        description: 'Please try again or try a different topic'
      });
    } finally {
      setIsGenerating(false);
    }
  };

  // Function to format the content by removing any markdown formatting and properly formatting sections
  const formatContent = (content: string): string => {
    // Remove any excessive asterisks for bold formatting
    let formatted = content.replace(/\*\*/g, '');
    return formatted;
  };

  // Function to scroll to a specific section
  const scrollToSection = (ref: React.RefObject<HTMLDivElement>) => {
    if (ref.current) {
      ref.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Extract examples from the examples text
  const parseExamples = () => {
    if (!examples) return [];
    
    const exampleBlocks: {title: string, problem: string, solution: string[]}[] = [];
    const exampleSections = examples.split('Example');
    
    for (let i = 1; i < exampleSections.length; i++) {
      const section = exampleSections[i];
      const titleMatch = section.match(/^\s*\d+:\s*(.*?)Problem:/);
      const title = titleMatch ? titleMatch[1].trim() : `Example ${i}`;
      
      const [problemPart, solutionPart] = section.split('Solution:');
      
      const problem = problemPart ? problemPart.replace(/^\s*\d+:\s*/, '').trim() : '';
      
      // Parse solution steps
      const solutionSteps = solutionPart
        ? solutionPart
            .split('\n')
            .filter(step => step.trim().length > 0)
            .map(step => step.trim().replace(/^\d+\.\s*/, ''))
        : [];
      
      exampleBlocks.push({
        title: `Example ${i}: ${title}`,
        problem,
        solution: solutionSteps
      });
    }
    
    return exampleBlocks;
  };

  // Function to format mathematical formulas with proper notation
  const formatFormula = (formula: string): string => {
    // Replace LaTeX style fractions with properly styled ones
    let formatted = formula
      // Format fractions properly
      .replace(/\\frac\{([^}]*)\}\{([^}]*)\}/g, '<span class="formula-fraction"><span class="formula-numerator">$1</span><span class="formula-denominator">$2</span></span>')
      // Format subscripts
      .replace(/\_\{([^}]*)\}/g, '<sub>$1</sub>')
      // Format superscripts
      .replace(/\^\{([^}]*)\}/g, '<sup>$1</sup>')
      // Format Greek letters
      .replace(/\\Delta/g, 'Δ')
      .replace(/\\delta/g, 'δ')
      .replace(/\\alpha/g, 'α')
      .replace(/\\beta/g, 'β')
      .replace(/\\gamma/g, 'γ')
      .replace(/\\theta/g, 'θ')
      .replace(/\\omega/g, 'ω')
      .replace(/\\pi/g, 'π')
      .replace(/\\sigma/g, 'σ')
      .replace(/\\cdot/g, '·')
      .replace(/\\times/g, '×')
      .replace(/\\sqrt\{([^}]*)\}/g, '√($1)')
      // Format partial derivative
      .replace(/\\partial/g, '∂')
      // Handle dot notation for derivatives
      .replace(/\\dot\s*([a-zA-Z])/g, '$1̇');
    
    return formatted;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 to-indigo-950">
      <DashboardNav />
      
      <div className="container max-w-6xl mx-auto pt-20 pb-16 px-4">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-white mb-2">
            Aptitude Topic Brush-Up
          </h1>
          <p className="text-slate-300">
            Get comprehensive theory, formulas, and solved examples for any quantitative aptitude topic
          </p>
        </div>
        
        <Card className="bg-slate-900 border-slate-800 shadow-xl mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Lightbulb className="h-5 w-5 text-amber-400" />
              Enter a Topic
            </CardTitle>
            <CardDescription className="text-slate-400">
              Provide a specific aptitude topic to generate study materials
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-3">
              <div className="flex-1">
                <Input
                  placeholder="e.g., Probability, Permutations, Trigonometry"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  className="bg-slate-800 border-slate-700 text-white"
                />
              </div>
              <Button
                onClick={handleGenerateBrushUp}
                disabled={isGenerating || !topic}
                className="bg-indigo-600 hover:bg-indigo-700 text-white"
              >
                {isGenerating ? (
                  <>
                    <RotateCw className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-4 w-4" />
                    Generate
                  </>
                )}
              </Button>
            </div>
            
            <div className="flex flex-wrap gap-2 mt-4">
              {["Probability", "Geometry", "Algebra", "Statistics", "Permutations"].map((suggestion) => (
                <Button 
                  key={suggestion} 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setTopic(suggestion)}
                  className="bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700"
                >
                  {suggestion}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
        
        {contentGenerated && (
          <div className="space-y-6">
            {/* Quick navigation buttons */}
            <div className="flex flex-wrap justify-center gap-4">
              <Button 
                onClick={() => scrollToSection(theoryRef)} 
                variant="outline"
                className="bg-slate-800 hover:bg-blue-950 text-blue-400 border-blue-900/50"
              >
                <BookOpen className="mr-2 h-4 w-4" />
                Theory
              </Button>
              <Button 
                onClick={() => scrollToSection(formulasRef)}
                variant="outline" 
                className="bg-slate-800 hover:bg-green-950 text-green-400 border-green-900/50"
              >
                <Calculator className="mr-2 h-4 w-4" />
                Formulas
              </Button>
              <Button 
                onClick={() => scrollToSection(examplesRef)}
                variant="outline" 
                className="bg-slate-800 hover:bg-purple-950 text-purple-400 border-purple-900/50"
              >
                <Code className="mr-2 h-4 w-4" />
                Examples
              </Button>
            </div>
            
            {/* Theory section */}
            <div ref={theoryRef}>
              <div className="h-1 bg-blue-600 rounded-full mb-1"></div>
              <Card className="bg-slate-900/90 border-slate-800 shadow-xl overflow-hidden">
                <CardHeader className="bg-slate-900 border-b border-slate-800">
                  <CardTitle className="flex items-center text-blue-400">
                    <BookOpen className="mr-2 h-5 w-5" />
                    Theory
                  </CardTitle>
                  <CardDescription className="text-slate-400">
                    Core concepts and principles of {topic}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-4 max-h-[500px] overflow-y-auto scrollbar-thin scrollbar-thumb-blue-800 scrollbar-track-slate-900">
                  {theory.split('\n\n').map((paragraph, index) => (
                    <div key={index} className="mb-4">
                      {paragraph.startsWith('Key Concepts:') || paragraph.startsWith('Common Misconceptions:') ? (
                        <h3 className="text-blue-400 font-semibold text-lg mb-2">{paragraph.split(':')[0]}:</h3>
                      ) : paragraph.startsWith('Introduction to') ? (
                        <h3 className="text-blue-400 font-semibold text-lg mb-2">Introduction</h3>
                      ) : null}
                      
                      <p className="text-slate-300 leading-relaxed">
                        {paragraph.replace(/^(Key Concepts:|Common Misconceptions:|Introduction to [^:]+:)/, '')}
                      </p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
            
            {/* Formulas section */}
            <div ref={formulasRef}>
              <div className="h-1 bg-green-600 rounded-full mb-1"></div>
              <Card className="bg-slate-900/90 border-slate-800 shadow-xl overflow-hidden">
                <CardHeader className="bg-slate-900 border-b border-slate-800">
                  <CardTitle className="flex items-center text-green-400">
                    <Calculator className="mr-2 h-5 w-5" />
                    Formulas
                  </CardTitle>
                  <CardDescription className="text-slate-400">
                    Key equations and mathematical expressions for {topic}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-4 max-h-[500px] overflow-y-auto scrollbar-thin scrollbar-thumb-green-800 scrollbar-track-slate-900">
                  <div className="formula-container">
                    <style>
                      {`
                        .formula {
                          font-family: 'Courier New', monospace;
                          padding: 0.5rem;
                          margin-bottom: 0.5rem;
                          border-radius: 0.25rem;
                          background-color: rgba(20, 83, 45, 0.2);
                          border-left: 3px solid rgba(74, 222, 128, 0.5);
                        }
                        .formula-section {
                          margin-bottom: 1.5rem;
                        }
                        .formula-var {
                          color: #38bdf8;
                          font-weight: bold;
                        }
                        .formula-equals {
                          margin: 0 0.5rem;
                          color: #94a3b8;
                        }
                        .formula-expression {
                          color: #4ade80;
                        }
                        .formula-fraction {
                          display: inline-block;
                          vertical-align: middle;
                          text-align: center;
                          margin: 0 0.2em;
                        }
                        .formula-numerator {
                          border-bottom: 1px solid #4ade80;
                          padding: 0 0.2em;
                          display: block;
                        }
                        .formula-denominator {
                          padding: 0 0.2em;
                          display: block;
                        }
                        sub, sup {
                          font-size: 0.75em;
                        }
                      `}
                    </style>
                    
                    {formulas.split('\n\n').map((section, index) => (
                      <div key={index} className="formula-section">
                        {section.startsWith('Basic Formulas:') || section.startsWith('Advanced Applications:') ? (
                          <h3 className="text-green-400 font-semibold text-lg mb-3">{section.split(':')[0]}:</h3>
                        ) : null}
                        
                        <div className="pl-2">
                          {section
                            .replace(/^(Basic Formulas:|Advanced Applications:)/, '')
                            .split('\n')
                            .map((line, lineIndex) => {
                              if (line.trim()) {
                                // Check if this is a numbered formula
                                const numberMatch = line.match(/^\d+\.\s+/);
                                const formulaPart = numberMatch ? line.replace(/^\d+\.\s+/, '') : line;
                                
                                // Replace common mathematical notations with proper symbols
                                let formattedFormula = formulaPart;
                                
                                // Format power equations (e.g., P = F · v)
                                if (formattedFormula.includes('Power') || formattedFormula.includes('P =')) {
                                  formattedFormula = formattedFormula
                                    .replace('P =', '<span class="formula-var">P</span><span class="formula-equals">=</span>')
                                    .replace('W/t', '<span class="formula-fraction"><span class="formula-numerator">W</span><span class="formula-denominator">t</span></span>')
                                    .replace('F \\cdot v', '<span class="formula-expression">F · v</span>')
                                    .replace('F \\dot v', '<span class="formula-expression">F · v</span>')
                                    .replace('F v', '<span class="formula-expression">F · v</span>')
                                    .replace('\\frac{W}{t}', '<span class="formula-fraction"><span class="formula-numerator">W</span><span class="formula-denominator">t</span></span>')
                                    .replace('\\frac{dW}{dt}', '<span class="formula-fraction"><span class="formula-numerator">dW</span><span class="formula-denominator">dt</span></span>');
                                }
                                
                                // Format Work-Energy Theorem
                                if (formattedFormula.includes('Work-Energy') || formattedFormula.includes('W_{net}')) {
                                  formattedFormula = formattedFormula
                                    .replace('W_{net}', '<span class="formula-var">W<sub>net</sub></span>')
                                    .replace('\\Delta KE', '<span class="formula-expression">ΔKE</span>')
                                    .replace('KE_{final}', '<span class="formula-expression">KE<sub>final</sub></span>')
                                    .replace('KE_{initial}', '<span class="formula-expression">KE<sub>initial</sub></span>');
                                }
                                
                                // Generic formula formatting for variable = expression
                                formattedFormula = formattedFormula.replace(
                                  /([a-zA-Z][a-zA-Z0-9_]*)\(([^)]*)\)\s*=\s*(.+)/g, 
                                  '<span class="formula-var">$1($2)</span><span class="formula-equals">=</span><span class="formula-expression">$3</span>'
                                ).replace(
                                  /([a-zA-Z][a-zA-Z0-9_]*(?:_\{[^}]*\})?)\s*=\s*(.+)/g,
                                  '<span class="formula-var">$1</span><span class="formula-equals">=</span><span class="formula-expression">$2</span>'
                                );
                                
                                return (
                                  <div key={lineIndex} className="mb-2">
                                    {numberMatch && (
                                      <span className="text-slate-400 inline-block w-6">{numberMatch[0]}</span>
                                    )}
                                    <div 
                                      className="formula inline-block"
                                      dangerouslySetInnerHTML={{ __html: formattedFormula }}
                                    />
                                  </div>
                                );
                              }
                              return null;
                            })}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Examples section */}
            <div ref={examplesRef}>
              <div className="h-1 bg-purple-600 rounded-full mb-1"></div>
              <Card className="bg-slate-900/90 border-slate-800 shadow-xl overflow-hidden">
                <CardHeader className="bg-slate-900 border-b border-slate-800">
                  <CardTitle className="flex items-center text-purple-400">
                    <Code className="mr-2 h-5 w-5" />
                    Solved Examples
                  </CardTitle>
                  <CardDescription className="text-slate-400">
                    Step-by-step solutions to common {topic} problems
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-4 pb-2 max-h-[600px] overflow-y-auto scrollbar-thin scrollbar-thumb-purple-800 scrollbar-track-slate-900">
                  <Accordion type="single" collapsible className="w-full">
                    {parseExamples().map((example, index) => (
                      <AccordionItem 
                        key={index} 
                        value={`example-${index}`}
                        className="border-slate-800"
                      >
                        <AccordionTrigger className="text-purple-300 hover:text-purple-200 hover:no-underline">
                          <span>{example.title}</span>
                        </AccordionTrigger>
                        <AccordionContent>
                          <div className="space-y-4 pt-2">
                            <div className="bg-purple-950/30 p-4 rounded-md border border-purple-900/50">
                              <h4 className="text-purple-300 font-medium mb-2 flex items-center">
                                <Lightbulb className="h-4 w-4 mr-2" />
                                Problem:
                              </h4>
                              <p className="text-slate-300">{example.problem}</p>
                            </div>
                            
                            <div className="bg-slate-800/50 p-4 rounded-md border border-slate-700/50">
                              <h4 className="text-green-300 font-medium mb-2 flex items-center">
                                <Code className="h-4 w-4 mr-2" />
                                Solution:
                              </h4>
                              <ol className="list-decimal list-inside space-y-2 pl-2">
                                {example.solution.map((step, stepIndex) => (
                                  <li key={stepIndex} className="text-slate-300">
                                    <span dangerouslySetInnerHTML={{ __html: formatFormula(step) }} />
                                  </li>
                                ))}
                              </ol>
                            </div>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AptitudeBrushUp;
