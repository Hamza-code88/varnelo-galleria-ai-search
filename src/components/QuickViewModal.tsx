'use client';

import React, { useState, useEffect } from 'react';
import { X } from './icons';
import { ProductRecord, ColorVariant } from '@/types/product';

interface QuickViewModalProps {
  product: ProductRecord | null;
  initialVariantIndex?: number;
  onClose: () => void;
  onAddToBag: (product: ProductRecord, variant: ColorVariant, size: string) => void;
  allProducts: ProductRecord[];
}

export const QuickViewModal: React.FC<QuickViewModalProps> = ({
  product,
  initialVariantIndex = 0,
  onClose,
  onAddToBag,
  allProducts,
}) => {
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(initialVariantIndex);
  const [selectedSize, setSelectedSize] = useState('9');
  const [buttonText, setButtonText] = useState('Add to Bag');

  useEffect(() => {
    setSelectedVariantIndex(initialVariantIndex);
    setSelectedSize('9');
    setButtonText('Add to Bag');
  }, [product, initialVariantIndex]);

  if (!product) return null;

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

  const handleMainAdd = () => {
    onAddToBag(product, currentVariant, selectedSize);
    setButtonText('Added to Bag!');
    setTimeout(() => setButtonText('Add to Bag'), 2000);
  };

  // 3 complementary bundle recommendations matching screen-4-quick-view.jfif
  const bundleItems = [
    {
      id: 'bundle-socks',
      title: 'Merino Running Socks',
      price: '$24',
      image: 'https://images.unsplash.com/photo-1586350977771-b3b0abd50c82?q=80&w=400&auto=format&fit=crop',
    },
    {
      id: 'bundle-trees',
      title: 'Cedar Shoe Trees',
      price: '$38',
      image: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?q=80&w=400&auto=format&fit=crop',
    },
    {
      id: 'bundle-kit',
      title: 'Leather Care Kit',
      price: '$32',
      image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=400&auto=format&fit=crop',
    },
  ];

  const handleBundleAdd = (item: (typeof bundleItems)[0]) => {
    onAddToBag(
      {
        ...product,
        objectID: item.id,
        title: item.title,
        price: parseInt(item.price.replace('$', '')),
      },
      currentVariant,
      'Standard'
    );
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 sm:p-6 select-none">
      {/* Blurred Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/35 backdrop-blur-xs transition-opacity duration-300"
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-[780px] bg-[#FFFFFF] rounded-3xl shadow-2xl overflow-hidden z-10 animate-in zoom-in-95 duration-200">
        {/* Close Button on top right */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 z-20 p-1.5 text-[#14181F] hover:text-[#0F5C4C] transition-colors cursor-pointer"
        >
          <X className="w-5 h-5 stroke-[1.5]" />
        </button>

        {/* Upper Split Layout */}
        <div className="p-8 pb-6 grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          {/* Left: Studio Image */}
          <div className="md:col-span-6 aspect-square bg-[#F4F2EE] rounded-2xl p-6 flex items-center justify-center overflow-hidden">
            <img
              src={currentVariant.image}
              alt={`${product.title} - ${currentVariant.color}`}
              className="w-full h-full object-contain"
            />
          </div>

          {/* Right: Product Details */}
          <div className="md:col-span-6 space-y-4">
            {/* Wordmark */}
            <span className="font-playfair text-[13px] tracking-[0.22em] text-[#14181F] uppercase block">
              VARNELO GALLERIA
            </span>

            {/* Title */}
            <h2 className="text-[22px] font-bold text-[#14181F] leading-tight -mt-1">
              {product.title}
            </h2>

            {/* Description */}
            <p className="text-[13px] text-[#5C626D] leading-relaxed">
              {product.description}
            </p>

            {/* Price */}
            <div className="text-[24px] font-bold text-[#14181F] tracking-tight">
              ${product.price}
            </div>

            {/* Stock & SKU Pills */}
            <div className="flex items-center gap-2 pt-0.5">
              <span className="inline-flex px-3 py-1 rounded-md text-[12px] font-medium bg-[#E6F2EF] text-[#0F5C4C]">
                In Stock (14 left)
              </span>
              {!currentVariant.in_stock || currentVariant.stock_count === 0 ? (
                <span className="inline-flex px-3 py-1 rounded-md text-[12px] font-medium bg-[#EFECE6] text-[#7A7F87]">
                  Out of Stock
                </span>
              ) : currentVariant.stock_count <= 5 ? (
                <span className="inline-flex px-3 py-1 rounded-md text-[12px] font-medium bg-[#FBECE6] text-[#D96B43]">
                  Low Stock ({currentVariant.stock_count} left)
                </span>
              ) : (
                <span className="inline-flex px-3 py-1 rounded-md text-[12px] font-medium bg-[#E6F2EF] text-[#0F5C4C]">
                  In Stock ({currentVariant.stock_count} left)
                </span>
              )}
              <span className="inline-flex px-2.5 py-1 rounded-md text-[11px] font-mono text-[#5C626D] bg-[#F4F2EE]">
                SKU AUR-SNK-09
                SKU {currentVariant.sku}
              </span>
            </div>

            {/* Color Swatches */}
            <div className="space-y-2 pt-1">
              <div className="text-[13px] font-medium text-[#14181F]">
                Color: <span className="font-normal text-[#5C626D]">{currentVariant.color}</span>
              </div>
              <div className="flex items-center gap-2.5">
                {product.variants?.map((v, idx) => {
                  const isSelected = idx === selectedVariantIndex;
                  return (
                    <button
                      key={v.color}
                      type="button"
                      onClick={() => setSelectedVariantIndex(idx)}
                      title={v.color}
                      className={`w-6 h-6 rounded-full border transition-all ${isSelected
                        ? 'ring-2 ring-offset-2 ring-[#0F5C4C] scale-105 border-transparent'
                        : 'border-[#D1CCC4] hover:scale-105'
                        }`}
                      style={{ backgroundColor: v.hex }}
                    />
                  );
                })}
              </div>
            </div>

            {/* Size Selector */}
            <div className="space-y-2 pt-1">
              <div className="text-[13px] font-medium text-[#14181F]">Size</div>
              <div className="flex items-center gap-2">
                {product.sizes.map((s) => {
                  const isSelected = s === selectedSize;
                  return (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setSelectedSize(s)}
                      className={`w-11 h-9 rounded-lg border text-[13px] font-normal transition-all flex items-center justify-center ${isSelected
                        ? 'bg-[#0F5C4C] text-white border-[#0F5C4C]'
                        : 'bg-white text-[#14181F] border-[#E5E2DC] hover:border-[#14181F]'
                        }`}
                    >
                      {s}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Add to Bag Button */}
            <div className="pt-2">
              <button
                onClick={handleMainAdd}
                className="w-full h-11 rounded-xl bg-[#0F5C4C] hover:bg-[#0c473b] text-white text-[14px] font-semibold transition-all shadow-sm flex items-center justify-center cursor-pointer"
              >
                {buttonText}
              </button>
            </div>
          </div>
        </div>

        {/* Lower Recommendations Section: Frequently Bought Together */}
        <div className="px-8 pb-8 pt-4 border-t border-[#E5E2DC]/80 space-y-4 bg-white">
          <h3 className="text-[13px] font-bold text-[#0F5C4C] flex items-center gap-2">
            <span>Frequently Bought Together • Powered by Algolia Recommend</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {bundleItems.map((item) => (
              <div
                key={item.id}
                className="rounded-2xl border border-[#E5E2DC] p-3.5 bg-white shadow-2xs space-y-3"
              >
                <div className="relative aspect-[4/3] rounded-xl bg-[#F4F2EE] p-3 flex items-center justify-center overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-contain"
                  />
                  <button
                    type="button"
                    onClick={() => handleBundleAdd(item)}
                    className="absolute top-2 right-2 px-2.5 py-1 rounded-md bg-white border border-[#E5E2DC] text-[11px] font-semibold text-[#14181F] hover:bg-[#0F5C4C] hover:text-white hover:border-[#0F5C4C] transition-all cursor-pointer shadow-2xs"
                  >
                    + Add
                  </button>
                </div>
                <div className="text-[12px] font-semibold text-[#14181F] text-center truncate">
                  {item.title} • <span className="font-normal text-[#5C626D]">{item.price}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
