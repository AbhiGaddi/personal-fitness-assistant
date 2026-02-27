"use client"; // This component requires client-side interactivity

import React, { useState } from 'react';

// Array defining the available equipment options
const EQUIPMENT_OPTIONS: string[] = [
  'Dumbbells',
  'Barbell',
  'Resistance Bands',
  'Pull-up Bar',
  'Yoga Mat',
  'Jump Rope',
  'Kettlebell' // Added 'Kettlebell' as per task
];

interface Step1Props {
  // Callback function to handle moving to the next step with selected equipment
  onNext: (selectedEquipment: string[]) => void;
  // Optional initial selection of equipment, useful for editing or pre-filling
  initialEquipment?: string[];
}

const Step1: React.FC<Step1Props> = ({ onNext, initialEquipment = [] }) => {
  // State to manage the currently selected equipment
  const [selectedEquipment, setSelectedEquipment] = useState<string[]>(initialEquipment);

  // Toggle selection for an equipment item
  const handleEquipmentToggle = (equipment: string) => {
    setSelectedEquipment(prev =>
      prev.includes(equipment)
        ? prev.filter(item => item !== equipment) // Remove if already selected
        : [...prev, equipment] // Add if not selected
    );
  };

  // Handler for the continue button, passes selected equipment to the parent
  const handleContinue = () => {
    onNext(selectedEquipment);
  };

  return (
    <div className="space-y-6 p-4 max-w-2xl mx-auto">
      <h2 className="text-3xl font-extrabold text-gray-900 text-center">
        What equipment do you have available?
      </h2>
      <p className="text-md text-gray-600 text-center">
        Select all that apply. This helps us tailor your workout plans to your resources.
      </p>

      <div className="flex flex-wrap justify-center gap-3 mt-8">
        {EQUIPMENT_OPTIONS.map((equipment) => (
          <button
            key={equipment}
            type="button"
            onClick={() => handleEquipmentToggle(equipment)}
            className={`
              px-6 py-3 rounded-full border transition-all duration-200 ease-in-out
              text-lg font-medium
              ${selectedEquipment.includes(equipment)
                ? 'bg-blue-600 text-white border-blue-600 shadow-lg'
                : 'bg-white text-gray-800 border-gray-300 hover:border-blue-400 hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
              }
            `}
          >
            {equipment}
          </button>
        ))}
      </div>

      <div className="pt-8">
        <button
          type="button"
          onClick={handleContinue}
          className="w-full bg-blue-600 text-white py-3 rounded-lg text-xl font-semibold hover:bg-blue-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Continue
        </button>
      </div>
    </div>
  );
};

export default Step1;
