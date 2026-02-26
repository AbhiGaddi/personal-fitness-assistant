import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

// Define a static list of commonly used home workout equipment.
// In a real application, this might be fetched from an API.
const availableEquipment = [
  'Yoga Mat',
  'Dumbbells',
  'Kettlebell',
  'Resistance Bands',
  'Pull-up Bar',
  'Exercise Bike',
  'Treadmill',
  'Jump Rope',
  'Resistance Loop Bands',
  'Ab Roller',
  'Medicine Ball',
  'Bench/Step',
  'Foam Roller',
  'Boxing Gloves/Bag'
];

interface UserEquipmentPreferencesProps {
  /**
   * Initial list of equipment the user has selected. Default to empty array.
   */
  initialPreferences?: string[];
  /**
   * Callback function that is called when the selected equipment changes.
   * The updated list of selected equipment is passed as an argument.
   */
  onPreferencesChange?: (preferences: string[]) => void;
}

export function UserEquipmentPreferences({
  initialPreferences = [],
  onPreferencesChange,
}: UserEquipmentPreferencesProps) {
  const [selectedEquipment, setSelectedEquipment] = useState<string[]>(initialPreferences);

  /**
   * Handles the change event for a checkbox, updating the selected equipment state.
   * @param equipment The name of the equipment item being changed.
   * @param isChecked The new checked state of the checkbox.
   */
  const handleCheckboxChange = (equipment: string, isChecked: boolean) => {
    let newSelection;
    if (isChecked) {
      newSelection = [...selectedEquipment, equipment];
    } else {
      newSelection = selectedEquipment.filter((item) => item !== equipment);
    }
    setSelectedEquipment(newSelection);
    // Optionally, notify a parent component or a context about the change.
    onPreferencesChange?.(newSelection);
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Equipment Preferences</CardTitle>
        <CardDescription>
          Select all the home workout equipment you currently have available. This helps us tailor
          workout suggestions specifically for you.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {availableEquipment.map((equipment) => (
            <div key={equipment} className="flex items-center space-x-2">
              <Checkbox
                id={`equipment-${equipment.toLowerCase().replace(/\s/g, '-')}`}
                checked={selectedEquipment.includes(equipment)}
                onCheckedChange={(checked) => handleCheckboxChange(equipment, !!checked)}
              />
              <Label htmlFor={`equipment-${equipment.toLowerCase().replace(/\s/g, '-')}`}>
                {equipment}
              </Label>
            </div>
          ))}
        </div>
        {/* This section can be uncommented for debugging or to show current selections. */}
        {/* <div className="mt-8 p-4 border rounded-md bg-muted/50">
          <h4 className="font-semibold mb-2">Your current selections:</h4>
          <p className="text-sm text-muted-foreground">
            {selectedEquipment.length > 0 ? selectedEquipment.join(', ') : 'No equipment selected'}
          </p>
        </div> */}
      </CardContent>
    </Card>
  );
}
