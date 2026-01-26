/**
 * Marketing Layout
 * ================
 * Layout for all public marketing pages
 * Includes navigation and footer with accessibility features
 */

import { Navigation } from '@/components/layout/Navigation';
import { Footer } from '@/components/layout/Footer';
import { SkipToContent } from '@/components/a11y';
import { getProfile } from '@/lib/graphql/queries';

export default async function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Fetch profile for footer social links
  const profile = await getProfile();

  return (
    <div className="flex min-h-screen flex-col">
      <SkipToContent />
      <Navigation />
      <main id="main-content" className="flex-1" role="main" tabIndex={-1}>
        {children}
      </main>
      <Footer
        email={profile?.email}
        github={profile?.github}
        linkedin={profile?.linkedin}
      />
    </div>
  );
}
