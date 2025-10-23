# AapkaSamachar Design Guidelines

## Design Approach: Reference-Based (News Platform Pattern)

**Primary Inspiration**: Dainik Jagran (trust & credibility) + Times of India digital + BBC Hindi (modern news UX)

**Design Philosophy**: Traditional credibility meets mobile-first efficiency. Create a familiar, trustworthy news experience optimized for Hindi readers consuming content on mobile devices during commutes.

---

## Core Design Elements

### A. Color Palette

**Light Mode (Primary)**
- Primary Brand: 12 85% 25% (Deep maroon-red - traditional Indian news aesthetic)
- Primary Hover: 12 85% 20%
- Background: 0 0% 100%
- Surface: 0 0% 98%
- Text Primary: 0 0% 10%
- Text Secondary: 0 0% 40%
- Border: 0 0% 88%
- Accent (Breaking News): 0 85% 50% (Urgent red for breaking news badges)

**Dark Mode**
- Primary Brand: 12 75% 45%
- Background: 0 0% 8%
- Surface: 0 0% 12%
- Text Primary: 0 0% 95%
- Text Secondary: 0 0% 65%
- Border: 0 0% 20%

**Category Colors** (Subtle tint overlays for category identification)
- राष्ट्रीय: 220 15% 50%
- मनोरंजन: 280 20% 55%
- खेल: 140 25% 45%
- तकनीक: 200 30% 50%
- व्यापार: 30 20% 45%

---

### B. Typography

**Font Families** (via Google Fonts CDN)
- Hindi Primary: 'Noto Sans Devanagari', sans-serif (Weights: 400, 500, 600, 700)
- English/Numbers: 'Inter', sans-serif (Weights: 400, 500, 600, 700)

**Type Scale**
- Hero Headline: text-4xl md:text-5xl font-bold (breaking news)
- Article Headline: text-2xl md:text-3xl font-bold
- Section Heading: text-xl md:text-2xl font-semibold
- Card Title: text-lg font-semibold
- Body Text: text-base leading-relaxed (optimal Hindi readability)
- Meta Info: text-sm text-secondary
- Timestamp/Tags: text-xs

**Hindi-Specific Considerations**
- Increased line-height (1.7-1.8) for Devanagari script clarity
- Slightly larger base font size (16px minimum) for mobile readability
- Proper Unicode support for Hindi characters and diacritics

---

### C. Layout System

**Spacing Primitives**: Tailwind units of 2, 4, 6, 8, 12, 16, 20, 24
- Component padding: p-4 (mobile), p-6 (tablet), p-8 (desktop)
- Section spacing: space-y-8 (mobile), space-y-12 (desktop)
- Card gaps: gap-4 (mobile), gap-6 (desktop)
- Grid columns: grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4

**Container Widths**
- Full-width: max-w-7xl mx-auto px-4
- Content: max-w-4xl mx-auto (article reading)
- Sidebar: w-full lg:w-80 (trending/ads)

**Responsive Breakpoints**
- Mobile-first: base (< 640px)
- Tablet: md: (768px)
- Desktop: lg: (1024px)
- Wide: xl: (1280px)

---

### D. Component Library

**1. Navigation**
- Top bar: Logo left, category nav center, search/auth right
- Sticky on scroll with reduced height
- Mobile: Hamburger menu with slide-out drawer
- Category pills with horizontal scroll on mobile
- Language toggle (हिंदी/English) in header

**2. Breaking News Banner**
- Full-width red gradient background (accent color)
- Auto-rotating headlines with slide animation
- "ब्रेकिंग न्यूज़" badge with pulse effect
- Dismiss button (×) for user control

**3. Hero Section (Homepage)**
- Large featured article card with image overlay
- Image: 16:9 aspect ratio, gradient overlay for text readability
- Headline overlaid in white text with shadow
- Category badge, timestamp, read-time indicator
- Mobile: full-width, Desktop: 2/3 width with sidebar

**4. Article Cards**
- Standard: Thumbnail (4:3), headline, excerpt (2 lines), meta info
- Horizontal: Image left (120px), content right (mobile-optimized)
- Compact: Title + meta only (for "More from category")
- Hover state: subtle lift (shadow-md to shadow-lg)

**5. Category Tiles (Homepage)**
- Grid: 2 cols mobile, 4 cols tablet, 6-8 cols desktop
- Icon + category name in Hindi
- Border with category accent color
- Tap/click opens category page

**6. Article Page Layout**
- Single column, max-w-3xl
- Headline → byline → hero image → body content
- Inline images: max-w-full with captions
- Pull quotes: border-l-4 with brand color, italic
- Social share bar: sticky on desktop, fixed bottom on mobile
- Reaction buttons: Large touch targets (44px min) with counts

**7. Comment Section**
- Nested replies (max 2 levels)
- User avatar + name + timestamp
- Report/flag button for moderation
- Login prompt for non-authenticated users

**8. CMS Dashboard (Editor Interface)**
- Clean, minimal interface inspired by Notion/WordPress
- Left sidebar: navigation (All Articles, Drafts, Scheduled, Settings)
- Main area: WYSIWYG editor with Hindi keyboard support
- Right sidebar: Publish controls, tags, SEO, scheduling
- Toolbar: Text formatting, image upload, embed options
- Article preview toggle (mobile/desktop views)

**9. Search Interface**
- Search bar with Hindi input (transliteration support)
- Autocomplete dropdown with recent searches
- Filters: Category, date range, region, author
- Results: Article cards with keyword highlighting

**10. User Account Pages**
- Profile: Avatar, name, followed topics/authors
- Bookmarks: Saved articles grid
- Settings: Notification preferences, display options (font size, dark mode)

---

### E. Images

**Hero/Featured Images**
- Homepage breaking news: 1200x675px (16:9), high-quality news photos
- Article hero: 1200x675px with gradient overlay
- Category thumbnails: 400x300px (4:3)
- Author avatars: 80x80px circular

**Image Treatment**
- Subtle border-radius (rounded-lg for cards, rounded-sm for thumbnails)
- Lazy loading for performance
- Responsive srcset for mobile optimization
- Placeholder: brand color gradient while loading

**Placement Strategy**
- Hero section: Full-width featured image with text overlay
- Article cards: Left-aligned thumbnail (mobile), top-aligned (desktop)
- Article body: Center-aligned with captions
- CMS: Upload interface with drag-and-drop

---

### F. Interactions & Micro-animations

**Minimal Animation Philosophy**
- Card hover: transform translateY(-2px) + shadow transition
- Button states: subtle scale (0.98) on active
- Loading: simple spinner (brand color)
- Breaking news: gentle slide-in from top
- No distracting parallax or scroll-triggered animations

**Mobile Gestures**
- Swipe navigation for article galleries
- Pull-to-refresh on homepage
- Tap zones: 44px minimum for accessibility

---

### G. Accessibility & Performance

- High contrast ratios (WCAG AA minimum)
- Font size controls in settings
- Skip-to-content links
- Semantic HTML (article, nav, aside tags)
- Hindi screen reader support
- Offline reading for bookmarked articles (PWA)
- Image compression for low-bandwidth users
- AMP-style fast loading for article pages

---

**Design Priority**: Trust and readability above all. Every design decision should reinforce credibility while maintaining fast, mobile-first performance for Hindi-reading audiences across India's diverse connectivity landscape.