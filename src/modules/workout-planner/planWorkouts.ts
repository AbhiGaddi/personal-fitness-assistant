import {
  getWorkoutsForPlan,
  PlanDetails,
  WorkoutType,
} from "@/lib/engine";
import { Workout } from "@/lib/types";

export const getWorkoutPlanDetails = async (
  planId: string,
  userId: string
): Promise<PlanDetails | null> => {
  if (!planId || !userId) {
    return null;
  }

  try {
    const plan = await getWorkoutsForPlan(planId, userId);
    if (!plan) {
      return null;
    }

    const workouts: Workout[] = plan.workouts.map(workout => ({
      ...workout,
      type: workout.type as WorkoutType, // Type assertion based on expected data
    }));

    return {
      ...plan,
      workouts,
    };
  } catch (error) {
    console.error("Error fetching workout plan details:", error);
    return null;
  }
};

const calculateWorkoutComplexity = (workout: Workout): number => {
  let complexity = 0;
  if (workout.sets) {
    complexity += workout.sets * 2;
  }
  if (workout.reps) {
    complexity += workout.reps;
  }
  if (workout.durationMinutes) {
    complexity += workout.durationMinutes;
  }
  if (workout.intensity) {
    complexity += workout.intensity.charCodeAt(0) - 'a'.charCodeAt(0); // Simple scoring based on intensity
  }
  return complexity;
};

export const calculatePlanComplexityScore = (planDetails: PlanDetails): number => {
  if (!planDetails || !planDetails.workouts) {
    return 0;
  }

  let totalComplexity = 0;
  for (const workout of planDetails.workouts) {
    totalComplexity += calculateWorkoutComplexity(workout);
  }
  return totalComplexity;
};

export const categorizeWorkoutsByType = (workouts: Workout[]): Record<WorkoutType, Workout[]> => {
  const categorized: Record<WorkoutType, Workout[]> = {
    STRENGTH: [],
    CARDIO: [],
    FLEXIBILITY: [],
    OTHER: [],
  };

  for (const workout of workouts) {
    if (categorized[workout.type]) {
      categorized[workout.type].push(workout);
    } else {
      // Handle unexpected workout types if necessary, though type assertion should prevent this
      categorized.OTHER.push(workout);
    }
  }

  return categorized;
};

export const getWorkoutPlanSummary = async (
  planId: string,
  userId: string
): Promise<{
  planDetails: PlanDetails | null;
  planComplexity: number;
  categorizedWorkouts: Record<WorkoutType, Workout[]>;
} | null> => {
  const planDetails = await getWorkoutPlanDetails(planId, userId);

  if (!planDetails) {
    return null;
  }

  const planComplexity = calculatePlanComplexityScore(planDetails);
  const categorizedWorkouts = categorizeWorkoutsByType(planDetails.workouts);

  return {
    planDetails,
    planComplexity,
    categorizedWorkouts,
  };
};
