'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  FaHome,
  FaFileAlt,
  FaPlus,
  FaSignOutAlt,
  FaBars,
  FaTimes,
} from 'react-icons/fa';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = async () => {
    try {
      await fetch('/api/admin/auth', { method: 'DELETE' });
      router.push('/admin');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const navItems = [
    { href: '/admin/dashboard', label: 'Dashboard', icon: FaHome },
    { href: '/admin/articles/new', label: 'New Article', icon: FaPlus },
  ];

  const isActive = (href: string) => pathname === href;

  return (
    <div className="min-h-screen bg-gray-900 flex">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 w-64 bg-gray-800 border-r border-gray-700 z-50 transform transition-transform lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-4 border-b border-gray-700">
            <Link href="/admin/dashboard" className="flex items-center gap-2 no-underline">
              <div className="w-10 h-10 bg-accent rounded-lg flex items-center justify-center">
                <FaFileAlt className="text-white text-xl" />
              </div>
              <span className="text-xl font-bold text-white">Admin</span>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg no-underline transition-colors ${
                    active
                      ? 'bg-accent text-white'
                      : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  }`}
                >
                  <Icon className="text-lg" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-gray-700">
            <Link
              href="/"
              className="flex items-center gap-3 px-4 py-3 rounded-lg no-underline text-gray-300 hover:bg-gray-700 hover:text-white transition-colors mb-2"
            >
              <FaHome className="text-lg" />
              <span>View Blog</span>
            </Link>
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 px-4 py-3 rounded-lg text-red-400 hover:bg-red-500/20 hover:text-red-300 transition-colors w-full"
            >
              <FaSignOutAlt className="text-lg" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Mobile header */}
        <header className="lg:hidden bg-gray-800 border-b border-gray-700 p-4 flex items-center justify-between">
          <button
            onClick={() => setSidebarOpen(true)}
            className="text-white p-2 hover:bg-gray-700 rounded-lg"
          >
            <FaBars className="text-xl" />
          </button>
          <span className="text-white font-semibold">Admin Panel</span>
          <div className="w-10" /> {/* Spacer for centering */}
        </header>

        {/* Content */}
        <main className="flex-1">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  );
}
