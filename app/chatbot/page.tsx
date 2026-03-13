'use client';

import { useState, useRef, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { ArticleMetadata } from '@/models/Article';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { FaRobot, FaUser, FaPaperPlane, FaLightbulb, FaClock, FaArrowRight } from 'react-icons/fa';
import { HiSparkles } from 'react-icons/hi';
import MarkdownRenderer from '@/components/MarkdownRenderer';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  articles?: ArticleMetadata[];
  timestamp: Date;
}

function ChatbotContent() {
  const searchParams = useSearchParams();
  const questionFromUrl = searchParams.get('question');
  
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: "Salut ! 👋 Je suis ton assistant pour tout ce qui concerne le départ en Allemagne. Visa, logement, boulot, langue... pose-moi tes questions, je suis là pour t'aider ! 🇹🇳✈️🇩🇪",
      timestamp: new Date(),
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const hasAutoSubmittedRef = useRef(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-submit question from URL parameter
  useEffect(() => {
    if (questionFromUrl && !hasAutoSubmittedRef.current) {
      hasAutoSubmittedRef.current = true;
      setInput(questionFromUrl);
      
      const submitQuestion = async () => {
        const userMessage: Message = {
          id: Date.now().toString(),
          role: 'user',
          content: questionFromUrl,
          timestamp: new Date(),
        };

        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        try {
          const response = await axios.post('/api/chat', {
            message: questionFromUrl,
            history: []
          });

          const assistantMessage: Message = {
            id: (Date.now() + 1).toString(),
            role: 'assistant',
            content: response.data.response,
            articles: response.data.articles || [],
            timestamp: new Date(),
          };

          setMessages(prev => [...prev, assistantMessage]);
        } catch (error) {
          console.error('Chat error:', error);
          const errorMessage: Message = {
            id: (Date.now() + 1).toString(),
            role: 'assistant',
            content: "Oups, y'a eu un souci 😅 Réessaie stp !",
            timestamp: new Date(),
          };
          setMessages(prev => [...prev, errorMessage]);
        } finally {
          setIsLoading(false);
        }
      };

      submitQuestion();
    }
  }, [questionFromUrl]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await axios.post('/api/chat', {
        message: input,
        history: messages.slice(1).map(m => ({
          role: m.role,
          content: m.content
        }))
      });

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response.data.response,
        articles: response.data.articles || [],
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Chat error:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: "Oups, y'a eu un souci 😅 Réessaie stp !",
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const suggestions = [
    { text: "Comment obtenir un visa pour l'Allemagne ?", icon: "🛂" },
    { text: "Comment trouver un logement en Allemagne ?", icon: "🏠" },
    { text: "Comment apprendre l'allemand rapidement ?", icon: "🗣️" },
    { text: "Comment chercher un travail en Allemagne ?", icon: "💼" }
  ];

  return (
    <div className="min-h-screen bg-light-gray py-8">
      <div className="container max-w-4xl">
        {/* Header */}
        <motion.div 
          className="bg-gradient-to-br from-accent to-red-400 rounded-lg shadow-lg p-8 mb-6 text-white relative overflow-hidden"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Animated Background */}
          <motion.div
            className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
            }}
          />
          
          <div className="relative z-10">
            <motion.div 
              className="flex items-center gap-3 mb-3"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
              >
                <FaRobot className="text-4xl" />
              </motion.div>
              <h1 className="text-3xl font-heading font-bold">
                Chatbot IA Assistant
              </h1>
            </motion.div>
            <motion.p 
              className="text-white/90 flex items-center gap-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <HiSparkles className="text-xl" />
              Pose tes questions sur le départ en Allemagne et obtiens des conseils personnalisés 🇩🇪
            </motion.p>
          </div>
        </motion.div>

        {/* Chat Container */}
        <motion.div 
          className="bg-white rounded-lg shadow-lg flex flex-col h-[600px] overflow-hidden"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            <AnimatePresence mode="popLayout">
              {messages.map((message, index) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'} w-full`}
                >
                  <div className={`max-w-[80%] min-w-0 flex-shrink ${message.role === 'user' ? 'order-2' : 'order-1'}`}>
                    {/* Avatar & Message Bubble */}
                    <div className="flex items-start gap-3 w-full">
                      {message.role === 'assistant' && (
                        <motion.div 
                          className="w-10 h-10 bg-accent rounded-full flex items-center justify-center text-white flex-shrink-0"
                          whileHover={{ scale: 1.1, rotate: 5 }}
                        >
                          <FaRobot className="text-lg" />
                        </motion.div>
                      )}
                      
                      <div className="flex-1 min-w-0">
                        <motion.div
                          className={`rounded-lg overflow-hidden w-full ${
                            message.role === 'user'
                              ? 'bg-gradient-to-br from-accent to-red-400 text-white p-4'
                              : 'bg-light-gray text-text-dark p-4'
                          }`}
                          whileHover={{ scale: 1.02 }}
                          transition={{ duration: 0.2 }}
                        >
                          {message.role === 'user' ? (
                            <p className="whitespace-pre-wrap break-words">{message.content}</p>
                          ) : (
                            <div className="chatbot-markdown min-w-0">
                              <MarkdownRenderer content={message.content} className="text-sm" />
                            </div>
                          )}
                        </motion.div>

                        {/* Recommended Articles */}
                        {message.articles && message.articles.length > 0 && (
                          <motion.div 
                            className="mt-4 space-y-3"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                          >
                            <p className="text-sm font-semibold text-text-gray flex items-center gap-2">
                              <FaLightbulb className="text-accent" />
                              Guides recommandés :
                            </p>
                            {message.articles.map((article, idx) => (
                              <motion.div
                                key={article.slug}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.4 + (idx * 0.1) }}
                              >
                                <Link
                                  href={`/articles/${article.slug}`}
                                  className="block bg-white border border-border rounded-lg p-4 hover:shadow-lg transition-all no-underline group"
                                >
                                  <h3 className="font-heading font-semibold text-text-dark group-hover:text-accent mb-2 flex items-start gap-2">
                                    <span className="flex-1">{article.title}</span>
                                    <FaArrowRight className="text-accent opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 mt-1" />
                                  </h3>
                                  <p className="text-sm text-text-gray line-clamp-2 mb-2">
                                    {article.excerpt}
                                  </p>
                                  <div className="flex items-center gap-2 text-accent text-sm font-medium">
                                    Lire le guide
                                    <motion.svg 
                                      className="w-4 h-4"
                                      fill="none" 
                                      stroke="currentColor" 
                                      viewBox="0 0 24 24"
                                      animate={{ x: [0, 5, 0] }}
                                      transition={{ duration: 1.5, repeat: Infinity }}
                                    >
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </motion.svg>
                                  </div>
                                </Link>
                              </motion.div>
                            ))}
                          </motion.div>
                        )}

                        {/* Timestamp */}
                        <p className="text-xs text-text-gray mt-2 flex items-center gap-1">
                          <FaClock className="text-xs" />
                          {message.timestamp.toLocaleTimeString('fr-FR', { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}
                        </p>
                      </div>

                      {message.role === 'user' && (
                        <motion.div 
                          className="w-10 h-10 bg-gradient-to-br from-accent to-red-400 rounded-full flex items-center justify-center text-white flex-shrink-0"
                          whileHover={{ scale: 1.1, rotate: -5 }}
                        >
                          <FaUser className="text-lg" />
                        </motion.div>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Loading Indicator */}
            <AnimatePresence>
              {isLoading && (
                <motion.div 
                  className="flex justify-start"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-accent rounded-full flex items-center justify-center text-white">
                      <FaRobot className="text-lg" />
                    </div>
                    <div className="bg-light-gray rounded-lg p-4">
                      <div className="flex items-center gap-2">
                        <motion.div 
                          className="w-2 h-2 bg-accent rounded-full"
                          animate={{ y: [0, -10, 0] }}
                          transition={{ duration: 0.6, repeat: Infinity }}
                        />
                        <motion.div 
                          className="w-2 h-2 bg-accent rounded-full"
                          animate={{ y: [0, -10, 0] }}
                          transition={{ duration: 0.6, repeat: Infinity, delay: 0.1 }}
                        />
                        <motion.div 
                          className="w-2 h-2 bg-accent rounded-full"
                          animate={{ y: [0, -10, 0] }}
                          transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
                        />
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div ref={messagesEndRef} />
          </div>

          {/* Input Form */}
          <motion.form 
            onSubmit={handleSubmit} 
            className="border-t border-border p-4 bg-off-white"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Pose ta question ici..."
                className="input flex-1"
                disabled={isLoading}
              />
              <motion.button
                type="submit"
                disabled={isLoading || !input.trim()}
                className="btn btn-primary px-6 disabled:opacity-50 disabled:cursor-not-allowed"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {isLoading ? (
                  <motion.svg 
                    className="w-5 h-5"
                    fill="none" 
                    viewBox="0 0 24 24"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  >
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </motion.svg>
                ) : (
                  <FaPaperPlane className="w-5 h-5" />
                )}
              </motion.button>
            </div>
          </motion.form>
        </motion.div>

        {/* Suggestions */}
        <motion.div 
          className="mt-6 bg-white rounded-lg shadow-soft p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h3 className="font-heading font-semibold text-text-dark mb-4 flex items-center gap-2">
            <FaLightbulb className="text-accent" />
            Questions fréquentes :
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {suggestions.map((suggestion, index) => (
              <motion.button
                key={index}
                onClick={() => setInput(suggestion.text)}
                className="text-left p-4 bg-light-gray hover:bg-accent hover:text-white rounded-lg transition-all text-sm group"
                disabled={isLoading}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + (index * 0.05) }}
                whileHover={{ scale: 1.02, x: 5 }}
                whileTap={{ scale: 0.98 }}
              >
                <span className="flex items-center gap-2">
                  <span className="text-xl">{suggestion.icon}</span>
                  <span>{suggestion.text}</span>
                </span>
              </motion.button>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default function ChatbotPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-light-gray py-8 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto mb-4"></div>
          <p className="text-text-gray">Chargement...</p>
        </div>
      </div>
    }>
      <ChatbotContent />
    </Suspense>
  );
}
