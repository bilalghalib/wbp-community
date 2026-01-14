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
  { id: 'q6', label: 'To what extent are Indigenous, ancestral, or culturally rooted understandings of wellbeing recognized or integrated where you work?' },
  { id: 'q7', label: 'How do public institutions or governments in your region engage with wellbeing, and where do you see alignment or tension?' },
  { id: 'q8', label: 'Looking ahead, what would a more wellbeing-centered social change ecosystem look like? share one story, belief, or practice from your region.' }
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

  const isValid = QUESTIONS.every(q => answers[q.id]?.trim().length > 10);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="grid gap-10">
        {QUESTIONS.map((q, index) => (
          <div key={q.id} className="space-y-3">
            <Label htmlFor={q.id} className="text-base font-medium text-[#2C3E50] leading-relaxed">
              <span className="text-gray-300 mr-2 font-serif">{index + 1}.</span>
              {q.label}
            </Label>
            <Textarea
              id={q.id}
              value={answers[q.id] || ''}
              onChange={(e) => handleChange(q.id, e.target.value)}
              placeholder="Share your reflection..."
              className="min-h-[120px] bg-gray-50/50 border-gray-100 focus:bg-white transition-all rounded-xl p-4 text-gray-600"
            />
          </div>
        ))}
      </div>

      <div className="pt-8 border-t border-gray-50 flex justify-between items-center">
        <Button variant="ghost" onClick={onBack} disabled={isSubmitting} className="text-gray-400 hover:text-gray-600">
          Back
        </Button>
        <div className="flex items-center gap-4">
          {!isValid && <span className="text-xs text-gray-400 italic">Please provide a brief reflection for each question.</span>}
          <Button 
            onClick={() => onSubmit(answers)} 
            disabled={!isValid || isSubmitting}
            className="bg-[#2C3E50] hover:bg-[#1A252F] text-white px-10 rounded-xl shadow-lg shadow-gray-200"
          >
            {isSubmitting ? 'Submitting...' : 'Complete Contribution'}
          </Button>
        </div>
      </div>
    </div>
  );
}
