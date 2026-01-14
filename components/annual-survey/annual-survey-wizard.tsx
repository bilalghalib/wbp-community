'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { getUserImpactStats, ImpactStats, getActiveSeason } from '@/lib/services/season-service';
import { submitRegionalInsight } from '@/lib/services/insights-service';
import { createClient } from '@/lib/supabase/client';
import { OrgProfileForm } from './steps/org-profile-form';
import { InsightsForm } from './steps/insights-form';
import { AddPractitionerStep } from './steps/add-practitioner-step';
import { AddResourceStep } from './steps/add-resource-step';

enum Step {
  Welcome = 0,
  Organization = 1, // Admin Only
  Practitioners = 2,
  Resources = 3,
  Insights = 4,
  Complete = 5
}

interface UserContext {
  userId: string;
  seasonId: string | null;
  isAdmin: boolean;
  orgData: any;
  stats: ImpactStats | null;
  isFirstTime: boolean;
  hasSharedPractitioners: boolean;
  hasSharedResources: boolean;
  totalContributors: number;
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
  const [submitting, setSubmitting] = useState(false);
  
  // Local state for contributions during this session
  const [addedPractitioners, setAddedPractitioners] = useState<any[]>([]);
  const [addedResources, setAddedResources] = useState<any[]>([]);

