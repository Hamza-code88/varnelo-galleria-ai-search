---
name: varnelo-galleria-ecommerce-search
description: Build a production-ready Next.js 15 + TypeScript + Tailwind CSS multi-variant e-commerce shopping mall storefront ("Varnelo Galleria") powered by Algolia (algoliasearch v5 + react-instantsearch) with a Quiet Luxury light theme, variant color swatches, live stock ranking, autocomplete, merchant merchandising drawer, and product quick-view recommendations.
---

# Varnelo Galleria — Multi-Variant E-Commerce Shopping Mall Skill

Use this skill whenever building, configuring, or styling the **Varnelo Galleria** luxury multi-brand e-commerce shopping mall application.

---

## 📸 UI Reference Designs (Exact Visual Blueprints)

The UI must adhere with 100% fidelity to the visual reference designs located in `references/` (and `src/app/`):

| Screen | File Reference | Primary Visual Highlights |
| :--- | :--- | :--- |
| **Screen #1: Main Mall Grid** | `references/screen-1-main-grid.jfif` | Clean `#F9F8F6` canvas, top editorial wordmark, pill search with embedded latency badge (`14ms • Typo Corrected`), collapsible faceted sidebar, 3-column cards with `📌 Pinned #1 • High Margin` badge, stock pills, and swatch dots. |
| **Screen #2: Live Autocomplete** | `references/screen-2-autocomplete.jfif` | 2-column popover beneath search input: Left column with `TRENDING SEARCHES` & `POPULAR CATEGORIES`; Right column with `MATCHING PRODUCTS` (thumbnails, prices, live stock status). |
| **Screen #3: Merchant Mode Drawer** | `references/screen-3-merchant-drawer.jfif` | Slide-over drawer on right with toggles for *Pin High-Margin SKUs to #1* and *Demote Out-of-Stock Items*, Active Pinned Item card (`★ PINNED`), live synonym chips (`kicks = running shoes ×`), and full-width `Apply & Re-Index (12ms)` button. |
| **Screen #4: Quick-View Modal** | `references/screen-4-quick-view.jfif` | Clean centered popover: Left large product studio shot; Right editorial brand, title, description, dynamic price, stock pill, SKU pill (`SKU AUR-SNK-09`), interactive swatches & sizes, `Add to Bag` button, and bottom `Frequently Bought Together • Powered by Algolia Recommend` bundle strip with `+ Add` buttons. |

---

## 1. Tech Stack & Dependencies

* **Framework:** Next.js 15 (App Router) + TypeScript + Tailwind CSS v4
* **Search & Discovery SDKs:**
  * `algoliasearch` (`^5.x`) — for index configuration, seeding, live rules, and synonym updates
  * `react-instantsearch` (`^7.x`) — for `<InstantSearch>`, `<Configure>`, `useSearchBox`, `useRefinementList`, `useRange`, `useToggleRefinement`, `useHits`, and `useInstantSearch`
* **Icons & Fonts:**
  * `lucide-react`
  * Google Fonts: `Playfair Display` (editorial wordmark `VARNELO GALLERIA`) + `Plus Jakarta Sans` (clean UI body & labels) + `JetBrains Mono` (latency & SKU badges)
* **Dev Runner:** `tsx` + `dotenv` for running `scripts/seed-catalog.ts`

### Environment Variables (`.env.local`)

```env
NEXT_PUBLIC_ALGOLIA_APP_ID=your_app_id
NEXT_PUBLIC_ALGOLIA_SEARCH_KEY=your_search_only_api_key
NEXT_PUBLIC_ALGOLIA_INDEX_NAME=varnelo_galleria_products
ALGOLIA_ADMIN_KEY=your_admin_api_key
```

---

## 2. Strict Design System ("Quiet Luxury" Light Theme)

Never use dark mode. Enforce the exact color tokens and visual hierarchy across every component:

