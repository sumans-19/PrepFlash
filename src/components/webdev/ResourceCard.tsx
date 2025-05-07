import React from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface ResourceCardProps {
  title: string;
  description: string;
  type: string;
  url: string;
  imageUrl: string;
}

const ResourceCard: React.FC<ResourceCardProps> = ({
  title,
  description,
  type,
  url,
  imageUrl,
}) => {
  return (
    <Card className="relative overflow-hidden rounded-3xl backdrop-blur-md bg-white/10 hover:bg-white/20 transition-all duration-500 shadow-2xl hover:shadow-[0_20px_40px_rgba(0,0,0,0.4)] group">
      <div className="h-44 overflow-hidden">
        <img
          src={imageUrl}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = '/placeholder.svg';
          }}
        />
      </div>

      <CardContent className="p-5 text-white">
        <div className="flex justify-between items-start mb-3">
          <h3 className="font-extrabold text-2xl drop-shadow-md tracking-tight">
            {title}
          </h3>
          <Badge className="bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-md animate-pulse">
            {type}
          </Badge>
        </div>
        <p className="text-sm text-zinc-200 leading-relaxed">{description}</p>
      </CardContent>

      <CardFooter className="p-5 pt-2 flex justify-end">
        <Button
          variant="outline"
          className="border-white text-white hover:bg-white/20 backdrop-blur transition-all duration-300"
          onClick={() => window.open(url, '_blank')}
        >
          Visit Resource
        </Button>
      </CardFooter>

      {/* Glow ring on hover */}
      <div className="absolute inset-0 rounded-3xl border border-white/20 group-hover:border-white/40 transition duration-500 pointer-events-none"></div>
    </Card>
  );
};

export default ResourceCard;
