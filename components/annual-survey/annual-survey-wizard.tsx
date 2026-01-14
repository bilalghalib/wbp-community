'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { createClient } from '@/lib/supabase/client';

enum Step {
  Welcome = 0,
  Organization = 1, // Admin Only
  Practitioners = 2,
  Resources = 3,
  Insights = 4,
  Complete = 5
}

interface UserContext {
  isAdmin: boolean;
  isFirstTime: boolean;
  hasSharedPractitioners: boolean;
  hasSharedResources: boolean;
  practitionerViewCount: number;
  resourceDownloadCount: number;
  communityStats: {
    totalPractitioners: number;
    totalResources: number;
    totalOrganizations: number;
  };
}

export function AnnualSurveyWizard() {
  const [currentStep, setCurrentStep] = useState<Step>(Step.Welcome);
  const [context, setContext] = useState<UserContext | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Check Admin Role
      const { data: membership } = await supabase
        .from('organization_memberships')
        .select('role, organization_id')
        .eq('user_id', user.id)
        .single();

      const isAdmin = membership?.role === 'primary_admin' || membership?.role === 'backup_admin';

      // Check if user has shared anything before
      const { count: practitionerCount } = await supabase
        .from('service_provider_recommendations')
        .select('*', { count: 'exact', head: true })
        .eq('recommended_by', user.id);

      const { count: resourceCount } = await supabase
        .from('research_documents')
        .select('*', { count: 'exact', head: true })
        .eq('uploaded_by', user.id);

      const hasSharedPractitioners = (practitionerCount || 0) > 0;
      const hasSharedResources = (resourceCount || 0) > 0;
      const isFirstTime = !hasSharedPractitioners && !hasSharedResources;

      // Get community stats for first-time users
      const { count: totalPractitioners } = await supabase
        .from('service_providers')
        .select('*', { count: 'exact', head: true });

      const { count: totalResources } = await supabase
        .from('research_documents')
        .select('*', { count: 'exact', head: true });

      const { count: totalOrganizations } = await supabase
        .from('organizations')
        .select('*', { count: 'exact', head: true })
        .eq('is_active', true);

      // Get engagement stats for returning users (simplified - would use RPC in production)
      // For now, using placeholder logic
      const practitionerViewCount = hasSharedPractitioners ? Math.floor(Math.random() * 10) + 1 : 0;
      const resourceDownloadCount = hasSharedResources ? Math.floor(Math.random() * 5) + 1 : 0;

      setContext({
        isAdmin,
        isFirstTime,
        hasSharedPractitioners,
        hasSharedResources,
        practitionerViewCount,
        resourceDownloadCount,
        communityStats: {
          totalPractitioners: totalPractitioners || 0,
          totalResources: totalResources || 0,
          totalOrganizations: totalOrganizations || 0,
        }
      });
      setLoading(false);
    }
    loadData();
  }, []);

  const progress = (currentStep / Step.Complete) * 100;

  const next = () => {
    let nextStep = currentStep + 1;
    if (nextStep === Step.Organization && !context?.isAdmin) {
      nextStep = Step.Practitioners;
    }
    setCurrentStep(Math.min(nextStep, Step.Complete));
  };

  const back = () => {
    let prevStep = currentStep - 1;
    if (prevStep === Step.Organization && !context?.isAdmin) {
      prevStep = Step.Welcome;
    }
    setCurrentStep(Math.max(prevStep, Step.Welcome));
  };

  if (loading) {
    return (
      <div className="p-12 text-center text-gray-500">
        Loading...
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto py-8 px-4">
      {/* Header */}
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-serif text-[#2C3E50]">2026 Annual Contribution</h1>
        <p className="text-gray-500 mt-2">
          {currentStep === Step.Welcome
            ? "A moment to give and receive"
            : `Step ${currentStep} of ${context?.isAdmin ? 5 : 4}`}
        </p>
      </div>

      {currentStep !== Step.Welcome && currentStep !== Step.Complete && (
        <div className="mb-8">
          <Progress value={progress} className="h-1.5 bg-gray-100" />
        </div>
      )}

      <Card className="p-8 min-h-[400px] shadow-sm">

        {/* WELCOME STEP */}
        {currentStep === Step.Welcome && (
          <div className="space-y-8">

            {/* FIRST-TIME USER */}
            {context?.isFirstTime && (
              <>
                <div className="text-center">
                  <h2 className="text-2xl font-serif text-[#2C3E50] mb-4">
                    Welcome to the community
                  </h2>
                  <p className="text-gray-600 max-w-xl mx-auto">
                    This platform runs on generosity. Everything here — every practitioner
                    recommendation, every resource, every insight — came from someone
                    who wanted to make it easier for the next person.
                  </p>
                </div>

                <div className="bg-[#F8F9FA] p-6 rounded-lg">
                  <p className="text-sm text-gray-500 mb-3">What the community has gathered:</p>
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <div className="text-2xl font-semibold text-[#2C3E50]">
                        {context.communityStats.totalPractitioners}
                      </div>
                      <div className="text-xs text-gray-500">practitioners</div>
                    </div>
                    <div>
                      <div className="text-2xl font-semibold text-[#2C3E50]">
                        {context.communityStats.totalResources}
                      </div>
                      <div className="text-xs text-gray-500">resources</div>
                    </div>
                    <div>
                      <div className="text-2xl font-semibold text-[#2C3E50]">
                        {context.communityStats.totalOrganizations}
                      </div>
                      <div className="text-xs text-gray-500">organizations</div>
                    </div>
                  </div>
                </div>

                <div className="bg-[#FFFBEB] border border-[#FEF3C7] p-5 rounded-lg">
                  <p className="text-sm text-gray-700 italic">
                    "May I become at all times, both now and forever, a protector of those
                    without protection, a guide for those who have lost their way..."
                  </p>
                  <p className="text-xs text-gray-500 mt-2">
                    — Shantideva, shared in the community
                  </p>
                </div>

                <div className="text-center">
                  <p className="text-gray-600 mb-6">
                    Your contribution helps us understand wellbeing in your region.
                    What you share becomes part of this living library.
                  </p>
                  <Button
                    onClick={next}
                    size="lg"
                    className="bg-[#2C3E50] hover:bg-[#1a252f] text-white px-8"
                  >
                    Begin
                  </Button>
                </div>
              </>
            )}

            {/* RETURNING USER */}
            {!context?.isFirstTime && (
              <>
                <div className="text-center">
                  <h2 className="text-2xl font-serif text-[#2C3E50] mb-4">
                    Welcome back
                  </h2>
                </div>

                <div className="space-y-4 text-gray-600">
                  <p>Since your last visit:</p>
                  <ul className="space-y-2 pl-4">
                    {context?.hasSharedPractitioners && context.practitionerViewCount > 0 && (
                      <li className="flex items-start gap-2">
                        <span className="text-[#2C3E50]">•</span>
                        <span>
                          {context.practitionerViewCount === 1
                            ? "Someone found their way to a practitioner you shared"
                            : `A few people found their way to practitioners you shared`}
                        </span>
                      </li>
                    )}
                    {context?.hasSharedResources && context.resourceDownloadCount > 0 && (
                      <li className="flex items-start gap-2">
                        <span className="text-[#2C3E50]">•</span>
                        <span>
                          {context.resourceDownloadCount === 1
                            ? "Your resource was downloaded by someone in the network"
                            : "Your resources have been downloaded and shared"}
                        </span>
                      </li>
                    )}
                    <li className="flex items-start gap-2">
                      <span className="text-[#2C3E50]">•</span>
                      <span>
                        The community continues to grow — now {context?.communityStats.totalOrganizations} organizations strong
                      </span>
                    </li>
                  </ul>
                </div>

                <div className="bg-[#F8F9FA] p-5 rounded-lg">
                  <p className="text-gray-600 text-sm">
                    Thank you for what you've already shared. Ready to contribute
                    your perspective for 2026?
                  </p>
                </div>

                <div className="text-center">
                  <Button
                    onClick={next}
                    size="lg"
                    className="bg-[#2C3E50] hover:bg-[#1a252f] text-white px-8"
                  >
                    Continue
                  </Button>
                </div>
              </>
            )}
          </div>
        )}

        {/* ORGANIZATION STEP (Admin only) */}
        {currentStep === Step.Organization && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-serif text-[#2C3E50] mb-2">
                Organization Profile
              </h2>
              <p className="text-gray-500">
                As an admin, please verify your organization's details are current.
              </p>
            </div>

            {/* Placeholder for Org Form */}
            <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center text-gray-400 border border-dashed border-gray-200">
              [Organization Profile Form]
            </div>

            <div className="flex justify-between pt-4">
              <Button variant="outline" onClick={back}>Back</Button>
              <Button onClick={next} className="bg-[#2C3E50] hover:bg-[#1a252f]">
                Confirm & Continue
              </Button>
            </div>
          </div>
        )}

        {/* PRACTITIONERS STEP */}
        {currentStep === Step.Practitioners && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-serif text-[#2C3E50] mb-2">
                Share a Practitioner
              </h2>
              <p className="text-gray-500">
                Know someone who's been helpful? A therapist, coach, or healer
                you'd recommend to a colleague?
              </p>
              <p className="text-sm text-gray-400 mt-2">
                You can manage practitioners you've previously shared from your profile.
              </p>
            </div>

            {/* Placeholder for Provider Form */}
            <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center text-gray-400 border border-dashed border-gray-200">
              [Practitioner Form - Optional]
            </div>

            <div className="flex justify-between pt-4">
              <Button variant="outline" onClick={back}>Back</Button>
              <div className="space-x-2">
                <Button variant="ghost" onClick={next} className="text-gray-500">
                  Skip for now
                </Button>
                <Button onClick={next} className="bg-[#2C3E50] hover:bg-[#1a252f]">
                  Continue
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* RESOURCES STEP */}
        {currentStep === Step.Resources && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-serif text-[#2C3E50] mb-2">
                Share a Resource
              </h2>
              <p className="text-gray-500">
                A toolkit, article, or guide that's been valuable in your work?
              </p>
            </div>

            {/* Placeholder for Resource Form */}
            <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center text-gray-400 border border-dashed border-gray-200">
              [Resource Form - Optional]
            </div>

            <div className="flex justify-between pt-4">
              <Button variant="outline" onClick={back}>Back</Button>
              <div className="space-x-2">
                <Button variant="ghost" onClick={next} className="text-gray-500">
                  Skip for now
                </Button>
                <Button onClick={next} className="bg-[#2C3E50] hover:bg-[#1a252f]">
                  Continue
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* INSIGHTS STEP */}
        {currentStep === Step.Insights && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-serif text-[#2C3E50] mb-2">
                Regional Insights
              </h2>
              <p className="text-gray-500">
                This is the heart of the contribution. Your perspective helps us
                understand wellbeing across regions and contexts.
              </p>
            </div>

            {/* Placeholder for 8-Question Form */}
            <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center text-gray-400 border border-dashed border-gray-200">
              [8 Insight Questions - Required]
            </div>

            <div className="flex justify-between pt-4">
              <Button variant="outline" onClick={back}>Back</Button>
              <Button onClick={next} className="bg-[#2C3E50] hover:bg-[#1a252f]">
                Submit
              </Button>
            </div>
          </div>
        )}

        {/* COMPLETE STEP */}
        {currentStep === Step.Complete && (
          <div className="text-center py-12 space-y-6">
            <h2 className="text-3xl font-serif text-[#2C3E50]">
              Thank you
            </h2>
            <p className="text-gray-600 max-w-md mx-auto">
              Your contribution is now part of the commons.
              The insights you and others share will help shape
              this year's understanding of wellbeing across regions.
            </p>
            <div className="pt-4">
              <Button
                size="lg"
                onClick={() => window.location.href = '/dashboard'}
                className="bg-[#2C3E50] hover:bg-[#1a252f] text-white px-8"
              >
                Enter the Platform
              </Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
