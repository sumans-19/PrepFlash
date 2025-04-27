
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import {
  BarChart3,
  LineChart,
  PieChart,
  TrendingUp,
  Award,
  ArrowRight,
  CheckCheck
} from "lucide-react";

// Sample chart data component
const SimpleBarChart = () => {
  return (
    <div className="w-full">
      <div className="space-y-3">
        <div className="space-y-1">
          <div className="flex items-center justify-between text-xs">
            <span>Technical Skills</span>
            <span className="font-medium">85%</span>
          </div>
          <Progress 
            value={85} 
            className="h-2 bg-gradient-to-r from-prep-primary to-prep-secondary" 
          />
        </div>
        <div className="space-y-1">
          <div className="flex items-center justify-between text-xs">
            <span>Behavioral Responses</span>
            <span className="font-medium">72%</span>
          </div>
          <Progress 
            value={72} 
            className="h-2 bg-gradient-to-r from-prep-primary to-prep-secondary" 
          />
        </div>
        <div className="space-y-1">
          <div className="flex items-center justify-between text-xs">
            <span>Communication Clarity</span>
            <span className="font-medium">94%</span>
          </div>
          <Progress 
            value={94} 
            className="h-2 bg-gradient-to-r from-prep-primary to-prep-secondary" 
          />
        </div>
        <div className="space-y-1">
          <div className="flex items-center justify-between text-xs">
            <span>Problem Solving</span>
            <span className="font-medium">78%</span>
          </div>
          <Progress 
            value={78} 
            className="h-2 bg-gradient-to-r from-prep-primary to-prep-secondary" 
          />
        </div>
      </div>
    </div>
  );
};

const ProgressCard = ({ 
  title, 
  value, 
  icon,
  iconClass,
  subtitle
}: { 
  title: string; 
  value: number; 
  icon: React.ReactNode;
  iconClass: string;
  subtitle: string;
}) => {
  return (
    <Card className="relative overflow-hidden group hover:shadow-md transition-all">
      <CardContent className="p-6">
        <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
          {icon}
        </div>
        <div className="flex items-center gap-4">
          <div className={`p-3 rounded-xl ${iconClass}`}>
            {icon}
          </div>
          <div>
            <h4 className="text-sm font-medium text-muted-foreground">{title}</h4>
            <p className="text-2xl font-bold">{value}%</p>
            <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export const AnalyticsInsights = () => {
  return (
    <section id="analytics" className="py-20 relative overflow-hidden">
      <div className="container mx-auto px-6">
        {/* Background elements */}
        <div className="absolute top-40 right-0 w-72 h-72 bg-prep-accent/5 rounded-full blur-3xl -z-10"></div>
        <div className="absolute bottom-20 left-10 w-80 h-80 bg-prep-primary/5 rounded-full blur-3xl -z-10"></div>
        
        <div className="text-center mb-16">
          <span className="px-4 py-1.5 rounded-full text-xs font-medium bg-prep-primary/10 text-prep-primary dark:bg-prep-primary/20 inline-block mb-4">
            DATA-DRIVEN IMPROVEMENT
          </span>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            <span className="text-prep-primary dark:text-prep-secondary">Personalized Analytics</span>{" "}
            <span className="gradient-text">Insights</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Track your progress over time and identify areas for improvement with detailed performance analytics.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          <Card className="col-span-1 lg:col-span-2 border shadow-sm hover:shadow-md transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-semibold flex items-center">
                    <TrendingUp className="mr-2 h-5 w-5 text-prep-primary" />
                    Performance Trends
                  </h3>
                  <p className="text-sm text-muted-foreground">Your interview skills over time</p>
                </div>
                <Button variant="outline" size="sm" className="text-xs gap-1">
                  View detailed report
                  <ArrowRight className="h-3 w-3" />
                </Button>
              </div>
              
              <SimpleBarChart />
              
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8">
                <div className="p-3 rounded-lg bg-prep-primary/5 border border-prep-primary/10 text-center">
                  <p className="text-xs text-muted-foreground">Total Sessions</p>
                  <p className="text-xl font-bold text-prep-primary">12</p>
                </div>
                <div className="p-3 rounded-lg bg-prep-accent/5 border border-prep-accent/10 text-center">
                  <p className="text-xs text-muted-foreground">Interview Types</p>
                  <p className="text-xl font-bold text-prep-accent">5</p>
                </div>
                <div className="p-3 rounded-lg bg-prep-primary/5 border border-prep-primary/10 text-center">
                  <p className="text-xs text-muted-foreground">Hours Practiced</p>
                  <p className="text-xl font-bold text-prep-primary">8.5</p>
                </div>
                <div className="p-3 rounded-lg bg-prep-accent/5 border border-prep-accent/10 text-center">
                  <p className="text-xs text-muted-foreground">Questions Answered</p>
                  <p className="text-xl font-bold text-prep-accent">64</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <div className="space-y-6">
            <ProgressCard 
              title="Overall Interview Readiness"
              value={82}
              icon={<Award className="h-6 w-6 text-white" />}
              iconClass="bg-gradient-to-br from-prep-primary to-prep-secondary text-white"
              subtitle="+12% from last month"
            />
            
            <ProgressCard 
              title="Response Quality Score"
              value={76}
              icon={<CheckCheck className="h-6 w-6 text-white" />}
              iconClass="bg-gradient-to-br from-prep-accent to-prep-coral text-white"
              subtitle="+8% from last assessment"
            />
            
            <Card className="overflow-hidden hover:shadow-md transition-all border">
              <CardContent className="p-6">
                <h3 className="font-medium mb-3 flex items-center">
                  <Award className="mr-2 h-5 w-5 text-prep-accent" />
                  Your Strengths
                </h3>
                
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <div className="mt-0.5 min-w-4">
                      <div className="h-2 w-2 rounded-full bg-prep-primary"></div>
                    </div>
                    <span>Clear communication and articulation</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="mt-0.5 min-w-4">
                      <div className="h-2 w-2 rounded-full bg-prep-accent"></div>
                    </div>
                    <span>Problem-solving approach and methodology</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="mt-0.5 min-w-4">
                      <div className="h-2 w-2 rounded-full bg-prep-coral"></div>
                    </div>
                    <span>Technical knowledge demonstration</span>
                  </li>
                </ul>
                
                <Button variant="ghost" size="sm" className="mt-4 text-xs w-full">
                  View detailed analysis
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-prep-primary/5 via-prep-accent/5 to-prep-primary/5 rounded-xl p-8 border border-prep-primary/10 mt-12 text-center">
          <h3 className="text-2xl font-bold mb-2">Ready to unlock your interview potential?</h3>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            Get personalized feedback on your interview performance with our AI-powered analytics.
          </p>
          <Button size="lg" className="shadow-lg transition-all hover:scale-105">
            Start Your Interview Assessment
            <ArrowRight className="ml-1" />
          </Button>
        </div>
      </div>
    </section>
  );
};
