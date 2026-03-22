'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/login');
  }, [router]);

  return (
    <div className="min-h-screen bg-[#0F172A] flex flex-col items-center justify-center">
      <h1 className="text-4xl font-bold text-white mb-2">
        Local <span className="text-[#3B82F6]">Connect</span>
      </h1>
      <p className="text-slate-400 mb-8">Client Management Portal</p>
      <div className="flex gap-4">
        <a
          href="/login"
          className="px-6 py-2.5 bg-[#3B82F6] hover:bg-[#2563EB] text-white font-medium rounded-lg transition-colors"
        >
          Sign In
        </a>
        <a
          href="/register"
          className="px-6 py-2.5 border border-slate-600 hover:border-slate-500 text-white font-medium rounded-lg transition-colors"
        >
          Register
        </a>
      </div>
    </div>
  );
}
