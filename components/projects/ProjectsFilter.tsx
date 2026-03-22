/**
 * Projects Filter Component
 * =========================
 * Client-side filter for projects by tech stack category or search term.
 * Designed for recruiters: fast, scannable, no learning curve.
 */

'use client';

import * as React from 'react';
import { Search, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ProjectsFilterProps {
  categories: string[];
  selectedCategory: string | null;
  onCategoryChange: (category: string | null) => void;
  searchTerm: string;
  onSearchChange: (term: string) => void;
}

// Category display names and colors — MODIFIED(feat/design-system): Late Night Session palette
const CATEGORY_CONFIG: Record<string, { label: string; color: string }> = {
  frontend: { label: 'Frontend', color: 'bg-info/10 text-info border-info/20 hover:bg-info/20' },
  backend: { label: 'Backend', color: 'bg-accent/10 text-accent border-accent/20 hover:bg-accent/20' },
  databases: { label: 'Databases', color: 'bg-accent-warm/10 text-accent-warm border-accent-warm/20 hover:bg-accent-warm/20' },
  'data-ml': { label: 'Data & ML', color: 'bg-error/10 text-error border-error/20 hover:bg-error/20' },
  testing: { label: 'Testing', color: 'bg-success/10 text-success border-success/20 hover:bg-success/20' },
  'project-tools': { label: 'DevOps', color: 'bg-warning/10 text-warning border-warning/20 hover:bg-warning/20' },
};

export function ProjectsFilter({
  categories,
  selectedCategory,
  onCategoryChange,
  searchTerm,
  onSearchChange,
}: ProjectsFilterProps) {
  const inputRef = React.useRef<HTMLInputElement>(null);

  const clearFilters = () => {
    onCategoryChange(null);
    onSearchChange('');
    inputRef.current?.focus();
  };

  const hasFilters = selectedCategory || searchTerm;

  return (
    <div className="mb-8 space-y-4">
      {/* Search Bar */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          ref={inputRef}
          type="text"
          placeholder="Search projects or technologies..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10 pr-10"
        />
        {searchTerm && (
          <button
            onClick={() => onSearchChange('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-secondary rounded"
          >
            <X className="h-3 w-3 text-muted-foreground" />
          </button>
        )}
      </div>

      {/* Category Filters */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-sm text-muted-foreground mr-2">Filter by:</span>
        <Badge
          variant={selectedCategory === null ? 'default' : 'outline'}
          className={cn(
            'cursor-pointer transition-colors',
            selectedCategory === null && 'bg-cyan text-white'
          )}
          onClick={() => onCategoryChange(null)}
        >
          All
        </Badge>
        {categories.map((category) => {
          const config = CATEGORY_CONFIG[category] || {
            label: category.charAt(0).toUpperCase() + category.slice(1),
            color: 'bg-muted text-muted-foreground border-border hover:bg-muted/80',
          };
          const isSelected = selectedCategory === category;

          return (
            <Badge
              key={category}
              variant="outline"
              className={cn(
                'cursor-pointer transition-colors',
                isSelected ? `${config.color} ring-2 ring-offset-2 ring-offset-background` : config.color
              )}
              onClick={() => onCategoryChange(isSelected ? null : category)}
            >
              {config.label}
            </Badge>
          );
        })}

        {/* Clear All */}
        {hasFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="text-xs text-muted-foreground hover:text-foreground ml-2"
          >
            <X className="h-3 w-3 mr-1" />
            Clear
          </Button>
        )}
      </div>
    </div>
  );
}