* **Canvas Background:** `#F9F8F6` (Cloud Dancer Off-White)
* **Surface (Cards, Sidebar, Dropdown, Drawer, Modal):** `#FFFFFF`
* **Borders & Dividers:** `1px solid #E5E2DC` (Warm Stone)
* **Primary Typography:** `#14181F` (Deep Obsidian Slate)
* **Muted / Secondary Text:** `#5C626D`
* **Primary Brand & Speed Accent:** `#0F5C4C` (Deep Forest Emerald) — used for `14ms` latency pill, `In Stock` pills, `Pinned #1 • High Margin` badge, active toggles, and primary CTAs
* **Low-Stock / Alert Accent:** `#D96B43` (Warm Terracotta) — used for `Low Stock (3 left)` badges and urgency tags
* **Out-of-Stock Muted Pill:** `#EFECE6` background with `#7A7F87` text

---

## 3. Detailed Breakdown of the 4 UI Screens

### Screen #1: Main Shopping Mall Grid (`references/screen-1-main-grid.jfif`)
* **Top Navigation Bar:**
  * Left: Serif wordmark (`VARNELO GALLERIA` / `AURELIA`).
  * Center: Rounded search pill with embedded real-time latency pill (e.g. `14ms • Typo Corrected → Nike Running Shoes`).
  * Right: `Merchant Mode` toggle switch, Shopping Cart/Bag icon, and Account icon.
* **Left Faceted Sidebar:**
  * **Brand Section:** Expandable accordion header with chevron; checkboxes with live counts (`Varnelo Atelier` / `Aurelia`, `Nike` [checked], `Adidas`, `New Balance`, `Puma`).
  * **Color Section:** Circular clickable swatches (`Obsidian Black #14181F`, `Forest Emerald #0F5C4C`, `Terracotta #D96B43`, `Sandstone #D8CBB8`, `Midnight Navy #1E2D4A`).
  * **Size Section:** Rounded-square pill buttons (`8`, `9`, `10`, `11`). Active size has `#0F5C4C` dark green fill with white text.
  * **Price Range:** Dual-handle interactive slider (`$50` to `$1,000` / `$300` to `$500`) styled in `#0F5C4C`.
  * **Show In Stock Only:** Emerald toggle switch.
* **3-Column Product Grid:**
  * Top-left overlay badge `📌 Pinned #1 • High Margin` (`#0F5C4C` fill, white text) when `is_pinned` is true.
  * Card Container: White card with `1px solid #E5E2DC` border. When pinned/selected, subtle `#0F5C4C` border accent.
  * Image Box: Warm beige studio backdrop (`#F4F2EE`).
  * Card Meta: Brand subtitle, Product Title, color subtitle.
  * Card Footer: Live Stock Pill (`In Stock (14 left)` / `Low Stock (3 left)` / `Out of Stock`), color dots, and bold Price right-aligned.

### Screen #2: Live Autocomplete & Query Preview Dropdown (`references/screen-2-autocomplete.jfif`)
* Centered popover directly anchored beneath the search input.
* **2-Column Split:**
  * **Left Column:** `TRENDING SEARCHES` (`nike running shoes`, `air max 90`, `wool jackets`, `kicks under 150`) and `POPULAR CATEGORIES` (`Footwear > Running`, `Activewear > Jackets`). Clicking fills search query.
  * **Right Column:** `MATCHING PRODUCTS` with top 3 live hits (thumbnail, title, category, price, and live stock pill).

### Screen #3: "Merchant Mode" Merchandising Drawer (`references/screen-3-merchant-drawer.jfif`)
* Slide-over drawer on the right triggered by the top-right `Merchant Mode` toggle.
* **Header:** "Merchant Merchandising Rules", subtext "Manage search relevance & ranking", X close button.
* **Toggles:**
  * *Pin High-Margin SKUs to #1* (toggle)
  * *Demote Out-of-Stock Items* (toggle)
