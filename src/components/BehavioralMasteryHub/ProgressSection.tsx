import React, { useState } from 'react';
import { BarChart, LineChart, Sparkles, Medal, Calendar, Trophy, ArrowUp, BarChart4 } from 'lucide-react';

// Sample user data
const USER_SKILLS = [
  { id: 'leadership', name: 'Leadership', level: 72, growth: 12 },
  { id: 'communication', name: 'Communication', level: 85, growth: 5 },
  { id: 'problemSolving', name: 'Problem Solving', level: 68, growth: 8 },
  { id: 'teamwork', name: 'Teamwork', level: 90, growth: 3 },
  { id: 'conflictResolution', name: 'Conflict Resolution', level: 65, growth: 15 },
  { id: 'decisionMaking', name: 'Decision Making', level: 78, growth: 7 },
  { id: 'adaptability', name: 'Adaptability', level: 70, growth: 10 },
  { id: 'empathy', name: 'Empathy', level: 82, growth: 4 }
];

const ACTIVITIES = [
  { id: 1, type: 'flashcard', date: '2023-06-10', count: 15, skill: 'Leadership' },
  { id: 2, type: 'scenario', date: '2023-06-12', count: 1, skill: 'Conflict Resolution' },
  { id: 3, type: 'game', date: '2023-06-12', count: 1, skill: 'Communication' },
  { id: 4, type: 'flashcard', date: '2023-06-15', count: 20, skill: 'Problem Solving' },
  { id: 5, type: 'scenario', date: '2023-06-17', count: 1, skill: 'Teamwork' },
  { id: 6, type: 'game', date: '2023-06-18', count: 1, skill: 'Adaptability' },
  { id: 7, type: 'flashcard', date: '2023-06-20', count: 12, skill: 'Decision Making' }
];

const ACHIEVEMENTS = [
  { id: 1, name: 'Leadership Pro', description: 'Complete 50 leadership flashcards', progress: 72, max: 100, icon: <Medal className="w-5 h-5" /> },
  { id: 2, name: 'Scenario Master', description: 'Complete 10 interactive scenarios', progress: 5, max: 10, icon: <Trophy className="w-5 h-5" /> },
  { id: 3, name: 'Feedback Guru', description: 'Receive AI feedback 25 times', progress: 15, max: 25, icon: <Sparkles className="w-5 h-5" /> },
  { id: 4, name: 'Perfect Streak', description: 'Practice 7 days in a row', progress: 4, max: 7, icon: <Calendar className="w-5 h-5" /> }
];

