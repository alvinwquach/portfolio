/**
 * Workshop Hero Section
 * =====================
 * The main 3D workshop experience with narrative intro.
 * Each zone represents a real part of the portfolio story.
 */

'use client';

import dynamic from 'next/dynamic';
import { cn } from '@/lib/utils';

// Dynamically import the 3D scene to avoid SSR issues
const StudioDiorama = dynamic(
  () => import('@/components/world/StudioDiorama').then((mod) => mod.StudioDiorama),
  {
    ssr: false,
    loading: () => (
      <div className="absolute inset-0 bg-gradient-to-b from-background to-background/90" />
    ),
  }
);

interface WorkshopHeroProps {
  name?: string;
  title?: string;
  tagline?: string;
}

export function WorkshopHero({
  name = 'Alvin Quach',
  title = 'Full-Stack Developer',
  tagline = 'Explore my studio — click objects to discover projects',
}: WorkshopHeroProps) {
  return (
    <section className="relative h-screen min-h-[600px] overflow-hidden">
      {/* 3D Studio Diorama - full screen, no overlays */}
      <StudioDiorama />
    </section>
  );
}
