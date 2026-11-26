'use client';

import React from 'react';
import { useHits, useSearchBox } from 'react-instantsearch';
import { ProductRecord } from '@/types/product';

interface AutocompleteDropdownProps {
  isOpen: boolean;
  onSelectQuery: (query: string) => void;
  onSelectProduct: (product: ProductRecord) => void;
}

const TRENDING_SEARCHES = [
  'nike running shoes',
  'air max 90',
  'wool jackets',
  'kicks under 150',
];

const POPULAR_CATEGORIES = [
  { label: 'Footwear > Running', query: 'running' },
  { label: 'Outerwear > Jackets', query: 'jacket' },
  { label: 'Bags > Leather', query: 'leather' },
];

export const AutocompleteDropdown: React.FC<AutocompleteDropdownProps> = ({
  isOpen,
  onSelectQuery,
  onSelectProduct,
}) => {
  const { items } = useHits<ProductRecord>();
  const { query } = useSearchBox();

  if (!isOpen) return null;

  const topProducts = items.slice(0, 5);

  return (
    <div className="absolute top-full left-0 right-0 mt-2 z-50 bg-[#FFFFFF] rounded-2xl border border-[#E5E2DC] shadow-xl overflow-hidden select-none animate-in fade-in duration-150">
      <div className="grid grid-cols-1 md:grid-cols-12">
        {/* Left Column: Compact Trending Searches & Categories */}
        <div className="md:col-span-4 p-4 bg-[#FAF9F7] border-b md:border-b-0 md:border-r border-[#E5E2DC]/80 space-y-4">
          <div>
            <h4 className="text-[10px] font-bold uppercase tracking-wider text-[#0F5C4C] mb-2">
              Trending
            </h4>
            <div className="flex flex-col gap-1.5">
              {TRENDING_SEARCHES.map((term) => (
                <button
                  key={term}
                  type="button"
                  onMouseDown={(e) => {
                    e.preventDefault();
                    onSelectQuery(term);
                  }}
                  className="text-[12px] text-[#14181F] hover:text-[#0F5C4C] hover:underline transition-colors text-left cursor-pointer truncate"
                >
                  {term}
                </button>
              ))}
            </div>
          </div>

          <div className="border-t border-[#E5E2DC]/80 pt-3">
            <h4 className="text-[10px] font-bold uppercase tracking-wider text-[#0F5C4C] mb-2">
              Categories
            </h4>
            <div className="flex flex-col gap-1.5">
              {POPULAR_CATEGORIES.map((cat) => (
                <button
                  key={cat.label}
                  type="button"
                  onMouseDown={(e) => {
                    e.preventDefault();
                    onSelectQuery(cat.query);
                  }}
                  className="text-[12px] text-[#5C626D] hover:text-[#0F5C4C] transition-colors text-left cursor-pointer truncate"
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Main Focus — Live Matching Products */}
        <div className="md:col-span-8 p-4">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-[11px] font-bold uppercase tracking-wider text-[#14181F]">
              Matching Products
              {query ? (
                <span className="ml-1.5 font-normal normal-case text-[#0F5C4C]">
                  for &ldquo;{query}&rdquo;
                </span>
              ) : null}
            </h4>
            <span className="text-[11px] font-mono text-[#5C626D]">
              {items.length} found
            </span>
          </div>

          {topProducts.length === 0 ? (
            <div className="py-8 text-center text-[13px] text-[#5C626D]">
              No matching products found for &ldquo;{query}&rdquo;.
            </div>
          ) : (
            <div className="space-y-2 max-h-[320px] overflow-y-auto pr-1">
              {topProducts.map((p) => (
                <div
                  key={p.objectID}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    onSelectProduct(p);
                  }}
                  className="flex items-center justify-between p-2 rounded-xl border border-transparent hover:border-[#E5E2DC] hover:bg-[#FAF8F5] transition-all cursor-pointer group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-12 h-12 rounded-lg bg-[#F4F2EE] p-1.5 flex items-center justify-center shrink-0">
                      <img
                        src={p.image}
                        alt={p.title}
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[13px] font-semibold text-[#14181F] truncate group-hover:text-[#0F5C4C] transition-colors">
                        {p.title}
                      </p>
                      <p className="text-[11px] text-[#5C626D] mt-0.5">
                        {p.brand} • {p.category} •{' '}
                        <span className="font-semibold text-[#14181F]">${p.price}</span>
                      </p>
                    </div>
                  </div>

                  {/* Stock status pill */}
                  {!p.in_stock || p.stock_count === 0 ? (
                    <span className="shrink-0 ml-2 px-2 py-0.5 rounded-md text-[10px] font-medium bg-[#EFECE6] text-[#7A7F87]">
                      Out of Stock
                    </span>
                  ) : p.stock_count <= 5 ? (
                    <span className="shrink-0 ml-2 px-2 py-0.5 rounded-md text-[10px] font-medium bg-[#FBECE6] text-[#D96B43]">
                      Low Stock ({p.stock_count} left)
                    </span>
                  ) : (
                    <span className="shrink-0 ml-2 px-2 py-0.5 rounded-md text-[10px] font-medium bg-[#E6F2EF] text-[#0F5C4C]">
                      In Stock ({p.stock_count} left)
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
