'use client';

import React, { useState } from 'react';
import { InstantSearch, Configure, useHits, useInstantSearch } from 'react-instantsearch';
import { searchClient, INDEX_NAME } from '@/lib/search-client';
import { Navbar } from '@/components/Navbar';
import { FilterSidebar } from '@/components/FilterSidebar';
import { ProductCard } from '@/components/ProductCard';
import { MerchantDrawer } from '@/components/MerchantDrawer';
import { QuickViewModal } from '@/components/QuickViewModal';
import { ProductRecord, ColorVariant } from '@/types/product';
import { ShoppingBag } from '@/components/icons';

function StorefrontContent() {
  const { items: hits } = useHits<ProductRecord>();
  const { results } = useInstantSearch();

  const [merchantMode, setMerchantMode] = useState(false);
  const [bagItems, setBagItems] = useState<
    Array<{ product: ProductRecord; variant: ColorVariant; size: string }>
  >([]);
  const [isBagDrawerOpen, setIsBagDrawerOpen] = useState(false);

  // Quick View Modal
  const [quickViewProduct, setQuickViewProduct] = useState<ProductRecord | null>(null);
  const [quickViewVariantIndex, setQuickViewVariantIndex] = useState(0);

  const handleOpenQuickView = (product: ProductRecord, variantIndex: number = 0) => {
    setQuickViewProduct(product);
    setQuickViewVariantIndex(variantIndex);
  };

  const handleAddToBag = (product: ProductRecord, variant: ColorVariant, size: string) => {
    setBagItems((prev) => [...prev, { product, variant, size }]);
  };

  const totalHits = results?.nbHits ?? hits.length;

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#14181F] flex flex-col font-sans">
      {/* Top Navbar connected to useSearchBox & useInstantSearch */}
      <Navbar
        merchantMode={merchantMode}
        onToggleMerchantMode={() => setMerchantMode(!merchantMode)}
        bagCount={bagItems.length}
        onOpenBag={() => setIsBagDrawerOpen(true)}
        onSelectProduct={(p) => handleOpenQuickView(p, 0)}
      />

      {/* Main Content Area */}
      <main className="max-w-[1400px] w-full mx-auto px-4 sm:px-8 py-6 flex-1">
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          {/* Left Faceted Sidebar connected to useRefinementList, useRange, useToggleRefinement */}
          <FilterSidebar />

          {/* Right Product Grid Area */}
          <div className="flex-1 w-full">
            {/* Header: Results Count & Sort Dropdown */}
            <div className="flex items-center justify-between pb-5">
              <span className="text-[14px] text-[#14181F] font-normal">
                {totalHits} Results
              </span>

              <div className="flex items-center gap-1.5 text-[13px] text-[#14181F] cursor-pointer hover:text-[#0F5C4C]">
                <span>Sort by: Featured</span>
                <span className="text-[11px] font-mono">⌄</span>
              </div>
            </div>

            {/* 3-Column Product Grid */}
            {hits.length === 0 ? (
              <div className="bg-white rounded-2xl border border-[#E5E2DC] p-12 text-center space-y-2">
                <p className="text-sm font-semibold text-[#14181F]">No matching products</p>
                <p className="text-xs text-[#5C626D]">
                  Try clearing a filter or searching for another term like &quot;kicks&quot; or &quot;jacket&quot;.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {hits.map((product) => (
                  <ProductCard
                    key={product.objectID}
                    product={product}
                    onQuickView={handleOpenQuickView}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Screen #3: Merchant Mode Drawer */}
      <MerchantDrawer isOpen={merchantMode} onClose={() => setMerchantMode(false)} />

      {/* Screen #4: Quick View Modal */}
      <QuickViewModal
        product={quickViewProduct}
        initialVariantIndex={quickViewVariantIndex}
        onClose={() => setQuickViewProduct(null)}
        onAddToBag={handleAddToBag}
        allProducts={hits}
      />

      {/* Shopping Bag Drawer */}
      {isBagDrawerOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden flex justify-end">
          <div
            onClick={() => setIsBagDrawerOpen(false)}
            className="fixed inset-0 bg-black/30 backdrop-blur-xs"
          />
          <div className="relative w-full max-w-md bg-white h-full shadow-2xl border-l border-[#E5E2DC] flex flex-col z-10 p-6">
            <div className="flex items-center justify-between pb-4 border-b border-[#E5E2DC]">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-[#0F5C4C]" />
                <h3 className="font-bold text-sm text-[#14181F]">
                  Shopping Bag ({bagItems.length})
                </h3>
              </div>
              <button
                onClick={() => setIsBagDrawerOpen(false)}
                className="text-xs font-medium text-[#5C626D] hover:text-[#14181F]"
              >
                Close
              </button>
            </div>

            <div className="flex-1 overflow-y-auto py-4 space-y-3">
              {bagItems.length === 0 ? (
                <div className="py-12 text-center text-xs text-[#5C626D]">
                  Your shopping bag is currently empty.
                </div>
              ) : (
                bagItems.map((item, idx) => (
                  <div
                    key={`${item.product.objectID}-${idx}`}
                    className="flex items-center justify-between p-3 rounded-xl bg-[#FAF9F7] border border-[#E5E2DC]"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={item.variant.image}
                        alt={item.product.title}
                        className="w-12 h-12 object-contain rounded-lg bg-white p-1 border border-[#E5E2DC]"
                      />
                      <div>
                        <p className="text-xs font-semibold text-[#14181F] line-clamp-1">
                          {item.product.title}
                        </p>
                        <p className="text-[11px] text-[#5C626D]">
                          {item.variant.color} • Size {item.size}
                        </p>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-[#14181F]">
                      ${item.product.price}
                    </span>
                  </div>
                ))
              )}
            </div>

            {bagItems.length > 0 && (
              <div className="pt-4 border-t border-[#E5E2DC] space-y-3">
                <div className="flex justify-between text-sm font-bold text-[#14181F]">
                  <span>Total</span>
                  <span>
                    ${bagItems.reduce((acc, curr) => acc + curr.product.price, 0)}
                  </span>
                </div>
                <button className="w-full h-11 rounded-xl bg-[#0F5C4C] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#0c473b] transition-all">
                  Proceed to Checkout
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default function StorefrontPage() {
  return (
    <InstantSearch searchClient={searchClient} indexName={INDEX_NAME}>
      <Configure distinct={1} hitsPerPage={24} />
      <StorefrontContent />
    </InstantSearch>
  );
}
