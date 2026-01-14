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
        location_city,
        location_country
      )
    `)
    .eq('recommended_by_user_id', user.id)
    .order('created_at', { ascending: false });

  // Fetch resources the user has uploaded
  const { data: resources } = await supabase
    .from('research_documents')
    .select(`
      id,
      title,
      created_at,
      mime_type,
      topics,
      file_url
    `)
    .eq('uploaded_by_user_id', user.id)
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
    <div className="min-h-screen bg-[#FBFBFC]">
      <div className="max-w-5xl mx-auto py-16 px-6">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-serif text-[#2C3E50] mb-3">My Contributions</h1>
          <p className="text-[#5D6D7E] text-lg max-w-2xl leading-relaxed">
            A history of the wisdom and resources you've shared with the community. 
            Thank you for helping build this collective reservoir.
          </p>
        </div>

        <div className="grid gap-16">
          {/* Practitioners Section */}
          <section>
            <div className="flex items-center justify-between mb-6 border-b border-gray-100 pb-4">
              <h2 className="text-xl font-serif text-[#2C3E50]">
                Practitioners I've Shared
              </h2>
              <Link href="/service-providers/new">
                <Button variant="outline" size="sm" className="rounded-xl border-gray-200 text-[#2C3E50]">
                  + Add New
                </Button>
              </Link>
            </div>

            {practitioners && practitioners.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {practitioners.map((rec: any) => (
                  <Card key={rec.id} className="p-6 border-none shadow-sm bg-white rounded-2xl hover:shadow-md transition-shadow">
                    <div className="flex flex-col h-full">
                      <div className="flex-1">
                        <h3 className="text-lg font-serif text-[#2C3E50] mb-1">
                          {rec.service_provider?.full_name || 'Unknown'}
                        </h3>
                        <p className="text-xs text-gray-400 mb-3 uppercase tracking-wider font-semibold">
                          {rec.service_provider?.specialties?.slice(0, 2).join(' • ')}
                        </p>
                        <p className="text-sm text-[#5D6D7E] mb-4">
                          {rec.service_provider?.location_city}
                          {rec.service_provider?.location_city && rec.service_provider?.location_country && ', '}
                          {rec.service_provider?.location_country}
                        </p>
                        {rec.relationship_note && (
                          <div className="bg-gray-50 p-3 rounded-xl mb-4 italic text-sm text-gray-500 line-clamp-2">
                            "{rec.relationship_note}"
                          </div>
                        )}
                      </div>
                      <div className="flex items-center justify-between mt-2 pt-4 border-t border-gray-50">
                        <span className="text-[10px] text-gray-400 uppercase font-bold tracking-widest">
                          Added {formatDate(rec.created_at)}
                        </span>
                        <div className="flex gap-2">
                          <Link href={`/service-providers/${rec.service_provider?.id}`}>
                            <Button variant="ghost" size="sm" className="text-gray-400 hover:text-[#2C3E50]">View</Button>
                          </Link>
                          <Link href={`/service-providers/${rec.service_provider?.id}/edit`}>
                            <Button variant="ghost" size="sm" className="text-gray-400 hover:text-[#2C3E50]">Edit</Button>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="p-12 text-center border-none shadow-sm bg-white rounded-2xl">
                <p className="text-[#5D6D7E] mb-6">
                  You haven't shared any practitioners yet.
                </p>
                <Link href="/service-providers/new">
                  <Button className="bg-[#2C3E50] hover:bg-[#1A252F] text-white px-8 rounded-xl">
                    Share a Practitioner
                  </Button>
                </Link>
              </Card>
            )}
          </section>

          {/* Resources Section */}
          <section>
            <div className="flex items-center justify-between mb-6 border-b border-gray-100 pb-4">
              <h2 className="text-xl font-serif text-[#2C3E50]">
                Resources I've Shared
              </h2>
              <Link href="/research/new">
                <Button variant="outline" size="sm" className="rounded-xl border-gray-200 text-[#2C3E50]">
                  + Add New
                </Button>
              </Link>
            </div>

            {resources && resources.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {resources.map((resource: any) => (
                  <Card key={resource.id} className="p-6 border-none shadow-sm bg-white rounded-2xl hover:shadow-md transition-shadow">
                    <div className="flex flex-col h-full">
                      <div className="flex-1">
                        <h3 className="text-lg font-serif text-[#2C3E50] mb-2">
                          {resource.title}
                        </h3>
                        <div className="flex flex-wrap gap-2 mb-4">
                          {resource.topics?.slice(0, 3).map((topic: string) => (
                            <span key={topic} className="px-2 py-1 bg-[#F8FAFB] text-[10px] text-gray-500 rounded-lg border border-gray-100 uppercase tracking-tighter">
                              {topic}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="flex items-center justify-between mt-2 pt-4 border-t border-gray-50">
                        <span className="text-[10px] text-gray-400 uppercase font-bold tracking-widest">
                          {resource.mime_type?.includes('pdf') ? 'PDF Document' : 'External Link'} • {formatDate(resource.created_at)}
                        </span>
                        <div className="flex gap-2">
                          <Link href={resource.file_url} target="_blank">
                            <Button variant="ghost" size="sm" className="text-gray-400 hover:text-[#2C3E50]">Open</Button>
                          </Link>
                          <Link href={`/research/${resource.id}/edit`}>
                            <Button variant="ghost" size="sm" className="text-gray-400 hover:text-[#2C3E50]">Edit</Button>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="p-12 text-center border-none shadow-sm bg-white rounded-2xl">
                <p className="text-[#5D6D7E] mb-6">
                  You haven't shared any resources yet.
                </p>
                <Link href="/research/new">
                  <Button className="bg-[#2C3E50] hover:bg-[#1A252F] text-white px-8 rounded-xl">
                    Share a Resource
                  </Button>
                </Link>
              </Card>
            )}
          </section>

          {/* Regional Insights Section */}
          <section>
            <div className="flex items-center justify-between mb-6 border-b border-gray-100 pb-4">
              <h2 className="text-xl font-serif text-[#2C3E50]">
                My Regional Insights
              </h2>
            </div>

            {insights && insights.length > 0 ? (
              <div className="space-y-3">
                {insights.map((insight: any) => (
                  <Card key={insight.id} className="p-6 border-none shadow-sm bg-white rounded-2xl">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-serif text-[#2C3E50] mb-1">
                          {new Date(insight.created_at).getFullYear()} Annual Gathering
                        </h3>
                        <p className="text-sm text-[#5D6D7E]">
                          Contributed to <span className="font-semibold">{insight.region || 'Global'}</span> insights
                        </p>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <span className="text-[10px] text-gray-400 uppercase font-bold tracking-widest">
                          Submitted {formatDate(insight.created_at)}
                        </span>
                        <Button variant="ghost" size="sm" className="text-gray-300 italic" disabled>
                          Summarizing...
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="p-12 text-center border-none shadow-sm bg-white rounded-2xl">
                <p className="text-[#5D6D7E]">
                  You haven't submitted any regional insights yet.
                </p>
                <p className="text-xs text-gray-400 mt-2">
                  These are collected once a year during the Annual Gathering.
                </p>
              </Card>
            )}
          </section>
        </div>

        {/* Footer Note */}
        <div className="text-center text-sm text-gray-400 mt-24 max-w-md mx-auto leading-relaxed italic">
          <p>
            "Everything here came from someone who wanted to make it easier for the next person."
          </p>
        </div>
      </div>
    </div>
  );
}