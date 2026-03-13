'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { FaCompass, FaPassport, FaRobot, FaPlane, FaRocket, FaCheckCircle } from 'react-icons/fa';
import { HiSparkles } from 'react-icons/hi';
import { Article } from '@/models/Article';
import ArticleList from '@/components/ArticleList';
import ChatInputPreview from '@/components/ChatInputPreview';

interface HomePageClientProps {
  articles: Article[];
}

export default function HomePageClient({ articles }: HomePageClientProps) {
  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  const staggerContainer = {
    animate: {
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-soft py-20 md:py-32 overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            className="absolute top-20 right-10 w-64 h-64 bg-accent/5 rounded-full blur-3xl"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          <motion.div
            className="absolute bottom-20 left-10 w-96 h-96 bg-secondary/10 rounded-full blur-3xl"
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.2, 0.4, 0.2],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </div>

        <div className="container relative z-10">
          <motion.div 
            className="max-w-4xl mx-auto text-center"
            initial="initial"
            animate="animate"
            variants={staggerContainer}
          >
            <motion.div
              variants={fadeInUp}
              className="inline-flex items-center gap-2 px-4 py-2 bg-accent/10 rounded-full text-accent font-medium mb-6"
            >
              <HiSparkles className="text-xl" />
              <span>Ton assistant pour partir en Allemagne 🇩🇪</span>
            </motion.div>

            <motion.h1 
              variants={fadeInUp}
              className="text-4xl md:text-6xl font-heading font-bold text-text-dark mb-6"
            >
              Yalla, on part en
              <span className="block text-accent mt-2 bg-gradient-to-r from-accent to-red-400 bg-clip-text text-transparent">
                Allemagne ! ✈️
              </span>
            </motion.h1>

            <motion.p 
              variants={fadeInUp}
              className="text-xl md:text-2xl text-text-gray mb-8 leading-relaxed"
            >
              Visa, logement, boulot, langue... On t&apos;explique tout,
              étape par étape, avec un ton cool et sans prise de tête.
            </motion.p>
            
            {/* Chat Preview */}
            <motion.div variants={fadeInUp}>
              <ChatInputPreview />
            </motion.div>

            {/* CTA Buttons */}
            <motion.div 
              variants={fadeInUp}
              className="mt-8 flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Link href="/tutoriels" className="btn btn-primary text-lg no-underline group">
                <FaCompass className="inline mr-2" />
                Voir les guides
                <motion.span
                  className="inline-block ml-2"
                  animate={{ x: [0, 5, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  →
                </motion.span>
              </Link>
              <Link href="/chatbot" className="btn btn-secondary text-lg no-underline group">
                <FaRobot className="inline mr-2" />
                Poser une question
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="container">
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
          >
            <motion.div 
              variants={fadeInUp}
              className="text-center p-6 rounded-xl hover:shadow-lg transition-shadow duration-300"
              whileHover={{ scale: 1.05 }}
            >
              <motion.div 
                className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4"
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.6 }}
              >
                <FaCompass className="text-3xl text-accent" />
              </motion.div>
              <h3 className="text-xl font-heading font-semibold mb-2">Guides détaillés</h3>
              <p className="text-text-gray">
                Toutes les démarches expliquées pas-à-pas, du visa au premier jour en Allemagne
              </p>
            </motion.div>

            <motion.div 
              variants={fadeInUp}
              className="text-center p-6 rounded-xl hover:shadow-lg transition-shadow duration-300"
              whileHover={{ scale: 1.05 }}
            >
              <motion.div 
                className="w-16 h-16 bg-secondary/20 rounded-full flex items-center justify-center mx-auto mb-4"
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.6 }}
              >
                <FaPassport className="text-3xl text-secondary" />
              </motion.div>
              <h3 className="text-xl font-heading font-semibold mb-2">Procédures simplifiées</h3>
              <p className="text-text-gray">
                Visa, papiers, inscriptions — tout expliqué clairement, sans jargon administratif
              </p>
            </motion.div>

            <motion.div 
              variants={fadeInUp}
              className="text-center p-6 rounded-xl hover:shadow-lg transition-shadow duration-300"
              whileHover={{ scale: 1.05 }}
            >
              <motion.div 
                className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4"
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.6 }}
              >
                <FaRobot className="text-3xl text-accent" />
              </motion.div>
              <h3 className="text-xl font-heading font-semibold mb-2">Chatbot IA</h3>
              <p className="text-text-gray">
                Pose tes questions et obtiens des réponses instantanées sur ton projet de départ
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Latest Articles */}
      <section className="py-16 bg-light-gray">
        <div className="container">
          <motion.div 
            className="flex items-center justify-between mb-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-text-dark">
              Derniers guides
            </h2>
            <Link 
              href="/tutoriels" 
              className="text-accent hover:underline font-medium hidden sm:inline-flex items-center gap-2 group"
            >
              Voir tous les guides
              <motion.svg 
                className="w-5 h-5"
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
                animate={{ x: [0, 5, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </motion.svg>
            </Link>
          </motion.div>

          <ArticleList articles={articles} showFeatured={false} />

          <motion.div 
            className="text-center mt-12 sm:hidden"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <Link href="/tutoriels" className="btn btn-primary no-underline">
              Voir tous les guides
            </Link>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-transparent" />
        <div className="container relative z-10">
          <motion.div 
            className="mx-auto text-center"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <motion.div
              className="inline-block mb-6"
              animate={{ 
                rotate: [0, 10, -10, 10, 0],
              }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
                repeatDelay: 3
              }}
            >
              <FaPlane className="text-6xl text-accent" />
            </motion.div>

            <h2 className="text-3xl md:text-4xl font-heading font-bold text-text-dark mb-6">
              Prêt à commencer l&apos;aventure ? 🚀
            </h2>
            <p className="text-xl text-text-gray mb-8">
              Explore nos guides ou pose tes questions à notre chatbot IA
            </p>

            <motion.div 
              className="flex flex-col sm:flex-row gap-4 justify-center"
              variants={staggerContainer}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
            >
              <motion.div variants={fadeInUp}>
                <Link href="/tutoriels" className="btn btn-primary text-lg no-underline">
                  <FaRocket className="inline mr-2" />
                  Découvrir les guides
                </Link>
              </motion.div>
              <motion.div variants={fadeInUp}>
                <Link href="/a-propos" className="btn btn-secondary text-lg no-underline">
                  <FaCheckCircle className="inline mr-2" />
                  En savoir plus
                </Link>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
