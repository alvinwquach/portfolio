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
        // Node type variants — MODIFIED(feat/design-system): Late Night Session palette
        build:
          'border-transparent bg-info/10 text-info',
        bug:
          'border-transparent bg-error/10 text-error',
        decision:
          'border-transparent bg-accent-warm/10 text-accent-warm',
        concept:
          'border-transparent bg-success/10 text-success',
        tutorial:
          'border-transparent bg-accent/10 text-accent',
        chart:
          'border-transparent bg-info/10 text-info',
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
