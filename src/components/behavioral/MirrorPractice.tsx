
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { Mic, Video, Download, Pause, Play, RotateCcw, CheckSquare, Square, Lightbulb } from 'lucide-react';
import { toast } from 'sonner';
import { analyzeBehavioralResponse } from '../../services/behavioralService';
import EmotionBars from '../EmotionBars';

// Sample interview questions for practice
const practiceQuestions = [
  {
    id: 1,
    text: "Tell me about a time when you had to adapt to a significant change at work or in a project.",
    category: "Adaptability",
    difficulty: "Medium",
    estimatedTime: "2-3 minutes"
  },
  {
    id: 2,
    text: "Describe a situation where you had to deliver difficult feedback to a colleague or team member.",
    category: "Communication",
    difficulty: "Hard",
    estimatedTime: "2-3 minutes"
  },
  {
    id: 3,
    text: "Tell me about a time when you made a mistake at work. How did you handle it?",
    category: "Accountability",
    difficulty: "Medium",
    estimatedTime: "2-3 minutes"
  },
  {
    id: 4,
    text: "Describe a situation where you had to work with a difficult team member to achieve a goal.",
    category: "Teamwork",
    difficulty: "Hard",
    estimatedTime: "2-3 minutes"
  },
  {
    id: 5,
    text: "Tell me about a time when you had to prioritize multiple important tasks with tight deadlines.",
    category: "Time Management",
    difficulty: "Medium",
    estimatedTime: "2-3 minutes"
  },
  {
    id: 6,
    text: "Describe a project that didn't go as planned. What happened and how did you respond?",
    category: "Problem Solving",
    difficulty: "Hard",
    estimatedTime: "3-4 minutes"
  }
];

// STAR method checklist
const starChecklist = [
  { key: "situation", text: "Described the situation with context (when, where, who)" },
  { key: "task", text: "Explained your specific responsibility or challenge" },
  { key: "action", text: "Detailed the actions you personally took" },
  { key: "result", text: "Shared the outcome and quantifiable results" },
  { key: "reflection", text: "Included what you learned or would do differently" }
];

// Additional behavioral checklist
const behavioralChecklist = [
  { key: "eye_contact", text: "Maintained good eye contact" },
  { key: "vocal_pace", text: "Spoke at an appropriate pace" },
  { key: "confidence", text: "Showed confidence in delivery" },
  { key: "fillers", text: "Minimized filler words (um, uh, like)" },
  { key: "concise", text: "Was concise and on-topic" },
  { key: "engaged", text: "Appeared engaged and enthusiastic" }
];

