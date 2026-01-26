/**
 * Hobbies Section
 * ===============
 * Display hobbies and interests with a featured DJ visualization.
 * Two-column layout: Content on left, 3D DJ scene on right.
 */

'use client';

import dynamic from 'next/dynamic';
import { Music } from 'lucide-react';
import { cn } from '@/lib/utils';

// Dynamic import to avoid SSR issues with Three.js
const DJScene3D = dynamic(
  () => import('@/components/three/DJScene3D').then((mod) => mod.DJScene3D),
  {
    ssr: false,
    loading: () => (
      <div className="aspect-square max-w-lg mx-auto flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-amber/30 border-t-amber rounded-full animate-spin" />
      </div>
    ),
  }
);

interface HobbyOrInterest {
  name?: string;
  description?: string;
}

interface HobbiesSectionProps {
  hobbies?: HobbyOrInterest[];
}

export function HobbiesSection({ hobbies }: HobbiesSectionProps) {
  if (!hobbies || hobbies.length === 0) return null;

  // Find the DJing hobby specifically
  const djHobby = hobbies.find(h => h.name?.toLowerCase().includes('dj'));

  return (
    <section id="hobbies" className="py-24 scroll-mt-20 overflow-hidden">
      <div className="container">
        {/* Header - centered above the scene */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <p className="text-xs font-medium text-amber uppercase tracking-wider mb-2">
            Beyond the Code
          </p>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Hobbies & Interests
          </h2>
          <p className="text-muted-foreground">
            What I do when I'm not building software. These interests shape who I am
            and often inspire creative approaches to problem-solving.
          </p>
        </div>

        {/* DJ Content - Featured info */}
        {djHobby && (
          <div className="flex items-center justify-center gap-3 mb-8">
            <div className="p-3 rounded-lg bg-amber/10 text-amber">
              <Music className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-foreground">
                {djHobby.name}
              </h3>
              <p className="text-sm text-muted-foreground max-w-lg">
                {djHobby.description}
              </p>
            </div>
          </div>
        )}

        {/* 3D DJ Scene - Full width */}
        <div className="relative w-full h-[500px] md:h-[550px] lg:h-[600px] rounded-xl overflow-hidden">
          <DJScene3D className="w-full h-full" />
        </div>
      </div>
    </section>
  );
}