export const ProgressSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'skills' | 'achievements'>('overview');
  
  const renderProgressBar = (value: number, max: number = 100, className: string = '') => {
    const percentage = (value / max) * 100;
    return (
      <div className={`h-2 bg-indigo-900/50 rounded-full overflow-hidden ${className}`}>
        <div 
          className="h-full bg-gradient-to-r from-blue-500 to-indigo-600" 
          style={{ width: `${percentage}%` }}
        />
      </div>
    );
  };
  
  const renderSkillChart = () => {
    const sortedSkills = [...USER_SKILLS].sort((a, b) => b.level - a.level);
    
    return (
      <div className="space-y-4">
        {sortedSkills.map(skill => (
          <div key={skill.id} className="glass-card p-4">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-medium">{skill.name}</h3>
              <div className="flex items-center">
                <span className="mr-2 font-bold">{skill.level}%</span>
                {skill.growth > 0 && (
                  <div className="flex items-center text-green-400 text-xs">
                    <ArrowUp className="w-3 h-3 mr-0.5" />
                    {skill.growth}%
                  </div>
                )}
              </div>
            </div>
            {renderProgressBar(skill.level)}
          </div>
        ))}
      </div>
    );
  };
  
  const renderAchievements = () => {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {ACHIEVEMENTS.map(achievement => (
          <div key={achievement.id} className="glass-card p-4">
            <div className="flex items-center mb-2">
              <div className="w-10 h-10 rounded-full bg-indigo-700 flex items-center justify-center mr-3">
                {achievement.icon}
              </div>
              <div>
                <h3 className="font-bold">{achievement.name}</h3>
                <p className="text-xs text-indigo-300">{achievement.description}</p>
              </div>
            </div>
            <div className="mt-3">
              {renderProgressBar(achievement.progress, achievement.max)}
              <div className="flex justify-between mt-1 text-xs text-indigo-300">
                <span>{achievement.progress} / {achievement.max}</span>
                <span>{Math.round((achievement.progress / achievement.max) * 100)}% complete</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };
  
  const renderOverview = () => {
    // Calculate average skill level
    const averageSkill = USER_SKILLS.reduce((sum, skill) => sum + skill.level, 0) / USER_SKILLS.length;
    
    // Calculate strongest and weakest skills
    const strongestSkill = USER_SKILLS.reduce((prev, current) => 
      (prev.level > current.level) ? prev : current
    );
    
    const weakestSkill = USER_SKILLS.reduce((prev, current) => 
      (prev.level < current.level) ? prev : current
    );
    
    // Calculate total activities
    const totalActivities = ACTIVITIES.reduce((sum, activity) => sum + activity.count, 0);
    
    return (
      <div className="space-y-6">
        {/* Summary cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="glass-card p-4">
            <p className="text-indigo-300 text-sm mb-1">Average Skill Level</p>
            <div className="flex items-end">
              <h3 className="text-3xl font-bold">{Math.round(averageSkill)}%</h3>
              <span className="text-green-400 text-sm ml-2 mb-1">
                <ArrowUp className="w-3 h-3 inline mr-0.5" />
                8%
              </span>
            </div>
          </div>
          
          <div className="glass-card p-4">
            <p className="text-indigo-300 text-sm mb-1">Total Practice Activities</p>
            <h3 className="text-3xl font-bold">{totalActivities}</h3>
          </div>
          
          <div className="glass-card p-4">
            <p className="text-indigo-300 text-sm mb-1">Current Streak</p>
            <div className="flex items-center">
              <Calendar className="w-5 h-5 mr-2 text-yellow-400" />
              <h3 className="text-3xl font-bold">4</h3>
              <span className="text-indigo-300 text-sm ml-1 mb-1">days</span>
            </div>
          </div>
        </div>
        
        {/* Skill highlights */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="glass-card p-4">
            <h3 className="font-semibold mb-3">Strongest Skills</h3>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="font-medium">{strongestSkill.name}</span>
                  <span>{strongestSkill.level}%</span>
                </div>
                {renderProgressBar(strongestSkill.level)}
              </div>
              
              {USER_SKILLS
                .filter(skill => skill.id !== strongestSkill.id)
                .sort((a, b) => b.level - a.level)
                .slice(0, 2)
                .map(skill => (
                  <div key={skill.id}>
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-medium">{skill.name}</span>
                      <span>{skill.level}%</span>
                    </div>
                    {renderProgressBar(skill.level)}
                  </div>
                ))
              }
            </div>
          </div>
          
          <div className="glass-card p-4">
            <h3 className="font-semibold mb-3">Areas for Growth</h3>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="font-medium">{weakestSkill.name}</span>
                  <span>{weakestSkill.level}%</span>
                </div>
                {renderProgressBar(weakestSkill.level)}
              </div>
              
              {USER_SKILLS
                .filter(skill => skill.id !== weakestSkill.id)
                .sort((a, b) => a.level - b.level)
                .slice(0, 2)
                .map(skill => (
                  <div key={skill.id}>
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-medium">{skill.name}</span>
                      <span>{skill.level}%</span>
                    </div>
                    {renderProgressBar(skill.level)}
                  </div>
                ))
              }
            </div>
          </div>
        </div>
        
        {/* Recent activity */}
        <div className="glass-card p-4">
          <h3 className="font-semibold mb-3">Recent Activity</h3>
          <div className="space-y-2">
            {ACTIVITIES.slice(0, 5).map(activity => (
              <div key={activity.id} className="flex items-center py-2 border-b border-indigo-800/30 last:border-0">
                <div className="w-8 h-8 rounded-full flex items-center justify-center mr-3 bg-indigo-700/50">
                  {activity.type === 'flashcard' && <BarChart className="w-4 h-4" />}
                  {activity.type === 'scenario' && <LineChart className="w-4 h-4" />}
                  {activity.type === 'game' && <Trophy className="w-4 h-4" />}
                </div>
                <div className="flex-grow">
                  <p className="text-sm">
                    {activity.type === 'flashcard' && `Completed ${activity.count} flashcards`}
                    {activity.type === 'scenario' && `Completed an interactive scenario`}
                    {activity.type === 'game' && `Played a behavioral skills game`}
                  </p>
                  <p className="text-xs text-indigo-300">{activity.skill}</p>
                </div>
                <span className="text-xs text-indigo-400">{activity.date}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };
  
  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold">Your Progress</h2>
      </div>
      
      <div className="flex justify-center mb-8">
        <div className="inline-flex rounded-lg p-1 bg-indigo-900/30">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2 rounded-md transition-all ${
              activeTab === 'overview' 
                ? 'bg-indigo-600 text-white' 
                : 'hover:bg-indigo-800/30 text-indigo-300'
            }`}
          >
            <span className="flex items-center">
              <BarChart4 className="w-4 h-4 mr-2" />
              Overview
            </span>
          </button>
          
          <button
            onClick={() => setActiveTab('skills')}
            className={`px-4 py-2 rounded-md transition-all ${
              activeTab === 'skills' 
                ? 'bg-indigo-600 text-white' 
                : 'hover:bg-indigo-800/30 text-indigo-300'
            }`}
          >
            <span className="flex items-center">
              <BarChart className="w-4 h-4 mr-2" />
              Skills
            </span>
          </button>
          
          <button
            onClick={() => setActiveTab('achievements')}
            className={`px-4 py-2 rounded-md transition-all ${
              activeTab === 'achievements' 
                ? 'bg-indigo-600 text-white' 
                : 'hover:bg-indigo-800/30 text-indigo-300'
            }`}
          >
            <span className="flex items-center">
              <Medal className="w-4 h-4 mr-2" />
              Achievements
            </span>
          </button>
        </div>
      </div>
      
      <div>
        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'skills' && renderSkillChart()}
        {activeTab === 'achievements' && renderAchievements()}
      </div>
    </div>
  );
};