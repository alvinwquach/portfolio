/**
 * Badge Component
 * ===============
 * Small status indicator or tag
 */

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const badgeVariants = cva(
  'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
  {
    variants: {
      variant: {
        default:
          'border-transparent bg-primary text-primary-foreground',
        secondary:
          'border-transparent bg-secondary text-secondary-foreground',
        destructive:
          'border-transparent bg-destructive text-destructive-foreground',
        outline: 'text-foreground',
        gold:
          'border-transparent bg-accent text-accent-foreground',
        // Node type variants
        build:
          'border-transparent bg-cyan/10 text-cyan',
        bug:
          'border-transparent bg-coral/10 text-coral',
        decision:
          'border-transparent bg-amber/10 text-amber-700',
        concept:
          'border-transparent bg-emerald-500/10 text-emerald-700',
        tutorial:
          'border-transparent bg-purple-500/10 text-purple-700',
        chart:
          'border-transparent bg-cyan-500/10 text-cyan-700',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
