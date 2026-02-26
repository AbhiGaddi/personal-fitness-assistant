import Link from 'next/link';

export default function Header() {
  return (
    <header className="bg-gray-800 text-white p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold hover:text-gray-300">
          FitnessTracker
        </Link>
        <nav>
          <ul className="flex space-x-6">
            <li>
              <Link href="/dashboard" className="hover:text-gray-300 transition-colors duration-200">
                Dashboard
              </Link>
            </li>
            <li>
              <Link href="/workouts" className="hover:text-gray-300 transition-colors duration-200">
                Workouts
              </Link>
            </li>
            <li>
              <Link href="/exercises" className="hover:text-gray-300 transition-colors duration-200">
                Exercises
              </Link>
            </li>
            <li>
              <Link href="/profile" className="hover:text-gray-300 transition-colors duration-200">
                Profile
              </Link>
            </li>
            <li>
              <Link href="/settings" className="hover:text-gray-300 transition-colors duration-200">
                Settings
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
