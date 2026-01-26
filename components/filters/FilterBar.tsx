/**
 * FilterBar Component
 * ===================
 * Reusable filter component for Projects and Blog pages.
 * Features: search input, horizontal tabs, optional tag pills.
 */

'use client';

import * as React from 'react';
import { Search, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export interface Tab {
  id: string;
  label: string;
  icon?: React.ComponentType<{ className?: string }>;
  count?: number;
}

export interface Tag {
  id: string;
  name: string;
  color?: string;
}

interface FilterBarProps {
  searchPlaceholder?: string;
  searchValue: string;
  onSearchChange: (value: string) => void;
  tabs: Tab[];
  activeTab: string;
  onTabChange: (id: string) => void;
  tags?: Tag[];
  activeTags?: string[];
  onTagToggle?: (id: string) => void;
  className?: string;
}

export function FilterBar({
  searchPlaceholder = 'Search...',
  searchValue,
  onSearchChange,
  tabs,
  activeTab,
  onTabChange,
  tags,
  activeTags = [],
  onTagToggle,
  className,
}: FilterBarProps) {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const hasFilters = searchValue || activeTab !== 'all' || activeTags.length > 0;

  const clearAll = () => {
    onSearchChange('');
    onTabChange('all');
    if (onTagToggle) {
      activeTags.forEach((tag) => onTagToggle(tag));
    }
    inputRef.current?.focus();
  };

  return (
    <div className={cn('space-y-4 mb-8', className)}>
      {/* Search Bar */}
      <div className="relative w-full max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          ref={inputRef}
          type="text"
          placeholder={searchPlaceholder}
          value={searchValue}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10 pr-10"
        />
        {searchValue && (
          <button
            onClick={() => onSearchChange('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-secondary rounded transition-colors"
            aria-label="Clear search"
          >
            <X className="h-3 w-3 text-muted-foreground" />
          </button>
        )}
      </div>

      {/* Horizontal Tabs */}
      <div className="flex flex-wrap items-center gap-2">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          const Icon = tab.icon;

          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={cn(
                'inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200',
                isActive
                  ? 'bg-cyan text-white shadow-sm'
                  : 'bg-secondary/50 text-muted-foreground hover:bg-secondary hover:text-foreground'
              )}
            >
              {Icon && <Icon className="h-3.5 w-3.5" />}
              {tab.label}
              {tab.count !== undefined && (
                <span
                  className={cn(
                    'ml-1 text-xs',
                    isActive ? 'text-white/80' : 'text-muted-foreground/70'
                  )}
                >
                  ({tab.count})
                </span>
              )}
            </button>
          );
        })}

        {/* Clear All */}
        {hasFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearAll}
            className="text-xs text-muted-foreground hover:text-foreground ml-2"
          >
            <X className="h-3 w-3 mr-1" />
            Clear all
          </Button>
        )}
      </div>

      {/* Tag Pills (optional) */}
      {tags && tags.length > 0 && onTagToggle && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm text-muted-foreground mr-1">Tags:</span>
          {tags.map((tag) => {
            const isActive = activeTags.includes(tag.id);

            return (
              <Badge
                key={tag.id}
                variant="outline"
                onClick={() => onTagToggle(tag.id)}
                className={cn(
                  'cursor-pointer transition-all duration-200',
                  isActive
                    ? 'ring-2 ring-offset-2 ring-offset-background'
                    : 'hover:bg-secondary/50'
                )}
                style={
                  tag.color
                    ? {
                        borderColor: tag.color,
                        color: isActive ? undefined : tag.color,
                        ...(isActive && { ringColor: tag.color }),
                      }
                    : undefined
                }
              >
                {tag.name}
                {isActive && (
                  <X className="h-3 w-3 ml-1" />
                )}
              </Badge>
            );
          })}
        </div>
      )}
    </div>
  );
}
