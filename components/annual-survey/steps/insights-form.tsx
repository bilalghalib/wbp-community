'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

const QUESTIONS = [
  { id: 'q1', label: 'What are the most pressing wellbeing needs you are seeing right now among the people or communities you work with?' },
  { id: 'q2', label: 'Compared to the past 12 months, what has shifted in wellbeing challenges or capacities in your context?' },
  { id: 'q3', label: 'What social, political, economic, environmental, or cultural factors are most shaping wellbeing where you are?' },
  { id: 'q4', label: 'What practices, approaches, or ways of working feel especially promising or effective in your context right now?' },
  { id: 'q5', label: 'How is wellbeing talked about in your context, if at all? Who feels able to talk about it, and where does it remain invisible or taboo?' },
  { id: 'q6', label: 'To what extent are Indigenous, ancestral, or culturally rooted understandings of wellbeing recognized or integrated where you work? How are they treated?' },
  { id: 'q7', label: 'How do public institutions or governments in your region engage with wellbeing, and where do you see alignment or tension with lived realities?' },
  { id: 'q8', label: 'Looking ahead, what would a more wellbeing-centered social change ecosystem look like in your context? Please share one story, belief, or practice from your region that the field should learn from.' }
];

interface InsightsFormProps {
  onSubmit: (answers: Record<string, string>) => void;
  onBack: () => void;
  isSubmitting?: boolean;
}

export function InsightsForm({ onSubmit, onBack, isSubmitting }: InsightsFormProps) {
  const [answers, setAnswers] = useState<Record<string, string>>({});

  const handleChange = (id: string, value: string) => {
    setAnswers(prev => ({ ...prev, [id]: value }));
  };

  // Require at least 3 questions to be answered with some depth for the prototype
  const answeredCount = QUESTIONS.filter(q => (answers[q.id]?.trim().length || 0) > 10).length;
  const isValid = answeredCount >= 3;

  return (
    <div className="space-y-10 animate-in fade-in duration-500">
      <div className="grid gap-12">
        {QUESTIONS.map((q, index) => (
          <div key={q.id} className="space-y-4">
            <Label htmlFor={q.id} className="text-base font-medium text-[#2C3E50] leading-relaxed block">
              <span className="text-gray-300 mr-2 font-serif text-xl">{index + 1}.</span>
              {q.label}
            </Label>
            <Textarea
              id={q.id}
              value={answers[q.id] || ''}
              onChange={(e) => handleChange(q.id, e.target.value)}
              placeholder="Your reflection..."
              className="min-h-[140px] bg-gray-50/50 border-gray-100 focus:bg-white transition-all rounded-2xl p-5 text-gray-600 leading-relaxed resize-none focus:ring-2 focus:ring-[#2C3E50]/5"
            />
          </div>
        ))}
      </div>

      <div className="pt-10 border-t border-gray-50 flex justify-between items-center">
        <Button variant="ghost" onClick={onBack} disabled={isSubmitting} className="text-gray-400 hover:text-gray-600">
          Back
        </Button>
        <div className="flex items-center gap-6">
          {!isValid && (
            <span className="text-xs text-gray-400 italic">
              Please share reflections for at least 3 questions to continue.
            </span>
          )}
          <Button 
            onClick={() => onSubmit(answers)} 
            disabled={!isValid || isSubmitting}
            className="bg-[#2C3E50] hover:bg-[#1A252F] text-white px-10 py-6 h-auto rounded-xl shadow-lg shadow-gray-200 transition-all active:scale-95 disabled:opacity-30"
          >
            {isSubmitting ? 'Recording insights...' : 'Complete Contribution'}
          </Button>
        </div>
      </div>
    </div>
  );
}