  useEffect(() => {
    async function loadData() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // 1. Get Season
      const season = await getActiveSeason();

      // 2. Check Membership & Role
      const { data: membership } = await supabase
        .from('organization_memberships')
        .select('role, organization_id, organizations(*)')
        .eq('user_id', user.id)
        .single();
      
      const isAdmin = membership?.role === 'primary_admin' || membership?.role === 'backup_admin';

      // 3. Check stats & participation
      const stats = await getUserImpactStats();
      
      const { count: practitionerCount } = await supabase
        .from('service_provider_recommendations')
        .select('*', { count: 'exact', head: true })
        .eq('recommended_by_user_id', user.id);

      const { count: resourceCount } = await supabase
        .from('research_documents')
        .select('*', { count: 'exact', head: true })
        .eq('uploaded_by_user_id', user.id);

      // 4. Community Stats
      const { count: totalPractitioners } = await supabase.from('service_providers').select('*', { count: 'exact', head: true });
      const { count: totalResources } = await supabase.from('research_documents').select('*', { count: 'exact', head: true });
      const { count: totalOrgs } = await supabase.from('organizations').select('*', { count: 'exact', head: true }).eq('is_active', true);
      const { count: totalContributors } = await supabase.from('regional_insights').select('*', { count: 'exact', head: true });

      setContext({
        userId: user.id,
        seasonId: season?.id || null,
        isAdmin,
        orgData: membership?.organizations,
        stats,
        totalContributors: (totalContributors || 0) + 1, // +1 for the current session
        isFirstTime: (practitionerCount || 0) === 0 && (resourceCount || 0) === 0,
        hasSharedPractitioners: (practitionerCount || 0) > 0,
        hasSharedResources: (resourceCount || 0) > 0,
        communityStats: {
          totalPractitioners: totalPractitioners || 0,
          totalResources: totalResources || 0,
          totalOrganizations: totalOrgs || 0,
        }
      });
      
      setLoading(false);
    }
    loadData();
  }, []);

  const handleFinalSubmit = async (insights: Record<string, string>) => {
    if (!context || !context.seasonId) return;
    setSubmitting(true);
    
    try {
      const supabase = createClient();
      
      // 1. Submit Insights
      await submitRegionalInsight({
        organization_id: context.orgData?.id,
        user_id: context.userId,
        region: context.orgData?.location_region || 'Unknown',
        sector: 'Unknown',
        answers: insights
      });

      // Record in audit trail
      await supabase.from('annual_survey_submissions').insert({
        season_id: context.seasonId,
        organization_id: context.orgData?.id,
        user_id: context.userId,
        submission_type: 'insights',
        payload: insights
      });

      // 2. Submit Practitioners
      for (const p of addedPractitioners) {
        try {
          const res = await fetch('/api/service-providers', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              ...p,
              userId: context.userId,
              organizationId: context.orgData?.id,
              is_visible: true
            }),
          });
          if (res.ok) {
            const data = await res.json();
            await supabase.from('annual_survey_submissions').insert({
              season_id: context.seasonId,
              organization_id: context.orgData?.id,
              user_id: context.userId,
              submission_type: 'practitioner',
              payload: { practitioner_id: data.providerId, ...p }
            });
          }
        } catch (e) {
          console.error('Error saving practitioner', e);
        }
      }

      // 3. Submit Resources
      for (const r of addedResources) {
        try {
          const { data: resource, error } = await supabase
            .from('research_documents')
            .insert({
              organization_id: context.orgData?.id,
              uploaded_by_user_id: context.userId,
              title: r.title,
              description: r.description,
              file_url: r.url || '',
              file_name: 'External Link',
              research_type: r.resource_type,
              topics: r.tags,
              visibility_level: 'network'
            })
            .select()
            .single();

          if (!error && resource) {
            await supabase.from('annual_survey_submissions').insert({
              season_id: context.seasonId,
              organization_id: context.orgData?.id,
              user_id: context.userId,
              submission_type: 'resource',
              payload: { resource_id: resource.id, ...r }
            });
          }
        } catch (e) {
          console.error('Error saving resource', e);
        }
      }

      // 4. Update Timestamps (Gate Unlocking)
      await supabase
        .from('users')
        .update({ last_annual_survey_at: new Date().toISOString() })
        .eq('id', context.userId);

      if (context.isAdmin && context.orgData?.id) {
        // Record org confirmation in audit trail
        await supabase.from('annual_survey_submissions').insert({
          season_id: context.seasonId,
          organization_id: context.orgData.id,
          user_id: context.userId,
          submission_type: 'org_profile',
          payload: context.orgData
        });

        // Persist updates to the organization record
        await supabase
          .from('organizations')
          .update({ 
            name: context.orgData.name,
            website_url: context.orgData.website_url,
            description: context.orgData.description,
            last_annual_survey_at: new Date().toISOString() 
          })
          .eq('id', context.orgData.id);
      }

      setCurrentStep(Step.Complete);
    } catch (error) {
      console.error('Submission failed', error);
      alert('Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

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

  if (loading) return (
    <div className="flex flex-col items-center justify-center p-24 text-center space-y-4">
      <div className="w-8 h-8 border-4 border-[#2C3E50] border-t-transparent rounded-full animate-spin"></div>
      <p className="text-gray-500 font-serif">Preparing the gathering...</p>
    </div>
  );

  const hasPersonalImpact = (context?.stats?.provider_views || 0) > 0 || (context?.stats?.resource_downloads || 0) > 0;

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <div className="mb-12 text-center">
        <h1 className="text-4xl font-serif text-[#2C3E50] mb-3">The 2026 Gathering</h1>
        <p className="text-[#5D6D7E] max-w-lg mx-auto leading-relaxed">
          Welcome. Once a year, we pause to update our collective knowledge and refresh our connection to the network.
        </p>
      </div>

      <div className="mb-10">
        <div className="flex justify-between text-xs font-medium uppercase tracking-wider text-gray-400 mb-2 px-1">
          <span>{currentStep === Step.Welcome ? 'Welcome' : `Step ${currentStep} of 5`}</span>
          <span>{Math.round((currentStep / Step.Complete) * 100)}% Complete</span>
        </div>
        <Progress value={(currentStep / Step.Complete) * 100} className="h-1.5 bg-gray-100" />
      </div>

      <Card className="p-10 border-none shadow-xl shadow-gray-200/50 rounded-2xl bg-white min-h-[500px]">
        {currentStep === Step.Welcome && (
          <div className="space-y-10 animate-in fade-in duration-700">
            <div className="text-center space-y-4">
              <h2 className="text-3xl font-serif text-[#2C3E50]">
                {hasPersonalImpact ? 'Your Ripple Effect' : 'Joining the Collective'}
              </h2>
              
              {hasPersonalImpact ? (
                <div className="py-6 space-y-4 max-w-xl mx-auto">
                  <p className="text-lg text-[#5D6D7E]">
                    Since your last visit, a few people found their way to the practitioners you recommended, 
                    and your resources supported colleagues across the network.
                  </p>
                  <div className="flex justify-center gap-12 pt-4">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-[#2C3E50]">{context?.stats?.provider_views}</div>
                      <div className="text-[10px] uppercase tracking-widest text-gray-400 mt-1 font-semibold">Provider Views</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-[#2C3E50]">{context?.stats?.resource_downloads}</div>
                      <div className="text-[10px] uppercase tracking-widest text-gray-400 mt-1 font-semibold">Downloads</div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="py-6 space-y-6 max-w-xl mx-auto">
                  <p className="text-lg text-[#5D6D7E]">
                    You're joining {context?.communityStats.totalPractitioners} practitioners and {context?.communityStats.totalOrganizations} organizations from 17 regions.
                  </p>
                  <div className="bg-[#FFFBEB] border border-[#FEF3C7] p-6 rounded-2xl">
                    <p className="text-sm text-gray-700 italic leading-relaxed">
                      "We don't heal in isolation, but in community. When we share what sustains us,
                      we create a reservoir of resilience for the whole."
                    </p>
                    <p className="text-[10px] text-gray-400 mt-3 uppercase tracking-widest font-semibold">— S. Kelley Harrell</p>
                  </div>
                </div>
              )}
            </div>

            <div className="bg-[#F8FAFB] p-8 rounded-2xl border border-gray-100">
              <h3 className="text-xs font-semibold uppercase tracking-widest text-[#2C3E50] mb-4">The Exchange</h3>
              <p className="text-sm text-[#5D6D7E] leading-relaxed">
                By taking a few minutes to share your regional insights and verify your profile, 
                you unlock full access to the directory and insights dashboard for the 2026 season.
              </p>
            </div>

            <div className="flex justify-center pt-4">
              <Button onClick={next} size="lg" className="bg-[#2C3E50] hover:bg-[#1A252F] text-white px-10 py-7 text-lg rounded-xl transition-all shadow-lg shadow-gray-200">
                Begin Contribution
              </Button>
            </div>
          </div>
        )}

        {currentStep === Step.Organization && (
          <OrgProfileForm 
            initialData={context?.orgData} 
            onConfirm={(updatedData) => {
              setContext(prev => prev ? { ...prev, orgData: updatedData } : null);
              next();
            }} 
            onBack={back} 
          />
        )}

        {currentStep === Step.Practitioners && (
          <AddPractitionerStep 
            onAdd={(data) => {
              setAddedPractitioners([...addedPractitioners, data]);
              next();
            }}
            onSkip={next}
            onBack={back}
          />
        )}

        {currentStep === Step.Resources && (
          <AddResourceStep 
            onAdd={(data) => {
              setAddedResources([...addedResources, data]);
              next();
            }}
            onSkip={next}
            onBack={back}
          />
        )}

        {currentStep === Step.Insights && (
          <div>
            <div className="mb-10">
              <h2 className="text-2xl font-serif text-[#2C3E50] mb-2">Regional Insights</h2>
              <p className="text-[#5D6D7E]">Help us understand the state of wellbeing in your context. These reflections shape our annual report.</p>
            </div>
            <InsightsForm 
              onSubmit={handleFinalSubmit} 
              onBack={back} 
              isSubmitting={submitting}
            />
          </div>
        )}

        {currentStep === Step.Complete && (
          <div className="text-center space-y-8 py-10 animate-in zoom-in duration-700">
            <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto shadow-inner">
              <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div className="space-y-3">
              <h2 className="text-3xl font-serif text-[#2C3E50]">Thank you for your presence</h2>
              <p className="text-lg text-[#5D6D7E] max-w-md mx-auto leading-relaxed">
                Your voice has been added to the collective. 
                You are the <span className="font-bold text-[#2C3E50]">{context?.totalContributors || 1}th</span> person to contribute this season.
              </p>
            </div>
            
            <div className="pt-6">
              <Button size="lg" onClick={() => window.location.href = '/dashboard'} className="bg-[#2C3E50] hover:bg-[#1A252F] text-white px-12 py-7 rounded-xl transition-all shadow-lg shadow-gray-200">
                Enter the Platform
              </Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
