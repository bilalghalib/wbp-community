'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface OrgProfileFormProps {
  initialData: any;
  onConfirm: (updatedData: any) => void;
  onBack: () => void;
}

export function OrgProfileForm({ initialData, onConfirm, onBack }: OrgProfileFormProps) {
  const [formData, setFormData] = useState(initialData || {});

  const handleChange = (field: string, value: string) => {
    setFormData((prev: any) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="grid gap-6">
        <div className="space-y-2">
          <Label htmlFor="name" className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Organization Name</Label>
          <Input 
            id="name" 
            value={formData.name || ''} 
            onChange={(e) => handleChange('name', e.target.value)}
            className="rounded-xl border-gray-100 bg-gray-50/50"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="website" className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Website</Label>
          <Input 
            id="website" 
            value={formData.website_url || ''} 
            onChange={(e) => handleChange('website_url', e.target.value)}
            className="rounded-xl border-gray-100 bg-gray-50/50"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="description" className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Description</Label>
          <Textarea 
            id="description" 
            value={formData.description || ''} 
            onChange={(e) => handleChange('description', e.target.value)}
            className="min-h-[100px] rounded-xl border-gray-100 bg-gray-50/50"
          />
        </div>
      </div>

      <div className="bg-[#F8FAFB] p-6 rounded-2xl border border-gray-100">
        <p className="text-xs text-[#5D6D7E] leading-relaxed italic">
          Tip: You can update more detailed fields like "Areas of Work" and "Target Audience" in your organization settings later.
        </p>
      </div>

      <div className="flex justify-between pt-4">
        <Button variant="ghost" onClick={onBack} className="text-gray-400">Back</Button>
        <Button 
          onClick={() => onConfirm(formData)}
          className="bg-[#2C3E50] hover:bg-[#1A252F] text-white px-8 rounded-xl shadow-lg shadow-gray-200"
        >
          Confirm & Continue
        </Button>
      </div>
    </div>
  );
}
