'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { FaHome, FaRobot, FaCompass, FaInfoCircle, FaGraduationCap, FaGithub, FaLinkedin, FaEnvelope, FaArrowRight, FaHeart, FaPlane } from 'react-icons/fa';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const footerLinks = [
    { href: '/', label: 'Accueil', icon: FaHome },
    { href: '/chatbot', label: 'Chatbot', icon: FaRobot },
    { href: '/tutoriels', label: 'Guides', icon: FaCompass },
    { href: '/apprendre', label: 'Apprendre', icon: FaGraduationCap },
    { href: '/a-propos', label: 'À propos', icon: FaInfoCircle },
  ];

  const socialLinks = [
    { href: 'https://github.com', icon: FaGithub, label: 'GitHub' },
    { href: 'https://linkedin.com', icon: FaLinkedin, label: 'LinkedIn' },
  ];

  return (
    <footer className="bg-off-white border-t border-border mt-auto">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h3 className="text-xl font-heading font-bold text-text-dark mb-4">
              🇹🇳 Yalla Allemagne 🇩🇪
            </h3>
            <p className="text-text-gray text-sm leading-relaxed mb-4">
              Le guide cool et pratique pour les Tunisiens qui veulent partir en Allemagne.
              Visa, logement, travail, langue — on t&apos;explique tout !
            </p>
            <motion.div 
              className="flex items-center gap-1 text-text-gray text-sm"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              Fait avec <motion.span
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1, repeat: Infinity, repeatDelay: 1 }}
              >
                <FaHeart className="text-red-500 mx-1" />
              </motion.span> pour la communauté tunisienne
            </motion.div>
          </motion.div>

          {/* Navigation */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <h4 className="text-lg font-heading font-semibold text-text-dark mb-4">
              Navigation
            </h4>
            <ul className="space-y-2">
              {footerLinks.map((link, index) => {
                const Icon = link.icon;
                return (
                  <motion.li 
                    key={link.href}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 + (index * 0.05) }}
                  >
                    <Link
                      href={link.href}
                      className="text-text-gray hover:text-accent transition-colors text-sm no-underline inline-flex items-center gap-2 group"
                    >
                      <Icon className="text-base group-hover:scale-110 transition-transform" />
                      <span>{link.label}</span>
                    </Link>
                  </motion.li>
                );
              })}
            </ul>
          </motion.div>

          {/* Contact */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h4 className="text-lg font-heading font-semibold text-text-dark mb-4">
              Contact
            </h4>
            <p className="text-text-gray text-sm mb-4">
              Une question ? Une suggestion ? N&apos;hésite pas à nous écrire !
            </p>
            <Link
              href="/a-propos#contact"
              className="inline-flex items-center text-accent hover:underline text-sm group"
            >
              <FaEnvelope className="mr-2 group-hover:scale-110 transition-transform" />
              <span>Formulaire de contact</span>
              <motion.div
                className="ml-1"
                animate={{ x: [0, 5, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <FaArrowRight />
              </motion.div>
            </Link>
          </motion.div>
        </div>

        {/* Bottom Bar */}
        <motion.div 
          className="mt-8 pt-8 border-t border-border"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-text-gray text-sm">
              © {currentYear} Yalla Allemagne. Tous droits réservés.
            </p>
            <div className="flex items-center space-x-6">
              {socialLinks.map((social, index) => {
                const Icon = social.icon;
                return (
                  <motion.a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-text-gray hover:text-accent transition-colors"
                    aria-label={social.label}
                    whileHover={{ scale: 1.2, rotate: 5 }}
                    whileTap={{ scale: 0.9 }}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.4 + (index * 0.1) }}
                  >
                    <Icon className="w-5 h-5" />
                  </motion.a>
                );
              })}
            </div>
          </div>
        </motion.div>
      </div>
    </footer>
  );
}
