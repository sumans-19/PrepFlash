
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { BookText, BookOpen, ListCheck, ChevronRight } from "lucide-react";

interface PrepOptionCardProps {
  title: string;
  description: string;
  route: string;
  icon: string;
}

const PrepOptionCard: React.FC<PrepOptionCardProps> = ({ title, description, route, icon }) => {
  const getIcon = () => {
    switch (icon) {
      case "book-open":
        return <BookOpen className="h-6 w-6 text-prep-secondary" />;
      case "list-check":
        return <ListCheck className="h-6 w-6 text-prep-secondary" />;
      case "book-text":
        return <BookText className="h-6 w-6 text-prep-secondary" />;
      default:
        return <BookText className="h-6 w-6 text-prep-secondary" />;
    }
  };

  return (
    <Card className="overflow-hidden transition-all hover:shadow-lg border-prep-accent hover:border-prep-secondary">
      <CardHeader className="bg-prep-light pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl text-prep-dark">{title}</CardTitle>
          {getIcon()}
        </div>
      </CardHeader>
      <CardContent className="pt-4">
        <p className="text-gray-600 mb-6 text-sm">{description}</p>
        <Button asChild className="w-full flex items-center justify-between bg-prep-primary hover:bg-prep-secondary">
          <Link to={route}>
            Start
            <ChevronRight className="h-4 w-4 ml-2" />
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
};

export default PrepOptionCard;
