
import React, { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import CodeEditor from '@/components/webdev/CodeEditor';
import QuizSection from '@/components/webdev/QuizSection';
import ResourceCard from '@/components/webdev/ResourceCard';

const CloudComputingCourse = () => {
  const { toast } = useToast();
  const [progress, setProgress] = useState(0);
  
  // Simulate progress increase
  React.useEffect(() => {
    const timer = setTimeout(() => setProgress(20), 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 to-indigo-50 pb-16">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-sky-600 to-indigo-500 text-white p-6 md:p-16 animate-fade-in">
        <div className="max-w-6xl mx-auto">
          <Badge className="mb-4 bg-white/20 hover:bg-white/30">Cloud Computing</Badge>
          <h1 className="text-4xl md:text-6xl font-bold mb-4">Master Cloud Computing</h1>
          <p className="text-xl md:text-2xl text-white/80 max-w-3xl">
            Learn the fundamentals of cloud platforms, services, and architectures
          </p>
          <div className="mt-6">
            <div className="flex items-center gap-3 text-sm">
              <span>Course Progress</span>
              <Progress value={progress} className="w-64 bg-white/20" />
              <span>{progress}% Complete</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 mt-8">
        <Tabs defaultValue="theory" className="animate-fade-in-slow">
          <TabsList className="grid grid-cols-4 mb-8">
            <TabsTrigger value="theory" className="text-lg py-3">Theory</TabsTrigger>
            <TabsTrigger value="resources" className="text-lg py-3">Resources</TabsTrigger>
            <TabsTrigger value="quiz" className="text-lg py-3">Quiz</TabsTrigger>
            <TabsTrigger value="practice" className="text-lg py-3">Practice</TabsTrigger>
          </TabsList>
          
          {/* Theory Section */}
          <TabsContent value="theory" className="space-y-8">
            <Card className="glassmorphism overflow-hidden border-0">
              <CardHeader className="bg-gradient-to-r from-sky-600 to-indigo-500 text-white">
                <CardTitle className="text-2xl">Introduction to Cloud Computing</CardTitle>
                <CardDescription className="text-white/80">
                  Understanding cloud delivery models and service types
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6 animate-fade-in">
                <div className="prose max-w-none">
                  <p className="text-lg leading-relaxed mb-4">
                    Cloud computing is the delivery of computing services—including servers, storage, databases, 
                    networking, software, analytics, and intelligence—over the internet ("the cloud") to offer 
                    faster innovation, flexible resources, and economies of scale.
                  </p>
                  
                  <h3 className="text-xl font-semibold mt-6 mb-3 section-header pb-2">Cloud Service Models</h3>
                  <p className="mb-4">The three main cloud service models are:</p>
                  <ul className="space-y-3 list-disc pl-5 mb-6">
                    <li>
                      <span className="font-semibold">Infrastructure as a Service (IaaS)</span>: Provides virtualized computing resources over the internet
                    </li>
                    <li>
                      <span className="font-semibold">Platform as a Service (PaaS)</span>: Provides hardware and software tools over the internet
                    </li>
                    <li>
                      <span className="font-semibold">Software as a Service (SaaS)</span>: Delivers software applications over the internet
                    </li>
                    <li>
                      <span className="font-semibold">Function as a Service (FaaS)</span>: Serverless computing that enables execution of code in response to events
                    </li>
                  </ul>
                  
                  <div className="bg-accent p-4 rounded-lg mb-6">
                    <h4 className="font-semibold mb-2">Major Cloud Providers</h4>
                    <p>
                      Amazon Web Services (AWS), Microsoft Azure, Google Cloud Platform (GCP), and IBM Cloud 
                      are among the leading cloud providers, each offering a comprehensive set of services and solutions.
                    </p>
                  </div>
                  
                  <h3 className="text-xl font-semibold mt-8 mb-3 section-header pb-2">Key Cloud Concepts</h3>
                  <p className="mb-4">Important concepts in cloud computing include:</p>
                  <ul className="space-y-3 list-disc pl-5 mb-6">
                    <li>Elasticity and scalability</li>
                    <li>High availability and reliability</li>
                    <li>Security and compliance</li>
                    <li>Cost optimization</li>
                    <li>Cloud-native architectures</li>
                  </ul>
                  
                  <div className="bg-accent p-4 rounded-lg">
                    <h4 className="font-semibold mb-2">Deployment Models</h4>
                    <p>
                      Cloud services can be deployed in different models, including public cloud (shared resources), 
                      private cloud (exclusive use by a single organization), hybrid cloud (combination of public and private), 
                      and multi-cloud (using services from multiple providers).
                    </p>
                  </div>
                </div>

                <div className="flex justify-end mt-8">
                  <Button 
                    onClick={() => {
                      setProgress(Math.min(progress + 10, 100));
                      toast({
                        title: "Progress updated!",
                        description: "You've completed this section.",
                      });
                    }}
                    className="bg-gradient-to-r from-sky-600 to-indigo-500"
                  >
                    Mark as Completed
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Resources Section */}
          <TabsContent value="resources" className="space-y-6">
            <h2 className="text-2xl font-bold section-header pb-2">Learning Resources</h2>
            <p className="text-lg text-muted-foreground mb-8">Explore these hand-picked resources to deepen your knowledge</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in">
              <ResourceCard 
                title="AWS Training" 
                description="Free digital training on AWS Cloud for beginners and experts"
                type="Learning Platform"
                url="https://aws.amazon.com/training"
                imageUrl="https://d1.awsstatic.com/training-and-certification/learning-paths/Misc-stock-img_AWS_Cloud_Learning_path.0ce6bde59e3837bcd7d61a5404d7258bf5332947.png"
              />
              
              <ResourceCard 
                title="Microsoft Learn" 
                description="Free, interactive training for Azure cloud services"
                type="Learning Platform"
                url="https://learn.microsoft.com/en-us/azure"
                imageUrl="https://learn.microsoft.com/en-us/media/learn/prod/learn/bertelsmann/hero-5050.jpg"
              />
              
              <ResourceCard 
                title="Google Cloud Training" 
                description="Learn Google Cloud with training courses and certifications"
                type="Learning Platform"
                url="https://cloud.google.com/training"
                imageUrl="https://cloud.google.com/images/training/cloud-digital-leader-xs.jpg"
              />
              
              <ResourceCard 
                title="Cloud Native Computing Foundation" 
                description="Open source projects that are shaping the cloud-native ecosystem"
                type="Organization"
                url="https://www.cncf.io"
                imageUrl="https://www.cncf.io/wp-content/uploads/2022/07/cncf-color-bg.svg"
              />
            </div>
          </TabsContent>
          
          {/* Quiz Section */}
          <TabsContent value="quiz">
            <QuizSection />
          </TabsContent>
          
          {/* Practice Section */}
          <TabsContent value="practice">
            <Card className="glassmorphism mb-8 animate-fade-in">
              <CardHeader>
                <CardTitle>Practice Exercise: Cloud Resource Deployment</CardTitle>
                <CardDescription>
                  Practice creating a simple cloud deployment configuration
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <h3 className="font-semibold text-lg mb-2">Instructions:</h3>
                  <p className="mb-4">
                    Write a simple Infrastructure as Code template for AWS CloudFormation or Terraform that creates:
                  </p>
                  <ul className="list-disc pl-6 mb-4 space-y-1">
                    <li>A virtual private cloud (VPC)</li>
                    <li>A subnet within the VPC</li>
                    <li>A security group allowing HTTP traffic</li>
                    <li>An EC2 instance with a web server</li>
                  </ul>
                </div>
                
                <CodeEditor 
                  defaultCode={`# Sample Terraform template for AWS resources

provider "aws" {
  region = "us-west-2"
}

# Create a VPC
resource "aws_vpc" "main" {
  # Your code here
}

# Create a subnet
resource "aws_subnet" "main" {
  # Your code here
}

# Create a security group
resource "aws_security_group" "web" {
  # Your code here
}

# Create an EC2 instance
resource "aws_instance" "web_server" {
  # Your code here
}`}
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default CloudComputingCourse;