
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui';
import { AlertTriangle } from 'lucide-react';

const feedbackMessages = [
  {
    title: "Taking a Different Approach",
    message: "Sometimes the best way to solve a problem is to step back and look at it from a different angle."
  },
  {
    title: "Practice Makes Perfect",
    message: "Don't worry if you don't get it right away. Keep practicing and you'll improve naturally."
  },
  {
    title: "Learning from Mistakes",
    message: "Every mistake is an opportunity to learn something new. Take note of what went wrong and try again."
  },
  {
    title: "Breaking it Down",
    message: "Try breaking the problem into smaller, manageable pieces. It makes complex problems easier to solve."
  }
];

export const DefaultFeedback = () => {
  const randomFeedback = React.useMemo(() => 
    feedbackMessages[Math.floor(Math.random() * feedbackMessages.length)],
    []
  );

  return (
    <Card className="w-full border-warning/50 bg-warning/10">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-warning">
          <AlertTriangle className="h-5 w-5" />
          {randomFeedback.title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">{randomFeedback.message}</p>
      </CardContent>
    </Card>
  );
};
