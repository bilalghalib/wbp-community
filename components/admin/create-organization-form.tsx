'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

export function CreateOrganizationForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    // Organization
    orgName: '',
    orgSlug: '',
    orgDescription: '',
    orgWebsite: '',
    // Primary Admin
    adminEmail: '',
    adminName: '',
  });

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  const handleOrgNameChange = (value: string) => {
    setFormData({
      ...formData,
      orgName: value,
      orgSlug: generateSlug(value),
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // 1. Create the organization
      const orgResponse = await fetch('/api/admin/organizations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.orgName,
          slug: formData.orgSlug,
          description: formData.orgDescription,
          website_url: formData.orgWebsite,
        }),
      });

      if (!orgResponse.ok) {
        const data = await orgResponse.json();
        throw new Error(data.error || 'Failed to create organization');
      }

      const { organization } = await orgResponse.json();

      // 2. Invite the primary admin
      const inviteResponse = await fetch('/api/organizations/members/invite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          organizationId: organization.id,
          organizationName: formData.orgName,
          email: formData.adminEmail,
          full_name: formData.adminName,
          role: 'primary_admin',
        }),
      });

      if (!inviteResponse.ok) {
        const data = await inviteResponse.json();
        throw new Error(data.error || 'Org created but failed to invite admin');
      }

      // Success - redirect to org list
      router.push('/admin/organizations');
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {error && (
        <div className="bg-red-50 text-red-700 p-4 rounded-lg text-sm">
          {error}
        </div>
      )}

      {/* Organization Details */}
      <div className="space-y-4">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-400">
          Organization Details
        </h3>

        <div className="space-y-2">
          <Label htmlFor="orgName">Organization Name *</Label>
          <Input
            id="orgName"
            value={formData.orgName}
            onChange={(e) => handleOrgNameChange(e.target.value)}
            placeholder="e.g., Climate Justice Alliance"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="orgSlug">URL Slug</Label>
          <div className="flex items-center gap-2">
            <span className="text-gray-400 text-sm">/organizations/</span>
            <Input
              id="orgSlug"
              value={formData.orgSlug}
              onChange={(e) => setFormData({ ...formData, orgSlug: e.target.value })}
              placeholder="climate-justice-alliance"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="orgDescription">Description</Label>
          <Textarea
            id="orgDescription"
            value={formData.orgDescription}
            onChange={(e) => setFormData({ ...formData, orgDescription: e.target.value })}
            placeholder="Brief description of the organization..."
            rows={3}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="orgWebsite">Website</Label>
          <Input
            id="orgWebsite"
            type="url"
            value={formData.orgWebsite}
            onChange={(e) => setFormData({ ...formData, orgWebsite: e.target.value })}
            placeholder="https://example.org"
          />
        </div>
      </div>

      {/* Primary Admin */}
      <div className="space-y-4 pt-4 border-t">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-400">
          Primary Admin
        </h3>
        <p className="text-sm text-gray-500">
          This person will be able to manage the organization and invite team members.
        </p>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="adminName">Full Name *</Label>
            <Input
              id="adminName"
              value={formData.adminName}
              onChange={(e) => setFormData({ ...formData, adminName: e.target.value })}
              placeholder="Maria Santos"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="adminEmail">Email *</Label>
            <Input
              id="adminEmail"
              type="email"
              value={formData.adminEmail}
              onChange={(e) => setFormData({ ...formData, adminEmail: e.target.value })}
              placeholder="maria@example.org"
              required
            />
          </div>
        </div>
      </div>

      {/* Submit */}
      <div className="flex justify-end gap-3 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          disabled={loading}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={loading || !formData.orgName || !formData.adminEmail || !formData.adminName}
          className="bg-[#2C3E50] hover:bg-[#1a252f]"
        >
          {loading ? 'Creating...' : 'Create Organization'}
        </Button>
      </div>
    </form>
  );
}
