'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';

export default function ChatInputPreview() {
  const [chatInput, setChatInput] = useState('');
  const router = useRouter();

  const handleChatSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (chatInput.trim()) {
      router.push(`/chatbot?question=${encodeURIComponent(chatInput.trim())}`);
    }
  };

  return (
    <div className="mt-12 mx-auto">
      <div className="bg-white rounded-2xl shadow-large p-6 hover:shadow-xl transition-all duration-300">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center">
            <svg className="w-6 h-6 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
          </div>
          <div className="flex-1 text-left">
            <p className="font-semibold text-text-dark">Chatbot IA Assistant</p>
            <p className="text-sm text-text-gray">Pose tes questions sur le départ en Allemagne 🇩🇪</p>
          </div>
        </div>
        <form onSubmit={handleChatSubmit} className="flex gap-2">
          <input
            type="text"
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            placeholder="Comment obtenir un visa pour l'Allemagne ?"
            className="input flex-1 text-lg py-4"
          />
          <button
            type="submit"
            className="btn btn-primary px-6"
            disabled={!chatInput.trim()}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </form>
      </div>
    </div>
  );
}
