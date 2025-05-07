import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Minus, Plus, RotateCcw } from "lucide-react";

interface ZoomableImageProps {
  src: string;
  alt: string;
}

export const ZoomableImage: React.FC<ZoomableImageProps> = ({ src, alt }) => {
  const [scale, setScale] = useState(1);
  const [dragging, setDragging] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [startPosition, setStartPosition] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  const handleZoomIn = () => {
    setScale((prev) => Math.min(prev + 0.2, 3));
  };

  const handleZoomOut = () => {
    setScale((prev) => Math.max(prev - 0.2, 0.5));
  };

  const handleReset = () => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setDragging(true);
    setStartPosition({
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!dragging) return;
    setPosition({
      x: e.clientX - startPosition.x,
      y: e.clientY - startPosition.y,
    });
  };

  const handleMouseUp = () => {
    setDragging(false);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setDragging(true);
    setStartPosition({
      x: e.touches[0].clientX - position.x,
      y: e.touches[0].clientY - position.y,
    });
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!dragging) return;
    setPosition({
      x: e.touches[0].clientX - startPosition.x,
      y: e.touches[0].clientY - startPosition.y,
    });
  };

  const handleTouchEnd = () => {
    setDragging(false);
  };

  return (
    <div className="animate-fade-in w-full">
      <div className="flex justify-center mb-4 space-x-2">
        <Button onClick={handleZoomIn} variant="outline" size="sm">
          <Plus className="h-4 w-4" />
        </Button>
        <Button onClick={handleZoomOut} variant="outline" size="sm">
          <Minus className="h-4 w-4" />
        </Button>
        <Button onClick={handleReset} variant="outline" size="sm">
          <RotateCcw className="h-4 w-4" />
        </Button>
      </div>

      <Card 
        className="overflow-hidden max-w-full border border-gray-200 dark:border-gray-800 shadow-lg"
        ref={containerRef}
      >
        <div
          className={`relative overflow-auto max-h-[70vh] cursor-${dragging ? "grabbing" : "grab"}`}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <img
            src={src}
            alt={alt}
            className="transform transition-transform duration-200"
            style={{
              transform: `scale(${scale}) translate(${position.x / scale}px, ${position.y / scale}px)`,
              transformOrigin: "0 0",
            }}
            loading="lazy"
          />
        </div>
      </Card>
    </div>
  );
};