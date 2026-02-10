
import React, { useState } from 'react';
import { Sparkles, Loader2, Search } from 'lucide-react';
import { getAIAssistance } from '../services/geminiService';
import { Category } from '../types';

interface AIConsultantFinderProps {
  onRecommendation: (category: Category) => void;
}

export const AIConsultantFinder: React.FC<AIConsultantFinderProps> = ({ onRecommendation }) => {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ recommendedCategory: string; explanation: string; tags?: string[] } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    setLoading(true);
    const aiResponse = await getAIAssistance(input);
    setResult(aiResponse);
    setLoading(false);
  };

  return (
    <div className="bg-orange-50 rounded-2xl p-6 border border-orange-100 shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <Sparkles className="w-5 h-5 text-orange-500" />
        <h3 className="text-lg font-bold text-gray-800">Can't find who you need?</h3>
      </div>
      <p className="text-sm text-gray-600 mb-6">Describe your problem, and our AI will match you with the right field.</p>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="e.g., I'm planning to move to Berlin for a master's degree but I'm confused about the visa process..."
            className="w-full p-4 pr-12 rounded-xl border border-orange-200 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all resize-none h-32 text-sm"
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="absolute bottom-4 right-4 p-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:opacity-50 transition-colors"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Search className="w-5 h-5" />}
          </button>
        </div>
      </form>

      {result && (
        <div className="mt-6 p-4 bg-white rounded-xl border border-orange-100 animate-in fade-in slide-in-from-top-2 duration-500">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-orange-600 bg-orange-50 px-2 py-1 rounded">
              {result.recommendedCategory}
            </span>
          </div>
          <p className="text-sm text-gray-700 leading-relaxed mb-4">
            {result.explanation}
          </p>
          <button
            onClick={() => onRecommendation(result.recommendedCategory as Category)}
            className="w-full py-2 bg-orange-600 text-white rounded-lg text-sm font-semibold hover:bg-orange-700 transition-colors"
          >
            View Experts in {result.recommendedCategory}
          </button>
        </div>
      )}
    </div>
  );
};
