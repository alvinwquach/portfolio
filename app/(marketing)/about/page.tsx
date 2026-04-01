/**
 * About Page — Personal details, hobbies, DJ scene
 */

import { getProfile } from '@/lib/graphql/queries';
import { AboutPageClient } from './AboutPageClient';

export const metadata = {
  title: 'About | Alvin Quach',
  description: 'Full Stack Developer based in the San Francisco Bay Area. Background, interests, and what I care about beyond code.',
};

export default async function AboutPage() {
  const profile = await getProfile();

  return (
    <AboutPageClient
      name={profile?.name || 'Alvin Quach'}
      headline={profile?.headline || 'Full Stack Developer'}
      location={profile?.location}
      bio={profile?.careerGoals}
      hobbies={profile?.hobbiesAndInterests}
      strengths={profile?.strengths}
      whatIEnjoy={profile?.whatIEnjoy}
      whatImLookingFor={profile?.whatImLookingFor}
      resumeUrl={profile?.resume?.url}
      imageUrl={profile?.image?.url}
      github={profile?.github}
      linkedin={profile?.linkedin}
      email={profile?.email}
    />
  );
}
