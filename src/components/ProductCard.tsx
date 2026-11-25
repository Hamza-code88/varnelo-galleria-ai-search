'use client';

import React, { useState } from 'react';
import { ProductRecord, ColorVariant } from '@/types/product';

interface ProductCardProps {
  product: ProductRecord;
  onQuickView: (product: ProductRecord, activeVariantIndex: number) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onQuickView }) => {
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);

  const currentVariant: ColorVariant =
    product.variants && product.variants[selectedVariantIndex]
      ? product.variants[selectedVariantIndex]
      : {
        color: product.color,
        hex: product.color_hex,
        in_stock: product.in_stock,
        stock_count: product.stock_count,
        image: product.image,
        sku: product.sku,
      };

  const getStockBadge = (stockCount: number, inStock: boolean) => {
    if (!inStock || stockCount === 0) {
      return (
        <span className="inline-flex items-center px-2.5 py-1 rounded-md text-[11px] font-medium bg-[#EFECE6] text-[#7A7F87]">
          Out of Stock
        </span>
      );
    }
    if (stockCount <= 3) {
      return (
        <span className="inline-flex items-center px-2.5 py-1 rounded-md text-[11px] font-medium bg-[#FBECE6] text-[#D96B43]">
          Low Stock ({stockCount} left)
        </span>
      );
    }
    if (stockCount === 14) {
      return (
        <span className="inline-flex items-center px-2.5 py-1 rounded-md text-[11px] font-medium bg-[#E6F2EF] text-[#0F5C4C]">
          In Stock (14 left)
        </span>
      );
    }
    return (
      <span className="inline-flex items-center px-2.5 py-1 rounded-md text-[11px] font-medium bg-[#E6F2EF] text-[#0F5C4C]">
        In Stock
      </span>
    );
  };

  const isCardPinned = product.is_pinned;

  return (
    <div
      onClick={() => onQuickView(product, selectedVariantIndex)}
      className={`group relative flex flex-col bg-[#FFFFFF] rounded-2xl border transition-all duration-200 cursor-pointer overflow-hidden p-3.5 hover:shadow-md ${isCardPinned ? 'border-[#0F5C4C]' : 'border-[#E5E2DC] hover:border-[#C8C4BC]'
        }`}
    >
      {/* Pinned Badge on Image container */}
      <div className="relative aspect-[4/3] w-full bg-[#F4F2EE] rounded-xl overflow-hidden flex items-center justify-center p-4">
        {isCardPinned && (
          <div className="absolute top-2.5 left-2.5 z-10 flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-semibold bg-[#0F5C4C] text-white shadow-xs">
            <span>📌</span>
            <span>Pinned #1 • High Margin</span>
          </div>
        )}

        <img
          src={currentVariant.image}
          alt={`${product.title} - ${currentVariant.color}`}
          className="h-full w-full object-contain object-center transition-transform duration-300 group-hover:scale-103"
          loading="lazy"
        />
      </div>

      {/* Meta */}
      <div className="flex flex-col pt-3 pb-1">
        <span className="text-[12px] text-[#5C626D] font-normal leading-tight">
          {product.brand}
        </span>

        <h3 className="text-[14px] font-semibold text-[#14181F] leading-snug mt-0.5 group-hover:text-[#0F5C4C] transition-colors">
          {product.title}
        </h3>

        <p className="text-[12px] text-[#7A7F87] line-clamp-1 mt-0.5">
          {currentVariant.color === 'Natural White'
            ? 'Natural White and off-white leather'
            : currentVariant.color === 'Metallic matte Gray'
              ? 'Metallic matte Gray on dark-bands...'
              : currentVariant.color}
        </p>
      </div>

      {/* Footer Row */}
      <div className="mt-auto pt-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {/* Stock Status Badge */}
          {getStockBadge(currentVariant.stock_count, currentVariant.in_stock)}

          {/* Color Swatch Dots */}
          <div
            className="flex items-center gap-1.5 ml-1"
            onClick={(e) => e.stopPropagation()}
          >
            {product.variants?.map((v, idx) => {
              const isSelected = idx === selectedVariantIndex;
              return (
                <button
                  key={`${product.objectID}-${v.color}`}
                  type="button"
                  onClick={() => setSelectedVariantIndex(idx)}
                  title={v.color}
                  className={`w-3 h-3 rounded-full border transition-all ${isSelected
                    ? 'ring-1.5 ring-offset-1 ring-[#0F5C4C] scale-110 border-transparent'
                    : 'border-[#D1CCC4] hover:scale-110'
                    }`}
                  style={{ backgroundColor: v.hex }}
                  aria-label={`Select ${v.color}`}
                />
              );
            })}
          </div>
        </div>

        {/* Price */}
        <div className="text-[15px] font-bold text-[#14181F] tracking-tight">
          ${product.price}
        </div>
      </div>
    </div>
  );
};