* **Active Pinned Items:** Position #1 card with `★ PINNED` badge, thumbnail, and title.
* **Live Synonyms Manager:** Chips for active synonyms (`kicks = running shoes ×`, `nikey = nike ×`) with inline `+ Add Synonym` input form.
* **Primary Sticky CTA:** Full-width `#0F5C4C` button: `Apply & Re-Index (12ms)`.

### Screen #4: Product Quick-View Modal + Recommendations (`references/screen-4-quick-view.jfif`)
* Centered modal with soft backdrop blur.
* **Upper Section:**
  * Left: High-resolution studio product shot on warm beige background.
  * Right: Brand, Title, Craftsmanship description, Price, Stock Pill (`In Stock (14 left)`), SKU badge (`SKU AUR-SNK-09`), interactive Color Swatches, interactive Size selector (`8`, `9`, `10`, `11`), and full-width `Add to Bag` button in `#0F5C4C`.
* **Lower Section ("Frequently Bought Together • Powered by Algolia Recommend"):**
  * 3 complementary SKU picks (e.g. `Merino Running Socks • $24`, `Cedar Shoe Trees • $38`, `Leather Care Kit • $32`).
  * Each pick has a thumbnail, title, price, and `+ Add` button.

---

## 4. Target Project Structure

```text
varnelo-galleria/
├── .agent/
│   └── skills/
│       └── varnelo-galleria-ecommerce-search/
│           ├── SKILL.md
│           └── references/
│               ├── screen-1-main-grid.jfif
│               ├── screen-2-autocomplete.jfif
│               ├── screen-3-merchant-drawer.jfif
│               └── screen-4-quick-view.jfif
├── scripts/
│   └── seed-catalog.ts               # Seeds 36+ multi-variant SKUs + auto index settings & synonyms
├── src/
│   ├── lib/
│   │   ├── search-client.ts          # Search client initialization & index constants
│   │   └── mock-catalog.ts           # 36+ luxury multi-variant items for instant fallback
│   ├── types/
│   │   └── product.ts                # ProductRecord, ColorVariant & SynonymRule types
│   ├── components/
│   │   ├── Navbar.tsx                # Logo + Search input + Live Latency pill + Merchant Mode switch
│   │   ├── AutocompleteDropdown.tsx  # Screen #2: Trending searches + Instant product previews
│   │   ├── FilterSidebar.tsx         # Brand checkboxes, Color Swatches, Size pills, Price slider, In-Stock toggle
│   │   ├── ProductCard.tsx           # Screen #1: Interactive color swatches, live stock pill, Pinned #1 tag
│   │   ├── MerchantDrawer.tsx        # Screen #3: Slide-over merchandising drawer (Pin #1, Demote OOS, Synonyms)
│   │   └── QuickViewModal.tsx        # Screen #4: SKU variant selector + AI Bundle recommendations
│   └── app/
│       ├── api/
│       │   └── merchandising/
│       │       └── route.ts          # Server API route using ALGOLIA_ADMIN_KEY for live rules/synonyms
│       ├── globals.css               # Quiet luxury theme variables & range styling
│       ├── layout.tsx                # Fonts & base #F9F8F6 layout
│       └── page.tsx                  # Main storefront wrapped in instant discovery
└── .env.local
```

---

## 5. Execution & Verification Checklist

1. Verify dependencies in `package.json`: `algoliasearch`, `react-instantsearch`, `lucide-react`, `tsx`, `dotenv`.
2. Ensure `.env.local` has search credentials or test locally with simulated instant engine.
3. Verify all 4 screens match the visual designs in `references/`:
   * Screen #1: Main Shopping Mall Grid matches `references/screen-1-main-grid.jfif`.
   * Screen #2: Autocomplete Dropdown matches `references/screen-2-autocomplete.jfif`.
   * Screen #3: Merchant Mode Drawer matches `references/screen-3-merchant-drawer.jfif`.
   * Screen #4: Quick View Modal matches `references/screen-4-quick-view.jfif`.
