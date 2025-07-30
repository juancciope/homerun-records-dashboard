import { redirect } from 'next/navigation';

export default function Home() {
  // Redirect directly to the dashboard - no confusing landing page
  redirect('/agency/demo-agency');
}