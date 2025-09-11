"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/blogs", label: "Blogs" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="bg-[#0f172a]/90 sticky top-0 z-50 backdrop-blur-sm border-b border-blue-700/50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <span className="text-lg font-semibold text-blue-400">alvinquach</span>
        <nav className="hidden md:flex gap-8 text-blue-400 font-semibold">
          {navLinks.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="hover:underline transition-colors"
            >
              {label}
            </Link>
          ))}
        </nav>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden text-blue-400 focus:outline-none"
          aria-label="Toggle menu"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
      {isOpen && (
        <nav className="md:hidden px-6 pb-4 flex flex-col gap-4 text-blue-400 font-semibold bg-[#0f172a]/95 border-t border-blue-700/50">
          {navLinks.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="hover:underline transition-colors"
              onClick={() => setIsOpen(false)}
            >
              {label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
