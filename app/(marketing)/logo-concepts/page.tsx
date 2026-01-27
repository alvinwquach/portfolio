'use client';

import { useState } from 'react';
import { IoCodeSlash, IoClose } from 'react-icons/io5';
import { GiBridge } from 'react-icons/gi';
import { FaBasketballBall, FaFootballBall, FaCompactDisc } from 'react-icons/fa';
import { cn } from '@/lib/utils';
import { logoConcepts, categories, type Category, type LogoConcept } from './logoConceptsData';

export default function LogoConceptsPage() {
  const [activeCategory, setActiveCategory] = useState<Category>('all');
  const [selectedLogo, setSelectedLogo] = useState<LogoConcept | null>(null);

  const filteredConcepts = activeCategory === 'all'
    ? logoConcepts
    : logoConcepts.filter((c) => c.categories.includes(activeCategory));

  return (
    <main className="min-h-screen bg-background">
      <HeroHeader />
      <FilterTabs activeCategory={activeCategory} onCategoryChange={setActiveCategory} />
      <LogoGallery concepts={filteredConcepts} onSelect={setSelectedLogo} />
      {selectedLogo && (
        <LogoModal logo={selectedLogo} onClose={() => setSelectedLogo(null)} />
      )}
    </main>
  );
}

function HeroHeader() {
  return (
    <div className="border-b border-border/50 bg-gradient-to-b from-muted/30 to-background">
      <div className="container max-w-6xl py-12 md:py-16">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-center">Logo Concepts</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto text-center text-lg mb-8">
          {logoConcepts.length} unique vibes, one identity. Each logo represents Bay Area pride,
          sports fandom, DJ culture, and code - styled differently.
        </p>
        <BrandElementsStrip />
      </div>
    </div>
  );
}

function BrandElementsStrip() {
  const elements = [
    { icon: FaBasketballBall, label: 'Warriors', bgClass: 'bg-[#1D428A]/20', iconClass: 'text-[#FDB927]' },
    { icon: FaFootballBall, label: '49ers', bgClass: 'bg-[#AA0000]/20', iconClass: 'text-[#B3995D]' },
    { icon: GiBridge, label: 'Bridge', bgClass: 'bg-muted', iconClass: 'text-amber' },
    { icon: FaCompactDisc, label: 'DJ', bgClass: 'bg-muted', iconClass: 'text-foreground' },
    { icon: IoCodeSlash, label: 'Code', bgClass: 'bg-muted', iconClass: 'text-cyan' },
  ];

  return (
    <div className="flex justify-center gap-6 md:gap-10">
      {elements.map(({ icon: Icon, label, bgClass, iconClass }) => (
        <div key={label} className="flex flex-col items-center gap-1">
          <div className={cn('w-10 h-10 rounded-full flex items-center justify-center', bgClass)}>
            <Icon className={cn('w-5 h-5', iconClass)} />
          </div>
          <span className="text-xs text-muted-foreground">{label}</span>
        </div>
      ))}
    </div>
  );
}

function FilterTabs({
  activeCategory,
  onCategoryChange
}: {
  activeCategory: Category;
  onCategoryChange: (cat: Category) => void;
}) {
  return (
    <div className="sticky top-0 z-20 bg-background/80 backdrop-blur-md border-b border-border/50">
      <div className="container max-w-6xl">
        <div className="flex gap-1 py-3 overflow-x-auto scrollbar-hide">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => onCategoryChange(cat.id)}
              className={cn(
                'px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all',
                activeCategory === cat.id
                  ? 'bg-amber text-black'
                  : 'bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground'
              )}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function LogoGallery({
  concepts,
  onSelect
}: {
  concepts: LogoConcept[];
  onSelect: (logo: LogoConcept) => void;
}) {
  return (
    <div className="container max-w-6xl py-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {concepts.map((concept, index) => (
          <LogoCard
            key={concept.id}
            concept={concept}
            index={index}
            onSelect={onSelect}
          />
        ))}
      </div>
    </div>
  );
}

function LogoCard({
  concept,
  index,
  onSelect
}: {
  concept: LogoConcept;
  index: number;
  onSelect: (logo: LogoConcept) => void;
}) {
  return (
    <button
      onClick={() => onSelect(concept)}
      className="group text-left"
      style={{ animationDelay: `${index * 50}ms` }}
    >
      <div className="relative overflow-hidden rounded-xl bg-[#0d1117] border border-border/50 transition-all duration-300 group-hover:border-amber/50 group-hover:shadow-xl group-hover:shadow-amber/10 group-hover:-translate-y-1">
        <div className="aspect-square flex items-center justify-center p-8">
          <concept.Component size={160} />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
          <h3 className="text-lg font-semibold text-white">{concept.title}</h3>
          <p className="text-sm text-white/70">{concept.subtitle}</p>
        </div>
      </div>
      <div className="mt-3 flex flex-wrap gap-1.5">
        {concept.tags.map((tag) => (
          <span
            key={tag}
            className="text-xs px-2 py-0.5 rounded-full bg-muted/50 text-muted-foreground"
          >
            {tag}
          </span>
        ))}
      </div>
    </button>
  );
}

function LogoModal({
  logo,
  onClose
}: {
  logo: LogoConcept;
  onClose: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-4xl bg-card border border-border rounded-2xl overflow-hidden shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-black/50 flex items-center justify-center hover:bg-black/70 transition-colors"
        >
          <IoClose className="w-6 h-6 text-white" />
        </button>

        <div className="grid md:grid-cols-2">
          <div className="flex items-center justify-center p-12 bg-[#0d1117] min-h-[300px] md:min-h-[450px]">
            <logo.Component size={240} />
          </div>

          <div className="p-8 flex flex-col justify-center">
            <h2 className="text-3xl font-bold mb-2">{logo.title}</h2>
            <p className="text-lg text-muted-foreground mb-4">{logo.subtitle}</p>
            <p className="text-muted-foreground mb-6 leading-relaxed">{logo.description}</p>

            <div className="flex flex-wrap gap-2 mb-6">
              {logo.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-sm px-3 py-1 rounded-full bg-amber/10 text-amber border border-amber/20"
                >
                  {tag}
                </span>
              ))}
            </div>

            <SizePreview Component={logo.Component} />
            <BackgroundTest Component={logo.Component} />
          </div>
        </div>
      </div>
    </div>
  );
}

function SizePreview({ Component }: { Component: LogoConcept['Component'] }) {
  const sizes = [24, 32, 48, 64, 96];

  return (
    <div className="pt-6 border-t border-border/50">
      <div className="text-sm text-muted-foreground mb-4">Size Variants</div>
      <div className="flex items-end gap-6">
        {sizes.map((size) => (
          <div key={size} className="text-center">
            <Component size={size} />
            <div className="text-xs text-muted-foreground mt-2">{size}px</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function BackgroundTest({ Component }: { Component: LogoConcept['Component'] }) {
  const backgrounds = [
    { bg: 'bg-[#0d1117] border-[#30363D]', label: 'Dark' },
    { bg: 'bg-white border-gray-200', label: 'Light' },
    { bg: 'bg-gradient-to-br from-[#1D428A] to-[#AA0000]', label: 'Gradient' },
  ];

  return (
    <div className="mt-6 pt-6 border-t border-border/50">
      <div className="text-sm text-muted-foreground mb-4">Background Test</div>
      <div className="grid grid-cols-3 gap-3">
        {backgrounds.map(({ bg, label }) => (
          <div key={label} className={cn('p-3 rounded-lg border flex justify-center', bg)}>
            <Component size={48} />
          </div>
        ))}
      </div>
    </div>
  );
}
