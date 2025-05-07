import React, { useState, useEffect } from 'react';
import { Trash2, Plus, Check, X, Award, Calendar, AlignJustify } from 'lucide-react';

export default function WeeklyGoals() {
  const [goals, setGoals] = useState([]);
  const [newGoal, setNewGoal] = useState('');
  const [editingGoal, setEditingGoal] = useState(null);
  const [editValue, setEditValue] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  
  useEffect(() => {
    const savedGoals = localStorage.getItem('weeklyGoals');
    if (savedGoals) {
      try {
        setGoals(JSON.parse(savedGoals));
      } catch (error) {
        console.error('Error parsing saved goals:', error);
        setGoals([]);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('weeklyGoals', JSON.stringify(goals));
  }, [goals]);

  const addGoal = (e) => {
    if (e && e.preventDefault) {
      e.preventDefault();
    }
    if (newGoal.trim() === '') return;
    
    const goal = {
      id: Date.now(),
      text: newGoal,
      completed: false,
      createdAt: new Date().toISOString(),
    };
    
    setGoals([...goals, goal]);
    setNewGoal('');
    setShowForm(false);
  };

  const toggleGoalCompletion = (id) => {
    setGoals(
      goals.map(goal =>
        goal.id === id ? { ...goal, completed: !goal.completed } : goal
      )
    );
  };

  const deleteGoal = (id) => {
    setGoals(goals.filter(goal => goal.id !== id));
  };

  const startEditing = (goal) => {
    setEditingGoal(goal.id);
    setEditValue(goal.text);
  };

  const saveEdit = () => {
    if (editValue.trim() === '') return;
    
    setGoals(
      goals.map(goal =>
        goal.id === editingGoal ? { ...goal, text: editValue } : goal
      )
    );
    
    setEditingGoal(null);
    setEditValue('');
  };

  const cancelEdit = () => {
    setEditingGoal(null);
    setEditValue('');
  };

  const filteredGoals = 
    activeTab === 'completed' 
      ? goals.filter(goal => goal.completed) 
      : activeTab === 'pending' 
        ? goals.filter(goal => !goal.completed) 
        : goals;

  const completionPercentage = goals.length > 0 
    ? Math.round((goals.filter(goal => goal.completed).length / goals.length) * 100)
    : 0;

  const getProgressColor = (percentage) => {
    if (percentage < 30) return 'bg-red-500';
    if (percentage < 70) return 'bg-yellow-400';
    return 'bg-green-500';
  };

  const progressColorClass = getProgressColor(completionPercentage);

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      addGoal();
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white rounded-xl shadow-xl overflow-hidden">
      {/* Header with motivational content */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-700 text-white p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold flex items-center">
            <Calendar className="mr-2" size={24} />
            Weekly Goals
          </h2>
          <div className="flex items-center">
            <Award className="text-yellow-300" size={20} />
            <span className="ml-1 font-semibold">{completionPercentage}%</span>
          </div>
        </div>
        
        {/* Progress bar */}
        <div className="w-full bg-gray-200 bg-opacity-30 rounded-full h-2.5 mb-4">
          <div 
            className={`h-2.5 rounded-full transition-all duration-500 ease-in-out ${progressColorClass}`} 
            style={{ width: `${completionPercentage}%` }}
          ></div>
        </div>

        <p className="text-sm text-purple-100">
          {goals.filter(goal => goal.completed).length} of {goals.length} goals completed
        </p>
      </div>

      {/* Tab navigation */}
      <div className="flex border-b border-gray-200 bg-gray-50">
        <button 
          className={`flex-1 py-3 px-4 font-medium text-sm transition-colors duration-200 ${activeTab === 'all' ? 'text-purple-700 border-b-2 border-purple-700' : 'text-gray-500 hover:text-purple-600'}`}
          onClick={() => setActiveTab('all')}
        >
          All
        </button>
        <button 
          className={`flex-1 py-3 px-4 font-medium text-sm transition-colors duration-200 ${activeTab === 'pending' ? 'text-purple-700 border-b-2 border-purple-700' : 'text-gray-500 hover:text-purple-600'}`}
          onClick={() => setActiveTab('pending')}
        >
          Pending
        </button>
        <button 
          className={`flex-1 py-3 px-4 font-medium text-sm transition-colors duration-200 ${activeTab === 'completed' ? 'text-purple-700 border-b-2 border-purple-700' : 'text-gray-500 hover:text-purple-600'}`}
          onClick={() => setActiveTab('completed')}
        >
          Completed
        </button>
      </div>

      {/* Goals list */}
      <div className="p-4">
        {filteredGoals.length === 0 ? (
          <div className="text-center py-8 px-4">
            <AlignJustify className="mx-auto text-gray-300 mb-3" size={32} />
            <p className="text-gray-500 mb-2">No {activeTab !== 'all' ? activeTab : ''} goals yet</p>
            <p className="text-sm text-gray-400">
              {activeTab === 'all' ? "Add a goal to get started" : 
               activeTab === 'pending' ? "All goals are completed!" : 
               "You haven't completed any goals yet"}
            </p>
          </div>
        ) : (
          <ul className="space-y-3">
            {filteredGoals.map(goal => (
              <li 
                key={goal.id} 
                className={`p-3 rounded-lg border border-gray-100 transition-all duration-200 ${goal.completed ? 'bg-green-50' : 'bg-gray-50 hover:border-purple-200'}`}
              >
                {editingGoal === goal.id ? (
                  <div className="flex items-center">
                    <input
                      type="text"
                      className="flex-grow p-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      autoFocus
                    />
                    <button 
                      onClick={saveEdit}
                      className="ml-2 p-2 text-green-500 hover:text-green-700 transition-colors"
                    >
                      <Check size={18} />
                    </button>
                    <button 
                      onClick={cancelEdit}
                      className="ml-1 p-2 text-red-500 hover:text-red-700 transition-colors"
                    >
                      <X size={18} />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <button
                        onClick={() => toggleGoalCompletion(goal.id)}
                        className={`flex-shrink-0 w-5 h-5 rounded-full border border-gray-300 mr-3 flex items-center justify-center transition-colors ${goal.completed ? 'bg-green-500 border-green-500' : 'hover:border-purple-500'}`}
                      >
                        {goal.completed && <Check size={12} className="text-white" />}
                      </button>
                      <span 
                        className={`${goal.completed ? 'text-gray-500 line-through' : 'text-gray-800'}`}
                        onClick={() => !goal.completed && startEditing(goal)}
                      >
                        {goal.text}
                      </span>
                    </div>
                    
                    <div className="flex items-center">
                      {!goal.completed && (
                        <button
                          onClick={() => startEditing(goal)}
                          className="p-1 text-gray-400 hover:text-purple-600 transition-colors"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                          </svg>
                        </button>
                      )}
                      <button
                        onClick={() => deleteGoal(goal.id)}
                        className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Add goal div or button */}
      <div className="p-4 bg-gray-50 border-t border-gray-100">
        {showForm ? (
          <div className="flex items-center space-x-2">
            <input
              type="text"
              placeholder="Enter your goal..."
              className="flex-grow p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
              value={newGoal}
              onChange={(e) => setNewGoal(e.target.value)}
              onKeyPress={handleKeyPress}
              autoFocus
            />
            <button
              onClick={addGoal}
              className="p-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              <Check size={18} />
            </button>
            <button
              onClick={() => {
                setShowForm(false);
                setNewGoal('');
              }}
              className="p-3 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
            >
              <X size={18} />
            </button>
          </div>
        ) : (
          <button
            onClick={() => setShowForm(true)}
            className="w-full p-3 flex items-center justify-center space-x-2 bg-gradient-to-r from-purple-600 to-indigo-700 text-white rounded-lg hover:opacity-90 transition-opacity"
          >
            <Plus size={18} />
            <span>Add New Goal</span>
          </button>
        )}
      </div>

      {/* Motivational footer */}
      <div className="px-4 py-3 bg-indigo-50 text-center">
        <p className="text-sm text-indigo-800 font-medium">
          {goals.length === 0 ? "Set your goals and make progress this week!" :
           completionPercentage === 100 ? "Amazing job! All goals completed!" :
           completionPercentage >= 70 ? "Great progress! Keep going!" :
           completionPercentage >= 30 ? "You're on the right track!" :
           "Every small step matters. You can do it!"}
        </p>
      </div>
    </div>
  );
}