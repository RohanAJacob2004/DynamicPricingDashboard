'use client';

import { useState } from 'react';

export default function FeedbackPage() {
  const [feedback, setFeedback] = useState('');
  const [category, setCategory] = useState('general');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedback.trim()) return;
    setSubmitted(true);
    setFeedback('');
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6" style={{ color: '#1E293B' }}>Feedback</h1>
      <div className="max-w-2xl theme-card p-6">
        {submitted ? (
          <div className="text-center py-8">
            <span className="text-4xl">✅</span>
            <p className="font-medium mt-3" style={{ color: '#16A34A' }}>Feedback submitted successfully!</p>
            <p className="text-sm mt-1" style={{ color: '#94A3B8' }}>Thank you for your input.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: '#475569' }}>Category</label>
              <select
                value={category}
                onChange={e => setCategory(e.target.value)}
                className="theme-select max-w-xs"
              >
                <option value="general">General Feedback</option>
                <option value="pricing">Pricing Suggestions</option>
                <option value="bug">Bug Report</option>
                <option value="feature">Feature Request</option>
                <option value="ui">UI/UX Improvement</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: '#475569' }}>Your Feedback</label>
              <textarea
                value={feedback}
                onChange={e => setFeedback(e.target.value)}
                rows={6}
                className="theme-input resize-none"
                placeholder="Share your thoughts, suggestions, or report an issue..."
              />
            </div>
            <button type="submit" disabled={!feedback.trim()} className="btn-primary">
              Submit Feedback
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
