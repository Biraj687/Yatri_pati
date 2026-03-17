# 🎨 Visual Layout Guide - YatriPati

## Header Component Structure

### Desktop Layout (>= 1024px)

```
┌────────────────────────────────────────────────────────────────────────────────────┐
│ TopBar                                                                              │
├────────────────────────────────────────────────────────────────────────────────────┤
│ ११ चैत्र २०८२, बुधबार │  सातै प्रदेशका समाचार र विश्लेषण  │ f  🔗  𝕏  ▶️        │
└────────────────────────────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────────────────────────────┐
│ Navbar                                                                              │
├────────────────────────────────────────────────────────────────────────────────────┤
│ ✈️ यात्री  │  होमपेज  |  प्रदेश  |  विचार  |  शिक्षा  |  [Search 🔍]  [🌙/☀️]    │
│   पाती   │  स्वास्थ्य  |  खेलकुद  |  अर्थतन्त्र  |  अन्य                         │
└────────────────────────────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────────────────────────────┐
│ Breaking News Banner                                                                │
├────────────────────────────────────────────────────────────────────────────────────┤
│ [ब्रेकिंग न्यूज] प्रधानमन्त्री आज पर्यटन विकास समिति सँग छल्फलको लागि भेट गर्दछुन्   │
└────────────────────────────────────────────────────────────────────────────────────┘
```

### Tablet Layout (768px - 1023px)

```
┌───────────────────────────────────────────────────────┐
│ TopBar                                                 │
├───────────────────────────────────────────────────────┤
│ ११ चैत्र २०८२  │  (breaking news hidden)  │ f  🔗  𝕏 │
└───────────────────────────────────────────────────────┘

┌───────────────────────────────────────────────────────┐
│ Navbar                                                 │
├───────────────────────────────────────────────────────┤
│ ✈️ यात्री  │  होमपेज  |  शिक्षा  |  [🔍]  [🌙]       │
│   पाती   │  खेलकुद  |  अन्य    | [☰]               │
└───────────────────────────────────────────────────────┘

┌───────────────────────────────────────────────────────┐
│ (Mobile Menu Hidden - collapsed)                      │
└───────────────────────────────────────────────────────┘
```

### Mobile Layout (< 768px)

```
┌──────────────────────────┐
│ TopBar                    │
├──────────────────────────┤
│ ११ चैत्र│  f 🔗 𝕏 ▶️    │
└──────────────────────────┘

┌──────────────────────────┐
│ Navbar                    │
├──────────────────────────┤
│ ✈️ यात्री │ 🔍 🌙 [☰]   │
│   पाती   │               │
└──────────────────────────┘

When ☰ clicked:
┌──────────────────────────┐
│ Mobile Menu              │
├──────────────────────────┤
│ › होमपेज                │
│ › प्रदेश                │
│ › विचार                │
│ › शिक्षा                │
│ › स्वास्थ्य            │
│ › खेलकुद              │
│ › अर्थतन्त्र          │
│ › अन्य                │
└──────────────────────────┘

┌──────────────────────────┐
│ Breaking News            │
├──────────────────────────┤
│ [ब्रेकिंग] प्रधानमन्त्री │
│ आज पर्यटन...            │
└──────────────────────────┘
```

---

## Component Dimensions

### TopBar
```
Height: 3rem (48px)
Padding: py-2 (8px vertical)
Content: Date | Breaking News | Social Icons
Background: bg-gray-100
Border: border-b border-gray-300
Responsive: All items visible on desktop
           Breaking news hidden on mobile
```

### Navbar
```
Height: 5rem (80px)
Padding: h-20 (80px)
Left: Logo + Text (120px)
Center: Navigation Menu (optional, hidden on mobile)
Right: Search + Dark Mode + Hamburger (80px)
Background: bg-white / dark:bg-gray-900
Border: border-b border-gray-300 / dark:border-gray-700
Sticky: Position sticky at top
z-index: z-40 (stays on top)
```

