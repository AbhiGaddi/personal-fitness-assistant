import Link from 'next/link';
import React from 'react';

export default function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 bg-white shadow-md p-4 flex justify-between items-center z-50">
      <div className="text-xl font-bold">My App</div>
      <nav>
        <Link href="/dashboard" className="mr-4 text-gray-700 hover:text-gray-900">
          Dashboard
        </Link>
        <Link href="/settings" className="mr-4 text-gray-700 hover:text-gray-900">
          Settings
        </Link>
        {/* 
          Adjusted z-index for the login button to resolve mobile overlap issues.
          The 'relative' class ensures 'z-10' properly applies a stacking context.
        */}
        <Link href="/login" className="relative z-10">
          <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
            Login
          </button>
        </Link>
      </nav>
    </header>
  );
}
