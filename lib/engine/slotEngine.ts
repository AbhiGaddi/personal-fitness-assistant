export interface ImmediateWorkoutSlot {
  id: string;
  durationMinutes: number;
  workoutType: string;
}

/**
 * Simulates fetching an immediate available workout slot from the Slot Engine.
 * In a real application, this would involve API calls or complex local logic.
 * @returns A promise that resolves to an ImmediateWorkoutSlot object if found, otherwise null.
 */
export async function getImmediateWorkoutSlot(): Promise<ImmediateWorkoutSlot | null> {
  // Simulate network delay to mimic an API call or complex computation
  await new Promise(resolve => setTimeout(resolve, 700));

  // --- Mock Logic for demonstration ---
  // For this task, we'll randomly determine if a slot is available
  // and provide mock data if it is.
  const isSlotAvailable = Math.random() > 0.3; // Approximately 70% chance of a slot being available

  if (isSlotAvailable) {
    const availableSlots: ImmediateWorkoutSlot[] = [
      { id: "slot-101", durationMinutes: 15, workoutType: "HIIT" },
      { id: "slot-102", durationMinutes: 30, workoutType: "Yoga" },
      { id: "slot-103", durationMinutes: 20, workoutType: "Strength Training" },
      { id: "slot-104", durationMinutes: 45, workoutType: "Cardio" }
    ];
    // Return a random slot from the mock list
    return availableSlots[Math.floor(Math.random() * availableSlots.length)];
  }

  return null; // No immediate slot found by the Slot Engine
}