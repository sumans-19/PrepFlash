import React from 'react';
import { Check } from 'lucide-react';
import { Template } from '../../types/index';

interface TemplateItemProps {
  template: Template;
  isSelected: boolean;
  onSelect: (templateId: string) => void;
}

const TemplateItem: React.FC<TemplateItemProps> = ({ template, isSelected, onSelect }) => {
  return (
    <div 
      className={`relative overflow-hidden border rounded-lg cursor-pointer transition-all duration-200 ${
        isSelected 
          ? 'border-[#8A63D2] ring-2 ring-[#8A63D2] ring-opacity-50' 
          : 'border-gray-200 hover:border-[#8A63D2]'
      }`}
      onClick={() => onSelect(template.id)}
    >
      <div className="aspect-[3/4] relative">
        <img 
          src={template.thumbnail} 
          alt={template.name} 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black opacity-0 hover:opacity-10 transition-opacity duration-200" />
      </div>
      <div className="p-3 bg-white">
        <div className="flex items-center justify-between">
          <h3 className="font-medium text-gray-800">{template.name}</h3>
          {isSelected && (
            <span className="flex items-center justify-center h-5 w-5 bg-[#8A63D2] rounded-full">
              <Check className="h-3 w-3 text-white" />
            </span>
          )}
        </div>
        <p className="text-sm text-gray-500 mt-1">{template.description}</p>
      </div>
    </div>
  );
};

export default TemplateItem;