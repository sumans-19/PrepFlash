"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { DifficultyLevel, JOB_DOMAINS } from "../types/index"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Slider } from "@/components/ui/slider"

interface InterviewSetupProps {
  onStart: (
    jobDomain: string,
    options: {
      customJobRole?: string
      technologies?: string
      questionCount: number
      difficultyLevel: DifficultyLevel
    },
  ) => void
  isLoading: boolean
}

const InterviewSetup: React.FC<InterviewSetupProps> = ({ onStart, isLoading }) => {
  const [jobDomain, setJobDomain] = useState<string>(JOB_DOMAINS[0])
  const [customJobRole, setCustomJobRole] = useState<string>("")
  const [technologies, setTechnologies] = useState<string>("")
  const [questionCount, setQuestionCount] = useState<number>(5)
  const [difficultyLevel, setDifficultyLevel] = useState<DifficultyLevel>(DifficultyLevel.Medium)
  const [setupMode, setSetupMode] = useState<"preset" | "custom">("preset")

  const handleStart = () => {
    onStart(setupMode === "preset" ? jobDomain : "Custom", {
      customJobRole: setupMode === "custom" ? customJobRole : undefined,
      technologies: setupMode === "custom" ? technologies : undefined,
      questionCount,
      difficultyLevel,
    })
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl">Interview Practice</CardTitle>
        <CardDescription>Prepare for your next interview with AI-powered feedback</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <Tabs defaultValue="preset" onValueChange={(value) => setSetupMode(value as "preset" | "custom")}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="preset">Preset Job Domains</TabsTrigger>
            <TabsTrigger value="custom">Custom Job Role</TabsTrigger>
          </TabsList>

          <TabsContent value="preset" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="job-domain">Select Job Domain</Label>
              <Select value={jobDomain} onValueChange={setJobDomain}>
                <SelectTrigger id="job-domain" className="w-full">
                  <SelectValue placeholder="Select a job domain" />
                </SelectTrigger>
                <SelectContent>
                  {JOB_DOMAINS.map((domain) => (
                    <SelectItem key={domain} value={domain}>
                      {domain}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </TabsContent>

          <TabsContent value="custom" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="custom-role">Your Job Role</Label>
              <Input
                id="custom-role"
                placeholder="e.g., Frontend Developer, Data Analyst"
                value={customJobRole}
                onChange={(e) => setCustomJobRole(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="technologies">Technologies/Skills</Label>
              <Input
                id="technologies"
                placeholder="e.g., React, TypeScript, Node.js"
                value={technologies}
                onChange={(e) => setTechnologies(e.target.value)}
              />
            </div>
          </TabsContent>
        </Tabs>

        <div className="space-y-2">
          <div className="flex justify-between">
            <Label htmlFor="question-count">Number of Questions: {questionCount}</Label>
          </div>
          <Slider
            id="question-count"
            min={3}
            max={10}
            step={1}
            value={[questionCount]}
            onValueChange={(value) => setQuestionCount(value[0])}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="difficulty">Difficulty Level</Label>
          <Select value={difficultyLevel} onValueChange={(value) => setDifficultyLevel(value as DifficultyLevel)}>
            <SelectTrigger id="difficulty">
              <SelectValue placeholder="Select difficulty" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={DifficultyLevel.Easy}>Easy</SelectItem>
              <SelectItem value={DifficultyLevel.Medium}>Medium</SelectItem>
              <SelectItem value={DifficultyLevel.Hard}>Hard</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="prose prose-sm">
          <h4>How it works:</h4>
          <ol className="list-decimal list-inside space-y-1 text-sm">
            <li>We'll generate relevant interview questions for your field</li>
            <li>Answer the questions naturally as in a real interview</li>
            <li>AI will analyze your facial expressions and responses</li>
            <li>Get detailed feedback to improve your interview skills</li>
          </ol>
        </div>
      </CardContent>
      <CardFooter>
        <Button
          className="w-full bg-interview-blue hover:bg-interview-blue-dark"
          onClick={handleStart}
          disabled={isLoading || (setupMode === "custom" && !customJobRole)}
        >
          {isLoading ? "Setting up questions..." : "Start Interview Practice"}
        </Button>
      </CardFooter>
    </Card>
  )
}

export default InterviewSetup
