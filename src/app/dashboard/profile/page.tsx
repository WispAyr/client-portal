'use client';

import { useState, useEffect } from 'react';
import { Save } from 'lucide-react';

interface UserProfile {
  id: string;
  name: string;
  email: string;
  companyName: string | null;
  phone: string | null;
  website: string | null;
  address: string | null;
}

export default function ProfilePage() {
  const [, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  // Form state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [phone, setPhone] = useState('');
  const [website, setWebsite] = useState('');
  const [address, setAddress] = useState('');

  useEffect(() => {
    fetch('/api/auth/me')
      .then((r) => r.json())
      .then((data) => {
        if (data.user) {
          const u = data.user;
          setUser(u);
          setName(u.name || '');
          setEmail(u.email || '');
          setCompanyName(u.companyName || '');
          setPhone(u.phone || '');
          setWebsite(u.website || '');
          setAddress(u.address || '');
        }
      })
      .finally(() => setLoading(false));
  }, []);

  function handleSave(e: React.FormEvent) {
    e.preventDefault();
    // TODO: Implement PUT /api/auth/profile
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }, 500);
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#3B82F6]" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white">Profile</h2>
        <p className="text-slate-400 mt-1">
          Manage your account information.
        </p>
      </div>

      <form
        onSubmit={handleSave}
        className="bg-[#1E293B] rounded-xl p-6 space-y-5"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">
              Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2.5 bg-[#0F172A] border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#3B82F6] focus:border-transparent"
              placeholder="Your name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">
              Email
            </label>
            <input
              type="email"
              value={email}
              readOnly
              className="w-full px-4 py-2.5 bg-[#0F172A] border border-slate-600 rounded-lg text-slate-400 cursor-not-allowed"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">
              Company Name
            </label>
            <input
              type="text"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              className="w-full px-4 py-2.5 bg-[#0F172A] border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#3B82F6] focus:border-transparent"
              placeholder="Your company"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">
              Phone
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-4 py-2.5 bg-[#0F172A] border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#3B82F6] focus:border-transparent"
              placeholder="+44 ..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">
              Website
            </label>
            <input
              type="url"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              className="w-full px-4 py-2.5 bg-[#0F172A] border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#3B82F6] focus:border-transparent"
              placeholder="https://..."
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1.5">
            Address
          </label>
          <textarea
            rows={3}
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="w-full px-4 py-2.5 bg-[#0F172A] border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#3B82F6] focus:border-transparent resize-none"
            placeholder="Your address"
          />
        </div>

        <div className="flex items-center gap-4 pt-2">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 px-5 py-2.5 bg-[#3B82F6] hover:bg-[#2563EB] text-white font-medium rounded-lg transition-colors text-sm disabled:opacity-50"
          >
            <Save size={16} />
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
          {saved && (
            <span className="text-sm text-green-400">
              Changes saved successfully.
            </span>
          )}
        </div>
      </form>
    </div>
  );
}
