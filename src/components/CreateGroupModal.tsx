import React, { useState } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Check, X, Upload } from 'lucide-react';

interface CreateGroupModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: GroupFormData) => void;
}

export interface GroupFormData {
  name: string;
  technology: string;
  platforms: string[];
  description: string;
  frequency: string;
  isPrivate: boolean;
  language: string;
  timezone: string;
  profilePicture?: File | null;
}

const technologies = [
  'AI/ML', 'Web Dev', 'Cybersecurity', 'Mobile Dev', 
  'Data Science', 'DevOps', 'Blockchain', 'Game Dev'
];

const languages = [
  'English', 'Spanish', 'French', 'German', 'Portuguese',
  'Chinese', 'Japanese', 'Korean', 'Russian', 'Hindi', 'Arabic'
];

const timezones = [
  'UTC-12:00', 'UTC-11:00', 'UTC-10:00', 'UTC-09:00', 'UTC-08:00', 'UTC-07:00', 
  'UTC-06:00', 'UTC-05:00', 'UTC-04:00', 'UTC-03:00', 'UTC-02:00', 'UTC-01:00',
  'UTC+00:00', 'UTC+01:00', 'UTC+02:00', 'UTC+03:00', 'UTC+04:00', 'UTC+05:00',
  'UTC+06:00', 'UTC+07:00', 'UTC+08:00', 'UTC+09:00', 'UTC+10:00', 'UTC+11:00', 'UTC+12:00'
];

const steps = ['Group Basics', 'Platforms', 'Preferences', 'Review & Create'];

