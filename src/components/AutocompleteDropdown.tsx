'use client';

import React from 'react';
import { useHits } from 'react-instantsearch';
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
  { label: 'Activewear > Jackets', query: 'jacket' },
  { label: 'Bags > Leather', query: 'leather bag' },
];

export const AutocompleteDropdown: React.FC<AutocompleteDropdownProps> = ({
  isOpen,
  onSelectQuery,
  onSelectProduct,
}) => {
  const { items } = useHits<ProductRecord>();

  if (!isOpen) return null;

  const topProducts = items.slice(0, 3);

  return (
    <div className="absolute top-full left-0 right-0 mt-2.5 z-50 bg-[#FFFFFF] rounded-2xl border border-[#E5E2DC] shadow-xl overflow-hidden select-none animate-in fade-in duration-150">
      <div className="grid grid-cols-1 md:grid-cols-12">
        {/* Left Column: Trending Searches & Popular Categories */}
        <div className="md:col-span-5 p-6 border-b md:border-b-0 md:border-r border-[#E5E2DC]/80 space-y-6">
          <div>
            <h4 className="text-[12px] font-bold uppercase tracking-wider text-[#0F5C4C] mb-3">
              Trending Searches
            </h4>
            <div className="space-y-2.5">
              {TRENDING_SEARCHES.map((term) => (
                <button
                  key={term}
                  type="button"
                  onClick={() => onSelectQuery(term)}
                  className="block text-[14px] text-[#14181F] hover:text-[#0F5C4C] transition-colors text-left cursor-pointer"
                >
                  {term}
                </button>
              ))}
            </div>
          </div>

          <div className="border-t border-[#E5E2DC]/80 pt-5">
            <h4 className="text-[12px] font-bold uppercase tracking-wider text-[#0F5C4C] mb-3">
              Popular Categories
            </h4>
            <div className="space-y-2.5">
              {POPULAR_CATEGORIES.map((cat) => (
                <button
                  key={cat.label}
                  type="button"
                  onClick={() => onSelectQuery(cat.query)}
                  className="block text-[14px] text-[#14181F] hover:text-[#0F5C4C] transition-colors text-left cursor-pointer"
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Live Matching Products from Algolia */}
        <div className="md:col-span-7 p-6">
          <h4 className="text-[12px] font-bold uppercase tracking-wider text-[#14181F] mb-4">
            Matching Products
          </h4>

          {topProducts.length === 0 ? (
            <div className="py-8 text-center text-[13px] text-[#5C626D]">
              No matching products found.
            </div>
          ) : (
            <div className="space-y-3.5">
              {topProducts.map((p) => (
                <div
                  key={p.objectID}
                  onClick={() => onSelectProduct(p)}
                  className="flex items-center justify-between p-2 rounded-xl hover:bg-[#FAF8F5] transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div className="w-14 h-14 rounded-xl bg-[#F4F2EE] p-2 flex items-center justify-center shrink-0">
                      <img
                        src={p.image}
                        alt={p.title}
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[14px] font-semibold text-[#14181F] truncate">
                        {p.title}
                      </p>
                      <p className="text-[12px] text-[#5C626D] mt-0.5">
                        {p.category} •{' '}
                        <span className="font-semibold text-[#14181F]">${p.price}</span>
                      </p>
                    </div>
                  </div>

                  {/* Stock status pill */}
                  {!p.in_stock || p.stock_count === 0 ? (
                    <span className="shrink-0 ml-3 px-2.5 py-1 rounded-md text-[11px] font-medium bg-[#EFECE6] text-[#7A7F87]">
                      Out of Stock
                    </span>
                  ) : p.stock_count <= 5 ? (
                    <span className="shrink-0 ml-3 px-2.5 py-1 rounded-md text-[11px] font-medium bg-[#FBECE6] text-[#D96B43]">
                      Low Stock ({p.stock_count} left)
                    </span>
                  ) : (
                    <span className="shrink-0 ml-3 px-2.5 py-1 rounded-md text-[11px] font-medium bg-[#E6F2EF] text-[#0F5C4C]">
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
