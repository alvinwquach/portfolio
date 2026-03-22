/**
 * Contact Page — The Ask
 * =======================
 * Clear. Direct. Respectful of time.
 *
 * If you're here, you're probably serious. Let's make it easy.
 */

import { getProfile } from '@/lib/graphql/queries';
import { ContactForm } from '@/components/sections/ContactForm';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail, Linkedin, Github, MapPin } from 'lucide-react';

export const metadata = {
  title: 'Let\'s Talk',
  description: 'Looking for teams that value systems thinking and craft. If that\'s you, let\'s connect.',
};

export default async function ContactPage() {
  const profile = await getProfile();

  return (
    <div className="py-24">
      <div className="container">
        {/* Header */}
        <div className="max-w-2xl mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Let's Talk</h1>
          <p className="text-lg text-muted-foreground">
            I'm looking for teams that value systems thinking, articulated tradeoffs,
            and craft at a deeper level. If that sounds like you, let's connect.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Send a Message</CardTitle>
              </CardHeader>
              <CardContent>
                <ContactForm />
              </CardContent>
            </Card>
          </div>

          {/* Contact Info */}
          <div className="space-y-8">
            {/* Availability */}
            {profile?.availabilityStatus && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Availability</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-3">
                    <div className={`h-3 w-3 rounded-full ${
                      profile.availabilityStatus === 'open' || profile.availabilityStatus === 'both'
                        ? 'bg-success'
                        : profile.availabilityStatus === 'freelance'
                        ? 'bg-amber'
                        : 'bg-dark-400'
                    }`} />
                    <span className="text-muted-foreground">
                      {profile.availabilityStatus === 'open' && 'Open to new opportunities'}
                      {profile.availabilityStatus === 'freelance' && 'Available for freelance projects'}
                      {profile.availabilityStatus === 'both' && 'Open to opportunities & freelance'}
                      {profile.availabilityStatus === 'unavailable' && 'Currently unavailable'}
                    </span>
                  </div>
                  {profile.openToRoles && profile.openToRoles.length > 0 && (
                    <div className="mt-4">
                      <p className="text-sm text-muted-foreground mb-2">Looking for:</p>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        {profile.openToRoles.map((role, index) => (
                          <li key={index}>• {role}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Direct Contact */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Direct Contact</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {profile?.email && (
                  <a
                    href={`mailto:${profile.email}`}
                    className="flex items-center gap-3 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <Mail className="h-5 w-5 text-cyan" />
                    {profile.email}
                  </a>
                )}
                {profile?.location && (
                  <div className="flex items-center gap-3 text-muted-foreground">
                    <MapPin className="h-5 w-5 text-amber" />
                    {profile.location}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Social Links */}
            {(profile?.linkedin || profile?.github) && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Connect</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {profile.linkedin && (
                    <a
                      href={profile.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <Linkedin className="h-5 w-5 text-[#0A66C2]" />
                      LinkedIn
                    </a>
                  )}
                  {profile.github && (
                    <a
                      href={profile.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <Github className="h-5 w-5" />
                      GitHub
                    </a>
                  )}
                </CardContent>
              </Card>
            )}

            {/* What I'm Looking For — The Fit */}
            {profile?.whatImLookingFor && profile.whatImLookingFor.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">What Makes a Good Fit</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-muted-foreground">
                    {profile.whatImLookingFor.map((item, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="text-amber">•</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
