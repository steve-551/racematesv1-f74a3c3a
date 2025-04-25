
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import { useOnboardingStore } from '@/stores/useOnboardingStore';
import { toast } from 'sonner';
import { ArrowLeft, ArrowRight, Check } from 'lucide-react';
import { useRacerStore, Platform, LicenseClass } from '@/stores/useRacerStore';

const Onboarding: React.FC = () => {
  const { steps, currentStepIndex, setCurrentStep, completeStep, completeOnboarding } = useOnboardingStore();
  const { updateRacerProfile } = useRacerStore();
  const navigate = useNavigate();
  
  // Local state for form values
  const [formValues, setFormValues] = useState({
    displayName: '',
    region: '',
    timezone: '',
    platforms: [] as Platform[],
    iracing_stats: {
      irating: 1500,
      safety_rating: 2.5,
      license_class: 'D' as LicenseClass,
      tt_rating: 1200
    },
    driving_styles: [] as string[],
    role_tags: [] as string[],
    looking_for_team: false
  });
  
  const currentStep = steps[currentStepIndex];
  const progress = ((currentStepIndex + 1) / steps.length) * 100;
  
  const handleNext = () => {
    completeStep(currentStep.id);
    
    // If this is the last step, complete onboarding
    if (currentStepIndex === steps.length - 1) {
      handleCompleteOnboarding();
    } else {
      setCurrentStep(currentStepIndex + 1);
    }
  };
  
  const handleBack = () => {
    if (currentStepIndex > 0) {
      setCurrentStep(currentStepIndex - 1);
    }
  };
  
  const handleCompleteOnboarding = async () => {
    try {
      // Update racer profile with all the collected information
      await updateRacerProfile({
        display_name: formValues.displayName,
        region: formValues.region,
        timezone: formValues.timezone,
        platforms: formValues.platforms,
        iracing_stats: formValues.iracing_stats,
        driving_styles: formValues.driving_styles,
        role_tags: formValues.role_tags,
        looking_for_team: formValues.looking_for_team,
        onboarding_complete: true
      });
      
      await completeOnboarding();
      toast.success('Profile setup complete!');
      navigate('/profile');
    } catch (error) {
      toast.error('Failed to complete onboarding');
      console.error(error);
    }
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    // Handle nested objects like iracing_stats
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormValues(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent as keyof typeof prev],
          [child]: value
        }
      }));
    } else {
      setFormValues(prev => ({ ...prev, [name]: value }));
    }
  };
  
  const togglePlatform = (platform: Platform) => {
    setFormValues(prev => {
      if (prev.platforms.includes(platform)) {
        return {
          ...prev,
          platforms: prev.platforms.filter(p => p !== platform)
        };
      } else {
        return {
          ...prev,
          platforms: [...prev.platforms, platform]
        };
      }
    });
  };
  
  const toggleDrivingStyle = (style: string) => {
    setFormValues(prev => {
      if (prev.driving_styles.includes(style)) {
        return {
          ...prev,
          driving_styles: prev.driving_styles.filter(s => s !== style)
        };
      } else {
        return {
          ...prev,
          driving_styles: [...prev.driving_styles, style]
        };
      }
    });
  };
  
  // Validate if the current step is complete
  const isStepComplete = () => {
    switch (currentStep.id) {
      case 'personal':
        return formValues.displayName && formValues.region && formValues.timezone;
      case 'platforms':
        return formValues.platforms.length > 0;
      case 'iRacing':
        return true; // Always allow to proceed from this step
      case 'preferences':
        return formValues.driving_styles.length > 0;
      case 'finalSetup':
        return true; // Always allow to complete
      default:
        return false;
    }
  };
  
  const renderStepContent = () => {
    switch (currentStep.id) {
      case 'personal':
        return (
          <>
            <CardDescription>
              Let's start with your basic information. This will help other racers find and connect with you.
            </CardDescription>
            <div className="space-y-4 mt-6">
              <div className="space-y-2">
                <Label htmlFor="displayName">Display Name</Label>
                <Input 
                  id="displayName" 
                  name="displayName"
                  placeholder="How you'll appear to others"
                  value={formValues.displayName}
                  onChange={handleInputChange}
                  className="bg-gray-800 border-gray-700"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="region">Region</Label>
                <Select 
                  onValueChange={(value) => setFormValues(prev => ({ ...prev, region: value }))}
                  value={formValues.region}
                >
                  <SelectTrigger className="bg-gray-800 border-gray-700">
                    <SelectValue placeholder="Select your region" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="North America">North America</SelectItem>
                    <SelectItem value="Europe">Europe</SelectItem>
                    <SelectItem value="Asia">Asia</SelectItem>
                    <SelectItem value="South America">South America</SelectItem>
                    <SelectItem value="Oceania">Oceania</SelectItem>
                    <SelectItem value="Global">Global</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="timezone">Timezone</Label>
                <Select 
                  onValueChange={(value) => setFormValues(prev => ({ ...prev, timezone: value }))}
                  value={formValues.timezone}
                >
                  <SelectTrigger className="bg-gray-800 border-gray-700">
                    <SelectValue placeholder="Select your timezone" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="EST">EST (UTC-5)</SelectItem>
                    <SelectItem value="CST">CST (UTC-6)</SelectItem>
                    <SelectItem value="MST">MST (UTC-7)</SelectItem>
                    <SelectItem value="PST">PST (UTC-8)</SelectItem>
                    <SelectItem value="GMT">GMT (UTC+0)</SelectItem>
                    <SelectItem value="CET">CET (UTC+1)</SelectItem>
                    <SelectItem value="JST">JST (UTC+9)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </>
        );
        
      case 'platforms':
        return (
          <>
            <CardDescription>
              Select the racing platforms you use. This helps us connect you with racers on the same platforms.
            </CardDescription>
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
              {['iRacing', 'F1', 'ACC', 'GT7', 'rFactor', 'Automobilista', 'RaceRoom'].map((platform) => (
                <div key={platform} className="flex items-center space-x-2">
                  <Checkbox 
                    id={platform} 
                    checked={formValues.platforms.includes(platform as Platform)}
                    onCheckedChange={() => togglePlatform(platform as Platform)}
                  />
                  <Label htmlFor={platform} className="cursor-pointer">{platform}</Label>
                </div>
              ))}
            </div>
          </>
        );
        
      case 'iRacing':
        return (
          <>
            <CardDescription>
              Enter your iRacing statistics if applicable. This information will be displayed on your profile.
            </CardDescription>
            <div className="space-y-4 mt-6">
              <div className="space-y-2">
                <Label htmlFor="irating">iRating</Label>
                <Input 
                  id="irating" 
                  name="iracing_stats.irating"
                  type="number"
                  placeholder="Your current iRating"
                  value={formValues.iracing_stats.irating}
                  onChange={handleInputChange}
                  className="bg-gray-800 border-gray-700"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="safety_rating">Safety Rating</Label>
                <Input 
                  id="safety_rating" 
                  name="iracing_stats.safety_rating"
                  type="number"
                  step="0.1"
                  min="0"
                  max="5"
                  placeholder="0.0 - 5.0"
                  value={formValues.iracing_stats.safety_rating}
                  onChange={handleInputChange}
                  className="bg-gray-800 border-gray-700"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="license_class">License Class</Label>
                <Select 
                  onValueChange={(value) => setFormValues(prev => ({ 
                    ...prev, 
                    iracing_stats: {
                      ...prev.iracing_stats,
                      license_class: value as LicenseClass
                    }
                  }))}
                  value={formValues.iracing_stats.license_class}
                >
                  <SelectTrigger className="bg-gray-800 border-gray-700">
                    <SelectValue placeholder="Select license class" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="rookie">Rookie</SelectItem>
                    <SelectItem value="D">D</SelectItem>
                    <SelectItem value="C">C</SelectItem>
                    <SelectItem value="B">B</SelectItem>
                    <SelectItem value="A">A</SelectItem>
                    <SelectItem value="pro">PRO</SelectItem>
                    <SelectItem value="black">World Championship</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </>
        );
        
      case 'preferences':
        return (
          <>
            <CardDescription>
              Tell us about your racing preferences and styles. This helps recommend events and teammates.
            </CardDescription>
            <div className="mt-6">
              <Label className="mb-2 block">Driving Disciplines</Label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {['Endurance', 'Sprint', 'Oval', 'Rally', 'Drift', 'F1', 'GT3', 'GT4', 'NASCAR', 'Dirt'].map((style) => (
                  <div key={style} className="flex items-center space-x-2">
                    <Checkbox 
                      id={style} 
                      checked={formValues.driving_styles.includes(style)}
                      onCheckedChange={() => toggleDrivingStyle(style)}
                    />
                    <Label htmlFor={style} className="cursor-pointer">{style}</Label>
                  </div>
                ))}
              </div>
              
              <div className="mt-6">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="looking_for_team"
                    checked={formValues.looking_for_team}
                    onCheckedChange={(checked) => 
                      setFormValues(prev => ({ ...prev, looking_for_team: checked === true }))
                    }
                  />
                  <Label htmlFor="looking_for_team" className="cursor-pointer">I'm looking to join a team</Label>
                </div>
              </div>
            </div>
          </>
        );
        
      case 'finalSetup':
        return (
          <>
            <CardDescription>
              Great job! Your profile is almost ready. Review your information below.
            </CardDescription>
            <div className="space-y-4 mt-6">
              <div className="bg-gray-800 p-4 rounded-md">
                <h4 className="font-medium mb-2">Profile Summary</h4>
                <ul className="space-y-1 text-sm text-gray-300">
                  <li><span className="text-gray-400">Name:</span> {formValues.displayName}</li>
                  <li><span className="text-gray-400">Region:</span> {formValues.region}</li>
                  <li><span className="text-gray-400">Timezone:</span> {formValues.timezone}</li>
                  <li>
                    <span className="text-gray-400">Platforms:</span> {formValues.platforms.join(', ')}
                  </li>
                  <li><span className="text-gray-400">iRating:</span> {formValues.iracing_stats.irating}</li>
                  <li>
                    <span className="text-gray-400">License:</span> {formValues.iracing_stats.license_class} {formValues.iracing_stats.safety_rating.toFixed(1)}
                  </li>
                  <li>
                    <span className="text-gray-400">Driving Styles:</span> {formValues.driving_styles.join(', ')}
                  </li>
                  <li>
                    <span className="text-gray-400">Looking for Team:</span> {formValues.looking_for_team ? 'Yes' : 'No'}
                  </li>
                </ul>
              </div>
              <p className="text-sm text-gray-300">
                You can edit these details and more from your profile page after completing setup.
              </p>
            </div>
          </>
        );
        
      default:
        return null;
    }
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-racing-dark p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-orbitron font-bold text-white">
            RACE<span className="text-racing-red">MATES</span>
          </h1>
          <p className="text-gray-400 mt-2">Complete your profile setup</p>
        </div>
        
        <div className="mb-6">
          <div className="flex justify-between text-sm mb-1">
            <span>Step {currentStepIndex + 1} of {steps.length}</span>
            <span>{steps[currentStepIndex].title}</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
        
        <Card className="racing-card border-gray-800">
          <CardHeader>
            <CardTitle className="font-rajdhani">{steps[currentStepIndex].title}</CardTitle>
          </CardHeader>
          <CardContent>
            {renderStepContent()}
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button 
              variant="outline" 
              onClick={handleBack} 
              disabled={currentStepIndex === 0}
              className="border-gray-700"
            >
              <ArrowLeft size={16} className="mr-2" /> Back
            </Button>
            
            <Button 
              onClick={handleNext} 
              disabled={!isStepComplete()}
              className={`racing-btn ${currentStepIndex === steps.length - 1 ? 'w-40' : ''}`}
            >
              {currentStepIndex === steps.length - 1 ? (
                <>
                  <Check size={16} className="mr-2" /> Complete Setup
                </>
              ) : (
                <>
                  Next <ArrowRight size={16} className="ml-2" />
                </>
              )}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Onboarding;
