
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ArrowLeft, MessageSquare } from "lucide-react";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { DashboardNav } from "@/components/DashboardNav";
import { createForumPost } from "@/lib/firestore";
import { auth } from "@/lib/firebase";

const formSchema = z.object({
  title: z.string()
    .min(5, "Title must be at least 5 characters")
    .max(100, "Title must be less than 100 characters"),
  content: z.string()
    .min(20, "Content must be at least 20 characters")
    .max(2000, "Content must be less than 2000 characters"),
  category: z.string({ required_error: "Please select a category" }),
});

const ForumCreatePost = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Check if user is authenticated
  const currentUser = auth.currentUser;
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      content: "",
      category: "",
    },
  });
  
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!currentUser) {
      toast({
        title: "Authentication required",
        description: "Please sign in to create a discussion post",
        variant: "destructive"
      });
      return;
    }
    
    setIsSubmitting(true);
    try {
      const postData = {
        authorId: currentUser.uid,
        authorName: currentUser.displayName || "Anonymous",
        authorAvatar: currentUser.photoURL || undefined,
        ...values,
      };
      
      const postId = await createForumPost(postData);
      
      toast({
        title: "Post created!",
        description: "Your discussion post has been published successfully",
      });
      
      navigate(`/forum/post/${postId}`);
    } catch (error) {
      console.error("Error creating post:", error);
      toast({
        title: "Error creating post",
        description: "There was a problem publishing your post. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-background/90 to-slate-950/90">
      <DashboardNav />
      
      <div className="container mx-auto max-w-3xl px-4 pt-24 pb-16">
        <Button 
          variant="ghost" 
          onClick={() => navigate("/forum")}
          className="mb-6 hover:bg-slate-900/50"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Forum
        </Button>
        
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary via-blue-400 to-purple-400 bg-clip-text text-transparent pb-2">
            Start a Discussion
          </h1>
          <p className="text-muted-foreground">
            Share your interview experiences or ask questions to the community
          </p>
        </div>
        
        <Card className="bg-gradient-to-br from-indigo-950/70 to-slate-900/90 backdrop-blur-md border-0 shadow-lg">
          <CardHeader>
            <div className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-primary" />
              <CardTitle>Create a New Post</CardTitle>
            </div>
            <CardDescription>
              Fill out the form below to create your discussion post
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Enter a descriptive title for your discussion..." 
                          className="bg-slate-900/50"
                          {...field} 
                        />
                      </FormControl>
                      <FormDescription>
                        Be specific and clear to attract relevant responses
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="bg-slate-900/50">
                            <SelectValue placeholder="Select a category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="algorithms">Algorithms & Data Structures</SelectItem>
                          <SelectItem value="system-design">System Design</SelectItem>
                          <SelectItem value="frontend">Frontend Development</SelectItem>
                          <SelectItem value="backend">Backend Development</SelectItem>
                          <SelectItem value="behavioral">Behavioral Interview</SelectItem>
                          <SelectItem value="career">Career Advice</SelectItem>
                          <SelectItem value="general">General Discussion</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        Choose the most appropriate category for your discussion
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="content"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Content</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Share your experience, question, or insight in detail..." 
                          className="bg-slate-900/50 min-h-[200px]"
                          {...field} 
                        />
                      </FormControl>
                      <FormDescription>
                        Provide enough details for others to understand your post
                      </FormDescription>
                      <div className="flex justify-between items-center">
                        <FormMessage />
                        <div className="text-xs text-muted-foreground">
                          {field.value.length}/2000 characters
                        </div>
                      </div>
                    </FormItem>
                  )}
                />
                
                <div className="flex justify-end space-x-4 pt-4">
                  <Button 
                    type="button" 
                    variant="outline"
                    onClick={() => navigate("/forum")}
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-gradient-to-r from-primary to-blue-500 hover:from-primary/80 hover:to-blue-600"
                  >
                    {isSubmitting ? "Publishing..." : "Publish Post"}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ForumCreatePost;
