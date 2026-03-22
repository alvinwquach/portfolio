/**
 * ProjectRoadmap Component
 * ========================
 * Product roadmap visualization with horizontal flow and arrows
 * Shows MVP, Stretch, and Future phases with milestones
 */

'use client';

import * as React from 'react';
import { Check, Circle, Clock, ChevronDown, ChevronRight, Plus, ArrowRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import type { RoadmapPhase, RoadmapMilestone, Skill } from '@/lib/graphql/queries';

interface ProjectRoadmapProps {
  roadmap: RoadmapPhase[];
  className?: string;
}

// MODIFIED(feat/design-system): Late Night Session palette
const phaseConfig = {
  mvp: {
    label: 'MVP',
    fullLabel: 'Minimum Viable Product',
    color: 'text-success',
    bgColor: 'bg-success/10',
    borderColor: 'border-success/30',
    solidBg: 'bg-success',
    ringColor: 'ring-success/20',
  },
  stretch: {
    label: 'Stretch',
    fullLabel: 'Stretch Goals',
    color: 'text-accent-warm',
    bgColor: 'bg-accent-warm/10',
    borderColor: 'border-accent-warm/30',
    solidBg: 'bg-accent-warm',
    ringColor: 'ring-accent-warm/20',
  },
  future: {
    label: 'Future',
    fullLabel: 'Future Vision',
    color: 'text-accent',
    bgColor: 'bg-accent/10',
    borderColor: 'border-accent/30',
    solidBg: 'bg-accent',
    ringColor: 'ring-accent/20',
  },
};

const statusConfig = {
  completed: {
    icon: Check,
    label: 'Completed',
    color: 'text-success',
    bgColor: 'bg-success',
    ringColor: 'ring-success/30',
  },
  'in-progress': {
    icon: Clock,
    label: 'In Progress',
    color: 'text-amber',
    bgColor: 'bg-amber',
    ringColor: 'ring-amber/30',
  },
  planned: {
    icon: Circle,
    label: 'Planned',
    color: 'text-muted-foreground',
    bgColor: 'bg-muted-foreground',
    ringColor: 'ring-muted-foreground/30',
  },
};

export function ProjectRoadmap({ roadmap, className }: ProjectRoadmapProps) {
  const [expandedMilestones, setExpandedMilestones] = React.useState<Set<string>>(new Set());

  if (!roadmap || roadmap.length === 0) {
    return null;
  }

  const toggleMilestone = (key: string) => {
    setExpandedMilestones(prev => {
      const next = new Set(prev);
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }
      return next;
    });
  };

  // Calculate progress stats
  let totalMilestones = 0;
  let completedMilestones = 0;
  let inProgressMilestones = 0;

  roadmap.forEach(phase => {
    if (phase.milestones) {
      phase.milestones.forEach(milestone => {
        totalMilestones++;
        if (milestone.status === 'completed') completedMilestones++;
        if (milestone.status === 'in-progress') inProgressMilestones++;
      });
    }
  });

  const progressPercentage = totalMilestones > 0
    ? Math.round((completedMilestones / totalMilestones) * 100)
    : 0;

  return (
    <div className={cn('relative', className)}>
      {/* Header with Progress */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-xl font-semibold mb-1">Project Roadmap</h3>
            <p className="text-sm text-muted-foreground">
              Development phases and milestones
            </p>
          </div>
          {totalMilestones > 0 && (
            <div className="text-right">
              <div className="text-2xl font-bold text-foreground">{progressPercentage}%</div>
              <div className="text-xs text-muted-foreground">
                {completedMilestones}/{totalMilestones} complete
              </div>
            </div>
          )}
        </div>

        {/* Progress Bar */}
        {totalMilestones > 0 && (
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-success transition-all duration-700 ease-out"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        )}
      </div>

      {/* Phase Flow - Horizontal on desktop, vertical on mobile */}
      <div className={cn(
        'grid grid-cols-1 gap-4 lg:gap-2',
        roadmap.length === 2 && 'lg:grid-cols-2',
        roadmap.length >= 3 && 'lg:grid-cols-3'
      )}>
        {roadmap.map((phase, phaseIndex) => {
          const config = phaseConfig[phase.phase] || phaseConfig.mvp;
          const isLastPhase = phaseIndex === roadmap.length - 1;
          const phaseCompleted = phase.status === 'completed';
          const phaseInProgress = phase.status === 'in-progress';

          return (
            <React.Fragment key={phase._key || phaseIndex}>
              {/* Phase Card */}
              <div className="relative">
                {/* Phase Header */}
                <div
                  className={cn(
                    'rounded-xl border-2 transition-all duration-300',
                    phaseCompleted ? 'border-success/50 bg-success/5' :
                    phaseInProgress ? 'border-accent-warm/50 bg-accent-warm/5' :
                    'border-border/50 bg-card/50',
                  )}
                >
                  {/* Phase Title Bar */}
                  <div
                    className={cn(
                      'flex items-center gap-3 p-4 rounded-t-xl border-b',
                      phaseCompleted ? 'border-success/20 bg-success/10' :
                      phaseInProgress ? 'border-amber/20 bg-amber/10' :
                      'border-border/50 bg-muted/30'
                    )}
                  >
                    {/* Phase Number */}
                    <div
                      className={cn(
                        'flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold text-white',
                        config.solidBg
                      )}
                    >
                      {phaseIndex + 1}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className={cn('font-semibold truncate', config.color)}>
                          {phase.title || config.fullLabel}
                        </h4>
                        <Badge
                          variant="outline"
                          className={cn('text-[10px] px-1.5 py-0', config.borderColor, config.color)}
                        >
                          {config.label}
                        </Badge>
                      </div>
                      {phase.description && (
                        <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
                          {phase.description}
                        </p>
                      )}
                    </div>

                    {/* Status indicator */}
                    {phase.status && (
                      <PhaseStatusBadge status={phase.status} />
                    )}
                  </div>

                  {/* Milestones */}
                  {phase.milestones && phase.milestones.length > 0 && (
                    <div className="p-3 space-y-2">
                      {phase.milestones.map((milestone, milestoneIndex) => {
                        const milestoneKey = milestone._key || `${phaseIndex}-${milestoneIndex}`;
                        const isExpanded = expandedMilestones.has(milestoneKey);
                        const hasDetails = Boolean(
                          (milestone.features && milestone.features.length > 0) ||
                          (milestone.techUsed && milestone.techUsed.length > 0)
                        );

                        return (
                          <MilestoneCard
                            key={milestoneKey}
                            milestone={milestone}
                            isExpanded={isExpanded}
                            hasDetails={hasDetails}
                            phaseColor={config.color}
                            onToggle={() => toggleMilestone(milestoneKey)}
                          />
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Arrow connector - Desktop only */}
                {!isLastPhase && (
                  <div className="hidden lg:flex absolute -right-2 top-1/2 -translate-y-1/2 z-10">
                    <div className={cn(
                      'w-4 h-4 rounded-full flex items-center justify-center',
                      phaseCompleted ? 'bg-success text-base' : 'bg-muted text-muted-foreground'
                    )}>
                      <ArrowRight className="w-3 h-3" />
                    </div>
                  </div>
                )}

                {/* Arrow connector - Mobile only */}
                {!isLastPhase && (
                  <div className="lg:hidden flex justify-center py-2">
                    <div className={cn(
                      'w-6 h-6 rounded-full flex items-center justify-center rotate-90',
                      phaseCompleted ? 'bg-success text-base' : 'bg-muted text-muted-foreground'
                    )}>
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>
                )}
              </div>
            </React.Fragment>
          );
        })}
      </div>

      {/* Legend */}
      <div className="mt-6 flex flex-wrap items-center justify-center gap-4 p-3 rounded-lg bg-muted/30 border border-border/50">
        {Object.entries(statusConfig).map(([status, config]) => {
          const Icon = config.icon;
          return (
            <div key={status} className="flex items-center gap-1.5 text-xs">
              <div className={cn('w-3.5 h-3.5 rounded-full flex items-center justify-center', config.bgColor)}>
                <Icon className="w-2 h-2 text-white" />
              </div>
              <span className="text-muted-foreground">{config.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function PhaseStatusBadge({ status }: { status: string }) {
  const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.planned;
  const Icon = config.icon;

  return (
    <div className={cn(
      'flex-shrink-0 flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium',
      config.bgColor,
      'text-white'
    )}>
      <Icon className="w-2.5 h-2.5" />
      <span className="hidden sm:inline">{config.label}</span>
    </div>
  );
}

interface MilestoneCardProps {
  milestone: RoadmapMilestone;
  isExpanded: boolean;
  hasDetails: boolean;
  phaseColor: string;
  onToggle: () => void;
}

function MilestoneCard({
  milestone,
  isExpanded,
  hasDetails,
  phaseColor,
  onToggle,
}: MilestoneCardProps) {
  const status = milestone.status || 'planned';
  const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.planned;
  const Icon = config.icon;

  return (
    <div
      className={cn(
        'rounded-lg border transition-all duration-200',
        status === 'completed' ? 'bg-success/5 border-success/20' :
        status === 'in-progress' ? 'bg-amber/5 border-amber/20' :
        'bg-background/50 border-border/50',
        hasDetails && 'cursor-pointer hover:shadow-sm hover:border-border'
      )}
      onClick={hasDetails ? onToggle : undefined}
    >
      {/* Milestone Header */}
      <div className="flex items-start gap-2.5 p-3">
        {/* Status Icon */}
        <div className={cn(
          'flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center mt-0.5 ring-2',
          config.bgColor,
          config.ringColor
        )}>
          <Icon className="w-3 h-3 text-white" />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <h5 className={cn(
              'text-sm font-medium truncate',
              status === 'completed' && 'line-through opacity-75'
            )}>
              {milestone.title}
            </h5>
            {hasDetails && (
              <button
                className="flex-shrink-0 text-muted-foreground hover:text-foreground transition-colors p-0.5"
                aria-label={isExpanded ? 'Collapse milestone details' : 'Expand milestone details'}
              >
                {isExpanded ? (
                  <ChevronDown className="w-4 h-4" />
                ) : (
                  <Plus className="w-4 h-4" />
                )}
              </button>
            )}
          </div>
          {milestone.description && (
            <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
              {milestone.description}
            </p>
          )}
        </div>
      </div>

      {/* Expanded Details */}
      {isExpanded && hasDetails && (
        <div className="px-3 pb-3 pt-0 space-y-3 border-t border-border/50 mt-1">
          {/* Features */}
          {milestone.features && milestone.features.length > 0 && (
            <div className="pt-2">
              <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider mb-1.5">
                Features
              </p>
              <div className="grid grid-cols-1 gap-1">
                {milestone.features.map((feature, i) => (
                  <div key={i} className="flex items-start gap-1.5 text-xs">
                    <span className={cn('mt-1', phaseColor)}>
                      {status === 'completed' ? (
                        <Check className="w-2.5 h-2.5" />
                      ) : (
                        <Circle className="w-2 h-2 fill-current" />
                      )}
                    </span>
                    <span className={status === 'completed' ? 'text-muted-foreground' : ''}>
                      {feature}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tech Used */}
          {milestone.techUsed && milestone.techUsed.length > 0 && (
            <div>
              <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider mb-1.5">
                Technologies
              </p>
              <div className="flex flex-wrap gap-1">
                {milestone.techUsed.map((tech) => (
                  <Badge key={tech._id} variant="secondary" className="text-[10px] px-1.5 py-0">
                    {tech.name}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
