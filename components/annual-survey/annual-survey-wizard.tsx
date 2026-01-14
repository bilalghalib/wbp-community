'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { getUserImpactStats, ImpactStats } from '@/lib/services/season-service';
import { createClient } from '@/lib/supabase/client';

enum Step {
  Welcome = 0,
  Organization = 1, // Admin Only
  Practitioners = 2,
  Resources = 3,
  Insights = 4,
  Complete = 5
}

export function AnnualSurveyWizard() {
  const [currentStep, setCurrentStep] = useState<Step>(Step.Welcome);
  const [isAdmin, setIsAdmin] = useState(false);
  const [stats, setStats] = useState<ImpactStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Check Admin Role
      const { data: membership } = await supabase
        .from('organization_memberships')
        .select('role')
        .eq('user_id', user.id)
        .single();
      
      setIsAdmin(membership?.role === 'primary_admin' || membership?.role === 'backup_admin');

      // Load Stats
      const impact = await getUserImpactStats();
      setStats(impact);
      setLoading(false);
    }
    loadData();
  }, []);

  const progress = (currentStep / Step.Complete) * 100;

  const next = () => {
    let nextStep = currentStep + 1;
    // Skip Organization step if not admin
    if (nextStep === Step.Organization && !isAdmin) {
      nextStep = Step.Practitioners;
    }
    setCurrentStep(Math.min(nextStep, Step.Complete));
  };

  const back = () => {
    let prevStep = currentStep - 1;
    if (prevStep === Step.Organization && !isAdmin) {
      prevStep = Step.Welcome;
    }
    setCurrentStep(Math.max(prevStep, Step.Welcome));
  };

  if (loading) return <div className="p-12 text-center">Kindling the hearth...</div>;

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      {/* "Magic" Header */}
      <div className="mb-8 text-center">
        <div className="inline-block p-3 bg-orange-100 rounded-full mb-4">
          🔥
        </div>
        <h1 className="text-3xl font-serif text-[#2C3E50]">The 2026 Gathering</h1>
        <p className="text-gray-600 mt-2">Kindle the fire to enter the Wellbeing Hearth</p>
      </div>

      <div className="mb-8">
        <Progress value={progress} className="h-2 bg-orange-100" />
      </div>

      <Card className="p-8 min-h-[400px] border-orange-100 shadow-lg">
        {currentStep === Step.Welcome && (
          <div className="space-y-8 text-center">
            <h2 className="text-2xl font-serif text-[#2C3E50]">Your Ripple Effect</h2>
            
            {/* Impact Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-[#FDF6E3] p-6 rounded-xl border border-orange-100">
                <div className="text-4xl font-bold text-orange-600 mb-2">{stats?.provider_views || 0}</div>
                <div className="text-sm text-gray-600">People viewed your Providers</div>
              </div>
              <div className="bg-[#FDF6E3] p-6 rounded-xl border border-orange-100">
                <div className="text-4xl font-bold text-orange-600 mb-2">{stats?.resource_views || 0}</div>
                <div className="text-sm text-gray-600">People viewed your Resources</div>
              </div>
              <div className="bg-[#FDF6E3] p-6 rounded-xl border border-orange-100">
                <div className="text-4xl font-bold text-orange-600 mb-2">{stats?.resource_downloads || 0}</div>
                <div className="text-sm text-gray-600">Resources Downloaded</div>
              </div>
            </div>

            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Your contributions have supported the network in powerful ways. 
              To keep the fire burning for 2026, we invite you to share your latest wisdom.
            </p>

            <Button onClick={next} size="lg" className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-6 text-lg rounded-full">
              Add My Spark ✨
            </Button>
          </div>
        )}

        {currentStep === Step.Organization && (
          <div>
            <h2 className="text-2xl font-serif mb-4">Organization Profile</h2>
            <p className="text-gray-500 mb-6">As an admin, please verify your organization's details are up to date.</p>
            {/* Placeholder for Org Form */}
            <div className="h-64 bg-gray-50 rounded flex items-center justify-center text-gray-400 border border-dashed">
              [Organization Profile Form Component]
            </div>
            <div className="flex justify-between mt-8">
              <Button variant="outline" onClick={back}>Back</Button>
              <Button onClick={next} className="bg-orange-600 hover:bg-orange-700">Confirm & Continue</Button>
            </div>
          </div>
        )}

        {currentStep === Step.Practitioners && (
          <div>
            <h2 className="text-2xl font-serif mb-4">Share a New Practitioner?</h2>
            <p className="text-gray-500 mb-6">
              Have you worked with someone transformative this year? 
              (You can manage previous practitioners later on your profile).
            </p>
            {/* Placeholder for Provider Repeater */}
            <div className="h-64 bg-gray-50 rounded flex items-center justify-center text-gray-400 border border-dashed">
              [Practitioner Add Form - Optional]
            </div>
            <div className="flex justify-between mt-8">
              <Button variant="outline" onClick={back}>Back</Button>
              <div className="space-x-2">
                <Button variant="ghost" onClick={next}>Skip for now</Button>
                <Button onClick={next} className="bg-orange-600 hover:bg-orange-700">Add & Continue</Button>
              </div>
            </div>
          </div>
        )}

        {currentStep === Step.Resources && (
          <div>
            <h2 className="text-2xl font-serif mb-4">Share a New Resource?</h2>
            <p className="text-gray-500 mb-6">
              Upload a toolkit, report, or link that could help others.
            </p>
            {/* Placeholder for Resource Repeater */}
            <div className="h-64 bg-gray-50 rounded flex items-center justify-center text-gray-400 border border-dashed">
              [Resource Add Form - Optional]
            </div>
            <div className="flex justify-between mt-8">
              <Button variant="outline" onClick={back}>Back</Button>
              <div className="space-x-2">
                <Button variant="ghost" onClick={next}>Skip for now</Button>
                <Button onClick={next} className="bg-orange-600 hover:bg-orange-700">Add & Continue</Button>
              </div>
            </div>
          </div>
        )}

        {currentStep === Step.Insights && (
          <div>
            <h2 className="text-2xl font-serif mb-4">Regional Insights</h2>
            <p className="text-gray-500 mb-6">
              This is the heart of the exchange. Your reflection helps us map the state of wellbeing.
            </p>
            {/* Placeholder for 8-Question Form */}
            <div className="h-64 bg-gray-50 rounded flex items-center justify-center text-gray-400 border border-dashed">
              [8 Question Insights Form - Required]
            </div>
            <div className="flex justify-between mt-8">
              <Button variant="outline" onClick={back}>Back</Button>
              <Button onClick={next} className="bg-orange-600 hover:bg-orange-700">Submit Contribution</Button>
            </div>
          </div>
        )}

        {currentStep === Step.Complete && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔥</div>
            <h2 className="text-3xl font-serif mb-4 text-[#2C3E50]">The Hearth Grows Brighter</h2>
            <p className="text-lg text-gray-600 mb-8 max-w-xl mx-auto">
              Thank you for your spark. You have unlocked full access to the 2026 Season.
            </p>
            <Button size="lg" onClick={() => window.location.href = '/dashboard'} className="bg-orange-600 hover:bg-orange-700 rounded-full px-8">
              Enter the Hearth
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
}