### Navigation Items
```
Display: Hidden on mobile (lg:hidden shows hamburger)
         Full menu on desktop (hidden lg:flex)
Width: Each item ~100px
Padding: px-3 py-2
Font: text-sm font-medium
Hover: border-b-2 changes color to red-600
```

### Mobile Menu (Dropdown)
```
Width: 100% of viewport
Display: When hamburger clicked
Background: Same as navbar
Border: border-t border-gray-300
Padding: py-4
Items: Flex column layout
Spacing: space-y-2 between items
Animation: Smooth expand/collapse
```

---

## Color Reference

### Light Mode (Default)
```
┌─ TopBar Background
│  ╭─ Light Gray (#F3F4F6)
│  ├─ Border: Gray-300 (#D1D5DB)
│  ├─ Text: Gray-700 (#374151)
│  └─ Icons: Gray-700 → Red-600 on hover
│
├─ Navbar Background
│  ╭─ White (#FFFFFF)
│  ├─ Border: Gray-300 (#D1D5DB)
│  ├─ Text: Gray-700 (#374151)
│  ├─ Hover: Red-600 (#DC143C)
│  └─ Hover BG: Gray-100 (#F3F4F6)
│
└─ Breaking News
   ├─ Background: Red-600 (#DC143C)
   ├─ Text: White (#FFFFFF)
   └─ Badge: White with Red text
```

### Dark Mode
```
┌─ TopBar Background
│  ├─ Remains Light Gray (not affected by dark mode)
│  └─ Can be customized if needed
│
├─ Navbar Background
│  ╭─ Dark Gray (#111827)
│  ├─ Border: Gray-700 (#374151)
│  ├─ Text: Gray-300 (#D1D5DB)
│  ├─ Hover: White (#FFFFFF)
│  ├─ Hover BG: Gray-800 (#1F2937)
│  └─ Sun Icon: Yellow-400 (#FBBF24)
│
└─ Breaking News
   ├─ Red-600 (#DC143C) - same as light mode
   └─ Text: White (#FFFFFF)
```

---

## Spacing System

### Horizontal Spacing
```
┌─ Mobile: px-4 (16px on each side)
├─ Tablet: px-6 (24px on each side)
└─ Desktop: px-8 (32px on each side)
```

### Vertical Spacing
```
┌─ TopBar: py-2 (8px)
├─ Navbar: h-20 (80px height)
├─ Items: py-2 (8px)
└─ Sections: py-4 (16px)
```

### Gap Between Items
```
┌─ Social Icons: space-x-3 (12px)
├─ Navigation Items: gap (varies)
├─ Mobile Menu Items: space-y-2 (8px)
└─ Flexbox children: space-x/y-n
```

---

## Font Sizes

### TopBar
```
Date: text-xs (12px) → sm:text-sm (14px)
Breaking News: (hidden on mobile)
Icons: w-4 h-4 (16px)
```

### Navbar
```
Logo Title: text-2xl (24px) font-bold
Subtitle: text-xs (12px)
Nav Items: text-sm (14px) font-medium
Icons: w-5 h-5 (20px) → w-6 h-6 (24px) for hamburger
```

---

## Interactive States

### Hover Effects
```
┌─ Navigation Links
│  ├─ Border: transparent → red-600
│  ├─ Text: gray-700 → black
│  └─ Duration: 200ms
│
├─ Social Icons
│  ├─ Color: gray-700 → red-600
│  └─ Duration: 200ms
│
├─ Search Button
│  ├─ BG: transparent → gray-100
│  ├─ Text: gray-700 → black
│  └─ Duration: 200ms
│
└─ Dark Mode Button
   ├─ BG: transparent → gray-800
   ├─ Text: gray-400 → yellow-400 (sun)
   └─ Duration: 200ms
```

