'use client';

import { useState, useEffect } from 'react';

export default function Header() {
  const [loggedIn, setLoggedIn] = useState<boolean | null>(null);

  useEffect(() => {
    fetch('/api/session')
      .then(res => res.json())
      .then(data => setLoggedIn(data.loggedIn))
      .catch(() => setLoggedIn(false));
  }, []);

  async function handleLogout() {
    try {
      await fetch('/api/logout', { method: 'POST' });
      setLoggedIn(false); // Immediately update the local state
      window.location.href = '/';
    } catch (error) {
      console.error('Logout failed', error);
    }
  }

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 md:px-8">
        <a href="/" className="text-base font-semibold tracking-tight text-gray-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500">Personalized Fitness <span className="text-brand-600">AI</span></a>
        <nav aria-label="Primary" className="flex items-center gap-6 text-sm font-medium">
          <a href="/planner" className="text-gray-600 hover:text-gray-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 rounded px-1">Planner</a>
          {loggedIn && (
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
              title="Logout"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16,17 21,12 16,7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
              Logout
            </button>
          )}
        </nav>
      </div>
    </header>
  );
}
