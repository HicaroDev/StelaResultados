---
name: Enterprise Chic
colors:
  surface: '#fff7fa'
  surface-dim: '#e1d8dc'
  surface-bright: '#fff7fa'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#fbf1f5'
  surface-container: '#f5ebf0'
  surface-container-high: '#efe6ea'
  surface-container-highest: '#e9e0e4'
  on-surface: '#1e1a1d'
  on-surface-variant: '#4a454c'
  inverse-surface: '#342f32'
  inverse-on-surface: '#f8eef2'
  outline: '#7b757c'
  outline-variant: '#cbc4cc'
  surface-tint: '#665a6f'
  primary: '#63576d'
  on-primary: '#ffffff'
  primary-container: '#7c7086'
  on-primary-container: '#fffbff'
  inverse-primary: '#d0c1da'
  secondary: '#665b61'
  on-secondary: '#ffffff'
  secondary-container: '#eedee6'
  on-secondary-container: '#6c6167'
  tertiary: '#5b5c5e'
  on-tertiary: '#ffffff'
  tertiary-container: '#747476'
  on-tertiary-container: '#fdfcfe'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#edddf7'
  primary-fixed-dim: '#d0c1da'
  on-primary-fixed: '#21182a'
  on-primary-fixed-variant: '#4d4357'
  secondary-fixed: '#eedee6'
  secondary-fixed-dim: '#d1c3ca'
  on-secondary-fixed: '#21191e'
  on-secondary-fixed-variant: '#4e444a'
  tertiary-fixed: '#e3e2e4'
  tertiary-fixed-dim: '#c6c6c8'
  on-tertiary-fixed: '#1a1c1d'
  on-tertiary-fixed-variant: '#464749'
  background: '#fff7fa'
  on-background: '#1e1a1d'
  surface-variant: '#e9e0e4'
typography:
  headline-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 32px
    fontWeight: '600'
    lineHeight: '1.2'
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.3'
    letterSpacing: -0.01em
  body-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
    letterSpacing: '0'
  body-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 14px
    fontWeight: '400'
    lineHeight: '1.5'
    letterSpacing: '0'
  label-caps:
    fontFamily: Plus Jakarta Sans
    fontSize: 12px
    fontWeight: '700'
    lineHeight: '1.2'
    letterSpacing: 0.08em
  label-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 12px
    fontWeight: '500'
    lineHeight: '1.2'
    letterSpacing: '0'
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit: 4px
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 40px
  xxl: 64px
  gutter: 24px
  margin: 32px
---

## Brand & Style

This design system embodies the "Enterprise Chic" aesthetic—a strategic fusion of high-tier corporate reliability and high-fashion editorial refinement. It is designed for the modern financial professional who values clarity, precision, and a sophisticated touch.

The style is rooted in **Minimalism** with **Tonal Layering**. It prioritizes generous whitespace (negative space) to reduce cognitive load in complex financial workflows. The emotional response is one of calm authority; it feels premium and "expensive" without being aggressive. It departs from traditional cold fintech aesthetics by introducing a soft, feminine-leaning warmth through its accent palette and rounded geometry.

## Colors

The palette is built on a foundation of purity and subtle warmth. 

- **Primary (Dusty Violet):** Used for key actions, active states, and brand moments. It is sophisticated, muted, and authoritative.
- **Secondary (Soft Rose):** Used for subtle highlights, decorative accents, and secondary button backgrounds to maintain the soft feminine touch.
- **Surfaces:** A hierarchy of White (#FFFFFF) for the primary content area, a Very Light Grey (#F5F5F7) for backgrounds, and a Tinted Off-White (#FBF9FA) for sidebars.
- **Neutrals:** Typography uses a deep Charcoal (#1A1619) rather than pure black to keep the contrast high but the feel "soft."
- **Semantic:** Success (muted sage), Error (soft terracotta), and Warning (warm ochre) are desaturated to match the dusty primary tones.

## Typography

This design system utilizes **Plus Jakarta Sans** for its modern, friendly, yet professional letterforms. The rounded terminals of the typeface mirror the UI's physical shape language.

- **Headlines:** Set with tighter letter-spacing and semi-bold weights to provide a strong visual anchor.
- **Body Text:** Optimized for readability in data-heavy environments with a generous 1.6 line-height.
- **Overlines/Caps:** Used for section headers or small labels, set in Uppercase with expanded letter-spacing to evoke a luxury editorial feel.
- **Numbers/Data:** Given the financial nature of the product, use tabular lining figures to ensure alignment in tables and charts.

## Layout & Spacing

The layout philosophy follows a **Fixed-Fluid Hybrid Grid**. Sidebars and navigation are fixed-width, while the main content area utilizes a 12-column fluid grid with 24px gutters.

The spacing rhythm is built on a 4px baseline, but "Enterprise Chic" relies on **macro-spacing**. Do not be afraid of large 64px (XXL) gaps between major sections to emphasize the premium, airy nature of the platform. Information density should be kept "Medium" to "Low"—if data is dense, use white space between rows rather than heavy borders to separate information.

## Elevation & Depth

Depth is communicated through **Ambient Shadows** and **Tonal Layering**. 

1.  **Level 0 (Base):** Light grey background (#F5F5F7).
2.  **Level 1 (Cards/Containers):** Pure White (#FFFFFF) with a very soft, desaturated shadow: `0px 4px 20px rgba(139, 126, 149, 0.05)`. Note the slight violet tint in the shadow to maintain color harmony.
3.  **Level 2 (Dropdowns/Modals):** Pure White with a more pronounced, diffused shadow: `0px 12px 32px rgba(139, 126, 149, 0.12)`.

Avoid heavy inner shadows or sharp borders. Use 1px borders in a very light grey (#EAEAEA) only when elements share the same background color.

## Shapes

The shape language is defined by **soft, approachable geometry**. 

- **Primary Radius:** 12px for standard components like input fields, buttons, and small cards.
- **Large Radius:** 16px to 24px for main dashboard cards and modal containers.
- **Interactive Elements:** Buttons should feel "plump" and soft.
- **Consistency:** Maintain the same radius for both the outer container and inner elements (nested border-radius logic) to ensure a sophisticated, high-end construction.

## Components

- **Buttons:** Primary buttons use the Dusty Violet background with white text. Secondary buttons use the Soft Rose background with Dusty Violet text. All buttons have a 12px corner radius and high vertical padding (12px-16px).
- **Input Fields:** Use a subtle grey background (#F8F7F9) with no border in the default state. Upon focus, transition to a white background with a 1px Dusty Violet border and a soft glow.
- **Cards:** The hallmark of the system. Large 16px-24px rounded corners, pure white surfaces, and the tinted ambient shadow defined in the Elevation section.
- **Chips/Tags:** Used for financial categories. Pill-shaped with a desaturated version of the category color and 50% opacity backgrounds for a "tinted glass" look without the blur.
- **Data Tables:** Remove all vertical lines. Use horizontal dividers in a very faint grey. The header row should be in the `label-caps` typography style.
- **Charts:** Use a refined palette of the primary violet, soft rose, and a muted teal. Lines should be slightly thickened (2px+) with rounded caps for a softer visual profile.