### Click Effects
```
┌─ Hamburger Menu: Rotates & collapses
├─ Dark Mode Toggle: Icon changes, theme switches
├─ Navigation Items: Navigate to page
└─ Social Icons: Opens external link
```

### Focus States (Keyboard)
```
All interactive elements:
├─ Outline: 2px outline-red-600
├─ Offset: outline-offset-2
└─ Only visible on keyboard focus (focus-visible)
```

---

## Responsive Behavior

### Mobile (<768px)
```
TopBar:
├─ Date visible (smaller: text-xs)
├─ Breaking news hidden
└─ Social icons in row (4 icons: f 🔗 𝕏 ▶️)

Navbar:
├─ Logo with icon (compact layout)
├─ Navigation hidden (hamburger menu)
├─ Search visible
├─ Dark mode toggle visible
└─ Hamburger menu visible
```

### Tablet (768px - 1023px)
```
TopBar:
├─ Date visible (text-sm)
├─ Breaking news partially visible (truncated)
└─ Social icons all visible

Navbar:
├─ Logo with both name and subtitle
├─ Some nav items visible (selected)
├─ Mobile menu for hidden items
├─ Search visible
├─ Dark mode toggle visible
└─ Hamburger menu visible (less used)
```

### Desktop (>=1024px)
```
TopBar:
├─ Date left (text-sm)
├─ Breaking news center (full text)
└─ Social icons right (all 4)

Navbar:
├─ Logo left with full text
├─ Full navigation menu center (8 items)
├─ Search right
├─ Dark mode toggle right
└─ Hamburger menu hidden (lg:hidden)
```

---

## Animation Timeline

### Page Load
```
0ms:   TopBar fades in
100ms: Navbar slides down
200ms: Nav items stagger in
300ms: Icons appear
Complete: 400ms total
```

### Mobile Menu Open
```
0ms:   Hamburger icon rotates (⇄ to ✕)
150ms: Menu slides down
250ms: Items stagger in
Duration: 300ms
```

### Dark Mode Toggle
```
0ms:   Icon changes instantly (🌙 ⇄ ☀️)
100ms: Background fades to new color
150ms: Text color transitions
200ms: Borders update
Complete: 300ms total
```

---

## Accessibility Features

### Keyboard Navigation
```
Tab: Cycle through interactive elements
│  ├─ Social links
│  ├─ Search button
│  ├─ Dark mode button
│  ├─ Navigation items
│  └─ Mobile menu items
│
Shift+Tab: Reverse cycle
Space/Enter: Activate focused element
Escape: Close mobile menu
```

### Screen Reader Support
```
aria-label on all icons:
├─ "Facebook"
├─ "Instagram"
├─ "Twitter"
├─ "YouTube"
├─ "Search"
├─ "Toggle dark mode"
└─ "Toggle menu"

Semantic HTML:
├─ <header>
├─ <nav>
├─ <button>
└─ <a>
```

---

## Print Styles

```
@media print {
  ├─ Header: Hidden or minimal
  ├─ Navigation: Hidden
  ├─ Dark mode: Reverts to light
  ├─ Colors: Simplified for printing
  └─ Spacing: Optimized for paper
}
```

---

## Performance Metrics

```
Lighthouse Score Target: 90+

┌─ Performance: 95+
│  ├─ First Contentful Paint: < 1s
│  ├─ Largest Contentful Paint: < 1.5s
│  └─ Cumulative Layout Shift: < 0.1
│
├─ Accessibility: 90+
│  ├─ Color contrast
│  ├─ Keyboard navigation
│  ├─ ARIA labels
│  └─ Semantic HTML
│
├─ Best Practices: 95+
│  ├─ No console errors
│  ├─ HTTPS ready
│  └─ Modern JavaScript
│
└─ SEO: 100
   ├─ Mobile friendly
   ├─ Meta tags
   └─ Structured data
```

---

This visual guide should help you understand the layout and styling of the YatriPati header component!

For more details, refer to STYLING_GUIDE.md.
