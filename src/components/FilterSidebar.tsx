'use client';

import React, { useState } from 'react';
import {
  useRefinementList,
  useRange,
  useToggleRefinement,
} from 'react-instantsearch';

const COLOR_HEX_MAP: Record<string, string> = {
  'Obsidian Black': '#14181F',
  'Forest Emerald': '#0F5C4C',
  Terracotta: '#D96B43',
  Sandstone: '#D8CBB8',
  'Midnight Navy': '#1E2D4A',
  'Natural White': '#F3F1EC',
  Charcoal: '#2B2E35',
  'Rich grain brown': '#8B4513',
  'Natural tan': '#C29B70',
};

const DEFAULT_BRANDS = ['Varnelo Galleria', 'Nike', 'Adidas', 'New Balance', 'Puma'];
const DEFAULT_COLORS = [
  'Obsidian Black',
  'Forest Emerald',
  'Terracotta',
  'Sandstone',
  'Midnight Navy',
];
const DEFAULT_SIZES = ['8', '9', '10', '11'];

export const FilterSidebar: React.FC = () => {
  const [openSections, setOpenSections] = useState({
    brand: true,
    color: true,
    size: true,
    price: true,
  });

  const { items: brandItems, refine: refineBrand } = useRefinementList({
    attribute: 'brand',
    limit: 10,
  });

  const { items: colorItems, refine: refineColor } = useRefinementList({
    attribute: 'color',
    limit: 10,
  });

  const { items: sizeItems, refine: refineSize } = useRefinementList({
    attribute: 'sizes',
    limit: 10,
  });

  const { start, range, refine: refinePrice } = useRange({
    attribute: 'price',
    min: 50,
    max: 1000,
  });

  const { value: inStockValue, refine: refineInStock } = useToggleRefinement({
    attribute: 'in_stock',
    on: true,
  });

  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const minBound = range.min ?? 50;
  const maxBound = range.max ?? 1000;
  const currentMax =
    start[1] !== undefined && Number.isFinite(start[1]) ? start[1] : maxBound;

  // Merge live facet items with default list so UI always renders cleanly
  const brandMap = new Map(brandItems.map((i) => [i.value, i]));
  const colorMap = new Map(colorItems.map((i) => [i.value, i]));
  const sizeMap = new Map(sizeItems.map((i) => [i.value, i]));

  return (
    <aside className="w-full lg:w-60 shrink-0 space-y-6 select-none">
      {/* Brand Section */}
      <div className="pb-5 border-b border-[#E5E2DC]/80">
        <button
          type="button"
          onClick={() => toggleSection('brand')}
          className="w-full flex items-center justify-between text-[14px] font-medium text-[#14181F] mb-3.5 cursor-pointer"
        >
          <span>Brand</span>
          <span className="text-[12px] text-[#5C626D] font-mono">
            {openSections.brand ? '⌃' : '⌄'}
          </span>
        </button>

        {openSections.brand && (
          <div className="space-y-2.5">
            {DEFAULT_BRANDS.map((brand) => {
              const facetItem = brandMap.get(brand);
              const isChecked = facetItem?.isRefined ?? false;
              const count = facetItem?.count ?? 0;

              return (
                <label
                  key={brand}
                  onClick={() => refineBrand(brand)}
                  className="flex items-center justify-between text-[13px] text-[#14181F] hover:text-[#0F5C4C] cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-4 h-4 rounded-[4px] border flex items-center justify-center transition-all ${
                        isChecked
                          ? 'bg-[#0F5C4C] border-[#0F5C4C] text-white'
                          : 'border-[#C8C4BC] bg-white'
                      }`}
                    >
                      {isChecked && (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="3.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="w-2.5 h-2.5"
                        >
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      )}
                    </div>
                    <span>{brand}</span>
                  </div>
                  {count > 0 && (
                    <span className="text-[11px] font-mono text-[#7A7F87]">{count}</span>
                  )}
                </label>
              );
            })}
          </div>
        )}
      </div>

      {/* Color Section */}
      <div className="pb-5 border-b border-[#E5E2DC]/80">
        <button
          type="button"
          onClick={() => toggleSection('color')}
          className="w-full flex items-center justify-between text-[14px] font-medium text-[#14181F] mb-3.5 cursor-pointer"
        >
          <span>Color</span>
          <span className="text-[12px] text-[#5C626D] font-mono">
            {openSections.color ? '⌃' : '⌄'}
          </span>
        </button>

        {openSections.color && (
          <div className="flex items-center gap-2.5 flex-wrap">
            {DEFAULT_COLORS.map((colorName) => {
              const facetItem = colorMap.get(colorName);
              const isSelected = facetItem?.isRefined ?? false;
              const hex = COLOR_HEX_MAP[colorName] || '#14181F';

              return (
                <button
                  key={colorName}
                  type="button"
                  onClick={() => refineColor(colorName)}
                  title={`${colorName}${facetItem ? ` (${facetItem.count})` : ''}`}
                  className={`w-6 h-6 rounded-full border transition-all cursor-pointer ${
                    isSelected
                      ? 'ring-2 ring-offset-2 ring-[#0F5C4C] scale-105 border-transparent'
                      : 'border-[#C8C4BC] hover:scale-105'
                  }`}
                  style={{ backgroundColor: hex }}
                  aria-label={colorName}
                />
              );
            })}
          </div>
        )}
      </div>

      {/* Size Section */}
      <div className="pb-5 border-b border-[#E5E2DC]/80">
        <button
          type="button"
          onClick={() => toggleSection('size')}
          className="w-full flex items-center justify-between text-[14px] font-medium text-[#14181F] mb-3.5 cursor-pointer"
        >
          <span>Size</span>
          <span className="text-[12px] text-[#5C626D] font-mono">
            {openSections.size ? '⌃' : '⌄'}
          </span>
        </button>

        {openSections.size && (
          <div className="grid grid-cols-4 gap-2">
            {DEFAULT_SIZES.map((size) => {
              const facetItem = sizeMap.get(size);
              const isSelected = facetItem?.isRefined ?? false;

              return (
                <button
                  key={size}
                  type="button"
                  onClick={() => refineSize(size)}
                  className={`h-9 rounded-lg border text-[13px] font-normal transition-all flex items-center justify-center cursor-pointer ${
                    isSelected
                      ? 'bg-[#0F5C4C] text-white border-[#0F5C4C]'
                      : 'bg-white text-[#14181F] border-[#E5E2DC] hover:border-[#14181F]'
                  }`}
                >
                  {size}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Price Range Section */}
      <div className="pb-5 border-b border-[#E5E2DC]/80">
        <button
          type="button"
          onClick={() => toggleSection('price')}
          className="w-full flex items-center justify-between text-[14px] font-medium text-[#14181F] mb-3.5 cursor-pointer"
        >
          <span>Price Range</span>
          <span className="text-[12px] text-[#5C626D] font-mono">
            {openSections.price ? '⌃' : '⌄'}
          </span>
        </button>

        {openSections.price && (
          <div className="space-y-3">
            <div className="relative pt-2 pb-1">
              <input
                type="range"
                min={minBound}
                max={maxBound}
                step={10}
                value={currentMax}
                onChange={(e) => refinePrice([minBound, Number(e.target.value)])}
                className="w-full h-1.5 bg-[#0F5C4C] rounded-lg appearance-none cursor-pointer accent-[#0F5C4C]"
              />
            </div>
            <div className="flex items-center justify-between text-[12px] text-[#5C626D]">
              <span>${minBound}</span>
              <span>${currentMax}</span>
            </div>
          </div>
        )}
      </div>

      {/* Show In Stock Only Toggle */}
      <div className="flex items-center justify-between pt-1">
        <span className="text-[13px] font-medium text-[#14181F]">
          Show In Stock Only
        </span>
        <button
          type="button"
          role="switch"
          aria-checked={inStockValue.isRefined}
          onClick={() => refineInStock({ isRefined: inStockValue.isRefined })}
          className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
            inStockValue.isRefined ? 'bg-[#0F5C4C]' : 'bg-[#D1CCC4]'
          }`}
        >
          <span
            className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition duration-200 ease-in-out ${
              inStockValue.isRefined ? 'translate-x-4' : 'translate-x-0'
            }`}
          />
        </button>
      </div>
    </aside>
  );
};
