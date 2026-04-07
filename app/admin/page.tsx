'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import AdminLogin from '@/components/admin/AdminLogin';
import { FaSpinner } from 'react-icons/fa';

export default function AdminPage() {
  const [checking, setChecking] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Check if already authenticated
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/admin/auth');
        if (response.ok) {
          const data = await response.json();
          if (data.authenticated) {
            router.push('/admin/dashboard');
            return;
          }
        }
      } catch (error) {
        console.error('Auth check error:', error);
      }
      setChecking(false);
    };

    checkAuth();
  }, [router]);

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <FaSpinner className="text-4xl text-accent animate-spin" />
      </div>
    );
  }

  return <AdminLogin />;
}
