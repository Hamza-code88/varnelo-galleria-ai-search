'use client';

import React, { useRef, useState } from 'react';
import { useSearchBox, useInstantSearch } from 'react-instantsearch';
import { Search, ShoppingBag, User, X } from './icons';
import { AutocompleteDropdown } from './AutocompleteDropdown';
import { ProductRecord } from '@/types/product';

interface NavbarProps {
  merchantMode: boolean;
  onToggleMerchantMode: () => void;
  bagCount: number;
  onOpenBag?: () => void;
  onSelectProduct: (p: ProductRecord) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  merchantMode,
  onToggleMerchantMode,
  bagCount,
  onOpenBag,
  onSelectProduct,
}) => {
  const { query, refine } = useSearchBox();
  const { results } = useInstantSearch();
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const latencyMs = results?.processingTimeMS ?? 14;
  const lowerQuery = (query || '').toLowerCase();
  const isTypoOrSynonym =
    lowerQuery.includes('nikey') ||
    lowerQuery.includes('shooes') ||
    lowerQuery.includes('runing') ||
    lowerQuery.includes('kicks');

  const handleSelectQuery = (q: string) => {
    refine(q);
    setIsSearchFocused(false);
  };

  const handleSelectProduct = (p: ProductRecord) => {
    onSelectProduct(p);
    setIsSearchFocused(false);
  };

  return (
    <header className="w-full bg-[#FAF8F5] pt-6 pb-4 select-none">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-8 flex items-center justify-between gap-4">
        {/* Left: VARNELO GALLERIA Wordmark */}
        <div className="shrink-0">
          <a
            href="/"
            className="font-playfair text-lg sm:text-xl tracking-[0.20em] text-[#14181F] font-bold uppercase hover:opacity-85 transition-opacity"
          >
            VARNELO GALLERIA
          </a>
        </div>

        {/* Center: Search Input Pill */}
        <div
          ref={containerRef}
          className="relative flex-1 max-w-xl mx-auto"
          onBlur={(e) => {
            if (!containerRef.current?.contains(e.relatedTarget as Node)) {
              setIsSearchFocused(false);
            }
          }}
        >
          <div className="relative flex items-center">
            <Search className="absolute left-4 w-4 h-4 text-[#7A7F87] pointer-events-none" />
            <input
              type="text"
              value={query}
              onChange={(e) => refine(e.target.value)}
              onFocus={() => setIsSearchFocused(true)}
              placeholder="Search kicks, wool trench, nikey runing shooes..."
              className="w-full h-10 pl-10 pr-64 bg-white text-[#14181F] text-[13px] rounded-full border border-[#E5E2DC] focus:outline-none focus:border-[#0F5C4C] transition-all shadow-2xs"
            />

            {/* Clear Button */}
            {query && (
              <button
                type="button"
                onClick={() => refine('')}
                className="absolute right-56 p-1 text-[#7A7F87] hover:text-[#14181F]"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}

            {/* Real-time Algolia Latency & Typo Corrected Pill */}
            <div className="absolute right-1.5 flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-normal bg-[#0F5C4C] text-white pointer-events-none">
              <span>{latencyMs}ms</span>
              <span className="opacity-75">•</span>
              <span>
                {isTypoOrSynonym
                  ? 'Typo Corrected → Nike Running Shoes'
                  : 'Instant Search'}
              </span>
            </div>
          </div>

          {/* Screen #2: Live Autocomplete Dropdown */}
          <AutocompleteDropdown
            isOpen={isSearchFocused}
            onSelectQuery={handleSelectQuery}
            onSelectProduct={handleSelectProduct}
          />
        </div>

        {/* Right Actions: Merchant Mode Switch + Bag + User */}
        <div className="flex items-center gap-5 shrink-0">
          {/* Merchant Mode Toggle */}
          <div className="flex items-center gap-2.5">
            <span className="text-[13px] text-[#14181F] font-normal">Merchant Mode</span>
            <button
              type="button"
              role="switch"
              aria-checked={merchantMode}
              onClick={onToggleMerchantMode}
              className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${merchantMode ? 'bg-[#0F5C4C]' : 'bg-[#D1CCC4]'
                }`}
            >
              <span
                className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition duration-200 ease-in-out ${merchantMode ? 'translate-x-4' : 'translate-x-0'
                  }`}
              />
            </button>
          </div>

          {/* Cart Icon */}
          <button
            type="button"
            onClick={onOpenBag}
            className="relative p-1 text-[#14181F] hover:text-[#0F5C4C] transition-colors cursor-pointer"
            aria-label="Cart"
          >
            <ShoppingBag className="w-5 h-5 stroke-[1.5]" />
            {bagCount > 0 && (
              <span className="absolute -top-1 -right-1 flex items-center justify-center min-w-4 h-4 px-1 rounded-full text-[10px] font-bold bg-[#0F5C4C] text-white">
                {bagCount}
              </span>
            )}
          </button>

          {/* User Icon */}
          <button
            type="button"
            className="p-1 text-[#14181F] hover:text-[#0F5C4C] transition-colors cursor-pointer"
            aria-label="User profile"
          >
            <User className="w-5 h-5 stroke-[1.5]" />
          </button>
        </div>
      </div>
    </header>
  );
};
