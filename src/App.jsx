import React from 'react';
import Navbar from './components/Navbar';

function App() {
  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <main className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Welcome to your Application!</h1>
        <p>This is the main content area.</p>
      </main>
    </div>
  );
}

export default App;
