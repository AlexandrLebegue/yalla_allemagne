'use client';

import { motion } from 'framer-motion';
import { FaPassport, FaBuilding, FaBriefcase, FaLanguage, FaCoffee, FaRobot } from 'react-icons/fa';
import Link from 'next/link';
import { Article } from '@/models/Article';
import ArticleList from '@/components/ArticleList';

interface TutorielsPageClientProps {
  visaArticles: Article[];
  logementArticles: Article[];
  travailArticles: Article[];
  langueArticles: Article[];
  vieQuotidienneArticles: Article[];
}

export default function TutorielsPageClient({
  visaArticles,
  logementArticles,
  travailArticles,
  langueArticles,
  vieQuotidienneArticles
}: TutorielsPageClientProps) {
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

  const categories = [
    {
      id: 'visa-et-papiers',
      title: 'Visa & Papiers',
      description: `${visaArticles.length} guide${visaArticles.length > 1 ? 's' : ''}`,
      icon: FaPassport,
      color: 'bg-red-500'
    },
    {
      id: 'logement',
      title: 'Logement',
      description: `${logementArticles.length} guide${logementArticles.length > 1 ? 's' : ''}`,
      icon: FaBuilding,
      color: 'bg-blue-500'
    },
    {
      id: 'travail',
      title: 'Travail',
      description: `${travailArticles.length} guide${travailArticles.length > 1 ? 's' : ''}`,
      icon: FaBriefcase,
      color: 'bg-green-500'
    },
    {
      id: 'langue',
      title: 'Langue',
      description: `${langueArticles.length} guide${langueArticles.length > 1 ? 's' : ''}`,
      icon: FaLanguage,
      color: 'bg-purple-500'
    },
    {
      id: 'vie-quotidienne',
      title: 'Vie quotidienne',
      description: `${vieQuotidienneArticles.length} guide${vieQuotidienneArticles.length > 1 ? 's' : ''}`,
      icon: FaCoffee,
      color: 'bg-yellow-500'
    }
  ];

  return (
    <div className="min-h-screen bg-light-gray py-12">
      <div className="container">
        {/* Header */}
        <motion.div 
          className="mb-12"
          initial="initial"
          animate="animate"
          variants={staggerContainer}
        >
          <motion.h1 
            variants={fadeInUp}
            className="text-4xl md:text-5xl font-heading font-bold text-text-dark mb-4"
          >
            Guides pratiques 🇹🇳→🇩🇪
          </motion.h1>
          <motion.p 
            variants={fadeInUp}
            className="text-xl text-text-gray"
          >
            Toutes les démarches et astuces pour préparer ton départ en Allemagne, étape par étape.
          </motion.p>
        </motion.div>

        {/* Quick Links */}
        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-12"
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          variants={staggerContainer}
        >
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <motion.a
                key={category.id}
                href={`#${category.id}`}
                className="card hover:-translate-y-1 no-underline group"
                variants={fadeInUp}
                whileHover={{ scale: 1.02, boxShadow: '0 10px 30px rgba(0, 0, 0, 0.15)' }}
                transition={{ duration: 0.2 }}
              >
                <div className="flex items-center gap-3">
                  <motion.div 
                    className={`w-10 h-10 ${category.color} bg-opacity-10 rounded-full flex items-center justify-center flex-shrink-0`}
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.6 }}
                  >
                    <Icon className={`w-5 h-5 ${category.color.replace('bg-', 'text-')}`} />
                  </motion.div>
                  <div>
                    <h3 className="font-heading font-semibold text-text-dark group-hover:text-accent text-sm mb-0.5">
                      {category.title}
                    </h3>
                    <p className="text-xs text-text-gray">
                      {category.description}
                    </p>
                  </div>
                </div>
              </motion.a>
            );
          })}
        </motion.div>

        {/* Visa & Papiers Section */}
        {visaArticles.length > 0 && (
          <motion.section 
            id="visa-et-papiers" 
            className="mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center gap-3 mb-6">
              <motion.div 
                className="w-10 h-10 bg-red-500 bg-opacity-10 rounded-full flex items-center justify-center"
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.6 }}
              >
                <FaPassport className="w-5 h-5 text-red-500" />
              </motion.div>
              <h2 className="text-3xl font-heading font-bold text-text-dark">
                Visa & Papiers 🛂
              </h2>
            </div>
            <p className="text-text-gray mb-8">
              Tout ce qu&apos;il faut savoir sur les visas, les documents et les démarches administratives.
            </p>
            <ArticleList articles={visaArticles} />
          </motion.section>
        )}

        {/* Logement Section */}
        {logementArticles.length > 0 && (
          <motion.section 
            id="logement" 
            className="mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center gap-3 mb-6">
              <motion.div 
                className="w-10 h-10 bg-blue-500 bg-opacity-10 rounded-full flex items-center justify-center"
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.6 }}
              >
                <FaBuilding className="w-5 h-5 text-blue-500" />
              </motion.div>
              <h2 className="text-3xl font-heading font-bold text-text-dark">
                Logement 🏠
              </h2>
            </div>
            <p className="text-text-gray mb-8">
              Comment trouver un appart, les pièges à éviter et les astuces pour se loger en Allemagne.
            </p>
            <ArticleList articles={logementArticles} />
          </motion.section>
        )}

        {/* Travail Section */}
        {travailArticles.length > 0 && (
          <motion.section 
            id="travail" 
            className="mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center gap-3 mb-6">
              <motion.div 
                className="w-10 h-10 bg-green-500 bg-opacity-10 rounded-full flex items-center justify-center"
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.6 }}
              >
                <FaBriefcase className="w-5 h-5 text-green-500" />
              </motion.div>
              <h2 className="text-3xl font-heading font-bold text-text-dark">
                Travail 💼
              </h2>
            </div>
            <p className="text-text-gray mb-8">
              Trouver un boulot, préparer ton CV, passer des entretiens — tout pour décrocher le job.
            </p>
            <ArticleList articles={travailArticles} />
          </motion.section>
        )}

        {/* Langue Section */}
        {langueArticles.length > 0 && (
          <motion.section 
            id="langue" 
            className="mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center gap-3 mb-6">
              <motion.div 
                className="w-10 h-10 bg-purple-500 bg-opacity-10 rounded-full flex items-center justify-center"
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.6 }}
              >
                <FaLanguage className="w-5 h-5 text-purple-500" />
              </motion.div>
              <h2 className="text-3xl font-heading font-bold text-text-dark">
                Langue 🗣️
              </h2>
            </div>
            <p className="text-text-gray mb-8">
              Ressources, méthodes et conseils pour apprendre l&apos;allemand efficacement.
            </p>
            <ArticleList articles={langueArticles} />
          </motion.section>
        )}

        {/* Vie Quotidienne Section */}
        {vieQuotidienneArticles.length > 0 && (
          <motion.section 
            id="vie-quotidienne" 
            className="mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center gap-3 mb-6">
              <motion.div 
                className="w-10 h-10 bg-yellow-500 bg-opacity-10 rounded-full flex items-center justify-center"
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.6 }}
              >
                <FaCoffee className="w-5 h-5 text-yellow-500" />
              </motion.div>
              <h2 className="text-3xl font-heading font-bold text-text-dark">
                Vie quotidienne ☕
              </h2>
            </div>
            <p className="text-text-gray mb-8">
              La vie de tous les jours en Allemagne : culture, transports, nourriture, et plus encore.
            </p>
            <ArticleList articles={vieQuotidienneArticles} />
          </motion.section>
        )}

        {/* CTA Section */}
        <motion.div 
          className="bg-white rounded-lg shadow-soft p-8 text-center mt-12"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <motion.div
            className="inline-block mb-4"
            animate={{ 
              y: [0, -10, 0],
            }}
            transition={{ 
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <FaRobot className="text-5xl text-accent" />
          </motion.div>
          <h3 className="text-2xl font-heading font-bold text-text-dark mb-4">
            Tu ne trouves pas ce que tu cherches ?
          </h3>
          <p className="text-text-gray mb-6">
            Pose ta question à notre chatbot IA pour obtenir des conseils personnalisés 🤖
          </p>
          <Link href="/chatbot" className="btn btn-primary no-underline">
            <FaRobot className="inline mr-2" />
            Poser une question
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
