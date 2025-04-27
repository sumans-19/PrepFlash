
import React from 'react';
import { Formula } from '@/types/aptitude';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface FormulaCardProps {
  formula: Formula;
  className?: string;
}

const FormulaCard = ({ formula, className }: FormulaCardProps) => {
  return (
    <Card className={cn('w-full h-full flex flex-col overflow-hidden transition-all hover:shadow-lg', 
      'dark:bg-slate-800/60 dark:hover:bg-slate-800/80 backdrop-blur-sm', className)}>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">{formula.title}</CardTitle>
        <CardDescription className="text-sm">
          {formula.topic.charAt(0).toUpperCase() + formula.topic.slice(1)}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col">
        <div className="text-lg font-medium p-2 bg-purple-50 dark:bg-slate-700/30 rounded-md text-center mb-3">
          {formula.expression}
        </div>
        <p className="text-sm text-muted-foreground mb-2">{formula.description}</p>
        {formula.example && (
          <div className="mt-auto">
            <p className="text-xs font-medium text-muted-foreground">Example:</p>
            <p className="text-sm">{formula.example}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default FormulaCard;
