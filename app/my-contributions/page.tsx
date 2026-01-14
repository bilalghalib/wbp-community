import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export default async function MyContributionsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  // Fetch practitioners the user has recommended
  const { data: practitioners } = await supabase
    .from('service_provider_recommendations')
    .select(`
      id,
      created_at,
      relationship_note,
      service_provider:service_providers (
        id,
        full_name,
        specialties,
        city,
        country
      )
    `)
    .eq('recommended_by', user.id)
    .order('created_at', { ascending: false });

  // Fetch resources the user has uploaded
  const { data: resources } = await supabase
    .from('research_documents')
    .select(`
      id,
      title,
      created_at,
      file_type,
      tags,
      topics
    `)
    .eq('uploaded_by', user.id)
    .order('created_at', { ascending: false });

  // Fetch regional insights the user has submitted
  const { data: insights } = await supabase
    .from('regional_insights')
    .select(`
      id,
      region,
      created_at
    `)
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      year: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA]">
      <div className="max-w-4xl mx-auto py-12 px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-serif text-[#2C3E50]">My Contributions</h1>
          <p className="text-gray-500 mt-2">
            Everything you've shared with the community
          </p>
        </div>

        {/* Practitioners Section */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-[#2C3E50]">
              Practitioners I've Shared
            </h2>
            <Link href="/service-providers/new">
              <Button variant="outline" size="sm">
                + Add New
              </Button>
            </Link>
          </div>

          {practitioners && practitioners.length > 0 ? (
            <div className="space-y-3">
              {practitioners.map((rec: any) => (
                <Card key={rec.id} className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-medium text-[#2C3E50]">
                        {rec.service_provider?.full_name || 'Unknown'}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {rec.service_provider?.specialties?.slice(0, 2).join(', ')}
                        {rec.service_provider?.city && ` • ${rec.service_provider.city}`}
                        {rec.service_provider?.country && `, ${rec.service_provider.country}`}
                      </p>
                      {rec.relationship_note && (
                        <p className="text-sm text-gray-400 mt-1 italic">
                          "{rec.relationship_note}"
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-3 ml-4">
                      <span className="text-xs text-gray-400">
                        Added {formatDate(rec.created_at)}
                      </span>
                      <Link href={`/service-providers/${rec.service_provider?.id}/edit`}>
                        <Button variant="ghost" size="sm" className="text-gray-500">
                          Edit
                        </Button>
                      </Link>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="p-8 text-center">
              <p className="text-gray-500 mb-4">
                You haven't shared any practitioners yet.
              </p>
              <p className="text-sm text-gray-400 mb-4">
                Know a therapist, coach, or healer who's been helpful?
                Share them with the community.
              </p>
              <Link href="/service-providers/new">
                <Button className="bg-[#2C3E50] hover:bg-[#1a252f]">
                  Share a Practitioner
                </Button>
              </Link>
            </Card>
          )}
        </section>

        {/* Resources Section */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-[#2C3E50]">
              Resources I've Shared
            </h2>
            <Link href="/research/new">
              <Button variant="outline" size="sm">
                + Add New
              </Button>
            </Link>
          </div>

          {resources && resources.length > 0 ? (
            <div className="space-y-3">
              {resources.map((resource: any) => (
                <Card key={resource.id} className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-medium text-[#2C3E50]">
                        {resource.title}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {resource.file_type?.toUpperCase() || 'Link'}
                        {resource.tags?.length > 0 && ` • ${resource.tags.slice(0, 2).join(', ')}`}
                      </p>
                    </div>
                    <div className="flex items-center gap-3 ml-4">
                      <span className="text-xs text-gray-400">
                        Added {formatDate(resource.created_at)}
                      </span>
                      <Link href={`/research/${resource.id}/edit`}>
                        <Button variant="ghost" size="sm" className="text-gray-500">
                          Edit
                        </Button>
                      </Link>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="p-8 text-center">
              <p className="text-gray-500 mb-4">
                You haven't shared any resources yet.
              </p>
              <p className="text-sm text-gray-400 mb-4">
                Got a toolkit, article, or guide that's been valuable?
                Share it with others.
              </p>
              <Link href="/research/new">
                <Button className="bg-[#2C3E50] hover:bg-[#1a252f]">
                  Share a Resource
                </Button>
              </Link>
            </Card>
          )}
        </section>

        {/* Regional Insights Section */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-[#2C3E50]">
              My Regional Insights
            </h2>
          </div>

          {insights && insights.length > 0 ? (
            <div className="space-y-3">
              {insights.map((insight: any) => (
                <Card key={insight.id} className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-medium text-[#2C3E50]">
                        {new Date(insight.created_at).getFullYear()} Season
                      </h3>
                      <p className="text-sm text-gray-500">
                        Contributed to {insight.region || 'Global'} insights
                      </p>
                    </div>
                    <div className="flex items-center gap-3 ml-4">
                      <span className="text-xs text-gray-400">
                        Submitted {formatDate(insight.created_at)}
                      </span>
                      <Button variant="ghost" size="sm" className="text-gray-500" disabled>
                        View
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="p-8 text-center">
              <p className="text-gray-500 mb-4">
                You haven't submitted any regional insights yet.
              </p>
              <p className="text-sm text-gray-400">
                Complete your annual contribution to share your perspective
                on wellbeing in your region.
              </p>
            </Card>
          )}
        </section>

        {/* Footer Note */}
        <div className="text-center text-sm text-gray-400 mt-12">
          <p>
            Your contributions help build a living library of wellbeing resources
            for the community. Thank you for being part of this.
          </p>
        </div>
      </div>
    </div>
  );
}
