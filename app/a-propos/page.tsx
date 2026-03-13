'use client';

import { useState } from 'react';
import axios from 'axios';

export default function AboutPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setErrorMessage('');

    try {
      await axios.post('/api/contact', formData);
      setStatus('success');
      setFormData({ name: '', email: '', subject: '', message: '' });
      setTimeout(() => setStatus('idle'), 5000);
    } catch {
      setStatus('error');
      setErrorMessage('Une erreur est survenue. Réessaie stp !');
      setTimeout(() => setStatus('idle'), 5000);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className="min-h-screen bg-light-gray py-12">
      <div className="container max-w-4xl">
        {/* About Section */}
        <div className="bg-white rounded-lg shadow-soft p-8 md:p-12 mb-8">
          <h1 className="text-4xl md:text-5xl font-heading font-bold text-text-dark mb-6">
            À Propos 🇹🇳✈️🇩🇪
          </h1>

          <div className="prose max-w-none">
            <div className="flex items-start gap-6 mb-8">
              <div className="w-24 h-24 bg-gradient-soft rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-4xl">🌍</span>
              </div>
              <div>
                <h2 className="text-2xl font-heading font-bold text-text-dark mb-2">
                  Yalla Allemagne
                </h2>
                <p className="text-text-gray">
                  Le guide cool et pratique pour les Tunisiens en route vers l&apos;Allemagne
                </p>
              </div>
            </div>

            <div className="space-y-4 text-text-gray leading-relaxed">
              <p>
                <strong className="text-text-dark">Yalla Allemagne</strong>, c&apos;est le site qu&apos;on aurait 
                aimé trouver quand on a commencé à préparer notre départ en Allemagne. Un endroit 
                où toutes les infos sont regroupées, expliquées simplement et avec un ton cool — 
                sans le jargon administratif qui donne mal à la tête. 😄
              </p>

              <p>
                L&apos;idée est simple : <strong className="text-text-dark">t&apos;accompagner de A à Z</strong> dans 
                ton projet de départ. Du visa aux premiers jours en Allemagne, en passant par la 
                recherche de logement, le travail et l&apos;apprentissage de la langue — on a tout couvert.
              </p>

              <p>
                On sait que le processus peut sembler intimidant. Les formulaires, les rendez-vous 
                à l&apos;ambassade, la barrière de la langue... C&apos;est normal de se sentir un peu perdu. 
                Mais <strong className="text-text-dark">c&apos;est faisable, et on est là pour te le prouver</strong>.
              </p>

              <p>
                Notre chatbot IA est là 24/7 pour répondre à tes questions. Et nos guides sont 
                écrits par des gens qui sont passés par là — on connaît les galères, et on te file 
                les raccourcis. 🚀
              </p>
            </div>

            <div className="mt-8 p-6 bg-light-gray rounded-lg">
              <h3 className="text-xl font-heading font-semibold text-text-dark mb-4">
                🎯 Ce que tu trouveras ici
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-start gap-3">
                  <span className="text-2xl flex-shrink-0">🛂</span>
                  <div>
                    <p className="font-semibold text-text-dark">Visa & Papiers</p>
                    <p className="text-sm text-text-gray">Toutes les démarches administratives détaillées</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-2xl flex-shrink-0">🏠</span>
                  <div>
                    <p className="font-semibold text-text-dark">Logement</p>
                    <p className="text-sm text-text-gray">Comment trouver un appart sans galérer</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-2xl flex-shrink-0">💼</span>
                  <div>
                    <p className="font-semibold text-text-dark">Travail</p>
                    <p className="text-sm text-text-gray">CV, candidatures et entretiens en Allemagne</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-2xl flex-shrink-0">🗣️</span>
                  <div>
                    <p className="font-semibold text-text-dark">Langue</p>
                    <p className="text-sm text-text-gray">Apprendre l&apos;allemand efficacement</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div id="contact" className="bg-white rounded-lg shadow-soft p-8 md:p-12">
          <h2 className="text-3xl font-heading font-bold text-text-dark mb-6">
            Nous contacter ✉️
          </h2>
          <p className="text-text-gray mb-8">
            Une question, une suggestion ou juste envie d&apos;échanger ?
            N&apos;hésite pas à nous écrire !
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="name" className="block text-sm font-semibold text-text-dark mb-2">
                  Nom <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="input"
                  placeholder="Ton nom"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-text-dark mb-2">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="input"
                  placeholder="ton@email.com"
                />
              </div>
            </div>

            <div>
              <label htmlFor="subject" className="block text-sm font-semibold text-text-dark mb-2">
                Sujet <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                required
                className="input"
                placeholder="De quoi tu veux parler ?"
              />
            </div>

            <div>
              <label htmlFor="message" className="block text-sm font-semibold text-text-dark mb-2">
                Message <span className="text-red-500">*</span>
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                rows={6}
                className="textarea"
                placeholder="Ton message..."
              />
            </div>

            {status === 'success' && (
              <div className="p-4 bg-success/10 border border-success/20 rounded-lg text-success">
                ✅ Message envoyé ! On te répond dès que possible.
              </div>
            )}

            {status === 'error' && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-600">
                ❌ {errorMessage}
              </div>
            )}

            <button
              type="submit"
              disabled={status === 'loading'}
              className="btn btn-primary w-full md:w-auto disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {status === 'loading' ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Envoi en cours...
                </span>
              ) : (
                'Envoyer le message 🚀'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
