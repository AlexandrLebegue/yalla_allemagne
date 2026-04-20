'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { FaHome, FaRobot, FaCompass, FaInfoCircle, FaGraduationCap } from 'react-icons/fa';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const navLinks = [
    { href: '/', label: 'Accueil', icon: FaHome },
    { href: '/chatbot', label: 'Chatbot', icon: FaRobot },
    { href: '/tutoriels', label: 'Guides', icon: FaCompass },
    { href: '/apprendre', label: 'Apprendre', icon: FaGraduationCap },
    { href: '/a-propos', label: 'À propos', icon: FaInfoCircle },
  ];

  const isActive = (href: string) => {
    if (href === '/') {
      return pathname === '/';
    }
    return pathname?.startsWith(href);
  };

  return (
    <motion.nav 
      className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-border"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="container">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            href="/"
            className="text-2xl font-heading font-bold text-text-dark hover:text-accent transition-colors no-underline group"
          >
            <motion.span
              className="flex items-center gap-2"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              <Image
                src="/icon.svg"
                alt="Yalla Allemagne Logo"
                width={32}
                height={32}
                className="w-8 h-8"
              />
              <span className="hidden sm:inline">Yalla Allemagne</span>
              <span className="sm:hidden">Yalla 🇩🇪</span>
            </motion.span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const active = isActive(link.href);
              
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className="relative group no-underline"
                >
                  <motion.div
                    className={`flex items-center gap-2 font-medium transition-colors ${
                      active
                        ? 'text-accent'
                        : 'text-text-dark hover:text-accent'
                    }`}
                    whileHover={{ y: -2 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Icon className="text-lg" />
                    <span>{link.label}</span>
                  </motion.div>
                  
                  {/* Active indicator */}
                  {active && (
                    <motion.div
                      className="absolute -bottom-2 left-0 right-0 h-0.5 bg-accent"
                      layoutId="navbar-indicator"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                    />
                  )}
                </Link>
              );
            })}
          </div>

          {/* Mobile Menu Button */}
          <motion.button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-light-gray transition-colors"
            aria-label="Toggle menu"
            aria-expanded={isOpen}
            whileTap={{ scale: 0.95 }}
          >
            <motion.svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              animate={isOpen ? "open" : "closed"}
            >
              <motion.path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                variants={{
                  closed: { d: "M4 6h16M4 12h16M4 18h16" },
                  open: { d: "M6 18L18 6M6 6l12 12" }
                }}
                transition={{ duration: 0.2 }}
              />
            </motion.svg>
          </motion.button>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              className="md:hidden py-4 border-t border-border"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
            >
              <div className="flex flex-col space-y-4">
                {navLinks.map((link, index) => {
                  const Icon = link.icon;
                  const active = isActive(link.href);
                  
                  return (
                    <motion.div
                      key={link.href}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <Link
                        href={link.href}
                        onClick={() => setIsOpen(false)}
                        className={`flex items-center gap-3 px-4 py-2 rounded-lg no-underline transition-colors ${
                          active
                            ? 'bg-accent/10 text-accent font-semibold'
                            : 'text-text-dark hover:bg-light-gray'
                        }`}
                      >
                        <Icon className="text-lg" />
                        <span>{link.label}</span>
                      </Link>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
}
