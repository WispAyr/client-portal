'use client';

import { useState, useEffect } from 'react';
import { ExternalLink } from 'lucide-react';

interface Subscription {
  id: string;
  status: string;
  product: {
    id: string;
    name: string;
    slug: string;
    url?: string;
  };
}

const products = [
  {
    slug: 'pitchup',
    name: 'PitchUp',
    icon: '\uD83D\uDE9A',
    color: '#F97316',
    description: 'Mobile pitch management',
    price: 49.99,
  },
  {
    slug: 'parkwise',
    name: 'Parkwise',
    icon: '\uD83C\uDD7F\uFE0F',
    color: '#3B82F6',
    description: 'Smart parking solutions',
    price: 79.99,
  },
  {
    slug: 'sentryflow',
    name: 'SentryFlow',
    icon: '\uD83D\uDCF9',
    color: '#EF4444',
    description: 'Video surveillance system',
    price: 99.99,
  },
  {
    slug: 'airwave',
    name: 'AirWave',
    icon: '\uD83D\uDCE1',
    color: '#8B5CF6',
    description: 'Wireless connectivity',
    price: 59.99,
  },
  {
    slug: 'controllog',
    name: 'ControlLog',
    icon: '\uD83D\uDCCB',
    color: '#22C55E',
    description: 'Access control logging',
    price: 39.99,
  },
  {
    slug: 'broadcast-studio',
    name: 'Broadcast Studio',
    icon: '\uD83D\uDCFA',
    color: '#7C3AED',
    description: 'Live streaming platform',
    price: 149.99,
  },
  {
    slug: 'sentinel',
    name: 'Sentinel',
    icon: '\uD83D\uDEE1\uFE0F',
    color: '#F97316',
    description: 'Security monitoring',
    price: 89.99,
  },
  {
    slug: 'venueguard',
    name: 'VenueGuard',
    icon: '\uD83C\uDFDF\uFE0F',
    color: '#14B8A6',
    description: 'Venue management system',
    price: 119.99,
  },
];

export default function ProductsPage() {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/subscriptions')
      .then((r) => r.json())
      .then((data) => setSubscriptions(data.subscriptions || []))
      .finally(() => setLoading(false));
  }, []);

  function getSubscription(slug: string) {
    return subscriptions.find(
      (s) =>
        s.product.slug === slug ||
        s.product.name.toLowerCase().replace(/\s+/g, '-') === slug
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#3B82F6]" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white">Products</h2>
        <p className="text-slate-400 mt-1">
          Browse and manage your product subscriptions.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {products.map((product) => {
          const sub = getSubscription(product.slug);
          const isActive = sub && sub.status === 'ACTIVE';

          return (
            <div
              key={product.slug}
              className="bg-[#1E293B] rounded-xl p-6 flex flex-col"
            >
              <div className="flex items-start justify-between mb-4">
                <div
                  className="h-12 w-12 rounded-xl flex items-center justify-center text-2xl"
                  style={{ backgroundColor: product.color + '20' }}
                >
                  {product.icon}
                </div>
                {isActive && (
                  <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-green-500/20 text-green-400">
                    Active
                  </span>
                )}
              </div>

              <h3 className="text-white font-semibold text-lg">
                {product.name}
              </h3>
              <p className="text-slate-400 text-sm mt-1 flex-1">
                {product.description}
              </p>

              <p className="text-white font-semibold mt-3">
                <span className="text-2xl">
                  ${product.price.toFixed(2)}
                </span>
                <span className="text-sm text-slate-400 font-normal">
                  /month
                </span>
              </p>

              <div className="mt-4">
                {isActive ? (
                  <a
                    href={sub.product.url || '#'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full py-2.5 bg-[#3B82F6] hover:bg-[#2563EB] text-white font-medium rounded-lg transition-colors text-sm"
                  >
                    <ExternalLink size={16} />
                    Launch
                  </a>
                ) : (
                  <button className="w-full py-2.5 border border-slate-600 hover:border-slate-500 text-slate-300 hover:text-white font-medium rounded-lg transition-colors text-sm">
                    Contact Sales
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
