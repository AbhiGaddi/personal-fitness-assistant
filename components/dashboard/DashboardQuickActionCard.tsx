import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { getImmediateWorkoutSlot, ImmediateWorkoutSlot } from '@/lib/engine/slotEngine';

/**
 * DashboardQuickActionCard Component
 * Displays a 'Quick-Action' button on the dashboard when an immediate workout slot is available.
 * The button's text dynamically updates based on the slot's duration and workout type.
 */
export const DashboardQuickActionCard: React.FC = () => {
  const [slot, setSlot] = useState<ImmediateWorkoutSlot | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchSlot = async () => {
      setIsLoading(true);
      try {
        const immediateSlot = await getImmediateWorkoutSlot();
        setSlot(immediateSlot);
      } catch (error) {
        console.error("Failed to fetch immediate workout slot:", error);
        setSlot(null); // Ensure no slot is displayed on error
      } finally {
        setIsLoading(false);
      }
    };

    fetchSlot();
  }, []); // Empty dependency array ensures this effect runs only once on component mount

  if (isLoading) {
    // Render a skeleton or loading indicator while the slot engine is checking
    return (
      <Card className="w-[350px] shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl font-bold">Checking for Quick Actions...</CardTitle>
          <CardDescription>Scanning for immediate workout opportunities.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-12 w-full bg-gray-200 rounded-md animate-pulse" />
        </CardContent>
      </Card>
    );
  }

  // If no immediate slot is found after loading, render nothing
  if (!slot) {
    return null;
  }

  const buttonText = `Ready for a ${slot.durationMinutes}-min ${slot.workoutType} session?`;

  return (
    <Card className="w-[350px] shadow-lg transition-transform hover:scale-[1.01]">
      <CardHeader>
        <CardTitle className="text-xl font-bold text-blue-600">Quick Action Available!</CardTitle>
        <CardDescription>An immediate workout slot has been identified just for you. Seize the moment!</CardDescription>
      </CardHeader>
      <CardContent>
        <Button
          className="w-full text-lg h-14 font-semibold bg-blue-500 hover:bg-blue-600 text-white shadow-md transition-colors"
          onClick={() => {
            // In a real application, this would trigger a scheduling action or navigation
            console.log("Quick Action button clicked! Slot details:", slot);
            alert(`Confirmed: Starting your ${slot.durationMinutes}-min ${slot.workoutType} session now!`);
          }}
        >
          {buttonText}
        </Button>
      </CardContent>
    </Card>
  );
};