'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { REGIONS } from '@/utils/constants/taxonomies';

// These questions can be updated year to year
const INSIGHT_QUESTIONS = [
  {
    id: 'emerging_challenges',
    question: 'What are the most pressing wellbeing challenges you\'re seeing in your region or sector right now?',
    placeholder: 'Share what you\'re observing...',
    required: true,
  },
  {
    id: 'what_helps',
    question: 'What approaches, practices, or resources have been most helpful for practitioners in your context?',
    placeholder: 'Share what\'s working...',
    required: true,
  },
  {
    id: 'shifting_needs',
    question: 'How have wellbeing needs shifted in the past year? What\'s different now compared to before?',
    placeholder: 'Describe what\'s changing...',
    required: true,
  },
  {
    id: 'gaps',
    question: 'What gaps do you see in available wellbeing resources or support for changemakers in your region?',
    placeholder: 'Share what\'s missing...',
    required: true,
  },
  {
    id: 'bright_spots',
    question: 'What gives you hope? Are there any bright spots or promising developments you\'ve noticed?',
    placeholder: 'Share what\'s encouraging...',
    required: true,
  },
  {
    id: 'barriers',
    question: 'What barriers prevent people in your context from accessing wellbeing support?',
    placeholder: 'Share the obstacles...',
    required: true,
  },
  {
    id: 'community_needs',
    question: 'What would be most valuable for this community to focus on in the coming year?',
    placeholder: 'Share your suggestions...',
    required: true,
  },
  {
    id: 'anything_else',
    question: 'Is there anything else you\'d like to share about wellbeing in your region or sector?',
    placeholder: 'Optional: Any additional thoughts...',
    required: false,
  },
];

interface InsightsFormProps {
  defaultRegion?: string;
  defaultSector?: string;
  onSubmit: (data: {
    region: string;
    sector: string;
    answers: Record<string, string>;
  }) => Promise<void>;
  onBack?: () => void;
}

export function InsightsForm({ defaultRegion, defaultSector, onSubmit, onBack }: InsightsFormProps) {
  const [region, setRegion] = useState(defaultRegion || '');
  const [sector, setSector] = useState(defaultSector || '');
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);

  const handleAnswerChange = (questionId: string, value: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
  };

  const canProceed = () => {
    const current = INSIGHT_QUESTIONS[currentQuestion];
    if (!current.required) return true;
    const answer = answers[current.id]?.trim();
    return answer && answer.length > 10;
  };

  const handleNext = () => {
    if (currentQuestion < INSIGHT_QUESTIONS.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePrev = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleSubmit = async () => {
    // Validate required answers
    const missingRequired = INSIGHT_QUESTIONS
      .filter(q => q.required)
      .filter(q => !answers[q.id]?.trim() || answers[q.id].length < 10);

    if (missingRequired.length > 0) {
      setError(`Please complete all required questions (minimum 10 characters each).`);
      setCurrentQuestion(INSIGHT_QUESTIONS.findIndex(q => q.id === missingRequired[0].id));
      return;
    }

    if (!region) {
      setError('Please select your region.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await onSubmit({
        region,
        sector,
        answers,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit insights');
      setLoading(false);
    }
  };

  const currentQ = INSIGHT_QUESTIONS[currentQuestion];
  const progress = ((currentQuestion + 1) / INSIGHT_QUESTIONS.length) * 100;
  const isLastQuestion = currentQuestion === INSIGHT_QUESTIONS.length - 1;

  return (
    <div className="space-y-6">
      {/* Region/Sector Selection (shown at start) */}
      {currentQuestion === 0 && !region && (
        <div className="space-y-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Your Region *
            </label>
            <select
              value={region}
              onChange={(e) => setRegion(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2"
            >
              <option value="">Select your region...</option>
              {REGIONS.map(r => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Your Sector (optional)
            </label>
            <input
              type="text"
              value={sector}
              onChange={(e) => setSector(e.target.value)}
              placeholder="e.g., Human Rights, Environmental Justice..."
              className="w-full border border-gray-300 rounded-md px-3 py-2"
            />
          </div>
        </div>
      )}

      {/* Progress indicator */}
      <div className="flex items-center gap-2 text-sm text-gray-500">
        <span>Question {currentQuestion + 1} of {INSIGHT_QUESTIONS.length}</span>
        <div className="flex-1 h-1 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-[#2C3E50] transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {error && (
        <div className="bg-red-50 text-red-700 p-3 rounded text-sm">
          {error}
        </div>
      )}

      {/* Current Question */}
      <div className="space-y-4">
        <div>
          <label className="block text-lg font-medium text-[#2C3E50] mb-2">
            {currentQ.question}
            {currentQ.required && <span className="text-red-500 ml-1">*</span>}
          </label>
          <textarea
            value={answers[currentQ.id] || ''}
            onChange={(e) => handleAnswerChange(currentQ.id, e.target.value)}
            placeholder={currentQ.placeholder}
            rows={5}
            className="w-full border border-gray-300 rounded-md px-4 py-3 text-gray-700 placeholder:text-gray-400 focus:ring-2 focus:ring-[#2C3E50] focus:border-transparent"
          />
          <div className="text-xs text-gray-400 mt-1 text-right">
            {answers[currentQ.id]?.length || 0} characters
            {currentQ.required && ' (minimum 10)'}
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-between pt-4">
        <div>
          {currentQuestion === 0 && onBack ? (
            <Button variant="outline" onClick={onBack}>
              Back
            </Button>
          ) : currentQuestion > 0 ? (
            <Button variant="outline" onClick={handlePrev}>
              Previous
            </Button>
          ) : null}
        </div>

        <div className="flex gap-2">
          {isLastQuestion ? (
            <Button
              onClick={handleSubmit}
              disabled={loading || !canProceed() || !region}
              className="bg-[#2C3E50] hover:bg-[#1a252f]"
            >
              {loading ? 'Submitting...' : 'Submit'}
            </Button>
          ) : (
            <>
              {!currentQ.required && (
                <Button variant="ghost" onClick={handleNext} className="text-gray-500">
                  Skip
                </Button>
              )}
              <Button
                onClick={handleNext}
                disabled={!canProceed()}
                className="bg-[#2C3E50] hover:bg-[#1a252f]"
              >
                Continue
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