const MirrorPractice = () => {
  const [selectedQuestion, setSelectedQuestion] = useState<number | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [videoURL, setVideoURL] = useState<string | null>(null);
  const [checklistItems, setChecklistItems] = useState<Record<string, boolean>>({});
  const [activeTab, setActiveTab] = useState('practice');
  const [customQuestion, setCustomQuestion] = useState('');
  const [reflectionNotes, setReflectionNotes] = useState('');

  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  
  // Mock emotion data
  const [mockEmotions, setMockEmotions] = useState({
    neutral: 0.65,
    happy: 0.15,
    surprised: 0.1,
    anxious: 0.05,
    confused: 0.05
  });
  
  useEffect(() => {
    // Clean up function to stop recording and release media when component unmounts
    return () => {
      stopRecording();
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);
  
  const initializeCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      
      streamRef.current = stream;
      return stream;
    } catch (error) {
      console.error("Error accessing camera:", error);
      toast.error("Failed to access camera. Please check permissions.");
      return null;
    }
  };
  
  const startRecording = async () => {
    try {
      const stream = streamRef.current || await initializeCamera();
      if (!stream) return;
      
      // Reset recording state
      setRecordingTime(0);
      setVideoURL(null);
      
      // Create media recorder
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      
      const chunks: BlobPart[] = [];
      
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunks.push(event.data);
        }
      };
      
      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'video/webm' });
        const url = URL.createObjectURL(blob);
        setVideoURL(url);
      };
      
      // Start recording
      mediaRecorder.start();
      setIsRecording(true);
      
      // Start timer
      timerRef.current = setInterval(() => {
        setRecordingTime(prevTime => {
          // Update mock emotions to simulate changing expressions
          if (prevTime % 5 === 0) {
            updateMockEmotions();
          }
          return prevTime + 1;
        });
      }, 1000);
      
      toast.success("Recording started");
    } catch (error) {
      console.error("Error starting recording:", error);
      toast.error("Failed to start recording");
    }
  };
  
  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
    
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };
  
  const resetRecording = () => {
    setVideoURL(null);
    setRecordingTime(0);
    setChecklistItems({});
    setReflectionNotes('');
  };
  
  const handleSelectQuestion = (questionId: number) => {
    setSelectedQuestion(questionId);
    resetRecording();
  };
  
  const handleChecklistItemToggle = (key: string) => {
    setChecklistItems(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };
  
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };
  
  // Simulate changing emotions during recording
  const updateMockEmotions = () => {
    // Random slight changes to emotion values
    const newEmotions = { ...mockEmotions };
    
    // Make neutral fluctuate between 0.6 and 0.8
    newEmotions.neutral = Math.max(0.6, Math.min(0.8, newEmotions.neutral + (Math.random() * 0.1 - 0.05)));
    
    // Make happy fluctuate between 0.1 and 0.25
    newEmotions.happy = Math.max(0.1, Math.min(0.25, newEmotions.happy + (Math.random() * 0.08 - 0.04)));
    
    // Small random changes to other emotions
    newEmotions.surprised = Math.max(0.05, Math.min(0.15, newEmotions.surprised + (Math.random() * 0.06 - 0.03)));
    newEmotions.anxious = Math.max(0.02, Math.min(0.1, newEmotions.anxious + (Math.random() * 0.04 - 0.02)));
    newEmotions.confused = Math.max(0.02, Math.min(0.1, newEmotions.confused + (Math.random() * 0.04 - 0.02)));
    
    // Normalize to ensure sum is 1
    const sum = Object.values(newEmotions).reduce((acc, val) => acc + val, 0);
    Object.keys(newEmotions).forEach(key => {
      newEmotions[key as keyof typeof newEmotions] /= sum;
    });
    
    setMockEmotions(newEmotions);
  };
  
  const handleAddCustomQuestion = () => {
    if (!customQuestion.trim()) {
      toast.error("Please enter a question");
      return;
    }
    
    // Add custom question logic would go here
    // For this demo, just display a toast
    toast.success("Custom question added to practice list");
    setCustomQuestion('');
  };
  
  // Get current question
  const currentQuestion = selectedQuestion !== null 
    ? practiceQuestions.find(q => q.id === selectedQuestion) 
    : null;
  
  // Calculate checklist completion
  const starCompleted = Object.values(checklistItems).filter(Boolean).length;
  const starPercentage = starCompleted / (starChecklist.length + behavioralChecklist.length) * 100;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Mirror Practice Mode</h2>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-[400px]">
          <TabsList>
            <TabsTrigger value="practice">Practice</TabsTrigger>
            <TabsTrigger value="custom">Custom Questions</TabsTrigger>
            <TabsTrigger value="tips">Tips</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      
      <TabsContent value="practice" className="mt-0">
        <div className="grid grid-cols-3 gap-6">
          {/* Left column - Question selection */}
          <div className="col-span-1">
            <Card className="p-4 h-full overflow-auto">
              <h3 className="font-medium mb-4">Select a Question</h3>
              <div className="space-y-3">
                {practiceQuestions.map((question) => (
                  <div 
                    key={question.id}
                    className={`p-3 border rounded-md cursor-pointer transition-all ${
                      selectedQuestion === question.id 
                        ? 'border-interview-blue bg-interview-blue/5' 
                        : 'hover:bg-slate-50'
                    }`}
                    onClick={() => handleSelectQuestion(question.id)}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-medium text-sm line-clamp-2">{question.text}</h4>
                      <Badge 
                        variant="outline"
                        className={`
                          ml-2 shrink-0
                          ${question.difficulty === 'Easy' && 'bg-green-50 text-green-700 border-green-200'} 
                          ${question.difficulty === 'Medium' && 'bg-amber-50 text-amber-700 border-amber-200'}
                          ${question.difficulty === 'Hard' && 'bg-rose-50 text-rose-700 border-rose-200'}
                        `}
                      >
                        {question.difficulty}
                      </Badge>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">{question.category}</span>
                      <span className="text-muted-foreground">{question.estimatedTime}</span>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
          
          {/* Middle column - Video recording */}
          <div className="col-span-2">
            {selectedQuestion === null ? (
              <Card className="h-full flex items-center justify-center p-6 bg-slate-50">
                <div className="text-center">
                  <Video className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                  <h3 className="font-medium mb-2">No Question Selected</h3>
                  <p className="text-muted-foreground text-sm mb-4">
                    Select a question from the list to begin practice
                  </p>
                </div>
              </Card>
            ) : (
              <div className="space-y-4">
                <Card className="p-6">
                  <div className="mb-4">
                    <h3 className="text-lg font-medium mb-2">{currentQuestion?.text}</h3>
                    <div className="flex gap-2">
                      <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                        {currentQuestion?.category}
                      </Badge>
                      <Badge variant="outline" className="bg-slate-50">
                        {currentQuestion?.estimatedTime}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="relative aspect-video bg-muted rounded-md mb-4 overflow-hidden">
                    <video 
                      ref={videoRef}
                      autoPlay 
                      muted={isRecording} // Only mute during recording to prevent feedback
                      playsInline
                      className={`w-full h-full object-cover ${videoURL ? 'hidden' : 'block'}`} 
                    />
                    
                    {videoURL && (
                      <video 
                        src={videoURL} 
                        controls 
                        className="w-full h-full object-cover" 
                      />
                    )}
                    
                    {isRecording && (
                      <div className="absolute top-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm flex items-center">
                        <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse mr-2"></span>
                        REC {formatTime(recordingTime)}
                      </div>
                    )}
                  </div>
                  
                  <div className="flex justify-between">
                    {!isRecording && !videoURL ? (
                      <Button onClick={startRecording} className="bg-interview-blue hover:bg-interview-indigo">
                        <Video className="h-4 w-4 mr-2" /> Start Recording
                      </Button>
                    ) : isRecording ? (
                      <Button onClick={stopRecording} variant="destructive">
                        <Pause className="h-4 w-4 mr-2" /> Stop Recording
                      </Button>
                    ) : (
                      <div className="flex gap-3">
                        <Button onClick={resetRecording} variant="outline">
                          <RotateCcw className="h-4 w-4 mr-2" /> Record Again
                        </Button>
                        <Button onClick={() => {
                          /* Download logic would go here */
                          toast.success("Video download started");
                        }} variant="outline">
                          <Download className="h-4 w-4 mr-2" /> Download
                        </Button>
                      </div>
                    )}
                  </div>
                </Card>
                
                {/* Emotions analysis during recording */}
                {isRecording && (
                  <Card className="p-4">
                    <h3 className="font-medium mb-3">Live Expression Analysis</h3>
                    <EmotionBars 
                      emotions={mockEmotions} 
                      dominantEmotion="neutral" 
                      isRecording={true}
                      showIcons={true}
                    />
                  </Card>
                )}
                
                {/* Self-assessment checklist (visible after recording) */}
                {videoURL && (
                  <Card className="p-6">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="font-medium">Self-Assessment</h3>
                      <div className="flex items-center gap-2">
                        <Progress value={starPercentage} className="h-2 w-24" />
                        <span className="text-sm font-medium">{starCompleted}/{starChecklist.length + behavioralChecklist.length}</span>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="text-sm font-medium mb-2">STAR Method Checklist</h4>
                        <div className="space-y-2">
                          {starChecklist.map(item => (
                            <div 
                              key={item.key} 
                              className="flex items-start gap-2 cursor-pointer"
                              onClick={() => handleChecklistItemToggle(item.key)}
                            >
                              {checklistItems[item.key] ? (
                                <CheckSquare className="h-4 w-4 text-interview-blue shrink-0 mt-0.5" />
                              ) : (
                                <Square className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                              )}
                              <span className="text-sm">{item.text}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="text-sm font-medium mb-2">Delivery Checklist</h4>
                        <div className="space-y-2">
                          {behavioralChecklist.map(item => (
                            <div 
                              key={item.key} 
                              className="flex items-start gap-2 cursor-pointer"
                              onClick={() => handleChecklistItemToggle(item.key)}
                            >
                              {checklistItems[item.key] ? (
                                <CheckSquare className="h-4 w-4 text-interview-blue shrink-0 mt-0.5" />
                              ) : (
                                <Square className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                              )}
                              <span className="text-sm">{item.text}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-6">
                      <h4 className="text-sm font-medium mb-2">Reflection Notes</h4>
                      <Textarea 
                        placeholder="Note what went well and what you'd improve next time..."
                        value={reflectionNotes}
                        onChange={(e) => setReflectionNotes(e.target.value)}
                        className="min-h-[80px]"
                      />
                    </div>
                  </Card>
                )}
              </div>
            )}
          </div>
        </div>
      </TabsContent>
      
      <TabsContent value="custom" className="mt-0">
        <Card className="p-6">
          <h3 className="font-medium mb-4">Add Custom Practice Question</h3>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium block mb-2">Question Text</label>
              <Textarea 
                placeholder="Enter your custom behavioral question..."
                value={customQuestion}
                onChange={(e) => setCustomQuestion(e.target.value)}
                className="min-h-[80px] mb-2"
              />
              <p className="text-xs text-muted-foreground">
                Tip: Strong behavioral questions start with "Tell me about a time when..." or "Describe a situation where..."
              </p>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium block mb-2">Category</label>
                <select className="w-full h-10 px-3 py-2 border rounded-md">
                  <option>Leadership</option>
                  <option>Problem Solving</option>
                  <option>Communication</option>
                  <option>Teamwork</option>
                  <option>Adaptability</option>
                  <option>Time Management</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium block mb-2">Difficulty</label>
                <select className="w-full h-10 px-3 py-2 border rounded-md">
                  <option>Easy</option>
                  <option>Medium</option>
                  <option>Hard</option>
                </select>
              </div>
            </div>
            
            <div className="flex justify-end">
              <Button 
                onClick={handleAddCustomQuestion}
                disabled={!customQuestion.trim()}
                className="bg-interview-blue hover:bg-interview-indigo"
              >
                Add Question
              </Button>
            </div>
          </div>
        </Card>
      </TabsContent>
      
      <TabsContent value="tips" className="mt-0">
        <Card className="p-6">
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-amber-100 rounded-full text-amber-700">
                <Lightbulb className="h-5 w-5" />
              </div>
              <h3 className="font-medium text-lg">Interview Response Tips</h3>
            </div>
            
            <div className="space-y-6">
              <div className="bg-slate-50 p-5 rounded-lg border">
                <h4 className="font-medium mb-3">STAR Method Explained</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-white p-4 rounded-md border">
                    <div className="flex items-center mb-2">
                      <Badge className="bg-blue-100 text-blue-800 border-none mr-2">S</Badge>
                      <span className="font-medium">Situation</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Set the scene and provide context. Where were you? When was it? What was your role?
                    </p>
                  </div>
                  <div className="bg-white p-4 rounded-md border">
                    <div className="flex items-center mb-2">
                      <Badge className="bg-purple-100 text-purple-800 border-none mr-2">T</Badge>
                      <span className="font-medium">Task</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Explain the challenge, assignment or problem you faced. What needed to be done?
                    </p>
                  </div>
                  <div className="bg-white p-4 rounded-md border">
                    <div className="flex items-center mb-2">
                      <Badge className="bg-green-100 text-green-800 border-none mr-2">A</Badge>
                      <span className="font-medium">Action</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Describe what YOU did specifically (not the team). Use "I" not "we" statements.
                    </p>
                  </div>
                  <div className="bg-white p-4 rounded-md border">
                    <div className="flex items-center mb-2">
                      <Badge className="bg-amber-100 text-amber-800 border-none mr-2">R</Badge>
                      <span className="font-medium">Result</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Share the outcomes of your actions. Use metrics when possible and what you learned.
                    </p>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="font-medium mb-4">Common Mistakes to Avoid</h4>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <span className="text-rose-500 font-bold">•</span>
                    <span className="text-sm">
                      <span className="font-medium">Being too vague</span> - Without specific examples, your answer lacks credibility.
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-rose-500 font-bold">•</span>
                    <span className="text-sm">
                      <span className="font-medium">Focusing too much on the problem</span> - Spend more time on your actions and results.
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-rose-500 font-bold">•</span>
                    <span className="text-sm">
                      <span className="font-medium">Not taking ownership</span> - Using "we" instead of "I" hides your specific contributions.
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-rose-500 font-bold">•</span>
                    <span className="text-sm">
                      <span className="font-medium">Forgetting the result</span> - Always end with the outcome, even if it wasn't ideal.
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-rose-500 font-bold">•</span>
                    <span className="text-sm">
                      <span className="font-medium">Not matching the story to the question</span> - Ensure your example directly answers what was asked.
                    </span>
                  </li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-medium mb-4">Non-Verbal Communication Tips</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-white p-3 rounded-md border">
                    <h5 className="font-medium text-sm mb-1">Eye Contact</h5>
                    <p className="text-xs text-muted-foreground">
                      Maintain natural eye contact. In virtual interviews, look at the camera occasionally.
                    </p>
                  </div>
                  <div className="bg-white p-3 rounded-md border">
                    <h5 className="font-medium text-sm mb-1">Posture</h5>
                    <p className="text-xs text-muted-foreground">
                      Sit upright but relaxed. Leaning slightly forward shows engagement.
                    </p>
                  </div>
                  <div className="bg-white p-3 rounded-md border">
                    <h5 className="font-medium text-sm mb-1">Hand Gestures</h5>
                    <p className="text-xs text-muted-foreground">
                      Use natural hand gestures to emphasize points. Keep movements controlled.
                    </p>
                  </div>
                  <div className="bg-white p-3 rounded-md border">
                    <h5 className="font-medium text-sm mb-1">Facial Expressions</h5>
                    <p className="text-xs text-muted-foreground">
                      Show appropriate enthusiasm and interest. Smile naturally when relevant.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </TabsContent>
    </div>
  );
};

export default MirrorPractice;