const CreateGroupModal: React.FC<CreateGroupModalProps> = ({ open, onOpenChange, onSubmit }) => {
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState<GroupFormData>({
    name: '',
    technology: '',
    platforms: [],
    description: '',
    frequency: 'Weekly',
    isPrivate: true,
    language: 'English',
    timezone: 'UTC+00:00',
    profilePicture: null,
  });
  
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFormData({ ...formData, profilePicture: file });
      
      // Create a preview URL
      const reader = new FileReader();
      reader.onload = (event) => {
        setImagePreview(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const updateField = (field: keyof GroupFormData, value: any) => {
    setFormData({ ...formData, [field]: value });
  };

  const togglePlatform = (platform: string) => {
    const platforms = [...formData.platforms];
    if (platforms.includes(platform)) {
      updateField('platforms', platforms.filter(p => p !== platform));
    } else {
      updateField('platforms', [...platforms, platform]);
    }
  };

  const nextStep = () => {
    if (step < steps.length - 1) {
      setStep(step + 1);
    } else {
      handleSubmit();
    }
  };

  const prevStep = () => {
    if (step > 0) {
      setStep(step - 1);
    }
  };

  const handleSubmit = () => {
    onSubmit(formData);
    setStep(0);
    setFormData({
      name: '',
      technology: '',
      platforms: [],
      description: '',
      frequency: 'Weekly',
      isPrivate: true,
      language: 'English',
      timezone: 'UTC+00:00',
      profilePicture: null,
    });
    setImagePreview(null);
    onOpenChange(false);
  };

  const handleCancel = () => {
    setStep(0);
    setFormData({
      name: '',
      technology: '',
      platforms: [],
      description: '',
      frequency: 'Weekly',
      isPrivate: true,
      language: 'English',
      timezone: 'UTC+00:00',
      profilePicture: null,
    });
    setImagePreview(null);
    onOpenChange(false);
  };

  const isNextDisabled = () => {
    if (step === 0) {
      return !formData.name || !formData.technology || !formData.description;
    }
    if (step === 1) {
      return formData.platforms.length === 0;
    }
    return false;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px] bg-card border-white/10">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-center pb-1">
            Create Study Group
          </DialogTitle>
          <DialogDescription className="text-center text-muted-foreground">
            Connect with learners worldwide and accelerate your growth
          </DialogDescription>
        </DialogHeader>

        {/* Progress Steps */}
        <div className="w-full flex justify-between mb-6 relative">
          {steps.map((label, idx) => (
            <div key={idx} className="flex flex-col items-center z-10">
              <div 
                className={`w-8 h-8 rounded-full flex items-center justify-center 
                  ${idx <= step ? 'bg-groovlearn-primary text-black' : 'bg-muted text-muted-foreground'}`}
              >
                {idx < step ? <Check className="h-4 w-4" /> : idx + 1}
              </div>
              <span className="text-xs mt-1 text-muted-foreground">{label}</span>
            </div>
          ))}
          {/* Progress line */}
          <div className="absolute top-4 left-0 w-full h-0.5 bg-muted -z-0">
            <div 
              className="h-full bg-groovlearn-primary transition-all" 
              style={{ width: `${(step / (steps.length - 1)) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Step 1: Group Basics */}
        {step === 0 && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Group Name</Label>
              <Input 
                id="name" 
                value={formData.name} 
                onChange={(e) => updateField('name', e.target.value)} 
                placeholder="Enter a catchy name for your group"
                className="bg-muted border-white/10 focus-visible:ring-groovlearn-primary"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="technology">Technology Focus</Label>
              <Select 
                value={formData.technology} 
                onValueChange={(value) => updateField('technology', value)}
              >
                <SelectTrigger className="bg-muted border-white/10 focus:ring-groovlearn-primary">
                  <SelectValue placeholder="Select a technology" />
                </SelectTrigger>
                <SelectContent className="bg-card border-white/10">
                  {technologies.map((tech) => (
                    <SelectItem key={tech} value={tech}>{tech}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Group Description</Label>
              <Textarea 
                id="description" 
                value={formData.description} 
                onChange={(e) => updateField('description', e.target.value)} 
                placeholder="Describe what your group will focus on and what members can expect"
                className="bg-muted border-white/10 focus-visible:ring-groovlearn-primary"
                rows={3}
              />
            </div>
          </div>
        )}

        {/* Step 2: Platforms */}
        {step === 1 && (
          <div className="space-y-4">
            <div className="space-y-3">
              <Label>Platform Selection</Label>
              <p className="text-xs text-muted-foreground">Select where your study group will collaborate</p>
              
              <div className="grid grid-cols-1 gap-3">
                {['WhatsApp', 'Telegram', 'Discord'].map((platform) => (
                  <div
                    key={platform}
                    className={`flex items-center p-3 rounded-lg border transition-all cursor-pointer
                      ${formData.platforms.includes(platform) 
                        ? 'border-groovlearn-primary bg-groovlearn-primary/10' 
                        : 'border-white/10 bg-muted hover:bg-muted/80'}`}
                    onClick={() => togglePlatform(platform)}
                  >
                    <Checkbox
                      checked={formData.platforms.includes(platform)}
                      className="data-[state=checked]:bg-groovlearn-primary data-[state=checked]:text-black border-white/30"
                    />
                    <div className="ml-3 flex-1">
                      <span className="font-medium text-white">{platform}</span>
                      <p className="text-xs text-muted-foreground">
                        {platform === 'WhatsApp' && 'Quick messaging & voice notes'}
                        {platform === 'Telegram' && 'Structured channels & bots'}
                        {platform === 'Discord' && 'Voice calls & integrations'}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Preferences */}
        {step === 2 && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="frequency">Study Frequency</Label>
              <Select 
                value={formData.frequency} 
                onValueChange={(value) => updateField('frequency', value)}
              >
                <SelectTrigger className="bg-muted border-white/10 focus:ring-groovlearn-primary">
                  <SelectValue placeholder="How often will you meet?" />
                </SelectTrigger>
                <SelectContent className="bg-card border-white/10">
                  <SelectItem value="Daily">Daily</SelectItem>
                  <SelectItem value="Weekly">Weekly</SelectItem>
                  <SelectItem value="Bi-weekly">Bi-weekly</SelectItem>
                  <SelectItem value="Monthly">Monthly</SelectItem>
                  <SelectItem value="Custom">Custom</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="privacy">Private Group</Label>
                <Switch 
                  id="privacy" 
                  checked={formData.isPrivate} 
                  onCheckedChange={(checked) => updateField('isPrivate', checked)}
                  className="data-[state=checked]:bg-groovlearn-primary"
                />
              </div>
              <p className="text-xs text-muted-foreground">
                {formData.isPrivate 
                  ? "Members can only join via invite link" 
                  : "Anyone can discover and join your group"}
              </p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="language">Preferred Language</Label>
              <Select 
                value={formData.language} 
                onValueChange={(value) => updateField('language', value)}
              >
                <SelectTrigger className="bg-muted border-white/10 focus:ring-groovlearn-primary">
                  <SelectValue placeholder="Select a language" />
                </SelectTrigger>
                <SelectContent className="bg-card border-white/10">
                  {languages.map((lang) => (
                    <SelectItem key={lang} value={lang}>{lang}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="timezone">Time Zone</Label>
              <Select 
                value={formData.timezone} 
                onValueChange={(value) => updateField('timezone', value)}
              >
                <SelectTrigger className="bg-muted border-white/10 focus:ring-groovlearn-primary">
                  <SelectValue placeholder="Select your timezone" />
                </SelectTrigger>
                <SelectContent className="bg-card border-white/10">
                  {timezones.map((tz) => (
                    <SelectItem key={tz} value={tz}>{tz}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        )}

        {/* Step 4: Review & Create */}
        {step === 3 && (
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="relative group">
                <Avatar className="h-16 w-16 bg-groovlearn-primary/20 text-2xl">
                  <AvatarImage src={imagePreview || ''} alt="Group profile" />
                  <AvatarFallback>{formData.technology?.charAt(0) || '🤓'}</AvatarFallback>
                </Avatar>
                <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                  <Label htmlFor="picture" className="cursor-pointer p-2">
                    <Upload className="h-5 w-5" />
                  </Label>
                  <Input 
                    id="picture" 
                    type="file" 
                    className="hidden" 
                    onChange={handleFileChange}
                    accept="image/*"
                  />
                </div>
              </div>
              
              <div>
                <h3 className="font-bold text-xl">{formData.name || 'Unnamed Group'}</h3>
                <p className="text-sm text-muted-foreground">{formData.technology || 'No focus set'}</p>
              </div>
            </div>
            
            <div className="space-y-1 bg-muted/30 p-3 rounded-md">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Platforms:</span>
                <span className="text-sm">{formData.platforms.join(', ') || 'None selected'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Frequency:</span>
                <span className="text-sm">{formData.frequency}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Visibility:</span>
                <span className="text-sm">{formData.isPrivate ? 'Private' : 'Public'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Language:</span>
                <span className="text-sm">{formData.language}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Timezone:</span>
                <span className="text-sm">{formData.timezone}</span>
              </div>
            </div>
            
            <div className="p-3 rounded-md bg-muted/30">
              <h4 className="font-medium text-sm mb-1">Description:</h4>
              <p className="text-sm">{formData.description}</p>
            </div>
          </div>
        )}

        <DialogFooter className="flex justify-between mt-2">
          {step > 0 ? (
            <Button 
              variant="ghost" 
              onClick={prevStep}
              className="hover:bg-muted"
            >
              Back
            </Button>
          ) : (
            <Button 
              variant="ghost" 
              onClick={handleCancel}
              className="hover:bg-muted"
            >
              Cancel
            </Button>
          )}
          <Button 
            onClick={nextStep}
            disabled={isNextDisabled()}
            className={`${step === steps.length - 1 ? 'bg-groovlearn-accent hover:bg-groovlearn-accent/90 text-black' : 'bg-groovlearn-primary hover:bg-groovlearn-primary/90 text-black'}`}
          >
            {step === steps.length - 1 ? 'Create Group' : 'Continue'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreateGroupModal;