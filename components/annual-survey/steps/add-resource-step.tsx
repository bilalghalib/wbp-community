'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { TAXONOMIES } from '@/utils/constants/taxonomies';

interface AddResourceStepProps {
  onAdd: (data: any) => void;
  onSkip: () => void;
  onBack: () => void;
}

export function AddResourceStep({ onAdd, onSkip, onBack }: AddResourceStepProps) {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    url: '',
    description: '',
    resource_type: '',
    tags: [] as string[]
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title) return;
    onAdd(formData);
  };

  const toggleTag = (tag: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.includes(tag)
        ? prev.tags.filter(t => t !== tag)
        : [...prev.tags, tag]
    }));
  };

  if (!showForm) {
    return (
      <div className="space-y-8 text-center py-8 animate-in fade-in duration-500">
        <div className="space-y-3">
          <h2 className="text-2xl font-serif text-[#2C3E50]">Share a Resource?</h2>
          <p className="text-[#5D6D7E] max-w-md mx-auto leading-relaxed text-sm">
            Toolkits, reports, or findings that could support other organizations. 
            Building a collective reservoir of knowledge for the field.
          </p>
        </div>

        <div className="bg-gray-50/50 border border-dashed border-gray-200 rounded-2xl p-12 space-y-6">
          <p className="text-sm text-gray-400 italic">"Knowledge shared is knowledge multiplied."</p>
          <Button 
            onClick={() => setShowForm(true)}
            variant="outline" 
            className="border-gray-300 rounded-xl px-10 py-6 h-auto hover:bg-white hover:border-[#2C3E50]/30 transition-all shadow-sm group"
          >
            <span className="group-hover:scale-110 transition-transform mr-2">+</span> Add a Resource
          </Button>
        </div>

        <div className="flex justify-between mt-12">
          <Button variant="ghost" onClick={onBack} className="text-gray-400">Back</Button>
          <Button variant="ghost" onClick={onSkip} className="text-[#2C3E50] font-medium hover:bg-gray-100 px-8 rounded-xl">
            Skip for now
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h2 className="text-2xl font-serif text-[#2C3E50] mb-2">Resource Details</h2>
        <p className="text-[#5D6D7E] text-sm">Share a link or basic information. You can upload PDFs later.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid gap-6">
          <div className="space-y-2">
            <Label htmlFor="title" className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Title</Label>
            <Input 
              id="title" 
              required
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              placeholder="e.g. Burnout Prevention Toolkit"
              className="rounded-xl border-gray-100 bg-gray-50/50 p-6 focus:bg-white transition-all"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="url" className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Link / URL</Label>
            <Input 
              id="url" 
              type="url"
              value={formData.url}
              onChange={(e) => setFormData({...formData, url: e.target.value})}
              placeholder="https://example.com/resource"
              className="rounded-xl border-gray-100 bg-gray-50/50 p-6 focus:bg-white transition-all"
            />
          </div>

          <div className="space-y-3">
            <Label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Resource Type</Label>
            <div className="flex flex-wrap gap-2">
              {TAXONOMIES["Resource Type"].slice(0, 8).map(t => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setFormData({...formData, resource_type: t})}
                  className={`px-4 py-2 rounded-full text-xs transition-all border ${
                    formData.resource_type === t
                      ? 'bg-[#2C3E50] text-white border-[#2C3E50]'
                      : 'bg-white text-gray-500 border-gray-200 hover:border-gray-300'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <Label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Topics</Label>
            <div className="flex flex-wrap gap-2">
              {TAXONOMIES["Topic (Specific lens, population, system, or approach)"].slice(0, 10).map(tag => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => toggleTag(tag)}
                  className={`px-4 py-2 rounded-full text-xs transition-all border ${
                    formData.tags.includes(tag)
                      ? 'bg-[#2C3E50] text-white border-[#2C3E50]'
                      : 'bg-white text-gray-500 border-gray-200 hover:border-gray-300'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="desc" className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Description</Label>
            <Textarea 
              id="desc" 
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              placeholder="Briefly describe what this resource is about..."
              className="min-h-[100px] rounded-2xl border-gray-100 bg-gray-50/50 p-4 focus:bg-white transition-all"
            />
          </div>
        </div>

        <div className="flex justify-between pt-6 border-t border-gray-50">
          <Button variant="ghost" onClick={() => setShowForm(false)} className="text-gray-400">Cancel</Button>
          <Button type="submit" className="bg-[#2C3E50] hover:bg-[#1A252F] text-white px-10 py-6 h-auto rounded-xl shadow-lg shadow-gray-200">
            Add & Continue
          </Button>
        </div>
      </form>
    </div>
  );
}