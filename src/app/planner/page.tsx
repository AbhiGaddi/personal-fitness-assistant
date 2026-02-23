import { planWorkouts } from '@/modules/workout-planner/planWorkouts';
import { getSession } from '@/modules/auth/session';
import AuthButton from '@/components/AuthButton';
import PlannerClient from './PlannerClient'

export default function PlannerPage() {
  const session = getSession();
  const loggedIn = !!session.providerTokens.google?.accessToken;

  if (!loggedIn) {
    return (
      <main className="flex flex-col items-center justify-center min-h-[60vh]">
        <h2 className="font-semibold mb-4">Sign in to access your planner</h2>
        <AuthButton provider="google" />
      </main>
    );
  }

  return <PlannerClient />;
}
