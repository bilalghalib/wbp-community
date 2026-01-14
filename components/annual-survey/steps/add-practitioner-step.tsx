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
    relationship_note: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.full_name) return;
    onAdd(formData);
  };

  const toggleSpecialty = (s: string) => {
    setFormData(prev => ({
      ...prev,
      specialties: prev.specialties.includes(s)
        ? prev.specialties.filter(item => item !== s)
        : [...prev.specialties, s]
    }));
  };

  if (!showForm) {
    return (
      <div className="space-y-8 text-center py-8 animate-in fade-in duration-500">
        <div className="space-y-3">
          <h2 className="text-2xl font-serif text-[#2C3E50]">Share a Practitioner?</h2>
          <p className="text-[#5D6D7E] max-w-md mx-auto">
            Have you worked with someone transformative this year? Your recommendations 
            help colleagues across the network find trusted support.
          </p>
        </div>

        <div className="bg-gray-50 border border-dashed border-gray-200 rounded-2xl p-12 space-y-6">
          <p className="text-sm text-gray-400 italic">"A recommendation is a vote of confidence in a colleague's work."</p>
          <Button 
            onClick={() => setShowForm(true)}
            variant="outline" 
            className="border-gray-300 rounded-xl px-8 py-6 h-auto hover:bg-white transition-all shadow-sm"
          >
            + Add a Practitioner
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
        <p className="text-[#5D6D7E]">Share the basic details. You can add more context later.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Full Name</Label>
            <Input 
              id="name" 
              required
              value={formData.full_name}
              onChange={(e) => setFormData({...formData, full_name: e.target.value})}
              placeholder="e.g. Dr. Maria Santos"
              className="rounded-xl border-gray-100 bg-gray-50/50 p-6"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Email (Optional)</Label>
            <Input 
              id="email" 
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              placeholder="maria@example.com"
              className="rounded-xl border-gray-100 bg-gray-50/50 p-6"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Specialties</Label>
            <div className="flex flex-wrap gap-2 pt-2">
              {TAXONOMIES.Specialties.slice(0, 8).map(s => (
                <button
                  key={s}
                  type="button"
                  onClick={() => toggleSpecialty(s)}
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
            <Label htmlFor="note" className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Why are you recommending them?</Label>
            <Textarea 
              id="note" 
              value={formData.relationship_note}
              onChange={(e) => setFormData({...formData, relationship_note: e.target.value})}
              placeholder="Briefly describe your experience..."
              className="min-h-[100px] rounded-xl border-gray-100 bg-gray-50/50 p-4"
            />
          </div>
        </div>

        <div className="flex justify-between pt-6">
          <Button variant="ghost" onClick={() => setShowForm(false)} className="text-gray-400">Cancel</Button>
          <Button type="submit" className="bg-[#2C3E50] hover:bg-[#1A252F] text-white px-8 rounded-xl shadow-lg shadow-gray-200">
            Add & Continue
          </Button>
        </div>
      </form>
    </div>
  );
}
