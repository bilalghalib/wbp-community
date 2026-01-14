'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { TAXONOMIES } from '@/utils/constants/taxonomies';

interface AddPractitionerStepProps {
  onAdd: (data: any) => void;
  onSkip: () => void;
  onBack: () => void;
}

export function AddPractitionerStep({ onAdd, onSkip, onBack }: AddPractitionerStepProps) {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    specialties: [] as string[],
    modalities: [] as string[],
    location_city: '',
    location_country: '',
    relationship_note: '',
    offers_remote: true
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.full_name) return;
    onAdd(formData);
  };

  const toggleItem = (field: 'specialties' | 'modalities', item: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].includes(item)
        ? prev[field].filter(i => i !== item)
        : [...prev[field], item]
    }));
  };

  if (!showForm) {
    return (
      <div className="space-y-8 text-center py-8 animate-in fade-in duration-500">
        <div className="space-y-3">
          <h2 className="text-2xl font-serif text-[#2C3E50]">Share a Practitioner?</h2>
          <p className="text-[#5D6D7E] max-w-md mx-auto leading-relaxed text-sm">
            Have you worked with someone transformative this year? Your recommendations 
            help colleagues across the network find trusted support.
          </p>
        </div>

        <div className="bg-gray-50/50 border border-dashed border-gray-200 rounded-2xl p-12 space-y-6">
          <p className="text-sm text-gray-400 italic">"A recommendation is a vote of confidence in a colleague's work."</p>
          <Button 
            onClick={() => setShowForm(true)}
            variant="outline" 
            className="border-gray-300 rounded-xl px-10 py-6 h-auto hover:bg-white hover:border-[#2C3E50]/30 transition-all shadow-sm group"
          >
            <span className="group-hover:scale-110 transition-transform mr-2">+</span> Add a Practitioner
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
        <h2 className="text-2xl font-serif text-[#2C3E50] mb-2">Practitioner Details</h2>
        <p className="text-[#5D6D7E] text-sm">Basic information to help the community find them.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid gap-6">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Full Name</Label>
            <Input 
              id="name" 
              required
              value={formData.full_name}
              onChange={(e) => setFormData({...formData, full_name: e.target.value})}
              placeholder="e.g. Dr. Maria Santos"
              className="rounded-xl border-gray-100 bg-gray-50/50 p-6 focus:bg-white transition-all"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="city" className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">City</Label>
              <Input 
                id="city" 
                value={formData.location_city}
                onChange={(e) => setFormData({...formData, location_city: e.target.value})}
                placeholder="Mexico City"
                className="rounded-xl border-gray-100 bg-gray-50/50 p-6"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="country" className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Country</Label>
              <select
                id="country"
                value={formData.location_country}
                onChange={(e) => setFormData({...formData, location_country: e.target.value})}
                className="w-full rounded-xl border border-gray-100 bg-gray-50/50 p-3 text-sm focus:bg-white transition-all"
              >
                <option value="">Select Country...</option>
                {TAXONOMIES.Country.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>

          <div className="space-y-3">
            <Label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Primary Specialties</Label>
            <div className="flex flex-wrap gap-2">
              {TAXONOMIES.Specialties.slice(0, 12).map(s => (
                <button
                  key={s}
                  type="button"
                  onClick={() => toggleItem('specialties', s)}
                  className={`px-4 py-2 rounded-full text-xs transition-all border ${
                    formData.specialties.includes(s)
                      ? 'bg-[#2C3E50] text-white border-[#2C3E50]'
                      : 'bg-white text-gray-500 border-gray-200 hover:border-gray-300'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="note" className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Your Recommendation</Label>
            <Textarea 
              id="note" 
              value={formData.relationship_note}
              onChange={(e) => setFormData({...formData, relationship_note: e.target.value})}
              placeholder="Why are you recommending this person?"
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