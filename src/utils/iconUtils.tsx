import * as LucideIcons from 'lucide-react';

export const getDynamicIcon = (iconName: string) => {
  const icon = (LucideIcons as any)[iconName.charAt(0).toUpperCase() + iconName.slice(1)];
  return icon || LucideIcons.HelpCircle;
};